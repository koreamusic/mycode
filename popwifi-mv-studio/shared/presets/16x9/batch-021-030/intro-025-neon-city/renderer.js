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
  const c='#ff2880';const neon=(x1,y1,x2,y2,op)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="2.5" opacity="${op}" filter="url(#glow)"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="white" stroke-width="0.5" opacity="${op*0.4}"/>`;const corner=(tx,ty,sx,sy)=>`<g transform="translate(${tx},${ty}) scale(${sx},${sy})"><path d="M0,80 L0,0 L80,0" stroke="${c}" stroke-width="3" fill="none" opacity="0.9" filter="url(#glow)"/><path d="M0,80 L0,0 L80,0" stroke="white" stroke-width="0.6" fill="none" opacity="0.3"/><circle cx="0" cy="0" r="6" fill="${c}" opacity="0.9" filter="url(#glow)"/></g>`;return rectFrame(c,'rgba(255,60,140,0.35)',corner(26,26,1,1)+corner(874,26,-1,1)+corner(26,480,1,-1)+corner(874,480,-1,-1)+neon(140,24,760,24,0.7)+neon(140,482,760,482,0.7)+neon(24,100,24,406,0.6)+neon(876,100,876,406,0.6))
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<20;i++){const el=document.createElement('div');const s=2+Math.random()*3,x=Math.random()*100,y=Math.random()*100,dur=0.8+Math.random()*1.8,del=-(Math.random()*dur),h=[330,200,280,170][i%4],sat=80+Math.random()*20;el.style.cssText=`position:absolute;left:${x}%;top:${y}%;pointer-events:none;`;el.innerHTML=`<svg width="${s*4}" height="${s*4}"><circle cx="${s*2}" cy="${s*2}" r="${s}" fill="hsl(${h},${sat}%,65%)"><animate attributeName="opacity" values="0.1;1;0.1" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/><animate attributeName="r" values="${s};${s*2.5};${s}" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></circle></svg>`;l.appendChild(el);}
}

function buildEq() {
  const svgW=100,svgH=48,n=8,cols=['#ff2880','#e020f8','#2080ff','#20f8d0','#ff8020','#ff2880','#f020a0','#4040ff'],durs=[0.28,0.44,0.36,0.52,0.32,0.48,0.40,0.56];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" filter="url(#neon_glow)"><defs><filter id="neon_glow"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;for(let i=0;i<n;i++){const x=4+i*12,h=14+i%4*9,an=`nn${_ID()}`;svg+=`<style>@keyframes ${an}{0%{transform:scaleY(0.1);}100%{transform:scaleY(1);}}</style><rect x="${x}" y="${svgH-h}" width="9" height="${h}" rx="1.5" fill="${cols[i]}" opacity="0.85" style="animation:${an} ${durs[i]}s ease-in-out infinite alternate;transform-origin:bottom;transform-box:fill-box;"/>`;}return svg+'</svg>';
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
