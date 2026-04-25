const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const jobId = process.argv[2];
const framesArg = process.argv[3];
const outputArg = process.argv[4];
const fps = Number(process.env.POPWIFI_CAPTURE_FPS || 6);

function fail(message) {
  console.error('[assemble-intro-frames] ' + message);
  process.exit(1);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function countFrames(framesDir) {
  return fs.readdirSync(framesDir).filter((name) => /^frame-\d{6}\.png$/.test(name)).length;
}

function main() {
  if (!jobId) {
    fail('Usage: node scripts/assemble-intro-frames.js <job-id> [frames-dir] [output-file]');
  }
  if (!Number.isFinite(fps) || fps <= 0) fail('POPWIFI_CAPTURE_FPS must be a positive number');

  const framesDir = path.resolve(process.cwd(), framesArg || path.join('temp', 'captures', jobId, 'frames'));
  const outputFile = path.resolve(process.cwd(), outputArg || path.join('output', 'captures', jobId, 'intro-preview.mp4'));
  const logFile = path.resolve(process.cwd(), path.join('logs', 'captures', jobId + '-assemble.log'));

  if (!fs.existsSync(framesDir)) fail('frames directory not found: ' + framesDir);
  const frameCount = countFrames(framesDir);
  if (!frameCount) fail('no frame-000001.png style frames found in: ' + framesDir);

  ensureDir(path.dirname(outputFile));
  ensureDir(path.dirname(logFile));

  const inputPattern = path.join(framesDir, 'frame-%06d.png');
  const ffmpegArgs = [
    '-y',
    '-framerate', String(fps),
    '-i', inputPattern,
    '-vf', 'format=yuv420p',
    '-movflags', '+faststart',
    outputFile
  ];

  const result = spawnSync('ffmpeg', ffmpegArgs, { encoding: 'utf8' });
  const logText = [
    'COMMAND ffmpeg ' + ffmpegArgs.join(' '),
    'FRAME_COUNT ' + frameCount,
    'FPS ' + fps,
    '',
    'STDOUT',
    result.stdout || '',
    '',
    'STDERR',
    result.stderr || ''
  ].join('\n');
  fs.writeFileSync(logFile, logText);

  if (result.status !== 0) {
    fail('FFmpeg assembly failed. See log: ' + logFile);
  }

  console.log('[assemble-intro-frames] frames=' + frameCount);
  console.log('[assemble-intro-frames] saved ' + outputFile);
  console.log('[assemble-intro-frames] log ' + logFile);
}

main();
