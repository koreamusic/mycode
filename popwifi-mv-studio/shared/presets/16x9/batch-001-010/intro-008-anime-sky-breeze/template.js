// Anime Sky Breeze 16x9 — 개방적인 하늘, 아니메 봄바람
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H);
  drawAiryFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#87ceeb'); grad.addColorStop(0.5, '#b8e0f5'); grad.addColorStop(1, '#daf0fb');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const cloud = ctx.createRadialGradient(W * 0.3, H * 0.25, 0, W * 0.3, H * 0.25, W * 0.22);
  cloud.addColorStop(0, 'rgba(255,255,255,0.55)'); cloud.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = cloud; ctx.fillRect(0, 0, W, H);
}

function drawAiryFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.0);
  ctx.strokeStyle = 'rgba(255,255,255,' + (0.55 + p * 0.25) + ')';
  ctx.lineWidth = Math.max(2, W * 0.0025);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.05);
  ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.7);
  ctx.fillStyle = '#1a3a5a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.040) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'Anime Sky Breeze', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['좋아요', '구독', '알림'];
  const chipW = W * 0.13; const chipH = H * 0.10; const gap = W * 0.025;
  const total = chipW * 3 + gap * 2; let sx = (W - total) / 2; const sy = H * 0.43;
  items.forEach((label) => {
    ctx.fillStyle = 'rgba(255,184,200,0.60)'; ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = Math.max(1, W * 0.0018);
    roundRect(ctx, sx, sy, chipW, chipH, H * 0.05); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#1a3a5a'; ctx.textAlign = 'center';
    ctx.font = Math.floor(W * 0.018) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, sx + chipW / 2, sy + chipH * 0.56);
    sx += chipW + gap;
  });
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(30,80,120,0.72)'; ctx.strokeStyle = 'rgba(255,255,255,0.40)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.04); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Anime Sky Breeze', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.fillStyle = accentColor + '55';
  for (let i = 0; i < 4; i++) {
    const px = x + w * (0.15 + i * 0.20);
    const py = y + h * (0.50 + Math.sin(t * 1.2 + i * 0.8) * 0.12);
    ctx.beginPath(); ctx.arc(px, py, Math.max(2, h * 0.028), 0, Math.PI * 2); ctx.fill();
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

const meta = { id: 'intro-008-anime-sky-breeze', name: 'Anime Sky Breeze', ratio: '16x9', accentColor: '#ffb8c8' };
module.exports = { draw, drawVisSlot, meta };
