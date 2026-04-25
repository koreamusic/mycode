// Night Subway Glow 16x9 — 야간 지하철 네온 모션
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawSubwayFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#02020c'); grad.addColorStop(0.5, '#040410'); grad.addColorStop(1, '#020208');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const pulse = 0.10 + Math.sin(t * 1.6) * 0.03;
  const g1 = ctx.createRadialGradient(W * 0.35, H * 0.50, 0, W * 0.35, H * 0.50, H * 0.35);
  g1.addColorStop(0, 'rgba(0,200,220,' + pulse + ')'); g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
  const g2 = ctx.createRadialGradient(W * 0.68, H * 0.42, 0, W * 0.68, H * 0.42, H * 0.30);
  g2.addColorStop(0, 'rgba(120,60,200,' + pulse * 0.7 + ')'); g2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
}

function drawSubwayFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 0.8);
  ctx.strokeStyle = 'rgba(0,210,230,' + (0.48 + p * 0.22) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.002);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.02); ctx.stroke();
  ctx.strokeStyle = 'rgba(120,60,200,' + (0.18 * p) + ')';
  ctx.lineWidth = Math.max(0.8, W * 0.001);
  roundRect(ctx, W * 0.085, H * 0.085, W * 0.83, H * 0.67, H * 0.018); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.8);
  ctx.shadowColor = '#00d2e6'; ctx.shadowBlur = Math.floor(W * 0.020);
  ctx.fillStyle = '#e8f8ff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'Night Subway Glow', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['LIKE', 'SUB', 'BELL'];
  const colors = ['rgba(0,200,220,0.75)', 'rgba(120,60,200,0.75)', 'rgba(0,200,220,0.75)'];
  const chipW = W * 0.12; const chipH = H * 0.09; const gap = W * 0.022;
  const total = chipW * 3 + gap * 2; let sx = (W - total) / 2; const sy = H * 0.44;
  items.forEach((label, i) => {
    ctx.fillStyle = colors[i];
    roundRect(ctx, sx, sy, chipW, chipH, H * 0.04); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
    ctx.font = 'bold ' + Math.floor(W * 0.016) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, sx + chipW / 2, sy + chipH * 0.55);
    sx += chipW + gap;
  });
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(2,2,12,0.88)'; ctx.strokeStyle = 'rgba(0,210,230,0.30)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.02); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e8f8ff'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Night Subway Glow', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '77'; ctx.lineWidth = Math.max(1, w * 0.012);
  const lineX = x + w * (0.45 + Math.sin(t * 2.0) * 0.10);
  ctx.beginPath(); ctx.moveTo(lineX, y + h * 0.15); ctx.lineTo(lineX, y + h * 0.85); ctx.stroke();
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'intro-045-night-subway-glow', name: 'Night Subway Glow', ratio: '16x9', accentColor: '#00c8e6' };
module.exports = { draw, drawVisSlot, meta };
