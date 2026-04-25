import { api } from './api.js';
import { setActivePage } from './state.js';

export const PAGE_FILES = {
  project: './pages/project.html',
  longform: './pages/longform.html',
  shorts: './pages/shorts.html',
  lyrics: './pages/lyrics.html',
  landing: './pages/landing.html',
  queue: './pages/queue.html',
  settings: './pages/settings.html',
  faq: './pages/faq.html'
};

function setPageContent(outlet, staticHtml) {
  const doc = new DOMParser().parseFromString(staticHtml, 'text/html');
  outlet.replaceChildren(...Array.from(doc.body.childNodes));
}

export function createRouter(options) {
  const pageOutlet = options.pageOutlet;
  const navButtons = options.navButtons;
  const onAfterPageLoad = options.onAfterPageLoad;

  async function setPage(pageName) {
    const safePage = PAGE_FILES[pageName] ? pageName : 'project';
    setActivePage(safePage);

    navButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.page === safePage);
    });

    setPageContent(pageOutlet, '<section class="page active"><div class="loading-card">페이지를 불러오는 중...</div></section>');

    try {
      const html = await api.page(PAGE_FILES[safePage]);
      const doc = new DOMParser().parseFromString(html, 'text/html');
      pageOutlet.replaceChildren(...Array.from(doc.body.childNodes));
    } catch (error) {
      setPageContent(pageOutlet, '<section class="page active"><article class="card"><h2>페이지 로드 실패</h2><p>페이지 파일을 확인하세요.</p></article></section>');
    }

    if (typeof onAfterPageLoad === 'function') {
      await onAfterPageLoad(safePage);
    }
  }

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => setPage(btn.dataset.page));
  });

  return { setPage };
}
