// Cinematic Black Gold 16x9 — 프리미엄 시네마, 블랙 골드
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H);
  drawCinemaFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H) {
  ctx.fillStyle = '#080808'; ctx.fillRect(0, 0, W, H);
  const vign = ctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 0.65);
  vign.addColorStop(0, 'rgba(0,0,0,0)'); vign.addColorStop(1, 'rgba(0,0,0,0.60)');
  ctx.fillStyle = vign; ctx.fillRect(0, 0, W, H);
}

function drawCinemaFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.5);
  ctx.strokeStyle = 'rgba(200,170,80,' + (0.50 + p * 0.25) + ')';
  ctx.lineWidth = Math.max(2, W * 0.0028);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.02); ctx.stroke();
  ctx.strokeStyle = 'rgba(200,170,80,' + (0.18 * p) + ')';
  ctx.lineWidth = Math.max(0.8, W * 0.0010);
  roundRect(ctx, W * 0.085, H * 0.085, W * 0.83, H * 0.67, H * 0.018); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.2);
  ctx.fillStyle = '#f8f0e0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'bold ' + Math.floor(W * 0.040) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.song?.title || 'Cinematic Black Gold', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cW = W * 0.46; const cH = H * 0.10; const x = (W - cW) / 2; const y = H * 0.435;
  ctx.fillStyle = 'rgba(8,8,8,0.75)'; ctx.strokeStyle = 'rgba(200,170,80,0.55)';
  ctx.lineWidth = Math.max(1, W * 0.0018);
  roundRect(ctx, x, y, cW, cH, H * 0.015); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f8f0e0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText('LIKE · SUBSCRIBE · NOTIFY', W / 2, y + cH * 0.56);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(4,4,4,0.90)'; ctx.strokeStyle = 'rgba(200,170,80,0.35)';
  ctx.lineWidth = Math.max(1, W * 0.0016);
  roundRect(ctx, bX, bY, bW, bH, H * 0.015); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f8f0e0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Cinematic Black Gold', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '66'; ctx.lineWidth = Math.max(1, w * 0.014);
  const len = w * (0.30 + Math.abs(Math.sin(t * 0.55)) * 0.12);
  ctx.beginPath(); ctx.moveTo(x + w * 0.10, y + h * 0.5); ctx.lineTo(x + w * 0.10 + len, y + h * 0.5); ctx.stroke();
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'intro-013-cinematic-black-gold', name: 'Cinematic Black Gold', ratio: '16x9', accentColor: '#c8aa50' };
module.exports = { draw, drawVisSlot, meta };
