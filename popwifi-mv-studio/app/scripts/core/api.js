async function readJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('API request error');
  }
  return response.json();
}

async function writeJson(url, options) {
  const response = await fetch(url, Object.assign({
    headers: { 'Content-Type': 'application/json' }
  }, options));
  if (!response.ok) {
    throw new Error('API write error');
  }
  return response.json();
}

async function readText(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Page request error');
  }
  return response.text();
}

export const api = {
  health() {
    return readJson('/api/health');
  },
  config() {
    return readJson('/api/config');
  },
  queue() {
    return readJson('/api/queue');
  },
  presets(ratio) {
    return readJson('/api/presets/' + ratio);
  },
  presetBatches(ratio) {
    return readJson('/api/presets/' + ratio + '/batches');
  },
  createNextPresetBatch(ratio) {
    return writeJson('/api/presets/' + ratio + '/batches/next', {
      method: 'POST',
      body: JSON.stringify({})
    });
  },
  presetBatch(ratio, batchId) {
    return readJson('/api/presets/' + ratio + '/batch/' + batchId);
  },
  deactivatePreset(ratio, batchId, presetId) {
    return writeJson('/api/presets/' + ratio + '/batch/' + batchId + '/' + presetId + '/deactivate', {
      method: 'PATCH',
      body: JSON.stringify({})
    });
  },
  page(path) {
    return readText(path);
  }
};
