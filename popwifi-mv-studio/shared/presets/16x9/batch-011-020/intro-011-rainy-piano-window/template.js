// Rainy Piano Window 16x9 — 빗소리 피아노, 창문 유리
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawRainFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#0a0e18'); grad.addColorStop(0.5, '#101520'); grad.addColorStop(1, '#080c14');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, H * 0.35);
  glow.addColorStop(0, 'rgba(180,200,240,0.08)'); glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.18;
  ctx.strokeStyle = 'rgba(180,210,255,0.5)'; ctx.lineWidth = Math.max(0.5, W * 0.0006);
  for (let i = 0; i < 22; i++) {
    const rx = Math.sin(i * 137.5) * W; const ry = (i / 22) * H;
    const rlen = H * (0.04 + Math.sin(i * 1.7) * 0.02);
    ctx.beginPath(); ctx.moveTo(((rx % W) + W) % W, ry); ctx.lineTo(((rx % W) + W) % W + W * 0.003, ry + rlen); ctx.stroke();
  }
  ctx.restore();
}

function drawRainFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.0);
  ctx.strokeStyle = 'rgba(180,210,240,' + (0.40 + p * 0.25) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.002);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.025); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.0);
  ctx.fillStyle = '#e8f0f8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.song?.title || 'Rainy Piano Window', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cW = W * 0.44; const cH = H * 0.11; const x = (W - cW) / 2; const y = H * 0.43;
  ctx.fillStyle = 'rgba(10,14,24,0.75)'; ctx.strokeStyle = 'rgba(180,210,240,0.45)';
  ctx.lineWidth = Math.max(1, W * 0.0016);
  roundRect(ctx, x, y, cW, cH, H * 0.04); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e8f0f8'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText('좋아요 · 구독 · 알림', W / 2, y + cH * 0.56);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(8,12,20,0.86)'; ctx.strokeStyle = 'rgba(180,210,240,0.28)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.025); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e8f0f8'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Rainy Piano Window', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '55'; ctx.lineWidth = Math.max(1, w * 0.012);
  const len = w * (0.25 + Math.sin(t * 0.6) * 0.06);
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

const meta = { id: 'intro-011-rainy-piano-window', name: 'Rainy Piano Window', ratio: '16x9', accentColor: '#b4d2f0' };
module.exports = { draw, drawVisSlot, meta };
