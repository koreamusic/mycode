const mount = document.getElementById('presetMount');

const PHASES = {
  title: "\n      <div class=\"layer\" style=\"background:#0c0c0c\"></div>\n      <div class=\"p12-left\">\n        <div class=\"p12-title\">그 여름<br>우리가 듣던<br>노래</div>\n        <div class=\"p12-gold-line\"></div>\n        <div class=\"p12-artist\">버즈밴드</div>\n      </div>\n      <div class=\"p12-right\">\n        <div style=\"font-family:'Cormorant Garamond',serif;font-size:clamp(8px,1vw,10px);color:#333;letter-spacing:.4em;text-transform:uppercase;opacity:0;animation:fadeIn .5s ease 1.3s forwards\">Pop WiFi · Playlist</div>\n        <div style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(10px,1.5vw,16px);color:#555;letter-spacing:.12em;opacity:0;animation:fadeIn .5s ease 1.6s forwards;text-align:center\">\n          마음이 닿는 음악으로<br>하루를 채워드려요\n        </div>\n      </div>",
  cta: "\n      <div class=\"layer\" style=\"background:#0c0c0c\"></div>\n      <div class=\"p12-left\" style=\"opacity:.2\">\n        <div style=\"font-family:'Noto Serif KR',serif;font-size:clamp(12px,2vw,24px);color:#f0e8d4;text-align:center\">그 여름<br>우리가 듣던</div>\n      </div>\n      <div class=\"p12-right\">\n        <div class=\"p12-cta-label\">함께해 주세요</div>\n        <div class=\"p12-cta-stack\">\n          <div class=\"p12-cta-card\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#c8a55a\" stroke-width=\"1.5\" style=\"width:clamp(12px,1.8vw,18px);height:clamp(12px,1.8vw,18px)\"><path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"/></svg><span>좋아요</span></div>\n          <div class=\"p12-cta-card\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#c8a55a\" stroke-width=\"1.5\" style=\"width:clamp(12px,1.8vw,18px);height:clamp(12px,1.8vw,18px)\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg><span>구독하기</span></div>\n          <div class=\"p12-cta-card\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#c8a55a\" stroke-width=\"1.5\" style=\"width:clamp(12px,1.8vw,18px);height:clamp(12px,1.8vw,18px)\"><path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M13.73 21a2 2 0 0 1-3.46 0\"/></svg><span>알림 설정</span></div>\n        </div>\n      </div>"
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
