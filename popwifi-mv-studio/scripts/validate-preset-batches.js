const fs = require('fs');
const path = require('path');

const importDir = process.argv[2] || 'shared/presets/imports';
const root = path.resolve(process.cwd(), importDir);

const REQUIRED_FLOW = {
  frameSeconds: 10,
  titleSeconds: 5,
  ctaSeconds: 5,
  bottomBarStartsAfterSeconds: 10
};

const allowedVariants = new Set([
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

function fail(message) {
  console.error(`[preset-batch-validate] ${message}`);
  process.exitCode = 1;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`${filePath}: invalid JSON - ${error.message}`);
    return null;
  }
}

function isHexColor(value) {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
}

function validateFlow(filePath, preset) {
  if (!preset.flow || typeof preset.flow !== 'object' || Array.isArray(preset.flow)) {
    fail(`${filePath}: ${preset.id} missing flow object`);
    return;
  }
  Object.entries(REQUIRED_FLOW).forEach(([key, expected]) => {
    if (preset.flow[key] !== expected) {
      fail(`${filePath}: ${preset.id} flow.${key} must be ${expected}`);
    }
  });
}

function validateVisual(filePath, preset) {
  const visual = preset.visual || {};
  if (preset.variant && !allowedVariants.has(preset.variant)) {
    fail(`${filePath}: ${preset.id} invalid variant ${preset.variant}`);
  }
  if (visual.accent && !isHexColor(visual.accent)) {
    fail(`${filePath}: ${preset.id} visual.accent must be #RRGGBB`);
  }
  if (visual.accent2 && !isHexColor(visual.accent2)) {
    fail(`${filePath}: ${preset.id} visual.accent2 must be #RRGGBB`);
  }
}

function validateBatch(filePath, seenGlobalIds) {
  const payload = readJson(filePath);
  if (!payload) return;

  if (!payload.ratio || typeof payload.ratio !== 'string') {
    fail(`${filePath}: ratio is required`);
  }
  if (!/^batch-\d{3}-\d{3}$/.test(payload.batchId || '')) {
    fail(`${filePath}: batchId must match batch-001-010 format`);
  }
  if (!Array.isArray(payload.presets)) {
    fail(`${filePath}: presets must be an array`);
    return;
  }
  if (payload.presets.length < 1 || payload.presets.length > 10) {
    fail(`${filePath}: presets length must be 1..10`);
  }

  const seenLocalIds = new Set();
  payload.presets.forEach((preset, index) => {
    if (!preset || typeof preset !== 'object' || Array.isArray(preset)) {
      fail(`${filePath}: preset at index ${index} must be object`);
      return;
    }
    if (!preset.id || typeof preset.id !== 'string') {
      fail(`${filePath}: preset at index ${index} missing id`);
      return;
    }
    if (seenLocalIds.has(preset.id)) fail(`${filePath}: duplicate id in batch ${preset.id}`);
    if (seenGlobalIds.has(preset.id)) fail(`${filePath}: duplicate id across imports ${preset.id}`);
    seenLocalIds.add(preset.id);
    seenGlobalIds.add(preset.id);

    if (!preset.title) fail(`${filePath}: ${preset.id} missing title`);
    if (!preset.category) fail(`${filePath}: ${preset.id} missing category`);
    if (!preset.description) fail(`${filePath}: ${preset.id} missing description`);
    validateFlow(filePath, preset);
    validateVisual(filePath, preset);
  });
}

function main() {
  if (!fs.existsSync(root)) {
    fail(`import directory not found: ${root}`);
    return;
  }

  const files = fs.readdirSync(root)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => path.join(root, name));

  if (!files.length) {
    fail(`no JSON files found in ${root}`);
    return;
  }

  const seenGlobalIds = new Set();
  files.forEach((filePath) => validateBatch(filePath, seenGlobalIds));

  if (process.exitCode) {
    console.error('[preset-batch-validate] failed');
    process.exit(process.exitCode);
  }

  console.log(`[preset-batch-validate] ok files=${files.length} presets=${seenGlobalIds.size}`);
}

main();
