/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — card rail feel  (2026-09-18)
   ---------------------------------------------------------------------------
   Makes every horizontal row of cards feel like one object you are moving,
   the way the good travel sites do it:

     • depth      cards ease down in scale and dim as they leave the middle
     • parallax   each card's photo drifts a few pixels against the scroll
     • drag       click-and-drag (or flick) to scroll, with momentum
     • rails      a hairline progress bar under each row
     • keys       ← / → move one card, Home / End jump to the ends

   Everything is driven off one rAF per frame and CSS custom properties, so it
   stays smooth on a phone. It switches itself off for `prefers-reduced-motion`.

   TURNING IT OFF (revert):
     1. add  <script>window.HMA_CARD_FX = false;</script>  before this file, or
     2. delete the <script src="/card-fx.js"> tags, or
     3. in the browser console: HMACardFX.off()  — off until the next reload.
   ========================================================================== */
(function () {
  'use strict';
  if (window.__hmeFxInstalled) return;
  window.__hmeFxInstalled = true;

  var OFF = window.HMA_CARD_FX === false;
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Rows we treat as rails, and what counts as a card inside them. */
  var RAILS = [
    ['#flagship-grid', ':scope > div'],
    ['#dispatches-container', ':scope > article, :scope > a, :scope > div'],
    ['#reviews-track', '.hmr-card'],
    ['#compare-home .cmp-grid', '.cmp-card'],
    ['[data-fx-rail]', ':scope > *']
  ];

  var CSS = '' +
    '.fx-rail{cursor:grab;}' +
    '.fx-rail.is-dragging{cursor:grabbing;scroll-snap-type:none!important;scroll-behavior:auto!important;}' +
    '.fx-rail.is-dragging *{pointer-events:none;}' +
    '.fx-card{transform:scale(var(--fx-s,1));opacity:var(--fx-o,1);' +
      'transition:transform .45s cubic-bezier(.2,.7,.2,1),opacity .45s ease,border-color .3s ease,box-shadow .35s ease;will-change:transform;}' +
    '.fx-card > img,.fx-card .fx-shot img,.fx-card .hmb-card-img,.fx-card .cmp-shot img{transform:translate3d(var(--fx-px,0),0,0) scale(1.06);transition:transform .5s cubic-bezier(.2,.7,.2,1);}' +
    '.fx-bar{position:relative;height:1px;margin-top:.9rem;background:rgba(255,255,255,.08);overflow:hidden;}' +
    '.fx-bar i{position:absolute;top:0;bottom:0;left:0;display:block;background:var(--accent,#f06225);width:var(--fx-w,20%);transform:translateX(var(--fx-x,0));transition:transform .18s linear,width .3s ease;}' +
    '.light-mode .fx-bar{background:rgba(28,30,33,.12);}' +
    '@media (prefers-reduced-motion: reduce){.fx-card,.fx-card img{transition:none!important;transform:none!important;opacity:1!important;}}';

  function injectCSS() {
    if (document.getElementById('fx-css')) return;
    var s = document.createElement('style');
    s.id = 'fx-css';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  var rails = [];

  function refresh(rail, cardSel) {
    var entry = null;
    for (var i = 0; i < rails.length; i++) if (rails[i].rail === rail) entry = rails[i];
    if (!entry) return false;
    var cards = [].slice.call(rail.querySelectorAll(cardSel)).filter(function (el) { return el.offsetWidth > 40; });
    // a rail can be re-rendered with the same number of (brand new) nodes, so
    // compare the nodes themselves, not just how many there are
    var same = cards.length === entry.cards.length && cards.every(function (el, i) { return el === entry.cards[i]; });
    if (same) return true;
    entry.cards.forEach(function (c) { c.classList.remove('fx-card'); });
    cards.forEach(function (c) { c.classList.add('fx-card'); });
    entry.cards = cards;
    paint(entry);
    return true;
  }

  function setup(rail, cardSel) {
    // rows are filled in by other scripts, so re-collect the cards on a rescan
    if (rail.dataset.fxDone) { refresh(rail, cardSel); return; }
    // only rows that actually scroll sideways
    var horizontal = getComputedStyle(rail).overflowX;
    if (horizontal !== 'auto' && horizontal !== 'scroll') return;
    rail.dataset.fxDone = '1';
    rail.classList.add('fx-rail');

    var cards = [].slice.call(rail.querySelectorAll(cardSel)).filter(function (el) {
      return el.offsetWidth > 40;
    });
    cards.forEach(function (c) { c.classList.add('fx-card'); });

    var bar = document.createElement('div');
    bar.className = 'fx-bar';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<i></i>';
    if (rail.parentNode) rail.parentNode.insertBefore(bar, rail.nextSibling);

    var entry = { rail: rail, cards: cards, bar: bar.firstChild, raf: null, moT: null };
    rails.push(entry);

    /* other scripts rebuild these rows (routes tab switch, journal, reviews),
       so watch for new cards instead of guessing with timers */
    if (window.MutationObserver) {
      var mo = new MutationObserver(function () {
        clearTimeout(entry.moT);
        entry.moT = setTimeout(function () { refresh(rail, cardSel); }, 60);
      });
      mo.observe(rail, { childList: true });
    }

    var onScroll = function () { schedule(entry); };
    rail.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    /* drag to scroll — pointer events cover mouse, pen and stylus.
       Touch keeps the browser's own (better) native scrolling. */
    var down = false, startX = 0, startLeft = 0, moved = 0, lastX = 0, lastT = 0, vel = 0;
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch' || e.button !== 0) return;
      down = true; moved = 0; vel = 0;
      startX = lastX = e.clientX; startLeft = rail.scrollLeft; lastT = performance.now();
    });
    rail.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < 4) return;
      if (!moved) { rail.classList.add('is-dragging'); try { rail.setPointerCapture(e.pointerId); } catch (_) {} }
      moved = 1;
      var now = performance.now();
      if (now > lastT) vel = (e.clientX - lastX) / (now - lastT);
      lastX = e.clientX; lastT = now;
      rail.scrollLeft = startLeft - dx;
      e.preventDefault();
    });
    var release = function (e) {
      if (!down) return;
      down = false;
      rail.classList.remove('is-dragging');
      try { rail.releasePointerCapture(e.pointerId); } catch (_) {}
      if (!moved) return;
      // a flick keeps going for a moment, then settles on a card
      var v = vel * 180;
      if (Math.abs(v) > 40) rail.scrollBy({ left: -v, behavior: 'smooth' });
      // swallow the click that would follow a drag
      var kill = function (ev) { ev.stopPropagation(); ev.preventDefault(); };
      rail.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(function () { rail.removeEventListener('click', kill, true); }, 0);
    };
    rail.addEventListener('pointerup', release);
    rail.addEventListener('pointercancel', release);
    rail.addEventListener('pointerleave', release);

    /* keyboard: the rail itself is focusable for people who do not use a mouse */
    if (!rail.hasAttribute('tabindex')) rail.tabIndex = 0;
    rail.addEventListener('keydown', function (e) {
      var step = cards[0].getBoundingClientRect().width + 20;
      if (e.key === 'ArrowRight') { rail.scrollBy({ left: step, behavior: 'smooth' }); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { rail.scrollBy({ left: -step, behavior: 'smooth' }); e.preventDefault(); }
      else if (e.key === 'Home') { rail.scrollTo({ left: 0, behavior: 'smooth' }); e.preventDefault(); }
      else if (e.key === 'End') { rail.scrollTo({ left: rail.scrollWidth, behavior: 'smooth' }); e.preventDefault(); }
    });

    paint(entry);
  }

  function schedule(entry) {
    if (entry.raf != null) return;
    entry.raf = requestAnimationFrame(function () { entry.raf = null; paint(entry); });
  }

  function paint(entry) {
    var rail = entry.rail;
    var box = rail.getBoundingClientRect();
    var mid = box.left + box.width / 2;
    var reach = box.width / 2 + 60;
    entry.cards.forEach(function (card) {
      var r = card.getBoundingClientRect();
      var d = Math.min(1, Math.abs((r.left + r.width / 2) - mid) / reach);   // 0 centre → 1 edge
      var ease = d * d;
      card.style.setProperty('--fx-s', (1 - ease * 0.05).toFixed(3));
      card.style.setProperty('--fx-o', (1 - ease * 0.35).toFixed(3));
      card.style.setProperty('--fx-px', (((r.left + r.width / 2) - mid) / box.width * -14).toFixed(1) + 'px');
    });
    if (entry.bar) {
      var max = rail.scrollWidth - rail.clientWidth;
      var frac = rail.clientWidth / Math.max(rail.scrollWidth, 1);
      entry.bar.style.setProperty('--fx-w', (frac * 100).toFixed(1) + '%');
      entry.bar.style.setProperty('--fx-x', max > 0 ? ((rail.scrollLeft / max) * ((1 / frac) - 1) * 100).toFixed(2) + '%' : '0');
      entry.bar.parentNode.hidden = max < 4;
    }
  }

  function scan() {
    RAILS.forEach(function (pair) {
      [].slice.call(document.querySelectorAll(pair[0])).forEach(function (rail) {
        try { setup(rail, pair[1]); } catch (_) {}
      });
    });
    rails.forEach(paint);
  }

  function off() {
    document.querySelectorAll('.fx-card').forEach(function (c) {
      c.classList.remove('fx-card');
      c.style.removeProperty('--fx-s'); c.style.removeProperty('--fx-o'); c.style.removeProperty('--fx-px');
    });
    document.querySelectorAll('.fx-rail').forEach(function (r) { r.classList.remove('fx-rail'); });
    document.querySelectorAll('.fx-bar').forEach(function (b) { b.remove(); });
    var css = document.getElementById('fx-css');
    if (css) css.remove();
  }

  window.HMACardFX = { rescan: scan, off: off, on: function () { injectCSS(); scan(); } };

  if (OFF || REDUCED) return;
  injectCSS();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan);
  else scan();
  // rows that are filled in by other scripts (reviews, journal, routes)
  window.addEventListener('load', scan);
  setTimeout(scan, 900);
  setTimeout(scan, 2200);
})();
