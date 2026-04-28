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
  const c='#f0c040';const light=(x,y,r,op,h)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="hsl(${h},85%,60%)" opacity="${op}" filter="url(#bk_glow)"/>`;return `<defs><filter id="bk_glow"><feGaussianBlur stdDeviation="12"/></filter><filter id="sf"><feGaussianBlur stdDeviation="0.5"/></filter><filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c}" stop-opacity="0.85"/><stop offset="100%" stop-color="${c}" stop-opacity="0.52"/></linearGradient></defs>
    ${light(50,50,40,0.18,45)}${light(830,50,35,0.16,330)}${light(50,460,38,0.16,270)}${light(830,460,42,0.17,60)}
    <rect x="24" y="24" width="852" height="458" stroke="${c}" stroke-width="1.8" fill="none" opacity="0.72" filter="url(#glow)"/>
    <rect x="34" y="34" width="832" height="438" stroke="${c}" stroke-width="0.6" fill="none" opacity="0.32"/>`;
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<16;i++){const el=document.createElement('div');const s=10+Math.random()*20,x=Math.random()*100,y=Math.random()*100,dur=2+Math.random()*4,del=-(Math.random()*dur),h=30+Math.random()*60;el.style.cssText=`position:absolute;left:${x}%;top:${y}%;pointer-events:none;`;el.innerHTML=`<svg width="${s*2}" height="${s*2}"><circle cx="${s}" cy="${s}" r="${s}" fill="hsl(${h},85%,62%)" opacity="0"><animate attributeName="opacity" values="0;0.18;0" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/><animate attributeName="r" values="${s};${s*1.5};${s}" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></circle></svg>`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,n=8,durs=[0.30,0.46,0.36,0.54,0.32,0.50,0.42,0.58];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}"><defs><filter id="bkeq"><feGaussianBlur stdDeviation="2"/></filter></defs>`;for(let i=0;i<n;i++){const x=4+i*12,r=5+i%3*3,h=35+i*5,an=`bk${_ID()}`;svg+=`<style>@keyframes ${an}{0%{transform:scale(0.1);}100%{transform:scale(1);}}</style><circle cx="${x+4}" cy="${svgH-r}" r="${r}" fill="hsl(${h},80%,58%)" opacity="0.72" filter="url(#bkeq)" style="animation:${an} ${durs[i]}s ease-in-out infinite alternate;transform-origin:${x+4}px ${svgH-r}px;transform-box:fill-box;"/>`;}return svg+'</svg>';
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
