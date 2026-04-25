// K-Pop Neon Stage 9x16 — 네온 스테이지, 케이팝 에너지
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawNeonFrame(ctx, W, H, t);
  drawTitle(ctx, W, H, data, t);
  if (t >= 5) drawSocial(ctx, W, H, t);
}

function drawBackground(ctx, W, H, t) {
  ctx.fillStyle = '#04020c'; ctx.fillRect(0, 0, W, H);
  const pulse = 0.12 + Math.sin(t * 2.0) * 0.04;
  const g1 = ctx.createRadialGradient(W * 0.5, H * 0.38, 0, W * 0.5, H * 0.38, H * 0.35);
  g1.addColorStop(0, 'rgba(0,229,255,' + pulse + ')'); g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
  const g2 = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, H * 0.28);
  g2.addColorStop(0, 'rgba(255,0,180,' + pulse * 0.7 + ')'); g2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
}

function drawNeonFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 0.8);
  ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = Math.floor(W * 0.03);
  ctx.strokeStyle = 'rgba(0,229,255,' + (0.55 + p * 0.20) + ')';
  ctx.lineWidth = Math.max(2, W * 0.0035);
  roundRect(ctx, W * 0.06, H * 0.10, W * 0.88, H * 0.72, W * 0.03); ctx.stroke();
  ctx.shadowColor = '#ff00b4'; ctx.shadowBlur = Math.floor(W * 0.025);
  ctx.strokeStyle = 'rgba(255,0,180,' + (0.30 * p) + ')';
  ctx.lineWidth = Math.max(1, W * 0.002);
  roundRect(ctx, W * 0.065, H * 0.103, W * 0.87, H * 0.714, W * 0.028); ctx.stroke();
  ctx.shadowColor = 'transparent';
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.7);
  ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = Math.floor(W * 0.05);
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'bold ' + Math.floor(W * 0.060) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'K-Pop Neon Stage', W / 2, H * 0.40);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['좋아요', '구독'];
  const colors = ['rgba(0,200,240,0.75)', 'rgba(255,0,160,0.75)'];
  const chipW = W * 0.68; const chipH = H * 0.065; const gap = H * 0.016;
  let sy = H * 0.62; const sx = (W - chipW) / 2;
  items.forEach((label, i) => {
    ctx.fillStyle = colors[i];
    roundRect(ctx, sx, sy, chipW, chipH, chipH * 0.4); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
    ctx.font = 'bold ' + Math.floor(W * 0.038) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, W / 2, sy + chipH * 0.55);
    sy += chipH + gap;
  });
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '77'; ctx.lineWidth = Math.max(1, w * 0.015);
  const cx = x + w / 2; const len = h * (0.30 + Math.abs(Math.sin(t * 1.8)) * 0.15);
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

const meta = { id: 'intro-004-kpop-neon-stage', name: 'K-Pop Neon Stage', ratio: '9x16', accentColor: '#00e5ff' };
module.exports = { draw, drawVisSlot, meta };
