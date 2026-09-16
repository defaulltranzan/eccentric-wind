/* Admin sign-in. One administrator configured by environment variables:
 *   ADMIN_EMAIL, ADMIN_PASSWORD_HASH (npm run admin:password), SESSION_SECRET
 * The session is a stateless HMAC-signed cookie (works on serverless), HttpOnly,
 * SameSite=Strict, Secure in production. Mutating requests must also send the
 * X-HMA-Admin header, which cross-site forms cannot set. */
const crypto = require('crypto');
const env = require('../config/env');

const COOKIE = 'hma_admin';

const b64url = (buf) => Buffer.from(buf).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
const sign = (payload) => b64url(crypto.createHmac('sha256', env.admin.sessionSecret).update(payload).digest());

function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) {
    crypto.timingSafeEqual(ab, ab);
    return false;
  }
  return crypto.timingSafeEqual(ab, bb);
}

/* Hash format: scrypt$<saltHex>$<hashHex> */
function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(String(password), salt, 64, { N: 16384, r: 8, p: 1 });
  return 'scrypt$' + salt.toString('hex') + '$' + hash.toString('hex');
}

function verifyPassword(password, stored) {
  const parts = String(stored || '').split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const salt = Buffer.from(parts[1], 'hex');
  const expected = Buffer.from(parts[2], 'hex');
  if (!salt.length || expected.length !== 64) return false;
  const actual = crypto.scryptSync(String(password), salt, 64, { N: 16384, r: 8, p: 1 });
  return crypto.timingSafeEqual(actual, expected);
}

function configured() {
  return !!(env.admin.sessionSecret && env.admin.email && (env.admin.passwordHash || env.admin.password));
}

function checkCredentials(email, password) {
  if (!configured()) return false;
  const emailOk = safeEqual(String(email || '').trim().toLowerCase(), env.admin.email);
  let passOk;
  if (env.admin.passwordHash) passOk = verifyPassword(password || '', env.admin.passwordHash);
  else passOk = safeEqual(String(password || ''), env.admin.password);
  return emailOk && passOk;
}

function readCookie(req, name) {
  const header = req.headers.cookie || '';
  const parts = header.split(';');
  for (const p of parts) {
    const i = p.indexOf('=');
    if (i > -1 && p.slice(0, i).trim() === name) return decodeURIComponent(p.slice(i + 1).trim());
  }
  return null;
}

function issue(res) {
  const exp = Date.now() + env.admin.sessionHours * 3600 * 1000;
  const payload = b64url(JSON.stringify({ sub: env.admin.email, exp }));
  const token = payload + '.' + sign(payload);
  res.cookie(COOKIE, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'strict',
    path: '/',
    maxAge: env.admin.sessionHours * 3600 * 1000
  });
  return { email: env.admin.email, expiresAt: new Date(exp).toISOString() };
}

function clear(res) {
  res.clearCookie(COOKIE, { httpOnly: true, secure: env.isProd, sameSite: 'strict', path: '/' });
}

function sessionFrom(req) {
  if (!configured()) return null;
  const token = readCookie(req, COOKIE);
  if (!token) return null;
  const dot = token.lastIndexOf('.');
  if (dot < 1) return null;
  const payload = token.slice(0, dot);
  if (!safeEqual(token.slice(dot + 1), sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
    if (!data || data.sub !== env.admin.email || typeof data.exp !== 'number' || data.exp < Date.now()) return null;
    return { email: data.sub, expiresAt: new Date(data.exp).toISOString() };
  } catch (_) {
    return null;
  }
}

function requireAdmin(req, res, next) {
  const session = sessionFrom(req);
  if (!session) return res.status(401).json({ status: 'error', message: 'Please sign in.' });
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.get('x-hma-admin') !== '1') {
    return res.status(403).json({ status: 'error', message: 'Request blocked.' });
  }
  req.admin = session;
  res.set('Cache-Control', 'no-store');
  next();
}

module.exports = { configured, checkCredentials, issue, clear, sessionFrom, requireAdmin, hashPassword, verifyPassword };
