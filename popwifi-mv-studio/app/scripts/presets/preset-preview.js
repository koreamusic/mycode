function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const ALLOWED_PRESET_VARIANTS = new Set([
  'jazz',
  'lofi',
  'acoustic',
  'kpop',
  'ballad',
  'citypop',
  'blues',
  'anime',
  'chillwave',
  'cafe',
  'cinematic',
  'retro',
  'minimal',
  'spring',
  'night'
]);

function getPreviewTargetId(kind) {
  if (kind === 'shorts') return 'shortsPreview';
  return 'longformPreview';
}

function getFlowSummary(preset) {
  const flow = preset.flow || {};
  return [
    flow.frameSeconds ? '프레임 ' + flow.frameSeconds + '초' : null,
    flow.titleSeconds ? '제목 ' + flow.titleSeconds + '초' : null,
    flow.ctaSeconds ? 'CTA ' + flow.ctaSeconds + '초' : null,
    flow.bottomBarStartsAfterSeconds ? '하단바 ' + flow.bottomBarStartsAfterSeconds + '초 이후' : null
  ].filter(Boolean).join(' · ');
}

function getPresetVariant(preset) {
  if (preset.variant && ALLOWED_PRESET_VARIANTS.has(preset.variant)) return preset.variant;

  const source = [preset.id, preset.title, preset.mood, preset.category].filter(Boolean).join(' ').toLowerCase();
  if (source.includes('lofi')) return 'lofi';
  if (source.includes('acoustic')) return 'acoustic';
  if (source.includes('spring')) return 'spring';
  if (source.includes('k-pop') || source.includes('kpop') || source.includes('neon')) return 'kpop';
  if (source.includes('ballad') || source.includes('memory')) return 'ballad';
  if (source.includes('city')) return 'citypop';
  if (source.includes('retro')) return 'retro';
  if (source.includes('blues') || source.includes('smoke')) return 'blues';
  if (source.includes('anime') || source.includes('sky')) return 'anime';
  if (source.includes('chillwave') || source.includes('dream')) return 'chillwave';
  if (source.includes('cafe') || source.includes('smooth')) return 'cafe';
  if (source.includes('cinematic')) return 'cinematic';
  if (source.includes('minimal')) return 'minimal';
  if (source.includes('night')) return 'night';
  return 'jazz';
}

function getPresetMeta(preset) {
  const layout = preset.layout || {};
  const visual = preset.visual || {};
  const bottomBar = preset.bottomBar || {};
  const cta = preset.cta || {};

  return {
    title: preset.title || preset.name || preset.id,
    mood: preset.mood || preset.category || 'intro preset',
    description: preset.description || '프리셋 설명이 아직 없습니다.',
    frameStyle: layout.frameStyle || 'frame style not set',
    titlePosition: layout.titlePosition || 'center-middle',
    ctaStyle: cta.style || 'CTA style not set',
    bottomBarStyle: bottomBar.style || 'bottom bar style not set',
    endAnimation: bottomBar.endAnimation || 'end animation not set',
    palette: Array.isArray(visual.palette) ? visual.palette.join(' / ') : '',
    typography: visual.typography || '',
    variant: getPresetVariant(preset),
    flowSummary: getFlowSummary(preset)
  };
}

export function renderSelectedPresetPreview(kind, preset) {
  const target = document.getElementById(getPreviewTargetId(kind));
  if (!target || !preset) return;

  const meta = getPresetMeta(preset);
  target.classList.add('has-preset-preview');
  target.dataset.presetVariant = meta.variant;
  target.innerHTML = [
    '<div class="preset-preview-inner preset-timeline-shell">',
    '  <div class="preset-preview-frame">',
    '    <div class="preset-preview-stage preset-stage-title">',
    '      <div class="preset-preview-kicker">0–5s · TITLE</div>',
    '      <h2>' + escapeHtml(meta.title) + '</h2>',
    '      <p>' + escapeHtml(meta.mood) + '</p>',
    '      <small>' + escapeHtml(meta.description) + '</small>',
    '    </div>',
    '    <div class="preset-preview-stage preset-stage-cta">',
    '      <div class="preset-preview-kicker">5–10s · CTA</div>',
    '      <div class="preset-preview-cta">LIKE · SUBSCRIBE · NOTIFICATION</div>',
    '      <p>' + escapeHtml(meta.ctaStyle) + '</p>',
    '    </div>',
    '  </div>',
    '  <div class="preset-preview-bottom">',
    '    <span>10s+ · ' + escapeHtml(meta.flowSummary || '프레임 10초 · 제목 5초 · CTA 5초 · 하단바 유지') + '</span>',
    '  </div>',
    '  <dl class="preset-preview-meta">',
    '    <div><dt>Frame</dt><dd>' + escapeHtml(meta.frameStyle) + '</dd></div>',
    '    <div><dt>Title</dt><dd>' + escapeHtml(meta.titlePosition) + '</dd></div>',
    '    <div><dt>CTA</dt><dd>' + escapeHtml(meta.ctaStyle) + '</dd></div>',
    '    <div><dt>Bottom</dt><dd>' + escapeHtml(meta.bottomBarStyle) + '</dd></div>',
    '    <div><dt>Motion</dt><dd>' + escapeHtml(meta.endAnimation) + '</dd></div>',
    meta.palette ? '    <div><dt>Palette</dt><dd>' + escapeHtml(meta.palette) + '</dd></div>' : '',
    meta.typography ? '    <div><dt>Type</dt><dd>' + escapeHtml(meta.typography) + '</dd></div>' : '',
    '  </dl>',
    '</div>'
  ].join('');
}
