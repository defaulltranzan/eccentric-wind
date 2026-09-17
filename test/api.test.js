/* Himalayan Magic Adventure — backend test suite.   Run:  npm test
 * Boots the real Express app on a random port against a TEMPORARY copy of
 * data/content, so your real content and bookings are never touched. */
'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'hma-test-'));
fs.cpSync(path.join(ROOT, 'data', 'content'), path.join(TMP, 'content'), { recursive: true });

const PASSWORD = 'Correct-Horse-Battery-9';
const salt = crypto.randomBytes(16);
Object.assign(process.env, {
  NODE_ENV: 'test',
  HMA_DATA_DIR: TMP,
  HMA_UPLOAD_DIR: path.join(TMP, 'uploads'),
  ADMIN_EMAIL: 'owner@example.test',
  ADMIN_PASSWORD_HASH: 'scrypt$' + salt.toString('hex') + '$' + crypto.scryptSync(PASSWORD, salt, 64, { N: 16384, r: 8, p: 1 }).toString('hex'),
  SESSION_SECRET: crypto.randomBytes(40).toString('hex'),
  SITE_URL: 'https://himalayanmagic.test',
  ALLOWED_ORIGINS: 'https://partner.test',
  API_RATE_LIMIT: '100000',
  BOOKING_RATE_LIMIT: '100000',
  LOGIN_RATE_LIMIT: '1000'
});
delete process.env.SUPABASE_URL;
delete process.env.SUPABASE_SERVICE_ROLE_KEY;
delete process.env.SMTP_HOST;

const app = require('../server.js');
let server, BASE, cookie = '';

async function req(method, p, { body, admin = false, headers = {}, raw } = {}) {
  const h = Object.assign({}, headers);
  if (admin) { h.Cookie = cookie; h['X-HMA-Admin'] = '1'; }
  let payload;
  if (raw !== undefined) payload = raw;
  else if (body !== undefined) { h['Content-Type'] = h['Content-Type'] || 'application/json'; payload = typeof body === 'string' ? body : JSON.stringify(body); }
  const res = await fetch(BASE + p, { method, headers: h, body: payload, redirect: 'manual' });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (_) { /* not JSON */ }
  return { status: res.status, text, json, headers: res.headers };
}

const future = (days) => new Date(Date.now() + days * 864e5).toISOString().slice(0, 10);
const booking = (extra) => Object.assign({
  name: 'Test Trekker', email: 'trekker-' + crypto.randomBytes(3).toString('hex') + '@example.com',
  phone: '+977 980-000-0000', people: 2, preferred_date: future(60), trip_slug: 'annapurna-circuit', trip_type: 'trek',
  message: 'Hello', source: 'contact-form'
}, extra || {});

before(async () => {
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  BASE = 'http://127.0.0.1:' + server.address().port;
  const r = await req('POST', '/api/admin/login', { body: { email: 'owner@example.test', password: PASSWORD } });
  assert.equal(r.status, 200, r.text);
  cookie = r.headers.get('set-cookie').split(';')[0];
});

after(() => {
  server.close();
  fs.rmSync(TMP, { recursive: true, force: true });
});

/* ------------------------------------------------------------------ public site */
test('health reports storage status', async () => {
  const r = await req('GET', '/api/health');
  assert.equal(r.status, 200);
  assert.equal(r.json.status, 'ok');
  assert.equal(r.json.storage, 'file');
});

