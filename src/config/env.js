const crypto = require('crypto');

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

module.exports = {
  isProd,
  onVercel,
  siteUrl: (process.env.SITE_URL || 'https://himalayanmagic.com').replace(/\/+$/, ''),
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
