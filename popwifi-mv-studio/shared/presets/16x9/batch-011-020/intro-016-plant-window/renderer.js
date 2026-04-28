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
  const c='#60a868';
    const vine=(x1,y1,x2,y2,leaves)=>`<g filter="url(#sf)">
      <path d="M${x1},${y1} Q${(x1+x2)/2+20},${(y1+y2)/2} ${x2},${y2}" stroke="${c}" stroke-width="1.3" fill="none" opacity="0.6"/>
      ${leaves.map(([lx,ly,r])=>`<ellipse cx="${lx}" cy="${ly}" rx="${r}" ry="${r*0.55}" fill="${c}" opacity="0.45" transform="rotate(${Math.random()*40-20},${lx},${ly})"/>`).join('')}
    </g>`;
    return rectFrame(c,'rgba(80,160,90,0.25)',
      vine(26,26,26,250,[[36,60,12],[30,100,10],[40,140,11],[28,180,9]])+
      vine(876,26,876,250,[[866,60,12],[872,100,10],[862,140,11],[874,180,9]])+
      vine(26,482,200,482,[[60,472,11],[100,476,10],[140,470,12],[175,474,9]])+
      vine(876,482,700,482,[[840,472,11],[800,476,10],[760,470,12],[725,474,9]])+
      `<line x1="160" y1="24" x2="740" y2="24" stroke="url(#fg)" stroke-width="0.5" opacity="0.28"/>
       <line x1="160" y1="482" x2="740" y2="482" stroke="url(#fg)" stroke-width="0.5" opacity="0.28"/>`);
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<10;i++){const el=document.createElement('div');const s=10+Math.random()*12,x=Math.random()*100,dur=8+Math.random()*8,del=-(Math.random()*dur),sx=(Math.random()-0.5)*60,r0=Math.random()*360,op=0.15+Math.random()*0.2;el.style.cssText=`position:absolute;left:${x}%;top:-20px;opacity:0;animation:plF${i} ${dur}s ${del}s linear infinite;pointer-events:none;`;el.innerHTML=`<style>@keyframes plF${i}{0%{opacity:0;transform:rotate(${r0}deg);}12%{opacity:${op};}88%{opacity:${op};}100%{opacity:0;transform:translateY(540px) translateX(${sx}px) rotate(${r0+120}deg);}}</style><svg width="${s}" height="${s*0.7}" viewBox="0 0 20 14"><ellipse cx="10" cy="7" rx="9" ry="6" fill="rgba(80,160,90,0.7)" stroke="rgba(60,140,70,0.5)" stroke-width="0.8"/><line x1="1" y1="7" x2="19" y2="7" stroke="rgba(60,140,70,0.4)" stroke-width="0.7"/></svg>`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48;let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;
    const stems=[{x:10,h:30},{x:22,h:22},{x:35,h:36},{x:48,h:26},{x:60,h:32},{x:73,h:20},{x:86,h:28}];
    stems.forEach(({x,h},i)=>{const an=`pl${_ID()}`,lh=h*0.6;svg+=`<style>@keyframes ${an}{0%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-${h*0.15}px) rotate(${i%2?3:-3}deg);}100%{transform:translateY(0) rotate(0deg);}}</style><g style="animation:${an} ${0.6+i*0.15}s ease-in-out infinite;transform-origin:${x}px ${svgH}px"><line x1="${x}" y1="${svgH}" x2="${x}" y2="${svgH-h}" stroke="rgba(96,168,104,0.6)" stroke-width="1.3"/><ellipse cx="${x}" cy="${svgH-h}" rx="${h*0.22}" ry="${lh*0.35}" fill="rgba(96,168,104,0.72)" transform="rotate(-30,${x},${svgH-h})"/><ellipse cx="${x}" cy="${svgH-h+6}" rx="${h*0.2}" ry="${lh*0.3}" fill="rgba(80,150,90,0.65)" transform="rotate(30,${x},${svgH-h+6})"/></g>`;});
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
