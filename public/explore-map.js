/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — Explore Nepal, real map (MapLibre GL)
   ---------------------------------------------------------------------------
   A vector map of Nepal drawn from our own GeoJSON — no tile server, no API
   key, nothing to pay for. If anything fails to load, the old SVG map stays
   in the page as the fallback.

     /data/nepal.geo.json   country outline, the 7 provinces and a world mask
     /data/places.json      towns, trailheads, passes, lakes and parks
     window.MOUNTAINS       the 14 eight-thousanders   (from the database)
     window.PEAKS_DATA      the other peaks we climb   (from the database)

   Markers are plain HTML so they inherit the brand styling and can be
   keyboard-focused. Clicking one fills the panel beside the map.
   Revert: remove the <script src="/explore-map.js"> tag — the SVG map returns.
   ========================================================================== */
(function () {
  'use strict';
  if (window.__hmeGlInstalled) return;
  window.__hmeGlInstalled = true;

  // MapLibre GL JS 4.7.1, self-hosted (BSD-3, see /vendor/maplibre-gl-LICENSE.txt):
  // no third-party request, no API key, and it keeps working behind our CSP.
  var GL_JS = '/vendor/maplibre-gl.js';
  var GL_CSS = '/vendor/maplibre-gl.css';
  var BOUNDS = [[79.95, 26.2], [88.35, 30.55]];  // Nepal, with a little air around it
  var ACCENT = '#f06225';

  var KINDS = {
    peak:      { label: 'Peaks',   plural: 'peaks' },
    trailhead: { label: 'Treks',   plural: 'trailheads' },
    pass:      { label: 'Passes',  plural: 'passes' },
    culture:   { label: 'Culture', plural: 'cultural sites' },
    nature:    { label: 'Nature',  plural: 'lakes & parks' }
  };

  /* Lucide icons (lucide.dev, ISC) — one per category */
  var ICONS = {
    peak: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/><path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19"/>',
    trailhead: '<path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/>',
    pass: '<path d="M2 20l6-9 4 5 3-4 7 8z"/><path d="M12 4v4"/><path d="M10 6h4"/>',
    culture: '<path d="M3 22h18"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M12 2l8 5H4z"/>',
    nature: '<path d="M2 17c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M2 21c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>'
  };
  var ARROW = '<svg viewBox="0 0 18 10" fill="none" aria-hidden="true"><path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" stroke-width="1.5"/></svg>';

  /* What shows at which zoom, and who wins when two markers collide.
     Higher priority = drawn first and keeps its label. */
  function rank(pt) {
    if (pt.kind === 'peak') return pt.major ? 90 + pt.metres / 10000 : 52 + pt.metres / 10000;
    if (pt.kind === 'culture') return pt.major ? 96 : 55;
    if (pt.kind === 'trailhead') return pt.treks && pt.treks.length ? 70 : 58;
    if (pt.kind === 'nature') return 60;
    return 50;
  }
  /* How far past the opening view you must zoom before a point appears.
     Measured from the fitted zoom, so it holds at any container size. */
  function zoomStep(pt) {
    if (pt.major) return 0;                                   // KTM, Pokhara, Lumbini, the 8,000ers
    if (pt.kind === 'peak') return pt.metres >= 7000 ? 0 : 0.5;
    if (pt.kind === 'trailhead') return pt.treks && pt.treks.length ? 0 : 0.8;
    if (pt.kind === 'nature') return 0.25;
    if (pt.kind === 'culture') return 0.6;
    return 0.8;                                               // passes: only when you zoom in
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function icon(kind, cls) {
    return '<svg class="' + (cls || 'hgl-ico') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[kind] || ICONS.nature) + '</svg>';
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

  /* ------------------------------------------------------------ the points */
  function peakPoints() {
    var out = [];
    [[window.MOUNTAINS, true], [window.PEAKS_DATA, false]].forEach(function (pair) {
      var db = pair[0], isBig = pair[1];
      if (!db) return;
      Object.keys(db).forEach(function (slug) {
        var m = db[slug];
        var c = m && m.coordinates;
        if (!c || typeof c.lat !== 'number' || typeof c.lon !== 'number') return;
        if (m.inNepal === false) return;                       // K2 & co. live elsewhere
        var metres = m.elevationM || m.elevation || null;
        out.push({
          id: 'peak-' + slug, kind: 'peak', name: m.name, lat: c.lat, lon: c.lon,
          elevation: m.elevationLabel || (metres ? Number(metres).toLocaleString('en-GB') + ' m' : ''),
          metres: Number(metres) || 0, major: isBig, approx: !!c.approx,
          note: m.tagline || m.summary || '', href: '/expeditions/' + (isBig ? '' : 'peaks/') + slug,
          hrefLabel: isBig ? 'Open the expedition' : 'Open the peak'
        });
      });
    });
    return out.sort(function (a, b) { return b.metres - a.metres; });
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

  /* ------------------------------------------------------------ the panel */
  function showPoint(pt) {
    var panel = document.getElementById('explore-panel');
    if (!panel) return;
    var k = KINDS[pt.kind] || {};
    var treks = (pt.treks || []).map(function (t) {
      return '<a class="hgl-row" href="/treks/' + encodeURIComponent(t.slug) + '"><span>' + esc(t.name) + '</span>' + ARROW + '</a>';
    }).join('');
    panel.innerHTML =
      '<div class="hgl-panel">' +
        '<span class="hgl-panel-kind">' + icon(pt.kind) + esc(k.label || '') + '</span>' +
        '<h3 class="hgl-panel-name">' + esc(pt.name) + '</h3>' +
        (pt.elevation ? '<p class="hgl-panel-el">' + esc(pt.elevation) + (pt.approx ? ' · position approximate' : '') + '</p>' : '') +
        (pt.note ? '<p class="hgl-panel-note">' + esc(pt.note) + '</p>' : '') +
        (treks ? '<span class="hgl-panel-lbl">Trails from here</span><div class="hgl-rows">' + treks + '</div>' : '') +
        (pt.href ? '<a class="hgl-panel-cta" href="' + esc(pt.href) + '">' + esc(pt.hrefLabel || 'Open') + ARROW + '</a>' : '') +
      '</div>';
    panel.scrollTop = 0;
  }

  function showIntro(counts, total) {
    var panel = document.getElementById('explore-panel');
    if (!panel) return;
    panel.innerHTML =
      '<div class="hgl-panel is-intro">' +
        '<span class="hgl-panel-lbl">Pick a point</span>' +
        '<p class="hgl-panel-note">Tap any marker to see what we guide there — the trails that start from it, the peaks above it and how high it sits. Drag to pan, scroll or pinch to zoom.</p>' +
        '<ul class="hgl-legend-list">' + Object.keys(KINDS).map(function (k) {
          return '<li><span class="hgl-key is-' + k + '">' + icon(k) + '</span>' + esc(KINDS[k].label) +
            '<b>' + (counts[k] || 0) + '</b></li>';
        }).join('') + '</ul>' +
        '<p class="hgl-panel-fine">' + total + ' points across Nepal. Boundaries: Survey Department of Nepal / OCHA, simplified for display.</p>' +
      '</div>';
  }

  /* ------------------------------------------------------------- the map */
  function style(geo) {
    return {
      version: 8,
      sources: { nepal: { type: 'geojson', data: geo } },
      layers: [
        { id: 'bg', type: 'background', paint: { 'background-color': '#111316' } },
        { id: 'provinces', type: 'fill', source: 'nepal', filter: ['==', ['get', 'layer'], 'province'],
          paint: { 'fill-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#23282e', '#1c2025'], 'fill-opacity': 1 } },
        { id: 'province-lines', type: 'line', source: 'nepal', filter: ['==', ['get', 'layer'], 'province'],
          paint: { 'line-color': 'rgba(255,255,255,.10)', 'line-width': 0.8 } },
        { id: 'mask', type: 'fill', source: 'nepal', filter: ['==', ['get', 'layer'], 'mask'],
          paint: { 'fill-color': '#0d0f11', 'fill-opacity': 0.82 } },
        { id: 'country-glow', type: 'line', source: 'nepal', filter: ['==', ['get', 'layer'], 'country'],
          paint: { 'line-color': ACCENT, 'line-width': 6, 'line-blur': 8, 'line-opacity': 0.28 } },
        { id: 'country-line', type: 'line', source: 'nepal', filter: ['==', ['get', 'layer'], 'country'],
          paint: { 'line-color': ACCENT, 'line-width': 1.4, 'line-opacity': 0.85 } }
      ]
    };
  }

  function markerEl(pt, onPick) {
    var el = document.createElement('button');
    el.type = 'button';
    el.className = 'hgl-marker is-' + pt.kind + (pt.major ? ' is-major' : '');
    el.setAttribute('aria-label', pt.name + (pt.elevation ? ', ' + pt.elevation : ''));
    el.innerHTML = '<span class="hgl-pin">' + icon(pt.kind, 'hgl-pin-ico') + '</span>' +
      '<span class="hgl-label"><b>' + esc(pt.name) + '</b>' + (pt.elevation ? '<i>' + esc(pt.elevation) + '</i>' : '') + '</span>';
    el.addEventListener('click', function (e) { e.stopPropagation(); onPick(pt, el); });
    el.addEventListener('mouseenter', function () { el.classList.add('is-hover'); });
    el.addEventListener('mouseleave', function () { el.classList.remove('is-hover'); });
    return el;
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

      var points = placePoints(places.places).concat(peakPoints());
      var counts = {};
      points.forEach(function (p) { counts[p.kind] = (counts[p.kind] || 0) + 1; });

      var map = new window.maplibregl.Map({
        container: host,
        style: style(geo),
        bounds: BOUNDS,
        fitBoundsOptions: { padding: { top: 18, bottom: 18, left: 18, right: 18 } },
        maxBounds: [[74, 21], [94, 35]],
        minZoom: 4.6,          // a narrow phone needs to pull back further to hold the country
        maxZoom: 12,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
        touchZoomRotate: true,
        cooperativeGestures: window.matchMedia('(max-width: 1023px)').matches
      });
      map.touchZoomRotate.disableRotation();
      map.addControl(new window.maplibregl.NavigationControl({ showCompass: false }), 'top-right');
      map.addControl(new window.maplibregl.ScaleControl({ maxWidth: 110, unit: 'metric' }), 'bottom-left');

      var markers = [], active = null;
      function pick(pt, el) {
        if (active) active.classList.remove('is-open');
        active = el;
        el.classList.add('is-open');
        showPoint(pt);
        map.easeTo({ center: [pt.lon, pt.lat], zoom: Math.max(map.getZoom(), 7.6), duration: 700, offset: [0, -20] });
      }

      /* `load` only fires after the first paint, and a browser that is not
         drawing (a hidden tab, a preview pane) never gets there. The markers are
         plain DOM, so start as soon as the style is parsed — or after a beat. */
      var started = false;
      function start() {
        if (started) return;
        started = true;
        points.sort(function (a, b) { return rank(b) - rank(a); }).forEach(function (pt) {
          var el = markerEl(pt, pick);
          var m = new window.maplibregl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([pt.lon, pt.lat]).addTo(map);
          // MapLibre relabels the node "Map marker" — put the real name back
          el.setAttribute('aria-label', pt.name + (pt.elevation ? ', ' + pt.elevation : ''));
          markers.push({ pt: pt, el: el, marker: m });
        });
        [['India', 26.6, 83.4], ['China · Tibet', 30.15, 85.6]].forEach(function (n) {
          var el = document.createElement('span');
          el.className = 'hgl-neighbour';
          el.textContent = n[0];
          new window.maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([n[2], n[1]]).addTo(map);
        });
        frame.classList.add('is-gl-ready');
        var probe = markers[0] && markers[0].el.querySelector('.hgl-label');
        if (probe) LAB_H = Math.round(probe.getBoundingClientRect().height) || 26;
        refit();                       // the canvas was hidden until now, so size it properly
        applyFilter(host.dataset.filter || 'all');
        showIntro(counts, points.length);
        host.dispatchEvent(new CustomEvent('hgl:ready', { bubbles: true }));
      }
      map.on('load', start);
      map.on('styledata', function () { if (map.isStyleLoaded()) start(); });
      setTimeout(start, 2500);

      /* Declutter, the way a proper map does it: walk the markers from most
         important to least, and drop any pin or label that would collide with
         one already placed. Runs on a rAF so panning stays smooth. */
      var declutterRaf = null, baseZoom = 6.2, LAB_H = 26;

      /* The map starts life inside a hidden box (and on phones inside a sheet),
         so re-measure whenever the box changes size and frame Nepal again. */
      function refit() {
        map.resize();
        map.fitBounds(BOUNDS, { padding: 18, duration: 0 });
        baseZoom = map.getZoom();
        declutter();
      }
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden) setTimeout(function () { if (!active) refit(); else map.resize(); }, 60);
      });
      if (window.ResizeObserver) {
        var last = 0;
        new ResizeObserver(function (entries) {
          var w = entries[0].contentRect.width;
          if (!w || Math.abs(w - last) < 8) return;
          last = w;
          if (!active) refit(); else { map.resize(); scheduleDeclutter(); }
        }).observe(host);
      }
      function declutter() {
        declutterRaf = null;
        var z = map.getZoom();
        var filter = host.dataset.filter || 'all';
        var pins = [], labels = [];
        var hit = function (boxes, b) {
          for (var i = 0; i < boxes.length; i++) {
            var o = boxes[i];
            if (b.x1 < o.x2 && b.x2 > o.x1 && b.y1 < o.y2 && b.y2 > o.y1) return true;
          }
          return false;
        };
        markers.forEach(function (m) {
          var pt = m.pt;
          var step = filter === 'all' ? zoomStep(pt) : Math.min(zoomStep(pt), 0.25);
          var on = (filter === 'all' || pt.kind === filter) && z >= baseZoom + step;
          m.el.classList.toggle('is-off', !on);
          m.el.tabIndex = on ? 0 : -1;
          if (!on) { m.el.classList.remove('is-crowded', 'is-nolabel'); return; }
          /* markers are anchored by their bottom edge: label sits just above the
             point, the pin above that. */
          var q = map.project(m.marker.getLngLat());
          var big = m.el.classList.contains('is-major');
          var r = big ? 15 : 12;
          var labTop = q.y - LAB_H;
          var pinBottom = labTop - 3;
          var pin = { x1: q.x - r, y1: pinBottom - r * 2, x2: q.x + r, y2: pinBottom };
          var open = m.el.classList.contains('is-open') || m.el.classList.contains('is-hover');
          if (!open && hit(pins, pin)) { m.el.classList.add('is-crowded'); return; }
          m.el.classList.remove('is-crowded');
          pins.push(pin);
          var w = Math.max(pt.name.length * 6.2, (pt.elevation || '').length * 5.4) / 2 + 6;
          var lab = { x1: q.x - w, y1: labTop, x2: q.x + w, y2: q.y };
          var show = open || !hit(labels, lab);
          m.el.classList.toggle('is-nolabel', !show);
          if (show) { labels.push(lab); pins.push(lab); }   // later pins avoid this label too
        });
      }
      function scheduleDeclutter() {
        if (declutterRaf == null) declutterRaf = requestAnimationFrame(declutter);
      }
      map.on('move', scheduleDeclutter);
      map.on('zoom', scheduleDeclutter);
      map.on('resize', scheduleDeclutter);

      function applyFilter(kind) {
        host.dataset.filter = kind;
        declutter();
        var chips = document.querySelectorAll('[data-map-filter]');
        [].slice.call(chips).forEach(function (c) {
          var on = c.dataset.mapFilter === kind;
          c.classList.toggle('is-on', on);
          c.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      }

      [].slice.call(document.querySelectorAll('[data-map-filter]')).forEach(function (chip) {
        chip.hidden = false;
        var k = chip.dataset.mapFilter;
        var n = k === 'all' ? points.length : counts[k] || 0;
        var badge = chip.querySelector('[data-map-count]');
        if (badge) badge.textContent = n;
        chip.addEventListener('click', function () { applyFilter(k); });
      });

      var reset = document.getElementById('map-reset');
      if (reset) {
        reset.hidden = false;
        reset.addEventListener('click', function () {
          if (active) { active.classList.remove('is-open'); active = null; }
          map.fitBounds(BOUNDS, { padding: 18, duration: 800 });
          showIntro(counts, points.length);
        });
      }

      /* the site has a light mode — repaint the map when it flips */
      var PAINT = {
        dark: { bg: '#111316', prov: '#1c2025', provLine: 'rgba(255,255,255,.10)', mask: '#0d0f11', maskOp: 0.82 },
        light: { bg: '#efeae1', prov: '#e7e1d6', provLine: 'rgba(28,30,33,.12)', mask: '#f4f1ea', maskOp: 0.86 }
      };
      function paint() {
        var t = document.body.classList.contains('light-mode') ? PAINT.light : PAINT.dark;
        if (!map.getLayer('bg')) return;
        map.setPaintProperty('bg', 'background-color', t.bg);
        map.setPaintProperty('provinces', 'fill-color', t.prov);
        map.setPaintProperty('province-lines', 'line-color', t.provLine);
        map.setPaintProperty('mask', 'fill-color', t.mask);
        map.setPaintProperty('mask', 'fill-opacity', t.maskOp);
      }
      map.once('styledata', paint);
      map.on('load', paint);
      new MutationObserver(paint).observe(document.body, { attributes: true, attributeFilter: ['class'] });

      window.HMAExploreMap = {
        map: map,
        focus: function (id) {
          var m = markers.filter(function (x) { return x.pt.id === id; })[0];
          if (m) pick(m.pt, m.el);
        }
      };
    }).catch(function (err) {
      // No CDN, no network, or an old browser: leave the SVG map in place.
      frame.classList.add('is-gl-failed');
      if (window.console && console.warn) console.warn('[explore] falling back to the drawn map:', err && err.message);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
