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
  const c='#40b0e0';const waveTop=(y,amp,op,thick)=>`<path d="M24,${y} Q200,${y-amp} 450,${y} Q700,${y+amp} 876,${y}" stroke="${c}" stroke-width="${thick}" fill="none" opacity="${op}"/><path d="M24,${y+amp*0.4} Q200,${y-amp*0.6} 450,${y+amp*0.4} Q700,${y+amp*1.4} 876,${y+amp*0.4}" stroke="${c}" stroke-width="${thick*0.5}" fill="none" opacity="${op*0.5}"/>`;const waveBot=(y,amp,op,thick)=>`<path d="M24,${y} Q200,${y+amp} 450,${y} Q700,${y-amp} 876,${y}" stroke="${c}" stroke-width="${thick}" fill="none" opacity="${op}"/><path d="M24,${y-amp*0.4} Q200,${y+amp*0.6} 450,${y-amp*0.4} Q700,${y-amp*1.4} 876,${y-amp*0.4}" stroke="${c}" stroke-width="${thick*0.5}" fill="none" opacity="${op*0.5}"/>`;return `<defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c}" stop-opacity="0.85"/><stop offset="100%" stop-color="${c}" stop-opacity="0.52"/></linearGradient><filter id="sf"><feGaussianBlur stdDeviation="0.5"/></filter><filter id="glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    ${waveTop(26,8,0.72,2)}${waveBot(480,8,0.72,2)}
    <line x1="24" y1="38" x2="24" y2="468" stroke="${c}" stroke-width="2" opacity="0.60"/>
    <line x1="876" y1="38" x2="876" y2="468" stroke="${c}" stroke-width="2" opacity="0.60"/>
    <line x1="36" y1="50" x2="36" y2="456" stroke="${c}" stroke-width="0.7" opacity="0.30"/>
    <line x1="864" y1="50" x2="864" y2="456" stroke="${c}" stroke-width="0.7" opacity="0.30"/>`;
}

function buildParticles(l) {
  l.innerHTML='';l.innerHTML=`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 900 506">${[0,1,2,3,4].map(i=>`<path fill="none" stroke="rgba(64,176,224,${0.05-i*0.008})" stroke-width="${1.8-i*0.3}"><animate attributeName="d" values="M0,${200+i*30} Q225,${155+i*25} 450,${200+i*30} Q675,${245+i*35} 900,${200+i*30};M0,${200+i*30} Q225,${245+i*35} 450,${200+i*30} Q675,${155+i*25} 900,${200+i*30};M0,${200+i*30} Q225,${155+i*25} 450,${200+i*30} Q675,${245+i*35} 900,${200+i*30}" dur="${4+i*0.8}s" repeatCount="indefinite"/></path>`).join('')}</svg>`
}

function buildEq() {
  const svgW=100,svgH=48,n=7,durs=[0.30,0.46,0.36,0.54,0.32,0.50,0.42];let svg=`<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;for(let i=0;i<n;i++){const x=5+i*13,h=16+i%3*12,an=`dw${_ID()}`,an2=`dw2${_ID()}`;svg+=`<style>@keyframes ${an}{0%{d:path("M ${x-5} ${svgH} Q ${x} ${svgH-h} ${x+5} ${svgH}");}100%{d:path("M ${x-5} ${svgH-4} Q ${x} ${svgH-h-4} ${x+5} ${svgH-4}");}}</style><style>@keyframes ${an2}{0%{d:path("M ${x-4} ${svgH} Q ${x} ${svgH-h*0.6} ${x+4} ${svgH}");}100%{d:path("M ${x-4} ${svgH-4} Q ${x} ${svgH-h*0.6-4} ${x+4} ${svgH-4}");}}</style><path d="M ${x-5} ${svgH} Q ${x} ${svgH-h} ${x+5} ${svgH}" fill="rgba(64,176,224,0.72)" style="animation:${an} ${durs[i]}s ease-in-out infinite alternate;"/><path d="M ${x-4} ${svgH} Q ${x} ${svgH-h*0.6} ${x+4} ${svgH}" fill="rgba(64,176,224,0.40)" style="animation:${an2} ${durs[i]*0.7}s ease-in-out infinite alternate;"/>`;}return svg+'</svg>';
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
