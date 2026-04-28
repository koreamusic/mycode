const mount = document.getElementById('presetMount');

const PHASES = {
  title: "\n      <div class=\"layer\" style=\"background:#f5f0e8\"></div>\n      <div class=\"p13-brush\"></div>\n      <div class=\"p13-ink-texture layer\"></div>\n      <div class=\"layer center\" style=\"flex-direction:column;gap:6px\">\n        <div class=\"p13-title\">그 여름 우리가 듣던 노래</div>\n        <div class=\"p13-sub\">버즈밴드 · Pop WiFi</div>\n      </div>\n      <div class=\"p13-kanji\">여름<br>노래</div>",
  cta: "\n      <div class=\"layer\" style=\"background:#f5f0e8\"></div>\n      <div class=\"p13-brush\" style=\"animation:none;clip-path:polygon(0 0,100% 0,100% 100%,0 100%)\"></div>\n      <div class=\"p13-ink-texture layer\"></div>\n      <div class=\"layer center\" style=\"flex-direction:column;gap:14px\">\n        <div style=\"font-family:'Cormorant Garamond',serif;font-size:clamp(9px,1.2vw,13px);color:#c8a55a88;letter-spacing:.35em;text-transform:uppercase;opacity:0;animation:fadeIn .5s ease .2s forwards\">마음이 닿았다면</div>\n        <div class=\"p13-cta\">\n          <div class=\"p13-stamp\"><div class=\"p13-stamp-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#c8a55a\" stroke-width=\"1.5\"><path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"/></svg></div><div class=\"p13-stamp-lbl\">좋아요</div></div>\n          <div class=\"p13-stamp\"><div class=\"p13-stamp-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#c8a55a\" stroke-width=\"1.5\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg></div><div class=\"p13-stamp-lbl\">구독</div></div>\n          <div class=\"p13-stamp\"><div class=\"p13-stamp-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#c8a55a\" stroke-width=\"1.5\"><path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M13.73 21a2 2 0 0 1-3.46 0\"/></svg></div><div class=\"p13-stamp-lbl\">알림</div></div>\n        </div>\n      </div>"
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
