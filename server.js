const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');

const { helmetConfig, globalLimiter } = require('./src/config/security');
const apiRoutes = require('./src/routes/apiRoutes');
const pageRoutes = require('./src/routes/pageRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 8000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// 1. Security HTTP Headers
app.use(helmetConfig);

// 2. Global Rate Limiter
app.use(globalLimiter);

// 3. Response Compression (Gzip for SEO speed optimization)
app.use(compression());

// 4. CORS & Body Parsing
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// 5. Static Assets Middleware with No-Cache for Live Development
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});
app.use(express.static(PUBLIC_DIR, {
  etag: false,
  maxAge: 0
}));

// 6. Mount API & Page Routers
app.use('/api', apiRoutes);
app.use('/', pageRoutes);

// 7. 404 for anything unmatched (real status, not a soft 200)
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ status: 'error', message: 'Not found.' });
  }
  res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'), (err) => {
    if (err) res.status(404).type('text/plain').send('404 — Not found');
  });
});

// 8. Global Error Handler
app.use(errorHandler);

// Bootstrap Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  HIMALAYAN MAGIC ADVENTURE — NEPAL EXPEDITIONS PORTAL`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Security: Helmet Active | Rate Limiter Active | Gzip`);
  console.log(`  Live Address: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});

module.exports = app;
