/* Supabase (Postgres + Storage) driver — used when SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY are set. Talks to PostgREST / Storage over HTTPS
 * with the service-role key, which never leaves the server. Tables and the
 * storage bucket are created by supabase/schema.sql. RLS is enabled with no
 * public policies, so the database is reachable only through this server. */
const env = require('../../config/env');

const { url, serviceKey, bucket } = env.supabase;
const TIMEOUT_MS = 10000;
const TABLES = new Set(['treks', 'expeditions', 'stories', 'bookings']);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function table(name) {
  if (!TABLES.has(name)) throw new Error('Unknown table ' + name);
  return name;
}

function httpError(status, message, code) {
  const e = new Error(message);
  e.status = status;
  if (code) e.code = code;
  return e;
}

/* Returns { json, res }. Maps Postgres / PostgREST errors to meaningful HTTP statuses. */
async function request(path, { method = 'GET', body, headers = {}, raw = false, retries = method === 'GET' ? 1 : 0 } = {}) {
  for (let attempt = 0; ; attempt++) {
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
        const pgCode = json && json.code;
        if (pgCode === '23505') throw httpError(409, /idempotency/.test(text) ? 'Duplicate submission.' : 'Slug already in use.', /idempotency/.test(text) ? 'DUPLICATE' : undefined);
        if (pgCode === '22P02' || pgCode === 'PGRST116') throw httpError(404, 'Not found.');
        if (pgCode === '23514') throw httpError(400, 'A value was rejected by the database: ' + ((json && json.message) || 'check constraint'));
        if (res.status === 401 || res.status === 403) throw httpError(502, 'Database rejected the server key — check SUPABASE_SERVICE_ROLE_KEY.');
        if (res.status >= 500 && attempt < retries) continue;
        const msg = (json && (json.message || json.error || json.msg)) || text || res.statusText;
        throw httpError(502, 'Database error: ' + msg);
      }
      return { json, res };
    } catch (err) {
      if (err.name === 'AbortError') {
        if (attempt < retries) continue;
        throw httpError(504, 'Database request timed out.');
      }
      if (!err.status && attempt < retries) continue;
      if (!err.status) throw httpError(502, 'Could not reach the database: ' + err.message);
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
}

const eq = (v) => 'eq.' + encodeURIComponent(v);
const strip = (row) => { const b = Object.assign({}, row); delete b.id; delete b.created_at; delete b.updated_at; return b; };

