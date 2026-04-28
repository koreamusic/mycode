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
  const c='#c8a84a';const corner=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#sf)"><path d="M0,72 L0,0 L72,0" stroke="url(#fg)" stroke-width="2.5" fill="none" opacity="0.85" stroke-linecap="square"/><path d="M10,60 L10,10 L60,10" stroke="url(#fg)" stroke-width="0.8" fill="none" opacity="0.38"/><rect x="0" y="0" width="5" height="5" fill="${c}" opacity="0.9"/>${[20,32,44].map(p=>`<circle cx="${p}" cy="5" r="1.5" fill="${c}" opacity="${0.5-p*0.006}"/>`).join('')}${[20,32,44].map(p=>`<circle cx="5" cy="${p}" r="1.5" fill="${c}" opacity="${0.5-p*0.006}"/>`).join('')}</g>`;return rectFrame(c,'rgba(200,168,74,0.28)',corner(26,26,1,1)+corner(874,26,-1,1)+corner(26,480,1,-1)+corner(874,480,-1,-1)+`<line x1="140" y1="24" x2="760" y2="24" stroke="url(#fg)" stroke-width="0.5" opacity="0.3"/><line x1="140" y1="482" x2="760" y2="482" stroke="url(#fg)" stroke-width="0.5" opacity="0.3"/>`);
}

function buildParticles(l) {
  l.innerHTML='';const notes=['♩','♪','♫','♬'];for(let i=0;i<14;i++){const el=document.createElement('div');const s=12+Math.random()*14,dur=6+Math.random()*8,del=-(Math.random()*dur),x=Math.random()*100,sx=(Math.random()-0.5)*80,op=0.15+Math.random()*0.25;el.style.cssText=`position:absolute;left:${x}%;top:-20px;font-size:${s}px;color:#c8a84a;opacity:${op};animation:nF${i} ${dur}s ${del}s linear infinite;pointer-events:none;`;el.innerHTML=`<style>@keyframes nF${i}{0%{opacity:0;}8%{opacity:${op};}88%{opacity:${op};}100%{opacity:0;transform:translateY(540px) translateX(${sx}px);}}</style>${notes[i%4]}`;l.appendChild(el);}
}

function buildEq() {
  const svgW=130,svgH=48,wW=14,wCount=9,bPos=[1,2,4,5,6,8];const durs=[0.5,0.38,0.62,0.41,0.55,0.35,0.48,0.67,0.44];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}"><defs><linearGradient id="wkg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e8dfd0"/><stop offset="100%" stop-color="#c8b89a"/></linearGradient></defs>`;for(let i=0;i<wCount;i++){const x=i*wW+1,an=`wk${_ID()}`;svg+=`<style>@keyframes ${an}{0%{transform:translateY(0);}100%{transform:translateY(3px);}}</style><rect x="${x}" y="2" width="${wW-2}" height="${svgH-2}" rx="2" fill="url(#wkg)" stroke="rgba(100,80,40,0.3)" stroke-width="0.5" style="animation:${an} ${durs[i]}s ease-in-out infinite alternate;transform-origin:top center;transform-box:fill-box;"/>`;}bPos.forEach((bi,j)=>{const x=bi*wW-5,an=`bk${_ID()}`;svg+=`<style>@keyframes ${an}{0%{transform:translateY(0);}100%{transform:translateY(4px);}}</style><rect x="${x}" y="2" width="8" height="${svgH*0.6}" rx="1.5" fill="#1c1410" style="animation:${an} ${[0.44,0.58,0.39,0.52,0.63,0.46][j]}s ease-in-out infinite alternate;transform-origin:top center;transform-box:fill-box;"/>`;});return svg+'</svg>';
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
