function registerConfigRoutes(app, context) {
  app.get('/api/config', (req, res) => {
    res.json(context.config);
  });
}

module.exports = { registerConfigRoutes };
