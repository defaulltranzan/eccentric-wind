#!/usr/bin/env node
/* Copies the content in data/content/*.json into Supabase (insert or update by slug).
 *   npm run db:push                 all collections
 *   npm run db:push -- treks        one collection
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (e.g. in .env).
 * Existing rows with the same slug are overwritten with the file version. */
'use strict';
const path = require('path');
const fs = require('fs');
const env = require('../src/config/env');

if (!env.supabase.enabled) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first (see .env.example).');
  process.exit(1);
}
const supabase = require('../src/data/drivers/supabaseDriver');

const wanted = process.argv.slice(2);
const collections = ['treks', 'expeditions', 'stories'].filter((c) => !wanted.length || wanted.includes(c));

(async () => {
  for (const c of collections) {
    const file = path.join(__dirname, '..', 'data', 'content', c + '.json');
    const rows = JSON.parse(fs.readFileSync(file, 'utf8')).map((r) => ({
      slug: r.slug, title: r.title, published: !!r.published, featured: !!r.featured,
      sort_order: r.sort_order || 0, kind: r.kind || null, data: r.data
    }));
    for (let i = 0; i < rows.length; i += 20) {
      await supabase.upsertContent(c, rows.slice(i, i + 20));
    }
    console.log('✓ ' + c + ': ' + rows.length + ' records');
  }
  console.log('Done. Open /admin to manage content.');
})().catch((err) => {
  console.error('Push failed:', err.message);
  process.exit(1);
});