test('data scripts serve every collection', async () => {
  const t = await req('GET', '/data/treks.js');
  assert.equal(t.status, 200);
  assert.match(t.headers.get('content-type'), /javascript/);
  assert.match(t.text, /"annapurna-circuit"/);
  const e = await req('GET', '/data/expeditions.js');
  assert.match(e.text, /window\.MOUNTAINS = \{"everest"/);
  assert.match(e.text, /window\.PEAKS_DATA = \{/);
  const s = await req('GET', '/data/stories.js');
  assert.match(s.text, /window\.STORIES = \{/);
  assert.doesNotMatch(t.text, /<\/script/i, 'script output must never contain a closing script tag');
});

test('trip pages: 200 published, 404 unknown, real status codes', async () => {
  assert.equal((await req('GET', '/treks/annapurna-circuit')).status, 200);
  assert.equal((await req('GET', '/expeditions/everest')).status, 200);
  assert.equal((await req('GET', '/expeditions/peaks/ama-dablam')).status, 200);
  const missing = await req('GET', '/treks/no-such-trek');
  assert.equal(missing.status, 404);
  assert.equal(missing.headers.get('x-robots-tag'), 'noindex');
});

test('static caching: images cached, html revalidates, admin never cached', async () => {
  assert.match((await req('GET', '/images/hero-corridor.webp')).headers.get('cache-control'), /max-age=604800/);
  assert.match((await req('GET', '/treks.js')).headers.get('cache-control'), /must-revalidate/);
  assert.match((await req('GET', '/admin/admin.js')).headers.get('cache-control'), /no-store/);
});

test('sitemap lists dynamic content once', async () => {
  const r = await req('GET', '/sitemap.xml');
  assert.equal(r.status, 200);
  assert.equal((r.text.match(/\/treks\/annapurna-circuit</g) || []).length, 1);
  assert.match(r.text, /himalayanmagic\.test\/expeditions\/everest/);
});

/* ------------------------------------------------------------------ bookings API */
test('booking: happy path returns ref and resolves the trip', async () => {
  const r = await req('POST', '/api/bookings', { body: booking({ details: { country: 'Nepal', experience: 'first trek', consent: true } }) });
  assert.equal(r.status, 201, r.text);
  assert.match(r.json.ref, /^HMA-\d{6}-[A-Z0-9]{5}$/);
  assert.equal(r.json.booking.trip_name, 'Annapurna Circuit Trek');
  const list = await req('GET', '/api/admin/bookings?q=' + r.json.ref, { admin: true });
  const b = list.json.items[0];
  assert.equal(b.status, 'NEW');
  assert.deepEqual(b.details, { country: 'Nepal', experience: 'first trek', consent: true });
  assert.equal(b.history[0].status, 'NEW');
});

test('booking: field-level validation errors', async () => {
  const r = await req('POST', '/api/bookings', { body: { name: 'X', email: 'nope', phone: 'call me', people: 99, preferred_date: '2020-01-01' } });
  assert.equal(r.status, 400);
  assert.deepEqual(Object.keys(r.json.fields).sort(), ['email', 'name', 'people', 'phone', 'preferred_date']);
  const bad = await req('POST', '/api/bookings', { body: booking({ preferred_date: '2026-02-30' }) });
  assert.equal(bad.json.fields.preferred_date, 'Please choose a valid date.');
});

test('booking: Idempotency-Key makes retries safe', async () => {
  const key = crypto.randomUUID();
  const payload = booking();
  const first = await req('POST', '/api/bookings', { body: payload, headers: { 'Idempotency-Key': key } });
  const retry = await req('POST', '/api/bookings', { body: payload, headers: { 'Idempotency-Key': key } });
  assert.equal(first.status, 201);
  assert.equal(retry.status, 200);
  assert.equal(retry.json.ref, first.json.ref);
  assert.equal(retry.json.booking.replayed, true);
  const list = await req('GET', '/api/admin/bookings?q=' + encodeURIComponent(payload.email), { admin: true });
  assert.equal(list.json.total, 1);
});

test('booking: identical double-submit without a key is collapsed', async () => {
  const payload = booking();
  const a = await req('POST', '/api/bookings', { body: payload });
  const b = await req('POST', '/api/bookings', { body: payload });
  assert.equal(b.json.ref, a.json.ref);
  const c = await req('POST', '/api/bookings', { body: Object.assign({}, payload, { message: 'A different question' }) });
  assert.notEqual(c.json.ref, a.json.ref);
});

test('booking: parallel duplicate submits with one key store exactly one booking', async () => {
  const key = crypto.randomUUID();
  const payload = booking();
  const results = await Promise.all([1, 2, 3, 4].map(() => req('POST', '/api/bookings', { body: payload, headers: { 'Idempotency-Key': key } })));
  const refs = new Set(results.map((r) => r.json.ref));
  assert.equal(refs.size, 1);
  const list = await req('GET', '/api/admin/bookings?q=' + encodeURIComponent(payload.email), { admin: true });
  assert.equal(list.json.total, 1);
});

test('booking: honeypot silently drops bots', async () => {
  const payload = booking({ website: 'http://spam.example' });
  const r = await req('POST', '/api/bookings', { body: payload });
  assert.equal(r.status, 201);
  const list = await req('GET', '/api/admin/bookings?q=' + encodeURIComponent(payload.email), { admin: true });
  assert.equal(list.json.total, 0);
});

test('booking: form-encoded posts work, oversized and malformed bodies are rejected', async () => {
  const form = new URLSearchParams(booking({ details: undefined })).toString();
  const r = await req('POST', '/api/bookings', { body: form, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  assert.equal(r.status, 201, r.text);
  const big = await req('POST', '/api/bookings', { body: booking({ message: 'x'.repeat(100000) }) });
  assert.equal(big.status, 413);
  const broken = await req('POST', '/api/bookings', { body: '{"name":', headers: { 'Content-Type': 'application/json' } });
  assert.equal(broken.status, 400);
  assert.equal(broken.json.message, 'Request body is not valid JSON.');
});

test('booking: legacy /api/inquiry and newsletter signups still work', async () => {
  const r = await req('POST', '/api/inquiry', { body: { source: 'newsletter', email: 'reader-' + Date.now() + '@example.com' } });
  assert.equal(r.status, 201);
  assert.equal(r.json.message, 'You are on the list.');
});

test('CORS: only allowed origins, never credentials', async () => {
  const ok = await req('OPTIONS', '/api/bookings', { headers: { Origin: 'https://partner.test', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type,idempotency-key' } });
  assert.equal(ok.headers.get('access-control-allow-origin'), 'https://partner.test');
  assert.equal(ok.headers.get('access-control-allow-credentials'), null);
  const evil = await req('OPTIONS', '/api/bookings', { headers: { Origin: 'https://evil.test', 'Access-Control-Request-Method': 'POST' } });
  assert.equal(evil.headers.get('access-control-allow-origin'), null);
  const adminPreflight = await req('OPTIONS', '/api/admin/treks', { headers: { Origin: 'https://partner.test', 'Access-Control-Request-Method': 'POST' } });
  assert.equal(adminPreflight.headers.get('access-control-allow-origin'), null);
});

/* ------------------------------------------------------------------ booking popup */
test('popup: trip view model uses only real data', async () => {
  const trek = await req('GET', '/api/trips/annapurna-circuit');
  assert.equal(trek.status, 200);
  const t = trek.json.trip;
  assert.equal(t.type, 'trek');
  assert.equal(t.facts.altitude, '5,416 m');
  assert.match(t.facts.duration, /^\d+(–\d+)? Days$/);
  assert.ok(t.pricing.tiers.length >= 1);
  assert.match(t.pricing.tiers[0].range, /^USD [\d,]+(–[\d,]+|\+)$/);
  assert.ok(Array.isArray(t.pricing.tiers[0].includes));
  const exp = await req('GET', '/api/trips/everest?type=expedition');
  assert.equal(exp.json.trip.type, 'expedition');
  assert.deepEqual(exp.json.trip.pricing.tiers, [], 'no invented expedition prices');
  assert.equal((await req('GET', '/api/trips/does-not-exist')).status, 404);
  assert.equal((await req('GET', '/api/trips/..%2F..%2Fetc')).status, 404);
  assert.equal((await req('GET', '/api/trips/annapurna-circuit?type=expedition')).status, 404);
});

const popup = (extra) => Object.assign({
  source: 'popup', first_name: 'Alex', last_name: 'Morgan', email: 'popup-' + crypto.randomBytes(3).toString('hex') + '@example.com',
  phone: '+44 7700 900123', country: 'United Kingdom', people: 3, preferred_month: future(90).slice(0, 7),
  trip_slug: 'everest', trip_type: 'expedition', message: 'Private group', details: { flexible_dates: true, package_tier: 'Budget' }
}, extra || {});

test('popup: month-precision booking stores name, country and details', async () => {
  const r = await req('POST', '/api/bookings', { body: popup() });
  assert.equal(r.status, 201, r.text);
  const b = (await req('GET', '/api/admin/bookings?q=' + r.json.ref, { admin: true })).json.items[0];
  assert.equal(b.name, 'Alex Morgan');
  assert.equal(b.source, 'popup');
  assert.equal(b.trip_type, 'expedition');
  assert.equal(b.trip_name, 'Mount Everest');
  assert.match(b.preferred_date, /^\d{4}-\d{2}-01$/);
  assert.deepEqual(b.details, { flexible_dates: true, package_tier: 'Budget', first_name: 'Alex', last_name: 'Morgan', country: 'United Kingdom', date_precision: 'month' });
});

test('popup: exact date wins over month', async () => {
  const date = future(40);
  const r = await req('POST', '/api/bookings', { body: popup({ preferred_date: date }) });
  const b = (await req('GET', '/api/admin/bookings?q=' + r.json.ref, { admin: true })).json.items[0];
  assert.equal(b.preferred_date, date);
  assert.equal(b.details.date_precision, undefined);
});

test('popup: required fields are enforced server-side', async () => {
  const r = await req('POST', '/api/bookings', { body: { source: 'popup', email: 'x@example.com' } });
  assert.equal(r.status, 400);
  assert.deepEqual(Object.keys(r.json.fields).sort(), ['first_name', 'last_name', 'phone', 'preferred_date']);
  const past = await req('POST', '/api/bookings', { body: popup({ preferred_month: '2020-01' }) });
  assert.equal(past.json.fields.preferred_date, 'That month has already passed.');
  const badMonth = await req('POST', '/api/bookings', { body: popup({ preferred_month: '2027-13' }) });
  assert.equal(badMonth.json.fields.preferred_date, 'Please choose a valid month.');
  const noTrip = await req('POST', '/api/bookings', { body: popup({ trip_slug: '', trip_type: '' }) });
  assert.equal(noTrip.status, 400);
  assert.ok(noTrip.json.fields.trip);
  const custom = await req('POST', '/api/bookings', { body: popup({ trip_slug: '', trip_type: '', trip_name: 'Custom adventure — help me choose' }) });
  assert.equal(custom.status, 201, custom.text);
  const tooLong = await req('POST', '/api/bookings', { body: popup({ phone: '+1 234 567 890 123 456' }) });
  assert.ok(tooLong.json.fields.phone);
});

test('popup client and modal assets are served on trip pages', async () => {
  const page = await req('GET', '/treks/annapurna-circuit');
  assert.match(page.text, /booking-modal\.js/);
  assert.match(page.text, /booking-modal\.css/);
  assert.match(page.text, /booking-client\.js/);
  assert.equal((await req('GET', '/booking-modal.js')).status, 200);
});

/* ------------------------------------------------------------------ admin auth */
test('admin auth: sessions, CSRF header, tampering, bad input', async () => {
  assert.equal((await req('GET', '/api/admin/dashboard')).status, 401);
  assert.equal((await req('POST', '/api/admin/login', { body: { email: 'owner@example.test', password: 'wrong' } })).status, 401);
  assert.equal((await req('POST', '/api/admin/login', { body: { email: ['x'], password: {} } })).status, 400);
  const noHeader = await fetch(BASE + '/api/admin/treks', { method: 'POST', headers: { Cookie: cookie, 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal(noHeader.status, 403);
  const tampered = cookie.slice(0, -2) + (cookie.endsWith('A') ? 'B' : 'A') + cookie.slice(-1);
  assert.equal((await req('GET', '/api/admin/dashboard', { headers: { Cookie: tampered } })).status, 401);
  assert.equal((await req('GET', '/api/admin/dashboard', { admin: true })).status, 200);
});

/* ------------------------------------------------------------------ content lifecycle */
test('content: draft → preview → publish → edit → rename (301) → delete', async () => {
  const created = await req('POST', '/api/admin/treks', { admin: true, body: { data: { name: 'Suite Ridge Trek', region: 'Annapurna', stats: { duration: '6 days' } }, published: false } });
  assert.equal(created.status, 201, created.text);
  const slug = created.json.item.slug;
  assert.equal(slug, 'suite-ridge-trek');

  assert.doesNotMatch((await req('GET', '/data/treks.js')).text, /suite-ridge-trek/);
  assert.equal((await req('GET', '/treks/' + slug)).status, 404, 'drafts are not public');
  assert.equal((await req('GET', '/treks/' + slug, { headers: { Cookie: cookie } })).status, 200, 'admins can preview drafts');

  const pub = await req('PATCH', '/api/admin/treks/' + slug + '/publish', { admin: true, body: { published: true } });
  assert.equal(pub.json.item.published, true);
  assert.match((await req('GET', '/data/treks.js')).text, /suite-ridge-trek/);

  const item = (await req('GET', '/api/admin/treks/' + slug, { admin: true })).json.item;
  const data = Object.assign({}, item.data, { name: 'Suite Ridge Trek Renamed', slug: 'suite-ridge-renamed' });
  const upd = await req('PUT', '/api/admin/treks/' + slug, { admin: true, body: { data, published: true, expectedUpdatedAt: item.updated_at } });
  assert.equal(upd.status, 200, upd.text);
  assert.equal(upd.json.item.slug, 'suite-ridge-renamed');
  assert.deepEqual(upd.json.item.data.formerSlugs, ['suite-ridge-trek']);

  const redirect = await req('GET', '/treks/suite-ridge-trek?ref=x');
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get('location'), '/treks/suite-ridge-renamed?ref=x');

  const stale = await req('PUT', '/api/admin/treks/suite-ridge-renamed', { admin: true, body: { data, published: true, expectedUpdatedAt: item.updated_at } });
  assert.equal(stale.status, 409);
  assert.equal(stale.json.code, 'STALE');

  const bookingOnOldSlug = await req('POST', '/api/bookings', { body: booking({ trip_slug: 'suite-ridge-trek' }) });
  assert.equal(bookingOnOldSlug.json.booking.trip_name, 'Suite Ridge Trek Renamed');

  assert.equal((await req('DELETE', '/api/admin/treks/suite-ridge-renamed', { admin: true })).status, 200);
  assert.equal((await req('GET', '/treks/suite-ridge-renamed')).status, 404);
  assert.equal((await req('GET', '/treks/suite-ridge-trek')).status, 404);
});

test('content: validation, duplicates and 404s', async () => {
  assert.equal((await req('POST', '/api/admin/treks', { admin: true, body: { data: { tagline: 'no name' } } })).status, 400);
  assert.equal((await req('POST', '/api/admin/treks', { admin: true, body: { data: { name: 'Annapurna Circuit' } } })).status, 409);
  assert.equal((await req('POST', '/api/admin/expeditions', { admin: true, body: { kind: 'peak', data: { name: 'Bad Peak', elevation: 'high' } } })).status, 400);
  assert.equal((await req('POST', '/api/admin/stories', { admin: true, body: { data: { title: 'No date', body: [] } } })).status, 400);
  assert.equal((await req('PATCH', '/api/admin/treks/does-not-exist/publish', { admin: true, body: { published: true } })).status, 404);
  assert.equal((await req('GET', '/api/admin/unknown-collection', { admin: true })).status, 404);
});

test('content: new peak derives its band and appears in PEAKS_DATA', async () => {
  const r = await req('POST', '/api/admin/expeditions', { admin: true, body: { kind: 'peak', data: { name: 'Suite Peak', elevation: 6250 }, published: true } });
  assert.equal(r.status, 201, r.text);
  assert.equal(r.json.item.data.category, '6000');
  assert.equal(r.json.item.data.elevationLabel, '6,250 m');
  assert.match((await req('GET', '/data/expeditions.js')).text, /window\.PEAKS_DATA = \{.*"suite-peak"/);
  await req('DELETE', '/api/admin/expeditions/suite-peak', { admin: true });
});

test('content: HTML is sanitised against script injection', async () => {
  const payloads = '<p>ok <strong>bold</strong> <a href="/treks">link</a></p><script>alert(1)</script><img src=x onerror=alert(1)>' +
    '<a href="javascript:alert(1)">a</a><a href="&#106;avascript:alert(1)">b</a><svg onload=alert(1)></svg><iframe srcdoc="x"></iframe>';
  const r = await req('POST', '/api/admin/stories', { admin: true, body: { data: { title: 'Suite Story', date: '2026-09-16', body: [{ t: 'p', html: payloads }] }, published: true } });
  assert.equal(r.status, 201, r.text);
  const html = r.json.item.data.body[0].html;
  assert.match(html, /<strong>bold<\/strong> <a href="\/treks">link<\/a>/);
  assert.doesNotMatch(html, /script|onerror|javascript|&#106;|svg|iframe|srcdoc/i);
  await req('DELETE', '/api/admin/stories/suite-story', { admin: true });
});

test('content: reorder renumbers cleanly', async () => {
  const before = (await req('GET', '/api/admin/stories', { admin: true })).json.items.map((i) => i.slug);
  await req('POST', '/api/admin/stories/' + before[1] + '/move', { admin: true, body: { direction: 'up' } });
  const afterList = (await req('GET', '/api/admin/stories', { admin: true })).json.items;
  assert.equal(afterList[0].slug, before[1]);
  assert.deepEqual(afterList.map((i) => i.sort_order), afterList.map((_, i) => i + 1));
});

/* ------------------------------------------------------------------ uploads */
test('uploads: real images only, safe names, served back', async () => {
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  const ok = await req('POST', '/api/admin/upload?folder=treks', { admin: true, raw: png, headers: { 'Content-Type': 'image/png', 'X-Filename': '%E0%A4%A' } });
  assert.equal(ok.status, 201, ok.text);
  assert.match(ok.json.url, /^\/uploads\/treks\/[a-z0-9-]+-[a-f0-9]{8}\.png$/);
  assert.equal((await req('GET', ok.json.url)).status, 200);
  assert.equal((await req('POST', '/api/admin/upload?folder=treks', { admin: true, raw: Buffer.from('<svg onload=alert(1)>'), headers: { 'Content-Type': 'image/png' } })).status, 415);
  assert.equal((await req('POST', '/api/admin/upload?folder=../../etc', { admin: true, raw: png, headers: { 'Content-Type': 'image/png' } })).status, 400);
});

/* ------------------------------------------------------------------ bookings admin */
test('bookings admin: status history, notes, pagination, csv, delete', async () => {
  const made = await req('POST', '/api/bookings', { body: booking({ message: 'history test' }) });
  const found = (await req('GET', '/api/admin/bookings?q=' + made.json.ref, { admin: true })).json.items[0];

  const s1 = await req('PATCH', '/api/admin/bookings/' + found.id, { admin: true, body: { status: 'CONTACTED' } });
  const s2 = await req('PATCH', '/api/admin/bookings/' + found.id, { admin: true, body: { status: 'CONFIRMED', notes: 'Deposit agreed' } });
  assert.equal(s1.json.item.status, 'CONTACTED');
  const hist = s2.json.item.history;
  assert.equal(hist.length, 4);
  assert.deepEqual(hist.slice(1, 3).map((h) => [h.from, h.status, h.by]), [['NEW', 'CONTACTED', 'owner@example.test'], ['CONTACTED', 'CONFIRMED', 'owner@example.test']]);
  assert.equal((await req('PATCH', '/api/admin/bookings/' + found.id, { admin: true, body: { status: 'HACKED' } })).status, 400);
  assert.equal((await req('PATCH', '/api/admin/bookings/bkg_nope', { admin: true, body: { status: 'NEW' } })).status, 404);

  const page = await req('GET', '/api/admin/bookings?pageSize=2&page=1', { admin: true });
  assert.equal(page.json.items.length, 2);
  assert.ok(page.json.total >= 5);
  assert.equal(page.json.pages, Math.ceil(page.json.total / 2));
  const confirmed = await req('GET', '/api/admin/bookings?status=CONFIRMED', { admin: true });
  assert.ok(confirmed.json.items.every((b) => b.status === 'CONFIRMED'));

  const csv = await req('GET', '/api/admin/bookings.csv', { admin: true });
  assert.match(csv.headers.get('content-type'), /text\/csv/);
  assert.match(csv.text, new RegExp(made.json.ref));

  const pulse = await req('GET', '/api/admin/pulse', { admin: true });
  assert.equal(typeof pulse.json.newBookings, 'number');

  assert.equal((await req('DELETE', '/api/admin/bookings/' + found.id, { admin: true })).status, 200);
  assert.equal((await req('GET', '/api/admin/bookings?q=' + made.json.ref, { admin: true })).json.total, 0);
});

test('csv export guards against spreadsheet formula injection', async () => {
  const r = await req('POST', '/api/bookings', { body: booking({ name: '=HYPERLINK("http://evil")', message: '+cmd' }) });
  const csv = await req('GET', '/api/admin/bookings.csv?q=' + r.json.ref, { admin: true });
  assert.match(csv.text, /"'=HYPERLINK/);
  assert.match(csv.text, /"'\+cmd"/);
});

test('logout ends the session', async () => {
  const login = await req('POST', '/api/admin/login', { body: { email: 'owner@example.test', password: PASSWORD } });
  const c2 = login.headers.get('set-cookie').split(';')[0];
  const out = await fetch(BASE + '/api/admin/logout', { method: 'POST', headers: { Cookie: c2, 'X-HMA-Admin': '1' } });
  assert.match(out.headers.get('set-cookie'), /hma_admin=;/);
});
