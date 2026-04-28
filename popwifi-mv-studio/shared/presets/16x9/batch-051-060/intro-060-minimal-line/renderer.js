const mount = document.getElementById('presetMount');

const PHASES = {
  title: "\n      <div class=\"layer p11-bg\"></div>\n      <div class=\"layer center\" style=\"flex-direction:column;gap:10px\">\n        <div class=\"p11-title\">그 여름 우리가 듣던 노래</div>\n        <div class=\"p11-sub\">버즈밴드 · Pop WiFi</div>\n      </div>",
  cta: "\n      <div class=\"layer p11-bg\"></div>\n      <div class=\"layer center\" style=\"flex-direction:column;gap:16px\">\n        <div style=\"font-family:'Cormorant Garamond',serif;font-size:clamp(9px,1.1vw,12px);color:#6a6058;letter-spacing:.35em;text-transform:uppercase;opacity:0;animation:fadeIn .5s ease .3s forwards\">함께해 주세요</div>\n        <div class=\"p11-cta\">\n          <div class=\"p11-cta-item\"><div class=\"p11-cta-icon-wrap\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#1a1612\" stroke-width=\"1.5\"><path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"/></svg></div><div class=\"p11-cta-lbl\">좋아요</div></div>\n          <div class=\"p11-cta-item\"><div class=\"p11-cta-icon-wrap\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#1a1612\" stroke-width=\"1.5\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg></div><div class=\"p11-cta-lbl\">구독</div></div>\n          <div class=\"p11-cta-item\"><div class=\"p11-cta-icon-wrap\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#1a1612\" stroke-width=\"1.5\"><path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M13.73 21a2 2 0 0 1-3.46 0\"/></svg></div><div class=\"p11-cta-lbl\">알림</div></div>\n        </div>\n      </div>"
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
