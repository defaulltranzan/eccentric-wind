/**
 * Admin authorization for content-mutating endpoints.
 *
 * The visual editor writes the site's content database (content.json) via
 * POST /api/save. That endpoint must never be callable by the public.
 *
 * Policy:
 *   - If ADMIN_TOKEN is not set (or too short), content editing is DISABLED
 *     entirely and every write is rejected. This is the safe default for any
 *     deployment that does not explicitly opt in.
 *   - If ADMIN_TOKEN is set, callers must present the exact token in the
 *     `x-admin-token` header. Comparison is timing-safe.
 */
const crypto = require('crypto');

function timingSafeEqual(a, b) {
  const ab = Buffer.from(String(a || ''), 'utf8');
  const bb = Buffer.from(String(b || ''), 'utf8');
  if (ab.length !== bb.length) return false;
  try {
    return crypto.timingSafeEqual(ab, bb);
  } catch (_) {
    return false;
  }
}

function requireAdmin(req, res, next) {
  const configured = process.env.ADMIN_TOKEN;

  if (!configured || configured.length < 16) {
    return res.status(403).json({
      status: 'error',
      message: 'Content editing is disabled on this deployment.'
    });
  }

  const provided = req.get('x-admin-token') || '';
  if (!timingSafeEqual(provided, configured)) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized.' });
  }

  next();
}

module.exports = { requireAdmin, timingSafeEqual };
