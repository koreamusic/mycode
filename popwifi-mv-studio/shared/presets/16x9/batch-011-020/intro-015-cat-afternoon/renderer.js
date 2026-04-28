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
  const c='#d4a848';
    const catFace=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#sf)">
      <circle cx="30" cy="38" r="26" stroke="${c}" stroke-width="1.2" fill="rgba(212,168,72,0.06)" opacity="0.65"/>
      <path d="M16,16 L8,0 L22,10 Z" fill="${c}" opacity="0.62"/>
      <path d="M44,16 L52,0 L38,10 Z" fill="${c}" opacity="0.62"/>
      <ellipse cx="22" cy="38" rx="5" ry="7" fill="rgba(212,168,72,0.55)"/>
      <ellipse cx="38" cy="38" rx="5" ry="7" fill="rgba(212,168,72,0.55)"/>
      ${[-16,-8,0,8,16].map(x=>`<line x1="${30+x}" y1="44" x2="${30+x+(x>0?14:-14)}" y2="42" stroke="${c}" stroke-width="0.8" opacity="0.5"/>`).join('')}
    </g>`;
    return rectFrame(c,'rgba(210,170,80,0.28)',catFace(26,26,1,1)+catFace(814,26,-1,1)+catFace(26,418,-1,-1)+catFace(814,418,1,-1)+`<line x1="140" y1="24" x2="760" y2="24" stroke="url(#fg)" stroke-width="0.5" opacity="0.28"/><line x1="140" y1="482" x2="760" y2="482" stroke="url(#fg)" stroke-width="0.5" opacity="0.28"/>`);
}

function buildParticles(l) {
  l.innerHTML='';const paws=['🐾'];for(let i=0;i<8;i++){const el=document.createElement('div');const s=10+Math.random()*10,x=Math.random()*100,dur=9+Math.random()*9,del=-(Math.random()*dur),sx=(Math.random()-0.5)*40,op=0.12+Math.random()*0.16;el.style.cssText=`position:absolute;left:${x}%;top:-20px;font-size:${s}px;opacity:${op};animation:ctF${i} ${dur}s ${del}s linear infinite;pointer-events:none;`;el.innerHTML=`<style>@keyframes ctF${i}{0%{opacity:0;}12%{opacity:${op};}88%{opacity:${op};}100%{opacity:0;transform:translateY(540px) translateX(${sx}px);}}</style>${paws[0]}`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,durs=[0.42,0.55,0.38,0.62,0.46,0.52];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;
    // 고양이 귀 모양 EQ
    for(let i=0;i<6;i++){const x=8+i*14,h=20+i%3*10,an=`ct${_ID()}`;svg+=`<style>@keyframes ${an}{0%{transform:scaleY(0.3);}100%{transform:scaleY(1);}}</style><g style="animation:${an} ${durs[i]}s ease-in-out infinite alternate;transform-origin:bottom;transform-box:fill-box;"><path d="M${x},${svgH} L${x-5},${svgH-h} L${x},${svgH-h-8} L${x+5},${svgH-h} Z" fill="rgba(212,168,72,0.72)"/></g>`;}
    return svg+'</svg>';
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
