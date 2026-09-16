/* Local JSON-file storage — zero setup, used whenever Supabase is not configured.
 *   data/content/{treks,expeditions,stories}.json   content (committed to git)
 *   data/private/bookings.json                      customer bookings (git-ignored)
 *   public/uploads/<collection>/                    uploaded images
 * On Vercel the filesystem is read-only: content still reads from the repo copy,
 * but every write throws a ReadOnlyError telling the admin to configure Supabase. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const env = require('../../config/env');

const ROOT = path.join(__dirname, '../../..');
const CONTENT_DIR = path.join(ROOT, 'data', 'content');
const PRIVATE_DIR = path.join(ROOT, 'data', 'private');
const UPLOAD_DIR = path.join(ROOT, 'public', 'uploads');

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

const cache = new Map(); // file → { mtimeMs, rows }
const queues = new Map(); // file → promise chain (serialises writes)

function readRows(collection) {
  const file = fileFor(collection);
  let stat;
  try { stat = fs.statSync(file); } catch (_) { return []; }
  const hit = cache.get(file);
  if (hit && hit.mtimeMs === stat.mtimeMs) return hit.rows;
  const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
  cache.set(file, { mtimeMs: stat.mtimeMs, rows });
  return rows;
}

function mutate(collection, fn) {
  if (env.onVercel) return Promise.reject(new ReadOnlyError());
  const file = fileFor(collection);
  const prev = queues.get(file) || Promise.resolve();
  const next = prev.catch(() => {}).then(() => {
    const rows = readRows(collection).map((r) => r);
    const result = fn(rows);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const tmp = file + '.' + process.pid + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(rows, null, 2) + '\n');
    fs.renameSync(tmp, file);
    cache.set(file, { mtimeMs: fs.statSync(file).mtimeMs, rows });
    return result;
  });
  queues.set(file, next);
  return next;
}

const clone = (v) => (v == null ? v : JSON.parse(JSON.stringify(v)));
const newId = (prefix) => prefix + '_' + crypto.randomBytes(8).toString('hex');

function notFound(what) {
  const e = new Error(what + ' not found.');
  e.status = 404;
  return e;
}

module.exports = {
  name: 'file',
  ReadOnlyError,

  async listContent(collection) {
    return clone(readRows(collection));
  },
  async getContent(collection, slug) {
    return clone(readRows(collection).find((r) => r.slug === slug) || null);
  },
  async insertContent(collection, row) {
    return mutate(collection, (rows) => {
      if (rows.some((r) => r.slug === row.slug)) { const e = new Error('Slug already in use.'); e.status = 409; throw e; }
      const now = new Date().toISOString();
      const created = Object.assign({ id: newId(collection.slice(0, 3)) }, row, { created_at: now, updated_at: now });
      rows.push(created);
      return clone(created);
    });
  },
  async updateContent(collection, slug, patch) {
    return mutate(collection, (rows) => {
      const i = rows.findIndex((r) => r.slug === slug);
      if (i < 0) throw notFound('Entry');
      if (patch.slug && patch.slug !== slug && rows.some((r) => r.slug === patch.slug)) {
        const e = new Error('Slug already in use.'); e.status = 409; throw e;
      }
      rows[i] = Object.assign({}, rows[i], patch, { id: rows[i].id, created_at: rows[i].created_at, updated_at: new Date().toISOString() });
      return clone(rows[i]);
    });
  },
  async deleteContent(collection, slug) {
    return mutate(collection, (rows) => {
      const i = rows.findIndex((r) => r.slug === slug);
      if (i < 0) throw notFound('Entry');
      rows.splice(i, 1);
      return true;
    });
  },

  async listBookings() {
    return clone(readRows('bookings')).sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  },
  async getBooking(id) {
    return clone(readRows('bookings').find((r) => r.id === id) || null);
  },
  async insertBooking(row) {
    return mutate('bookings', (rows) => {
      const now = new Date().toISOString();
      const created = Object.assign({ id: newId('bkg') }, row, { created_at: now, updated_at: now });
      rows.push(created);
      return clone(created);
    });
  },
  async updateBooking(id, patch) {
    return mutate('bookings', (rows) => {
      const i = rows.findIndex((r) => r.id === id);
      if (i < 0) throw notFound('Booking');
      rows[i] = Object.assign({}, rows[i], patch, { id, created_at: rows[i].created_at, updated_at: new Date().toISOString() });
      return clone(rows[i]);
    });
  },
  async deleteBooking(id) {
    return mutate('bookings', (rows) => {
      const i = rows.findIndex((r) => r.id === id);
      if (i < 0) throw notFound('Booking');
      rows.splice(i, 1);
      return true;
    });
  },

  async saveMedia(folder, filename, buffer) {
    if (env.onVercel) throw new ReadOnlyError();
    const dir = path.join(UPLOAD_DIR, folder);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), buffer);
    return '/uploads/' + folder + '/' + filename;
  }
};
