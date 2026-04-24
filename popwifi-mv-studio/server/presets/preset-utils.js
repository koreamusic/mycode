function normalizePresetId(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function buildTemplateStub(presetId, name, ratio, accentColor) {
  const safeName = String(name || presetId).replace(/'/g, "\\'");
  return [
    'function draw(ctx, frame, fps, data) {',
    '  const W = ctx.canvas.width;',
    '  const H = ctx.canvas.height;',
    "  ctx.fillStyle = '#050508';",
    '  ctx.fillRect(0, 0, W, H);',
    "  ctx.fillStyle = '" + accentColor + "';",
    "  ctx.textAlign = 'center';",
    "  ctx.textBaseline = 'middle';",
    "  ctx.font = Math.floor(W * 0.035) + 'px sans-serif';",
    "  ctx.fillText(data.song?.title || '" + safeName + "', W / 2, H / 2);",
    '}',
    '',
    "const meta = { id: '" + presetId + "', name: '" + safeName + "', ratio: '" + ratio + "', accentColor: '" + accentColor + "' };",
    '',
    'module.exports = { draw, meta };',
    ''
  ].join('\n');
}

module.exports = { normalizePresetId, buildTemplateStub };
