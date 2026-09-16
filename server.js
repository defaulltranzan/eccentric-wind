const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');

const { helmetConfig, globalLimiter } = require('./src/config/security');
const { driver } = require('./src/data');
const publicController = require('./src/controllers/publicController');
const apiRoutes = require('./src/routes/apiRoutes');
const pageRoutes = require('./src/routes/pageRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 8000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// 1. Security HTTP Headers
app.use(helmetConfig);

// 2. Rate limiting applies to the API only — pages, scripts and images must never 429
app.set('trust proxy', 1);
app.use('/api', globalLimiter);

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
// Content served from the database (must win over any static file of the same name)
app.get('/data/treks.js', publicController.dataScript('treks'));
app.get('/data/expeditions.js', publicController.dataScript('expeditions'));
app.get('/data/stories.js', publicController.dataScript('stories'));
app.get('/sitemap.xml', publicController.sitemap);
app.get(['/admin', '/admin/'], (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.set('X-Robots-Tag', 'noindex, nofollow');
  res.sendFile(path.join(PUBLIC_DIR, 'admin', 'index.html'));
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

// Bootstrap Server (Vercel imports the app instead of listening)
if (require.main === module) app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  HIMALAYAN MAGIC ADVENTURE — NEPAL EXPEDITIONS PORTAL`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Security: Helmet Active | Rate Limiter Active | Gzip`);
  console.log(`  Content storage: ${driver.name === 'supabase' ? 'Supabase' : 'local files (data/)'}`);
  console.log(`  Admin: http://localhost:${PORT}/admin ${require('./src/middleware/adminSession').configured() ? '' : '(not configured — see .env.example)'}`);
  console.log(`  Live Address: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});

module.exports = app;
