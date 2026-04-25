// Ballad Memory Film 16x9 — 시네마틱 발라드, 세피아 필름
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawFilmFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, H * 0.65);
  grad.addColorStop(0, '#1a1208'); grad.addColorStop(0.6, '#100e08'); grad.addColorStop(1, '#050400');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.15, W / 2, H / 2, H * 0.65);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.04;
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = '#c8a060';
    ctx.fillRect(Math.random() * W, Math.random() * H, Math.random() * 1.2 + 0.3, Math.random() * 1.2 + 0.3);
  }
  ctx.restore();
}

function drawFilmFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.5);
  ctx.strokeStyle = 'rgba(200,160,96,' + (0.30 + p * 0.25) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.0022);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.025);
  ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.2);
  ctx.fillStyle = '#e8d8b8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.040) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.song?.title || 'Ballad Memory Film', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cW = W * 0.44; const cH = H * 0.11; const x = (W - cW) / 2; const y = H * 0.43;
  ctx.fillStyle = 'rgba(200,160,96,0.10)'; ctx.strokeStyle = 'rgba(200,160,96,0.42)';
  ctx.lineWidth = Math.max(1, W * 0.0016);
  roundRect(ctx, x, y, cW, cH, H * 0.04); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e8d8b8'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText('좋아요 · 구독 · 알림', W / 2, y + cH * 0.56);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(5,4,0,0.80)'; ctx.strokeStyle = 'rgba(200,160,96,0.28)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.025); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e8d8b8'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Ballad Memory Film', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '55'; ctx.lineWidth = Math.max(1, w * 0.012);
  const dLen = w * (0.22 + Math.sin(t * 0.5) * 0.06);
  ctx.beginPath(); ctx.moveTo(x + w * 0.14, y + h * 0.5); ctx.lineTo(x + w * 0.14 + dLen, y + h * 0.5); ctx.stroke();
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'intro-005-ballad-memory-film', name: 'Ballad Memory Film', ratio: '16x9', accentColor: '#c8a060' };
module.exports = { draw, drawVisSlot, meta };
