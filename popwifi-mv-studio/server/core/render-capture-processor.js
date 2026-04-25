const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  ensureRenderOutputDirs,
  createRenderResultPayload,
  createRenderErrorPayload,
  INTRO_PREVIEW_DURATION_SECONDS
} = require('./render-output');
const { createManifestPayload } = require('./render-processor');

const DEFAULT_CAPTURE_FPS = 6;

function frameName(index) {
  return 'frame-' + String(index).padStart(6, '0') + '.png';
}

function ensureFramesDir(paths) {
  const framesDir = path.join(paths.tempDir, 'frames');
  if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });
  return framesDir;
}

async function loadPlaywright() {
  try {
    return require('playwright');
  } catch (error) {
    throw new Error('Playwright is not installed. Run npm install && npm run install:browser');
  }
}

async function captureFrames(rootDir, job, paths, options = {}) {
  const fps = Number(options.fps || DEFAULT_CAPTURE_FPS);
  const durationSeconds = Number(options.durationSeconds || INTRO_PREVIEW_DURATION_SECONDS);
  const baseUrl = options.baseUrl || 'http://localhost:3100';
  const totalFrames = Math.ceil(fps * durationSeconds);
  const frameDelayMs = 1000 / fps;
  const framesDir = ensureFramesDir(paths);

  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    const url = baseUrl.replace(/\/$/, '') + '/app/capture/intro-preview.html?jobId=' + encodeURIComponent(job.id);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    for (let index = 1; index <= totalFrames; index += 1) {
      await page.screenshot({ path: path.join(framesDir, frameName(index)), fullPage: false });
      if (index < totalFrames) await page.waitForTimeout(frameDelayMs);
    }
  } finally {
    await browser.close();
  }

  return { framesDir, totalFrames, fps, durationSeconds };
}

function assembleFrames(paths, captureResult) {
  const inputPattern = path.join(captureResult.framesDir, 'frame-%06d.png');
  const ffmpegArgs = [
    '-y',
    '-framerate', String(captureResult.fps),
    '-i', inputPattern,
    '-vf', 'format=yuv420p',
    '-movflags', '+faststart',
    paths.primaryFile
  ];

  const result = spawnSync('ffmpeg', ffmpegArgs, { encoding: 'utf8' });
  const logText = [
    'COMMAND ffmpeg ' + ffmpegArgs.join(' '),
    'FRAME_COUNT ' + captureResult.totalFrames,
    'FPS ' + captureResult.fps,
    '',
    'STDOUT',
    result.stdout || '',
    '',
    'STDERR',
    result.stderr || ''
  ].join('\n');
  fs.writeFileSync(paths.logFile, logText);

  if (result.status !== 0) {
    throw new Error('FFmpeg frame assembly failed');
  }
}

async function processIntroPreviewCaptureMp4(rootDir, job, options = {}) {
  if (!job || job.type !== 'intro-preview-render') {
    return {
      ok: false,
      error: createRenderErrorPayload(rootDir, job, 'Unsupported job type', 'UNSUPPORTED_JOB_TYPE')
    };
  }

  try {
    const paths = ensureRenderOutputDirs(rootDir, job);
    const captureResult = await captureFrames(rootDir, job, paths, options);
    const manifest = Object.assign(createManifestPayload(job, paths, 'capture-mp4'), {
      capture: {
        fps: captureResult.fps,
        durationSeconds: captureResult.durationSeconds,
        totalFrames: captureResult.totalFrames,
        framesDir: path.relative(rootDir, captureResult.framesDir).replace(/\\/g, '/')
      },
      note: 'HTML/CSS preview captured with browser screenshots and assembled with FFmpeg.'
    });

    fs.writeFileSync(paths.manifestFile, JSON.stringify(manifest, null, 2));
    assembleFrames(paths, captureResult);

    return {
      ok: true,
      manifest,
      result: createRenderResultPayload(rootDir, job)
    };
  } catch (error) {
    return {
      ok: false,
      error: createRenderErrorPayload(rootDir, job, error.message, 'CAPTURE_MP4_FAILED')
    };
  }
}

module.exports = {
  DEFAULT_CAPTURE_FPS,
  processIntroPreviewCaptureMp4
};
