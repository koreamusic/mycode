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
  const c='#80c0ff';const bub=(x,y,r,op)=>`<circle cx="${x}" cy="${y}" r="${r}" stroke="${c}" stroke-width="1.2" fill="rgba(128,192,255,0.06)" opacity="${op}"/><ellipse cx="${x-r*0.3}" cy="${y-r*0.3}" rx="${r*0.25}" ry="${r*0.18}" fill="white" opacity="${op*0.4}"/>`;const corner=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#sf)">${bub(30,30,28,0.65)}${bub(64,18,16,0.52)}${bub(18,62,14,0.48)}${bub(70,50,10,0.40)}</g>`;return rectFrame(c,'rgba(120,190,255,0.28)',corner(26,26,1,1)+corner(874,26,-1,1)+corner(26,480,1,-1)+corner(874,480,-1,-1)+`<line x1="140" y1="24" x2="760" y2="24" stroke="url(#fg)" stroke-width="0.5" opacity="0.28"/><line x1="140" y1="482" x2="760" y2="482" stroke="url(#fg)" stroke-width="0.5" opacity="0.28"/>`)
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<18;i++){const el=document.createElement('div');const s=6+Math.random()*14,x=Math.random()*100,dur=4+Math.random()*8,del=-(Math.random()*dur),sx=(Math.random()-0.5)*40,op=0.2+Math.random()*0.35,h=190+Math.random()*80;el.style.cssText=`position:absolute;left:${x}%;bottom:-20px;opacity:0;animation:bbF${i} ${dur}s ${del}s ease-in infinite;pointer-events:none;`;el.innerHTML=`<style>@keyframes bbF${i}{0%{opacity:0;transform:translateY(0);}10%{opacity:${op};}85%{opacity:${op};}100%{opacity:0;transform:translateY(-560px) translateX(${sx}px);}}</style><svg width="${s*2}" height="${s*2}"><circle cx="${s}" cy="${s}" r="${s*0.9}" stroke="hsl(${h},80%,70%)" stroke-width="1" fill="none" opacity="0.8"/><ellipse cx="${s*0.7}" cy="${s*0.7}" rx="${s*0.22}" ry="${s*0.15}" fill="white" opacity="0.5"/></svg>`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,n=8,durs=[0.30,0.46,0.36,0.54,0.32,0.50,0.42,0.58];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;for(let i=0;i<n;i++){const x=4+i*12,r=5+i%3*3,an=`bb${_ID()}`;svg+=`<style>@keyframes ${an}{0%{transform:translateY(0);}100%{transform:translateY(-${r*3}px);}}</style><circle cx="${x+4}" cy="${svgH-r}" r="${r}" stroke="rgba(128,192,255,0.7)" stroke-width="1.2" fill="rgba(128,192,255,0.15)" style="animation:${an} ${durs[i]}s ease-in-out infinite alternate;"/>`;}return svg+'</svg>';
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
