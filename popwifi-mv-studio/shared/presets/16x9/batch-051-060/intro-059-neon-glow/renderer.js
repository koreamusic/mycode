const mount = document.getElementById('presetMount');

const PHASES = {
  title: "\n      <div class=\"layer p10-bg\"></div>\n      <div class=\"layer p10-scanline\"></div>\n      <div class=\"layer center\" style=\"flex-direction:column;gap:8px\">\n        <div class=\"p10-title\" data-text=\"그 여름 우리가 듣던 노래\">그 여름 우리가 듣던 노래</div>\n        <div class=\"p10-sub\">BUZBAND · POP WIFI</div>\n      </div>",
  cta: "\n      <div class=\"layer p10-bg\"></div>\n      <div class=\"layer p10-scanline\"></div>\n      <div class=\"layer center\" style=\"flex-direction:column;gap:14px\">\n        <div style=\"font-family:'Noto Sans KR',sans-serif;font-size:clamp(8px,1vw,11px);color:#00d4ff44;letter-spacing:.4em;text-transform:uppercase;opacity:0;animation:fadeIn .4s ease .2s forwards\">SUBSCRIBE NOW</div>\n        <div class=\"p10-cta\">\n          <div class=\"p10-cta-btn\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#00d4ff\" stroke-width=\"1.5\"><path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"/></svg><span>LIKE</span></div>\n          <div class=\"p10-cta-btn\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#00d4ff\" stroke-width=\"1.5\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg><span>SUB</span></div>\n          <div class=\"p10-cta-btn\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#00d4ff\" stroke-width=\"1.5\"><path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M13.73 21a2 2 0 0 1-3.46 0\"/></svg><span>BELL</span></div>\n        </div>\n      </div>"
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
