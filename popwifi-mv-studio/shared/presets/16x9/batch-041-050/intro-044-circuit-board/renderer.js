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
  const c='#00e8a0';const node=(x,y)=>`<circle cx="${x}" cy="${y}" r="4" fill="${c}" opacity="0.65"/><circle cx="${x}" cy="${y}" r="7" stroke="${c}" stroke-width="0.8" fill="none" opacity="0.35"/>`;const trace=(x1,y1,x2,y2,elbow)=>{const mid=elbow==='h'?`L${x2},${y1}`:`L${x1},${y2}`;return `<path d="M${x1},${y1} ${mid} L${x2},${y2}" stroke="${c}" stroke-width="1.2" fill="none" opacity="0.55"/>`;};return `<defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c}" stop-opacity="0.82"/><stop offset="100%" stop-color="${c}" stop-opacity="0.50"/></linearGradient><filter id="sf"><feGaussianBlur stdDeviation="0.5"/></filter><filter id="glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <rect x="24" y="24" width="852" height="458" stroke="${c}" stroke-width="1" fill="none" opacity="0.45"/>
    ${node(24,24)}${node(876,24)}${node(24,482)}${node(876,482)}
    ${node(150,24)}${node(400,24)}${node(650,24)}${node(150,482)}${node(400,482)}${node(650,482)}
    ${node(24,150)}${node(24,300)}${node(876,150)}${node(876,300)}
    ${trace(24,24,150,24,'h')}${trace(150,24,400,24,'h')}${trace(400,24,650,24,'h')}${trace(650,24,876,24,'h')}
    ${trace(24,24,24,150,'v')}${trace(24,150,24,300,'v')}${trace(24,300,24,482,'v')}
    ${trace(876,24,876,150,'v')}${trace(876,150,876,300,'v')}${trace(876,300,876,482,'v')}
    ${trace(150,24,150,80,'v')}${trace(650,24,650,80,'v')}${trace(150,482,150,422,'v')}`;
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<12;i++){const el=document.createElement('div');const x=Math.random()*100,y=Math.random()*100,dur=0.6+Math.random()*0.8,del=-(Math.random()*2);el.style.cssText=`position:absolute;left:${x}%;top:${y}%;pointer-events:none;`;el.innerHTML=`<svg width="8" height="8"><circle cx="4" cy="4" r="3" fill="rgba(0,232,160,0.6)"><animate attributeName="opacity" values="0.1;0.8;0.1" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/><animate attributeName="r" values="2;4;2" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></circle></svg>`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,n=8,durs=[0.26,0.40,0.32,0.48,0.28,0.44,0.36,0.52];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}"><defs><filter id="cc_glow"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;for(let i=0;i<n;i++){const x=3+i*12,h=12+i%4*10,an=`cc${_ID()}`;svg+=`<style>@keyframes ${an}{0%{transform:scaleY(0.1);}100%{transform:scaleY(1);}}</style><path d="M${x},${svgH} L${x},${svgH-h*0.3} L${x+4},${svgH-h*0.3} L${x+4},${svgH-h*0.7} L${x+8},${svgH-h*0.7} L${x+8},${svgH}" stroke="rgba(0,232,160,0.72)" stroke-width="1.5" fill="none" filter="url(#cc_glow)" style="animation:${an} ${durs[i]}s ease-in-out infinite alternate;transform-origin:${x+4}px ${svgH}px;transform-box:fill-box;"/>`;}return svg+'</svg>';
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
