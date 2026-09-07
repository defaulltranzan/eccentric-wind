/* ============================================================================
   THE 14 EIGHT-THOUSANDERS — ATLAS INDEX PAGE
   Renders the Atlas grid, the Map, the Compare tool, and the editorial
   sections (elevation, difficulty, seasons, first ascents, Nepal, planning,
   safety) from window.MOUNTAINS + window.EXPED_DEFAULTS.
   ========================================================================== */
(function () {
  'use strict';

  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var M = window.MOUNTAINS || {};
  var D = window.EXPED_DEFAULTS || {};
  var LIST = Object.keys(M).map(function (k) {
    var m = M[k];
    return Object.assign({}, m, {
      key: k,
      rangeKey: /karakoram/i.test(m.range || '') ? 'Karakoram' : 'Himalaya',
      seasonPrimary: (m.season && m.season.primary) || ''
    });
  }).sort(function (a, b) { return a.rank - b.rank; });

  /* ---------------- shared ---------------- */
  var ARROW = '<svg class="mt-arrow" width="16" height="8" viewBox="0 0 16 8" fill="none" aria-hidden="true"><path d="M0 4h14M11 1l3 3-3 3" stroke="currentColor" stroke-width="1.4"/></svg>';
  function fmtFt(n) { return n ? n.toLocaleString() + ' ft' : ''; }

  /* ============================================================
     ATLAS GRID
     ============================================================ */
  var st = { q: '', country: '', range: '', season: '', sort: 'rank' };

  var SM = ['col-span-2 row-span-3', 'col-span-2 row-span-3', 'col-span-1 row-span-2', 'col-span-1 row-span-2', 'col-span-2 row-span-3', 'col-span-1 row-span-2', 'col-span-1 row-span-2', 'col-span-2 row-span-3'];
  var MD = ['md:col-span-4 md:row-span-2', 'md:col-span-2 md:row-span-3', 'md:col-span-2 md:row-span-2', 'md:col-span-2 md:row-span-2', 'md:col-span-2 md:row-span-3', 'md:col-span-4 md:row-span-2', 'md:col-span-2 md:row-span-2', 'md:col-span-2 md:row-span-2'];
  var LG = ['lg:col-span-4 lg:row-span-3', 'lg:col-span-2 lg:row-span-3', 'lg:col-span-3 lg:row-span-2', 'lg:col-span-3 lg:row-span-2', 'lg:col-span-2 lg:row-span-2', 'lg:col-span-2 lg:row-span-2', 'lg:col-span-4 lg:row-span-2', 'lg:col-span-2 lg:row-span-3', 'lg:col-span-3 lg:row-span-2', 'lg:col-span-3 lg:row-span-2', 'lg:col-span-2 lg:row-span-2', 'lg:col-span-2 lg:row-span-2'];
  function spanFor(i, big) {
    if (big) return SM[0] + ' ' + MD[0] + ' lg:col-span-4 lg:row-span-3';
    return SM[i % SM.length] + ' ' + MD[i % MD.length] + ' ' + LG[i % LG.length];
  }

  function mtCard(m, cls, big) {
    var meta = [m.elevationLabel, '#' + m.rank, m.countryLabel];
    return '<a href="/expeditions/' + esc(m.slug) + '" class="mt group relative block overflow-hidden border border-border bg-card ' + cls + '" ' +
      'aria-label="' + esc(m.name + ', ' + m.elevationLabel + ', rank ' + m.rank + ', ' + m.countryLabel + ', ' + m.range) + '">' +
      '<div class="mt-shimmer absolute inset-0"></div>' +
      '<img class="mt-img absolute inset-0 h-full w-full object-cover opacity-0" loading="lazy" decoding="async" src="' + esc(m.heroImage) + '" alt="' + esc(m.name + ', ' + m.range) + '">' +
      '<div class="mt-scrim absolute inset-0"></div>' +
      '<span class="absolute top-3 left-3 z-10 bg-black/40 border border-white/15 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white">#' + m.rank + '</span>' +
      '<div class="relative z-10 flex h-full flex-col justify-end p-4 md:p-5">' +
        '<span class="lbl text-white/70">' + esc(m.range) + '</span>' +
        '<h3 class="font-heading font-light uppercase tracking-tight text-white leading-[0.95] mt-1 ' + (big ? 'text-3xl md:text-[2.7rem]' : 'text-lg md:text-2xl') + '">' + esc(m.name) + '</h3>' +
        '<div class="mt-1.5 flex flex-wrap items-center gap-x-2.5 font-mono text-[11px] text-white/85"><span class="text-accent">' + esc(m.elevationLabel) + '</span><span class="text-white/30">/</span><span>' + esc(m.countryLabel) + '</span></div>' +
        '<div class="mt-more ' + (big ? '' : 'reveal ') + '">' +
          '<p class="font-sans text-[12.5px] leading-snug text-white/80">' + esc(m.tagline) + '</p>' +
          '<div class="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-white/70">' +
            '<span>' + esc((m.normalRoute && m.normalRoute.name || '').split(',')[0]) + '</span>' +
            '<span class="text-white/25">/</span><span>First climbed ' + (m.firstAscent && m.firstAscent.year || '') + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="mt-3 flex items-center justify-between gap-3">' +
          '<span class="font-mono text-[10px] uppercase tracking-widest text-white/80">' + esc((m.season && m.season.primary || '') + ' window') + '</span>' +
          '<span class="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white shrink-0">Explore ' + ARROW + '</span>' +
        '</div>' +
      '</div></a>';
  }

  function applyAtlas() {
    var q = st.q.trim().toLowerCase();
    var out = LIST.filter(function (m) {
      if (st.country && (m.countries || []).indexOf(st.country) < 0) return false;
      if (st.range && m.rangeKey !== st.range) return false;
      if (st.season && (m.season && m.season.primary) !== st.season) return false;
      if (q) {
        var hay = (m.name + ' ' + m.aka + ' ' + m.range + ' ' + m.countryLabel + ' ' + m.region + ' ' + m.tagline).toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });
    out.sort(function (a, b) {
      if (st.sort === 'rank') return a.rank - b.rank;
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
      if (!bigDone && st.sort === 'rank' && m.rank === 1) { big = true; bigDone = true; }
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

  /* populate country select */
  (function () {
    var cs = {};
    LIST.forEach(function (m) { (m.countries || []).forEach(function (c) { cs[c] = 1; }); });
    var opts = '<option value="">Any country</option>' + Object.keys(cs).sort().map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('');
    document.getElementById('ex-country').innerHTML = opts;
  })();

  /* ============================================================
     MAP
     ============================================================ */
  var LON0 = 73.5, LON1 = 89, LAT0 = 27, LAT1 = 36.6, MW = 1000, MH = 540;
  function mx(lon) { return (lon - LON0) / (LON1 - LON0) * MW; }
  function my(lat) { return (LAT1 - lat) / (LAT1 - LAT0) * MH; }

  function buildMap() {
    var pins = LIST.map(function (m) {
      var x = mx(m.coordinates.lon), y = my(m.coordinates.lat);
      var s = m.rank <= 3 ? 13 : (m.rank <= 8 ? 10 : 8);
      return '<g class="peak-hit" data-mtn="' + esc(m.slug) + '" tabindex="0" role="button" aria-label="' + esc(m.name + ', ' + m.elevationLabel) + '">' +
        '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="16" fill="transparent"/>' +
        '<path class="peak-pin" data-mtn="' + esc(m.slug) + '" d="M' + x.toFixed(1) + ',' + (y - s).toFixed(1) + ' L' + (x - s * 0.8).toFixed(1) + ',' + (y + s * 0.5).toFixed(1) + ' L' + (x + s * 0.8).toFixed(1) + ',' + (y + s * 0.5).toFixed(1) + ' Z" fill="#0f1113" stroke="var(--accent)" stroke-width="1.5"/>' +
        '<text x="' + x.toFixed(1) + '" y="' + (y + s * 0.5 + 12).toFixed(1) + '" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="#9399a2">' + m.rank + '</text>' +
        '</g>';
    }).join('');

    var svg = '<svg viewBox="0 0 1000 540" class="w-full" xmlns="http://www.w3.org/2000/svg">' +
      /* faint graticule */
      '<g stroke="var(--border)" stroke-width="1" opacity="0.5">' +
      [76, 80, 84, 88].map(function (l) { return '<line x1="' + mx(l).toFixed(0) + '" y1="0" x2="' + mx(l).toFixed(0) + '" y2="540"/>'; }).join('') +
      [30, 33, 36].map(function (l) { return '<line x1="0" y1="' + my(l).toFixed(0) + '" x2="1000" y2="' + my(l).toFixed(0) + '"/>'; }).join('') +
      '</g>' +
      /* range zones */
      '<ellipse cx="' + mx(76).toFixed(0) + '" cy="' + my(35.6).toFixed(0) + '" rx="150" ry="80" fill="var(--accent)" fill-opacity="0.05" stroke="var(--accent)" stroke-opacity="0.2"/>' +
      '<text x="' + mx(76).toFixed(0) + '" y="' + (my(35.6) - 92).toFixed(0) + '" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" letter-spacing="3" fill="var(--accent)">KARAKORAM</text>' +
      '<path d="M' + mx(82).toFixed(0) + ',' + my(29.2).toFixed(0) + ' Q ' + mx(85.5).toFixed(0) + ',' + my(27.6).toFixed(0) + ' ' + mx(89).toFixed(0) + ',' + my(27.4).toFixed(0) + '" fill="none" stroke="var(--ice)" stroke-opacity="0.35" stroke-width="40" stroke-linecap="round"/>' +
      '<text x="' + mx(85.5).toFixed(0) + '" y="' + (my(28.4) + 60).toFixed(0) + '" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" letter-spacing="3" fill="var(--ice)">HIMALAYA</text>' +
      /* isolation note */
      '<line x1="' + (mx(74.6) + 14).toFixed(0) + '" y1="' + my(35.24).toFixed(0) + '" x2="' + (mx(76.5) - 18).toFixed(0) + '" y2="' + my(35.88).toFixed(0) + '" stroke="var(--muted-foreground)" stroke-dasharray="3 3" stroke-opacity="0.5"/>' +
      '<text x="' + ((mx(74.6) + mx(76.5)) / 2).toFixed(0) + '" y="' + (my(35.5) - 8).toFixed(0) + '" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--muted-foreground)">≈ 180 km</text>' +
      /* country hints */
      '<text x="30" y="30" font-family="IBM Plex Mono, monospace" font-size="10" letter-spacing="2" fill="var(--muted-foreground)">PAKISTAN</text>' +
      '<text x="500" y="26" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" letter-spacing="2" fill="var(--muted-foreground)">CHINA · TIBET</text>' +
      '<text x="640" y="530" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" letter-spacing="2" fill="var(--muted-foreground)">NEPAL</text>' +
      '<text x="975" y="524" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10" letter-spacing="2" fill="var(--muted-foreground)">INDIA</text>' +
      pins +
      '</svg>';
    document.getElementById('ex-map-wrap').innerHTML = svg;
    mapPanelDefault();
  }

  function mapPanelDefault() {
    document.getElementById('ex-map-panel').innerHTML =
      '<span class="lbl block mb-3">Select a peak</span>' +
      '<ol class="space-y-1.5">' + LIST.map(function (m) {
        return '<li><button data-mtn="' + esc(m.slug) + '" class="ex-key w-full flex items-baseline justify-between gap-3 text-left hover:text-accent transition-colors">' +
          '<span class="font-mono text-[11px] text-foreground"><span class="text-muted-foreground mr-2">' + m.rank + '</span>' + esc(m.name) + '</span>' +
          '<span class="font-mono text-[10px] text-accent shrink-0">' + esc(m.elevationLabel) + '</span></button></li>';
      }).join('') + '</ol>';
  }

  function mapSelect(slug) {
    var m = M[slug]; if (!m) return;
    document.querySelectorAll('.peak-pin').forEach(function (p) { p.classList.toggle('on', p.dataset.mtn === slug); });
    document.getElementById('ex-map-panel').innerHTML =
      '<span class="lbl block">Rank ' + m.rank + ' / 14</span>' +
      '<h3 class="font-heading text-2xl uppercase text-white mt-1 mb-1 leading-tight">' + esc(m.name) + '</h3>' +
      (m.aka ? '<span class="font-mono text-[10px] text-muted-foreground">' + esc(m.aka) + '</span>' : '') +
      '<div class="mt-4 grid grid-cols-2 gap-3">' +
        kv('Elevation', m.elevationLabel) + kv('Rank', '#' + m.rank) +
        kv('Country', m.countryLabel) + kv('Range', m.range) +
        kv('Coordinates', m.coordinates.lat.toFixed(3) + '°N, ' + m.coordinates.lon.toFixed(3) + '°E') + kv('Season', (m.season && m.season.primary) + ' · ' + (m.season && m.season.window)) +
      '</div>' +
      '<p class="mt-4 font-sans text-[12.5px] text-muted-foreground leading-relaxed">' + esc(m.tagline) + '</p>' +
      '<a href="/expeditions/' + esc(m.slug) + '" class="mt-5 inline-flex items-center gap-2 border border-accent px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-accent hover:bg-accent hover:text-background transition-all">Explore expedition →</a>';
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
    if (!cmp.length) { box.innerHTML = '<p class="font-mono text-xs text-muted-foreground">No mountains selected.</p>'; return; }
    var sel = cmp.map(function (s) { return M[s]; });
    var rows = [
      ['Elevation', function (m) { return m.elevationLabel + ' · ' + fmtFt(m.elevationFt); }],
      ['Rank', function (m) { return '#' + m.rank + ' of 14'; }],
      ['Country', function (m) { return m.countryLabel; }],
      ['Mountain range', function (m) { return m.range; }],
      ['Normal route', function (m) { return (m.normalRoute && m.normalRoute.name) || '—'; }],
      ['Expedition season', function (m) { return (m.season && m.season.primary + ' · ' + m.season.window) || '—'; }],
      ['Base camp', function (m) { return (m.baseCampM ? m.baseCampM.toLocaleString() + ' m' : '—'); }],
      ['Highest camp', function (m) { var c = (m.camps || []).filter(function (x) { return x.name.toLowerCase().indexOf('summit') < 0; }); return c.length ? c[c.length - 1].altM.toLocaleString() + ' m' : '—'; }],
      ['Typical duration', function (m) { return m.typicalDurationDays || '—'; }],
      ['Objective hazard', function (m) { return (m.difficulty && m.difficulty.objectiveHazard || 0) + ' / 5'; }],
      ['Technical difficulty', function (m) { return (m.difficulty && m.difficulty.technical || 0) + ' / 5'; }],
      ['Permit authority', function (m) { return (m.permit && m.permit.authority) || '—'; }]
    ];
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
     ELEVATION SKYLINE
     ============================================================ */
  var unit = 'm';
  function buildSkyline() {
    var base = 7800, top = 8849, maxH = 300;
    var cols = LIST.map(function (m) {
      var h = Math.round((m.elevationM - base) / (top - base) * maxH) + 12;
      return '<button type="button" data-mtn="' + esc(m.slug) + '" class="sky-col group relative flex-1 min-w-[54px] flex flex-col items-center justify-end" style="opacity:.82" aria-label="' + esc(m.name + ' ' + m.elevationLabel) + '">' +
        '<span class="ex-elev font-mono text-[10px] md:text-[11px] text-accent mb-1 whitespace-nowrap">' + (unit === 'm' ? esc(m.elevationLabel) : fmtFt(m.elevationFt)) + '</span>' +
        '<span class="w-full border-t border-x border-accent/50 group-hover:bg-accent/15 transition-colors" style="height:' + h + 'px;background:linear-gradient(to top,rgba(240,98,37,.22),rgba(240,98,37,.02))"></span>' +
        '<span class="mt-2 font-mono text-[9px] uppercase tracking-wide text-muted-foreground text-center leading-tight w-full">' + esc(m.name.replace('Mount ', '').replace(' I', '')) + '</span>' +
        '<span class="font-mono text-[8px] text-white/30">#' + m.rank + '</span>' +
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
    document.getElementById('ex-diff-note').textContent = D.difficultyNote || '';
    var dims = [['Technical', 'technical'], ['Altitude', 'altitude'], ['Exposure', 'exposure'], ['Weather', 'weather'], ['Remoteness', 'remoteness'], ['Objective hazard', 'objectiveHazard']];
    document.getElementById('ex-difficulty').innerHTML = LIST.map(function (m) {
      var d = m.difficulty || {};
      return '<div class="border border-border bg-card p-5">' +
        '<div class="flex items-baseline justify-between mb-3"><a href="/expeditions/' + esc(m.slug) + '" class="font-heading text-xl uppercase text-white hover:text-accent transition-colors leading-tight">' + esc(m.name) + '</a><span class="lbl">#' + m.rank + ' · ' + esc(m.elevationLabel) + '</span></div>' +
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
    document.getElementById('ex-seasons-intro').textContent = D.seasonsIntro || '';
    var head = '<div class="grid grid-cols-[130px_repeat(12,1fr)] gap-1 mb-1 min-w-[560px]"><span></span>' + MONTHS.map(function (mo, i) { return '<span class="lbl text-center" style="font-size:9px">' + mo + '</span>'; }).join('') + '</div>';
    var rows = LIST.map(function (m) {
      var mm = (m.season && m.season.months) || {};
      return '<div class="grid grid-cols-[130px_repeat(12,1fr)] gap-1 items-center min-w-[560px]">' +
        '<a href="/expeditions/' + esc(m.slug) + '" class="font-mono text-[10px] text-foreground hover:text-accent truncate pr-2">' + esc(m.name.replace('Mount ', '')) + '</a>' +
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
    var byYear = LIST.slice().sort(function (a, b) { return (a.firstAscent.year - b.firstAscent.year) || (a.rank - b.rank); });
    document.getElementById('ex-timeline').innerHTML = byYear.map(function (m) {
      var f = m.firstAscent;
      return '<div class="relative pl-8 pb-8">' +
        '<span class="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent"></span>' +
        '<div class="flex flex-wrap items-baseline gap-x-4"><span class="font-heading text-2xl text-accent">' + f.year + '</span>' +
        '<a href="/expeditions/' + esc(m.slug) + '" class="font-heading text-xl md:text-2xl uppercase text-white hover:text-accent transition-colors">' + esc(m.name) + '</a>' +
        '<span class="lbl">#' + m.rank + ' · ' + esc(m.elevationLabel) + '</span></div>' +
        '<p class="font-sans text-[13px] text-muted-foreground mt-1.5 leading-relaxed max-w-2xl">' + esc(f.climbers) + '</p>' +
        '<p class="font-mono text-[11px] text-muted-foreground/80 mt-1">' + esc(f.route) + (f.expedition ? ' · ' + esc(f.expedition) : '') + '</p>' +
        '</div>';
    }).join('');
  }

  /* ============================================================
     NEPAL'S EIGHT-THOUSANDERS
     ============================================================ */
  function buildNepal() {
    var TREKS = window.TREKS || {};
    var ne = LIST.filter(function (m) { return m.inNepal; });
    document.getElementById('ex-nepal').innerHTML = ne.map(function (m) {
      var wholly = (m.countries || []).length === 1;
      var rt = (m.relatedTreks || []).map(function (s) { return TREKS[s]; }).filter(Boolean)[0];
      return '<div class="mt group relative overflow-hidden border border-border bg-card flex flex-col">' +
        '<a href="/expeditions/' + esc(m.slug) + '" class="relative block h-40 overflow-hidden">' +
        '<img class="mt-img absolute inset-0 h-full w-full object-cover opacity-0" loading="lazy" src="' + esc(m.heroImage) + '" alt="' + esc(m.name) + '">' +
        '<div class="mt-scrim absolute inset-0"></div>' +
        '<div class="relative z-10 flex h-full flex-col justify-end p-4"><span class="lbl text-white/70">' + (wholly ? 'Wholly in Nepal' : esc(m.countryLabel)) + '</span>' +
        '<span class="font-heading text-xl font-light uppercase text-white leading-tight mt-0.5">' + esc(m.name) + '</span>' +
        '<span class="font-mono text-[11px] text-accent mt-0.5">' + esc(m.elevationLabel) + ' · #' + m.rank + '</span></div></a>' +
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
    document.getElementById('ex-plan-intro').textContent = p.intro || '';
    document.getElementById('ex-planning').innerHTML = (p.points || []).map(function (x) {
      return '<div><span class="lbl block mb-1.5">' + esc(x.label) + '</span><p class="font-sans text-[13px] text-muted-foreground leading-relaxed">' + esc(x.text) + '</p></div>';
    }).join('');

    var s = D.safety || {};
    document.getElementById('ex-safety-intro').textContent = s.intro || '';
    document.getElementById('ex-safety').innerHTML = (s.categories || []).map(function (c) {
      return '<div class="border border-border bg-card p-4"><span class="font-mono text-[11px] uppercase tracking-wider text-accent block mb-1">' + esc(c.name) + '</span><span class="font-sans text-[12px] text-muted-foreground leading-relaxed">' + esc(c.text) + '</span></div>';
    }).join('');
    document.getElementById('ex-disclaimer').textContent = D.disclaimer || '';

    var cta = D.planningCta || {};
    document.getElementById('ex-cta-h').textContent = cta.heading || 'Which summit comes next?';
    document.getElementById('ex-cta-sub').textContent = cta.sub || '';
    document.getElementById('ex-cta-actions').innerHTML = (cta.actions || []).map(function (a, i) {
      return '<a href="' + esc(a.href) + '" class="' + (i === 0 ? 'bg-accent text-background hover:bg-accent-hover' : 'border border-border text-foreground hover:border-accent hover:text-accent') + ' font-mono text-[11px] uppercase tracking-widest font-semibold px-6 py-3 transition-all">' + esc(a.label) + '</a>';
    }).join('');

    document.getElementById('ex-trust').innerHTML = (D.trust || []).map(function (x) {
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
    if (mode === 'map' && !document.getElementById('ex-map-wrap').innerHTML) buildMap();
    if (mode === 'compare' && !document.getElementById('ex-cmp-pick').innerHTML) buildComparePick();
  }

  document.getElementById('ex-modes').addEventListener('click', function (e) {
    var b = e.target.closest('[data-mode]'); if (b) setMode(b.dataset.mode);
  });

  var deb;
  document.getElementById('ex-q').addEventListener('input', function (e) {
    clearTimeout(deb); var v = e.target.value; deb = setTimeout(function () { st.q = v; applyAtlas(); }, 150);
  });
  document.getElementById('ex-country').addEventListener('change', function (e) { st.country = e.target.value; applyAtlas(); });
  document.getElementById('ex-range').addEventListener('change', function (e) { st.range = e.target.value; applyAtlas(); });
  document.getElementById('ex-season').addEventListener('change', function (e) { st.season = e.target.value; applyAtlas(); });
  document.getElementById('ex-sort').addEventListener('change', function (e) { st.sort = e.target.value; applyAtlas(); });

  document.getElementById('ex-chips').addEventListener('click', function (e) {
    var b = e.target.closest('[data-xclear]'); if (!b) return;
    var k = b.dataset.xclear;
    if (k === 'all') { st = { q: '', country: '', range: '', season: '', sort: st.sort }; document.getElementById('ex-q').value = ''; ['ex-country', 'ex-range', 'ex-season'].forEach(function (id) { document.getElementById(id).value = ''; }); }
    else if (k === 'q') { st.q = ''; document.getElementById('ex-q').value = ''; }
    else { st[k] = ''; document.getElementById('ex-' + k).value = ''; }
    applyAtlas();
  });
  document.getElementById('ex-clear2').addEventListener('click', function () {
    st = { q: '', country: '', range: '', season: '', sort: st.sort };
    document.getElementById('ex-q').value = ''; ['ex-country', 'ex-range', 'ex-season'].forEach(function (id) { document.getElementById(id).value = ''; });
    applyAtlas();
  });

  document.body.addEventListener('click', function (e) {
    var pin = e.target.closest('[data-mtn]');
    if (pin && (pin.closest('#ex-map-wrap') || pin.closest('#ex-map-panel'))) { mapSelect(pin.dataset.mtn); return; }
    if (pin && pin.closest('#ex-skyline')) { location.href = '/expeditions/' + pin.dataset.mtn; return; }
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
    if ((e.key === 'Enter' || e.key === ' ') && e.target.closest && e.target.closest('#ex-map-wrap [data-mtn]')) {
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
    '@context': 'https://schema.org', '@type': 'ItemList', name: 'The 14 eight-thousanders',
    itemListElement: LIST.map(function (m) {
      return { '@type': 'ListItem', position: m.rank, item: { '@type': 'Mountain', name: m.name, url: 'https://himalayanmagic.com/expeditions/' + m.slug } };
    })
  });
  document.head.appendChild(ld);

  /* boot */
  applyAtlas();
  buildSkyline();
  buildDifficulty();
  buildSeasons();
  buildTimeline();
  buildNepal();
  buildStatic();
})();
