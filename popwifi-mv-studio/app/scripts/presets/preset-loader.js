import { api } from '../core/api.js';
import { setPresets } from '../core/state.js';

export async function loadPresetList(options) {
  const ratio = options.ratio;
  const kind = options.kind;
  const targetId = options.targetId;
  const target = document.getElementById(targetId);

  if (!target) return [];

  try {
    const presets = await api.presets(ratio);
    setPresets(kind, presets);
    renderPresetList(target, presets, ratio);
    return presets;
  } catch (error) {
    target.innerHTML = '<div class="empty-state">프리셋 목록을 불러오지 못했습니다.</div>';
    return [];
  }
}

function renderPresetList(target, presets, ratio) {
  if (!presets.length) {
    target.innerHTML = '<div class="empty-state">등록된 프리셋이 없습니다. 다음 단계에서 업로드/생성 기능을 연결합니다.</div>';
    return;
  }

  target.innerHTML = presets.map((preset) => {
    const tags = Array.isArray(preset.tags) ? preset.tags.join(', ') : 'no tags';
    return [
      '<div class="preset-row" data-preset-id="' + preset.id + '">',
      '  <button class="preset-item" data-action="select-preset" data-ratio="' + ratio + '" data-preset-id="' + preset.id + '">',
      '    <strong>' + (preset.name || preset.id) + '</strong>',
      '    <span>' + (preset.ratio || ratio) + ' · ' + tags + '</span>',
      '  </button>',
      '  <button class="mini-danger" data-action="deactivate-preset" data-ratio="' + ratio + '" data-preset-id="' + preset.id + '">비활성</button>',
      '</div>'
    ].join('');
  }).join('');
}
