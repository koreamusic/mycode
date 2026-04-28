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
  const c='#4868c0';const keys=`<g filter="url(#sf)">${[24,36,48,60,72,84,96,108,120].map((x,i)=>`<rect x="${x}" y="24" width="10" height="28" rx="1" fill="${c}" opacity="${0.45+i*0.03}" stroke="${c}" stroke-width="0.5"/>`).join('')}${[30,42,66,78,102].map(x=>`<rect x="${x}" y="24" width="6" height="17" rx="1" fill="${c}" opacity="0.65"/>`).join('')}${[752,764,776,788,800,812,824,836,848].map((x,i)=>`<rect x="${x}" y="24" width="10" height="28" rx="1" fill="${c}" opacity="${0.45+i*0.03}" stroke="${c}" stroke-width="0.5"/>`).join('')}${[758,770,794,806,830].map(x=>`<rect x="${x}" y="24" width="6" height="17" rx="1" fill="${c}" opacity="0.65"/>`).join('')}${[24,36,48,60,72,84,96,108,120].map((x,i)=>`<rect x="${x}" y="454" width="10" height="28" rx="1" fill="${c}" opacity="${0.45+i*0.03}" stroke="${c}" stroke-width="0.5"/>`).join('')}${[752,764,776,788,800,812,824,836,848].map((x,i)=>`<rect x="${x}" y="454" width="10" height="28" rx="1" fill="${c}" opacity="${0.45+i*0.03}" stroke="${c}" stroke-width="0.5"/>`).join('')}</g>`;return rectFrame(c,'rgba(70,110,200,0.28)',keys+`<line x1="155" y1="24" x2="745" y2="24" stroke="url(#fg)" stroke-width="0.5" opacity="0.28"/><line x1="155" y1="482" x2="745" y2="482" stroke="url(#fg)" stroke-width="0.5" opacity="0.28"/><line x1="24" y1="52" x2="24" y2="454" stroke="${c}" stroke-width="1.5" opacity="0.55"/><line x1="876" y1="52" x2="876" y2="454" stroke="${c}" stroke-width="1.5" opacity="0.55"/>`)
}

function buildParticles(l) {
  l.innerHTML='';const c=['#4868c0','#6888e0','#8090d8'];for(let i=0;i<12;i++){const el=document.createElement('div');const s=4+Math.random()*4,x=Math.random()*100,y=Math.random()*60,dur=3+Math.random()*3,del=-(Math.random()*dur);el.style.cssText=`position:absolute;left:${x}%;top:${y}%;pointer-events:none;`;el.innerHTML=`<svg width="${s*3}" height="${s*5}"><rect x="${s}" y="0" width="${s}" height="${s*4}" rx="1" fill="${c[i%3]}" opacity="0.4"><animate attributeName="height" values="${s*4};${s*2.5};${s*4}" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.2;0.5;0.2" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></rect></svg>`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,n=9,durs=[0.28,0.44,0.36,0.52,0.32,0.48,0.40,0.56,0.38];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;for(let i=0;i<n;i++){const x=4+i*11,h=14+i%4*9,an=`pb${_ID()}`;svg+=`<style>@keyframes ${an}{0%{scaleY:0.2;}100%{scaleY:1;}}</style><rect x="${x}" y="${svgH-h}" width="8" height="${h}" rx="1" fill="rgba(72,104,192,0.78)" style="animation:${_ID()}_k ${durs[i]}s ease-in-out infinite alternate;transform-origin:bottom;transform-box:fill-box;"/>${h>24?`<rect x="${x+1}" y="${svgH-h}" width="3" height="${h*0.55}" rx="0.5" fill="rgba(72,104,192,0.95)"/>`:''}`;} return svg+'</svg>';
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
