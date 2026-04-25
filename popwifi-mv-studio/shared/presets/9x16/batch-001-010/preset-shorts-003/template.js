// Draw Frame 9x16 — 따뜻한 테두리, 상단 third 타이틀
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H);
  drawWarmFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H) {
  const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, H * 0.6);
  grad.addColorStop(0, '#1a1208'); grad.addColorStop(0.7, '#0d0a04'); grad.addColorStop(1, '#050300');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.15, W / 2, H / 2, H * 0.65);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.50)');
  ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}

function drawWarmFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.5);
  ctx.strokeStyle = 'rgba(212,160,80,' + (0.50 + p * 0.30) + ')';
  ctx.lineWidth = Math.max(2, W * 0.006);
  roundRect(ctx, W * 0.08, H * 0.06, W * 0.84, H * 0.82 * p, W * 0.04);
  ctx.stroke();
  if (p > 0.6) {
    ctx.strokeStyle = 'rgba(245,229,192,0.20)'; ctx.lineWidth = Math.max(1, W * 0.003);
    roundRect(ctx, W * 0.11, H * 0.09, W * 0.78, H * 0.74, W * 0.035); ctx.stroke();
  }
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.8);
  ctx.fillStyle = '#f5e5c0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.065) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.song?.title || 'Draw Frame', W / 2, H * 0.30);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cW = W * 0.68; const cH = H * 0.075; const x = (W - cW) / 2; const y = H * 0.46;
  ctx.fillStyle = 'rgba(212,160,80,0.12)'; ctx.strokeStyle = 'rgba(212,160,80,0.65)';
  ctx.lineWidth = Math.max(1.5, W * 0.004);
  roundRect(ctx, x, y, cW, cH, W * 0.04); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f5e5c0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.036) + "px 'Noto Serif KR', serif";
  ctx.fillText('좋아요 · 구독 · 알림', W / 2, y + cH * 0.55);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.84; const bW = W * 0.84; const bH = H * 0.08;
  ctx.fillStyle = 'rgba(13,10,4,0.82)'; ctx.strokeStyle = 'rgba(212,160,80,0.40)';
  ctx.lineWidth = Math.max(1.5, W * 0.004);
  roundRect(ctx, bX, bY, bW, bH, W * 0.04); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f5e5c0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.034) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Draw Frame', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '77'; ctx.lineWidth = Math.max(1, w * 0.02);
  const dLen = w * (0.25 + Math.sin(t * 0.6) * 0.08);
  ctx.beginPath(); ctx.moveTo(x + w * 0.15, y + h * 0.5); ctx.lineTo(x + w * 0.15 + dLen, y + h * 0.5); ctx.stroke(); ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'preset-shorts-003', name: 'Draw Frame', ratio: '9x16', accentColor: '#d4a050' };
module.exports = { draw, drawVisSlot, meta };
