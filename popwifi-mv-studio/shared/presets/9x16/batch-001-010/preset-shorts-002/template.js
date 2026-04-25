// Slide Frame 9x16 — 수직 슬라이딩 라인, 하단 third 타이틀
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  drawBackground(ctx, W, H);
  drawVerticalFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#090d14'); grad.addColorStop(0.6, '#050810'); grad.addColorStop(1, '#020408');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
}

function drawVerticalFrame(ctx, W, H, t) {
  ctx.save();
  const slide = Math.min(1, t / 1.2);
  ctx.strokeStyle = 'rgba(255,255,255,0.65)';
  ctx.lineWidth = Math.max(1.5, W * 0.005);
  const lineH = H * 0.84 * slide;
  ctx.beginPath(); ctx.moveTo(W * 0.08, H * 0.08); ctx.lineTo(W * 0.08, H * 0.08 + lineH); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W * 0.92, H * 0.92 - lineH); ctx.lineTo(W * 0.92, H * 0.92); ctx.stroke();
  ctx.strokeStyle = 'rgba(183,183,183,0.35)';
  ctx.lineWidth = Math.max(1, W * 0.003);
  ctx.beginPath(); ctx.moveTo(W * 0.08, H * 0.08); ctx.lineTo(W * 0.92, H * 0.08); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save();
  ctx.globalAlpha = Math.min(1, t / 0.7);
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'bold ' + Math.floor(W * 0.070) + "px 'Inter', sans-serif";
  ctx.fillText(data.song?.title || 'Slide Frame', W / 2, H * 0.65);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cardW = W * 0.70; const cardH = H * 0.075; const x = (W - cardW) / 2; const y = H * 0.46;
  ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = Math.max(1.5, W * 0.004);
  roundRect(ctx, x, y, cardW, cardH, W * 0.04); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.038) + "px 'Inter', sans-serif";
  ctx.fillText('Like · Subscribe · Alarm', W / 2, y + cardH * 0.55);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const barX = W * 0.08; const barY = H * 0.84; const barW = W * 0.84; const barH = H * 0.08;
  ctx.fillStyle = 'rgba(5,8,16,0.80)'; ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = Math.max(1, W * 0.003);
  roundRect(ctx, barX, barY, barW, barH, W * 0.04); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.034) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Slide Frame', W / 2, barY + barH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '88'; ctx.lineWidth = Math.max(1, h * 0.02);
  const lineX = x + w * (0.45 + Math.sin(t) * 0.06);
  ctx.beginPath(); ctx.moveTo(lineX, y + h * 0.1); ctx.lineTo(lineX, y + h * 0.9); ctx.stroke(); ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'preset-shorts-002', name: 'Slide Frame', ratio: '9x16', accentColor: '#ffffff' };
module.exports = { draw, drawVisSlot, meta };
