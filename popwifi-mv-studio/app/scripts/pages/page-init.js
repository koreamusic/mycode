import { api } from '../core/api.js';
import { setConfig, setQueue } from '../core/state.js';
import { loadPresetList } from '../presets/preset-loader.js';
import { bindPresetActions } from '../presets/preset-actions.js';

export async function hydratePage(pageName) {
  if (pageName === 'queue') await hydrateQueuePage();
  if (pageName === 'longform') await hydrateLongformPage();
  if (pageName === 'shorts') await hydrateShortsPage();
  if (pageName === 'settings') await hydrateSettingsPage();
}

async function hydrateLongformPage() {
  await loadPresetList({ ratio: '16x9', kind: 'longform', targetId: 'longformPresetList' });
  bindPresetActions({ ratio: '16x9', kind: 'longform', targetId: 'longformPresetList' });
}

async function hydrateShortsPage() {
  await loadPresetList({ ratio: '9x16', kind: 'shorts', targetId: 'shortsPresetList' });
  bindPresetActions({ ratio: '9x16', kind: 'shorts', targetId: 'shortsPresetList' });
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
