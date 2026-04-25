const fs = require('fs');
const {
  ensureRenderOutputDirs,
  createRenderResultPayload,
  createRenderErrorPayload,
  INTRO_PREVIEW_DURATION_SECONDS
} = require('./render-output');

function createManifestPayload(job, paths) {
  return {
    schemaVersion: 1,
    jobId: job.id,
    jobType: job.type,
    kind: job.kind,
    status: 'manifest-created',
    durationSeconds: INTRO_PREVIEW_DURATION_SECONDS,
    preset: job.preset || null,
    output: {
      outputDir: paths.relative.outputDir,
      tempDir: paths.relative.tempDir,
      manifestFile: paths.relative.manifestFile,
      primaryFile: paths.relative.primaryFile,
      logFile: paths.relative.logFile
    },
    createdAt: new Date().toISOString(),
    note: 'Manifest-only processor. FFmpeg is not executed in this step.'
  };
}

function processIntroPreviewManifestOnly(rootDir, job) {
  if (!job || job.type !== 'intro-preview-render') {
    return {
      ok: false,
      error: createRenderErrorPayload(rootDir, job, 'Unsupported job type', 'UNSUPPORTED_JOB_TYPE')
    };
  }

  try {
    const paths = ensureRenderOutputDirs(rootDir, job);
    const manifest = createManifestPayload(job, paths);
    fs.writeFileSync(paths.manifestFile, JSON.stringify(manifest, null, 2));

    return {
      ok: true,
      manifest,
      result: createRenderResultPayload(rootDir, job)
    };
  } catch (error) {
    return {
      ok: false,
      error: createRenderErrorPayload(rootDir, job, error.message, 'MANIFEST_PROCESSOR_FAILED')
    };
  }
}

module.exports = {
  createManifestPayload,
  processIntroPreviewManifestOnly
};
