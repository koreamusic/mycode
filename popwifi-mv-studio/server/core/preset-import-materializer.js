const fs = require('fs');
const path = require('path');
const { getPresetConfigPath, getPresetDir } = require('./preset-utils');

function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return null;
  }
}

function isImportBatchFile(name) {
  return /^intro-batch-\d{3}-\d{3}\.json$/.test(name);
}

function normalizeImportedPreset(ratio, batchId, preset) {
  const now = new Date().toISOString();
  return Object.assign({}, preset, {
    id: preset.id,
    ratio,
    batchId,
    active: preset.active === false ? false : true,
    createdAt: preset.createdAt || now,
    updatedAt: preset.updatedAt || now
  });
}

function materializePreset(rootDir, ratio, batchId, preset) {
  if (!preset || typeof preset !== 'object' || !preset.id) {
    return { ok: false, reason: 'invalid-preset' };
  }

  const presetId = preset.id;
  const targetPath = getPresetConfigPath(rootDir, ratio, batchId, presetId);

  if (fs.existsSync(targetPath)) {
    return { ok: true, skipped: true, presetId, reason: 'already-exists' };
  }

  const presetDir = getPresetDir(rootDir, ratio, batchId, presetId);
  fs.mkdirSync(presetDir, { recursive: true });
  fs.writeFileSync(targetPath, JSON.stringify(normalizeImportedPreset(ratio, batchId, preset), null, 2));
  return { ok: true, created: true, presetId };
}

function materializeImportBatch(rootDir, filePath) {
  const payload = readJsonSafe(filePath);
  if (!payload || typeof payload !== 'object') {
    return { ok: false, filePath, created: 0, skipped: 0, reason: 'invalid-json' };
  }

  const ratio = payload.ratio;
  const batchId = payload.batchId;
  const presets = Array.isArray(payload.presets) ? payload.presets : [];

  if (!ratio || !batchId || !presets.length) {
    return { ok: false, filePath, created: 0, skipped: 0, reason: 'invalid-batch-shape' };
  }

  const result = presets.reduce((summary, preset) => {
    const item = materializePreset(rootDir, ratio, batchId, preset);
    if (item.created) summary.created += 1;
    if (item.skipped) summary.skipped += 1;
    if (!item.ok) summary.failed += 1;
    return summary;
  }, { ok: true, filePath, ratio, batchId, created: 0, skipped: 0, failed: 0 });

  return result;
}

function materializeImportedPresetBatches(rootDir) {
  const importsDir = path.join(rootDir, 'shared', 'presets', 'imports');
  if (!fs.existsSync(importsDir)) return { ok: true, created: 0, skipped: 0, failed: 0, batches: [] };

  const batches = fs.readdirSync(importsDir)
    .filter(isImportBatchFile)
    .sort()
    .map((name) => materializeImportBatch(rootDir, path.join(importsDir, name)));

  const summary = batches.reduce((acc, batch) => {
    acc.created += batch.created || 0;
    acc.skipped += batch.skipped || 0;
    acc.failed += batch.failed || 0;
    return acc;
  }, { ok: true, created: 0, skipped: 0, failed: 0, batches });

  return summary;
}

module.exports = {
  materializeImportedPresetBatches
};
