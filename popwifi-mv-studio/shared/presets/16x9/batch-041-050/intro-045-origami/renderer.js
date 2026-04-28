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
  const c='#c0b8e8';const crane=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#sf)"><path d="M0,40 L20,0 L40,40 L30,30 L20,60 L10,30 Z" stroke="${c}" stroke-width="1.2" fill="rgba(192,184,232,0.08)" opacity="0.65"/><path d="M0,40 L20,40" stroke="${c}" stroke-width="0.8" opacity="0.40"/><path d="M20,0 L20,40" stroke="${c}" stroke-width="0.6" opacity="0.35"/></g>`;const fold=`<line x1="170" y1="24" x2="730" y2="24" stroke="${c}" stroke-width="0.5" opacity="0.28" stroke-dasharray="8 5"/><line x1="170" y1="482" x2="730" y2="482" stroke="${c}" stroke-width="0.5" opacity="0.28" stroke-dasharray="8 5"/>`;return rectFrame(c,'rgba(185,180,230,0.24)',crane(26,26,1,1)+crane(834,26,-1,1)+crane(26,420,-1,-1)+crane(834,420,1,-1)+fold)
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<10;i++){const el=document.createElement('div');const s=8+Math.random()*10,x=Math.random()*100,dur=7+Math.random()*8,del=-(Math.random()*dur),sx=(Math.random()-0.5)*60,r0=Math.random()*360,op=0.15+Math.random()*0.22;el.style.cssText=`position:absolute;left:${x}%;top:-20px;opacity:0;animation:ogF${i} ${dur}s ${del}s linear infinite;pointer-events:none;`;el.innerHTML=`<style>@keyframes ogF${i}{0%{opacity:0;transform:rotate(${r0}deg);}10%{opacity:${op};}88%{opacity:${op};}100%{opacity:0;transform:translateY(540px) translateX(${sx}px) rotate(${r0+180}deg);}}</style><svg width="${s}" height="${s}" viewBox="0 0 20 20"><path d="M10,2 L18,18 L14,14 L10,22 L6,14 L2,18 Z" fill="rgba(192,184,232,0.6)" stroke="rgba(160,155,210,0.4)" stroke-width="0.8"/></svg>`;l.appendChild(el);}
}

function buildEq() {
  return eqBase(9,11,48,(x,H,i)=>{const c=`hsl(${238+i*8},50%,${55+i*3}%)`;return `<path d="M${x},${H} L${x-6},${H-H*0.35} L${x},${H*0.08} L${x+6},${H-H*0.35} Z" fill="${c}" opacity="0.72"/><path d="M${x},${H} L${x},${H*0.08}" stroke="${c}" stroke-width="0.6" opacity="0.40"/>`;});
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
