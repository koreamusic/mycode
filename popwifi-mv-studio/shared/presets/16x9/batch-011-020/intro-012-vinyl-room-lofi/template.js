// Vinyl Room Lofi 16x9 — 먼지 낀 바이올렛, 램프 앰버
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawDustyFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0e0812'); grad.addColorStop(0.5, '#160c1e'); grad.addColorStop(1, '#0a0610');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const lamp = ctx.createRadialGradient(W * 0.62, H * 0.30, 0, W * 0.62, H * 0.30, H * 0.32);
  lamp.addColorStop(0, 'rgba(240,180,80,0.14)'); lamp.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = lamp; ctx.fillRect(0, 0, W, H);
}

function drawDustyFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.2);
  ctx.strokeStyle = 'rgba(180,140,220,' + (0.30 + p * 0.25) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.002);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.035); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.0);
  ctx.fillStyle = '#f0e8d0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.036) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'Vinyl Room Lofi', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cW = W * 0.44; const cH = H * 0.11; const x = (W - cW) / 2; const y = H * 0.43;
  ctx.fillStyle = 'rgba(14,8,18,0.80)'; ctx.strokeStyle = 'rgba(240,180,80,0.45)';
  ctx.lineWidth = Math.max(1, W * 0.0016);
  roundRect(ctx, x, y, cW, cH, H * 0.04); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f0e8d0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText('좋아요 · 구독 · 알림', W / 2, y + cH * 0.56);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(10,6,16,0.88)'; ctx.strokeStyle = 'rgba(180,140,220,0.28)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.03); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f0e8d0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Vinyl Room Lofi', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.fillStyle = accentColor + '55';
  for (let i = 0; i < 4; i++) {
    const bh = h * (0.20 + Math.abs(Math.sin(t * 1.1 + i * 0.9)) * 0.30);
    ctx.fillRect(x + w * (0.15 + i * 0.18), y + (h - bh) / 2, Math.max(2, w * 0.06), bh);
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

const meta = { id: 'intro-012-vinyl-room-lofi', name: 'Vinyl Room Lofi', ratio: '16x9', accentColor: '#b48cdc' };
module.exports = { draw, drawVisSlot, meta };
