const fs = require('fs');
const path = require('path');

function loadConfig(rootDir) {
  const configPath = path.join(rootDir, 'config.json');
  const defaultConfig = {
    ffmpegPath: 'ffmpeg',
    port: 3000,
    musicDir: 'music',
    outputDir: 'output',
    tempDir: 'temp',
    autoSleep: true,
    sleepDelay: 60,
    defaultFps: 30,
    renderQuality: 18,
    appMode: 'pc-first',
    mobileRole: 'review-only'
  };

  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }

  return Object.assign(defaultConfig, JSON.parse(fs.readFileSync(configPath, 'utf8')));
}

module.exports = { loadConfig };
