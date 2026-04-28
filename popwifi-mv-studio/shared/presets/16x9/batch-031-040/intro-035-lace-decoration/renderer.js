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
  const c='#d0c0e0';const sz=16;const laceH=(y,flip)=>{let s='';for(let x=24+sz/2;x<876;x+=sz){const cy=flip?y+sz*0.6:y-sz*0.6;s+=`<path d="M${x-sz/2},${y} Q${x},${cy} ${x+sz/2},${y}" stroke="${c}" stroke-width="0.9" fill="none" opacity="0.45"/>`;s+=`<circle cx="${x}" cy="${y}" r="2" fill="${c}" opacity="0.30"/>`;}return s;};const laceV=(x,flip)=>{let s='';for(let y=24+sz/2;y<482;y+=sz){const cx=flip?x+sz*0.6:x-sz*0.6;s+=`<path d="M${x},${y-sz/2} Q${cx},${y} ${x},${y+sz/2}" stroke="${c}" stroke-width="0.9" fill="none" opacity="0.40"/>`;s+=`<circle cx="${x}" cy="${y}" r="2" fill="${c}" opacity="0.28"/>`;}return s;};return `<defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c}" stop-opacity="0.82"/><stop offset="100%" stop-color="${c}" stop-opacity="0.48"/></linearGradient><filter id="sf"><feGaussianBlur stdDeviation="0.5"/></filter><filter id="glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <rect x="24" y="24" width="852" height="458" stroke="${c}" stroke-width="0.8" fill="none" opacity="0.30"/>
    ${laceH(24,true)}${laceH(482,false)}${laceV(24,true)}${laceV(876,false)}`;
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<10;i++){const el=document.createElement('div');const s=4+Math.random()*4,x=Math.random()*100,y=Math.random()*100,dur=3+Math.random()*4,del=-(Math.random()*dur);el.style.cssText=`position:absolute;left:${x}%;top:${y}%;pointer-events:none;`;el.innerHTML=`<svg width="${s*4}" height="${s*4}">${[0,45,90,135].map(a=>`<ellipse cx="${s*2}" cy="${s*2}" rx="${s*1.5}" ry="${s*0.55}" fill="rgba(208,192,224,0.22)" transform="rotate(${a},${s*2},${s*2})"><animate attributeName="opacity" values="0.08;0.35;0.08" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></ellipse>`).join('')}</svg>`;l.appendChild(el);}
}

function buildEq() {
  const n=8,durs=[0.34,0.50,0.40,0.56,0.36,0.52,0.44,0.60];let svg=`<svg width="104" height="48" viewBox="0 0 104 48">`;for(let i=0;i<n;i++){const x=4+i*13,h=14+i%4*9,an=`lc${_ID()}`,r=4+i%3;svg+=`<style>@keyframes ${an}{0%{transform:scaleY(0.15);}100%{transform:scaleY(1);}}</style><g style="animation:${an} ${durs[i]}s ease-in-out infinite alternate;transform-origin:${x+4}px 48px;transform-box:fill-box;">${[0,45,90,135].map(a=>`<ellipse cx="${x+4}" cy="${48-h/2}" rx="${r}" ry="${h/2}" fill="rgba(208,192,224,0.48)" transform="rotate(${a},${x+4},${48-h/2})"/>`).join('')}</g>`;}return svg+'</svg>';
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
