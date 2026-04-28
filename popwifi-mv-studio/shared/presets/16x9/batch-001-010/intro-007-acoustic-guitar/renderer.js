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
  const c='#c89040';const staffLines=`<g opacity="0.35">${[2,1,0,-1,-2].map((_,i)=>`<line x1="140" y1="${26+i*6}" x2="760" y2="${26+i*6}" stroke="${c}" stroke-width="0.6" opacity="0.5"/>`).join('')}${[2,1,0,-1,-2].map((_,i)=>`<line x1="140" y1="${480-i*6}" x2="760" y2="${480-i*6}" stroke="${c}" stroke-width="0.6" opacity="0.5"/>`).join('')}</g>`;const pick=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#sf)"><path d="M26,0 C38,0 50,12 50,28 C50,44 38,58 26,68 C14,58 2,44 2,28 C2,12 14,0 26,0 Z" stroke="${c}" stroke-width="1.5" fill="rgba(200,144,64,0.1)" opacity="0.72"/><circle cx="26" cy="28" r="4" fill="${c}" opacity="0.6"/></g>`;return rectFrame(c,'rgba(200,150,60,0.28)',staffLines+pick(26,24,1,1)+pick(848,24,-1,1)+pick(26,442,-1,-1)+pick(848,442,1,-1));
}

function buildParticles(l) {
  l.innerHTML='';const notes=['♩','♪','♫','♬'];for(let i=0;i<12;i++){const el=document.createElement('div');const s=10+Math.random()*12,dur=7+Math.random()*8,del=-(Math.random()*dur),x=Math.random()*100,sx=(Math.random()-0.5)*70,op=0.12+Math.random()*0.22;el.style.cssText=`position:absolute;left:${x}%;top:-20px;font-size:${s}px;color:#c89040;opacity:${op};animation:gN${i} ${dur}s ${del}s linear infinite;pointer-events:none;`;el.innerHTML=`<style>@keyframes gN${i}{0%{opacity:0;}8%{opacity:${op};}88%{opacity:${op};}100%{opacity:0;transform:translateY(540px) translateX(${sx}px);}}</style>${notes[i%4]}`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,strings=6,colors=['#d4a843','#c89830','#b88420','#a87010','#987000','#886000'],durs=[0.22,0.28,0.19,0.34,0.25,0.31],amps=[7,5.5,8,4.5,6.5,5];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}"><rect x="0" y="0" width="${svgW}" height="${svgH}" rx="4" fill="rgba(28,16,6,0.6)" stroke="rgba(180,130,40,0.3)" stroke-width="1"/>`;for(let i=0;i<strings;i++){const y=(i+1)*(svgH/(strings+1)),an=`gs${_ID()}`,amp=amps[i],mid=svgW/2,thick=0.8+i*0.22;svg+=`<style>@keyframes ${an}{0%{d:path("M 0 ${y} Q ${mid} ${y-amp} ${svgW} ${y}");}50%{d:path("M 0 ${y} Q ${mid} ${y+amp} ${svgW} ${y}");}100%{d:path("M 0 ${y} Q ${mid} ${y-amp*0.4} ${svgW} ${y}");}}</style><path d="M 0 ${y} Q ${mid} ${y-amp} ${svgW} ${y}" stroke="${colors[i]}" stroke-width="${thick}" fill="none" opacity="0.88" style="animation:${an} ${durs[i]}s ease-in-out infinite;"/>`;}return svg+'</svg>';
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
