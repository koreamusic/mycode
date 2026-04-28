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
  const c='#c09050';const n=30,sz=14,top=24,bot=482,lft=24,rgt=876,W=852,H=458;let s='';for(let i=0;i<Math.floor(W/sz);i++){const x=lft+i*sz+sz/2;s+=`<semicircle/>`;s+=`<path d="M${x-sz/2},${top} A${sz/2},${sz/2} 0 0,1 ${x+sz/2},${top}" stroke="${c}" stroke-width="1.4" fill="none" opacity="0.72"/>`;s+=`<path d="M${x-sz/2},${bot} A${sz/2},${sz/2} 0 0,0 ${x+sz/2},${bot}" stroke="${c}" stroke-width="1.4" fill="none" opacity="0.72"/>`;}for(let i=0;i<Math.floor(H/sz);i++){const y=top+i*sz+sz/2;s+=`<path d="M${lft},${y-sz/2} A${sz/2},${sz/2} 0 0,0 ${lft},${y+sz/2}" stroke="${c}" stroke-width="1.4" fill="none" opacity="0.70"/>`;s+=`<path d="M${rgt},${y-sz/2} A${sz/2},${sz/2} 0 0,1 ${rgt},${y+sz/2}" stroke="${c}" stroke-width="1.4" fill="none" opacity="0.70"/>`;}return `<defs><filter id="sf"><feGaussianBlur stdDeviation="0.5"/></filter><filter id="glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect x="24" y="24" width="852" height="458" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.20"/>${s}`;
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<6;i++){const el=document.createElement('div');const s=3+Math.random()*3,x=Math.random()*100,y=Math.random()*100,dur=4+Math.random()*4,del=-(Math.random()*dur);el.style.cssText=`position:absolute;left:${x}%;top:${y}%;pointer-events:none;`;el.innerHTML=`<svg width="${s*4}" height="${s*4}"><rect x="${s}" y="${s}" width="${s*2}" height="${s*2}" rx="${s*0.3}" stroke="rgba(192,144,80,0.35)" stroke-width="0.8" fill="none"><animate attributeName="opacity" values="0.1;0.5;0.1" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></rect></svg>`;l.appendChild(el);}
}

function buildEq() {
  return eqBase(8,13,48,(x,H,i)=>{const c=`hsl(${35+i*5},65%,${42+i*3}%)`;return `<rect x="${x-5}" y="${H*0.1}" width="10" height="${H*0.9}" rx="2" fill="${c}" opacity="0.7"/>`;});
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
