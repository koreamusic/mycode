const fs = require('fs');
const path = require('path');
const http = require('http');

const baseUrl = process.env.POPWIFI_API_BASE || 'http://localhost:3100';
const inputPath = process.argv[2];

function fail(message) {
  console.error(`[preset-batch-import] ${message}`);
  process.exit(1);
}

if (!inputPath) {
  fail('Usage: node scripts/import-preset-batch.js <preset-batch.json>');
}

function readJsonFile(filePath) {
  const resolved = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(resolved)) fail(`input file not found: ${resolved}`);
  try {
    return JSON.parse(fs.readFileSync(resolved, 'utf8'));
  } catch (error) {
    fail(`invalid JSON: ${error.message}`);
  }
}

function request(method, pathname, body) {
  const url = new URL(pathname, baseUrl);
  const payload = body ? JSON.stringify(body) : null;

  return new Promise((resolve, reject) => {
    const req = http.request({
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: payload ? {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      } : {}
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        let json = null;
        try {
          json = data ? JSON.parse(data) : null;
        } catch (error) {
          return reject(new Error(`Invalid JSON from ${method} ${pathname}: ${data}`));
        }
        resolve({ status: res.statusCode, json });
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function validateBatchPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    fail('batch JSON must be an object');
  }
  if (!payload.ratio || typeof payload.ratio !== 'string') {
    fail('ratio is required');
  }
  if (!payload.batchId || typeof payload.batchId !== 'string') {
    fail('batchId is required');
  }
  if (!Array.isArray(payload.presets)) {
    fail('presets array is required');
  }
  if (payload.presets.length < 1) {
    fail('presets array is empty');
  }
  if (payload.presets.length > 10) {
    fail('one batch import allows up to 10 presets');
  }

  const seen = new Set();
  payload.presets.forEach((preset, index) => {
    if (!preset || typeof preset !== 'object' || Array.isArray(preset)) {
      fail(`preset at index ${index} must be an object`);
    }
    if (!preset.id || typeof preset.id !== 'string') {
      fail(`preset at index ${index} is missing string id`);
    }
    if (seen.has(preset.id)) {
      fail(`duplicate preset id in input: ${preset.id}`);
    }
    seen.add(preset.id);
  });
}

async function importBatch(payload) {
  const results = [];
  for (const preset of payload.presets) {
    const presetId = preset.id;
    const body = Object.assign({}, preset);
    delete body.id;
    delete body.ratio;
    delete body.batchId;

    const endpoint = `/api/presets/${payload.ratio}/batch/${payload.batchId}/${presetId}`;
    const result = await request('POST', endpoint, body);
    if (result.status !== 200 || !result.json || result.json.ok !== true) {
      throw new Error(`failed to import ${presetId}: status=${result.status} body=${JSON.stringify(result.json)}`);
    }
    results.push(result.json.preset);
    console.log(`[preset-batch-import] imported ${presetId}`);
  }
  return results;
}

async function main() {
  const payload = readJsonFile(inputPath);
  validateBatchPayload(payload);

  console.log(`[preset-batch-import] baseUrl=${baseUrl}`);
  console.log(`[preset-batch-import] target=${payload.ratio}/${payload.batchId}`);
  console.log(`[preset-batch-import] count=${payload.presets.length}`);

  const imported = await importBatch(payload);
  console.log(`[preset-batch-import] done imported=${imported.length}`);
}

main().catch((error) => {
  console.error('[preset-batch-import] failed');
  console.error(error.message);
  process.exit(1);
});
