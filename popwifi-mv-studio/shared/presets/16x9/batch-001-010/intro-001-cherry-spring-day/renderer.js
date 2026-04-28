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
  const c='#ff8fab';const p=(cx,cy,rx,ry,rot,op)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#ffbdce" opacity="${op}" transform="rotate(${rot},${cx},${cy})"/>`;const branch=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#sf)"><path d="M0,90 Q34,52 68,26" stroke="url(#fg)" stroke-width="1.1" opacity="0.65" fill="none"/>${p(40,72,7,4.5,-35,0.78)}${p(32,58,6,4,10,0.68)}${p(50,52,6.5,4,-55,0.72)}${p(60,38,6,4,40,0.68)}${p(72,28,6.5,4,-18,0.65)}<circle cx="40" cy="72" r="1.8" fill="#fff5f8" opacity="0.75"/><circle cx="60" cy="38" r="1.6" fill="#fff5f8" opacity="0.7"/></g>`;return rectFrame(c,'rgba(255,143,171,0.3)',branch(26,26,1,1)+branch(874,26,-1,1)+branch(26,480,1,-1)+branch(874,480,-1,-1)+`<line x1="180" y1="24" x2="720" y2="24" stroke="url(#fg)" stroke-width="0.5" opacity="0.28"/><line x1="180" y1="482" x2="720" y2="482" stroke="url(#fg)" stroke-width="0.5" opacity="0.28"/>`);
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<20;i++){const el=document.createElement('div');const s=5+Math.random()*9,dur=7+Math.random()*8,del=-(Math.random()*dur),x=Math.random()*100,sx=(Math.random()-0.5)*110,r0=Math.random()*360,r1=r0+(Math.random()-0.5)*200,op=0.3+Math.random()*0.45,h=337+Math.random()*20;el.style.cssText=`position:absolute;left:${x}%;top:-20px;opacity:0;animation:cF${i} ${dur}s ${del}s linear infinite;pointer-events:none;`;el.innerHTML=`<style>@keyframes cF${i}{0%{opacity:0;transform:translateY(-20px) rotate(${r0}deg) scale(0.6);}8%{opacity:${op};}88%{opacity:${op};}100%{opacity:0;transform:translateY(540px) translateX(${sx}px) rotate(${r1}deg) scale(0.9);}}</style><svg width="${s}" height="${s*1.5}" viewBox="0 0 10 15"><ellipse cx="5" cy="7.5" rx="4.2" ry="7" fill="hsl(${h},76%,80%)" opacity="0.88"/></svg>`;l.appendChild(el);}
}

function buildEq() {
  return eqBase(11,13,48,(x,H,i)=>{const c=['#ffbdd0','#ff9ab8','#ffd0de','#ff80a8','#ffb0cc','#ff90b4','#ffc8da','#ff88b0','#ffb8cc','#ff98ba','#ffc0d6'][i];return `<ellipse cx="${x}" cy="${H/2}" rx="4.8" ry="${H/2}" fill="${c}" opacity="0.72"/><ellipse cx="${x}" cy="${H/2}" rx="2.8" ry="${H*0.38}" fill="white" opacity="0.16"/><circle cx="${x}" cy="5" r="2.2" fill="#fff5f8" opacity="0.55"/>`;});
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
