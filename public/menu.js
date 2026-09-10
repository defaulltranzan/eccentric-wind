/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — shared navigation  (single source of truth)
   One self-contained module, included on every page. It renders BOTH menus
   from the same NAV list:
     • the desktop header <nav class="hme-nav-primary"> (normalised on load)
     • the full-screen "Explore" overlay (the only nav on mobile)
   Replaces the old per-page #fullscreen-menu markup and the hand-maintained
   per-page header nav (which had drifted — different labels, missing items).
   ========================================================================== */
(function () {
  'use strict';
  if (window.__hmeMenuInstalled) return;
  window.__hmeMenuInstalled = true;

  // Remove any legacy inline menu so there is a single source of truth
  document.addEventListener('DOMContentLoaded', cleanupLegacy);
  cleanupLegacy();
  function cleanupLegacy() {
    document.querySelectorAll('#fullscreen-menu, #menu-trigger').forEach(function (el) { el.remove(); });
  }

  // ── The whole site nav. `short` = header label, `name` = overlay label. ──
  //    `overlayOnly: true` — keep the item in the "Explore" overlay but drop it
  //    from the desktop header nav (used to keep the header lean).
  var NAV = [
    { name: 'Home', short: 'Home', href: '/' },
    { name: 'Trekking Trails', short: 'Treks', href: '/treks' },
    // Phone-only. The homepage's "What kind of trekker are you?" section is
    // `hidden lg:block` (2026-09-10 declutter), so on a phone it is reached from
    // here instead and opens as a sheet. Desktop keeps the inline section and
    // never shows this row. Revert: delete this entry + the mobileOnly/action
    // branches below, and drop `hidden lg:block` from #trek-finder.
    { name: 'What kind of trekker are you?', href: '/#trek-finder',
      overlayOnly: true, mobileOnly: true, action: 'openTrekFinder' },
    { name: 'Compare Treks', short: 'Compare', href: '/compare', overlayOnly: true },
    { name: 'Expedition Atlas', short: 'Expeditions', href: '/expeditions', children: [
      { name: 'The Full Atlas', href: '/expeditions', all: true },
      { name: '8,000 m +', href: '/expeditions/8000m', note: '14 peaks' },
      { name: '7,000 m +', href: '/expeditions/7000m', note: '9 peaks' },
      { name: '6,000 m +', href: '/expeditions/6000m', note: '8 peaks' }
    ]},
    { name: 'Altitude & Safety', short: 'Safety', href: '/altitude-safety' },
    { name: 'Stories', short: 'Stories', href: '/stories' },
    { name: 'About Us', short: 'About', href: '/about' }
  ];

  var path = location.pathname.replace(/\/+$/, '') || '/';
  function isCurrent(href) {
    if (href.indexOf('#') > -1) return false;
    var h = href.replace(/\/+$/, '') || '/';
    if (h === '/') return path === '/';
    return path === h || path.indexOf(h + '/') === 0;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  var CARET = '<svg viewBox="0 0 12 8" width="10" height="7" aria-hidden="true"><path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

  // ========================================================================
  // 1. DESKTOP HEADER NAV  — fill <nav class="hme-nav-primary"> from NAV
  // ========================================================================
  function renderPrimaryNav() {
    var nav = document.querySelector('nav.hme-nav-primary');
    if (!nav) return;
    nav.innerHTML = NAV.filter(function (it) { return !it.overlayOnly; }).map(function (it) {
      var active = isCurrent(it.href) ? ' is-active' : '';
      if (it.children) {
        var open = it.children.some(function (c) { return isCurrent(c.href) && c.href !== '/expeditions'; }) || isCurrent(it.href);
        return '<div class="hme-navgroup">' +
          '<a href="' + it.href + '" class="hme-navlink' + active + '">' + esc(it.short) + '</a>' +
          '<button type="button" class="hme-navdrop-toggle" aria-expanded="false" aria-label="Expedition elevation bands">' + CARET + '</button>' +
          '<div class="hme-navdrop">' +
            it.children.map(function (c) {
              if (c.all) return '<a href="' + c.href + '" class="hme-navdrop-all">' + esc(c.name) + '</a><span class="hme-navdrop-sep"></span>';
              return '<a href="' + c.href + '">' + esc(c.name) + (c.note ? '<span class="hme-navdrop-n">' + esc(c.note) + '</span>' : '') + '</a>';
            }).join('') +
          '</div></div>';
      }
      return '<a href="' + it.href + '" class="hme-navlink' + active + '">' + esc(it.short) + '</a>';
    }).join('');

    // click-to-open dropdown (hover still works via CSS)
    var group = nav.querySelector('.hme-navgroup');
    if (group) {
      var toggle = group.querySelector('.hme-navdrop-toggle');
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        var willOpen = !group.classList.contains('is-open');
        group.classList.toggle('is-open', willOpen);
        toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
      document.addEventListener('click', function (e) {
        if (!group.contains(e.target)) { group.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { group.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
      });
    }
  }
  renderPrimaryNav();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderPrimaryNav);

  // ========================================================================
  // 2. FULL-SCREEN "EXPLORE" OVERLAY
  // ========================================================================
  var COMPASS = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/>' +
    '<path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" fill="currentColor"/></svg>';

  var css = '' +
    '#hme-menu-btn{position:fixed;right:1.1rem;top:3.9rem;z-index:60;display:flex;align-items:center;gap:.5rem;height:2.9rem;padding:0 .9rem;' +
    'border:1px solid rgba(240,98,37,.45);background:rgba(16,18,21,.72);backdrop-filter:blur(8px);color:var(--accent,#f06225);' +
    'font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;cursor:pointer;' +
    'opacity:0;visibility:hidden;' +
    'transition:transform .18s cubic-bezier(.2,.7,.3,1),border-color .2s,background .2s,box-shadow .2s,opacity .3s ease,visibility .3s ease;box-shadow:0 8px 24px -8px rgba(0,0,0,.5)}' +
    '#hme-menu-btn.hme-show{opacity:1;visibility:visible}' +
    '#hme-menu-btn:hover{transform:translateY(-2px);border-color:var(--accent,#f06225);background:rgba(240,98,37,.12)}' +
    '#hme-menu-btn:active{transform:translateY(0) scale(.96)}' +
    '#hme-menu-btn svg{transition:transform .5s cubic-bezier(.2,.7,.3,1)}' +
    '#hme-menu-btn:hover svg{transform:rotate(72deg)}' +
    '#hme-menu-btn .hme-mb-label{display:none}' +
    '@media(min-width:400px){#hme-menu-btn .hme-mb-label{display:inline}}' +
    '#hme-menu{position:fixed;inset:0;z-index:59;background:rgba(15,17,20,.97);backdrop-filter:blur(18px);' +
    'opacity:0;visibility:hidden;transition:opacity .35s ease,visibility .35s ease;overflow-y:auto}' +
    '#hme-menu.open{opacity:1;visibility:visible}' +
    '#hme-menu .hme-menu-inner{min-height:100%;display:flex;flex-direction:column;justify-content:center;' +
    'max-width:34rem;margin:0 auto;padding:6rem 1.6rem 4rem;gap:.15rem}' +
    '#hme-menu a.hme-nav,#hme-menu .hme-nav-parent{display:flex;align-items:baseline;gap:1rem;padding:.32rem 0;text-decoration:none;transform-origin:left center;' +
    'font-family:Oswald,sans-serif;font-weight:300;text-transform:uppercase;letter-spacing:-.02em;line-height:1;' +
    'font-size:clamp(1.7rem,6vw,2.6rem);color:#f3f4f6}' +
    '#hme-menu a.hme-nav{transition:color .2s,transform .22s cubic-bezier(.2,.7,.3,1)}' +
    '#hme-menu .hme-nav-parent{justify-content:space-between}' +
    '#hme-menu .hme-nav-parent a.hme-nav{padding:0}' +
    '#hme-menu a.hme-nav:hover,#hme-menu a.hme-nav:focus-visible{color:var(--accent,#f06225);transform:translateX(8px) scale(1.06);outline:none}' +
    '#hme-menu a.hme-nav.hme-picked{color:var(--accent,#f06225);transform:scale(1.09);transition:color .15s,transform .19s cubic-bezier(.2,.7,.3,1)}' +
    '#hme-menu a.hme-nav.current{color:var(--accent,#f06225)}' +
    '#hme-menu .hme-sub-toggle{flex:none;background:none;border:1px solid var(--border,#2b2e34);color:#9399a2;width:2rem;height:2rem;' +
    'display:flex;align-items:center;justify-content:center;cursor:pointer;transition:color .2s,border-color .2s,transform .2s}' +
    '#hme-menu .hme-sub-toggle:hover{color:var(--accent,#f06225);border-color:var(--accent,#f06225)}' +
    '#hme-menu .hme-sub-toggle[aria-expanded="true"] svg{transform:rotate(180deg)}' +
    '#hme-menu .hme-sub{display:flex;flex-direction:column;gap:.1rem;padding:.4rem 0 .6rem 1.4rem;margin-bottom:.2rem}' +
    '#hme-menu .hme-sub[hidden]{display:none}' +
    /* phone-only rows: the desktop keeps these as real page sections */
    '@media(min-width:1024px){#hme-menu a.hme-nav-mobile{display:none}}' +
    '#hme-menu a.hme-nav-mobile{font-size:clamp(1.15rem,4vw,1.5rem);color:var(--muted-foreground,#9399a2)}' +
    '#hme-menu a.hme-nav.hme-nav-sub{font-size:clamp(1rem,3.4vw,1.35rem);color:var(--muted-foreground,#9399a2);font-weight:400}' +
    '#hme-menu a.hme-nav.hme-nav-sub:hover,#hme-menu a.hme-nav.hme-nav-sub:focus-visible{color:var(--accent,#f06225)}' +
    '#hme-menu a.hme-nav .hme-dot{width:6px;height:6px;border-radius:9999px;background:currentColor;opacity:.45;flex:none;align-self:center}' +
    '#hme-menu a.hme-nav.hme-nav-sub .hme-dot{width:4px;height:4px;opacity:.55}' +
    '#hme-menu .hme-menu-foot{margin-top:2.6rem;font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.2em;' +
    'text-transform:uppercase;color:var(--muted-foreground,#9399a2)}' +
    '#hme-menu-close{position:fixed;right:1.1rem;top:3.9rem;z-index:61;height:2.9rem;width:2.9rem;display:flex;align-items:center;' +
    'justify-content:center;border:1px solid var(--border,#2b2e34);background:rgba(16,18,21,.9);color:#f3f4f6;cursor:pointer;' +
    'font-size:16px;transition:border-color .2s,color .2s,transform .15s}' +
    '#hme-menu-close:hover{border-color:var(--accent,#f06225);color:var(--accent,#f06225)}' +
    '#hme-menu-close:active{transform:scale(.94)}' +
    '@media(prefers-reduced-motion:reduce){#hme-menu-btn,#hme-menu,#hme-menu a.hme-nav,#hme-menu-btn svg,#hme-menu .hme-sub-toggle svg{transition:opacity .2s ease,visibility .2s ease!important}' +
    '#hme-menu-btn:hover{transform:none}#hme-menu a.hme-nav:hover,#hme-menu a.hme-nav:active,#hme-menu a.hme-nav.hme-picked{transform:none}}';

  var styleEl = document.createElement('style');
  styleEl.textContent = css;

  var btn = document.createElement('button');
  btn.id = 'hme-menu-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Open navigation menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = COMPASS + '<span class="hme-mb-label">Explore</span>';

  function overlayItem(it) {
    var cur = isCurrent(it.href) ? ' current' : '';
    if (it.children) {
      var subOpen = it.children.some(function (c) { return isCurrent(c.href) && c.href !== '/expeditions'; });
      return '<div class="hme-nav-parent">' +
        '<a href="' + it.href + '" class="hme-nav' + cur + '"><span class="hme-dot"></span>' + esc(it.name) + '</a>' +
        '<button type="button" class="hme-sub-toggle" aria-expanded="' + (subOpen ? 'true' : 'false') + '" aria-label="Show elevation bands">' + CARET + '</button>' +
        '</div>' +
        '<div class="hme-sub"' + (subOpen ? '' : ' hidden') + '>' +
          it.children.filter(function (c) { return !c.all; }).map(function (c) {
            return '<a href="' + c.href + '" class="hme-nav hme-nav-sub' + (isCurrent(c.href) ? ' current' : '') + '"><span class="hme-dot"></span>' + esc(c.name) + '</a>';
          }).join('') +
        '</div>';
    }
    return '<a href="' + it.href + '" class="hme-nav' + cur +
      (it.mobileOnly ? ' hme-nav-mobile' : '') + '"' +
      (it.action ? ' data-action="' + it.action + '"' : '') +
      '><span class="hme-dot"></span>' + esc(it.name) + '</a>';
  }

  var overlay = document.createElement('div');
  overlay.id = 'hme-menu';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Site navigation');
  overlay.innerHTML =
    '<button id="hme-menu-close" type="button" aria-label="Close menu">&#10005;</button>' +
    '<div class="hme-menu-inner">' +
      NAV.map(overlayItem).join('') +
      '<div class="hme-menu-foot">Himalayan Magic Adventure &middot; High Corridors of Nepal &middot; Est. 1993</div>' +
    '</div>';

  overlay.addEventListener('click', function (e) {
    var subToggle = e.target.closest('.hme-sub-toggle');
    if (subToggle) {
      var sub = subToggle.parentElement.nextElementSibling;
      var willOpen = sub.hasAttribute('hidden');
      if (willOpen) sub.removeAttribute('hidden'); else sub.setAttribute('hidden', '');
      subToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      return;
    }
    if (e.target === overlay || e.target.id === 'hme-menu-close') { close(); return; }
    var link = e.target.closest('a.hme-nav');
    if (!link) return;
    // rows that run a function instead of navigating (phone-only shortcuts)
    var act = link.getAttribute('data-action');
    if (act && typeof window[act] === 'function') {
      e.preventDefault();
      close();
      setTimeout(function () { window[act](); }, 260);   // let the overlay fade out
      return;
    }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.button && e.button !== 0)) { close(); return; }
    var href = link.getAttribute('href');
    if (!href || reduceMotion) { close(); return; }
    e.preventDefault();
    link.classList.add('hme-picked');
    setTimeout(function () { close(); window.location.href = href; }, 190);
  });

  function open() {
    overlay.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
    updateBtn();
    var first = overlay.querySelector('a.hme-nav');
    if (first) setTimeout(function () { first.focus(); }, 60);
  }
  function close() {
    overlay.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    updateBtn();
    btn.focus();
  }
  window.toggleHmeMenu = function () { overlay.classList.contains('open') ? close() : open(); };
  btn.addEventListener('click', window.toggleHmeMenu);

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });

  // ── Trigger visibility ──────────────────────────────────────────────────
  //  • mobile: always available (no header nav there).
  //  • desktop: appears after a short scroll so it doesn't sit over the
  //    header nav at the very top. (It no longer hides over any section.)
  var SHOW_AFTER = 72;
  var mqMobile = window.matchMedia ? window.matchMedia('(max-width: 1023px)') : { matches: false };
  function updateBtn() {
    var show = (mqMobile.matches || window.pageYOffset > SHOW_AFTER) && !overlay.classList.contains('open');
    btn.classList.toggle('hme-show', show);
  }
  if (mqMobile.addEventListener) mqMobile.addEventListener('change', updateBtn);
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { updateBtn(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', updateBtn, { passive: true });
  updateBtn();

  function mount() {
    if (!document.body) return;
    document.body.appendChild(styleEl);
    document.body.appendChild(btn);
    document.body.appendChild(overlay);
    updateBtn();
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
