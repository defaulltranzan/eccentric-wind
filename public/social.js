/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — floating social rail
   ----------------------------------------------------------------------------
   A slim, edge-hugging column of social links, vertically centred on the right.
   Self-injecting (menu.js / back.js pattern). Loaded only on the pages that
   asked for it via <script src="/social.js">. Brand tokens only.

   Revert: delete this file + every <script src="/social.js"> tag.
   ========================================================================== */
(function () {
  'use strict';
  if (window.__hmeSocialInstalled) return;
  window.__hmeSocialInstalled = true;

  var LINKS = [
    { href: 'https://www.facebook.com/himalayanmagic1993', label: 'Facebook', icon: 'fa-brands fa-facebook-f', ext: true },
    { href: 'https://www.instagram.com/himalayanmagic1993', label: 'Instagram', icon: 'fa-brands fa-instagram', ext: true },
    { href: 'https://wa.me/9779841454599', label: 'WhatsApp', icon: 'fa-brands fa-whatsapp', ext: true, big: true },
    { href: 'mailto:info@himalayanmagic.com', label: 'Email', icon: 'fa-solid fa-envelope', ext: false }
  ];

  var css = [
    '#hme-social{position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:45;',
      'display:flex;flex-direction:column;',
      'background:var(--card,#22252a);border:1px solid var(--border,#2e3239);border-right:0;',
      'border-radius:4px 0 0 4px;overflow:hidden;',
      'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);',
      'box-shadow:0 14px 40px -14px rgba(0,0,0,.55);',
      'opacity:0;visibility:hidden;transition:opacity .35s ease,visibility .35s ease}',
    '#hme-social.hme-show{opacity:1;visibility:visible}',
    '#hme-social a{display:flex;align-items:center;justify-content:center;width:2.6rem;height:2.6rem;',
      'color:var(--muted-foreground,#9ca3af);font-size:13px;text-decoration:none;',
      'border-bottom:1px solid var(--border,#2e3239);transition:color .18s ease,background-color .18s ease}',
    '#hme-social a:last-child{border-bottom:0}',
    '#hme-social a:hover,#hme-social a:focus-visible{color:var(--accent,#f06225);background:rgba(240,98,37,.12);outline:none}',
    '#hme-social a .fa-whatsapp{font-size:15px}',
    '@media(max-width:400px){#hme-social a{width:2.35rem;height:2.35rem;font-size:12px}}',
    '@media(prefers-reduced-motion:reduce){#hme-social{transition:opacity .2s ease,visibility .2s ease}}'
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;

  var rail = document.createElement('nav');
  rail.id = 'hme-social';
  rail.setAttribute('aria-label', 'Himalayan Magic Adventure on social media');
  rail.innerHTML = LINKS.map(function (l) {
    return '<a href="' + l.href + '"' +
      (l.ext ? ' target="_blank" rel="noopener"' : '') +
      ' aria-label="Himalayan Magic Adventure on ' + l.label + '" title="' + l.label + '">' +
      '<i class="' + l.icon + '" aria-hidden="true"></i></a>';
  }).join('');

  function mount() {
    if (!document.body) return;
    document.body.appendChild(styleEl);
    document.body.appendChild(rail);
    // brief settle so it doesn't fight the hero on first paint
    setTimeout(function () { rail.classList.add('hme-show'); }, 400);
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
