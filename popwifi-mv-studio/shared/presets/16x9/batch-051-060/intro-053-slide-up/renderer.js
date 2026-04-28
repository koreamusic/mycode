const mount = document.getElementById('presetMount');

const PHASES = {
  title: "\n      <div class=\"layer p04-bg\"></div>\n      <div class=\"p04-sideline\"></div>\n      <div class=\"p04-title-wrap\">\n        <div class=\"p04-label\">Pop WiFi · Now Playing</div>\n        <div class=\"p04-title\">그 여름<br>우리가 듣던</div>\n        <div class=\"p04-artist\">버즈밴드</div>\n      </div>",
  cta: "\n      <div class=\"layer p04-bg\"></div>\n      <div class=\"p04-sideline\"></div>\n      <div class=\"p04-title-wrap\" style=\"opacity:.3\">\n        <div class=\"p04-title\" style=\"font-size:clamp(12px,2vw,24px);animation:none;opacity:1\">그 여름<br>우리가 듣던</div>\n      </div>\n      <div class=\"p04-cta\">\n        <div class=\"p04-cta-row\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4a9eff\" stroke-width=\"1.5\"><path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"/></svg><span>좋아요</span></div>\n        <div class=\"p04-cta-row\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4a9eff\" stroke-width=\"1.5\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg><span>구독</span></div>\n        <div class=\"p04-cta-row\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4a9eff\" stroke-width=\"1.5\"><path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M13.73 21a2 2 0 0 1-3.46 0\"/></svg><span>알림 설정</span></div>\n      </div>"
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
