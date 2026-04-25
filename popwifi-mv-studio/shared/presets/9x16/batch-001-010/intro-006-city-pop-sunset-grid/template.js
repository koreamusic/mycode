// City Pop Sunset Grid 9x16 — 레트로 시티팝, 석양 그리드
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H);
  drawRetroGrid(ctx, W, H, t);
  drawTitle(ctx, W, H, data, t);
  if (t >= 5) drawSocial(ctx, W, H, t);
}

function drawBackground(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#1a0a1e'); grad.addColorStop(0.5, '#2a1040'); grad.addColorStop(1, '#1a0810');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const sun = ctx.createRadialGradient(W * 0.5, H * 0.60, 0, W * 0.5, H * 0.60, H * 0.35);
  sun.addColorStop(0, 'rgba(255,120,40,0.30)'); sun.addColorStop(0.5, 'rgba(220,60,120,0.15)'); sun.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = sun; ctx.fillRect(0, 0, W, H);
}

function drawRetroGrid(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.2);
  ctx.strokeStyle = 'rgba(255,100,180,' + (0.18 * p) + ')'; ctx.lineWidth = Math.max(0.8, W * 0.001);
  for (let i = 1; i < 6; i++) {
    ctx.beginPath(); ctx.moveTo(W * (i / 6), H * 0.10); ctx.lineTo(W * (i / 6), H * 0.82); ctx.stroke();
  }
  for (let i = 1; i < 7; i++) {
    ctx.beginPath(); ctx.moveTo(W * 0.06, H * (0.10 + i * 0.12)); ctx.lineTo(W * 0.94, H * (0.10 + i * 0.12)); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(255,180,60,' + (0.50 + p * 0.22) + ')'; ctx.lineWidth = Math.max(2, W * 0.003);
  roundRect(ctx, W * 0.06, H * 0.10, W * 0.88, H * 0.72, W * 0.025); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 0.7);
  ctx.fillStyle = '#ffe8c0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'bold ' + Math.floor(W * 0.058) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'City Pop Sunset Grid', W / 2, H * 0.40);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['좋아요', '구독'];
  const colors = ['rgba(255,100,60,0.80)', 'rgba(220,60,150,0.80)'];
  const chipW = W * 0.68; const chipH = H * 0.065; const gap = H * 0.016;
  let sy = H * 0.62; const sx = (W - chipW) / 2;
  items.forEach((label, i) => {
    ctx.fillStyle = colors[i];
    roundRect(ctx, sx, sy, chipW, chipH, chipH * 0.4); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
    ctx.font = 'bold ' + Math.floor(W * 0.038) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, W / 2, sy + chipH * 0.55);
    sy += chipH + gap;
  });
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '77'; ctx.lineWidth = Math.max(0.8, w * 0.014);
  const len = h * (0.25 + Math.abs(Math.sin(t * 0.8)) * 0.12);
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

const meta = { id: 'intro-006-city-pop-sunset-grid', name: 'City Pop Sunset Grid', ratio: '9x16', accentColor: '#ff64b4' };
module.exports = { draw, drawVisSlot, meta };
