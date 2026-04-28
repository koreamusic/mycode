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
  const c='#70a850';const vine=(d,op)=>`<path d="${d}" stroke="${c}" stroke-width="1.4" fill="none" opacity="${op}" stroke-linecap="round"/>`;const leaf=(x,y,r1,r2,rot,op)=>`<ellipse cx="${x}" cy="${y}" rx="${r1}" ry="${r2}" fill="${c}" opacity="${op}" transform="rotate(${rot},${x},${y})"/>`;return `<defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c}" stop-opacity="0.85"/><stop offset="100%" stop-color="${c}" stop-opacity="0.52"/></linearGradient><filter id="sf"><feGaussianBlur stdDeviation="0.6"/></filter><filter id="glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    ${vine('M24,24 Q150,16 300,22 Q500,14 700,20 Q820,16 876,24',0.65)}
    ${vine('M24,482 Q150,490 300,484 Q500,492 700,486 Q820,490 876,482',0.65)}
    ${vine('M24,24 Q16,150 22,300 Q14,450 24,482',0.60)}
    ${vine('M876,24 Q884,150 878,300 Q886,450 876,482',0.60)}
    ${leaf(60,26,14,6,-30,0.45)}${leaf(120,24,12,5,20,0.40)}${leaf(200,26,13,6,-40,0.42)}
    ${leaf(680,24,12,5,25,0.40)}${leaf(760,26,14,6,-20,0.45)}${leaf(840,24,12,5,-35,0.42)}
    ${leaf(26,80,6,12,-60,0.42)}${leaf(24,160,5,11,70,0.40)}${leaf(26,260,6,13,-50,0.42)}
    ${leaf(876,80,6,12,60,0.42)}${leaf(878,160,5,11,-70,0.40)}${leaf(876,260,6,13,50,0.42)}`;
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<10;i++){const el=document.createElement('div');const s=8+Math.random()*10,x=Math.random()*100,y=Math.random()*100,dur=8+Math.random()*8,del=-(Math.random()*dur);el.style.cssText=`position:absolute;left:${x}%;top:${y}%;pointer-events:none;`;el.innerHTML=`<svg width="${s}" height="${s*0.7}"><ellipse cx="${s/2}" cy="${s*0.35}" rx="${s/2-1}" ry="${s*0.3}" fill="rgba(112,168,80,0.3)"><animate attributeName="opacity" values="0.1;0.4;0.1" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></ellipse></svg>`;l.appendChild(el);}
}

function buildEq() {
  return eqBase(8,13,48,(x,H,i)=>{const c=`hsl(${100+i*8},55%,${42+i*3}%)`;return `<path d="M${x},${H} Q${x-6},${H-H*0.4} ${x},${H*0.1} Q${x+6},${H-H*0.4} ${x},${H} Z" fill="${c}" opacity="0.75"/>`;});
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
