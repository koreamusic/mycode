const mount = document.getElementById('presetMount');

const PHASES = {
  title: "\n      <div class=\"layer p19-bg\"></div>\n      <div class=\"p19-staff\"><div class=\"p19-staff-line\"></div><div class=\"p19-staff-line\"></div><div class=\"p19-staff-line\"></div><div class=\"p19-staff-line\"></div><div class=\"p19-staff-line\"></div></div>\n      <div class=\"p19-note\" style=\"left:15%;top:30%;--nd:2.8s;--np:0s;--nr:-15deg;--ns:20px\"><svg viewBox=\"0 0 24 24\" fill=\"#d4c090\" opacity=\".6\"><path d=\"M9 18V5l12-2v13M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z\"/></svg></div>\n      <div class=\"p19-note\" style=\"left:75%;top:60%;--nd:3.5s;--np:.7s;--nr:10deg;--ns:16px\"><svg viewBox=\"0 0 24 24\" fill=\"#d4c090\" opacity=\".5\"><path d=\"M9 18V5l12-2v13M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z\"/></svg></div>\n      <div class=\"p19-note\" style=\"left:55%;top:20%;--nd:4s;--np:1.4s;--nr:5deg;--ns:13px\"><svg viewBox=\"0 0 24 24\" fill=\"#d4c090\" opacity=\".4\"><path d=\"M9 18V5l12-2v13M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z\"/></svg></div>\n      <div class=\"p19-title-area\">\n        <div class=\"p19-title\">그 여름 우리가 듣던 노래</div>\n        <div class=\"p19-sub\">버즈밴드 · Pop WiFi</div>\n      </div>",
  cta: "\n      <div class=\"layer p19-bg\"></div>\n      <div class=\"p19-staff\"><div class=\"p19-staff-line\"></div><div class=\"p19-staff-line\"></div><div class=\"p19-staff-line\"></div><div class=\"p19-staff-line\"></div><div class=\"p19-staff-line\"></div></div>\n      <div class=\"p19-note\" style=\"left:20%;top:40%;--nd:3s;--np:.2s;--nr:-10deg;--ns:18px\"><svg viewBox=\"0 0 24 24\" fill=\"#d4c090\" opacity=\".5\"><path d=\"M9 18V5l12-2v13M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z\"/></svg></div>\n      <div class=\"p19-note\" style=\"left:80%;top:25%;--nd:3.8s;--np:1s;--nr:8deg;--ns:14px\"><svg viewBox=\"0 0 24 24\" fill=\"#d4c090\" opacity=\".4\"><path d=\"M9 18V5l12-2v13M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z\"/></svg></div>\n      <div class=\"p19-title-area\" style=\"opacity:0;animation:fadeIn .6s ease 1.5s forwards\">\n        <div class=\"p19-cta\">\n          <div class=\"p19-cta-row\">\n            <div class=\"p19-cta-jazz\"><div class=\"p19-jazz-icon\" style=\"--js:0s\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#d4c090\" stroke-width=\"1.5\"><path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"/></svg></div><div class=\"p19-jazz-lbl\">좋아요</div></div>\n            <div class=\"p19-cta-divider\">·</div>\n            <div class=\"p19-cta-jazz\"><div class=\"p19-jazz-icon\" style=\"--js:.4s\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#d4c090\" stroke-width=\"1.5\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg></div><div class=\"p19-jazz-lbl\">구독</div></div>\n            <div class=\"p19-cta-divider\">·</div>\n            <div class=\"p19-cta-jazz\"><div class=\"p19-jazz-icon\" style=\"--js:.8s\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#d4c090\" stroke-width=\"1.5\"><path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M13.73 21a2 2 0 0 1-3.46 0\"/></svg></div><div class=\"p19-jazz-lbl\">알림</div></div>\n          </div>\n        </div>\n      </div>"
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
