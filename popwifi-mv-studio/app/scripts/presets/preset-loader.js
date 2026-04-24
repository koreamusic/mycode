import { api } from '../core/api.js';
import { setPresets } from '../core/state.js';

export async function loadPresetList(options) {
  const ratio = options.ratio;
  const kind = options.kind;
  const targetId = options.targetId;
  const target = document.getElementById(targetId);

  if (!target) return [];

  try {
    const batches = await api.presetBatches(ratio);
    if (!batches.length) {
      target.innerHTML = '<div class="empty-state">등록된 프리셋 배치가 없습니다. 다음 단계에서 10개 단위 배치를 추가합니다.</div>';
      setPresets(kind, []);
      return [];
    }

    const activeBatchId = options.batchId || batches[0].id;
    const presets = await api.presetBatch(ratio, activeBatchId);
    setPresets(kind, presets);
    renderPresetBatches(target, batches, activeBatchId, ratio);
    renderPresetList(target, presets, ratio, activeBatchId);
    return presets;
  } catch (error) {
    target.innerHTML = '<div class="empty-state">프리셋 목록을 불러오지 못했습니다.</div>';
    return [];
  }
}

function renderPresetBatches(target, batches, activeBatchId, ratio) {
  const batchHtml = batches.map((batch) => {
    const active = batch.id === activeBatchId ? ' active' : '';
    return '<button class="batch-chip' + active + '" data-action="select-batch" data-ratio="' + ratio + '" data-batch-id="' + batch.id + '">' + batch.id.replace('batch-', '') + ' · ' + batch.count + '</button>';
  }).join('');

  target.innerHTML = '<div class="batch-row">' + batchHtml + '</div><div class="preset-list-inner"></div>';
}

function renderPresetList(target, presets, ratio, batchId) {
  const listTarget = target.querySelector('.preset-list-inner') || target;

  if (!presets.length) {
    listTarget.innerHTML = '<div class="empty-state">이 배치에는 활성 프리셋이 없습니다.</div>';
    return;
  }

  listTarget.innerHTML = presets.map((preset) => {
    const tags = Array.isArray(preset.tags) ? preset.tags.join(', ') : 'no tags';
    return [
      '<div class="preset-row" data-preset-id="' + preset.id + '" data-batch-id="' + batchId + '">',
      '  <button class="preset-item" data-action="select-preset" data-ratio="' + ratio + '" data-batch-id="' + batchId + '" data-preset-id="' + preset.id + '">',
      '    <strong>' + (preset.name || preset.id) + '</strong>',
      '    <span>' + (preset.ratio || ratio) + ' · ' + batchId + ' · ' + tags + '</span>',
      '  </button>',
      '  <button class="mini-danger" data-action="deactivate-preset" data-ratio="' + ratio + '" data-batch-id="' + batchId + '" data-preset-id="' + preset.id + '">비활성</button>',
      '</div>'
    ].join('');
  }).join('');
}
