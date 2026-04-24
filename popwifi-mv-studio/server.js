const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const ROOT = __dirname;
const CONFIG_PATH = path.join(ROOT, 'config.json');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadConfig() {
  const defaultConfig = {
    ffmpegPath: 'ffmpeg',
    port: 3000,
    musicDir: 'music',
    outputDir: 'output',
    tempDir: 'temp',
    autoSleep: true,
    sleepDelay: 60,
    defaultFps: 30,
    renderQuality: 18
  };

  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }

  return Object.assign(defaultConfig, JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')));
}

const config = loadConfig();

['data', 'data/jobs', 'data/lyrics', 'logs', 'music', 'output', 'temp', 'assets', 'assets/fonts'].forEach((dir) => {
  ensureDir(path.join(ROOT, dir));
});

const queuePath = path.join(ROOT, 'data', 'queue.json');
if (!fs.existsSync(queuePath)) {
  fs.writeFileSync(queuePath, JSON.stringify({ currentJob: null, pending: [], completed: [], failed: [] }, null, 2));
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json({ limit: '20mb' }));
app.use('/app', express.static(path.join(ROOT, 'app')));
app.use('/assets', express.static(path.join(ROOT, 'assets')));

app.get('/', (req, res) => {
  res.redirect('/app/');
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, app: 'Pop WiFi MV Studio', mode: 'pc-first', mobile: 'review-only' });
});

app.get('/api/config', (req, res) => {
  res.json(config);
});

app.get('/api/queue', (req, res) => {
  res.json(JSON.parse(fs.readFileSync(queuePath, 'utf8')));
});

app.get('/api/presets/:ratio', (req, res) => {
  const ratio = req.params.ratio;
  const presetRoot = path.join(ROOT, 'shared', 'presets', ratio);
  if (!fs.existsSync(presetRoot)) return res.json([]);

  const presets = fs.readdirSync(presetRoot)
    .map((name) => {
      const configPath = path.join(presetRoot, name, 'config.json');
      if (!fs.existsSync(configPath)) return null;
      try {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } catch (err) {
        return null;
      }
    })
    .filter(Boolean)
    .filter((preset) => preset.active !== false);

  res.json(presets);
});

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'sync', message: 'Pop WiFi MV Studio connected', queue: JSON.parse(fs.readFileSync(queuePath, 'utf8')) }));
});

server.listen(config.port, () => {
  console.log(`Pop WiFi MV Studio running at http://localhost:${config.port}`);
});
