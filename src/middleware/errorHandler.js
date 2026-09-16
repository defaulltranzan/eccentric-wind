/**
 * Production-safe global error handler.
 */
const env = require('../config/env');

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  let statusCode = err.status || err.statusCode || 500;
  if (err.type === 'entity.too.large') statusCode = 413;
  if (statusCode >= 500) console.error('[!] Server Error:', err.stack || err.message || err);

  const hide = env.isProd && statusCode === 500;
  res.status(statusCode).json({
    status: 'error',
    message: hide ? 'Internal Server Error' : err.message || 'An unexpected error occurred.',
    ...(err.issues ? { issues: err.issues } : {}),
    ...(env.isProd ? {} : { stack: err.stack })
  });
}

module.exports = errorHandler;
