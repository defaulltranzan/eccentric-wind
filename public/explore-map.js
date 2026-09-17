/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — Explore Nepal (MapLibre GL)
   ---------------------------------------------------------------------------
   Region first, detail second. The opening view shows the nine trekking
   regions and nothing else. Tap one and the map flies to it, that region's
   trailheads, peaks and passes appear, and the panel fills with the trails we
   guide there (links to /treks/<slug>), the peaks above it (links to
   /expeditions/<slug>) and where each route starts — the panel is written by
   edit.js's renderGeoRegion(), the same one the old drawn map used.

   Nothing here is a third-party map service: the country is drawn from our own
   GeoJSON, so there is no API key, no tile bill and nothing to rate-limit.

     /vendor/maplibre-gl.js  MapLibre GL JS 4.7.1 (BSD-3), self-hosted
     /data/nepal.geo.json    country outline, provinces, world mask
     /data/places.json       towns, trailheads, passes, lakes, parks
     window.MOUNTAINS / PEAKS_DATA / TREKS   the content database

   Revert: delete the <script src="/explore-map.js"> tag — the drawn SVG map is
   still in the page and takes over (it is also the automatic fallback).
   ========================================================================== */
(function () {
  'use strict';
  if (window.__hmeGlInstalled) return;
  window.__hmeGlInstalled = true;

  var GL_JS = '/vendor/maplibre-gl.js';
  var GL_CSS = '/vendor/maplibre-gl.css';
  var BOUNDS = [[79.95, 26.2], [88.35, 30.55]];
  var ACCENT = '#f06225';

  /* The nine regions, in the same order and with the same names as the rest of
     the site (exploreGeo in edit.js). `box` is the area each one covers. */
  var REGIONS = [
    { key: 'west',         at: [81.60, 29.35], box: [[80.00, 28.15], [83.30, 30.50]] },
    { key: 'dhaulagiri',   at: [83.30, 28.72], box: [[82.85, 28.35], [83.75, 29.05]] },
    { key: 'annapurna',    at: [83.92, 28.78], box: [[83.45, 28.15], [84.45, 29.40]] },
    { key: 'manaslu',      at: [84.80, 28.53], box: [[84.45, 28.10], [85.20, 28.95]] },
    { key: 'langtang',     at: [85.55, 28.18], box: [[85.20, 27.75], [85.95, 28.45]] },
    { key: 'rolwaling',    at: [86.25, 27.95], box: [[85.95, 27.65], [86.50, 28.20]] },
    { key: 'everest',      at: [86.95, 27.92], box: [[86.50, 27.45], [87.45, 28.20]] },
    { key: 'kanchenjunga', at: [87.85, 27.60], box: [[87.45, 27.15], [88.25, 27.95]] },
    { key: 'terai',        at: [84.10, 27.00], box: [[80.05, 26.30], [88.20, 27.45]] }
  ];

  var KINDS = {
    peak: 'Peak', trailhead: 'Trailhead', pass: 'Pass',
    culture: 'Place', nature: 'Lake or park'
  };

  /* Lucide icons (lucide.dev, ISC) */
  var ICONS = {
    peak: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/><path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19"/>',
    trailhead: '<path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/>',
    pass: '<path d="M2 20l6-9 4 5 3-4 7 8z"/><path d="M12 4v4"/><path d="M10 6h4"/>',
    culture: '<path d="M3 22h18"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M12 2l8 5H4z"/>',
    nature: '<path d="M2 17c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M2 21c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>'
  };
  var ARROW = '<svg viewBox="0 0 18 10" fill="none" aria-hidden="true"><path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" stroke-width="1.5"/></svg>';

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function icon(kind, cls) {
    return '<svg class="' + (cls || 'hgl-ico') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[kind] || ICONS.peak) + '</svg>';
  }
  function load(tag, attrs) {
    return new Promise(function (res, rej) {
      var el = document.createElement(tag);
      Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
      el.onload = res; el.onerror = rej;
      document.head.appendChild(el);
    });
  }
  function getJSON(url) { return fetch(url, { credentials: 'same-origin' }).then(function (r) { return r.json(); }); }
  function inBox(box, lon, lat) {
    return lon >= box[0][0] && lon <= box[1][0] && lat >= box[0][1] && lat <= box[1][1];
  }

  /* ------------------------------------------------------------ the points */
  function peakPoints() {
    var out = [];
    [[window.MOUNTAINS, true], [window.PEAKS_DATA, false]].forEach(function (pair) {
      var db = pair[0], isBig = pair[1];
      if (!db) return;
      Object.keys(db).forEach(function (slug) {
        var m = db[slug];
        var c = m && m.coordinates;
        if (!c || typeof c.lat !== 'number' || typeof c.lon !== 'number' || m.inNepal === false) return;
        var metres = m.elevationM || m.elevation || null;
        out.push({
          id: 'peak-' + slug, kind: 'peak', name: m.name, lat: c.lat, lon: c.lon,
          elevation: m.elevationLabel || (metres ? Number(metres).toLocaleString('en-GB') + ' m' : ''),
          metres: Number(metres) || 0, major: isBig, approx: !!c.approx,
          note: m.tagline || m.summary || '',
          href: '/expeditions/' + (isBig ? '' : 'peaks/') + slug,
          hrefLabel: isBig ? 'Open the expedition' : 'Open the peak'
        });
      });
    });
    return out;
  }

  function placePoints(places) {
    return (places || []).map(function (p) {
      var treks = (p.treks || []).map(function (slug) {
        var t = (window.TREKS || {})[slug];
        return t ? { slug: slug, name: t.name } : null;
      }).filter(Boolean);
      return {
        id: p.id, kind: p.kind, name: p.name, lat: p.lat, lon: p.lon,
        elevation: p.elevation || '', note: p.note || '', major: !!p.major, treks: treks
      };
    });
  }

  /* ------------------------------------------------------------- the panel */
  function panel() { return document.getElementById('explore-panel'); }

  function showRegion(key) {
    if (typeof window.renderGeoRegion === 'function') window.renderGeoRegion(key);
    var p = panel();
    if (p) p.scrollTop = 0;
  }

  function showPoint(pt) {
    var p = panel();
    if (!p) return;
    var treks = (pt.treks || []).map(function (t) {
      return '<a class="hgl-row" href="/treks/' + encodeURIComponent(t.slug) + '"><span>' + esc(t.name) + '</span>' + ARROW + '</a>';
    }).join('');
    p.innerHTML =
      '<div class="hgl-panel">' +
        '<span class="hgl-panel-kind">' + icon(pt.kind) + esc(KINDS[pt.kind] || '') + '</span>' +
        '<h3 class="hgl-panel-name">' + esc(pt.name) + '</h3>' +
        (pt.elevation ? '<p class="hgl-panel-el">' + esc(pt.elevation) + (pt.approx ? ' · position approximate' : '') + '</p>' : '') +
        (pt.note ? '<p class="hgl-panel-note">' + esc(pt.note) + '</p>' : '') +
        (treks ? '<span class="hgl-panel-lbl">Trails from here</span><div class="hgl-rows">' + treks + '</div>' : '') +
        (pt.href ? '<a class="hgl-panel-cta" href="' + esc(pt.href) + '">' + esc(pt.hrefLabel || 'Open') + ARROW + '</a>' : '') +
        (pt.regionName ? '<button type="button" class="hgl-panel-back" data-hgl-back>&larr; Back to ' + esc(pt.regionName) + '</button>' : '') +
      '</div>';
    p.scrollTop = 0;
  }

  function showIntro(regions) {
    var p = panel();
    if (!p) return;
    p.innerHTML =
      '<div class="hgl-panel is-intro">' +
        '<span class="hgl-panel-lbl">Start with a region</span>' +
        '<p class="hgl-panel-note">Nine regions, each with its own trails, peaks and season. Tap one on the map &mdash; or pick it from the list &mdash; and we&rsquo;ll show you what we guide there.</p>' +
        '<div class="hgl-region-list">' + regions.map(function (r) {
          return '<button type="button" class="hgl-region-btn" data-hgl-region="' + esc(r.key) + '">' +
            '<span>' + esc(r.name) + '</span>' +
            (r.trails ? '<b>' + r.trails + '</b>' : '') + '</button>';
        }).join('') + '</div>' +
        '<p class="hgl-panel-fine">Numbers are the trails we guide in each region. Boundaries: Survey Department of Nepal / OCHA, simplified for display.</p>' +
      '</div>';
  }

  /* --------------------------------------------------------------- the map */
  function style(geo) {
    return {
      version: 8,
      sources: { nepal: { type: 'geojson', data: geo } },
      layers: [
        { id: 'bg', type: 'background', paint: { 'background-color': '#111316' } },
        { id: 'provinces', type: 'fill', source: 'nepal', filter: ['==', ['get', 'layer'], 'province'],
          paint: { 'fill-color': '#1c2025' } },
        { id: 'province-lines', type: 'line', source: 'nepal', filter: ['==', ['get', 'layer'], 'province'],
          paint: { 'line-color': 'rgba(255,255,255,.08)', 'line-width': 0.8 } },
        { id: 'mask', type: 'fill', source: 'nepal', filter: ['==', ['get', 'layer'], 'mask'],
          paint: { 'fill-color': '#0d0f11', 'fill-opacity': 0.82 } },
        { id: 'country-glow', type: 'line', source: 'nepal', filter: ['==', ['get', 'layer'], 'country'],
          paint: { 'line-color': ACCENT, 'line-width': 6, 'line-blur': 8, 'line-opacity': 0.25 } },
        { id: 'country-line', type: 'line', source: 'nepal', filter: ['==', ['get', 'layer'], 'country'],
          paint: { 'line-color': ACCENT, 'line-width': 1.3, 'line-opacity': 0.8 } }
      ]
    };
  }

  function boot() {
    var host = document.getElementById('nepal-map');
    if (!host) return;
    var frame = host.closest('.hme-mapframe') || host.parentNode;

    Promise.all([
      load('link', { rel: 'stylesheet', href: GL_CSS }),
      load('script', { src: GL_JS, defer: 'defer' }),
      getJSON('/data/nepal.geo.json'),
      getJSON('/data/places.json')
    ]).then(function (res) {
      var geo = res[2], places = res[3];
      if (!window.maplibregl) throw new Error('maplibre did not load');

      var geoCfg = window.exploreGeo || {};
      var regions = REGIONS.map(function (r, i) {
        var g = geoCfg[r.key] || {};
        var name = g.name || r.key;
        return {
          key: r.key, at: r.at, box: r.box,
          trails: typeof window.geoTreksFor === 'function' ? window.geoTreksFor(r.key).length : 0,
          name: name,
          short: name.split(' & ')[0],
          above: i % 2 === 1
        };
      });

      var points = placePoints(places.places).concat(peakPoints());
      points.forEach(function (pt) {
        var hit = null;
        regions.forEach(function (r) {
          if (hit || r.key === 'terai') return;              // mountains win where boxes overlap
          if (inBox(r.box, pt.lon, pt.lat)) hit = r;
        });
        if (!hit) regions.forEach(function (r) { if (!hit && inBox(r.box, pt.lon, pt.lat)) hit = r; });
        if (hit) { pt.region = hit.key; pt.regionName = hit.name; }
      });

      var map = new window.maplibregl.Map({
        container: host,
        style: style(geo),
        bounds: BOUNDS,
        fitBoundsOptions: { padding: 18 },
        maxBounds: [[74, 21], [94, 35]],
        minZoom: 4.6,
        maxZoom: 11,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
        cooperativeGestures: window.matchMedia('(max-width: 1023px)').matches
      });
      map.touchZoomRotate.disableRotation();
      map.addControl(new window.maplibregl.NavigationControl({ showCompass: false }), 'top-right');
      map.addControl(new window.maplibregl.ScaleControl({ maxWidth: 110, unit: 'metric' }), 'bottom-left');

      var open = null, activeEl = null;
      var regionMarkers = [], pointMarkers = [];

      function regionEl(r) {
        var el = document.createElement('button');
        el.type = 'button';
        el.className = 'hgl-region';
        // short name on the map (the panel carries the full one), and the label
        // alternates above / below so neighbouring regions never collide
        // the label lives inside the pin so it can be positioned against it —
        // the marker element itself must keep MapLibre's own positioning
        el.innerHTML = '<span class="hgl-region-pin">' + icon('peak', 'hgl-pin-ico') +
          '<span class="hgl-region-lbl"><b>' + esc(r.short) + '</b>' +
          (r.trails ? '<i>' + r.trails + ' ' + (r.trails === 1 ? 'trail' : 'trails') + '</i>' : '') + '</span></span>';
        if (r.above) el.classList.add('is-above');
        el.addEventListener('click', function (e) { e.stopPropagation(); openRegion(r.key); });
        return el;
      }

      function pointEl(pt) {
        var el = document.createElement('button');
        el.type = 'button';
        el.className = 'hgl-marker is-' + pt.kind + (pt.major ? ' is-major' : '') + ' is-off';
        el.innerHTML = '<span class="hgl-pin">' + icon(pt.kind, 'hgl-pin-ico') + '</span>' +
          '<span class="hgl-label"><b>' + esc(pt.name) + '</b>' + (pt.elevation ? '<i>' + esc(pt.elevation) + '</i>' : '') + '</span>';
        el.addEventListener('click', function (e) {
          e.stopPropagation();
          if (activeEl) activeEl.classList.remove('is-open');
          activeEl = el;
          el.classList.add('is-open');
          showPoint(pt);
        });
        return el;
      }

      regions.forEach(function (r) {
        var el = regionEl(r);
        var m = new window.maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat(r.at).addTo(map);
        el.setAttribute('aria-label', r.name + (r.trails ? ', ' + r.trails + ' trails' : ''));
        regionMarkers.push({ r: r, el: el, marker: m });
      });
      points.forEach(function (pt) {
        var el = pointEl(pt);
        var m = new window.maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat([pt.lon, pt.lat]).addTo(map);
        el.setAttribute('aria-label', pt.name + (pt.elevation ? ', ' + pt.elevation : ''));
        pointMarkers.push({ pt: pt, el: el, marker: m });
      });

      /* ---- what is on screen ---- */
      var raf = null;
      function schedule() { if (raf == null) raf = requestAnimationFrame(draw); }
      function draw() {
        raf = null;
        var boxes = [];
        var hits = function (b) {
          for (var i = 0; i < boxes.length; i++) {
            var o = boxes[i];
            if (b.x1 < o.x2 && b.x2 > o.x1 && b.y1 < o.y2 && b.y2 > o.y1) return true;
          }
          return false;
        };
        regionMarkers.forEach(function (m) {
          m.el.classList.toggle('is-off', !!open);
          m.el.tabIndex = open ? -1 : 0;
        });
        pointMarkers.forEach(function (m) {
          var on = !!open && m.pt.region === open;
          m.el.classList.toggle('is-off', !on);
          m.el.tabIndex = on ? 0 : -1;
          if (!on) { m.el.classList.remove('is-nolabel'); return; }
          // a region holds few points, so only the labels need thinning
          var q = map.project(m.marker.getLngLat());
          var w = Math.max(m.pt.name.length * 6.2, 40) / 2 + 6;
          var b = { x1: q.x - w, y1: q.y - 26, x2: q.x + w, y2: q.y };
          var show = m.el.classList.contains('is-open') || !hits(b);
          m.el.classList.toggle('is-nolabel', !show);
          if (show) boxes.push(b);
        });
      }

      function backBtn() { return document.getElementById('map-reset'); }

      function openRegion(key) {
        var r = null;
        regions.forEach(function (x) { if (x.key === key) r = x; });
        if (!r) return;
        open = key;
        if (activeEl) { activeEl.classList.remove('is-open'); activeEl = null; }
        host.dataset.region = key;
        map.fitBounds(r.box, { padding: { top: 52, bottom: 38, left: 38, right: 38 }, duration: 900, maxZoom: 9.5 });
        showRegion(key);
        var b = backBtn();
        if (b) b.hidden = false;
        schedule();
      }

      function closeRegion() {
        open = null;
        if (activeEl) { activeEl.classList.remove('is-open'); activeEl = null; }
        delete host.dataset.region;
        map.fitBounds(BOUNDS, { padding: 18, duration: 800 });
        showIntro(regions);
        var b = backBtn();
        if (b) b.hidden = true;
        schedule();
      }

      map.on('move', schedule);
      map.on('zoom', schedule);
      map.on('resize', schedule);

      /* the panel drives the map too: region chips and the back link */
      document.addEventListener('click', function (e) {
        if (!e.target.closest) return;
        var pick = e.target.closest('[data-hgl-region]');
        if (pick) { e.preventDefault(); openRegion(pick.dataset.hglRegion); return; }
        if (e.target.closest('[data-hgl-back]')) {
          e.preventDefault();
          if (activeEl) { activeEl.classList.remove('is-open'); activeEl = null; }
          if (open) showRegion(open);
        }
      });

      // edit.js's own region buttons call these
      window.clickGeo = function (key) { if (key === open) closeRegion(); else openRegion(key); };
      window.geoZoomOut = closeRegion;
      var b0 = backBtn();
      if (b0) b0.addEventListener('click', closeRegion);

      /* ---- sizing: the canvas starts hidden, and on phones inside a sheet ---- */
      function refit() {
        map.resize();
        if (!open) map.fitBounds(BOUNDS, { padding: 18, duration: 0 });
        schedule();
      }
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden) setTimeout(refit, 60);
      });
      if (window.ResizeObserver) {
        var last = 0;
        new ResizeObserver(function (entries) {
          var w = entries[0].contentRect.width;
          if (!w || Math.abs(w - last) < 8) return;
          last = w;
          refit();
        }).observe(host);
      }

      /* ---- light / dark ---- */
      var PAINT = {
        dark: { bg: '#111316', prov: '#1c2025', provLine: 'rgba(255,255,255,.08)', mask: '#0d0f11', maskOp: 0.82 },
        light: { bg: '#efeae1', prov: '#e7e1d6', provLine: 'rgba(28,30,33,.12)', mask: '#f4f1ea', maskOp: 0.86 }
      };
      function paint() {
        if (!map.getLayer('bg')) return;
        var t = document.body.classList.contains('light-mode') ? PAINT.light : PAINT.dark;
        map.setPaintProperty('bg', 'background-color', t.bg);
        map.setPaintProperty('provinces', 'fill-color', t.prov);
        map.setPaintProperty('province-lines', 'line-color', t.provLine);
        map.setPaintProperty('mask', 'fill-color', t.mask);
        map.setPaintProperty('mask', 'fill-opacity', t.maskOp);
      }
      new MutationObserver(paint).observe(document.body, { attributes: true, attributeFilter: ['class'] });

      /* ---- start. `load` never fires in a tab that is not painting, so we
              also start as soon as the style is parsed. ---- */
      var started = false;
      function start() {
        if (started) return;
        started = true;
        frame.classList.add('is-gl-ready');
        var sec = document.getElementById('explore');
        if (sec) sec.classList.add('has-gl');   // for browsers without :has()
        refit();
        showIntro(regions);
        paint();
        host.dispatchEvent(new CustomEvent('hgl:ready', { bubbles: true }));
      }
      map.on('load', start);
      map.on('styledata', function () { if (map.isStyleLoaded()) start(); });
      setTimeout(start, 2500);

      window.HMAExploreMap = { map: map, openRegion: openRegion, close: closeRegion };
    }).catch(function (err) {
      frame.classList.add('is-gl-failed');
      if (window.console && console.warn) console.warn('[explore] falling back to the drawn map:', err && err.message);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
