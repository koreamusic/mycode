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
  const c='#c8a858';
    const cassShape=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#sf)">
      <rect x="0" y="0" width="72" height="46" rx="5" stroke="${c}" stroke-width="1.4" fill="rgba(200,160,80,0.06)" opacity="0.72"/>
      <rect x="8" y="6" width="56" height="26" rx="3" stroke="${c}" stroke-width="0.7" fill="none" opacity="0.45"/>
      <circle cx="18" cy="32" r="8" stroke="${c}" stroke-width="1.1" fill="none" opacity="0.65"/>
      <circle cx="54" cy="32" r="8" stroke="${c}" stroke-width="1.1" fill="none" opacity="0.65"/>
      <circle cx="18" cy="32" r="3.5" fill="${c}" opacity="0.5"/>
      <circle cx="54" cy="32" r="3.5" fill="${c}" opacity="0.5"/>
      <line x1="26" y1="32" x2="46" y2="32" stroke="${c}" stroke-width="0.8" opacity="0.42"/>
    </g>`;
    return rectFrame(c,'rgba(200,160,80,0.28)',
      cassShape(26,26,1,1)+cassShape(776,26,-1,1)+
      cassShape(26,434,-1,-1)+cassShape(776,434,1,-1)+
      `<line x1="130" y1="24" x2="770" y2="24" stroke="url(#fg)" stroke-width="0.5" opacity="0.3"/>
       <line x1="130" y1="482" x2="770" y2="482" stroke="url(#fg)" stroke-width="0.5" opacity="0.3"/>
       <line x1="24" y1="100" x2="24" y2="406" stroke="url(#fg)" stroke-width="0.5" opacity="0.25"/>
       <line x1="876" y1="100" x2="876" y2="406" stroke="url(#fg)" stroke-width="0.5" opacity="0.25"/>`);
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<10;i++){const el=document.createElement('div');const s=6+Math.random()*8,x=Math.random()*100,dur=8+Math.random()*10,del=-(Math.random()*dur),sx=(Math.random()-0.5)*40,op=0.12+Math.random()*0.18;el.style.cssText=`position:absolute;left:${x}%;top:-20px;opacity:0;animation:csF${i} ${dur}s ${del}s linear infinite;pointer-events:none;`;el.innerHTML=`<style>@keyframes csF${i}{0%{opacity:0;}12%{opacity:${op};}88%{opacity:${op};}100%{opacity:0;transform:translateY(540px) translateX(${sx}px);}}</style><svg width="${s*2}" height="${s*1.4}" viewBox="0 0 20 14"><rect x="0" y="0" width="20" height="14" rx="2" fill="none" stroke="rgba(200,160,80,0.5)" stroke-width="1.2"/><circle cx="6" cy="10" r="3" fill="none" stroke="rgba(200,160,80,0.5)" stroke-width="0.8"/><circle cx="14" cy="10" r="3" fill="none" stroke="rgba(200,160,80,0.5)" stroke-width="0.8"/></svg>`;l.appendChild(el);}
}

function buildEq() {
  const svgW=130,svgH=48;let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;
    const reels=[{cx:22,r:14},{cx:108,r:14}];
    reels.forEach(({cx,r},i)=>{const an=`rl${_ID()}`;svg+=`<style>@keyframes ${an}{to{transform:rotate(360deg);}}</style><g style="animation:${an} ${1.8+i*0.4}s linear infinite;transform-origin:${cx}px ${svgH/2}px"><circle cx="${cx}" cy="${svgH/2}" r="${r}" stroke="rgba(200,160,80,0.5)" stroke-width="1.2" fill="rgba(200,160,80,0.06)"/><circle cx="${cx}" cy="${svgH/2}" r="${r*0.38}" fill="rgba(200,160,80,0.35)"/>${[0,120,240].map(a=>`<line x1="${cx}" y1="${svgH/2}" x2="${cx+Math.cos(a*Math.PI/180)*r*0.75}" y2="${svgH/2+Math.sin(a*Math.PI/180)*r*0.75}" stroke="rgba(200,160,80,0.4)" stroke-width="0.9"/>`).join('')}</g>`;});
    const tapeTop=svgH/2-3,tapeBtm=svgH/2+3;
    svg+=`<path d="M36,${tapeTop} Q65,${tapeTop-3} 94,${tapeTop}" stroke="rgba(200,160,80,0.45)" stroke-width="1.2" fill="none"/>
          <path d="M36,${tapeBtm} Q65,${tapeBtm+3} 94,${tapeBtm}" stroke="rgba(200,160,80,0.45)" stroke-width="1.2" fill="none"/>`;
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
