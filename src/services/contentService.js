/* Treks, expeditions and stories — one service, three collections.
 * A row is { slug, title, published, featured, sort_order, kind, data } where
 * `data` is the exact record shape the existing page renderers already read
 * (TREKS[slug], MOUNTAINS[slug] / PEAKS_DATA[slug], STORIES[slug]). */
const { driver, fileDriver } = require('../data');

const COLLECTIONS = {
  treks: { label: 'Trek', titleKey: 'name', path: '/treks/' },
  expeditions: { label: 'Expedition', titleKey: 'name', path: '/expeditions/' },
  stories: { label: 'Story', titleKey: 'title', path: '/stories/' }
};
const EXPEDITION_KINDS = ['peak', 'eight-thousander'];
const PEAK_CATEGORIES = ['8000', '7000', '6000', 'trekking'];
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_RECORD_BYTES = 1024 * 1024;
const CACHE_MS = 30 * 1000;

function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

function assertCollection(collection) {
  if (!COLLECTIONS[collection]) throw httpError(404, 'Unknown collection.');
  return COLLECTIONS[collection];
}

function slugify(s) {
  return String(s || '')
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

/* Defence in depth: admins are trusted, but strip the obvious script vectors
 * from every string before it can reach an innerHTML renderer. */
function cleanString(s) {
  return s
    .replace(/<\s*(script|iframe|object|embed|style)\b[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|iframe|object|embed|style)\b[^>]*>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*(["']?)\s*javascript:/gi, '$1=$2#');
}

function sanitize(value, depth) {
  if (depth > 12) throw httpError(400, 'Record is nested too deeply.');
  if (typeof value === 'string') return cleanString(value);
  if (Array.isArray(value)) return value.map((v) => sanitize(v, depth + 1));
  if (value && typeof value === 'object') {
    const out = {};
    Object.keys(value).forEach((k) => {
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') return;
      out[k] = sanitize(value[k], depth + 1);
    });
    return out;
  }
  if (typeof value === 'number' && !Number.isFinite(value)) return null;
  return value;
}

const isDate = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s));

function validate(collection, data, kind) {
  const issues = [];
  const str = (v) => typeof v === 'string' && v.trim().length > 0;
  if (collection === 'treks') {
    if (!str(data.name)) issues.push('Name is required.');
    if (data.itinerary != null && !Array.isArray(data.itinerary)) issues.push('Itinerary must be a list of days.');
  } else if (collection === 'expeditions') {
    if (!str(data.name)) issues.push('Name is required.');
    const elev = kind === 'eight-thousander' ? data.elevationM : data.elevation;
    if (!(typeof elev === 'number' && elev > 0 && elev < 9000)) issues.push('Elevation (metres) must be a number between 1 and 9,000.');
    if (kind === 'peak' && data.category != null && PEAK_CATEGORIES.indexOf(String(data.category)) < 0) issues.push('Category must be one of ' + PEAK_CATEGORIES.join(', ') + '.');
  } else if (collection === 'stories') {
    if (!str(data.title)) issues.push('Title is required.');
    if (!isDate(data.date)) issues.push('Publication date must be YYYY-MM-DD.');
    if (!Array.isArray(data.body)) issues.push('Article body is missing.');
  }
  if (issues.length) {
    const e = httpError(400, issues.join(' '));
    e.issues = issues;
    throw e;
  }
}

function prepareData(collection, input, slug, kind) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw httpError(400, 'Record must be an object.');
  const data = sanitize(input, 0);
  data.slug = slug;
  if (collection === 'expeditions' && kind === 'peak') {
    if (typeof data.elevation === 'string') data.elevation = Number(String(data.elevation).replace(/[^\d.]/g, ''));
    if (!data.category && typeof data.elevation === 'number') {
      data.category = data.elevation >= 8000 ? '8000' : data.elevation >= 7000 ? '7000' : data.elevation >= 6000 ? '6000' : 'trekking';
    }
    if (!data.elevationLabel && typeof data.elevation === 'number') data.elevationLabel = data.elevation.toLocaleString('en-US') + ' m';
  }
  if (Buffer.byteLength(JSON.stringify(data), 'utf8') > MAX_RECORD_BYTES) throw httpError(413, 'Record is too large (1 MB max).');
  validate(collection, data, kind);
  return data;
}

function rowMeta(collection, data) {
  const cfg = COLLECTIONS[collection];
  return {
    title: String(data[cfg.titleKey] || data.slug).slice(0, 200),
    featured: !!(data.featured || data.bestseller)
  };
}

/* ---------------------------------------------------------------- caching */
const listCache = new Map(); // collection → { at, rows, fallback }

function invalidate(collection) {
  listCache.delete(collection);
}

async function allRows(collection) {
  assertCollection(collection);
  const hit = listCache.get(collection);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit;
  let rows, fallback = false;
  try {
    rows = await driver.listContent(collection);
  } catch (err) {
    if (driver === fileDriver) throw err;
    console.error('[content] database unavailable, serving repository copy of ' + collection + ':', err.message);
    rows = await fileDriver.listContent(collection);
    fallback = true;
  }
  rows = (rows || []).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const entry = { at: Date.now(), rows, fallback };
  if (!fallback) listCache.set(collection, entry);
  return entry;
}

/* ---------------------------------------------------------------- queries */
async function list(collection, { includeDrafts = false } = {}) {
  const { rows } = await allRows(collection);
  return includeDrafts ? rows : rows.filter((r) => r.published);
}

async function summaries(collection) {
  const rows = await list(collection, { includeDrafts: true });
  return rows.map((r) => {
    const d = r.data || {};
    return {
      slug: r.slug,
      title: r.title,
      published: !!r.published,
      featured: !!r.featured,
      kind: r.kind || null,
      sort_order: r.sort_order,
      updated_at: r.updated_at,
      image: d.heroImage || null,
      subtitle: collection === 'treks' ? [d.region, d.stats && d.stats.duration].filter(Boolean).join(' · ')
        : collection === 'expeditions' ? [d.elevationLabel, d.range || d.region].filter(Boolean).join(' · ')
          : [d.category, d.date].filter(Boolean).join(' · ')
    };
  });
}

async function get(collection, slug) {
  assertCollection(collection);
  const row = await driver.getContent(collection, slug);
  if (!row) throw httpError(404, COLLECTIONS[collection].label + ' not found.');
  return row;
}

/* -------------------------------------------------------------- mutations */
async function create(collection, { data, published = false, kind } = {}) {
  const cfg = assertCollection(collection);
  const safe = data && typeof data === 'object' ? sanitize(data, 0) : {};
  const slug = slugify(safe.slug || safe[cfg.titleKey]);
  if (!SLUG_RE.test(slug)) throw httpError(400, 'Give it a name or slug using letters and numbers.');
  if (collection === 'expeditions') {
    kind = EXPEDITION_KINDS.indexOf(kind) > -1 ? kind : 'peak';
  } else {
    kind = collection === 'stories' ? (data && data.category) || null : null;
  }
  const clean = prepareData(collection, data, slug, kind);
  const existing = await driver.getContent(collection, slug);
  if (existing) throw httpError(409, 'The slug "' + slug + '" is already used — choose a different one.');
  const rows = await driver.listContent(collection);
  const maxOrder = rows.reduce((m, r) => Math.max(m, r.sort_order || 0), 0);
  const row = await driver.insertContent(collection, Object.assign({
    slug,
    published: !!published,
    sort_order: maxOrder + 1,
    kind,
    data: clean
  }, rowMeta(collection, clean)));
  invalidate(collection);
  return row;
}

async function update(collection, slug, { data, published } = {}) {
  assertCollection(collection);
  const current = await get(collection, slug);
  const nextSlug = data && data.slug ? slugify(data.slug) : slug;
  if (!SLUG_RE.test(nextSlug)) throw httpError(400, 'Slug may only contain lowercase letters, numbers and hyphens.');
  if (nextSlug !== slug && await driver.getContent(collection, nextSlug)) {
    throw httpError(409, 'The slug "' + nextSlug + '" is already used — choose a different one.');
  }
  const kind = collection === 'stories' ? (data && data.category) || current.kind : current.kind;
  const clean = prepareData(collection, data, nextSlug, current.kind);
  const patch = Object.assign({ slug: nextSlug, data: clean, kind }, rowMeta(collection, clean));
  if (typeof published === 'boolean') patch.published = published;
  const row = await driver.updateContent(collection, slug, patch);
  invalidate(collection);
  return row;
}

async function setPublished(collection, slug, published) {
  assertCollection(collection);
  const row = await driver.updateContent(collection, slug, { published: !!published });
  invalidate(collection);
  return row;
}

async function move(collection, slug, direction) {
  assertCollection(collection);
  const rows = (await driver.listContent(collection)).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const i = rows.findIndex((r) => r.slug === slug);
  if (i < 0) throw httpError(404, 'Entry not found.');
  const j = direction === 'up' ? i - 1 : i + 1;
  if (j < 0 || j >= rows.length) return rows[i];
  const a = rows[i], b = rows[j];
  const ao = a.sort_order || i + 1, bo = b.sort_order || j + 1;
  await driver.updateContent(collection, a.slug, { sort_order: bo === ao ? (direction === 'up' ? ao - 1 : ao + 1) : bo });
  await driver.updateContent(collection, b.slug, { sort_order: ao });
  invalidate(collection);
  return true;
}

async function remove(collection, slug) {
  assertCollection(collection);
  await driver.deleteContent(collection, slug);
  invalidate(collection);
  return true;
}

/* ------------------------------------------------ browser data scripts */
function jsLiteral(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

const scriptCache = new Map();

async function buildScript(collection, { includeDrafts = false } = {}) {
  const key = collection + (includeDrafts ? ':drafts' : '');
  const { at } = await allRows(collection);
  const hit = scriptCache.get(key);
  if (hit && hit.at === at) return hit.js;

  const rows = await list(collection, { includeDrafts });
  const map = (filter) => {
    const out = {};
    rows.filter(filter).forEach((r) => { out[r.slug] = r.data; });
    return out;
  };
  const header = '/* Himalayan Magic Adventure — ' + collection + ' (generated from the content database) */\n';
  let js;
  if (collection === 'treks') {
    js = header + 'window.TREKS = ' + jsLiteral(map(() => true)) + ';\n';
  } else if (collection === 'expeditions') {
    js = header +
      'window.MOUNTAINS = ' + jsLiteral(map((r) => r.kind === 'eight-thousander')) + ';\n' +
      'window.PEAKS_DATA = ' + jsLiteral(map((r) => r.kind !== 'eight-thousander')) + ';\n';
  } else if (collection === 'stories') {
    js = header + 'window.STORIES = ' + jsLiteral(map(() => true)) + ';\n';
  } else {
    throw httpError(404, 'Unknown collection.');
  }
  scriptCache.set(key, { at, js });
  return js;
}

/* Slim list for the booking form's trip selector. */
async function trips() {
  const [treks, exps] = await Promise.all([list('treks'), list('expeditions')]);
  const days = (s) => { const m = String(s || '').match(/\d+/); return m ? +m[0] : null; };
  return treks.map((r) => ({ type: 'trek', slug: r.slug, name: r.title, days: days(r.data.stats && r.data.stats.duration) }))
    .concat(exps.map((r) => ({ type: 'expedition', slug: r.slug, name: r.title, elevation: r.data.elevationLabel || null })));
}

async function stats() {
  const out = {};
  for (const c of Object.keys(COLLECTIONS)) {
    const rows = await list(c, { includeDrafts: true });
    out[c] = { total: rows.length, published: rows.filter((r) => r.published).length };
  }
  return out;
}

module.exports = {
  COLLECTIONS,
  EXPEDITION_KINDS,
  slugify,
  list,
  summaries,
  get,
  create,
  update,
  setPublished,
  move,
  remove,
  buildScript,
  trips,
  stats,
  invalidate,
  httpError
};
