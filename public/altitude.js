/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — scroll altitude barometer            (2026-09-10)
   ----------------------------------------------------------------------------
   The thin left-edge rule that reads 8,848 m at the top of the page and counts
   down to 1,300 m at the bottom, with a marker that tracks scroll position.

   Was inline markup in index.html + a scroll listener in edit.js, desktop-only
   (`hidden lg:flex`). Now a self-injecting module on the menu.js / back.js /
   social.js pattern so it can run on any page, including phones.

   Loaded via <script src="/altitude.js"> on: index, treks, expeditions, stories.

   NOTE ON DIRECTION — the old inline version labelled the top 8,848 m and the
   bottom 1,300 m, but its readout counted UP as you scrolled down, so the
   moving number contradicted the fixed end labels. It now descends, matching
   the labels: summit at the top of the page, valley at the foot.

   Revert: delete this file + every <script src="/altitude.js"> tag. (The old
   inline block in index.html and the listener in edit.js were removed — see
   REVERT-notes § 5af for the exact snippets.)
   ========================================================================== */
(function () {
  'use strict';
  if (window.__hmeAltitudeInstalled) return;
  window.__hmeAltitudeInstalled = true;

  var TOP_M = 8848;   // page top
  var BOTTOM_M = 1300;   // page bottom

  var REDUCED = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css = [
    '#hme-alt{position:fixed;left:.75rem;top:0;z-index:40;height:100vh;',
      'display:flex;flex-direction:column;align-items:center;justify-content:center;',
      'pointer-events:none;font-family:"IBM Plex Mono",monospace;',
      'opacity:0;transition:opacity .5s ease}',
    '#hme-alt.is-ready{opacity:1}',
    '@media(min-width:1024px){#hme-alt{left:1.5rem}}',

    '.hme-alt-rail{position:relative;display:flex;flex-direction:column;align-items:center;',
      'height:46vh;width:2.25rem}',
    '@media(min-width:1024px){.hme-alt-rail{height:55vh;width:3rem}}',

    '.hme-alt-cap{position:absolute;font-size:8px;letter-spacing:.16em;text-transform:uppercase;',
      'color:var(--muted-foreground,#9ca3af);white-space:nowrap}',
    '@media(min-width:1024px){.hme-alt-cap{font-size:9px;letter-spacing:.18em}}',
    '.hme-alt-cap.is-top{top:-1.35rem}',
    '.hme-alt-cap.is-bot{bottom:-1.35rem}',

    '.hme-alt-track{position:relative;height:100%;width:1px;',
      'background:color-mix(in srgb,var(--border,#2e3239) 75%,transparent)}',
    '@supports not (background:color-mix(in srgb,red 50%,transparent)){',
      '.hme-alt-track{background:var(--border,#2e3239)}}',
    '#hme-alt-fill{position:absolute;left:0;top:0;width:1px;background:var(--accent,#f06225);',
      'height:0%;transition:height .15s linear}',

    '#hme-alt-mark{position:absolute;left:50%;top:0;display:flex;flex-direction:column;',
      'align-items:center;transform:translateX(-50%);transition:top .15s linear}',
    '.hme-alt-dot{position:relative;display:flex;height:.75rem;width:.75rem;',
      'align-items:center;justify-content:center}',
    '.hme-alt-dot i{position:absolute;height:.75rem;width:.75rem;border-radius:9999px;',
      'background:var(--accent,#f06225);opacity:.75;animation:hmeAltPing 1.8s cubic-bezier(0,0,.2,1) infinite}',
    '.hme-alt-dot b{height:.5rem;width:.5rem;border-radius:9999px;background:var(--accent,#f06225)}',
    '@keyframes hmeAltPing{75%,100%{transform:scale(2);opacity:0}}',
    '#hme-alt-read{margin-top:.4rem;white-space:nowrap;font-size:9px;font-weight:500;',
      'letter-spacing:.04em;color:var(--accent,#f06225)}',
    '@media(min-width:1024px){#hme-alt-read{font-size:10px}}',

    /* Phones: recede almost to a watermark. The end captions and the pinging
       halo are dropped, the rail is pulled tight to the edge and narrowed so it
       cannot sit under body copy, the line is softened, and the whole thing
       runs at low opacity. It reads as a margin ornament, not a UI element. */
    '@media(max-width:1023px){',
      '#hme-alt{left:.15rem;opacity:.38}',
      /* the whole rail must stay inside the page gutter (px-6 = 24px) so it can
         never sit under body copy — hence the narrow track and a readout that
         runs vertically instead of across */
      '.hme-alt-rail{width:1.05rem;height:34vh}',
      '.hme-alt-cap{display:none}',
      '.hme-alt-track{filter:blur(.4px)}',
      '.hme-alt-dot{height:.5rem;width:.5rem}',
      '.hme-alt-dot i{display:none}',
      '.hme-alt-dot b{height:.3rem;width:.3rem}',
      '#hme-alt-read{writing-mode:vertical-rl;text-orientation:mixed;',
        'margin-top:.35rem;font-size:7.5px;letter-spacing:.06em;opacity:.7;filter:blur(.15px)}',
    '}',
    '@media(max-width:1023px) and (max-height:560px){#hme-alt{display:none}}',

    '@media(prefers-reduced-motion:reduce){',
      '#hme-alt,#hme-alt-fill,#hme-alt-mark{transition:none}',
      '.hme-alt-dot i{animation:none;opacity:.35}}'
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;

  var wrap = document.createElement('div');
  wrap.id = 'hme-alt';
  wrap.setAttribute('aria-hidden', 'true');   // decorative scroll ornament
  wrap.innerHTML =
    '<div class="hme-alt-rail">' +
      '<span class="hme-alt-cap is-top">' + TOP_M.toLocaleString() + 'm</span>' +
      '<div class="hme-alt-track"><div id="hme-alt-fill"></div></div>' +
      '<div id="hme-alt-mark">' +
        '<span class="hme-alt-dot"><i></i><b></b></span>' +
        '<span id="hme-alt-read">' + TOP_M.toLocaleString() + 'm</span>' +
      '</div>' +
      '<span class="hme-alt-cap is-bot">' + BOTTOM_M.toLocaleString() + 'm</span>' +
    '</div>';

  var fill, mark, read, ticking = false;

  function update() {
    var top = window.scrollY || window.pageYOffset || 0;
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var r = docH > 0 ? Math.min(1, Math.max(0, top / docH)) : 0;
    if (fill) fill.style.height = (r * 100) + '%';
    if (mark) mark.style.top = (r * 100) + '%';
    if (read) read.textContent = Math.round(TOP_M - (TOP_M - BOTTOM_M) * r).toLocaleString() + 'm';
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { update(); ticking = false; });
  }

  function mount() {
    if (!document.body) return;
    document.head.appendChild(styleEl);
    document.body.appendChild(wrap);
    fill = document.getElementById('hme-alt-fill');
    mark = document.getElementById('hme-alt-mark');
    read = document.getElementById('hme-alt-read');
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    if (REDUCED) wrap.classList.add('is-ready');
    else requestAnimationFrame(function () {
      requestAnimationFrame(function () { wrap.classList.add('is-ready'); });
    });
  }

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
