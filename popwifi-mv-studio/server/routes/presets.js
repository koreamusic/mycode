const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');
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

function registerPresetRoutes(app, context) {
  app.get('/api/presets/:ratio/download', (req, res) => {
    const ratio = req.params.ratio;
    const presetsDir = path.join(context.rootDir, 'shared', 'presets', ratio);
    if (!fs.existsSync(presetsDir)) return res.status(404).json({ error: 'not found' });

    const tmpZip = path.join(os.tmpdir(), `presets-${ratio}-${Date.now()}.zip`);
    try {
      execSync(`zip -r "${tmpZip}" .`, { cwd: presetsDir });
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="presets-${ratio}.zip"`);
      const stream = fs.createReadStream(tmpZip);
      stream.pipe(res);
      stream.on('close', () => fs.unlink(tmpZip, () => {}));
    } catch (e) {
      fs.unlink(tmpZip, () => {});
      res.status(500).json({ error: e.message });
    }
  });

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

  app.post('/api/presets/:ratio/batch/:batchId/:presetId', (req, res) => {
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
  upsertPresetConfig,
  markPresetInactive,
  deactivatePreset: markPresetInactive
};
