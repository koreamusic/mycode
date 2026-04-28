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
  const c='#a880e0';
    // 전파 방사 + 직선 프레임
    const waves=`<g opacity="0.35" filter="url(#sf)">${[60,90,120,150].map(r=>`<path d="M450,253 m-${r},0 a${r},${r} 0 0,1 ${r*2},0 a${r},${r} 0 0,1 -${r*2},0" stroke="${c}" stroke-width="0.8" fill="none"/>`).join('')}</g>`;
    const corner=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#sf)">
      <line x1="0" y1="80" x2="0" y2="0" stroke="${c}" stroke-width="2" opacity="0.7" stroke-linecap="square"/>
      <line x1="0" y1="0" x2="80" y2="0" stroke="${c}" stroke-width="2" opacity="0.7" stroke-linecap="square"/>
      <circle cx="0" cy="0" r="5" fill="${c}" opacity="0.8"/>
      <line x1="20" y1="0" x2="60" y2="0" stroke="${c}" stroke-width="0.7" opacity="0.38"/>
      <line x1="0" y1="20" x2="0" y2="60" stroke="${c}" stroke-width="0.7" opacity="0.38"/>
    </g>`;
    return rectFrame(c,'rgba(160,120,220,0.28)',waves+corner(26,26,1,1)+corner(874,26,-1,1)+corner(26,480,1,-1)+corner(874,480,-1,-1)+`<line x1="160" y1="24" x2="740" y2="24" stroke="url(#fg)" stroke-width="0.5" opacity="0.3"/><line x1="160" y1="482" x2="740" y2="482" stroke="url(#fg)" stroke-width="0.5" opacity="0.3"/>`);
}

function buildParticles(l) {
  l.innerHTML='';l.innerHTML=`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 900 506">${Array.from({length:4},(_,i)=>{const r=80+i*50;return `<path d="M450,253 m-${r},0 a${r},${r} 0 0,1 ${r*2},0 a${r},${r} 0 0,1 -${r*2},0" stroke="rgba(168,128,224,${0.06-i*0.012})" stroke-width="${2-i*0.3}" fill="none"><animate attributeName="r" values="${r};${r+20};${r}" dur="${2+i*0.7}s" repeatCount="indefinite"/><animate attributeName="stroke-width" values="${2-i*0.3};${1-i*0.15};${2-i*0.3}" dur="${2+i*0.7}s" repeatCount="indefinite"/></path>`;}).join('')}</svg>`;
}

function buildEq() {
  const svgW=100,svgH=48,n=7,durs=[0.36,0.50,0.42,0.58,0.38,0.52,0.44];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;
    // 사인파 패턴
    for(let i=0;i<n;i++){const x=6+i*13,an=`rw${_ID()}`;svg+=`<style>@keyframes ${an}{0%{transform:scaleY(0.2);}100%{transform:scaleY(1);}}</style><g style="animation:${an} ${durs[i]}s ease-in-out infinite alternate;transform-origin:${x}px ${svgH}px;transform-box:fill-box;"><path d="M${x-4},${svgH} Q${x},${svgH*0.1} ${x+4},${svgH}" fill="rgba(168,128,224,0.68)" stroke="none"/></g>`;}
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
