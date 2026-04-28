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
  const c='#b87840';
    const cup=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#sf)">
      <path d="M8,12 L12,44 L44,44 L48,12 Z" stroke="${c}" stroke-width="1.3" fill="rgba(184,120,64,0.08)" opacity="0.72"/>
      <path d="M48,22 Q62,22 62,30 Q62,38 48,38" stroke="${c}" stroke-width="1.2" fill="none" opacity="0.6"/>
      <ellipse cx="28" cy="12" rx="20" ry="6" stroke="${c}" stroke-width="1" fill="none" opacity="0.55"/>
      <path d="M18,6 Q22,-2 28,0 Q34,-2 38,6" stroke="${c}" stroke-width="1" fill="none" opacity="0.5"/>
    </g>`;
    return rectFrame(c,'rgba(180,120,60,0.28)',
      cup(26,26,1,1)+cup(848,26,-1,1)+cup(26,434,-1,-1)+cup(848,434,1,-1)+
      `<line x1="130" y1="24" x2="770" y2="24" stroke="url(#fg)" stroke-width="0.5" opacity="0.28"/>
       <line x1="130" y1="482" x2="770" y2="482" stroke="url(#fg)" stroke-width="0.5" opacity="0.28"/>`);
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<6;i++){const el=document.createElement('div');const x=10+Math.random()*80,dur=3+Math.random()*3,del=-(Math.random()*dur);el.style.cssText=`position:absolute;left:${x}%;bottom:10%;pointer-events:none;`;el.innerHTML=`<svg width="6" height="30"><path d="M3,30 Q${1+Math.random()*4},20 3,10 Q${2+Math.random()*3},3 3,0" stroke="rgba(184,120,64,0.35)" stroke-width="1.2" fill="none"><animate attributeName="d" dur="${dur}s" begin="${del}s" repeatCount="indefinite" values="M3,30 Q2,20 3,10 Q4,3 3,0;M3,30 Q5,20 3,10 Q1,3 3,0;M3,30 Q2,20 3,10 Q4,3 3,0"/><animate attributeName="opacity" values="0;0.6;0" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></path></svg>`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,n=6,durs=[0.44,0.56,0.38,0.50,0.62,0.42];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;
    for(let i=0;i<n;i++){const x=8+i*14,an=`cf${_ID()}`,h=20+Math.random()*20;svg+=`<style>@keyframes ${an}{0%{height:${h*0.4}px;y:${svgH-h*0.4}px;}100%{height:${h}px;y:${svgH-h}px;}}</style><rect x="${x-3}" y="${svgH-h}" width="7" height="${h}" rx="3" fill="rgba(184,120,64,0.7)" style="animation:${an} ${durs[i]}s ease-in-out infinite alternate;"/>`;}
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
