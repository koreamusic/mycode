// Neon Box 9x16 — 네온 사이버 회전 박스, 중앙 타이틀
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawNeonFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#06021a');
  grad.addColorStop(0.5, '#0c0824');
  grad.addColorStop(1, '#03010f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.globalAlpha = 0.07;
  const spacing = W * 0.10;
  ctx.strokeStyle = '#7850ff';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += spacing) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += spacing) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  ctx.restore();
}

function drawNeonFrame(ctx, W, H, t) {
  ctx.save();
  const pulse = 0.55 + Math.sin(t * 2.4) * 0.12;
  ctx.strokeStyle = 'rgba(120,80,255,' + pulse + ')';
  ctx.lineWidth = Math.max(2, W * 0.006);
  roundRect(ctx, W * 0.08, H * 0.06, W * 0.84, H * 0.82, W * 0.05);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,80,200,' + (pulse * 0.4) + ')';
  ctx.lineWidth = Math.max(1, W * 0.003);
  roundRect(ctx, W * 0.12, H * 0.09, W * 0.76, H * 0.76, W * 0.04);
  ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save();
  ctx.globalAlpha = Math.min(1, t / 0.6);
  ctx.shadowColor = '#7850ff';
  ctx.shadowBlur = Math.floor(W * 0.08);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold ' + Math.floor(W * 0.072) + "px 'Montserrat', sans-serif";
  ctx.fillText(data.song?.title || 'Neon Box', W / 2, H * 0.46);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cardW = W * 0.72;
  const cardH = H * 0.08;
  const x = (W - cardW) / 2;
  const y = H * 0.46;
  ctx.fillStyle = 'rgba(120,80,255,0.15)';
  ctx.strokeStyle = 'rgba(120,80,255,0.75)';
  ctx.lineWidth = Math.max(1.5, W * 0.004);
  roundRect(ctx, x, y, cardW, cardH, W * 0.05);
  ctx.fill(); ctx.stroke();
  ctx.shadowColor = '#7850ff';
  ctx.shadowBlur = Math.floor(W * 0.05);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.040) + "px 'Montserrat', sans-serif";
  ctx.fillText('좋아요 · 구독 · 알림', W / 2, y + cardH * 0.55);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const barX = W * 0.08;
  const barY = H * 0.84;
  const barW = W * 0.84;
  const barH = H * 0.08;
  ctx.fillStyle = 'rgba(6,2,26,0.82)';
  ctx.strokeStyle = 'rgba(120,80,255,0.45)';
  ctx.lineWidth = Math.max(1.5, W * 0.004);
  roundRect(ctx, barX, barY, barW, barH, W * 0.04);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.034) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Neon Box', W / 2, barY + barH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save();
  ctx.strokeStyle = accentColor + 'aa';
  ctx.lineWidth = Math.max(1, h * 0.03);
  const size = h * (0.22 + Math.sin(t * 1.5) * 0.04);
  const cx = x + w / 2; const cy = y + h / 2;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.8);
  roundRect(ctx, -size / 2, -size / 2, size, size, size * 0.1);
  ctx.stroke(); ctx.restore(); ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

const meta = { id: 'preset-shorts-001', name: 'Neon Box', ratio: '9x16', accentColor: '#7850ff' };
module.exports = { draw, drawVisSlot, meta };
