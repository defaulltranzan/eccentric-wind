/**
 * Input sanitization and payload validation middleware
 */

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

function validateSavePayload(req, res, next) {
  const payload = req.body;

  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ status: 'error', message: 'Malformed JSON payload.' });
  }

  if (!payload.hero || !payload.packages || !Array.isArray(payload.packages)) {
    return res.status(400).json({ status: 'error', message: 'Payload schema missing required hero or packages definition.' });
  }

  // Prevent prototype pollution
  if (Object.prototype.hasOwnProperty.call(payload, '__proto__') || 
      Object.prototype.hasOwnProperty.call(payload, 'constructor')) {
    return res.status(400).json({ status: 'error', message: 'Forbidden property keys detected.' });
  }

  next();
}

function validateInquiry(req, res, next) {
  const { name, email, trek, crew } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ status: 'error', message: 'Valid full name is required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({ status: 'error', message: 'Valid email address is required.' });
  }

  req.body.name = sanitizeString(name);
  req.body.email = sanitizeString(email);
  req.body.trek = sanitizeString(trek || 'Custom Route');
  req.body.crew = Math.max(1, Math.min(30, parseInt(crew) || 1));

  next();
}

module.exports = {
  sanitizeString,
  validateSavePayload,
  validateInquiry
};
