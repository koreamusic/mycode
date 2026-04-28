const mount = document.getElementById('presetMount');

const PHASES = {
  title: "\n      <div class=\"layer p02-bg\"></div>\n      <div class=\"layer p02-scanline\"></div>\n      <div class=\"layer center\" style=\"gap:12px\">\n        <div class=\"p02-sub\">Pop WiFi · Playlist</div>\n        <div class=\"p02-title-wrap\">\n          <div class=\"p02-title\">그 여름 우리가 듣던 노래</div>\n        </div>\n      </div>",
  cta: "\n      <div class=\"layer p02-bg\"></div>\n      <div class=\"layer p02-scanline\"></div>\n      <div class=\"layer center\">\n        <div class=\"p02-cta-wrap\">\n          <div class=\"p02-cta-eyebrow\">마음이 닿으셨다면</div>\n          <div class=\"p02-cta-row\">\n            <div class=\"p02-card\" style=\"--p02d:0s\">\n              <div class=\"p02-icon-box\">\n                <div class=\"p02-icon-num\">♥</div>\n                <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#c8a55a\" stroke-width=\"1.5\"><path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"/></svg>\n              </div>\n              <div class=\"p02-card-lbl\">좋아요</div>\n              <div class=\"p02-card-sub\">Like</div>\n            </div>\n            <div class=\"p02-card\" style=\"--p02d:.4s\">\n              <div class=\"p02-icon-box\">\n                <div class=\"p02-icon-num\">▶</div>\n                <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#c8a55a\" stroke-width=\"1.5\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg>\n              </div>\n              <div class=\"p02-card-lbl\">구독</div>\n              <div class=\"p02-card-sub\">Subscribe</div>\n            </div>\n            <div class=\"p02-card\" style=\"--p02d:.8s\">\n              <div class=\"p02-icon-box\">\n                <div class=\"p02-icon-num\">🔔</div>\n                <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#c8a55a\" stroke-width=\"1.5\"><path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M13.73 21a2 2 0 0 1-3.46 0\"/></svg>\n              </div>\n              <div class=\"p02-card-lbl\">알림</div>\n              <div class=\"p02-card-sub\">Notify</div>\n            </div>\n          </div>\n        </div>\n      </div>"
};

let currentPhase = null;

function applyPhase(time) {
  const seconds = Math.max(0, Number(time) || 0);
  const phase = seconds < 5.0 ? 'title' : 'cta';
  if (phase === currentPhase) return;
  currentPhase = phase;
  mount.innerHTML = PHASES[phase] || '';
}

window.applyPhase = applyPhase;
applyPhase(0);
