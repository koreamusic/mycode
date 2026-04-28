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
  const c='#9070c0';const bldg=(x,w,h)=>`<rect x="${x}" y="${506-h}" width="${w}" height="${h}" fill="${c}" opacity="0.12" stroke="${c}" stroke-width="0.6" opacity2="0.35"/>${Array.from({length:Math.floor(h/20)},(_,r)=>Array.from({length:Math.floor(w/12)},(_,col)=>`<rect x="${x+col*12+2}" y="${506-h+r*20+4}" width="7" height="10" fill="${c}" opacity="${Math.random()>0.4?0.45:0.12}"/>`).join('')).join('')}`;
    const city=`<g filter="url(#sf)" opacity="0.55">${bldg(26,40,200)}${bldg(74,32,160)}${bldg(114,48,240)}${bldg(800,40,180)}${bldg(840,32,150)}${bldg(786,36,200)}</g>`;
    const corner=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#sf)"><path d="M0,80 L0,0 L80,0" stroke="${c}" stroke-width="2" fill="none" opacity="0.78"/><circle cx="0" cy="0" r="5" fill="${c}" opacity="0.85"/></g>`;
    return rectFrame(c,'rgba(140,110,200,0.28)',city+corner(26,26,1,1)+corner(874,26,-1,1)+corner(26,480,1,-1)+corner(874,480,-1,-1))
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<14;i++){const el=document.createElement('div');const s=3+Math.random()*3,x=Math.random()*100,y=Math.random()*80,dur=1+Math.random()*2.5,del=-(Math.random()*dur),c=`rgba(${130+Math.random()*80},${80+Math.random()*100},${200+Math.random()*55},0.7)`;el.style.cssText=`position:absolute;left:${x}%;top:${y}%;pointer-events:none;`;el.innerHTML=`<svg width="${s*3}" height="${s*3}"><circle cx="${s*1.5}" cy="${s*1.5}" r="${s}" fill="${c}"><animate attributeName="opacity" values="0.1;0.8;0.1" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></circle></svg>`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,n=8,durs=[0.32,0.48,0.38,0.54,0.36,0.50,0.42,0.58];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;for(let i=0;i<n;i++){const x=4+i*12,h=12+i%4*10,an=`uj${_ID()}`;svg+=`<style>@keyframes ${an}{0%{transform:scaleY(0.2);}100%{transform:scaleY(1);}}</style><rect x="${x}" y="${svgH-h}" width="9" height="${h}" rx="1.5" fill="rgba(144,112,192,0.72)" style="animation:${an} ${durs[i]}s ease-in-out infinite alternate;transform-origin:bottom;transform-box:fill-box;"/><circle cx="${x+4.5}" cy="${svgH-h}" r="3" fill="rgba(160,128,220,0.6)"/>`;}return svg+'</svg>';
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
