// Twist Box 16x9 — 수평 그리드 레이어, 좌측 타이틀 앵커
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawWideGrid(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#06040f');
  grad.addColorStop(0.45, '#0c0820');
  grad.addColorStop(1, '#030208');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function drawWideGrid(ctx, W, H, t) {
  ctx.save();
  const colors = ['#ff6432', '#32c8ff', '#c832ff', '#ffd632'];
  const cols = 4;
  const cellW = W / cols;

  colors.forEach((color, i) => {
    const phase = t * 1.8 + i * (Math.PI / 2);
    const offset = Math.sin(phase) * H * 0.04;
    ctx.globalAlpha = 0.18 + Math.sin(phase * 0.7) * 0.06;
    ctx.fillStyle = color;
    ctx.fillRect(cellW * i, H * 0.10 + offset, cellW, H * 0.72);
  });

  ctx.globalAlpha = 1;
  // 수평 크로스 라인
  ctx.strokeStyle = 'rgba(255,255,255,0.20)';
  ctx.lineWidth = Math.max(1, H * 0.002);
  [0.36, 0.64].forEach((ratio) => {
    ctx.beginPath();
    ctx.moveTo(0, H * ratio);
    ctx.lineTo(W, H * ratio);
    ctx.stroke();
  });
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save();
  ctx.globalAlpha = Math.min(1, t / 0.5);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold ' + Math.floor(W * 0.040) + "px 'Black Han Sans', sans-serif";
  ctx.shadowColor = '#ff6432';
  ctx.shadowBlur = Math.floor(H * 0.035);
  ctx.fillText(data.song?.title || 'Twist Box', W * 0.06, H * 0.50);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['LIKE', 'SUBSCRIBE', 'ALARM'];
  const chipW = W * 0.13;
  const chipH = H * 0.11;
  const totalW = chipW * items.length + W * 0.02 * (items.length - 1);
  let startX = (W - totalW) / 2;
  const chipY = H * 0.44;
  const chipColors = ['#ff6432', '#32c8ff', '#ffd632'];
  items.forEach((label, i) => {
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = chipColors[i] + 'cc';
    roundRect(ctx, startX, chipY, chipW, chipH, H * 0.025);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold ' + Math.floor(W * 0.016) + "px 'Black Han Sans', sans-serif";
    ctx.fillText(label, startX + chipW / 2, chipY + chipH * 0.55);
    startX += chipW + W * 0.02;
  });
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const barX = W * 0.05;
  const barY = H * 0.83;
  const barW = W * 0.90;
  const barH = H * 0.11;
  ctx.fillStyle = 'rgba(6,4,15,0.84)';
  ctx.strokeStyle = 'rgba(255,100,50,0.50)';
  ctx.lineWidth = Math.max(2, H * 0.003);
  roundRect(ctx, barX, barY, barW, barH, H * 0.03);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = 'bold ' + Math.floor(W * 0.018) + "px 'Black Han Sans', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Twist Box', W / 2, barY + barH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save();
  ctx.fillStyle = accentColor + 'aa';
  const size = h * (0.18 + Math.abs(Math.sin(t * 2)) * 0.06);
  const cx = x + w / 2;
  const cy = y + h / 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(t * 1.2);
  ctx.fillRect(-size / 2, -size / 2, size, size);
  ctx.restore();
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

const meta = { id: 'preset-shorts-004', name: 'Twist Box · 롱폼', ratio: '16x9', accentColor: '#ff6432' };
module.exports = { draw, drawVisSlot, meta };
