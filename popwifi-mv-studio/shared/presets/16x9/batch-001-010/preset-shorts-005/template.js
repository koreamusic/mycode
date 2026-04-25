// Minimal Line 16x9 — 좌측 앵커 구도, 프리미엄 수평 라인
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  drawBackground(ctx, W, H);
  drawMinimalLines(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#f0ebe0');
  grad.addColorStop(0.5, '#e8e2d6');
  grad.addColorStop(1, '#ddd7ca');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  // 페이퍼 그레인 흉내
  ctx.save();
  ctx.globalAlpha = 0.04;
  for (let i = 0; i < 120; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#000' : '#fff';
    ctx.fillRect(
      Math.random() * W, Math.random() * H,
      Math.random() * 2 + 0.5, Math.random() * 2 + 0.5
    );
  }
  ctx.restore();
}

function drawMinimalLines(ctx, W, H, t) {
  ctx.save();
  const slide = Math.min(1, t / 1.0);
  ctx.strokeStyle = 'rgba(30,30,30,0.70)';
  ctx.lineWidth = Math.max(1, H * 0.002);
  // 상단 긴 수평선
  ctx.beginPath();
  ctx.moveTo(W * 0.08, H * 0.20);
  ctx.lineTo(W * 0.08 + W * 0.84 * slide, H * 0.20);
  ctx.stroke();
  // 하단 긴 수평선
  ctx.beginPath();
  ctx.moveTo(W * 0.92 - W * 0.84 * slide, H * 0.78);
  ctx.lineTo(W * 0.92, H * 0.78);
  ctx.stroke();
  // 좌측 앵커 수직선
  ctx.strokeStyle = 'rgba(30,30,30,0.30)';
  ctx.lineWidth = Math.max(0.8, H * 0.0015);
  ctx.beginPath();
  ctx.moveTo(W * 0.08, H * 0.20);
  ctx.lineTo(W * 0.08, H * 0.78);
  ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save();
  ctx.globalAlpha = Math.min(1, t / 0.9);
  ctx.fillStyle = '#1e1e1e';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.036) + "px 'Cormorant Garamond', serif";
  ctx.fillText(data.song?.title || 'Minimal Line', W * 0.11, H * 0.50);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cardW = W * 0.44;
  const cardH = H * 0.12;
  const x = (W - cardW) / 2;
  const y = H * 0.44;
  ctx.fillStyle = 'rgba(30,30,30,0.06)';
  ctx.strokeStyle = 'rgba(30,30,30,0.50)';
  ctx.lineWidth = Math.max(1, H * 0.002);
  roundRect(ctx, x, y, cardW, cardH, H * 0.025);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#1e1e1e';
  ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.018) + "px 'Cormorant Garamond', serif";
  ctx.fillText('Like  ·  Subscribe  ·  Notification', W / 2, y + cardH * 0.55);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const barX = W * 0.08;
  const barY = H * 0.83;
  const barW = W * 0.84;
  const barH = H * 0.10;
  ctx.fillStyle = 'rgba(30,30,30,0.88)';
  roundRect(ctx, barX, barY, barW, barH, H * 0.025);
  ctx.fill();
  ctx.fillStyle = '#f5f0e8';
  ctx.textAlign = 'left';
  ctx.font = Math.floor(W * 0.017) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Minimal Line', barX + barW * 0.04, barY + barH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save();
  ctx.strokeStyle = accentColor + '66';
  ctx.lineWidth = Math.max(0.8, h * 0.012);
  const breathe = 0.3 + Math.sin(t * 0.7) * 0.05;
  ctx.globalAlpha = breathe + 0.5;
  ctx.beginPath();
  ctx.moveTo(x + w * 0.15, y + h * 0.5);
  ctx.lineTo(x + w * 0.85, y + h * 0.5);
  ctx.stroke();
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

const meta = { id: 'preset-shorts-005', name: 'Minimal Line · 롱폼', ratio: '16x9', accentColor: '#1e1e1e' };
module.exports = { draw, drawVisSlot, meta };
