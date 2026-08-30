/**
 * Input sanitization and payload validation middleware
 */

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

// The content database only ever contains these top-level sections.
const ALLOWED_CONTENT_KEYS = new Set([
  'hero', 'stats', 'about', 'contact', 'departures', 'packages', 'dispatches', 'services'
]);

function validateSavePayload(req, res, next) {
  const payload = req.body;

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return res.status(400).json({ status: 'error', message: 'Malformed JSON payload.' });
  }

  // Prevent prototype pollution
  if (Object.prototype.hasOwnProperty.call(payload, '__proto__') ||
      Object.prototype.hasOwnProperty.call(payload, 'constructor') ||
      Object.prototype.hasOwnProperty.call(payload, 'prototype')) {
    return res.status(400).json({ status: 'error', message: 'Forbidden property keys detected.' });
  }

  // Reject anything that is not a recognised content section
  const unknown = Object.keys(payload).filter((k) => !ALLOWED_CONTENT_KEYS.has(k));
  if (unknown.length) {
    return res.status(400).json({ status: 'error', message: `Unrecognised content keys: ${unknown.join(', ')}` });
  }

  if (typeof payload.hero !== 'object' || payload.hero === null) {
    return res.status(400).json({ status: 'error', message: 'Payload is missing a valid hero section.' });
  }
  if (!Array.isArray(payload.packages)) {
    return res.status(400).json({ status: 'error', message: 'Payload is missing a valid packages list.' });
  }
  if (payload.packages.length > 60) {
    return res.status(400).json({ status: 'error', message: 'Too many packages.' });
  }
  if (payload.packages.some((p) => typeof p !== 'object' || p === null || Array.isArray(p))) {
    return res.status(400).json({ status: 'error', message: 'Every package must be an object.' });
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
