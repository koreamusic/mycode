function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
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

const MOTION_DEFAULTS = {
  frameExit: 'reverse-soft-collapse',
  title: 'soft-rise',
  cta: 'soft-pop',
  bottomBar: 'soft-rise',
  end: 'glow-pulse',
  cadence: 'standard'
};

const MOTION_TOKENS = {
  frameExit: new Set(['reverse-soft-collapse', 'reverse-fade-slide', 'reverse-card-fold', 'reverse-neon-scan', 'reverse-film-fade', 'reverse-grid-slide', 'reverse-smoke-dissolve', 'reverse-cloud-wipe', 'reverse-tape-rewind', 'reverse-warm-fade', 'none']),
  title: new Set(['soft-rise', 'fade-up', 'film-fade', 'neon-pop', 'gentle-breathe', 'slide-left', 'cloud-drift', 'type-glow', 'none']),
  cta: new Set(['soft-pop', 'badge-pulse', 'neon-pulse', 'sticker-pop', 'stamp-in', 'arcade-blink', 'float-pop', 'synth-glow', 'none']),
  bottomBar: new Set(['soft-rise', 'glass-slide', 'lyric-float', 'warm-fade', 'neon-rise', 'none']),
  end: new Set(['glow-pulse', 'vinyl-spin', 'falling-leaf', 'equalizer-pulse', 'piano-shimmer', 'palm-blink', 'harmonica-wave', 'paper-airplane', 'cassette-spin', 'coffee-steam', 'none']),
  cadence: new Set(['slow', 'standard', 'snappy', 'cinematic'])
};

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

function normalizeMotionToken(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .split(' ')
    .join('-')
    .split('_')
    .join('-');
}

function inferFrameExitToken(value) {
  const source = String(value || '').toLowerCase();
  if (source.includes('fade') && source.includes('slide')) return 'reverse-fade-slide';
  if (source.includes('card') || source.includes('fold')) return 'reverse-card-fold';
  if (source.includes('neon') || source.includes('scan')) return 'reverse-neon-scan';
  if (source.includes('film')) return 'reverse-film-fade';
  if (source.includes('grid')) return 'reverse-grid-slide';
  if (source.includes('smoke')) return 'reverse-smoke-dissolve';
  if (source.includes('cloud')) return 'reverse-cloud-wipe';
  if (source.includes('tape') || source.includes('rewind')) return 'reverse-tape-rewind';
  if (source.includes('warm')) return 'reverse-warm-fade';
  return MOTION_DEFAULTS.frameExit;
}

function inferEndToken(value) {
  const source = String(value || '').toLowerCase();
  if (source.includes('vinyl')) return 'vinyl-spin';
  if (source.includes('leaf')) return 'falling-leaf';
  if (source.includes('equalizer')) return 'equalizer-pulse';
  if (source.includes('piano')) return 'piano-shimmer';
  if (source.includes('palm')) return 'palm-blink';
  if (source.includes('harmonica')) return 'harmonica-wave';
  if (source.includes('paper') || source.includes('airplane')) return 'paper-airplane';
  if (source.includes('cassette')) return 'cassette-spin';
  if (source.includes('coffee') || source.includes('steam')) return 'coffee-steam';
  return MOTION_DEFAULTS.end;
}

function getMotionToken(group, value, fallback) {
  const token = normalizeMotionToken(value);
  if (MOTION_TOKENS[group] && MOTION_TOKENS[group].has(token)) return token;
  if (group === 'frameExit') return inferFrameExitToken(value);
  if (group === 'end') return inferEndToken(value);
  return fallback;
}

function getPresetMotion(preset) {
  const motion = preset.motion || {};
  const flow = preset.flow || {};
  const cta = preset.cta || {};
  const bottomBar = preset.bottomBar || {};

  return {
    frameExit: getMotionToken('frameExit', motion.frameExit || motion.frame || flow.frameExit, MOTION_DEFAULTS.frameExit),
    title: getMotionToken('title', motion.title || motion.titleReveal, MOTION_DEFAULTS.title),
    cta: getMotionToken('cta', motion.cta || cta.motion, MOTION_DEFAULTS.cta),
    bottomBar: getMotionToken('bottomBar', motion.bottomBar || bottomBar.motion, MOTION_DEFAULTS.bottomBar),
    end: getMotionToken('end', motion.end || motion.endAnimation || bottomBar.endAnimation, MOTION_DEFAULTS.end),
    cadence: getMotionToken('cadence', motion.cadence || motion.speed, MOTION_DEFAULTS.cadence)
  };
}

function getMotionSummary(motion) {
  return [
    'frame:' + motion.frameExit,
    'title:' + motion.title,
    'cta:' + motion.cta,
    'bar:' + motion.bottomBar,
    'end:' + motion.end,
    'cadence:' + motion.cadence
  ].join(' · ');
}

function applyPresetMotion(target, motion) {
  if (!target || !motion) return;
  target.dataset.motionFrameExit = motion.frameExit;
  target.dataset.motionTitle = motion.title;
  target.dataset.motionCta = motion.cta;
  target.dataset.motionBottomBar = motion.bottomBar;
  target.dataset.motionEnd = motion.end;
  target.dataset.motionCadence = motion.cadence;
}

function isHexColor(value) {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
}

function hexToRgba(hex, alpha) {
  if (!isHexColor(hex)) return '';
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

function applyPresetTokens(target, meta) {
  if (!target || !meta) return;

  if (isHexColor(meta.accent)) {
    target.style.setProperty('--preview-accent', meta.accent);
    target.style.setProperty('--preview-bg-1', hexToRgba(meta.accent, 0.24));
    target.style.setProperty('--preview-frame-line', hexToRgba(meta.accent, 0.56));
  } else {
    target.style.removeProperty('--preview-accent');
    target.style.removeProperty('--preview-bg-1');
    target.style.removeProperty('--preview-frame-line');
  }

  if (isHexColor(meta.accent2)) {
    target.style.setProperty('--preview-accent-2', meta.accent2);
  } else {
    target.style.removeProperty('--preview-accent-2');
  }
}

function getPresetMeta(preset) {
  const layout = preset.layout || {};
  const visual = preset.visual || {};
  const bottomBar = preset.bottomBar || {};
  const cta = preset.cta || {};
  const motion = getPresetMotion(preset);

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
    accent: visual.accent || '',
    accent2: visual.accent2 || '',
    variant: getPresetVariant(preset),
    motion,
    motionSummary: getMotionSummary(motion),
    flowSummary: getFlowSummary(preset)
  };
}

export function renderSelectedPresetPreview(kind, preset) {
  const target = document.getElementById(getPreviewTargetId(kind));
  if (!target || !preset) return;

  const meta = getPresetMeta(preset);
  target.classList.add('has-preset-preview');
  target.dataset.presetVariant = meta.variant;
  applyPresetMotion(target, meta.motion);
  applyPresetTokens(target, meta);

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
    '    <div><dt>Motion</dt><dd>' + escapeHtml(meta.motionSummary) + '</dd></div>',
    meta.palette ? '    <div><dt>Palette</dt><dd>' + escapeHtml(meta.palette) + '</dd></div>' : '',
    meta.typography ? '    <div><dt>Type</dt><dd>' + escapeHtml(meta.typography) + '</dd></div>' : '',
    '  </dl>',
    '</div>'
  ].join('');
}
