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
  createQueueJobFromRenderDraft(kind) {
    return writeJson('/api/queue/from-render-draft/' + kind, {
      method: 'POST',
      body: JSON.stringify({})
    });
  },
  startNextQueueJob() {
    return writeJson('/api/queue/worker/start-next', {
      method: 'POST',
      body: JSON.stringify({})
    });
  },
  processCurrentQueueManifest() {
    return writeJson('/api/queue/worker/process-current-manifest', {
      method: 'POST',
      body: JSON.stringify({})
    });
  },
  processCurrentQueueDummyMp4() {
    return writeJson('/api/queue/worker/process-current-dummy-mp4', {
      method: 'POST',
      body: JSON.stringify({})
    });
  },
  processCurrentQueueCaptureMp4(options = {}) {
    return writeJson('/api/queue/worker/process-current-capture-mp4', {
      method: 'POST',
      body: JSON.stringify(options)
    });
  },
  completeCurrentQueueJob(result = {}) {
    return writeJson('/api/queue/worker/complete-current', {
      method: 'POST',
      body: JSON.stringify(result)
    });
  },
  failCurrentQueueJob(error = {}) {
    return writeJson('/api/queue/worker/fail-current', {
      method: 'POST',
      body: JSON.stringify(error)
    });
  },
  renderDraft() {
    return readJson('/api/render-draft');
  },
  saveRenderDraftPreset(kind, preset) {
    return writeJson('/api/render-draft/' + kind, {
      method: 'PUT',
      body: JSON.stringify(preset)
    });
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
  importPresetBatch(payload) {
    return writeJson('/api/presets/import', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  page(path) {
    return readText(path);
  }
};
