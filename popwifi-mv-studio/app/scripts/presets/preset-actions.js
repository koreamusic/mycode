import { api } from '../core/api.js';
import { getPresetById, setRenderDraft, setSelectedPreset } from '../core/state.js';
import { renderDraftPanel } from '../render/render-draft-panel.js';
import { loadPresetList } from './preset-loader.js';
import { renderSelectedPresetPreview } from './preset-preview.js';

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
      await reloadPresetTarget({ ratio, kind, targetId, batchId });
      return;
    }

    if (action === 'select-preset') {
      markSelectedPreset(target, batchId, presetId);
      const preset = getPresetById(kind, batchId, presetId);
      if (preset) {
        setSelectedPreset(kind, preset);
        renderSelectedPresetPreview(kind, preset);
        await saveSelectedPresetForRender(kind, ratio, batchId, preset);
      }
      return;
    }

    if (action === 'deactivate-preset') {
      await api.deactivatePreset(ratio, batchId, presetId);
      await reloadPresetTarget({ ratio, kind, targetId, batchId });
    }
  };
}

export function bindPresetPanelActions(options) {
  const ratio = options.ratio;
  const kind = options.kind;
  const targetId = options.targetId;
  const root = options.root || document;

  root.querySelectorAll('[data-action="create-preset-batch"][data-ratio="' + ratio + '"]').forEach((button) => {
    button.onclick = async () => {
      const result = await api.createNextPresetBatch(ratio);
      await reloadPresetTarget({ ratio, kind, targetId, batchId: result.batch.id });
    };
  });

  root.querySelectorAll('[data-action="refresh-presets"][data-ratio="' + ratio + '"]').forEach((button) => {
    button.onclick = async () => {
      await reloadPresetTarget({ ratio, kind, targetId });
    };
  });
}

async function saveSelectedPresetForRender(kind, ratio, batchId, preset) {
  const payload = Object.assign({}, preset, {
    kind,
    ratio,
    batchId,
    presetId: preset.id
  });

  try {
    const result = await api.saveRenderDraftPreset(kind, payload);
    if (result && result.draft) {
      setRenderDraft(result.draft);
      renderDraftPanel(kind, result.draft);
    }
  } catch (error) {
    // keep preview usable even when draft save fails
  }
}

async function reloadPresetTarget(options) {
  await loadPresetList(options);
  bindPresetActions(options);
}

function markSelectedPreset(target, batchId, presetId) {
  target.querySelectorAll('.preset-row').forEach((row) => {
    const samePreset = row.dataset.presetId === presetId && row.dataset.batchId === batchId;
    row.classList.toggle('selected', samePreset);
  });
}
