/* Bookings — the one entry point for every booking form (contact page, trip
 * pages, popup forms, newsletter box).
 *
 * Guarantees:
 *  · validation with a per-field error map (`fields`) a form can show inline
 *  · no duplicates: an Idempotency-Key (header or `idempotency_key` field) makes
 *    retries return the original booking; without one, the same email + trip +
 *    message inside 10 minutes is treated as a double-submit
 *  · spam: honeypot field + rate limit (route) — bots get a normal-looking reply
 *  · status history for every change, with who made it
 *  · the customer never waits on email: alerts are capped at a few seconds */
const crypto = require('crypto');
const { driver } = require('../data');
const content = require('./contentService');
const notify = require('./notifyService');

const STATUSES = ['NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
const SOURCES = ['contact-form', 'trip-page', 'popup', 'newsletter'];
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const KEY_RE = /^[A-Za-z0-9_-]{8,100}$/;
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;
const NOTIFY_WAIT_MS = 4000;
const MAX_DETAILS = 12;

const httpError = content.httpError;

const text = (v, max) => (typeof v === 'string' || typeof v === 'number' ? String(v) : '')
  .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim().slice(0, max);

/* Reference numbers carry the Kathmandu date (the desk that answers them). */
function kathmanduYmd() {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kathmandu', year: '2-digit', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const get = (t) => (parts.find((p) => p.type === t) || {}).value;
    if (get('year') && get('month') && get('day')) return get('year') + get('month') + get('day');
  } catch (_) { /* fall back to UTC */ }
  const d = new Date();
  return String(d.getUTCFullYear()).slice(2) + String(d.getUTCMonth() + 1).padStart(2, '0') + String(d.getUTCDate()).padStart(2, '0');
}

function makeRef() {
  const ymd = kathmanduYmd();
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let tail = '';
  crypto.randomBytes(5).forEach((b) => { tail += alphabet[b % alphabet.length]; });
  return 'HMA-' + ymd + '-' + tail;
}

/* Earliest acceptable preferred date: yesterday in UTC, so a visitor anywhere on earth can pick their own "today". */
function earliestDate() {
  return new Date(Date.now() - 864e5).toISOString().slice(0, 10);
}

async function resolveTrip(slug, type) {
  if (!slug) return null;
  const collections = type === 'expedition' ? ['expeditions'] : type === 'trek' ? ['treks'] : ['treks', 'expeditions'];
  for (const c of collections) {
    const rows = await content.list(c);
    const hit = rows.find((r) => r.slug === slug) ||
      rows.find((r) => r.data && Array.isArray(r.data.formerSlugs) && r.data.formerSlugs.indexOf(slug) > -1);
    if (hit) return { type: c === 'treks' ? 'trek' : 'expedition', slug: hit.slug, name: hit.title };
  }
  return null;
}

/* Free-form extras a popup may add (country, experience, budget, heard_about …). */
function cleanDetails(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {};
  const out = {};
  Object.keys(input).slice(0, MAX_DETAILS).forEach((k) => {
    const key = String(k).toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 40);
    if (!key || key === '__proto__' || key === 'constructor' || key === 'prototype') return;
    const v = input[k];
    if (typeof v === 'boolean') out[key] = v;
    else if (typeof v === 'number' && Number.isFinite(v)) out[key] = v;
    else if (typeof v === 'string' && v.trim()) out[key] = text(v, 500);
  });
  return out;
}

function validationError(fields) {
  const messages = Object.keys(fields).map((k) => fields[k]);
  const e = httpError(400, messages.join(' '));
  e.fields = fields;
  e.issues = messages;
  return e;
}

function withTimeout(promise, ms) {
  let timer;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise((resolve) => { timer = setTimeout(() => resolve('timeout'), ms); })
  ]);
}

