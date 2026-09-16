const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');

const env = require('./src/config/env');
const { helmetConfig, globalLimiter } = require('./src/config/security');
const { driver } = require('./src/data');
const session = require('./src/middleware/adminSession');
const publicController = require('./src/controllers/publicController');
const apiRoutes = require('./src/routes/apiRoutes');
const pageRoutes = require('./src/routes/pageRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 8000;
const PUBLIC_DIR = path.join(__dirname, 'public');

app.disable('x-powered-by');
app.set('trust proxy', 1);

// 1. Security headers
app.use(helmetConfig);

// 2. Compression
app.use(compression());

// 3. API: rate limit, CORS, body parsing.
//    CORS: same-origin needs none. Only origins in SITE_URL / ALLOWED_ORIGINS may call the
//    public booking endpoints cross-site, and never with cookies. The admin API is same-origin only.
app.use('/api', globalLimiter);
const publicCors = cors({
  origin: (origin, cb) => cb(null, !origin || env.allowedOrigins.indexOf(origin.replace(/\/+$/, '')) > -1),
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Idempotency-Key'],
  credentials: false,
  maxAge: 600
});
app.use(['/api/bookings', '/api/inquiry', '/api/trips', '/api/health'], publicCors);
app.use('/api/admin', express.json({ limit: '1.5mb' }));
app.use('/api/save', express.json({ limit: '600kb' }));
app.use('/api', express.json({ limit: '64kb' }));
app.use('/api', express.urlencoded({ extended: false, limit: '64kb' }));

// 4. Content generated from the database (must win over static files of the same name)
app.get('/data/treks.js', publicController.dataScript('treks'));
app.get('/data/expeditions.js', publicController.dataScript('expeditions'));
app.get('/data/stories.js', publicController.dataScript('stories'));
app.get('/sitemap.xml', publicController.sitemap);
app.get(['/admin', '/admin/'], (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.set('X-Robots-Tag', 'noindex, nofollow');
  res.sendFile(path.join(PUBLIC_DIR, 'admin', 'index.html'));
});

// 5. Static files. HTML/JS/CSS revalidate on every load (ETag → cheap 304s, edits show instantly);
//    images, video and fonts are cached for a week. Admin files are never cached.
const LONG_CACHE = /\.(?:jpe?g|png|webp|avif|gif|svg|ico|mp4|webm|woff2?|ttf|otf)$/i;
function staticHeaders(res, filePath) {
  if (filePath.indexOf(path.sep + 'admin' + path.sep) > -1) res.setHeader('Cache-Control', 'no-store');
  else if (LONG_CACHE.test(filePath)) res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
  else res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
}
if (path.resolve(env.uploadDir) !== path.join(PUBLIC_DIR, 'uploads')) {
  app.use('/uploads', express.static(env.uploadDir, { etag: true, setHeaders: staticHeaders, fallthrough: true }));
}
app.use(express.static(PUBLIC_DIR, { etag: true, lastModified: true, setHeaders: staticHeaders }));

// 6. API & pages
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

// 8. Errors
app.use(errorHandler);

// Bootstrap (Vercel imports the app instead of listening)
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log('\n======================================================');
    console.log('  HIMALAYAN MAGIC ADVENTURE — NEPAL EXPEDITIONS PORTAL');
    console.log('  Environment: ' + (env.isProd ? 'production' : 'development'));
    console.log('  Content storage: ' + (driver.name === 'supabase' ? 'Supabase' : 'local files (' + env.dataDir + ')'));
    console.log('  Admin: http://localhost:' + PORT + '/admin' + (session.configured() ? '' : '  (not configured — see .env.example)'));
    console.log('  Health: http://localhost:' + PORT + '/api/health');
    console.log('  Live Address: http://localhost:' + PORT);
    console.log('======================================================\n');
  });
  const shutdown = () => server.close(() => process.exit(0));
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

module.exports = app;
