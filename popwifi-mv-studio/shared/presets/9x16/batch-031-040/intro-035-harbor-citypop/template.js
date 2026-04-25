// Harbor City Pop 9x16
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawFrame(ctx, W, H, t);
  drawTitle(ctx, W, H, data, t);
  if (t >= 5) drawSocial(ctx, W, H, t);
}

function drawBackground(ctx, W, H, t) {
  ctx.fillStyle = '#0c0818'; ctx.fillRect(0, 0, W, H);
  const pulse = 0.12 + Math.sin(t * 1.8) * 0.04;
  const g1 = ctx.createRadialGradient(W*0.5, H*0.38, 0, W*0.5, H*0.38, H*0.38);
  g1.addColorStop(0, 'rgba(255,140,60,{p})'.replace('{p}', pulse.toFixed(2))); g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
  const g2 = ctx.createRadialGradient(W*0.5, H*0.42, 0, W*0.5, H*0.42, H*0.26);
  g2.addColorStop(0, 'rgba(0,180,200,{p})'.replace('{p}', (pulse*0.6).toFixed(2))); g2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
}

function drawFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.2);
  ctx.strokeStyle = 'rgba(255,140,60,' + (0.45 + p * 0.22).toFixed(2) + ')';
  ctx.lineWidth = Math.max(2, W * 0.003);
  roundRect(ctx, W * 0.06, H * 0.10, W * 0.88, H * 0.72, W * 0.035); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.0);
  ctx.fillStyle = '#ffe8c8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.055) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'Harbor City Pop', W / 2, H * 0.40);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['좋아요', '구독'];
  const chipW = W * 0.68; const chipH = H * 0.065; const gap = H * 0.016;
  let sy = H * 0.62; const sx = (W - chipW) / 2;
  items.forEach((label) => {
    ctx.fillStyle = 'rgba(0,0,0,0.80)'; ctx.strokeStyle = 'rgba(255,140,60,0.52)';
    ctx.lineWidth = Math.max(1, W * 0.0020);
    roundRect(ctx, sx, sy, chipW, chipH, chipH * 0.4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffe8c8'; ctx.textAlign = 'center';
    ctx.font = Math.floor(W * 0.038) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, W / 2, sy + chipH * 0.55);
    sy += chipH + gap;
  });
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '66'; ctx.lineWidth = Math.max(1, w * 0.015);
  const len = h * (0.28 + Math.abs(Math.sin(t * 0.7)) * 0.10);
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

const meta = { id: 'intro-035-harbor-citypop', name: 'Harbor City Pop', ratio: '9x16', accentColor: '#ff8c3c' };
module.exports = { draw, drawVisSlot, meta };
