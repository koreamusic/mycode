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
  const c='#9050e0';const galaxy=`<g opacity="0.22">${Array.from({length:3},(_,i)=>`<ellipse cx="450" cy="253" rx="${100+i*70}" ry="${40+i*28}" stroke="${c}" stroke-width="${1.2-i*0.3}" fill="none" transform="rotate(${i*25},450,253)"/>`).join('')}</g>`;const corner=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#glow)">
      <path d="M0,90 L0,0 L90,0" stroke="${c}" stroke-width="2.5" fill="none" opacity="0.85"/>
      ${[[20,20,8],[40,10,6],[10,40,6],[55,20,5],[22,50,5]].map(([x,y,s])=>`<path d="M${x},${y-s} L${x+s*0.3},${y-s*0.3} L${x+s},${y} L${x+s*0.3},${y+s*0.3} L${x},${y+s} L${x-s*0.3},${y+s*0.3} L${x-s},${y} L${x-s*0.3},${y-s*0.3} Z" fill="${c}" opacity="0.65"/>`).join('')}
      <circle cx="0" cy="0" r="8" fill="${c}" opacity="0.90"/>
    </g>`;
    return rectFrame(c,'rgba(160,90,240,0.32)',galaxy+corner(26,26,1,1)+corner(874,26,-1,1)+corner(26,480,1,-1)+corner(874,480,-1,-1)+`<line x1="145" y1="24" x2="755" y2="24" stroke="url(#fg)" stroke-width="0.5" opacity="0.32" filter="url(#glow)"/><line x1="145" y1="482" x2="755" y2="482" stroke="url(#fg)" stroke-width="0.5" opacity="0.32" filter="url(#glow)"/>`)
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<24;i++){const el=document.createElement('div');const s=1+Math.random()*3,x=Math.random()*100,y=Math.random()*100,dur=0.8+Math.random()*2.5,del=-(Math.random()*dur);el.style.cssText=`position:absolute;left:${x}%;top:${y}%;pointer-events:none;`;el.innerHTML=`<svg width="${s*3}" height="${s*3}"><circle cx="${s*1.5}" cy="${s*1.5}" r="${s}" fill="hsl(${250+Math.random()*80},80%,75%)"><animate attributeName="opacity" values="0.1;1;0.1" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></circle></svg>`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,n=8,durs=[0.28,0.44,0.36,0.52,0.32,0.48,0.40,0.56];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}"><defs><radialGradient id="dpg" cx="50%" cy="100%" r="100%"><stop offset="0%" stop-color="#6020c0"/><stop offset="100%" stop-color="#c080ff"/></radialGradient></defs>`;for(let i=0;i<n;i++){const x=4+i*12,h=14+i%4*9,an=`dp${_ID()}`;svg+=`<style>@keyframes ${an}{0%{transform:scaleY(0.1);}100%{transform:scaleY(1);}}</style><rect x="${x}" y="${svgH-h}" width="9" height="${h}" rx="2.5" fill="url(#dpg)" opacity="0.88" style="animation:${an} ${durs[i]}s ease-in-out infinite alternate;transform-origin:bottom;transform-box:fill-box;"/><circle cx="${x+4.5}" cy="${svgH-h}" r="2.5" fill="#c080ff" opacity="0.7"/>`;}return svg+'</svg>';
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
