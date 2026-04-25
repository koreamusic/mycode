// City Pop Sunset Grid 16x9 — 레트로 시티팝, 석양 그리드
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H);
  drawRetroGrid(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#1a0a1e'); grad.addColorStop(0.4, '#2a1040'); grad.addColorStop(0.8, '#3a1828'); grad.addColorStop(1, '#1a0810');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const sun = ctx.createRadialGradient(W * 0.5, H * 0.55, 0, W * 0.5, H * 0.55, H * 0.32);
  sun.addColorStop(0, 'rgba(255,120,40,0.35)'); sun.addColorStop(0.5, 'rgba(220,60,120,0.18)'); sun.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = sun; ctx.fillRect(0, 0, W, H);
}

function drawRetroGrid(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.2);
  ctx.strokeStyle = 'rgba(255,100,180,' + (0.18 * p) + ')'; ctx.lineWidth = Math.max(0.8, W * 0.001);
  for (let i = 1; i < 8; i++) {
    ctx.beginPath(); ctx.moveTo(W * (i / 8), H * 0.08); ctx.lineTo(W * (i / 8), H * 0.76); ctx.stroke();
  }
  for (let i = 1; i < 5; i++) {
    ctx.beginPath(); ctx.moveTo(W * 0.08, H * (0.08 + i * 0.17)); ctx.lineTo(W * 0.92, H * (0.08 + i * 0.17)); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(255,180,60,' + (0.45 + p * 0.25) + ')'; ctx.lineWidth = Math.max(1.5, W * 0.002);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.03); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.7);
  ctx.fillStyle = '#ffe8c0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'bold ' + Math.floor(W * 0.042) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'City Pop Sunset Grid', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['LIKE', 'SUB', 'BELL'];
  const colors = ['rgba(255,100,60,0.80)', 'rgba(220,60,150,0.80)', 'rgba(255,180,60,0.80)'];
  const chipW = W * 0.12; const chipH = H * 0.10; const gap = W * 0.025;
  const total = chipW * 3 + gap * 2; let sx = (W - total) / 2; const sy = H * 0.43;
  items.forEach((label, i) => {
    ctx.fillStyle = colors[i];
    roundRect(ctx, sx, sy, chipW, chipH, H * 0.05); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
    ctx.font = 'bold ' + Math.floor(W * 0.017) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, sx + chipW / 2, sy + chipH * 0.56);
    sx += chipW + gap;
  });
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(26,8,30,0.86)'; ctx.strokeStyle = 'rgba(255,100,180,0.40)';
  ctx.lineWidth = Math.max(1, W * 0.002);
  roundRect(ctx, bX, bY, bW, bH, H * 0.03); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffe8c0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'City Pop Sunset Grid', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '77'; ctx.lineWidth = Math.max(0.8, w * 0.012);
  const len = w * (0.25 + Math.abs(Math.sin(t * 0.8)) * 0.10);
  ctx.beginPath(); ctx.moveTo(x + w * 0.12, y + h * 0.5); ctx.lineTo(x + w * 0.12 + len, y + h * 0.5); ctx.stroke();
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'intro-006-city-pop-sunset-grid', name: 'City Pop Sunset Grid', ratio: '16x9', accentColor: '#ff64b4' };
module.exports = { draw, drawVisSlot, meta };
