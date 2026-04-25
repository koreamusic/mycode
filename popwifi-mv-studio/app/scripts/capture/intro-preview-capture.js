import { api } from '../core/api.js';
import { renderSelectedPresetPreview } from '../presets/preset-preview.js';

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function findJobById(queue, jobId) {
  if (!queue || !jobId) return null;
  if (queue.currentJob && queue.currentJob.id === jobId) return queue.currentJob;
  const groups = [queue.pending, queue.completed, queue.failed].filter(Array.isArray);
  for (const group of groups) {
    const found = group.find((job) => job && job.id === jobId);
    if (found) return found;
  }
  return null;
}

function setCaptureError(message) {
  const target = document.getElementById('capturePreview');
  if (target) target.textContent = message;
}

async function main() {
  const jobId = getQueryParam('jobId');
  if (!jobId) {
    setCaptureError('jobId가 필요합니다.');
    return;
  }

  try {
    const queue = await api.queue();
    const job = findJobById(queue, jobId);
    if (!job || !job.preset) {
      setCaptureError('캡처할 job 또는 preset을 찾지 못했습니다.');
      return;
    }

    const target = document.getElementById('capturePreview');
    if (target) {
      target.id = job.kind === 'shorts' ? 'shortsPreview' : 'longformPreview';
      target.classList.toggle('vertical', job.kind === 'shorts');
      target.classList.toggle('wide', job.kind !== 'shorts');
    }

    renderSelectedPresetPreview(job.kind || 'longform', job.preset);
  } catch (error) {
    setCaptureError('캡처 프리뷰를 불러오지 못했습니다.');
  }
}

main();
