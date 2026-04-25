// Night Drive Synth 16x9 — 야간 드라이브, 신스 팝
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawHighwayFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#020408'); grad.addColorStop(0.5, '#040810'); grad.addColorStop(1, '#030612');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const pulse = 0.10 + Math.sin(t * 1.5) * 0.03;
  const glow = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, H * 0.45);
  glow.addColorStop(0, 'rgba(0,200,255,' + pulse + ')'); glow.addColorStop(0.6, 'rgba(80,0,200,0.06)'); glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
}

function drawHighwayFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.0);
  ctx.strokeStyle = 'rgba(0,210,255,' + (0.45 + p * 0.25) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.002);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.025); ctx.stroke();
  ctx.strokeStyle = 'rgba(140,0,255,' + (0.20 * p) + ')';
  ctx.lineWidth = Math.max(0.8, W * 0.0010);
  roundRect(ctx, W * 0.085, H * 0.085, W * 0.83, H * 0.67, H * 0.022); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.8);
  ctx.shadowColor = '#00d2ff'; ctx.shadowBlur = Math.floor(W * 0.020);
  ctx.fillStyle = '#e8f8ff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'Night Drive Synth', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['LIKE', 'SUB', 'BELL'];
  const colors = ['rgba(0,200,255,0.70)', 'rgba(140,0,255,0.70)', 'rgba(0,200,255,0.70)'];
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
  ctx.fillStyle = 'rgba(2,4,8,0.88)'; ctx.strokeStyle = 'rgba(0,210,255,0.35)';
  ctx.lineWidth = Math.max(1, W * 0.0016);
  roundRect(ctx, bX, bY, bW, bH, H * 0.025); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e8f8ff'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Night Drive Synth', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '77'; ctx.lineWidth = Math.max(1, w * 0.012);
  const lineX = x + w * (0.45 + Math.sin(t * 1.2) * 0.10);
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

const meta = { id: 'intro-017-night-drive-synth', name: 'Night Drive Synth', ratio: '16x9', accentColor: '#00d2ff' };
module.exports = { draw, drawVisSlot, meta };
