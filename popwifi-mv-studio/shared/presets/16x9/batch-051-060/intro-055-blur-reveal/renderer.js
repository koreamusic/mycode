const mount = document.getElementById('presetMount');

const PHASES = {
  title: "\n      <div class=\"layer p06-bg\"></div>\n      <div class=\"p06-particle\" style=\"width:80px;height:80px;background:radial-gradient(rgba(200,165,90,.12),transparent);top:10%;left:20%;--pd:5s;--px:20px;--py:-20px;--pp:0s\"></div>\n      <div class=\"p06-particle\" style=\"width:60px;height:60px;background:radial-gradient(rgba(200,165,90,.08),transparent);bottom:15%;right:25%;--pd:7s;--px:-15px;--py:10px;--pp:1s\"></div>\n      <div class=\"p06-particle\" style=\"width:40px;height:40px;background:radial-gradient(rgba(200,165,90,.1),transparent);top:30%;right:15%;--pd:4s;--px:10px;--py:-25px;--pp:2s\"></div>\n      <div class=\"layer center\" style=\"flex-direction:column;gap:6px\">\n        <div class=\"p06-title\">그 여름 우리가 듣던 노래</div>\n        <div class=\"p06-ornament\">\n          <div class=\"p06-orn-line\"></div>\n          <div class=\"p06-orn-diamond\"></div>\n          <div class=\"p06-orn-line\" style=\"transform:scaleX(-1)\"></div>\n        </div>\n        <div style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(10px,1.3vw,14px);color:#c8a55a77;letter-spacing:.18em;opacity:0;animation:fadeIn .5s ease 1.4s forwards\">버즈밴드</div>\n      </div>",
  cta: "\n      <div class=\"layer p06-bg\"></div>\n      <div class=\"p06-particle\" style=\"width:80px;height:80px;background:radial-gradient(rgba(200,165,90,.12),transparent);top:10%;left:20%;--pd:5s;--px:20px;--py:-20px;--pp:0s\"></div>\n      <div class=\"layer center\" style=\"flex-direction:column;gap:10px\">\n        <div class=\"p06-cta\">\n          <div class=\"p06-cta-text\">좋아요 · 구독 · 알림</div>\n          <div class=\"p06-cta-icons\">\n            <div class=\"p06-cta-icon\" style=\"--if:0s\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#c8a55a\" stroke-width=\"1.5\"><path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"/></svg><span>좋아요</span></div>\n            <div class=\"p06-cta-icon\" style=\"--if:.3s\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#c8a55a\" stroke-width=\"1.5\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg><span>구독</span></div>\n            <div class=\"p06-cta-icon\" style=\"--if:.6s\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#c8a55a\" stroke-width=\"1.5\"><path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M13.73 21a2 2 0 0 1-3.46 0\"/></svg><span>알림</span></div>\n          </div>\n        </div>\n      </div>"
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
