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
  const c='#8080c0';const staff=(y)=>Array.from({length:5},(_,i)=>`<line x1="24" y1="${y+i*7}" x2="876" y2="${y+i*7}" stroke="${c}" stroke-width="0.8" opacity="${0.45-i*0.04}"/>`).join('');const clef=`<text x="30" y="56" font-size="36" fill="${c}" opacity="0.50" font-family="serif">𝄞</text><text x="30" y="468" font-size="36" fill="${c}" opacity="0.50" font-family="serif">𝄞</text>`;return `<defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c}" stop-opacity="0.78"/><stop offset="100%" stop-color="${c}" stop-opacity="0.45"/></linearGradient><filter id="sf"><feGaussianBlur stdDeviation="0.5"/></filter><filter id="glow"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    ${staff(24)}${staff(454)}${clef}
    <line x1="24" y1="24" x2="24" y2="58" stroke="${c}" stroke-width="2" opacity="0.65"/>
    <line x1="876" y1="24" x2="876" y2="58" stroke="${c}" stroke-width="2" opacity="0.65"/>
    <line x1="24" y1="454" x2="24" y2="488" stroke="${c}" stroke-width="2" opacity="0.65"/>
    <line x1="876" y1="454" x2="876" y2="488" stroke="${c}" stroke-width="2" opacity="0.65"/>`;
}

function buildParticles(l) {
  l.innerHTML='';const notes=['♩','♪','♫','♬','𝄞'];for(let i=0;i<10;i++){const el=document.createElement('div');const s=10+Math.random()*14,x=Math.random()*100,dur=7+Math.random()*8,del=-(Math.random()*dur),sx=(Math.random()-0.5)*60,op=0.12+Math.random()*0.20;el.style.cssText=`position:absolute;left:${x}%;top:-20px;font-size:${s}px;color:#8080c0;opacity:${op};animation:scF${i} ${dur}s ${del}s linear infinite;pointer-events:none;`;el.innerHTML=`<style>@keyframes scF${i}{0%{opacity:0;}10%{opacity:${op};}88%{opacity:${op};}100%{opacity:0;transform:translateY(540px) translateX(${sx}px);}}</style>${notes[i%5]}`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,n=5;let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;for(let i=0;i<n;i++){const y=6+i*9,h=10+i*4,an=`sc${_ID()}`;svg+=`<style>@keyframes ${an}{0%{transform:scaleX(0.1);}100%{transform:scaleX(1);}}</style><line x1="5" y1="${y}" x2="${svgW-5}" y2="${y}" stroke="rgba(128,128,192,${0.5-i*0.05})" stroke-width="0.8" style="animation:${an} ${0.3+i*0.1}s ease-in-out infinite alternate;transform-origin:5px ${y}px;transform-box:fill-box;"/><ellipse cx="${20+i*15}" cy="${y+2}" rx="5" ry="3.5" fill="rgba(128,128,192,0.65)" transform="rotate(-20,${20+i*15},${y+2})"><animate attributeName="cy" values="${y+2};${y-4};${y+2}" dur="${0.4+i*0.1}s" repeatCount="indefinite"/></ellipse>`;} return svg+'</svg>';
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
