/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — cartographic backdrop                (2026-09-10)
   ----------------------------------------------------------------------------
   A whisper-quiet decorative layer behind the page: topographic contours, a
   ridge silhouette, survey brackets with real coordinates, and a prayer-flag
   motif. Purely atmospheric — it changes no layout and no existing design.

   HOW IT STAYS BEHIND EVERYTHING
   Each decorated <section> gets ::before / ::after at `z-index:-1`. In the CSS
   painting order a negative-z child paints ABOVE its parent's background but
   BELOW every piece of the parent's content, so nothing can ever sit on top of
   text or controls. No DOM is inserted and no element is moved. Sections that
   already carry a full-cover art layer (a hero photo, #trek-finder's gradient)
   simply hide it — by design, they have their own treatment.

   Variants rotate so the page never repeats itself, and roughly every third
   section is left plain to give the eye somewhere to rest.

   MOBILE: contours only, at lower opacity and a larger scale. Every text mark,
   flag and ridge is dropped, so the phone reads as a smooth, calm wash.

   Coordinates and elevations below are the real figures for those peaks.

   Revert: delete this file + every <script src="/backdrop.js"> tag.
   ========================================================================== */
(function () {
  'use strict';
  if (window.__hmeBackdropInstalled) return;
  window.__hmeBackdropInstalled = true;

  /* Real peaks — this site's factual standard applies to decoration too. */
  var MARKS = [
    "27°59'N 86°55'E · 8848 M",   // Everest
    "28°35'N 83°49'E · 8091 M",   // Annapurna I
    "28°33'N 84°33'E · 8163 M",   // Manaslu
    "27°42'N 88°08'E · 8586 M",   // Kanchenjunga
    "27°53'N 87°05'E · 8485 M",   // Makalu
    "28°41'N 83°29'E · 8167 M",   // Dhaulagiri
    "27°57'N 86°55'E · 8516 M",   // Lhotse
    "28°05'N 86°39'E · 8188 M"    // Cho Oyu
  ];

  /* ---- inline SVG art, kept tiny and encoded for use in background-image --- */
  var RIDGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 130' preserveAspectRatio='none'%3E" +
    "%3Cpath d='M0 130 L96 68 168 92 268 34 372 82 470 50 566 96 668 42 772 78 876 36 972 74 1074 44 1200 66 1200 130Z' fill='%23ffffff' fill-opacity='0.022'/%3E" +
    "%3Cpath d='M0 130 L96 68 168 92 268 34 372 82 470 50 566 96 668 42 772 78 876 36 972 74 1074 44 1200 66' fill='none' stroke='%23f06225' stroke-opacity='0.07' stroke-width='1'/%3E" +
    "%3C/svg%3E";

  var FLAGS =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 250 62'%3E" +
    "%3Cpath d='M4 9 C64 27 158 27 246 7' fill='none' stroke='%23f06225' stroke-opacity='0.15' stroke-width='1'/%3E" +
    "%3Cg fill='%23f06225' fill-opacity='0.11'%3E" +
    "%3Cpath d='M30 16l11 1.6-6 12.4z'/%3E%3Cpath d='M60 21l11 1.4-6 12.4z'/%3E%3Cpath d='M90 23.5l11 .9-6 12.4z'/%3E" +
    "%3Cpath d='M120 24.5l11 .2-6 12.4z'/%3E%3Cpath d='M150 23.5l11-.5-6 12.4z'/%3E%3Cpath d='M180 21l11-1.2-6 12.4z'/%3E" +
    "%3Cpath d='M210 16l11-1.9-6 12.4z'/%3E%3C/g%3E%3C/svg%3E";

  var css = [
    /* ---------- base: topographic contour wash on every decorated section ---
       Two stacking cases, decided per section in decorate():
       · plain section (all children static)  -> z-index:-1, behind everything.
       · section with its own absolute z-0 art layer -> `.hme-bd-over`, z-index:1,
         which paints above that art but still under the section's own
         `relative z-10` content wrapper. Every art-layer section on this site
         has one, so nothing can land on top of text either way. */
    '.hme-bd{position:relative}',
    '.hme-bd::before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;',
      'background-image:',
        'repeating-radial-gradient(ellipse 62% 44% at 18% 26%,transparent 0 22px,rgba(255,255,255,.030) 22px 23px),',
        'repeating-radial-gradient(ellipse 54% 48% at 84% 74%,transparent 0 27px,rgba(240,98,37,.038) 27px 28px),',
        'repeating-radial-gradient(ellipse 70% 50% at 52% 108%,transparent 0 34px,rgba(255,255,255,.018) 34px 35px);}',
    '.hme-bd-over::before,.hme-bd-over.hme-bd-ridge::after,',
      '.hme-bd-over.hme-bd-mark::after,.hme-bd-over.hme-bd-flags::after{z-index:1}',

    /* ---------- v1 · ridge silhouette along the foot of the section --------- */
    '.hme-bd-ridge::after{content:"";position:absolute;left:0;right:0;bottom:0;height:130px;z-index:-1;',
      'pointer-events:none;background:url("' + RIDGE + '") bottom center / 100% 130px no-repeat;}',

    /* ---------- v2 · survey bracket + real coordinates --------------------- */
    '.hme-bd-mark::after{content:attr(data-hme-mark);position:absolute;top:1.4rem;right:1.4rem;z-index:-1;',
      'pointer-events:none;padding:.45rem .6rem;',
      'border-top:1px solid rgba(240,98,37,.20);border-right:1px solid rgba(240,98,37,.20);',
      'font-family:"IBM Plex Mono",monospace;font-size:8px;letter-spacing:.2em;',
      'color:rgba(240,98,37,.26);white-space:nowrap;}',

    /* ---------- v3 · prayer-flag line, high in a corner -------------------- */
    '.hme-bd-flags::after{content:"";position:absolute;top:0;right:0;width:250px;height:62px;z-index:-1;',
      'pointer-events:none;background:url("' + FLAGS + '") top right / 250px 62px no-repeat;}',

    /* ---------- light mode: swap the white ink for a soft graphite --------- */
    'body.light-mode .hme-bd::before{background-image:',
        'repeating-radial-gradient(ellipse 62% 44% at 18% 26%,transparent 0 22px,rgba(28,30,33,.030) 22px 23px),',
        'repeating-radial-gradient(ellipse 54% 48% at 84% 74%,transparent 0 27px,rgba(214,77,22,.036) 27px 28px),',
        'repeating-radial-gradient(ellipse 70% 50% at 52% 108%,transparent 0 34px,rgba(28,30,33,.020) 34px 35px);}',
    'body.light-mode .hme-bd-mark::after{color:rgba(214,77,22,.30);',
      'border-top-color:rgba(214,77,22,.22);border-right-color:rgba(214,77,22,.22);}',

    /* ---------- phones: a smooth wash and nothing else --------------------- */
    '@media(max-width:1023px){',
      '.hme-bd::before{background-image:',
        'repeating-radial-gradient(ellipse 90% 60% at 24% 30%,transparent 0 34px,rgba(255,255,255,.015) 34px 35px),',
        'repeating-radial-gradient(ellipse 80% 64% at 80% 76%,transparent 0 40px,rgba(240,98,37,.020) 40px 41px);}',
      'body.light-mode .hme-bd::before{background-image:',
        'repeating-radial-gradient(ellipse 90% 60% at 24% 30%,transparent 0 34px,rgba(28,30,33,.022) 34px 35px),',
        'repeating-radial-gradient(ellipse 80% 64% at 80% 76%,transparent 0 40px,rgba(214,77,22,.026) 40px 41px);}',
      '.hme-bd-ridge::after,.hme-bd-mark::after,.hme-bd-flags::after{display:none}',
    '}',

    /* ---------- respect the print + reduced-data cases --------------------- */
    '@media print{.hme-bd::before,.hme-bd-ridge::after,.hme-bd-mark::after,.hme-bd-flags::after{display:none}}'
  ].join('');

  function decorate() {
    if (!document.body) return;

    var style = document.createElement('style');
    style.id = 'hme-backdrop-css';
    style.textContent = css;
    document.head.appendChild(style);

    var sections = Array.prototype.slice.call(
      document.querySelectorAll('main > section, body > section, footer')
    );

    var markIdx = 0, n = 0;
    sections.forEach(function (sec) {
      // Heroes and photo panels already carry their own art — leave them be.
      if (sec.hasAttribute('data-media')) return;
      // never fight a section that is already decorated by its own stylesheet
      if (sec.classList.contains('hme-bd')) return;

      sec.classList.add('hme-bd');

      /* Does this section already carry its own absolute art layer (a photo,
         a gradient wash)? If so our decoration must sit ABOVE it, which is
         only safe when the section also has a raised content wrapper to stay
         under. Every such section on this site pairs a z-0 art layer with a
         `relative z-10` content div — we verify both before opting in. */
      var kids = sec.children, hasArt = false, hasRaised = false;
      for (var k = 0; k < kids.length; k++) {
        var cs = window.getComputedStyle(kids[k]);
        var zi = parseInt(cs.zIndex, 10);
        if (cs.position === 'absolute' && zi === 0) hasArt = true;
        if (cs.position !== 'static' && zi >= 10) hasRaised = true;
      }
      if (hasArt && hasRaised) sec.classList.add('hme-bd-over');

      // Rotate the flourish: ridge, coordinates, plain, flags, plain …
      var slot = n % 5;
      if (slot === 0) {
        sec.classList.add('hme-bd-ridge');
      } else if (slot === 1) {
        sec.classList.add('hme-bd-mark');
        sec.setAttribute('data-hme-mark', MARKS[markIdx % MARKS.length]);
        markIdx++;
      } else if (slot === 3) {
        sec.classList.add('hme-bd-flags');
      }
      n++;
    });
  }

  if (document.body) decorate();
  else document.addEventListener('DOMContentLoaded', decorate);
})();
