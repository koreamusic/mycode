// Minimal Line 9x16 — 프리미엄 수직 라인, 좌측 중앙 타이틀
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H);
  drawMinimalLines(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#f0ebe0'); grad.addColorStop(0.5, '#e8e2d6'); grad.addColorStop(1, '#ddd7ca');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.04;
  for (let i = 0; i < 80; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#000' : '#fff';
    ctx.fillRect(Math.random() * W, Math.random() * H, Math.random() * 2 + 0.5, Math.random() * 2 + 0.5);
  }
  ctx.restore();
}

function drawMinimalLines(ctx, W, H, t) {
  ctx.save();
  const slide = Math.min(1, t / 1.0);
  ctx.strokeStyle = 'rgba(30,30,30,0.72)'; ctx.lineWidth = Math.max(1, W * 0.004);
  const lineH = H * 0.84 * slide;
  ctx.beginPath(); ctx.moveTo(W * 0.08, H * 0.08); ctx.lineTo(W * 0.08, H * 0.08 + lineH); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W * 0.92, H * 0.92 - lineH); ctx.lineTo(W * 0.92, H * 0.92); ctx.stroke();
  ctx.strokeStyle = 'rgba(30,30,30,0.28)'; ctx.lineWidth = Math.max(0.8, W * 0.002);
  ctx.beginPath(); ctx.moveTo(W * 0.08, H * 0.08); ctx.lineTo(W * 0.92, H * 0.08); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.9);
  ctx.fillStyle = '#1e1e1e'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.068) + "px 'Cormorant Garamond', serif";
  ctx.fillText(data.song?.title || 'Minimal Line', W * 0.14, H * 0.50);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cW = W * 0.66; const cH = H * 0.070; const x = (W - cW) / 2; const y = H * 0.46;
  ctx.fillStyle = 'rgba(30,30,30,0.06)'; ctx.strokeStyle = 'rgba(30,30,30,0.55)';
  ctx.lineWidth = Math.max(1, W * 0.003);
  roundRect(ctx, x, y, cW, cH, W * 0.04); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#1e1e1e'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.034) + "px 'Cormorant Garamond', serif";
  ctx.fillText('Like  ·  Subscribe  ·  Alarm', W / 2, y + cH * 0.55);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.84; const bW = W * 0.84; const bH = H * 0.08;
  ctx.fillStyle = 'rgba(30,30,30,0.90)';
  roundRect(ctx, bX, bY, bW, bH, W * 0.04); ctx.fill();
  ctx.fillStyle = '#f5f0e8'; ctx.textAlign = 'left';
  ctx.font = Math.floor(W * 0.032) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Minimal Line', bX + bW * 0.05, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '66'; ctx.lineWidth = Math.max(0.8, w * 0.015);
  ctx.globalAlpha = 0.45 + Math.sin(t * 0.7) * 0.12;
  ctx.beginPath(); ctx.moveTo(x + w * 0.15, y + h * 0.5); ctx.lineTo(x + w * 0.85, y + h * 0.5); ctx.stroke(); ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'preset-shorts-005', name: 'Minimal Line', ratio: '9x16', accentColor: '#1e1e1e' };
module.exports = { draw, drawVisSlot, meta };
