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

function getNextBatchId(batches) {
  if (!batches.length) return 'batch-001-010';
  const last = batches[batches.length - 1].id;
  const match = last.match(/^batch-(\d{3})-(\d{3})$/);
  if (!match) return 'batch-001-010';
  const nextStart = Number(match[2]) + 1;
  const nextEnd = nextStart + 9;
  return 'batch-' + String(nextStart).padStart(3, '0') + '-' + String(nextEnd).padStart(3, '0');
}

module.exports = {
  getPresetRoot,
  isBatchDir,
  getBatchRoot,
  getPresetDir,
  getPresetConfigPath,
  getNextBatchId
};
