// Midnight Jazz Frame 9x16 — 골드 코너 브래킷, 딥 재즈
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawJazzFrame(ctx, W, H, t);
  drawTitle(ctx, W, H, data, t);
  if (t >= 5) drawSocial(ctx, W, H, t);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0a0608'); grad.addColorStop(0.5, '#14080e'); grad.addColorStop(1, '#080408');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.5, H * 0.40, 0, W * 0.5, H * 0.40, H * 0.32);
  glow.addColorStop(0, 'rgba(200,160,80,0.12)'); glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
}

function drawJazzFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.2);
  const bk = W * 0.06; const bW = W * 0.88; const bH = H * 0.72; const bY = H * 0.10; const arm = W * 0.10;
  ctx.strokeStyle = 'rgba(200,160,80,' + (0.55 + p * 0.22) + ')';
  ctx.lineWidth = Math.max(2, W * 0.004);
  ctx.beginPath();
  ctx.moveTo(bk + arm, bY); ctx.lineTo(bk, bY); ctx.lineTo(bk, bY + arm);
  ctx.moveTo(bk + bW - arm, bY); ctx.lineTo(bk + bW, bY); ctx.lineTo(bk + bW, bY + arm);
  ctx.moveTo(bk, bY + bH - arm); ctx.lineTo(bk, bY + bH); ctx.lineTo(bk + arm, bY + bH);
  ctx.moveTo(bk + bW - arm, bY + bH); ctx.lineTo(bk + bW, bY + bH); ctx.lineTo(bk + bW, bY + bH - arm);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(200,160,80,' + (0.18 * p) + ')';
  ctx.lineWidth = Math.max(0.8, W * 0.001);
  roundRect(ctx, bk, bY, bW, bH, W * 0.015); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.0);
  ctx.shadowColor = '#c8a050'; ctx.shadowBlur = Math.floor(W * 0.04);
  ctx.fillStyle = '#f5ead8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.060) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.song?.title || 'Midnight Jazz Frame', W / 2, H * 0.40);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['좋아요', '구독'];
  const chipW = W * 0.68; const chipH = H * 0.065; const gap = H * 0.016;
  let sy = H * 0.62; const sx = (W - chipW) / 2;
  items.forEach((label) => {
    ctx.fillStyle = 'rgba(10,6,8,0.80)'; ctx.strokeStyle = 'rgba(200,160,80,0.58)';
    ctx.lineWidth = Math.max(1, W * 0.0022);
    roundRect(ctx, sx, sy, chipW, chipH, chipH * 0.4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f5ead8'; ctx.textAlign = 'center';
    ctx.font = Math.floor(W * 0.040) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, W / 2, sy + chipH * 0.55);
    sy += chipH + gap;
  });
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '66'; ctx.lineWidth = Math.max(1, w * 0.018);
  const len = h * (0.28 + Math.abs(Math.sin(t * 0.6)) * 0.12);
  const cx = x + w / 2;
  ctx.beginPath(); ctx.moveTo(cx, y + (h - len) / 2); ctx.lineTo(cx, y + (h + len) / 2); ctx.stroke();
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'intro-001-midnight-jazz-frame', name: 'Midnight Jazz Frame', ratio: '9x16', accentColor: '#c8a050' };
module.exports = { draw, drawVisSlot, meta };
