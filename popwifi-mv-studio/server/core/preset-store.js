const fs = require('fs');
const {
  getPresetRoot,
  isBatchDir,
  getBatchRoot,
  getPresetDir,
  getPresetConfigPath,
  getNextBatchId
} = require('./preset-utils');

function readBatches(rootDir, ratio) {
  const presetRoot = getPresetRoot(rootDir, ratio);
  if (!fs.existsSync(presetRoot)) return [];

  return fs.readdirSync(presetRoot)
    .filter(isBatchDir)
    .sort()
    .map((batchId) => {
      const batchRoot = getBatchRoot(rootDir, ratio, batchId);
      const count = fs.readdirSync(batchRoot)
        .filter((presetId) => fs.existsSync(getPresetConfigPath(rootDir, ratio, batchId, presetId)))
        .length;
      return { id: batchId, ratio, count };
    });
}

function createNextBatch(rootDir, ratio) {
  const presetRoot = getPresetRoot(rootDir, ratio);
  if (!fs.existsSync(presetRoot)) fs.mkdirSync(presetRoot, { recursive: true });
  const batches = readBatches(rootDir, ratio);
  const nextBatchId = getNextBatchId(batches);
  const nextBatchRoot = getBatchRoot(rootDir, ratio, nextBatchId);
  if (!fs.existsSync(nextBatchRoot)) fs.mkdirSync(nextBatchRoot, { recursive: true });
  return { id: nextBatchId, ratio, count: 0 };
}

function readPresetConfig(rootDir, ratio, batchId, presetId) {
  const configPath = getPresetConfigPath(rootDir, ratio, batchId, presetId);
  if (!fs.existsSync(configPath)) return null;

  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return Object.assign({ id: presetId, ratio, batchId }, config);
  } catch (error) {
    return null;
  }
}

function readPresetBatch(rootDir, ratio, batchId, options = {}) {
  const batchRoot = getBatchRoot(rootDir, ratio, batchId);
  if (!fs.existsSync(batchRoot)) return [];

  return fs.readdirSync(batchRoot)
    .map((presetId) => readPresetConfig(rootDir, ratio, batchId, presetId))
    .filter(Boolean)
    .filter((preset) => options.includeInactive ? true : preset.active !== false)
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

function readPresetList(rootDir, ratio, options = {}) {
  const batches = readBatches(rootDir, ratio);
  return batches.flatMap((batch) => readPresetBatch(rootDir, ratio, batch.id, options));
}

function writePresetConfig(rootDir, ratio, batchId, presetId, nextConfig) {
  const presetDir = getPresetDir(rootDir, ratio, batchId, presetId);
  if (!fs.existsSync(presetDir)) fs.mkdirSync(presetDir, { recursive: true });
  const configPath = getPresetConfigPath(rootDir, ratio, batchId, presetId);
  fs.writeFileSync(configPath, JSON.stringify(nextConfig, null, 2));
  return nextConfig;
}

function normalizePresetConfig(rootDir, ratio, batchId, presetId, inputConfig) {
  const now = new Date().toISOString();
  const current = readPresetConfig(rootDir, ratio, batchId, presetId);
  return Object.assign({}, inputConfig, {
    id: presetId,
    ratio,
    batchId,
    active: inputConfig.active === false ? false : true,
    createdAt: current && current.createdAt ? current.createdAt : (inputConfig.createdAt || now),
    updatedAt: now
  });
}

function upsertPresetConfig(rootDir, ratio, batchId, presetId, inputConfig) {
  if (!presetId || typeof presetId !== 'string') {
    return { ok: false, status: 400, error: 'presetId is required' };
  }
  if (!inputConfig || typeof inputConfig !== 'object' || Array.isArray(inputConfig)) {
    return { ok: false, status: 400, error: 'preset config body is required' };
  }

  const nextConfig = normalizePresetConfig(rootDir, ratio, batchId, presetId, inputConfig);
  writePresetConfig(rootDir, ratio, batchId, presetId, nextConfig);
  return { ok: true, preset: nextConfig };
}

function markPresetInactive(rootDir, ratio, batchId, presetId) {
  const current = readPresetConfig(rootDir, ratio, batchId, presetId);
  if (!current) return null;
  const nextConfig = Object.assign({}, current, { active: false, updatedAt: new Date().toISOString() });
  return writePresetConfig(rootDir, ratio, batchId, presetId, nextConfig);
}

function markPresetActive(rootDir, ratio, batchId, presetId) {
  const current = readPresetConfig(rootDir, ratio, batchId, presetId);
  if (!current) return null;
  const nextConfig = Object.assign({}, current, { active: true, updatedAt: new Date().toISOString() });
  return writePresetConfig(rootDir, ratio, batchId, presetId, nextConfig);
}

function bulkSetBatchActive(rootDir, ratio, batchId, active) {
  const batch = readPresetBatch(rootDir, ratio, batchId, { includeInactive: true });
  if (!batch || !Array.isArray(batch.presets)) return { updated: 0 };
  let updated = 0;
  batch.presets.forEach((preset) => {
    const current = readPresetConfig(rootDir, ratio, batchId, preset.id);
    if (!current) return;
    writePresetConfig(rootDir, ratio, batchId, preset.id, Object.assign({}, current, { active, updatedAt: new Date().toISOString() }));
    updated++;
  });
  return { updated };
}

module.exports = {
  readBatches,
  createNextBatch,
  readPresetList,
  readPresetBatch,
  readPresetConfig,
  writePresetConfig,
  upsertPresetConfig,
  markPresetInactive,
  markPresetActive,
  bulkSetBatchActive
};
