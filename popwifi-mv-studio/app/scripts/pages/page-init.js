import { api } from '../core/api.js';
import { setConfig, setQueue, setRenderDraft } from '../core/state.js';
import { loadPresetList } from '../presets/preset-loader.js';
import { bindPresetActions, bindPresetPanelActions } from '../presets/preset-actions.js';
import { renderDraftPanel } from '../render/render-draft-panel.js';
import { hydrateRenderResults } from '../project/render-results.js';
import { hydrateLyricsPage } from './lyrics.js';
import { hydrateLandingPage } from './landing.js';
import { renderQueueCards } from './queue.js';

export async function hydratePage(pageName) {
  if (pageName === 'queue') await hydrateQueuePage();
  if (pageName === 'longform') await hydrateLongformPage();
  if (pageName === 'shorts') await hydrateShortsPage();
  if (pageName === 'settings') await hydrateSettingsPage();
  if (pageName === 'project') await hydrateProjectPage();
  if (pageName === 'lyrics') hydrateLyricsPage();
  if (pageName === 'landing') await hydrateLandingPage();
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

  try {
    const draft = await api.renderDraft();
    const src = draft.source || {};
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('source-title', src.title);
    set('source-artist', src.artist);
    set('source-music', src.musicFile);
    set('source-cover', src.coverImage);
    set('source-lyrics', src.lyricsFile);
    renderSourcePreview(src);
  } catch (_) {}

  const saveBtn = document.getElementById('source-save-btn');
  const saveResult = document.getElementById('source-save-result');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const get = (id) => (document.getElementById(id) || {}).value || '';
      const source = {
        title: get('source-title'),
        artist: get('source-artist'),
        musicFile: get('source-music'),
        coverImage: get('source-cover'),
        lyricsFile: get('source-lyrics')
      };
      try {
        saveBtn.disabled = true;
        if (saveResult) saveResult.textContent = '저장 중...';
        await api.saveRenderDraftSource(source);
        renderSourcePreview(source);
        if (saveResult) saveResult.textContent = '저장 완료';
      } catch (error) {
        if (saveResult) saveResult.textContent = '저장 실패: ' + (error.message || '오류');
      } finally {
        saveBtn.disabled = false;
      }
    });
  }
}

function renderSourcePreview(src) {
  const el = document.getElementById('source-preview');
  if (!el) return;
  const items = [
    { label: '곡 제목', value: src.title },
    { label: '아티스트', value: src.artist },
    { label: '음원', value: src.musicFile },
    { label: '커버', value: src.coverImage },
    { label: '가사 파일', value: src.lyricsFile }
  ].filter((i) => i.value);

  if (!items.length) {
    el.innerHTML = '';
    const p = document.createElement('p');
    p.className = 'queue-empty';
    p.textContent = '저장된 소스 없음';
    el.appendChild(p);
    return;
  }

  el.innerHTML = '';
  items.forEach(({ label, value }) => {
    const row = document.createElement('div');
    row.className = 'source-preview-row';
    const lEl = document.createElement('span');
    lEl.className = 'source-preview-label';
    lEl.textContent = label;
    const vEl = document.createElement('span');
    vEl.className = 'source-preview-value';
    vEl.textContent = value;
    row.appendChild(lEl);
    row.appendChild(vEl);
    el.appendChild(row);
  });
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
    renderQueueCards(queue);
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

  const saveBtn = document.getElementById('settings-save-btn');
  const saveResult = document.getElementById('settings-save-result');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const updates = {};
      document.querySelectorAll('[data-config-key]').forEach((input) => {
        updates[input.dataset.configKey] = input.value;
      });
      try {
        saveBtn.disabled = true;
        await api.saveConfig(updates);
        if (saveResult) saveResult.textContent = '저장 완료';
      } catch (error) {
        if (saveResult) saveResult.textContent = '저장 실패: ' + (error.message || '오류');
      } finally {
        saveBtn.disabled = false;
      }
    });
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
