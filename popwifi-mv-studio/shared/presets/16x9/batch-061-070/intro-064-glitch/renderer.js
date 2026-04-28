const mount = document.getElementById('presetMount');

const PHASES = {
  title: "\n      <div class=\"layer p15-bg\"></div>\n      <div class=\"layer p15-scanlines\"></div>\n      <div class=\"layer center\" style=\"flex-direction:column;gap:8px\">\n        <div class=\"p15-title\" data-text=\"그 여름 우리가 듣던 노래\">그 여름 우리가 듣던 노래</div>\n        <div class=\"p15-sub\">BUZBAND · POP WIFI</div>\n      </div>",
  cta: "\n      <div class=\"layer p15-bg\"></div>\n      <div class=\"layer p15-scanlines\"></div>\n      <div class=\"layer center\" style=\"flex-direction:column;gap:16px\">\n        <div style=\"font-family:'Noto Sans KR',sans-serif;font-size:clamp(8px,1vw,11px);color:#00ff8844;letter-spacing:.4em;text-transform:uppercase;opacity:0;animation:fadeIn .4s ease .2s forwards\">// INTERACT</div>\n        <div class=\"p15-cta\">\n          <div class=\"p15-cta-bracket\"><span class=\"p15-br\" style=\"--bb:0s\">[</span><div class=\"p15-br-text\"><div class=\"p15-br-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#00ff88\" stroke-width=\"1.5\"><path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"/></svg></div><div class=\"p15-br-lbl\">LIKE</div></div><span class=\"p15-br\" style=\"--bb:.1s\">]</span></div>\n          <div class=\"p15-cta-bracket\"><span class=\"p15-br\" style=\"--bb:.3s\">[</span><div class=\"p15-br-text\"><div class=\"p15-br-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#00ff88\" stroke-width=\"1.5\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg></div><div class=\"p15-br-lbl\">SUB</div></div><span class=\"p15-br\" style=\"--bb:.4s\">]</span></div>\n          <div class=\"p15-cta-bracket\"><span class=\"p15-br\" style=\"--bb:.6s\">[</span><div class=\"p15-br-text\"><div class=\"p15-br-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#00ff88\" stroke-width=\"1.5\"><path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M13.73 21a2 2 0 0 1-3.46 0\"/></svg></div><div class=\"p15-br-lbl\">BELL</div></div><span class=\"p15-br\" style=\"--bb:.7s\">]</span></div>\n        </div>\n      </div>"
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
