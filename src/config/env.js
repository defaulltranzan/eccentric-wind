const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Automatically load .env file if present
const ROOT = path.join(__dirname, '../..');
const envPath = path.join(ROOT, '.env');
if (fs.existsSync(envPath)) {
  if (typeof process.loadEnvFile === 'function') {
    try { process.loadEnvFile(envPath); } catch (_) {}
  } else {
    try {
      const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!(key in process.env)) process.env[key] = val;
        }
      }
    } catch (_) {}
  }
}

const onVercel = !!process.env.VERCEL;
const isProd = process.env.NODE_ENV === 'production' || onVercel;

let sessionSecret = process.env.SESSION_SECRET || '';
if (sessionSecret.length < 32) {
  if (isProd) {
    sessionSecret = '';
  } else {
    // Local dev convenience: a per-process secret (admin sessions end on restart).
    sessionSecret = crypto.randomBytes(48).toString('hex');
    if (process.env.ADMIN_EMAIL) console.warn('[admin] SESSION_SECRET not set — using a temporary one for this run.');
  }
}

const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const siteUrl = (process.env.SITE_URL || 'https://himalayanmagic.com').replace(/\/+$/, '');

// Browsers on these origins may call the public booking API cross-site.
// Same-origin requests never need CORS; the admin API is same-origin only.
const allowedOrigins = [siteUrl]
  .concat((process.env.ALLOWED_ORIGINS || '').split(','))
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

module.exports = {
  isProd,
  onVercel,
  siteUrl,
  allowedOrigins,
  dataDir: process.env.HMA_DATA_DIR ? path.resolve(process.env.HMA_DATA_DIR) : path.join(ROOT, 'data'),
  uploadDir: process.env.HMA_UPLOAD_DIR ? path.resolve(process.env.HMA_UPLOAD_DIR) : path.join(ROOT, 'public', 'uploads'),
  supabase: {
    url: supabaseUrl,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    bucket: process.env.SUPABASE_BUCKET || 'media',
    enabled: !!(supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY)
  },
  admin: {
    email: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
    passwordHash: process.env.ADMIN_PASSWORD_HASH || '',
    password: isProd ? '' : (process.env.ADMIN_PASSWORD || ''),
    sessionSecret,
    sessionHours: Math.max(1, Math.min(72, parseInt(process.env.ADMIN_SESSION_HOURS, 10) || 12))
  },
  mail: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.MAIL_FROM || process.env.SMTP_USER || '',
    to: process.env.BOOKING_NOTIFY_TO || '',
    customerCopy: process.env.BOOKING_CUSTOMER_COPY === 'true'
  }
};
