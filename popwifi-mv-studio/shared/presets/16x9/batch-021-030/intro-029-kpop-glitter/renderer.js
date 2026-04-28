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
  const c='#ff50c8';const glitter=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#glow)">
    ${[[20,20,14],[38,8,10],[8,38,10],[50,30,8],[28,45,9],[12,15,7]].map(([x,y,s])=>`<path d="M${x},${y-s} L${x+s*0.3},${y-s*0.3} L${x+s},${y} L${x+s*0.3},${y+s*0.3} L${x},${y+s} L${x-s*0.3},${y+s*0.3} L${x-s},${y} L${x-s*0.3},${y-s*0.3} Z" fill="${c}" opacity="${0.55+Math.random()*0.25}"/>`).join('')}
    <path d="M0,80 L0,0 L80,0" stroke="${c}" stroke-width="2.5" fill="none" opacity="0.85"/>
    <circle cx="0" cy="0" r="7" fill="${c}" opacity="0.9"/>
  </g>`;
    return rectFrame(c,'rgba(255,100,210,0.32)',glitter(26,26,1,1)+glitter(874,26,-1,1)+glitter(26,480,1,-1)+glitter(874,480,-1,-1)+`<line x1="145" y1="24" x2="755" y2="24" stroke="url(#fg)" stroke-width="0.6" opacity="0.35" filter="url(#glow)"/><line x1="145" y1="482" x2="755" y2="482" stroke="url(#fg)" stroke-width="0.6" opacity="0.35" filter="url(#glow)"/>`)
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<24;i++){const el=document.createElement('div');const s=2+Math.random()*4,x=Math.random()*100,y=Math.random()*100,dur=0.5+Math.random()*1.5,del=-(Math.random()*dur),h=[310,260,190,220][i%4];el.style.cssText=`position:absolute;left:${x}%;top:${y}%;pointer-events:none;`;el.innerHTML=`<svg width="${s*4}" height="${s*4}"><path d="M${s*2},0 L${s*2+s*0.4},${s*2-s*0.4} L${s*4},${s*2} L${s*2+s*0.4},${s*2+s*0.4} L${s*2},${s*4} L${s*2-s*0.4},${s*2+s*0.4} L0,${s*2} L${s*2-s*0.4},${s*2-s*0.4} Z" fill="hsl(${h},85%,72%)"><animate attributeName="opacity" values="0.1;1;0.1" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="rotate" from="0 ${s*2} ${s*2}" to="360 ${s*2} ${s*2}" dur="${dur*2}s" begin="${del}s" repeatCount="indefinite"/></path></svg>`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,n=8,cols=['#ff50c8','#ff80e0','#e040c0','#ff60d0','#c030a8','#ff90e8','#d050b8','#ff70d8'],durs=[0.26,0.42,0.34,0.50,0.30,0.46,0.38,0.54];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" filter="url(#kpop_g)"><defs><filter id="kpop_g"><feGaussianBlur stdDeviation="1.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;for(let i=0;i<n;i++){const x=4+i*12,s=4+i%3*2,an=`kp${_ID()}`;svg+=`<style>@keyframes ${an}{0%{transform:scale(0.1) translateY(0);}100%{transform:scale(1) translateY(-${s*2}px);}}</style><path d="M${x+4},${svgH} L${x+4+s*0.4},${svgH-s*0.4} L${x+4+s},${svgH-s} L${x+4+s*0.4},${svgH-s*1.6} L${x+4},${svgH-s*2} L${x+4-s*0.4},${svgH-s*1.6} L${x+4-s},${svgH-s} L${x+4-s*0.4},${svgH-s*0.4} Z" fill="${cols[i]}" opacity="0.88" style="animation:${an} ${durs[i]}s ease-in-out infinite alternate;transform-origin:${x+4}px ${svgH}px;transform-box:fill-box;"/>`;}return svg+'</svg>';
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
