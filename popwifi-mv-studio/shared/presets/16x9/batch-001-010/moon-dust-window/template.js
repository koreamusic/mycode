function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  drawBackground(ctx, W, H);
  drawFrame(ctx, W, H);

  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data, t);
}

function drawBackground(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#141a33');
  grad.addColorStop(0.55, '#080b16');
  grad.addColorStop(1, '#03040a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function drawFrame(ctx, W, H) {
  ctx.save();
  ctx.strokeStyle = 'rgba(184,198,255,0.68)';
  ctx.lineWidth = Math.max(2, H * 0.003);
  roundRect(ctx, W * 0.08, H * 0.10, W * 0.84, H * 0.62, H * 0.035);
  ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save();
  ctx.globalAlpha = Math.min(1, t / 0.8);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.04) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'Moon Dust Window', W / 2, H * 0.38);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cardW = W * 0.42;
  const cardH = H * 0.12;
  const x = (W - cardW) / 2;
  const y = H * 0.46;
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  ctx.strokeStyle = 'rgba(184,198,255,0.35)';
  roundRect(ctx, x, y, cardW, cardH, H * 0.035);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.022) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText('좋아요 · 구독 · 알림', W / 2, y + cardH * 0.56);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data, t) {
  ctx.save();
  const barX = W * 0.08;
  const barY = H * 0.82;
  const barW = W * 0.84;
  const barH = H * 0.10;
  ctx.fillStyle = 'rgba(5,7,13,0.78)';
  roundRect(ctx, barX, barY, barW, barH, H * 0.035);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.018) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Moon Dust Window', W / 2, barY + barH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save();
  ctx.fillStyle = accentColor + '55';
  for (let i = 0; i < 3; i++) {
    const px = x + w * (0.25 + i * 0.22);
    const py = y + h * (0.48 + Math.sin(t + i) * 0.12);
    ctx.beginPath();
    ctx.arc(px, py, Math.max(3, h * 0.04), 0, Math.PI * 2);
    ctx.fill();
  }
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

const meta = {
  id: 'moon-dust-window',
  name: '문더스트 윈도우 · 롱폼',
  ratio: '16x9',
  accentColor: '#B8C6FF'
};

module.exports = { draw, drawVisSlot, meta };
