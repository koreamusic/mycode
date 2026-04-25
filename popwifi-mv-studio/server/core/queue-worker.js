const fs = require('fs');

function readQueue(queuePath) {
  return JSON.parse(fs.readFileSync(queuePath, 'utf8'));
}

function writeQueue(queuePath, queue) {
  const tmpPath = queuePath + '.tmp';
  fs.writeFileSync(tmpPath, JSON.stringify(queue, null, 2));
  fs.renameSync(tmpPath, queuePath);
  return queue;
}

function normalizeQueue(queue) {
  return Object.assign({ currentJob: null, pending: [], completed: [], failed: [] }, queue || {});
}

function startNextPendingJob(queuePath) {
  const queue = normalizeQueue(readQueue(queuePath));
  if (queue.currentJob) {
    return { ok: false, reason: 'job already running', queue };
  }
  if (!Array.isArray(queue.pending) || !queue.pending.length) {
    return { ok: false, reason: 'no pending jobs', queue };
  }

  const now = new Date().toISOString();
  const job = queue.pending.shift();
  job.status = 'running';
  job.startedAt = now;
  job.updatedAt = now;
  queue.currentJob = job;

  return { ok: true, job, queue: writeQueue(queuePath, queue) };
}

function completeCurrentJob(queuePath, result = {}) {
  const queue = normalizeQueue(readQueue(queuePath));
  if (!queue.currentJob) {
    return { ok: false, reason: 'no current job', queue };
  }

  const now = new Date().toISOString();
  const job = Object.assign({}, queue.currentJob, {
    status: 'completed',
    completedAt: now,
    updatedAt: now,
    result
  });

  queue.currentJob = null;
  if (!Array.isArray(queue.completed)) queue.completed = [];
  queue.completed.unshift(job);

  return { ok: true, job, queue: writeQueue(queuePath, queue) };
}

function failCurrentJob(queuePath, error = {}) {
  const queue = normalizeQueue(readQueue(queuePath));
  if (!queue.currentJob) {
    return { ok: false, reason: 'no current job', queue };
  }

  const now = new Date().toISOString();
  const job = Object.assign({}, queue.currentJob, {
    status: 'failed',
    failedAt: now,
    updatedAt: now,
    error
  });

  queue.currentJob = null;
  if (!Array.isArray(queue.failed)) queue.failed = [];
  queue.failed.unshift(job);

  return { ok: true, job, queue: writeQueue(queuePath, queue) };
}

module.exports = {
  normalizeQueue,
  startNextPendingJob,
  completeCurrentJob,
  failCurrentJob
};
