// Draw Frame 16x9 — 와이드 따뜻한 테두리, 상단 좌측 타이틀
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  drawBackground(ctx, W, H);
  drawWarmFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H) {
  const grad = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.65);
  grad.addColorStop(0, '#1a1208');
  grad.addColorStop(0.7, '#0d0a04');
  grad.addColorStop(1, '#050300');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  // 비네트
  const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, W * 0.7);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);
}

function drawWarmFrame(ctx, W, H, t) {
  ctx.save();
  const progress = Math.min(1, t / 1.5);
  ctx.strokeStyle = 'rgba(212,160,80,' + (0.55 + progress * 0.25) + ')';
  ctx.lineWidth = Math.max(2, H * 0.004);
  roundRect(ctx, W * 0.07, H * 0.09, W * 0.86 * progress, H * 0.72, H * 0.025);
  ctx.stroke();
  // 내부 장식선
  ctx.strokeStyle = 'rgba(245,229,192,0.22)';
  ctx.lineWidth = Math.max(1, H * 0.002);
  if (progress > 0.5) {
    roundRect(ctx, W * 0.09, H * 0.13, W * 0.82, H * 0.64, H * 0.020);
    ctx.stroke();
  }
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save();
  ctx.globalAlpha = Math.min(1, t / 0.8);
  ctx.fillStyle = '#f5e5c0';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.034) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.song?.title || 'Draw Frame', W * 0.11, H * 0.30);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cardW = W * 0.46;
  const cardH = H * 0.13;
  const x = (W - cardW) / 2;
  const y = H * 0.44;
  ctx.fillStyle = 'rgba(212,160,80,0.12)';
  ctx.strokeStyle = 'rgba(212,160,80,0.60)';
  ctx.lineWidth = Math.max(1.5, H * 0.003);
  roundRect(ctx, x, y, cardW, cardH, H * 0.025);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f5e5c0';
  ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.019) + "px 'Noto Serif KR', serif";
  ctx.fillText('좋아요 · 구독 · 알림', W / 2, y + cardH * 0.55);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const barX = W * 0.07;
  const barY = H * 0.83;
  const barW = W * 0.86;
  const barH = H * 0.10;
  ctx.fillStyle = 'rgba(13,10,4,0.80)';
  ctx.strokeStyle = 'rgba(212,160,80,0.40)';
  ctx.lineWidth = Math.max(1.5, H * 0.003);
  roundRect(ctx, barX, barY, barW, barH, H * 0.025);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f5e5c0';
  ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.018) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Draw Frame', W / 2, barY + barH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save();
  ctx.strokeStyle = accentColor + '77';
  ctx.lineWidth = Math.max(1, h * 0.015);
  const drawLen = w * (0.3 + Math.sin(t * 0.6) * 0.1);
  ctx.beginPath();
  ctx.moveTo(x + w * 0.1, y + h * 0.5);
  ctx.lineTo(x + w * 0.1 + drawLen, y + h * 0.5);
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

const meta = { id: 'preset-shorts-003', name: 'Draw Frame · 롱폼', ratio: '16x9', accentColor: '#d4a050' };
module.exports = { draw, drawVisSlot, meta };
