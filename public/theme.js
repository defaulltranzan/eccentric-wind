/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — shared theme (light / dark)
   One source of truth. The class lives on BOTH <html> and <body> so the
   inline <head> guard (which runs before <body> exists) and this script agree.
   Exposes window.toggleTheme() — pages keep calling their existing onclick.
   Persisted in localStorage['vo_theme'].  Revert: delete this file + the
   <script src="/theme.js"> tags + the inline guard, and rebuild the CSS.
   ========================================================================== */
(function () {
  'use strict';
  var KEY = 'vo_theme';

  function read() {
    try { return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark'; }
    catch (e) { return 'dark'; }
  }
  function store(t) { try { localStorage.setItem(KEY, t); } catch (e) {} }

  function apply(t) {
    var isLight = t === 'light';
    var el = document.documentElement;
    // Kill every transition for two frames while the tokens change. Chrome
    // will not re-resolve a var()-derived `color`/`background` that is mid
    // `transition`, so the element would stick on the old theme otherwise.
    el.classList.add('hme-theme-switching');
    el.classList.toggle('light-mode', isLight);
    if (document.body) document.body.classList.toggle('light-mode', isLight);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { el.classList.remove('hme-theme-switching'); });
    });
    // keep every theme icon in sync (pages use <i id="theme-icon">)
    var icons = document.querySelectorAll('#theme-icon, [data-theme-icon]');
    for (var i = 0; i < icons.length; i++) {
      icons[i].className = isLight
        ? 'fa-solid fa-sun text-sm text-accent'
        : 'fa-solid fa-moon text-sm';
    }
    el.style.colorScheme = isLight ? 'light' : 'dark';
  }

  var current = read();

  window.toggleTheme = function () {
    current = current === 'light' ? 'dark' : 'light';
    store(current);
    apply(current);
  };
  // aliases used by individual pages
  window.hmeCmpToggleTheme = window.toggleTheme;
  window.setTheme = function (t) { current = t === 'light' ? 'light' : 'dark'; store(current); apply(current); };
  window.getTheme = function () { return current; };

  apply(current);
  if (!document.body) {
    document.addEventListener('DOMContentLoaded', function () { apply(current); });
  }
  // cross-tab sync
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) { current = read(); apply(current); }
  });
})();
