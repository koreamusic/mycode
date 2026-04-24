import { api } from '../core/api.js';
import { loadPresetList } from './preset-loader.js';

export function bindPresetActions(options) {
  const ratio = options.ratio;
  const kind = options.kind;
  const targetId = options.targetId;

  const target = document.getElementById(targetId);
  if (!target) return;

  target.addEventListener('click', async (event) => {
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;

    const action = actionEl.dataset.action;
    const presetId = actionEl.dataset.presetId;

    if (action === 'select-preset') {
      markSelectedPreset(target, presetId);
      return;
    }

    if (action === 'deactivate-preset') {
      await api.deactivatePreset(ratio, presetId);
      await loadPresetList({ ratio, kind, targetId });
    }
  });
}

function markSelectedPreset(target, presetId) {
  target.querySelectorAll('.preset-row').forEach((row) => {
    row.classList.toggle('selected', row.dataset.presetId === presetId);
  });
}
