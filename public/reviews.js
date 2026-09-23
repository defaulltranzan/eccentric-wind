/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — traveller reviews (Tripadvisor)
   Renders three things from /data/reviews.js (window.REVIEWS + REVIEW_SOURCE):
     • the homepage "Summit Register" section   → #reviews-panel / #reviews-track
     • the compact rating pill in every footer  → [data-hmr-pill]
     • the same pill inside the booking popup   → booking-modal.js asks for it
   Everything is editable in /admin → Reviews; nothing here is hard-coded.
   ========================================================================== */
(function () {
  'use strict';
  if (window.__hmrInstalled) return;
  window.__hmrInstalled = true;

  var TA_GREEN = '#00aa6c';

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function src() { return window.REVIEW_SOURCE || null; }
  function list() { return Array.isArray(window.REVIEWS) ? window.REVIEWS : []; }
  function num(n, dp) { return (Math.round(n * Math.pow(10, dp)) / Math.pow(10, dp)).toFixed(dp); }

  /* five bubbles, the last one part-filled for ratings like 4.9 */
  function bubbles(rating, size) {
    var r = Math.max(0, Math.min(5, Number(rating) || 0));
    var s = size || 13;
    var out = '<span class="hmr-bub" role="img" aria-label="' + esc(num(r, 1)) + ' of 5 bubbles">';
    for (var i = 0; i < 5; i++) {
      var fill = Math.max(0, Math.min(1, r - i));
      var id = 'hmrb' + (Math.random().toString(36).slice(2, 8)) + i;
      out += '<svg viewBox="0 0 16 16" width="' + s + '" height="' + s + '" aria-hidden="true" focusable="false">' +
        (fill > 0 && fill < 1
          ? '<defs><clipPath id="' + id + '"><rect x="0" y="0" width="' + (16 * fill) + '" height="16"/></clipPath></defs>' +
            '<circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".45"/>' +
            '<circle cx="8" cy="8" r="7.4" fill="currentColor" clip-path="url(#' + id + ')"/>'
          : fill >= 1
            ? '<circle cx="8" cy="8" r="7.4" fill="currentColor"/>'
            : '<circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".45"/>') +
        '</svg>';
    }
    return out + '</span>';
  }

  var CHECK = '<svg class="hmr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>';
  var ARROW = '<svg viewBox="0 0 18 10" fill="none" aria-hidden="true"><path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" stroke-width="1.5"/></svg>';
  var EXT = '<svg class="hmr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';

  /* ------------------------------------------------ compact pill (footers) */
  function pillHTML(s, opts) {
    if (!s) return '';
    var o = opts || {};
    var inner = '<span class="hmr-pill-score">' + esc(num(s.rating, 1)) + '</span>' +
      bubbles(s.rating, o.size || 12) +
      '<span class="hmr-pill-txt">' + esc(s.reviewCount) + ' reviews on <b>' + esc(s.sourceName || 'Tripadvisor') + '</b></span>';
    if (!s.url) return '<span class="hmr-pill">' + inner + '</span>';
    return '<a class="hmr-pill" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + inner + EXT + '</a>';
  }
  window.HMAReviewPill = function (opts) { return pillHTML(src(), opts); };

  function renderPills() {
    var s = src();
    if (!s) return;
    var html = pillHTML(s);
    [].slice.call(document.querySelectorAll('[data-hmr-pill]')).forEach(function (el) {
      if (el.dataset.hmrDone) return;
      el.dataset.hmrDone = '1';
      el.innerHTML = html;
    });
  }

  /* -------------------------------------------------- homepage section */
  function panelHTML(s) {
    if (!s) return '';
    var total = (s.distribution || []).reduce(function (a, b) { return a + (Number(b.count) || 0); }, 0) || s.reviewCount || 1;
    var bars = (s.distribution || []).map(function (d) {
      var pct = Math.round((Number(d.count) || 0) / total * 100);
      return '<li class="hmr-bar"><span class="hmr-bar-lbl">' + esc(d.label) + '</span>' +
        '<span class="hmr-bar-track"><i style="width:' + pct + '%"></i></span>' +
        '<span class="hmr-bar-n">' + esc(d.count) + '</span></li>';
    }).join('');
    return '<div class="hmr-panel-head"><span class="hmr-src">' + esc(s.sourceName || 'Tripadvisor') + '</span>' +
        '<span class="hmr-verified">' + CHECK + 'Verified reviews</span></div>' +
      '<div class="hmr-score"><span class="hmr-score-n">' + esc(num(s.rating, 1)) + '</span><span class="hmr-score-of">of 5</span></div>' +
      '<div class="hmr-score-bub">' + bubbles(s.rating, 18) + '</div>' +
      '<p class="hmr-count">' + esc(s.reviewCount) + ' traveller reviews for <b>' + esc(s.listingName || 'Himalayan Magic Adventures') + '</b></p>' +
      '<ul class="hmr-bars">' + bars + '</ul>' +
      (s.url ? '<a class="hmr-cta" href="' + esc(s.url) + '" target="_blank" rel="noopener">Read all ' + esc(s.reviewCount) + ' reviews' + ARROW + '</a>' : '') +
      '<p class="hmr-fine">Reviews are the subjective opinion of ' + esc(s.sourceName || 'Tripadvisor') + ' members, published on ' + esc(s.sourceName || 'Tripadvisor') +
        '.' + (s.checkedAt ? ' Figures checked ' + esc(dateLabel(s.checkedAt)) + '.' : '') + '</p>';
  }

  function dateLabel(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return String(iso || '');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  /* ---- visual layer for the homepage register (2026-09-23) ------------------
     Photos are the route's own hero image, shown in black and white. Reviews with
     no linked route get a drawn silhouette instead — never another trek's photo. */
  function tripImage(r) {
    if (!r.tripSlug) return '';
    var rec = r.tripType === 'expedition'
      ? ((window.MOUNTAINS || {})[r.tripSlug] || (window.PEAKS_DATA || {})[r.tripSlug])
      : (window.TREKS || {})[r.tripSlug];
    var img = rec && rec.heroImage;
    return typeof img === 'string' && /^\/(?!\/)/.test(img) ? img : '';
  }
  function initials(name) {
    var parts = String(name || '').replace(/[^A-Za-z\u00C0-\u024F .'-]/g, '').trim().split(/[\s.]+/).filter(Boolean);
    if (!parts.length) return 'TA';
    return (parts[0].charAt(0) + (parts.length > 1 ? parts[parts.length - 1].charAt(0) : parts[0].charAt(1) || '')).toUpperCase();
  }
  // Three drawn scenes so neighbouring cards without photos don't repeat.
  var SCENES = [
    'M0 150 L0 96 L38 70 L62 84 L104 34 L132 62 L150 50 L196 92 L232 58 L270 86 L320 60 L320 150 Z',
    'M0 150 L0 88 L46 58 L80 80 L118 44 L150 70 L188 22 L214 52 L250 40 L292 78 L320 64 L320 150 Z',
    'M0 150 L0 100 L30 80 L74 92 L112 50 L146 76 L176 40 L230 86 L262 66 L320 90 L320 150 Z'
  ];
  var FLAG_COLOURS = ['#4b76b8', '#e9e5da', '#c4452f', '#3f8f5a', '#d6a531'];
  function sceneSVG(i) {
    var d = SCENES[i % SCENES.length];
    var flags = '';
    for (var k = 0; k < 11; k++) {
      var x = 150 + k * 15, y = 18 + Math.pow(k - 5, 2) * 0.55;
      flags += '<rect x="' + x + '" y="' + y + '" width="9" height="11" fill="' + FLAG_COLOURS[k % 5] + '" opacity=".55"/>';
    }
    return '<svg class="hmr-scene" viewBox="0 0 320 150" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">' +
      '<path d="' + SCENES[(i + 1) % SCENES.length] + '" transform="translate(0 -18)" fill="currentColor" opacity=".08"/>' +
      '<path d="M146 17 Q 225 44 316 17" fill="none" stroke="currentColor" stroke-width=".8" opacity=".35"/>' + flags +
      '<path d="' + d + '" fill="currentColor" opacity=".16"/></svg>';
  }

  function mediaHTML(r, i) {
    var img = tripImage(r);
    var meta = [r.travelDate, r.party].filter(Boolean).join(' · ');
    return '<div class="hmr-media' + (img ? '' : ' is-drawn') + '">' +
      (img ? '<img src="' + esc(img) + '" alt="" loading="lazy" decoding="async">' : sceneSVG(i)) +
      '<span class="hmr-media-bub">' + bubbles(r.rating || 5, 11) + '</span>' +
      (meta ? '<span class="hmr-media-when">' + esc(meta) + '</span>' : '') +
      (r.trip ? '<span class="hmr-media-trip">' + esc(r.trip) + '</span>' : '') +
    '</div>';
  }

  function cardHTML(r, i, opts) {
    if (opts && opts.media) return cardMediaHTML(r, i);
    var meta = [r.travelDate, r.party].filter(Boolean).join(' · ');
    var who = [esc(r.author || 'Tripadvisor traveller'), r.location ? esc(r.location) : ''].filter(Boolean).join(' · ');
    var tripHref = r.tripSlug ? (r.tripType === 'expedition' ? '/expeditions/' : '/treks/') + encodeURIComponent(r.tripSlug) : '';
    return '<article class="hmr-card">' +
      '<div class="hmr-card-top">' + bubbles(r.rating || 5, 12) + (meta ? '<span class="hmr-when">' + esc(meta) + '</span>' : '') + '</div>' +
      (r.title ? '<h3 class="hmr-title">' + esc(r.title) + '</h3>' : '') +
      '<blockquote class="hmr-quote">' + esc(r.quote) + '</blockquote>' +
      (r.guide ? '<p class="hmr-guide"><span>Guide</span>' + esc(r.guide) + '</p>' : '') +
      '<footer class="hmr-card-foot">' +
        '<div class="hmr-who">' + who + '</div>' +
        '<div class="hmr-links">' +
          (tripHref ? '<a class="hmr-trip" href="' + tripHref + '">' + esc(r.trip || 'View the route') + ARROW + '</a>'
                    : (r.trip ? '<span class="hmr-trip is-plain">' + esc(r.trip) + '</span>' : '')) +
          (r.url ? '<a class="hmr-verify" href="' + esc(r.url) + '" target="_blank" rel="noopener">' + CHECK + 'Verified on ' + esc(r.sourceName || 'Tripadvisor') + '</a>'
                 : '') +
        '</div>' +
      '</footer>' +
    '</article>';
  }

  function cardMediaHTML(r, i) {
    var tripHref = r.tripSlug ? (r.tripType === 'expedition' ? '/expeditions/' : '/treks/') + encodeURIComponent(r.tripSlug) : '';
    return '<article class="hmr-card has-media">' + mediaHTML(r, i) +
      '<div class="hmr-card-body">' +
        (r.title ? '<h3 class="hmr-title">' + esc(r.title) + '</h3>' : '') +
        '<blockquote class="hmr-quote">' + esc(r.quote) + '</blockquote>' +
        (r.guide ? '<p class="hmr-guide"><span>Guide</span>' + esc(r.guide) + '</p>' : '') +
        '<footer class="hmr-card-foot">' +
          '<div class="hmr-who-row"><span class="hmr-avatar" aria-hidden="true">' + esc(initials(r.author)) + '</span>' +
            '<span class="hmr-who">' + esc(r.author || 'Tripadvisor traveller') + (r.location ? '<small>' + esc(r.location) + '</small>' : '') + '</span></div>' +
          '<div class="hmr-links">' +
            (tripHref ? '<a class="hmr-trip" href="' + tripHref + '">View the route' + ARROW + '</a>' : '') +
            (r.url ? '<a class="hmr-verify" href="' + esc(r.url) + '" target="_blank" rel="noopener">' + CHECK + 'Verified on ' + esc(r.sourceName || 'Tripadvisor') + '</a>' : '') +
          '</div>' +
        '</footer>' +
      '</div>' +
    '</article>';
  }

  /* Prayer flags strung across the section, and a ridge with a rope team on it. */
  function flagsSVG() {
    var W = 1440, out = '', n = 46;
    var line = function (x) { var t = x / W; return 8 + 34 * 4 * t * (1 - t); };
    for (var k = 1; k < n; k++) {
      var x = k * (W / n), y = line(x);
      out += '<g class="hmr-flag" style="--d:' + ((k * 0.37) % 3).toFixed(2) + 's"><rect x="' + (x - 9).toFixed(1) + '" y="' + y.toFixed(1) +
        '" width="18" height="24" fill="' + FLAG_COLOURS[k % 5] + '"/></g>';
    }
    return '<svg viewBox="0 0 ' + W + ' 72" preserveAspectRatio="xMidYMin slice" focusable="false">' +
      '<path d="M0 8 Q 720 76 1440 8" fill="none" stroke="currentColor" stroke-width="1" opacity=".5" vector-effect="non-scaling-stroke"/>' + out + '</svg>';
  }
  var HIKER = '<g><circle cx="10" cy="4" r="3.3"/><path d="M6.5 8.5h6l1.2 11.5-1.6.3-.8 8.4 3.2 10.3h-3.1l-3-9.3-2.9 9.3H2.4l3.1-10.2-.9-8.6-1.2-.2z"/>' +
    '<rect x="11.8" y="9" width="5.2" height="9.5" rx="1.6"/><path d="M15.5 13.5 19.8 39" stroke="currentColor" stroke-width="1.3" fill="none"/></g>';
  function ridgeSVG() {
    var hikers = [[262, 88, 1], [304, 78, .96], [346, 67, .92]].map(function (h) {
      return '<g transform="translate(' + h[0] + ' ' + (h[1] - 40 * h[2]) + ') scale(' + h[2] + ')">' + HIKER + '</g>';
    }).join('');
    return '<svg viewBox="0 0 1440 160" preserveAspectRatio="xMidYMax slice" focusable="false">' +
      '<path class="hmr-ridge-back" d="M0 160 L0 92 L120 60 L210 84 L330 30 L420 70 L520 46 L640 88 L760 40 L860 66 L980 24 L1090 62 L1200 38 L1320 76 L1440 52 L1440 160 Z"/>' +
      '<path class="hmr-ridge-front" d="M0 160 L0 126 L120 112 L210 104 L262 88 L304 78 L346 67 L400 52 L470 84 L600 110 L760 98 L900 118 L1060 102 L1220 120 L1340 104 L1440 116 L1440 160 Z"/>' +
      '<g class="hmr-ridge-team">' + hikers + '<path d="M400 52 v-22" stroke="currentColor" stroke-width="1.4"/><path d="M400 30 l14 5 -14 5z" fill="#f06225"/></g>' +
    '</svg>';
  }
  function summitSVG() {
    return '<svg class="hmr-summit" viewBox="0 0 200 90" preserveAspectRatio="xMaxYMax meet" aria-hidden="true" focusable="false">' +
      '<path d="M0 90 L52 46 L74 60 L118 12 L146 40 L164 30 L200 62 L200 90 Z" fill="currentColor" opacity=".07"/>' +
      '<path d="M118 12 v-12" stroke="#f06225" stroke-width="1.2"/><path d="M118 0 l10 3.5 -10 3.5z" fill="#f06225"/></svg>';
  }

  /* Two reviews on a trek / expedition page: the ones written about this trip
     if we have them, otherwise the strongest recent ones. */
  function renderTripReviews() {
    var box = document.getElementById('trip-reviews');
    if (!box) return;
    var rows = list();
    var s = src();
    if (!rows.length) { box.closest('[data-hmr-wrap]') && (box.closest('[data-hmr-wrap]').hidden = true); return; }
    var m = location.pathname.match(/\/(?:treks|expeditions(?:\/peaks)?)\/([^/?#]+)/);
    var slug = m ? decodeURIComponent(m[1]) : '';
    var mine = rows.filter(function (r) { return r.tripSlug && r.tripSlug === slug; });
    var pick = (mine.length ? mine : rows).slice(0, 2);
    var head = document.getElementById('trip-reviews-head');
    if (head) {
      head.innerHTML = '<div><span class="hmr-panel-kind">' + CHECK + (mine.length ? 'Reviews of this trip' : 'What travellers say') + '</span></div>' +
        (s && s.url ? '<a class="hmr-trip-all" href="' + esc(s.url) + '" target="_blank" rel="noopener">' +
          'All ' + esc(s.reviewCount) + ' reviews on ' + esc(s.sourceName || 'Tripadvisor') + EXT + '</a>' : '');
    }
    box.innerHTML = pick.map(cardHTML).join('');
  }

  function renderSection() {
    var track = document.getElementById('reviews-track');
    if (!track) return;
    var panel = document.getElementById('reviews-panel');
    var rows = list();
    var s = src();
    if (!rows.length && !s) {
      var sec = document.getElementById('reviews');
      if (sec) sec.hidden = true;
      return;
    }
    if (panel) panel.innerHTML = panelHTML(s) + summitSVG();
    track.innerHTML = rows.map(function (r, i) { return cardHTML(r, i, { media: true }); }).join('');
    var flags = document.querySelector('[data-hmr-flags]');
    if (flags && !flags.firstChild) flags.innerHTML = flagsSVG();
    var ridge = document.querySelector('[data-hmr-ridge]');
    if (ridge && !ridge.firstChild) ridge.innerHTML = ridgeSVG();
    wireArrows(track);
  }

  function wireArrows(track) {
    var wrap = track.parentNode;
    [].slice.call(document.querySelectorAll('[data-hmr-scroll]')).forEach(function (btn) {
      if (btn.dataset.hmrDone) return;
      btn.dataset.hmrDone = '1';
      btn.addEventListener('click', function () {
        var card = track.querySelector('.hmr-card');
        var step = card ? card.getBoundingClientRect().width + 20 : track.clientWidth * 0.8;
        track.scrollBy({ left: btn.dataset.hmrScroll === 'prev' ? -step : step, behavior: 'smooth' });
      });
    });
    var sync = function () {
      var max = track.scrollWidth - track.clientWidth - 2;
      [].slice.call(document.querySelectorAll('[data-hmr-scroll]')).forEach(function (b) {
        b.disabled = b.dataset.hmrScroll === 'prev' ? track.scrollLeft <= 2 : track.scrollLeft >= max;
      });
    };
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
    if (wrap) wrap.dataset.hmrReady = '1';
  }

  /* --------------------------------------------------------------- styles
     Injected here so every page gets the pill without touching 14 stylesheets. */
  var CSS = '' +
    '.hmr-bub{display:inline-flex;align-items:center;gap:2px;color:' + TA_GREEN + ';line-height:0;}' +
    '.hmr-ico{width:13px;height:13px;flex:none;}' +
    /* compact pill */
    '.hmr-pill{display:inline-flex;align-items:center;gap:.5rem;padding:.45rem .7rem;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);' +
      'font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:#c9ced6;text-decoration:none;transition:border-color .25s,color .25s;}' +
    'a.hmr-pill:hover{border-color:' + TA_GREEN + ';color:#fff;}' +
    '.hmr-pill-score{font-family:Oswald,sans-serif;font-size:15px;letter-spacing:.02em;color:#fff;}' +
    '.hmr-pill-txt b{font-weight:500;color:#fff;}' +
    '.light-mode .hmr-pill{border-color:rgba(28,30,33,.16);color:#4b5158;}' +
    '.light-mode .hmr-pill-score,.light-mode .hmr-pill-txt b{color:#16181b;}' +
    /* review cards — shared by the homepage rail and the trip pages */
    '.hmr-card{position:relative;display:flex;flex-direction:column;border:1px solid var(--border);' +
    'background:linear-gradient(180deg,rgba(27,30,34,.92),rgba(20,22,25,.92));padding:1.4rem 1.3rem 1.2rem;' +
    'transition:border-color .3s ease,transform .4s cubic-bezier(.2,.7,.2,1);}' +
    '.hmr-card::after{content:"\\201C";position:absolute;top:.35rem;right:.75rem;font-family:Oswald,sans-serif;font-size:4.5rem;line-height:1;color:rgba(240,98,37,.12);pointer-events:none;}' +
    '.hmr-card:hover{border-color:rgba(240,98,37,.45);transform:translateY(-3px);}' +
    '.hmr-card-top{display:flex;align-items:center;justify-content:space-between;gap:.75rem;}' +
    '.hmr-when{font-family:\'IBM Plex Mono\',monospace;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted-foreground);}' +
    '.hmr-title{margin-top:.85rem;font-family:Oswald,sans-serif;font-weight:400;font-size:1.05rem;line-height:1.2;text-transform:uppercase;letter-spacing:.01em;color:#fff;}' +
    '.hmr-quote{margin-top:.7rem;font-family:\'IBM Plex Sans\',sans-serif;font-size:.875rem;line-height:1.65;color:rgba(255,255,255,.72);quotes:none;}' +
    '.hmr-quote::before{content:"\\201C";}' +
    '.hmr-quote::after{content:"\\201D";}' +
    '.hmr-guide{margin-top:.9rem;display:inline-flex;align-items:center;gap:.5rem;font-family:\'IBM Plex Mono\',monospace;font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);}' +
    '.hmr-guide span{padding:.2rem .4rem;border:1px solid rgba(240,98,37,.35);color:rgba(255,255,255,.55);font-size:8.5px;letter-spacing:.18em;}' +
    '.hmr-card-foot{margin-top:auto;padding-top:1rem;}' +
    '.hmr-who{margin-top:.35rem;font-family:\'IBM Plex Mono\',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#fff;}' +
    '.hmr-links{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem .9rem;margin-top:.7rem;padding-top:.7rem;border-top:1px solid rgba(255,255,255,.08);}' +
    '.hmr-trip{display:inline-flex;align-items:center;gap:.45rem;font-family:\'IBM Plex Mono\',monospace;font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);text-decoration:none;transition:gap .25s;}' +
    '.hmr-trip svg{width:14px;height:8px;}' +
    '.hmr-trip:hover{gap:.7rem;text-decoration:underline;text-underline-offset:3px;}' +
    '.hmr-trip.is-plain{color:var(--muted-foreground);}' +
    '.hmr-verify{display:inline-flex;align-items:center;gap:.35rem;font-family:\'IBM Plex Mono\',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted-foreground);text-decoration:none;transition:color .25s;}' +
    '.hmr-verify:hover{color:#00aa6c;}' +
    '.light-mode .hmr-card{background:#fff;border-color:#e3ded5;}' +
    '.light-mode .hmr-title,.light-mode .hmr-who{color:#16181b;}' +
    '.light-mode .hmr-quote{color:#3b4046;}' +
    '.light-mode .hmr-when,.light-mode .hmr-verify{color:#6b7078;}' +
    '.light-mode .hmr-links{border-top-color:rgba(28,30,33,.1);}' +
    '.light-mode .hmr-guide span{color:#6b7078;}' +
    /* photo / silhouette header on the homepage register cards */
    '.hmr-card.has-media{padding:0;overflow:hidden;}' +
    '.hmr-card.has-media::after{display:none;}' +
    '.hmr-media{position:relative;height:9.5rem;overflow:hidden;background:#0f1113;color:#e9e5da;flex:none;}' +
    '.hmr-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.08) brightness(.82);transform:scale(1.02);' +
      'transition:transform 1.1s cubic-bezier(.2,.7,.2,1),filter .6s ease;}' +
    '.hmr-card:hover .hmr-media img{transform:scale(1.09);filter:grayscale(1) contrast(1.15) brightness(.95);}' +
    '.hmr-media::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(12,13,15,.92) 0%,rgba(12,13,15,.25) 55%,rgba(12,13,15,.45) 100%);pointer-events:none;}' +
    '.hmr-media.is-drawn{background:linear-gradient(180deg,#23262b,#121417);}' +
    '.hmr-scene{position:absolute;inset:0;width:100%;height:100%;}' +
    '.hmr-media-bub{position:absolute;z-index:1;top:.7rem;left:.75rem;display:inline-flex;padding:.3rem .4rem;background:rgba(12,13,15,.6);border:1px solid rgba(255,255,255,.12);}' +
    '.hmr-media-when{position:absolute;z-index:1;top:.8rem;right:.8rem;font-family:"IBM Plex Mono",monospace;font-size:8.5px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.75);}' +
    '.hmr-media-trip{position:absolute;z-index:1;left:.85rem;right:.85rem;bottom:.7rem;font-family:Oswald,sans-serif;font-size:1.05rem;line-height:1.1;letter-spacing:.04em;text-transform:uppercase;color:#fff;}' +
    '.hmr-media-trip::before{content:"";display:block;width:18px;height:1px;margin-bottom:.45rem;background:#f06225;}' +
    '.hmr-card-body{display:flex;flex-direction:column;flex:1;padding:1rem 1.1rem 1rem;}' +
    '.hmr-card.has-media .hmr-title{margin-top:0;}' +
    '.hmr-who-row{display:flex;align-items:center;gap:.65rem;}' +
    '.hmr-avatar{flex:none;display:inline-flex;align-items:center;justify-content:center;width:2.1rem;height:2.1rem;border-radius:50%;border:1px solid rgba(240,98,37,.5);' +
      'background:rgba(240,98,37,.08);font-family:Oswald,sans-serif;font-size:.8rem;letter-spacing:.06em;color:#f06225;}' +
    '.hmr-who-row .hmr-who{margin-top:0;display:flex;flex-direction:column;gap:.2rem;}' +
    '.hmr-who small{font-size:8.5px;letter-spacing:.12em;color:var(--muted-foreground);}' +
    '.light-mode .hmr-card-body .hmr-who small{color:#6b7078;}' +
    '.light-mode .hmr-media.is-drawn{background:linear-gradient(180deg,#e9e5dc,#d8d3c8);color:#1c1e21;}' +
    '.light-mode .hmr-media.is-drawn .hmr-media-when{color:rgba(28,30,33,.7);}' +
    '.light-mode .hmr-media.is-drawn::after{background:linear-gradient(to top,rgba(20,22,25,.78),transparent 70%);}' +
    '@media (prefers-reduced-motion:reduce){.hmr-media img{transition:none;}.hmr-card:hover .hmr-media img{transform:scale(1.02);}}' +
    /* the block on a trek / expedition page */
    '.hmr-trip-block{display:grid;gap:1rem;}' +
    '@media (min-width:768px){.hmr-trip-block{grid-template-columns:repeat(2,minmax(0,1fr));}}' +
    '.hmr-trip-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1.1rem;}' +
    '.hmr-trip-head .hmr-panel-kind{display:inline-flex;align-items:center;gap:.45rem;font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:var(--accent,#f06225);}' +
    '.hmr-trip-all{display:inline-flex;align-items:center;gap:.5rem;font-family:\'IBM Plex Mono\',monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent,#f06225);text-decoration:none;}' +
    '.hmr-trip-all:hover{text-decoration:underline;text-underline-offset:3px;}' +
    '';

  function injectCSS() {
    if (document.getElementById('hmr-css')) return;
    var st = document.createElement('style');
    st.id = 'hmr-css';
    st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  function boot() {
    injectCSS();
    renderPills();
    renderSection();
    renderTripReviews();
  }
  window.HMAReviews = { render: boot, pill: function (o) { return pillHTML(src(), o); }, bubbles: bubbles };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
