/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — UNIFIED PEAK DATABASE
   ----------------------------------------------------------------------------
   One scalable data layer for every mountain on the site, across every
   elevation band. It does NOT replace mountains.js — the 14 eight-thousanders
   keep their rich model there and their existing /expeditions/<slug> pages.
   This file:
     · defines the CATEGORY system (8000m+ / 7000m+ / 6000m+ / Trekking Peaks)
     · normalises the 14 from window.MOUNTAINS into a common "peak" shape
     · holds the new 7,000 m (and later 6,000 m) peaks in window.PEAKS_DATA
     · exposes window.getPeaks() / getPeak() / getCategory() / addPeak()

   ADDING A PEAK — the whole job is one object:
     addPeak({ name:'Kang Guru', elevation:6981, country:'Nepal', category:'6000',
               range:'Peri Himal', region:'Manaslu Region' });
   The listing pages, sorting, category counts and URL all pick it up
   automatically. slug + elevationDisplay + href are derived if omitted.

   DATA-ACCURACY RULE (this is a travel site — facts matter)
   For a new peak, only elevation / country / name / range / region are asserted
   here. First-ascent history, routes, coordinates, difficulty ratings, season
   windows, durations and permit detail are left null and listed in `verify[]`
   until a human confirms them. Nothing in that list is invented.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- helpers */
  function slugify(s) {
    return String(s || '')
      .toLowerCase().trim()
      .replace(/['’.]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  function fmtElev(m) {
    return m == null ? null : Number(m).toLocaleString('en-US') + ' m';
  }
  function fmtFt(m) {
    return m == null ? null : Math.round(Number(m) / 0.3048).toLocaleString('en-US') + ' ft';
  }

  /* ------------------------------------------------------------- categories */
  // Data-driven. Add a band here and everything else follows.
  window.PEAK_CATEGORIES = [
    {
      id: '8000', slug: '8000m', order: 1,
      label: 'Eight-Thousanders', short: '8,000 m +', tag: '8000m+',
      elevMin: 8000, elevMax: null,
      blurb: 'The 14 mountains on Earth that rise above 8,000 metres — the full death-zone giants, in the Himalaya and the Karakoram.'
    },
    {
      id: '7000', slug: '7000m', order: 2,
      label: 'Seven-Thousanders', short: '7,000 m +', tag: '7000m+',
      elevMin: 7000, elevMax: 7999,
      blurb: 'Serious high-altitude expeditions between 7,000 and 8,000 metres — the classic proving ground before an eight-thousander, and demanding objectives in their own right.'
    },
    {
      id: '6000', slug: '6000m', order: 3,
      label: 'Six-Thousanders', short: '6,000 m +', tag: '6000m+',
      elevMin: 6000, elevMax: 6999,
      blurb: 'Peaks between 6,000 and 7,000 metres — from Nepal’s classic trekking-peak summits, a first taste of glacier climbing and full altitude, to serious technical objectives such as Ama Dablam.'
    },
    {
      id: 'trekking', slug: 'trekking-peaks', order: 4,
      label: 'Trekking Peaks', short: 'Trekking Peaks', tag: 'Trekking',
      elevMin: null, elevMax: null,
      blurb: 'The Nepal Mountaineering Association “trekking peaks” — climbs bolted onto a trek, from around 5,500 to 6,500 metres.'
    }
  ];
  var CAT_BY_ID = {};
  window.PEAK_CATEGORIES.forEach(function (c) { CAT_BY_ID[c.id] = c; });

  window.getCategory = function (id) { return CAT_BY_ID[id] || null; };

  // classify a bare elevation into a category id (used when `category` is omitted)
  function categoryForElevation(m) {
    if (m == null) return null;
    if (m >= 8000) return '8000';
    if (m >= 7000) return '7000';
    if (m >= 6000) return '6000';
    return 'trekking';
  }

  /* ------------------------------------------------- NEW PEAKS (7,000 m +) ---
     Full records, modelled on mountains.js. STATIC facts are written inline
     (elevation, first-ascent history, the shape of the normal route, geography).
     TIME-SENSITIVE detail (permit fees, current regs, conditions) is kept
     qualitative or flagged { verify:true }. Coordinates are approximate and
     flagged. Difficulty scores are a comparative editorial reading of the
     mountaineering literature, not a measured index. Representative photographs
     are pending — heroImage is null and the template shows a cartographic panel.
     ------------------------------------------------------------------------- */
  var STILL_VERIFYING = [
    'exact summit coordinates',
    'current permit fees and liaison-officer rules for the year of travel',
    'route conditions, fixed-rope arrangements and camp positions for the season',
    'a representative photograph of this mountain'
  ];
  // Trekking / smaller peaks: permits run through the NMA, and several summit
  // elevations are recorded differently by different authorities.
  var TREK_PEAK_VERIFYING = [
    'the exact summit elevation, where mountaineering authorities and maps differ',
    'exact summit coordinates',
    'current NMA / national-park permit fees and group rules for the year of travel',
    'route conditions, crevasse bridges and fixed-rope arrangements for the season',
    'a representative photograph of this mountain'
  ];

  /* Records now live in the content database (data/content → admin at /admin).
     They are served as /data/expeditions.js (load it BEFORE this file), which sets window.PEAKS_DATA. */
  window.PEAKS_DATA = window.PEAKS_DATA || {};

  /* --------------------------------------------------- normalise one record */
  // difficulty object {technical,altitude,...} → a single 1–5 reading
  function gradeFromDifficulty(d) {
    if (!d) return null;
    var keys = ['technical', 'altitude', 'exposure', 'weather', 'remoteness', 'objectiveHazard'];
    var vals = keys.map(function (k) { return d[k]; }).filter(function (v) { return typeof v === 'number'; });
    if (!vals.length) return null;
    return Math.round(vals.reduce(function (a, b) { return a + b; }, 0) / vals.length);
  }
  // a 1–5 grade → the four difficulty bands used in the filter UI
  function gradeBand(n) {
    if (n == null) return null;
    if (n <= 1) return 'Beginner';
    if (n === 2) return 'Moderate';
    if (n === 3) return 'Advanced';
    return 'Expert';
  }

  function fromMountain(m, order) {
    var cat = categoryForElevation(m.elevationM);
    return {
      id: m.slug,
      slug: m.slug,
      name: m.name,
      aka: m.aka || null,
      country: (m.countries && m.countries[0]) || null,
      countryLabel: m.countryLabel || (m.countries || []).join(' / ') || null,
      countries: m.countries || null,
      elevation: m.elevationM != null ? m.elevationM : null,
      elevationDisplay: m.elevationLabel || fmtElev(m.elevationM),
      elevationFt: m.elevationFt || fmtFt(m.elevationM),
      range: m.range || null,
      region: m.region || null,
      category: cat,
      categoryLabel: (CAT_BY_ID[cat] || {}).short || null,
      peakType: m.peakType || 'Expedition Peak',
      peakGrade: m.peakGrade || gradeBand(gradeFromDifficulty(m.difficulty)),
      difficulty: gradeFromDifficulty(m.difficulty),
      difficultyDetail: m.difficulty || null,
      expeditionType: m.expeditionType || 'Guided expedition',
      description: m.summary || null,
      shortDescription: m.tagline || null,
      image: m.heroImage || null,
      heroVideo: m.heroVideo || null,
      gallery: m.gallery || [],
      coordinates: m.coordinates || null,
      firstAscent: m.firstAscent || null,
      firstAscentYear: (m.firstAscent && m.firstAscent.year) || null,
      climbingSeason: m.season ? [m.season.primary, m.season.window].filter(Boolean).join(' · ') : null,
      duration: m.typicalDurationDays || null,
      permitRequired: true,
      status: 'published',
      featured: !!m.bestseller,
      rank: m.rank || null,
      href: '/expeditions/' + m.slug,          // keep the rich existing page
      addedOrder: m.rank || order,
      source: 'mountains',
      relatedPeaks: m.relatedPeaks || [],
      verify: []
    };
  }

  function fromData(p, order) {
    var cat = p.category || categoryForElevation(p.elevation);
    var slug = p.slug || slugify(p.name);
    // a record counts as "published" (full page) once it has route + first-ascent + itinerary
    var rich = !!(p.normalRoute && p.firstAscent && p.itinerary && p.character);
    return {
      id: slug,
      slug: slug,
      name: p.name,
      aka: p.aka || null,
      country: p.country || null,
      countryLabel: p.countryLabel || p.country || null,
      countries: p.countries || (p.country ? [p.country] : null),
      elevation: p.elevation != null ? p.elevation : null,
      elevationDisplay: p.elevationDisplay || p.elevationLabel || fmtElev(p.elevation),
      elevationFt: p.elevationFt ? (Number(p.elevationFt).toLocaleString('en-US') + ' ft') : fmtFt(p.elevation),
      range: p.range || null,
      region: p.region || null,
      category: cat,
      categoryLabel: (CAT_BY_ID[cat] || {}).short || null,
      peakType: p.peakType || 'Expedition Peak',
      peakGrade: p.peakGrade ||
                 gradeBand((p.difficulty && typeof p.difficulty === 'object') ? gradeFromDifficulty(p.difficulty)
                           : (typeof p.difficulty === 'number' ? p.difficulty : null)),
      difficulty: (p.difficulty && typeof p.difficulty === 'object') ? gradeFromDifficulty(p.difficulty)
                  : (p.difficulty != null ? p.difficulty : null),
      difficultyDetail: (p.difficulty && typeof p.difficulty === 'object') ? p.difficulty : (p.difficultyDetail || null),
      expeditionType: p.expeditionType || 'Guided expedition',
      description: p.description || p.summary || null,
      shortDescription: p.shortDescription || p.tagline || p.note || null,
      image: p.image || p.heroImage || null,   // placeholder — sourcing handled separately
      heroVideo: p.heroVideo || null,
      gallery: p.gallery || [],
      coordinates: p.coordinates || null,
      firstAscent: p.firstAscent || null,
      firstAscentYear: p.firstAscentYear || (p.firstAscent && p.firstAscent.year) || null,
      climbingSeason: p.climbingSeason || (p.season ? [p.season.primary, p.season.window].filter(Boolean).join(' · ') : null),
      duration: p.duration || p.typicalDurationDays || null,
      permitRequired: p.permitRequired != null ? p.permitRequired : (p.permit ? true : null),
      status: p.status || (rich ? 'published' : 'draft'),
      featured: !!p.featured,
      rank: null,
      href: p.href || ('/expeditions/peaks/' + slug),
      addedOrder: p.addedOrder != null ? p.addedOrder : order,
      source: 'peaks-data',
      relatedPeaks: p.relatedPeaks || [],
      verify: p.verify || []
    };
  }

  /* --------------------------------------------------------------- rebuild */
  var LIST = [];
  var BY_SLUG = {};

  function rebuild() {
    LIST = [];
    BY_SLUG = {};
    var order = 0;
    var M = window.MOUNTAINS || {};
    Object.keys(M).forEach(function (k) {
      var peak = fromMountain(M[k], ++order);
      LIST.push(peak); BY_SLUG[peak.slug] = peak;
    });
    order = 100;   // new peaks sort as "newest"
    Object.keys(window.PEAKS_DATA).forEach(function (k) {
      var peak = fromData(window.PEAKS_DATA[k], ++order);
      if (BY_SLUG[peak.slug]) return;          // never duplicate
      LIST.push(peak); BY_SLUG[peak.slug] = peak;
    });
    window.ALL_PEAKS = LIST;
  }

  /* --------------------------------------------------------------- sorting */
  var SORTERS = {
    elevation: function (a, b) { return (b.elevation || 0) - (a.elevation || 0); },
    'elevation-asc': function (a, b) { return (a.elevation || 0) - (b.elevation || 0); },
    country: function (a, b) {
      return String(a.countryLabel || '').localeCompare(String(b.countryLabel || '')) ||
             (b.elevation || 0) - (a.elevation || 0);
    },
    region: function (a, b) {
      return String(a.region || 'zzz').localeCompare(String(b.region || 'zzz')) ||
             (b.elevation || 0) - (a.elevation || 0);
    },
    difficulty: function (a, b) { return (b.difficulty || 0) - (a.difficulty || 0); },
    featured: function (a, b) {
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.elevation || 0) - (a.elevation || 0);
    },
    alphabetical: function (a, b) { return String(a.name).localeCompare(String(b.name)); },
    newest: function (a, b) { return (b.addedOrder || 0) - (a.addedOrder || 0); }
  };
  window.PEAK_SORTS = [
    { id: 'elevation', label: 'Elevation — high to low' },
    { id: 'elevation-asc', label: 'Elevation — low to high' },
    { id: 'country', label: 'Country' },
    { id: 'region', label: 'Region / range' },
    { id: 'difficulty', label: 'Difficulty' },
    { id: 'featured', label: 'Featured first' },
    { id: 'alphabetical', label: 'A – Z' },
    { id: 'newest', label: 'Newest additions' }
  ];

  /* ------------------------------------------------------------------ API */
  window.getPeaks = function (opts) {
    opts = opts || {};
    var out = LIST.slice();
    if (opts.category) {
      var cats = [].concat(opts.category);
      out = out.filter(function (p) { return cats.indexOf(p.category) > -1; });
    }
    if (opts.country) out = out.filter(function (p) {
      return (p.countries || [p.country]).indexOf(opts.country) > -1;
    });
    if (opts.region) out = out.filter(function (p) { return p.region === opts.region; });
    if (opts.peakType) out = out.filter(function (p) { return p.peakType === opts.peakType; });
    if (opts.peakGrade) out = out.filter(function (p) { return p.peakGrade === opts.peakGrade; });
    if (opts.featured) out = out.filter(function (p) { return p.featured; });
    if (opts.status) out = out.filter(function (p) { return p.status === opts.status; });
    if (opts.q) {
      var q = String(opts.q).toLowerCase();
      out = out.filter(function (p) {
        return (p.name + ' ' + (p.aka || '') + ' ' + (p.range || '') + ' ' +
                (p.region || '') + ' ' + (p.countryLabel || '')).toLowerCase().indexOf(q) > -1;
      });
    }
    out.sort(SORTERS[opts.sort] || SORTERS.elevation);
    return out;
  };

  window.getPeak = function (slugOrId) {
    if (!slugOrId) return null;
    return BY_SLUG[String(slugOrId).toLowerCase()] || null;
  };

  window.getPeakCategories = function () {
    return window.PEAK_CATEGORIES.slice().sort(function (a, b) { return a.order - b.order; })
      .map(function (c) {
        return Object.assign({}, c, {
          count: LIST.filter(function (p) { return p.category === c.id; }).length,
          published: LIST.filter(function (p) { return p.category === c.id && p.status === 'published'; }).length
        });
      });
  };

  // add one peak object at runtime (or from an admin form)
  window.addPeak = function (obj) {
    if (!obj || !obj.name) return null;
    var slug = obj.slug || slugify(obj.name);
    window.PEAKS_DATA[slug] = Object.assign({ slug: slug }, obj);
    rebuild();
    return BY_SLUG[slug];
  };

  window.peakHelpers = { slugify: slugify, fmtElev: fmtElev, fmtFt: fmtFt };

  rebuild();
})();
