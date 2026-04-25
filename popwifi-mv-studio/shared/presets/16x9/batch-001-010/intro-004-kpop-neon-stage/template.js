// KPop Neon Stage 16x9 — 강렬한 네온, 케이팝 무대
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawNeonLines(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#050510'); grad.addColorStop(0.5, '#0a0520'); grad.addColorStop(1, '#020210');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const pulse = 0.08 + Math.sin(t * 2.0) * 0.03;
  const glow = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, H * 0.5);
  glow.addColorStop(0, 'rgba(255,0,180,' + pulse + ')'); glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
}

function drawNeonLines(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 0.8);
  ctx.strokeStyle = 'rgba(0,229,255,' + (0.55 + Math.sin(t * 2.5) * 0.15) + ')';
  ctx.lineWidth = Math.max(2, W * 0.003);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.03);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,0,180,' + (0.30 + Math.sin(t * 2.0 + 1) * 0.10) + ')';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, W * 0.10, H * 0.11, W * 0.80, H * 0.62, H * 0.025);
  ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.5);
  ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = Math.floor(W * 0.04);
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'bold ' + Math.floor(W * 0.048) + "px 'Black Han Sans', sans-serif";
  ctx.fillText(data.song?.title || 'KPop Neon Stage', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['LIKE', 'SUB', 'ALARM'];
  const colors = ['rgba(255,0,180,0.85)', 'rgba(0,229,255,0.85)', 'rgba(180,0,255,0.85)'];
  const chipW = W * 0.13; const chipH = H * 0.10; const gap = W * 0.025;
  const total = chipW * 3 + gap * 2;
  let sx = (W - total) / 2; const sy = H * 0.43;
  items.forEach((label, i) => {
    ctx.fillStyle = colors[i];
    roundRect(ctx, sx, sy, chipW, chipH, H * 0.05); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
    ctx.font = 'bold ' + Math.floor(W * 0.018) + "px 'Black Han Sans', sans-serif";
    ctx.fillText(label, sx + chipW / 2, sy + chipH * 0.56);
    sx += chipW + gap;
  });
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(5,5,16,0.88)'; ctx.strokeStyle = 'rgba(0,229,255,0.45)';
  ctx.lineWidth = Math.max(1.5, W * 0.002);
  roundRect(ctx, bX, bY, bW, bH, H * 0.03); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
  ctx.font = 'bold ' + Math.floor(W * 0.020) + "px 'Black Han Sans', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'KPop Neon Stage', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.fillStyle = accentColor + 'aa';
  const size = h * (0.18 + Math.abs(Math.sin(t * 2)) * 0.05);
  const cx = x + w / 2; const cy = y + h / 2;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 1.5);
  ctx.fillRect(-size / 2, -size / 2, size, size);
  ctx.restore(); ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'intro-004-kpop-neon-stage', name: 'KPop Neon Stage', ratio: '16x9', accentColor: '#00e5ff' };
module.exports = { draw, drawVisSlot, meta };
