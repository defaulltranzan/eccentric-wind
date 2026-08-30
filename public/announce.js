/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — shared announcement bar
   One self-contained module. Rotates between the standing booking notice
   and any live trail advisory. If a page already has a static
   #announcement-bar it re-uses that element (so per-page scroll-hide keeps
   working); otherwise it creates one at the top of <body>.

   ── TO EDIT THE MESSAGES ──────────────────────────────────────────────────
   Change the MESSAGES array below. Remove the advisory entry once the
   Langtang route re-opens (leaving a single entry just shows it statically).
   ========================================================================== */
(function () {
  'use strict';
  if (window.__hmeAnnounceInstalled) return;
  window.__hmeAnnounceInstalled = true;

  var MESSAGES = [
    {
      tag: '2026 Expeditions',
      full: '⚡ Autumn 2026 Sagarmatha & Annapurna Peak Booking Open — Guaranteed Small Groups',
      short: '⚡ Autumn 2026 Bookings Open'
    },
    {
      tag: 'Trail Advisory',
      alert: true,
      full: '⚠ Flash flooding in Nepal — the Langtang Valley trek is closed until further notice',
      short: '⚠ Langtang Valley trek closed until further notice'
    }
  ];

  var CTA = { label: 'All Circuits', href: '/expeditions' };
  var ROTATE_MS = 6000;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wideMQ = window.matchMedia ? window.matchMedia('(min-width: 640px)') : { matches: true };

  // ---- element (re-use static bar if present) ----------------------------
  var bar = document.getElementById('announcement-bar');
  var created = false;
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'announcement-bar';
    created = true;
  }
  bar.className = 'announcement-bar sticky top-0 z-50 bg-accent text-white text-[11px] font-mono py-2 px-6 shadow-md';
  bar.innerHTML =
    '<div class="max-w-7xl mx-auto flex items-center justify-between gap-4">' +
      '<div class="flex items-center gap-2 min-w-0" role="status" aria-live="polite">' +
        '<span id="hme-annc-tag" class="shrink-0 rounded px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold"></span>' +
        '<span id="hme-annc-msg" class="truncate"></span>' +
      '</div>' +
      '<a id="hme-annc-cta" class="shrink-0 hover:underline font-semibold flex items-center gap-1 text-[10px] uppercase tracking-widest" href="' + CTA.href + '">' +
        CTA.label + ' <i class="fa-solid fa-arrow-right text-[8px]"></i></a>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent =
    '#announcement-bar{transition:transform .3s ease-in-out}' +
    '#announcement-bar.announcement-hidden{transform:translateY(-100%)}' +
    '#hme-annc-msg,#hme-annc-tag{transition:opacity .3s ease}' +
    '#hme-annc-tag{background:rgba(0,0,0,.3)}' +
    '#hme-annc-tag.is-alert{background:rgba(0,0,0,.55)}';

  function mount() {
    if (!document.body) return;
    document.head.appendChild(style);
    if (created) document.body.insertBefore(bar, document.body.firstChild);
    render(0);
    start();
    bindScrollHide();
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);

  // ---- rotation ---------------------------------------------------------
  var idx = 0, timer = null;
  var tagEl, msgEl;

  function text(m) { return wideMQ.matches ? m.full : (m.short || m.full); }

  function render(i) {
    tagEl = document.getElementById('hme-annc-tag');
    msgEl = document.getElementById('hme-annc-msg');
    if (!tagEl || !msgEl) return;
    var m = MESSAGES[i];
    tagEl.textContent = m.tag;
    tagEl.classList.toggle('is-alert', !!m.alert);
    msgEl.textContent = text(m);
  }

  function swap() {
    var next = (idx + 1) % MESSAGES.length;
    if (next === idx) return;
    if (reduceMotion) { idx = next; render(idx); return; }
    tagEl.style.opacity = msgEl.style.opacity = '0';
    setTimeout(function () {
      idx = next;
      render(idx);
      tagEl.style.opacity = msgEl.style.opacity = '1';
    }, 300);
  }

  function start() {
    if (MESSAGES.length < 2 || timer) return;
    timer = setInterval(swap, ROTATE_MS);
  }
  function stop() { clearInterval(timer); timer = null; }

  bar.addEventListener('mouseenter', stop);
  bar.addEventListener('mouseleave', start);
  if (wideMQ.addEventListener) wideMQ.addEventListener('change', function () { render(idx); });
  window.addEventListener('resize', function () { render(idx); }, { passive: true });

  // ---- scroll hide (idempotent with any page-level handler) -------------
  function bindScrollHide() {
    var lastY = window.pageYOffset || 0;
    window.addEventListener('scroll', function () {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (y > lastY && y > 60) bar.classList.add('announcement-hidden');
      else bar.classList.remove('announcement-hidden');
      lastY = y <= 0 ? 0 : y;
    }, { passive: true });
  }
})();
