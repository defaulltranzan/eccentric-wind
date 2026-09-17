/* Local JSON-file storage — zero setup, used whenever Supabase is not configured.
 *   <dataDir>/content/{treks,expeditions,stories}.json   content (committed to git)
 *   <dataDir>/private/bookings.json                      customer bookings (git-ignored)
 *   <uploadDir>/<folder>/                                uploaded images
 * dataDir defaults to ./data (HMA_DATA_DIR overrides it — the test suite uses a temp copy).
 * On Vercel the filesystem is read-only: content still reads from the repo copy,
 * but every write throws a ReadOnlyError telling the admin to configure Supabase. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const env = require('../../config/env');

const CONTENT_DIR = path.join(env.dataDir, 'content');
const PRIVATE_DIR = path.join(env.dataDir, 'private');

class ReadOnlyError extends Error {
  constructor() {
    super('This deployment cannot save changes: the server filesystem is read-only. Configure Supabase (see .env.example) to edit content and store bookings in production.');
    this.status = 503;
    this.code = 'READ_ONLY';
  }
}

const fileFor = (collection) => collection === 'bookings'
  ? path.join(PRIVATE_DIR, 'bookings.json')
  : path.join(CONTENT_DIR, collection + '.json');

const cache = new Map(); // file → { mtimeMs, size, rows }
const queues = new Map(); // file → promise chain (serialises writes)

function readRows(collection) {
  const file = fileFor(collection);
  let stat;
  try { stat = fs.statSync(file); } catch (_) { return []; }
  const hit = cache.get(file);
  if (hit && hit.mtimeMs === stat.mtimeMs && hit.size === stat.size) return hit.rows;
  let rows;
  try {
    rows = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    const e = new Error('Storage file ' + path.basename(file) + ' is not valid JSON: ' + err.message);
    e.status = 500;
    throw e;
  }
  if (!Array.isArray(rows)) rows = [];
  cache.set(file, { mtimeMs: stat.mtimeMs, size: stat.size, rows });
  return rows;
}

function mutate(collection, fn) {
  if (env.onVercel) return Promise.reject(new ReadOnlyError());
  const file = fileFor(collection);
  const prev = queues.get(file) || Promise.resolve();
  const next = prev.catch(() => {}).then(() => {
    // Work on a deep copy so a failed write can never corrupt the in-memory cache.
    const rows = JSON.parse(JSON.stringify(readRows(collection)));
    const result = fn(rows);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const tmp = file + '.' + process.pid + '.' + crypto.randomBytes(3).toString('hex') + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(rows, null, 2) + '\n');
    fs.renameSync(tmp, file);
    const stat = fs.statSync(file);
    cache.set(file, { mtimeMs: stat.mtimeMs, size: stat.size, rows });
    return result;
  });
  queues.set(file, next);
  return next;
}

const clone = (v) => (v == null ? v : JSON.parse(JSON.stringify(v)));
const newId = (prefix) => prefix + '_' + crypto.randomBytes(8).toString('hex');
const nowIso = () => new Date().toISOString();

function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

function matchesBooking(r, { status, source, q }) {
  if (status && r.status !== status) return false;
  if (source && r.source !== source) return false;
  if (q) {
    const needle = String(q).toLowerCase();
    return [r.ref, r.name, r.email, r.phone, r.trip_name, r.message].some((v) => v && String(v).toLowerCase().indexOf(needle) > -1);
  }
  return true;
}

module.exports = {
  name: 'file',
  ReadOnlyError,

  async ping() {
    readRows('treks');
    return true;
  },

  /* ---------------- content ---------------- */
  async listContent(collection) {
    return clone(readRows(collection));
  },
  async getContent(collection, slug) {
    return clone(readRows(collection).find((r) => r.slug === slug) || null);
  },
  async insertContent(collection, row) {
    return mutate(collection, (rows) => {
      if (rows.some((r) => r.slug === row.slug)) throw httpError(409, 'Slug already in use.');
      const now = nowIso();
      const created = Object.assign({ id: newId(collection.slice(0, 3)) }, row, { created_at: now, updated_at: now });
      rows.push(created);
      return clone(created);
    });
  },
  /* opts.expectedUpdatedAt → optimistic concurrency: refuse if someone saved in between. */
  async updateContent(collection, slug, patch, opts = {}) {
    return mutate(collection, (rows) => {
      const i = rows.findIndex((r) => r.slug === slug);
      if (i < 0) throw httpError(404, 'Entry not found.');
      if (opts.expectedUpdatedAt && rows[i].updated_at !== opts.expectedUpdatedAt) {
        const e = httpError(409, 'This entry was changed somewhere else since you opened it.');
        e.code = 'STALE';
        throw e;
      }
      if (patch.slug && patch.slug !== slug && rows.some((r) => r.slug === patch.slug)) throw httpError(409, 'Slug already in use.');
      rows[i] = Object.assign({}, rows[i], patch, { id: rows[i].id, created_at: rows[i].created_at, updated_at: nowIso() });
      return clone(rows[i]);
    });
  },
  async deleteContent(collection, slug) {
    return mutate(collection, (rows) => {
      const i = rows.findIndex((r) => r.slug === slug);
      if (i < 0) throw httpError(404, 'Entry not found.');
      rows.splice(i, 1);
      return true;
    });
  },
  async reorderContent(collection, slugs) {
    return mutate(collection, (rows) => {
      const pos = new Map(slugs.map((s, i) => [s, i + 1]));
      rows.forEach((r) => { if (pos.has(r.slug)) r.sort_order = pos.get(r.slug); });
      rows.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      return true;
    });
  },

  /* ---------------- bookings ---------------- */
  async listBookings(filter = {}) {
    const all = readRows('bookings').slice().sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
    const rows = all.filter((r) => matchesBooking(r, filter));
    const offset = Math.max(0, filter.offset || 0);
    const limit = Math.max(1, Math.min(500, filter.limit || 50));
    return { items: clone(rows.slice(offset, offset + limit)), total: rows.length };
  },
  async bookingStatusCounts() {
    const out = {};
    readRows('bookings').forEach((r) => { out[r.status] = (out[r.status] || 0) + 1; });
    return out;
  },
  async getBooking(id) {
    return clone(readRows('bookings').find((r) => r.id === id) || null);
  },
  async findBookingByKey(key) {
    return clone(readRows('bookings').find((r) => r.idempotency_key && r.idempotency_key === key) || null);
  },
  async recentBookingsByEmail(email, sinceIso) {
    return clone(readRows('bookings').filter((r) => r.email === email && (r.created_at || '') >= sinceIso));
  },
  async insertBooking(row) {
    return mutate('bookings', (rows) => {
      if (row.idempotency_key && rows.some((r) => r.idempotency_key === row.idempotency_key)) {
        const e = httpError(409, 'Duplicate submission.');
        e.code = 'DUPLICATE';
        throw e;
      }
      const now = nowIso();
      const created = Object.assign({ id: newId('bkg') }, row, { created_at: now, updated_at: now });
      rows.push(created);
      return clone(created);
    });
  },
  async updateBooking(id, patch) {
    return mutate('bookings', (rows) => {
      const i = rows.findIndex((r) => r.id === id);
      if (i < 0) throw httpError(404, 'Booking not found.');
      rows[i] = Object.assign({}, rows[i], patch, { id, created_at: rows[i].created_at, updated_at: nowIso() });
      return clone(rows[i]);
    });
  },
  async deleteBooking(id) {
    return mutate('bookings', (rows) => {
      const i = rows.findIndex((r) => r.id === id);
      if (i < 0) throw httpError(404, 'Booking not found.');
      rows.splice(i, 1);
      return true;
    });
  },

  /* ---------------- media ---------------- */
  async saveMedia(folder, filename, buffer) {
    if (env.onVercel) throw new ReadOnlyError();
    const dir = path.join(env.uploadDir, folder);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), buffer, { flag: 'wx' });
    return '/uploads/' + folder + '/' + filename;
  }
};
