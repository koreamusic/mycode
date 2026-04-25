// Ballad Memory Film 9x16 — 세피아 필름, 시네마틱 발라드
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawFilmFrame(ctx, W, H, t);
  drawTitle(ctx, W, H, data, t);
  if (t >= 5) drawSocial(ctx, W, H, t);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createRadialGradient(W * 0.5, H * 0.38, 0, W * 0.5, H * 0.38, H * 0.55);
  grad.addColorStop(0, '#1a1208'); grad.addColorStop(0.6, '#100e08'); grad.addColorStop(1, '#050400');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.12, W / 2, H / 2, H * 0.60);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}

function drawFilmFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.5);
  ctx.strokeStyle = 'rgba(200,160,96,' + (0.40 + p * 0.22) + ')';
  ctx.lineWidth = Math.max(2, W * 0.003);
  roundRect(ctx, W * 0.06, H * 0.10, W * 0.88, H * 0.72, W * 0.02); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.2);
  ctx.fillStyle = '#e8d8b8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.055) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.song?.title || 'Ballad Memory Film', W / 2, H * 0.40);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['좋아요', '구독'];
  const chipW = W * 0.68; const chipH = H * 0.065; const gap = H * 0.016;
  let sy = H * 0.62; const sx = (W - chipW) / 2;
  items.forEach((label) => {
    ctx.fillStyle = 'rgba(5,4,0,0.80)'; ctx.strokeStyle = 'rgba(200,160,96,0.52)';
    ctx.lineWidth = Math.max(1, W * 0.0020);
    roundRect(ctx, sx, sy, chipW, chipH, chipH * 0.35); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#e8d8b8'; ctx.textAlign = 'center';
    ctx.font = Math.floor(W * 0.038) + "px 'Noto Serif KR', serif";
    ctx.fillText(label, W / 2, sy + chipH * 0.55);
    sy += chipH + gap;
  });
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '55'; ctx.lineWidth = Math.max(1, w * 0.015);
  const len = h * (0.24 + Math.abs(Math.sin(t * 0.5)) * 0.10);
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

const meta = { id: 'intro-005-ballad-memory-film', name: 'Ballad Memory Film', ratio: '9x16', accentColor: '#c8a060' };
module.exports = { draw, drawVisSlot, meta };
