/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — Explore Nepal
   ---------------------------------------------------------------------------
   A three-step map. No WebGL, no tiles, no API key, no free zoom — the three
   things that made the old MapLibre build stutter on phones are all gone.

     Step 1  NEPAL      the nine trekking regions, and nothing else
     Step 2  REGION     one region fills the frame: its trails, peaks,
                        passes, trailheads and places
     Step 3  PLACE      one point, with everything we guide there

   You can only ever move one step at a time, so the map has exactly three
   states to draw and no gesture surface to fight with page scrolling.

   The geometry is unchanged: the same /data/nepal.geo.json the GL build used,
   Mercator-projected once at boot into a fixed SVG user space. After that the
   only thing that ever changes is the <svg viewBox> and, for the handful of
   pins on screen, two style properties — during a 520 ms transition and never
   between them. The map is genuinely idle when you are not touching it.

   The layer bar above the map (Regions · Trails · Peaks · Passes ·
   Expeditions) is both a filter and a way in: pick a layer at step 1 and the
   country shows just that layer; pick one inside a region and it filters what
   that region shows.

     /data/nepal.geo.json   country outline + the seven provinces (ours)
     /data/places.json      towns, trailheads, passes, lakes, parks
     window.MOUNTAINS       the eight-thousanders   → /expeditions/<slug>
     window.PEAKS_DATA      the other peaks         → /expeditions/peaks/<slug>
     window.TREKS           the trails              → /treks/<slug>
     window.exploreGeo      region names + copy (edit.js)
     window.renderGeoRegion region panel writer     (edit.js)

   Icons are Lucide (lucide.dev, ISC), inlined.
   ========================================================================== */
