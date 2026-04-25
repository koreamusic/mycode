const http = require('http');

const baseUrl = process.env.POPWIFI_API_BASE || 'http://localhost:3000';
const ratio = process.env.POPWIFI_TEST_RATIO || '16x9';
const batchId = process.env.POPWIFI_TEST_BATCH || 'batch-001-010';
const presetId = process.env.POPWIFI_TEST_PRESET || 'test-api-preset';

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

function assertOk(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  console.log(`[preset-api-test] baseUrl=${baseUrl}`);
  console.log(`[preset-api-test] target=${ratio}/${batchId}/${presetId}`);

  const createBody = {
    title: 'API Test Preset',
    category: 'test',
    description: 'Temporary preset created by local API test script.',
    active: true,
    layers: []
  };

  const createResult = await request('POST', `/api/presets/${ratio}/batch/${batchId}/${presetId}`, createBody);
  assertOk(createResult.status === 200, `POST failed with status ${createResult.status}`);
  assertOk(createResult.json && createResult.json.ok === true, 'POST response ok=true missing');
  assertOk(createResult.json.preset && createResult.json.preset.id === presetId, 'POST preset id mismatch');
  console.log('[preset-api-test] POST ok');

  const readResult = await request('GET', `/api/presets/${ratio}/batch/${batchId}/${presetId}`);
  assertOk(readResult.status === 200, `GET failed with status ${readResult.status}`);
  assertOk(readResult.json && readResult.json.id === presetId, 'GET preset id mismatch');
  console.log('[preset-api-test] GET ok');

  const patchResult = await request('PATCH', `/api/presets/${ratio}/batch/${batchId}/${presetId}`, {
    title: 'API Test Preset Updated',
    description: 'Updated by local API test script.'
  });
  assertOk(patchResult.status === 200, `PATCH failed with status ${patchResult.status}`);
  assertOk(patchResult.json && patchResult.json.preset && patchResult.json.preset.title === 'API Test Preset Updated', 'PATCH title mismatch');
  console.log('[preset-api-test] PATCH ok');

  const listResult = await request('GET', `/api/presets/${ratio}/batch/${batchId}?includeInactive=1`);
  assertOk(listResult.status === 200, `batch list failed with status ${listResult.status}`);
  assertOk(Array.isArray(listResult.json), 'batch list response is not array');
  assertOk(listResult.json.some((preset) => preset.id === presetId), 'created preset not found in batch list');
  console.log('[preset-api-test] BATCH LIST ok');

  const inactiveResult = await request('PATCH', `/api/presets/${ratio}/batch/${batchId}/${presetId}/deactivate`);
  assertOk(inactiveResult.status === 200, `deactivate failed with status ${inactiveResult.status}`);
  assertOk(inactiveResult.json && inactiveResult.json.preset && inactiveResult.json.preset.active === false, 'deactivate active=false mismatch');
  console.log('[preset-api-test] DEACTIVATE ok');

  console.log('[preset-api-test] all checks passed');
}

main().catch((error) => {
  console.error('[preset-api-test] failed');
  console.error(error.message);
  process.exit(1);
});
