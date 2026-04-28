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
  const c='#7090b8';
    // 창문 프레임
    return `<defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c}" stop-opacity="0.88"/><stop offset="100%" stop-color="${c}" stop-opacity="0.55"/></linearGradient><filter id="sf"><feGaussianBlur stdDeviation="0.6"/></filter><filter id="glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <rect x="24" y="24" width="852" height="458" stroke="${c}" stroke-width="2.2" fill="none" opacity="0.65" rx="2"/>
    <rect x="34" y="34" width="832" height="438" stroke="${c}" stroke-width="0.6" fill="none" opacity="0.3" rx="1"/>
    <line x1="450" y1="24" x2="450" y2="482" stroke="${c}" stroke-width="2.2" opacity="0.62"/>
    <line x1="24" y1="253" x2="876" y2="253" stroke="${c}" stroke-width="2.2" opacity="0.62"/>
    <line x1="24" y1="24" x2="34" y2="34" stroke="${c}" stroke-width="1" opacity="0.45"/>
    <line x1="876" y1="24" x2="866" y2="34" stroke="${c}" stroke-width="1" opacity="0.45"/>
    <line x1="24" y1="482" x2="34" y2="472" stroke="${c}" stroke-width="1" opacity="0.45"/>
    <line x1="876" y1="482" x2="866" y2="472" stroke="${c}" stroke-width="1" opacity="0.45"/>`;
}

function buildParticles(l) {
  l.innerHTML='';l.innerHTML=`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 900 506">${Array.from({length:30},(_,i)=>{const x=Math.random()*900,dur=0.5+Math.random()*0.8,del=Math.random()*3,len=8+Math.random()*12;return `<line x1="${x}" y1="0" x2="${x-3}" y2="${len}" stroke="rgba(112,144,184,0.35)" stroke-width="${0.6+Math.random()*0.6}"><animateTransform attributeName="transform" type="translate" values="0,0;-4,506" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></line>`;}).join('')}</svg>`;
}

function buildEq() {
  const svgW=100,svgH=48,n=7,durs=[0.38,0.52,0.44,0.36,0.58,0.42,0.48];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;
    for(let i=0;i<n;i++){const x=6+i*13,an=`rd${_ID()}`;svg+=`<style>@keyframes ${an}{0%{transform:scaleY(0.2);}100%{transform:scaleY(1);}}</style><path d="M${x},${svgH} L${x-3},${svgH*0.35} Q${x},${svgH*0.08} ${x+3},${svgH*0.35} Z" fill="rgba(112,144,184,0.72)" style="animation:${an} ${durs[i]}s ease-in-out infinite alternate;transform-origin:bottom;transform-box:fill-box;"/>`;}
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
