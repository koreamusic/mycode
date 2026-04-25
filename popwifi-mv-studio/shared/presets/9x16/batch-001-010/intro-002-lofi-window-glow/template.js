// Lofi Window Glow 9x16 — 따뜻한 램프, 로파이 창문
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawWindowFrame(ctx, W, H, t);
  drawTitle(ctx, W, H, data, t);
  if (t >= 5) drawSocial(ctx, W, H, t);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#0d0b1a'); grad.addColorStop(0.5, '#14101e'); grad.addColorStop(1, '#0a0816');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const lamp = ctx.createRadialGradient(W * 0.72, H * 0.22, 0, W * 0.72, H * 0.22, H * 0.28);
  lamp.addColorStop(0, 'rgba(245,208,112,0.18)'); lamp.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = lamp; ctx.fillRect(0, 0, W, H);
}

function drawWindowFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.0);
  ctx.strokeStyle = 'rgba(245,208,112,' + (0.45 + p * 0.22) + ')';
  ctx.lineWidth = Math.max(2, W * 0.003);
  roundRect(ctx, W * 0.06, H * 0.10, W * 0.88, H * 0.72, W * 0.04); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.9);
  ctx.fillStyle = '#f5f0e0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.055) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'Lofi Window Glow', W / 2, H * 0.40);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['좋아요', '구독'];
  const chipW = W * 0.68; const chipH = H * 0.065; const gap = H * 0.016;
  let sy = H * 0.62; const sx = (W - chipW) / 2;
  items.forEach((label) => {
    ctx.fillStyle = 'rgba(13,11,26,0.80)'; ctx.strokeStyle = 'rgba(245,208,112,0.52)';
    ctx.lineWidth = Math.max(1, W * 0.0020);
    roundRect(ctx, sx, sy, chipW, chipH, chipH * 0.4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f5f0e0'; ctx.textAlign = 'center';
    ctx.font = Math.floor(W * 0.038) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, W / 2, sy + chipH * 0.55);
    sy += chipH + gap;
  });
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.fillStyle = accentColor + '55';
  for (let i = 0; i < 4; i++) {
    const bh = h * (0.20 + Math.abs(Math.sin(t * 1.1 + i * 0.9)) * 0.30);
    ctx.fillRect(x + w * (0.12 + i * 0.20), y + (h - bh) / 2, Math.max(2, w * 0.10), bh);
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

const meta = { id: 'intro-002-lofi-window-glow', name: 'Lofi Window Glow', ratio: '9x16', accentColor: '#f5d070' };
module.exports = { draw, drawVisSlot, meta };
