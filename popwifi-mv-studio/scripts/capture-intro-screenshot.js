const fs = require('fs');
const path = require('path');

const jobId = process.argv[2];
const baseUrl = process.env.POPWIFI_CAPTURE_BASE || 'http://localhost:3000';
const outArg = process.argv[3];

function fail(message) {
  console.error('[capture-intro-screenshot] ' + message);
  process.exit(1);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function loadPlaywright() {
  try {
    return require('playwright');
  } catch (error) {
    fail('Playwright is not installed. Install it later with: npm install -D playwright && npx playwright install chromium');
  }
}

async function main() {
  if (!jobId) {
    fail('Usage: node scripts/capture-intro-screenshot.js <job-id> [output-file]');
  }

  const outputFile = outArg || path.join('temp', 'captures', jobId, 'intro-preview.png');
  const outputPath = path.resolve(process.cwd(), outputFile);
  ensureDir(path.dirname(outputPath));

  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    const url = baseUrl.replace(/\/$/, '') + '/app/capture/intro-preview.html?jobId=' + encodeURIComponent(jobId);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log('[capture-intro-screenshot] saved ' + outputFile);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  fail(error.message);
});
