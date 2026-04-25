const fs = require('fs');
const path = require('path');

function getRenderDraftPath(rootDir) {
  return path.join(rootDir, 'data', 'render-draft.json');
}

function getEmptyDraft() {
  return {
    selected: {
      longform: null,
      shorts: null
    },
    source: {
      title: '',
      artist: '',
      musicFile: '',
      coverImage: '',
      lyricsFile: ''
    },
    updatedAt: null
  };
}

function sanitizeSource(input) {
  if (!input || typeof input !== 'object') return null;
  return {
    title: String(input.title || '').slice(0, 200),
    artist: String(input.artist || '').slice(0, 200),
    musicFile: String(input.musicFile || '').slice(0, 1000),
    coverImage: String(input.coverImage || '').slice(0, 1000),
    lyricsFile: String(input.lyricsFile || '').slice(0, 1000)
  };
}

function readRenderDraft(rootDir) {
  const draftPath = getRenderDraftPath(rootDir);
  if (!fs.existsSync(draftPath)) return getEmptyDraft();

  try {
    return Object.assign(getEmptyDraft(), JSON.parse(fs.readFileSync(draftPath, 'utf8')));
  } catch (error) {
    return getEmptyDraft();
  }
}

function writeRenderDraft(rootDir, draft) {
  const draftPath = getRenderDraftPath(rootDir);
  const tmpPath = draftPath + '.tmp';
  fs.writeFileSync(tmpPath, JSON.stringify(draft, null, 2));
  fs.renameSync(tmpPath, draftPath);
  return draft;
}

function sanitizeSelectedPreset(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  return {
    kind: input.kind || null,
    ratio: input.ratio || null,
    batchId: input.batchId || null,
    presetId: input.presetId || input.id || null,
    title: input.title || input.name || input.id || null,
    variant: input.variant || null,
    flow: input.flow || null,
    visual: input.visual || null,
    layout: input.layout || null,
    cta: input.cta || null,
    bottomBar: input.bottomBar || null,
    sourcePreset: input
  };
}

function registerRenderDraftRoutes(app, context) {
  app.get('/api/render-draft', (req, res) => {
    res.json(readRenderDraft(context.rootDir));
  });

  // must be registered before /:kind to avoid param capture
  app.put('/api/render-draft/source', (req, res) => {
    const source = sanitizeSource(req.body);
    if (!source) {
      return res.status(400).json({ error: 'source object required' });
    }

    const draft = readRenderDraft(context.rootDir);
    draft.source = source;
    draft.updatedAt = new Date().toISOString();

    res.json({ ok: true, draft: writeRenderDraft(context.rootDir, draft) });
  });

  app.put('/api/render-draft/:kind', (req, res) => {
    const kind = req.params.kind;
    if (!['longform', 'shorts'].includes(kind)) {
      return res.status(400).json({ error: 'invalid render draft kind' });
    }

    const selectedPreset = sanitizeSelectedPreset(Object.assign({}, req.body, { kind }));
    if (!selectedPreset || !selectedPreset.presetId || !selectedPreset.ratio || !selectedPreset.batchId) {
      return res.status(400).json({ error: 'selected preset with ratio, batchId, and presetId is required' });
    }

    const draft = readRenderDraft(context.rootDir);
    draft.selected[kind] = selectedPreset;
    draft.updatedAt = new Date().toISOString();

    res.json({ ok: true, draft: writeRenderDraft(context.rootDir, draft) });
  });
}

module.exports = {
  registerRenderDraftRoutes,
  readRenderDraft,
  writeRenderDraft
};
