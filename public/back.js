/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — shared "back" control  (single source of truth)
   A small self-contained module, included on every page. It drops one fixed
   button in the top-left "floating controls" layer — the mirror of the ⊕
   "Explore" button (menu.js) on the right — so a visitor can step back to
   wherever they came from.

     • Only appears when there is history to go back to (history.length > 1).
     • Slides in after a short scroll, so it never sits over the header logo
       at the very top (same idea as the Explore button).
     • Hidden while the full-screen Explore overlay is open.
     • Styling matches #hme-menu-btn: thin accent border, dark glass, IBM Plex
       Mono micro-label, Oswald-free — pure field-instrument look.

   Revert: delete this file + the <script src="/back.js"> tags.
   ========================================================================== */
(function () {
  'use strict';
  if (window.__hmeBackInstalled) return;
  window.__hmeBackInstalled = true;

  // Nowhere to go back to (opened in a fresh tab / first page of the visit).
  if (!window.history || window.history.length <= 1) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── chevron — same stroke language as the nav caret ─────────────────────
  var ICON = '<svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true">' +
    '<path d="M9 1L3.5 7 9 13" fill="none" stroke="currentColor" ' +
    'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var css = '' +
    '#hme-back-btn{position:fixed;left:1.1rem;top:3.9rem;z-index:60;display:flex;align-items:center;gap:.5rem;' +
    'height:2.9rem;padding:0 .95rem;border:1px solid rgba(240,98,37,.45);background:rgba(16,18,21,.72);' +
    'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:var(--accent,#f06225);' +
    'font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;' +
    'cursor:pointer;opacity:0;visibility:hidden;' +
    'transition:transform .18s cubic-bezier(.2,.7,.3,1),border-color .2s,background .2s,box-shadow .2s,opacity .3s ease,visibility .3s ease;' +
    'box-shadow:0 8px 24px -8px rgba(0,0,0,.5)}' +
    '#hme-back-btn.hme-show{opacity:1;visibility:visible}' +
    '#hme-back-btn:hover{transform:translateY(-2px);border-color:var(--accent,#f06225);background:rgba(240,98,37,.12)}' +
    '#hme-back-btn:active{transform:translateY(0) scale(.96)}' +
    '#hme-back-btn svg{transition:transform .3s cubic-bezier(.2,.7,.3,1)}' +
    '#hme-back-btn:hover svg{transform:translateX(-3px)}' +
    '#hme-back-btn .hme-bb-label{display:none}' +
    '@media(min-width:400px){#hme-back-btn .hme-bb-label{display:inline}}' +
    '@media(prefers-reduced-motion:reduce){' +
    '#hme-back-btn{transition:opacity .2s ease,visibility .2s ease!important}' +
    '#hme-back-btn:hover,#hme-back-btn:active{transform:none}' +
    '#hme-back-btn:hover svg{transform:none}}';

  var styleEl = document.createElement('style');
  styleEl.textContent = css;

  var btn = document.createElement('button');
  btn.id = 'hme-back-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Go back to the previous page');
  btn.innerHTML = ICON + '<span class="hme-bb-label">Back</span>';
  btn.addEventListener('click', function () {
    // If a same-origin referrer exists we know back() lands on our own page;
    // otherwise back() still returns the visitor to wherever they came from.
    window.history.back();
  });

  // ── visibility ─────────────────────────────────────────────────────────
  //  Appear after the header has scrolled away; never while the Explore
  //  overlay is open.
  var SHOW_AFTER = 72;
  function menuOpen() {
    var ov = document.getElementById('hme-menu');
    return !!(ov && ov.classList.contains('open'));
  }
  function update() {
    var show = window.pageYOffset > SHOW_AFTER && !menuOpen();
    btn.classList.toggle('hme-show', show);
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { update(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setTimeout(update, 0);
  });

  function mount() {
    if (!document.body) return;
    document.body.appendChild(styleEl);
    document.body.appendChild(btn);
    // react to the Explore overlay opening / closing
    var ov = document.getElementById('hme-menu');
    if (ov && window.MutationObserver) {
      new MutationObserver(update).observe(ov, { attributes: true, attributeFilter: ['class'] });
    } else {
      document.addEventListener('click', function () { setTimeout(update, 0); }, true);
    }
    update();
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
