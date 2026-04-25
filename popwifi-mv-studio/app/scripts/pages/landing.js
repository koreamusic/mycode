import { api } from '../core/api.js';
import { setQueue } from '../core/state.js';

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function toPublicPath(file) {
  if (!file) return '';
  return file.startsWith('output/') ? '/' + file : file;
}

function setStatus(text) {
  const el = document.getElementById('landingStatusMsg');
  if (el) el.textContent = text;
}

function renderDraftStatus(draft) {
  const el = document.getElementById('landingDraftStatus');
  if (!el) return;

  const longform = draft && draft.selected && draft.selected.longform;
  const shorts = draft && draft.selected && draft.selected.shorts;

  if (!longform && !shorts) {
    el.innerHTML = '<p class="queue-empty">롱폼/숏츠 페이지에서 프리셋을 먼저 선택하세요.</p>';
    return;
  }

  const rows = [];
  if (longform) rows.push('<div class="render-result-item"><strong>롱폼 16:9</strong><code>' + escapeHtml(longform.title || longform.presetId || '') + '</code></div>');
  if (shorts) rows.push('<div class="render-result-item"><strong>숏츠 9:16</strong><code>' + escapeHtml(shorts.title || shorts.presetId || '') + '</code></div>');
  el.innerHTML = rows.join('');
}

function renderTestResult(result) {
  const card = document.getElementById('landingPreviewContent');
  if (!card) return;

  const job = result && result.job;
  const output = job && job.result && (job.result.primaryFile || job.result.manifestFile);
  const publicUrl = toPublicPath(output);

  if (!output) {
    card.innerHTML = '<p>렌더 완료됐지만 출력 파일을 찾을 수 없습니다.</p>';
    return;
  }

  const isVideo = output.endsWith('.mp4');
  if (isVideo && publicUrl) {
    card.innerHTML = [
      '<video controls style="max-width:100%;max-height:100%;border-radius:6px;" src="' + escapeHtml(publicUrl) + '">',
      '  브라우저가 video 태그를 지원하지 않습니다.',
      '</video>',
      '<div style="margin-top:0.5rem;font-size:0.75rem;opacity:0.6;">',
      '  <code>' + escapeHtml(output) + '</code>',
      '</div>'
    ].join('');
  } else {
    card.innerHTML = [
      '<div class="render-result-item">',
      '  <strong>렌더 완료</strong>',
      '  <code>' + escapeHtml(output) + '</code>',
      '  <div class="render-result-actions">',
      '    <button class="control-btn subtle" data-action="copy-path" data-path="' + escapeHtml(output) + '">경로 복사</button>',
      '  </div>',
      '</div>'
    ].join('');
  }
}

export async function hydrateLandingPage() {
  let selectedKind = 'longform';
  let selectedDuration = 30;

  try {
    const draft = await api.renderDraft();
    renderDraftStatus(draft);
  } catch (error) {
    const el = document.getElementById('landingDraftStatus');
    if (el) el.innerHTML = '<p class="queue-empty">드래프트 정보를 불러오지 못했습니다.</p>';
  }

  // 종류 선택
  document.querySelectorAll('[data-landing-kind]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedKind = btn.dataset.landingKind;
      document.querySelectorAll('[data-landing-kind]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 시간 선택
  document.querySelectorAll('[data-landing-duration]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedDuration = Number(btn.dataset.landingDuration);
      document.querySelectorAll('[data-landing-duration]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 현재 설정 확인
  const checkBtn = document.getElementById('landingCheckBtn');
  if (checkBtn) {
    checkBtn.addEventListener('click', async () => {
      try {
        const draft = await api.renderDraft();
        renderDraftStatus(draft);
        setStatus('설정 확인 완료');
      } catch (error) {
        setStatus('설정을 불러오지 못했습니다.');
      }
    });
  }

  // 테스트 렌더 실행
  const runBtn = document.getElementById('landingRunBtn');
  if (runBtn) {
    runBtn.addEventListener('click', async () => {
      runBtn.disabled = true;
      setStatus(selectedKind === 'longform' ? '롱폼 ' : '숏츠 ' + selectedDuration + '초 렌더 시작 중...');

      try {
        const queued = await api.createQueueJobFromRenderDraft(selectedKind);
        if (queued && queued.queue) setQueue(queued.queue);
        setStatus('큐 등록 완료 · 렌더 시작...');

        const started = await api.startNextQueueJob();
        if (started && started.queue) setQueue(started.queue);

        setStatus('렌더 진행 중... (' + selectedDuration + '초)');
        const rendered = await api.processCurrentQueueCaptureMp4({ fps: 6, durationSeconds: selectedDuration });
        if (rendered && rendered.queue) setQueue(rendered.queue);

        setStatus('렌더 완료');
        renderTestResult(rendered);
      } catch (error) {
        setStatus('렌더 실패: ' + (error.message || '오류 발생'));
      } finally {
        runBtn.disabled = false;
      }
    });
  }

  // 경로 복사 버튼
  const previewCard = document.getElementById('landingPreviewContent');
  if (previewCard) {
    previewCard.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('[data-action="copy-path"]');
      if (copyBtn && navigator.clipboard) {
        navigator.clipboard.writeText(copyBtn.dataset.path || '');
        copyBtn.textContent = '복사됨';
        setTimeout(() => (copyBtn.textContent = '경로 복사'), 1000);
      }
    });
  }
}
