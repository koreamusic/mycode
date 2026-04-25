// Cafe Book Corner 16x9 — 북 코너 카페, 따뜻한 재즈
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawBookFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#1a1208'); grad.addColorStop(0.5, '#221810'); grad.addColorStop(1, '#140e06');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const warm = ctx.createRadialGradient(W * 0.30, H * 0.35, 0, W * 0.30, H * 0.35, H * 0.35);
  warm.addColorStop(0, 'rgba(200,160,80,0.14)'); warm.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = warm; ctx.fillRect(0, 0, W, H);
}

function drawBookFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.2);
  ctx.strokeStyle = 'rgba(180,140,80,' + (0.40 + p * 0.22) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.002);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.03); ctx.stroke();
  ctx.strokeStyle = 'rgba(180,140,80,' + (0.15 * p) + ')';
  ctx.lineWidth = Math.max(0.8, W * 0.001);
  roundRect(ctx, W * 0.085, H * 0.085, W * 0.83, H * 0.67, H * 0.027); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.0);
  ctx.fillStyle = '#f0e8d0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.song?.title || 'Cafe Book Corner', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['좋아요', '구독', '알림'];
  const chipW = W * 0.13; const chipH = H * 0.09; const gap = W * 0.022;
  const total = chipW * 3 + gap * 2; let sx = (W - total) / 2; const sy = H * 0.44;
  items.forEach((label) => {
    ctx.fillStyle = 'rgba(26,18,8,0.80)'; ctx.strokeStyle = 'rgba(180,140,80,0.52)';
    ctx.lineWidth = Math.max(1, W * 0.0016);
    roundRect(ctx, sx, sy, chipW, chipH, H * 0.035); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f0e8d0'; ctx.textAlign = 'center';
    ctx.font = Math.floor(W * 0.018) + "px 'Noto Serif KR', serif";
    ctx.fillText(label, sx + chipW / 2, sy + chipH * 0.55);
    sx += chipW + gap;
  });
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(20,14,6,0.88)'; ctx.strokeStyle = 'rgba(180,140,80,0.28)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.025); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f0e8d0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Cafe Book Corner', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '55'; ctx.lineWidth = Math.max(1, w * 0.012);
  const len = w * (0.27 + Math.sin(t * 0.65) * 0.07);
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

const meta = { id: 'intro-039-cafe-book-corner', name: 'Cafe Book Corner', ratio: '16x9', accentColor: '#b48c50' };
module.exports = { draw, drawVisSlot, meta };
