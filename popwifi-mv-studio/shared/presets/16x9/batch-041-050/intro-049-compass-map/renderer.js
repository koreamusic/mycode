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
  const c='#6098b8';const comp=`<g opacity="0.40">
    ${[0,45,90,135,180,225,270,315].map((a,i)=>{const r=a*Math.PI/180,cx=450+Math.cos(r)*220,cy=253+Math.sin(r)*120;return `<line x1="450" y1="253" x2="${cx}" y2="${cy}" stroke="${c}" stroke-width="${i%2===0?0.8:0.4}" opacity="0.45"/>`;}).join('')}
    <circle cx="450" cy="253" r="220" stroke="${c}" stroke-width="0.7" fill="none" opacity="0.28"/>
    <circle cx="450" cy="253" r="150" stroke="${c}" stroke-width="0.5" fill="none" opacity="0.18"/>
    <circle cx="450" cy="253" r="80" stroke="${c}" stroke-width="0.5" fill="none" opacity="0.14"/>
  </g>`;const corner=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})" filter="url(#sf)"><path d="M0,70 L0,0 L70,0" stroke="${c}" stroke-width="2" fill="none" opacity="0.72"/><path d="M20,0 L30,20 L0,10 L20,0" fill="${c}" opacity="0.65"/></g>`;return rectFrame(c,'rgba(88,150,180,0.26)',comp+corner(26,26,1,1)+corner(874,26,-1,1)+corner(26,480,1,-1)+corner(874,480,-1,-1)+`<line x1="165" y1="24" x2="735" y2="24" stroke="url(#fg)" stroke-width="0.5" opacity="0.30"/><line x1="165" y1="482" x2="735" y2="482" stroke="url(#fg)" stroke-width="0.5" opacity="0.30"/>`)
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<10;i++){const el=document.createElement('div');const s=4+Math.random()*5,x=Math.random()*100,y=Math.random()*100,dur=3+Math.random()*4,del=-(Math.random()*dur);el.style.cssText=`position:absolute;left:${x}%;top:${y}%;pointer-events:none;`;el.innerHTML=`<svg width="${s*4}" height="${s*4}"><circle cx="${s*2}" cy="${s*2}" r="${s*1.8}" stroke="rgba(96,152,184,0.30)" stroke-width="0.8" fill="none"><animate attributeName="r" values="${s};${s*2};${s}" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.4;0.1;0.4" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></circle></svg>`;l.appendChild(el);}
}

function buildEq() {
  return eqBase(8,13,48,(x,H,i)=>{const a=i*(Math.PI/4),c=`hsl(${200+i*15},55%,${48+i*3}%)`;return `<line x1="${x}" y1="${H}" x2="${x+Math.cos(a)*(H*0.45)}" y2="${H-Math.abs(Math.sin(a))*(H*0.9)}" stroke="${c}" stroke-width="3" stroke-linecap="round" opacity="0.75"/>`;});
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
