const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const PRESETS_ROOT = path.join(__dirname, '..', 'shared', 'presets');
const FRAME_AT_SECONDS = 2;
const FPS = 30;

const VIEWPORT = {
  '16x9': { width: 640, height: 360 },
  '9x16': { width: 360, height: 640 }
};

function loadTemplate(templatePath) {
  try {
    delete require.cache[require.resolve(templatePath)];
    return require(templatePath);
  } catch (error) {
    return null;
  }
}

function loadConfig(configPath) {
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (error) {
    return null;
  }
}

function makeDummyData(config) {
  return {
    song: { title: config.name || config.title || config.id || 'Preview' },
    currentLyric: { text: config.name || config.title || config.id || 'Preview' },
    introPhase: 'title'
  };
}

function renderPreview(templatePath, config, ratio) {
  const tmpl = loadTemplate(templatePath);
  if (!tmpl || typeof tmpl.draw !== 'function') return null;

  const vp = VIEWPORT[ratio] || VIEWPORT['16x9'];
  const canvas = createCanvas(vp.width, vp.height);
  const ctx = canvas.getContext('2d');
  const data = makeDummyData(config);

  try {
    tmpl.draw(ctx, FRAME_AT_SECONDS * FPS, FPS, data);
  } catch (error) {
    console.error('  draw() 오류:', error.message);
    return null;
  }

  return canvas.toBuffer('image/jpeg', { quality: 0.88 });
}

function processPreset(presetDir, ratio) {
  const configPath = path.join(presetDir, 'config.json');
  const templatePath = path.join(presetDir, 'template.js');
  const previewPath = path.join(presetDir, 'preview.jpg');

  if (!fs.existsSync(configPath)) return 'no-config';
  if (!fs.existsSync(templatePath)) return 'no-template';

  const config = loadConfig(configPath);
  if (!config) return 'invalid-config';

  const jpegBuffer = renderPreview(templatePath, config, ratio);
  if (!jpegBuffer) return 'render-failed';

  fs.writeFileSync(previewPath, jpegBuffer);
  return 'created';
}

function walkRatio(ratio) {
  const ratioDir = path.join(PRESETS_ROOT, ratio);
  if (!fs.existsSync(ratioDir)) return;

  const results = { created: 0, skipped: 0, failed: 0 };

  fs.readdirSync(ratioDir).forEach((batchOrPreset) => {
    const batchPath = path.join(ratioDir, batchOrPreset);
    if (!fs.statSync(batchPath).isDirectory()) return;

    const isBatch = /^batch-\d{3}-\d{3}$/.test(batchOrPreset);
    const presetDirs = isBatch
      ? fs.readdirSync(batchPath).map(p => path.join(batchPath, p)).filter(p => fs.statSync(p).isDirectory())
      : [batchPath];

    presetDirs.forEach((presetDir) => {
      const presetId = path.basename(presetDir);
      const previewPath = path.join(presetDir, 'preview.jpg');

      process.stdout.write(`  [${ratio}] ${batchOrPreset}/${presetId} ... `);

      if (fs.existsSync(previewPath)) {
        console.log('skip (already exists)');
        results.skipped++;
        return;
      }

      const result = processPreset(presetDir, ratio);
      if (result === 'created') {
        console.log('OK');
        results.created++;
      } else {
        console.log('SKIP (' + result + ')');
        result === 'no-template' ? results.skipped++ : results.failed++;
      }
    });
  });

  return results;
}

console.log('=== 프리셋 preview.jpg 생성 ===\n');

let total = { created: 0, skipped: 0, failed: 0 };
['9x16', '16x9'].forEach((ratio) => {
  const r = walkRatio(ratio);
  if (r) {
    total.created += r.created;
    total.skipped += r.skipped;
    total.failed += r.failed;
  }
});

console.log('\n완료: 생성', total.created, '· 건너뜀', total.skipped, '· 실패', total.failed);
