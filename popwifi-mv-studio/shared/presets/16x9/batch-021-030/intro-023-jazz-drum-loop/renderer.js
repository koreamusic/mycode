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
  const c='#c86030';
    const drum=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#sf)">
      <ellipse cx="36" cy="20" rx="34" ry="18" stroke="${c}" stroke-width="1.5" fill="rgba(200,96,48,0.08)" opacity="0.72"/>
      <ellipse cx="36" cy="20" rx="34" ry="18" stroke="${c}" stroke-width="0.6" fill="none" opacity="0.4" transform="translate(0,36)"/>
      <line x1="2" y1="20" x2="2" y2="56" stroke="${c}" stroke-width="1.3" opacity="0.65"/>
      <line x1="70" y1="20" x2="70" y2="56" stroke="${c}" stroke-width="1.3" opacity="0.65"/>
      <path d="M2,56 Q36,70 70,56" stroke="${c}" stroke-width="1.3" fill="none" opacity="0.65"/>
      ${[10,20,30,40,50,60].map(x=>`<line x1="${x}" y1="${18+Math.sin(x/10)*4}" x2="${x+2}" y2="56" stroke="${c}" stroke-width="0.5" opacity="0.32"/>`).join('')}
    </g>`;
    return rectFrame(c,'rgba(200,100,50,0.28)',drum(26,26,1,1)+drum(802,26,-1,1)+drum(26,404,-1,-1)+drum(802,404,1,-1)+`<line x1="150" y1="24" x2="750" y2="24" stroke="url(#fg)" stroke-width="0.5" opacity="0.28"/><line x1="150" y1="482" x2="750" y2="482" stroke="url(#fg)" stroke-width="0.5" opacity="0.28"/>`)
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<12;i++){const el=document.createElement('div');const s=4+Math.random()*5,x=Math.random()*100,y=20+Math.random()*60,dur=0.5+Math.random()*0.8,del=-(Math.random()*3);el.style.cssText=`position:absolute;left:${x}%;top:${y}%;pointer-events:none;`;el.innerHTML=`<svg width="${s*4}" height="${s*4}"><circle cx="${s*2}" cy="${s*2}" r="${s}" stroke="rgba(200,100,50,0.5)" stroke-width="1" fill="none"><animate attributeName="r" values="${s};${s*2.5};${s}" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.6;0;0.6" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></circle></svg>`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,n=7,durs=[0.22,0.32,0.26,0.38,0.24,0.34,0.28];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;for(let i=0;i<n;i++){const x=6+i*13,h=16+i%3*12,an=`dm${_ID()}`;svg+=`<style>@keyframes ${an}{0%,40%,100%{transform:scaleY(0.15);}20%{transform:scaleY(1);}}</style><ellipse cx="${x}" cy="${svgH}" rx="5" ry="${h/2}" fill="rgba(200,96,48,0.72)" style="animation:${an} ${durs[i]*3}s ease-in-out infinite;transform-origin:${x}px ${svgH}px;transform-box:fill-box;"/>`;}return svg+'</svg>';
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
