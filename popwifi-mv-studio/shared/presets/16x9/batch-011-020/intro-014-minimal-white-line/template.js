// Minimal White Line 16x9 — 클린 미니멀, 화이트 라인
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H);
  drawMinimalFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H) {
  ctx.fillStyle = '#0c0c0c'; ctx.fillRect(0, 0, W, H);
}

function drawMinimalFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.0);
  ctx.strokeStyle = 'rgba(240,240,240,' + (0.55 + p * 0.25) + ')';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.01); ctx.stroke();
  ctx.strokeStyle = 'rgba(240,240,240,' + (0.10 * p) + ')';
  ctx.lineWidth = Math.max(0.5, W * 0.0008);
  const cx = W * 0.5; const topY = H * 0.08; const botY = H * 0.76;
  ctx.beginPath(); ctx.moveTo(cx, topY); ctx.lineTo(cx, botY); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.8);
  ctx.fillStyle = '#f0f0f0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'Minimal White Line', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['LIKE', 'SUB', 'BELL'];
  const chipW = W * 0.11; const chipH = H * 0.09; const gap = W * 0.022;
  const total = chipW * 3 + gap * 2; let sx = (W - total) / 2; const sy = H * 0.44;
  items.forEach((label) => {
    ctx.fillStyle = 'rgba(240,240,240,0.0)'; ctx.strokeStyle = 'rgba(240,240,240,0.55)';
    ctx.lineWidth = Math.max(1, W * 0.0012);
    roundRect(ctx, sx, sy, chipW, chipH, H * 0.01); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f0f0f0'; ctx.textAlign = 'center';
    ctx.font = Math.floor(W * 0.017) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, sx + chipW / 2, sy + chipH * 0.55);
    sx += chipW + gap;
  });
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(0,0,0,0.0)'; ctx.strokeStyle = 'rgba(240,240,240,0.30)';
  ctx.lineWidth = Math.max(1, W * 0.0012);
  ctx.beginPath(); ctx.moveTo(bX, bY); ctx.lineTo(bX + bW, bY); ctx.stroke();
  ctx.fillStyle = '#f0f0f0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Minimal White Line', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '66'; ctx.lineWidth = Math.max(1, w * 0.010);
  const cx = x + w / 2; const len = h * (0.25 + Math.abs(Math.sin(t * 0.8)) * 0.12);
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

const meta = { id: 'intro-014-minimal-white-line', name: 'Minimal White Line', ratio: '16x9', accentColor: '#e8e8e8' };
module.exports = { draw, drawVisSlot, meta };
