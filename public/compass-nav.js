/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — compass scroll control
   A fixed cartographic compass, bottom-left on every page.
     · N (north / up)    → scrolls to the top of the page
     · S (south / down)  → scrolls to the bottom of the page
     · W / E             → appear only when a horizontal card-scroller
                           (.hme-hscroll) is on screen; W jumps that row to its
                           left end, E to its right end. The rose grows into a
                           four-point cross while they are shown.
   The needle swings toward whichever direction still has road to travel.
   Brand tokens only (var(--accent) / --card / --border / --foreground).
   Self-injecting, like menu.js / announce.js.
   Revert: delete this file + every <script src="/compass-nav.js"> tag.
   ========================================================================== */
(function () {
  'use strict';
  if (window.__hmeCompassNav) return;
  window.__hmeCompassNav = true;

  var REDUCED = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EDGE = 60; // px from an end before that arrow is considered "done"

  /* ---- styles ---------------------------------------------------------- */
  var css = [
    '#hme-compass{position:fixed;left:1.1rem;bottom:1.1rem;z-index:45;',
      'display:flex;flex-direction:column;align-items:center;width:max-content;',
      'font-family:"IBM Plex Mono",monospace;',
      'background:var(--card,#22252a);border:1px solid var(--border,#2e3239);',
      'border-radius:3px;overflow:hidden;backdrop-filter:blur(10px);',
      'box-shadow:0 12px 34px -12px rgba(0,0,0,.6);',
      'opacity:0;visibility:hidden;transform:translateY(8px);',
      'transition:opacity .3s ease,visibility .3s ease,transform .3s ease}',
    '#hme-compass.hme-show{opacity:1;visibility:visible;transform:translateY(0)}',

    '.hme-cpt{appearance:none;-webkit-appearance:none;background:none;border:0;',
      'cursor:pointer;color:var(--muted-foreground,#9ca3af);',
      'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;',
      'padding:.5rem 0;line-height:1;width:2.9rem;',
      'transition:color .2s ease,background-color .2s ease}',
    '.hme-cpt svg{width:12px;height:12px;transition:transform .3s cubic-bezier(.2,.7,.3,1)}',
    '.hme-cpt .hme-cpt-l{font-size:9px;letter-spacing:.14em;font-weight:600}',
    '.hme-cpt:hover{color:var(--accent,#f06225);background:rgba(240,98,37,.10)}',
    '.hme-cpt:hover svg{transform:translate(var(--hme-nx,0),var(--hme-ny,0))}',
    '.hme-cpt:active{background:rgba(240,98,37,.18)}',
    '.hme-cpt[disabled]{color:var(--border,#3a3f47);cursor:default;pointer-events:none}',
    '#hme-cp-n{--hme-ny:-2px}',
    '#hme-cp-s{--hme-ny:2px}',
    '#hme-cp-w{--hme-nx:-2px}',
    '#hme-cp-e{--hme-nx:2px}',

    /* middle row: W · rose · E */
    '.hme-cp-mid{display:flex;align-items:stretch;justify-content:center;',
      'border-top:1px solid var(--border,#2e3239);border-bottom:1px solid var(--border,#2e3239);',
      'background:rgba(0,0,0,.12)}',
    '.hme-cp-rose{display:flex;align-items:center;justify-content:center;width:2.9rem;height:26px}',
    '.hme-cp-rose svg{width:14px;height:14px;transition:transform .5s cubic-bezier(.2,.7,.3,1)}',
    /* W / E hidden until a horizontal scroller is in play */
    '.hme-cpt-h{display:none;padding:.35rem 0}',
    '#hme-cp-w{border-right:1px solid var(--border,#2e3239)}',
    '#hme-cp-e{border-left:1px solid var(--border,#2e3239)}',
    '#hme-compass.hme-h .hme-cpt-h{display:flex}',
    '#hme-compass.hme-h .hme-cp-mid{background:rgba(240,98,37,.06)}',

    '@media(prefers-reduced-motion:reduce){',
      '#hme-compass,.hme-cpt svg,.hme-cp-rose svg{transition:opacity .2s ease,visibility .2s ease!important}}'
  ].join('');

  var style = document.createElement('style');
  style.id = 'hme-compass-style';
  style.textContent = css;
  document.head.appendChild(style);

  /* ---- markup --------------------------------------------------------- */
  var rose =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M12 1 L14.4 9.6 L12 12 L9.6 9.6 Z" fill="var(--accent,#f06225)"/>' +
      '<path d="M12 23 L9.6 14.4 L12 12 L14.4 14.4 Z" fill="var(--muted-foreground,#9ca3af)"/>' +
      '<path d="M1 12 L9.6 9.6 L12 12 L9.6 14.4 Z" fill="var(--muted-foreground,#9ca3af)"/>' +
      '<path d="M23 12 L14.4 14.4 L12 12 L14.4 9.6 Z" fill="var(--muted-foreground,#9ca3af)"/>' +
    '</svg>';
  var upArrow =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 L20 15 L13 15 L13 21 L11 21 L11 15 L4 15 Z" fill="currentColor"/></svg>';
  var downArrow =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20 L4 9 L11 9 L11 3 L13 3 L13 9 L20 9 Z" fill="currentColor"/></svg>';
  var leftArrow =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12 L15 4 L15 11 L21 11 L21 13 L15 13 L15 20 Z" fill="currentColor"/></svg>';
  var rightArrow =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12 L9 4 L9 11 L3 11 L3 13 L9 13 L9 20 Z" fill="currentColor"/></svg>';

  var wrap = document.createElement('nav');
  wrap.id = 'hme-compass';
  wrap.setAttribute('aria-label', 'Scroll the page');
  wrap.innerHTML =
    '<button type="button" id="hme-cp-n" class="hme-cpt" aria-label="North — scroll to top">' +
      upArrow + '<span class="hme-cpt-l">N</span></button>' +
    '<div class="hme-cp-mid">' +
      '<button type="button" id="hme-cp-w" class="hme-cpt hme-cpt-h" aria-label="West — scroll this row to the start">' +
        leftArrow + '<span class="hme-cpt-l">W</span></button>' +
      '<div class="hme-cp-rose" id="hme-cp-rose">' + rose + '</div>' +
      '<button type="button" id="hme-cp-e" class="hme-cpt hme-cpt-h" aria-label="East — scroll this row to the end">' +
        rightArrow + '<span class="hme-cpt-l">E</span></button>' +
    '</div>' +
    '<button type="button" id="hme-cp-s" class="hme-cpt" aria-label="South — scroll to bottom">' +
      downArrow + '<span class="hme-cpt-l">S</span></button>';

  function mount() {
    if (document.getElementById('hme-compass')) return;
    document.body.appendChild(wrap);
    wire();
    update();
    syncH();
  }

  /* ---- vertical behaviour ------------------------------------------- */
  function docHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  }
  function vScroll(y) {
    window.scrollTo({ top: y, behavior: REDUCED ? 'auto' : 'smooth' });
  }

  /* ---- horizontal behaviour --------------------------------------- */
  var curH = null;         // the row W/E currently act on

  function glideX(el, to) {
    if (!el) return;
    to = Math.max(0, Math.min(to, el.scrollWidth - el.clientWidth));
    el.scrollTo({ left: to, behavior: REDUCED ? 'auto' : 'smooth' });
    setTimeout(syncH, 450);
  }

  function hRows() {
    return [].slice.call(document.querySelectorAll('.hme-hscroll'));
  }
  function scrollableX(el) {
    return el && (el.scrollWidth - el.clientWidth) > 8;
  }
  function onScreen(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.top < vh - 40 && r.bottom > 80 && r.width > 0;
  }
  function pickRow() {
    if (curH && document.contains(curH) && scrollableX(curH) && onScreen(curH)) return curH;
    var rows = hRows();
    for (var i = 0; i < rows.length; i++) {
      if (scrollableX(rows[i]) && onScreen(rows[i])) return rows[i];
    }
    return null;
  }
  function syncH() {
    var row = pickRow();
    curH = row;
    wrap.classList.toggle('hme-h', !!row);
    var w = document.getElementById('hme-cp-w');
    var e = document.getElementById('hme-cp-e');
    if (!row) { if (w) w.disabled = true; if (e) e.disabled = true; return; }
    var max = row.scrollWidth - row.clientWidth - 4;
    if (w) w.disabled = row.scrollLeft <= 4;
    if (e) e.disabled = row.scrollLeft >= max;
  }
  window.hmeSyncCompassH = syncH;

  function wire() {
    document.getElementById('hme-cp-n').addEventListener('click', function () { vScroll(0); });
    document.getElementById('hme-cp-s').addEventListener('click', function () { vScroll(docHeight()); });
    document.getElementById('hme-cp-w').addEventListener('click', function () {
      if (curH) glideX(curH, 0);
    });
    document.getElementById('hme-cp-e').addEventListener('click', function () {
      if (curH) glideX(curH, curH.scrollWidth);
    });
    // any horizontal row the user touches becomes the active one
    document.addEventListener('scroll', function (ev) {
      var t = ev.target;
      if (t && t.nodeType === 1 && t.classList && t.classList.contains('hme-hscroll')) {
        curH = t;
        syncH();
      }
    }, true);
    document.addEventListener('pointerover', function (ev) {
      var row = ev.target && ev.target.closest && ev.target.closest('.hme-hscroll');
      if (row && row !== curH) { curH = row; syncH(); }
    }, { passive: true });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { update(); syncH(); ticking = false; });
  }

  function update() {
    var y = window.scrollY || window.pageYOffset;
    var vh = window.innerHeight;
    var max = docHeight() - vh;
    var scrollable = max > 240;

    wrap.classList.toggle('hme-show', (scrollable && y > 120) || !!pickRow());

    var atTop = y <= EDGE;
    var atBottom = y >= max - EDGE;
    var n = document.getElementById('hme-cp-n');
    var s = document.getElementById('hme-cp-s');
    if (n) n.disabled = atTop;
    if (s) s.disabled = atBottom;

    var roseSvg = document.querySelector('#hme-cp-rose svg');
    if (roseSvg && !REDUCED) {
      var progress = max > 0 ? y / max : 0;
      roseSvg.style.transform = 'rotate(' + (progress * 12 - 6).toFixed(1) + 'deg)';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { update(); syncH(); });
  // catch layout / tab-switch changes that don't fire scroll
  setInterval(syncH, 900);

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
