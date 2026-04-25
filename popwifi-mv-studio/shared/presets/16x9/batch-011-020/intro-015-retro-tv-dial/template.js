// Retro TV Dial 16x9 — 아날로그 TV, 갈색 다이얼
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawTVFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#1a1208'); grad.addColorStop(0.5, '#221808'); grad.addColorStop(1, '#120e04');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.04 + Math.sin(t * 8) * 0.01;
  ctx.strokeStyle = 'rgba(200,180,120,0.5)'; ctx.lineWidth = Math.max(0.5, H * 0.002);
  for (let i = 0; i < H; i += Math.max(3, H * 0.012)) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
  }
  ctx.restore();
}

function drawTVFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.2);
  ctx.strokeStyle = 'rgba(180,150,80,' + (0.45 + p * 0.20) + ')';
  ctx.lineWidth = Math.max(2, W * 0.003);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.04); ctx.stroke();
  ctx.strokeStyle = 'rgba(100,80,40,' + (0.50 * p) + ')';
  ctx.lineWidth = Math.max(4, W * 0.006);
  roundRect(ctx, W * 0.075, H * 0.075, W * 0.85, H * 0.69, H * 0.045); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.9);
  ctx.fillStyle = '#f0e8c8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'Retro TV Dial', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cW = W * 0.44; const cH = H * 0.11; const x = (W - cW) / 2; const y = H * 0.43;
  ctx.fillStyle = 'rgba(26,18,8,0.80)'; ctx.strokeStyle = 'rgba(180,150,80,0.50)';
  ctx.lineWidth = Math.max(1, W * 0.0018);
  roundRect(ctx, x, y, cW, cH, H * 0.03); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f0e8c8'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText('좋아요 · 구독 · 알림', W / 2, y + cH * 0.56);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(18,14,4,0.88)'; ctx.strokeStyle = 'rgba(180,150,80,0.28)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.025); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f0e8c8'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Retro TV Dial', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.fillStyle = accentColor + '55';
  for (let i = 0; i < 5; i++) {
    const bh = h * (0.15 + Math.abs(Math.sin(t * 1.5 + i * 0.7)) * 0.35);
    ctx.fillRect(x + w * (0.10 + i * 0.16), y + (h - bh) / 2, Math.max(2, w * 0.08), bh);
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

const meta = { id: 'intro-015-retro-tv-dial', name: 'Retro TV Dial', ratio: '16x9', accentColor: '#b49650' };
module.exports = { draw, drawVisSlot, meta };
