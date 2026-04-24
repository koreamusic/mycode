function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
    flowSummary: getFlowSummary(preset)
  };
}

export function renderSelectedPresetPreview(kind, preset) {
  const target = document.getElementById(getPreviewTargetId(kind));
  if (!target || !preset) return;

  const meta = getPresetMeta(preset);
  target.classList.add('has-preset-preview');
  target.innerHTML = [
    '<div class="preset-preview-inner">',
    '  <div class="preset-preview-frame">',
    '    <div class="preset-preview-kicker">SELECTED INTRO PRESET</div>',
    '    <h2>' + escapeHtml(meta.title) + '</h2>',
    '    <p>' + escapeHtml(meta.mood) + '</p>',
    '    <small>' + escapeHtml(meta.description) + '</small>',
    '    <div class="preset-preview-cta">LIKE · SUBSCRIBE · NOTIFICATION</div>',
    '  </div>',
    '  <div class="preset-preview-bottom">',
    '    <span>' + escapeHtml(meta.flowSummary || '프레임 10초 · 제목 5초 · CTA 5초 · 하단바 유지') + '</span>',
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