async function create(input, meta = {}) {
  const body = input || {};
  const source = SOURCES.indexOf(body.source) > -1 ? body.source : 'contact-form';
  const idemKey = text(meta.idempotencyKey || body.idempotency_key, 100);

  // Honeypot: real visitors never see or fill this field. Bots get a plausible reply and nothing is stored.
  if (text(body.website || body.company_website, 200)) return { ref: makeRef(), source, spam: true };

  if (idemKey && KEY_RE.test(idemKey)) {
    const existing = await driver.findBookingByKey(idemKey).catch(() => null);
    if (existing) return Object.assign({}, existing, { replayed: true });
  }

  const fields = {};
  const popup = source === 'popup';
  const firstName = text(body.first_name, 60);
  const lastName = text(body.last_name, 60);
  if (popup) {
    if (!firstName) fields.first_name = 'Please enter your first name.';
    if (!lastName) fields.last_name = 'Please enter your last name.';
  }
  const name = firstName || lastName ? (firstName + ' ' + lastName).trim().slice(0, 120) : text(body.name, 120);
  const email = text(body.email, 200).toLowerCase();
  const phone = text(body.phone, 40);
  if (source !== 'newsletter' && !popup && name.length < 2) fields.name = 'Please enter your full name.';
  if (!email) fields.email = 'Please enter your email address.';
  else
  if (!EMAIL_RE.test(email)) fields.email = 'Please enter a valid email address.';
  if (popup && !phone) fields.phone = 'Please enter a phone or WhatsApp number so we can reach you.';
  else if (phone && (phone.replace(/\D/g, '').length < 6 || phone.replace(/\D/g, '').length > 15 || /[^\d\s+().\-/]/.test(phone))) fields.phone = 'Please enter a valid phone or WhatsApp number.';

  const peopleRaw = body.people != null && body.people !== '' ? body.people : body.crew;
  let people = 1;
  if (peopleRaw != null && peopleRaw !== '') {
    const n = Number(peopleRaw);
    if (!Number.isInteger(n) || n < 1 || n > 50) fields.people = 'Number of people must be between 1 and 50.';
    else people = n;
  }

  let preferredDate = text(body.preferred_date || body.preferredDate, 10) || null;
  const preferredMonth = text(body.preferred_month, 7) || null;
  let datePrecision = preferredDate ? 'day' : null;
  if (!preferredDate && preferredMonth) {
    const thisMonth = new Date().toISOString().slice(0, 7);
    const lastMonth = new Date(Date.now() - 864e5).toISOString().slice(0, 7);
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(preferredMonth)) fields.preferred_date = 'Please choose a valid month.';
    else if (preferredMonth < lastMonth && preferredMonth < thisMonth) fields.preferred_date = 'That month has already passed.';
    else if (preferredMonth > String(new Date().getUTCFullYear() + 3) + '-12') fields.preferred_date = 'Please choose a month within the next three years.';
    else { preferredDate = preferredMonth + '-01'; datePrecision = 'month'; }
  }
  if (popup && !preferredDate && !fields.preferred_date) fields.preferred_date = 'Please choose when you would like to travel.';
  if (preferredDate && datePrecision === 'day') {
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(preferredDate) && !isNaN(Date.parse(preferredDate + 'T00:00:00Z')) &&
      new Date(preferredDate + 'T00:00:00Z').toISOString().slice(0, 10) === preferredDate;
    if (!valid) fields.preferred_date = 'Please choose a valid date.';
    else if (preferredDate < earliestDate()) fields.preferred_date = 'The preferred date is in the past.';
    else if (preferredDate > String(new Date().getUTCFullYear() + 3) + '-12-31') fields.preferred_date = 'Please choose a date within the next three years.';
  }
  const message = text(body.message, 5000);
  if (Object.keys(fields).length) throw validationError(fields);

  const tripSlug = text(body.trip_slug || body.tripSlug, 80);
  const trip = await resolveTrip(tripSlug, text(body.trip_type, 20)).catch(() => null);
  if (popup && !trip && !text(body.trip_name, 200)) throw validationError({ trip: 'Please choose a trek or expedition.' });
  const tripName = trip ? trip.name : text(body.trip_name || body.trek, 200) || (source === 'newsletter' ? 'Field Journal newsletter' : 'Custom / undecided');

  // Without a key: same person, same trip, same message within 10 minutes = a double-submit.
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
  const recent = await driver.recentBookingsByEmail(email, since).catch(() => []);
  const dup = recent.find((r) => r.trip_name === tripName && (r.message || '') === (message || '') && r.source === source &&
    Number(r.people) === people && (r.preferred_date || null) === (preferredDate || null) && (r.phone || null) === (phone || null));
  if (dup) return Object.assign({}, dup, { replayed: true });

  const row = {
    ref: makeRef(),
    idempotency_key: idemKey && KEY_RE.test(idemKey) ? idemKey : null,
    name: name || 'Newsletter subscriber',
    email,
    phone: phone || null,
    trip_type: trip ? trip.type : (source === 'newsletter' ? 'newsletter' : 'custom'),
    trip_slug: trip ? trip.slug : null,
    trip_name: tripName,
    preferred_date: preferredDate,
    people,
    message: message || null,
    details: Object.assign(cleanDetails(body.details),
      firstName ? { first_name: firstName } : {},
      lastName ? { last_name: lastName } : {},
      text(body.country, 80) ? { country: text(body.country, 80) } : {},
      datePrecision === 'month' ? { date_precision: 'month' } : {}),
    status: 'NEW',
    notes: null,
    history: [{ at: new Date().toISOString(), status: 'NEW', by: 'website' }],
    source,
    page_url: text(body.page_url || meta.referer, 500) || null,
    user_agent: text(meta.userAgent, 300) || null
  };

  let saved = null;
  try {
    saved = await driver.insertBooking(row);
  } catch (err) {
    if (err.code === 'DUPLICATE' && row.idempotency_key) {
      const existing = await driver.findBookingByKey(row.idempotency_key).catch(() => null);
      if (existing) return Object.assign({}, existing, { replayed: true });
    }
    console.error('[booking] could not store booking ' + row.ref + ':', err.message);
  }

  let mailed = false;
  if (source !== 'newsletter' && notify.enabled()) {
    const sending = notify.bookingReceived(saved || row).catch((err) => {
      console.error('[booking] notification failed for ' + row.ref + ':', err.message);
      return false;
    });
    // If nothing was stored, the email is the only record — wait for it fully.
    const result = saved ? await withTimeout(sending, NOTIFY_WAIT_MS) : await sending;
    mailed = result === true || result === 'timeout';
  }
  if (!saved && !mailed) {
    throw httpError(503, 'We could not submit your request right now. Please try again in a moment, or message us on WhatsApp.');
  }
  return saved || row;
}

