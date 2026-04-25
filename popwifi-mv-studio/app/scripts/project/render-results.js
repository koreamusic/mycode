import { api } from '../core/api.js';

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderList(items) {
  if (!items.length) return '아직 렌더 결과가 없습니다.';

  return items.map((job) => {
    const title = job?.preset?.title || job.id;
    const file = job?.result?.primaryFile || '';

    return [
      '<div class="render-result-item">',
      '  <strong>' + escapeHtml(title) + '</strong>',
      '  <code>' + escapeHtml(file) + '</code>',
      '  <div class="render-result-actions">',
      '    <button data-action="copy-path" data-path="' + escapeHtml(file) + '">복사</button>',
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
  } catch (error) {
    el.textContent = '렌더 결과를 불러오지 못했습니다.';
  }
}
