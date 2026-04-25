const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const presetRoot = path.join(rootDir, 'shared', 'presets', '16x9');
const cssPath = path.join(rootDir, 'app', 'styles', 'app.css');

const expectedBatches = [
  'batch-001-010',
  'batch-011-020',
  'batch-021-030',
  'batch-031-040',
  'batch-041-050'
];

const expectedIntroIds = Array.from({ length: 50 }, (_, index) => {
  const no = String(index + 1).padStart(3, '0');
  return `intro-${no}`;
});

const supportedMotionTokens = {
  frameExit: ['reverse-fade-slide', 'reverse-card-fold', 'reverse-neon-scan', 'reverse-film-fade', 'reverse-grid-slide', 'reverse-smoke-dissolve', 'reverse-cloud-wipe', 'reverse-tape-rewind', 'reverse-warm-fade', 'none'],
  title: ['soft-rise', 'fade-up', 'film-fade', 'neon-pop', 'gentle-breathe', 'slide-left', 'cloud-drift', 'type-glow', 'none'],
  cta: ['soft-pop', 'badge-pulse', 'neon-pulse', 'sticker-pop', 'stamp-in', 'arcade-blink', 'float-pop', 'synth-glow', 'none'],
  bottomBar: ['soft-rise', 'glass-slide', 'lyric-float', 'warm-fade', 'neon-rise', 'none'],
  end: ['glow-pulse', 'vinyl-spin', 'falling-leaf', 'equalizer-pulse', 'piano-shimmer', 'palm-blink', 'harmonica-wave', 'paper-airplane', 'cassette-spin', 'coffee-steam', 'none'],
  cadence: ['slow', 'standard', 'snappy', 'cinematic']
};

function fail(message) {
  console.error(`[intro-preset-health] FAIL: ${message}`);
  process.exitCode = 1;
}

function warn(message) {
  console.warn(`[intro-preset-health] WARN: ${message}`);
}

function ok(message) {
  console.log(`[intro-preset-health] OK: ${message}`);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`${filePath}: invalid JSON - ${error.message}`);
    return null;
  }
}

function getConfigFiles(batchId) {
  const batchRoot = path.join(presetRoot, batchId);
  if (!fs.existsSync(batchRoot)) {
    fail(`missing batch folder: ${batchId}`);
    return [];
  }

  return fs.readdirSync(batchRoot)
    .map((presetId) => path.join(batchRoot, presetId, 'config.json'))
    .filter((configPath) => fs.existsSync(configPath));
}

function validateFlow(configPath, preset) {
  const flow = preset.flow || {};
  if (preset.id && preset.id.startsWith('intro-')) {
    if (flow.frameSeconds !== 10) fail(`${configPath}: flow.frameSeconds must be 10`);
    if (flow.titleSeconds !== 5) fail(`${configPath}: flow.titleSeconds must be 5`);
    if (flow.ctaSeconds !== 5) fail(`${configPath}: flow.ctaSeconds must be 5`);
    if (flow.bottomBarStartsAfterSeconds !== 10) fail(`${configPath}: flow.bottomBarStartsAfterSeconds must be 10`);
  }
}

function validatePresetShape(configPath, preset) {
  if (!preset || typeof preset !== 'object' || Array.isArray(preset)) {
    fail(`${configPath}: config must be an object`);
    return;
  }

  if (!preset.id) fail(`${configPath}: missing id`);
  if (!preset.ratio) fail(`${configPath}: missing ratio`);
  if (!preset.batchId) fail(`${configPath}: missing batchId`);

  if (preset.id && preset.id.startsWith('intro-')) {
    if (!preset.title) fail(`${configPath}: intro preset missing title`);
    if (!preset.category) fail(`${configPath}: intro preset missing category`);
    if (!preset.description) fail(`${configPath}: intro preset missing description`);
    if (!preset.layout || !preset.layout.frameStyle) fail(`${configPath}: intro preset missing layout.frameStyle`);
    if (!preset.cta || !Array.isArray(preset.cta.items)) fail(`${configPath}: intro preset missing cta.items`);
    if (!preset.bottomBar || !preset.bottomBar.endAnimation) fail(`${configPath}: intro preset missing bottomBar.endAnimation`);
  }

  validateFlow(configPath, preset);
}

function checkCssMotionSelectors() {
  if (!fs.existsSync(cssPath)) {
    fail(`missing css file: ${cssPath}`);
    return;
  }

  const css = fs.readFileSync(cssPath, 'utf8');
  supportedMotionTokens.frameExit.forEach((token) => {
    if (token !== 'none' && !css.includes(`data-motion-frame-exit="${token}"`)) {
      fail(`missing CSS frame motion selector: ${token}`);
    }
  });
  supportedMotionTokens.title.forEach((token) => {
    if (token !== 'soft-rise' && token !== 'none' && !css.includes(`data-motion-title="${token}"`)) {
      fail(`missing CSS title motion selector: ${token}`);
    }
  });
  supportedMotionTokens.cta.forEach((token) => {
    if (token !== 'soft-pop' && token !== 'none' && !css.includes(`data-motion-cta="${token}"`)) {
      fail(`missing CSS CTA motion selector: ${token}`);
    }
  });
  supportedMotionTokens.bottomBar.forEach((token) => {
    if (token !== 'soft-rise' && token !== 'none' && !css.includes(`data-motion-bottom-bar="${token}"`)) {
      fail(`missing CSS bottom-bar motion selector: ${token}`);
    }
  });
  supportedMotionTokens.end.forEach((token) => {
    if (token !== 'glow-pulse' && token !== 'none' && !css.includes(`data-motion-end="${token}"`)) {
      fail(`missing CSS end-animation selector: ${token}`);
    }
  });
  supportedMotionTokens.cadence.forEach((token) => {
    if (token !== 'standard' && !css.includes(`data-motion-cadence="${token}"`)) {
      fail(`missing CSS cadence selector: ${token}`);
    }
  });
}

function main() {
  const seenIds = new Map();
  const introIds = new Set();
  let totalConfigs = 0;

  expectedBatches.forEach((batchId) => {
    const configFiles = getConfigFiles(batchId);
    totalConfigs += configFiles.length;

    const introCount = configFiles.filter((configPath) => path.basename(path.dirname(configPath)).startsWith('intro-')).length;
    if (introCount !== 10) fail(`${batchId}: expected 10 intro configs, found ${introCount}`);
    if (configFiles.length > 10) warn(`${batchId}: ${configFiles.length} configs found because preserved legacy/extra presets may exist`);

    configFiles.forEach((configPath) => {
      const preset = readJson(configPath);
      if (!preset) return;
      validatePresetShape(configPath, preset);

      if (seenIds.has(preset.id)) fail(`duplicate preset id: ${preset.id}`);
      seenIds.set(preset.id, configPath);
      if (preset.id && preset.id.startsWith('intro-')) introIds.add(preset.id.slice(0, 9));
    });
  });

  expectedIntroIds.forEach((introPrefix) => {
    if (!introIds.has(introPrefix)) fail(`missing intro preset prefix: ${introPrefix}`);
  });

  checkCssMotionSelectors();

  if (process.exitCode) {
    console.error('[intro-preset-health] completed with errors');
    process.exit(process.exitCode);
  }

  ok(`physical config files scanned=${totalConfigs}`);
  ok('intro-001 through intro-050 are physically materialized');
  ok('required flow fields match 10s frame / 5s title / 5s CTA / 10s bottom-bar start');
  ok('CSS motion selectors exist for supported motion tokens');
}

main();
