// City Night Sign 16x9 — 레트로 네온 사인, 도시 밤
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawNeonSign(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#04010c'); grad.addColorStop(0.5, '#080218'); grad.addColorStop(1, '#030010');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const g1 = ctx.createRadialGradient(W * 0.30, H * 0.35, 0, W * 0.30, H * 0.35, H * 0.32);
  g1.addColorStop(0, 'rgba(255,80,20,0.18)'); g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
  const g2 = ctx.createRadialGradient(W * 0.68, H * 0.45, 0, W * 0.68, H * 0.45, H * 0.28);
  g2.addColorStop(0, 'rgba(220,0,200,0.15)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
}

function drawNeonSign(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.0);
  const flicker = 0.85 + Math.sin(t * 23.0) * 0.08;
  ctx.shadowColor = '#ff5010'; ctx.shadowBlur = Math.floor(W * 0.018);
  ctx.strokeStyle = 'rgba(255,80,20,' + (0.55 + p * 0.20) * flicker + ')';
  ctx.lineWidth = Math.max(2, W * 0.0025);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.03); ctx.stroke();
  ctx.shadowColor = 'transparent';
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.8);
  ctx.shadowColor = '#ff5010'; ctx.shadowBlur = Math.floor(W * 0.020);
  ctx.fillStyle = '#fff0e0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'bold ' + Math.floor(W * 0.038) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'City Night Sign', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['LIKE', 'SUB', 'BELL'];
  const colors = ['rgba(255,80,20,0.80)', 'rgba(220,0,200,0.80)', 'rgba(255,80,20,0.80)'];
  const chipW = W * 0.12; const chipH = H * 0.09; const gap = W * 0.022;
  const total = chipW * 3 + gap * 2; let sx = (W - total) / 2; const sy = H * 0.44;
  items.forEach((label, i) => {
    ctx.fillStyle = colors[i];
    roundRect(ctx, sx, sy, chipW, chipH, H * 0.03); ctx.fill();
    ctx.fillStyle = '#fff0e0'; ctx.textAlign = 'center';
    ctx.font = 'bold ' + Math.floor(W * 0.016) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, sx + chipW / 2, sy + chipH * 0.55);
    sx += chipW + gap;
  });
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(4,1,12,0.90)'; ctx.strokeStyle = 'rgba(255,80,20,0.32)';
  ctx.lineWidth = Math.max(1, W * 0.0016);
  roundRect(ctx, bX, bY, bW, bH, H * 0.025); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff0e0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'City Night Sign', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '77'; ctx.lineWidth = Math.max(1, w * 0.013);
  const lineX = x + w * (0.45 + Math.sin(t * 1.5) * 0.09);
  ctx.beginPath(); ctx.moveTo(lineX, y + h * 0.15); ctx.lineTo(lineX, y + h * 0.85); ctx.stroke();
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'intro-026-city-night-sign', name: 'City Night Sign', ratio: '16x9', accentColor: '#ff5014' };
module.exports = { draw, drawVisSlot, meta };
