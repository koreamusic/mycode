const fs = require('fs');
const path = require('path');

const jobId = process.argv[2];
const fps = Number(process.env.POPWIFI_CAPTURE_FPS || 6);
const durationSeconds = Number(process.env.POPWIFI_CAPTURE_DURATION || 12);
const baseUrl = process.env.POPWIFI_CAPTURE_BASE || 'http://localhost:3000';
const outArg = process.argv[3];

function fail(message) {
  console.error('[capture-intro-frame-sequence] ' + message);
  process.exit(1);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function loadPlaywright() {
  try {
    return require('playwright');
  } catch (error) {
    fail('Playwright is not installed. Run: npm install && npm run install:browser');
  }
}

function frameName(index) {
  return 'frame-' + String(index).padStart(6, '0') + '.png';
}

async function main() {
  if (!jobId) {
    fail('Usage: node scripts/capture-intro-frame-sequence.js <job-id> [output-dir]');
  }
  if (!Number.isFinite(fps) || fps <= 0) fail('POPWIFI_CAPTURE_FPS must be a positive number');
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) fail('POPWIFI_CAPTURE_DURATION must be a positive number');

  const outputDir = outArg || path.join('temp', 'captures', jobId, 'frames');
  const outputPath = path.resolve(process.cwd(), outputDir);
  ensureDir(outputPath);

  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({ headless: true });
  const totalFrames = Math.ceil(fps * durationSeconds);
  const frameDelayMs = 1000 / fps;

  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    const url = baseUrl.replace(/\/$/, '') + '/app/capture/intro-preview.html?jobId=' + encodeURIComponent(jobId);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    for (let index = 1; index <= totalFrames; index += 1) {
      const filePath = path.join(outputPath, frameName(index));
      await page.screenshot({ path: filePath, fullPage: false });
      if (index < totalFrames) await page.waitForTimeout(frameDelayMs);
      if (index === 1 || index === totalFrames || index % fps === 0) {
        console.log('[capture-intro-frame-sequence] frame ' + index + '/' + totalFrames);
      }
    }

    console.log('[capture-intro-frame-sequence] saved ' + totalFrames + ' frames to ' + outputDir);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  fail(error.message);
});
