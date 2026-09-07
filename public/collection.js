/* ============================================================================
   COLLECTION PAGE  —  /expeditions/<band>  (8000m · 7000m · 6000m · trekking)
   One data-driven template for every elevation band. Builds LIST from
   window.getPeaks({category}) merged with the rich per-peak record
   (window.MOUNTAINS for 8000 m, window.PEAKS_DATA for the rest), then renders
   the grid, map, compare tool and the editorial sections.
   ========================================================================== */
(function () {
  'use strict';

  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var M = window.MOUNTAINS || {};
  var PD = window.PEAKS_DATA || {};
  var D = window.EXPED_DEFAULTS || {};

  /* -------- which band? -------- */
  var seg = (location.pathname.replace(/\/+$/, '').split('/').pop() || '').toLowerCase();
  var CATS = window.PEAK_CATEGORIES || [];
  var CAT = null;
  CATS.forEach(function (c) { if (c.slug === seg) CAT = c; });
  if (!CAT) CAT = window.getCategory ? window.getCategory('8000') : { id: '8000', slug: '8000m', label: 'Eight-Thousanders', short: '8,000 m +', tag: '8000m+', blurb: '' };
  var BAND = CAT.id;
  var IS8000 = BAND === '8000';

  /* -------- build LIST: normalised peak + its rich record -------- */
  function richOf(slug) { return M[slug] || PD[slug] || null; }
  var LIST = (window.getPeaks ? window.getPeaks({ category: BAND }) : []).map(function (p) {
    var r = richOf(p.slug) || {};
    return Object.assign({}, r, {
      slug: p.slug, name: p.name, aka: p.aka || r.aka || '',
      elevationM: p.elevation != null ? p.elevation : r.elevationM,
      elevationLabel: p.elevationDisplay || r.elevationLabel || (p.elevation ? p.elevation.toLocaleString() + ' m' : ''),
      elevationFt: (typeof r.elevationFt === 'number') ? r.elevationFt : (p.elevationFt || (p.elevation ? Math.round(p.elevation / 0.3048) : null)),
      countryLabel: p.countryLabel || r.countryLabel || '',
      countries: (p.countries && p.countries.length ? p.countries : r.countries) || [],
      range: p.range || r.range || '',
      region: p.region || r.region || '',
      rank: r.rank || null,
      href: p.href || ('/expeditions/peaks/' + p.slug),
      heroImage: r.heroImage || null,
      tagline: r.tagline || p.shortDescription || r.summary || '',
      coordinates: r.coordinates || p.coordinates || null,
      season: r.season || null,
      difficulty: (r.difficulty && typeof r.difficulty === 'object') ? r.difficulty : null,
      firstAscent: (r.firstAscent && typeof r.firstAscent === 'object') ? r.firstAscent : null,
      normalRoute: r.normalRoute || null,
      camps: r.camps || null,
      baseCampM: r.baseCampM || null,
      typicalDurationDays: r.typicalDurationDays || null,
      relatedTreks: r.relatedTreks || [],
      permit: r.permit || null,
      peakType: p.peakType || r.peakType || 'Expedition Peak',
      peakGrade: p.peakGrade || r.peakGrade || null,
      difficultyDetail: p.difficultyDetail || r.difficultyDetail || ''
    });
  }).map(function (m) {
    m.inNepal = (m.countries || []).indexOf('Nepal') > -1;
    var rg = (m.range || '') + ' ' + (m.region || '');
    m.rangeKey = /karakoram/i.test(rg) ? 'Karakoram' : (/pamir/i.test(rg) ? 'Pamir' : (/zanskar|ladakh|garhwal|kumaon|indian/i.test(rg) ? 'Indian Himalaya' : 'Himalaya'));
    m.seasonPrimary = (m.season && m.season.primary) || '';
    return m;
  });
  // default order: world rank for 8000, elevation-desc otherwise
  LIST.sort(function (a, b) {
    if (IS8000 && a.rank && b.rank) return a.rank - b.rank;
    return (b.elevationM || 0) - (a.elevationM || 0);
  });
  LIST.forEach(function (m, i) { m.ord = i + 1; });
  var N = LIST.length;
  var BY = {}; LIST.forEach(function (m) { BY[m.slug] = m; });

  /* badge shown top-left on a tile: world rank for 8000, elevation order otherwise */
  function badge(m) { return IS8000 && m.rank ? '#' + m.rank : m.ord + '/' + N; }
  function rankMeta(m) { return IS8000 && m.rank ? '#' + m.rank + ' · ' + m.elevationLabel : m.elevationLabel; }

  /* -------- page-level SEO / hero copy -------- */
  (function () {
    document.title = CAT.label + ' — ' + N + ' peaks | Himalayan Magic Adventure';
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', CAT.blurb || (N + ' expedition peaks in the ' + CAT.short + ' band.'));
    var cn = document.getElementById('canonical-link') || document.querySelector('link[rel="canonical"]');
    if (cn) cn.setAttribute('href', 'https://himalayanmagic.com/expeditions/' + CAT.slug);
    var set = function (id, v) { var e = document.getElementById(id); if (e != null && v != null) e.textContent = v; };
    var ranges = {}; LIST.forEach(function (m) { if (m.rangeKey) ranges[m.rangeKey] = 1; });
    var rangeStr = Object.keys(ranges).join(' + ') || 'Himalaya';
    var countries = {}; LIST.forEach(function (m) { (m.countries || []).forEach(function (c) { countries[c] = 1; }); });
    set('col-kicker', CAT.label + ' · ' + rangeStr);
    set('col-crumb', CAT.short);
    set('col-count', String(N));
    set('col-threshold', CAT.short);
    set('col-ranges', Object.keys(ranges).join(' · ') || '—');
    set('col-nepal-count', LIST.filter(function (m) { return m.inNepal; }).length + ' / ' + N);
    set('col-intro-n', String(N));
    set('col-intro-kicker', 'What is in this collection');
    if (CAT.blurb) set('col-intro-copy', CAT.blurb);
    set('col-atlas-h', CAT.label);
    set('col-sky-h', IS8000 ? 'The skyline of the 8,000ers' : 'The elevation skyline');
    set('col-hist-h', 'The first ascents');
    var neN = LIST.filter(function (m) { return m.inNepal; }).length;
    set('col-country-h', IS8000 ? "Nepal's eight-thousanders" : 'Countries + ranges');
    set('col-country-h2', IS8000 ? 'Eight of the fourteen rise in Nepal' : 'Where these ' + N + ' peaks rise');
    set('col-country-intro', IS8000
      ? 'Three lie wholly within Nepal — Dhaulagiri, Manaslu and Annapurna. The rest share a border with China or India. Each has a trekking route on its flanks: a way to stand beneath it without climbing it.'
      : 'These peaks span ' + Object.keys(countries).join(', ') + '. Several have a trekking route on their flanks — a way to stand beneath them without climbing.');
    set('col-plan-h', IS8000 ? 'What an 8,000 m expedition involves' : 'What the expedition involves');
    var h1 = document.getElementById('col-h1');
    if (h1) h1.innerHTML = IS8000
      ? 'The World<br>Above <span class="text-accent">8,000 m</span>'
      : (BAND === 'trekking'
        ? 'Trekking<br><span class="text-accent">Peaks</span>'
        : 'Above<br><span class="text-accent">' + esc(CAT.short.replace(/\s*\+\s*$/, '').trim()) + '</span>');
    var lead = document.getElementById('col-lead');
    if (lead && CAT.blurb) lead.textContent = CAT.blurb;
    var hImg = document.getElementById('col-hero-img');
    if (hImg && !IS8000) hImg.src = BAND === '7000' ? '/images/annapurna_real.jpg' : '/images/langtang_real.jpg';
  })();

  /* ---------------- shared ---------------- */
  var ARROW = '<svg class="mt-arrow" width="16" height="8" viewBox="0 0 16 8" fill="none" aria-hidden="true"><path d="M0 4h14M11 1l3 3-3 3" stroke="currentColor" stroke-width="1.4"/></svg>';
  function fmtFt(n) { return n ? n.toLocaleString() + ' ft' : ''; }
  // The shared EXPED_DEFAULTS copy is written for the eight-thousanders; soften the
  // band-specific phrasing when this page is a different collection.
  function deband(s) {
    if (IS8000 || !s) return s || '';
    return String(s)
      .replace(/eight[- ]thousander(s)?/gi, CAT.short.replace(/\s*\+\s*$/, '') + ' peak$1')
      .replace(/8,?000\s*m(etre|eter)?s?/gi, CAT.short.replace(/\s*\+\s*$/, ''))
      .replace(/\bthe (?:14|fourteen)\b/gi, 'these ' + N)
      .replace(/\bAn (\d)/g, 'A $1').replace(/\ban (\d)/g, 'a $1');
  }
  function tilePattern() {
    return '<div class="absolute inset-0" style="background:' +
      'radial-gradient(circle at 28% 18%,rgba(240,98,37,0.16),transparent 55%),' +
      'repeating-linear-gradient(118deg,rgba(255,255,255,0.05) 0 1px,transparent 1px 20px),' +
      '#1b1e22"></div>' +
      '<div class="absolute inset-0" style="background:repeating-linear-gradient(198deg,rgba(255,255,255,0.035) 0 1px,transparent 1px 26px)"></div>';
  }

  /* ============================================================
     ATLAS GRID
     ============================================================ */
  var st = { q: '', country: '', range: '', season: '', type: '', grade: '', sort: IS8000 ? 'rank' : 'elev-desc' };
  var GRADE_ORDER = ['Beginner', 'Moderate', 'Advanced', 'Expert'];

  var SM = ['col-span-2 row-span-3', 'col-span-2 row-span-3', 'col-span-1 row-span-2', 'col-span-1 row-span-2', 'col-span-2 row-span-3', 'col-span-1 row-span-2', 'col-span-1 row-span-2', 'col-span-2 row-span-3'];
  var MD = ['md:col-span-4 md:row-span-2', 'md:col-span-2 md:row-span-3', 'md:col-span-2 md:row-span-2', 'md:col-span-2 md:row-span-2', 'md:col-span-2 md:row-span-3', 'md:col-span-4 md:row-span-2', 'md:col-span-2 md:row-span-2', 'md:col-span-2 md:row-span-2'];
  var LG = ['lg:col-span-4 lg:row-span-3', 'lg:col-span-2 lg:row-span-3', 'lg:col-span-3 lg:row-span-2', 'lg:col-span-3 lg:row-span-2', 'lg:col-span-2 lg:row-span-2', 'lg:col-span-2 lg:row-span-2', 'lg:col-span-4 lg:row-span-2', 'lg:col-span-2 lg:row-span-3', 'lg:col-span-3 lg:row-span-2', 'lg:col-span-3 lg:row-span-2', 'lg:col-span-2 lg:row-span-2', 'lg:col-span-2 lg:row-span-2'];
  function spanFor(i, big) {
    if (big) return SM[0] + ' ' + MD[0] + ' lg:col-span-4 lg:row-span-3';
    return SM[i % SM.length] + ' ' + MD[i % MD.length] + ' ' + LG[i % LG.length];
  }

  function mtCard(m, cls, big) {
    var img = m.heroImage
      ? '<img class="mt-img absolute inset-0 h-full w-full object-cover opacity-0" loading="lazy" decoding="async" src="' + esc(m.heroImage) + '" alt="' + esc(m.name + ', ' + m.range) + '">'
      : tilePattern();
    return '<a href="' + esc(m.href) + '" class="mt group relative block overflow-hidden border border-border bg-card ' + cls + '" ' +
      'aria-label="' + esc(m.name + ', ' + m.elevationLabel + ', ' + m.countryLabel + ', ' + m.range) + '">' +
      '<div class="mt-shimmer absolute inset-0"></div>' + img +
      '<div class="mt-scrim absolute inset-0"></div>' +
      '<span class="absolute top-3 left-3 z-10 bg-black/40 border border-white/15 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white">' + esc(badge(m)) + '</span>' +
      '<div class="relative z-10 flex h-full flex-col justify-end p-4 md:p-5">' +
        '<span class="lbl text-white/70">' + esc(m.range || m.rangeKey) + '</span>' +
        '<h3 class="font-heading font-light uppercase tracking-tight text-white leading-[0.95] mt-1 ' + (big ? 'text-3xl md:text-[2.7rem]' : 'text-lg md:text-2xl') + '">' + esc(m.name) + '</h3>' +
        '<div class="mt-1.5 flex flex-wrap items-center gap-x-2.5 font-mono text-[11px] text-white/85"><span class="text-accent">' + esc(m.elevationLabel) + '</span><span class="text-white/30">/</span><span>' + esc(m.countryLabel) + '</span></div>' +
        ((m.peakType || m.peakGrade) ? '<div class="mt-1 flex flex-wrap items-center gap-x-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/55">' +
          (m.peakType ? '<span>' + esc(m.peakType) + '</span>' : '') +
          (m.peakType && m.peakGrade ? '<span class="text-white/25">·</span>' : '') +
          (m.peakGrade ? '<span>' + esc(m.peakGrade) + '</span>' : '') +
        '</div>' : '') +
        '<div class="mt-more ' + (big ? '' : 'reveal ') + '">' +
          '<p class="font-sans text-[12.5px] leading-snug text-white/80">' + esc(m.tagline) + '</p>' +
          (m.normalRoute || m.firstAscent ? '<div class="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-white/70">' +
            (m.normalRoute ? '<span>' + esc((m.normalRoute.name || '').split(',')[0]) + '</span>' : '') +
            (m.normalRoute && m.firstAscent ? '<span class="text-white/25">/</span>' : '') +
            (m.firstAscent ? '<span>First climbed ' + esc(m.firstAscent.year || '') + '</span>' : '') +
          '</div>' : '') +
        '</div>' +
        '<div class="mt-3 flex items-center justify-between gap-3">' +
          '<span class="font-mono text-[10px] uppercase tracking-widest text-white/80">' + esc(m.seasonPrimary ? m.seasonPrimary + ' window' : m.rangeKey) + '</span>' +
          '<span class="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white shrink-0">Explore ' + ARROW + '</span>' +
        '</div>' +
      '</div></a>';
  }

  function applyAtlas() {
    var q = st.q.trim().toLowerCase();
    var out = LIST.filter(function (m) {
      if (st.country && (m.countries || []).indexOf(st.country) < 0) return false;
      if (st.range && m.rangeKey !== st.range) return false;
      if (st.season && m.seasonPrimary !== st.season) return false;
      if (st.type && m.peakType !== st.type) return false;
      if (st.grade && m.peakGrade !== st.grade) return false;
      if (q) {
        var hay = (m.name + ' ' + m.aka + ' ' + m.range + ' ' + m.countryLabel + ' ' + m.region + ' ' + (m.peakType || '') + ' ' + m.tagline).toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });
    out.sort(function (a, b) {
      if (st.sort === 'rank') return (a.rank || a.ord) - (b.rank || b.ord);
      if (st.sort === 'elev-desc') return b.elevationM - a.elevationM;
      if (st.sort === 'elev-asc') return a.elevationM - b.elevationM;
      if (st.sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    var grid = document.getElementById('ex-grid');
    var empty = document.getElementById('ex-empty');
    document.getElementById('ex-count').textContent = out.length + (out.length === 1 ? ' peak' : ' peaks');
    if (!out.length) { grid.innerHTML = ''; grid.classList.add('hidden'); empty.classList.remove('hidden'); renderChips(); return; }
    grid.classList.remove('hidden'); empty.classList.add('hidden');

    var bigDone = false;
    grid.innerHTML = out.map(function (m, i) {
      var big = false;
      if (!bigDone && (st.sort === 'rank' || st.sort === 'elev-desc') && i === 0) { big = true; bigDone = true; }
      var cls = spanFor(i, big);
      var isBig = big || /row-span-3/.test(cls) || /col-span-4/.test(cls);
      return mtCard(m, cls, isBig);
    }).join('');
    bindImgs('#ex-grid');
    renderChips();
  }

  function renderChips() {
    var box = document.getElementById('ex-chips');
    var chips = [];
    if (st.country) chips.push(['country', st.country]);
    if (st.range) chips.push(['range', st.range]);
    if (st.season) chips.push(['season', st.season + ' window']);
    if (st.type) chips.push(['type', st.type]);
    if (st.grade) chips.push(['grade', st.grade]);
    if (st.q.trim()) chips.push(['q', '“' + st.q.trim() + '”']);
    if (!chips.length) { box.classList.add('hidden'); box.innerHTML = ''; return; }
    box.classList.remove('hidden'); box.classList.add('flex');
    box.innerHTML = chips.map(function (c) {
      return '<button type="button" class="inline-flex items-center gap-1.5 border border-accent/40 bg-accent/8 text-foreground font-mono text-[10px] uppercase tracking-wider px-2.5 py-1" data-xclear="' + c[0] + '"><span aria-hidden="true">×</span> ' + esc(c[1]) + '</button>';
    }).join('') + '<button type="button" class="ml-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground underline underline-offset-2 hover:text-accent" data-xclear="all">Clear all</button>';
  }

  function bindImgs(sel) {
    document.querySelectorAll((sel || '') + ' .mt-img').forEach(function (img) {
      if (img.complete && img.naturalWidth) { img.classList.add('loaded'); return; }
      img.addEventListener('load', function () { img.classList.add('loaded'); }, { once: true });
      img.addEventListener('error', function () { img.classList.add('loaded'); img.style.opacity = 1; }, { once: true });
    });
  }

  /* populate the filter selects from the data — hide any with fewer than two options */
  (function () {
    function fill(id, values, label, order) {
      var sel = document.getElementById(id);
      if (!sel) return;
      var vals = Object.keys(values);
      vals.sort(order || function (a, b) { return a.localeCompare(b); });
      if (vals.length < 2) { sel.style.display = 'none'; return; }
      sel.style.display = '';
      sel.innerHTML = '<option value="">' + label + '</option>' +
        vals.map(function (v) { return '<option value="' + esc(v) + '">' + esc(v) + '</option>'; }).join('');
    }
    var cs = {}, rs = {}, ss = {}, ty = {}, gr = {};
    LIST.forEach(function (m) {
      (m.countries || []).forEach(function (c) { cs[c] = 1; });
      if (m.rangeKey) rs[m.rangeKey] = 1;
      if (m.seasonPrimary) ss[m.seasonPrimary] = 1;
      if (m.peakType) ty[m.peakType] = 1;
      if (m.peakGrade) gr[m.peakGrade] = 1;
    });
    fill('ex-country', cs, 'Any country');
    fill('ex-range', rs, 'Any range');
    fill('ex-season', ss, 'Any season');
    fill('ex-type', ty, 'Any type');
    fill('ex-grade', gr, 'Any difficulty', function (a, b) { return GRADE_ORDER.indexOf(a) - GRADE_ORDER.indexOf(b); });
  })();

  /* ============================================================
     MAP  — bounds computed from the collection
     ============================================================ */
  var pts = LIST.filter(function (m) { return m.coordinates && m.coordinates.lat != null; });
  var lons = pts.map(function (m) { return m.coordinates.lon; });
  var lats = pts.map(function (m) { return m.coordinates.lat; });
  var LON0 = Math.min.apply(null, lons.concat(73.5)) - 0.8;
  var LON1 = Math.max.apply(null, lons.concat(89)) + 0.8;
  var LAT0 = Math.min.apply(null, lats.concat(27)) - 0.6;
  var LAT1 = Math.max.apply(null, lats.concat(30)) + 0.6;
  if (!pts.length) { LON0 = 73.5; LON1 = 89; LAT0 = 27; LAT1 = 36.6; }
  var MW = 1000, MH = 540;
  function mx(lon) { return (lon - LON0) / (LON1 - LON0) * MW; }
  function my(lat) { return (LAT1 - lat) / (LAT1 - LAT0) * MH; }
  function projPts(ring) { return ring.map(function (p) { return mx(p[0]).toFixed(1) + ',' + my(p[1]).toFixed(1); }).join(' '); }

  // Simplified country outlines in lon/lat — decorative context, drawn through the
  // same projection as the pins so they line up with the real coordinates.
  var COUNTRY_SHAPES = {
    Nepal: { label: 'Nepal', at: [83.9, 28.3], ring: [[80.05, 30.4], [81.0, 30.35], [82.1, 30.4], [83.0, 29.6], [83.9, 29.3], [84.7, 28.9], [85.5, 28.5], [86.2, 28.1], [87.1, 27.95], [88.15, 27.9], [88.2, 27.35], [87.4, 26.6], [86.3, 26.4], [85.2, 26.6], [84.3, 27.3], [83.5, 27.5], [82.5, 28.0], [81.4, 28.4], [80.4, 28.8], [80.0, 29.6]] },
    China: { label: 'Tibet · China', at: [82.5, 33.4], ring: [[70.5, 38.5], [89.5, 38.5], [89.5, 28.1], [88.15, 27.9], [87.1, 27.95], [86.2, 28.1], [85.5, 28.5], [84.7, 28.9], [83.9, 29.3], [83.0, 29.6], [82.1, 30.4], [81.0, 30.35], [80.05, 30.4], [79.0, 31.4], [77.5, 33.6], [75.5, 35.6], [73.6, 36.9], [70.5, 37.4]] },
    India: { label: 'India', at: [81.0, 26.6], ring: [[76.5, 25.2], [89.5, 25.2], [89.5, 28.1], [88.2, 27.35], [87.4, 26.6], [86.3, 26.4], [85.2, 26.6], [84.3, 27.3], [83.5, 27.5], [82.5, 28.0], [81.4, 28.4], [80.4, 28.8], [80.0, 29.6], [79.2, 30.6], [77.8, 32.3], [76.0, 33.6], [74.4, 32.4], [74.0, 29.5], [75.2, 27.0]] },
    Pakistan: { label: 'Pakistan', at: [73.0, 35.4], ring: [[70.5, 37.4], [73.6, 36.9], [75.5, 35.6], [77.5, 33.6], [76.0, 33.6], [74.4, 32.4], [74.0, 29.5], [72.4, 29.2], [70.8, 31.0], [70.3, 34.0]] }
  };
  // the main Himalaya–Karakoram crest, west → east
  var CREST = [[74.5, 35.9], [76.6, 35.4], [78.8, 34.0], [81.0, 30.5], [82.6, 29.9], [84.0, 28.7], [85.8, 28.2], [87.0, 27.95], [88.2, 27.75]];

  function buildMap() {
    var stage = document.getElementById('ex-map-stage');
    if (!pts.length) { stage.innerHTML = '<p class="font-mono text-xs text-muted-foreground p-8 text-center">Coordinates for this collection are being confirmed.</p>'; return; }

    var inColl = {};
    LIST.forEach(function (m) { (m.countries || []).forEach(function (c) { inColl[c] = 1; }); });

    var polys = Object.keys(COUNTRY_SHAPES).map(function (k) {
      var c = COUNTRY_SHAPES[k], on = !!inColl[k];
      return '<polygon class="hma-country" data-country="' + esc(k) + '"' + (on ? ' data-active="1" tabindex="0" role="button" aria-label="' + esc('Highlight ' + k) + '"' : ' style="pointer-events:none"') +
        ' points="' + projPts(c.ring) + '"' +
        ' fill="' + (on ? 'rgba(240,98,37,0.09)' : 'rgba(255,255,255,0.028)') + '"' +
        ' stroke="' + (on ? 'rgba(240,98,37,0.34)' : 'var(--border)') + '" stroke-width="1.4" vector-effect="non-scaling-stroke"/>';
    }).join('');

    var labels = Object.keys(COUNTRY_SHAPES).map(function (k) {
      var c = COUNTRY_SHAPES[k], x = mx(c.at[0]), y = my(c.at[1]);
      if (x < -60 || x > MW + 60 || y < -20 || y > MH + 20) return '';   // wholly off-frame
      x = Math.max(64, Math.min(MW - 64, x));
      y = Math.max(30, Math.min(MH - 20, y));
      return '<text class="hma-clabel" x="' + x.toFixed(0) + '" y="' + y.toFixed(0) + '">' + esc(c.label) + '</text>';
    }).join('');

    var grat = '<g stroke="var(--border)" stroke-width="1" opacity="0.26">' +
      [Math.ceil(LON0), Math.round((LON0 + LON1) / 2), Math.floor(LON1)].map(function (l) { return '<line x1="' + mx(l).toFixed(0) + '" y1="0" x2="' + mx(l).toFixed(0) + '" y2="' + MH + '"/>'; }).join('') +
      [Math.ceil(LAT0), Math.round((LAT0 + LAT1) / 2), Math.floor(LAT1)].map(function (l) { return '<line x1="0" y1="' + my(l).toFixed(0) + '" x2="' + MW + '" y2="' + my(l).toFixed(0) + '"/>'; }).join('') +
      '</g>';

    var crest = '<polyline class="hma-crest" points="' + projPts(CREST) + '"/>';

    var pins = pts.map(function (m) {
      var x = mx(m.coordinates.lon), y = my(m.coordinates.lat);
      var s = m.ord <= 3 ? 13 : (m.ord <= 8 ? 10 : 8);
      return '<g class="peak-hit" data-mtn="' + esc(m.slug) + '" tabindex="0" role="button" aria-label="' + esc(m.name + ', ' + m.elevationLabel) + '">' +
        '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="16" fill="transparent"/>' +
        '<path class="peak-pin" data-mtn="' + esc(m.slug) + '" d="M' + x.toFixed(1) + ',' + (y - s).toFixed(1) + ' L' + (x - s * 0.8).toFixed(1) + ',' + (y + s * 0.5).toFixed(1) + ' L' + (x + s * 0.8).toFixed(1) + ',' + (y + s * 0.5).toFixed(1) + ' Z" fill="#0f1113" stroke="var(--accent)" stroke-width="1.6"/>' +
        '<text x="' + x.toFixed(1) + '" y="' + (y + s * 0.5 + 12).toFixed(1) + '" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="#c9cfd7">' + m.ord + '</text>' +
        '</g>';
    }).join('');

    var compass = '<g transform="translate(' + (MW - 60) + ',' + (MH - 66) + ')">' +
      '<path d="M14 0 L22 30 L14 24 L6 30 Z" fill="var(--accent)"/>' +
      '<text x="9" y="46" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="600" fill="var(--muted-foreground)">N</text></g>';

    stage.innerHTML = '<svg viewBox="0 0 ' + MW + ' ' + MH + '" class="block w-full" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Regional map of this collection’s peaks">' +
      grat + polys + crest + labels + pins + compass +
      '<text x="20" y="26" font-family="IBM Plex Mono, monospace" font-size="10" letter-spacing="2" fill="var(--muted-foreground)">' + esc(LAT1.toFixed(1)) + '°N</text>' +
      '<text x="20" y="' + (MH - 14) + '" font-family="IBM Plex Mono, monospace" font-size="10" letter-spacing="2" fill="var(--muted-foreground)">' + esc(LAT0.toFixed(1)) + '°N</text>' +
      '</svg>';
    mapPanelDefault();
  }

  function mapResetHighlight() {
    document.querySelectorAll('.hma-country').forEach(function (p) { p.classList.remove('on', 'dim'); });
    document.querySelectorAll('.peak-pin').forEach(function (p) { p.style.opacity = ''; p.classList.remove('on'); });
  }

  function mapCountry(country) {
    var peaksIn = LIST.filter(function (m) { return (m.countries || []).indexOf(country) > -1; });
    if (!peaksIn.length) return;
    document.querySelectorAll('.hma-country').forEach(function (p) {
      p.classList.toggle('on', p.dataset.country === country);
      p.classList.toggle('dim', p.dataset.country !== country);
    });
    var keep = {}; peaksIn.forEach(function (m) { keep[m.slug] = 1; });
    document.querySelectorAll('.peak-pin').forEach(function (p) { p.style.opacity = keep[p.dataset.mtn] ? '1' : '0.25'; });
    document.getElementById('ex-map-panel').innerHTML =
      '<span class="lbl block">' + esc(country) + ' · ' + peaksIn.length + (peaksIn.length === 1 ? ' peak' : ' peaks') + ' here</span>' +
      '<ol class="mt-3 space-y-1.5">' + peaksIn.map(function (m) {
        return '<li><button data-mtn="' + esc(m.slug) + '" class="ex-key w-full flex items-baseline justify-between gap-3 text-left hover:text-accent transition-colors">' +
          '<span class="font-mono text-[11px] text-foreground">' + esc(m.name) + '</span>' +
          '<span class="font-mono text-[10px] text-accent shrink-0">' + esc(m.elevationLabel) + '</span></button></li>';
      }).join('') + '</ol>' +
      '<button type="button" data-mapreset class="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground underline underline-offset-2 hover:text-accent">Show the whole arc</button>';
  }

  function mapPanelDefault() {
    mapResetHighlight();
    document.getElementById('ex-map-panel').innerHTML =
      '<span class="lbl block mb-3">Select a peak</span>' +
      '<ol class="space-y-1.5">' + LIST.map(function (m) {
        return '<li><button data-mtn="' + esc(m.slug) + '" class="ex-key w-full flex items-baseline justify-between gap-3 text-left hover:text-accent transition-colors">' +
          '<span class="font-mono text-[11px] text-foreground"><span class="text-muted-foreground mr-2">' + m.ord + '</span>' + esc(m.name) + '</span>' +
          '<span class="font-mono text-[10px] text-accent shrink-0">' + esc(m.elevationLabel) + '</span></button></li>';
      }).join('') + '</ol>';
  }

  function mapSelect(slug) {
    var m = BY[slug]; if (!m) return;
    mapResetHighlight();
    document.querySelectorAll('.peak-pin').forEach(function (p) { p.classList.toggle('on', p.dataset.mtn === slug); });
    document.getElementById('ex-map-panel').innerHTML =
      '<span class="lbl block">' + esc(IS8000 && m.rank ? 'Rank ' + m.rank + ' / ' + N : m.ord + ' of ' + N + ' by elevation') + '</span>' +
      '<h3 class="font-heading text-2xl uppercase text-white mt-1 mb-1 leading-tight">' + esc(m.name) + '</h3>' +
      (m.aka ? '<span class="font-mono text-[10px] text-muted-foreground">' + esc(m.aka) + '</span>' : '') +
      '<div class="mt-4 grid grid-cols-2 gap-3">' +
        kv('Elevation', m.elevationLabel) + kv('Country', m.countryLabel) +
        kv('Range', m.range || m.rangeKey) + kv('Coordinates', (m.coordinates.approx ? '≈ ' : '') + m.coordinates.lat.toFixed(3) + '°N, ' + m.coordinates.lon.toFixed(3) + '°E') +
        (m.season ? kv('Season', (m.season.primary || '') + (m.season.window ? ' · ' + m.season.window : '')) : '') +
        (m.normalRoute ? kv('Normal route', m.normalRoute.name || '—') : '') +
      '</div>' +
      '<p class="mt-4 font-sans text-[12.5px] text-muted-foreground leading-relaxed">' + esc(m.tagline) + '</p>' +
      '<a href="' + esc(m.href) + '" class="mt-5 inline-flex items-center gap-2 border border-accent px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-accent hover:bg-accent hover:text-background transition-all">Explore expedition →</a>';
  }
  function kv(l, v) { return '<div class="border border-border p-2"><span class="lbl block">' + esc(l) + '</span><span class="font-mono text-[11px] text-white leading-snug">' + esc(v) + '</span></div>'; }

  /* ============================================================
     COMPARE
     ============================================================ */
  var cmp = [];
  function buildComparePick() {
    document.getElementById('ex-cmp-pick').innerHTML = LIST.map(function (m) {
      var on = cmp.indexOf(m.slug) > -1;
      return '<button type="button" data-cmp="' + esc(m.slug) + '" class="ex-mode ' + (on ? 'on' : '') + '">' + esc(m.name) + '</button>';
    }).join('');
    renderCompare();
  }
  function renderCompare() {
    var box = document.getElementById('ex-cmp-table');
    if (!cmp.length) { box.innerHTML = '<p class="font-mono text-xs text-muted-foreground">No peaks selected.</p>'; return; }
    var sel = cmp.map(function (s) { return BY[s]; }).filter(Boolean);
    var rows = [
      ['Elevation', function (m) { return m.elevationLabel + (m.elevationFt ? ' · ' + fmtFt(m.elevationFt) : ''); }]
    ];
    if (IS8000) rows.push(['World rank', function (m) { return m.rank ? '#' + m.rank + ' of 14' : '—'; }]);
    rows.push(
      ['Country', function (m) { return m.countryLabel; }],
      ['Mountain range', function (m) { return m.range || m.rangeKey; }],
      ['Normal route', function (m) { return (m.normalRoute && m.normalRoute.name) || '—'; }],
      ['Expedition season', function (m) { return (m.season && (m.season.primary + (m.season.window ? ' · ' + m.season.window : ''))) || '—'; }],
      ['Base camp', function (m) { return (m.baseCampM ? m.baseCampM.toLocaleString() + ' m' : '—'); }],
      ['Highest camp', function (m) { var c = (m.camps || []).filter(function (x) { return (x.name || '').toLowerCase().indexOf('summit') < 0; }); return c.length ? c[c.length - 1].altM.toLocaleString() + ' m' : '—'; }],
      ['Typical duration', function (m) { return m.typicalDurationDays ? m.typicalDurationDays + ' days' : '—'; }],
      ['Objective hazard', function (m) { return (m.difficulty && m.difficulty.objectiveHazard != null) ? m.difficulty.objectiveHazard + ' / 5' : '—'; }],
      ['Technical difficulty', function (m) { return (m.difficulty && m.difficulty.technical != null) ? m.difficulty.technical + ' / 5' : '—'; }],
      ['Permit authority', function (m) { return (m.permit && m.permit.authority) || '—'; }]
    );
    box.innerHTML = '<table class="w-full text-left font-mono text-[12px] border border-border">' +
      '<thead class="bg-[var(--card)] text-[10px] uppercase tracking-widest text-accent border-b border-border"><tr><th class="p-3">Field</th>' +
      sel.map(function (m) { return '<th class="p-3 text-white">' + esc(m.name) + '</th>'; }).join('') + '</tr></thead><tbody class="divide-y divide-border text-muted-foreground">' +
      rows.map(function (r) {
        return '<tr><td class="p-3 text-white/80 whitespace-nowrap">' + esc(r[0]) + '</td>' + sel.map(function (m) { return '<td class="p-3 align-top">' + esc(r[1](m)) + '</td>'; }).join('') + '</tr>';
      }).join('') +
      '</tbody></table>' +
      '<p class="lbl mt-3">Route, camp and permit detail is indicative and route-dependent. Confirm current figures on each mountain page and with your operator.</p>';
  }

  /* ============================================================
     ELEVATION SKYLINE — base/top computed from the collection
     ============================================================ */
  var unit = 'm';
  var elevs = LIST.map(function (m) { return m.elevationM || 0; }).filter(Boolean);
  var SKY_TOP = Math.max.apply(null, elevs);
  var SKY_BASE = Math.min.apply(null, elevs) - 120;
  function buildSkyline() {
    var maxH = 300, span = Math.max(SKY_TOP - SKY_BASE, 1);
    var cols = LIST.map(function (m) {
      var h = Math.round((m.elevationM - SKY_BASE) / span * maxH) + 12;
      return '<button type="button" data-mtn="' + esc(m.slug) + '" class="sky-col group relative flex-1 min-w-[54px] flex flex-col items-center justify-end" style="opacity:.82" aria-label="' + esc(m.name + ' ' + m.elevationLabel) + '">' +
        '<span class="ex-elev font-mono text-[10px] md:text-[11px] text-accent mb-1 whitespace-nowrap">' + (unit === 'm' ? esc(m.elevationLabel) : fmtFt(m.elevationFt)) + '</span>' +
        '<span class="w-full border-t border-x border-accent/50 group-hover:bg-accent/15 transition-colors" style="height:' + h + 'px;background:linear-gradient(to top,rgba(240,98,37,.22),rgba(240,98,37,.02))"></span>' +
        '<span class="mt-2 font-mono text-[9px] uppercase tracking-wide text-muted-foreground text-center leading-tight w-full">' + esc(m.name.replace('Mount ', '')) + '</span>' +
        '<span class="font-mono text-[8px] text-white/30">' + esc(badge(m)) + '</span>' +
        '</button>';
    }).join('');
    document.getElementById('ex-skyline').innerHTML =
      '<div class="overflow-x-auto pb-2"><div class="flex items-end gap-1.5 md:gap-2 border-b border-border pb-0 min-w-[820px]" style="min-height:360px">' + cols + '</div></div>';
  }

  /* ============================================================
     DIFFICULTY
     ============================================================ */
  function bars(v) {
    var o = '';
    for (var i = 0; i < 5; i++) o += '<span class="h-2.5 flex-1 ' + (i < v ? 'bg-accent' : 'bg-border') + '"></span>';
    return '<div class="flex gap-0.5 flex-1 max-w-[130px]">' + o + '</div>';
  }
  function buildDifficulty() {
    var note = document.getElementById('ex-diff-note'); if (note) note.textContent = deband(D.difficultyNote || '');
    var dims = [['Technical', 'technical'], ['Altitude', 'altitude'], ['Exposure', 'exposure'], ['Weather', 'weather'], ['Remoteness', 'remoteness'], ['Objective hazard', 'objectiveHazard']];
    var withD = LIST.filter(function (m) { return m.difficulty; });
    document.getElementById('ex-difficulty').innerHTML = withD.map(function (m) {
      var d = m.difficulty || {};
      return '<div class="border border-border bg-card p-5">' +
        '<div class="flex items-baseline justify-between mb-3"><a href="' + esc(m.href) + '" class="font-heading text-xl uppercase text-white hover:text-accent transition-colors leading-tight">' + esc(m.name) + '</a><span class="lbl">' + esc(rankMeta(m)) + '</span></div>' +
        '<div class="space-y-1.5">' + dims.map(function (dm) {
          return '<div class="flex items-center gap-3"><span class="lbl w-28 shrink-0">' + dm[0] + '</span>' + bars(d[dm[1]] || 0) + '</div>';
        }).join('') + '</div>' +
        (d.summary ? '<p class="font-sans text-[12px] text-muted-foreground leading-relaxed mt-3">' + esc(d.summary) + '</p>' : '') +
        '</div>';
    }).join('');
  }

  /* ============================================================
     SEASONS
     ============================================================ */
  var MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  var MKEYS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var CELLCLR = { prime: 'var(--accent)', shoulder: 'rgba(240,98,37,0.4)', rare: 'rgba(147,153,162,0.35)', winter: 'var(--ice)', closed: 'transparent' };
  function buildSeasons() {
    var intro = document.getElementById('ex-seasons-intro'); if (intro) intro.textContent = deband(D.seasonsIntro || '');
    var withS = LIST.filter(function (m) { return m.season && m.season.months; });
    var head = '<div class="grid grid-cols-[130px_repeat(12,1fr)] gap-1 mb-1 min-w-[560px]"><span></span>' + MONTHS.map(function (mo) { return '<span class="lbl text-center" style="font-size:9px">' + mo + '</span>'; }).join('') + '</div>';
    var rows = withS.map(function (m) {
      var mm = (m.season && m.season.months) || {};
      return '<div class="grid grid-cols-[130px_repeat(12,1fr)] gap-1 items-center min-w-[560px]">' +
        '<a href="' + esc(m.href) + '" class="font-mono text-[10px] text-foreground hover:text-accent truncate pr-2">' + esc(m.name.replace('Mount ', '')) + '</a>' +
        MKEYS.map(function (k) { var v = mm[k] || 'closed'; return '<span title="' + k + ': ' + v + '" class="h-4 border border-border" style="background:' + CELLCLR[v] + '"></span>'; }).join('') +
        '</div>';
    }).join('');
    document.getElementById('ex-seasons').innerHTML =
      '<div class="overflow-x-auto pb-1">' + head + '<div class="space-y-1">' + rows + '</div></div>' +
      '<div class="flex flex-wrap gap-4 mt-4">' +
      [['prime', 'Prime window'], ['shoulder', 'Shoulder / marginal'], ['rare', 'Rare attempts'], ['winter', 'Winter (specialist)']].map(function (l) {
        return '<span class="flex items-center gap-2 font-mono text-[10px] text-muted-foreground"><span class="h-3 w-3 border border-border" style="background:' + CELLCLR[l[0]] + '"></span>' + l[1] + '</span>';
      }).join('') + '</div>';
  }

  /* ============================================================
     FIRST-ASCENT TIMELINE
     ============================================================ */
  function buildTimeline() {
    var withF = LIST.filter(function (m) { return m.firstAscent && m.firstAscent.year; });
    var byYear = withF.slice().sort(function (a, b) { return (a.firstAscent.year - b.firstAscent.year) || (a.ord - b.ord); });
    document.getElementById('ex-timeline').innerHTML = byYear.map(function (m) {
      var f = m.firstAscent;
      return '<div class="relative pl-8 pb-8">' +
        '<span class="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent"></span>' +
        '<div class="flex flex-wrap items-baseline gap-x-4"><span class="font-heading text-2xl text-accent">' + f.year + '</span>' +
        '<a href="' + esc(m.href) + '" class="font-heading text-xl md:text-2xl uppercase text-white hover:text-accent transition-colors">' + esc(m.name) + '</a>' +
        '<span class="lbl">' + esc(rankMeta(m)) + '</span></div>' +
        (f.climbers ? '<p class="font-sans text-[13px] text-muted-foreground mt-1.5 leading-relaxed max-w-2xl">' + esc(f.climbers) + '</p>' : '') +
        (f.route || f.expedition ? '<p class="font-mono text-[11px] text-muted-foreground/80 mt-1">' + esc(f.route || '') + (f.expedition ? ' · ' + esc(f.expedition) : '') + '</p>' : '') +
        '</div>';
    }).join('');
  }

  /* ============================================================
     BY COUNTRY  (Nepal for 8000m, all countries otherwise)
     ============================================================ */
  function buildNepal() {
    var TREKS = window.TREKS || {};
    var sub = IS8000 ? LIST.filter(function (m) { return m.inNepal; }) : LIST;
    document.getElementById('ex-nepal').innerHTML = sub.map(function (m) {
      var wholly = (m.countries || []).length === 1;
      var rt = (m.relatedTreks || []).map(function (s) { return TREKS[s]; }).filter(Boolean)[0];
      var img = m.heroImage
        ? '<img class="mt-img absolute inset-0 h-full w-full object-cover opacity-0" loading="lazy" src="' + esc(m.heroImage) + '" alt="' + esc(m.name) + '">'
        : tilePattern();
      return '<div class="mt group relative overflow-hidden border border-border bg-card flex flex-col">' +
        '<a href="' + esc(m.href) + '" class="relative block h-40 overflow-hidden">' + img +
        '<div class="mt-scrim absolute inset-0"></div>' +
        '<div class="relative z-10 flex h-full flex-col justify-end p-4"><span class="lbl text-white/70">' + esc(wholly ? m.countryLabel : m.countryLabel) + '</span>' +
        '<span class="font-heading text-xl font-light uppercase text-white leading-tight mt-0.5">' + esc(m.name) + '</span>' +
        '<span class="font-mono text-[11px] text-accent mt-0.5">' + esc(rankMeta(m)) + '</span></div></a>' +
        (rt ? '<a href="/treks/' + esc(rt.slug) + '" class="border-t border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-accent hover:bg-[var(--muted)] transition-colors">Trek beneath it: ' + esc(rt.name.replace(/ Trek$/, '')) + ' →</a>' : '') +
        '</div>';
    }).join('');
    bindImgs('#ex-nepal');
  }

  /* ============================================================
     PLANNING / SAFETY / CTA / TRUST
     ============================================================ */
  function buildStatic() {
    var p = D.planning || {};
    var pi = document.getElementById('ex-plan-intro'); if (pi) pi.textContent = deband(p.intro || '');
    var pl = document.getElementById('ex-planning');
    if (pl) pl.innerHTML = (p.points || []).map(function (x) {
      return '<div><span class="lbl block mb-1.5">' + esc(x.label) + '</span><p class="font-sans text-[13px] text-muted-foreground leading-relaxed">' + esc(deband(x.text)) + '</p></div>';
    }).join('');

    var s = D.safety || {};
    var si = document.getElementById('ex-safety-intro'); if (si) si.textContent = deband(s.intro || '');
    var sf = document.getElementById('ex-safety');
    if (sf) sf.innerHTML = (s.categories || []).map(function (c) {
      return '<div class="border border-border bg-card p-4"><span class="font-mono text-[11px] uppercase tracking-wider text-accent block mb-1">' + esc(c.name) + '</span><span class="font-sans text-[12px] text-muted-foreground leading-relaxed">' + esc(deband(c.text)) + '</span></div>';
    }).join('');
    var dc = document.getElementById('ex-disclaimer'); if (dc) dc.textContent = deband(D.disclaimer || '');

    var cta = D.planningCta || {};
    var ch = document.getElementById('ex-cta-h'); if (ch) ch.textContent = cta.heading || 'Which summit comes next?';
    var cs = document.getElementById('ex-cta-sub'); if (cs) cs.textContent = cta.sub || '';
    var ca = document.getElementById('ex-cta-actions');
    if (ca) ca.innerHTML = (cta.actions || []).map(function (a, i) {
      return '<a href="' + esc(a.href) + '" class="' + (i === 0 ? 'bg-accent text-background hover:bg-accent-hover' : 'border border-border text-foreground hover:border-accent hover:text-accent') + ' font-mono text-[11px] uppercase tracking-widest font-semibold px-6 py-3 transition-all">' + esc(a.label) + '</a>';
    }).join('');

    var tr = document.getElementById('ex-trust');
    if (tr) tr.innerHTML = (D.trust || []).map(function (x) {
      return '<div><span class="font-mono text-[11px] text-accent uppercase tracking-wider block mb-2">' + esc(x.title) + '</span><span class="font-sans text-[12px] text-muted-foreground leading-relaxed">' + esc(x.note) + '</span></div>';
    }).join('');
  }

  /* ============================================================
     VIEW SWITCHING + EVENTS
     ============================================================ */
  function setMode(mode) {
    ['atlas', 'map', 'compare'].forEach(function (v) {
      document.getElementById('view-' + v).classList.toggle('hidden', v !== mode);
    });
    document.querySelectorAll('#ex-modes .ex-mode').forEach(function (b) { b.classList.toggle('on', b.dataset.mode === mode); });
    document.getElementById('ex-count').classList.toggle('hidden', mode !== 'atlas');
    if (mode === 'map' && !document.getElementById('ex-map-stage').innerHTML) buildMap();
    if (mode === 'compare' && !document.getElementById('ex-cmp-pick').innerHTML) buildComparePick();
  }

  document.getElementById('ex-modes').addEventListener('click', function (e) {
    var b = e.target.closest('[data-mode]'); if (b) setMode(b.dataset.mode);
  });

  /* "View the map" hero button + #map deep-link → open the map view and scroll to it */
  function jumpToMap() {
    setMode('map');
    var t = document.getElementById('ex-toolbar');
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-jump="map"]')) setTimeout(jumpToMap, 20);
  });
  window.addEventListener('hashchange', function () { if (location.hash === '#map') jumpToMap(); });
  if (location.hash === '#map') setTimeout(jumpToMap, 80);

  /* relief (2D/3D) toggle + country highlight — delegated on the map view */
  document.getElementById('view-map').addEventListener('click', function (e) {
    var rb = e.target.closest('[data-relief]');
    if (rb) {
      var relief = rb.dataset.relief === 'relief';
      document.getElementById('ex-map-stage').classList.toggle('relief', relief);
      document.querySelectorAll('#ex-map-view .hma-vtoggle').forEach(function (b) {
        var on = b === rb; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on));
      });
      var badge = document.getElementById('ex-map-dim'); if (badge) badge.textContent = relief ? '3D' : '2D';
      return;
    }
    if (e.target.closest('[data-mapreset]')) { mapPanelDefault(); return; }
    var cp = e.target.closest('.hma-country[data-country]');
    if (cp && cp.getAttribute('data-active') === '1') { mapCountry(cp.dataset.country); }
  });
  document.getElementById('view-map').addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ')) {
      var cp = e.target.closest('.hma-country[data-active="1"]');
      if (cp) { e.preventDefault(); mapCountry(cp.dataset.country); }
    }
  });

  var deb;
  document.getElementById('ex-q').addEventListener('input', function (e) {
    clearTimeout(deb); var v = e.target.value; deb = setTimeout(function () { st.q = v; applyAtlas(); }, 150);
  });
  // filter selects → state key
  var FILTERS = [['ex-country', 'country'], ['ex-range', 'range'], ['ex-season', 'season'], ['ex-type', 'type'], ['ex-grade', 'grade']];
  FILTERS.forEach(function (f) {
    var el = document.getElementById(f[0]);
    if (el) el.addEventListener('change', function (e) { st[f[1]] = e.target.value; applyAtlas(); });
  });
  document.getElementById('ex-sort').addEventListener('change', function (e) { st.sort = e.target.value; applyAtlas(); });

  function resetFilters() {
    st = { q: '', country: '', range: '', season: '', type: '', grade: '', sort: st.sort };
    var qel = document.getElementById('ex-q'); if (qel) qel.value = '';
    FILTERS.forEach(function (f) { var el = document.getElementById(f[0]); if (el) el.value = ''; });
  }

  document.getElementById('ex-chips').addEventListener('click', function (e) {
    var b = e.target.closest('[data-xclear]'); if (!b) return;
    var k = b.dataset.xclear;
    if (k === 'all') { resetFilters(); }
    else if (k === 'q') { st.q = ''; document.getElementById('ex-q').value = ''; }
    else { st[k] = ''; var el = document.getElementById('ex-' + k); if (el) el.value = ''; }
    applyAtlas();
  });
  var clr2 = document.getElementById('ex-clear2');
  if (clr2) clr2.addEventListener('click', function () { resetFilters(); applyAtlas(); });

  document.body.addEventListener('click', function (e) {
    var pin = e.target.closest('[data-mtn]');
    if (pin && (pin.closest('#ex-map-stage') || pin.closest('#ex-map-panel'))) { mapSelect(pin.dataset.mtn); return; }
    if (pin && pin.closest('#ex-skyline')) { var t = BY[pin.dataset.mtn]; if (t) location.href = t.href; return; }
    var cb = e.target.closest('[data-cmp]');
    if (cb) {
      var s = cb.dataset.cmp, i = cmp.indexOf(s);
      if (i > -1) cmp.splice(i, 1); else if (cmp.length < 3) cmp.push(s);
      buildComparePick();
      return;
    }
    var unitBtn = e.target.closest('[data-unit]');
    if (unitBtn) { unit = unitBtn.dataset.unit; document.querySelectorAll('[data-unit]').forEach(function (b) { b.classList.toggle('on', b.dataset.unit === unit); }); buildSkyline(); }
  });
  document.body.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.closest && e.target.closest('#ex-map-stage [data-mtn]')) {
      e.preventDefault(); mapSelect(e.target.closest('[data-mtn]').dataset.mtn);
    }
  });

  /* fade-up + progress */
  var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) x.target.classList.add('in'); }); }, { threshold: 0.06 });
  document.querySelectorAll('.fade-up').forEach(function (el) { io.observe(el); });
  window.addEventListener('scroll', function () {
    var st2 = window.scrollY, dh = document.documentElement.scrollHeight - window.innerHeight;
    var pb = document.getElementById('read-progress'); if (pb) pb.style.width = (dh > 0 ? st2 / dh * 100 : 0) + '%';
  }, { passive: true });

  /* JSON-LD */
  var ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'ItemList', name: CAT.label,
    itemListElement: LIST.map(function (m) {
      return { '@type': 'ListItem', position: m.ord, item: { '@type': 'Mountain', name: m.name, url: 'https://himalayanmagic.com' + m.href } };
    })
  });
  document.head.appendChild(ld);

  /* boot */
  var sortSel = document.getElementById('ex-sort');
  if (sortSel) { sortSel.value = st.sort === 'elev-desc' ? 'elev-desc' : st.sort; }
  applyAtlas();
  buildSkyline();
  buildDifficulty();
  buildSeasons();
  buildTimeline();
  buildNepal();
  buildStatic();
})();
