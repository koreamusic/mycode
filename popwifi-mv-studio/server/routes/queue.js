const fs = require('fs');

function registerQueueRoutes(app, context) {
  app.get('/api/queue', (req, res) => {
    res.json(JSON.parse(fs.readFileSync(context.queuePath, 'utf8')));
  });
}

module.exports = { registerQueueRoutes };
