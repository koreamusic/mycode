function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  drawBackground(ctx, W, H);
  drawFrame(ctx, W, H);

  if (t < 5) drawTitle(ctx, W, H, data, t);
  else if (t < 10) drawSocial(ctx, W, H, t);
  else drawBottomBar(ctx, W, H, data, t);
}

function drawBackground(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#11162a');
  grad.addColorStop(1, '#05070d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function drawFrame(ctx, W, H) {
  ctx.save();
  ctx.strokeStyle = 'rgba(184,198,255,0.72)';
  ctx.lineWidth = Math.max(2, W * 0.004);
  roundRect(ctx, W * 0.08, H * 0.06, W * 0.84, H * 0.82, W * 0.05);
  ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, W, H, data, t) {
  ctx.save();
  ctx.globalAlpha = Math.min(1, t / 0.8);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = Math.floor(W * 0.09) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.song?.title || 'Moon Dust Window', W / 2, H * 0.42);
  ctx.restore();
}

function drawSocial(ctx, W, H, t) {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  ctx.strokeStyle = 'rgba(184,198,255,0.35)';
  roundRect(ctx, W * 0.17, H * 0.42, W * 0.66, H * 0.16, W * 0.04);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.045) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText('좋아요 · 구독 · 알림', W / 2, H * 0.51);
  ctx.restore();
}

function drawBottomBar(ctx, W, H, data, t) {
  ctx.save();
  ctx.fillStyle = 'rgba(5,7,13,0.78)';
  roundRect(ctx, W * 0.06, H * 0.82, W * 0.88, H * 0.10, W * 0.035);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = Math.floor(W * 0.035) + "px 'Noto Sans KR', sans-serif";
  ctx.fillText(data.currentLyric?.text || data.song?.title || 'Moon Dust Window', W / 2, H * 0.875);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

const meta = {
  id: 'moon-dust-window',
  name: '문더스트 윈도우',
  ratio: '9x16',
  accentColor: '#B8C6FF'
};

module.exports = { draw, meta };
