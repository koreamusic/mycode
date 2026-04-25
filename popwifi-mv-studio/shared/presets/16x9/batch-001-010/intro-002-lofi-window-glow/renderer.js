const frameLayer = document.getElementById('frameLayer');
const frameSvg = document.getElementById('frameSvg');
const particles = document.getElementById('particles');
const titleMain = document.getElementById('titleMain');
const titleRow = document.getElementById('titleRow');
const subLayer = document.getElementById('subLayer');
const heartPath = document.getElementById('heartPath');
const bellG = document.getElementById('bellG');
const bottomBar = document.getElementById('bottomBar');
const eqWrap = document.getElementById('eqWrap');

function buildPianoFrame(c, cs) {
  const corner = () => `<g filter="url(#sf)">${[['26,26','1,1'],['874,26','-1,1'],['26,480','1,-1'],['874,480','-1,-1']].map(([t, s]) => `<g transform="translate(${t}) scale(${s})"><path d="M0,70 L0,0 L70,0" stroke="${c}" stroke-width="2" fill="none" opacity="0.8"/><path d="M0,50 L0,8 L50,8" stroke="${c}" stroke-width="0.8" fill="none" opacity="0.4"/><rect x="0" y="0" width="4" height="35" rx="1" fill="${c}" opacity="0.6"/><rect x="0" y="0" width="35" height="4" rx="1" fill="${c}" opacity="0.6"/><rect x="8" y="8" width="2.5" height="22" rx="1" fill="${c}" opacity="0.35"/><rect x="8" y="8" width="22" height="2.5" rx="1" fill="${c}" opacity="0.35"/><circle cx="4" cy="4" r="3" fill="${c}" opacity="0.7"/></g>`).join('')}</g>`;
  return `<defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c}" stop-opacity="0.9"/><stop offset="50%" stop-color="${c}" stop-opacity="0.6"/><stop offset="100%" stop-color="${c}" stop-opacity="0.8"/></linearGradient><filter id="sf"><feGaussianBlur stdDeviation="0.7"/></filter></defs><rect x="16" y="16" width="868" height="474" rx="2" stroke="url(#fg)" stroke-width="0.6" opacity="0.35"/><rect x="26" y="26" width="848" height="454" rx="1" stroke="url(#fg)" stroke-width="1.5" opacity="0.8"/><rect x="36" y="36" width="828" height="434" rx="1" stroke="${cs}" stroke-width="0.5" opacity="0.5"/>${corner()}<line x1="180" y1="26" x2="720" y2="26" stroke="url(#fg)" stroke-width="0.5" opacity="0.3"/><line x1="180" y1="480" x2="720" y2="480" stroke="url(#fg)" stroke-width="0.5" opacity="0.3"/>`;
}

function buildNoteParticles(layer, c) {
  layer.innerHTML = '';
  const notes = ['♩', '♪', '♫', '♬'];
  for (let i = 0; i < 14; i += 1) {
    const el = document.createElement('div');
    const size = 12 + Math.random() * 14;
    const dur = 6 + Math.random() * 8;
    const del = -(Math.random() * dur);
    const x = Math.random() * 100;
    const op = 0.15 + Math.random() * 0.3;
    const sx = (Math.random() - 0.5) * 80;
    el.style.cssText = `position:absolute;left:${x}%;top:-20px;font-size:${size}px;color:${c};opacity:${op};animation:noteFall${i} ${dur}s ${del}s linear infinite;pointer-events:none;`;
    el.innerHTML = `<style>@keyframes noteFall${i}{0%{transform:translateY(-20px) translateX(0) rotate(0deg);opacity:0;}8%{opacity:${op};}88%{opacity:${op};}100%{transform:translateY(540px) translateX(${sx}px) rotate(${(Math.random() - 0.5) * 180}deg);opacity:0;}}</style>${notes[i % 4]}`;
    layer.appendChild(el);
  }
}

function buildPianoEq() {
  const svgW = 130;
  const svgH = 48;
  const wW = 14;
  const wCount = 9;
  const bPos = [1, 2, 4, 5, 6, 8];
  const durs = [0.5, 0.38, 0.62, 0.41, 0.55, 0.35, 0.48, 0.67, 0.44];
  let svg = `<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}"><defs><linearGradient id="wkg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e8dfd0"/><stop offset="100%" stop-color="#c8b89a"/></linearGradient></defs>`;
  for (let i = 0; i < wCount; i += 1) {
    const x = i * wW + 1;
    const an = `wk${i}`;
    svg += `<style>@keyframes ${an}{0%{transform:translateY(0);}100%{transform:translateY(3px);}}</style><rect x="${x}" y="2" width="${wW - 2}" height="${svgH - 2}" rx="2" fill="url(#wkg)" stroke="rgba(100,80,40,0.3)" stroke-width="0.5" style="animation:${an} ${durs[i]}s ease-in-out infinite alternate;transform-origin:top center;transform-box:fill-box;"/>`;
  }
  bPos.forEach((bi, j) => {
    const x = bi * wW - 5;
    const an = `bk${j}`;
    svg += `<style>@keyframes ${an}{0%{transform:translateY(0);}100%{transform:translateY(4px);}}</style><rect x="${x}" y="2" width="8" height="${svgH * 0.6}" rx="1.5" fill="#1c1410" style="animation:${an} ${[0.44,0.58,0.39,0.52,0.63,0.46][j]}s ease-in-out infinite alternate;transform-origin:top center;transform-box:fill-box;"/>`;
  });
  return svg + '</svg>';
}

function clearState() {
  frameLayer.classList.remove('show', 'hide');
  titleMain.classList.remove('show', 'hide');
  titleRow.classList.remove('show', 'hide');
  subLayer.classList.remove('show', 'hide');
  bottomBar.classList.remove('show');
  heartPath.classList.remove('draw');
  bellG.classList.remove('ring');
}

function applyPhase(t) {
  clearState();
  if (t >= 0.4 && t < 10) frameLayer.classList.add('show');
  if (t >= 1 && t < 5) {
    titleMain.classList.add('show');
    titleRow.classList.add('show');
  } else if (t >= 5) {
    titleMain.classList.add('hide');
    titleRow.classList.add('hide');
  }
  if (t >= 5 && t < 10) {
    subLayer.classList.add('show');
    heartPath.classList.add('draw');
    bellG.classList.add('ring');
  } else if (t >= 10) {
    subLayer.classList.add('hide');
  }
  if (t >= 10) bottomBar.classList.add('show');
}

function loop() {
  const cycle = 12;
  const start = performance.now();
  function tick(now) {
    const t = ((now - start) / 1000) % cycle;
    applyPhase(t);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

frameSvg.innerHTML = buildPianoFrame('#c8a84a', 'rgba(200,168,74,0.7)');
buildNoteParticles(particles, '#c8a84a');
eqWrap.innerHTML = buildPianoEq();
loop();
