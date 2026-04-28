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
  const c='#a0a0b0';return `<defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c}" stop-opacity="0.75"/><stop offset="100%" stop-color="${c}" stop-opacity="0.42"/></linearGradient><filter id="sf"><feGaussianBlur stdDeviation="0.4"/></filter><filter id="glow"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <rect x="24" y="24" width="852" height="458" stroke="${c}" stroke-width="1.2" fill="none" opacity="0.55"/>
    <line x1="24" y1="24" x2="876" y2="24" stroke="${c}" stroke-width="0.5" opacity="0.30"/>
    <line x1="24" y1="482" x2="876" y2="482" stroke="${c}" stroke-width="0.5" opacity="0.30"/>
    <circle cx="24" cy="24" r="3" fill="${c}" opacity="0.60"/>
    <circle cx="876" cy="24" r="3" fill="${c}" opacity="0.60"/>
    <circle cx="24" cy="482" r="3" fill="${c}" opacity="0.60"/>
    <circle cx="876" cy="482" r="3" fill="${c}" opacity="0.60"/>`;
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<5;i++){const el=document.createElement('div');const w=40+Math.random()*80,x=Math.random()*100,y=Math.random()*80,dur=4+Math.random()*5,del=-(Math.random()*dur);el.style.cssText=`position:absolute;left:${x}%;top:${y}%;pointer-events:none;`;el.innerHTML=`<svg width="${w}" height="1"><line x1="0" y1="0.5" x2="${w}" y2="0.5" stroke="rgba(160,160,180,0.20)" stroke-width="1"><animate attributeName="opacity" values="0.05;0.25;0.05" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></line></svg>`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,n=9,durs=[0.36,0.50,0.40,0.56,0.34,0.52,0.44,0.60,0.38];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;for(let i=0;i<n;i++){const x=3+i*11,h=10+i%4*10,an=`mn${_ID()}`;svg+=`<style>@keyframes ${an}{0%{transform:scaleY(0.1);}100%{transform:scaleY(1);}}</style><line x1="${x+4}" y1="${svgH}" x2="${x+4}" y2="${svgH-h}" stroke="rgba(160,160,180,0.65)" stroke-width="1.5" stroke-linecap="round" style="animation:${an} ${durs[i]}s ease-in-out infinite alternate;transform-origin:${x+4}px ${svgH}px;transform-box:fill-box;"/>`;}return svg+'</svg>';
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
