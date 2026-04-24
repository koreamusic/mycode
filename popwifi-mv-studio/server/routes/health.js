function registerHealthRoutes(app, context) {
  app.get('/api/health', (req, res) => {
    res.json({
      ok: true,
      app: 'Pop WiFi MV Studio',
      mode: 'pc-first',
      mobile: 'review-only',
      port: context.config.port
    });
  });
}

module.exports = { registerHealthRoutes };
