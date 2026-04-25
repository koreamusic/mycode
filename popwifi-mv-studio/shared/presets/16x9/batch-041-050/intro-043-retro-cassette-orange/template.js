// Retro Cassette Orange 16x9 — 오렌지 카세트, 아날로그 레트로
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawCassetteFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#1a0e04'); grad.addColorStop(0.5, '#241408'); grad.addColorStop(1, '#140a02');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const orange = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, H * 0.38);
  orange.addColorStop(0, 'rgba(255,140,40,0.14)'); orange.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = orange; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.04 + Math.sin(t * 7) * 0.01;
  ctx.strokeStyle = 'rgba(200,160,80,0.5)'; ctx.lineWidth = Math.max(0.5, H * 0.002);
  for (let i = 0; i < H; i += Math.max(3, H * 0.012)) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
  }
  ctx.restore();
}

function drawCassetteFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.0);
  ctx.strokeStyle = 'rgba(255,140,40,' + (0.50 + p * 0.22) + ')';
  ctx.lineWidth = Math.max(2, W * 0.003);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.03); ctx.stroke();
  ctx.strokeStyle = 'rgba(80,50,20,' + (0.50 * p) + ')';
  ctx.lineWidth = Math.max(4, W * 0.005);
  roundRect(ctx, W * 0.075, H * 0.075, W * 0.85, H * 0.69, H * 0.035); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.9);
  ctx.fillStyle = '#ffe0c0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'Retro Cassette Orange', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['LIKE', 'SUB', 'BELL'];
  const chipW = W * 0.12; const chipH = H * 0.09; const gap = W * 0.022;
  const total = chipW * 3 + gap * 2; let sx = (W - total) / 2; const sy = H * 0.44;
  items.forEach((label) => {
    ctx.fillStyle = 'rgba(255,140,40,0.75)';
    roundRect(ctx, sx, sy, chipW, chipH, H * 0.035); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
    ctx.font = 'bold ' + Math.floor(W * 0.016) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, sx + chipW / 2, sy + chipH * 0.55);
    sx += chipW + gap;
  });
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(20,14,2,0.88)'; ctx.strokeStyle = 'rgba(255,140,40,0.32)';
  ctx.lineWidth = Math.max(1, W * 0.0016);
  roundRect(ctx, bX, bY, bW, bH, H * 0.025); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffe0c0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Retro Cassette Orange', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.fillStyle = accentColor + '66';
  for (let i = 0; i < 5; i++) {
    const bh = h * (0.15 + Math.abs(Math.sin(t * 1.4 + i * 0.7)) * 0.35);
    ctx.fillRect(x + w * (0.10 + i * 0.16), y + (h - bh) / 2, Math.max(2, w * 0.08), bh);
  }
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'intro-043-retro-cassette-orange', name: 'Retro Cassette Orange', ratio: '16x9', accentColor: '#ff8c28' };
module.exports = { draw, drawVisSlot, meta };
