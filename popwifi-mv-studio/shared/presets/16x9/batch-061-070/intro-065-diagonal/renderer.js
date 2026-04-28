const mount = document.getElementById('presetMount');

const PHASES = {
  title: "\n      <div class=\"layer p16-bg\"></div>\n      <div class=\"p16-diag-line\"></div>\n      <div class=\"p16-title-area\">\n        <div class=\"p16-accent\">Pop WiFi · Now Playing</div>\n        <div class=\"p16-title\">그 여름<br><span>우리가 듣던</span><br>노래</div>\n      </div>",
  cta: "\n      <div class=\"layer p16-bg\"></div>\n      <div class=\"p16-diag-line\"></div>\n      <div class=\"p16-title-area\" style=\"opacity:.2\">\n        <div class=\"p16-title\" style=\"animation:none;opacity:1;font-size:clamp(14px,2.2vw,28px)\">그 여름<br>우리가 듣던</div>\n      </div>\n      <div class=\"p16-cta-area\">\n        <div class=\"p16-cta-diagonal\"><span class=\"p16-num\">01</span><div class=\"p16-cta-line\"></div><span class=\"p16-cta-text\">좋아요</span></div>\n        <div class=\"p16-cta-diagonal\"><span class=\"p16-num\">02</span><div class=\"p16-cta-line\"></div><span class=\"p16-cta-text\">구독하기</span></div>\n        <div class=\"p16-cta-diagonal\"><span class=\"p16-num\">03</span><div class=\"p16-cta-line\"></div><span class=\"p16-cta-text\">알림 설정</span></div>\n      </div>"
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
