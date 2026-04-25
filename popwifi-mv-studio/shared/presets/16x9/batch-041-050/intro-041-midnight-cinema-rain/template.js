// Midnight Cinema Rain 16x9 — 자정 시네마, 빗속 도시
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawCinemaRainFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  ctx.fillStyle = '#02020a'; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, H * 0.40);
  glow.addColorStop(0, 'rgba(40,80,160,0.12)'); glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.12;
  ctx.strokeStyle = 'rgba(180,200,255,0.6)'; ctx.lineWidth = Math.max(0.4, W * 0.0005);
  for (let i = 0; i < 20; i++) {
    const rx = (Math.sin(i * 113.7) * 0.5 + 0.5) * W;
    const ry = (i / 20) * H * 1.3 - H * 0.15;
    ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + W * 0.003, ry + H * 0.07); ctx.stroke();
  }
  ctx.restore();
}

function drawCinemaRainFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.5);
  ctx.strokeStyle = 'rgba(200,180,80,' + (0.48 + p * 0.22) + ')';
  ctx.lineWidth = Math.max(2, W * 0.0026);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.015); ctx.stroke();
  ctx.strokeStyle = 'rgba(200,180,80,' + (0.15 * p) + ')';
  ctx.lineWidth = Math.max(0.8, W * 0.001);
  roundRect(ctx, W * 0.085, H * 0.085, W * 0.83, H * 0.67, H * 0.013); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.2);
  ctx.fillStyle = '#f0ecd8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.song?.title || 'Midnight Cinema Rain', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cW = W * 0.44; const cH = H * 0.10; const x = (W - cW) / 2; const y = H * 0.435;
  ctx.fillStyle = 'rgba(2,2,10,0.80)'; ctx.strokeStyle = 'rgba(200,180,80,0.48)';
  ctx.lineWidth = Math.max(1, W * 0.0016);
  roundRect(ctx, x, y, cW, cH, H * 0.015); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f0ecd8'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText('LIKE · SUBSCRIBE · NOTIFY', W / 2, y + cH * 0.56);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(2,2,10,0.92)'; ctx.strokeStyle = 'rgba(200,180,80,0.30)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.012); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f0ecd8'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Midnight Cinema Rain', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '66'; ctx.lineWidth = Math.max(1, w * 0.013);
  const len = w * (0.28 + Math.abs(Math.sin(t * 0.55)) * 0.10);
  ctx.beginPath(); ctx.moveTo(x + w * 0.10, y + h * 0.5); ctx.lineTo(x + w * 0.10 + len, y + h * 0.5); ctx.stroke();
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'intro-041-midnight-cinema-rain', name: 'Midnight Cinema Rain', ratio: '16x9', accentColor: '#c8b450' };
module.exports = { draw, drawVisSlot, meta };
