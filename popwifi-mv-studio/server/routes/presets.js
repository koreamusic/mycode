const fs = require('fs');
const path = require('path');

function getPresetRoot(rootDir, ratio) {
  return path.join(rootDir, 'shared', 'presets', ratio);
}

function isBatchDir(name) {
  return /^batch-\d{3}-\d{3}$/.test(name);
}

function getBatchRoot(rootDir, ratio, batchId) {
  return path.join(getPresetRoot(rootDir, ratio), batchId);
}

function getPresetDir(rootDir, ratio, batchId, presetId) {
  return path.join(getBatchRoot(rootDir, ratio, batchId), presetId);
}

function getPresetConfigPath(rootDir, ratio, batchId, presetId) {
  return path.join(getPresetDir(rootDir, ratio, batchId, presetId), 'config.json');
}

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

function deactivatePreset(rootDir, ratio, batchId, presetId) {
  const current = readPresetConfig(rootDir, ratio, batchId, presetId);
  if (!current) return null;
  const nextConfig = Object.assign({}, current, { active: false, updatedAt: new Date().toISOString() });
  return writePresetConfig(rootDir, ratio, batchId, presetId, nextConfig);
}

function registerPresetRoutes(app, context) {
  app.get('/api/presets/:ratio', (req, res) => {
    const includeInactive = req.query.includeInactive === '1';
    res.json(readPresetList(context.rootDir, req.params.ratio, { includeInactive }));
  });

  app.get('/api/presets/:ratio/batches', (req, res) => {
    res.json(readBatches(context.rootDir, req.params.ratio));
  });

  app.get('/api/presets/:ratio/batch/:batchId', (req, res) => {
    const includeInactive = req.query.includeInactive === '1';
    res.json(readPresetBatch(context.rootDir, req.params.ratio, req.params.batchId, { includeInactive }));
  });

  app.get('/api/presets/:ratio/batch/:batchId/:presetId', (req, res) => {
    const preset = readPresetConfig(context.rootDir, req.params.ratio, req.params.batchId, req.params.presetId);
    if (!preset) return res.status(404).json({ error: 'preset not found' });
    res.json(preset);
  });

  app.patch('/api/presets/:ratio/batch/:batchId/:presetId/deactivate', (req, res) => {
    const preset = deactivatePreset(context.rootDir, req.params.ratio, req.params.batchId, req.params.presetId);
    if (!preset) return res.status(404).json({ error: 'preset not found' });
    res.json({ ok: true, preset });
  });
}

module.exports = {
  registerPresetRoutes,
  readBatches,
  readPresetList,
  readPresetBatch,
  readPresetConfig,
  writePresetConfig,
  deactivatePreset
};
