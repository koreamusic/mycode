// Blues Smoke Signature 16x9 — 딥 블루스, 연기 잉크
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H);
  drawSmokeLines(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#050308'); grad.addColorStop(0.5, '#080514'); grad.addColorStop(1, '#030208');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
}

function drawSmokeLines(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.4);
  ctx.strokeStyle = 'rgba(80,100,180,' + (0.30 + p * 0.28) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.002);
  ctx.beginPath(); ctx.moveTo(W * 0.08, H * 0.10); ctx.lineTo(W * 0.92, H * 0.10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W * 0.08, H * 0.76); ctx.lineTo(W * 0.92, H * 0.76); ctx.stroke();
  ctx.strokeStyle = 'rgba(120,80,40,' + (0.35 * p) + ')'; ctx.lineWidth = Math.max(2, W * 0.003);
  const slide = p * W * 0.76;
  ctx.beginPath(); ctx.moveTo(W * 0.08, H * 0.10); ctx.lineTo(W * 0.08 + slide, H * 0.10); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.0);
  ctx.fillStyle = '#c8d8e8'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.040) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.song?.title || 'Blues Smoke Signature', W * 0.12, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cW = W * 0.44; const cH = H * 0.11; const x = W * 0.12; const y = H * 0.43;
  ctx.fillStyle = 'rgba(80,100,180,0.12)'; ctx.strokeStyle = 'rgba(80,100,180,0.45)';
  ctx.lineWidth = Math.max(1, W * 0.0016);
  roundRect(ctx, x, y, cW, cH, H * 0.04); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#c8d8e8'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText('Like · Subscribe · Alarm', x + cW / 2, y + cH * 0.56);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(3,2,8,0.85)'; ctx.strokeStyle = 'rgba(80,100,180,0.35)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.025); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#c8d8e8'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Blues Smoke Signature', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '66'; ctx.lineWidth = Math.max(1, w * 0.013);
  const len = w * (0.30 + Math.sin(t * 0.5) * 0.08);
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

const meta = { id: 'intro-007-blues-smoke-signature', name: 'Blues Smoke Signature', ratio: '16x9', accentColor: '#5064b4' };
module.exports = { draw, drawVisSlot, meta };
