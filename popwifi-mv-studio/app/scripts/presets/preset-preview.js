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
  frameExit: 'reverse-warm-fade',
  title: 'soft-rise',
  cta: 'soft-pop',
  bottomBar: 'soft-rise',
  end: 'glow-pulse',
  cadence: 'standard'
};

const MOTION_TOKENS = {
  frameExit: new Set(['reverse-fade-slide', 'reverse-card-fold', 'reverse-neon-scan', 'reverse-film-fade', 'reverse-grid-slide', 'reverse-smoke-dissolve', 'reverse-cloud-wipe', 'reverse-tape-rewind', 'reverse-warm-fade', 'none']),
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
  if (source.includes('acoustic') || source.includes('folk') || source.includes('guitar') || source.includes('country')) return 'acoustic';
  if (source.includes('spring') || source.includes('flower') || source.includes('picnic')) return 'spring';
  if (source.includes('k-pop') || source.includes('kpop') || source.includes('stage') || source.includes('pulse')) return 'kpop';
  if (source.includes('ballad') || source.includes('memory') || source.includes('moon')) return 'ballad';
  if (source.includes('city') || source.includes('harbor')) return 'citypop';
  if (source.includes('retro') || source.includes('tv') || source.includes('cassette')) return 'retro';
  if (source.includes('blues') || source.includes('smoke') || source.includes('rust')) return 'blues';
  if (source.includes('anime') || source.includes('school') || source.includes('sky')) return 'anime';
  if (source.includes('chillwave') || source.includes('dream') || source.includes('cosmic') || source.includes('dawn')) return 'chillwave';
  if (source.includes('cafe') || source.includes('coffee') || source.includes('smooth jazz')) return 'cafe';
  if (source.includes('cinematic') || source.includes('cinema')) return 'cinematic';
  if (source.includes('minimal')) return 'minimal';
  if (source.includes('night') || source.includes('subway') || source.includes('drive')) return 'night';
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

function textOf(...values) {
  return values.filter(Boolean).join(' ').toLowerCase();
}

function inferFrameExitToken(value, preset, variant) {
  const source = textOf(value, preset && preset.id, preset && preset.title, preset && preset.mood, variant);

  if (source.includes('none')) return 'none';
  if (source.includes('neon') || source.includes('stage') || source.includes('glass') || source.includes('subway') || source.includes('light-streak') || source.includes('road-light')) return 'reverse-neon-scan';
  if (source.includes('grid') || source.includes('city') || source.includes('harbor') || source.includes('star') || source.includes('cosmic') || source.includes('purple') || source.includes('dawn')) return 'reverse-grid-slide';
  if (source.includes('tape') || source.includes('cassette') || source.includes('vinyl') || source.includes('tv')) return 'reverse-tape-rewind';
  if (source.includes('paper') || source.includes('book') || source.includes('page') || source.includes('card') || source.includes('folk')) return 'reverse-card-fold';
  if (source.includes('photo') || source.includes('film') || source.includes('cinema') || source.includes('rain') || source.includes('moon') || source.includes('minimal') || source.includes('line') || source.includes('dust-light')) return 'reverse-film-fade';
  if (source.includes('smoke') || source.includes('blues') || source.includes('rust') || source.includes('road-dust') || source.includes('country-dust')) return 'reverse-smoke-dissolve';
  if (source.includes('cloud') || source.includes('sky') || source.includes('anime') || source.includes('spring') || source.includes('petal') || source.includes('picnic') || source.includes('breeze') || source.includes('school')) return 'reverse-cloud-wipe';
  if (source.includes('warm') || source.includes('cafe') || source.includes('coffee') || source.includes('candle') || source.includes('gold') || source.includes('lamp') || source.includes('velvet') || source.includes('silk')) return 'reverse-warm-fade';
  if (source.includes('fade') && source.includes('slide')) return 'reverse-fade-slide';
  return MOTION_DEFAULTS.frameExit;
}

function inferTitleToken(value, preset, variant) {
  const source = textOf(value, preset && preset.id, preset && preset.title, preset && preset.mood, variant);
  if (source.includes('none')) return 'none';
  if (source.includes('neon') || source.includes('kpop') || source.includes('stage') || source.includes('pulse')) return 'neon-pop';
  if (source.includes('film') || source.includes('photo') || source.includes('ballad') || source.includes('cinema') || source.includes('rain') || source.includes('moon')) return 'film-fade';
  if (source.includes('anime') || source.includes('cloud') || source.includes('sky') || source.includes('breeze') || source.includes('spring')) return 'cloud-drift';
  if (source.includes('tape') || source.includes('cassette') || source.includes('synth') || source.includes('chillwave') || source.includes('cosmic')) return 'type-glow';
  if (source.includes('city') || source.includes('night') || source.includes('drive') || source.includes('subway')) return 'slide-left';
  if (source.includes('lofi') || source.includes('rnb') || source.includes('silk') || source.includes('velvet')) return 'gentle-breathe';
  return 'fade-up';
}

function inferCtaToken(value, preset, variant) {
  const source = textOf(value, preset && preset.id, preset && preset.title, preset && preset.mood, variant);
  if (source.includes('none')) return 'none';
  if (source.includes('neon')) return 'neon-pulse';
  if (source.includes('synth') || source.includes('chillwave') || source.includes('cosmic') || source.includes('purple')) return 'synth-glow';
  if (source.includes('sticker') || source.includes('anime') || source.includes('spring') || source.includes('picnic') || source.includes('pastel')) return 'sticker-pop';
  if (source.includes('stamp') || source.includes('paper') || source.includes('cafe') || source.includes('coffee') || source.includes('country') || source.includes('folk')) return 'stamp-in';
  if (source.includes('retro') || source.includes('tv') || source.includes('cassette') || source.includes('arcade')) return 'arcade-blink';
  if (source.includes('floating') || source.includes('soft') || source.includes('lofi')) return 'float-pop';
  return 'badge-pulse';
}

function inferBottomBarToken(value, preset, variant) {
  const source = textOf(value, preset && preset.id, preset && preset.title, preset && preset.mood, variant);
  if (source.includes('none')) return 'none';
  if (source.includes('neon') || source.includes('cyan') || source.includes('pink') || source.includes('stage') || source.includes('subway')) return 'neon-rise';
  if (source.includes('glass') || source.includes('transparent') || source.includes('translucent')) return 'glass-slide';
  if (source.includes('lyric') || source.includes('floating') || source.includes('cloud') || source.includes('anime')) return 'lyric-float';
  if (source.includes('warm') || source.includes('coffee') || source.includes('cafe') || source.includes('sepia') || source.includes('candle') || source.includes('gold') || source.includes('paper')) return 'warm-fade';
  return MOTION_DEFAULTS.bottomBar;
}

function inferEndToken(value, preset, variant) {
  const source = textOf(value, preset && preset.id, preset && preset.title, preset && preset.mood, variant);
  if (source.includes('none')) return 'none';
  if (source.includes('vinyl') || source.includes('record') || source.includes('needle')) return 'vinyl-spin';
  if (source.includes('leaf') || source.includes('petal') || source.includes('wheat') || source.includes('dust') || source.includes('drift')) return 'falling-leaf';
  if (source.includes('equalizer') || source.includes('pulse') || source.includes('road-line') || source.includes('subway') || source.includes('light streak')) return 'equalizer-pulse';
  if (source.includes('piano') || source.includes('sax') || source.includes('note') || source.includes('shimmer') || source.includes('sparkle')) return 'piano-shimmer';
  if (source.includes('palm') || source.includes('blink') || source.includes('neon')) return 'palm-blink';
  if (source.includes('harmonica') || source.includes('wave') || source.includes('silk') || source.includes('velvet') || source.includes('guitar') || source.includes('string') || source.includes('line')) return 'harmonica-wave';
  if (source.includes('paper') || source.includes('airplane') || source.includes('plane') || source.includes('umbrella') || source.includes('page') || source.includes('cloud')) return 'paper-airplane';
  if (source.includes('cassette') || source.includes('tape') || source.includes('wheel') || source.includes('click')) return 'cassette-spin';
  if (source.includes('coffee') || source.includes('steam') || source.includes('rain') || source.includes('raindrop') || source.includes('ripple')) return 'coffee-steam';
  return MOTION_DEFAULTS.end;
}

function inferCadenceToken(preset, variant) {
  const source = textOf(preset && preset.id, preset && preset.title, preset && preset.mood, variant);
  if (source.includes('cinema') || source.includes('ballad') || source.includes('blues') || source.includes('moon')) return 'cinematic';
  if (source.includes('kpop') || source.includes('pop') || source.includes('neon') || source.includes('stage')) return 'snappy';
  if (source.includes('lofi') || source.includes('minimal') || source.includes('cafe') || source.includes('rnb')) return 'slow';
  return 'standard';
}

function getMotionToken(group, value, fallback, preset, variant) {
  const token = normalizeMotionToken(value);
  if (MOTION_TOKENS[group] && MOTION_TOKENS[group].has(token)) return token;
  if (group === 'frameExit') return inferFrameExitToken(value, preset, variant);
  if (group === 'title') return inferTitleToken(value, preset, variant);
  if (group === 'cta') return inferCtaToken(value, preset, variant);
  if (group === 'bottomBar') return inferBottomBarToken(value, preset, variant);
  if (group === 'end') return inferEndToken(value, preset, variant);
  return fallback;
}

function getPresetMotion(preset, variant) {
  const motion = preset.motion || {};
  const flow = preset.flow || {};
  const cta = preset.cta || {};
  const bottomBar = preset.bottomBar || {};

  return {
    frameExit: getMotionToken('frameExit', motion.frameExit || motion.frame || flow.frameExit, MOTION_DEFAULTS.frameExit, preset, variant),
    title: getMotionToken('title', motion.title || motion.titleReveal || preset.title, MOTION_DEFAULTS.title, preset, variant),
    cta: getMotionToken('cta', motion.cta || cta.motion || cta.style, MOTION_DEFAULTS.cta, preset, variant),
    bottomBar: getMotionToken('bottomBar', motion.bottomBar || bottomBar.motion || bottomBar.style, MOTION_DEFAULTS.bottomBar, preset, variant),
    end: getMotionToken('end', motion.end || motion.endAnimation || bottomBar.endAnimation, MOTION_DEFAULTS.end, preset, variant),
    cadence: getMotionToken('cadence', motion.cadence || motion.speed || inferCadenceToken(preset, variant), MOTION_DEFAULTS.cadence, preset, variant)
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
  const variant = getPresetVariant(preset);
  const motion = getPresetMotion(preset, variant);

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
    variant,
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
