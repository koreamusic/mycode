// Midnight Jazz Frame 16x9 — 스모키 재즈, 골드 코너 프레임
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawCornerFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0a0608'); grad.addColorStop(0.5, '#14100a'); grad.addColorStop(1, '#08060a');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.03;
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(Math.random() * W, Math.random() * H, Math.random() * 1.5 + 0.5, Math.random() * 1.5 + 0.5);
  }
  ctx.restore();
}

function drawCornerFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.2);
  const len = W * 0.10 * p;
  ctx.strokeStyle = 'rgba(200,160,80,' + (0.55 + p * 0.30) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.0025);
  const corners = [
    [W * 0.08, H * 0.10], [W * 0.92, H * 0.10],
    [W * 0.08, H * 0.84], [W * 0.92, H * 0.84]
  ];
  corners.forEach(([cx, cy], i) => {
    const dx = i % 2 === 0 ? 1 : -1;
    const dy = i < 2 ? 1 : -1;
    ctx.beginPath(); ctx.moveTo(cx, cy + dy * len); ctx.lineTo(cx, cy); ctx.lineTo(cx + dx * len, cy); ctx.stroke();
  });
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.9);
  ctx.fillStyle = '#f5ead0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.042) + "px 'Playfair Display', serif";
  ctx.fillText(data.song?.title || 'Midnight Jazz Frame', W / 2, H * 0.46);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['Like', 'Subscribe', 'Alarm'];
  const chipW = W * 0.14; const chipH = H * 0.10; const gap = W * 0.02;
  const total = chipW * 3 + gap * 2;
  let sx = (W - total) / 2; const sy = H * 0.44;
  items.forEach((label) => {
    ctx.fillStyle = 'rgba(200,160,80,0.18)'; ctx.strokeStyle = 'rgba(200,160,80,0.65)';
    ctx.lineWidth = Math.max(1, W * 0.002);
    roundRect(ctx, sx, sy, chipW, chipH, H * 0.03); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f5ead0'; ctx.textAlign = 'center';
    ctx.font = Math.floor(W * 0.018) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, sx + chipW / 2, sy + chipH * 0.56);
    sx += chipW + gap;
  });
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(8,6,10,0.82)'; ctx.strokeStyle = 'rgba(200,160,80,0.38)';
  ctx.lineWidth = Math.max(1, W * 0.002);
  roundRect(ctx, bX, bY, bW, bH, H * 0.03); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f5ead0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.022) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Midnight Jazz Frame', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '66'; ctx.lineWidth = Math.max(1, w * 0.015);
  const len = w * (0.28 + Math.sin(t * 0.6) * 0.06);
  ctx.beginPath(); ctx.moveTo(x + w * 0.12, y + h * 0.5); ctx.lineTo(x + w * 0.12 + len, y + h * 0.5); ctx.stroke(); ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'intro-001-midnight-jazz-frame', name: 'Midnight Jazz Frame', ratio: '16x9', accentColor: '#c8a050' };
module.exports = { draw, drawVisSlot, meta };
