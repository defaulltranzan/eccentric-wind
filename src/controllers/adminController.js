const env = require('../config/env');
const session = require('../middleware/adminSession');
const content = require('../services/contentService');
const bookings = require('../services/bookingService');
const media = require('../services/mediaService');
const notify = require('../services/notifyService');
const { driver } = require('../data');

const ok = (res, data, status = 200) => res.status(status).json(Object.assign({ status: 'success' }, data));
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.login = wrap(async (req, res) => {
  if (!session.configured()) {
    return res.status(503).json({ status: 'error', message: 'Admin sign-in is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD_HASH and SESSION_SECRET.' });
  }
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' || password.length > 200) {
    return res.status(400).json({ status: 'error', message: 'Enter your email and password.' });
  }
  if (!session.checkCredentials(email, password)) {
    console.warn('[admin] failed sign-in from ' + req.ip);
    return res.status(401).json({ status: 'error', message: 'Email or password is incorrect.' });
  }
  ok(res, { session: session.issue(res) });
});

exports.logout = (req, res) => {
  session.clear(res);
  ok(res, {});
};

exports.me = (req, res) => {
  const s = session.sessionFrom(req);
  res.set('Cache-Control', 'no-store');
  if (!s) return res.status(401).json({ status: 'error', message: 'Not signed in.', configured: session.configured() });
  ok(res, {
    session: s,
    system: {
      storage: driver.name,
      readOnly: driver.name === 'file' && env.onVercel,
      email: notify.enabled()
    }
  });
};

exports.dashboard = wrap(async (req, res) => {
  const [c, b] = await Promise.all([content.stats(), bookings.counts()]);
  ok(res, { content: c, bookings: b });
});

exports.pulse = wrap(async (req, res) => {
  const b = await bookings.counts();
  ok(res, { newBookings: b.NEW, latest: b.recent[0] ? { ref: b.recent[0].ref, name: b.recent[0].name, created_at: b.recent[0].created_at } : null });
});

exports.list = wrap(async (req, res) => {
  ok(res, { items: await content.summaries(req.params.collection) });
});

exports.get = wrap(async (req, res) => {
  ok(res, { item: await content.get(req.params.collection, req.params.slug) });
});

exports.create = wrap(async (req, res) => {
  const { data, published, kind } = req.body || {};
  ok(res, { item: await content.create(req.params.collection, { data, published, kind }) }, 201);
});

exports.update = wrap(async (req, res) => {
  const { data, published, expectedUpdatedAt } = req.body || {};
  ok(res, { item: await content.update(req.params.collection, req.params.slug, { data, published, expectedUpdatedAt }) });
});

exports.publish = wrap(async (req, res) => {
  ok(res, { item: await content.setPublished(req.params.collection, req.params.slug, !!(req.body && req.body.published)) });
});

exports.move = wrap(async (req, res) => {
  const dir = req.body && req.body.direction === 'down' ? 'down' : 'up';
  await content.move(req.params.collection, req.params.slug, dir);
  ok(res, {});
});

exports.remove = wrap(async (req, res) => {
  await content.remove(req.params.collection, req.params.slug);
  ok(res, {});
});

exports.upload = wrap(async (req, res) => {
  const folder = String(req.query.folder || 'general');
  let name = String(req.get('x-filename') || 'image');
  try { name = decodeURIComponent(name); } catch (_) { /* keep the raw header value */ }
  ok(res, await media.upload(folder, name, req.body), 201);
});

exports.bookings = wrap(async (req, res) => {
  const { status, source, q, page, pageSize } = req.query;
  const result = await bookings.list({ status, source, q, page, pageSize });
  ok(res, Object.assign(result, { statuses: bookings.STATUSES, sources: bookings.SOURCES }));
});

exports.bookingsCsv = wrap(async (req, res) => {
  const { status, source, q } = req.query;
  const rows = await bookings.all({ status, source, q });
  res.set('Content-Type', 'text/csv; charset=utf-8');
  res.set('Content-Disposition', 'attachment; filename="bookings-' + new Date().toISOString().slice(0, 10) + '.csv"');
  res.set('Cache-Control', 'no-store');
  res.send('﻿' + bookings.toCsv(rows));
});

exports.updateBooking = wrap(async (req, res) => {
  ok(res, { item: await bookings.update(req.params.id, req.body || {}, req.admin && req.admin.email) });
});

exports.removeBooking = wrap(async (req, res) => {
  await bookings.remove(req.params.id);
  ok(res, {});
});
