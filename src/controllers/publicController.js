const fs = require('fs');
const path = require('path');
const env = require('../config/env');
const session = require('../middleware/adminSession');
const content = require('../services/contentService');
const bookings = require('../services/bookingService');

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* /data/treks.js · /data/expeditions.js · /data/stories.js
 * Signed-in admins also see drafts (so they can preview before publishing). */
exports.dataScript = (collection) => wrap(async (req, res) => {
  const isAdmin = !!session.sessionFrom(req);
  const js = await content.buildScript(collection, { includeDrafts: isAdmin });
  res.set('Content-Type', 'application/javascript; charset=utf-8');
  res.set('Cache-Control', isAdmin ? 'private, no-store' : 'public, max-age=60, s-maxage=60, stale-while-revalidate=600');
  res.set('Vary', 'Cookie');
  res.send(js);
});

exports.trips = wrap(async (req, res) => {
  res.set('Cache-Control', 'public, max-age=120, s-maxage=120, stale-while-revalidate=600');
  res.json({ status: 'success', items: await content.trips() });
});

exports.createBooking = wrap(async (req, res) => {
  const b = await bookings.create(req.body, { userAgent: req.get('user-agent') });
  const newsletter = b.source === 'newsletter';
  res.status(201).json({
    status: 'success',
    ref: b.ref,
    inquiryId: b.ref,
    message: newsletter
      ? 'You are on the list.'
      : 'Request received. An expedition director will reply to ' + (b.email || 'you') + ' within 24 hours. Your reference is ' + b.ref + '.'
  });
});

/* Sitemap: static pages from public/sitemap.xml + every published trek, expedition and story. */
const STATIC_SITEMAP = path.join(__dirname, '../../public/sitemap.xml');
exports.sitemap = wrap(async (req, res) => {
  const xml = fs.readFileSync(STATIC_SITEMAP, 'utf8');
  const dynamic = /\/(treks|stories)\/[^<]+<\/loc>|\/expeditions\/(?!(8000m|7000m|6000m|trekking-peaks)<)[^<]+<\/loc>/;
  const staticUrls = (xml.match(/<url>[\s\S]*?<\/url>/g) || []).filter((u) => !dynamic.test(u));
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const entry = (loc, lastmod, priority) => '  <url>\n    <loc>' + esc(env.siteUrl + loc) + '</loc>\n' +
    (lastmod ? '    <lastmod>' + String(lastmod).slice(0, 10) + '</lastmod>\n' : '') +
    '    <changefreq>monthly</changefreq>\n    <priority>' + priority + '</priority>\n  </url>';
  const [treks, exps, stories] = await Promise.all([content.list('treks'), content.list('expeditions'), content.list('stories')]);
  const urls = staticUrls.map((u) => '  ' + u.trim())
    .concat(treks.map((r) => entry('/treks/' + r.slug, r.updated_at, '0.8')))
    .concat(exps.map((r) => entry('/expeditions/' + r.slug, r.updated_at, '0.7')))
    .concat(stories.map((r) => entry('/stories/' + r.slug, (r.data && (r.data.updated || r.data.date)) || r.updated_at, '0.6')));
  res.set('Content-Type', 'application/xml; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.send('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.join('\n') + '\n</urlset>\n');
});
