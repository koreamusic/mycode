import { api } from '../core/api.js';
import { loadPresetList } from './preset-loader.js';

export function bindPresetActions(options) {
  const ratio = options.ratio;
  const kind = options.kind;
  const targetId = options.targetId;

  const target = document.getElementById(targetId);
  if (!target) return;

  target.onclick = async (event) => {
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;

    const action = actionEl.dataset.action;
    const presetId = actionEl.dataset.presetId;
    const batchId = actionEl.dataset.batchId;

    if (action === 'select-batch') {
      await loadPresetList({ ratio, kind, targetId, batchId });
      bindPresetActions({ ratio, kind, targetId });
      return;
    }

    if (action === 'select-preset') {
      markSelectedPreset(target, batchId, presetId);
      return;
    }

    if (action === 'deactivate-preset') {
      await api.deactivatePreset(ratio, batchId, presetId);
      await loadPresetList({ ratio, kind, targetId, batchId });
      bindPresetActions({ ratio, kind, targetId });
    }
  };
}

function markSelectedPreset(target, batchId, presetId) {
  target.querySelectorAll('.preset-row').forEach((row) => {
    const samePreset = row.dataset.presetId === presetId && row.dataset.batchId === batchId;
    row.classList.toggle('selected', samePreset);
  });
}
