import { api } from '../core/api.js';
import { setQueue } from '../core/state.js';
import { renderDraftPanel } from './render-draft-panel.js';

export function bindRenderDraftActions(root = document) {
  root.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-action="queue-render-draft"]');
    if (!button) return;

    const kind = button.dataset.kind;
    if (!kind) return;

    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = '추가 중...';

    try {
      const result = await api.createQueueJobFromRenderDraft(kind);
      if (result && result.queue) setQueue(result.queue);
      const draft = await api.renderDraft();
      renderDraftPanel(kind, draft, { statusText: '큐에 추가됨' });
    } catch (error) {
      button.disabled = false;
      button.textContent = originalText || '큐에 추가';
      const panel = button.closest('.render-draft-panel');
      if (panel) {
        const message = document.createElement('small');
        message.textContent = '큐 추가에 실패했습니다.';
        panel.appendChild(message);
      }
    }
  });
}
