const mount = document.getElementById('presetMount');

const PHASES = {
  title: "\n      <div class=\"layer p17-bg\"></div>\n      <div class=\"p17-wave\"><svg viewBox=\"0 0 900 120\" preserveAspectRatio=\"none\"><path d=\"M0,60 C150,20 300,100 450,60 C600,20 750,100 900,60 L900,120 L0,120 Z\" fill=\"rgba(100,180,255,0.06)\"/><path d=\"M0,80 C150,40 300,110 450,70 C600,30 750,110 900,70 L900,120 L0,120 Z\" fill=\"rgba(100,180,255,0.04)\"/></svg></div>\n      <div class=\"layer center\" style=\"flex-direction:column;gap:8px\">\n        <div class=\"p17-title\" id=\"p17chars\"></div>\n        <div class=\"p17-ring\">\n          <div class=\"p17-ring-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#6ab0ff88\" stroke-width=\"1\"><path d=\"M9 18V5l12-2v13\"/><circle cx=\"6\" cy=\"18\" r=\"3\"/><circle cx=\"18\" cy=\"16\" r=\"3\"/></svg></div>\n        </div>\n      </div>",
  cta: "\n      <div class=\"layer p17-bg\"></div>\n      <div class=\"p17-wave\"><svg viewBox=\"0 0 900 120\" preserveAspectRatio=\"none\"><path d=\"M0,60 C150,20 300,100 450,60 C600,20 750,100 900,60 L900,120 L0,120 Z\" fill=\"rgba(100,180,255,0.06)\"/></svg></div>\n      <div class=\"layer center\" style=\"flex-direction:column;gap:14px\">\n        <div style=\"font-family:'Noto Sans KR',sans-serif;font-size:clamp(9px,1.2vw,12px);color:#4a90cc66;letter-spacing:.3em;text-transform:uppercase;opacity:0;animation:fadeIn .5s ease .2s forwards\">파동처럼 퍼져나가요</div>\n        <div class=\"p17-cta\">\n          <div class=\"p17-ripple-btn\"><div class=\"p17-ripple-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#6ab0ff\" stroke-width=\"1.5\"><path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"/></svg></div><div class=\"p17-ripple-lbl\">좋아요</div></div>\n          <div class=\"p17-ripple-btn\"><div class=\"p17-ripple-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#6ab0ff\" stroke-width=\"1.5\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg></div><div class=\"p17-ripple-lbl\">구독</div></div>\n          <div class=\"p17-ripple-btn\"><div class=\"p17-ripple-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#6ab0ff\" stroke-width=\"1.5\"><path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M13.73 21a2 2 0 0 1-3.46 0\"/></svg></div><div class=\"p17-ripple-lbl\">알림</div></div>\n        </div>\n      </div>"
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
