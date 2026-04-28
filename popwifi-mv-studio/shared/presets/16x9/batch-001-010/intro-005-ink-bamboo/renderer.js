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
  const c='#8aaa80';const brushRect=`<g filter="url(#sf)"><path d="M30,26 Q200,22 450,24 Q700,22 874,26" stroke="${c}" stroke-width="2.5" fill="none" opacity="0.7" stroke-linecap="round"/><path d="M874,26 Q878,200 876,480" stroke="${c}" stroke-width="2.5" fill="none" opacity="0.65" stroke-linecap="round"/><path d="M874,480 Q600,484 350,482 Q150,484 26,480" stroke="${c}" stroke-width="2.5" fill="none" opacity="0.7" stroke-linecap="round"/><path d="M26,480 Q22,300 24,26" stroke="${c}" stroke-width="2.5" fill="none" opacity="0.65" stroke-linecap="round"/>${[[26,26],[874,26],[26,480],[874,480]].map(([tx,ty],i)=>{const sx=i%2===0?1:-1,sy=i<2?1:-1;return `<g transform="translate(${tx},${ty}) scale(${sx},${sy})"><rect x="0" y="0" width="9" height="36" rx="2.5" fill="${c}" opacity="0.55"/><rect x="-1" y="32" width="11" height="4" rx="1.5" fill="${c}" opacity="0.75"/><rect x="0" y="36" width="9" height="28" rx="2.5" fill="${c}" opacity="0.45"/><path d="M9,18 Q22,12 28,22" stroke="${c}" stroke-width="1.2" fill="none" opacity="0.5"/></g>`;}).join('')}</g>`;return `<defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c}" stop-opacity="0.88"/><stop offset="100%" stop-color="${c}" stop-opacity="0.58"/></linearGradient><filter id="sf"><feGaussianBlur stdDeviation="0.8"/></filter><filter id="glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>${brushRect}`;
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<8;i++){const el=document.createElement('div');const s=10+Math.random()*8,x=Math.random()*100,dur=8+Math.random()*8,del=-(Math.random()*dur),sx=(Math.random()-0.5)*60;el.style.cssText=`position:absolute;left:${x}%;top:-20px;opacity:0;animation:bF${i} ${dur}s ${del}s ease-in infinite;pointer-events:none;`;el.innerHTML=`<style>@keyframes bF${i}{0%{opacity:0;}10%{opacity:0.6;}85%{opacity:0.5;}100%{opacity:0;transform:translateY(540px) translateX(${sx}px) rotate(${(Math.random()-0.5)*80}deg);}}</style><svg width="${s*2}" height="${s}" viewBox="0 0 20 10"><ellipse cx="10" cy="5" rx="9" ry="4.5" fill="rgba(100,140,80,0.75)"/><line x1="1" y1="5" x2="19" y2="5" stroke="#6a8a60" stroke-width="0.8" opacity="0.5"/></svg>`;l.appendChild(el);}
}

function buildEq() {
  return eqBase(8,15,48,(x,H,i)=>{const c=`hsl(${115+i*5},40%,${38+i*4}%)`;let s='';const segs=4,sh=H/segs;for(let j=0;j<segs;j++){const y=H-(j+1)*sh;s+=`<rect x="${x-4}" y="${y}" width="8" height="${sh-3}" rx="1.5" fill="${c}" opacity="${0.6+j*0.08}"/><rect x="${x-5}" y="${y+sh-4}" width="10" height="4" rx="1.5" fill="${c}" opacity="0.85"/>`;}s+=`<path d="M${x+4},${H*0.35} Q${x+18},${H*0.22} ${x+24},${H*0.32}" stroke="${c}" stroke-width="1.2" fill="none" opacity="0.55"/>`;return s;});
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
