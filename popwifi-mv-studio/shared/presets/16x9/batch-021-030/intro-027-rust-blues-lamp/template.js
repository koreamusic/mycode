// Rust Blues Lamp 16x9 — 녹슨 낡은 램프, 딥 블루스
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width; const H = ctx.canvas.height;
  drawBackground(ctx, W, H, t);
  drawLampFrame(ctx, W, H, t);
  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data);
}

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#02040c'); grad.addColorStop(0.5, '#040614'); grad.addColorStop(1, '#020308');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const lamp = ctx.createRadialGradient(W * 0.22, H * 0.22, 0, W * 0.22, H * 0.22, H * 0.28);
  lamp.addColorStop(0, 'rgba(180,100,40,0.20)'); lamp.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = lamp; ctx.fillRect(0, 0, W, H);
}

function drawLampFrame(ctx, W, H, t) {
  ctx.save();
  const p = Math.min(1, t / 1.4);
  ctx.strokeStyle = 'rgba(60,90,180,' + (0.35 + p * 0.25) + ')';
  ctx.lineWidth = Math.max(1.5, W * 0.002);
  roundRect(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.68, H * 0.02); ctx.stroke();
  ctx.strokeStyle = 'rgba(160,80,30,' + (0.30 * p) + ')';
  ctx.lineWidth = Math.max(1, W * 0.0014);
  const slide = p * W * 0.70;
  ctx.beginPath(); ctx.moveTo(W * 0.08, H * 0.08); ctx.lineTo(W * 0.08 + slide, H * 0.08); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.2);
  ctx.fillStyle = '#c8d4e0'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.038) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.song?.title || 'Rust Blues Lamp', W * 0.12, H * 0.44);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  const cW = W * 0.44; const cH = H * 0.10; const x = W * 0.12; const y = H * 0.435;
  ctx.fillStyle = 'rgba(2,4,12,0.80)'; ctx.strokeStyle = 'rgba(60,90,180,0.45)';
  ctx.lineWidth = Math.max(1, W * 0.0016);
  roundRect(ctx, x, y, cW, cH, H * 0.02); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#c8d4e0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText('Like · Subscribe · Alarm', x + cW / 2, y + cH * 0.56);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data) {
  ctx.save();
  const bX = W * 0.08; const bY = H * 0.82; const bW = W * 0.84; const bH = H * 0.10;
  ctx.fillStyle = 'rgba(2,3,8,0.88)'; ctx.strokeStyle = 'rgba(60,90,180,0.28)';
  ctx.lineWidth = Math.max(1, W * 0.0015);
  roundRect(ctx, bX, bY, bW, bH, H * 0.02); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#c8d4e0'; ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.020) + "px 'Noto Serif KR', serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Rust Blues Lamp', W / 2, bY + bH * 0.58);
  ctx.restore();
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  ctx.save(); ctx.strokeStyle = accentColor + '66'; ctx.lineWidth = Math.max(1, w * 0.013);
  const len = w * (0.28 + Math.sin(t * 0.50) * 0.08);
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

const meta = { id: 'intro-027-rust-blues-lamp', name: 'Rust Blues Lamp', ratio: '16x9', accentColor: '#3c5ab4' };
module.exports = { draw, drawVisSlot, meta };
