// Anime Rain Platform 16x9 — 빗속 플랫폼, 시네마틱 아니메
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawPlatformFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#080c14'); grad.addColorStop(0.5, '#0c1020'); grad.addColorStop(1, '#060a12');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.15;
  ctx.strokeStyle = 'rgba(180,210,240,0.6)'; ctx.lineWidth = Math.max(0.5, W * 0.0006);
  for (let i = 0; i < 25; i++) {
    const rx = ((Math.sin(i * 67.3) * 0.5 + 0.5)) * W;
    const ry = ((i / 25)) * H * 1.2 - H * 0.1;
    ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + W * 0.004, ry + H * 0.07); ctx.stroke();
  }
  ctx.restore();
}

function drawPlatformFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.0);
  ctx.strokeStyle = 'rgba(160,200,240,' + (0.42 + p * 0.22) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.002);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.025); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.0);
  ctx.fillStyle = '#e8f2fc'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'Anime Rain Platform', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['좋아요', '구독', '알림'];
  const chipW = W * 0.13; const chipH = H * 0.09; const gap = W * 0.022;
  const total = chipW * 3 + gap * 2; let sx = (W - total) / 2; const sy = H * 0.44;
  items.forEach((label) => {
    ctx.fillStyle = 'rgba(8,12,20,0.78)'; ctx.strokeStyle = 'rgba(160,200,240,0.48)';
    ctx.lineWidth = Math.max(1, W * 0.0016);
    roundRect(ctx, sx, sy, chipW, chipH, H * 0.04); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#e8f2fc'; ctx.textAlign = 'center';
    ctx.font = Math.floor(W * 0.018) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, sx + chipW / 2, sy + chipH * 0.55);
    sx += chipW + gap;
  });
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(6,10,18,0.88)'; ctx.strokeStyle = 'rgba(160,200,240,0.28)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.02); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e8f2fc'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Anime Rain Platform', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '55'; ctx.lineWidth = Math.max(1, w * 0.012);
  const len = w * (0.26 + Math.sin(t * 0.65) * 0.07);
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

const meta = { id: 'intro-037-anime-rain-platform', name: 'Anime Rain Platform', ratio: '16x9', accentColor: '#a0c8f0' };
module.exports = { draw, drawVisSlot, meta };
