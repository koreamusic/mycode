// Slide Frame 16x9 — 수평 슬라이딩 라인, 하단 좌측 타이틀
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  drawBackground(ctx, W, H);
  drawHorizontalFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#090d14');
  grad.addColorStop(0.6, '#050810');
  grad.addColorStop(1, '#020408');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function drawHorizontalFrame(ctx, W, H, t) {
  ctx.save();
  const slide = Math.min(1, t / 1.2);
  // 상단 수평 라인
  ctx.strokeStyle = 'rgba(255,255,255,0.65)';
  ctx.lineWidth = Math.max(1.5, H * 0.003);
  const lineW = W * 0.84 * slide;
  ctx.beginPath();
  ctx.moveTo(W * 0.08, H * 0.12);
  ctx.lineTo(W * 0.08 + lineW, H * 0.12);
  ctx.stroke();
  // 하단 수평 라인
  ctx.beginPath();
  ctx.moveTo(W * 0.08 + W * 0.84 - lineW, H * 0.78);
  ctx.lineTo(W * 0.92, H * 0.78);
  ctx.stroke();
  // 좌측 수직 단선
  ctx.strokeStyle = 'rgba(183,183,183,0.45)';
  ctx.lineWidth = Math.max(1, H * 0.002);
  ctx.beginPath();
  ctx.moveTo(W * 0.08, H * 0.12);
  ctx.lineTo(W * 0.08, H * 0.78);
  ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save();
  ctx.globalAlpha = Math.min(1, t / 0.7);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold ' + Math.floor(W * 0.036) + "px 'Inter', sans-serif";
  ctx.fillText(data.song?.title || 'Slide Frame', W * 0.10, H * 0.62);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cardW = W * 0.48;
  const cardH = H * 0.13;
  const x = (W - cardW) / 2;
  const y = H * 0.43;
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = Math.max(1.5, H * 0.003);
  roundRect(ctx, x, y, cardW, cardH, H * 0.03);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Inter', sans-serif";
  ctx.fillText('Like · Subscribe · Notification', W / 2, y + cardH * 0.55);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const barX = W * 0.08;
  const barY = H * 0.82;
  const barW = W * 0.84;
  const barH = H * 0.10;
  ctx.fillStyle = 'rgba(5,8,16,0.80)';
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = Math.max(1, H * 0.002);
  roundRect(ctx, barX, barY, barW, barH, H * 0.03);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.018) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Slide Frame', W / 2, barY + barH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save();
  ctx.strokeStyle = accentColor + '88';
  ctx.lineWidth = Math.max(1, h * 0.015);
  const lineY = y + h * (0.45 + Math.sin(t) * 0.06);
  ctx.beginPath();
  ctx.moveTo(x + w * 0.1, lineY);
  ctx.lineTo(x + w * 0.9, lineY);
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

const meta = { id: 'preset-shorts-002', name: 'Slide Frame · 롱폼', ratio: '16x9', accentColor: '#ffffff' };
module.exports = { draw, drawVisSlot, meta };
