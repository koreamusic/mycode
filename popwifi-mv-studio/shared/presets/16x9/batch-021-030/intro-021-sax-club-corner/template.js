// Sax Club Corner 16x9 — 스모키 클럽, 골드 색소폰
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawStageFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  ctx.fillStyle = '#04020a'; ctx.fillRect(0, 0, W, H);
  const spot = ctx.createRadialGradient(W * 0.5, H * 0.30, 0, W * 0.5, H * 0.30, H * 0.36);
  spot.addColorStop(0, 'rgba(200,160,60,0.18)'); spot.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = spot; ctx.fillRect(0, 0, W, H);
  const smoke = ctx.createRadialGradient(W * 0.30, H * 0.60, 0, W * 0.30, H * 0.60, H * 0.28);
  smoke.addColorStop(0, 'rgba(60,40,20,0.20)'); smoke.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = smoke; ctx.fillRect(0, 0, W, H);
}

function drawStageFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.4);
  ctx.strokeStyle = 'rgba(200,160,60,' + (0.45 + p * 0.25) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.002);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.025); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.2);
  ctx.fillStyle = '#f5e8c0'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.song?.title || 'Sax Club Corner', W * 0.13, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cW = W * 0.44; const cH = H * 0.10; const x = W * 0.13; const y = H * 0.435;
  ctx.fillStyle = 'rgba(4,2,10,0.80)'; ctx.strokeStyle = 'rgba(200,160,60,0.50)';
  ctx.lineWidth = Math.max(1, W * 0.0016);
  roundRect(ctx, x, y, cW, cH, H * 0.025); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f5e8c0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText('Like · Subscribe · Notify', x + cW / 2, y + cH * 0.56);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(4,2,10,0.88)'; ctx.strokeStyle = 'rgba(200,160,60,0.30)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.02); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f5e8c0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Sax Club Corner', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '66'; ctx.lineWidth = Math.max(1, w * 0.013);
  const len = w * (0.28 + Math.sin(t * 0.55) * 0.09);
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

const meta = { id: 'intro-021-sax-club-corner', name: 'Sax Club Corner', ratio: '16x9', accentColor: '#c8a03c' };
module.exports = { draw, drawVisSlot, meta };
