const fs = require('fs');
const path = require('path');

function readPresetList(rootDir, ratio) {
  const presetRoot = path.join(rootDir, 'shared', 'presets', ratio);
  if (!fs.existsSync(presetRoot)) return [];

  return fs.readdirSync(presetRoot)
    .map((name) => {
      const configPath = path.join(presetRoot, name, 'config.json');
      if (!fs.existsSync(configPath)) return null;
      try {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } catch (error) {
        return null;
      }
    })
    .filter(Boolean)
    .filter((preset) => preset.active !== false);
}

function registerPresetRoutes(app, context) {
  app.get('/api/presets/:ratio', (req, res) => {
    res.json(readPresetList(context.rootDir, req.params.ratio));
  });
}

module.exports = { registerPresetRoutes, readPresetList };
