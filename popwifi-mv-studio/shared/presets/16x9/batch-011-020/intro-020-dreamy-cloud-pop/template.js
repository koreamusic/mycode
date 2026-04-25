// Dreamy Cloud Pop 16x9 — 드리미 클라우드, 파스텔 팝
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawCloudFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#ddeeff'); grad.addColorStop(0.5, '#eef4ff'); grad.addColorStop(1, '#fde8f5');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const c1 = ctx.createRadialGradient(W * 0.30, H * 0.20, 0, W * 0.30, H * 0.20, W * 0.28);
  c1.addColorStop(0, 'rgba(255,255,255,0.70)'); c1.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = c1; ctx.fillRect(0, 0, W, H);
  const c2 = ctx.createRadialGradient(W * 0.72, H * 0.32, 0, W * 0.72, H * 0.32, W * 0.20);
  c2.addColorStop(0, 'rgba(255,255,255,0.55)'); c2.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = c2; ctx.fillRect(0, 0, W, H);
}

function drawCloudFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.0);
  ctx.strokeStyle = 'rgba(180,200,240,' + (0.45 + p * 0.20) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.002);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.06); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.8);
  ctx.fillStyle = '#3040a0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'Dreamy Cloud Pop', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['좋아요', '구독', '알림'];
  const colors = ['rgba(180,200,255,0.75)', 'rgba(255,180,220,0.75)', 'rgba(180,240,220,0.75)'];
  const chipW = W * 0.13; const chipH = H * 0.09; const gap = W * 0.022;
  const total = chipW * 3 + gap * 2; let sx = (W - total) / 2; const sy = H * 0.44;
  items.forEach((label, i) => {
    ctx.fillStyle = colors[i]; ctx.strokeStyle = 'rgba(255,255,255,0.80)';
    ctx.lineWidth = Math.max(1, W * 0.0015);
    roundRect(ctx, sx, sy, chipW, chipH, H * 0.05); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3040a0'; ctx.textAlign = 'center';
    ctx.font = Math.floor(W * 0.017) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, sx + chipW / 2, sy + chipH * 0.55);
    sx += chipW + gap;
  });
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(48,64,160,0.75)'; ctx.strokeStyle = 'rgba(255,255,255,0.40)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.04); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Dreamy Cloud Pop', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.fillStyle = accentColor + '55';
  for (let i = 0; i < 4; i++) {
    const px = x + w * (0.15 + i * 0.22);
    const py = y + h * (0.50 + Math.sin(t * 1.0 + i * 1.2) * 0.15);
    ctx.beginPath(); ctx.arc(px, py, Math.max(2, h * 0.032), 0, Math.PI * 2); ctx.fill();
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

const meta = { id: 'intro-020-dreamy-cloud-pop', name: 'Dreamy Cloud Pop', ratio: '16x9', accentColor: '#b4c8f0' };
module.exports = { draw, drawVisSlot, meta };
