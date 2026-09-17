/**
 * Production-safe global error handler.
 * Every API error has the same shape:
 *   { status: 'error', message, code?, fields?: { fieldName: message } }
 */
const env = require('../config/env');

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'An unexpected error occurred.';

  if (err.type === 'entity.too.large') { statusCode = 413; message = 'Request is too large.'; }
  if (err.type === 'entity.parse.failed') { statusCode = 400; message = 'Request body is not valid JSON.'; }
  if (err.type === 'charset.unsupported' || err.type === 'encoding.unsupported') { statusCode = 415; message = 'Unsupported request encoding.'; }

  if (statusCode >= 500) console.error('[!] ' + req.method + ' ' + req.originalUrl + ' →', err.stack || err.message || err);

  const hide = env.isProd && statusCode === 500;
  res.status(statusCode).json({
    status: 'error',
    message: hide ? 'Something went wrong on our side. Please try again.' : message,
    ...(err.code ? { code: err.code } : {}),
    ...(err.fields ? { fields: err.fields } : {}),
    ...(err.issues ? { issues: err.issues } : {}),
    ...(env.isProd || statusCode < 500 ? {} : { stack: err.stack })
  });
}

module.exports = errorHandler;