(function () {
  'use strict';
  if (window.__hmeMapInstalled) return;
  window.__hmeMapInstalled = true;

  /* ------------------------------------------------------------- settings */

  var PAD = 0.055;          // breathing room around a fitted rectangle
  var DUR = 520;            // zoom transition, ms
  var TERAI_SHARE = 0.30;   // southern share of the country counted as lowland

  /* The eight mountain regions west to east, as contiguous slices of
     longitude, plus the Terai — which is not a slice but the southern strip
     of all of them. Together they cover Nepal exactly once. Names, copy and
     trek matching live in edit.js (exploreGeo); only the geometry is here. */
  var BANDS = [
    { key: 'west',         lon: [79.90, 82.85] },
    { key: 'dhaulagiri',   lon: [82.85, 83.62] },
    { key: 'annapurna',    lon: [83.62, 84.42] },
    { key: 'manaslu',      lon: [84.42, 85.18] },
    { key: 'langtang',     lon: [85.18, 85.95] },
    { key: 'rolwaling',    lon: [85.95, 86.55] },
    { key: 'everest',      lon: [86.55, 87.42] },
    { key: 'kanchenjunga', lon: [87.42, 88.45] }
  ];
  var TERAI = 'terai';

  /* The layer bar. `kinds` are the point kinds a layer shows, across the
     country at step 1 and inside one region at step 2. Regions has no kinds:
     at step 1 it shows the nine territories, and inside a region it shows the
     headline set below — the things you plan a trip around. Everything else
     in that region is one chip away, and all of it is in the panel. */
  var HEADLINE = ['summit', 'pass', 'trailhead'];
  var LAYERS = [
    { id: 'regions',     label: 'Regions',     icon: 'map' },
    { id: 'trails',      label: 'Trails',      icon: 'route', kinds: ['trailhead'] },
    { id: 'peaks',       label: 'Peaks',       icon: 'peak',  kinds: ['peak'] },
    { id: 'passes',      label: 'Passes',      icon: 'pass',  kinds: ['pass'] },
    { id: 'expeditions', label: 'Expeditions', icon: 'flag',  kinds: ['summit'] }
  ];

  var KIND_LABEL = {
    summit: 'Eight-thousander', peak: 'Peak', pass: 'High pass',
    trailhead: 'Trailhead', culture: 'Town or heritage site', nature: 'Lake or park'
  };

  /* Lucide icons (lucide.dev, ISC) — paths only, drawn by icon() below. */
  var ICONS = {
    map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
    peak: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/><path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19"/>',
    summit: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/><path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19"/>',
    flag: '<path d="M7 22V2l10 5-10 5"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    trailhead: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    pass: '<path d="M2 20l6-9 4 5 3-4 7 8z"/><path d="M12 3v5"/><path d="M9.5 5.5h5"/>',
    culture: '<path d="M3 22h18"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M12 2l8 5H4z"/>',
    nature: '<path d="M2 17c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M2 21c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>',
    back: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>'
  };
  var ARROW = '<svg class="ne-arrow" viewBox="0 0 18 10" fill="none" aria-hidden="true"><path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" stroke-width="1.5"/></svg>';

  /* --------------------------------------------------------------- helpers */

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function icon(name, cls) {
    return '<svg class="' + (cls || 'ne-ico') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[name] || ICONS.peak) + '</svg>';
  }
  function svgEl(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) el.setAttribute(k, attrs[k]);
    return el;
  }
  function getJSON(url) {
    return fetch(url, { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error(url + ' → ' + r.status);
      return r.json();
    });
  }
  function metresOf(v) {
    if (typeof v === 'number') return v;
    var m = String(v || '').replace(/[,\s]/g, '').match(/(\d{3,5})/);
    return m ? Number(m[1]) : 0;
  }
  function reduced() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function isPhone() {
    return !!(window.matchMedia && window.matchMedia('(max-width: 767px)').matches);
  }

  /* Spherical Mercator, then normalised so Nepal fills a 1000-unit-wide box.
     Set up once by fit(); project() is used everywhere after that. */
  var K = 1, X0 = 0, Y0 = 0, W = 1000, H = 560;
  function merX(lon) { return lon; }
  function merY(lat) {
    var r = Math.max(-85, Math.min(85, lat)) * Math.PI / 180;
    return -(180 / Math.PI) * Math.log(Math.tan(Math.PI / 4 + r / 2));
  }
  function px(lon) { return (merX(lon) - X0) * K; }
  function py(lat) { return (merY(lat) - Y0) * K; }

  /* ------------------------------------------------------------- geometry */

  /* The outer ring of the country, as [lon, lat] pairs. */
  function outerRing(geo) {
    var f = null;
    geo.features.forEach(function (x) { if (!f && x.properties && x.properties.layer === 'country') f = x; });
    if (!f) return [];
    var c = f.geometry.coordinates;
    return f.geometry.type === 'MultiPolygon' ? c[0][0] : c[0];
  }

  /* Where the country starts and stops at a given longitude. Used to slice
     the lowlands off the bottom of each region without inventing a border. */
  function spanAt(ring, lon) {
    var lo = Infinity, hi = -Infinity;
    for (var i = 0, n = ring.length - 1; i < n; i++) {
      var a = ring[i], b = ring[i + 1];
      if ((a[0] <= lon && b[0] > lon) || (b[0] <= lon && a[0] > lon)) {
        var t = (lon - a[0]) / (b[0] - a[0]);
        var lat = a[1] + (b[1] - a[1]) * t;
        if (lat < lo) lo = lat;
        if (lat > hi) hi = lat;
      }
    }
    return lo === Infinity ? null : [lo, hi];
  }

  function pathFromRing(ring) {
    var d = '', i;
    for (i = 0; i < ring.length; i++) {
      d += (i ? 'L' : 'M') + px(ring[i][0]).toFixed(1) + ' ' + py(ring[i][1]).toFixed(1);
    }
    return d + 'Z';
  }
  function pathFromPolygon(coords) {
    return coords.map(pathFromRing).join('');
  }
  function pathFromFeature(f) {
    var g = f.geometry;
    if (g.type === 'MultiPolygon') return g.coordinates.map(pathFromPolygon).join('');
    return pathFromPolygon(g.coordinates);
  }

  /* ------------------------------------------------------------------ boot */

  /* Nothing is fetched or drawn until the section is nearly on screen, so a
     visit that never reaches it costs nothing up front. The observer is the
     fast path; the idle callback is the guarantee, for the cases where it
     never fires — a collapsed container, a tab that has not painted, a
     browser without it. Whichever comes first wins, once. */
  var booted = false;
  function boot() {
    var host = document.getElementById('nepal-map');
    if (!host) return;
    var go = function () {
      if (booted) return;
      booted = true;
      start(host);
    };
    if (window.IntersectionObserver) {
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        go();
      }, { rootMargin: '700px 0px' });
      io.observe(host);
    }
    if (window.requestIdleCallback) window.requestIdleCallback(go, { timeout: 4000 });
    else setTimeout(go, 2500);
  }

  function start(host) {
    var frame = host.closest('.ne-frame') || host.parentNode;
    var section = document.getElementById('explore');

    Promise.all([getJSON('/data/nepal.geo.json'), getJSON('/data/places.json')])
      .then(function (res) { build(host, frame, section, res[0], res[1]); })
      .catch(function (err) {
        if (frame) frame.classList.add('is-failed');
        if (section) section.classList.add('map-failed');
        fallbackPanel();
        if (window.console && console.warn) console.warn('[explore] map unavailable:', err && err.message);
      });
  }

  /* If the geometry cannot be fetched the section still works: the panel
     becomes a plain list of the nine regions, every link intact. */
  function fallbackPanel() {
    var p = document.getElementById('explore-panel');
    var geo = window.exploreGeo, order = window.EXPLORE_GEO_ORDER;
    if (!p || !geo || !order) return;
    p.innerHTML = '<div class="ne-panel"><span class="ne-p-lbl">Trekking regions</span>' +
      '<div class="ne-list">' + order.map(function (k) {
        return '<a class="ne-row" href="/treks#' + esc(k) + '"><span>' + esc(geo[k].name) + '</span>' + ARROW + '</a>';
      }).join('') + '</div></div>';
  }

  /* ----------------------------------------------------------------- build */

  function build(host, frame, section, geo, placesDoc) {
    var ring = outerRing(geo);
    if (!ring.length) throw new Error('no country outline');

    /* --- projection: fit Nepal to a 1000-wide user space --------------- */
    var lonMin = Infinity, lonMax = -Infinity, latMin = Infinity, latMax = -Infinity;
    ring.forEach(function (c) {
      if (c[0] < lonMin) lonMin = c[0];
      if (c[0] > lonMax) lonMax = c[0];
      if (c[1] < latMin) latMin = c[1];
      if (c[1] > latMax) latMax = c[1];
    });
    X0 = merX(lonMin); Y0 = merY(latMax);
    K = W / (merX(lonMax) - merX(lonMin));
    H = (merY(latMin) - merY(latMax)) * K;

    /* --- the lowland divide, read off the country itself ---------------- */
    var STEPS = 200, divide = [];
    for (var s = 0; s <= STEPS; s++) {
      var lon = lonMin + (lonMax - lonMin) * (s / STEPS);
      var sp = spanAt(ring, lon + (s === 0 ? 1e-6 : s === STEPS ? -1e-6 : 0));
      divide.push(sp ? [lon, sp[0] + (sp[1] - sp[0]) * TERAI_SHARE] : [lon, latMin]);
    }
    function divideAt(lon) {
      var i = Math.round((lon - lonMin) / (lonMax - lonMin) * STEPS);
      return divide[Math.max(0, Math.min(STEPS, i))][1];
    }
    function sliceOfDivide(a, b) {
      return divide.filter(function (d) { return d[0] >= a - 0.05 && d[0] <= b + 0.05; });
    }

    /* --- one polygon per region ---------------------------------------- */
    var geoCfg = window.exploreGeo || {};
    var order = window.EXPLORE_GEO_ORDER || BANDS.map(function (b) { return b.key; }).concat([TERAI]);

    function zonePath(pts) {
      return pts.map(function (p, i) {
        return (i ? 'L' : 'M') + px(p[0]).toFixed(1) + ' ' + py(p[1]).toFixed(1);
      }).join('') + 'Z';
    }

    var zones = {};
    BANDS.forEach(function (b) {
      var top = latMax + 1, seg = sliceOfDivide(b.lon[0], b.lon[1]);
      var pts = [[b.lon[0], top], [b.lon[1], top]];
      for (var i = seg.length - 1; i >= 0; i--) pts.push(seg[i]);
      zones[b.key] = { key: b.key, pts: pts, lon: b.lon.slice(), lowland: false };
    });
    var seg = divide.slice();
    var terai = [[lonMin - 0.4, latMin - 1]];
    seg.forEach(function (d) { terai.push(d); });
    terai.push([lonMax + 0.4, latMin - 1]);
    zones[TERAI] = { key: TERAI, pts: terai, lon: [lonMin, lonMax], lowland: true };

    /* bounding rectangle + a pin anchor for each region, in user space */
    order.forEach(function (k) {
      var z = zones[k];
      if (!z) return;
      var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      var lo = z.lon[0], hi = z.lon[1], n = 24;
      // the Terai runs the whole width of the country, so its pin goes where
      // the plain is widest and clear of the mountain pins above it
      var midLon = z.lowland ? 82.9 : (lo + hi) / 2;
      for (var i = 0; i <= n; i++) {
        var L = lo + (hi - lo) * (i / n);
        var sp = spanAt(ring, Math.max(lonMin + 1e-6, Math.min(lonMax - 1e-6, L)));
        if (!sp) continue;
        var dv = divideAt(L);
        var a = z.lowland ? sp[0] : dv;
        var b2 = z.lowland ? dv : sp[1];
        x0 = Math.min(x0, px(L)); x1 = Math.max(x1, px(L));
        y0 = Math.min(y0, py(b2)); y1 = Math.max(y1, py(a));
      }
      z.rect = [x0, y0, x1 - x0, y1 - y0];
      var spM = spanAt(ring, Math.max(lonMin + 1e-6, Math.min(lonMax - 1e-6, midLon)));
      var dvM = divideAt(midLon);
      var pinLat = z.lowland
        ? (spM ? spM[0] + (dvM - spM[0]) * 0.42 : dvM)
        : (spM ? dvM + (spM[1] - dvM) * 0.52 : dvM);
      z.pin = [px(midLon), py(pinLat)];
      z.d = zonePath(z.pts);
      z.name = (geoCfg[k] && geoCfg[k].name) || k;
      z.short = z.name.split(' & ')[0].replace(' & Lowlands', '');
      z.trails = typeof window.geoTreksFor === 'function' ? window.geoTreksFor(k).length : 0;
    });

    var FULL = [0, 0, W, H];

    /* --------------------------------------------------------- the points */
    var points = [];

    function regionOf(lon, lat) {
      if (lat < divideAt(lon)) return TERAI;
      for (var i = 0; i < BANDS.length; i++) {
        if (lon >= BANDS[i].lon[0] && lon < BANDS[i].lon[1]) return BANDS[i].key;
      }
      return lon < BANDS[0].lon[0] ? BANDS[0].key : BANDS[BANDS.length - 1].key;
    }

    /* Which trails pass through a place. Trailheads say so in places.json;
       for everything else we read it off the trek records themselves — the
       passes they cross and the points they walk through — so a pin never
       offers a link we do not actually have. */
    var TREKS = window.TREKS || {};
    var byName = {};
    function norm(n) { return String(n || '').toLowerCase().replace(/[^a-z0-9]+/g, ''); }
    function trekLinks(names) {
      var seen = {}, out = [];
      names.forEach(function (n) {
        (byName[norm(n)] || []).forEach(function (t) {
          if (seen[t.slug]) return;
          seen[t.slug] = 1;
          out.push(t);
        });
      });
      return out.slice(0, 6);
    }
    Object.keys(TREKS).forEach(function (slug) {
      var t = TREKS[slug];
      if (!t || !t.name) return;
      var add = function (n) {
        var k = norm(n);
        if (!k) return;
        (byName[k] = byName[k] || []).push({ slug: slug, name: t.name });
      };
      (t.passes || []).forEach(function (p) { add(p && p.name); });
      (t.routePoints || []).forEach(function (p) { add(p && p.name); });
      if (t.stats) add(t.stats.maxAltitudePoint);
    });

    [[window.MOUNTAINS, 'summit'], [window.PEAKS_DATA, 'peak']].forEach(function (pair) {
      var db = pair[0], kind = pair[1];
      if (!db) return;
      Object.keys(db).forEach(function (slug) {
        var m = db[slug], c = m && m.coordinates;
        if (!c || typeof c.lat !== 'number' || typeof c.lon !== 'number') return;
        if (m.inNepal === false) return;
        if (c.lon < lonMin - 0.2 || c.lon > lonMax + 0.2) return;
        points.push({
          id: kind + '-' + slug, kind: kind, name: m.name,
          lon: c.lon, lat: c.lat, approx: !!c.approx,
          elevation: m.elevationLabel || (m.elevationM ? Number(m.elevationM).toLocaleString('en-GB') + ' m' : ''),
          metres: metresOf(m.elevationM || m.elevationLabel),
          major: kind === 'summit',
          note: m.tagline || '',
          grade: m.peakGrade || m.peakType || '',
          treks: (m.relatedTreks || []).map(function (ts) {
            return TREKS[ts] ? { slug: ts, name: TREKS[ts].name } : null;
          }).filter(Boolean).slice(0, 6),
          href: '/expeditions/' + (kind === 'summit' ? '' : 'peaks/') + slug,
          hrefLabel: kind === 'summit' ? 'Open the expedition' : 'Open the peak'
        });
      });
    });

    (placesDoc.places || []).forEach(function (p) {
      if (typeof p.lat !== 'number' || typeof p.lon !== 'number') return;
      var treks = (p.treks || []).map(function (slug) {
        var t = TREKS[slug];
        return t ? { slug: slug, name: t.name } : null;
      }).filter(Boolean);
      if (!treks.length) treks = trekLinks([p.name]);
      points.push({
        id: 'place-' + p.id, kind: p.kind, name: p.name, lon: p.lon, lat: p.lat,
        elevation: p.elevation || '', metres: metresOf(p.elevation),
        major: !!p.major, note: p.note || '', treks: treks
      });
    });

    points.forEach(function (pt) {
      pt.region = regionOf(pt.lon, pt.lat);
      pt.regionName = (zones[pt.region] && zones[pt.region].name) || '';
      pt.x = px(pt.lon); pt.y = py(pt.lat);
    });
    points.sort(function (a, b) { return (b.metres || 0) - (a.metres || 0); });

    /* A region's slice runs all the way down to the lowland divide, but what
       we guide there is usually packed along the range. Step 2 frames the
       points, not the slice, so the interesting half of a region is not spent
       on empty foothills. Regions with nothing in them keep the slice. */
    order.forEach(function (k) {
      var z = zones[k];
      if (!z) return;
      var mine = points.filter(function (p) { return p.region === k; });
      // the Khumbu and the Annapurnas are crowded enough to need the headline
      // filter; the quieter regions would look empty under it, so they show
      // everything they have
      z.head = mine.filter(function (p) { return HEADLINE.indexOf(p.kind) >= 0 || p.major; }).length;
      z.showAll = z.head < 6;
      if (!mine.length) { z.focus = z.rect; return; }
      var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      mine.forEach(function (p) {
        x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x);
        y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y);
      });
      var w = Math.max(x1 - x0, z.rect[2] * 0.45, W * 0.07);
      var h = Math.max(y1 - y0, z.rect[3] * 0.40, H * 0.11);
      z.focus = [(x0 + x1) / 2 - w / 2, (y0 + y1) / 2 - h / 2, w, h];
    });

    var counts = {
      regions: order.length,
      trails: Object.keys(window.TREKS || {}).length,
      peaks: points.filter(function (p) { return p.kind === 'peak'; }).length,
      passes: points.filter(function (p) { return p.kind === 'pass'; }).length,
      expeditions: points.filter(function (p) { return p.kind === 'summit'; }).length
    };

    /* ------------------------------------------------------------ the DOM */
    host.innerHTML = '';

    var svg = svgEl('svg', {
      'class': 'ne-svg', viewBox: FULL.join(' '), preserveAspectRatio: 'none',
      xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': 'true', focusable: 'false'
    });

    var countryD = pathFromRing(ring);
    var defs = svgEl('defs', {});
    var clip = svgEl('clipPath', { id: 'ne-clip', clipPathUnits: 'userSpaceOnUse' });
    clip.appendChild(svgEl('path', { d: countryD }));
    defs.appendChild(clip);
    var grad = svgEl('linearGradient', { id: 'ne-land', x1: '0', y1: '0', x2: '0', y2: '1' });
    grad.appendChild(svgEl('stop', { offset: '0', 'stop-color': 'var(--ne-land-top)' }));
    grad.appendChild(svgEl('stop', { offset: '1', 'stop-color': 'var(--ne-land-bottom)' }));
    defs.appendChild(grad);
    svg.appendChild(defs);

    /* graticule — a survey grid behind everything, 1° apart */
    var grat = svgEl('g', { 'class': 'ne-grat' });
    for (var gl = Math.ceil(lonMin); gl <= lonMax; gl++) {
      grat.appendChild(svgEl('line', { x1: px(gl), y1: -20, x2: px(gl), y2: H + 20 }));
    }
    for (var ga = Math.ceil(latMin); ga <= latMax; ga++) {
      grat.appendChild(svgEl('line', { x1: -20, y1: py(ga), x2: W + 20, y2: py(ga) }));
    }
    svg.appendChild(grat);

    svg.appendChild(svgEl('path', { 'class': 'ne-landmass', d: countryD }));

    var provG = svgEl('g', { 'class': 'ne-provs' });
    geo.features.forEach(function (f) {
      if (!f.properties || f.properties.layer !== 'province') return;
      provG.appendChild(svgEl('path', { 'class': 'ne-prov', 'data-prov': f.properties.key || '', d: pathFromFeature(f) }));
    });
    svg.appendChild(provG);

    var zoneG = svgEl('g', { 'class': 'ne-zones', 'clip-path': 'url(#ne-clip)' });
    order.forEach(function (k) {
      if (!zones[k]) return;
      zones[k].el = svgEl('path', { 'class': 'ne-zone' + (zones[k].lowland ? ' is-lowland' : ''), 'data-r': k, d: zones[k].d });
      zoneG.appendChild(zones[k].el);
    });
    svg.appendChild(zoneG);

    svg.appendChild(svgEl('path', { 'class': 'ne-glow', d: countryD }));
    svg.appendChild(svgEl('path', { 'class': 'ne-outline', d: countryD }));

    var hitG = svgEl('g', { 'class': 'ne-hits', 'clip-path': 'url(#ne-clip)' });
    order.forEach(function (k) {
      if (!zones[k]) return;
      zones[k].hit = svgEl('path', { 'class': 'ne-hit', 'data-r': k, d: zones[k].d });
      hitG.appendChild(zones[k].hit);
    });
    svg.appendChild(hitG);

    host.appendChild(svg);

    var pinWrap = document.createElement('div');
    pinWrap.className = 'ne-pins';
    host.appendChild(pinWrap);

    /* region pins. Eight mountain regions sit shoulder to shoulder along the
       range, so their names are dealt into four lanes — above/below the pin,
       near/far from it — and neighbours never land in the same one. */
    var LANES = ['is-above', '', 'is-above is-far', 'is-far'];
    order.forEach(function (k, i) {
      var z = zones[k];
      if (!z) return;
      var el = document.createElement('button');
      el.type = 'button';
      el.className = 'ne-pin is-region ' + (z.lowland ? 'is-far' : LANES[i % 4]);
      el.dataset.r = k;
      el.setAttribute('aria-label', z.name + (z.trails ? ', ' + z.trails + ' trails' : ''));
      el.innerHTML = '<span class="ne-dot">' + icon(z.lowland ? 'nature' : 'peak', 'ne-dot-ico') + '</span>' +
        '<span class="ne-tag"><b>' + esc(z.short) + '</b>' +
        (z.trails ? '<i>' + z.trails + ' ' + (z.trails === 1 ? 'trail' : 'trails') + '</i>' : '') + '</span>';
      el.addEventListener('click', function (e) { e.preventDefault(); goRegion(k); });
      el.addEventListener('mouseenter', function () { hot(k); });
      el.addEventListener('mouseleave', function () { hot(null); });
      el.addEventListener('focus', function () { hot(k); });
      el.addEventListener('blur', function () { hot(null); });
      z.pinEl = el;
      pinWrap.appendChild(el);
    });

    /* point pins */
    points.forEach(function (pt) {
      var el = document.createElement('button');
      el.type = 'button';
      el.className = 'ne-pin is-point is-' + pt.kind + (pt.major ? ' is-major' : '');
      el.dataset.p = pt.id;
      el.setAttribute('aria-label', pt.name + (pt.elevation ? ', ' + pt.elevation : ''));
      el.innerHTML = '<span class="ne-dot">' + icon(pt.kind, 'ne-dot-ico') + '</span>' +
        '<span class="ne-tag"><b>' + esc(pt.name) + '</b>' +
        (pt.elevation ? '<i>' + esc(pt.elevation) + '</i>' : '') + '</span>';
      el.addEventListener('click', function (e) { e.preventDefault(); goPoint(pt); });
      pt.el = el;
      pinWrap.appendChild(el);
    });

    /* zone clicks on the map itself */
    hitG.addEventListener('click', function (e) {
      var n = e.target.closest ? e.target.closest('.ne-hit') : null;
      if (n) goRegion(n.dataset.r);
    });
    hitG.addEventListener('mouseover', function (e) {
      var n = e.target.closest ? e.target.closest('.ne-hit') : null;
      if (n) hot(n.dataset.r);
    });
    hitG.addEventListener('mouseout', function () { hot(null); });

    /* ------------------------------------------------------------ the bar */
    var bar = document.getElementById('ne-chips');
    if (bar) {
      bar.innerHTML = LAYERS.map(function (L) {
        return '<button type="button" role="tab" class="ne-chip" data-layer="' + L.id + '" ' +
          'aria-selected="' + (L.id === 'regions') + '">' + icon(L.icon, 'ne-chip-ico') +
          '<span>' + esc(L.label) + '</span><b>' + (counts[L.id] || 0) + '</b></button>';
      }).join('');
      bar.addEventListener('click', function (e) {
        var b = e.target.closest ? e.target.closest('[data-layer]') : null;
        if (b) setLayer(b.dataset.layer);
      });
      bar.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        var i = LAYERS.map(function (L) { return L.id; }).indexOf(state.layer);
        i = (i + (e.key === 'ArrowRight' ? 1 : LAYERS.length - 1)) % LAYERS.length;
        setLayer(LAYERS[i].id);
        var next = bar.querySelector('[data-layer="' + LAYERS[i].id + '"]');
        if (next) next.focus();
      });
    }

    /* ---------------------------------------------------------- the state */
    var state = { level: 0, region: null, point: null, layer: 'regions' };
    var view = FULL.slice();        // the rectangle currently on screen
    var raf = null, anim = null, snap = null;

    var backBtn = document.getElementById('map-reset');
    if (backBtn) backBtn.addEventListener('click', function () { up(); });

    /* --- fitting -------------------------------------------------------- */
    function aspect() {
      var r = host.getBoundingClientRect();
      return r.width && r.height ? r.width / r.height : W / H;
    }
    function fit(rect, padShare) {
      var a = aspect();
      var p = padShare == null ? PAD : padShare;
      var x = rect[0], y = rect[1], w = rect[2], h = rect[3];
      x -= w * p; y -= h * p; w *= 1 + 2 * p; h *= 1 + 2 * p;
      if (w / h < a) { var nw = h * a; x -= (nw - w) / 2; w = nw; }
      else { var nh = w / a; y -= (nh - h) / 2; h = nh; }
      return [x, y, w, h];
    }
    function targetRect() {
      if (state.level === 2 && state.point) {
        var z = zones[state.point.region] || {};
        var base = z.focus || z.rect || FULL;
        var w = Math.max(base[2] * 0.58, W * 0.075);
        var h = Math.max(base[3] * 0.58, H * 0.13);
        return fit([state.point.x - w / 2, state.point.y - h / 2, w, h], 0.03);
      }
      if (state.level === 1 && state.region && zones[state.region]) {
        var z = zones[state.region];
        return fit(z.focus || z.rect, isPhone() ? 0.14 : 0.10);
      }
      return fit(FULL, isPhone() ? 0.02 : 0.035);
    }

    /* --- painting ------------------------------------------------------- */
    function applyView() {
      svg.setAttribute('viewBox', view.map(function (v) { return v.toFixed(1); }).join(' '));
      place();
    }
    function place(rect) {
      var r = rect || view;
      var vx = r[0], vy = r[1], vw = r[2], vh = r[3];
      for (var i = 0; i < live.length; i++) {
        var it = live[i];
        it.el.style.left = ((it.x - vx) / vw * 100).toFixed(3) + '%';
        it.el.style.top = ((it.y - vy) / vh * 100).toFixed(3) + '%';
      }
    }
    var live = [];   // only the pins currently on screen are ever positioned

    function ease(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }

    function glide() {
      var to = targetRect();
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      clearTimeout(snap);
      thin(to);
      var land = function () {
        view = to.slice();
        applyView();
      };
      if (reduced() || document.hidden) return land();
      var from = view.slice(), t0 = 0;
      anim = function (now) {
        if (!t0) t0 = now;
        var k = ease(Math.min(1, (now - t0) / DUR));
        for (var i = 0; i < 4; i++) view[i] = from[i] + (to[i] - from[i]) * k;
        applyView();
        if (k < 1) raf = requestAnimationFrame(anim); else raf = null;
      };
      raf = requestAnimationFrame(anim);
      // Animation frames stop in a tab that is not painting — a background
      // tab, a minimised window, some power-saving modes. Without this the map
      // would sit frozen at the frame the zoom started on. Whatever happens,
      // it ends up where it was going.
      snap = setTimeout(function () {
        if (!raf) return;
        cancelAnimationFrame(raf);
        raf = null;
        land();
      }, DUR + 160);
    }

    /* which pins belong on screen right now */
    function sync() {
      var L = LAYERS.filter(function (x) { return x.id === state.layer; })[0] || LAYERS[0];
      var showRegions = state.level === 0 && state.layer === 'regions';
      var next = [];

      order.forEach(function (k) {
        var z = zones[k];
        if (!z || !z.pinEl) return;
        var on = showRegions;
        z.pinEl.style.display = on ? '' : 'none';
        z.pinEl.tabIndex = on ? 0 : -1;
        if (on) next.push({ el: z.pinEl, x: z.pin[0], y: z.pin[1], n: z.short.length });
        if (z.el) z.el.classList.toggle('is-muted', state.level > 0 && state.region !== k);
      });

      points.forEach(function (pt) {
        var on;
        if (state.level === 0) {
          on = !!(L.kinds && L.kinds.indexOf(pt.kind) >= 0);
        } else if (pt.region !== state.region) {
          on = false;
        } else if (state.layer === 'regions') {
          on = zones[state.region].showAll || HEADLINE.indexOf(pt.kind) >= 0 || pt.major;
        } else {
          on = !!(L.kinds && L.kinds.indexOf(pt.kind) >= 0);
        }
        pt.el.style.display = on ? '' : 'none';
        pt.el.tabIndex = on ? 0 : -1;
        pt.el.classList.toggle('is-open', state.level === 2 && state.point === pt);
        if (on) next.push({ el: pt.el, x: pt.x, y: pt.y, n: pt.name.length, pt: pt });
      });

      live = next;
      place();

      if (section) {
        section.dataset.level = String(state.level);
        section.dataset.layer = state.layer;
      }
      var now = document.getElementById('ne-now');
      if (now) {
        if (state.level === 2 && state.point) now.textContent = state.point.name + ' · ' + state.point.regionName;
        else if (state.level === 1 && state.region) now.textContent = zones[state.region].name;
        else if (state.layer !== 'regions') now.textContent = (L.label || '') + ' across Nepal';
        else now.innerHTML = 'Nepal <span class="ne-sep">&rarr;</span> region <span class="ne-sep">&rarr;</span> place';
      }
      if (backBtn) {
        backBtn.hidden = state.level === 0;
        var dest = state.level === 2 && state.point
          ? (state.point.regionName || 'Region')
          : 'All of Nepal';
        var lbl = backBtn.querySelector('[data-map-back-label]');
        if (lbl) lbl.textContent = dest;
        backBtn.setAttribute('aria-label', 'Back to ' + dest);
        backBtn.title = 'Back to ' + dest;
      }
    }

    /* Decide which names fit. Runs once per state change, never on a frame.
       Rules, in order: the nine region names are laned and always show; then
       the biggest things claim their space; anything left over keeps its pin
       and shows its name on hover, tap or focus. A label may flip to the other
       side of its pin to find room before it gives up. */
    var PRIORITY = { region: 6, summit: 5, pass: 4, trailhead: 3, culture: 2, nature: 2, peak: 1 };

    function thin(rect) {
      var v = rect || view;
      var r = host.getBoundingClientRect();
      var wpx = r.width || 700, hpx = r.height || 420;
      var boxes = [], queue = [];

      // the back button sits over the map, so no name may land under it
      if (backBtn && !backBtn.hidden) {
        var bb = backBtn.getBoundingClientRect();
        boxes.push({ x1: bb.left - r.left - 6, y1: bb.top - r.top - 6, x2: bb.right - r.left + 6, y2: bb.bottom - r.top + 6 });
      }

      live.forEach(function (it) {
        it.el.classList.remove('is-quiet');
        var x = (it.x - v[0]) / v[2] * wpx;
        var y = (it.y - v[1]) / v[3] * hpx;
        var dot = it.el.firstChild, tag = it.el.lastChild;
        var dh = (dot && dot.offsetHeight) || 26, dw = (dot && dot.offsetWidth) || 26;
        var laned = it.el.classList.contains('is-region') && !isPhone();
        var kind = laned ? 'region' : (it.pt && it.pt.kind) || 'peak';
        // when the map is not busy every pin keeps its circle clear; in a
        // crowd only the big ones do, or nothing would be named at all
        if (laned || kind === 'summit' || live.length <= 12) {
          boxes.push({ x1: x - dw / 2, y1: y - dh / 2, x2: x + dw / 2, y2: y + dh / 2 });
        }
        if (!tag || !tag.offsetWidth) return;
        var far = it.el.classList.contains('is-far') ? 20 : 0;
        var gap = dh / 2 + 4 + far;
        var tw = tag.offsetWidth, th = tag.offsetHeight;
        var side = function (where) {
          if (where === 'right') return { x1: x + gap, x2: x + gap + tw, y1: y - th / 2, y2: y + th / 2 };
          if (where === 'left') return { x1: x - gap - tw, x2: x - gap, y1: y - th / 2, y2: y + th / 2 };
          if (where === 'above') return { x1: x - tw / 2, x2: x + tw / 2, y1: y - gap - th, y2: y - gap };
          return { x1: x - tw / 2, x2: x + tw / 2, y1: y + gap, y2: y + gap + th };
        };
        var own = it.el.classList.contains('is-above') ? 'above' : 'below';
        queue.push({
          it: it, laned: laned, rank: PRIORITY[kind] || 1,
          own: own,
          tries: laned ? [own] : [own, own === 'above' ? 'below' : 'above', 'right', 'left'],
          side: side
        });
      });

      queue.sort(function (p, q) { return q.rank - p.rank; });

      var fits = function (bx) {
        if (bx.y1 < 2 || bx.y2 > hpx - 2 || bx.x1 < 2 || bx.x2 > wpx - 2) return false;
        for (var i = 0; i < boxes.length; i++) {
          var o = boxes[i];
          if (bx.x1 < o.x2 && bx.x2 > o.x1 && bx.y1 < o.y2 && bx.y2 > o.y1) return false;
        }
        return true;
      };

      queue.forEach(function (q) {
        var where = null, box = null;
        for (var i = 0; i < q.tries.length && !where; i++) {
          var b = q.side(q.tries[i]);
          if (fits(b)) { where = q.tries[i]; box = b; }
        }
        var el = q.it.el;
        el.classList.remove('is-left', 'is-right');
        el.classList.toggle('is-above', (where || q.own) === 'above');
        if (where === 'left' || where === 'right') el.classList.add('is-' + where);
        if (q.laned) {                       // a region name never disappears
          boxes.push(box || q.side(q.own));
          return;
        }
        el.classList.toggle('is-quiet', !where);
        if (box) boxes.push(box);
      });
    }

    function hot(key) {
      var now = document.getElementById('ne-now');
      if (now && state.level === 0 && state.layer === 'regions') {
        if (key && zones[key]) now.textContent = zones[key].name + (zones[key].trails ? ' · ' + zones[key].trails + ' trails' : '');
        else now.innerHTML = 'Nepal <span class="ne-sep">&rarr;</span> region <span class="ne-sep">&rarr;</span> place';
      }
      order.forEach(function (k) {
        var z = zones[k];
        if (!z) return;
        var on = k === key && state.level === 0 && state.layer === 'regions';
        if (z.el) z.el.classList.toggle('is-hot', on);
        if (z.pinEl) z.pinEl.classList.toggle('is-hot', on);
      });
    }

    /* ------------------------------------------------------- transitions */
    function goRegion(key) {
      if (!zones[key]) return;
      if (state.level === 1 && state.region === key) return;
      state.level = 1; state.region = key; state.point = null;
      hot(null);
      sync(); glide(); panel(); nudge();
    }
    function goPoint(pt) {
      state.level = 2; state.point = pt; state.region = pt.region;
      hot(null);
      sync(); glide(); panel(); nudge();
    }
    function up() {
      if (state.level === 2) { state.level = 1; state.point = null; }
      else if (state.level === 1) { state.level = 0; state.region = null; }
      else return;
      sync(); glide(); panel();
    }
    function home() {
      state.level = 0; state.region = null; state.point = null;
      sync(); glide(); panel();
    }
    function setLayer(id) {
      if (!LAYERS.some(function (L) { return L.id === id; })) return;
      state.layer = id;
      if (state.level === 2) { state.level = 1; state.point = null; }
      if (bar) {
        Array.prototype.forEach.call(bar.querySelectorAll('[data-layer]'), function (b) {
          b.setAttribute('aria-selected', b.dataset.layer === id ? 'true' : 'false');
        });
      }
      sync(); glide(); panel();
    }

    /* On a phone the panel is below the map, so move to it after a pick. */
    function nudge() {
      if (!isPhone()) return;
      var p = document.getElementById('explore-panel');
      if (p) p.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'nearest' });
    }

    /* ------------------------------------------------------------ panels */
    function panel() {
      var p = document.getElementById('explore-panel');
      if (!p) return;
      if (state.level === 2 && state.point) p.innerHTML = pointHtml(state.point);
      else if (state.level === 1 && state.region) {
        if (typeof window.renderGeoRegion === 'function') {
          window.renderGeoRegion(state.region);
          p.insertAdjacentHTML('afterbegin', backRow('All of Nepal', 'home'));
        } else {
          p.innerHTML = '<div class="ne-panel"><h3 class="ne-p-name">' + esc(zones[state.region].name) + '</h3></div>';
        }
      } else if (state.layer !== 'regions') p.innerHTML = layerHtml(state.layer);
      else p.innerHTML = introHtml();
      p.scrollTop = 0;
    }

    function backRow(label, act) {
      return '<button type="button" class="ne-back-row" data-ne="' + act + '">' +
        icon('back', 'ne-ico') + '<span>' + esc(label) + '</span></button>';
    }

    function introHtml() {
      return '<div class="ne-panel">' +
        '<span class="ne-p-lbl">Pick a region</span>' +
        '<p class="ne-p-note">Nine regions, each with its own trails, seasons and peaks. Tap one on the map — or pick it from the list — and the map moves to it.</p>' +
        '<div class="ne-list is-regions">' + order.map(function (k) {
          var z = zones[k];
          return '<button type="button" class="ne-row" data-ne="region" data-key="' + esc(k) + '">' +
            '<span>' + esc(z.name) + '</span>' + (z.trails ? '<b>' + z.trails + '</b>' : '') + '</button>';
        }).join('') + '</div>' +
        '<p class="ne-p-fine">Counts are the trails we guide in each region. Boundaries: Survey Department of Nepal / OCHA, simplified for display. Positions are good to a few hundred metres — this is a map to plan with, not to navigate by.</p>' +
        '</div>';
    }

    function layerHtml(id) {
      var L = LAYERS.filter(function (x) { return x.id === id; })[0];
      if (!L || !L.kinds) return introHtml();
      var list = points.filter(function (p) { return L.kinds.indexOf(p.kind) >= 0; });
      var byRegion = {};
      list.forEach(function (p) { (byRegion[p.region] = byRegion[p.region] || []).push(p); });
      var blurbs = {
        trails: 'Every trek we guide starts at one of these. Pick a trailhead to see the routes that leave from it.',
        peaks: 'Trekking and expedition peaks between 6,000 m and 7,300 m — the step between a high pass and an eight-thousander.',
        passes: 'The high crossings our routes are built around. Each one is a day you train for.',
        expeditions: 'The eight-thousanders inside Nepal. Eight of the fourteen are here.'
      };
      var body = order.map(function (k) {
        var items = byRegion[k];
        if (!items || !items.length) return '';
        return '<span class="ne-p-sub">' + esc(zones[k].name) + '</span><div class="ne-list">' +
          items.map(function (p) {
            return '<button type="button" class="ne-row" data-ne="point" data-key="' + esc(p.id) + '">' +
              '<span>' + esc(p.name) + '</span>' + (p.elevation ? '<b>' + esc(p.elevation) + '</b>' : '') + '</button>';
          }).join('') + '</div>';
      }).join('');
      return '<div class="ne-panel">' +
        '<span class="ne-p-kind">' + icon(L.icon) + esc(L.label) + '</span>' +
        '<p class="ne-p-note">' + esc(blurbs[id] || '') + '</p>' + body +
        '<button type="button" class="ne-back-row is-end" data-ne="regions">' + icon('back', 'ne-ico') +
        '<span>Back to the regions</span></button></div>';
    }

    function pointHtml(pt) {
      var treks = (pt.treks || []).map(function (t) {
        return '<a class="ne-row" href="/treks/' + encodeURIComponent(t.slug) + '"><span>' + esc(t.name) + '</span>' + ARROW + '</a>';
      }).join('');
      var here = points.filter(function (o) { return o.region === pt.region && o !== pt; }).slice(0, 5);
      return '<div class="ne-panel">' +
        backRow(pt.regionName || 'Region', 'region-back') +
        '<span class="ne-p-kind">' + icon(pt.kind) + esc(KIND_LABEL[pt.kind] || '') + '</span>' +
        '<h3 class="ne-p-name">' + esc(pt.name) + '</h3>' +
        (pt.elevation ? '<p class="ne-p-el">' + esc(pt.elevation) + (pt.approx ? ' · position approximate' : '') + '</p>' : '') +
        (pt.grade ? '<p class="ne-p-el is-soft">' + esc(pt.grade) + '</p>' : '') +
        (pt.note ? '<p class="ne-p-note">' + esc(pt.note) + '</p>' : '') +
        (treks ? '<span class="ne-p-lbl">Trails from here</span><div class="ne-list">' + treks + '</div>' : '') +
        (pt.href ? '<a class="ne-cta" href="' + esc(pt.href) + '">' + esc(pt.hrefLabel || 'Open') + ARROW + '</a>' : '') +
        (here.length ? '<span class="ne-p-lbl">Nearby in ' + esc(pt.regionName) + '</span><div class="ne-list">' +
          here.map(function (o) {
            return '<button type="button" class="ne-row" data-ne="point" data-key="' + esc(o.id) + '">' +
              '<span>' + esc(o.name) + '</span>' + (o.elevation ? '<b>' + esc(o.elevation) + '</b>' : '') + '</button>';
          }).join('') + '</div>' : '') +
        '</div>';
    }

    /* panel → map */
    var panelEl = document.getElementById('explore-panel');
    if (panelEl) {
      panelEl.addEventListener('click', function (e) {
        var b = e.target.closest ? e.target.closest('[data-ne]') : null;
        if (!b) return;
        var act = b.dataset.ne;
        if (act === 'region') { e.preventDefault(); goRegion(b.dataset.key); }
        else if (act === 'point') {
          e.preventDefault();
          var hit = null;
          points.forEach(function (p) { if (p.id === b.dataset.key) hit = p; });
          if (hit) goPoint(hit);
        } else if (act === 'home' || act === 'regions') {
          e.preventDefault();
          if (act === 'regions') setLayer('regions'); else home();
        } else if (act === 'region-back') { e.preventDefault(); up(); }
      });
    }

    /* edit.js's region chips and the old public hooks keep working */
    window.clickGeo = function (key) { if (state.level > 0 && state.region === key) home(); else goRegion(key); };
    window.geoZoomOut = home;
    window.HMAExploreMap = {
      go: goRegion, home: home, level: function () { return state.level; },
      setLayer: setLayer, state: state
    };

    /* Esc steps back out */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || state.level === 0) return;
      if (!host.closest('#explore')) return;
      up();
    });

    /* --------------------------------------------------------- lifecycle */
    var lastW = 0, lastH = 0, reflow = null;
    function refit() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      clearTimeout(snap);
      view = targetRect();
      applyView();
      thin();
    }
    if (window.ResizeObserver) {
      new ResizeObserver(function (entries) {
        var r = entries[0].contentRect;
        if (Math.abs(r.width - lastW) < 6 && Math.abs(r.height - lastH) < 6) return;
        lastW = r.width; lastH = r.height;
        clearTimeout(reflow);
        reflow = setTimeout(refit, 80);
      }).observe(host);
    } else {
      window.addEventListener('resize', function () {
        clearTimeout(reflow);
        reflow = setTimeout(refit, 150);
      });
    }

    /* go */
    frame.classList.add('is-ready');
    if (section) section.classList.add('map-ready');
    view = targetRect();
    applyView();
    sync();
    thin();
    panel();
    host.dispatchEvent(new CustomEvent('ne:ready', { bubbles: true }));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
