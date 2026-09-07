/* ============================================================================
   THE FIELD JOURNAL — ARTICLE PAGE RENDERER  (3-column editorial, 2026-09-07)
   Reads the slug from /stories/<slug>, looks up STORIES[slug], and builds the
   full reading page into #story-root:
     header · cinematic hero · [ TOC + share | article | quick-facts / same-trail ]
     · continue exploring
   Adds: auto table of contents + scroll-spy, share, sticky mini-nav, image
   lightbox, and new body blocks (facts / gallery / divider / note kinds).
   Bad slug → branded not-found + noindex.
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
  function inlineHtml(s) {
    s = String(s == null ? '' : s);
    s = esc(s)
      .replace(/&lt;(\/?)(em|strong|b|i)&gt;/g, '<$1$2>')
      .replace(/&lt;a href=&quot;([^"'&<>\s]+)&quot;&gt;/g, '<a href="$1" class="hme-a">')
      .replace(/&lt;\/a&gt;/g, '</a>');
    return s;
  }
  function slugify(s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60) || 'section';
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
  function imgTag(src, alt, cls, phLabel, extra) {
    return '<img src="' + esc(src || '') + '" alt="' + esc(alt || '') + '" class="' + cls + '" loading="lazy" decoding="async"' + (extra || '') +
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
      '<div class="max-w-2xl mx-auto px-6 py-28 text-center">' +
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
  function meta(sel, val) { var el = document.querySelector(sel); if (el) el.setAttribute('content', val); }
  meta('meta[name="description"]', s.excerpt || '');
  var can = document.getElementById('canonical-link');
  if (can) can.setAttribute('href', canonical);
  meta('meta[property="og:title"]', s.title);
  meta('meta[property="og:description"]', s.excerpt || '');
  meta('meta[property="og:url"]', canonical);
  if (s.heroImage) meta('meta[property="og:image"]', s.heroImage);
  meta('meta[property="og:type"]', 'article');

  var wordCount = (s.body || []).reduce(function (n, b) {
    return n + String(b.html || b.text || (b.items || []).join(' ') || '').split(/\s+/).length;
  }, 0);
  var ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Article',
    headline: s.title,
    datePublished: s.date, dateModified: s.updated || s.date,
    author: { '@type': (s.author && s.author.indexOf(' ') > -1 ? 'Person' : 'Organization'), name: s.author || 'Himalayan Magic Adventure' },
    publisher: { '@type': 'Organization', name: 'Himalayan Magic Adventure', logo: { '@type': 'ImageObject', url: 'https://himalayanmagic.com/images/logo-icon.png' } },
    image: s.heroImage ? ['https://himalayanmagic.com' + s.heroImage] : undefined,
    description: s.excerpt || '',
    articleSection: s.category,
    keywords: (s.tags || []).join(', '),
    wordCount: wordCount,
    mainEntityOfPage: canonical
  });
  document.head.appendChild(ld);

  /* ---------- body blocks ----------
     Single pass: builds HTML, collects TOC headings + lightbox images. */
  var toc = [];        // { id, text, level }
  var lbImages = [];    // { src, caption }
  var usedIds = {};

  function headingId(text) {
    var id = slugify(text), n = 1;
    while (usedIds[id]) { id = slugify(text) + '-' + (++n); }
    usedIds[id] = true;
    return id;
  }
  function lbIndex(src, caption) {
    lbImages.push({ src: src, caption: caption || '' });
    return lbImages.length - 1;
  }

  function block(b) {
    switch (b.t) {
      case 'h2': {
        var id2 = headingId(b.text);
        toc.push({ id: id2, text: b.text, level: 2 });
        return '<h2 id="' + id2 + '">' + esc(b.text) + '</h2>';
      }
      case 'h3': {
        var id3 = headingId(b.text);
        toc.push({ id: id3, text: b.text, level: 3 });
        return '<h3 id="' + id3 + '">' + esc(b.text) + '</h3>';
      }
      case 'quote':
        return '<blockquote><p>' + esc(b.text) + '</p>' +
          (b.cite ? '<cite>&mdash; ' + esc(b.cite) + '</cite>' : '') + '</blockquote>';
      case 'list': {
        var tag = b.ordered ? 'ol' : 'ul';
        return '<' + tag + '>' + (b.items || []).map(function (it) { return '<li>' + inlineHtml(it) + '</li>'; }).join('') + '</' + tag + '>';
      }
      case 'note': {
        var kindCls = b.kind === 'safety' ? ' is-safety' : (b.kind === 'field' ? ' is-field' : (b.kind === 'tip' ? ' is-tip' : ''));
        var label = b.title || (b.kind === 'safety' ? 'Safety note' : b.kind === 'field' ? 'Field note' : b.kind === 'tip' ? 'Tip' : '');
        return '<aside class="article-note' + kindCls + '">' +
          (label ? '<span class="article-note-title">' + esc(label) + '</span>' : '') +
          '<div class="article-note-body">' + inlineHtml(b.html) + '</div></aside>';
      }
      case 'facts':
        return '<div class="article-facts">' + (b.rows || []).map(function (r) {
          return '<div class="af-row"><span class="af-k">' + esc(r[0]) + '</span><span class="af-v">' + esc(r[1]) + '</span></div>';
        }).join('') + '</div>';
      case 'divider':
        return '<div class="article-divider" aria-hidden="true">&#9650;</div>';
      case 'gallery': {
        var imgs = (b.images || []);
        return '<div class="article-gallery">' + imgs.map(function (g) {
          var idx = lbIndex(g.src, g.caption);
          return '<button type="button" data-lb="' + idx + '" aria-label="Open image">' +
            imgTag(g.src, g.caption || s.title, '', g.caption || s.title) + '</button>';
        }).join('') + '</div>';
      }
      case 'image': {
        var i2 = lbIndex(b.src, b.caption);
        return '<figure class="article-figure">' +
          '<button type="button" data-lb="' + i2 + '" style="display:block;width:100%;border:0;padding:0;background:none;cursor:zoom-in" aria-label="Open image">' +
          imgTag(b.src, b.caption || s.title, '', b.caption || s.title) + '</button>' +
          (b.caption ? '<figcaption class="article-figcaption">' + esc(b.caption) + '</figcaption>' : '') +
          '</figure>';
      }
      case 'p':
      default:
        return '<p>' + inlineHtml(b.html || b.text) + '</p>';
    }
  }

  var bodyHtml = (s.body || []).map(block).join('');
  if (s.heroImage) lbImages.unshift({ src: s.heroImage, caption: s.heroAlt || s.title });

  /* ---------- pieces ---------- */
  var tocHtml = toc.length ? toc.map(function (h) {
    return '<a class="toc-link lvl-' + h.level + '" href="#' + h.id + '">' + esc(h.text) + '</a>';
  }).join('') : '';

  var shareRail =
    '<div class="mt-8">' +
      '<span class="share-h">Share</span>' +
      '<div class="flex flex-wrap gap-2" id="share-set">' +
        '<button class="share-btn" data-share="copy" aria-label="Copy link"><i class="fa-solid fa-link"></i></button>' +
        '<a class="share-btn" data-share="x" aria-label="Share on X" target="_blank" rel="noopener"><i class="fa-brands fa-x-twitter"></i></a>' +
        '<a class="share-btn" data-share="facebook" aria-label="Share on Facebook" target="_blank" rel="noopener"><i class="fa-brands fa-facebook-f"></i></a>' +
        '<a class="share-btn" data-share="whatsapp" aria-label="Share on WhatsApp" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i></a>' +
        '<a class="share-btn" data-share="email" aria-label="Share by email"><i class="fa-solid fa-envelope"></i></a>' +
      '</div>' +
      '<span id="share-msg" class="mt-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-accent" hidden>Link copied</span>' +
    '</div>';

  var qfHtml = s.quickFacts ? (function () {
    var q = s.quickFacts, rows = [
      ['Duration', q.duration], ['Difficulty', q.difficulty], ['Max elevation', q.maxElevation],
      ['Best season', q.season], ['Region', q.region], ['Start point', q.start]
    ].filter(function (r) { return r[1]; });
    return '<div class="rail-card"><span class="rail-h">Quick Facts</span>' +
      rows.map(function (r) { return '<div class="qf-row"><span class="qf-k">' + esc(r[0]) + '</span><span class="qf-v">' + esc(r[1]) + '</span></div>'; }).join('') +
      '</div>';
  })() : '';

  var sameTrail = window.getSameTrail ? window.getSameTrail(s.slug) : { treks: [], stories: [] };
  var TREKS = window.TREKS || {};
  function trekName(sl) {
    if (TREKS[sl] && TREKS[sl].name) return TREKS[sl].name.replace(/ Trek$/, '');
    return sl.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }
  var sameTrailHtml = (sameTrail.treks.length || sameTrail.stories.length) ? (
    '<div class="rail-card' + (qfHtml ? ' mt-4' : '') + '"><span class="rail-h">From the same trail</span>' +
      sameTrail.treks.map(function (t) { return '<a class="rail-link" href="/treks/' + esc(t) + '"><span>' + esc(trekName(t)) + '</span><span aria-hidden="true">&rarr;</span></a>'; }).join('') +
      sameTrail.stories.map(function (st) { return '<a class="rail-link" href="/stories/' + esc(st.slug) + '"><span>' + esc(st.title) + '</span><span aria-hidden="true">&rarr;</span></a>'; }).join('') +
    '</div>'
  ) : '';

  var railR = qfHtml + sameTrailHtml;

  var related = (window.getRelatedStories ? window.getRelatedStories(s.slug, 3) : []);

  /* ---------- render ---------- */
  document.getElementById('story-mini-title') && (document.getElementById('story-mini-title').textContent = s.title);

  root.innerHTML =
    /* header */
    '<header class="relative overflow-hidden border-b border-border">' +
      '<div class="absolute inset-0 z-0">' + imgTag(s.heroImage, '', 'h-full w-full object-cover opacity-25', s.title) + '</div>' +
      '<div class="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-background via-background/90 to-background/55"></div>' +
      '<div class="article-wrap relative z-10" style="padding-top:clamp(3.25rem,6vw,4.5rem);padding-bottom:clamp(2.25rem,4vw,3rem)">' +
        '<nav class="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-5" aria-label="Breadcrumb"><a href="/stories" class="hover:text-accent">Field Journal</a> <span class="text-border">/</span> ' + esc(s.category) + '</nav>' +
        '<span class="font-mono text-[10px] uppercase tracking-[0.26em] text-accent">' + esc(s.category) + '</span>' +
        '<h1 class="sec-h mt-3 text-foreground" style="font-size:clamp(1.9rem,3.6vw,3rem);text-wrap:balance">' + esc(s.title) + '</h1>' +
        (s.excerpt ? '<p class="mt-4 font-sans leading-relaxed text-muted-foreground" style="font-size:clamp(1rem,1.4vw,1.2rem)">' + esc(s.excerpt) + '</p>' : '') +
        '<div class="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">' +
          '<span class="text-foreground/90">' + esc(s.author || 'Himalayan Magic Adventure') + '</span>' +
          (s.authorRole ? '<span class="text-border">·</span><span>' + esc(s.authorRole) + '</span>' : '') +
          '<span class="text-border">·</span><span>' + esc(fmtDate(s.date)) + '</span>' +
          (s.readMinutes ? '<span class="text-border">·</span><span>' + esc(s.readMinutes) + ' min read</span>' : '') +
          (s.updated ? '<span class="text-border">·</span><span>Updated ' + esc(fmtDate(s.updated)) + '</span>' : '') +
        '</div>' +
      '</div>' +
    '</header>' +

    /* cinematic hero image */
    '<div class="story-shell" style="padding-top:var(--sp-m)">' +
      '<figure class="overflow-hidden border border-border">' +
        '<button type="button" data-lb="0" style="display:block;width:100%;border:0;padding:0;background:none;cursor:zoom-in" aria-label="Open image">' +
        imgTag(s.heroImage, s.heroAlt || s.title, 'w-full object-cover aspect-[16/9] md:aspect-[21/9]', s.title) + '</button>' +
        (s.heroAlt ? '<figcaption class="article-figcaption px-1 pt-2">' + esc(s.heroAlt) + '</figcaption>' : '') +
      '</figure>' +
    '</div>' +

    /* 3-column body */
    '<div class="story-shell" style="padding-top:var(--sp-m);padding-bottom:var(--sp-l)">' +
      '<div class="story-grid">' +

        /* left rail */
        '<aside class="story-rail-l">' +
          (tocHtml ? '<nav aria-label="Table of contents"><span class="toc-h">On this page</span>' + tocHtml + '</nav>' : '') +
          shareRail +
        '</aside>' +

        /* article */
        '<article>' +
          (tocHtml ? '<details class="toc-mobile"><summary>On this page <span aria-hidden="true">▾</span></summary>' + tocHtml + '</details>' : '') +
          '<div class="article-prose">' + bodyHtml + '</div>' +

          (s.tags && s.tags.length ?
            '<div class="mt-12 flex flex-wrap gap-2 border-t border-border pt-7">' +
            s.tags.map(function (tg) { return '<span class="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground border border-border px-2.5 py-1">' + esc(tg) + '</span>'; }).join('') +
            '</div>' : '') +

          '<div class="mt-7 border border-border bg-card px-6 py-5">' +
            '<span class="block font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-1">Written by</span>' +
            '<span class="block font-heading text-lg uppercase tracking-tight text-foreground">' + esc(s.author || 'Himalayan Magic Adventure') + '</span>' +
            (s.authorRole ? '<span class="block font-mono text-[11px] text-muted-foreground mt-0.5">' + esc(s.authorRole) + '</span>' : '') +
            '<p class="mt-3 font-sans text-[13px] leading-relaxed text-muted-foreground">Part of the guiding and operations team at Himalayan Magic Adventure, working the trails and peaks of the Nepal Himalaya since 1993.</p>' +
          '</div>' +

          /* right-rail content, inline on smaller screens */
          (railR ? '<div class="story-rail-r-inline mt-8">' + railR + '</div>' : '') +

          '<div class="mt-8"><a href="/stories" class="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent hover:gap-3 transition-all"><span aria-hidden="true">&larr;</span> All stories</a></div>' +
        '</article>' +

        /* right rail */
        (railR ? '<aside class="story-rail-r">' + railR + '</aside>' : '<aside class="story-rail-r"></aside>') +

      '</div>' +
    '</div>' +

    /* continue exploring */
    (related.length ?
      '<section class="border-t border-border bg-[#191b1f]">' +
        '<div class="story-shell" style="padding-top:var(--sp-m);padding-bottom:var(--sp-l)">' +
          '<span class="kicker"><span style="display:inline-block;width:1.8rem;height:1px;background:var(--accent);vertical-align:middle;margin-right:.6rem"></span>Continue Exploring</span>' +
          '<div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">' +
          related.map(function (r) {
            return '<a href="/stories/' + esc(r.slug) + '" class="group flex flex-col border border-border bg-card hover:border-accent transition-colors overflow-hidden">' +
              '<div class="aspect-[16/10] overflow-hidden">' + imgTag(r.heroImage, r.title, 'h-full w-full object-cover opacity-75 group-hover:opacity-100 transition-all duration-500', r.title, ' style="transition:transform .45s ease,opacity .3s"') + '</div>' +
              '<div class="flex flex-1 flex-col p-5">' +
                '<span class="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">' + esc(r.category) + '</span>' +
                '<h3 class="mt-1.5 font-heading text-[1.2rem] uppercase tracking-tight text-foreground leading-[1.15] group-hover:text-accent transition-colors">' + esc(r.title) + '</h3>' +
                '<span class="mt-auto pt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">' + esc(fmtDate(r.date)) + (r.readMinutes ? ' · ' + r.readMinutes + ' min' : '') + '</span>' +
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

  /* ---------- TOC scroll-spy + smooth anchor ---------- */
  var tocLinks = Array.prototype.slice.call(root.querySelectorAll('.story-rail-l .toc-link'));
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var heads = toc.map(function (h) { return document.getElementById(h.id); }).filter(Boolean);
    var spy = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (!e.isIntersecting) return;
        tocLinks.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    heads.forEach(function (h) { spy.observe(h); });
  }
  root.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var el = document.getElementById(a.getAttribute('href').slice(1));
      if (!el) return;
      e.preventDefault();
      var y = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ---------- share ---------- */
  var URL_ENC = encodeURIComponent(canonical);
  var TITLE_ENC = encodeURIComponent(s.title);
  function wireShare(scope) {
    scope.querySelectorAll('[data-share]').forEach(function (el) {
      var kind = el.getAttribute('data-share');
      if (kind === 'x') el.href = 'https://twitter.com/intent/tweet?text=' + TITLE_ENC + '&url=' + URL_ENC;
      else if (kind === 'facebook') el.href = 'https://www.facebook.com/sharer/sharer.php?u=' + URL_ENC;
      else if (kind === 'whatsapp') el.href = 'https://wa.me/?text=' + TITLE_ENC + '%20' + URL_ENC;
      else if (kind === 'email') el.href = 'mailto:?subject=' + TITLE_ENC + '&body=' + URL_ENC;
      else if (kind === 'copy') {
        el.addEventListener('click', function () {
          var done = function () {
            var m = document.getElementById('share-msg');
            if (m) { m.hidden = false; setTimeout(function () { m.hidden = true; }, 1800); }
          };
          try { navigator.clipboard.writeText(canonical).then(done, done); } catch (x) { done(); }
        });
      }
    });
  }
  var shareScope = root.querySelector('.story-rail-l');
  if (shareScope) wireShare(shareScope);

  var miniShare = document.getElementById('story-mini-share');
  if (miniShare) {
    miniShare.addEventListener('click', function () {
      if (navigator.share) { navigator.share({ title: s.title, url: canonical }).catch(function () {}); }
      else {
        var done = function () {
          miniShare.innerHTML = '<i class="fa-solid fa-check"></i>';
          setTimeout(function () { miniShare.innerHTML = '<i class="fa-solid fa-share-nodes"></i>'; }, 1600);
        };
        try { navigator.clipboard.writeText(canonical).then(done, done); } catch (x) { done(); }
      }
    });
  }

  /* ---------- sticky mini-nav ---------- */
  var mini = document.getElementById('story-mini');
  var hdr = root.querySelector('header');
  if (mini && hdr && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (ents) {
      mini.classList.toggle('show', !ents[0].isIntersecting);
    }, { rootMargin: '-60px 0px 0px 0px' }).observe(hdr);
  }

  /* ---------- lightbox ---------- */
  (function () {
    var lb = document.getElementById('lightbox');
    if (!lb || !lbImages.length) return;
    var lbImg = document.getElementById('lb-img');
    var lbCap = document.getElementById('lb-cap');
    var idx = 0, lastFocus = null;

    function show(i) {
      idx = (i + lbImages.length) % lbImages.length;
      var it = lbImages[idx];
      lbImg.src = it.src;
      lbImg.alt = it.caption || '';
      lbCap.textContent = it.caption || '';
      var multi = lbImages.length > 1;
      document.getElementById('lb-prev').style.display = multi ? '' : 'none';
      document.getElementById('lb-next').style.display = multi ? '' : 'none';
    }
    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      lb.classList.add('open');
      document.documentElement.style.overflow = 'hidden';
      document.getElementById('lb-close').focus();
    }
    function close() {
      lb.classList.remove('open');
      document.documentElement.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-lb]');
      if (!t) return;
      e.preventDefault();
      open(parseInt(t.getAttribute('data-lb'), 10) || 0);
    });
    document.getElementById('lb-close').addEventListener('click', close);
    document.getElementById('lb-prev').addEventListener('click', function () { show(idx - 1); });
    document.getElementById('lb-next').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage')) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === 'Tab') { e.preventDefault(); document.getElementById('lb-close').focus(); }
    });
  })();
})();
