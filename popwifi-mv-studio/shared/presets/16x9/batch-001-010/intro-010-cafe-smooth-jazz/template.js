// Cafe Smooth Jazz 16x9 — 따뜻한 카페, 커피 스팀 프레임
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawSteamFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#1a0e08'); grad.addColorStop(0.5, '#2a1a0e'); grad.addColorStop(1, '#120a04');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const warm = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, H * 0.38);
  warm.addColorStop(0, 'rgba(200,150,80,0.12)'); warm.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = warm; ctx.fillRect(0, 0, W, H);
}

function drawSteamFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.2);
  ctx.strokeStyle = 'rgba(200,150,80,' + (0.35 + p * 0.25) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.002);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.04); ctx.stroke();
  ctx.strokeStyle = 'rgba(200,150,80,' + (0.12 * p) + ')';
  ctx.lineWidth = Math.max(0.8, W * 0.001);
  roundRect(ctx, W * 0.10, H * 0.10, W * 0.80, H * 0.64, H * 0.035); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.0);
  ctx.fillStyle = '#f0e0c0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.song?.title || 'Cafe Smooth Jazz', W / 2, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const items = ['좋아요', '구독', '알림'];
  const chipW = W * 0.13; const chipH = H * 0.09; const gap = W * 0.022;
  const total = chipW * 3 + gap * 2; let sx = (W - total) / 2; const sy = H * 0.435;
  items.forEach((label) => {
    ctx.fillStyle = 'rgba(42,26,14,0.80)'; ctx.strokeStyle = 'rgba(200,150,80,0.60)';
    ctx.lineWidth = Math.max(1, W * 0.0016);
    roundRect(ctx, sx, sy, chipW, chipH, H * 0.04); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f0e0c0'; ctx.textAlign = 'center';
    ctx.font = Math.floor(W * 0.018) + "px 'Noto Sans KR', sans-serif";
    ctx.fillText(label, sx + chipW / 2, sy + chipH * 0.55);
    sx += chipW + gap;
  });
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(18,10,4,0.88)'; ctx.strokeStyle = 'rgba(200,150,80,0.30)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.03); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f0e0c0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Cafe Smooth Jazz', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '55'; ctx.lineWidth = Math.max(1, w * 0.012);
  const len = w * (0.28 + Math.sin(t * 0.7) * 0.07);
  ctx.beginPath(); ctx.moveTo(x + w * 0.12, y + h * 0.5); ctx.lineTo(x + w * 0.12 + len, y + h * 0.5); ctx.stroke();
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

const meta = { id: 'intro-010-cafe-smooth-jazz', name: 'Cafe Smooth Jazz', ratio: '16x9', accentColor: '#c89650' };
module.exports = { draw, drawVisSlot, meta };
