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
  const c='#ff7030';const sun=`<ellipse cx="450" cy="253" rx="60" ry="60" stroke="${c}" stroke-width="0.8" fill="none" opacity="0.22"/><ellipse cx="450" cy="253" rx="90" ry="90" stroke="${c}" stroke-width="0.5" fill="none" opacity="0.14"/><ellipse cx="450" cy="253" rx="120" ry="120" stroke="${c}" stroke-width="0.4" fill="none" opacity="0.10"/>`;const ray=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#sf)"><path d="M0,100 L0,0 L100,0" stroke="${c}" stroke-width="2.5" fill="none" opacity="0.82"/><path d="M0,80 L0,0 L80,0" stroke="${c}" stroke-width="0.7" fill="none" opacity="0.35"/><circle cx="0" cy="0" r="8" fill="${c}" opacity="0.85"/></g>`;return rectFrame(c,'rgba(255,120,60,0.32)',sun+ray(26,26,1,1)+ray(874,26,-1,1)+ray(26,480,1,-1)+ray(874,480,-1,-1)+`<line x1="155" y1="24" x2="745" y2="24" stroke="url(#fg)" stroke-width="0.6" opacity="0.35"/><line x1="155" y1="482" x2="745" y2="482" stroke="url(#fg)" stroke-width="0.6" opacity="0.35"/>`)
}

function buildParticles(l) {
  l.innerHTML='';const cols=['#ff7030','#ff9050','#ffb070','#ffd090'];for(let i=0;i<18;i++){const el=document.createElement('div');const s=4+Math.random()*6,x=Math.random()*100,dur=5+Math.random()*8,del=-(Math.random()*dur),sx=(Math.random()-0.5)*80,op=0.3+Math.random()*0.4;el.style.cssText=`position:absolute;left:${x}%;top:-20px;opacity:0;animation:ssF${i} ${dur}s ${del}s linear infinite;pointer-events:none;`;el.innerHTML=`<style>@keyframes ssF${i}{0%{opacity:0;}10%{opacity:${op};}85%{opacity:${op};}100%{opacity:0;transform:translateY(540px) translateX(${sx}px);}}</style><svg width="${s*2}" height="${s*2}"><circle cx="${s}" cy="${s}" r="${s}" fill="${cols[i%4]}" opacity="0.85"/></svg>`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,n=8,durs=[0.30,0.46,0.38,0.54,0.34,0.50,0.42,0.58];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}"><defs><linearGradient id="ssg" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#ff4010"/><stop offset="100%" stop-color="#ffb040"/></linearGradient></defs>`;for(let i=0;i<n;i++){const x=4+i*12,h=12+i%4*10,an=`ss${_ID()}`;svg+=`<style>@keyframes ${an}{0%{transform:scaleY(0.15);}100%{transform:scaleY(1);}}</style><rect x="${x}" y="${svgH-h}" width="9" height="${h}" rx="2" fill="url(#ssg)" opacity="0.85" style="animation:${an} ${durs[i]}s ease-in-out infinite alternate;transform-origin:bottom;transform-box:fill-box;"/>`;}return svg+'</svg>';
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
