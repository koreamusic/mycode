const fs = require('fs');
const path = require('path');

const EDITABLE_KEYS = new Set(['ffmpegPath', 'outputDir', 'musicDir', 'tempDir', 'autoSleep', 'sleepDelay', 'defaultFps', 'renderQuality']);

function registerConfigRoutes(app, context) {
  app.get('/api/config', (req, res) => {
    res.json(context.config);
  });

  app.patch('/api/config', (req, res) => {
    const updates = req.body;
    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      return res.status(400).json({ error: 'object body required' });
    }

    const applied = {};
    for (const [key, value] of Object.entries(updates)) {
      if (EDITABLE_KEYS.has(key)) {
        context.config[key] = value;
        applied[key] = value;
      }
    }

    try {
      const configPath = path.join(context.rootDir, 'config.json');
      fs.writeFileSync(configPath, JSON.stringify(context.config, null, 2));
      res.json({ ok: true, applied, config: context.config });
    } catch (error) {
      res.status(500).json({ error: 'failed to save config' });
    }
  });
}

module.exports = { registerConfigRoutes };
