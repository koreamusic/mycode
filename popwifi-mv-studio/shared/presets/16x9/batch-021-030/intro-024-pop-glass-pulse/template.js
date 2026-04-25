// Pop Glass Pulse 16x9 — 글로시 팝, 네온 펄스
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawGlassFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  ctx.fillStyle = '#040408'; ctx.fillRect(0, 0, W, H);
  const pulse = 0.12 + Math.sin(t * 2.0) * 0.04;
  const g1 = ctx.createRadialGradient(W * 0.35, H * 0.40, 0, W * 0.35, H * 0.40, H * 0.38);
  g1.addColorStop(0, 'rgba(255,0,160,' + pulse + ')'); g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
  const g2 = ctx.createRadialGradient(W * 0.65, H * 0.50, 0, W * 0.65, H * 0.50, H * 0.35);
  g2.addColorStop(0, 'rgba(0,220,255,' + pulse * 0.8 + ')'); g2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
}

function drawGlassFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 0.8);
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.03); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,' + (0.30 + p * 0.25) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.002);
  ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.7);
  ctx.shadowColor = '#ff00a0'; ctx.shadowBlur = Math.floor(W * 0.025);
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'bold ' + Math.floor(W * 0.040) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'Pop Glass Pulse', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['LIKE', 'SUB', 'BELL'];
  const colors = ['rgba(255,0,160,0.70)', 'rgba(0,220,255,0.70)', 'rgba(255,0,160,0.70)'];
  const chipW = W * 0.12; const chipH = H * 0.09; const gap = W * 0.022;
  const total = chipW * 3 + gap * 2; let sx = (W - total) / 2; const sy = H * 0.44;
  items.forEach((label, i) => {
    ctx.fillStyle = colors[i];
    roundRect(ctx, sx, sy, chipW, chipH, H * 0.04); ctx.fill();
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
  ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.lineWidth = Math.max(1, W * 0.0016);
  roundRect(ctx, bX, bY, bW, bH, H * 0.025); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Pop Glass Pulse', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '77'; ctx.lineWidth = Math.max(1, w * 0.012);
  const lineX = x + w * (0.45 + Math.sin(t * 1.8) * 0.09);
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

const meta = { id: 'intro-024-pop-glass-pulse', name: 'Pop Glass Pulse', ratio: '16x9', accentColor: '#ff00a0' };
module.exports = { draw, drawVisSlot, meta };
