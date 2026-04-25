const frameLayer = document.getElementById('frameLayer');
const frameSvg = document.getElementById('frameSvg');
const particles = document.getElementById('particles');
const titleMain = document.getElementById('titleMain');
const titleRow = document.getElementById('titleRow');
const subLayer = document.getElementById('subLayer');
const fireflyLike = document.getElementById('fireflyLike');
const fireflyBell = document.getElementById('fireflyBell');
const bottomBar = document.getElementById('bottomBar');
const eqWrap = document.getElementById('eqWrap');

function baseFrame(strokeMain, strokeSub, cornerFn) {
  return `<defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${strokeMain}" stop-opacity="0.9"/><stop offset="50%" stop-color="${strokeMain}" stop-opacity="0.6"/><stop offset="100%" stop-color="${strokeMain}" stop-opacity="0.8"/></linearGradient><filter id="sf"><feGaussianBlur stdDeviation="0.7"/></filter></defs><rect x="16" y="16" width="868" height="474" rx="2" stroke="url(#fg)" stroke-width="0.6" opacity="0.35"/><rect x="26" y="26" width="848" height="454" rx="1" stroke="url(#fg)" stroke-width="1.5" opacity="0.8"/><rect x="36" y="36" width="828" height="434" rx="1" stroke="${strokeSub}" stroke-width="0.5" opacity="0.5"/>${cornerFn()}<line x1="180" y1="26" x2="720" y2="26" stroke="url(#fg)" stroke-width="0.5" opacity="0.3"/><line x1="180" y1="480" x2="720" y2="480" stroke="url(#fg)" stroke-width="0.5" opacity="0.3"/>`;
}

function buildFireflyFrame() {
  const c = '#7ae840';
  const cs = 'rgba(100,200,60,0.28)';
  const corner = () => `<g filter="url(#sf)">${[['26,26','1,1'],['874,26','-1,1'],['26,480','1,-1'],['874,480','-1,-1']].map(([t, s]) => `<g transform="translate(${t}) scale(${s})"><path d="M0,80 Q20,40 60,0" stroke="${c}" stroke-width="1" opacity="0.5" fill="none"/><path d="M0,55 Q30,25 55,0" stroke="${c}" stroke-width="0.7" opacity="0.35" fill="none"/>${[0,1,2,3,4].map(i => { const fx = 10 + i * 12; const fy = 70 - i * 14; const r = 2 + i * 0.35; return `<circle cx="${fx}" cy="${fy}" r="${r}" fill="${c}" opacity="${0.5 + i * 0.08}"><animate attributeName="opacity" values="${0.3 + i * 0.06};${0.8 + i * 0.04};${0.3 + i * 0.06}" dur="${0.8 + i * 0.2}s" repeatCount="indefinite"/><animate attributeName="r" values="${r};${r * 1.6};${r}" dur="${0.8 + i * 0.2}s" repeatCount="indefinite"/></circle>`; }).join('')}</g>`).join('')}</g>`;
  return baseFrame(c, cs, corner);
}

function buildFireflyParticles(layer) {
  layer.innerHTML = '';
  for (let i = 0; i < 20; i += 1) {
    const el = document.createElement('div');
    const size = 3 + Math.random() * 4;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = 1.5 + Math.random() * 2;
    const del = -(Math.random() * dur);
    el.style.cssText = `position:absolute;left:${x}%;top:${y}%;pointer-events:none;`;
    el.innerHTML = `<svg width="${size * 4}" height="${size * 4}" viewBox="0 0 20 20"><circle cx="10" cy="10" r="${size}" fill="#7ae840" opacity="0.8"><animate attributeName="opacity" values="0.1;0.9;0.1" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/><animate attributeName="r" values="${size};${size * 1.8};${size}" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></circle><circle cx="10" cy="10" r="${size * 0.5}" fill="#ccff99" opacity="0.9"><animate attributeName="opacity" values="0.2;1;0.2" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/></circle></svg>`;
    layer.appendChild(el);
  }
}

function eqBase(count, colW, maxH, shapeFn) {
  const d = [0.42,0.57,0.36,0.63,0.44,0.52,0.38,0.66,0.46,0.54,0.40];
  const s = [0.28,0.44,0.20,0.50,0.32,0.46,0.22,0.54,0.36,0.40,0.26];
  let svg = `<svg width="${count * colW}" height="${maxH}" viewBox="0 0 ${count * colW} ${maxH}" overflow="visible">`;
  for (let i = 0; i < count; i += 1) {
    const x = i * colW + colW / 2;
    const an = `eqFirefly${i}`;
    svg += `<style>@keyframes ${an}{0%{transform:scaleY(${s[i]}) translateY(${maxH * (1 - s[i]) * 0.5}px);}100%{transform:scaleY(1) translateY(0);}}</style><g style="animation:${an} ${d[i]}s ease-in-out infinite alternate;transform-origin:bottom center;transform-box:fill-box;">${shapeFn(x, maxH, i)}</g>`;
  }
  return svg + '</svg>';
}

function buildFireflyEq() {
  return eqBase(11, 12, 48, (x, H, i) => {
    const c = `hsl(${100 + i * 8},80%,${55 + i * 3}%)`;
    return `<line x1="${x}" y1="${H}" x2="${x}" y2="4" stroke="${c}" stroke-width="1" opacity="0.25"/><circle cx="${x}" cy="4" r="4" fill="${c}" opacity="0.85"><animate attributeName="opacity" values="0.4;1;0.4" dur="${0.5 + i * 0.1}s" repeatCount="indefinite"/><animate attributeName="r" values="3;5.5;3" dur="${0.5 + i * 0.1}s" repeatCount="indefinite"/></circle><circle cx="${x}" cy="4" r="2" fill="white" opacity="0.6"/>`;
  });
}

function clearState() {
  frameLayer.classList.remove('show', 'hide');
  titleMain.classList.remove('show', 'hide');
  titleRow.classList.remove('show', 'hide');
  subLayer.classList.remove('show', 'hide');
  bottomBar.classList.remove('show');
  fireflyLike.classList.remove('active');
  fireflyBell.classList.remove('active');
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
    fireflyLike.classList.add('active');
    fireflyBell.classList.add('active');
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

frameSvg.innerHTML = buildFireflyFrame();
buildFireflyParticles(particles);
eqWrap.innerHTML = buildFireflyEq();
loop();
