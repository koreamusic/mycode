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
  const c='#30a060';const strings=4;const corner=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#sf)"><rect x="0" y="0" width="60" height="100" rx="4" stroke="${c}" stroke-width="1.2" fill="rgba(48,160,96,0.06)" opacity="0.65"/>${Array.from({length:strings},(_,i)=>`<line x1="10" y1="${15+i*18}" x2="50" y2="${15+i*18}" stroke="${c}" stroke-width="${1.4-i*0.2}" opacity="${0.6-i*0.08}"/>`).join('')}${[20,30,40,50,60].map(f=>`<line x1="${f}" y1="0" x2="${f}" y2="100" stroke="${c}" stroke-width="0.5" opacity="0.22"/>`).join('')}</g>`;return rectFrame(c,'rgba(40,160,90,0.26)',corner(26,26,1,1)+corner(790,26,-1,1)+corner(26,382,-1,-1)+corner(790,382,1,-1)+`<line x1="115" y1="24" x2="785" y2="24" stroke="url(#fg)" stroke-width="0.5" opacity="0.26"/><line x1="115" y1="482" x2="785" y2="482" stroke="url(#fg)" stroke-width="0.5" opacity="0.26"/>`)
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<6;i++){const el=document.createElement('div');const x=10+Math.random()*80,w=60+Math.random()*80,dur=0.4+Math.random()*0.4,del=-(Math.random()*2);el.style.cssText=`position:absolute;left:${x}%;top:${20+Math.random()*60}%;pointer-events:none;`;el.innerHTML=`<svg width="${w}" height="4"><line x1="0" y1="2" x2="${w}" y2="2" stroke="rgba(48,160,96,0.4)" stroke-width="1.5"><animate attributeName="stroke-dashoffset" values="${w};0;${w}" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/><animate attributeName="stroke-dasharray" values="${w/4} ${w};${w/2} ${w/2};${w/4} ${w}" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></line></svg>`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,strings=4,durs=[0.35,0.50,0.40,0.55];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;for(let i=0;i<strings;i++){const y=8+i*(svgH/strings),an=`bl${_ID()}`,amp=5+i*2;svg+=`<style>@keyframes ${an}{0%{d:path("M 0 ${y} Q 50 ${y-amp} 100 ${y}");}50%{d:path("M 0 ${y} Q 50 ${y+amp} 100 ${y}");}100%{d:path("M 0 ${y} Q 50 ${y-amp*0.5} 100 ${y}");}}</style><path d="M 0 ${y} Q 50 ${y-amp} 100 ${y}" stroke="rgba(48,160,96,${0.7-i*0.1})" stroke-width="${2.2-i*0.4}" fill="none" style="animation:${an} ${durs[i]}s ease-in-out infinite;"/>`;}return svg+'</svg>';
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
