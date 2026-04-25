const fs = require('fs');
const path = require('path');
const {
  getPresetRoot,
  isBatchDir,
  getBatchRoot,
  getPresetDir,
  getPresetConfigPath,
  getNextBatchId
} = require('./preset-utils');

function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return null;
  }
}

function getImportRoot(rootDir) {
  return path.join(rootDir, 'shared', 'presets', 'imports');
}

function isImportBatchFile(name) {
  return /^intro-batch-\d{3}-\d{3}\.json$/.test(name);
}

function normalizeImportedPreset(ratio, batchId, preset) {
  if (!preset || typeof preset !== 'object' || !preset.id) return null;
  return Object.assign({}, preset, {
    id: preset.id,
    ratio,
    batchId,
    active: preset.active === false ? false : true
  });
}

function readImportedBatchPayload(rootDir, ratio, batchId) {
  const importRoot = getImportRoot(rootDir);
  if (!fs.existsSync(importRoot)) return null;

  const filePath = path.join(importRoot, 'intro-' + batchId + '.json');
  const payload = fs.existsSync(filePath) ? readJsonSafe(filePath) : null;
  if (!payload || payload.ratio !== ratio || payload.batchId !== batchId) return null;
  if (!Array.isArray(payload.presets)) return null;
  return payload;
}

function readImportedPresetBatch(rootDir, ratio, batchId) {
  const payload = readImportedBatchPayload(rootDir, ratio, batchId);
  if (!payload) return [];

  return payload.presets
    .map((preset) => normalizeImportedPreset(ratio, batchId, preset))
    .filter(Boolean)
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

function readImportedPresetConfig(rootDir, ratio, batchId, presetId) {
  return readImportedPresetBatch(rootDir, ratio, batchId)
    .find((preset) => preset.id === presetId) || null;
}

function readImportedBatches(rootDir, ratio) {
  const importRoot = getImportRoot(rootDir);
  if (!fs.existsSync(importRoot)) return [];

  return fs.readdirSync(importRoot)
    .filter(isImportBatchFile)
    .sort()
    .map((name) => readJsonSafe(path.join(importRoot, name)))
    .filter((payload) => payload && payload.ratio === ratio && payload.batchId && Array.isArray(payload.presets))
    .map((payload) => ({
      id: payload.batchId,
      ratio,
      count: payload.presets.filter((preset) => preset && preset.active !== false).length,
      source: 'import'
    }));
}

function readBatches(rootDir, ratio) {
  const batchMap = new Map();
  const presetRoot = getPresetRoot(rootDir, ratio);

  if (fs.existsSync(presetRoot)) {
    fs.readdirSync(presetRoot)
      .filter(isBatchDir)
      .sort()
      .forEach((batchId) => {
        const batchRoot = getBatchRoot(rootDir, ratio, batchId);
        const count = fs.readdirSync(batchRoot)
          .filter((presetId) => fs.existsSync(getPresetConfigPath(rootDir, ratio, batchId, presetId)))
          .length;
        batchMap.set(batchId, { id: batchId, ratio, count, source: 'config' });
      });
  }

  readImportedBatches(rootDir, ratio).forEach((batch) => {
    const current = batchMap.get(batch.id);
    if (!current) {
      batchMap.set(batch.id, batch);
      return;
    }
    batchMap.set(batch.id, Object.assign({}, current, {
      count: Math.max(current.count || 0, batch.count || 0),
      source: current.source === 'config' ? 'config+import' : batch.source
    }));
  });

  return Array.from(batchMap.values()).sort((a, b) => String(a.id).localeCompare(String(b.id)));
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
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return Object.assign({ id: presetId, ratio, batchId }, config);
    } catch (error) {
      return null;
    }
  }

  return readImportedPresetConfig(rootDir, ratio, batchId, presetId);
}

function readPresetBatch(rootDir, ratio, batchId, options = {}) {
  const byId = new Map();

  readImportedPresetBatch(rootDir, ratio, batchId).forEach((preset) => {
    byId.set(preset.id, preset);
  });

  const batchRoot = getBatchRoot(rootDir, ratio, batchId);
  if (fs.existsSync(batchRoot)) {
    fs.readdirSync(batchRoot)
      .map((presetId) => readPresetConfig(rootDir, ratio, batchId, presetId))
      .filter(Boolean)
      .forEach((preset) => {
        byId.set(preset.id, preset);
      });
  }

  return Array.from(byId.values())
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

module.exports = {
  readBatches,
  createNextBatch,
  readPresetList,
  readPresetBatch,
  readPresetConfig,
  writePresetConfig,
  upsertPresetConfig,
  markPresetInactive
};
