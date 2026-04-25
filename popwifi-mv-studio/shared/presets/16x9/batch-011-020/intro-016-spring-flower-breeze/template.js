// Spring Flower Breeze 16x9 — 봄꽃 브리즈, 플로럴 팝
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H);
  drawFlowerFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#fef0f5'); grad.addColorStop(0.5, '#fef8f0'); grad.addColorStop(1, '#f0f8fe');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const bloom = ctx.createRadialGradient(W * 0.65, H * 0.25, 0, W * 0.65, H * 0.25, W * 0.30);
  bloom.addColorStop(0, 'rgba(255,180,200,0.30)'); bloom.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = bloom; ctx.fillRect(0, 0, W, H);
}

function drawFlowerFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.0);
  ctx.strokeStyle = 'rgba(240,140,170,' + (0.50 + p * 0.20) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.002);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.05); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.7);
  ctx.fillStyle = '#3a2040'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'Spring Flower Breeze', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['좋아요', '구독', '알림'];
  const chipW = W * 0.13; const chipH = H * 0.09; const gap = W * 0.022;
  const total = chipW * 3 + gap * 2; let sx = (W - total) / 2; const sy = H * 0.44;
  items.forEach((label) => {
    ctx.fillStyle = 'rgba(255,180,200,0.55)'; ctx.strokeStyle = 'rgba(255,255,255,0.80)';
    ctx.lineWidth = Math.max(1, W * 0.0016);
    roundRect(ctx, sx, sy, chipW, chipH, H * 0.05); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3a2040'; ctx.textAlign = 'center';
    ctx.font = Math.floor(W * 0.018) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, sx + chipW / 2, sy + chipH * 0.55);
    sx += chipW + gap;
  });
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(60,32,64,0.80)'; ctx.strokeStyle = 'rgba(255,180,200,0.40)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.04); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff0f5'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Spring Flower Breeze', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.fillStyle = accentColor + '66';
  for (let i = 0; i < 4; i++) {
    const px = x + w * (0.15 + i * 0.22);
    const py = y + h * (0.50 + Math.sin(t * 1.3 + i * 1.1) * 0.14);
    ctx.beginPath(); ctx.arc(px, py, Math.max(2, h * 0.030), 0, Math.PI * 2); ctx.fill();
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

const meta = { id: 'intro-016-spring-flower-breeze', name: 'Spring Flower Breeze', ratio: '16x9', accentColor: '#f08caa' };
module.exports = { draw, drawVisSlot, meta };
