const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('.nav-btn');
const queueBox = document.getElementById('queueBox');

function setPage(pageName) {
  pages.forEach((page) => page.classList.remove('active'));
  navButtons.forEach((btn) => btn.classList.remove('active'));

  const page = document.getElementById(`page-${pageName}`);
  const btn = document.querySelector(`[data-page="${pageName}"]`);

  if (page) page.classList.add('active');
  if (btn) btn.classList.add('active');
}

navButtons.forEach((btn) => {
  btn.addEventListener('click', () => setPage(btn.dataset.page));
});

async function loadQueue() {
  try {
    const res = await fetch('/api/queue');
    const queue = await res.json();
    if (queueBox) queueBox.textContent = JSON.stringify(queue, null, 2);
  } catch (err) {
    if (queueBox) queueBox.textContent = '큐 정보를 불러오지 못했습니다.';
  }
}

function connectSocket() {
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  const ws = new WebSocket(`${protocol}://${location.host}`);
  ws.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'sync' && queueBox) queueBox.textContent = JSON.stringify(data.queue, null, 2);
    } catch (err) {
      // ignore malformed messages
    }
  });
}

loadQueue();
connectSocket();
