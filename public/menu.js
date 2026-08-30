/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — shared navigation menu
   One self-contained module, included on every page. Replaces the old
   per-page #fullscreen-menu markup (which had inconsistent, sometimes
   scrambled item lists). On mobile this IS the primary navigation.
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

  var GROUPS = [
    { label: 'Explore', items: [
      { name: 'Trekking Trails', href: '/treks' },
      { name: 'Expeditions', href: '/expeditions' },
      { name: 'Compare Treks', href: '/compare' }
    ]},
    { label: 'Plan', items: [
      { name: 'Find Your Trek', href: '/#trek-finder' },
      { name: 'Gear & Packing', href: '/gear' },
      { name: 'Altitude & Safety', href: '/altitude-safety' }
    ]},
    { label: 'Discover', items: [
      { name: 'Stories', href: '/dispatches' },
      { name: 'Sherpa Heritage', href: '/about-sherpa' }
    ]},
    { label: 'Company', items: [
      { name: 'About', href: '/about' },
      { name: 'Services', href: '/services' },
      { name: 'Contact', href: '/contact' }
    ]}
  ];

  var path = location.pathname.replace(/\/+$/, '') || '/';
  function isCurrent(href) {
    if (href.indexOf('#') > -1) return false;
    var h = href.replace(/\/+$/, '') || '/';
    if (h === '/') return path === '/';
    return path === h || path.indexOf(h + '/') === 0;
  }

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
    'max-width:72rem;margin:0 auto;padding:6rem 1.6rem 4rem}' +
    '#hme-menu .hme-menu-grid{display:grid;grid-template-columns:1fr;gap:2.2rem}' +
    '@media(min-width:768px){#hme-menu .hme-menu-grid{grid-template-columns:repeat(2,1fr);gap:2.6rem 4rem}}' +
    '#hme-menu .hme-grp-label{font-family:"IBM Plex Mono",monospace;font-size:9px;letter-spacing:.3em;text-transform:uppercase;' +
    'color:var(--muted-foreground,#9399a2);display:block;margin-bottom:.9rem}' +
    '#hme-menu a.hme-nav{display:flex;align-items:baseline;gap:1rem;padding:.3rem 0;text-decoration:none;transform-origin:left center;' +
    'font-family:Oswald,sans-serif;font-weight:300;text-transform:uppercase;letter-spacing:-.02em;line-height:1;' +
    'font-size:clamp(1.6rem,5vw,2.4rem);color:#f3f4f6;transition:color .2s,transform .22s cubic-bezier(.2,.7,.3,1)}' +
    '#hme-menu a.hme-nav:hover,#hme-menu a.hme-nav:focus-visible{color:var(--accent,#f06225);transform:translateX(8px) scale(1.07);outline:none}' +
    '#hme-menu a.hme-nav:active{transform:scale(1.04)}' +
    '#hme-menu a.hme-nav.hme-picked{color:var(--accent,#f06225);transform:scale(1.09);transition:color .15s,transform .19s cubic-bezier(.2,.7,.3,1)}' +
    '#hme-menu a.hme-nav.current{color:var(--accent,#f06225)}' +
    '#hme-menu a.hme-nav .hme-dot{width:6px;height:6px;border-radius:9999px;background:currentColor;opacity:.45;flex:none;align-self:center}' +
    '#hme-menu .hme-menu-foot{margin-top:3rem;font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.2em;' +
    'text-transform:uppercase;color:var(--muted-foreground,#9399a2)}' +
    '#hme-menu-close{position:fixed;right:1.1rem;top:3.9rem;z-index:61;height:2.9rem;width:2.9rem;display:flex;align-items:center;' +
    'justify-content:center;border:1px solid var(--border,#2b2e34);background:rgba(16,18,21,.9);color:#f3f4f6;cursor:pointer;' +
    'font-size:16px;transition:border-color .2s,color .2s,transform .15s}' +
    '#hme-menu-close:hover{border-color:var(--accent,#f06225);color:var(--accent,#f06225)}' +
    '#hme-menu-close:active{transform:scale(.94)}' +
    '@media(prefers-reduced-motion:reduce){#hme-menu-btn,#hme-menu,#hme-menu a.hme-nav,#hme-menu-btn svg{transition:opacity .2s ease,visibility .2s ease!important}' +
    '#hme-menu-btn:hover{transform:none}#hme-menu a.hme-nav:hover,#hme-menu a.hme-nav:active,#hme-menu a.hme-nav.hme-picked{transform:none}}';

  var styleEl = document.createElement('style');
  styleEl.textContent = css;

  var btn = document.createElement('button');
  btn.id = 'hme-menu-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Open navigation menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = COMPASS + '<span class="hme-mb-label">Explore</span>';

  var overlay = document.createElement('div');
  overlay.id = 'hme-menu';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Site navigation');
  overlay.innerHTML =
    '<button id="hme-menu-close" type="button" aria-label="Close menu">&#10005;</button>' +
    '<div class="hme-menu-inner">' +
      '<a href="/" class="hme-nav' + (isCurrent('/') ? ' current' : '') + '" style="font-size:clamp(2rem,7vw,3.2rem);margin-bottom:2rem"><span class="hme-dot"></span>Home</a>' +
      '<div class="hme-menu-grid">' +
      GROUPS.map(function (g) {
        return '<div><span class="hme-grp-label">' + g.label + '</span>' +
          g.items.map(function (it) {
            return '<a href="' + it.href + '" class="hme-nav' + (isCurrent(it.href) ? ' current' : '') + '">' +
              '<span class="hme-dot"></span>' + it.name + '</a>';
          }).join('') +
          '</div>';
      }).join('') +
      '</div>' +
      '<div class="hme-menu-foot">Himalayan Magic Adventure &middot; High Corridors of Nepal &middot; Est. 1993</div>' +
    '</div>';

  function open() {
    overlay.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
    if (typeof updateBtn === 'function') updateBtn();
    var first = overlay.querySelector('a.hme-nav');
    if (first) setTimeout(function () { first.focus(); }, 60);
  }
  function close() {
    overlay.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    if (typeof updateBtn === 'function') updateBtn();
    btn.focus();
  }
  window.toggleHmeMenu = function () { overlay.classList.contains('open') ? close() : open(); };

  btn.addEventListener('click', window.toggleHmeMenu);

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target.id === 'hme-menu-close') { close(); return; }
    var link = e.target.closest('a.hme-nav');
    if (!link) return;
    // Let new-tab / modified clicks behave normally
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.button && e.button !== 0)) { close(); return; }
    var href = link.getAttribute('href');
    if (!href || reduceMotion) { close(); return; }
    // Brief zoom on the chosen item, then navigate
    e.preventDefault();
    link.classList.add('hme-picked');
    setTimeout(function () { close(); window.location.href = href; }, 190);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });

  // The trigger stays out of the way:
  //  - on desktop it is hidden over the header at the top of the page (the
  //    header already carries the nav there) and appears once you scroll;
  //  - on mobile there is no header nav, so it is always available;
  //  - on every width it hides while the "Find Your Trek" section is on
  //    screen, so it never sits on top of those controls.
  var SHOW_AFTER = 220;
  var mqMobile = window.matchMedia ? window.matchMedia('(max-width: 1023px)') : { matches: false };
  var finderVisible = false;
  var finderEl = document.getElementById('trek-finder');
  if (finderEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      finderVisible = entries[0].isIntersecting;
      updateBtn();
    }, { rootMargin: '-12% 0px -12% 0px' }).observe(finderEl);
  }
  function updateBtn() {
    var past = mqMobile.matches || window.pageYOffset > SHOW_AFTER;
    btn.classList.toggle('hme-show', past && !finderVisible && !overlay.classList.contains('open'));
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
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