function publicView(b) {
  return {
    ref: b.ref,
    source: b.source,
    trip_name: b.trip_name,
    people: b.people,
    preferred_date: b.preferred_date,
    email: b.email,
    replayed: !!b.replayed
  };
}

async function list({ status, source, q, page, pageSize } = {}) {
  const size = Math.max(1, Math.min(200, parseInt(pageSize, 10) || 50));
  const p = Math.max(1, parseInt(page, 10) || 1);
  const { items, total } = await driver.listBookings({
    status: STATUSES.indexOf(status) > -1 ? status : null,
    source: SOURCES.indexOf(source) > -1 ? source : null,
    q: q ? String(q).slice(0, 80) : null,
    limit: size,
    offset: (p - 1) * size
  });
  return { items, total, page: p, pageSize: size, pages: Math.max(1, Math.ceil(total / size)) };
}

async function all(filter = {}) {
  const out = [];
  for (let page = 1; page <= 200; page++) {
    const res = await list(Object.assign({}, filter, { page, pageSize: 200 }));
    out.push.apply(out, res.items);
    if (page >= res.pages) break;
  }
  return out;
}

async function update(id, body, actor) {
  const current = await driver.getBooking(id);
  if (!current) throw httpError(404, 'Booking not found.');
  const patch = {};
  const history = Array.isArray(current.history) ? current.history.slice(-99) : [];
  if (body.status != null) {
    if (STATUSES.indexOf(body.status) < 0) throw httpError(400, 'Unknown status.');
    if (body.status !== current.status) {
      patch.status = body.status;
      history.push({ at: new Date().toISOString(), status: body.status, from: current.status, by: actor || 'admin' });
    }
  }
  if (body.notes != null) {
    const notes = text(body.notes, 5000) || null;
    if (notes !== (current.notes || null)) {
      patch.notes = notes;
      history.push({ at: new Date().toISOString(), note: true, by: actor || 'admin' });
    }
  }
  if (!Object.keys(patch).length) return current;
  patch.history = history;
  return driver.updateBooking(id, patch);
}

async function remove(id) {
  return driver.deleteBooking(id);
}

async function counts() {
  const [byStatus, recent] = await Promise.all([
    driver.bookingStatusCounts(),
    driver.listBookings({ limit: 6, offset: 0 })
  ]);
  const out = { total: 0, recent: recent.items };
  STATUSES.forEach((s) => { out[s] = byStatus[s] || 0; out.total += out[s]; });
  return out;
}

function toCsv(rows) {
  const cols = ['ref', 'created_at', 'status', 'name', 'email', 'phone', 'trip_type', 'trip_name', 'preferred_date', 'people', 'source', 'message', 'details', 'notes'];
  const cell = (v) => {
    let s = v == null ? '' : (typeof v === 'object' ? JSON.stringify(v) : String(v));
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // spreadsheet formula injection guard
    return '"' + s.replace(/"/g, '""') + '"';
  };
  return [cols.join(',')].concat(rows.map((r) => cols.map((c) => cell(r[c])).join(','))).join('\r\n') + '\r\n';
}

module.exports = { STATUSES, SOURCES, create, publicView, list, all, update, remove, counts, toCsv };
