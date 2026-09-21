/* ============================================================================
   COMPARE — pick up to 3 and line them up, in two modes:
     treks  window.TREKS                    shareable via ?t=slug,slug,slug
     peaks  window.MOUNTAINS + PEAKS_DATA   shareable via ?mode=peaks&p=slug,slug
   Both modes share the picker, the table and the verdict.
   ============================================================================ */
(function () {
  'use strict';
  var T = window.TREKS || {};
  var P = window.TREK_PROVINCES || {};
  var MAX = 3;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var firstInt = function (s) { var m = String(s || '').replace(/,/g, '').match(/\d+/); return m ? +m[0] : null; };
  /* branded placeholder for a trek whose photo has not been sourced yet — never another trek's image */
  function phImg(label) {
    var tx = String(label || '').toUpperCase().replace(/[<>&]/g, '').slice(0, 28);
    return 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450">' +
      '<defs><radialGradient id="g" cx="28%" cy="22%" r="90%"><stop offset="0" stop-color="#f06225" stop-opacity="0.16"/><stop offset="1" stop-color="#1b1e22" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="800" height="450" fill="#1b1e22"/><rect width="800" height="450" fill="url(#g)"/>' +
      '<path d="M0 330 L170 190 L320 290 L470 160 L620 270 L800 200 L800 450 L0 450Z" fill="#ffffff" fill-opacity="0.035"/>' +
      '<text x="40" y="400" font-family="monospace" font-size="19" fill="#9ca3af" letter-spacing="2">' + tx + '</text>' +
      '<text x="40" y="426" font-family="monospace" font-size="10" fill="#5f636b" letter-spacing="3">PHOTOGRAPHY PENDING</text>' +
      '</svg>'
    );
  }

  var MODEL = Object.keys(T).map(function (slug) {
    var t = T[slug], s = t.stats || {}, su = t.suitability || {};
    var prov = P[t.province] || {};
    var pr = (t.cost && t.cost.tiers && t.cost.tiers[0] && t.cost.tiers[0].rangeUSD) || '';
    var pm = pr.match(/\$[\d,]+/);
    var priceFrom = pm ? +pm[0].replace(/[$,]/g, '') : null;
    var perDay = /per day/i.test(pr);
    var dm = firstInt(s.duration);
    var accNote = (t.accommodationNote || '').toLowerCase();
    var acc = /camp/.test(accNote) ? 'Tea house + camping'
      : /lodge|hotel|guesthouse/.test(accNote) && !/tea ?house/.test(accNote) ? 'Lodges / hotels'
      : 'Tea house';
    var durMatch = String(s.duration || '').match(/(\d+)(?:\s*[–—-]\s*(\d+))?\s*days?/i);
    var durShort = durMatch ? (durMatch[2] ? durMatch[1] + '–' + durMatch[2] + ' days' : durMatch[1] + ' days') : (s.duration || '').split('(')[0].trim();
    var priceTier = priceFrom == null ? '—'
      : perDay ? '$'
      : priceFrom < 1200 ? '$'
      : priceFrom < 2200 ? '$$'
      : '$$$';
    return {
      slug: slug,
      name: t.name.replace(/ Trek$/, ''),
      region: t.region || prov.name || '',
      province: (prov.name || '').replace(' Province', ''),
      img: t.heroImage || '/images/hero-mountain.jpg',
      durShort: durShort, durationDays: dm,
      distance: (s.distanceKm || '—').replace(/^[≈~\s]+/, ''),
      maxAlt: (s.maxAltitude || '—').replace(/^[≈~\s]+/, '').split('(')[0].trim(),
      maxAltM: firstInt(s.maxAltitude),
      difficulty: s.difficulty || '—',
      bestSeason: s.bestSeason || '—',
      start: s.startPoint || '—',
      priceFrom: priceFrom, perDay: perDay, priceTier: priceTier,
      priceLabel: priceFrom == null ? 'On request' : ('From $' + priceFrom.toLocaleString() + (perDay ? ' / day' : '')),
      accommodation: acc,
      teahouse: !/camping/i.test(accNote) || /tea ?house/i.test(accNote),
      remoteness: su.remoteness || 0,
      physical: su.physical || 0, technical: su.technical || 0, altitudeScore: su.altitude || 0,
      popular: !!t.popular,
      highlights: (t.highlights || []).slice(0, 3)
    };
  }).sort(function (a, b) { return a.name.localeCompare(b.name); });
  var TREK_BY = {}; MODEL.forEach(function (m) { TREK_BY[m.slug] = m; });

  /* ---- peaks & expeditions ---- */
  var PEAK_MODEL = (function () {
    var out = [];
    [[window.MOUNTAINS || {}, true], [window.PEAKS_DATA || {}, false]].forEach(function (pair) {
      var db = pair[0], isBig = pair[1];
      Object.keys(db).forEach(function (slug) {
        var m = db[slug];
        var d = m.difficulty || {};
        var se = m.season || {};
        var metres = m.elevationM || m.elevation || null;
        var band = m.category ? m.category + ' m' : (metres >= 8000 ? '8,000 m +' : metres >= 7000 ? '7,000 m +' : metres >= 6000 ? '6,000 m +' : '—');
        var dur = String(m.typicalDurationDays || '').split('(')[0].trim();
        var dm = dur.match(/(\d+)/);
        out.push({
          slug: slug,
          href: '/expeditions/' + (isBig ? '' : 'peaks/') + slug,
          name: m.name,
          region: m.range || m.region || '',
          province: m.countryLabel || (m.inNepal === false ? 'Outside Nepal' : 'Nepal'),
          img: m.heroImage || '/images/hero-mountain.jpg',
          tagline: m.tagline || '',
          elevation: m.elevationLabel || (metres ? Number(metres).toLocaleString('en-GB') + ' m' : '—'),
          metres: Number(metres) || 0,
          band: band,
          durShort: dur || '—',
          durationDays: dm ? +dm[1] : null,
          baseCamp: m.baseCampM ? Number(m.baseCampM).toLocaleString('en-GB') + ' m' : '—',
          route: (m.normalRoute && m.normalRoute.name) || '—',
          season: [se.primary, se.window].filter(Boolean).join(' · ') || '—',
          grade: m.peakGrade || '',
          technical: (d.technical || 0) * 2,
          altitudeScore: (d.altitude || 0) * 2,
          remoteness: (d.remoteness || 0) * 2,
          weather: (d.weather || 0) * 2,
          permit: (m.permit && m.permit.authority ? String(m.permit.authority).split(/[,(]/)[0].trim() : '—'),
          highlights: []
        });
      });
    });
    return out.sort(function (a, b) { return b.metres - a.metres; });
  })();
  var PEAK_BY = {}; PEAK_MODEL.forEach(function (m) { PEAK_BY[m.slug] = m; });

  /* ---- which mode are we in ---- */
  var MODE = (new URLSearchParams(location.search).get('mode') === 'peaks' && PEAK_MODEL.length) ? 'peaks' : 'treks';
  function list() { return MODE === 'peaks' ? PEAK_MODEL : MODEL; }
  function byId() { return MODE === 'peaks' ? PEAK_BY : TREK_BY; }
  function hrefFor(m) { return MODE === 'peaks' ? m.href : '/treks/' + m.slug; }
  function bookType() { return MODE === 'peaks' ? 'expedition' : 'trek'; }
  var BY = TREK_BY;                                  // kept for the trek helpers below

  /* ---- selection state (from URL) ---- */
  var DEFAULTS = {
    treks: ['everest-base-camp', 'annapurna-circuit', 'langtang-valley'],
    peaks: ['everest', 'ama-dablam', 'manaslu']
  };
  function readSel(mode) {
    var key = mode === 'peaks' ? 'p' : 't';
    var db = mode === 'peaks' ? PEAK_BY : TREK_BY;
    var q = new URLSearchParams(location.search).get(key) || '';
    var arr = q.split(',').map(function (s) { return s.trim(); }).filter(function (s) { return db[s]; });
    if (!arr.length) arr = DEFAULTS[mode].filter(function (s) { return db[s]; });
    if (!arr.length) arr = Object.keys(db).slice(0, 3);
    return arr.slice(0, MAX);
  }
  var SEL = { treks: readSel('treks'), peaks: readSel('peaks') };
  var sel = SEL[MODE];

  function writeUrl() {
    var u = new URL(location.href);
    if (MODE === 'peaks') u.searchParams.set('mode', 'peaks'); else u.searchParams.delete('mode');
    var key = MODE === 'peaks' ? 'p' : 't';
    var other = MODE === 'peaks' ? 't' : 'p';
    if (sel.length) u.searchParams.set(key, sel.join(',')); else u.searchParams.delete(key);
    if (SEL[MODE === 'peaks' ? 'treks' : 'peaks'].length) u.searchParams.set(other, SEL[MODE === 'peaks' ? 'treks' : 'peaks'].join(','));
    history.replaceState(null, '', u);
  }

  /* ---- picker ---- */
  var searchEl = document.getElementById('cmp-search');
  function renderPicker() {
    var q = (searchEl.value || '').trim().toLowerCase();
    var items = list().filter(function (m) {
      if (!q) return true;
      return (m.name + ' ' + m.region + ' ' + m.province).toLowerCase().indexOf(q) > -1;
    });
    document.getElementById('cmp-picker').innerHTML = items.map(function (m) {
      var on = sel.indexOf(m.slug) > -1;
      var full = !on && sel.length >= MAX;
      return '<button type="button" class="cmp-pick' + (on ? ' on' : '') + '" data-slug="' + esc(m.slug) + '"' +
        (full ? ' disabled style="opacity:.35;cursor:not-allowed"' : '') + '>' +
        (on ? '✓ ' : '+ ') + esc(m.name) + '</button>';
    }).join('') || '<span class="lbl">Nothing matches “' + esc(q) + '”.</span>';
    document.getElementById('cmp-count').textContent = sel.length;
  }

  /* ---- comparison table ---- */
  var PEAK_ROWS = [
    ['Range', function (m) { return esc(m.region + (m.province && m.province !== 'Nepal' ? ' · ' + m.province : '')); }],
    ['Summit altitude', function (m) { return '<span class="text-accent">' + esc(m.elevation) + '</span>'; }],
    ['Band', function (m) { return esc(m.band); }],
    ['Typical expedition', function (m) { return esc(m.durShort); }],
    ['Base camp', function (m) { return esc(m.baseCamp); }],
    ['Normal route', function (m) { return esc(m.route); }],
    ['Best season', function (m) { return esc(m.season); }],
    ['Technical difficulty', function (m) { return bar(m.technical); }],
    ['Altitude challenge', function (m) { return bar(m.altitudeScore); }],
    ['Remoteness', function (m) { return bar(m.remoteness); }],
    ['Weather exposure', function (m) { return bar(m.weather); }],
    ['Permit issued by', function (m) { return esc(m.permit); }]
  ];
  var ROWS = [
    ['Region', function (m) { return esc(m.region + (m.province ? ' · ' + m.province : '')); }],
    ['Duration', function (m) { return esc(m.durShort); }],
    ['Distance', function (m) { return esc(m.distance); }],
    ['Maximum altitude', function (m) { return '<span class="text-accent">' + esc(m.maxAlt) + '</span>'; }],
    ['Difficulty', function (m) { return esc(m.difficulty); }],
    ['Best season', function (m) { return esc(m.bestSeason); }],
    ['Starting point', function (m) { return esc(m.start); }],
    ['Accommodation', function (m) { return esc(m.accommodation); }],
    ['Tea houses', function (m) { return m.teahouse ? '<span class="text-accent">✓</span>' : '<span class="text-muted-foreground">✗ (camping)</span>'; }],
    ['Fitness (physical)', function (m) { return bar(m.physical); }],
    ['Altitude challenge', function (m) { return bar(m.altitudeScore); }],
    ['Remoteness', function (m) { return bar(m.remoteness); }],
    ['Indicative cost', function (m) { return '<span class="text-white">' + esc(m.priceTier) + '</span> <span class="text-muted-foreground">' + esc(m.priceLabel) + '</span>'; }],
    ['Highlights', function (m) { return m.highlights.length ? '<ul class="space-y-1">' + m.highlights.map(function (h) { return '<li class="text-[11px] leading-snug text-muted-foreground">' + esc(h) + '</li>'; }).join('') + '</ul>' : '—'; }]
  ];
  function bar(v) {
    v = Math.max(0, Math.min(10, v || 0));
    var o = '';
    for (var i = 0; i < 10; i++) o += '<span class="h-2 w-full ' + (i < v ? 'bg-accent' : 'bg-border') + '"></span>';
    return '<span class="inline-grid grid-cols-10 gap-px w-24 align-middle">' + o + '</span>';
  }

  function rows() { return MODE === 'peaks' ? PEAK_ROWS : ROWS; }

  function renderTable() {
    var box = document.getElementById('cmp-table');
    if (!sel.length) {
      box.innerHTML = '<div class="border border-border bg-card p-10 text-center"><span class="lbl block mb-2">Nothing selected</span><p class="font-sans text-sm text-muted-foreground">Pick two or three trails above to compare them.</p></div>';
      return;
    }
    var db = byId();
    var ms = sel.map(function (s) { return db[s]; }).filter(Boolean);
    var colW = 'min-w-[190px]';
    box.innerHTML = '<table class="w-full border-collapse font-sans text-[13px]">' +
      '<thead><tr>' +
        '<th class="sticky left-0 z-10 bg-background text-left p-3 lbl align-bottom w-40">Trail</th>' +
        ms.map(function (m) {
          return '<th class="p-3 text-left align-bottom ' + colW + ' border-l border-border">' +
            '<div class="aspect-[16/9] w-full overflow-hidden border border-border mb-3"><img src="' + esc(m.img) + '" alt="' + esc(m.name) + '" loading="lazy" class="h-full w-full object-cover" onerror="this.onerror=null;this.src=\'' + phImg(m.name).replace(/'/g, '%27') + '\'"></div>' +
            '<a href="' + esc(hrefFor(m)) + '" class="font-heading text-lg md:text-xl uppercase text-white hover:text-accent transition-colors leading-tight block">' + esc(m.name) + '</a>' +
            '<span class="mt-2 flex flex-wrap gap-1.5">' +
              '<a href="' + esc(hrefFor(m)) + '" class="inline-flex items-center gap-1.5 border border-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:border-accent hover:text-accent transition-colors">' + (MODE === 'peaks' ? 'View peak' : 'View trek') + ' →</a>' +
              '<a href="/contact?trip=' + esc(m.slug) + '" data-book="' + esc(m.slug) + '" data-book-type="' + bookType() + '" class="inline-flex items-center gap-1.5 border border-accent bg-accent px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-widest text-background hover:bg-accent-hover transition-colors">Plan</a>' +
            '</span>' +
          '</th>';
        }).join('') +
      '</tr></thead><tbody>' +
      rows().map(function (r, i) {
        return '<tr class="' + (i % 2 ? 'bg-card/40' : '') + '">' +
          '<td class="sticky left-0 z-10 ' + (i % 2 ? 'bg-[#20242a]' : 'bg-background') + ' p-3 lbl align-top w-40">' + esc(r[0]) + '</td>' +
          ms.map(function (m) { return '<td class="p-3 align-top text-foreground/90 border-l border-border ' + colW + '">' + r[1](m) + '</td>'; }).join('') +
        '</tr>';
      }).join('') +
      '</tbody></table>' +
      '<p class="lbl mt-3">Cost tiers and altitudes are indicative — confirm a quote for your dates. Fitness / altitude / remoteness are a comparative reading, 0–10.</p>';
  }

  /* ---- verdict ---- */
  function renderVerdict() {
    var box = document.getElementById('cmp-verdict');
    if (sel.length < 2) { box.innerHTML = ''; return; }
    if (MODE === 'peaks') return renderPeakVerdict(box);
    var ms = sel.map(function (s) { return TREK_BY[s]; }).filter(Boolean);
    var byDays = ms.slice().sort(function (a, b) { return (a.durationDays || 99) - (b.durationDays || 99); });
    var byAlt = ms.slice().sort(function (a, b) { return (a.maxAltM || 0) - (b.maxAltM || 0); });
    var byRemote = ms.slice().sort(function (a, b) { return b.remoteness - a.remoteness; });
    var byEasy = ms.slice().sort(function (a, b) { return (a.physical + a.altitudeScore) - (b.physical + b.altitudeScore); });
    var byPrice = ms.slice().filter(function (m) { return m.priceFrom != null; }).sort(function (a, b) { return a.priceFrom - b.priceFrom; });

    var lines = [
      ['Shortest', byDays[0].name + ' (' + byDays[0].durShort + ')'],
      ['Highest', byAlt[byAlt.length - 1].name + ' (' + byAlt[byAlt.length - 1].maxAlt + ')'],
      ['Gentlest introduction', byEasy[0].name],
      ['Most remote / wild', byRemote[0].name],
      ['Lowest cost', byPrice.length ? byPrice[0].name : '—']
    ];

    box.innerHTML =
      '<h2 class="sec-h text-3xl md:text-4xl text-foreground mb-2">Which one is right for me?</h2>' +
      '<p class="font-sans text-[13px] text-muted-foreground mb-6 max-w-2xl">A quick read across the ' + sel.length + ' you picked. There is no single “best” — it depends on your time, fitness and what you want from the mountains.</p>' +
      '<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">' +
      lines.map(function (l) { return '<div class="border border-border bg-card p-4"><span class="lbl block mb-1">' + esc(l[0]) + '</span><span class="font-heading text-lg uppercase text-white leading-tight">' + esc(l[1]) + '</span></div>'; }).join('') +
      '</div>' +
      '<div class="border-l-2 border-accent pl-4 max-w-2xl">' +
      '<span class="lbl block mb-1">If it is your first Himalayan trek</span>' +
      '<p class="font-sans text-[14px] text-foreground leading-relaxed">' + esc(firstTrekAdvice(ms)) + '</p>' +
      '</div>';
  }
  function renderPeakVerdict(box) {
    var ms = sel.map(function (s) { return PEAK_BY[s]; }).filter(Boolean);
    var byHigh = ms.slice().sort(function (a, b) { return b.metres - a.metres; });
    var byTech = ms.slice().sort(function (a, b) { return b.technical - a.technical; });
    var byLong = ms.slice().sort(function (a, b) { return (b.durationDays || 0) - (a.durationDays || 0); });
    var byRemote = ms.slice().sort(function (a, b) { return b.remoteness - a.remoteness; });
    var lines = [
      ['Highest', byHigh[0].name + ' (' + byHigh[0].elevation + ')'],
      ['Most technical', byTech[0].name],
      ['Longest expedition', byLong[0].name + (byLong[0].durShort !== '—' ? ' (' + byLong[0].durShort + ')' : '')],
      ['Most remote', byRemote[0].name],
      ['Least technical of these', byTech[byTech.length - 1].name]
    ];
    box.innerHTML =
      '<h2 class="sec-h text-3xl md:text-4xl text-foreground mb-2">Which climb is right for me?</h2>' +
      '<p class="font-sans text-[13px] text-muted-foreground mb-6 max-w-2xl">A quick read across the ' + ms.length + ' you picked. Grades are a comparative reading of our own, not a substitute for a briefing &mdash; talk to us before you commit to a summit.</p>' +
      '<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">' +
      lines.map(function (l) { return '<div class="border border-border bg-card p-4"><span class="lbl block mb-1">' + esc(l[0]) + '</span><span class="font-heading text-lg uppercase text-foreground">' + esc(l[1]) + '</span></div>'; }).join('') +
      '</div>' +
      '<div class="border-l-2 border-accent pl-4 max-w-2xl">' +
      '<span class="lbl block mb-1">Before you pick a summit</span>' +
      '<p class="font-sans text-[14px] text-foreground leading-relaxed">Climbing experience counts for more than fitness here. If you have not been above 6,000 m, start with a 6,000 m peak and build up &mdash; we will say so honestly when you ask.</p>' +
      '</div>';
  }

  function firstTrekAdvice(ms) {
    var ok = ms.filter(function (m) { return m.physical <= 7 && m.altitudeScore <= 8 && m.technical <= 2 && m.teahouse; });
    if (!ok.length) return 'None of these three is an easy first trek — each is long, high or remote. Consider a shorter route (Ghorepani–Poon Hill, the Everest View trek or Mardi Himal) before attempting any of them.';
    var best = ok.sort(function (a, b) { return (a.physical + a.altitudeScore) - (b.physical + b.altitudeScore); })[0];
    return best.name + ' is the most forgiving of the three for a first-timer — ' + best.durShort.toLowerCase() + ', tea-house comfort, and a difficulty that a fit walker can prepare for in a few months. It still reaches ' + best.maxAlt + ', so proper acclimatisation days matter.';
  }

  /* ---- events ---- */
  function syncChrome() {
    var peaks = MODE === 'peaks';
    document.querySelectorAll('[data-cmp-mode]').forEach(function (b) {
      var on = b.dataset.cmpMode === MODE;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var k = document.getElementById('cmp-kicker');
    if (k) k.textContent = peaks ? 'Compare Peaks' : 'Compare Treks';
    var h = document.getElementById('cmp-h1');
    if (h) h.innerHTML = peaks ? 'Two or three summits,<br><span class="text-accent">side by side</span>' : 'Two or three trails,<br><span class="text-accent">side by side</span>';
    var lead = document.getElementById('cmp-lead');
    if (lead) lead.textContent = peaks
      ? 'Altitude, grade, expedition length, base camp and season for the peaks we climb — lined up so you can see what you are taking on.'
      : 'Duration, altitude, difficulty, season and cost for the trails we guide — lined up so you can see the difference at a glance.';
    var s = document.getElementById('cmp-search');
    if (s) s.placeholder = peaks ? 'Search peaks…' : 'Search trails…';
    var n = document.getElementById('cmp-noun');
    if (n) n.textContent = peaks ? 'peaks' : 'trails';
  }

  function setMode(mode) {
    if (mode === MODE) return;
    SEL[MODE] = sel;
    MODE = mode;
    sel = SEL[MODE];
    BY = MODE === 'peaks' ? PEAK_BY : TREK_BY;
    var s = document.getElementById('cmp-search');
    if (s) s.value = '';
    refresh();
    document.getElementById('cmp-picker').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  document.querySelectorAll('[data-cmp-mode]').forEach(function (b) {
    b.addEventListener('click', function () { setMode(b.dataset.cmpMode); });
  });

  function refresh() { syncChrome(); renderPicker(); renderTable(); renderVerdict(); writeUrl(); }
  document.getElementById('cmp-picker').addEventListener('click', function (e) {
    var b = e.target.closest('[data-slug]'); if (!b || b.disabled) return;
    var s = b.dataset.slug, i = sel.indexOf(s);
    if (i > -1) sel.splice(i, 1);
    else if (sel.length < MAX) sel.push(s);
    refresh();
  });
  var deb;
  searchEl.addEventListener('input', function () { clearTimeout(deb); deb = setTimeout(renderPicker, 120); });
  document.getElementById('cmp-clear').addEventListener('click', function () { sel = []; refresh(); });

  refresh();

  /* JSON-LD */
  var ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Compare Nepal Treks', description: 'Compare Himalayan trekking routes side by side.' });
  document.head.appendChild(ld);
})();
