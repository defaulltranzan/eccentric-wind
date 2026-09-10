/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — floating social system            (2026-09-09)
   ----------------------------------------------------------------------------
   Self-injecting (menu.js / back.js / compass-nav.js pattern). Loaded per page
   via <script src="/social.js">. No dependencies, no icon font, no keyframes —
   transform + opacity only.

   DESKTOP (>=1024px)  vertical rail on the right edge, vertically centred, with
                       a hairline "route line" spine and slide-in tooltips.
   MOBILE  (<1024px)   one assembly in the bottom-right, stacked ABOVE the
                       existing theme/language cluster: WhatsApp is the primary
                       action (always one tap) and a tethered toggle expands the
                       rest upward. Absolutely positioned => zero layout shift.

   Brand tokens only (var(--accent)/--card/--border/...) so it re-tints with
   theme.js light-mode automatically.

   TO ADD A PLATFORM: add an entry to LINKS below with a real `href`. Entries
   with href:null are inert and never rendered (see YouTube / TikTok).

   Revert: restore this file from git + delete any <script src="/social.js"> tag.
   ========================================================================== */
(function () {
  'use strict';
  if (window.__hmeSocialInstalled) return;
  window.__hmeSocialInstalled = true;

  var BRAND = 'Himalayan Magic Adventure';

  /* ---- icons: inline SVG path data --------------------------------------- */
  var ICON = {
    facebook: {
      box: '0 0 320 512',
      d: 'M80 299.3V512h116V299.3h86.5l18-97.8H196v-34.6c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4.4 37 1.2V7.9C291.4 4 256.4 0 236.2 0 129.3 0 80 50.5 80 159.4v42.1H14v97.8h66z'
    },
    instagram: {
      box: '0 0 24 24',
      d: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06L12 2.16zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.846-10.405a1.441 1.441 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z'
    },
    whatsapp: {
      box: '0 0 24 24',
      d: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z'
    },
    email: {
      box: '0 0 24 24',
      d: 'M3 4.5h18A1.5 1.5 0 0 1 22.5 6v.62l-9.98 6.06a1 1 0 0 1-1.04 0L1.5 6.62V6A1.5 1.5 0 0 1 3 4.5Zm19.5 3.87V18a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 18V8.37l9.46 5.75a2 2 0 0 0 2.08 0l9.46-5.75Z'
    },
    youtube: {
      box: '0 0 24 24',
      d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
    },
    tiktok: {
      box: '0 0 24 24',
      d: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z'
    }
  };

  /* ---- configuration -----------------------------------------------------
     primary:true  => WhatsApp treatment (accent fill, larger, mobile FAB).
     href:null     => channel not published yet; skipped entirely.
                      Drop the real URL in to switch it on — nothing else.
     tint          => "r,g,b" of the platform colour, used ONLY as a hover
                      accent so the brand palette stays in charge at rest.
     --------------------------------------------------------------------- */
  var LINKS = [
    { key: 'instagram', icon: 'instagram', name: 'Instagram', tip: 'Follow our adventures',
      href: 'https://www.instagram.com/himalayanmagic1993',
      aria: 'Follow ' + BRAND + ' on Instagram', tint: '225,48,108' },

    { key: 'facebook', icon: 'facebook', name: 'Facebook', tip: 'Join our community',
      href: 'https://www.facebook.com/himalayanmagic1993',
      aria: 'Visit ' + BRAND + ' on Facebook', tint: '24,119,242' },

    { key: 'youtube', icon: 'youtube', name: 'YouTube', tip: 'Watch our journeys',
      href: null,
      aria: 'Watch ' + BRAND + ' on YouTube', tint: '255,0,0' },

    { key: 'tiktok', icon: 'tiktok', name: 'TikTok', tip: 'See the trail in motion',
      href: null,
      aria: 'Follow ' + BRAND + ' on TikTok', tint: '37,244,238' },

    { key: 'email', icon: 'email', name: 'Email', tip: 'Write to the desk',
      href: 'mailto:info@himalayanmagic.com', internal: true,
      aria: 'Email ' + BRAND, tint: '240,98,37' },

    { key: 'whatsapp', icon: 'whatsapp', name: 'WhatsApp', tip: 'Talk to our team',
      href: 'https://wa.me/9779841454599', primary: true,
      aria: 'Contact ' + BRAND + ' on WhatsApp', tint: '37,211,102' }
  ].filter(function (l) { return !!l.href; });

  if (!LINKS.length) return;

  var PRIMARY = LINKS.filter(function (l) { return l.primary; })[0] || null;
  var SECOND = LINKS.filter(function (l) { return !l.primary; });

  /* ---- styles ------------------------------------------------------------ */
  var css = [
    /* ---------- shared shell ---------- */
    '#hme-social{--soc-size:3.375rem;--soc-primary:3.75rem;--soc-gap:.7rem;',
      '--soc-ease:cubic-bezier(.2,.7,.3,1);',
      'position:fixed;z-index:44;display:flex;flex-direction:column;align-items:center;',
      'gap:var(--soc-gap);font-family:"IBM Plex Sans",system-ui,sans-serif;',
      'transition:opacity .4s ease}',

    /* dim while the user is actively scrolling, restore on interaction */
    '#hme-social.is-scrolling{opacity:.55}',
    '#hme-social.is-scrolling:hover,#hme-social.is-scrolling:focus-within,',
      '#hme-social.is-open{opacity:1}',

    /* ---------- the button ---------- */
    '.hme-soc-btn{position:relative;display:flex;align-items:center;justify-content:center;',
      'width:var(--soc-size);height:var(--soc-size);border-radius:9999px;',
      'color:var(--foreground,#f3f4f6);text-decoration:none;',
      'background:color-mix(in srgb,var(--card,#22252a) 88%,transparent);',
      'border:1px solid var(--border,#2e3239);',
      '-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);',
      'box-shadow:0 14px 34px -16px rgba(0,0,0,.75),inset 0 1px 0 rgba(255,255,255,.05);',
      'opacity:0;transform:translateY(10px) scale(.9);',
      'transition:transform .3s var(--soc-ease),opacity .3s var(--soc-ease),',
        'color .22s ease,border-color .22s ease,background-color .22s ease,box-shadow .3s ease}',
    /* fallback where color-mix is unsupported */
    '@supports not (background:color-mix(in srgb,red 50%,transparent)){',
      '.hme-soc-btn{background:var(--card,#22252a)}}',

    /* resting glyphs sit a touch below full strength so the rail reads as
       chrome, then come up to full colour on hover — same restraint the
       header nav uses (muted -> accent). */
    '.hme-soc-btn svg{width:1.5rem;height:1.5rem;fill:currentColor;opacity:.78;',
      'transition:transform .3s var(--soc-ease),opacity .22s ease}',

    /* Entrance: staggered, driven by --i. The "let the hero land first" beat
       lives in the transition-delay rather than a JS timer, so a page that
       loads in a background tab (where timers are throttled) can never get
       stranded at opacity:0. */
    /* delay list is positional against the transition list above:
       transform, opacity, colour, border, background, shadow — so only the
       entrance is staggered and hover feedback stays instant. */
    '#hme-social.is-ready .hme-soc-btn{opacity:1;transform:translateY(0) scale(1);',
      'transition-delay:calc(320ms + var(--i,0) * 65ms),',
        'calc(320ms + var(--i,0) * 65ms),0s,0s,0s,0s}',
    '#hme-social.is-ready .hme-soc-btn:hover,',
      '#hme-social.is-ready .hme-soc-btn:focus-visible{transition-delay:0s}',

    /* hover / focus — brand-first, platform tint only as the accent */
    '.hme-soc-btn:hover,.hme-soc-btn:focus-visible{',
      'color:rgb(var(--soc-tint));border-color:rgba(var(--soc-tint),.6);',
      'background:color-mix(in srgb,var(--card,#22252a) 94%,rgb(var(--soc-tint)));',
      'box-shadow:0 18px 40px -16px rgba(0,0,0,.8),0 0 0 4px rgba(var(--soc-tint),.12),',
        'inset 0 1px 0 rgba(255,255,255,.06)}',
    '#hme-social.is-ready .hme-soc-btn:hover,',
      '#hme-social.is-ready .hme-soc-btn:focus-visible{transform:translateY(-2px) scale(1.06)}',
    '.hme-soc-btn:hover svg,.hme-soc-btn:focus-visible svg{transform:scale(1.09);opacity:1}',
    '#hme-social.is-ready .hme-soc-btn:active{transform:translateY(0) scale(.95)}',

    '.hme-soc-btn:focus-visible{outline:2px solid var(--accent,#f06225);outline-offset:3px}',

    /* ---------- WhatsApp: the priority channel ---------- */
    '.hme-soc-btn.is-primary{width:var(--soc-primary);height:var(--soc-primary);',
      'color:#fff;background:var(--accent,#f06225);border-color:var(--accent,#f06225);',
      'box-shadow:0 16px 38px -14px rgba(240,98,37,.6),inset 0 1px 0 rgba(255,255,255,.16)}',
    '.hme-soc-btn.is-primary svg{width:1.65rem;height:1.65rem;opacity:1}',
    '.hme-soc-btn.is-primary:hover,.hme-soc-btn.is-primary:focus-visible{',
      'color:#fff;background:rgb(var(--soc-tint));border-color:rgb(var(--soc-tint));',
      'box-shadow:0 20px 44px -14px rgba(var(--soc-tint),.6),0 0 0 4px rgba(var(--soc-tint),.16),',
        'inset 0 1px 0 rgba(255,255,255,.18)}',

    /* ---------- tooltip (pointer devices only) ---------- */
    '.hme-soc-tip{position:absolute;right:calc(100% + .8rem);top:50%;',
      'display:none;flex-direction:column;gap:.15rem;padding:.5rem .75rem;',
      'background:var(--card,#22252a);border:1px solid var(--border,#2e3239);border-radius:3px;',
      '-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);',
      'box-shadow:0 12px 30px -12px rgba(0,0,0,.7);',
      'white-space:nowrap;pointer-events:none;opacity:0;',
      'transform:translateY(-50%) translateX(8px);',
      'transition:opacity .24s var(--soc-ease),transform .24s var(--soc-ease)}',
    '.hme-soc-tip b{font-family:"IBM Plex Mono",monospace;font-size:9px;font-weight:600;',
      'letter-spacing:.2em;text-transform:uppercase;color:var(--accent,#f06225)}',
    '.hme-soc-tip i{font-style:normal;font-size:12px;line-height:1.2;',
      'color:var(--foreground,#f3f4f6)}',
    /* notch — echoes the site corner-bracket motif */
    '.hme-soc-tip::after{content:"";position:absolute;right:-4px;top:50%;width:6px;height:6px;',
      'margin-top:-3px;background:var(--card,#22252a);',
      'border-right:1px solid var(--border,#2e3239);border-top:1px solid var(--border,#2e3239);',
      'transform:rotate(45deg)}',

    '@media (hover:hover) and (pointer:fine){',
      '.hme-soc-tip{display:flex}',
      '.hme-soc-btn:hover .hme-soc-tip,.hme-soc-btn:focus-visible .hme-soc-tip{',
        'opacity:1;transform:translateY(-50%) translateX(0)}}',

    /* ---------- mobile toggle (plus -> x) ---------- */
    '#hme-soc-toggle{position:relative;display:flex;align-items:center;justify-content:center;',
      'width:3rem;height:3rem;padding:0;border-radius:9999px;cursor:pointer;',
      'appearance:none;-webkit-appearance:none;',
      'color:var(--muted-foreground,#9ca3af);',
      'background:color-mix(in srgb,var(--card,#22252a) 88%,transparent);',
      'border:1px solid var(--border,#2e3239);',
      '-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);',
      'box-shadow:0 12px 28px -14px rgba(0,0,0,.75),inset 0 1px 0 rgba(255,255,255,.05);',
      'opacity:0;transform:translateY(10px) scale(.9);',
      'transition:transform .3s var(--soc-ease),opacity .3s var(--soc-ease),',
        'color .22s ease,border-color .22s ease}',
    '@supports not (background:color-mix(in srgb,red 50%,transparent)){',
      '#hme-soc-toggle{background:var(--card,#22252a)}}',
    '#hme-social.is-ready #hme-soc-toggle{opacity:1;transform:translateY(0) scale(1);',
      'transition-delay:320ms,320ms,0s,0s}',
    '#hme-soc-toggle:hover,#hme-soc-toggle:focus-visible{',
      'color:var(--accent,#f06225);border-color:var(--accent,#f06225)}',
    '#hme-soc-toggle:focus-visible{outline:2px solid var(--accent,#f06225);outline-offset:3px}',
    '#hme-soc-toggle .hme-soc-x{position:absolute;width:15px;height:1.5px;border-radius:1px;',
      'background:currentColor;transition:transform .3s var(--soc-ease)}',
    '#hme-soc-toggle .hme-soc-x:last-child{transform:rotate(90deg)}',
    '#hme-social.is-open #hme-soc-toggle{color:var(--accent,#f06225);',
      'border-color:var(--accent,#f06225)}',
    '#hme-social.is-open #hme-soc-toggle .hme-soc-x{transform:rotate(45deg)}',
    '#hme-social.is-open #hme-soc-toggle .hme-soc-x:last-child{transform:rotate(-45deg)}',

    /* hairline tethering the toggle to the WhatsApp action */
    '#hme-soc-toggle::after{content:"";position:absolute;top:100%;left:50%;width:1px;',
      'height:var(--soc-gap);margin-left:-.5px;',
      'background:linear-gradient(to bottom,var(--border,#2e3239),transparent)}',

    /* ---------- group holding the non-primary links ---------- */
    '#hme-soc-more{display:flex;flex-direction:column;align-items:center;gap:var(--soc-gap)}',

    /* ============ DESKTOP: right-edge rail ============ */
    '@media (min-width:1024px){',
      '#hme-social{right:1.35rem;top:50%;transform:translateY(-50%)}',
      '#hme-soc-toggle{display:none}',
      /* "route line" spine — reads only in the gaps between stations */
      '#hme-social::before{content:"";position:absolute;left:50%;top:-1.35rem;bottom:-1.35rem;',
        'width:1px;margin-left:-.5px;z-index:-1;',
        'background:linear-gradient(to bottom,transparent,var(--border,#2e3239) 18%,',
          'var(--border,#2e3239) 82%,transparent)}',
      /* survey-marker ticks, top & bottom */
      '#hme-social::after{content:"";position:absolute;left:50%;top:-1.35rem;bottom:-1.35rem;',
        'width:7px;margin-left:-3.5px;z-index:-1;',
        'border-top:1px solid rgba(240,98,37,.45);border-bottom:1px solid rgba(240,98,37,.45);',
        'opacity:0;transition:opacity .35s ease}',
      '#hme-social.is-ready::after{opacity:1}',
    '}',

    /* ============ MOBILE / TABLET: bottom-right assembly ============
       Sits above the existing theme + language cluster (bottom-6, 2.75rem tall).
       #hme-soc-more is absolutely positioned => opening shifts no layout.     */
    '@media (max-width:1023px){',
      '#hme-social{right:1.5rem;',
        'bottom:calc(1.5rem + 2.75rem + .9rem + env(safe-area-inset-bottom,0px));',
        '--soc-size:3rem;--soc-primary:3.5rem}',
      '#hme-social.has-mcta{',
        'bottom:calc(1.5rem + 2.75rem + .9rem + 3.9rem + env(safe-area-inset-bottom,0px))}',
      '#hme-soc-more{position:absolute;bottom:calc(100% + var(--soc-gap));right:0;',
        'align-items:flex-end}',
      /* two ids so this outranks the .is-ready entrance delay */
      '#hme-social #hme-soc-more .hme-soc-btn{opacity:0;transform:translateY(14px) scale(.7);',
        'visibility:hidden;pointer-events:none;transition-delay:0s}',
      '#hme-social.is-open #hme-soc-more .hme-soc-btn{opacity:1;visibility:visible;',
        'pointer-events:auto;transform:translateY(0) scale(1);',
        'transition-delay:calc(var(--j,0) * 45ms)}',
      '.hme-soc-btn svg{width:1.375rem;height:1.375rem}',
      '.hme-soc-btn.is-primary svg{width:1.55rem;height:1.55rem}',
      '.hme-soc-tip{display:none !important}',
    '}',
    /* Small handsets: tighten the edge inset and the primary, but never take a
       target below the 48px comfortable-touch floor. */
    '@media (max-width:380px){',
      '#hme-social{right:1.1rem;--soc-gap:.6rem;--soc-primary:3.35rem}}',

    /* ---------- light mode: lift the surfaces off a white page ---------- */
    'body.light-mode .hme-soc-btn,body.light-mode #hme-soc-toggle{',
      'border-color:rgba(0,0,0,.10);',
      'box-shadow:0 14px 30px -16px rgba(0,0,0,.35),0 1px 2px rgba(0,0,0,.06)}',
    'body.light-mode .hme-soc-btn.is-primary{',
      'box-shadow:0 16px 34px -14px rgba(214,77,22,.55),inset 0 1px 0 rgba(255,255,255,.25)}',
    'body.light-mode .hme-soc-tip{box-shadow:0 12px 30px -14px rgba(0,0,0,.3)}',

    /* ---------- reduced motion ---------- */
    '@media (prefers-reduced-motion:reduce){',
      '#hme-social .hme-soc-btn,#hme-social #hme-soc-toggle,.hme-soc-tip,',
        '.hme-soc-btn svg,#hme-soc-toggle .hme-soc-x{',
        'transition-duration:.01ms !important;transition-delay:0s !important}',
      '#hme-social.is-ready .hme-soc-btn,#hme-social.is-ready #hme-soc-toggle{transform:none}',
      '#hme-social.is-ready .hme-soc-btn:hover,',
        '#hme-social.is-ready .hme-soc-btn:focus-visible,',
        '#hme-social.is-ready .hme-soc-btn:active{transform:none}',
      '.hme-soc-btn:hover svg,.hme-soc-btn:focus-visible svg{transform:none}',
      '#hme-social.is-scrolling{opacity:1}',
    '}'
  ].join('');

  /* ---- markup ------------------------------------------------------------ */
  function svg(name) {
    var i = ICON[name];
    return '<svg viewBox="' + i.box + '" aria-hidden="true" focusable="false">' +
      '<path d="' + i.d + '"/></svg>';
  }

  function button(l, i, j) {
    var ext = !l.internal;
    return '<a class="hme-soc-btn' + (l.primary ? ' is-primary' : '') + '"' +
      ' href="' + l.href + '"' +
      ' style="--soc-tint:' + l.tint + ';--i:' + i + (j != null ? ';--j:' + j : '') + '"' +
      (ext ? ' target="_blank" rel="noopener noreferrer"' : '') +
      ' aria-label="' + l.aria + '">' +
      svg(l.icon) +
      '<span class="hme-soc-tip" aria-hidden="true"><b>' + l.name + '</b>' +
      '<i>' + l.tip + '</i></span>' +
      '</a>';
  }

  var styleEl = document.createElement('style');
  styleEl.textContent = css;

  var rail = document.createElement('nav');
  rail.id = 'hme-social';
  rail.setAttribute('aria-label', BRAND + ' on social media');

  /* DOM order: secondary links, then toggle, then WhatsApp.
     Desktop hides the toggle => a clean top-to-bottom rail ending on WhatsApp.
     Mobile pins WhatsApp at the bottom with the toggle directly above it. */
  var html = '<div id="hme-soc-more">' +
    SECOND.map(function (l, k) {
      /* --j reverses the stagger on mobile so items fly outward from the toggle */
      return button(l, k, SECOND.length - 1 - k);
    }).join('') +
    '</div>';

  if (PRIMARY) {
    html += '<button id="hme-soc-toggle" type="button" aria-expanded="false"' +
      ' aria-controls="hme-soc-more"' +
      ' aria-label="Show more ways to follow ' + BRAND + '">' +
      '<span class="hme-soc-x"></span><span class="hme-soc-x"></span></button>';
    html += button(PRIMARY, SECOND.length);
  }
  rail.innerHTML = html;

  /* ---- behaviour --------------------------------------------------------- */
  var toggle = null;

  function isOpen() { return rail.classList.contains('is-open'); }

  function setOpen(open) {
    if (!toggle) return;
    rail.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function wire() {
    toggle = rail.querySelector('#hme-soc-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!isOpen());
    });

    /* collapse once a network has been picked */
    var more = rail.querySelectorAll('#hme-soc-more .hme-soc-btn');
    Array.prototype.forEach.call(more, function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });

    /* outside tap / Escape */
    document.addEventListener('click', function (e) {
      if (isOpen() && !rail.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });
    /* never leave it open behind a desktop layout */
    window.addEventListener('resize', function () {
      if (isOpen() && window.innerWidth >= 1024) setOpen(false);
    }, { passive: true });
  }

  /* Soften while scrolling, restore once it stops. rAF-throttled: a scroll
     event does nothing beyond resetting a timer. */
  var scrollTimer = null, ticking = false;
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () {
        if (!rail.classList.contains('is-scrolling')) rail.classList.add('is-scrolling');
        ticking = false;
      });
    }
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      rail.classList.remove('is-scrolling');
    }, 550);
  }

  function mount() {
    if (!document.body) return;
    document.head.appendChild(styleEl);
    document.body.appendChild(rail);

    /* pages with a sticky mobile booking bar need extra clearance */
    if (document.getElementById('mobile-cta')) rail.classList.add('has-mcta');

    wire();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Flip to the resting state on the next painted frame. Two rAFs so the
       initial styles are committed first and the transition actually runs;
       the settle beat itself is a CSS transition-delay. In a background tab
       rAF simply waits until the tab is shown, so the rail animates in the
       first time it is actually looked at instead of stranding at opacity:0
       behind a throttled timer. */
    function reveal() {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { rail.classList.add('is-ready'); });
      });
    }

    /* Stay out of the hero. On a page that opens with a full-bleed hero the
       rail holds back until that hero has largely scrolled away, then enters
       with its normal stagger — the hero keeps its own CTAs uncluttered.
       Pages with no hero reveal immediately.
       Revert: call reveal() unconditionally and delete this block. */
    var hero = document.querySelector('section[data-media]');
    if (hero && 'IntersectionObserver' in window) {
      var shown = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          // fire once the hero is mostly out of view
          if (!shown && !e.isIntersecting) { shown = true; io.disconnect(); reveal(); }
        });
      }, { rootMargin: '-25% 0px 0px 0px', threshold: 0 });
      io.observe(hero);
      // already scrolled past on load (deep link / restored position)
      if (hero.getBoundingClientRect().bottom < window.innerHeight * 0.75) {
        shown = true; io.disconnect(); reveal();
      }
    } else {
      reveal();
    }
  }

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
