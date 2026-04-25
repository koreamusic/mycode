const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const { loadConfig } = require('./server/core/config');
const { ensureBaseDirs, ensureQueueFile } = require('./server/core/paths');
const { materializeImportedPresetBatches } = require('./server/core/preset-import-materializer');
const { registerHealthRoutes } = require('./server/routes/health');
const { registerConfigRoutes } = require('./server/routes/config');
const { registerQueueRoutes } = require('./server/routes/queue');
const { registerPresetRoutes } = require('./server/routes/presets');
const { registerRenderDraftRoutes } = require('./server/routes/render-draft');
const { registerFontsRoutes } = require('./server/routes/fonts');
const logger = require('./server/core/logger');

const rootDir = __dirname;
const config = loadConfig(rootDir);

ensureBaseDirs(rootDir);
const presetImportSummary = materializeImportedPresetBatches(rootDir);
const queuePath = ensureQueueFile(rootDir);

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const context = {
  rootDir,
  config,
  queuePath,
  wss
};

const allowedOrigin = 'http://localhost:' + config.port;

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || origin === allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    return next();
  }
  res.status(403).json({ error: 'forbidden origin' });
});

app.use(express.json({ limit: '20mb' }));
app.use('/app', express.static(path.join(rootDir, 'app')));
app.use('/assets', express.static(path.join(rootDir, 'assets')));
app.use('/output', express.static(path.join(rootDir, 'output')));
app.use('/preset-files', express.static(path.join(rootDir, 'shared', 'presets')));

app.get('/', (req, res) => {
  res.redirect('/app/');
});

registerHealthRoutes(app, context);
registerConfigRoutes(app, context);
registerQueueRoutes(app, context);
registerPresetRoutes(app, context);
registerRenderDraftRoutes(app, context);
registerFontsRoutes(app, context);

wss.on('connection', (ws) => {
  try {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    ws.send(JSON.stringify({ type: 'sync', message: 'Pop WiFi MV Studio connected', queue }));
  } catch (error) {
    ws.send(JSON.stringify({ type: 'sync', message: 'Pop WiFi MV Studio connected', queue: {} }));
  }
});

server.listen(config.port, () => {
  logger.info('Pop WiFi MV Studio running at http://localhost:' + config.port);
  logger.info('Preset imports materialized: created=' + presetImportSummary.created + ' skipped=' + presetImportSummary.skipped + ' failed=' + presetImportSummary.failed);
});
