// Folk Paper Diary 16x9 — 손으로 쓴 일기, 포크 페이퍼
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawPaperFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#f5efe0'); grad.addColorStop(0.5, '#f0e8d8'); grad.addColorStop(1, '#ece0cc');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.04;
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = '#8b6040';
    ctx.fillRect(Math.sin(i * 77.3) * W * 0.5 + W * 0.5, Math.sin(i * 53.1) * H * 0.5 + H * 0.5, Math.random() * 1.5 + 0.5, Math.random() * 1.5 + 0.5);
  }
  ctx.restore();
}

function drawPaperFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.2);
  ctx.strokeStyle = 'rgba(100,70,40,' + (0.40 + p * 0.20) + ')';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  ctx.setLineDash([W * 0.012, W * 0.006]);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.02); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.0);
  ctx.fillStyle = '#3a2818'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.song?.title || 'Folk Paper Diary', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cW = W * 0.44; const cH = H * 0.11; const x = (W - cW) / 2; const y = H * 0.43;
  ctx.fillStyle = 'rgba(100,70,40,0.12)'; ctx.strokeStyle = 'rgba(100,70,40,0.45)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  ctx.setLineDash([W * 0.010, W * 0.005]);
  roundRect(ctx, x, y, cW, cH, H * 0.03); ctx.fill(); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#3a2818'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText('좋아요 · 구독 · 알림', W / 2, y + cH * 0.56);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(58,40,24,0.80)'; ctx.strokeStyle = 'rgba(100,70,40,0.35)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.025); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f5efe0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Folk Paper Diary', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '55'; ctx.lineWidth = Math.max(1, w * 0.011);
  ctx.setLineDash([w * 0.06, w * 0.03]);
  ctx.beginPath(); ctx.moveTo(x + w * 0.10, y + h * 0.5); ctx.lineTo(x + w * 0.90, y + h * 0.5); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'intro-019-folk-paper-diary', name: 'Folk Paper Diary', ratio: '16x9', accentColor: '#644628' };
module.exports = { draw, drawVisSlot, meta };
