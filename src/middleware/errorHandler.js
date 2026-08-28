/**
 * Production-safe Global Error Handler
 */
function errorHandler(err, req, res, next) {
  console.error('[!] Server Error:', err.message || err);

  const statusCode = err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    status: 'error',
    message: isProduction && statusCode === 500 ? 'Internal Server Error' : err.message || 'An unexpected error occurred.',
    ...(isProduction ? {} : { stack: err.stack })
  });
}

module.exports = errorHandler;
