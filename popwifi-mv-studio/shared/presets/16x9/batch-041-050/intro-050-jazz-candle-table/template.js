// Jazz Candle Table 16x9 — 촛불 재즈 테이블, 골드 인티밋
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawCandleFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  ctx.fillStyle = '#040200'; ctx.fillRect(0, 0, W, H);
  const flicker = 0.12 + Math.sin(t * 7.3) * 0.02 + Math.sin(t * 13.1) * 0.01;
  const candle = ctx.createRadialGradient(W * 0.5, H * 0.38, 0, W * 0.5, H * 0.38, H * 0.40);
  candle.addColorStop(0, 'rgba(240,180,60,' + flicker + ')'); candle.addColorStop(0.5, 'rgba(180,90,20,0.08)'); candle.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = candle; ctx.fillRect(0, 0, W, H);
}

function drawCandleFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.4);
  const flicker = 0.45 + Math.sin(t * 6.8) * 0.04;
  ctx.strokeStyle = 'rgba(200,160,60,' + (flicker + p * 0.20) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.002);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.025); ctx.stroke();
  ctx.strokeStyle = 'rgba(200,160,60,' + (0.15 * p) + ')';
  ctx.lineWidth = Math.max(0.8, W * 0.001);
  roundRect(ctx, W * 0.085, H * 0.085, W * 0.83, H * 0.67, H * 0.022); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.2);
  ctx.fillStyle = '#f0e8c8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.song?.title || 'Jazz Candle Table', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cW = W * 0.44; const cH = H * 0.10; const x = (W - cW) / 2; const y = H * 0.435;
  ctx.fillStyle = 'rgba(4,2,0,0.80)'; ctx.strokeStyle = 'rgba(200,160,60,0.50)';
  ctx.lineWidth = Math.max(1, W * 0.0016);
  roundRect(ctx, x, y, cW, cH, H * 0.02); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f0e8c8'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText('Like · Subscribe · Notify', W / 2, y + cH * 0.56);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(4,2,0,0.90)'; ctx.strokeStyle = 'rgba(200,160,60,0.30)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.018); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f0e8c8'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Jazz Candle Table', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '66'; ctx.lineWidth = Math.max(1, w * 0.013);
  const len = w * (0.28 + Math.abs(Math.sin(t * 0.60)) * 0.09);
  ctx.beginPath(); ctx.moveTo(x + w * 0.11, y + h * 0.5); ctx.lineTo(x + w * 0.11 + len, y + h * 0.5); ctx.stroke();
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'intro-050-jazz-candle-table', name: 'Jazz Candle Table', ratio: '16x9', accentColor: '#c8a03c' };
module.exports = { draw, drawVisSlot, meta };
