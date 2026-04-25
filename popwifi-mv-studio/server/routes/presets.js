const {
  readBatches,
  createNextBatch,
  readPresetList,
  readPresetBatch,
  readPresetConfig,
  writePresetConfig,
  upsertPresetConfig,
  markPresetInactive
} = require('../core/preset-store');
const { materializeImportedPresetBatches } = require('../core/preset-import-materializer');
const fs = require('fs');
const path = require('path');

const VALID_RATIO = /^(16x9|9x16)$/;
const VALID_BATCH_ID = /^batch-\d{3}-\d{3}$/;
const VALID_PRESET_ID = /^[\w-]{1,64}$/;

function validateParams(res, { ratio, batchId, presetId }) {
  if (ratio !== undefined && !VALID_RATIO.test(ratio)) {
    res.status(400).json({ error: 'invalid ratio' });
    return false;
  }
  if (batchId !== undefined && !VALID_BATCH_ID.test(batchId)) {
    res.status(400).json({ error: 'invalid batchId' });
    return false;
  }
  if (presetId !== undefined && !VALID_PRESET_ID.test(presetId)) {
    res.status(400).json({ error: 'invalid presetId' });
    return false;
  }
  return true;
}

function registerPresetRoutes(app, context) {
  app.get('/api/presets/:ratio', (req, res) => {
    if (!validateParams(res, { ratio: req.params.ratio })) return;
    const includeInactive = req.query.includeInactive === '1';
    res.json(readPresetList(context.rootDir, req.params.ratio, { includeInactive }));
  });

  app.get('/api/presets/:ratio/batches', (req, res) => {
    if (!validateParams(res, { ratio: req.params.ratio })) return;
    res.json(readBatches(context.rootDir, req.params.ratio));
  });

  app.post('/api/presets/:ratio/batches/next', (req, res) => {
    if (!validateParams(res, { ratio: req.params.ratio })) return;
    res.json({ ok: true, batch: createNextBatch(context.rootDir, req.params.ratio) });
  });

  app.get('/api/presets/:ratio/batch/:batchId', (req, res) => {
    if (!validateParams(res, { ratio: req.params.ratio, batchId: req.params.batchId })) return;
    const includeInactive = req.query.includeInactive === '1';
    res.json(readPresetBatch(context.rootDir, req.params.ratio, req.params.batchId, { includeInactive }));
  });

  app.post('/api/presets/:ratio/batch/:batchId/:presetId', (req, res) => {
    if (!validateParams(res, { ratio: req.params.ratio, batchId: req.params.batchId, presetId: req.params.presetId })) return;
    const result = upsertPresetConfig(
      context.rootDir,
      req.params.ratio,
      req.params.batchId,
      req.params.presetId,
      req.body
    );
    if (!result.ok) return res.status(result.status || 400).json({ error: result.error });
    res.json({ ok: true, preset: result.preset });
  });

  app.patch('/api/presets/:ratio/batch/:batchId/:presetId', (req, res) => {
    if (!validateParams(res, { ratio: req.params.ratio, batchId: req.params.batchId, presetId: req.params.presetId })) return;
    const current = readPresetConfig(context.rootDir, req.params.ratio, req.params.batchId, req.params.presetId);
    if (!current) return res.status(404).json({ error: 'preset not found' });

    const result = upsertPresetConfig(
      context.rootDir,
      req.params.ratio,
      req.params.batchId,
      req.params.presetId,
      Object.assign({}, current, req.body)
    );
    if (!result.ok) return res.status(result.status || 400).json({ error: result.error });
    res.json({ ok: true, preset: result.preset });
  });

  app.get('/api/presets/:ratio/batch/:batchId/:presetId', (req, res) => {
    if (!validateParams(res, { ratio: req.params.ratio, batchId: req.params.batchId, presetId: req.params.presetId })) return;
    const preset = readPresetConfig(context.rootDir, req.params.ratio, req.params.batchId, req.params.presetId);
    if (!preset) return res.status(404).json({ error: 'preset not found' });
    res.json(preset);
  });

  app.patch('/api/presets/:ratio/batch/:batchId/:presetId/deactivate', (req, res) => {
    if (!validateParams(res, { ratio: req.params.ratio, batchId: req.params.batchId, presetId: req.params.presetId })) return;
    const preset = markPresetInactive(context.rootDir, req.params.ratio, req.params.batchId, req.params.presetId);
    if (!preset) return res.status(404).json({ error: 'preset not found' });
    res.json({ ok: true, preset });
  });

  app.post('/api/presets/import', (req, res) => {
    const payload = req.body;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return res.status(400).json({ error: 'JSON batch payload required' });
    }
    if (!VALID_RATIO.test(payload.ratio)) {
      return res.status(400).json({ error: 'invalid ratio' });
    }
    if (!VALID_BATCH_ID.test(payload.batchId)) {
      return res.status(400).json({ error: 'invalid batchId' });
    }
    if (!Array.isArray(payload.presets) || !payload.presets.length) {
      return res.status(400).json({ error: 'presets array required' });
    }

    const tmpName = 'ui-import-' + Date.now() + '.json';
    const tmpPath = path.join(context.rootDir, 'shared', 'presets', 'imports', tmpName);
    try {
      fs.mkdirSync(path.dirname(tmpPath), { recursive: true });
      fs.writeFileSync(tmpPath, JSON.stringify(payload, null, 2));
      const summary = materializeImportedPresetBatches(context.rootDir);
      res.json({ ok: true, summary });
    } catch (error) {
      res.status(500).json({ error: 'import failed: ' + error.message });
    }
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
  upsertPresetConfig,
  markPresetInactive,
  deactivatePreset: markPresetInactive
};
