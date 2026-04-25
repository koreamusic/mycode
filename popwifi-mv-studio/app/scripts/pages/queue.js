export function renderQueueCards(queue) {
  if (!queue) return;
  renderCurrent(queue.currentJob);
  renderList('queue-pending', queue.pending || [], renderPendingItem);
  renderList('queue-completed', queue.completed || [], renderCompletedItem);
  renderList('queue-failed', queue.failed || [], renderFailedItem);
}

function renderList(containerId, items, renderFn) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!items.length) {
    el.innerHTML = '';
    const p = document.createElement('p');
    p.className = 'queue-empty';
    p.textContent = emptyLabel(containerId);
    el.appendChild(p);
    return;
  }
  el.innerHTML = '';
  items.forEach((item) => el.appendChild(renderFn(item)));
}

function emptyLabel(id) {
  if (id === 'queue-pending') return '대기 중인 작업 없음';
  if (id === 'queue-completed') return '완료된 작업 없음';
  if (id === 'queue-failed') return '실패한 작업 없음';
  return '없음';
}

function renderCurrent(job) {
  const el = document.getElementById('queue-current');
  if (!el) return;
  el.innerHTML = '';
  if (!job) {
    const p = document.createElement('p');
    p.className = 'queue-empty';
    p.textContent = '실행 중인 작업 없음';
    el.appendChild(p);
    return;
  }
  el.appendChild(buildJobCard(job, 'running'));
}

function renderPendingItem(job) { return buildJobCard(job, 'pending'); }
function renderCompletedItem(job) { return buildJobCard(job, 'completed'); }
function renderFailedItem(job) { return buildJobCard(job, 'failed'); }

function buildJobCard(job, status) {
  const card = document.createElement('div');
  card.className = 'queue-job-card queue-job-' + status;

  const title = document.createElement('div');
  title.className = 'queue-job-title';
  const kindLabel = job.kind === 'longform' ? '롱폼' : job.kind === 'shorts' ? '숏츠' : (job.kind || '-');
  const presetName = job.preset?.title || job.preset?.presetId || '-';
  title.textContent = kindLabel + ' · ' + presetName;

  const meta = document.createElement('div');
  meta.className = 'queue-job-meta';
  const timeStr = relativeTime(job.startedAt || job.createdAt);
  const statusLabel = { running: '실행 중', pending: '대기', completed: '완료', failed: '실패' }[status] || status;
  meta.textContent = statusLabel + ' · ' + timeStr;

  const idEl = document.createElement('div');
  idEl.className = 'queue-job-id';
  idEl.textContent = job.id || '';

  card.appendChild(title);
  card.appendChild(meta);

  if (status === 'running' && job.id) {
    const bar = document.createElement('div');
    bar.className = 'queue-job-progress';
    const inner = document.createElement('div');
    inner.className = 'queue-job-progress-inner';
    bar.appendChild(inner);
    card.appendChild(bar);
  }

  if (status === 'completed' && job.result?.outputPath) {
    const out = document.createElement('div');
    out.className = 'queue-job-output';
    out.textContent = '출력: ' + job.result.outputPath;
    card.appendChild(out);
  }

  if (status === 'failed' && job.error) {
    const err = document.createElement('div');
    err.className = 'queue-job-error';
    err.textContent = job.error.message || JSON.stringify(job.error);
    card.appendChild(err);
  }

  card.appendChild(idEl);
  return card;
}

function relativeTime(iso) {
  if (!iso) return '-';
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return diff + '초 전';
  if (diff < 3600) return Math.floor(diff / 60) + '분 전';
  if (diff < 86400) return Math.floor(diff / 3600) + '시간 전';
  return Math.floor(diff / 86400) + '일 전';
}
