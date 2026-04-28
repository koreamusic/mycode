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
  const c='#40c060';const morse=(y,pattern)=>{let x=26;let s='';pattern.forEach(p=>{if(p==='.'){s+=`<circle cx="${x+4}" cy="${y}" r="4" fill="${c}" opacity="0.60"/>`;x+=14;}else if(p==='-'){s+=`<rect x="${x}" y="${y-4}" width="20" height="8" rx="4" fill="${c}" opacity="0.60"/>`;x+=28;}else x+=10;});return s;};return `<defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c}" stop-opacity="0.82"/><stop offset="100%" stop-color="${c}" stop-opacity="0.50"/></linearGradient><filter id="sf"><feGaussianBlur stdDeviation="0.5"/></filter><filter id="glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <rect x="24" y="24" width="852" height="458" stroke="${c}" stroke-width="1.2" fill="none" opacity="0.50"/>
    ${morse(24,['.','.','-','.','.','.','-','-','.','.','.','-'])}
    ${morse(482,['-','.','.','-','.','.','-','.','.','.','-','.'])}
    <line x1="24" y1="34" x2="24" y2="472" stroke="${c}" stroke-width="1.2" opacity="0.50" stroke-dasharray="6 4"/>
    <line x1="876" y1="34" x2="876" y2="472" stroke="${c}" stroke-width="1.2" opacity="0.50" stroke-dasharray="6 4"/>`;
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<14;i++){const el=document.createElement('div');const s=Math.random()>0.5?8:3,w=s===3?8:20,x=Math.random()*100,y=Math.random()*100,dur=0.5+Math.random()*1,del=-(Math.random()*2);el.style.cssText=`position:absolute;left:${x}%;top:${y}%;pointer-events:none;`;el.innerHTML=`<svg width="${w}" height="6"><rect x="0" y="1" width="${w}" height="4" rx="2" fill="rgba(64,192,96,0.55)"><animate attributeName="opacity" values="0.1;0.7;0.1" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></rect></svg>`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,morse=[1,0,1,1,1,0,1,0,1,1];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;morse.forEach((m,i)=>{const x=3+i*10,w=m?16:6,h=14+i%3*14,an=`mr${_ID()}`;svg+=`<style>@keyframes ${an}{0%{transform:scaleY(0.1);}100%{transform:scaleY(1);}}</style><rect x="${x}" y="${svgH-h}" width="${w}" height="${h}" rx="${w/2}" fill="rgba(64,192,96,0.72)" style="animation:${an} ${0.3+i*0.08}s ease-in-out infinite alternate;transform-origin:${x+w/2}px ${svgH}px;transform-box:fill-box;"/>`;});return svg+'</svg>';
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
