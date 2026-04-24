import { api } from './core/api.js';
import { createRouter } from './core/router.js';
import { connectSocket } from './core/socket.js';
import { hydratePage } from './pages/page-init.js';

const navButtons = document.querySelectorAll('.nav-btn');
const pageOutlet = document.getElementById('pageOutlet');
const serverStatus = document.getElementById('serverStatus');
const renderStatus = document.getElementById('renderStatus');

async function checkHealth() {
  try {
    const health = await api.health();
    if (serverStatus) serverStatus.textContent = health.ok ? '서버 연결됨' : '서버 확인 필요';
  } catch (error) {
    if (serverStatus) serverStatus.textContent = '서버 끊김';
  }
}

const router = createRouter({
  pageOutlet,
  navButtons,
  onAfterPageLoad: hydratePage
});

checkHealth();
connectSocket({ serverStatus, renderStatus });
router.setPage('project');
