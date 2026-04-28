const mount = document.getElementById('presetMount');

const PHASES = {
  title: "\n      <div class=\"layer p14-bg\"></div>\n      <div class=\"p14-blob1\"></div><div class=\"p14-blob2\"></div>\n      <div class=\"p14-halo\"></div>\n      <div class=\"layer center\" style=\"flex-direction:column;gap:8px\">\n        <div class=\"p14-title\">그 여름 우리가 듣던 노래</div>\n        <div class=\"p14-dots\">\n          <div class=\"p14-dot\" style=\"--dc:0s\"></div>\n          <div class=\"p14-dot\" style=\"--dc:.4s\"></div>\n          <div class=\"p14-dot\" style=\"--dc:.8s\"></div>\n        </div>\n        <div class=\"p14-artist\">버즈밴드</div>\n      </div>",
  cta: "\n      <div class=\"layer p14-bg\"></div>\n      <div class=\"p14-blob1\"></div><div class=\"p14-blob2\"></div>\n      <div class=\"layer center\" style=\"flex-direction:column;gap:14px\">\n        <div style=\"font-family:'DM Serif Display',serif;font-style:italic;font-size:clamp(11px,1.7vw,18px);color:#7a5848;letter-spacing:.06em;opacity:0;animation:fadeIn .5s ease .2s forwards\">마음이 따뜻해졌나요?</div>\n        <div class=\"p14-cta\">\n          <div class=\"p14-cta-pill\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#d07060\" stroke-width=\"1.5\"><path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"/></svg><span>좋아요</span></div>\n          <div class=\"p14-cta-pill\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#9070c0\" stroke-width=\"1.5\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg><span>구독</span></div>\n          <div class=\"p14-cta-pill\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#508070\" stroke-width=\"1.5\"><path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M13.73 21a2 2 0 0 1-3.46 0\"/></svg><span>알림</span></div>\n        </div>\n      </div>"
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
