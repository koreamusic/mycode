// Country Dust Road 16x9 — 먼지 컨트리 도로, 어쿠스틱
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawRoadFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#f0e8d0'); grad.addColorStop(0.5, '#f8f0d8'); grad.addColorStop(1, '#e8e0c8');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const sun = ctx.createRadialGradient(W * 0.82, H * 0.14, 0, W * 0.82, H * 0.14, H * 0.50);
  sun.addColorStop(0, 'rgba(255,200,80,0.25)'); sun.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sun; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.05;
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = '#8b6040';
    ctx.fillRect((Math.sin(i * 53.3) * 0.5 + 0.5) * W, (Math.sin(i * 71.7) * 0.5 + 0.5) * H, Math.random() * 1.5 + 0.3, Math.random() * 1.5 + 0.3);
  }
  ctx.restore();
}

function drawRoadFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.0);
  ctx.strokeStyle = 'rgba(100,70,30,' + (0.40 + p * 0.20) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.002);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.025); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.0);
  ctx.fillStyle = '#2a1a08'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.song?.title || 'Country Dust Road', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['좋아요', '구독', '알림'];
  const chipW = W * 0.13; const chipH = H * 0.09; const gap = W * 0.022;
  const total = chipW * 3 + gap * 2; let sx = (W - total) / 2; const sy = H * 0.44;
  items.forEach((label) => {
    ctx.fillStyle = 'rgba(42,26,8,0.10)'; ctx.strokeStyle = 'rgba(100,70,30,0.50)';
    ctx.lineWidth = Math.max(1, W * 0.0015);
    roundRect(ctx, sx, sy, chipW, chipH, H * 0.03); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#2a1a08'; ctx.textAlign = 'center';
    ctx.font = Math.floor(W * 0.018) + "px 'Noto Serif KR', serif";
    ctx.fillText(label, sx + chipW / 2, sy + chipH * 0.55);
    sx += chipW + gap;
  });
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(42,26,8,0.82)'; ctx.strokeStyle = 'rgba(100,70,30,0.28)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.022); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f0e8d0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Country Dust Road', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '55'; ctx.lineWidth = Math.max(1, w * 0.012);
  const len = w * (0.27 + Math.abs(Math.sin(t * 0.55)) * 0.08);
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

const meta = { id: 'intro-047-country-dust-road', name: 'Country Dust Road', ratio: '16x9', accentColor: '#64461e' };
module.exports = { draw, drawVisSlot, meta };
