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
  const c='#6878d0';
    // 아르데코 패턴
    const art=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#sf)">
      <path d="M0,100 L0,0 L100,0" stroke="${c}" stroke-width="1.5" fill="none" opacity="0.72" stroke-linecap="square"/>
      ${[15,30,45].map(d=>`<path d="M${d},100 L${d},${d}" stroke="${c}" stroke-width="0.6" opacity="${0.35-d*0.004}"/>`).join('')}
      ${[15,30,45].map(d=>`<path d="M0,${d} L${100-d},${d}" stroke="${c}" stroke-width="0.6" opacity="${0.35-d*0.004}"/>`).join('')}
      <rect x="0" y="0" width="12" height="12" fill="${c}" opacity="0.7"/>
      <rect x="14" y="0" width="5" height="5" fill="${c}" opacity="0.45"/>
      <rect x="0" y="14" width="5" height="5" fill="${c}" opacity="0.45"/>
    </g>`;
    return rectFrame(c,'rgba(100,120,210,0.28)',art(26,26,1,1)+art(874,26,-1,1)+art(26,480,1,-1)+art(874,480,-1,-1)+`<line x1="150" y1="24" x2="750" y2="24" stroke="url(#fg)" stroke-width="0.5" opacity="0.30"/><line x1="150" y1="482" x2="750" y2="482" stroke="url(#fg)" stroke-width="0.5" opacity="0.30"/>`);
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<16;i++){const el=document.createElement('div');const s=3+Math.random()*4,x=Math.random()*100,y=Math.random()*100,dur=2+Math.random()*3,del=-(Math.random()*dur);el.style.cssText=`position:absolute;left:${x}%;top:${y}%;pointer-events:none;`;el.innerHTML=`<svg width="${s*3}" height="${s*3}"><rect x="${s}" y="${s}" width="${s}" height="${s}" fill="rgba(104,120,208,0.6)" transform="rotate(45,${s*1.5},${s*1.5})"><animate attributeName="opacity" values="0.1;0.8;0.1" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="rotate" from="45 ${s*1.5} ${s*1.5}" to="405 ${s*1.5} ${s*1.5}" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></rect></svg>`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,n=7,durs=[0.34,0.50,0.40,0.56,0.38,0.52,0.44];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;
    // 다이아몬드 EQ
    for(let i=0;i<n;i++){const x=6+i*13,h=16+i%3*12,an=`vj${_ID()}`;svg+=`<style>@keyframes ${an}{0%{transform:scaleY(0.2);}100%{transform:scaleY(1);}}</style><g style="animation:${an} ${durs[i]}s ease-in-out infinite alternate;transform-origin:${x}px ${svgH}px;transform-box:fill-box;"><path d="M${x},${svgH} L${x-5},${svgH-h/2} L${x},${svgH-h} L${x+5},${svgH-h/2} Z" fill="rgba(104,120,208,0.72)"/></g>`;}
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
