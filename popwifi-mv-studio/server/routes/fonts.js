const fs = require('fs');
const path = require('path');

function scanPresetFonts(rootDir) {
  const presetsRoot = path.join(rootDir, 'shared', 'presets');
  const fontUsage = {};

  if (!fs.existsSync(presetsRoot)) return fontUsage;

  const ratios = fs.readdirSync(presetsRoot).filter((d) => {
    return fs.statSync(path.join(presetsRoot, d)).isDirectory();
  });

  ratios.forEach((ratio) => {
    const ratioDir = path.join(presetsRoot, ratio);
    const batches = fs.readdirSync(ratioDir).filter((d) => {
      return fs.statSync(path.join(ratioDir, d)).isDirectory();
    });

    batches.forEach((batchOrPreset) => {
      const batchPath = path.join(ratioDir, batchOrPreset);
      const isBatch = /^batch-\d{3}-\d{3}$/.test(batchOrPreset);
      const presetDirs = isBatch
        ? fs.readdirSync(batchPath).map((p) => path.join(batchPath, p)).filter((p) => fs.statSync(p).isDirectory())
        : [batchPath];

      presetDirs.forEach((presetDir) => {
        const configPath = path.join(presetDir, 'config.json');
        if (!fs.existsSync(configPath)) return;
        try {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          if (config.fonts && typeof config.fonts === 'object') {
            Object.values(config.fonts).forEach((fontName) => {
              if (typeof fontName !== 'string' || !fontName.trim()) return;
              const key = fontName.trim();
              if (!fontUsage[key]) fontUsage[key] = { name: key, presets: [], googleFontsUrl: googleFontsUrl(key) };
              const presetLabel = ratio + '/' + config.id;
              if (!fontUsage[key].presets.includes(presetLabel)) fontUsage[key].presets.push(presetLabel);
            });
          }
        } catch (_) {}
      });
    });
  });

  return fontUsage;
}

function googleFontsUrl(fontName) {
  return 'https://fonts.google.com/specimen/' + encodeURIComponent(fontName.replace(/ /g, '+'));
}

function registerFontsRoutes(app, context) {
  app.get('/api/fonts', (req, res) => {
    const usage = scanPresetFonts(context.rootDir);
    const fonts = Object.values(usage).sort((a, b) => a.name.localeCompare(b.name));
    res.json({ fonts, total: fonts.length });
  });
}

module.exports = { registerFontsRoutes };
