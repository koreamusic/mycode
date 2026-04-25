// Old Photo Ballad 16x9 — 오래된 사진, 세피아 발라드
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawPhotoFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#1c1408'); grad.addColorStop(0.5, '#241a0c'); grad.addColorStop(1, '#180e06');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.05;
  for (let i = 0; i < 80; i++) {
    ctx.fillStyle = '#c0a060';
    ctx.fillRect(Math.sin(i * 31.7) * W * 0.5 + W * 0.5, Math.cos(i * 47.3) * H * 0.5 + H * 0.5, Math.random() * 1.5 + 0.3, Math.random() * 1.5 + 0.3);
  }
  ctx.restore();
}

function drawPhotoFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.5);
  ctx.strokeStyle = 'rgba(180,140,80,' + (0.45 + p * 0.20) + ')';
  ctx.lineWidth = Math.max(2, W * 0.0028);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.01); ctx.stroke();
  ctx.strokeStyle = 'rgba(180,140,80,' + (0.20 * p) + ')';
  ctx.lineWidth = Math.max(6, W * 0.008);
  roundRect(ctx, W * 0.072, H * 0.072, W * 0.856, H * 0.696, H * 0.008); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.2);
  ctx.fillStyle = '#e8d8b8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.song?.title || 'Old Photo Ballad', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cW = W * 0.44; const cH = H * 0.10; const x = (W - cW) / 2; const y = H * 0.435;
  ctx.fillStyle = 'rgba(28,20,8,0.80)'; ctx.strokeStyle = 'rgba(180,140,80,0.45)';
  ctx.lineWidth = Math.max(1, W * 0.0016);
  roundRect(ctx, x, y, cW, cH, H * 0.015); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e8d8b8'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText('좋아요 · 구독 · 알림', W / 2, y + cH * 0.56);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(24,14,6,0.88)'; ctx.strokeStyle = 'rgba(180,140,80,0.28)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.015); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e8d8b8'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Old Photo Ballad', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '55'; ctx.lineWidth = Math.max(1, w * 0.011);
  const len = w * (0.22 + Math.abs(Math.sin(t * 0.5)) * 0.08);
  ctx.beginPath(); ctx.moveTo(x + w * 0.14, y + h * 0.5); ctx.lineTo(x + w * 0.14 + len, y + h * 0.5); ctx.stroke();
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'intro-025-old-photo-ballad', name: 'Old Photo Ballad', ratio: '16x9', accentColor: '#b48c50' };
module.exports = { draw, drawVisSlot, meta };
