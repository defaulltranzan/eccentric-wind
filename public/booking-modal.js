/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — booking popup  (window.HMABookingModal)

   Opens from:
     · any element with  data-book="<slug>" [data-book-type="trek|expedition"]
       (data-book="" opens the global "what would you like to explore?" flow)
     · any link to        /contact?trip=<slug>   (trip-page CTAs — still a normal link without JS)
     · a URL hash          #book  or  #book=<slug>
     · code                HMABookingModal.open({ slug, type })

   Data:    GET /api/trips/:slug  (image, facts, real price tiers, inclusions)  ·  GET /api/trips
   Submit:  window.HMABooking.submit()  → POST /api/bookings  (source: 'popup', idempotent)

   Needs /booking-client.js and /booking-modal.css. No dependencies.
   ========================================================================== */
(function () {
  'use strict';
  if (window.HMABookingModal) return;

  /* ------------------------------------------------------------------ constants */
  var WHATSAPP = '9779841454599';                         // the number used across the site
  var FALLBACK_IMAGE = '/images/hero-corridor.webp';
  var MAX_TRAVELERS = 50;
  var STEPS = ['Your adventure', 'Your details', 'Review'];
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  var EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

  // [ISO, name, dial code]
  var COUNTRIES = [
    ['NP', 'Nepal', '977'], ['IN', 'India', '91'], ['CN', 'China', '86'], ['BT', 'Bhutan', '975'], ['BD', 'Bangladesh', '880'],
    ['LK', 'Sri Lanka', '94'], ['PK', 'Pakistan', '92'], ['MV', 'Maldives', '960'], ['US', 'United States', '1'], ['CA', 'Canada', '1'],
    ['GB', 'United Kingdom', '44'], ['IE', 'Ireland', '353'], ['AU', 'Australia', '61'], ['NZ', 'New Zealand', '64'],
    ['DE', 'Germany', '49'], ['FR', 'France', '33'], ['NL', 'Netherlands', '31'], ['BE', 'Belgium', '32'], ['LU', 'Luxembourg', '352'],
    ['CH', 'Switzerland', '41'], ['AT', 'Austria', '43'], ['IT', 'Italy', '39'], ['ES', 'Spain', '34'], ['PT', 'Portugal', '351'],
    ['SE', 'Sweden', '46'], ['NO', 'Norway', '47'], ['DK', 'Denmark', '45'], ['FI', 'Finland', '358'], ['IS', 'Iceland', '354'],
    ['PL', 'Poland', '48'], ['CZ', 'Czechia', '420'], ['SK', 'Slovakia', '421'], ['HU', 'Hungary', '36'], ['RO', 'Romania', '40'],
    ['BG', 'Bulgaria', '359'], ['GR', 'Greece', '30'], ['HR', 'Croatia', '385'], ['SI', 'Slovenia', '386'], ['EE', 'Estonia', '372'],
    ['LV', 'Latvia', '371'], ['LT', 'Lithuania', '370'], ['MT', 'Malta', '356'], ['CY', 'Cyprus', '357'], ['UA', 'Ukraine', '380'],
    ['RU', 'Russia', '7'], ['KZ', 'Kazakhstan', '7'], ['TR', 'Turkey', '90'], ['IL', 'Israel', '972'], ['AE', 'United Arab Emirates', '971'],
    ['SA', 'Saudi Arabia', '966'], ['QA', 'Qatar', '974'], ['KW', 'Kuwait', '965'], ['BH', 'Bahrain', '973'], ['OM', 'Oman', '968'],
    ['JP', 'Japan', '81'], ['KR', 'South Korea', '82'], ['TW', 'Taiwan', '886'], ['HK', 'Hong Kong', '852'], ['SG', 'Singapore', '65'],
    ['MY', 'Malaysia', '60'], ['TH', 'Thailand', '66'], ['VN', 'Vietnam', '84'], ['PH', 'Philippines', '63'], ['ID', 'Indonesia', '62'],
    ['MM', 'Myanmar', '95'], ['KH', 'Cambodia', '855'], ['MN', 'Mongolia', '976'], ['ZA', 'South Africa', '27'], ['KE', 'Kenya', '254'],
    ['NG', 'Nigeria', '234'], ['EG', 'Egypt', '20'], ['MA', 'Morocco', '212'], ['BR', 'Brazil', '55'], ['AR', 'Argentina', '54'],
    ['CL', 'Chile', '56'], ['CO', 'Colombia', '57'], ['PE', 'Peru', '51'], ['MX', 'Mexico', '52']
  ].sort(function (a, b) { return a[1].localeCompare(b[1]); });
  var COUNTRY_BY_ISO = {};
  COUNTRIES.forEach(function (c) { COUNTRY_BY_ISO[c[0]] = c; });

  /* ------------------------------------------------------------------ icons */
  function svg(path, vb) { return '<svg viewBox="' + (vb || '0 0 24 24') + '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + path + '</svg>'; }
  var I = {
    close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
    arrow: '<svg class="hmb-arrow" viewBox="0 0 18 10" fill="none" aria-hidden="true" focusable="false"><path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" stroke-width="1.5"/></svg>',
    back: '<svg class="hmb-arrow" viewBox="0 0 18 10" fill="none" aria-hidden="true" focusable="false"><path d="M18 5H2M6 1L2 5l4 4" stroke="currentColor" stroke-width="1.5"/></svg>',
    cal: svg('<rect x="3.5" y="5" width="17" height="15" rx="1.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>'),
    chev: '<svg class="hmb-chev" viewBox="0 0 12 8" fill="none" aria-hidden="true" focusable="false"><path d="M1 1.5l5 5 5-5" stroke="currentColor" stroke-width="1.5"/></svg>',
    left: svg('<path d="M15 5l-7 7 7 7"/>'),
    right: svg('<path d="M9 5l7 7-7 7"/>'),
    minus: svg('<path d="M5 12h14"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    days: svg('<rect x="3.5" y="5" width="17" height="15" rx="1.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>'),
    grade: svg('<path d="M3 19l6-10 4 6 2.5-3.5L21 19z"/>'),
    alt: svg('<path d="M4 20L12 5l8 15"/><path d="M9.5 14.5h5"/>'),
    users: svg('<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><path d="M16 5.2a3 3 0 010 5.6M17.5 14.3c1.7.7 2.8 2.3 3 4.7"/>'),
    flex: svg('<path d="M4 12a8 8 0 0113.7-5.6M20 12a8 8 0 01-13.7 5.6"/><path d="M18 3v4h-4M6 21v-4h4"/>'),
    mail: svg('<rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>'),
    check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    checkCircle: svg('<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.8 2.8L16.3 9.5"/>'),
    plusCircle: svg('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'),
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12.04 2a9.9 9.9 0 00-8.5 15l-1.4 5 5.1-1.34A9.9 9.9 0 1012.04 2zm0 18.1a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.03.8.81-2.95-.2-.31A8.2 8.2 0 1112.04 20.1zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06a6.7 6.7 0 01-1.97-1.22 7.4 7.4 0 01-1.37-1.7c-.14-.25 0-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48a.92.92 0 00-.66.31 2.8 2.8 0 00-.87 2.08 4.84 4.84 0 001.02 2.57 11.1 11.1 0 004.25 3.76c.6.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.29z"/></svg>'
  };

  /* ------------------------------------------------------------------ utils */
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function safeImg(u) { u = String(u || '').trim(); return /^(https?:\/\/|\/(?!\/))/i.test(u) ? u : ''; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function ym(y, m) { return y + '-' + pad(m); }
  function today() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function minMonth() { var t = today(); return ym(t.getFullYear(), t.getMonth() + 1); }
  function maxMonth() { return ym(today().getFullYear() + 3, 12); }
  function monthLabel(v) { if (!v) return ''; var p = v.split('-'); return new Date(+p[0], +p[1] - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }); }
  function dateLabel(v) { if (!v) return ''; var p = v.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }); }
  function reduced() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function flag(iso) {
    if (!iso || iso.length !== 2) return '';
    return String.fromCodePoint(127397 + iso.charCodeAt(0), 127397 + iso.charCodeAt(1));
  }
  function guessCountry() {
    try {
      var langs = navigator.languages || [navigator.language];
      for (var i = 0; i < langs.length; i++) {
        var m = String(langs[i] || '').match(/-([A-Z]{2})$/i);
        if (m && COUNTRY_BY_ISO[m[1].toUpperCase()]) return m[1].toUpperCase();
      }
    } catch (_) { /* ignore */ }
    return '';
  }

  /* ------------------------------------------------------------------ data layer */
  var tripCache = {};
  var tripsPromise = null;

  function ensureClient() {
    if (window.HMABooking) return Promise.resolve(window.HMABooking);
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = '/booking-client.js?v=1';
      s.onload = function () { window.HMABooking ? resolve(window.HMABooking) : reject(new Error('client')); };
      s.onerror = function () { reject(new Error('client')); };
      document.head.appendChild(s);
    });
  }

  function loadTrip(slug, type) {
    var key = (type || '') + ':' + slug;
    if (!tripCache[key]) {
      tripCache[key] = fetch('/api/trips/' + encodeURIComponent(slug) + (type ? '?type=' + encodeURIComponent(type) : ''), { headers: { Accept: 'application/json' } })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (j) {
            if (!r.ok || !j.trip) { var e = new Error(j.message || 'Could not load this trip.'); e.status = r.status; throw e; }
            return j.trip;
          });
        })
        .catch(function (err) { delete tripCache[key]; throw err; });
    }
    return tripCache[key];
  }

  function loadTrips() {
    if (!tripsPromise) {
      tripsPromise = ensureClient().then(function (c) { return c.trips(); }).catch(function (err) { tripsPromise = null; throw err; });
    }
    return tripsPromise;
  }

  /* ------------------------------------------------------------------ state */
  var S = freshState();
  function freshState() {
    var iso = guessCountry();
    return {
      step: 1, dir: 1,
      trip: null, tripRef: null, tripStatus: 'none', tripError: '',
      chooserOpen: false, chooserKind: 'trek', chooserQuery: '', trips: null, tripsError: false,
      month: null, date: null, flexible: true, travelers: 1,
      calOpen: null, calYear: today().getFullYear(), calMonth: today().getMonth() + 1,
      first: '', last: '', email: '', dialIso: iso || 'NP', phone: '', country: iso, message: '',
      tier: 0, errors: {}, submitting: false, submitError: '', key: null, success: null
    };
  }

  /* ------------------------------------------------------------------ validation (business rules) */
  function validate(step) {
    var e = {};
    if (step === 1) {
      if (S.tripStatus === 'loading') e.trip = 'Loading your trip details — one moment.';
      else if (S.tripStatus === 'error') e.trip = 'Your trip details didn’t load — tap “Try again” above.';
      else if (!S.trip) e.trip = 'Please choose a trek or expedition.';
      if (!S.month) e.month = 'Please choose when you would like to travel.';
      else if (S.month < minMonth()) e.month = 'That month has already passed — please choose another.';
      if (!S.flexible && !S.date) e.date = 'Please pick your start date, or choose “Yes, I’m flexible”.';
      var n = Number(S.travelers);
      if (!Number.isInteger(n) || n < 1 || n > MAX_TRAVELERS) e.travelers = 'Number of travellers must be between 1 and ' + MAX_TRAVELERS + '.';
    }
    if (step === 2) {
      if (!S.first.trim()) e.first = 'Please enter your first name.';
      if (!S.last.trim()) e.last = 'Please enter your last name.';
      if (!S.email.trim()) e.email = 'Please enter your email address.';
      else if (!EMAIL_RE.test(S.email.trim())) e.email = 'That email address doesn’t look right — please check it.';
      var digits = (dialCode() + S.phone).replace(/\D/g, '');
      if (!S.phone.trim()) e.phone = 'Please enter a phone or WhatsApp number so we can reach you.';
      else if (/[^\d\s+().\-/]/.test(S.phone)) e.phone = 'Use digits only (spaces and dashes are fine).';
      else if (!dialCode() && S.phone.trim().charAt(0) !== '+') e.phone = 'Choose a country code, or start the number with +.';
      else if (digits.length < 7 || digits.length > 15) e.phone = 'Please enter a complete phone number.';
    }
    return e;
  }
  function dialCode() { var c = COUNTRY_BY_ISO[S.dialIso]; return c ? c[2] : ''; }
  function fullPhone() {
    var num = S.phone.trim();
    if (!dialCode() || num.charAt(0) === '+') return num;
    return '+' + dialCode() + ' ' + num.replace(/^0+/, '');
  }

  function payload() {
    var trip = S.trip, tier = trip && trip.pricing && trip.pricing.tiers[S.tier];
    var p = {
      source: 'popup',
      first_name: S.first.trim(), last_name: S.last.trim(),
      email: S.email.trim(), phone: fullPhone(),
      country: S.country ? COUNTRY_BY_ISO[S.country][1] : '',
      people: Number(S.travelers),
      message: S.message.trim(),
      website: (root && root.querySelector('#hmb-website') || {}).value || '',
      page_url: location.href,
      details: { flexible_dates: !!S.flexible }
    };
    if (!S.flexible && S.date) p.preferred_date = S.date; else p.preferred_month = S.month;
    if (trip && trip.type !== 'custom') { p.trip_slug = trip.slug; p.trip_type = trip.type; p.trip_name = trip.name; }
    else if (S.tripRef && S.tripRef.slug) { p.trip_slug = S.tripRef.slug; p.trip_type = S.tripRef.type || ''; p.trip_name = (S.tripRef.name || ''); }
    else p.trip_name = 'Custom adventure — help me choose';
    if (tier) { p.details.package_tier = tier.name; p.details.estimated_price = tier.range; }
    return p;
  }

  /* ------------------------------------------------------------------ DOM shell */
  var root = null, els = {}, lastTrigger = null, pushedHistory = false, pendingBack = false, inerted = [], scrollY = 0, isOpen = false;

  function build() {
    root = document.createElement('div');
    root.className = 'hmb-root';
    root.hidden = true;
    root.innerHTML =
      '<div class="hmb-backdrop" data-hmb-close></div>' +
      '<div class="hmb-dialog" role="dialog" aria-modal="true" aria-labelledby="hmb-title" aria-describedby="hmb-status">' +
        '<button type="button" class="hmb-close" data-hmb-close aria-label="Close booking form">' + I.close + '</button>' +
        '<aside class="hmb-visual" aria-hidden="true">' +
          '<img class="hmb-visual-img" alt="" decoding="async">' +
          '<div class="hmb-brand"><img src="/images/logo-badge-dark-90.png" alt="" width="44" height="40"><span>Himalayan Magic<small>Adventure · Est. 1993</small></span></div>' +
          '<div class="hmb-trip"></div>' +
        '</aside>' +
        '<section class="hmb-panel">' +
          '<header class="hmb-head">' +
            '<div class="hmb-head-row"><h2 class="hmb-title" id="hmb-title">Plan your adventure</h2></div>' +
            '<ol class="hmb-progress" aria-label="Booking steps"></ol>' +
          '</header>' +
          '<div class="hmb-body" tabindex="-1"></div>' +
          '<footer class="hmb-foot"></footer>' +
          '<p class="hmb-sr" id="hmb-status" role="status" aria-live="polite"></p>' +
        '</section>' +
      '</div>';
    document.body.appendChild(root);
    els.dialog = root.querySelector('.hmb-dialog');
    els.img = root.querySelector('.hmb-visual-img');
    els.trip = root.querySelector('.hmb-trip');
    els.progress = root.querySelector('.hmb-progress');
    els.body = root.querySelector('.hmb-body');
    els.foot = root.querySelector('.hmb-foot');
    els.status = root.querySelector('#hmb-status');
    els.head = root.querySelector('.hmb-head');

    els.img.addEventListener('load', function () { els.img.classList.add('is-loaded'); });
    els.img.addEventListener('error', function () {
      if (els.img.getAttribute('src') !== FALLBACK_IMAGE) els.img.src = FALLBACK_IMAGE;
    });

    root.addEventListener('click', onClick);
    root.addEventListener('input', onInput);
    root.addEventListener('change', onChange);
    root.addEventListener('keydown', onKeydown);
  }

  /* ------------------------------------------------------------------ rendering */
  function render(opts) {
    opts = opts || {};
    renderVisual();
    renderProgress();
    if (S.success) { els.body.innerHTML = renderSuccess(); els.foot.innerHTML = ''; els.foot.hidden = true; els.head.hidden = window.innerWidth <= 720; return; }
    els.head.hidden = false;
    els.foot.hidden = false;
    var html = S.step === 1 ? renderStep1() : S.step === 2 ? renderStep2() : renderStep3();
    els.body.innerHTML = '<div class="hmb-step' + (opts.animate && S.dir < 0 ? ' is-back' : '') + '"' + (opts.animate ? '' : ' style="animation:none"') + '>' + html + '</div>';
    els.foot.innerHTML = renderFooter();
  }

  function renderVisual() {
    var t = S.trip;
    var img = safeImg(t && t.image) || FALLBACK_IMAGE;
    if (els.img.getAttribute('src') !== img) {
      els.img.classList.remove('is-loaded');
      els.img.src = img;
      if (els.img.complete && els.img.naturalWidth) els.img.classList.add('is-loaded');
    }
    if (S.tripStatus === 'loading') {
      els.trip.innerHTML = '<span class="hmb-kicker">Loading your trip</span><p class="hmb-trip-name"><span class="hmb-skel" style="width:70%;height:26px"></span></p>' +
        '<ul class="hmb-facts"><li><span class="hmb-skel"></span></li><li><span class="hmb-skel"></span></li><li><span class="hmb-skel"></span></li></ul>';
      return;
    }
    if (!t || t.type === 'custom') {
      els.trip.innerHTML = '<span class="hmb-kicker">The High Corridors of Nepal</span>' +
        '<p class="hmb-trip-name">' + (t ? 'Your custom<br>adventure' : 'Start planning<br>your adventure') + '</p>' +
        '<p class="hmb-trip-tag">Treks, high passes and Himalayan expeditions — led by local guides since 1993.</p>';
      return;
    }
    var f = t.facts || {};
    els.trip.innerHTML =
      '<span class="hmb-kicker">' + esc(t.type === 'trek' ? 'Trek' : 'Expedition') + (t.region ? ' · ' + esc(t.region) : '') + '</span>' +
      '<p class="hmb-trip-name">' + esc(t.name) + '</p>' +
      (t.tagline ? '<p class="hmb-trip-tag">' + esc(t.tagline) + '</p>' : '') +
      '<ul class="hmb-facts">' +
        (f.duration ? '<li>' + I.days + esc(f.duration) + '</li>' : '') +
        (f.difficulty ? '<li>' + I.grade + esc(f.difficulty) + '</li>' : '') +
        (f.altitude ? '<li class="hmb-alt">' + I.alt + esc(f.altitude) + '</li>' : '') +
      '</ul>';
  }

  function renderProgress() {
    var step = S.success ? 4 : S.step;
    els.progress.style.setProperty('--hmb-p', Math.min(1, (step - 1) / 2));
    els.progress.innerHTML = STEPS.map(function (label, i) {
      var n = i + 1, done = n < step, cur = n === step;
      var dot = '<span class="hmb-dot">' + (done ? I.check : '0' + n) + '</span><span class="hmb-step-label">' + label + '</span>';
      var inner = done && !S.success && !S.submitting
        ? '<button type="button" data-hmb-goto="' + n + '" aria-label="Go back to step ' + n + ': ' + label + '">' + dot + '</button>'
        : dot;
      return '<li class="' + (done ? 'is-done' : '') + (cur ? ' is-current' : '') + '"' + (cur ? ' aria-current="step"' : '') + '>' + inner +
        '<span class="hmb-sr">' + (done ? ' (completed)' : cur ? ' (current step)' : '') + '</span></li>';
    }).join('');
  }

  function fieldError(key) {
    return S.errors[key] ? '<p class="hmb-error" id="hmb-err-' + key + '">' + esc(S.errors[key]) + '</p>' : '';
  }
  function invalidAttrs(key) {
    return S.errors[key] ? ' aria-invalid="true" aria-describedby="hmb-err-' + key + '"' : '';
  }

  /* ---------- step 1: your adventure ---------- */
  function renderStep1() {
    var h = '';
    var showChooser = S.chooserOpen || (!S.trip && S.tripStatus !== 'loading');
    if (showChooser) {
      h += '<h3 class="hmb-h" tabindex="-1" data-hmb-focus>What would you like to explore?</h3>' + renderChooser();
      if (!S.trip) return h;
      h += '<div style="height:8px"></div>';
    } else if (S.tripStatus === 'error') {
      h += '<div class="hmb-alert" role="alert"><span>' + esc(S.tripError) + '</span><button type="button" class="hmb-link" data-hmb="retry-trip">Try again</button>' +
        '<button type="button" class="hmb-link" data-hmb="change-trip">Choose another</button></div>';
    } else if (S.trip) {
      h += '<div class="hmb-selected"><div class="hmb-selected-text"><span>Your ' + (S.trip.type === 'custom' ? 'plan' : S.trip.type) + '</span><strong>' + esc(S.trip.name) + '</strong></div>' +
        '<button type="button" class="hmb-link" data-hmb="change-trip" aria-label="Change trip (currently ' + esc(S.trip.name) + ')">Change</button></div>';
    }
    if (S.chooserOpen) return h;

    h += '<h3 class="hmb-h" tabindex="-1"' + (showChooser ? '' : ' data-hmb-focus') + '>When are you planning to go?</h3>';

    // month
    h += '<div class="hmb-field' + (S.errors.month ? ' hmb-invalid' : '') + '">' +
      '<span class="hmb-label" id="hmb-month-label">Preferred travel month <b>*</b></span>' +
      '<button type="button" class="hmb-trigger" data-hmb="toggle-month" aria-expanded="' + (S.calOpen === 'month') + '" aria-controls="hmb-cal-month" aria-labelledby="hmb-month-label hmb-month-value"' + invalidAttrs('month') + '>' +
        I.cal + '<span id="hmb-month-value">' + (S.month ? esc(monthLabel(S.month)) : '<span class="hmb-placeholder">Select a month</span>') + '</span>' + I.chev +
      '</button>' +
      (S.calOpen === 'month' ? renderMonthGrid() : '') +
      fieldError('month') +
    '</div>';

    // travellers
    var n = Number(S.travelers) || 1;
    h += '<div class="hmb-field' + (S.errors.travelers ? ' hmb-invalid' : '') + '">' +
      '<label class="hmb-label" for="hmb-travelers">Number of travellers <b>*</b></label>' +
      '<div class="hmb-stepper" role="group" aria-label="Number of travellers">' +
        '<button type="button" data-hmb="dec" aria-label="Remove a traveller"' + (n <= 1 ? ' disabled' : '') + '>' + I.minus + '</button>' +
        '<input id="hmb-travelers" type="number" inputmode="numeric" min="1" max="' + MAX_TRAVELERS + '" step="1" value="' + esc(S.travelers) + '" data-hmb-field="travelers"' + invalidAttrs('travelers') + '>' +
        '<button type="button" data-hmb="inc" aria-label="Add a traveller"' + (n >= MAX_TRAVELERS ? ' disabled' : '') + '>' + I.plus + '</button>' +
      '</div>' + fieldError('travelers') +
    '</div>';

    // flexibility
    h += '<fieldset class="hmb-radios hmb-field">' +
      '<legend class="hmb-label">Are your dates flexible?</legend>' +
      '<label class="hmb-radio"><input type="radio" name="hmb-flex" value="yes" data-hmb-field="flexible"' + (S.flexible ? ' checked' : '') + '><span class="hmb-radio-mark"></span><span>Yes, I’m flexible<small>Any time in that month works</small></span></label>' +
      '<label class="hmb-radio"><input type="radio" name="hmb-flex" value="no" data-hmb-field="flexible"' + (!S.flexible ? ' checked' : '') + '><span class="hmb-radio-mark"></span><span>No, I have specific dates<small>Pick your start date</small></span></label>' +
    '</fieldset>';

    if (!S.flexible) {
      h += '<div class="hmb-field' + (S.errors.date ? ' hmb-invalid' : '') + '">' +
        '<span class="hmb-label" id="hmb-date-label">Start date <b>*</b></span>' +
        '<button type="button" class="hmb-trigger" data-hmb="toggle-date" aria-expanded="' + (S.calOpen === 'date') + '" aria-controls="hmb-cal-date" aria-labelledby="hmb-date-label hmb-date-value"' + invalidAttrs('date') + '>' +
          I.cal + '<span id="hmb-date-value">' + (S.date ? esc(dateLabel(S.date)) : '<span class="hmb-placeholder">Select a start date</span>') + '</span>' + I.chev +
        '</button>' +
        (S.calOpen === 'date' ? renderDayGrid() : '') +
        fieldError('date') +
      '</div>';
    }
    return h;
  }

  function renderChooser() {
    var h = '<div class="hmb-chooser-top">' +
      '<div class="hmb-seg" role="group" aria-label="Trip type">' +
        '<button type="button" data-hmb="kind" data-kind="trek" aria-pressed="' + (S.chooserKind === 'trek') + '">Treks</button>' +
        '<button type="button" data-hmb="kind" data-kind="expedition" aria-pressed="' + (S.chooserKind === 'expedition') + '">Expeditions</button>' +
      '</div>' +
      '<label class="hmb-sr" for="hmb-search">Search ' + (S.chooserKind === 'trek' ? 'treks' : 'expeditions') + '</label>' +
      '<input id="hmb-search" class="hmb-input" type="search" autocomplete="off" placeholder="Search ' + (S.chooserKind === 'trek' ? 'treks — e.g. Everest, Annapurna' : 'expeditions — e.g. Ama Dablam') + '" value="' + esc(S.chooserQuery) + '" data-hmb-field="chooserQuery" aria-controls="hmb-results">' +
    '</div>';
    h += '<div class="' + (S.errors.trip ? 'hmb-invalid' : '') + '">' + fieldError('trip') + '</div>';
    h += '<ul class="hmb-results" id="hmb-results" aria-label="Choose a trip">' + renderResults() + '</ul>';
    if (S.trip && S.chooserOpen) h += '<p style="margin:12px 0 0"><button type="button" class="hmb-link" data-hmb="cancel-change">Keep ' + esc(S.trip.name) + '</button></p>';
    return h;
  }

  function renderResults() {
    if (S.tripsError) return '<li class="hmb-empty">We couldn’t load the trip list. <button type="button" class="hmb-link" data-hmb="retry-trips">Try again</button></li>';
    if (!S.trips) return '<li class="hmb-empty"><span class="hmb-skel" style="width:60%"></span></li>';
    var q = S.chooserQuery.trim().toLowerCase();
    var list = S.trips.filter(function (t) {
      return t.type === S.chooserKind && (!q || (t.name + ' ' + (t.region || '')).toLowerCase().indexOf(q) > -1);
    });
    var html = list.slice(0, 60).map(function (t) {
      var extra = t.type === 'trek' ? (t.days ? t.days + '+ days' : '') : (t.elevation || '');
      return '<li><button type="button" class="hmb-result" data-hmb="pick" data-slug="' + esc(t.slug) + '" data-type="' + esc(t.type) + '">' +
        '<span><strong>' + esc(t.name) + '</strong>' + (t.region ? '<small>' + esc(t.region) + '</small>' : '') + '</span>' +
        (extra ? '<em>' + esc(extra) + '</em>' : '') + '</button></li>';
    }).join('');
    if (!list.length) html = '<li class="hmb-empty">No ' + (S.chooserKind === 'trek' ? 'treks' : 'expeditions') + ' match “' + esc(S.chooserQuery) + '”.</li>';
    html += '<li><button type="button" class="hmb-result is-custom" data-hmb="pick-custom"><span><strong>Not sure yet — help me choose</strong><small>Tell us what you’re dreaming of and we’ll suggest routes</small></span><em>Custom</em></button></li>';
    return html;
  }

  /* ---------- calendars (keyboard: arrows, Home/End, PageUp/PageDown, Enter, Esc) ---------- */
  function renderMonthGrid() {
    var y = S.calYear, min = minMonth(), max = maxMonth();
    var cells = MONTHS.map(function (name, i) {
      var v = ym(y, i + 1), disabled = v < min || v > max, sel = v === S.month;
      var tab = sel || (!S.month && v === min) || (S.month && S.month.slice(0, 4) !== String(y) && i === 0 && !disabled) ? '0' : '-1';
      return '<button type="button" class="hmb-cell" role="gridcell" data-hmb="pick-month" data-value="' + v + '" tabindex="' + tab + '"' +
        ' aria-label="' + esc(monthLabel(v)) + '" aria-selected="' + sel + '"' + (disabled ? ' aria-disabled="true"' : '') + '>' + name + '</button>';
    }).join('');
    return '<div class="hmb-cal" id="hmb-cal-month" role="group" aria-label="Choose a travel month">' +
      '<div class="hmb-cal-head">' +
        '<button type="button" class="hmb-cal-nav" data-hmb="year" data-delta="-1" aria-label="Previous year"' + (y <= today().getFullYear() ? ' disabled' : '') + '>' + I.left + '</button>' +
        '<span class="hmb-cal-title" aria-live="polite">' + y + '</span>' +
        '<button type="button" class="hmb-cal-nav" data-hmb="year" data-delta="1" aria-label="Next year"' + (y >= today().getFullYear() + 3 ? ' disabled' : '') + '>' + I.right + '</button>' +
      '</div>' +
      '<div class="hmb-months" role="grid" data-hmb-grid="month">' + cells + '</div>' +
    '</div>';
  }

  function renderDayGrid() {
    var y = S.calYear, m = S.calMonth;
    var first = new Date(y, m - 1, 1), daysIn = new Date(y, m, 0).getDate();
    var offset = (first.getDay() + 6) % 7;
    var t = today(), tStr = ymd(t), maxStr = String(t.getFullYear() + 3) + '-12-31';
    var focusDay = S.date && S.date.slice(0, 7) === ym(y, m) ? S.date : null;
    if (!focusDay) {
      for (var d0 = 1; d0 <= daysIn; d0++) { var s0 = ym(y, m) + '-' + pad(d0); if (s0 >= tStr) { focusDay = s0; break; } }
    }
    var cells = WEEKDAYS.map(function (w) { return '<span class="hmb-wd" role="columnheader" aria-hidden="true">' + w + '</span>'; }).join('');
    for (var e = 0; e < offset; e++) cells += '<span class="hmb-cell is-empty" aria-hidden="true"></span>';
    for (var d = 1; d <= daysIn; d++) {
      var v = ym(y, m) + '-' + pad(d), disabled = v < tStr || v > maxStr, sel = v === S.date;
      cells += '<button type="button" class="hmb-cell' + (v === tStr ? ' is-today' : '') + '" role="gridcell" data-hmb="pick-date" data-value="' + v + '"' +
        ' tabindex="' + (v === focusDay ? '0' : '-1') + '" aria-label="' + esc(dateLabel(v)) + '" aria-selected="' + sel + '"' + (disabled ? ' aria-disabled="true"' : '') + '>' + d + '</button>';
    }
    var cur = ym(y, m);
    return '<div class="hmb-cal" id="hmb-cal-date" role="group" aria-label="Choose a start date">' +
      '<div class="hmb-cal-head">' +
        '<button type="button" class="hmb-cal-nav" data-hmb="cal-month" data-delta="-1" aria-label="Previous month"' + (cur <= minMonth() ? ' disabled' : '') + '>' + I.left + '</button>' +
        '<span class="hmb-cal-title" aria-live="polite">' + esc(monthLabel(cur)) + '</span>' +
        '<button type="button" class="hmb-cal-nav" data-hmb="cal-month" data-delta="1" aria-label="Next month"' + (cur >= maxMonth() ? ' disabled' : '') + '>' + I.right + '</button>' +
      '</div>' +
      '<div class="hmb-days" role="grid" data-hmb-grid="date">' + cells + '</div>' +
    '</div>';
  }

  /* ---------- step 2: your details ---------- */
  function renderStep2() {
    var opts = COUNTRIES.map(function (c) { return '<option value="' + c[0] + '"' + (S.country === c[0] ? ' selected' : '') + '>' + flag(c[0]) + ' ' + esc(c[1]) + '</option>'; }).join('');
    var dialOpts = COUNTRIES.map(function (c) { return '<option value="' + c[0] + '"' + (S.dialIso === c[0] ? ' selected' : '') + '>' + flag(c[0]) + ' +' + c[2] + '</option>'; }).join('');
    return '<h3 class="hmb-h" tabindex="-1" data-hmb-focus>Let’s get in touch</h3>' +
      '<p class="hmb-h-sub">A planner from our Kathmandu desk replies personally — usually within 24 hours.</p>' +
      '<div class="hmb-grid2">' +
        input('first', 'First name', 'text', 'given-name', true, 'e.g. Alex') +
        input('last', 'Last name', 'text', 'family-name', true, 'e.g. Morgan') +
      '</div>' +
      input('email', 'Email address', 'email', 'email', true, 'you@example.com') +
      '<div class="hmb-field' + (S.errors.phone ? ' hmb-invalid' : '') + '">' +
        '<label class="hmb-label" for="hmb-phone">WhatsApp / phone <b>*</b></label>' +
        '<div class="hmb-phone">' +
          '<label class="hmb-sr" for="hmb-dial">Country code</label>' +
          '<select id="hmb-dial" class="hmb-select" data-hmb-field="dialIso" autocomplete="tel-country-code"><option value=""' + (!S.dialIso ? ' selected' : '') + '>+ Code</option>' + dialOpts + '</select>' +
          '<input id="hmb-phone" class="hmb-input" type="tel" inputmode="tel" autocomplete="tel-national" maxlength="24" placeholder="98 0123 4567" value="' + esc(S.phone) + '" data-hmb-field="phone"' + invalidAttrs('phone') + '>' +
        '</div>' + fieldError('phone') +
      '</div>' +
      '<div class="hmb-field">' +
        '<label class="hmb-label" for="hmb-country">Country <i>(optional)</i></label>' +
        '<select id="hmb-country" class="hmb-select" data-hmb-field="country" autocomplete="country"><option value="">Select your country</option>' + opts + '</select>' +
      '</div>' +
      '<div class="hmb-field">' +
        '<label class="hmb-label" for="hmb-message">Anything else we should know? <i>(optional)</i></label>' +
        '<textarea id="hmb-message" class="hmb-textarea" rows="3" maxlength="4000" data-hmb-field="message" placeholder="Private group, custom itinerary, different dates, dietary needs, a special occasion, questions…">' + esc(S.message) + '</textarea>' +
      '</div>' +
      '';
  }

  function input(key, label, type, autocomplete, required, placeholder) {
    return '<div class="hmb-field' + (S.errors[key] ? ' hmb-invalid' : '') + '">' +
      '<label class="hmb-label" for="hmb-' + key + '">' + label + (required ? ' <b>*</b>' : '') + '</label>' +
      '<input id="hmb-' + key + '" class="hmb-input" type="' + type + '" autocomplete="' + autocomplete + '" maxlength="' + (type === 'email' ? 200 : 60) + '"' +
        (type === 'email' ? ' inputmode="email" spellcheck="false"' : '') + ' placeholder="' + esc(placeholder) + '" value="' + esc(S[key]) + '" data-hmb-field="' + key + '"' +
        (required ? ' aria-required="true"' : '') + invalidAttrs(key) + '>' +
      fieldError(key) +
    '</div>';
  }

  /* ---------- step 3: review ---------- */
  function renderStep3() {
    var t = S.trip || {}, custom = !S.trip || t.type === 'custom', f = t.facts || {};
    var when = !S.flexible && S.date ? dateLabel(S.date) : monthLabel(S.month) + (S.flexible ? ' · flexible' : '');
    var h = '<h3 class="hmb-h" tabindex="-1" data-hmb-focus>Review your adventure</h3>';
    if (S.submitError) h += '<div class="hmb-alert" role="alert"><span>' + esc(S.submitError) + '</span></div>';

    h += '<div class="hmb-summary">' +
      '<img class="hmb-summary-img" src="' + esc(safeImg(t.image) || FALLBACK_IMAGE) + '" alt="" loading="lazy" onerror="this.onerror=null;this.src=\'' + FALLBACK_IMAGE + '\'">' +
      '<div><h4>' + esc(custom ? 'Custom adventure' : t.name) + '</h4>' +
        (custom ? '<p class="hmb-hint" style="margin-bottom:8px">We’ll suggest routes that fit your dates and experience.</p>' :
          '<ul class="hmb-meta">' +
            (f.duration ? '<li>' + I.days + esc(f.duration) + '</li>' : '') +
            (f.difficulty ? '<li>' + I.grade + esc(f.difficulty) + '</li>' : '') +
            (f.altitude ? '<li>' + I.alt + esc(f.altitude) + '</li>' : '') +
          '</ul>') +
        '<ul class="hmb-meta">' +
          '<li>' + I.cal + esc(when) + '</li>' +
          '<li>' + I.users + esc(S.travelers) + ' traveller' + (Number(S.travelers) === 1 ? '' : 's') + '</li>' +
        '</ul>' +
      '</div>' +
    '</div>';

    h += '<div class="hmb-review-contact"><span><strong>' + esc((S.first + ' ' + S.last).trim()) + '</strong> · ' + esc(S.email) + ' · ' + esc(fullPhone()) + '</span>' +
      '<button type="button" class="hmb-link" data-hmb-goto="2">Edit</button></div>';

    // price — only real data
    var tiers = (t.pricing && t.pricing.tiers) || [];
    var tier = tiers[S.tier] || tiers[0];
    h += '<div class="hmb-price">';
    if (!custom && tier) {
      h += '<div class="hmb-price-row"><span class="hmb-price-label">Estimated package' + (tiers.length > 1 ? '' : ' · ' + esc(tier.name)) + '</span>' +
        '<span class="hmb-price-value" aria-live="polite">' + esc(tier.range) + '</span></div>';
      if (tiers.length > 1) {
        h += '<fieldset class="hmb-tiers"><legend class="hmb-sr">Choose a package level</legend>' + tiers.map(function (tr, i) {
          return '<label class="hmb-tier"><input type="radio" name="hmb-tier" value="' + i + '" data-hmb-field="tier"' + (i === S.tier ? ' checked' : '') + '><span>' + esc(tr.name) + '</span></label>';
        }).join('') + '</fieldset>';
      }
      h += '<p class="hmb-price-note">' + esc(t.pricing.note || 'Indicative range — your final quote depends on dates, group size and services.') + '</p>';
    } else {
      h += '<div class="hmb-price-row"><span class="hmb-price-label">Estimated package</span><span class="hmb-price-value is-quote">' + (custom ? 'Tailored quote' : 'Price available on request') + '</span></div>' +
        '<p class="hmb-price-note">We’ll send a personal quote for your dates and group — no payment required now.</p>';
    }
    h += '</div>';

    // inclusions — only real data
    if (!custom) {
      var inc = (t.included && t.included.length) ? t.included : (tier ? tier.includes : []);
      var incLabel = (t.included && t.included.length) || !tier ? '' : ' <em>(' + esc(tier.name) + ')</em>';
      h += '<details class="hmb-acc"><summary><span class="hmb-acc-in">' + I.checkCircle + '</span>What’s included' + incLabel + I.chev + '</summary>' +
        (inc.length ? '<ul class="hmb-list">' + inc.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'
          : '<p class="hmb-acc-empty">Your personalised quote lists exactly what’s included.</p>') + '</details>';
      h += '<details class="hmb-acc"><summary><span class="hmb-acc-out">' + I.plusCircle + '</span>What’s not included' + I.chev + '</summary>' +
        (t.excluded && t.excluded.length ? '<ul class="hmb-list is-out">' + t.excluded.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'
          : '<p class="hmb-acc-empty">We’ll confirm anything not covered in your personalised quote before you commit.</p>') + '</details>';
    }

    h += '<div aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden"><label for="hmb-website">Website</label><input id="hmb-website" type="text" tabindex="-1" autocomplete="off"></div>';
    h += '<div class="hmb-wa">' + I.whatsapp + '<div><h5>Need a custom adventure?</h5>' +
      '<p>Different dates, a private group, a custom itinerary — or just want to talk to someone first?</p>' +
      '<a class="hmb-btn hmb-outline-wa" href="' + esc(waLink()) + '" target="_blank" rel="noopener">Talk to us on WhatsApp</a></div></div>';
    return h;
  }

  function waLink(ref) {
    var t = S.trip, name = t && t.type !== 'custom' ? t.name : 'a Himalayan adventure';
    var when = S.month ? (!S.flexible && S.date ? dateLabel(S.date) : monthLabel(S.month)) : '';
    var msg = 'Namaste Himalayan Magic Adventure! I’m interested in ' + name +
      (when ? ' (' + when + (S.travelers ? ', ' + S.travelers + ' traveller' + (Number(S.travelers) === 1 ? '' : 's') : '') + ')' : '') +
      ' and would like to discuss my trip.' + (ref ? ' My booking reference is ' + ref + '.' : '');
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg);
  }

  function renderFooter() {
    var back = S.step > 1 ? '<button type="button" class="hmb-btn hmb-ghost is-back" data-hmb="back">' + I.back + 'Back</button>' : '<span></span>';
    var primary;
    if (S.step < 3) {
      var waiting = S.step === 1 && (S.chooserOpen || S.tripStatus === 'loading');
      primary = '<button type="button" class="hmb-btn hmb-primary" data-hmb="next"' + (waiting ? ' disabled' : '') + '>' +
        (S.step === 1 && S.tripStatus === 'loading' ? '<span class="hmb-spinner" aria-hidden="true"></span>Loading…' : 'Continue' + I.arrow) + '</button>';
    } else {
      primary = '<button type="button" class="hmb-btn hmb-primary" data-hmb="submit"' + (S.submitting ? ' disabled aria-busy="true"' : '') + '>' +
        (S.submitting ? '<span class="hmb-spinner" aria-hidden="true"></span>Sending…' : 'Send booking request' + I.arrow) + '</button>';
    }
    return '<div class="hmb-foot-actions">' + back + primary + '</div>' +
      '<p class="hmb-foot-note">' + (S.step === 3 ? 'No payment required at this stage. We’ll review your request and contact you.' : 'No payment required at this stage.') + '</p>';
  }

  function renderSuccess() {
    var t = S.success;
    return '<div class="hmb-success">' +
      '<svg class="hmb-check" viewBox="0 0 76 76" aria-hidden="true"><circle cx="38" cy="38" r="36"/><path d="M24 39.5l9.5 9.5L53 29.5"/></svg>' +
      '<h3 tabindex="-1" data-hmb-focus>Your adventure request is in</h3>' +
      '<p class="hmb-for">We’ve received your request for</p>' +
      '<p class="hmb-for-trip">' + esc(t.tripName) + '</p>' +
      '<p class="hmb-msg">Our Kathmandu team will review your details and reply to <strong>' + esc(t.email) + '</strong> shortly — usually within 24 hours.</p>' +
      (t.ref ? '<span class="hmb-ref">Reference ' + esc(t.ref) + '</span>' : '') +
      '<div class="hmb-success-actions">' +
        '<a class="hmb-btn hmb-outline-wa" href="' + esc(t.wa) + '" target="_blank" rel="noopener">' + 'Talk to us on WhatsApp</a>' +
        '<button type="button" class="hmb-btn hmb-outline" data-hmb-close>Close</button>' +
      '</div>' +
    '</div>';
  }

  /* ------------------------------------------------------------------ focus helpers */
  function focusStep() {
    var target = els.body.querySelector('[data-hmb-focus]');
    if (target) { try { target.focus({ preventScroll: true }); } catch (_) { target.focus(); } }
    els.body.scrollTop = 0;
  }
  function focusFirstError() {
    var el = els.body.querySelector('[aria-invalid="true"]');
    if (el) {
      el.focus();
      if (el.scrollIntoView) el.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
    }
  }
  function focusGridCell(kind, value) {
    var grid = els.body.querySelector('[data-hmb-grid="' + kind + '"]');
    if (!grid) return;
    var cell = (value && grid.querySelector('[data-value="' + value + '"]')) || grid.querySelector('[tabindex="0"]') || grid.querySelector('.hmb-cell:not([aria-disabled="true"])');
    if (cell) cell.focus();
  }
  function announce(msg) { els.status.textContent = ''; setTimeout(function () { els.status.textContent = msg; }, 40); }

  /* ------------------------------------------------------------------ actions */
  function goTo(step) {
    if (step === S.step || step < 1 || step > 3) return;
    if (step > S.step) {
      for (var s = S.step; s < step; s++) {
        var errs = validate(s);
        if (Object.keys(errs).length) { S.errors = errs; S.step = s; S.calOpen = null; render(); focusFirstError(); announce('Please fix the highlighted fields.'); return; }
      }
    }
    S.dir = step > S.step ? 1 : -1;
    S.step = step;
    S.errors = {};
    S.calOpen = null;
    S.submitError = '';
    render({ animate: !reduced() });
    focusStep();
    announce('Step ' + step + ' of 3: ' + STEPS[step - 1]);
  }

  function setTrip(ref, name) {
    S.chooserOpen = false;
    S.errors = {};
    if (!ref || !ref.slug) { S.trip = null; S.tripRef = null; S.tripStatus = 'none'; render(); return; }
    S.tripRef = { slug: ref.slug, type: ref.type || null, name: name || null };
    S.trip = null;
    S.tripStatus = 'loading';
    S.tier = 0;
    render();
    var reqRef = S.tripRef;
    loadTrip(ref.slug, ref.type).then(function (trip) {
      if (S.tripRef !== reqRef) return;
      S.trip = trip;
      S.tripRef = { slug: trip.slug, type: trip.type, name: trip.name };
      S.tripStatus = 'ready';
      if (isOpen) {
        var active = document.activeElement;
        var busy = active && els.body.contains(active) && active !== els.body && !active.hasAttribute('data-hmb-focus');
        render();
        if (!busy) focusStep();
      }
    }).catch(function (err) {
      if (S.tripRef !== reqRef) return;
      if (err.status === 404) {
        S.trip = null; S.tripRef = null; S.tripStatus = 'none';
        S.errors = { trip: 'That trip is no longer available — please choose another.' };
        ensureTripsList();
      } else {
        S.tripStatus = 'error';
        S.tripError = 'We couldn’t load this trip’s details. Check your connection and try again.';
      }
      if (isOpen) render();
    });
  }

  function ensureTripsList() {
    if (S.trips) return;
    S.tripsError = false;
    loadTrips().then(function (items) {
      S.trips = items;
      var box = els.body.querySelector('#hmb-results');
      if (box) box.innerHTML = renderResults();
    }).catch(function () {
      S.tripsError = true;
      var box = els.body.querySelector('#hmb-results');
      if (box) box.innerHTML = renderResults();
    });
  }

  function submit() {
    if (S.submitting) return;
    for (var s = 1; s <= 2; s++) {
      var errs = validate(s);
      if (Object.keys(errs).length) { S.errors = errs; S.step = s; render(); focusFirstError(); announce('Please fix the highlighted fields.'); return; }
    }
    S.submitting = true;
    S.submitError = '';
    S.key = S.key || (window.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));
    render();
    var body = payload();
    ensureClient().then(function (client) {
      return client.submit(body, { key: S.key });
    }).then(function (res) {
      S.submitting = false;
      if (res.ok) {
        var tripName = S.trip && S.trip.type !== 'custom' ? S.trip.name : 'your custom adventure';
        S.success = { ref: res.ref, email: S.email.trim(), tripName: tripName, wa: waLink(res.ref) };
        render();
        focusStep();
        announce('Your adventure request is in. Reference ' + (res.ref || ''));
        return;
      }
      var map = { first_name: ['first', 2], last_name: ['last', 2], name: ['first', 2], email: ['email', 2], phone: ['phone', 2],
        people: ['travelers', 1], preferred_date: [S.flexible ? 'month' : 'date', 1], trip: ['trip', 1] };
      var fieldErrs = {}, firstStep = 3;
      Object.keys(res.fields || {}).forEach(function (k) {
        var m = map[k];
        if (m) { fieldErrs[m[0]] = res.fields[k]; firstStep = Math.min(firstStep, m[1]); }
      });
      if (!res.retryable) S.key = null;
      if (Object.keys(fieldErrs).length) {
        if (fieldErrs.trip) { S.chooserOpen = true; ensureTripsList(); }
        S.errors = fieldErrs;
        S.step = firstStep;
        render();
        focusFirstError();
        announce('Please fix the highlighted fields.');
      } else {
        S.submitError = res.message || 'We couldn’t send your request. Please try again.';
        render();
        var alert = els.body.querySelector('.hmb-alert');
        if (alert) alert.scrollIntoView({ block: 'nearest' });
        var btn = els.foot.querySelector('[data-hmb="submit"]');
        if (btn) btn.focus();
      }
    }).catch(function () {
      S.submitting = false;
      S.submitError = 'The booking service didn’t load. Please refresh the page and try again, or message us on WhatsApp.';
      render();
    });
  }

  /* ------------------------------------------------------------------ events */
  function onClick(e) {
    var closer = e.target.closest('[data-hmb-close]');
    if (closer) { close(); return; }
    var go = e.target.closest('[data-hmb-goto]');
    if (go) { goTo(Number(go.getAttribute('data-hmb-goto'))); return; }
    var btn = e.target.closest('[data-hmb]');
    if (!btn || btn.disabled || btn.getAttribute('aria-disabled') === 'true') return;
    var act = btn.getAttribute('data-hmb');

    switch (act) {
      case 'next': goTo(S.step + 1); break;
      case 'back': goTo(S.step - 1); break;
      case 'submit': submit(); break;
      case 'change-trip':
        S.chooserOpen = true; S.chooserKind = (S.trip && S.trip.type === 'expedition') ? 'expedition' : 'trek'; S.chooserQuery = '';
        ensureTripsList(); render(); focusStep(); break;
      case 'cancel-change': S.chooserOpen = false; render(); focusStep(); break;
      case 'retry-trip': if (S.tripRef) setTrip(S.tripRef, S.tripRef.name); break;
      case 'retry-trips': tripsPromise = null; S.trips = null; S.tripsError = false; ensureTripsList(); break;
      case 'kind':
        S.chooserKind = btn.getAttribute('data-kind');
        var box = els.body.querySelector('#hmb-results'); if (box) box.innerHTML = renderResults();
        els.body.querySelectorAll('[data-hmb="kind"]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        var search = els.body.querySelector('#hmb-search'); if (search) search.placeholder = 'Search ' + (S.chooserKind === 'trek' ? 'treks — e.g. Everest, Annapurna' : 'expeditions — e.g. Ama Dablam');
        break;
      case 'pick':
        setTrip({ slug: btn.getAttribute('data-slug'), type: btn.getAttribute('data-type') }, btn.querySelector('strong') && btn.querySelector('strong').textContent);
        break;
      case 'pick-custom':
        S.trip = { type: 'custom', name: 'Custom adventure', slug: null, facts: {}, pricing: { tiers: [] }, included: [], excluded: [] };
        S.tripRef = null; S.tripStatus = 'ready'; S.chooserOpen = false; S.errors = {};
        render(); focusStep(); break;
      case 'toggle-month':
        S.calOpen = S.calOpen === 'month' ? null : 'month';
        if (S.calOpen) S.calYear = S.month ? Number(S.month.slice(0, 4)) : today().getFullYear();
        render();
        if (S.calOpen) focusGridCell('month', S.month); else btnFocus('toggle-month');
        break;
      case 'toggle-date':
        S.calOpen = S.calOpen === 'date' ? null : 'date';
        if (S.calOpen) {
          var base = S.date || (S.month ? S.month + '-01' : minMonth() + '-01');
          if (base.slice(0, 7) < minMonth()) base = minMonth() + '-01';
          S.calYear = Number(base.slice(0, 4)); S.calMonth = Number(base.slice(5, 7));
        }
        render();
        if (S.calOpen) focusGridCell('date', S.date); else btnFocus('toggle-date');
        break;
      case 'year': S.calYear += Number(btn.getAttribute('data-delta')); render(); btnFocusSel('[data-hmb="year"][data-delta="' + btn.getAttribute('data-delta') + '"]'); break;
      case 'cal-month': shiftCalMonth(Number(btn.getAttribute('data-delta'))); render(); btnFocusSel('[data-hmb="cal-month"][data-delta="' + btn.getAttribute('data-delta') + '"]'); break;
      case 'pick-month':
        S.month = btn.getAttribute('data-value');
        if (S.date && S.date.slice(0, 7) !== S.month) S.date = null;
        S.calOpen = null; delete S.errors.month; render(); btnFocus('toggle-month'); announce('Travel month set to ' + monthLabel(S.month));
        break;
      case 'pick-date':
        S.date = btn.getAttribute('data-value'); S.month = S.date.slice(0, 7);
        S.calOpen = null; delete S.errors.date; delete S.errors.month; render(); btnFocus('toggle-date'); announce('Start date set to ' + dateLabel(S.date));
        break;
      case 'dec': case 'inc':
        var n = Math.max(1, Math.min(MAX_TRAVELERS, (parseInt(S.travelers, 10) || 1) + (act === 'inc' ? 1 : -1)));
        S.travelers = n; delete S.errors.travelers;
        var inputEl = els.body.querySelector('#hmb-travelers'); if (inputEl) inputEl.value = n;
        els.body.querySelector('[data-hmb="dec"]').disabled = n <= 1;
        els.body.querySelector('[data-hmb="inc"]').disabled = n >= MAX_TRAVELERS;
        announce(n + ' traveller' + (n === 1 ? '' : 's'));
        break;
    }
  }

  function btnFocus(act) { var b = els.body.querySelector('[data-hmb="' + act + '"]'); if (b) b.focus(); }
  function btnFocusSel(sel) { var b = els.body.querySelector(sel); if (b && !b.disabled) b.focus(); else { var grid = els.body.querySelector('[data-hmb-grid] [tabindex="0"]'); if (grid) grid.focus(); } }
  function shiftCalMonth(delta) {
    var m = S.calMonth + delta, y = S.calYear;
    if (m < 1) { m = 12; y--; } else if (m > 12) { m = 1; y++; }
    var v = ym(y, m);
    if (v < minMonth() || v > maxMonth()) return false;
    S.calMonth = m; S.calYear = y;
    return true;
  }

  function onInput(e) {
    var key = e.target.getAttribute('data-hmb-field');
    if (!key) return;
    if (key === 'chooserQuery') {
      S.chooserQuery = e.target.value;
      var box = els.body.querySelector('#hmb-results'); if (box) box.innerHTML = renderResults();
      return;
    }
    if (key === 'travelers') {
      S.travelers = e.target.value.replace(/[^\d]/g, '').slice(0, 2);
      var n = parseInt(S.travelers, 10);
      els.body.querySelector('[data-hmb="dec"]').disabled = !(n > 1);
      els.body.querySelector('[data-hmb="inc"]').disabled = n >= MAX_TRAVELERS;
      return;
    }
    if (key === 'first' || key === 'last' || key === 'email' || key === 'phone' || key === 'message') {
      S[key] = e.target.value;
      if (S.errors[key]) {
        var still = validate(2)[key];
        if (!still) clearFieldError(e.target, key);
      }
    }
  }

  function clearFieldError(inputEl, key) {
    delete S.errors[key];
    var field = inputEl.closest('.hmb-field');
    if (field) field.classList.remove('hmb-invalid');
    inputEl.removeAttribute('aria-invalid');
    inputEl.removeAttribute('aria-describedby');
    var msg = els.body.querySelector('#hmb-err-' + key);
    if (msg) msg.remove();
  }

  function onChange(e) {
    var key = e.target.getAttribute('data-hmb-field');
    if (!key) return;
    if (key === 'flexible') {
      S.flexible = e.target.value === 'yes';
      if (S.flexible) { S.date = null; delete S.errors.date; if (S.calOpen === 'date') S.calOpen = null; }
      render();
      var radio = els.body.querySelector('input[name="hmb-flex"][value="' + (S.flexible ? 'yes' : 'no') + '"]');
      if (radio) radio.focus();
    } else if (key === 'travelers') {
      var n = parseInt(e.target.value, 10);
      if (!Number.isInteger(n) || n < 1) n = 1;
      if (n > MAX_TRAVELERS) n = MAX_TRAVELERS;
      S.travelers = n; e.target.value = n; delete S.errors.travelers;
    } else if (key === 'dialIso') {
      S.dialIso = e.target.value;
    } else if (key === 'country') {
      var prevCountry = S.country;
      S.country = e.target.value;
      // keep the dial code in step with the country unless the visitor already chose a different one
      if (S.country && (!S.phone.trim() || S.dialIso === prevCountry || !S.dialIso)) {
        S.dialIso = S.country;
        var dial = els.body.querySelector('#hmb-dial'); if (dial) dial.value = S.country;
      }
    } else if (key === 'tier') {
      S.tier = Number(e.target.value) || 0;
      var tiers = (S.trip && S.trip.pricing && S.trip.pricing.tiers) || [];
      var val = els.body.querySelector('.hmb-price-value'); if (val && tiers[S.tier]) val.textContent = tiers[S.tier].range;
      var incSummary = els.body.querySelector('.hmb-acc em');
      var incList = els.body.querySelector('.hmb-acc .hmb-list:not(.is-out)');
      if (!(S.trip.included && S.trip.included.length) && tiers[S.tier]) {
        if (incSummary) incSummary.textContent = '(' + tiers[S.tier].name + ')';
        if (incList) incList.innerHTML = tiers[S.tier].includes.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
      }
    } else if (key === 'email' || key === 'first' || key === 'last' || key === 'phone') {
      // validate on blur-ish change for a friendly early warning
      var err = validate(2)[key];
      if (err && S[key].trim()) {
        S.errors[key] = err;
        var field = e.target.closest('.hmb-field');
        if (field && !field.querySelector('#hmb-err-' + key)) {
          field.classList.add('hmb-invalid');
          e.target.setAttribute('aria-invalid', 'true');
          e.target.setAttribute('aria-describedby', 'hmb-err-' + key);
          field.insertAdjacentHTML('beforeend', fieldError(key));
        }
      }
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      if (S.calOpen) {
        var which = S.calOpen;
        S.calOpen = null; render(); btnFocus(which === 'month' ? 'toggle-month' : 'toggle-date');
      } else {
        close();
      }
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (e.key === 'Tab') { trapTab(e); return; }

    var cell = e.target.closest && e.target.closest('.hmb-cell');
    if (cell) { calendarKeys(e, cell); return; }

    if (e.key === 'Enter' && e.target.matches && e.target.matches('.hmb-body input:not([type="radio"]):not([type="search"])') && !S.submitting) {
      e.preventDefault();
      if (S.step < 3) goTo(S.step + 1);
    }
    if (e.key === 'ArrowDown' && e.target.id === 'hmb-search') {
      var firstResult = els.body.querySelector('.hmb-result');
      if (firstResult) { e.preventDefault(); firstResult.focus(); }
    }
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && e.target.classList && e.target.classList.contains('hmb-result')) {
      var all = Array.prototype.slice.call(els.body.querySelectorAll('.hmb-result'));
      var i = all.indexOf(e.target) + (e.key === 'ArrowDown' ? 1 : -1);
      e.preventDefault();
      if (i < 0) { var s = els.body.querySelector('#hmb-search'); if (s) s.focus(); } else if (all[i]) all[i].focus();
    }
  }

  function calendarKeys(e, cell) {
    var grid = cell.closest('[data-hmb-grid]');
    if (!grid) return;
    var kind = grid.getAttribute('data-hmb-grid');
    var value = cell.getAttribute('data-value');
    var handled = true, next = null;

    if (kind === 'month') {
      var y = Number(value.slice(0, 4)), m = Number(value.slice(5, 7));
      var step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4 }[e.key];
      if (step) { m += step; while (m < 1) { m += 12; y--; } while (m > 12) { m -= 12; y++; } }
      else if (e.key === 'Home') m = 1;
      else if (e.key === 'End') m = 12;
      else if (e.key === 'PageUp') y--;
      else if (e.key === 'PageDown') y++;
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cell.click(); return; }
      else handled = false;
      if (handled) {
        next = ym(y, m);
        if (next < minMonth()) next = minMonth();
        if (next > maxMonth()) next = maxMonth();
        if (Number(next.slice(0, 4)) !== S.calYear) { S.calYear = Number(next.slice(0, 4)); render(); }
        e.preventDefault();
        moveRoving(kind, next);
      }
      return;
    }

    var d = new Date(Number(value.slice(0, 4)), Number(value.slice(5, 7)) - 1, Number(value.slice(8, 10)));
    var dd = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (dd) d.setDate(d.getDate() + dd);
    else if (e.key === 'Home') d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    else if (e.key === 'End') d.setDate(d.getDate() + (6 - (d.getDay() + 6) % 7));
    else if (e.key === 'PageUp') d.setMonth(d.getMonth() - 1);
    else if (e.key === 'PageDown') d.setMonth(d.getMonth() + 1);
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cell.click(); return; }
    else handled = false;
    if (!handled) return;
    e.preventDefault();
    var t = today(), max = new Date(t.getFullYear() + 3, 11, 31);
    if (d < t) d = t;
    if (d > max) d = max;
    next = ymd(d);
    if (next.slice(0, 7) !== ym(S.calYear, S.calMonth)) { S.calYear = d.getFullYear(); S.calMonth = d.getMonth() + 1; render(); }
    moveRoving(kind, next);
  }

  function moveRoving(kind, value) {
    var grid = els.body.querySelector('[data-hmb-grid="' + kind + '"]');
    if (!grid) return;
    var target = grid.querySelector('[data-value="' + value + '"]');
    if (!target) return;
    grid.querySelectorAll('.hmb-cell[tabindex="0"]').forEach(function (c) { c.setAttribute('tabindex', '-1'); });
    target.setAttribute('tabindex', '0');
    target.focus();
  }

  function focusables() {
    return Array.prototype.slice.call(root.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex="0"]'))
      .filter(function (el) { return el.getAttribute('tabindex') !== '-1' && (el.offsetParent !== null || el === document.activeElement); });
  }
  function trapTab(e) {
    var list = focusables();
    if (!list.length) return;
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  // keep focus inside even if something outside tries to take it
  document.addEventListener('focusin', function (e) {
    if (isOpen && root && !root.contains(e.target)) {
      var target = els.body.querySelector('[data-hmb-focus]') || focusables()[0];
      if (target) target.focus();
    }
  });

  /* ------------------------------------------------------------------ open / close */
  function lockPage() {
    scrollY = window.scrollY || window.pageYOffset || 0;
    var sbw = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (sbw > 0) document.body.style.paddingRight = sbw + 'px';
    inerted = [];
    Array.prototype.forEach.call(document.body.children, function (el) {
      if (el === root || el.tagName === 'SCRIPT' || el.hasAttribute('inert')) return;
      el.setAttribute('inert', '');
      el.setAttribute('data-hmb-inert', '');
      inerted.push(el);
    });
  }
  function unlockPage() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    inerted.forEach(function (el) { el.removeAttribute('inert'); el.removeAttribute('data-hmb-inert'); });
    inerted = [];
    if (Math.abs((window.scrollY || 0) - scrollY) > 2) window.scrollTo(0, scrollY);
  }

  function open(opts) {
    opts = opts || {};
    if (!root) build();
    if (S.success) S = freshState();
    lastTrigger = opts.trigger || document.activeElement;

    var slug = opts.slug ? String(opts.slug).toLowerCase() : '';
    var sameTrip = slug && S.tripRef && S.tripRef.slug === slug;
    if (slug && !sameTrip) {
      S.step = 1; S.errors = {}; S.submitError = ''; S.chooserOpen = false;
      setTrip({ slug: slug, type: opts.type || null });
    } else if (!slug && !S.trip && S.tripStatus !== 'loading') {
      S.chooserKind = opts.type === 'expedition' ? 'expedition' : 'trek';
      ensureTripsList();
    }
    if (!slug && !S.trip) ensureTripsList();

    if (!isOpen) {
      isOpen = true;
      render();
      root.hidden = false;
      lockPage();
      // eslint-disable-next-line no-unused-expressions
      root.offsetWidth;
      root.classList.add('is-open');
      try { history.pushState({ hmbBooking: true }, '', location.href); pushedHistory = true; } catch (_) { pushedHistory = false; }
    } else {
      render();
    }
    setTimeout(function () { if (isOpen) focusStep(); }, reduced() ? 0 : 60);
  }

  function close(fromHistory) {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove('is-open');
    var done = function () {
      if (isOpen) return;
      root.hidden = true;
      unlockPage();
      if (S.success) S = freshState();
      S.calOpen = null;
      S.submitError = '';
      if (lastTrigger && document.contains(lastTrigger) && lastTrigger.focus) { try { lastTrigger.focus({ preventScroll: true }); } catch (_) { lastTrigger.focus(); } }
    };
    setTimeout(done, reduced() ? 0 : 280);
    if (pushedHistory && !fromHistory) {
      pushedHistory = false;
      if (history.state && history.state.hmbBooking) { pendingBack = true; history.back(); }
    }
    pushedHistory = false;
  }

  window.addEventListener('popstate', function () {
    if (pendingBack) { pendingBack = false; return; }
    if (isOpen) close(true);
  });

  /* ------------------------------------------------------------------ triggers */
  function tripFromHref(href) {
    try {
      var u = new URL(href, location.href);
      if (u.origin !== location.origin || u.pathname.replace(/\/+$/, '') !== '/contact') return null;
      var trip = u.searchParams.get('trip');
      return trip ? { slug: trip } : null;
    } catch (_) { return null; }
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var el = e.target.closest && e.target.closest('[data-book], a[href*="/contact?trip="]');
    if (!el || (root && root.contains(el))) return;
    var slug = el.hasAttribute('data-book') ? el.getAttribute('data-book') : (tripFromHref(el.getAttribute('href')) || {}).slug;
    if (slug == null) return;
    e.preventDefault();
    open({ slug: slug || null, type: el.getAttribute('data-book-type') || null, trigger: el });
  });

  function openFromHash() {
    var m = location.hash.match(/^#book(?:=([a-z0-9-]+))?$/i);
    if (!m) return;
    try { history.replaceState(history.state, '', location.pathname + location.search); } catch (_) { /* ignore */ }
    open({ slug: m[1] || null });
  }
  window.addEventListener('hashchange', openFromHash);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', openFromHash); else openFromHash();

  window.HMABookingModal = { open: open, close: close };
})();
