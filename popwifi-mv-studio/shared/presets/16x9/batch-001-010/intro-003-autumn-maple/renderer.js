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
  const c='#d4701a';const leaf=(x,y,op,rot)=>`<path d="M${x},${y} L${x-4},${y-14} L${x-9},${y-10} L${x-12},${y-22} L${x-6},${y-18} L${x-2},${y-32} L${x},${y-26} L${x+2},${y-32} L${x+6},${y-18} L${x+12},${y-22} L${x+9},${y-10} L${x+4},${y-14} Z" fill="${c}" opacity="${op}" transform="rotate(${rot||0},${x},${y})"/>`;const corner=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#sf)"><path d="M0,100 Q42,55 80,26" stroke="url(#fg)" stroke-width="1.2" opacity="0.6" fill="none"/>${leaf(38,78,0.72,-20)}${leaf(52,58,0.68,-45)}${leaf(66,42,0.70,-10)}${leaf(76,30,0.65,20)}${leaf(26,55,0.55,15)}</g>`;return rectFrame(c,'rgba(210,120,40,0.3)',corner(26,26,1,1)+corner(874,26,-1,1)+corner(26,480,1,-1)+corner(874,480,-1,-1)+`<line x1="180" y1="24" x2="720" y2="24" stroke="url(#fg)" stroke-width="0.5" opacity="0.28"/><line x1="180" y1="482" x2="720" y2="482" stroke="url(#fg)" stroke-width="0.5" opacity="0.28"/>`);
}

function buildParticles(l) {
  l.innerHTML='';const colors=['#d4701a','#e08030','#c44010','#f07828'];for(let i=0;i<18;i++){const el=document.createElement('div');const s=8+Math.random()*10,dur=6+Math.random()*7,del=-(Math.random()*dur),x=Math.random()*100,sx=(Math.random()-0.5)*100,r0=Math.random()*360,op=0.35+Math.random()*0.4;el.style.cssText=`position:absolute;left:${x}%;top:-20px;opacity:0;animation:mF${i} ${dur}s ${del}s linear infinite;pointer-events:none;`;el.innerHTML=`<style>@keyframes mF${i}{0%{opacity:0;transform:translateY(-20px) rotate(${r0}deg);}8%{opacity:${op};}88%{opacity:${op};}100%{opacity:0;transform:translateY(540px) translateX(${sx}px) rotate(${r0+200}deg);}}</style><svg width="${s}" height="${s}" viewBox="0 0 20 20"><path d="M10,18 L6,6 L2,10 L0,2 L4,6 L8,0 L10,5 L12,0 L16,6 L20,2 L18,10 L14,6 Z" fill="${colors[i%4]}" opacity="0.9"/></svg>`;l.appendChild(el);}
}

function buildEq() {
  return eqBase(10,13,46,(x,H,i)=>{const c=`hsl(${18+i*4},78%,${40+i*3}%)`;return `<path d="M${x},${H} L${x-5},${H-18} L${x-10},${H-12} L${x-13},${H-28} L${x-7},${H-22} L${x-3},${H-40} L${x},${H-34} L${x+3},${H-40} L${x+7},${H-22} L${x+13},${H-28} L${x+10},${H-12} L${x+5},${H-18} Z" fill="${c}" opacity="0.82"/>`;});
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
