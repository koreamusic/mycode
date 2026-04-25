const fs = require('fs');
const { spawnSync } = require('child_process');
const {
  ensureRenderOutputDirs,
  createRenderResultPayload,
  createRenderErrorPayload,
  INTRO_PREVIEW_DURATION_SECONDS
} = require('./render-output');

function createManifestPayload(job, paths, mode = 'manifest-only') {
  return {
    schemaVersion: 1,
    jobId: job.id,
    jobType: job.type,
    kind: job.kind,
    status: mode,
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
    note: mode === 'dummy-mp4' ? 'Dummy FFmpeg validation output. This is not final preset rendering.' : 'Manifest-only processor. FFmpeg is not executed in this step.'
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

function processIntroPreviewDummyMp4(rootDir, job) {
  if (!job || job.type !== 'intro-preview-render') {
    return {
      ok: false,
      error: createRenderErrorPayload(rootDir, job, 'Unsupported job type', 'UNSUPPORTED_JOB_TYPE')
    };
  }

  try {
    const paths = ensureRenderOutputDirs(rootDir, job);
    const manifest = createManifestPayload(job, paths, 'dummy-mp4');
    fs.writeFileSync(paths.manifestFile, JSON.stringify(manifest, null, 2));

    const ffmpegArgs = [
      '-y',
      '-f', 'lavfi',
      '-i', 'color=c=black:s=1920x1080:r=30',
      '-t', String(INTRO_PREVIEW_DURATION_SECONDS),
      '-vf', 'format=yuv420p',
      paths.primaryFile
    ];

    const result = spawnSync('ffmpeg', ffmpegArgs, { encoding: 'utf8' });
    const logText = [
      'COMMAND ffmpeg ' + ffmpegArgs.join(' '),
      '',
      'STDOUT',
      result.stdout || '',
      '',
      'STDERR',
      result.stderr || ''
    ].join('\n');
    fs.writeFileSync(paths.logFile, logText);

    if (result.status !== 0) {
      return {
        ok: false,
        error: createRenderErrorPayload(rootDir, job, 'FFmpeg dummy MP4 failed', 'DUMMY_FFMPEG_FAILED')
      };
    }

    return {
      ok: true,
      manifest,
      result: createRenderResultPayload(rootDir, job)
    };
  } catch (error) {
    return {
      ok: false,
      error: createRenderErrorPayload(rootDir, job, error.message, 'DUMMY_PROCESSOR_FAILED')
    };
  }
}

module.exports = {
  createManifestPayload,
  processIntroPreviewManifestOnly,
  processIntroPreviewDummyMp4
};
