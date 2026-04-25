import { api } from '../core/api.js';
import { setQueue } from '../core/state.js';
import { renderDraftPanel } from './render-draft-panel.js';

let selectedFps = 6;

export function bindRenderDraftActions(root = document) {
  root.addEventListener('click', async (event) => {
    const fpsBtn = event.target.closest('[data-fps]');
    if (fpsBtn) {
      selectedFps = Number(fpsBtn.dataset.fps || 6);
      root.querySelectorAll('[data-fps]').forEach(b => b.classList.remove('active'));
      fpsBtn.classList.add('active');
      return;
    }

    const queueButton = event.target.closest('[data-action="queue-render-draft"]');
    const renderButton = event.target.closest('[data-action="run-capture-render"]');

    if (queueButton) {
      await handleQueueRenderDraft(queueButton);
      return;
    }

    if (renderButton) {
      await handleRunCaptureRender(renderButton);
    }

    const copyOutput = event.target.closest('[data-action="copy-render-output"]');
    if (copyOutput) {
      const path = copyOutput.dataset.output;
      if (navigator.clipboard && path) navigator.clipboard.writeText(path);
      copyOutput.textContent = '복사됨';
      setTimeout(() => (copyOutput.textContent = '경로 복사'), 1000);
    }
  });
}

async function handleQueueRenderDraft(button) {
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
    appendPanelMessage(button, '큐 추가에 실패했습니다.');
  }
}

async function handleRunCaptureRender(button) {
  const kind = button.dataset.kind;
  if (!kind) return;

  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = '렌더 중...';

  try {
    const queued = await api.createQueueJobFromRenderDraft(kind);
    if (queued && queued.queue) setQueue(queued.queue);

    const started = await api.startNextQueueJob();
    if (started && started.queue) setQueue(started.queue);

    const rendered = await api.processCurrentQueueCaptureMp4({ fps: selectedFps });
    if (rendered && rendered.queue) setQueue(rendered.queue);

    const draft = await api.renderDraft();
    renderDraftPanel(kind, draft, { statusText: '렌더 완료', result: rendered });
  } catch (error) {
    button.disabled = false;
    button.textContent = originalText || '렌더 실행';
    appendPanelMessage(button, '렌더 실행에 실패했습니다.');
  }
}

function appendPanelMessage(button, text) {
  const panel = button.closest('.render-draft-panel');
  if (panel) {
    const message = document.createElement('small');
    message.textContent = text;
    panel.appendChild(message);
  }
}
