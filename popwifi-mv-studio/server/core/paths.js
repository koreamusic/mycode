const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function ensureBaseDirs(rootDir) {
  [
    'data',
    'data/jobs',
    'data/lyrics',
    'logs',
    'music',
    'output',
    'temp',
    'assets',
    'assets/fonts',
    'shared',
    'shared/presets',
    'shared/presets/16x9',
    'shared/presets/9x16'
  ].forEach((dir) => ensureDir(path.join(rootDir, dir)));
}

function ensureQueueFile(rootDir) {
  const queuePath = path.join(rootDir, 'data', 'queue.json');
  if (!fs.existsSync(queuePath)) {
    fs.writeFileSync(queuePath, JSON.stringify({ currentJob: null, pending: [], completed: [], failed: [] }, null, 2));
  }
  return queuePath;
}

module.exports = { ensureDir, ensureBaseDirs, ensureQueueFile };
