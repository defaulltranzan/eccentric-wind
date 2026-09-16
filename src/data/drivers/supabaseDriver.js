/* Supabase (Postgres + Storage) driver — used when SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY are set. Talks to PostgREST / Storage over HTTPS
 * with the service-role key, which never leaves the server. Tables and the
 * storage bucket are created by supabase/schema.sql. RLS is enabled with no
 * public policies, so the database is reachable only through this server. */
const env = require('../../config/env');

const { url, serviceKey, bucket } = env.supabase;
const TIMEOUT_MS = 10000;
const TABLES = new Set(['treks', 'expeditions', 'stories', 'bookings']);

function table(name) {
  if (!TABLES.has(name)) throw new Error('Unknown table ' + name);
  return name;
}

async function request(path, { method = 'GET', body, headers = {}, raw = false } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url + path, {
      method,
      signal: ctrl.signal,
      headers: Object.assign({
        apikey: serviceKey,
        Authorization: 'Bearer ' + serviceKey
      }, raw ? {} : { 'Content-Type': 'application/json', Prefer: 'return=representation' }, headers),
      body: raw ? body : (body === undefined ? undefined : JSON.stringify(body))
    });
    const text = await res.text();
    let json = null;
    try { json = text ? JSON.parse(text) : null; } catch (_) { json = null; }
    if (!res.ok) {
      const msg = (json && (json.message || json.error || json.msg)) || text || res.statusText;
      const e = new Error('Database error: ' + msg);
      e.status = res.status === 409 || (json && json.code === '23505') ? 409 : 502;
      if (e.status === 409) e.message = 'Slug already in use.';
      throw e;
    }
    return json;
  } catch (err) {
    if (err.name === 'AbortError') {
      const e = new Error('Database request timed out.');
      e.status = 504;
      throw e;
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

const eq = (v) => 'eq.' + encodeURIComponent(v);

module.exports = {
  name: 'supabase',

  async listContent(collection) {
    return request('/rest/v1/' + table(collection) + '?select=*&order=sort_order.asc,created_at.asc');
  },
  async getContent(collection, slug) {
    const rows = await request('/rest/v1/' + table(collection) + '?select=*&slug=' + eq(slug) + '&limit=1');
    return rows && rows[0] ? rows[0] : null;
  },
  async insertContent(collection, row) {
    const body = Object.assign({}, row);
    delete body.id; delete body.created_at; delete body.updated_at;
    const rows = await request('/rest/v1/' + table(collection), { method: 'POST', body });
    return rows[0];
  },
  async updateContent(collection, slug, patch) {
    const body = Object.assign({}, patch);
    delete body.id; delete body.created_at; delete body.updated_at;
    const rows = await request('/rest/v1/' + table(collection) + '?slug=' + eq(slug), { method: 'PATCH', body });
    if (!rows || !rows.length) { const e = new Error('Entry not found.'); e.status = 404; throw e; }
    return rows[0];
  },
  async deleteContent(collection, slug) {
    const rows = await request('/rest/v1/' + table(collection) + '?slug=' + eq(slug), { method: 'DELETE' });
    if (!rows || !rows.length) { const e = new Error('Entry not found.'); e.status = 404; throw e; }
    return true;
  },
  async upsertContent(collection, rows) {
    const body = rows.map((r) => { const b = Object.assign({}, r); delete b.id; delete b.created_at; delete b.updated_at; return b; });
    return request('/rest/v1/' + table(collection) + '?on_conflict=slug', {
      method: 'POST', body, headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }
    });
  },

  async listBookings() {
    return request('/rest/v1/bookings?select=*&order=created_at.desc&limit=5000');
  },
  async getBooking(id) {
    const rows = await request('/rest/v1/bookings?select=*&id=' + eq(id) + '&limit=1');
    return rows && rows[0] ? rows[0] : null;
  },
  async insertBooking(row) {
    const rows = await request('/rest/v1/bookings', { method: 'POST', body: row });
    return rows[0];
  },
  async updateBooking(id, patch) {
    const rows = await request('/rest/v1/bookings?id=' + eq(id), { method: 'PATCH', body: patch });
    if (!rows || !rows.length) { const e = new Error('Booking not found.'); e.status = 404; throw e; }
    return rows[0];
  },
  async deleteBooking(id) {
    const rows = await request('/rest/v1/bookings?id=' + eq(id), { method: 'DELETE' });
    if (!rows || !rows.length) { const e = new Error('Booking not found.'); e.status = 404; throw e; }
    return true;
  },

  async saveMedia(folder, filename, buffer, mime) {
    const objectPath = encodeURIComponent(folder) + '/' + encodeURIComponent(filename);
    await request('/storage/v1/object/' + encodeURIComponent(bucket) + '/' + objectPath, {
      method: 'POST', raw: true, body: buffer,
      headers: { 'Content-Type': mime, 'x-upsert': 'false', 'Cache-Control': 'public, max-age=31536000, immutable' }
    });
    return url + '/storage/v1/object/public/' + encodeURIComponent(bucket) + '/' + objectPath;
  }
};