/* PostgREST `or` filter values cannot contain its own syntax characters. */
const safeTerm = (q) => String(q).replace(/[,()*:"\\%]/g, ' ').trim().slice(0, 80);

module.exports = {
  name: 'supabase',

  async ping() {
    await request('/rest/v1/treks?select=slug&limit=1', { retries: 0 });
    return true;
  },

  /* ---------------- content ---------------- */
  async listContent(collection) {
    return (await request('/rest/v1/' + table(collection) + '?select=*&order=sort_order.asc,created_at.asc')).json;
  },
  async getContent(collection, slug) {
    const { json } = await request('/rest/v1/' + table(collection) + '?select=*&slug=' + eq(slug) + '&limit=1');
    return json && json[0] ? json[0] : null;
  },
  async insertContent(collection, row) {
    const { json } = await request('/rest/v1/' + table(collection), { method: 'POST', body: strip(row) });
    return json[0];
  },
  async updateContent(collection, slug, patch, opts = {}) {
    let filter = '?slug=' + eq(slug);
    if (opts.expectedUpdatedAt) filter += '&updated_at=' + eq(opts.expectedUpdatedAt);
    const { json } = await request('/rest/v1/' + table(collection) + filter, { method: 'PATCH', body: strip(patch) });
    if (!json || !json.length) {
      if (opts.expectedUpdatedAt && await this.getContent(collection, slug)) {
        throw httpError(409, 'This entry was changed somewhere else since you opened it.', 'STALE');
      }
      throw httpError(404, 'Entry not found.');
    }
    return json[0];
  },
  async deleteContent(collection, slug) {
    const { json } = await request('/rest/v1/' + table(collection) + '?slug=' + eq(slug), { method: 'DELETE' });
    if (!json || !json.length) throw httpError(404, 'Entry not found.');
    return true;
  },
  async reorderContent(collection, slugs) {
    // Small collections (tens of rows): one PATCH per changed row.
    const rows = await this.listContent(collection);
    const current = new Map(rows.map((r) => [r.slug, r.sort_order]));
    for (let i = 0; i < slugs.length; i++) {
      if (current.get(slugs[i]) !== i + 1) {
        await request('/rest/v1/' + table(collection) + '?slug=' + eq(slugs[i]), { method: 'PATCH', body: { sort_order: i + 1 }, headers: { Prefer: 'return=minimal' } });
      }
    }
    return true;
  },
  async upsertContent(collection, rows) {
    return (await request('/rest/v1/' + table(collection) + '?on_conflict=slug', {
      method: 'POST', body: rows.map(strip), headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }
    })).json;
  },

  /* ---------------- bookings ---------------- */
  async listBookings(filter = {}) {
    const limit = Math.max(1, Math.min(500, filter.limit || 50));
    const offset = Math.max(0, filter.offset || 0);
    let qs = '?select=*&order=created_at.desc&limit=' + limit + '&offset=' + offset;
    if (filter.status) qs += '&status=' + eq(filter.status);
    if (filter.source) qs += '&source=' + eq(filter.source);
    const term = filter.q ? safeTerm(filter.q) : '';
    if (term) {
      const like = encodeURIComponent('*' + term + '*');
      qs += '&or=(' + ['ref', 'name', 'email', 'phone', 'trip_name', 'message'].map((c) => c + '.ilike.' + like).join(',') + ')';
    }
    const { json, res } = await request('/rest/v1/bookings' + qs, { headers: { Prefer: 'count=exact' } });
    const range = res.headers.get('content-range') || '';
    const total = parseInt(range.split('/')[1], 10);
    return { items: json || [], total: Number.isFinite(total) ? total : (json || []).length };
  },
  async bookingStatusCounts() {
    const out = {};
    for (const s of ['NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED']) {
      const { res } = await request('/rest/v1/bookings?select=id&limit=1&status=' + eq(s), { headers: { Prefer: 'count=exact' } });
      const n = parseInt((res.headers.get('content-range') || '').split('/')[1], 10);
      out[s] = Number.isFinite(n) ? n : 0;
    }
    return out;
  },
  async getBooking(id) {
    if (!UUID_RE.test(id)) return null;
    const { json } = await request('/rest/v1/bookings?select=*&id=' + eq(id) + '&limit=1');
    return json && json[0] ? json[0] : null;
  },
  async findBookingByKey(key) {
    const { json } = await request('/rest/v1/bookings?select=*&idempotency_key=' + eq(key) + '&limit=1');
    return json && json[0] ? json[0] : null;
  },
  async recentBookingsByEmail(email, sinceIso) {
    const { json } = await request('/rest/v1/bookings?select=*&email=' + eq(email) + '&created_at=gte.' + encodeURIComponent(sinceIso) + '&order=created_at.desc&limit=20');
    return json || [];
  },
  async insertBooking(row) {
    const { json } = await request('/rest/v1/bookings', { method: 'POST', body: row });
    return json[0];
  },
  async updateBooking(id, patch) {
    if (!UUID_RE.test(id)) throw httpError(404, 'Booking not found.');
    const { json } = await request('/rest/v1/bookings?id=' + eq(id), { method: 'PATCH', body: patch });
    if (!json || !json.length) throw httpError(404, 'Booking not found.');
    return json[0];
  },
  async deleteBooking(id) {
    if (!UUID_RE.test(id)) throw httpError(404, 'Booking not found.');
    const { json } = await request('/rest/v1/bookings?id=' + eq(id), { method: 'DELETE' });
    if (!json || !json.length) throw httpError(404, 'Booking not found.');
    return true;
  },

  /* ---------------- media ---------------- */
  async saveMedia(folder, filename, buffer, mime) {
    const objectPath = encodeURIComponent(folder) + '/' + encodeURIComponent(filename);
    await request('/storage/v1/object/' + encodeURIComponent(bucket) + '/' + objectPath, {
      method: 'POST', raw: true, body: buffer,
      headers: { 'Content-Type': mime, 'x-upsert': 'false', 'Cache-Control': 'public, max-age=31536000, immutable' }
    });
    return url + '/storage/v1/object/public/' + encodeURIComponent(bucket) + '/' + objectPath;
  }
};
