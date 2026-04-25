// Chillwave Dream Tape 16x9 — 드리미 신스, VHS 테이프
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawTapeLines(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0a0518'); grad.addColorStop(0.5, '#150a2a'); grad.addColorStop(1, '#0d0520');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const pulse = 0.08 + Math.sin(t * 1.2) * 0.03;
  const glow = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45, H * 0.4);
  glow.addColorStop(0, 'rgba(160,232,216,' + pulse + ')'); glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
}

function drawTapeLines(ctx, W, H, t) {
  ctx.save();
  ctx.strokeStyle = 'rgba(160,232,216,0.12)'; ctx.lineWidth = Math.max(0.8, W * 0.001);
  for (let i = 0; i < 6; i++) {
    const y = H * (0.10 + i * 0.12);
    ctx.beginPath(); ctx.moveTo(W * 0.08, y); ctx.lineTo(W * 0.92, y); ctx.stroke();
  }
  const p = Math.min(1, t / 1.0);
  ctx.strokeStyle = 'rgba(160,232,216,' + (0.40 + p * 0.25) + ')'; ctx.lineWidth = Math.max(1.5, W * 0.0022);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.03); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.8);
  ctx.shadowColor = '#a0e8d8'; ctx.shadowBlur = Math.floor(W * 0.025);
  ctx.fillStyle = '#e0f8f0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'Chillwave Dream Tape', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cW = W * 0.46; const cH = H * 0.11; const x = (W - cW) / 2; const y = H * 0.43;
  ctx.fillStyle = 'rgba(160,232,216,0.10)'; ctx.strokeStyle = 'rgba(160,232,216,0.48)';
  ctx.lineWidth = Math.max(1, W * 0.0018);
  roundRect(ctx, x, y, cW, cH, H * 0.04); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e0f8f0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText('좋아요 · 구독 · 알림', W / 2, y + cH * 0.56);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(10,5,24,0.86)'; ctx.strokeStyle = 'rgba(160,232,216,0.35)';
  ctx.lineWidth = Math.max(1, W * 0.0016);
  roundRect(ctx, bX, bY, bW, bH, H * 0.03); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e0f8f0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Chillwave Dream Tape', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '66'; ctx.lineWidth = Math.max(1, w * 0.014);
  const lineX = x + w * (0.45 + Math.sin(t * 0.9) * 0.08);
  ctx.beginPath(); ctx.moveTo(lineX, y + h * 0.15); ctx.lineTo(lineX, y + h * 0.85); ctx.stroke();
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'intro-009-chillwave-dream-tape', name: 'Chillwave Dream Tape', ratio: '16x9', accentColor: '#a0e8d8' };
module.exports = { draw, drawVisSlot, meta };
