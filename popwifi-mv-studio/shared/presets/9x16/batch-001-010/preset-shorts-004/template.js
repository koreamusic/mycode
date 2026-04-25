// Twist Box 9x16 — 컬러 레이어, 중앙 하단 타이틀
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawColorLayers(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#06040f'); grad.addColorStop(0.5, '#0c0820'); grad.addColorStop(1, '#030208');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
}

function drawColorLayers(ctx, W, H, t) {
  ctx.save();
  const colors = ['#ff6432cc', '#32c8ffaa', '#c832ffaa', '#ffd632aa'];
  const rows = 4;
  const rowH = H / rows;
  colors.forEach((color, i) => {
    const phase = t * 1.6 + i * (Math.PI / 2);
    const offset = Math.sin(phase) * W * 0.04;
    ctx.globalAlpha = 0.16 + Math.abs(Math.sin(phase * 0.7)) * 0.06;
    ctx.fillStyle = color;
    ctx.fillRect(W * 0.06 + offset, rowH * i, W * 0.88, rowH);
  });
  ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = Math.max(1, W * 0.003);
  [0.25, 0.5, 0.75].forEach(r => {
    ctx.beginPath(); ctx.moveTo(0, H * r); ctx.lineTo(W, H * r); ctx.stroke();
  });
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.5);
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'bold ' + Math.floor(W * 0.076) + "px 'Black Han Sans', sans-serif";
  ctx.shadowColor = '#ff6432'; ctx.shadowBlur = Math.floor(W * 0.08);
  ctx.fillText(data.song?.title || 'Twist Box', W / 2, H * 0.62);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['LIKE', 'SUB', 'ALARM'];
  const chipW = W * 0.22; const chipH = H * 0.055;
  const totalW = chipW * 3 + W * 0.03 * 2;
  let sx = (W - totalW) / 2; const chipY = H * 0.46;
  const chipColors = ['#ff6432cc', '#32c8ffcc', '#ffd632cc'];
  items.forEach((label, i) => {
    ctx.globalAlpha = 0.90; ctx.fillStyle = chipColors[i];
    roundRect(ctx, sx, chipY, chipW, chipH, W * 0.04); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
    ctx.font = 'bold ' + Math.floor(W * 0.030) + "px 'Black Han Sans', sans-serif";
    ctx.fillText(label, sx + chipW / 2, chipY + chipH * 0.55);
    sx += chipW + W * 0.03;
  });
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.06; const bY = H * 0.84; const bW = W * 0.88; const bH = H * 0.08;
  ctx.fillStyle = 'rgba(6,4,15,0.85)'; ctx.strokeStyle = 'rgba(255,100,50,0.55)';
  ctx.lineWidth = Math.max(2, W * 0.005);
  roundRect(ctx, bX, bY, bW, bH, W * 0.04); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
  ctx.font = 'bold ' + Math.floor(W * 0.034) + "px 'Black Han Sans', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Twist Box', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.fillStyle = accentColor + 'aa';
  const size = h * (0.20 + Math.abs(Math.sin(t * 2)) * 0.05);
  const cx = x + w / 2; const cy = y + h / 2;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 1.2);
  ctx.fillRect(-size / 2, -size / 2, size, size); ctx.restore(); ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'preset-shorts-004', name: 'Twist Box', ratio: '9x16', accentColor: '#ff6432' };
module.exports = { draw, drawVisSlot, meta };
