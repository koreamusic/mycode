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
  const c='#d4a030';const hex=(cx,cy,r,op)=>{const pts=Array.from({length:6},(_,i)=>{const a=i*Math.PI/3-Math.PI/6;return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;}).join(' ');return `<polygon points="${pts}" stroke="${c}" stroke-width="1.1" fill="rgba(212,160,48,0.06)" opacity="${op}"/>`;};const cluster=(tx,ty)=>`<g transform="translate(${tx},${ty})">${hex(0,0,22,0.65)}${hex(38,0,18,0.52)}${hex(19,33,18,0.48)}${hex(-20,32,14,0.42)}</g>`;return rectFrame(c,'rgba(210,160,50,0.28)',cluster(30,28)+cluster(820,28)+cluster(30,440)+cluster(820,440)+`<line x1="130" y1="24" x2="770" y2="24" stroke="url(#fg)" stroke-width="0.5" opacity="0.30"/><line x1="130" y1="482" x2="770" y2="482" stroke="url(#fg)" stroke-width="0.5" opacity="0.30"/>`)
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<10;i++){const el=document.createElement('div');const s=5+Math.random()*7,x=Math.random()*100,y=Math.random()*100,dur=3+Math.random()*4,del=-(Math.random()*dur);el.style.cssText=`position:absolute;left:${x}%;top:${y}%;pointer-events:none;`;const pts=Array.from({length:6},(_,j)=>{const a=j*Math.PI/3-Math.PI/6;return `${s+s*Math.cos(a)},${s+s*Math.sin(a)}`;}).join(' ');el.innerHTML=`<svg width="${s*2}" height="${s*2}"><polygon points="${pts}" fill="rgba(212,160,48,0.35)"><animate attributeName="opacity" values="0.1;0.5;0.1" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></polygon></svg>`;l.appendChild(el);}
}

function buildEq() {
  return eqBase(9,11,48,(x,H,i)=>{const c=`hsl(${40+i*5},72%,${45+i*3}%)`;const pts=[[x,H*0.05],[x+5,H*0.3],[x+5,H],[x-5,H],[x-5,H*0.3]].map(p=>p.join(',')).join(' ');return `<polygon points="${pts}" fill="${c}" opacity="0.78"/>`;});
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
