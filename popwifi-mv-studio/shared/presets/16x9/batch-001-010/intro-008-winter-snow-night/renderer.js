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
  const c='#90c0e8';const sf=(x,y,s,op)=>{const arms=6;let ln='';for(let a=0;a<arms;a++){const ang=a*(Math.PI/3),ex=x+Math.cos(ang)*s,ey=y+Math.sin(ang)*s;ln+=`<line x1="${x}" y1="${y}" x2="${ex}" y2="${ey}" stroke="${c}" stroke-width="1.1" opacity="${op}"/>`;const mx=x+Math.cos(ang)*s*0.5,my=y+Math.sin(ang)*s*0.5;ln+=`<line x1="${mx}" y1="${my}" x2="${mx+Math.cos(ang+Math.PI/4)*s*0.25}" y2="${my+Math.sin(ang+Math.PI/4)*s*0.25}" stroke="${c}" stroke-width="0.8" opacity="${op*0.7}"/>`;}return ln+`<circle cx="${x}" cy="${y}" r="${s*0.12}" fill="${c}" opacity="${op}"/>`;};const winFrame=`<line x1="450" y1="24" x2="450" y2="482" stroke="${c}" stroke-width="0.6" opacity="0.22"/><line x1="24" y1="253" x2="876" y2="253" stroke="${c}" stroke-width="0.6" opacity="0.22"/>`;const corners=`<g filter="url(#sf)">${sf(46,46,18,0.65)}${sf(72,26,12,0.55)}${sf(26,72,12,0.55)}<g transform="translate(900,0) scale(-1,1)">${sf(46,46,18,0.65)}${sf(72,26,12,0.55)}</g><g transform="translate(0,506) scale(1,-1)">${sf(46,46,15,0.55)}</g><g transform="translate(900,506) scale(-1,-1)">${sf(46,46,15,0.55)}</g></g>`;return rectFrame(c,'rgba(140,195,240,0.26)',winFrame+corners);
}

function buildParticles(l) {
  l.innerHTML='';for(let i=0;i<25;i++){const el=document.createElement('div');const s=3+Math.random()*7,dur=5+Math.random()*9,del=-(Math.random()*dur),x=Math.random()*100,sx=(Math.random()-0.5)*50,op=0.3+Math.random()*0.5;el.style.cssText=`position:absolute;left:${x}%;top:-20px;opacity:0;animation:snF${i} ${dur}s ${del}s linear infinite;pointer-events:none;`;el.innerHTML=`<style>@keyframes snF${i}{0%{opacity:0;transform:translateY(-20px) rotate(0deg);}10%{opacity:${op};}85%{opacity:${op};}100%{opacity:0;transform:translateY(540px) translateX(${sx}px) rotate(${360*Math.random()}deg);}}</style><svg width="${s*2}" height="${s*2}"><circle cx="${s}" cy="${s}" r="${s*0.6}" fill="#c0e0ff" opacity="0.9"/></svg>`;l.appendChild(el);}
}

function buildEq() {
  return eqBase(11,12,48,(x,H,i)=>{const arms=6,size=5+i%3;let lines='';for(let a=0;a<arms;a++){const ang=a*(Math.PI/3);lines+=`<line x1="${x}" y1="${H/2}" x2="${x+Math.cos(ang)*size}" y2="${H/2+Math.sin(ang)*size}" stroke="#90c0e8" stroke-width="1.2" opacity="0.75"/>`;}return lines+`<circle cx="${x}" cy="${H/2}" r="2" fill="#c0e4ff" opacity="0.85"/><line x1="${x}" y1="${H/2+size}" x2="${x}" y2="${H}" stroke="rgba(144,192,232,0.3)" stroke-width="1"/>`;});
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
