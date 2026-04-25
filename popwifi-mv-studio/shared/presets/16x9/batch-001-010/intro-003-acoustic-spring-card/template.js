// Acoustic Spring Card 16x9 — 봄 아침, 밝은 크림 카드
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H);
  drawCard(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#f5f0e8'); grad.addColorStop(0.5, '#eef5e8'); grad.addColorStop(1, '#e8f0f5');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
}

function drawCard(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.0);
  ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.strokeStyle = 'rgba(140,180,140,' + (0.45 + p * 0.30) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.0022);
  roundRect(ctx, W * 0.10, H * 0.08, W * 0.80, H * 0.66, H * 0.04);
  ctx.fill(); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.7);
  ctx.fillStyle = '#3a4a3a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.song?.title || 'Acoustic Spring Card', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['Like', 'Subscribe', 'Alarm'];
  const chipW = W * 0.14; const chipH = H * 0.10; const gap = W * 0.02;
  const total = chipW * 3 + gap * 2;
  let sx = (W - total) / 2; const sy = H * 0.43;
  items.forEach((label) => {
    ctx.fillStyle = 'rgba(140,180,140,0.22)'; ctx.strokeStyle = 'rgba(100,160,100,0.60)';
    ctx.lineWidth = Math.max(1, W * 0.0018);
    roundRect(ctx, sx, sy, chipW, chipH, H * 0.05); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3a4a3a'; ctx.textAlign = 'center';
    ctx.font = Math.floor(W * 0.018) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, sx + chipW / 2, sy + chipH * 0.56);
    sx += chipW + gap;
  });
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.10; const bY = H * 0.82; const bW = W * 0.80; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(245,248,242,0.88)'; ctx.strokeStyle = 'rgba(140,180,140,0.40)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.04); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3a4a3a'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Acoustic Spring Card', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '66'; ctx.lineWidth = Math.max(1, w * 0.014);
  const len = w * (0.30 + Math.sin(t * 0.7) * 0.07);
  ctx.beginPath(); ctx.moveTo(x + w * 0.10, y + h * 0.5); ctx.lineTo(x + w * 0.10 + len, y + h * 0.5); ctx.stroke();
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'intro-003-acoustic-spring-card', name: 'Acoustic Spring Card', ratio: '16x9', accentColor: '#8cb88c' };
module.exports = { draw, drawVisSlot, meta };
