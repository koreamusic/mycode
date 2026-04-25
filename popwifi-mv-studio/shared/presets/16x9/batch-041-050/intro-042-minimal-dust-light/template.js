// Minimal Dust Light 16x9 — 먼지 빛, 모던 미니멀
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawDustFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#f4f2ee'); grad.addColorStop(0.5, '#f8f6f0'); grad.addColorStop(1, '#eeece8');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const dust = ctx.createRadialGradient(W * 0.72, H * 0.22, 0, W * 0.72, H * 0.22, H * 0.45);
  dust.addColorStop(0, 'rgba(200,190,170,0.20)'); dust.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = dust; ctx.fillRect(0, 0, W, H);
}

function drawDustFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.0);
  ctx.strokeStyle = 'rgba(60,60,70,' + (0.32 + p * 0.18) + ')';
  ctx.lineWidth = Math.max(1, W * 0.0013);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.01); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.9);
  ctx.fillStyle = '#1a1a20'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.036) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'Minimal Dust Light', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['LIKE', 'SUB', 'BELL'];
  const chipW = W * 0.11; const chipH = H * 0.09; const gap = W * 0.022;
  const total = chipW * 3 + gap * 2; let sx = (W - total) / 2; const sy = H * 0.44;
  items.forEach((label) => {
    ctx.fillStyle = 'rgba(26,26,32,0.0)'; ctx.strokeStyle = 'rgba(60,60,70,0.40)';
    ctx.lineWidth = Math.max(1, W * 0.0011);
    roundRect(ctx, sx, sy, chipW, chipH, H * 0.01); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#1a1a20'; ctx.textAlign = 'center';
    ctx.font = Math.floor(W * 0.016) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, sx + chipW / 2, sy + chipH * 0.55);
    sx += chipW + gap;
  });
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(26,26,32,0.0)'; ctx.strokeStyle = 'rgba(60,60,70,0.28)';
  ctx.lineWidth = Math.max(1, W * 0.0011);
  ctx.beginPath(); ctx.moveTo(bX, bY); ctx.lineTo(bX + bW, bY); ctx.stroke();
  ctx.fillStyle = '#1a1a20'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Minimal Dust Light', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '66'; ctx.lineWidth = Math.max(1, w * 0.010);
  const cx = x + w / 2; const len = h * (0.26 + Math.abs(Math.sin(t * 0.7)) * 0.10);
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

const meta = { id: 'intro-042-minimal-dust-light', name: 'Minimal Dust Light', ratio: '16x9', accentColor: '#909096' };
module.exports = { draw, drawVisSlot, meta };
