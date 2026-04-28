const mount = document.getElementById('presetMount');

const PHASES = {
  title: "\n      <div class=\"layer p05-bg\"></div>\n      <div class=\"layer p05-grid\"></div>\n      <div class=\"layer center\" style=\"flex-direction:column;gap:6px\">\n        <div class=\"p05-title-mask\"><div class=\"p05-title\">그 여름</div></div>\n        <div class=\"p05-title-mask\"><div class=\"p05-title\" style=\"--d:.4s\">우리가 듣던 노래</div></div>\n        <div class=\"p05-sub-mask\" style=\"margin-top:6px\"><div class=\"p05-sub\">Pop WiFi · 버즈밴드</div></div>\n      </div>",
  cta: "\n      <div class=\"layer p05-bg\"></div>\n      <div class=\"layer p05-grid\"></div>\n      <div class=\"layer center\" style=\"flex-direction:column;gap:14px\">\n        <div style=\"font-family:'Noto Sans KR',sans-serif;font-size:clamp(9px,1.2vw,13px);color:#b470ff88;letter-spacing:.4em;text-transform:uppercase;opacity:0;animation:fadeIn .4s ease .2s forwards\">함께해요</div>\n        <div class=\"p05-cta\">\n          <div class=\"p05-cta-pill in\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#d4b0ff\" stroke-width=\"1.5\"><path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"/></svg><span>좋아요</span></div>\n          <div class=\"p05-cta-pill in\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#d4b0ff\" stroke-width=\"1.5\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg><span>구독</span></div>\n          <div class=\"p05-cta-pill in\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#d4b0ff\" stroke-width=\"1.5\"><path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M13.73 21a2 2 0 0 1-3.46 0\"/></svg><span>알림</span></div>\n        </div>\n      </div>"
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
