/* ============================================================================
   COMPARE TREKS — pick up to 3 trails, line them up, get a plain verdict.
   Reads window.TREKS (treks.js). Shareable via ?t=slug,slug,slug.
   ============================================================================ */
(function () {
  'use strict';
  var T = window.TREKS || {};
  var P = window.TREK_PROVINCES || {};
  var MAX = 3;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var firstInt = function (s) { var m = String(s || '').replace(/,/g, '').match(/\d+/); return m ? +m[0] : null; };

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
  var BY = {}; MODEL.forEach(function (m) { BY[m.slug] = m; });

  /* ---- selection state (from URL) ---- */
  function readSel() {
    var q = new URLSearchParams(location.search).get('t') || '';
    var arr = q.split(',').map(function (s) { return s.trim(); }).filter(function (s) { return BY[s]; });
    return arr.slice(0, MAX);
  }
  var sel = readSel();
  if (!sel.length) sel = ['everest-base-camp', 'annapurna-circuit', 'langtang-valley'].filter(function (s) { return BY[s]; });

  function writeUrl() {
    var u = new URL(location.href);
    if (sel.length) u.searchParams.set('t', sel.join(',')); else u.searchParams.delete('t');
    history.replaceState(null, '', u);
  }

  /* ---- picker ---- */
  var searchEl = document.getElementById('cmp-search');
  function renderPicker() {
    var q = (searchEl.value || '').trim().toLowerCase();
    var list = MODEL.filter(function (m) {
      if (!q) return true;
      return (m.name + ' ' + m.region + ' ' + m.province).toLowerCase().indexOf(q) > -1;
    });
    document.getElementById('cmp-picker').innerHTML = list.map(function (m) {
      var on = sel.indexOf(m.slug) > -1;
      var full = !on && sel.length >= MAX;
      return '<button type="button" class="cmp-pick' + (on ? ' on' : '') + '" data-slug="' + esc(m.slug) + '"' +
        (full ? ' disabled style="opacity:.35;cursor:not-allowed"' : '') + '>' +
        (on ? '✓ ' : '+ ') + esc(m.name) + '</button>';
    }).join('') || '<span class="lbl">No trails match “' + esc(q) + '”.</span>';
    document.getElementById('cmp-count').textContent = sel.length;
  }

  /* ---- comparison table ---- */
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

  function renderTable() {
    var box = document.getElementById('cmp-table');
    if (!sel.length) {
      box.innerHTML = '<div class="border border-border bg-card p-10 text-center"><span class="lbl block mb-2">Nothing selected</span><p class="font-sans text-sm text-muted-foreground">Pick two or three trails above to compare them.</p></div>';
      return;
    }
    var ms = sel.map(function (s) { return BY[s]; });
    var colW = 'min-w-[190px]';
    box.innerHTML = '<table class="w-full border-collapse font-sans text-[13px]">' +
      '<thead><tr>' +
        '<th class="sticky left-0 z-10 bg-background text-left p-3 lbl align-bottom w-40">Trail</th>' +
        ms.map(function (m) {
          return '<th class="p-3 text-left align-bottom ' + colW + ' border-l border-border">' +
            '<div class="aspect-[16/9] w-full overflow-hidden border border-border mb-3"><img src="' + esc(m.img) + '" alt="' + esc(m.name) + '" loading="lazy" class="h-full w-full object-cover"></div>' +
            '<a href="/treks/' + esc(m.slug) + '" class="font-heading text-lg md:text-xl uppercase text-white hover:text-accent transition-colors leading-tight block">' + esc(m.name) + '</a>' +
            '<a href="/treks/' + esc(m.slug) + '" class="mt-2 inline-flex items-center gap-1.5 border border-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:border-accent hover:text-accent transition-all">View trek →</a>' +
          '</th>';
        }).join('') +
      '</tr></thead><tbody>' +
      ROWS.map(function (r, i) {
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
    var ms = sel.map(function (s) { return BY[s]; });
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
  function firstTrekAdvice(ms) {
    var ok = ms.filter(function (m) { return m.physical <= 7 && m.altitudeScore <= 8 && m.technical <= 2 && m.teahouse; });
    if (!ok.length) return 'None of these three is an easy first trek — each is long, high or remote. Consider a shorter route (Ghorepani–Poon Hill, the Everest View trek or Mardi Himal) before attempting any of them.';
    var best = ok.sort(function (a, b) { return (a.physical + a.altitudeScore) - (b.physical + b.altitudeScore); })[0];
    return best.name + ' is the most forgiving of the three for a first-timer — ' + best.durShort.toLowerCase() + ', tea-house comfort, and a difficulty that a fit walker can prepare for in a few months. It still reaches ' + best.maxAlt + ', so proper acclimatisation days matter.';
  }

  /* ---- events ---- */
  function refresh() { renderPicker(); renderTable(); renderVerdict(); writeUrl(); }
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
