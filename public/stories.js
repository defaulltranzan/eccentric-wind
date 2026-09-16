/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — STORIES / FIELD JOURNAL DATA MODEL
   ----------------------------------------------------------------------------
   One reusable template (story.html + story-render.js) renders every article
   from the records below, and the same data feeds the homepage "Stories"
   strip and the /stories index.

   To add an article: add one STORIES['slug'] = { ... } object. The index page,
   the homepage strip, related-story links and the sitemap pick it up.

   Per-article discovery metadata (all optional):
     topics:       ['trekking'|'expeditions'|'planning'|'culture'|'safety']
     destinations: ['everest'|'annapurna'|'langtang'|'gokyo'|'manaslu'|'mustang'|'dolpo'|'kanchenjunga']
     relatedTreks: ['<trek-slug>', …]            → "From the same trail"
     featured:     true                          → the one big story on the index
     editorsPick:  true
     updated:      'YYYY-MM-DD'                   → shows "Updated …" on the article
     quickFacts:   { duration, difficulty, maxElevation, season, region, start }

   body[] block types:
     { t:'p',     html:'…' }                     paragraph (inline HTML allowed)
     { t:'h2',    text:'…' }                     section heading
     { t:'h3',    text:'…' }
     { t:'quote', text:'…', cite:'…' }           pull quote
     { t:'list',  items:['…','…'], ordered:false }
     { t:'note',  title:'…', html:'…', kind:'field'|'safety'|'tip' }   callout box
     { t:'image', src:'…', caption:'…' }         full-width figure (opens in lightbox)
     { t:'gallery', images:[{src,caption}] }     thumb grid → lightbox
     { t:'facts', rows:[['Duration','12 days'], …] }   inline compact facts strip
     { t:'divider' }                             section break rule + ▲

   EDITORIAL NOTE: these launch articles are evergreen guidance on well-known
   routes and on high-altitude physiology. Bylines are placeholders — swap in
   the real author when known. Nothing route-specific here is invented beyond
   what is common knowledge about these trails.
   ========================================================================== */
(function () {
  'use strict';

  window.STORY_DEFAULTS = {
    kicker: 'The Field Journal',
    heading: 'Stories From <span class="accent">The High Places</span>',
    intro: 'Long-form notes from the trail and the mountain — how we think about acclimatisation, what a pass crossing actually feels like, and how to choose the walk that fits you. Written by the guides and doctors who work these routes.',
    metaTitle: 'The Field Journal — Trekking & Expedition Stories | Himalayan Magic Adventure',
    metaDescription: 'First-hand essays and practical guidance from Himalayan Magic Adventure — acclimatisation, pass crossings, route choice and life at altitude in the Nepal Himalaya.'
  };

  /* Records now live in the content database (data/content → admin at /admin).
     They are served as /data/stories.js (load it BEFORE this file), which sets window.STORIES. */
  var STORIES = window.STORIES || {};
  window.STORIES = STORIES;

  /* ---------------------------------------------------------------------- API */
  function toArr() {
    return Object.keys(STORIES).map(function (k) { return STORIES[k]; })
      .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
  }
  function has(arr, v) { return (arr || []).indexOf(v) > -1; }
  window.getStories = function (opts) {
    opts = opts || {};
    var out = toArr();
    if (opts.category) out = out.filter(function (s) { return s.category === opts.category; });
    if (opts.topic) out = out.filter(function (s) { return has(s.topics, opts.topic); });
    if (opts.destination) out = out.filter(function (s) { return has(s.destinations, opts.destination); });
    if (opts.tag) out = out.filter(function (s) { return has(s.tags, opts.tag); });
    if (opts.exclude) out = out.filter(function (s) { return s.slug !== opts.exclude; });
    if (opts.limit) out = out.slice(0, opts.limit);
    return out;
  };
  window.getStory = function (slug) {
    return STORIES[String(slug || '').toLowerCase()] || null;
  };
  window.getFeaturedStory = function () {
    var all = toArr();
    for (var i = 0; i < all.length; i++) if (all[i].featured) return all[i];
    return all[0] || null;
  };
  window.getEditorsPicks = function (n) {
    var picks = toArr().filter(function (s) { return s.editorsPick; });
    return (n ? picks.slice(0, n) : picks);
  };
  // destination keys present across the journal, in a stable display order
  window.getStoryDestinations = function () {
    var ORDER = ['everest', 'gokyo', 'annapurna', 'mustang', 'langtang', 'manaslu', 'dolpo', 'kanchenjunga'];
    var present = {};
    toArr().forEach(function (s) { (s.destinations || []).forEach(function (d) { present[d] = true; }); });
    return ORDER.filter(function (d) { return present[d]; });
  };
  // "From the same trail" — related trek pages + articles sharing a destination
  window.getSameTrail = function (slug) {
    var s = STORIES[slug];
    if (!s) return { treks: [], stories: [] };
    var stories = toArr().filter(function (x) {
      return x.slug !== slug && (x.destinations || []).some(function (d) { return has(s.destinations, d); });
    }).slice(0, 4);
    return { treks: (s.relatedTreks || []).slice(0, 4), stories: stories };
  };
  window.getRelatedStories = function (slug, n) {
    var s = STORIES[slug];
    if (!s) return window.getStories({ limit: n || 2 });
    var scored = toArr().filter(function (x) { return x.slug !== slug; }).map(function (x) {
      var shared = (x.tags || []).filter(function (t) { return (s.tags || []).indexOf(t) > -1; }).length;
      return { s: x, score: shared + (x.category === s.category ? 1 : 0) };
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored.slice(0, n || 2).map(function (o) { return o.s; });
  };
  window.formatStoryDate = function (iso) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso || '';
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };
})();
