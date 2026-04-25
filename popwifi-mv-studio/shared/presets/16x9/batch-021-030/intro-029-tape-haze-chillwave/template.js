// Tape Haze Chillwave 16x9 — 아날로그 헤이즈, 카세트 칠웨이브
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawCassetteFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#100818'); grad.addColorStop(0.5, '#180c28'); grad.addColorStop(1, '#0c0614');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const pulse = 0.08 + Math.sin(t * 1.1) * 0.03;
  const g1 = ctx.createRadialGradient(W * 0.40, H * 0.42, 0, W * 0.40, H * 0.42, H * 0.36);
  g1.addColorStop(0, 'rgba(180,80,220,' + pulse + ')'); g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
  const g2 = ctx.createRadialGradient(W * 0.62, H * 0.38, 0, W * 0.62, H * 0.38, H * 0.28);
  g2.addColorStop(0, 'rgba(0,200,220,' + pulse * 0.7 + ')'); g2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
}

function drawCassetteFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.0);
  ctx.strokeStyle = 'rgba(180,120,240,' + (0.40 + p * 0.25) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.002);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.03); ctx.stroke();
  ctx.strokeStyle = 'rgba(0,200,220,' + (0.18 * p) + ')';
  ctx.lineWidth = Math.max(0.8, W * 0.001);
  roundRect(ctx, W * 0.085, H * 0.085, W * 0.83, H * 0.67, H * 0.027); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.0);
  ctx.shadowColor = '#b478f0'; ctx.shadowBlur = Math.floor(W * 0.020);
  ctx.fillStyle = '#f0e8ff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.036) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'Tape Haze Chillwave', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cW = W * 0.44; const cH = H * 0.11; const x = (W - cW) / 2; const y = H * 0.43;
  ctx.fillStyle = 'rgba(16,8,24,0.78)'; ctx.strokeStyle = 'rgba(180,120,240,0.48)';
  ctx.lineWidth = Math.max(1, W * 0.0016);
  roundRect(ctx, x, y, cW, cH, H * 0.04); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f0e8ff'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText('좋아요 · 구독 · 알림', W / 2, y + cH * 0.56);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(12,6,20,0.86)'; ctx.strokeStyle = 'rgba(180,120,240,0.28)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.025); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f0e8ff'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Tape Haze Chillwave', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '66'; ctx.lineWidth = Math.max(1, w * 0.012);
  const lineX = x + w * (0.45 + Math.sin(t * 1.0) * 0.09);
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

const meta = { id: 'intro-029-tape-haze-chillwave', name: 'Tape Haze Chillwave', ratio: '16x9', accentColor: '#b478f0' };
module.exports = { draw, drawVisSlot, meta };
