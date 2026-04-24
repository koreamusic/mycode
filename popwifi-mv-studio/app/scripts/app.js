const PAGE_FILES = {
  project: './pages/project.html',
  longform: './pages/longform.html',
  shorts: './pages/shorts.html',
  lyrics: './pages/lyrics.html',
  landing: './pages/landing.html',
  queue: './pages/queue.html',
  settings: './pages/settings.html',
  faq: './pages/faq.html'
};

const navButtons = document.querySelectorAll('.nav-btn');
const pageOutlet = document.getElementById('pageOutlet');
const serverStatus = document.getElementById('serverStatus');
const renderStatus = document.getElementById('renderStatus');

const appState = {
  activePage: 'project',
  queue: null,
  presets: {
    longform: [],
    shorts: []
  }
};

async function setPage(pageName) {
  appState.activePage = pageName;
  navButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.page === pageName));
  await loadPage(pageName);
  await hydratePage(pageName);
}

async function loadPage(pageName) {
  const pagePath = PAGE_FILES[pageName] || PAGE_FILES.project;
  if (!pageOutlet) return;

  pageOutlet.innerHTML = '<section class="page active"><div class="loading-card">페이지를 불러오는 중...</div></section>';

  try {
    const res = await fetch(pagePath, { cache: 'no-store' });
    if (!res.ok) throw new Error(`페이지 로드 실패: ${pagePath}`);
    pageOutlet.innerHTML = await res.text();
  } catch (err) {
    pageOutlet.innerHTML = `<section class="page active"><article class="card"><h2>페이지 로드 실패</h2><p>${err.message}</p></article></section>`;
  }
}

async function hydratePage(pageName) {
  if (pageName === 'queue') await loadQueue();
  if (pageName === 'longform') await loadPresets('16x9', 'longformPresetList');
  if (pageName === 'shorts') await loadPresets('9x16', 'shortsPresetList');
  if (pageName === 'settings') await loadConfigIntoSettings();
}

navButtons.forEach((btn) => {
  btn.addEventListener('click', () => setPage(btn.dataset.page));
});

async function checkHealth() {
  try {
    const res = await fetch('/api/health');
    const health = await res.json();
    if (serverStatus) serverStatus.textContent = health.ok ? '서버 연결됨' : '서버 확인 필요';
  } catch (err) {
    if (serverStatus) serverStatus.textContent = '서버 끊김';
  }
}

async function loadConfigIntoSettings() {
  try {
    const res = await fetch('/api/config');
    const config = await res.json();
    document.querySelectorAll('[data-config-key]').forEach((input) => {
      const key = input.dataset.configKey;
      if (Object.prototype.hasOwnProperty.call(config, key)) input.value = config[key];
    });
  } catch (err) {
    // settings page remains usable as a static scaffold
  }
}

async function loadQueue() {
  const queueBox = document.getElementById('queueBox');
  try {
    const res = await fetch('/api/queue');
    const queue = await res.json();
    appState.queue = queue;
    if (queueBox) queueBox.textContent = JSON.stringify(queue, null, 2);
  } catch (err) {
    if (queueBox) queueBox.textContent = '큐 정보를 불러오지 못했습니다.';
  }
}

async function loadPresets(ratio, targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  try {
    const res = await fetch(`/api/presets/${ratio}`);
    const presets = await res.json();
    if (ratio === '16x9') appState.presets.longform = presets;
    if (ratio === '9x16') appState.presets.shorts = presets;

    if (!presets.length) {
      target.innerHTML = '<div class="empty-state">등록된 프리셋이 없습니다. 다음 단계에서 업로드/생성 기능을 연결합니다.</div>';
      return;
    }

    target.innerHTML = presets.map((preset) => `
      <button class="preset-item" data-preset-id="${preset.id}">
        <strong>${preset.name || preset.id}</strong>
        <span>${preset.ratio || ratio} · ${(preset.tags || []).join(', ') || 'no tags'}</span>
      </button>
    `).join('');
  } catch (err) {
    target.innerHTML = '<div class="empty-state">프리셋 목록을 불러오지 못했습니다.</div>';
  }
}

function connectSocket() {
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  const ws = new WebSocket(`${protocol}://${location.host}`);

  ws.addEventListener('open', () => {
    if (serverStatus) serverStatus.textContent = '서버 연결됨';
  });

  ws.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'sync') {
        appState.queue = data.queue;
        const queueBox = document.getElementById('queueBox');
        if (queueBox) queueBox.textContent = JSON.stringify(data.queue, null, 2);
      }
      if (data.type === 'progress' && renderStatus) {
        renderStatus.textContent = `${data.stage || 'render'} ${data.percent || 0}%`;
      }
    } catch (err) {
      // ignore malformed messages
    }
  });

  ws.addEventListener('close', () => {
    if (serverStatus) serverStatus.textContent = '서버 재연결 필요';
  });
}

checkHealth();
connectSocket();
setPage('project');
