// Acoustic Spring Card 9x16 — 봄날 어쿠스틱, 크림 카드
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H);
  drawCardFrame(ctx, W, H, t);
  drawTitle(ctx, W, H, data, t);
  if (t >= 5) drawSocial(ctx, W, H, t);
}

function drawBackground(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#f5f0e8'); grad.addColorStop(0.5, '#f8f5ee'); grad.addColorStop(1, '#f0ece4');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const bloom = ctx.createRadialGradient(W * 0.65, H * 0.20, 0, W * 0.65, H * 0.20, W * 0.38);
  bloom.addColorStop(0, 'rgba(180,230,160,0.22)'); bloom.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = bloom; ctx.fillRect(0, 0, W, H);
}

function drawCardFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.0);
  ctx.fillStyle = 'rgba(255,255,255,0.70)';
  roundRect(ctx, W * 0.06, H * 0.10, W * 0.88, H * 0.72, W * 0.04); ctx.fill();
  ctx.strokeStyle = 'rgba(140,184,140,' + (0.50 + p * 0.20) + ')';
  ctx.lineWidth = Math.max(2, W * 0.003);
  ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.8);
  ctx.fillStyle = '#2a3c2a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.055) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.song?.title || 'Acoustic Spring Card', W / 2, H * 0.40);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['좋아요', '구독'];
  const chipW = W * 0.68; const chipH = H * 0.065; const gap = H * 0.016;
  let sy = H * 0.62; const sx = (W - chipW) / 2;
  items.forEach((label) => {
    ctx.fillStyle = 'rgba(140,184,140,0.55)'; ctx.strokeStyle = 'rgba(255,255,255,0.80)';
    ctx.lineWidth = Math.max(1, W * 0.0018);
    roundRect(ctx, sx, sy, chipW, chipH, chipH * 0.4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#2a3c2a'; ctx.textAlign = 'center';
    ctx.font = Math.floor(W * 0.038) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, W / 2, sy + chipH * 0.55);
    sy += chipH + gap;
  });
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.fillStyle = accentColor + '55';
  for (let i = 0; i < 4; i++) {
    const px = x + w * (0.14 + i * 0.22); const py = y + h * (0.50 + Math.sin(t * 1.1 + i * 0.9) * 0.15);
    ctx.beginPath(); ctx.arc(px, py, Math.max(2, h * 0.06), 0, Math.PI * 2); ctx.fill();
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

const meta = { id: 'intro-003-acoustic-spring-card', name: 'Acoustic Spring Card', ratio: '9x16', accentColor: '#8cb88c' };
module.exports = { draw, drawVisSlot, meta };
