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
  const c='#40c0d8';const waveBorder=`<path d="M26,26 Q200,18 450,24 Q700,18 874,26" stroke="${c}" stroke-width="1.5" fill="none" opacity="0.7"/><path d="M874,26 Q882,200 876,480" stroke="${c}" stroke-width="1.5" fill="none" opacity="0.65"/><path d="M874,480 Q700,488 450,482 Q200,488 26,480" stroke="${c}" stroke-width="1.5" fill="none" opacity="0.7"/><path d="M26,480 Q18,300 24,26" stroke="${c}" stroke-width="1.5" fill="none" opacity="0.65"/>`;const shell=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#sf)"><path d="M20,40 Q0,20 10,0 Q20,-5 30,0 Q40,20 20,40Z" stroke="${c}" stroke-width="1.2" fill="rgba(64,192,216,0.08)" opacity="0.6"/>${[20,30,40,50,60,70,80].map(a=>`<path d="M20,40 Q${10+Math.cos(a*Math.PI/180)*22},${40-Math.sin(a*Math.PI/180)*40} ${20+Math.cos(a*Math.PI/180)*8},0" stroke="${c}" stroke-width="0.6" fill="none" opacity="0.3"/>`).join('')}</g>`;return `<defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c}" stop-opacity="0.88"/><stop offset="100%" stop-color="${c}" stop-opacity="0.55"/></linearGradient><filter id="sf"><feGaussianBlur stdDeviation="0.8"/></filter><filter id="glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>${waveBorder}${shell(26,26,1,1)}${shell(874,26,-1,1)}${shell(26,480,1,-1)}${shell(874,480,-1,-1)}`;
}

function buildParticles(l) {
  l.innerHTML='';l.innerHTML=`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;" viewBox="0 0 900 506">${[0,1,2,3].map(i=>`<path fill="none" stroke="rgba(64,192,216,${0.06-i*0.01})" stroke-width="${2-i*0.3}"><animate attributeName="d" values="M0,${250+i*30} Q225,${200+i*25} 450,${250+i*30} Q675,${300+i*35} 900,${250+i*30};M0,${250+i*30} Q225,${300+i*35} 450,${250+i*30} Q675,${200+i*25} 900,${250+i*30};M0,${250+i*30} Q225,${200+i*25} 450,${250+i*30} Q675,${300+i*35} 900,${250+i*30}" dur="${4+i*1.2}s" repeatCount="indefinite"/></path>`).join('')}</svg>`;
}

function buildEq() {
  const svgW=120,svgH=48;let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;for(let i=0;i<4;i++){const y=10+i*10,amp=6-i,dur=0.8+i*0.3,c=`rgba(64,192,216,${0.7-i*0.14})`,an=`wv${_ID()}`;svg+=`<style>@keyframes ${an}{0%{d:path("M 0 ${y} Q 30 ${y-amp} 60 ${y} Q 90 ${y+amp} 120 ${y}");}100%{d:path("M 0 ${y} Q 30 ${y+amp} 60 ${y} Q 90 ${y-amp} 120 ${y}");}}</style><path d="M 0 ${y} Q 30 ${y-amp} 60 ${y} Q 90 ${y+amp} 120 ${y}" stroke="${c}" stroke-width="${2-i*0.3}" fill="none" style="animation:${an} ${dur}s ease-in-out infinite alternate;"/>`;}return svg+'</svg>';
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
