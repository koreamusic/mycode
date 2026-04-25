const path = require('path');
const { ensureDir } = require('./paths');

const INTRO_PREVIEW_DURATION_SECONDS = 12;

function getRenderOutputPaths(rootDir, job) {
  const jobId = job && job.id ? job.id : 'unknown-render-job';
  const relativeOutputDir = path.join('output', 'renders', jobId);
  const relativeTempDir = path.join('temp', 'renders', jobId);
  const relativeLogFile = path.join('logs', 'renders', jobId + '.log');
  const relativePrimaryFile = path.join(relativeOutputDir, 'intro-preview.mp4');
  const relativeManifestFile = path.join(relativeOutputDir, 'intro-preview-manifest.json');

  return {
    jobId,
    outputDir: path.join(rootDir, relativeOutputDir),
    tempDir: path.join(rootDir, relativeTempDir),
    logFile: path.join(rootDir, relativeLogFile),
    primaryFile: path.join(rootDir, relativePrimaryFile),
    manifestFile: path.join(rootDir, relativeManifestFile),
    relative: {
      outputDir: relativeOutputDir.replace(/\\/g, '/'),
      tempDir: relativeTempDir.replace(/\\/g, '/'),
      logFile: relativeLogFile.replace(/\\/g, '/'),
      primaryFile: relativePrimaryFile.replace(/\\/g, '/'),
      manifestFile: relativeManifestFile.replace(/\\/g, '/')
    }
  };
}

function ensureRenderOutputDirs(rootDir, job) {
  const paths = getRenderOutputPaths(rootDir, job);
  ensureDir(paths.outputDir);
  ensureDir(paths.tempDir);
  ensureDir(path.dirname(paths.logFile));
  return paths;
}

function createRenderResultPayload(rootDir, job) {
  const paths = getRenderOutputPaths(rootDir, job);
  return {
    outputDir: paths.relative.outputDir,
    primaryFile: paths.relative.primaryFile,
    manifestFile: paths.relative.manifestFile,
    logFile: paths.relative.logFile,
    durationSeconds: INTRO_PREVIEW_DURATION_SECONDS,
    format: 'mp4',
    createdAt: new Date().toISOString()
  };
}

function createRenderErrorPayload(rootDir, job, message, code = 'RENDER_FAILED') {
  const paths = getRenderOutputPaths(rootDir, job);
  return {
    message: message || 'Render failed',
    code,
    logFile: paths.relative.logFile,
    failedAt: new Date().toISOString()
  };
}

module.exports = {
  INTRO_PREVIEW_DURATION_SECONDS,
  getRenderOutputPaths,
  ensureRenderOutputDirs,
  createRenderResultPayload,
  createRenderErrorPayload
};
