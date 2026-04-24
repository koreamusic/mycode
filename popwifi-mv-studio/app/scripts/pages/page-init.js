import { api } from '../core/api.js';
import { setConfig, setPresets, setQueue } from '../core/state.js';

export async function hydratePage(pageName) {
  if (pageName === 'queue') await hydrateQueuePage();
  if (pageName === 'longform') await hydratePresetPage('16x9', 'longformPresetList', 'longform');
  if (pageName === 'shorts') await hydratePresetPage('9x16', 'shortsPresetList', 'shorts');
  if (pageName === 'settings') await hydrateSettingsPage();
}

async function hydrateQueuePage() {
  const queueBox = document.getElementById('queueBox');
  try {
    const queue = await api.queue();
    setQueue(queue);
    if (queueBox) queueBox.textContent = JSON.stringify(queue, null, 2);
  } catch (error) {
    if (queueBox) queueBox.textContent = '큐 정보를 불러오지 못했습니다.';
  }
}

async function hydratePresetPage(ratio, targetId, kind) {
  const target = document.getElementById(targetId);
  if (!target) return;

  try {
    const presets = await api.presets(ratio);
    setPresets(kind, presets);

    if (!presets.length) {
      target.innerHTML = '<div class="empty-state">등록된 프리셋이 없습니다. 다음 단계에서 업로드/생성 기능을 연결합니다.</div>';
      return;
    }

    target.innerHTML = presets.map((preset) => {
      const tags = Array.isArray(preset.tags) ? preset.tags.join(', ') : 'no tags';
      return '<button class="preset-item" data-preset-id="' + preset.id + '"><strong>' + (preset.name || preset.id) + '</strong><span>' + (preset.ratio || ratio) + ' · ' + tags + '</span></button>';
    }).join('');
  } catch (error) {
    target.innerHTML = '<div class="empty-state">프리셋 목록을 불러오지 못했습니다.</div>';
  }
}

async function hydrateSettingsPage() {
  try {
    const config = await api.config();
    setConfig(config);
    document.querySelectorAll('[data-config-key]').forEach((input) => {
      const key = input.dataset.configKey;
      if (Object.prototype.hasOwnProperty.call(config, key)) input.value = config[key];
    });
  } catch (error) {
    // keep static settings page available
  }
}
