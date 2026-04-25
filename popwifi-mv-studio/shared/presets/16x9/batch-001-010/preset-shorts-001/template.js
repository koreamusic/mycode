// Neon Box 16x9 — 듀얼 박스 구도, 좌측 타이틀 앵커
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawDualFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#06021a');
  grad.addColorStop(0.5, '#0c0824');
  grad.addColorStop(1, '#03010f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.globalAlpha = 0.08;
  const spacing = W * 0.06;
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

function drawDualFrame(ctx, W, H, t) {
  ctx.save();
  const pulse = 0.55 + Math.sin(t * 2.4) * 0.12;
  ctx.strokeStyle = 'rgba(120,80,255,' + pulse + ')';
  ctx.lineWidth = Math.max(2, H * 0.004);
  // 좌측 프레임
  roundRect(ctx, W * 0.05, H * 0.10, W * 0.42, H * 0.72, H * 0.03);
  ctx.stroke();
  // 우측 보조 프레임
  ctx.strokeStyle = 'rgba(255,80,200,' + (pulse * 0.6) + ')';
  roundRect(ctx, W * 0.54, H * 0.18, W * 0.40, H * 0.55, H * 0.03);
  ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save();
  ctx.globalAlpha = Math.min(1, t / 0.6);
  ctx.shadowColor = '#7850ff';
  ctx.shadowBlur = Math.floor(H * 0.04);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold ' + Math.floor(W * 0.038) + "px 'Montserrat', sans-serif";
  ctx.fillText(data.song?.title || 'Neon Box', W * 0.08, H * 0.46);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cardW = W * 0.50;
  const cardH = H * 0.14;
  const x = (W - cardW) / 2;
  const y = H * 0.43;
  ctx.fillStyle = 'rgba(120,80,255,0.15)';
  ctx.strokeStyle = 'rgba(120,80,255,0.70)';
  ctx.lineWidth = Math.max(1.5, H * 0.003);
  roundRect(ctx, x, y, cardW, cardH, H * 0.04);
  ctx.fill(); ctx.stroke();
  ctx.shadowColor = '#7850ff';
  ctx.shadowBlur = Math.floor(H * 0.03);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.022) + "px 'Montserrat', sans-serif";
  ctx.fillText('좋아요 · 구독 · 알림', W / 2, y + cardH * 0.55);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const barX = W * 0.05;
  const barY = H * 0.84;
  const barW = W * 0.90;
  const barH = H * 0.10;
  ctx.fillStyle = 'rgba(6,2,26,0.82)';
  ctx.strokeStyle = 'rgba(120,80,255,0.45)';
  ctx.lineWidth = Math.max(1.5, H * 0.003);
  roundRect(ctx, barX, barY, barW, barH, H * 0.03);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.018) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Neon Box', W / 2, barY + barH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save();
  ctx.strokeStyle = accentColor + 'aa';
  ctx.lineWidth = Math.max(1, h * 0.02);
  for (let i = 0; i < 3; i++) {
    const px = x + w * (0.2 + i * 0.3);
    const size = h * (0.15 + Math.sin(t * 1.5 + i) * 0.05);
    roundRect(ctx, px - size / 2, y + h * 0.3, size, size, size * 0.15);
    ctx.stroke();
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

const meta = { id: 'preset-shorts-001', name: 'Neon Box · 롱폼', ratio: '16x9', accentColor: '#7850ff' };
module.exports = { draw, drawVisSlot, meta };
