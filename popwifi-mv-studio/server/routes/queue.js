const fs = require('fs');
const { readRenderDraft } = require('./render-draft');

function readQueue(queuePath) {
  return JSON.parse(fs.readFileSync(queuePath, 'utf8'));
}

function writeQueue(queuePath, queue) {
  const tmpPath = queuePath + '.tmp';
  fs.writeFileSync(tmpPath, JSON.stringify(queue, null, 2));
  fs.renameSync(tmpPath, queuePath);
  return queue;
}

function createRenderJobFromDraft(kind, draft) {
  const selected = draft && draft.selected ? draft.selected[kind] : null;
  if (!selected) return null;

  const now = new Date().toISOString();
  return {
    id: 'render-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
    type: 'intro-preview-render',
    kind,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    preset: {
      ratio: selected.ratio,
      batchId: selected.batchId,
      presetId: selected.presetId,
      title: selected.title,
      variant: selected.variant,
      flow: selected.flow,
      visual: selected.visual,
      layout: selected.layout,
      cta: selected.cta,
      bottomBar: selected.bottomBar
    },
    source: {
      renderDraftUpdatedAt: draft.updatedAt || null
    }
  };
}

function registerQueueRoutes(app, context) {
  app.get('/api/queue', (req, res) => {
    res.json(readQueue(context.queuePath));
  });

  app.post('/api/queue/from-render-draft/:kind', (req, res) => {
    const kind = req.params.kind;
    if (!['longform', 'shorts'].includes(kind)) {
      return res.status(400).json({ error: 'invalid render draft kind' });
    }

    const draft = readRenderDraft(context.rootDir);
    const job = createRenderJobFromDraft(kind, draft);
    if (!job) {
      return res.status(400).json({ error: 'selected render draft preset is required' });
    }

    const queue = readQueue(context.queuePath);
    if (!Array.isArray(queue.pending)) queue.pending = [];
    queue.pending.push(job);
    writeQueue(context.queuePath, queue);

    res.json({ ok: true, job, queue });
  });
}

module.exports = {
  registerQueueRoutes,
  readQueue,
  writeQueue,
  createRenderJobFromDraft
};
