import { api } from '../core/api.js';

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function toPublicPath(file) {
  if (!file) return '';
  if (file.startsWith('output/')) return '/' + file;
  return file;
}

function renderList(items) {
  if (!items.length) return '아직 렌더 결과가 없습니다.';

  return items.map((job) => {
    const title = job?.preset?.title || job.id;
    const file = job?.result?.primaryFile || '';
    const publicUrl = toPublicPath(file);

    return [
      '<div class="render-result-item">',
      '  <strong>' + escapeHtml(title) + '</strong>',
      '  <code>' + escapeHtml(file) + '</code>',
      '  <div class="render-result-actions">',
      '    <button class="control-btn subtle" data-action="open-video" data-url="' + escapeHtml(publicUrl) + '">열기</button>',
      '    <button class="control-btn subtle" data-action="copy-path" data-path="' + escapeHtml(file) + '">복사</button>',
      '  </div>',
      '</div>'
    ].join('');
  }).join('');
}

export async function hydrateRenderResults() {
  const el = document.getElementById('recentRenderResults');
  if (!el) return;

  try {
    const queue = await api.queue();
    const completed = Array.isArray(queue.completed) ? queue.completed.slice(0, 5) : [];
    el.innerHTML = renderList(completed);
    bindResultActions(el);
  } catch (error) {
    el.textContent = '렌더 결과를 불러오지 못했습니다.';
  }
}

function bindResultActions(root) {
  root.onclick = (e) => {
    const copyBtn = e.target.closest('[data-action="copy-path"]');
    const openBtn = e.target.closest('[data-action="open-video"]');

    if (copyBtn) {
      const path = copyBtn.dataset.path || '';
      if (navigator.clipboard && path) navigator.clipboard.writeText(path);
      copyBtn.textContent = '복사됨';
      setTimeout(() => {
        copyBtn.textContent = '복사';
      }, 1000);
    }

    if (openBtn) {
      const url = openBtn.dataset.url || '';
      if (url) window.open(url, '_blank');
    }
  };
}
