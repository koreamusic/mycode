// Lofi Window Glow 16x9 — 코지 로파이, 창문 빛 프레임
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H);
  drawWindowFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#0d0b1a'); grad.addColorStop(0.6, '#140f28'); grad.addColorStop(1, '#0a0812');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, H * 0.38);
  glow.addColorStop(0, 'rgba(245,208,112,0.10)'); glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
}

function drawWindowFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.0);
  ctx.strokeStyle = 'rgba(245,208,112,' + (0.35 + p * 0.25) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.002);
  roundRect(ctx, W * 0.10, H * 0.08, W * 0.80, H * 0.66, H * 0.04);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(180,160,220,0.20)'; ctx.lineWidth = Math.max(1, W * 0.001);
  roundRect(ctx, W * 0.12, H * 0.11, W * 0.76, H * 0.60, H * 0.035);
  ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.8);
  ctx.fillStyle = '#f0e8d0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'Lofi Window Glow', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['좋아요', '구독', '알림'];
  const chipW = W * 0.13; const chipH = H * 0.10; const gap = W * 0.025;
  const total = chipW * 3 + gap * 2;
  let sx = (W - total) / 2; const sy = H * 0.43;
  items.forEach((label) => {
    ctx.fillStyle = 'rgba(245,208,112,0.14)'; ctx.strokeStyle = 'rgba(245,208,112,0.50)';
    ctx.lineWidth = Math.max(1, W * 0.0018);
    roundRect(ctx, sx, sy, chipW, chipH, H * 0.05); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f0e8d0'; ctx.textAlign = 'center';
    ctx.font = Math.floor(W * 0.018) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, sx + chipW / 2, sy + chipH * 0.56);
    sx += chipW + gap;
  });
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.10; const bY = H * 0.82; const bW = W * 0.80; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(20,15,40,0.80)'; ctx.strokeStyle = 'rgba(180,160,220,0.30)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.04); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f0e8d0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Lofi Window Glow', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.fillStyle = accentColor + '55';
  for (let i = 0; i < 3; i++) {
    const px = x + w * (0.22 + i * 0.22);
    const py = y + h * (0.5 + Math.sin(t * 0.8 + i) * 0.10);
    ctx.beginPath(); ctx.arc(px, py, Math.max(3, h * 0.035), 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'intro-002-lofi-window-glow', name: 'Lofi Window Glow', ratio: '16x9', accentColor: '#f5d070' };
module.exports = { draw, drawVisSlot, meta };
