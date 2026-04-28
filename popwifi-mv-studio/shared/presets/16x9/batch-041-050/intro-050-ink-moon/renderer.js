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
  const c='#c0b8e0';const moonGlow=`<circle cx="450" cy="253" r="90" fill="rgba(192,184,224,0.04)" filter="url(#moon_blur)"/><circle cx="450" cy="253" r="65" stroke="${c}" stroke-width="0.8" fill="none" opacity="0.18"/><circle cx="450" cy="253" r="100" stroke="${c}" stroke-width="0.4" fill="none" opacity="0.10"/>`;const bamboo=(x,h)=>`<g filter="url(#sf)"><rect x="${x}" y="${506-h}" width="3" height="${h}" rx="1.5" fill="${c}" opacity="0.20"/>${Array.from({length:Math.floor(h/30)},(_,i)=>`<rect x="${x-4}" y="${506-h+i*30+12}" width="11" height="3" rx="1.5" fill="${c}" opacity="0.16"/>`).join('')}</g>`;return `<defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c}" stop-opacity="0.78"/><stop offset="100%" stop-color="${c}" stop-opacity="0.45"/></linearGradient><filter id="sf"><feGaussianBlur stdDeviation="0.6"/></filter><filter id="glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="moon_blur"><feGaussianBlur stdDeviation="20"/></filter></defs>
    ${moonGlow}
    ${bamboo(36,420)}${bamboo(52,360)}${bamboo(840,440)}${bamboo(856,380)}
    <rect x="24" y="24" width="852" height="458" stroke="${c}" stroke-width="1.5" fill="none" opacity="0.50"/>
    <rect x="32" y="32" width="836" height="442" stroke="${c}" stroke-width="0.5" fill="none" opacity="0.22"/>
    <line x1="170" y1="24" x2="730" y2="24" stroke="url(#fg)" stroke-width="0.5" opacity="0.30"/>
    <line x1="170" y1="482" x2="730" y2="482" stroke="url(#fg)" stroke-width="0.5" opacity="0.30"/>`;
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<18;i++){const el=document.createElement('div');const s=1.5+Math.random()*3,x=Math.random()*100,y=Math.random()*100,dur=1+Math.random()*3,del=-(Math.random()*dur);el.style.cssText=`position:absolute;left:${x}%;top:${y}%;pointer-events:none;`;el.innerHTML=`<svg width="${s*4}" height="${s*4}"><circle cx="${s*2}" cy="${s*2}" r="${s}" fill="rgba(192,184,224,0.65)"><animate attributeName="opacity" values="0.1;0.8;0.1" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></circle></svg>`;l.appendChild(el);}
}

function buildEq() {
  return eqBase(9,11,48,(x,H,i)=>{const c=`hsl(${240+i*10},42%,${52+i*3}%)`;return `<ellipse cx="${x}" cy="${H/2}" rx="4" ry="${H*0.45}" fill="${c}" opacity="0.70"/><ellipse cx="${x}" cy="${H/2}" rx="2" ry="${H*0.28}" fill="${c}" opacity="0.40" transform="translate(5,0)"/><ellipse cx="${x}" cy="${H/2}" rx="1.5" ry="${H*0.18}" fill="rgba(255,255,255,0.12)"/>`;});
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
