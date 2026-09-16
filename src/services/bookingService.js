const crypto = require('crypto');
const { driver } = require('../data');
const content = require('./contentService');
const notify = require('./notifyService');

const STATUSES = ['NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
const SOURCES = ['contact-form', 'trip-page', 'newsletter'];
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

const httpError = content.httpError;

const text = (v, max) => (typeof v === 'string' || typeof v === 'number' ? String(v) : '')
  .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim().slice(0, max);

function makeRef() {
  const d = new Date();
  const ymd = String(d.getUTCFullYear()).slice(2) + String(d.getUTCMonth() + 1).padStart(2, '0') + String(d.getUTCDate()).padStart(2, '0');
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let tail = '';
  crypto.randomBytes(5).forEach((b) => { tail += alphabet[b % alphabet.length]; });
  return 'HMA-' + ymd + '-' + tail;
}

async function resolveTrip(slug, type) {
  if (!slug) return null;
  const collections = type === 'expedition' ? ['expeditions'] : type === 'trek' ? ['treks'] : ['treks', 'expeditions'];
  for (const c of collections) {
    const rows = await content.list(c);
    const hit = rows.find((r) => r.slug === slug);
    if (hit) return { type: c === 'treks' ? 'trek' : 'expedition', slug: hit.slug, name: hit.title };
  }
  return null;
}

async function create(input, meta = {}) {
  const body = input || {};
  // Honeypot: real visitors never see or fill this field.
  if (text(body.website, 200)) return { ref: makeRef(), spam: true };

  const source = SOURCES.indexOf(body.source) > -1 ? body.source : 'contact-form';
  const name = text(body.name, 120);
  const email = text(body.email, 200).toLowerCase();
  const issues = [];
  if (source !== 'newsletter' && name.length < 2) issues.push('Please enter your full name.');
  if (!EMAIL_RE.test(email)) issues.push('Please enter a valid email address.');

  const peopleRaw = parseInt(body.people != null ? body.people : body.crew, 10);
  const people = Number.isFinite(peopleRaw) ? Math.max(1, Math.min(50, peopleRaw)) : 1;

  let preferredDate = text(body.preferred_date || body.preferredDate, 10) || null;
  if (preferredDate && (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate) || isNaN(Date.parse(preferredDate)))) {
    issues.push('Preferred date must be a valid date.');
  }
  if (issues.length) {
    const e = httpError(400, issues.join(' '));
    e.issues = issues;
    throw e;
  }

  const tripSlug = text(body.trip_slug || body.tripSlug, 80);
  const trip = await resolveTrip(tripSlug, text(body.trip_type, 20)).catch(() => null);
  const tripName = trip ? trip.name : text(body.trip_name || body.trek, 200) || (source === 'newsletter' ? 'Field Journal newsletter' : 'Custom / undecided');

  const row = {
    ref: makeRef(),
    name: name || 'Newsletter subscriber',
    email,
    phone: text(body.phone, 40) || null,
    trip_type: trip ? trip.type : (source === 'newsletter' ? 'newsletter' : 'custom'),
    trip_slug: trip ? trip.slug : null,
    trip_name: tripName,
    preferred_date: preferredDate,
    people,
    message: text(body.message, 5000) || null,
    status: 'NEW',
    notes: null,
    source,
    user_agent: text(meta.userAgent, 300) || null
  };

  let saved = null;
  try {
    saved = await driver.insertBooking(row);
  } catch (err) {
    console.error('[booking] could not store booking ' + row.ref + ':', err.message);
  }
  const mailed = source === 'newsletter' ? false : await notify.bookingReceived(saved || row).catch((err) => {
    console.error('[booking] notification failed for ' + row.ref + ':', err.message);
    return false;
  });
  if (!saved && !mailed) {
    throw httpError(503, 'We could not submit your request right now. Please try again, or message us on WhatsApp.');
  }
  return saved || row;
}

async function list({ status, source, q } = {}) {
  let rows = await driver.listBookings();
  if (status && STATUSES.indexOf(status) > -1) rows = rows.filter((r) => r.status === status);
  if (source) rows = rows.filter((r) => r.source === source);
  if (q) {
    const needle = String(q).toLowerCase();
    rows = rows.filter((r) => [r.ref, r.name, r.email, r.phone, r.trip_name, r.message].some((v) => v && String(v).toLowerCase().indexOf(needle) > -1));
  }
  return rows;
}

async function update(id, body) {
  const patch = {};
  if (body.status != null) {
    if (STATUSES.indexOf(body.status) < 0) throw httpError(400, 'Unknown status.');
    patch.status = body.status;
  }
  if (body.notes != null) patch.notes = text(body.notes, 5000) || null;
  if (!Object.keys(patch).length) throw httpError(400, 'Nothing to update.');
  return driver.updateBooking(id, patch);
}

async function remove(id) {
  return driver.deleteBooking(id);
}

async function counts() {
  const rows = await driver.listBookings();
  const out = { total: rows.length };
  STATUSES.forEach((s) => { out[s] = rows.filter((r) => r.status === s).length; });
  out.recent = rows.slice(0, 6);
  return out;
}

function toCsv(rows) {
  const cols = ['ref', 'created_at', 'status', 'name', 'email', 'phone', 'trip_type', 'trip_name', 'preferred_date', 'people', 'source', 'message', 'notes'];
  const cell = (v) => {
    let s = v == null ? '' : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // spreadsheet formula injection guard
    return '"' + s.replace(/"/g, '""') + '"';
  };
  return [cols.join(',')].concat(rows.map((r) => cols.map((c) => cell(r[c])).join(','))).join('\r\n') + '\r\n';
}

module.exports = { STATUSES, SOURCES, create, list, update, remove, counts, toCsv };
