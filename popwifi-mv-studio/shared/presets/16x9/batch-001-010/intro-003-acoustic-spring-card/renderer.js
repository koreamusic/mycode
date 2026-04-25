const frameLayer = document.getElementById('frameLayer');
const frameSvg = document.getElementById('frameSvg');
const particles = document.getElementById('particles');
const titleMain = document.getElementById('titleMain');
const titleRow = document.getElementById('titleRow');
const subLayer = document.getElementById('subLayer');
const leafLike = document.getElementById('leafLike');
const bellG = document.getElementById('bellG');
const bottomBar = document.getElementById('bottomBar');
const eqWrap = document.getElementById('eqWrap');

function baseFrame(strokeMain, strokeSub, cornerFn) {
  return `<defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${strokeMain}" stop-opacity="0.9"/><stop offset="50%" stop-color="${strokeMain}" stop-opacity="0.6"/><stop offset="100%" stop-color="${strokeMain}" stop-opacity="0.8"/></linearGradient><filter id="sf"><feGaussianBlur stdDeviation="0.7"/></filter></defs><rect x="16" y="16" width="868" height="474" rx="2" stroke="url(#fg)" stroke-width="0.6" opacity="0.35"/><rect x="26" y="26" width="848" height="454" rx="1" stroke="url(#fg)" stroke-width="1.5" opacity="0.8"/><rect x="36" y="36" width="828" height="434" rx="1" stroke="${strokeSub}" stroke-width="0.5" opacity="0.5"/>${cornerFn()}<line x1="180" y1="26" x2="720" y2="26" stroke="url(#fg)" stroke-width="0.5" opacity="0.3"/><line x1="180" y1="480" x2="720" y2="480" stroke="url(#fg)" stroke-width="0.5" opacity="0.3"/>`;
}

function buildMapleFrame() {
  const c = '#d4701a';
  const cs = 'rgba(210,120,40,0.3)';
  const leaf = (x, y, r, op) => `<path d="M${x},${y} L${x-4},${y-14} L${x-9},${y-10} L${x-12},${y-22} L${x-6},${y-18} L${x-2},${y-32} L${x},${y-26} L${x+2},${y-32} L${x+6},${y-18} L${x+12},${y-22} L${x+9},${y-10} L${x+4},${y-14} Z" fill="#d4701a" opacity="${op}" transform="rotate(${r},${x},${y})"/>`;
  const corner = () => `<g filter="url(#sf)"><path d="M26,100 Q42,55 80,26" stroke="${c}" stroke-width="1.2" opacity="0.6" fill="none"/>${leaf(38,78,-20,0.7)}${leaf(52,58,-45,0.65)}${leaf(66,42,-10,0.7)}${leaf(76,30,20,0.65)}<g transform="translate(900,0) scale(-1,1)"><path d="M26,100 Q42,55 80,26" stroke="${c}" stroke-width="1.2" opacity="0.6" fill="none"/>${leaf(38,78,-20,0.7)}${leaf(52,58,-45,0.65)}${leaf(66,42,-10,0.7)}${leaf(76,30,20,0.65)}</g><g transform="translate(0,506) scale(1,-1)"><path d="M26,100 Q42,55 80,26" stroke="${c}" stroke-width="1.2" opacity="0.55" fill="none"/>${leaf(38,78,-20,0.6)}${leaf(66,42,-10,0.6)}</g><g transform="translate(900,506) scale(-1,-1)"><path d="M26,100 Q42,55 80,26" stroke="${c}" stroke-width="1.2" opacity="0.55" fill="none"/>${leaf(38,78,-20,0.6)}${leaf(66,42,-10,0.6)}</g></g>`;
  return baseFrame(c, cs, corner);
}

function buildMapleParticles(layer) {
  layer.innerHTML = '';
  const colors = ['#d4701a', '#e08030', '#c44010', '#f07828'];
  for (let i = 0; i < 18; i += 1) {
    const el = document.createElement('div');
    const size = 8 + Math.random() * 10;
    const dur = 6 + Math.random() * 7;
    const del = -(Math.random() * dur);
    const x = Math.random() * 100;
    const sx = (Math.random() - 0.5) * 100;
    const r0 = Math.random() * 360;
    const r1 = r0 + (Math.random() - 0.5) * 220;
    const op = 0.35 + Math.random() * 0.4;
    const c = colors[i % 4];
    el.style.cssText = `position:absolute;left:${x}%;top:-20px;opacity:0;animation:mapleFall${i} ${dur}s ${del}s linear infinite;pointer-events:none;`;
    el.innerHTML = `<style>@keyframes mapleFall${i}{0%{opacity:0;transform:translateY(-20px) translateX(0) rotate(${r0}deg) scale(0.7);}8%{opacity:${op};}88%{opacity:${op};}100%{opacity:0;transform:translateY(540px) translateX(${sx}px) rotate(${r1}deg) scale(0.9);}}</style><svg width="${size}" height="${size}" viewBox="0 0 20 20"><path d="M10,18 L6,6 L2,10 L0,2 L4,6 L8,0 L10,5 L12,0 L16,6 L20,2 L18,10 L14,6 Z" fill="${c}" opacity="0.9"/></svg>`;
    layer.appendChild(el);
  }
}

function eqBase(count, colW, maxH, shapeFn) {
  const d = [0.42,0.57,0.36,0.63,0.44,0.52,0.38,0.66,0.46,0.54,0.40];
  const s = [0.28,0.44,0.20,0.50,0.32,0.46,0.22,0.54,0.36,0.40,0.26];
  let svg = `<svg width="${count * colW}" height="${maxH}" viewBox="0 0 ${count * colW} ${maxH}" overflow="visible">`;
  for (let i = 0; i < count; i += 1) {
    const x = i * colW + colW / 2;
    const an = `eqMaple${i}`;
    svg += `<style>@keyframes ${an}{0%{transform:scaleY(${s[i]}) translateY(${maxH * (1 - s[i]) * 0.5}px);}100%{transform:scaleY(1) translateY(0);}}</style><g style="animation:${an} ${d[i]}s ease-in-out infinite alternate;transform-origin:bottom center;transform-box:fill-box;">${shapeFn(x, maxH, i)}</g>`;
  }
  return svg + '</svg>';
}

function buildMapleEq() {
  return eqBase(10, 13, 46, (x, H, i) => {
    const c = `hsl(${18 + i * 4},78%,${40 + i * 3}%)`;
    return `<path d="M${x},${H} L${x-5},${H-18} L${x-10},${H-12} L${x-13},${H-28} L${x-7},${H-22} L${x-3},${H-40} L${x},${H-34} L${x+3},${H-40} L${x+7},${H-22} L${x+13},${H-28} L${x+10},${H-12} L${x+5},${H-18} Z" fill="${c}" opacity="0.82"/>`;
  });
}

function clearState() {
  frameLayer.classList.remove('show', 'hide');
  titleMain.classList.remove('show', 'hide');
  titleRow.classList.remove('show', 'hide');
  subLayer.classList.remove('show', 'hide');
  bottomBar.classList.remove('show');
  leafLike.classList.remove('active');
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
    leafLike.classList.add('active');
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

frameSvg.innerHTML = buildMapleFrame();
buildMapleParticles(particles);
eqWrap.innerHTML = buildMapleEq();
loop();
