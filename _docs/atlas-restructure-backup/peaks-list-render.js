/* ============================================================================
   PEAK COLLECTION — elevation-band listing page
   Serves /expeditions/8000m · /7000m · /6000m · /trekking-peaks · /peaks
   Reads window.getPeaks() from peaks.js and renders the premium card grid.
   No fabricated content — a peak with status:"draft" shows its known facts
   and a "briefing in preparation" note.
   ========================================================================== */
(function () {
  'use strict';

  window.hxToggleTheme = function () {
    var t = (localStorage.getItem('vo_theme') === 'light') ? 'dark' : 'light';
    localStorage.setItem('vo_theme', t);
    var light = t === 'light';
    document.body.classList.toggle('light-mode', light);
    var i = document.getElementById('theme-icon');
    if (i) i.className = 'fa-solid ' + (light ? 'fa-sun' : 'fa-moon') + ' text-sm' + (light ? ' text-accent' : '');
  };
  (function () {
    var light = localStorage.getItem('vo_theme') === 'light';
    document.body.classList.toggle('light-mode', light);
    var i = document.getElementById('theme-icon');
    if (i) i.className = 'fa-solid ' + (light ? 'fa-sun' : 'fa-moon') + ' text-sm' + (light ? ' text-accent' : '');
  })();

  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var root = document.getElementById('peaks-root');

  var CATS = window.PEAK_CATEGORIES || [];
  var SORTS = window.PEAK_SORTS || [];

  // ---- which band? ---------------------------------------------------------
  var parts = location.pathname.replace(/\/+$/, '').split('/');
  var last = (parts.pop() || '').toLowerCase();
  var cat = null;
  CATS.forEach(function (c) { if (c.slug === last) cat = c; });
  var isAll = last === 'peaks' || last === 'expeditions';

  var state = { sort: 'elevation', country: '', region: '' };

  // ---- SEO ---------------------------------------------------------------
  var title = cat ? (cat.label + ' — Himalayan & Karakoram Peaks | Himalayan Magic Adventure')
                  : 'Expedition Peaks by Elevation | Himalayan Magic Adventure';
  document.title = title;
  var md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute('content', cat ? cat.blurb : 'Every Himalayan and Karakoram expedition peak we can take you to, grouped by elevation band.');
  var canon = document.getElementById('canonical-link');
  if (canon) canon.setAttribute('href', 'https://himalayanmagic.com/expeditions' + (cat ? '/' + cat.slug : ''));

  var PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3C/svg%3E";

  // ---- one card ---------------------------------------------------------
  var ARROW = '<svg class="pk-arrow" width="16" height="8" viewBox="0 0 16 8" fill="none" aria-hidden="true"><path d="M0 4h14M11 1l3 3-3 3" stroke="currentColor" stroke-width="1.4"/></svg>';

  function diffPips(n) {
    if (!n) return '<span class="text-muted-foreground/60">Rating pending</span>';
    return '<span class="tracking-[0.15em] text-accent">' + '●'.repeat(n) +
      '<span class="text-white/25">' + '○'.repeat(5 - n) + '</span></span>';
  }

  function card(p) {
    var draft = p.status !== 'published';
    var img = p.image
      ? '<img class="pk-img absolute inset-0 h-full w-full object-cover opacity-0" loading="lazy" decoding="async" src="' + esc(p.image) + '" alt="' + esc(p.name + ' — ' + (p.range || p.country)) + '">'
      : '<div class="absolute inset-0 opacity-[0.5] bg-[radial-gradient(circle_at_30%_20%,rgba(240,98,37,0.14),transparent_55%),repeating-linear-gradient(115deg,rgba(255,255,255,0.04)_0_1px,transparent_1px_22px)]"></div>';
    return '' +
    '<a href="' + esc(p.href) + '" class="pk group relative flex flex-col overflow-hidden border border-border bg-[#181a1e] min-h-[340px]" ' +
      'aria-label="' + esc(p.name + ', ' + (p.elevationDisplay || '') + ', ' + (p.countryLabel || '') + (p.range ? ', ' + p.range : '')) + '">' +
      img +
      '<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#181a1e] via-[#181a1e]/80 to-[#181a1e]/25"></div>' +
      '<span class="absolute top-3 left-3 z-10 bg-black/45 border border-white/15 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white">' + esc(p.categoryLabel || '') + '</span>' +
      (draft ? '<span class="absolute top-3 right-3 z-10 border border-white/20 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-white/60">Briefing in prep</span>' : '') +
      '<div class="relative z-10 mt-auto flex flex-col p-5">' +
        '<span class="lbl text-white/70">' + esc(p.range || p.region || 'Range to confirm') + '</span>' +
        '<div class="mt-1 flex items-end gap-1.5">' +
          '<span class="font-heading text-[2.6rem] md:text-5xl font-light leading-none tracking-tightest text-accent">' + esc((p.elevationDisplay || '').replace(/\s*m$/, '')) + '</span>' +
          '<span class="mb-1 font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground">m</span>' +
        '</div>' +
        '<h3 class="mt-1.5 font-heading text-2xl md:text-[1.7rem] font-medium uppercase tracking-tightest text-white group-hover:text-accent transition-colors leading-[0.98]">' + esc(p.name) + '</h3>' +
        (p.aka ? '<span class="mt-0.5 block font-mono text-[10px] tracking-wide text-muted-foreground/80">' + esc(p.aka) + '</span>' : '') +
        '<div class="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] text-white/85">' +
          '<span class="text-white">' + esc(p.countryLabel || '') + '</span>' +
          (p.difficulty ? '<span class="text-white/25">/</span>' + diffPips(p.difficulty) : '') +
        '</div>' +
        (p.shortDescription ? '<p class="mt-2 font-sans text-[12.5px] leading-snug text-white/75 line-clamp-2">' + esc(p.shortDescription) + '</p>' : '') +
        '<span class="mt-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white group-hover:text-accent transition-colors">Explore expedition ' + ARROW + '</span>' +
      '</div>' +
    '</a>';
  }

  // ---- band switcher --------------------------------------------------
  function bandNav() {
    var cats = window.getPeakCategories ? window.getPeakCategories() : CATS;
    return '<div class="flex flex-wrap gap-2">' + cats.map(function (c) {
      var on = cat && c.id === cat.id;
      return '<a href="/expeditions/' + c.slug + '" class="pk-sel ' + (on ? 'text-accent border-accent' : 'hover:text-accent hover:border-accent/50') + ' transition-colors">' +
        esc(c.short) + ' <span class="opacity-50">' + c.count + '</span></a>';
    }).join('') + '</div>';
  }

  // ---- filters --------------------------------------------------------
  function controls(peaks) {
    var countries = {}, regions = {};
    peaks.forEach(function (p) { if (p.countryLabel) countries[p.countryLabel] = 1; if (p.region) regions[p.region] = 1; });
    var cOpts = '<option value="">All countries</option>' + Object.keys(countries).sort().map(function (c) { return '<option value="' + esc(c) + '"' + (state.country === c ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join('');
    var rOpts = '<option value="">All regions</option>' + Object.keys(regions).sort().map(function (r) { return '<option value="' + esc(r) + '"' + (state.region === r ? ' selected' : '') + '>' + esc(r) + '</option>'; }).join('');
    var sOpts = SORTS.map(function (s) { return '<option value="' + s.id + '"' + (state.sort === s.id ? ' selected' : '') + '>' + esc(s.label) + '</option>'; }).join('');
    return '<div class="flex flex-wrap items-center gap-2">' +
      '<select id="pk-sort" class="pk-sel" aria-label="Sort peaks">' + sOpts + '</select>' +
      (Object.keys(countries).length > 1 ? '<select id="pk-country" class="pk-sel" aria-label="Filter by country">' + cOpts + '</select>' : '') +
      (Object.keys(regions).length > 1 ? '<select id="pk-region" class="pk-sel" aria-label="Filter by region">' + rOpts + '</select>' : '') +
      '</div>';
  }

  // ---- render --------------------------------------------------------
  function render() {
    var opts = { sort: state.sort };
    if (cat) opts.category = cat.id;
    if (state.country) opts.country = null;   // countryLabel filter handled below
    var peaks = window.getPeaks(opts);
    if (state.country) peaks = peaks.filter(function (p) { return p.countryLabel === state.country; });
    if (state.region) peaks = peaks.filter(function (p) { return p.region === state.region; });

    var allInBand = cat ? window.getPeaks({ category: cat.id }) : window.getPeaks({});
    var pending = allInBand.filter(function (p) { return p.status !== 'published'; }).length;

    var heading = cat ? cat.label : 'Every Expedition Peak';
    var short = cat ? cat.short : 'All bands';
    var blurb = cat ? cat.blurb : 'Grouped by elevation — the giants first.';

    root.innerHTML =
    '<section class="border-b border-border bg-[#101215]">' +
      '<div class="max-w-7xl mx-auto px-6 md:px-10 py-14 md:py-20">' +
        '<div class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-6">' +
          '<a href="/expeditions" class="hover:text-accent transition-colors">Expeditions</a><span class="text-white/25">/</span><span class="text-accent">' + esc(short) + '</span>' +
        '</div>' +
        '<span class="kicker">' + esc(cat ? 'The ' + cat.tag + ' collection' : 'Peak database') + '</span>' +
        '<h1 class="sec-h text-white text-4xl sm:text-6xl md:text-7xl mt-3">' + esc(heading) + '</h1>' +
        '<p class="max-w-2xl font-sans text-sm md:text-base text-white/75 mt-5 leading-relaxed">' + esc(blurb) + '</p>' +
        '<div class="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">' +
          '<span><span class="text-accent">' + allInBand.length + '</span> ' + (allInBand.length === 1 ? 'peak' : 'peaks') + '</span>' +
          (pending ? '<span><span class="text-white/70">' + pending + '</span> briefing' + (pending === 1 ? '' : 's') + ' in preparation</span>' : '') +
        '</div>' +
        '<div class="mt-8">' + bandNav() + '</div>' +
      '</div>' +
    '</section>' +

    '<section class="bg-background">' +
      '<div class="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-14">' +
        '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">' +
          '<span class="lbl"><span class="text-accent">' + peaks.length + '</span> shown</span>' +
          controls(peaks) +
        '</div>' +
        '<div id="pk-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"></div>' +
        (peaks.length ? '' : '<div class="py-16 text-center"><span class="kicker">Nothing here yet</span><p class="mt-3 font-sans text-sm text-muted-foreground">This collection is still being built. <a href="/contact" class="text-accent">Ask us</a> what we can run.</p></div>') +
      '</div>' +
    '</section>' +

    '<section class="border-t border-border bg-[#101215]">' +
      '<div class="max-w-7xl mx-auto px-6 md:px-10 py-14 md:py-18">' +
        '<span class="kicker">Plan a climb</span>' +
        '<h2 class="sec-h text-white text-3xl md:text-5xl mt-3">Not sure which peak comes next?</h2>' +
        '<p class="max-w-xl font-sans text-sm text-white/70 mt-4 leading-relaxed">Tell us your climbing history and we will tell you honestly where you are in your progression and what the right objective is.</p>' +
        '<a href="/contact" class="mt-7 inline-flex items-center gap-2 border border-accent px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-accent hover:bg-accent hover:text-background transition-all">Talk to the expedition desk <span aria-hidden="true">&rarr;</span></a>' +
      '</div>' +
    '</section>';

    var grid = document.getElementById('pk-grid');
    if (grid) grid.innerHTML = peaks.map(card).join('');

    // lazy-load fade for real images
    document.querySelectorAll('.pk-img').forEach(function (im) {
      if (im.complete) { im.classList.add('loaded'); return; }
      im.addEventListener('load', function () { im.classList.add('loaded'); });
    });

    wire();
  }

  function wire() {
    var s = document.getElementById('pk-sort');
    if (s) s.onchange = function () { state.sort = this.value; render(); };
    var c = document.getElementById('pk-country');
    if (c) c.onchange = function () { state.country = this.value; render(); };
    var r = document.getElementById('pk-region');
    if (r) r.onchange = function () { state.region = this.value; render(); };
  }

  if (!window.getPeaks) {
    root.innerHTML = '<div class="max-w-3xl mx-auto px-6 py-32 text-center"><span class="kicker">Data unavailable</span><h1 class="sec-h text-4xl text-foreground mt-4">The peak database did not load</h1><a href="/expeditions" class="mt-6 inline-flex border border-accent text-accent px-6 py-3 font-mono text-[11px] uppercase tracking-widest hover:bg-accent hover:text-background transition-all">Back to Expeditions</a></div>';
    return;
  }
  render();
})();
