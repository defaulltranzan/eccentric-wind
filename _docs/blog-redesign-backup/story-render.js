/* ============================================================================
   STORY / FIELD-JOURNAL ARTICLE — PAGE RENDERER
   Reads the slug from /stories/<slug>, looks up STORIES[slug], and builds the
   full reading page into #story-root. Bad slug → branded not-found + noindex.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- theme ---------- */
  window.hmeToggleTheme = function () {
    var t = (localStorage.getItem('vo_theme') === 'light') ? 'dark' : 'light';
    localStorage.setItem('vo_theme', t);
    applyTheme();
  };
  function applyTheme() {
    var light = localStorage.getItem('vo_theme') === 'light';
    document.body.classList.toggle('light-mode', light);
    var i = document.getElementById('theme-icon');
    if (i) i.className = 'fa-solid ' + (light ? 'fa-sun' : 'fa-moon') + ' text-sm' + (light ? ' text-accent' : '');
  }
  applyTheme();

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // allow a small, safe subset of inline HTML in body copy (em/strong/a)
  function inlineHtml(s) {
    s = String(s == null ? '' : s);
    // escape everything, then re-open the tags we permit
    s = esc(s)
      .replace(/&lt;(\/?)(em|strong|b|i)&gt;/g, '<$1$2>')
      .replace(/&lt;a href=&quot;([^"'&<>\s]+)&quot;&gt;/g, '<a href="$1" class="hme-a">')
      .replace(/&lt;\/a&gt;/g, '</a>');
    return s;
  }
  function phImg(label) {
    var tx = String(label || '').toUpperCase().replace(/[<>&]/g, '').slice(0, 32);
    return 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">' +
      '<defs><radialGradient id="g" cx="26%" cy="18%" r="95%"><stop offset="0" stop-color="#f06225" stop-opacity="0.16"/><stop offset="1" stop-color="#1b1e22" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="1600" height="900" fill="#1b1e22"/><rect width="1600" height="900" fill="url(#g)"/>' +
      '<path d="M0 640 L360 360 L620 560 L940 320 L1240 520 L1600 380 L1600 900 L0 900Z" fill="#ffffff" fill-opacity="0.035"/>' +
      '<path d="M0 700 L440 480 L760 620 L1060 440 L1380 580 L1600 500" fill="none" stroke="#ffffff" stroke-opacity="0.07" stroke-width="3"/>' +
      '<text x="72" y="812" font-family="monospace" font-size="30" fill="#9ca3af" letter-spacing="3">' + tx + '</text>' +
      '<text x="72" y="852" font-family="monospace" font-size="15" fill="#5f636b" letter-spacing="4">PHOTOGRAPHY PENDING</text>' +
      '</svg>'
    );
  }
  function imgTag(src, alt, cls, phLabel) {
    return '<img src="' + esc(src || '') + '" alt="' + esc(alt || '') + '" class="' + cls + '" loading="lazy"' +
      ' onerror="this.onerror=null;this.src=\'' + phImg(phLabel || alt).replace(/'/g, '%27') + '\'">';
  }
  var fmtDate = window.formatStoryDate || function (s) { return s; };

  /* ---------- resolve ---------- */
  var slug = (location.pathname.replace(/\/+$/, '').split('/').pop() || '').toLowerCase();
  var s = window.getStory ? window.getStory(slug) : (window.STORIES || {})[slug];
  var root = document.getElementById('story-root');
  if (!root) return;

  if (!s) {
    var rb = document.createElement('meta');
    rb.name = 'robots'; rb.content = 'noindex, follow';
    document.head.appendChild(rb);
    document.title = 'Story not found — Himalayan Magic Adventure';
    root.innerHTML =
      '<div class="max-w-2xl mx-auto px-6 py-32 text-center">' +
      '<span class="kicker">Story not found</span>' +
      '<h1 class="sec-h text-4xl md:text-6xl text-foreground mt-4 mb-6">This story isn’t here</h1>' +
      '<p class="font-sans text-base text-muted-foreground mb-8">The article you asked for isn’t in the journal — it may have moved.</p>' +
      '<a href="/stories" class="inline-flex border border-accent text-accent hover:bg-accent hover:text-background font-mono text-[11px] uppercase tracking-widest px-6 py-3 transition-all">Back to the field journal</a>' +
      '</div>';
    return;
  }

  /* ---------- SEO ---------- */
  var canonical = 'https://himalayanmagic.com/stories/' + s.slug;
  document.title = s.title + ' — Himalayan Magic Adventure';
  function meta(sel, attr, val) {
    var el = document.querySelector(sel);
    if (el) el.setAttribute(attr || 'content', val);
  }
  meta('meta[name="description"]', 'content', s.excerpt || '');
  var can = document.getElementById('canonical-link');
  if (can) can.setAttribute('href', canonical);
  meta('meta[property="og:title"]', 'content', s.title);
  meta('meta[property="og:description"]', 'content', s.excerpt || '');
  meta('meta[property="og:url"]', 'content', canonical);
  if (s.heroImage) meta('meta[property="og:image"]', 'content', s.heroImage);
  meta('meta[property="og:type"]', 'content', 'article');

  var ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Article',
    headline: s.title, datePublished: s.date, dateModified: s.date,
    author: { '@type': (s.author && s.author.indexOf(' ') > -1 ? 'Person' : 'Organization'), name: s.author || 'Himalayan Magic Adventure' },
    publisher: { '@type': 'Organization', name: 'Himalayan Magic Adventure' },
    image: s.heroImage ? ['https://himalayanmagic.com' + s.heroImage] : undefined,
    description: s.excerpt || '',
    mainEntityOfPage: canonical
  });
  document.head.appendChild(ld);

  /* ---------- body blocks ----------
     Semantic elements only — all typography, spacing and the left-aligned
     reading rhythm live in the .article-prose stylesheet in story.html. */
  function block(b) {
    switch (b.t) {
      case 'h2':
        return '<h2>' + esc(b.text) + '</h2>';
      case 'h3':
        return '<h3>' + esc(b.text) + '</h3>';
      case 'quote':
        return '<blockquote><p>' + esc(b.text) + '</p>' +
          (b.cite ? '<cite>&mdash; ' + esc(b.cite) + '</cite>' : '') +
          '</blockquote>';
      case 'list':
        var tag = b.ordered ? 'ol' : 'ul';
        return '<' + tag + '>' +
          (b.items || []).map(function (it) { return '<li>' + inlineHtml(it) + '</li>'; }).join('') +
          '</' + tag + '>';
      case 'note':
        return '<aside class="article-note">' +
          (b.title ? '<span class="article-note-title">' + esc(b.title) + '</span>' : '') +
          '<div class="article-note-body">' + inlineHtml(b.html) + '</div>' +
          '</aside>';
      case 'image':
        return '<figure class="article-figure">' +
          imgTag(b.src, b.caption || s.title, '', b.caption || s.title) +
          (b.caption ? '<figcaption class="article-figcaption">' + esc(b.caption) + '</figcaption>' : '') +
          '</figure>';
      case 'p':
      default:
        return '<p>' + inlineHtml(b.html || b.text) + '</p>';
    }
  }

  var related = (window.getRelatedStories ? window.getRelatedStories(s.slug, 2) : []);

  root.innerHTML =
    /* hero — content shares the article reading measure so the left edge
       of the title, standfirst and body all line up */
    '<header class="relative border-b border-border">' +
      '<div class="absolute inset-0 z-0">' + imgTag(s.heroImage, s.heroAlt || s.title, 'h-full w-full object-cover opacity-30', s.title) + '</div>' +
      '<div class="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-background via-background/85 to-background/45"></div>' +
      '<div class="article-wrap relative z-10 pt-16 pb-12 sm:pt-20 md:pt-24 md:pb-14">' +
        '<nav class="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-6"><a href="/stories" class="hover:text-accent">Field Journal</a> <span class="text-border">/</span> ' + esc(s.category) + '</nav>' +
        '<h1 class="sec-h text-3xl sm:text-4xl md:text-5xl text-foreground" style="text-wrap:balance">' + esc(s.title) + '</h1>' +
        (s.excerpt ? '<p class="mt-5 font-sans text-[1.0625rem] md:text-xl leading-relaxed text-muted-foreground">' + esc(s.excerpt) + '</p>' : '') +
        '<div class="mt-7 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">' +
          '<span class="text-foreground/90">' + esc(s.author || 'Himalayan Magic Adventure') + '</span>' +
          (s.authorRole ? '<span class="text-border">·</span><span>' + esc(s.authorRole) + '</span>' : '') +
          '<span class="text-border">·</span><span>' + esc(fmtDate(s.date)) + '</span>' +
          (s.readMinutes ? '<span class="text-border">·</span><span>' + esc(s.readMinutes) + ' min read</span>' : '') +
        '</div>' +
      '</div>' +
    '</header>' +

    /* article body — centered container, left-aligned text, ~760px measure,
       56–80px of air below the hero */
    '<div class="article-wrap" style="padding-top:clamp(3.5rem,6vw,5rem);padding-bottom:clamp(3rem,5vw,4.5rem)">' +
      '<div class="article-prose">' +
        (s.body || []).map(block).join('') +
      '</div>' +

      /* tags */
      (s.tags && s.tags.length ?
        '<div class="mt-14 flex flex-wrap gap-2 border-t border-border pt-8">' +
        s.tags.map(function (tg) { return '<span class="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground border border-border px-2.5 py-1">' + esc(tg) + '</span>'; }).join('') +
        '</div>' : '') +

      /* author card */
      '<div class="mt-8 border border-border bg-card px-6 py-6" style="border-radius:3px">' +
        '<span class="block font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-1">Written by</span>' +
        '<span class="block font-heading text-lg uppercase tracking-tight text-foreground">' + esc(s.author || 'Himalayan Magic Adventure') + '</span>' +
        (s.authorRole ? '<span class="block font-mono text-[11px] text-muted-foreground mt-0.5">' + esc(s.authorRole) + '</span>' : '') +
        '<p class="mt-3 font-sans text-[13px] leading-relaxed text-muted-foreground">Part of the guiding and operations team at Himalayan Magic Adventure, working the trails and peaks of the Nepal Himalaya since 1993.</p>' +
      '</div>' +

      '<div class="mt-8"><a href="/stories" class="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent hover:gap-3 transition-all"><span aria-hidden="true">&larr;</span> All stories</a></div>' +
    '</div>' +

    /* related */
    (related.length ?
      '<section class="border-t border-border bg-[#191b1f]">' +
        '<div class="max-w-4xl mx-auto px-6 py-14">' +
          '<span class="kicker">Keep reading</span>' +
          '<div class="mt-6 grid gap-6 sm:grid-cols-2">' +
          related.map(function (r) {
            return '<a href="/stories/' + esc(r.slug) + '" class="group block border border-border bg-card hover:border-accent transition-colors" style="border-radius:3px">' +
              '<div class="aspect-[16/9] overflow-hidden">' + imgTag(r.heroImage, r.title, 'h-full w-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500', r.title) + '</div>' +
              '<div class="p-5">' +
                '<span class="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">' + esc(r.category) + '</span>' +
                '<h3 class="mt-1 font-heading text-lg uppercase tracking-tight text-foreground leading-snug group-hover:text-accent transition-colors">' + esc(r.title) + '</h3>' +
              '</div></a>';
          }).join('') +
          '</div>' +
        '</div>' +
      '</section>' : '');

  /* ---------- reading progress ---------- */
  var pb = document.getElementById('read-progress');
  function onScroll() {
    var dh = document.documentElement.scrollHeight - window.innerHeight;
    if (pb) pb.style.width = (dh > 0 ? Math.min(100, window.scrollY / dh * 100) : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
