import { api } from '../core/api.js';
import { setConfig, setQueue, setRenderDraft } from '../core/state.js';
import { loadPresetList } from '../presets/preset-loader.js';
import { bindPresetActions, bindPresetPanelActions } from '../presets/preset-actions.js';
import { renderDraftPanel } from '../render/render-draft-panel.js';
import { hydrateRenderResults } from '../project/render-results.js';
import { hydrateLyricsPage } from './lyrics.js';

export async function hydratePage(pageName) {
  if (pageName === 'queue') await hydrateQueuePage();
  if (pageName === 'longform') await hydrateLongformPage();
  if (pageName === 'shorts') await hydrateShortsPage();
  if (pageName === 'settings') await hydrateSettingsPage();
  if (pageName === 'project') await hydrateProjectPage();
  if (pageName === 'lyrics') hydrateLyricsPage();
}

async function hydrateLongformPage() {
  await loadPresetList({ ratio: '16x9', kind: 'longform', targetId: 'longformPresetList' });
  bindPresetActions({ ratio: '16x9', kind: 'longform', targetId: 'longformPresetList' });
  bindPresetPanelActions({ ratio: '16x9', kind: 'longform', targetId: 'longformPresetList' });
  await hydrateRenderDraftPanel('longform');
}

async function hydrateShortsPage() {
  await loadPresetList({ ratio: '9x16', kind: 'shorts', targetId: 'shortsPresetList' });
  bindPresetActions({ ratio: '9x16', kind: 'shorts', targetId: 'shortsPresetList' });
  bindPresetPanelActions({ ratio: '9x16', kind: 'shorts', targetId: 'shortsPresetList' });
  await hydrateRenderDraftPanel('shorts');
}

async function hydrateProjectPage() {
  await hydrateRenderResults();
}

async function hydrateRenderDraftPanel(kind) {
  try {
    const draft = await api.renderDraft();
    setRenderDraft(draft);
    renderDraftPanel(kind, draft);
  } catch (error) {
    renderDraftPanel(kind, null);
  }
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

  const importBtn = document.getElementById('preset-import-btn');
  const importFile = document.getElementById('preset-import-file');
  const importResult = document.getElementById('preset-import-result');

  if (importBtn && importFile) {
    importBtn.addEventListener('click', async () => {
      const file = importFile.files[0];
      if (!file) {
        if (importResult) importResult.textContent = 'JSON 파일을 먼저 선택하세요.';
        return;
      }
      try {
        const text = await file.text();
        const payload = JSON.parse(text);
        importBtn.disabled = true;
        if (importResult) importResult.textContent = '가져오는 중...';
        const result = await api.importPresetBatch(payload);
        if (importResult) {
          const s = result.summary || result;
          importResult.textContent = '완료: 생성 ' + (s.created || 0) + ' · 건너뜀 ' + (s.skipped || 0) + ' · 실패 ' + (s.failed || 0);
        }
      } catch (error) {
        if (importResult) importResult.textContent = '오류: ' + (error.message || '파일을 확인하세요.');
      } finally {
        importBtn.disabled = false;
      }
    });
  }
}
