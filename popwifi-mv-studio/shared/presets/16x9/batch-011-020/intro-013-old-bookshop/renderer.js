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
  const c='#a88848';
    const book=(tx,ty,sx,sy,h)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#sf)">
      <rect x="0" y="0" width="16" height="${h}" rx="1.5" fill="rgba(168,136,72,0.15)" stroke="${c}" stroke-width="1.1" opacity="0.72"/>
      <rect x="0" y="0" width="5" height="${h}" rx="1" fill="${c}" opacity="0.28"/>
      <line x1="5" y1="0" x2="5" y2="${h}" stroke="${c}" stroke-width="0.5" opacity="0.5"/>
    </g>`;
    const shelf=(y)=>`<g filter="url(#sf)">
      ${[0,1,2,3,4,5,6].map(i=>`${book(30+i*18,y-28-Math.random()*12,1,1,24+Math.random()*16)}`).join('')}
      ${[0,1,2,3,4,5,6].map(i=>`${book(800-i*18,y-28-Math.random()*12,-1,1,24+Math.random()*16)}`).join('')}
      <line x1="24" y1="${y}" x2="876" y2="${y}" stroke="${c}" stroke-width="1.8" opacity="0.55"/>
    </g>`;
    return `<defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c}" stop-opacity="0.88"/><stop offset="100%" stop-color="${c}" stop-opacity="0.55"/></linearGradient><filter id="sf"><feGaussianBlur stdDeviation="0.6"/></filter><filter id="glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <rect x="24" y="24" width="852" height="458" stroke="${c}" stroke-width="0.5" fill="none" opacity="0.25"/>
    ${shelf(482)}${shelf(26)}
    <line x1="24" y1="24" x2="24" y2="482" stroke="${c}" stroke-width="1.5" opacity="0.55"/>
    <line x1="876" y1="24" x2="876" y2="482" stroke="${c}" stroke-width="1.5" opacity="0.55"/>`;
}

function buildParticles(l) {
  l.innerHTML='';const sz=[[4,20],[5,16],[3,22],[6,18],[4,24]];for(let i=0;i<6;i++){const el=document.createElement('div');const [w,h]=sz[i%5],x=5+Math.random()*90,dur=9+Math.random()*8,del=-(Math.random()*dur),sx=(Math.random()-0.5)*30,op=0.08+Math.random()*0.12;el.style.cssText=`position:absolute;left:${x}%;top:-${h+5}px;opacity:0;animation:bkF${i} ${dur}s ${del}s linear infinite;pointer-events:none;`;el.innerHTML=`<style>@keyframes bkF${i}{0%{opacity:0;}12%{opacity:${op};}88%{opacity:${op};}100%{opacity:0;transform:translateY(540px) translateX(${sx}px);}}</style><svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect x="0" y="0" width="${w}" height="${h}" rx="1" fill="none" stroke="rgba(168,136,72,0.45)" stroke-width="1"/><rect x="0" y="0" width="${w*0.35}" height="${h}" fill="rgba(168,136,72,0.22)"/></svg>`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,books=[{w:7,c:'#a88848'},{w:5,c:'#9a7838'},{w:8,c:'#b89858'},{w:6,c:'#8a6828'},{w:7,c:'#a07840'},{w:5,c:'#c0a060'}];let x=2,svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;books.forEach((b,i)=>{const h=20+i*4,an=`bq${_ID()}`,dh=h*0.4;svg+=`<style>@keyframes ${an}{0%{transform:translateY(0);}100%{transform:translateY(-${dh}px);}}</style><g style="animation:${an} ${0.35+i*0.1}s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:bottom center;"><rect x="${x}" y="${svgH-h}" width="${b.w}" height="${h}" rx="1" fill="${b.c}" opacity="0.75"/><rect x="${x}" y="${svgH-h}" width="${Math.floor(b.w*0.38)}" height="${h}" fill="${b.c}" opacity="0.95"/></g>`;x+=b.w+2;});return svg+'</svg>';
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
