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
  const c='#c8c0b8';return `<defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c}" stop-opacity="0.88"/><stop offset="100%" stop-color="${c}" stop-opacity="0.52"/></linearGradient><filter id="sf"><feGaussianBlur stdDeviation="0.7"/></filter><filter id="glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="brush_f"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/></filter></defs>
    <g filter="url(#brush_f)">
      <path d="M26,26 Q220,18 450,23 Q680,18 874,26" stroke="${c}" stroke-width="8" fill="none" opacity="0.65" stroke-linecap="round"/>
      <path d="M874,26 Q882,200 876,480" stroke="${c}" stroke-width="8" fill="none" opacity="0.60" stroke-linecap="round"/>
      <path d="M874,480 Q680,488 450,483 Q220,488 26,480" stroke="${c}" stroke-width="8" fill="none" opacity="0.65" stroke-linecap="round"/>
      <path d="M26,480 Q18,300 24,26" stroke="${c}" stroke-width="8" fill="none" opacity="0.60" stroke-linecap="round"/>
    </g>`;
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<5;i++){const el=document.createElement('div');const x=10+Math.random()*80,dur=8+Math.random()*8,del=-(Math.random()*dur),h=30+Math.random()*40;el.style.cssText=`position:absolute;left:${x}%;top:${10+Math.random()*50}%;pointer-events:none;`;el.innerHTML=`<svg width="3" height="${h}"><line x1="1.5" y1="0" x2="${1+Math.random()*2}" y2="${h}" stroke="rgba(200,195,190,0.22)" stroke-width="${1+Math.random()*1.5}"><animate attributeName="opacity" values="0;0.4;0" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></line></svg>`;l.appendChild(el);}
}

function buildEq() {
  return eqBase(7,14,48,(x,H,i)=>`<path d="M${x-4},${H} Q${x-5},${H-H*0.5} ${x-3},${H-H*0.95} L${x},${H-H-2} L${x+3},${H-H*0.95} Q${x+5},${H-H*0.5} ${x+4},${H} Z" fill="rgba(200,195,188,0.72)"/>`);
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
