const {
  readBatches,
  createNextBatch,
  readPresetList,
  readPresetBatch,
  readPresetConfig,
  writePresetConfig,
  markPresetInactive
} = require('../core/preset-store');

function registerPresetRoutes(app, context) {
  app.get('/api/presets/:ratio', (req, res) => {
    const includeInactive = req.query.includeInactive === '1';
    res.json(readPresetList(context.rootDir, req.params.ratio, { includeInactive }));
  });

  app.get('/api/presets/:ratio/batches', (req, res) => {
    res.json(readBatches(context.rootDir, req.params.ratio));
  });

  app.post('/api/presets/:ratio/batches/next', (req, res) => {
    res.json({ ok: true, batch: createNextBatch(context.rootDir, req.params.ratio) });
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
    const preset = markPresetInactive(context.rootDir, req.params.ratio, req.params.batchId, req.params.presetId);
    if (!preset) return res.status(404).json({ error: 'preset not found' });
    res.json({ ok: true, preset });
  });
}

module.exports = {
  registerPresetRoutes,
  readBatches,
  createNextBatch,
  readPresetList,
  readPresetBatch,
  readPresetConfig,
  writePresetConfig,
  markPresetInactive,
  deactivatePreset: markPresetInactive
};
