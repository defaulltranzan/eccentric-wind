/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — THE HIGH CORRIDOR (homepage hero)
   REVERT-notes § 6a. Everything here is progressive enhancement: with JS off
   the hero is a finished static composition.

   · Depth    — writes --hx/--hy (pointer, eased) and --hp (scroll 0..1) on
                #manifesto; CSS turns those into per-layer transforms. One rAF
                loop, only while the hero is on screen, only when it has work.
   · Altitude — counts the instrument up to 8,848.86 once on load.
   · Clock    — live Kathmandu time (NPT), refreshed every 30 s.
   · Films    — the four expedition clips (formerly hero slides 2–5). Picking
                one swaps the plate to video and retunes the instrument to that
                peak from window.MOUNTAINS; picking it again returns home.
   · Breath   — --ip on #corridor for the statement + rope line.
   ========================================================================== */
(function () {
  'use strict';

  var hero = document.getElementById('manifesto');
  if (!hero || !hero.classList.contains('hc')) return;

  var mq = function (q) { return window.matchMedia && window.matchMedia(q).matches; };
  var REDUCED = mq('(prefers-reduced-motion: reduce)');
  var FINE_POINTER = mq('(hover: hover) and (pointer: fine)');

  var altEl = document.getElementById('hc-alt-num');
  var altLabelEl = document.getElementById('hc-alt-label');
  var coordsEl = document.getElementById('hero-telemetry-coords');
  var regionEl = document.getElementById('hc-region');
  var captionEl = document.getElementById('hc-caption');
  var filmsEl = document.getElementById('hc-films');
  var video = document.getElementById('hc-film');
  var interlude = document.getElementById('corridor');

  var HOME = {
    alt: 8848.86, decimals: 2,
    coords: coordsEl ? coordsEl.textContent : "27°59'N · 86°55'E",
    region: regionEl ? regionEl.textContent : 'Sagarmatha Region · Nepal',
    caption: captionEl ? captionEl.innerHTML : '',
    label: altLabelEl ? altLabelEl.textContent : ''
  };

  /* ---------------- altitude instrument ---------------- */
  var altFrame = 0;
  function fmtAlt(v, decimals) {
    return v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }
  function countTo(target, decimals, from) {
    if (!altEl) return;
    cancelAnimationFrame(altFrame);
    if (REDUCED) { altEl.textContent = fmtAlt(target, decimals); return; }
    var start = null, dur = 1600, a = from == null ? target * 0.72 : from;
    function step(ts) {
      if (start === null) start = ts;
      var k = Math.min(1, (ts - start) / dur);
      var e = 1 - Math.pow(1 - k, 4);
      altEl.textContent = fmtAlt(a + (target - a) * e, decimals);
      if (k < 1) altFrame = requestAnimationFrame(step);
    }
    altFrame = requestAnimationFrame(step);
  }
  var currentAlt = HOME.alt;
  countTo(HOME.alt, HOME.decimals);

  /* ---------------- Kathmandu clock ---------------- */
  var clockEl = document.getElementById('hc-clock');
  var clockFmt = null;
  try { clockFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit', hour12: false }); } catch (e) {}
  function tick() { if (clockEl && clockFmt) clockEl.textContent = clockFmt.format(new Date()); }
  tick();
  var clockTimer = null;

  /* ---------------- depth: pointer + scroll ---------------- */
  var tx = 0, ty = 0, cx = 0, cy = 0, lastP = -1, raf = 0, inView = true;

  function progress() {
    var r = hero.getBoundingClientRect();
    return Math.max(0, Math.min(1, -r.top / Math.max(1, r.height)));
  }

  function frame() {
    raf = 0;
    var moving = false;
    if (FINE_POINTER) {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) moving = true;
      hero.style.setProperty('--hx', cx.toFixed(4));
      hero.style.setProperty('--hy', cy.toFixed(4));
    }
    var p = progress();
    if (Math.abs(p - lastP) > 0.0005) { hero.style.setProperty('--hp', p.toFixed(4)); lastP = p; }
    if (interlude) {
      var ir = interlude.getBoundingClientRect(), vh = window.innerHeight || 800;
      var ip = Math.max(0, Math.min(1, (vh - ir.top) / (vh * 0.75)));
      interlude.style.setProperty('--ip', ip.toFixed(4));
    }
    if (moving && inView) request();
  }
  function request() { if (!raf) raf = requestAnimationFrame(frame); }

  if (!REDUCED) {
    if (interlude) interlude.style.setProperty('--ip', '0');
    if (FINE_POINTER) {
      window.addEventListener('pointermove', function (e) {
        if (!inView) return;
        tx = (e.clientX / window.innerWidth - 0.5) * 2;
        ty = (e.clientY / window.innerHeight - 0.5) * 2;
        request();
      }, { passive: true });
    }
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request, { passive: true });
    request();
  }

  var CAN_OBSERVE = 'IntersectionObserver' in window;
  if (CAN_OBSERVE) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      hero.classList.toggle('is-offscreen', !inView);
      if (inView) {
        tick();
        if (!clockTimer) clockTimer = setInterval(tick, 30000);
      } else {
        clearInterval(clockTimer); clockTimer = null;
        if (video && !video.paused) video.pause();
      }
      if (inView && hero.classList.contains('is-film') && video && video.paused) {
        var pp = video.play(); if (pp && pp.catch) pp.catch(function () {});
      }
    }).observe(hero);
  } else {
    clockTimer = setInterval(tick, 30000);
  }

  /* ---------------- expedition films ---------------- */
  var FILMS = [
    { slug: 'everest', label: 'Everest', src: '/images/Video/Everest.mp4' },
    { slug: 'k2', label: 'K2', src: '/images/Video/K2.mp4' },
    { slug: 'kangchenjunga', label: 'Kangchenjunga', src: '/images/Video/Kanchanjunga.mp4' },
    { slug: 'annapurna', label: 'Annapurna', src: '/images/Video/Annapurna%20mountain.mp4' }
  ];

  function toDMS(v, pos, neg) {
    var a = Math.abs(v), d = Math.floor(a), m = Math.round((a - d) * 60);
    if (m === 60) { d += 1; m = 0; }
    return d + '°' + (m < 10 ? '0' : '') + m + "'" + (v >= 0 ? pos : neg);
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  var M = window.MOUNTAINS || {};
  var films = FILMS.filter(function (f) { return M[f.slug]; });
  var active = null;

  function setPressed() {
    if (!filmsEl) return;
    Array.prototype.forEach.call(filmsEl.querySelectorAll('button'), function (b) {
      b.setAttribute('aria-pressed', b.dataset.film === active ? 'true' : 'false');
    });
  }

  function goHome() {
    active = null;
    hero.classList.remove('is-film');
    if (video) {
      video.classList.remove('is-ready');
      setTimeout(function () { if (!active) video.pause(); }, 1100);
    }
    if (coordsEl) coordsEl.textContent = HOME.coords;
    if (regionEl) regionEl.textContent = HOME.region;
    if (captionEl) captionEl.innerHTML = HOME.caption;
    if (altLabelEl) altLabelEl.textContent = HOME.label;
    countTo(HOME.alt, HOME.decimals, currentAlt);
    currentAlt = HOME.alt;
    setPressed();
  }

  function playFilm(slug) {
    if (active === slug) { goHome(); return; }
    var f = films.filter(function (x) { return x.slug === slug; })[0];
    var m = M[slug];
    if (!f || !m || !video) return;
    active = slug;
    setPressed();

    var elev = +m.elevationM || 0;
    var label = String(m.elevationLabel || '');
    var decimals = /\.\d/.test(label) ? 2 : 0;
    var target = decimals ? parseFloat(label.replace(/[^\d.]/g, '')) : elev;
    countTo(target, decimals, currentAlt);
    currentAlt = target;

    if (coordsEl && m.coordinates) coordsEl.textContent = toDMS(m.coordinates.lat, 'N', 'S') + ' · ' + toDMS(m.coordinates.lon, 'E', 'W');
    if (regionEl) regionEl.textContent = [m.range, m.countryLabel].filter(Boolean).join(' · ');
    if (altLabelEl) altLabelEl.textContent = 'Summit · ' + m.name;
    if (captionEl) captionEl.innerHTML = 'Now showing &mdash; <a href="/expeditions/' + esc(m.slug) + '">' + esc(m.name) + ' · plan this climb</a>';

    video.classList.remove('is-ready');
    hero.classList.add('is-film');
    var src = f.src;
    if (video.getAttribute('src') !== src) {
      video.setAttribute('src', src);
      video.load();
    }
    var onReady = function () {
      video.removeEventListener('canplay', onReady);
      if (active !== slug) return;
      video.classList.add('is-ready');
    };
    if (video.readyState >= 3) onReady(); else video.addEventListener('canplay', onReady);
    var p = video.play(); if (p && p.catch) p.catch(function () {});
  }

  if (filmsEl && films.length && video) {
    filmsEl.innerHTML = '<span class="hc-films-label hidden md:inline">Films</span>' + films.map(function (f, i) {
      return '<button type="button" class="hc-film-btn" data-film="' + esc(f.slug) + '" aria-pressed="false">' +
        '<span class="hidden sm:inline">0' + (i + 1) + ' </span>' + esc(f.label) + '</button>';
    }).join('');
    filmsEl.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-film]');
      if (b) playFilm(b.dataset.film);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && active) goHome();
    });
  }
})();
