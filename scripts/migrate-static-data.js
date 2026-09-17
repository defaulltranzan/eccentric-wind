#!/usr/bin/env node
/* One-off migration (already run once — safe to re-run only from the backup copies).
 * 1. Evaluates the original browser data files and writes every record to
 *    data/content/{treks,expeditions,stories}.json — the content database.
 * 2. Strips the records out of public/{treks,mountains,peaks,stories}.js so those
 *    files keep only shared defaults + helpers; records now come from /data/*.js.
 * Originals are copied to _docs/data-split-backup/ first. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const PUB = path.join(ROOT, 'public');
const BACKUP = path.join(ROOT, '_docs', 'data-split-backup');
const OUT = path.join(ROOT, 'data', 'content');
const FILES = ['treks.js', 'mountains.js', 'peaks.js', 'stories.js'];

const src = (f) => fs.readFileSync(path.join(fs.existsSync(path.join(BACKUP, f)) ? BACKUP : PUB, f), 'utf8');

fs.mkdirSync(BACKUP, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });
FILES.forEach((f) => { if (!fs.existsSync(path.join(BACKUP, f))) fs.copyFileSync(path.join(PUB, f), path.join(BACKUP, f)); });

const ctx = {};
ctx.window = ctx;
vm.createContext(ctx);
FILES.forEach((f) => vm.runInContext(src(f), ctx, { filename: f }));
const plain = (o) => JSON.parse(JSON.stringify(o));

const now = new Date().toISOString();
let seq = 0;
const row = (collection, data, extra) => Object.assign({
  id: collection.slice(0, 3) + '_' + String(++seq).padStart(4, '0'),
  slug: data.slug,
  title: data.name || data.title,
  published: true,
  featured: !!(data.featured || data.bestseller),
  sort_order: seq,
  kind: null,
  data: plain(data),
  created_at: now,
  updated_at: now
}, extra || {});

seq = 0;
const treks = Object.keys(ctx.TREKS).map((k) => row('treks', ctx.TREKS[k]));
seq = 0;
const expeditions = Object.keys(ctx.MOUNTAINS).map((k) => row('expeditions', ctx.MOUNTAINS[k], { kind: 'eight-thousander' }))
  .concat(Object.keys(ctx.PEAKS_DATA).map((k) => row('expeditions', ctx.PEAKS_DATA[k], { kind: 'peak' })));
seq = 0;
const stories = Object.keys(ctx.STORIES).map((k) => row('stories', ctx.STORIES[k], { kind: ctx.STORIES[k].category || null }));

const write = (name, rows) => fs.writeFileSync(path.join(OUT, name + '.json'), JSON.stringify(rows, null, 2) + '\n');
write('treks', treks);
write('expeditions', expeditions);
write('stories', stories);
console.log('records:', treks.length, 'treks,', expeditions.length, 'expeditions,', stories.length, 'stories');

/* ---- slim the browser files ---- */
function cutAfter(text, marker, replacement) {
  const i = text.indexOf(marker);
  if (i < 0) throw new Error('marker not found: ' + marker);
  return text.slice(0, i) + replacement;
}
const NOTE = (g, route) => '/* Records now live in the content database (data/content → admin at /admin).\n' +
  '   They are served as ' + route + ', which sets window.' + g + '. */\n';

fs.writeFileSync(path.join(PUB, 'treks.js'),
  cutAfter(src('treks.js'), 'window.TREKS = {};', NOTE('TREKS', '/data/treks.js (load it right after this file)') + 'window.TREKS = window.TREKS || {};\n'));

fs.writeFileSync(path.join(PUB, 'mountains.js'),
  cutAfter(src('mountains.js'), 'window.MOUNTAINS = {};', NOTE('MOUNTAINS', '/data/expeditions.js (load it after this file and BEFORE peaks.js)') + 'window.MOUNTAINS = window.MOUNTAINS || {};\n'));

(function () {
  const t = src('peaks.js');
  const start = t.indexOf('  window.PEAKS_DATA = {');
  const endMarker = '\n  };\n\n  /* --------------------------------------------------- normalise one record */';
  const end = t.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error('peaks.js markers not found');
  const out = t.slice(0, start) +
    '  ' + NOTE('PEAKS_DATA', '/data/expeditions.js (load it BEFORE this file)').replace(/\n(?=.)/g, '\n  ') +
    '  window.PEAKS_DATA = window.PEAKS_DATA || {};' + t.slice(end + '\n  };'.length);
  fs.writeFileSync(path.join(PUB, 'peaks.js'), out);
})();

(function () {
  let t = src('stories.js');
  const a = t.indexOf('  var STORIES = {};');
  const b = t.indexOf('  /* ---------------------------------------------------------------------- API */');
  if (a < 0 || b < 0) throw new Error('stories.js markers not found');
  t = t.slice(0, a) + '  ' + NOTE('STORIES', '/data/stories.js (load it BEFORE this file)').replace(/\n(?=.)/g, '\n  ') +
    '  var STORIES = window.STORIES || {};\n  window.STORIES = STORIES;\n\n' + t.slice(b);
  fs.writeFileSync(path.join(PUB, 'stories.js'), t);
})();
console.log('browser data files slimmed; originals in _docs/data-split-backup/');
