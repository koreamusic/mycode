const frameLayer = document.getElementById('frameLayer');
const frameSvg = document.getElementById('frameSvg');
const particles = document.getElementById('particles');
const titleMain = document.getElementById('titleMain');
const subLayer = document.getElementById('subLayer');
const bottomBar = document.getElementById('bottomBar');
const eqWrap = document.getElementById('eqWrap');

function toggleClass(node, className, shouldHave) {
  if (!node) return;
  node.classList.toggle(className, Boolean(shouldHave));
}

const _ID = () => Math.random().toString(36).slice(2, 7);

function rectFrame(c, sub, inner) {
  return `<defs>
    <linearGradient id="fg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c}" stop-opacity="0.92"/>
      <stop offset="50%" stop-color="${c}" stop-opacity="0.62"/>
      <stop offset="100%" stop-color="${c}" stop-opacity="0.88"/>
    </linearGradient>
    <filter id="sf"><feGaussianBlur stdDeviation="0.8"/></filter>
    <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect x="14" y="14" width="872" height="478" rx="2" stroke="url(#fg)" stroke-width="0.5" opacity="0.28"/>
  <rect x="24" y="24" width="852" height="458" rx="1" stroke="url(#fg)" stroke-width="1.6" opacity="0.85"/>
  <rect x="34" y="34" width="832" height="438" rx="1" stroke="${sub}" stroke-width="0.5" opacity="0.42"/>
  ${inner}`;
}

function eqBase(count, colW, maxH, shapeFn) {
  const D = [0.42,0.57,0.36,0.63,0.44,0.52,0.38,0.66,0.46,0.54,0.40,0.61,0.35,0.48,0.58];
  const S = [0.28,0.44,0.20,0.50,0.32,0.46,0.22,0.54,0.36,0.40,0.26,0.48,0.30,0.38,0.45];
  const id = _ID();
  let svg = `<svg width="${count*colW}" height="${maxH}" viewBox="0 0 ${count*colW} ${maxH}" overflow="visible">`;
  for (let i = 0; i < count; i++) {
    const x = i*colW+colW/2, an = `eq${id}${i}`;
    svg += `<style>@keyframes ${an}{0%{transform:scaleY(${S[i]}) translateY(${maxH*(1-S[i])*0.5}px);}100%{transform:scaleY(1) translateY(0);}}</style>
    <g style="animation:${an} ${D[i]}s ease-in-out infinite alternate;transform-origin:bottom center;transform-box:fill-box;">${shapeFn(x,maxH,i)}</g>`;
  }
  return svg + '</svg>';
}

function buildFrame() {
  const c='#d48830';
    const sax=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#sf)">
      <path d="M24,0 Q30,0 30,8 L30,50 Q30,60 22,65 Q14,70 8,64 Q2,58 4,50 Q6,44 14,44 Q18,44 20,48" stroke="${c}" stroke-width="2" fill="none" opacity="0.72" stroke-linecap="round"/>
      <circle cx="24" cy="0" r="5" stroke="${c}" stroke-width="1.3" fill="rgba(212,136,48,0.12)" opacity="0.7"/>
      ${[10,18,26,34,42].map((y,i)=>`<circle cx="${30-i*0.5}" cy="${y}" r="3" stroke="${c}" stroke-width="0.9" fill="none" opacity="${0.45+i*0.04}"/>`).join('')}
    </g>`;
    return rectFrame(c,'rgba(210,140,50,0.30)',sax(26,26,1,1)+sax(848,26,-1,1)+sax(26,414,-1,-1)+sax(848,414,1,-1)+`<line x1="140" y1="24" x2="760" y2="24" stroke="url(#fg)" stroke-width="0.5" opacity="0.30"/><line x1="140" y1="482" x2="760" y2="482" stroke="url(#fg)" stroke-width="0.5" opacity="0.30"/>`);
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<8;i++){const el=document.createElement('div');const x=10+Math.random()*80,dur=4+Math.random()*5,del=-(Math.random()*dur);el.style.cssText=`position:absolute;left:${x}%;bottom:5%;pointer-events:none;`;el.innerHTML=`<svg width="8" height="40"><path d="M4,40 Q${2+Math.random()*4},30 4,20 Q${1+Math.random()*6},8 4,0" stroke="rgba(212,136,48,0.2)" stroke-width="1.5" fill="none"><animate attributeName="d" values="M4,40 Q2,30 4,20 Q3,8 4,0;M4,40 Q6,30 4,20 Q5,8 4,0;M4,40 Q2,30 4,20 Q3,8 4,0" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0.5;0" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></path></svg>`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,n=7,durs=[0.32,0.48,0.38,0.54,0.40,0.58,0.36];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;
    // 트럼펫 벨 모양 EQ
    for(let i=0;i<n;i++){const x=6+i*13,h=18+i%3*12,an=`jz${_ID()}`;svg+=`<style>@keyframes ${an}{0%{transform:scaleY(0.25);}100%{transform:scaleY(1);}}</style><g style="animation:${an} ${durs[i]}s ease-in-out infinite alternate;transform-origin:bottom;transform-box:fill-box;"><path d="M${x-3},${svgH} L${x-3},${svgH-h+8} Q${x},${svgH-h-2} ${x+3},${svgH-h+8} L${x+3},${svgH} Z" fill="rgba(212,136,48,0.72)"/><ellipse cx="${x}" cy="${svgH-h+8}" rx="5" ry="3" fill="rgba(212,136,48,0.5)"/></g>`;}
    return svg+'</svg>';
}

function applyPhase(time) {
  const seconds = Math.max(0, Number(time) || 0);
  const frameVisible = seconds < 10.0;
  const titleVisible = seconds < 5.0;
  const ctaVisible = seconds >= 5.0 && seconds < 10.0;
  const bottomVisible = seconds >= 10.0;

  toggleClass(frameLayer, 'show', frameVisible);
  toggleClass(frameLayer, 'hide', seconds >= 10.0);
  toggleClass(titleMain, 'show', titleVisible);
  toggleClass(titleMain, 'hide', seconds >= 5.0);
  toggleClass(subLayer, 'show', ctaVisible);
  toggleClass(subLayer, 'hide', seconds >= 10.0);

  if (ctaVisible) {
    subLayer.querySelectorAll('.sub-anim').forEach((node) => node.classList.add('active'));
  }

  toggleClass(bottomBar, 'show', bottomVisible);
}

if (particles) buildParticles(particles);
if (frameSvg) frameSvg.innerHTML = buildFrame();
if (eqWrap) eqWrap.innerHTML = buildEq();

window.applyPhase = applyPhase;
applyPhase(0);
