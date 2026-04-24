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
  deactivatePreset(ratio, presetId) {
    return writeJson('/api/presets/' + ratio + '/' + presetId + '/deactivate', {
      method: 'PATCH',
      body: JSON.stringify({})
    });
  },
  page(path) {
    return readText(path);
  }
};
