/* ============================================================================
   EIGHT-THOUSANDER — INDIVIDUAL MOUNTAIN / EXPEDITION PAGE
   Reads the slug from /expeditions/<slug>, merges MOUNTAINS[slug] with
   EXPED_DEFAULTS, and builds a deep expedition reference page.
   ========================================================================== */
(function () {
  'use strict';

  window.hxToggleTheme = function () {
    var t = (localStorage.getItem('vo_theme') === 'light') ? 'dark' : 'light';
    localStorage.setItem('vo_theme', t); applyTheme();
  };
  function applyTheme() {
    var light = localStorage.getItem('vo_theme') === 'light';
    document.body.classList.toggle('light-mode', light);
    var i = document.getElementById('theme-icon');
    if (i) i.className = 'fa-solid ' + (light ? 'fa-sun' : 'fa-moon') + ' text-sm' + (light ? ' text-accent' : '');
  }
  applyTheme();

  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var has = function (v) { return Array.isArray(v) ? v.length > 0 : (v != null && v !== ''); };

  var slug = (location.pathname.replace(/\/+$/, '').split('/').pop() || '').toLowerCase();
  var M = window.MOUNTAINS || {};
  var D = window.EXPED_DEFAULTS || {};
  var TREKS = window.TREKS || {};
  var m = M[slug];
  var root = document.getElementById('mtn-root');

  if (!m) {
    root.innerHTML = '<div class="max-w-3xl mx-auto px-6 py-32 text-center">' +
      '<span class="kicker">Peak not found</span>' +
      '<h1 class="sec-h text-4xl md:text-6xl text-foreground mt-4 mb-6">This mountain isn’t in the atlas</h1>' +
      '<a href="/expeditions" class="inline-flex border border-accent text-accent hover:bg-accent hover:text-background font-mono text-[11px] uppercase tracking-widest px-6 py-3 transition-all">Back to the 14 eight-thousanders</a></div>';
    return;
  }

  document.title = (m.seo && m.seo.title) || (m.name + ' Expedition — Himalayan Magic Adventure');
  var md = document.querySelector('meta[name="description"]');
  if (md && m.seo && m.seo.description) md.setAttribute('content', m.seo.description);
  var canon = document.getElementById('canonical-link');
  if (canon) canon.setAttribute('href', 'https://himalayanmagic.com/expeditions/' + m.slug);

  function section(id, kicker, heading, body, opts) {
    opts = opts || {};
    return '<section id="' + id + '" class="hx-sec fade-up scroll-mt-24 border-b border-border ' + (opts.alt ? 'bg-[#101215]' : 'bg-[#15171a]') + '">' +
      '<div class="max-w-6xl mx-auto px-6 md:px-10 py-14 md:py-20">' +
      (kicker ? '<span class="kicker">' + esc(kicker) + '</span>' : '') +
      (heading ? '<h2 class="sec-h text-3xl md:text-5xl text-foreground mt-3 mb-8">' + heading + '</h2>' : '') +
      body + '</div></section>';
  }
  function bars(v) { var o = ''; for (var i = 0; i < 5; i++) o += '<span class="h-2.5 flex-1 ' + (i < v ? 'bg-accent' : 'bg-border') + '"></span>'; return '<div class="flex gap-0.5 flex-1 max-w-[180px]">' + o + '</div>'; }
  function verifyBox(text) { return '<div class="border border-accent/30 bg-accent/5 p-4 mt-4"><span class="lbl text-accent block mb-1">Confirm before you commit</span><span class="font-sans text-[13px] text-muted-foreground">' + esc(text) + '</span></div>'; }

  var out = [];

  /* ---------- HERO ---------- */
  out.push('' +
    '<section class="relative min-h-[86vh] flex flex-col justify-end overflow-hidden border-b border-border">' +
    '<div class="absolute inset-0 z-0"><img src="' + esc(m.heroImage) + '" alt="' + esc(m.name + ', ' + m.range) + '" class="h-full w-full object-cover"></div>' +
    '<div class="absolute inset-0 z-10 bg-gradient-to-t from-[#15171a] via-[#15171a]/55 to-[#15171a]/20"></div>' +
    '<div class="absolute inset-0 z-10 bg-gradient-to-r from-[#15171a]/75 to-transparent"></div>' +
    '<div class="relative z-20 max-w-6xl mx-auto w-full px-6 md:px-10 pt-28 pb-12">' +
    '<nav class="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 mb-6"><a href="/" class="hover:text-accent">Home</a> / <a href="/expeditions" class="hover:text-accent">Expeditions</a> / <span class="text-white/90">' + esc(m.name) + '</span></nav>' +
    '<span class="kicker">Expedition · ' + esc(m.range) + ' · Rank #' + m.rank + ' of 14</span>' +
    '<h1 class="sec-h text-white text-5xl md:text-7xl mt-3">' + esc(m.name) + '</h1>' +
    (m.aka ? '<p class="font-mono text-xs md:text-sm text-white/60 mt-2 tracking-wide">' + esc(m.aka) + '</p>' : '') +
    (m.tagline ? '<p class="font-heading font-light text-xl md:text-2xl text-accent mt-3 tracking-wide">' + esc(m.tagline) + '</p>' : '') +
    (m.summary ? '<p class="max-w-2xl font-sans text-sm md:text-base text-white/80 mt-5 leading-relaxed">' + esc(m.summary) + '</p>' : '') +
    '<div class="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-border border border-border max-w-4xl">' +
    hs('Elevation', m.elevationLabel) + hs('Rank', '#' + m.rank + ' / 14') + hs('Country', m.countryLabel) +
    hs('Range', m.range) + hs('Season', (m.season && m.season.primary + ' · ' + m.season.window)) + hs('First ascent', (m.firstAscent && m.firstAscent.year)) +
    '</div>' +
    '<div class="mt-8 flex flex-wrap items-center gap-3">' +
    '<a href="/contact" class="inline-flex items-center gap-2 bg-accent text-background font-mono text-[11px] uppercase tracking-widest font-semibold px-6 py-3 hover:bg-accent-hover transition-colors">Plan This Expedition</a>' +
    '<a href="#route" class="inline-flex items-center gap-2 border border-white/40 text-white font-mono text-[11px] uppercase tracking-widest px-6 py-3 hover:border-accent hover:text-accent transition-all">The normal route</a>' +
    '</div></div></section>');
  function hs(l, v) { if (!has(v)) return ''; return '<div class="bg-[#101215]/90 p-3"><span class="lbl block">' + esc(l) + '</span><span class="block font-mono text-[11px] text-white mt-1 leading-snug">' + esc(v) + '</span></div>'; }

  /* ---------- SUBNAV ---------- */
  var nav = [['overview', 'The mountain'], ['difficulty', 'Difficulty'], ['route', 'Route'], ['camps', 'Camps'], ['season', 'Season'], ['hazards', 'Hazards'], ['permits', 'Permits'], ['history', 'History'], ['faq', 'FAQ']];
  out.push('<nav id="subnav" class="sticky top-0 z-30 border-b border-border bg-[#101215]/95 backdrop-blur-md">' +
    '<div class="max-w-6xl mx-auto px-4 md:px-10 flex items-center gap-1 overflow-x-auto">' +
    nav.map(function (n) { return '<a href="#' + n[0] + '" data-nav="' + n[0] + '" class="hx-nav-link shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-accent px-3 py-3.5 transition-colors">' + esc(n[1]) + '</a>'; }).join('') +
    '</div></nav>');

  /* ---------- QUICK FACTS ---------- */
  out.push('<section class="border-b border-border bg-[#101215]"><div class="max-w-6xl mx-auto px-6 md:px-10 py-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">' +
    qf('Elevation', m.elevationLabel) + qf('Feet', m.elevationFt ? m.elevationFt.toLocaleString() + ' ft' : '') +
    qf('Base camp', m.baseCampM ? m.baseCampM.toLocaleString() + ' m' : '') + qf('Season', m.season && m.season.window) +
    qf('Duration', m.typicalDurationDays) + qf('Coordinates', m.coordinates ? m.coordinates.lat.toFixed(2) + '°N ' + m.coordinates.lon.toFixed(2) + '°E' : '') +
    qf('Region', m.region) +
    '</div></section>');
  function qf(l, v) { if (!has(v)) return ''; return '<div><span class="lbl block">' + esc(l) + '</span><span class="block font-heading text-base text-white mt-1 leading-tight">' + esc(v) + '</span></div>'; }

  /* ---------- OVERVIEW ---------- */
  if (has(m.character)) {
    out.push(section('overview', '01 — The mountain', 'What ' + esc(m.name) + ' is',
      '<div class="prose-x font-sans text-[15px] max-w-3xl">' + m.character.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>'));
  }

  /* ---------- DIFFICULTY ---------- */
  if (m.difficulty) {
    var d = m.difficulty;
    var dims = [['Technical climbing', 'technical'], ['Altitude', 'altitude'], ['Exposure', 'exposure'], ['Weather', 'weather'], ['Remoteness', 'remoteness'], ['Objective hazard', 'objectiveHazard']];
    var body = '<div class="grid md:grid-cols-2 gap-x-12 gap-y-4 mb-6 max-w-3xl">' +
      dims.map(function (x) { return '<div class="flex items-center gap-4"><span class="lbl w-36 shrink-0">' + x[0] + '</span>' + bars(d[x[1]] || 0) + '<span class="font-mono text-[10px] text-muted-foreground">' + (d[x[1]] || 0) + '/5</span></div>'; }).join('') +
      '</div>' +
      (d.summary ? '<p class="font-sans text-[14px] text-foreground leading-relaxed max-w-2xl mb-4">' + esc(d.summary) + '</p>' : '') +
      '<p class="lbl max-w-2xl">' + esc(D.difficultyNote || '') + '</p>';
    out.push(section('difficulty', '02 — Expedition difficulty', 'How hard it is', body, { alt: true }));
  }

  /* ---------- NORMAL ROUTE + LADDER ---------- */
  if (m.normalRoute) {
    var r = m.normalRoute;
    var body = '<p class="font-heading font-light text-2xl md:text-3xl text-foreground leading-tight tracking-tight mb-2">' + esc(r.name) + '</p>' +
      (r.character ? '<p class="font-sans text-[14px] text-muted-foreground leading-relaxed max-w-2xl mb-8">' + esc(r.character) + '</p>' : '');
    if (has(r.sections)) {
      body += '<div class="border-l border-border ml-2 mb-8">' + r.sections.map(function (s) {
        return '<div class="relative pl-6 pb-6"><span class="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-accent"></span>' +
          '<span class="font-mono text-[12px] text-white uppercase tracking-wide">' + esc(s.name) + '</span>' +
          '<p class="font-sans text-[13px] text-muted-foreground mt-1 leading-relaxed max-w-2xl">' + esc(s.detail) + '</p></div>';
      }).join('') + '</div>';
    }
    if (has(m.alternativeRoutes)) {
      body += '<span class="lbl block mb-2">Other routes</span><ul class="space-y-1.5 max-w-2xl">' + m.alternativeRoutes.map(function (x) { return '<li class="font-sans text-[13px] text-muted-foreground flex gap-2"><span class="text-accent">·</span><span>' + esc(x) + '</span></li>'; }).join('') + '</ul>';
    }
    out.push(section('route', '03 — The normal route', esc(m.name) + ' by its usual line', body));
  }

  /* ---------- CAMPS / ALTITUDE LADDER ---------- */
  if (has(m.camps)) {
    var maxA = Math.max.apply(null, m.camps.map(function (c) { return c.altM; }));
    var minA = Math.min.apply(null, m.camps.map(function (c) { return c.altM; }));
    var ladder = m.camps.map(function (c) {
      var pct = ((c.altM - minA) / (maxA - minA || 1)) * 100;
      var isSummit = /summit/i.test(c.name);
      return '<div class="flex items-center gap-4">' +
        '<span class="w-40 shrink-0 font-mono text-[11px] ' + (isSummit ? 'text-accent' : 'text-white') + ' uppercase tracking-wide text-right">' + esc(c.name) + '</span>' +
        '<div class="flex-1 h-6 bg-[var(--card)] border border-border relative"><div class="absolute inset-y-0 left-0 ' + (isSummit ? 'bg-accent' : 'bg-accent/30') + '" style="width:' + pct.toFixed(1) + '%"></div>' +
        '<span class="absolute inset-y-0 right-2 flex items-center font-mono text-[10px] text-white/80">' + c.altM.toLocaleString() + ' m</span></div>' +
        (c.note ? '<span class="hidden md:block w-40 shrink-0 font-mono text-[10px] text-muted-foreground">' + esc(c.note) + '</span>' : '<span class="hidden md:block w-40 shrink-0"></span>') +
        '</div>';
    }).join('');
    var body = '<div class="space-y-2 mb-6">' + ladder + '</div>' +
      (m.baseCampNote ? '<div class="border border-border bg-card p-4 max-w-2xl mb-4"><span class="lbl block mb-1">Base camp &amp; approach</span><span class="font-sans text-[13px] text-muted-foreground leading-relaxed">' + esc(m.baseCampNote) + '</span></div>' : '') +
      (m.approach ? '<p class="font-sans text-[13px] text-muted-foreground leading-relaxed max-w-2xl">' + esc(m.approach) + '</p>' : '') +
      (m.acclimatisation ? '<div class="mt-6 border-l-2 border-accent pl-4 max-w-2xl"><span class="lbl block mb-1">Acclimatisation strategy</span><span class="font-sans text-[13px] text-foreground leading-relaxed">' + esc(m.acclimatisation) + '</span></div>' : '');
    out.push(section('camps', '04 — Camps &amp; approach', 'The altitude ladder', body, { alt: true }));
  }

  /* ---------- SEASON + WEATHER ---------- */
  if (m.season) {
    var MK = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var CLR = { prime: 'var(--accent)', shoulder: 'rgba(240,98,37,0.4)', rare: 'rgba(147,153,162,0.35)', winter: 'var(--ice)', closed: 'transparent' };
    var mm = m.season.months || {};
    var cal = '<div class="grid grid-cols-12 gap-1.5 mb-3 max-w-2xl">' + MK.map(function (k) {
      var v = mm[k] || 'closed';
      return '<div class="border border-border p-1.5 text-center"><span class="block font-mono text-[9px] text-white uppercase">' + k.slice(0, 1) + '</span><span class="block h-1.5 w-full mt-1.5" style="background:' + CLR[v] + '"></span></div>';
    }).join('') + '</div>';
    var body = '<p class="font-heading font-light text-xl md:text-2xl text-foreground mb-1">' + esc(m.season.primary) + ' · ' + esc(m.season.window) + '</p>' +
      cal +
      '<div class="flex flex-wrap gap-4 mb-6">' + [['prime', 'Prime'], ['shoulder', 'Shoulder'], ['rare', 'Rare'], ['winter', 'Winter']].map(function (l) { return '<span class="flex items-center gap-2 font-mono text-[10px] text-muted-foreground"><span class="h-3 w-3 border border-border" style="background:' + CLR[l[0]] + '"></span>' + l[1] + '</span>'; }).join('') + '</div>' +
      (m.season.note ? '<p class="font-sans text-[13px] text-muted-foreground leading-relaxed max-w-2xl mb-4">' + esc(m.season.note) + '</p>' : '') +
      (m.weather ? '<div class="border-l-2 border-border pl-4 max-w-2xl"><span class="lbl block mb-1">Weather</span><span class="font-sans text-[13px] text-muted-foreground leading-relaxed">' + esc(m.weather) + '</span></div>' : '');
    out.push(section('season', '05 — Season &amp; weather', 'When it is climbed', body));
  }

  /* ---------- HAZARDS / SAFETY ---------- */
  if (has(m.objectiveHazards)) {
    var body = '<div class="grid sm:grid-cols-2 gap-3 mb-8">' + m.objectiveHazards.map(function (h) {
      return '<div class="border border-border bg-card p-4 font-sans text-[13px] text-muted-foreground leading-relaxed flex gap-2"><span class="text-accent shrink-0">▲</span><span>' + esc(h) + '</span></div>';
    }).join('') + '</div>' +
      (m.rescue ? '<div class="border border-border bg-card p-4 max-w-2xl"><span class="lbl block mb-1">Rescue infrastructure</span><span class="font-sans text-[13px] text-muted-foreground leading-relaxed">' + esc(m.rescue.note) + '</span></div>' : '') +
      '<div class="border border-accent/40 bg-accent/5 p-5 mt-6 max-w-3xl"><span class="lbl text-accent block mb-2">Important</span><p class="font-sans text-[13px] text-muted-foreground leading-relaxed">' + esc(D.disclaimer || '') + '</p></div>';
    out.push(section('hazards', '06 — Hazards &amp; rescue', 'What can go wrong', body, { alt: true }));
  }

  /* ---------- PERMITS + LOGISTICS ---------- */
  (function () {
    var body = '';
    if (m.permit) {
      body += '<div class="grid sm:grid-cols-2 gap-4 mb-4">' +
        '<div><span class="lbl block mb-1">Permitting authority</span><span class="font-sans text-[13px] text-muted-foreground leading-relaxed">' + esc(m.permit.authority) + '</span></div>' +
        '<div><span class="lbl block mb-1">Requirements</span><span class="font-sans text-[13px] text-muted-foreground leading-relaxed">' + esc(m.permit.note) + '</span></div>' +
        '</div>' + verifyBox('Permit fees, liaison-officer rules, restricted-area conditions and access to the Tibetan or Pakistani side change from year to year. Your operator arranges the paperwork — confirm the current position for your peak and season before you book.');
    }
    if (m.logistics) body += '<div class="mt-8 max-w-2xl"><span class="lbl block mb-2">Logistics</span><p class="font-sans text-[13px] text-muted-foreground leading-relaxed">' + esc(m.logistics) + '</p></div>';
    if (m.guideSupport) body += '<div class="mt-6 max-w-2xl"><span class="lbl block mb-2">Guide &amp; Sherpa support</span><p class="font-sans text-[13px] text-muted-foreground leading-relaxed">' + esc(m.guideSupport) + '</p></div>';
    if (body) out.push(section('permits', '07 — Permits &amp; logistics', 'The paperwork and the pipeline', body));
  })();

  /* ---------- EQUIPMENT ---------- */
  if (has(m.equipment)) {
    out.push(section('equipment', '08 — Equipment', 'What a summit push demands',
      '<ul class="grid sm:grid-cols-2 gap-x-8 gap-y-2 max-w-3xl">' + m.equipment.map(function (e) { return '<li class="font-sans text-[13px] text-muted-foreground flex gap-2"><span class="text-accent shrink-0">·</span><span>' + esc(e) + '</span></li>'; }).join('') + '</ul>' +
      '<p class="lbl mt-6">Detailed kit lists are issued by your operator against the specific route, camp plan and forecast.</p>', { alt: true }));
  }

  /* ---------- HISTORY ---------- */
  (function () {
    var f = m.firstAscent || {};
    var body = '<div class="border border-border bg-card p-5 mb-8 max-w-2xl">' +
      '<span class="lbl block mb-1">First ascent</span>' +
      '<p class="font-heading text-2xl text-white uppercase leading-tight">' + (f.year || '') + '</p>' +
      (f.date ? '<p class="font-mono text-[11px] text-muted-foreground mt-1">' + esc(f.date) + '</p>' : '') +
      (f.climbers ? '<p class="font-sans text-[13px] text-foreground mt-2 leading-relaxed">' + esc(f.climbers) + '</p>' : '') +
      (f.expedition ? '<p class="font-sans text-[12px] text-muted-foreground mt-1">' + esc(f.expedition) + '</p>' : '') +
      (f.route ? '<p class="font-mono text-[11px] text-accent mt-2">' + esc(f.route) + '</p>' : '') +
      '</div>';
    if (has(m.notableAscents)) {
      body += '<span class="lbl block mb-3">Notable ascents</span><div class="border-l border-border ml-2 mb-8">' + m.notableAscents.map(function (n) {
        return '<div class="relative pl-6 pb-5"><span class="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-accent"></span>' +
          '<span class="font-mono text-[12px] text-white">' + esc(n.label) + '</span>' +
          '<p class="font-sans text-[13px] text-muted-foreground mt-0.5 leading-relaxed max-w-2xl">' + esc(n.detail) + '</p></div>';
      }).join('') + '</div>';
    }
    if (has(m.history)) body += '<div class="prose-x font-sans text-[14px] max-w-3xl">' + m.history.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>';
    out.push(section('history', '09 — History', 'The record on the mountain', body));
  })();

  /* ---------- FAQ ---------- */
  if (has(m.faq)) {
    out.push(section('faq', '10 — FAQ', 'Questions about ' + esc(m.name),
      '<div class="border-t border-border max-w-3xl">' + m.faq.map(function (f) {
        return '<details class="acc border-b border-border py-4 group"><summary class="flex items-start justify-between gap-4"><span class="font-sans text-[14px] md:text-[15px] text-foreground font-medium leading-snug">' + esc(f.q) + '</span><span class="acc-plus shrink-0 text-accent font-mono text-lg leading-none transition-transform mt-0.5">+</span></summary><p class="font-sans text-[13px] text-muted-foreground leading-relaxed mt-3 pr-8">' + esc(f.a) + '</p></details>';
      }).join('') + '</div>', { alt: true }));
  }

  /* ---------- RELATED TREKS + DESTINATIONS ---------- */
  (function () {
    var body = '';
    var rt = (m.relatedTreks || []).map(function (s) { return TREKS[s]; }).filter(Boolean);
    if (rt.length) {
      body += '<span class="lbl block mb-3">Trek beneath this mountain</span><div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">' + rt.map(function (t) {
        return '<a href="/treks/' + esc(t.slug) + '" class="group border border-border bg-card hover:border-accent transition-all block"><div class="aspect-[4/3] overflow-hidden"><img src="' + esc(t.heroImage || '/images/hero-mountain.jpg') + '" alt="' + esc(t.name) + '" class="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"></div><div class="p-4"><span class="lbl block">Trekking Trail</span><span class="block font-heading text-lg uppercase text-white group-hover:text-accent transition-colors mt-1 leading-tight">' + esc(t.name.replace(/ Trek$/, '')) + '</span><span class="block font-mono text-[10px] text-muted-foreground mt-1">' + esc((t.stats || {}).duration || '') + '</span></div></a>';
      }).join('') + '</div>';
    }
    if (has(m.relatedDestinations)) {
      body += '<span class="lbl block mb-3">Around the mountain</span><div class="flex flex-wrap gap-2">' + m.relatedDestinations.map(function (x) { return '<span class="border border-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground">' + esc(x) + '</span>'; }).join('') + '</div>';
    }
    if (body) out.push(section('related', '11 — Related', 'Where this connects', body));
  })();

  /* ---------- OTHER EIGHT-THOUSANDERS ---------- */
  (function () {
    var others = Object.keys(M).map(function (k) { return M[k]; }).sort(function (a, b) { return a.rank - b.rank; }).filter(function (x) { return x.slug !== m.slug; });
    var body = '<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">' + others.map(function (x) {
      return '<a href="/expeditions/' + esc(x.slug) + '" class="group relative overflow-hidden border border-border bg-card h-32 block"><img src="' + esc(x.heroImage) + '" alt="' + esc(x.name) + '" loading="lazy" class="absolute inset-0 h-full w-full object-cover opacity-55 group-hover:opacity-75 transition-opacity"><div class="absolute inset-0 bg-gradient-to-t from-[#101215] to-transparent"></div><div class="relative z-10 flex h-full flex-col justify-end p-3"><span class="font-mono text-[9px] text-white/60">#' + x.rank + ' · ' + esc(x.elevationLabel) + '</span><span class="font-heading text-sm font-light uppercase text-white leading-tight group-hover:text-accent transition-colors">' + esc(x.name) + '</span></div></a>';
    }).join('') + '</div>';
    out.push(section('others', '12 — The atlas', 'The other thirteen', body, { alt: true }));
  })();

  /* ---------- CTA ---------- */
  (function () {
    var cta = D.planningCta || {};
    out.push('<section class="border-b border-border bg-[#15171a]"><div class="max-w-4xl mx-auto px-6 py-20 text-center">' +
      '<span class="kicker">Plan an expedition</span>' +
      '<h2 class="sec-h text-3xl md:text-5xl text-foreground mt-3 mb-4">Climb ' + esc(m.name) + '</h2>' +
      '<p class="font-sans text-[14px] text-muted-foreground max-w-xl mx-auto mb-8">Talk to us about dates, your progression and whether ' + esc(m.name) + ' is the right objective for where you are. We will be honest about it.</p>' +
      '<div class="flex flex-wrap justify-center gap-3">' +
      '<a href="/contact" class="bg-accent text-background hover:bg-accent-hover font-mono text-[11px] uppercase tracking-widest font-semibold px-6 py-3 transition-all">Plan this expedition</a>' +
      '<a href="/contact" class="border border-border text-foreground hover:border-accent hover:text-accent font-mono text-[11px] uppercase tracking-widest font-semibold px-6 py-3 transition-all">Talk to an expert</a>' +
      '<a href="/expeditions" class="border border-border text-foreground hover:border-accent hover:text-accent font-mono text-[11px] uppercase tracking-widest font-semibold px-6 py-3 transition-all">Back to the atlas</a>' +
      '</div></div></section>');
  })();

  root.innerHTML = out.join('');

  /* ---------- interactions ---------- */
  var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) x.target.classList.add('in'); }); }, { threshold: 0.08 });
  document.querySelectorAll('.fade-up').forEach(function (el) { io.observe(el); });

  var mcta = document.getElementById('mobile-cta');
  var mctaName = document.getElementById('mcta-name');
  if (mctaName) mctaName.textContent = m.name;
  var secEls = nav.map(function (n) { return document.getElementById(n[0]); }).filter(Boolean);
  window.addEventListener('scroll', function () {
    var s = window.scrollY, dh = document.documentElement.scrollHeight - window.innerHeight;
    var pb = document.getElementById('read-progress'); if (pb) pb.style.width = (dh > 0 ? s / dh * 100 : 0) + '%';
    if (mcta) mcta.classList.toggle('translate-y-full', s < window.innerHeight * 0.8);
    var cur = null;
    secEls.forEach(function (el) { if (el.getBoundingClientRect().top < 120) cur = el.id; });
    document.querySelectorAll('.hx-nav-link').forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-nav') === cur); });
  }, { passive: true });

  /* JSON-LD */
  var mtnLd = document.createElement('script');
  mtnLd.type = 'application/ld+json';
  mtnLd.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Mountain',
    name: m.name, alternateName: m.aka || undefined,
    elevation: (m.elevationM || 0) + ' m',
    description: m.summary || '',
    geo: m.coordinates ? { '@type': 'GeoCoordinates', latitude: m.coordinates.lat, longitude: m.coordinates.lon } : undefined
  });
  document.head.appendChild(mtnLd);
  if (has(m.faq)) {
    var faqLd = document.createElement('script');
    faqLd.type = 'application/ld+json';
    faqLd.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: m.faq.map(function (f) { return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }; })
    });
    document.head.appendChild(faqLd);
  }
})();
