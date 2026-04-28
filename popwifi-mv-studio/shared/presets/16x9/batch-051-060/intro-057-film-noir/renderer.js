const mount = document.getElementById('presetMount');

const PHASES = {
  title: "\n      <div class=\"layer p08-bg\"></div>\n      <div class=\"layer p08-vignette\"></div>\n      <div class=\"p08-film-grain layer\"></div>\n      <div class=\"p08-sidebox\"></div>\n      <div class=\"p08-title-area\">\n        <div class=\"p08-eyebrow\">Pop WiFi Presents</div>\n        <div class=\"p08-title\">그 여름<br><em>우리가 듣던 노래</em></div>\n        <div class=\"p08-dash\"></div>\n        <div class=\"p08-artist\">버즈밴드</div>\n      </div>",
  cta: "\n      <div class=\"layer p08-bg\"></div>\n      <div class=\"layer p08-vignette\"></div>\n      <div class=\"p08-film-grain layer\"></div>\n      <div class=\"p08-sidebox\"></div>\n      <div class=\"p08-title-area\" style=\"opacity:.25\">\n        <div class=\"p08-title\" style=\"animation:none;opacity:1;font-size:clamp(10px,1.5vw,18px)\">그 여름 우리가 듣던 노래</div>\n      </div>\n      <div class=\"p08-cta\">\n        <div class=\"p08-cta-line\"><span class=\"p08-cta-num\">01</span><div class=\"p08-cta-tick\"></div><span class=\"p08-cta-word\">좋아요</span></div>\n        <div class=\"p08-cta-line\"><span class=\"p08-cta-num\">02</span><div class=\"p08-cta-tick\"></div><span class=\"p08-cta-word\">구독</span></div>\n        <div class=\"p08-cta-line\"><span class=\"p08-cta-num\">03</span><div class=\"p08-cta-tick\"></div><span class=\"p08-cta-word\">알림 설정</span></div>\n      </div>"
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
