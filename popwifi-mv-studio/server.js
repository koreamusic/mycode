const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const { loadConfig } = require('./server/core/config');
const { ensureBaseDirs, ensureQueueFile } = require('./server/core/paths');
const { registerHealthRoutes } = require('./server/routes/health');
const { registerConfigRoutes } = require('./server/routes/config');
const { registerQueueRoutes } = require('./server/routes/queue');
const { registerPresetRoutes } = require('./server/routes/presets');

const rootDir = __dirname;
const config = loadConfig(rootDir);

ensureBaseDirs(rootDir);
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

app.use(express.json({ limit: '20mb' }));
app.use('/app', express.static(path.join(rootDir, 'app')));
app.use('/assets', express.static(path.join(rootDir, 'assets')));

app.get('/', (req, res) => {
  res.redirect('/app/');
});

registerHealthRoutes(app, context);
registerConfigRoutes(app, context);
registerQueueRoutes(app, context);
registerPresetRoutes(app, context);

wss.on('connection', (ws) => {
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  ws.send(JSON.stringify({
    type: 'sync',
    message: 'Pop WiFi MV Studio connected',
    queue
  }));
});

server.listen(config.port, () => {
  console.log(`Pop WiFi MV Studio running at http://localhost:${config.port}`);
});
