/* ============================================================================
   TREKKING TRAIL — PAGE RENDERER
   Reads the slug from /treks/<slug>, merges TREKS[slug] over TREK_DEFAULTS,
   and builds every section. Missing data simply does not render.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- theme ---------- */
  window.hmeToggleTheme = function () {
    var t = (localStorage.getItem('vo_theme') === 'light') ? 'dark' : 'light';
    localStorage.setItem('vo_theme', t);
    applyTheme();
  };
  function applyTheme() {
    var light = localStorage.getItem('vo_theme') === 'light';
    document.body.classList.toggle('light-mode', light);
    var i = document.getElementById('theme-icon');
    if (i) i.className = 'fa-solid ' + (light ? 'fa-sun' : 'fa-moon') + ' text-sm' + (light ? ' text-accent' : '');
  }
  applyTheme();

  /* ---------- helpers ---------- */
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var has = function (v) { return Array.isArray(v) ? v.length > 0 : (v != null && v !== ''); };
  var num = function (s) { var m = String(s || '').replace(/,/g, '').match(/-?\d+(\.\d+)?/); return m ? parseFloat(m[0]) : null; };

  function section(id, kicker, heading, bodyHtml, opts) {
    opts = opts || {};
    return '' +
      '<section id="' + id + '" class="hme-sec fade-up scroll-mt-24 border-b border-border ' + (opts.alt ? 'bg-[#191b1f]' : 'bg-background') + '">' +
      '<div class="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">' +
      (kicker ? '<span class="kicker">' + esc(kicker) + '</span>' : '') +
      (heading ? '<h2 class="sec-h text-3xl md:text-5xl text-foreground mt-3 mb-8">' + heading + '</h2>' : '') +
      bodyHtml +
      '</div></section>';
  }

  function meter(label, value) {
    var v = Math.max(0, Math.min(10, value || 0));
    var blocks = '';
    for (var i = 0; i < 10; i++) blocks += '<span class="h-3 w-full ' + (i < v ? 'bg-accent' : 'bg-border') + '"></span>';
    return '' +
      '<div class="space-y-2">' +
      '<div class="flex items-baseline justify-between"><span class="lbl">' + esc(label) + '</span><span class="font-mono text-[10px] text-muted-foreground">' + v + '/10</span></div>' +
      '<div class="grid grid-cols-10 gap-1">' + blocks + '</div>' +
      '</div>';
  }

  function checklistItem(storeKey, id, text, tag) {
    var checked = false;
    try { checked = JSON.parse(localStorage.getItem(storeKey) || '{}')[id] === true; } catch (e) {}
    return '' +
      '<label class="flex items-start gap-3 py-2 border-b border-border/60 cursor-pointer group">' +
      '<input type="checkbox" data-check="' + esc(storeKey) + '" data-id="' + esc(id) + '" ' + (checked ? 'checked' : '') + ' class="mt-1 h-3.5 w-3.5 accent-[color:var(--accent)] shrink-0">' +
      '<span class="font-mono text-[11px] leading-relaxed ' + (checked ? 'line-through text-muted-foreground' : 'text-foreground') + ' group-hover:text-accent transition-colors">' + esc(text) +
      (tag ? ' <span class="ml-1 lbl ' + (tag === 'essential' ? 'text-accent' : '') + '">' + esc(tag) + '</span>' : '') +
      '</span></label>';
  }

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DEFAULT_MONTHS = { Jan: 'poor', Feb: 'fair', Mar: 'good', Apr: 'good', May: 'good', Jun: 'poor', Jul: 'poor', Aug: 'poor', Sep: 'fair', Oct: 'good', Nov: 'good', Dec: 'fair' };
  var RATING_COLOR = { good: 'var(--accent)', fair: '#8a8f98', poor: '#3a3f47' };
  var RATING_TEXT = { good: 'Prime', fair: 'Variable', poor: 'Off-season' };

  /* =====================================================================
     RESOLVE TREK
     ===================================================================== */
  var slug = (location.pathname.replace(/\/+$/, '').split('/').pop() || '').toLowerCase();
  var TREKS = window.TREKS || {};
  var D = window.TREK_DEFAULTS || {};
  var PROV = window.TREK_PROVINCES || {};
  var t = TREKS[slug];
  var root = document.getElementById('trek-root');

  if (!t) {
    root.innerHTML = '<div class="max-w-3xl mx-auto px-6 py-32 text-center">' +
      '<span class="kicker">Trail not found</span>' +
      '<h1 class="sec-h text-4xl md:text-6xl text-foreground mt-4 mb-6">This route isn’t here yet</h1>' +
      '<p class="font-mono text-sm text-muted-foreground mb-8">The trek you asked for doesn’t match any trail in our directory.</p>' +
      '<a href="/treks" class="inline-flex border border-accent text-accent hover:bg-accent hover:text-background font-mono text-[11px] uppercase tracking-widest px-6 py-3 transition-all">Browse all trekking trails</a>' +
      '</div>';
    return;
  }

  var prov = PROV[t.province] || { name: '', label: '' };
  var maxAltM = num(t.stats && t.stats.maxAltitude);
  var lowland = t.lowland === true || (maxAltM != null && maxAltM < 3200);

  /* page meta */
  document.title = (t.seo && t.seo.title) || (t.name + ' — Himalayan Magic Adventure');
  var md = document.querySelector('meta[name="description"]');
  if (md && t.seo && t.seo.description) md.setAttribute('content', t.seo.description);
  var canon = document.getElementById('canonical-link');
  if (canon) canon.setAttribute('href', 'https://himalayanmagic.com/treks/' + t.slug);

  /* =====================================================================
     SECTION BUILDERS
     ===================================================================== */
  var S = t.stats || {};
  var out = [];

  /* ---- HERO ---- */
  out.push('' +
    '<section class="relative min-h-[88vh] flex flex-col justify-end overflow-hidden border-b border-border">' +
    '<div class="absolute inset-0 z-0"><img src="' + esc(t.heroImage || '/images/hero-mountain.jpg') + '" alt="' + esc(t.name) + '" class="h-full w-full object-cover"></div>' +
    '<div class="absolute inset-0 z-10 bg-gradient-to-t from-[#1b1e22] via-[#1b1e22]/55 to-[#1b1e22]/25"></div>' +
    '<div class="absolute inset-0 z-10 bg-gradient-to-r from-[#1b1e22]/70 to-transparent"></div>' +
    '<div class="relative z-20 max-w-6xl mx-auto w-full px-6 md:px-10 pt-28 pb-12">' +
    '<nav class="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 mb-6"><a href="/" class="hover:text-accent">Home</a> / <a href="/treks" class="hover:text-accent">Trekking Trails</a> / <a href="/treks#' + esc(t.province) + '" class="hover:text-accent">' + esc(prov.name.replace(" Province", "")) + '</a> / <span class="text-white/90">' + esc(t.name) + '</span></nav>' +
    '<span class="kicker text-accent">Trekking · Nepal · ' + esc(prov.name) + '</span>' +
    '<h1 class="font-heading font-light uppercase tracking-tightest leading-[0.9] text-white text-5xl md:text-7xl mt-3">' + esc(t.name) + '</h1>' +
    (t.tagline ? '<p class="font-heading font-light text-xl md:text-2xl text-accent mt-3 tracking-wide">' + esc(t.tagline) + '</p>' : '') +
    (t.summary ? '<p class="max-w-2xl font-sans text-sm md:text-base text-white/80 mt-5 leading-relaxed">' + esc(t.summary) + '</p>' : '') +
    '<div class="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-border border border-border max-w-4xl">' +
    heroStat('Duration', S.duration) +
    heroStat('Difficulty', S.difficulty) +
    heroStat('Max altitude', S.maxAltitude) +
    heroStat('Best season', S.bestSeason) +
    heroStat('Start', S.startPoint) +
    heroStat('End', S.endPoint) +
    '</div>' +
    '<div class="mt-8 flex flex-wrap items-center gap-3">' +
    '<a href="/contact" class="inline-flex items-center gap-2 bg-accent text-background font-mono text-[11px] uppercase tracking-widest font-semibold px-6 py-3 hover:bg-accent-hover transition-colors">Plan This Trek</a>' +
    '<a href="#itinerary" class="inline-flex items-center gap-2 border border-white/40 text-white font-mono text-[11px] uppercase tracking-widest px-6 py-3 hover:border-accent hover:text-accent transition-all">View Itinerary</a>' +
    '<button id="btn-save" class="inline-flex items-center gap-2 border border-white/25 text-white/80 font-mono text-[11px] uppercase tracking-widest px-4 py-3 hover:border-accent hover:text-accent transition-all"><i class="fa-regular fa-bookmark"></i><span>Save</span></button>' +
    '<button id="btn-share" class="inline-flex items-center gap-2 border border-white/25 text-white/80 font-mono text-[11px] uppercase tracking-widest px-4 py-3 hover:border-accent hover:text-accent transition-all"><i class="fa-solid fa-arrow-up-from-bracket"></i><span>Share</span></button>' +
    '</div>' +
    '</div></section>');

  function heroStat(label, val) {
    if (!has(val)) return '';
    return '<div class="bg-[#16181b]/90 backdrop-blur-sm p-3"><span class="lbl block">' + esc(label) + '</span><span class="block font-mono text-[11px] text-white mt-1 leading-snug">' + esc(val) + '</span></div>';
  }

  /* ---- STICKY SUBNAV ---- */
  var navItems = [['overview', 'Overview'], ['suitability', 'Suitability'], ['route-map', 'Map'], ['itinerary', 'Itinerary']];
  if (!lowland) navItems.push(['altitude', 'Altitude']);
  navItems.push(['seasons', 'Best time'], ['permits', 'Permits'], ['cost', 'Cost'], ['packing', 'Packing'], ['faq', 'FAQ']);
  out.push('<nav id="subnav" class="sticky top-0 z-30 border-b border-border bg-[#16181b]/95 backdrop-blur-md -mb-px">' +
    '<div class="max-w-6xl mx-auto px-4 md:px-10 flex items-center gap-1 overflow-x-auto snapx">' +
    navItems.map(function (n) { return '<a href="#' + n[0] + '" data-nav="' + n[0] + '" class="hme-nav-link shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-accent px-3 py-3.5 transition-colors">' + esc(n[1]) + '</a>'; }).join('') +
    '</div></nav>');

  /* ---- QUICK OVERVIEW BAR ---- */
  out.push('<section class="border-b border-border bg-[#191b1f]"><div class="max-w-6xl mx-auto px-6 md:px-10 py-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">' +
    qbar('Duration', S.duration) + qbar('Difficulty', S.difficulty) + qbar('Max altitude', S.maxAltitude, S.maxAltitudePoint) +
    qbar('Best season', S.bestSeason) + qbar('Distance', S.distanceKm) + qbar('Walking', S.walkHours) +
    qbar('Region', t.region) +
    '</div></section>');
  function qbar(label, val, sub) {
    if (!has(val)) return '';
    return '<div><span class="lbl block">' + esc(label) + '</span><span class="block font-heading text-lg text-white mt-1 leading-tight">' + esc(val) + '</span>' + (sub ? '<span class="block font-mono text-[10px] text-muted-foreground mt-0.5">' + esc(sub) + '</span>' : '') + '</div>';
  }

  /* ---- OVERVIEW ---- */
  if (has(t.overview) || has(t.highlights)) {
    var ov = '<div class="grid lg:grid-cols-[1.6fr_1fr] gap-10">' +
      '<div class="prose-trek font-sans text-[15px]">' + (t.overview || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>';
    if (has(t.highlights)) {
      ov += '<div class="border border-border bg-card p-6 h-fit"><span class="lbl block mb-4">Trip highlights</span><ul class="space-y-3">' +
        t.highlights.map(function (h) { return '<li class="flex gap-3 font-mono text-[12px] text-foreground leading-relaxed"><span class="text-accent mt-0.5">▲</span><span>' + esc(h) + '</span></li>'; }).join('') +
        '</ul></div>';
    }
    ov += '</div>';
    out.push(section('overview', '01 — The Trek', 'What ' + esc(t.name.replace(/ Trek$/, '')) + ' is', ov));
  }

  /* ---- SUITABILITY ---- */
  if (t.suitability) {
    var su = t.suitability;
    var body = '<div class="grid md:grid-cols-2 gap-x-12 gap-y-6 mb-10">' +
      meter('Physical demand', su.physical) + meter('Technical difficulty', su.technical) +
      meter('Altitude challenge', su.altitude) + meter('Remoteness', su.remoteness) +
      '</div>';
    var facts = [['Walking hours', su.walkHours], ['Terrain', su.terrain], ['Weather exposure', su.weatherExposure]].filter(function (f) { return has(f[1]); });
    if (facts.length) body += '<div class="grid sm:grid-cols-3 gap-6 border-t border-border pt-6 mb-10">' + facts.map(function (f) { return '<div><span class="lbl block mb-1">' + esc(f[0]) + '</span><span class="font-sans text-[13px] text-muted-foreground leading-relaxed">' + esc(f[1]) + '</span></div>'; }).join('') + '</div>';
    body += '<div class="grid md:grid-cols-2 gap-6">' +
      panelList('Good for', su.goodFor, 'accent') +
      panelList('May not be ideal for', su.notIdeal, 'muted') +
      '</div>';
    out.push(section('suitability', '02 — Is this trek right for you?', 'How hard, and who for', body, { alt: true }));
  }
  function panelList(title, arr, tone) {
    if (!has(arr)) return '';
    return '<div class="border border-border ' + (tone === 'accent' ? 'bg-accent/5' : 'bg-card') + ' p-6">' +
      '<span class="lbl block mb-3 ' + (tone === 'accent' ? 'text-accent' : '') + '">' + esc(title) + '</span><ul class="space-y-2.5">' +
      arr.map(function (x) { return '<li class="font-sans text-[13px] text-foreground leading-relaxed flex gap-2"><span class="' + (tone === 'accent' ? 'text-accent' : 'text-muted-foreground') + '">' + (tone === 'accent' ? '+' : '–') + '</span><span>' + esc(x) + '</span></li>'; }).join('') +
      '</ul></div>';
  }

  /* ---- WHY ---- */
  if (t.why) {
    var w = '<div class="grid lg:grid-cols-[1fr_1.4fr] gap-10 items-start">' +
      '<div>' + (t.why.lead ? '<p class="font-heading font-light text-2xl md:text-3xl text-foreground leading-tight tracking-tight">' + esc(t.why.lead) + '</p>' : '') + '</div>' +
      '<div class="prose-trek font-sans text-[15px]">' + (t.why.paragraphs || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' +
      '</div>';
    if (has(t.why.gallery)) {
      w += '<div class="mt-10 -mx-6 md:mx-0 px-6 md:px-0 flex gap-4 overflow-x-auto snapx pb-2">' +
        t.why.gallery.map(function (g) { return '<figure class="shrink-0 w-[80%] sm:w-[46%] lg:w-[32%]"><div class="aspect-[4/3] overflow-hidden border border-border"><img src="' + esc(g.img) + '" alt="' + esc(g.caption || t.name) + '" class="h-full w-full object-cover"></div>' + (g.caption ? '<figcaption class="lbl mt-2">' + esc(g.caption) + '</figcaption>' : '') + '</figure>'; }).join('') +
        '</div>';
    }
    out.push(section('why', '03 — Why this route', 'Why trek ' + esc(t.name.replace(/ Trek$/, '')), w));
  }

  /* ---- ROUTE MAP ---- */
  if (has(t.routePoints)) {
    out.push(section('route-map', '04 — The route', 'Route map', buildRouteMap(t.routePoints)));
  }

  /* ---- ROUTE AT A GLANCE + ITINERARY ---- */
  if (has(t.itinerary)) {
    out.push(section('route-glance', '05 — Route at a glance', 'Day by day, in brief', buildGlance(t.itinerary), { alt: true }));
    out.push(section('itinerary', '06 — Detailed itinerary', 'The full day-by-day', buildItinerary(t.itinerary)));
    if (!lowland) out.push(section('elevation', '07 — Elevation profile', 'The altitude picture', buildElevation(t.itinerary, t.passes)));
  }

  /* ---- ACCLIMATIZATION ---- */
  if (!lowland && (t.acclimatization || D.altitudeAms)) {
    var ac = t.acclimatization || {};
    var acBody = '';
    if (ac.note) acBody += '<p class="prose-trek font-sans text-[15px] mb-6"><span class="text-foreground">' + esc(ac.note) + '</span></p>';
    if (has(ac.days) && has(t.itinerary)) {
      acBody += '<div class="flex flex-wrap gap-2 mb-8">' + ac.days.map(function (d) {
        var day = (t.itinerary || []).filter(function (x) { return x.day === d; })[0];
        return '<span class="border border-accent/40 bg-accent/5 px-3 py-1.5 font-mono text-[11px] text-foreground">Day ' + d + (day ? ' · ' + esc(day.title) : '') + '</span>';
      }).join('') + '</div>';
    }
    var am = D.altitudeAms || {};
    if (am.principles) {
      acBody += '<div class="grid md:grid-cols-2 gap-6 border-t border-border pt-8">' +
        '<div><span class="lbl block mb-3">Golden rules</span><ul class="space-y-2.5">' + am.principles.map(function (p) { return '<li class="font-sans text-[13px] text-muted-foreground leading-relaxed flex gap-2"><span class="text-accent">•</span><span>' + esc(p) + '</span></li>'; }).join('') + '</ul></div>' +
        '<div><span class="lbl block mb-3">Warning signs</span><ul class="space-y-2.5">' + (am.signs || []).map(function (p) { return '<li class="font-sans text-[13px] text-muted-foreground leading-relaxed flex gap-2"><span class="text-accent">•</span><span>' + esc(p) + '</span></li>'; }).join('') + '</ul></div>' +
        '</div>';
    }
    out.push(section('acclimatization', '08 — Acclimatisation', 'Going up slowly', acBody, { alt: true }));
  }

  /* ---- BEST TIME / SEASONS ---- */
  (function () {
    var months = (t.seasons && t.seasons.months) || DEFAULT_MONTHS;
    var intro = (t.seasons && t.seasons.intro) || D.seasonsIntro || '';
    var grid = '<div class="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 mb-6">' + MONTHS.map(function (m) {
      var r = months[m] || 'fair';
      return '<div class="border border-border p-2 text-center"><span class="block font-mono text-[10px] text-white uppercase">' + m + '</span>' +
        '<span class="block h-1.5 w-full mt-2" style="background:' + RATING_COLOR[r] + '"></span>' +
        '<span class="block lbl mt-1.5" style="font-size:8px">' + RATING_TEXT[r] + '</span></div>';
    }).join('') + '</div>';
    var best = MONTHS.filter(function (m) { return (months[m] || '') === 'good'; });
    var body = (intro ? '<p class="prose-trek font-sans text-[15px] mb-6">' + esc(intro) + '</p>' : '') + grid +
      (best.length ? '<p class="font-mono text-[12px] text-foreground"><span class="text-accent">Best months:</span> ' + best.join(' · ') + '</p>' : '') +
      (t.seasons && has(t.seasons.notes) ? '<div class="mt-8 grid sm:grid-cols-2 gap-6 border-t border-border pt-6">' + t.seasons.notes.map(function (n) { return '<div><span class="lbl block mb-1">' + esc(n.label) + '</span><span class="font-sans text-[13px] text-muted-foreground leading-relaxed">' + esc(n.text) + '</span></div>'; }).join('') + '</div>' : '');
    out.push(section('seasons', '09 — Best time to trek', 'When to go', body));
  })();

  /* ---- WEATHER ---- */
  if (has(t.weather)) {
    out.push(section('weather', '10 — Weather guide', 'What to expect underfoot and overhead',
      '<div class="overflow-x-auto border border-border"><table class="w-full text-left font-mono text-[12px]"><thead class="bg-[#16181b] text-[10px] uppercase tracking-widest text-accent border-b border-border"><tr><th class="p-3">Zone / season</th><th class="p-3">Conditions</th></tr></thead><tbody class="divide-y divide-border text-muted-foreground">' +
      t.weather.map(function (r) { return '<tr><td class="p-3 text-white">' + esc(r.band) + '</td><td class="p-3">' + esc(r.note) + '</td></tr>'; }).join('') +
      '</tbody></table></div><p class="lbl mt-3">General climate patterns only — not a forecast. Check conditions close to departure.</p>', { alt: true }));
  }

  /* ---- PERMITS ---- */
  if (has(t.permits)) {
    var pm = '<div class="overflow-x-auto border border-border mb-8"><table class="w-full text-left font-mono text-[12px]"><thead class="bg-[#16181b] text-[10px] uppercase tracking-widest text-accent border-b border-border"><tr><th class="p-3">Permit</th><th class="p-3">Where</th><th class="p-3">Fee</th><th class="p-3">Notes</th></tr></thead><tbody class="divide-y divide-border text-muted-foreground">' +
      t.permits.map(function (p) { return '<tr><td class="p-3 text-white">' + esc(p.name) + '</td><td class="p-3">' + esc(p.where) + '</td><td class="p-3 text-accent">' + esc(p.feeNote) + '</td><td class="p-3">' + esc(p.notes || '') + '</td></tr>'; }).join('') +
      '</tbody></table></div>' +
      '<div class="border border-accent/30 bg-accent/5 p-4 mb-8"><span class="lbl text-accent block mb-1">Verify before departure</span><span class="font-sans text-[13px] text-muted-foreground">Permit fees and rules are set by the government and change. Your operator arranges and carries every permit for a booked trip; confirm current amounts and any restricted-area conditions before you travel.</span></div>' +
      (has(D.beforeKathmandu) ? '<span class="lbl block mb-3">Before you leave Kathmandu</span><div class="grid sm:grid-cols-2 gap-x-8">' + D.beforeKathmandu.map(function (x, i) { return checklistItem('vo_bk_' + t.slug, 'bk' + i, x); }).join('') + '</div>' : '');
    out.push(section('permits', '11 — Permits & documents', 'Paperwork', pm));
  }

  /* ---- COST ---- */
  if (t.cost) {
    var c = t.cost;
    var cb = (c.note ? '<p class="prose-trek font-sans text-[15px] mb-8">' + esc(c.note) + '</p>' : '');
    if (has(c.tiers)) {
      cb += '<div class="grid md:grid-cols-3 gap-px bg-border border border-border mb-8">' + c.tiers.map(function (tr) {
        return '<div class="bg-card p-6"><span class="lbl block">' + esc(tr.name) + '</span><span class="block font-heading text-2xl text-accent mt-2 mb-4">' + esc(tr.rangeUSD) + '</span><ul class="space-y-1.5">' + (tr.includes || []).map(function (x) { return '<li class="font-mono text-[11px] text-muted-foreground leading-relaxed">' + esc(x) + '</li>'; }).join('') + '</ul></div>';
      }).join('') + '</div>';
    }
    if (has(c.breakdown)) {
      cb += '<span class="lbl block mb-3">Where the money goes</span><div class="border border-border divide-y divide-border mb-6">' + c.breakdown.map(function (b) { return '<div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 p-3"><span class="font-mono text-[12px] text-white sm:w-48 shrink-0">' + esc(b.item) + '</span><span class="font-sans text-[12px] text-muted-foreground">' + esc(b.note) + '</span></div>'; }).join('') + '</div>';
    }
    if (c.independentVsGuided) cb += '<div class="border border-border bg-card p-4"><span class="lbl block mb-1">Independent vs guided</span><span class="font-sans text-[13px] text-muted-foreground">' + esc(c.independentVsGuided) + '</span></div>';
    cb += '<p class="lbl mt-4">Prices are indicative and were not fixed at time of writing — always request a written quote for your dates.</p>';
    out.push(section('cost', '12 — Cost & budget', 'What it costs', cb, { alt: true }));
  }

  /* ---- TRANSPORT ---- */
  if (t.transport && has(t.transport.steps)) {
    var tr = '<div class="space-y-0 border-l border-border ml-2 mb-6">' + t.transport.steps.map(function (s) {
      return '<div class="relative pl-6 pb-6"><span class="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-accent"></span>' +
        '<span class="font-mono text-[12px] text-white">' + esc(s.from) + ' <span class="text-accent">→</span> ' + esc(s.to) + '</span>' +
        '<span class="block font-mono text-[11px] text-muted-foreground mt-1">' + esc(s.mode) + (s.duration && s.duration !== '—' ? ' · ' + esc(s.duration) : '') + '</span>' +
        (s.note ? '<span class="block font-sans text-[12px] text-muted-foreground mt-1 leading-relaxed">' + esc(s.note) + '</span>' : '') +
        '</div>';
    }).join('') + '</div>' + (t.transport.note ? '<p class="border border-border bg-card p-4 font-sans text-[13px] text-muted-foreground">' + esc(t.transport.note) + '</p>' : '');
    out.push(section('transport', '13 — Getting there', 'How you reach the trail', tr));
  }

  /* ---- ACCOMMODATION ---- */
  (function () {
    var a = D.accommodation || {};
    var body = (a.intro ? '<p class="prose-trek font-sans text-[15px] mb-6">' + esc(a.intro) + '</p>' : '') +
      (t.accommodationNote ? '<p class="border border-accent/30 bg-accent/5 p-4 font-sans text-[13px] text-muted-foreground mb-6"><span class="text-accent">On this route: </span>' + esc(t.accommodationNote) + '</p>' : '') +
      (has(a.amenities) ? '<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">' + a.amenities.map(function (m) { return '<div class="border border-border bg-card p-4"><span class="lbl block mb-1">' + esc(m.label) + '</span><span class="font-sans text-[12px] text-muted-foreground leading-relaxed">' + esc(m.note) + '</span></div>'; }).join('') + '</div>' : '') +
      (has(a.points) ? '<ul class="space-y-2">' + a.points.map(function (p) { return '<li class="font-sans text-[13px] text-muted-foreground flex gap-2"><span class="text-accent">•</span><span>' + esc(p) + '</span></li>'; }).join('') + '</ul>' : '');
    out.push(section('accommodation', '14 — Accommodation', 'Where you sleep', body, { alt: true }));
  })();

  /* ---- FOOD & WATER ---- */
  (function () {
    var f = D.food || {}, wtr = D.water || {};
    var body = '<div class="grid md:grid-cols-2 gap-10">' +
      '<div><span class="lbl block mb-3">Food</span>' + (f.intro ? '<p class="font-sans text-[13px] text-muted-foreground leading-relaxed mb-4">' + esc(f.intro) + '</p>' : '') +
      (t.foodNote ? '<p class="font-sans text-[13px] text-accent leading-relaxed mb-4">' + esc(t.foodNote) + '</p>' : '') +
      (has(f.typical) ? '<ul class="space-y-1.5 mb-4">' + f.typical.map(function (x) { return '<li class="font-mono text-[11px] text-foreground leading-relaxed">' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
      (has(f.points) ? '<ul class="space-y-2">' + f.points.map(function (x) { return '<li class="font-sans text-[12px] text-muted-foreground flex gap-2"><span class="text-accent">•</span><span>' + esc(x) + '</span></li>'; }).join('') + '</ul>' : '') + '</div>' +
      '<div><span class="lbl block mb-3">Water</span>' + (wtr.intro ? '<p class="font-sans text-[13px] text-muted-foreground leading-relaxed mb-4">' + esc(wtr.intro) + '</p>' : '') +
      (t.waterNote ? '<p class="font-sans text-[13px] text-accent leading-relaxed mb-4">' + esc(t.waterNote) + '</p>' : '') +
      (has(wtr.points) ? '<ul class="space-y-2">' + wtr.points.map(function (x) { return '<li class="font-sans text-[12px] text-muted-foreground flex gap-2"><span class="text-accent">•</span><span>' + esc(x) + '</span></li>'; }).join('') + '</ul>' : '') + '</div>' +
      '</div>';
    out.push(section('food-water', '15 — Food & water', 'Eating and drinking on the trail', body));
  })();

  /* ---- PACKING LIST ---- */
  (function () {
    var pl = t.packingList || D.packingList || [];
    if (!has(pl)) return;
    var body = '<div class="flex items-center justify-between mb-6"><p class="font-sans text-[13px] text-muted-foreground max-w-xl">Tick items as you pack. Your progress is saved on this device. <span class="text-accent">Essential</span> items are the ones you should not leave Kathmandu without.</p><button id="packing-reset" class="shrink-0 border border-border font-mono text-[10px] uppercase tracking-widest px-3 py-2 text-muted-foreground hover:border-accent hover:text-accent transition-all">Reset</button></div>' +
      '<div id="packing-grid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">' + pl.map(function (cat, ci) {
        return '<div><span class="lbl block mb-2 text-accent">' + esc(cat.category) + '</span>' + (cat.items || []).map(function (it, ii) { return checklistItem('vo_pack_' + t.slug, 'p' + ci + '_' + ii, it.name, it.tier); }).join('') + '</div>';
      }).join('') + '</div>';
    out.push(section('packing', '16 — Packing list', 'What to bring', body, { alt: true }));
  })();

  /* ---- EQUIPMENT ---- */
  if (has(t.equipment)) {
    out.push(section('equipment', '17 — Equipment & gear', 'Route-specific kit',
      '<div class="border border-border divide-y divide-border">' + t.equipment.map(function (e) {
        return '<div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 p-3"><span class="font-mono text-[12px] text-white sm:w-56 shrink-0">' + esc(e.item) + '</span><span class="lbl shrink-0 sm:w-24 ' + (e.need === 'essential' ? 'text-accent' : '') + '">' + esc(e.need) + '</span><span class="font-sans text-[12px] text-muted-foreground">' + esc(e.note || '') + '</span></div>';
      }).join('') + '</div>'));
  }

  /* ---- GUIDE & PORTER ---- */
  (function () {
    var g = D.guidePorter || {};
    if (!g.intro) return;
    var body = '<p class="prose-trek font-sans text-[15px] mb-8">' + esc(g.intro) + '</p>' +
      '<div class="grid md:grid-cols-2 gap-6 mb-8">' +
      colList('What your guide does', g.guide) + colList('What your porter does', g.porter) + '</div>' +
      (has(g.ethics) ? '<div class="border border-border bg-card p-5 mb-6"><span class="lbl block mb-3">Ethical porter practice</span><ul class="space-y-2">' + g.ethics.map(function (x) { return '<li class="font-sans text-[13px] text-muted-foreground flex gap-2"><span class="text-accent">•</span><span>' + esc(x) + '</span></li>'; }).join('') + '</ul></div>' : '') +
      (g.goodGuide ? '<div><span class="lbl block mb-2">What makes a good guide?</span><p class="font-sans text-[14px] text-foreground leading-relaxed">' + esc(g.goodGuide) + '</p></div>' : '');
    out.push(section('guides', '18 — Guides & porters', 'The people who get you there', body, { alt: true }));
  })();
  function colList(title, arr) {
    if (!has(arr)) return '';
    return '<div><span class="lbl block mb-3">' + esc(title) + '</span><ul class="space-y-2.5">' + arr.map(function (x) { return '<li class="font-sans text-[13px] text-muted-foreground leading-relaxed flex gap-2"><span class="text-accent">•</span><span>' + esc(x) + '</span></li>'; }).join('') + '</ul></div>';
  }

  /* ---- SAFETY ---- */
  if (t.safety) {
    var sf = t.safety;
    var body = (has(sf.risks) ? '<div class="grid sm:grid-cols-2 gap-4 mb-8">' + sf.risks.map(function (r) { return '<div class="border border-border bg-card p-4"><span class="font-mono text-[11px] text-accent uppercase tracking-wider block mb-1">' + esc(r.name) + '</span><span class="font-sans text-[12px] text-muted-foreground leading-relaxed">' + esc(r.note) + '</span></div>'; }).join('') + '</div>' : '') +
      (sf.turnaround ? '<div class="border-l-2 border-accent pl-4 mb-6"><span class="lbl block mb-1">When to turn around</span><p class="font-sans text-[14px] text-foreground leading-relaxed">' + esc(sf.turnaround) + '</p></div>' : '') +
      (sf.note ? '<p class="font-sans text-[13px] text-muted-foreground leading-relaxed">' + esc(sf.note) + '</p>' : '');
    out.push(section('safety', '19 — Safety', 'Risks, and how they’re managed', body));
  }

  /* ---- ALTITUDE & AMS ---- */
  if (!lowland && D.altitudeAms) {
    var am2 = D.altitudeAms;
    var body = (am2.intro ? '<p class="prose-trek font-sans text-[15px] mb-6">' + esc(am2.intro) + '</p>' : '') +
      '<div class="grid md:grid-cols-2 gap-8 mb-8">' +
      '<div><span class="lbl block mb-3">Warning signs</span><ul class="space-y-2.5">' + (am2.signs || []).map(function (x) { return '<li class="font-sans text-[13px] text-muted-foreground leading-relaxed flex gap-2"><span class="text-accent">•</span><span>' + esc(x) + '</span></li>'; }).join('') + '</ul></div>' +
      '<div><span class="lbl block mb-3">Reducing the risk</span><ul class="space-y-2.5">' + (am2.principles || []).map(function (x) { return '<li class="font-sans text-[13px] text-muted-foreground leading-relaxed flex gap-2"><span class="text-accent">•</span><span>' + esc(x) + '</span></li>'; }).join('') + '</ul></div>' +
      '</div>' +
      '<div class="border border-accent/40 bg-accent/5 p-5"><span class="lbl text-accent block mb-2">Important</span><p class="font-sans text-[13px] text-muted-foreground leading-relaxed">' + esc(am2.disclaimer) + '</p></div>';
    out.push(section('altitude', '20 — Altitude & AMS', 'Altitude sickness, plainly', body, { alt: true }));
  }

  /* ---- EMERGENCY ---- */
  (function () {
    var e = D.emergency || {};
    if (!has(e.fields)) return;
    var body = '<div class="border border-accent/30 bg-accent/5 p-4 mb-6"><span class="lbl text-accent block mb-1">Always verify before departure</span><span class="font-sans text-[13px] text-muted-foreground">' + esc(e.note) + '</span></div>' +
      '<div class="border border-border divide-y divide-border">' + e.fields.map(function (f) { return '<div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 p-3"><span class="font-mono text-[12px] text-white sm:w-64 shrink-0">' + esc(f.label) + '</span><span class="font-mono text-[12px] text-muted-foreground">' + esc(f.value) + '</span></div>'; }).join('') + '</div>';
    out.push(section('emergency', '21 — Emergency information', 'If something goes wrong', body));
  })();

  /* ---- CONNECTIVITY ---- */
  (function () {
    var cn = D.connectivity || {};
    if (!has(cn.scale)) return;
    var body = (cn.intro ? '<p class="prose-trek font-sans text-[15px] mb-6">' + esc(cn.intro) + '</p>' : '') +
      (t.connectivityNote ? '<p class="font-sans text-[13px] text-accent mb-6">' + esc(t.connectivityNote) + '</p>' : '') +
      '<div class="space-y-4">' + cn.scale.map(function (s) {
        var bars = '';
        for (var i = 0; i < 5; i++) bars += '<span class="h-2 w-6 ' + (i < s.level ? 'bg-accent' : 'bg-border') + '"></span>';
        return '<div class="border border-border bg-card p-4"><div class="flex items-center justify-between mb-2"><span class="font-mono text-[12px] text-white">' + esc(s.label) + '</span><span class="flex gap-1">' + bars + '</span></div><span class="font-sans text-[12px] text-muted-foreground leading-relaxed">' + esc(s.note) + '</span></div>';
      }).join('') + '</div>';
    out.push(section('connectivity', '22 — Connectivity & power', 'Staying in touch, and charged', body, { alt: true }));
  })();

  /* ---- MONEY ---- */
  (function () {
    var m = D.money || {};
    if (!m.intro) return;
    var body = '<p class="prose-trek font-sans text-[15px] mb-4">' + esc(m.intro) + '</p>' +
      '<ul class="space-y-2 mb-4">' + (m.points || []).map(function (x) { return '<li class="font-sans text-[13px] text-muted-foreground flex gap-2"><span class="text-accent">•</span><span>' + esc(x) + '</span></li>'; }).join('') + '</ul>' +
      '<p class="lbl">Amounts and ATM availability change — treat this as guidance and confirm before you travel.</p>';
    out.push(section('money', '23 — Money', 'Cash on the trail', body));
  })();

  /* ---- CULTURE ---- */
  (function () {
    var cu = D.culture || {};
    if (!cu.intro) return;
    var body = '<p class="prose-trek font-sans text-[15px] mb-4">' + esc(cu.intro) + '</p>' +
      (t.cultureNote ? '<p class="font-sans text-[13px] text-accent mb-4">' + esc(t.cultureNote) + '</p>' : '') +
      '<ul class="space-y-2">' + (cu.points || []).map(function (x) { return '<li class="font-sans text-[13px] text-muted-foreground flex gap-2"><span class="text-accent">•</span><span>' + esc(x) + '</span></li>'; }).join('') + '</ul>';
    out.push(section('culture', '24 — Culture & etiquette', 'Being a good guest', body, { alt: true }));
  })();

  /* ---- RESPONSIBLE ---- */
  (function () {
    var r = D.responsible || {};
    if (!r.intro) return;
    var body = '<p class="prose-trek font-sans text-[15px] mb-4">' + esc(r.intro) + '</p><ul class="space-y-2">' + (r.points || []).map(function (x) { return '<li class="font-sans text-[13px] text-muted-foreground flex gap-2"><span class="text-accent">•</span><span>' + esc(x) + '</span></li>'; }).join('') + '</ul>';
    out.push(section('responsible', '25 — Responsible trekking', 'Leaving it as you found it', body));
  })();

  /* ---- INSURANCE + VISA ---- */
  (function () {
    var ins = D.insurance || {}, v = D.visa || {};
    var body = '<div class="grid md:grid-cols-2 gap-10">' +
      '<div><span class="lbl block mb-3">Travel insurance</span>' + (ins.intro ? '<p class="font-sans text-[13px] text-muted-foreground leading-relaxed mb-3">' + esc(ins.intro) + '</p>' : '') +
      '<ul class="space-y-2 mb-3">' + (ins.points || []).map(function (x) { return '<li class="font-sans text-[12px] text-muted-foreground flex gap-2"><span class="text-accent">•</span><span>' + esc(x) + '</span></li>'; }).join('') + '</ul>' +
      (ins.disclaimer ? '<p class="lbl">' + esc(ins.disclaimer) + '</p>' : '') + '</div>' +
      '<div><span class="lbl block mb-3">Visa &amp; entry to Nepal</span>' + (v.intro ? '<p class="font-sans text-[13px] text-muted-foreground leading-relaxed mb-3">' + esc(v.intro) + '</p>' : '') +
      '<ul class="space-y-2 mb-3">' + (v.points || []).map(function (x) { return '<li class="font-sans text-[12px] text-muted-foreground flex gap-2"><span class="text-accent">•</span><span>' + esc(x) + '</span></li>'; }).join('') + '</ul>' +
      '<p class="lbl">Immigration rules change — confirm current requirements with the Nepal Department of Immigration before you fly.</p></div>' +
      '</div>';
    out.push(section('insurance-visa', '26 — Insurance & visa', 'The essential admin', body, { alt: true }));
  })();

  /* ---- BEFORE YOU GO CHECKLIST ---- */
  if (has(D.beforeYouGo)) {
    out.push(section('checklist', '27 — Before you go', 'The pre-trip checklist',
      '<p class="font-sans text-[13px] text-muted-foreground mb-6 max-w-xl">Saved on this device. Work through it in the weeks before you fly.</p>' +
      '<div class="grid sm:grid-cols-2 gap-x-10">' + D.beforeYouGo.map(function (x, i) { return checklistItem('vo_byg_' + t.slug, 'b' + i, x); }).join('') + '</div>'));
  }

  /* ---- FAQ ---- */
  if (has(t.faq)) {
    out.push(section('faq', '28 — FAQ', 'Questions people ask about ' + esc(t.name.replace(/ Trek$/, '')),
      '<div class="border-t border-border">' + t.faq.map(function (f) {
        return '<details class="acc border-b border-border py-4 group"><summary class="flex items-start justify-between gap-4"><span class="font-sans text-[14px] md:text-[15px] text-foreground font-medium leading-snug">' + esc(f.q) + '</span><span class="acc-plus shrink-0 text-accent font-mono text-lg leading-none transition-transform mt-0.5">+</span></summary><p class="font-sans text-[13px] text-muted-foreground leading-relaxed mt-3 pr-8">' + esc(f.a) + '</p></details>';
      }).join('') + '</div>'));
  }

  /* ---- RELATED ---- */
  (function () {
    var body = '';
    if (has(t.relatedTreks)) {
      body += '<span class="lbl block mb-3">Alternative trails</span><div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">' + t.relatedTreks.map(function (rs) {
        var rt = TREKS[rs]; if (!rt) return '';
        return '<a href="/treks/' + esc(rs) + '" class="group border border-border bg-card hover:border-accent transition-all block"><div class="aspect-[4/3] overflow-hidden"><img src="' + esc(rt.heroImage || '/images/hero-mountain.jpg') + '" alt="' + esc(rt.name) + '" class="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"></div><div class="p-4"><span class="lbl block">' + esc((TREK_PROVINCES[rt.province] || {}).name || '') + '</span><span class="block font-heading text-lg uppercase text-white group-hover:text-accent transition-colors mt-1 leading-tight">' + esc(rt.name.replace(/ Trek$/, '')) + '</span><span class="block font-mono text-[10px] text-muted-foreground mt-1">' + esc((rt.stats || {}).duration || '') + '</span></div></a>';
      }).join('') + '</div>';
    }
    if (has(t.relatedDestinations)) {
      body += '<span class="lbl block mb-3">Combine it with</span><div class="grid sm:grid-cols-3 gap-4 mb-10">' + t.relatedDestinations.map(function (d) { return '<div class="border border-border bg-card p-4"><span class="font-mono text-[12px] text-white block mb-1">' + esc(d.name) + '</span><span class="font-sans text-[12px] text-muted-foreground leading-relaxed">' + esc(d.note) + '</span></div>'; }).join('') + '</div>';
    }
    if (t.hotelsNote) {
      body += '<span class="lbl block mb-3">Where to stay</span><p class="font-sans text-[13px] text-muted-foreground leading-relaxed max-w-2xl">' + esc(t.hotelsNote) + '</p>';
    }
    if (body) out.push(section('related', '29 — Related', 'Where to go from here', body, { alt: true }));
  })();

  /* ---- PLANNING CTA ---- */
  (function () {
    var p = D.planningCta || {};
    out.push('<section class="border-b border-border bg-background"><div class="max-w-4xl mx-auto px-6 py-20 text-center">' +
      '<span class="kicker">30 — Plan your trek</span>' +
      '<h2 class="sec-h text-3xl md:text-5xl text-foreground mt-3 mb-4">' + esc(p.heading || 'Ready to plan your trek?') + '</h2>' +
      (p.sub ? '<p class="font-sans text-[14px] text-muted-foreground max-w-xl mx-auto mb-8">' + esc(p.sub) + '</p>' : '') +
      '<div class="flex flex-wrap justify-center gap-3">' + (p.actions || []).map(function (a, i) { return '<a href="' + esc(a.href) + '" class="' + (i === 0 ? 'bg-accent text-background hover:bg-accent-hover' : 'border border-border text-foreground hover:border-accent hover:text-accent') + ' font-mono text-[11px] uppercase tracking-widest font-semibold px-6 py-3 transition-all">' + esc(a.label) + '</a>'; }).join('') + '</div>' +
      '</div></section>');
  })();

  /* ---- TRUST ---- */
  if (has(D.trust)) {
    out.push('<section class="bg-[#191b1f]"><div class="max-w-6xl mx-auto px-6 md:px-10 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">' +
      D.trust.map(function (x) { return '<div><span class="font-mono text-[11px] text-accent uppercase tracking-wider block mb-2">' + esc(x.title) + '</span><span class="font-sans text-[12px] text-muted-foreground leading-relaxed">' + esc(x.note) + '</span></div>'; }).join('') +
      '</div></section>');
  }

  root.innerHTML = out.join('');

  /* =====================================================================
     INTERACTIVE PIECES
     ===================================================================== */
  function buildRouteMap(pts) {
    var n = pts.length;
    var W = 1000, H = 320, padX = 60, padY = 50;
    var alt = pts.map(function (p) { return num(p.elevation) || 0; });
    var lo = Math.min.apply(null, alt), hi = Math.max.apply(null, alt);
    var span = (hi - lo) || 1;
    var coords = pts.map(function (p, i) {
      var x = padX + (W - 2 * padX) * (n === 1 ? 0.5 : i / (n - 1));
      var y = H - padY - (H - 2 * padY) * (((num(p.elevation) || 0) - lo) / span);
      return [x, y];
    });
    var line = coords.map(function (c, i) { return (i ? 'L' : 'M') + c[0].toFixed(1) + ',' + c[1].toFixed(1); }).join(' ');
    var area = line + ' L' + coords[n - 1][0].toFixed(1) + ',' + (H - padY) + ' L' + coords[0][0].toFixed(1) + ',' + (H - padY) + ' Z';
    var dots = coords.map(function (c, i) {
      return '<g data-map-pt="' + i + '" class="hme-map-node">' +
        '<circle cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" r="6" fill="#16181b" stroke="var(--accent)" stroke-width="2"/>' +
        '<circle cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" r="14" fill="transparent"/>' +
        '</g>';
    }).join('');
    var labels = coords.map(function (c, i) {
      var up = i % 2 === 0;
      return '<text x="' + c[0].toFixed(1) + '" y="' + (up ? c[1] - 22 : c[1] + 30).toFixed(1) + '" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="#9ca3af">' + esc(pts[i].name) + '</text>';
    }).join('');

    var listItems = pts.map(function (p, i) {
      return '<button data-map-pt="' + i + '" class="hme-map-li w-full text-left border-b border-border py-3 px-1 hover:bg-card transition-colors flex items-baseline justify-between gap-3">' +
        '<span class="font-mono text-[12px] text-white">' + esc(p.name) + '</span>' +
        '<span class="font-mono text-[11px] text-accent shrink-0">' + esc(p.elevation) + '</span></button>';
    }).join('');

    return '<div class="grid lg:grid-cols-[1.5fr_1fr] gap-8">' +
      '<div class="border border-border bg-[#16181b] p-3 md:p-5">' +
      '<div class="hidden md:block relative w-full" style="aspect-ratio: 1000/320;">' +
      '<svg viewBox="0 0 1000 320" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="' + area + '" fill="var(--accent)" fill-opacity="0.08"/>' +
      '<path d="' + line + '" fill="none" stroke="var(--accent)" stroke-opacity="0.5" stroke-width="2"/>' +
      dots + labels +
      '</svg></div>' +
      '<div class="md:hidden">' + listItems + '</div>' +
      '<p class="lbl mt-3">Schematic — vertical axis is relative elevation, not to scale. Tap a point for detail.</p>' +
      '</div>' +
      '<div id="map-detail" class="border border-border bg-card p-6 min-h-[280px] flex flex-col justify-center">' +
      '<span class="lbl block mb-2">Select a point on the route</span><p class="font-sans text-[13px] text-muted-foreground">Every overnight stop and major landmark, with its altitude, walking time, what accommodation to expect and anything to watch for.</p>' +
      '</div></div>';
  }

  function renderMapDetail(i) {
    var p = t.routePoints[i];
    if (!p) return;
    var box = document.getElementById('map-detail');
    box.innerHTML = '<span class="lbl block">Route point ' + (i + 1) + ' / ' + t.routePoints.length + '</span>' +
      '<h3 class="font-heading text-2xl uppercase text-white mt-1 mb-3 leading-tight">' + esc(p.name) + '</h3>' +
      '<div class="grid grid-cols-2 gap-3 mb-4">' +
      dbox('Elevation', p.elevation) + dbox('Walking', p.walkTime) +
      '</div>' +
      (p.stay ? '<div class="mb-3"><span class="lbl block mb-0.5">Accommodation</span><span class="font-sans text-[13px] text-muted-foreground">' + esc(p.stay) + '</span></div>' : '') +
      (p.highlight ? '<div class="mb-3"><span class="lbl block mb-0.5 text-accent">Highlight</span><span class="font-sans text-[13px] text-foreground">' + esc(p.highlight) + '</span></div>' : '') +
      (p.warning && p.warning !== '—' ? '<div class="border-l-2 border-accent pl-3"><span class="lbl block mb-0.5">Note</span><span class="font-sans text-[13px] text-muted-foreground">' + esc(p.warning) + '</span></div>' : '');
    document.querySelectorAll('[data-map-pt]').forEach(function (el) {
      var on = el.getAttribute('data-map-pt') == i;
      el.classList.toggle('bg-card', on && el.classList.contains('hme-map-li'));
      var c = el.querySelector && el.querySelector('circle');
      if (c) c.setAttribute('fill', on ? 'var(--accent)' : '#16181b');
    });
  }
  function dbox(l, v) { return '<div class="border border-border p-2"><span class="lbl block">' + esc(l) + '</span><span class="font-mono text-[12px] text-white">' + esc(v || '—') + '</span></div>'; }

  function buildGlance(it) {
    return '<div class="border-l border-border ml-2">' + it.map(function (d) {
      return '<div class="relative pl-6 pb-5"><span class="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-accent"></span>' +
        '<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">' +
        '<span class="font-mono text-[10px] text-accent uppercase tracking-widest">Day ' + d.day + '</span>' +
        '<span class="font-heading text-base md:text-lg text-white uppercase leading-tight">' + esc(d.title) + '</span></div>' +
        '<div class="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 font-mono text-[10px] text-muted-foreground">' +
        (d.distanceKm && d.distanceKm !== '—' ? '<span>' + esc(d.distanceKm) + '</span>' : '') +
        (d.walkHours && d.walkHours !== '—' ? '<span>' + esc(d.walkHours) + '</span>' : '') +
        (d.endEle ? '<span>' + (d.startEle ? esc(d.startEle) + '→' : '') + esc(d.endEle) + ' m</span>' : '') +
        (d.stay ? '<span class="text-white/70">' + esc(d.stay) + '</span>' : '') +
        '</div></div>';
    }).join('') + '</div>';
  }

  function buildItinerary(it) {
    return '<div class="border-t border-border">' + it.map(function (d, idx) {
      var grid = [['Distance', d.distanceKm], ['Walking', d.walkHours], ['Elevation', (d.startEle ? d.startEle + ' m → ' : '') + (d.endEle ? d.endEle + ' m' : '')], ['Terrain', d.terrain], ['Accommodation', d.stay], ['Meals', d.meals]]
        .filter(function (g) { return has(g[1]) && g[1] !== '—' && g[1] !== ' m'; })
        .map(function (g) { return '<div><span class="lbl block">' + esc(g[0]) + '</span><span class="font-mono text-[11px] text-white">' + esc(g[1]) + '</span></div>'; }).join('');
      return '<details class="acc border-b border-border py-4" ' + (idx === 0 ? 'open' : '') + '>' +
        '<summary class="flex items-start justify-between gap-4"><span class="flex items-baseline gap-3"><span class="font-mono text-[10px] text-accent uppercase tracking-widest shrink-0 pt-1">Day ' + d.day + '</span><span class="font-heading text-lg md:text-xl text-white uppercase leading-tight">' + esc(d.title) + '</span></span><span class="acc-plus shrink-0 text-accent font-mono text-lg leading-none transition-transform">+</span></summary>' +
        '<div class="mt-4 pl-0 md:pl-14">' +
        (d.from || d.to ? '<p class="font-mono text-[11px] text-muted-foreground mb-4">' + esc(d.from || '') + (d.to ? ' <span class="text-accent">→</span> ' + esc(d.to) : '') + '</p>' : '') +
        (grid ? '<div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">' + grid + '</div>' : '') +
        (has(d.highlights) ? '<div class="mb-3"><span class="lbl block mb-1 text-accent">Highlights</span><ul class="space-y-1">' + d.highlights.map(function (h) { return '<li class="font-sans text-[13px] text-muted-foreground flex gap-2"><span class="text-accent">•</span><span>' + esc(h) + '</span></li>'; }).join('') + '</ul></div>' : '') +
        (d.tips ? '<div class="border-l-2 border-border pl-3"><span class="lbl block mb-0.5">Tip</span><span class="font-sans text-[13px] text-muted-foreground">' + esc(d.tips) + '</span></div>' : '') +
        '</div></details>';
    }).join('') + '</div>';
  }

  function buildElevation(it, passes) {
    var days = it.filter(function (d) { return d.endEle; });
    if (days.length < 2) return '<p class="font-sans text-sm text-muted-foreground">Elevation data is being finalised for this route.</p>';
    var W = 1000, H = 300, padX = 46, padY = 34;
    var els = days.map(function (d) { return d.endEle; });
    var lo = Math.min.apply(null, els.concat(days.map(function (d) { return d.startEle || d.endEle; })));
    var hi = Math.max.apply(null, els.concat(days.map(function (d) { return d.startEle || d.endEle; })));
    lo = Math.floor(lo / 500) * 500; hi = Math.ceil(hi / 500) * 500;
    var span = (hi - lo) || 1;
    var X = function (i) { return padX + (W - 2 * padX) * (i / (days.length - 1)); };
    var Y = function (v) { return H - padY - (H - 2 * padY) * ((v - lo) / span); };
    var line = days.map(function (d, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ',' + Y(d.endEle).toFixed(1); }).join(' ');
    var area = line + ' L' + X(days.length - 1).toFixed(1) + ',' + (H - padY) + ' L' + X(0).toFixed(1) + ',' + (H - padY) + ' Z';
    var grid = '';
    for (var g = lo; g <= hi; g += (span > 2500 ? 1000 : 500)) {
      grid += '<line x1="' + padX + '" x2="' + (W - padX) + '" y1="' + Y(g).toFixed(1) + '" y2="' + Y(g).toFixed(1) + '" stroke="var(--border)" stroke-width="1"/>' +
        '<text x="' + (padX - 6) + '" y="' + (Y(g) + 3).toFixed(1) + '" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9" fill="#6b7280">' + g + '</text>';
    }
    var maxI = els.indexOf(Math.max.apply(null, els));
    var markers = '<g><circle cx="' + X(maxI).toFixed(1) + '" cy="' + Y(els[maxI]).toFixed(1) + '" r="4" fill="var(--accent)"/>' +
      '<text x="' + X(maxI).toFixed(1) + '" y="' + (Y(els[maxI]) - 10).toFixed(1) + '" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--accent)">Highest · ' + els[maxI].toLocaleString() + ' m</text></g>';
    var passMarks = (passes || []).map(function (p) {
      var di = days.map(function (d) { return d.day; }).indexOf(p.day);
      if (di < 0) return '';
      return '<g><circle cx="' + X(di).toFixed(1) + '" cy="' + Y(days[di].endEle).toFixed(1) + '" r="3" fill="#fff"/><text x="' + X(di).toFixed(1) + '" y="' + (Y(days[di].endEle) + 16).toFixed(1) + '" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8" fill="#9ca3af">' + esc(p.name) + '</text></g>';
    }).join('');
    var acc = (t.acclimatization && t.acclimatization.days || []).map(function (dn) {
      var di = days.map(function (d) { return d.day; }).indexOf(dn);
      if (di < 0) return '';
      return '<line x1="' + X(di).toFixed(1) + '" x2="' + X(di).toFixed(1) + '" y1="' + padY + '" y2="' + (H - padY) + '" stroke="var(--accent)" stroke-dasharray="2 3" stroke-opacity="0.5"/>';
    }).join('');
    var xlabels = days.map(function (d, i) { return (i % Math.ceil(days.length / 8) === 0) ? '<text x="' + X(i).toFixed(1) + '" y="' + (H - padY + 16) + '" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9" fill="#6b7280">D' + d.day + '</text>' : ''; }).join('');
    return '<div class="border border-border bg-[#16181b] p-3 md:p-5"><div class="relative w-full overflow-x-auto"><svg viewBox="0 0 1000 300" class="w-full min-w-[560px]" xmlns="http://www.w3.org/2000/svg">' +
      grid + '<path d="' + area + '" fill="var(--accent)" fill-opacity="0.1"/><path d="' + line + '" fill="none" stroke="var(--accent)" stroke-width="2"/>' + acc + passMarks + markers + xlabels +
      '</svg></div><p class="lbl mt-3">Sleeping altitude by day. Dashed lines mark acclimatisation days.</p></div>';
  }

  /* =====================================================================
     EVENTS
     ===================================================================== */
  document.body.addEventListener('click', function (e) {
    var node = e.target.closest && e.target.closest('[data-map-pt]');
    if (node) { renderMapDetail(+node.getAttribute('data-map-pt')); return; }
    if (e.target.id === 'packing-reset') {
      try { localStorage.removeItem('vo_pack_' + t.slug); } catch (x) {}
      location.reload();
    }
  });

  document.body.addEventListener('change', function (e) {
    var cb = e.target;
    if (cb && cb.dataset && cb.dataset.check) {
      var key = cb.dataset.check, id = cb.dataset.id;
      var obj = {};
      try { obj = JSON.parse(localStorage.getItem(key) || '{}'); } catch (x) {}
      obj[id] = cb.checked;
      try { localStorage.setItem(key, JSON.stringify(obj)); } catch (x) {}
      var span = cb.parentElement.querySelector('span');
      if (span) span.classList.toggle('line-through', cb.checked), span.classList.toggle('text-muted-foreground', cb.checked);
    }
  });

  /* save + share */
  var saveBtn = document.getElementById('btn-save');
  function savedList() { try { return JSON.parse(localStorage.getItem('vo_saved_treks') || '[]'); } catch (e) { return []; } }
  function refreshSave() {
    var on = savedList().indexOf(t.slug) > -1;
    if (saveBtn) { saveBtn.innerHTML = '<i class="fa-' + (on ? 'solid' : 'regular') + ' fa-bookmark"></i><span>' + (on ? 'Saved' : 'Save') + '</span>'; saveBtn.classList.toggle('text-accent', on); saveBtn.classList.toggle('border-accent', on); }
  }
  if (saveBtn) saveBtn.addEventListener('click', function () {
    var l = savedList(), i = l.indexOf(t.slug);
    if (i > -1) l.splice(i, 1); else l.push(t.slug);
    try { localStorage.setItem('vo_saved_treks', JSON.stringify(l)); } catch (e) {}
    refreshSave();
  });
  refreshSave();
  var shareBtn = document.getElementById('btn-share');
  if (shareBtn) shareBtn.addEventListener('click', function () {
    var data = { title: t.name + ' — Himalayan Magic Adventure', text: t.summary || t.name, url: location.href };
    if (navigator.share) navigator.share(data).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(function () {
      shareBtn.innerHTML = '<i class="fa-solid fa-check"></i><span>Copied</span>';
      setTimeout(function () { shareBtn.innerHTML = '<i class="fa-solid fa-arrow-up-from-bracket"></i><span>Share</span>'; }, 1800);
    });
  });

  /* fade-up + subnav active + progress + mobile CTA */
  var io = new IntersectionObserver(function (ents) {
    ents.forEach(function (en) { if (en.isIntersecting) en.target.classList.add('in'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-up').forEach(function (el) { io.observe(el); });

  var secEls = navItems.map(function (n) { return document.getElementById(n[0]); }).filter(Boolean);
  var mcta = document.getElementById('mobile-cta');
  var mctaName = document.getElementById('mcta-name');
  if (mctaName) mctaName.textContent = t.name;
  function onScroll() {
    var st = window.scrollY, dh = document.documentElement.scrollHeight - window.innerHeight;
    var pb = document.getElementById('read-progress'); if (pb) pb.style.width = (dh > 0 ? (st / dh * 100) : 0) + '%';
    if (mcta) mcta.classList.toggle('translate-y-full', st < window.innerHeight * 0.8);
    var cur = null;
    secEls.forEach(function (s) { if (s.getBoundingClientRect().top < 120) cur = s.id; });
    document.querySelectorAll('.hme-nav-link').forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-nav') === cur); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* FAQ JSON-LD */
  if (has(t.faq)) {
    var ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: t.faq.slice(0, 20).map(function (f) { return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }; })
    });
    document.head.appendChild(ld);
  }
  /* Breadcrumb + TouristTrip JSON-LD */
  var trip = document.createElement('script');
  trip.type = 'application/ld+json';
  trip.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'TouristTrip',
    name: t.name, description: t.summary || '',
    touristType: 'Trekking',
    itinerary: (t.itinerary || []).map(function (d) { return { '@type': 'ListItem', position: d.day, name: d.title }; })
  });
  document.head.appendChild(trip);
})();
