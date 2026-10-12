/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — MR YETI, the expedition desk        (2026-09-23)
   ----------------------------------------------------------------------------
   Self-injecting (menu.js / social.js pattern):
       <script src="/yeti-chat.js?v=5" defer></script>

   WHAT IT IS
     A route-aware assistant that answers from the site's own content database
     (GET /api/assistant/knowledge — treks, peaks, stories and the shared trip
     guidance every trek page inherits). It never invents a price, a season or
     a fact: anything missing from the data is handed to the human team.

   ARCHITECTURE  (phases from the brief)
     1  UI          launcher + panel + reusable response blocks (render*)
     2  Data        loadKB() → prepare() builds alias / season / grade indexes
     3  Inquiry     'form' block → POST /api/bookings (source 'assistant') →
                    stored in /admin and e-mailed by the existing notifyService
     4  AI model    NOT connected. The seam is Brain.respond(text, ctx) → a
                    response { blocks[], suggest[] }. A model-backed brain only
                    has to return the same block objects (they are plain data),
                    so the renderer, history and actions need no change.
     5  Site control actions are data too: { act:'nav', value:'/treks/x' } is a
                    same-origin link, { act:'do', value:'itinerary:x' } runs a
                    command. Nothing navigates or submits without a click.

   STATE  sessionStorage 'mry:v2' keeps the conversation (as block data, not
          HTML) for the tab session, so it survives page changes.
   ========================================================================== */
(function () {
  'use strict';
  if (window.MrYeti) return;

  var CFG = {
    endpoint: '/api/assistant/knowledge',
    whatsapp: '9779841454599',
    email: 'info@himalayanmagic.com',
    coords: '27°59′N · 86°55′E',
    avatar: '/images/mr-yeti-96.webp',
    avatar2x: '/images/mr-yeti-192.webp',
    store: 'mry:v2',
    maxMessages: 80
  };

  /* ------------------------------------------------------------ utilities */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // **bold** only — everything else is escaped.
  function md(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); }
  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
      .replace(/[‘’']/g, '').replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();
  }
  function safeHref(u) { return typeof u === 'string' && /^\/(?!\/)/.test(u) ? u : null; }
  function safeImg(u) { return typeof u === 'string' && (/^\/(?!\/)/.test(u) || /^https:\/\//.test(u)) ? u : null; }
  function sentences(s, n) {
    var parts = String(s || '').match(/[^.!?]+[.!?]+(\s|$)/g);
    return parts ? parts.slice(0, n).join('').trim() : String(s || '');
  }
  function upper(s) { return String(s || '').toUpperCase(); }
  function uniq(arr) { var seen = {}; return arr.filter(function (x) { var k = x && (x.slug || x); if (seen[k]) return false; seen[k] = 1; return true; }); }
  function waLink(text) { return 'https://wa.me/' + CFG.whatsapp + (text ? '?text=' + encodeURIComponent(text) : ''); }
  function rx(words) { return new RegExp('(^|[^a-z0-9])(' + words + ')(?=[^a-z0-9]|$)'); }

  var MON = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  var MON_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  /* ------------------------------------------------------ knowledge layer */
  var KB = null, kbPromise = null;

  function loadKB() {
    if (KB) return Promise.resolve(KB);
    if (!kbPromise) {
      kbPromise = fetch(CFG.endpoint, { headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error('knowledge ' + r.status); return r.json(); })
        .then(function (j) { KB = prepare(j.knowledge || {}); return KB; })
        .catch(function (e) { kbPromise = null; throw e; });
    }
    return kbPromise;
  }

  // Names people actually type. Aliases only — never facts.
  var EXTRA_ALIASES = {
    'everest-base-camp': ['ebc', 'everest trek', 'everest base camp trek', 'everest bc'],
    'annapurna-base-camp': ['abc', 'annapurna sanctuary', 'abc trek', 'annapurna bc'],
    'annapurna-circuit': ['thorong la', 'annapurna round', 'around annapurna'],
    'three-passes': ['3 passes', 'three pass', 'everest three passes'],
    'manaslu-circuit': ['larkya la', 'larke la', 'manaslu trek', 'around manaslu'],
    'gokyo-lakes': ['gokyo', 'gokyo ri'],
    'kanchenjunga-base-camp': ['kangchenjunga base camp', 'kbc', 'kanchenjunga trek'],
    'makalu-base-camp': ['mbc', 'makalu trek'],
    'langtang-valley': ['langtang trek', 'langtang'],
    'upper-mustang': ['mustang', 'lo manthang'],
    'mardi-himal': ['mardi'],
    'poon-hill': ['poon hill', 'ghorepani'],
    'everest': ['sagarmatha', 'chomolungma', 'mt everest'],
    'kangchenjunga': ['kanchenjunga', 'kangchendzonga'],
    'cho-oyu': ['cho oyu', 'choyu'],
    'shishapangma': ['shisha pangma', 'shishapangma'],
    'island-peak': ['imja tse', 'island'],
    'k2': ['k2', 'k 2'],
    'ama-dablam': ['amadablam']
  };
  // When someone names the mountain but means the walk to it.
  var PEAK_TREK = {
    everest: 'everest-base-camp', annapurna: 'annapurna-base-camp', manaslu: 'manaslu-circuit',
    kangchenjunga: 'kanchenjunga-base-camp', makalu: 'makalu-base-camp', dhaulagiri: 'dhaulagiri-circuit'
  };
  var GENERIC = { trek: 1, trail: 1, trekking: 1, the: 1, valley: 1, lake: 1, lakes: 1, pass: 1, circuit: 1, base: 1, camp: 1,
    peak: 1, mount: 1, himal: 1, national: 1, park: 1, safari: 1, temple: 1, heritage: 1, hill: 1, upper: 1, lower: 1,
    view: 1, pilgrimage: 1, three: 1, and: 1, tamang: 1, mountain: 1 };

  function seasonSet(str) {
    var s = String(str || '').toLowerCase().split('(')[0], set = {};
    s.split(/·|,|;|\band\b/).forEach(function (part) {
      var ms = [], re = /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/g, m;
      while ((m = re.exec(part))) ms.push(MON.indexOf(m[1]));
      if (ms.length === 1) set[ms[0]] = 1;
      else if (ms.length > 1) {
        for (var i = ms[0], guard = 0; guard < 13; i = (i + 1) % 12, guard++) { set[i] = 1; if (i === ms[ms.length - 1]) break; }
      }
    });
    return set;
  }
  function gradeRank(s) {
    s = String(s || '').toLowerCase();
    if (/extreme/.test(s)) return 5;
    if (/strenuous/.test(s)) return 4;
    if (/moderate to challenging/.test(s)) return 2.5;
    if (/challenging/.test(s)) return 3;
    if (/easy to moderate/.test(s)) return 1.5;
    if (/moderate/.test(s)) return 2;
    if (/easy/.test(s)) return 1;
    return 2.5;
  }

  function prepare(k) {
    var kb = { treks: k.treks || [], peaks: k.peaks || [], stories: k.stories || [], guides: k.guides || {}, bySlug: {}, aliases: [], destinations: [] };
    kb.treks.forEach(function (t) {
      t.kind = 'trek';
      t.months = seasonSet(t.bestSeason);
      t.rank = gradeRank(t.difficulty);
      kb.bySlug['trek:' + t.slug] = t;
    });
    kb.peaks.forEach(function (p) {
      p.kind = 'peak';
      p.months = {};
      if (p.season && p.season.months) {
        MON.forEach(function (m, i) {
          var v = p.season.months[m.charAt(0).toUpperCase() + m.slice(1)];
          if (v === 'prime') p.months[i] = 1; else if (v === 'shoulder') p.months[i] = 0.5;
        });
      }
      kb.bySlug['peak:' + p.slug] = p;
    });

    function add(item, text, strong) {
      text = norm(text);
      if (!text || text.length < 2) return;
      kb.aliases.push({ item: item, text: text, strong: strong, re: rx(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) });
    }
    kb.treks.concat(kb.peaks).forEach(function (it) {
      var n = norm(it.name);
      add(it, n, true);
      add(it, it.slug.replace(/-/g, ' '), true);
      var stripped = n.replace(/\b(trek|trekking|trail|safari)\b/g, '').replace(/\s+/g, ' ').trim();
      if (stripped !== n) add(it, stripped, true);
      if (it.kind === 'peak') add(it, n.replace(/^mount\s+/, ''), true);
      if (/base camp/.test(stripped)) {
        var ac = stripped.split(' ').map(function (w) { return w.charAt(0); }).join('');
        if (ac.length >= 3) add(it, ac, true);
      }
      var first = stripped.split(' ').filter(function (w) { return w.length >= 4 && !GENERIC[w]; })[0];
      if (first && it.kind === 'trek') add(it, first, false);
      (EXTRA_ALIASES[it.slug] || []).forEach(function (a) { add(it, a, true); });
    });
    kb.treks.forEach(function (t) {
      (t.destinations || []).forEach(function (d) {
        var key = norm(d.name).split(/[^a-z0-9]+/).filter(function (w) { return w.length >= 5 && !GENERIC[w]; })[0];
        if (key) kb.destinations.push({ key: key, re: rx(key), name: d.name, note: d.note, trek: t });
      });
    });
    return kb;
  }

  function trek(slug) { return KB && KB.bySlug['trek:' + slug]; }
  function peak(slug) { return KB && KB.bySlug['peak:' + slug]; }
  function item(ref) { return KB && KB.bySlug[ref]; }
  function ref(it) { return it.kind + ':' + it.slug; }

  // Entities in the order the visitor typed them; longer, stronger names win overlaps.
  function findEntities(q) {
    var hits = [];
    KB.aliases.forEach(function (a) {
      var m = a.re.exec(q);
      if (!m) return;
      var start = m.index + m[1].length;
      hits.push({ item: a.item, text: a.text, start: start, end: start + a.text.length, score: a.text.length * (a.strong ? 1 : 0.5), strong: a.strong });
    });
    hits.sort(function (x, y) { return y.score - x.score; });
    var kept = [];
    hits.forEach(function (h) {
      var clash = kept.some(function (k) {
        var overlap = h.start < k.end && k.start < h.end;
        return overlap && !(k.start === h.start && k.end === h.end && k.score === h.score);
      });
      if (!clash && !kept.some(function (k) { return k.item === h.item; })) kept.push(h);
    });
    kept.sort(function (x, y) { return x.start - y.start; });
    return kept;
  }

  /* ------------------------------------------------------------- parsing */
  var WORDNUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
    thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30 };
  function parseDays(q) {
    q = q.replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty)\b/g, function (w) { return WORDNUM[w]; });
    var m = q.match(/(\d{1,2})\s*(?:-|to)?\s*(\d{1,2})?\s*-?\s*(?:days?|nights?)\b/);
    if (m) return +(m[2] || m[1]);
    m = q.match(/(\d)\s*-?\s*weeks?\b/);
    if (m) return +m[1] * 7;
    if (/\b(a|one) week\b|\bweek long\b/.test(q)) return 7;
    if (/\bfortnight\b/.test(q)) return 14;
    return null;
  }
  function parseMonth(q) {
    var m = q.match(/\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/);
    if (m) return MON.indexOf(m[1].slice(0, 3));
    if (/\b(in|during|for|of|mid|early|late|next|this)\s+may\b|\bmay\s+\d{4}\b/.test(q)) return 4;
    return null;
  }
  function parseSeasonWord(q) {
    if (/\bspring\b/.test(q)) return { label: 'spring', months: [2, 3, 4] };
    if (/\b(autumn|fall)\b/.test(q)) return { label: 'autumn', months: [8, 9, 10] };
    if (/\bwinter\b/.test(q)) return { label: 'winter', months: [11, 0, 1] };
    if (/\b(monsoon|summer|rainy)\b/.test(q)) return { label: 'the monsoon months', months: [5, 6, 7] };
    return null;
  }
  function parseStyle(q) {
    if (/\b(culture|cultural|heritage|temple|temples|wildlife|jungle|safari|lowland|pilgrim|pilgrimage)\b/.test(q)) return 'culture';
    if (/\b(remote|wild|adventur|adventurous|quiet|off the beaten|off-beat|offbeat|untouched|less crowded|crowd)/.test(q)) return 'remote';
    if (/\b(challeng|challenging|tough|hard|fit|strenuous|non-technical)/.test(q)) return 'challenging';
    if (/\b(scenic|comfort|comfortable|easy|gentle|relaxed|beginner|first)/.test(q)) return 'scenic';
    return null;
  }

  var RX = {
    reset: /^(restart|reset|clear|start over|new chat)$/,
    greet: /^(hi|hello|hey|hiya|namaste|namaskar|good (morning|afternoon|evening)|hola|yo)\b/,
    thanks: /\b(thanks|thank you|thx|cheers|dhanyabad|dhanyavad)\b/,
    book: /\b(book|booking|reserve|reservation|inquire|inquiry|enquire|enquiry|sign me up|sign up|join (a|the|your))\b/,
    human: /\b(whatsapp|human|real person|someone real|talk to (someone|a person|the team|you)|speak (to|with)|call me|phone number|contact|email|agent)\b/,
    compare: /\b(vs|versus|compare|comparison|difference|differences|better)\b|\bor\b/,
    price: /\b(price|prices|pricing|cost|costs|how much|budget|usd|dollars?|expensive|cheap|cheapest|fee|fees|quote)\b|\$/,
    itinerary: /\b(itinerary|itineraries|day by day|day-by-day|daily plan|schedule|stages|day plan)\b/,
    included: /\b(include|included|includes|inclusion|inclusions|exclude|excluded|excludes|exclusion|exclusions|whats covered|covered)\b/,
    permit: /\b(permit|permits|tims|acap|restricted area permit|park fee|entry fee)\b/,
    season: /\b(season|seasons|when|best time|month|weather|monsoon|winter|spring|autumn|summer)\b/,
    altitude: /\b(highest point|how high|altitude|elevation|max altitude|maximum altitude|height|top out)\b/,
    howlong: /\b(how long|how many days|duration|length)\b/,
    difficulty: /\b(how hard|how difficult|difficulty|difficult|fitness|fit enough|suitable|good for beginners|beginner friendly|can i do|am i fit)\b/,
    transport: /\b(transport|transportation|flight|flights|fly|drive|bus|jeep|getting there|get there|get to|getting to|how do i reach|lukla|start point|starts? from)\b/,
    beginner: /\b(beginner|beginners|first time|first trek|first himalayan|never trekked|never hiked|never done|novice|easy|easiest|family|kids|children)\b/,
    hardest: /\b(hardest|toughest|most difficult|most challenging|most demanding)\b/,
    highest: /\b(highest trek|highest route|highest treks|goes highest|highest altitude trek|highest pass)\b/,
    shortest: /\b(shortest|quickest|short trek|short treks|few days)\b/,
    longest: /\b(longest|epic|long trek)\b/,
    quiet: /\b(less crowded|quiet|quieter|remote|off the beaten|off-beat|offbeat|fewer people|fewer trekkers|wild|untouched|crowds?|busy)\b/,
    restricted: /\b(restricted)\b/,
    climb: /\b(expedition|expeditions|8000|8,000|8000m|eight thousand|eight-thousand|climb|climbing|summit|summits|mountaineering|ascent|7000|7000m|6000|6000m|trekking peak|trekking peaks|peaks)\b/,
    trekish: /\b(trek|treks|trekking|hike|hiking|walk|walking|base camp|circuit|trail|trails)\b/,
    plan: /\b(plan|planning|trip to nepal|nepal trip|holiday|vacation|combine|combining|combination|two treks|both treks)\b/,
    stories: /\b(blog|story|stories|article|articles|journal|read)\b/,
    region: /\b(region|area|treks in|trails in|routes in|around)\b/,
    about: /\b(tell me about|about|show me|info|information|details|what is|whats)\b/
  };
  var TOPICS = [
    { key: 'altitudeAms', title: 'Altitude & AMS', re: /\b(ams|altitude sickness|acute mountain|acclimati[sz]\w*|hape|hace|diamox|headache)\b/, link: { label: 'Altitude & safety tools', href: '/altitude-safety#ams-risk' } },
    { key: 'visa', title: 'Nepal visa', re: /\bvisas?\b/ },
    { key: 'insurance', title: 'Travel insurance', re: /\binsur\w*/ },
    { key: 'money', title: 'Money on the trail', re: /\b(money|cash|atm|atms|currency|rupees?|npr|card payment)\b/ },
    { key: 'connectivity', title: 'Phone & internet', re: /\b(wifi|wi-fi|internet|sim|signal|coverage|mobile data|charging)\b/ },
    { key: 'water', title: 'Drinking water', re: /\b(water|drink)\b/ },
    { key: 'food', title: 'Food on the trail', re: /\b(food|meals?|eat|eating|vegetarian|vegan|dal bhat)\b/ },
    { key: 'accommodation', title: 'Tea houses & camping', re: /\b(accommodation|tea ?house|teahouses|lodges?|hotels?|where (do|will) (i|we) (stay|sleep)|rooms?|camping|showers?)\b/ },
    { key: 'guidePorter', title: 'Guides & porters', re: /\b(guides?|porters?|sherpas?)\b/ },
    { key: 'culture', title: 'Culture & etiquette', re: /\b(culture|cultural|etiquette|customs?|religion|monaster\w*|dress)\b/ },
    { key: 'responsible', title: 'Travelling responsibly', re: /\b(responsible|environment|plastic|waste|eco)\b/ },
    { key: 'gear', title: 'Packing & gear', re: /\b(pack|packing|gear|equipment|boots|clothing|what to bring|sleeping bag|kit list)\b/, link: { label: 'Open the gear list', href: '/altitude-safety#gear' } },
    { key: 'beforeYouGo', title: 'Before you fly', re: /\b(before (i|you) (go|fly|leave)|checklist|prepare|preparation|documents)\b/ }
  ];

  /* --------------------------------------------------------- text search */
  var STOP = {};
  ('a an the is are am i im me my we our you your it its of to in on for and or with do does did can could should would will be ' +
    'how what which when where who why there this that at from by as about any much many have has need get go going trek trekking route ' +
    'routes trip want like there please tell know if than then so just also into up').split(' ').forEach(function (w) { STOP[w] = 1; });
  function toks(s) {
    return norm(s).split(/[^a-z0-9]+/).filter(function (w) { return w.length > 2 && !STOP[w]; })
      .map(function (w) { return w.length > 4 ? w.replace(/(ies|es|s)$/, '') : w; });
  }
  function searchFaq(q, pool, skip) {
    var drop = {};
    (skip || []).forEach(function (it) { toks(it.name + ' ' + it.slug.replace(/-/g, ' ')).forEach(function (w) { drop[w] = 1; }); });
    var qt = toks(q).filter(function (w) { return !drop[w]; });
    if (!qt.length) return null;
    var best = null;
    pool.forEach(function (it) {
      (it.faq || []).forEach(function (f) {
        var ft = toks(f.q), at = toks(f.a), hit = 0, soft = 0;
        qt.forEach(function (w) { if (ft.indexOf(w) > -1) hit++; else if (at.indexOf(w) > -1) soft++; });
        var score = hit * 2 + soft * 0.4;
        var need = Math.max(1, Math.ceil(qt.length * 0.6));
        if (hit >= need && (!best || score > best.score)) best = { score: score, faq: f, item: it };
      });
    });
    return best;
  }

  /* ============================================================ BRAIN
     respond(text, ctx) → { blocks: [...], suggest: [...] }                  */
  var A = {
    nav: function (label, href, primary) { return { act: 'nav', label: label, value: href, primary: !!primary }; },
    cmd: function (label, cmd, primary) { return { act: 'do', label: label, value: cmd, primary: !!primary }; },
    wa: function (label, text) { return { act: 'wa', label: label || 'Chat on WhatsApp', value: text || '' }; },
    mail: function () { return { act: 'mail', label: 'Email the desk', value: CFG.email }; }
  };
  function actions(list) { return { t: 'actions', items: list.filter(Boolean) }; }
  function p(text) { return { t: 'p', text: text }; }

  function handoff(lead) {
    return {
      blocks: [p(lead || 'I don’t want to guess about that. The expedition team can confirm it for you.'),
        actions([A.nav('Contact expedition desk', '/contact', true), A.wa('Chat on WhatsApp', 'Hello Himalayan Magic — I have a question from your website.')])],
      suggest: defaultSuggest()
    };
  }

  function defaultSuggest() {
    var s = ['Best trek for 10 days?', 'Everest vs Annapurna', 'Show me remote treks', '8000m expeditions', 'What does ABC cost?', 'Best season for Manaslu?'];
    return s;
  }
  function focusSuggest(it) {
    if (!it) return defaultSuggest();
    var short = it.name.replace(/\s+Trek$/, '');
    if (it.kind === 'peak') {
      var tk = PEAK_TREK[it.slug] && trek(PEAK_TREK[it.slug]);
      var band = { '8000': 'Other 8000m peaks', '7000': 'Other 7000m peaks', '6000': 'Other 6000m peaks', trekking: 'Other trekking peaks' }[it.category] || 'Expeditions';
      return ['Best season for ' + short + '?', 'How long is the ' + short + ' expedition?', tk ? tk.name.replace(/\s+Trek$/, '') : band, 'Send an inquiry'];
    }
    var rel = (it.related || []).map(trek).filter(Boolean)[0];
    return ['Itinerary for ' + short, 'What does ' + short + ' cost?', 'Is ' + short + ' good for beginners?',
      'Permits for ' + short, rel ? short + ' vs ' + rel.name.replace(/\s+Trek$/, '') : 'Best season for ' + short + '?'];
  }

  function welcome() {
    var here = pageItem();
    var blocks = [
      { t: 'h', text: 'Namaste. I\u2019m Mr Yeti.' },
      { t: 'meta', text: 'FOOTPRINTS: EVERYWHERE · PHOTOS OF ME: NONE' },
      p('Yes, that yeti. I\u2019ve lived up here for a few thousand years, so I\u2019ve walked every trail, crossed every pass and napped on most of the glaciers. I also know which tea houses do the best dal bhat.'),
      p('Ask me anything about the Himalaya — a classic trek, a remote valley, a big summit, or somewhere worth getting lost. If I don\u2019t know, I\u2019ll say so and fetch a human.'),
      { t: 'menu', items: [
        A.cmd('Find a trek', 'find'), A.cmd('Compare treks', 'compare'), A.cmd('Expeditions', 'expeditions'),
        A.cmd('Plan my trip', 'plan'), A.cmd('Ask a question', 'ask')
      ] }
    ];
    return { blocks: blocks, suggest: here ? focusSuggest(here) : defaultSuggest() };
  }

  // The trek / peak the visitor is looking at right now, if any.
  function pageItem() {
    if (!KB) return null;
    var m = location.pathname.match(/^\/treks\/([a-z0-9-]+)/);
    if (m) return trek(m[1]) || null;
    m = location.pathname.match(/^\/expeditions\/(?:peaks\/)?([a-z0-9-]+)/);
    return m ? peak(m[1]) || null : null;
  }

  /* ---- answer builders -------------------------------------------------- */
  function metaLine(it) {
    if (it.kind === 'peak') return [it.elevation, it.range, it.countries].filter(Boolean).map(upper).join(' · ');
    return [daysLabel(it), it.maxAltitude, it.difficulty].filter(Boolean).map(upper).join(' · ');
  }
  function daysLabel(it) {
    if (!it.days) return null;
    return (it.days[0] === it.days[1] ? it.days[0] : it.days[0] + '–' + it.days[1]) + ' days';
  }
  function shortName(it) { return it.name.replace(/\s+Trek$/, ''); }

  function aboutTrek(t) {
    return {
      blocks: [
        { t: 'h', text: t.name }, { t: 'meta', text: metaLine(t) },
        p(sentences(t.summary || t.tagline, 2)),
        { t: 'cards', items: [ref(t)] },
        actions([A.cmd('View itinerary', 'itinerary:' + t.slug), A.cmd('Price & what’s included', 'price:' + t.slug),
          A.cmd('Book / inquire', 'book:' + ref(t), true)])
      ],
      suggest: focusSuggest(t), focus: ref(t)
    };
  }
  function aboutPeak(pk) {
    var facts = [];
    if (pk.route) facts.push('Normal route: ' + pk.route);
    if (pk.duration) facts.push('Typical duration: ' + pk.duration);
    if (pk.season && pk.season.window) facts.push('Season: ' + pk.season.window);
    if (pk.grade) facts.push('Grade: ' + pk.grade);
    if (pk.firstAscent) facts.push('First ascent: ' + pk.firstAscent.year);
    var tk = PEAK_TREK[pk.slug] && trek(PEAK_TREK[pk.slug]);
    return {
      blocks: [
        { t: 'h', text: pk.name }, { t: 'meta', text: metaLine(pk) },
        p(sentences(pk.summary || pk.tagline, 2)),
        { t: 'cards', items: [ref(pk)] },
        facts.length ? { t: 'list', mark: 'dot', items: facts } : null,
        actions([A.nav('View ' + shortName(pk), pk.url), A.cmd('Send inquiry', 'book:' + ref(pk), true),
          tk ? A.cmd('Trek to its base', 'about:' + ref(tk)) : null])
      ].filter(Boolean),
      suggest: focusSuggest(pk), focus: ref(pk)
    };
  }
  function about(it) { return it.kind === 'peak' ? aboutPeak(it) : aboutTrek(it); }

  function priceAnswer(it, q) {
    if (it.kind === 'peak' || !(it.pricing && it.pricing.tiers && it.pricing.tiers.length)) {
      return {
        blocks: [{ t: 'h', text: it.name }, { t: 'meta', text: metaLine(it) },
          p('I don’t have a confirmed price for that route yet. I can help you send an inquiry to the expedition desk.'),
          actions([A.cmd('Send inquiry', 'book:' + ref(it), true), A.nav('View ' + shortName(it), it.url)])],
        suggest: focusSuggest(it), focus: ref(it)
      };
    }
    var group = q && /\b(\d+)\s*(people|persons|pax|of us|friends|travell?ers)\b|\b(couple|group|family)\b/.test(q);
    var solo = q && /\b(one person|1 person|solo|alone|myself|just me|single)\b/.test(q);
    var lead = 'These are the listed package ranges for ' + shortName(it) + ' in USD.' +
      (solo || group ? ' Group size changes the final quote, so the desk confirms the exact figure for ' + (solo ? 'a solo traveller' : 'your group') + '.' : '');
    return {
      blocks: [{ t: 'h', text: it.name }, { t: 'meta', text: metaLine(it) }, p(lead),
        { t: 'prices', ref: ref(it) },
        actions([A.cmd('View itinerary', 'itinerary:' + it.slug), A.cmd('What’s included', 'included:' + it.slug), A.cmd('Book / inquire', 'book:' + ref(it), true)])],
      suggest: focusSuggest(it), focus: ref(it)
    };
  }

  function includedAnswer(t) {
    var blocks = [{ t: 'h', text: 'What’s included — ' + shortName(t) }];
    if (t.included && t.included.length) blocks.push({ t: 'list', mark: 'check', items: t.included });
    else if (t.pricing && t.pricing.tiers && t.pricing.tiers.length) {
      blocks.push(p('Each listed package includes:'));
      blocks.push({ t: 'prices', ref: ref(t), compact: true });
    } else blocks.push(p('Inclusions aren’t listed for this route yet.'));
    if (t.excluded && t.excluded.length) {
      blocks.push(p('Not included:'));
      blocks.push({ t: 'list', mark: 'x', items: t.excluded });
    } else {
      blocks.push(p('Exclusions aren’t listed for this route yet — I don’t want to guess. The desk lists them with your quote.'));
    }
    blocks.push(actions([A.cmd('View itinerary', 'itinerary:' + t.slug), A.cmd('Book / inquire', 'book:' + ref(t), true)]));
    return { blocks: blocks, suggest: focusSuggest(t), focus: ref(t) };
  }

  function itineraryAnswer(t) {
    if (!t.itinerary || !t.itinerary.length) {
      return { blocks: [p('The day-by-day plan for ' + shortName(t) + ' isn’t published yet.'),
        actions([A.nav('View ' + shortName(t), t.url), A.cmd('Ask the desk', 'book:' + ref(t), true)])], suggest: focusSuggest(t), focus: ref(t) };
    }
    return {
      blocks: [{ t: 'h', text: shortName(t) + ' — day by day' }, { t: 'meta', text: metaLine(t) },
        { t: 'itinerary', ref: ref(t) },
        actions([A.nav('Full route page', t.url + '#itinerary'), A.cmd('Price & what’s included', 'price:' + t.slug), A.cmd('Book / inquire', 'book:' + ref(t), true)])],
      suggest: focusSuggest(t), focus: ref(t)
    };
  }

  function permitsAnswer(t) {
    if (t.kind === 'peak') return handoff('Climbing permits depend on the peak, season and route. I don’t want to guess — the expedition desk confirms them for your dates.');
    var blocks = [{ t: 'h', text: 'Permits — ' + shortName(t) }];
    if (t.permits && t.permits.length) {
      blocks.push({ t: 'list', mark: 'dot', items: t.permits.map(function (x) { return x.name + (x.fee ? ' — ' + x.fee : ''); }) });
    } else blocks.push(p('The permit list for this route isn’t published yet.'));
    if (t.restricted) blocks.push(p('This is a **restricted area** — the route page explains the special permit and its conditions.'));
    blocks.push(p('Fees change; the desk arranges permits and confirms current amounts.'));
    blocks.push(actions([A.nav('Permits on the route page', t.url + '#permits'), A.cmd('Book / inquire', 'book:' + ref(t), true)]));
    return { blocks: blocks, suggest: focusSuggest(t), focus: ref(t) };
  }

  function seasonAnswer(it, month, sw) {
    var blocks = [{ t: 'h', text: 'Seasons — ' + shortName(it) }];
    var listed = it.kind === 'peak' ? (it.season && it.season.window) : it.bestSeason;
    if (month != null || sw) {
      var ms = month != null ? [month] : sw.months;
      var label = month != null ? MON_FULL[month] : sw.label;
      var inside = ms.filter(function (m) { return it.months[m] === 1; }).length;
      var edge = ms.filter(function (m) { return it.months[m] === 0.5; }).length;
      if (inside === ms.length) blocks.push(p('Yes — **' + label + '** sits inside the listed best season' + (listed ? ' (' + listed + ')' : '') + '.'));
      else if (inside || edge) blocks.push(p('Partly. ' + label.charAt(0).toUpperCase() + label.slice(1) + ' overlaps the edge of the listed season' + (listed ? ' (' + listed + ')' : '') + ' — conditions are less settled either side of it.'));
      else {
        blocks.push(p(label.charAt(0).toUpperCase() + label.slice(1) + ' is outside the listed best season' + (listed ? ' (' + listed + ')' : '') + '. I wouldn’t plan around it without talking to the desk.'));
        var alts = KB.treks.filter(function (t) { return !t.lowland && ms.every(function (m) { return t.months[m]; }); })
          .sort(function (a, b) { return (b.popular ? 1 : 0) - (a.popular ? 1 : 0); }).slice(0, 4);
        if (alts.length && it.kind === 'trek') {
          blocks.push({ t: 'months', ref: ref(it) });
          blocks.push(p('Routes whose listed season does include ' + label + ':'));
          blocks.push({ t: 'cards', items: alts.map(ref) });
          return { blocks: blocks, suggest: focusSuggest(it), focus: ref(it) };
        }
      }
    } else {
      blocks.push(p(listed ? 'Listed best season: **' + listed + '**.' : 'The season window for this route isn’t published yet.'));
      if (it.kind === 'peak' && it.season && it.season.note) blocks.push(p(sentences(it.season.note, 2)));
    }
    blocks.push({ t: 'months', ref: ref(it) });
    blocks.push(actions([A.nav('View ' + shortName(it), it.url), A.cmd('Book / inquire', 'book:' + ref(it), true)]));
    return { blocks: blocks, suggest: focusSuggest(it), focus: ref(it) };
  }

  function altitudeAnswer(it) {
    if (it.kind === 'peak') {
      return { blocks: [{ t: 'h', text: it.name }, p('The summit stands at **' + (it.elevation || it.elevationM + ' m') + '**' +
        (it.baseCampM ? ', with base camp around ' + it.baseCampM.toLocaleString('en-US') + ' m' : '') + '.'),
        { t: 'cards', items: [ref(it)] }], suggest: focusSuggest(it), focus: ref(it) };
    }
    var blocks = [{ t: 'h', text: 'Highest point — ' + shortName(it) },
      p('The highest point is **' + (it.maxAltitude || 'not listed') + '**' + (it.maxAltitudePoint ? ' (' + it.maxAltitudePoint + ')' : '') + '.' +
        (it.passes && it.passes.length ? ' Passes on the way: ' + it.passes.join(', ') + '.' : ''))];
    if (it.itinerary && it.itinerary.some(function (d) { return d.ele; })) blocks.push({ t: 'profile', ref: ref(it) });
    blocks.push(actions([A.cmd('View itinerary', 'itinerary:' + it.slug), A.nav('Altitude & safety', '/altitude-safety')]));
    return { blocks: blocks, suggest: focusSuggest(it), focus: ref(it) };
  }

  function durationAnswer(it) {
    var lines = [];
    if (it.duration) lines.push('Duration: ' + it.duration);
    if (it.walkHours) lines.push('Walking: ' + it.walkHours);
    if (it.distance) lines.push('Distance: ' + it.distance);
    if (it.start) lines.push('Starts: ' + it.start);
    return { blocks: [{ t: 'h', text: it.name }, lines.length ? { t: 'list', mark: 'dot', items: lines } : p('The duration isn’t listed yet.'),
      actions([it.kind === 'trek' ? A.cmd('View itinerary', 'itinerary:' + it.slug) : A.nav('View ' + shortName(it), it.url), A.cmd('Book / inquire', 'book:' + ref(it), true)])],
      suggest: focusSuggest(it), focus: ref(it) };
  }

  function difficultyAnswer(t) {
    if (t.kind === 'peak') {
      return { blocks: [{ t: 'h', text: t.name }, { t: 'meta', text: metaLine(t) },
        p(t.difficulty ? sentences(t.difficulty, 3) : 'The difficulty briefing for this peak isn’t published yet.'),
        actions([A.nav('View ' + shortName(t), t.url), A.cmd('Send inquiry', 'book:' + ref(t), true)])], suggest: focusSuggest(t), focus: ref(t) };
    }
    var su = t.suitability || {};
    var blocks = [{ t: 'h', text: 'Is ' + shortName(t) + ' right for you?' }, { t: 'meta', text: metaLine(t) }, { t: 'bars', ref: ref(t) }];
    if (su.goodFor && su.goodFor.length) { blocks.push(p('Good for:')); blocks.push({ t: 'list', mark: 'check', items: su.goodFor }); }
    if (su.notIdeal && su.notIdeal.length) { blocks.push(p('Not ideal for:')); blocks.push({ t: 'list', mark: 'x', items: su.notIdeal }); }
    blocks.push(actions([A.cmd('View itinerary', 'itinerary:' + t.slug), A.cmd('Easier alternatives', 'style:scenic'), A.cmd('Book / inquire', 'book:' + ref(t), true)]));
    return { blocks: blocks, suggest: focusSuggest(t), focus: ref(t) };
  }

  function transportAnswer(t) {
    var lines = [];
    if (t.start) lines.push('Start: ' + t.start);
    if (t.transport) lines.push(t.transport);
    if (!lines.length) return handoff('Transport details for ' + shortName(t) + ' aren’t published yet. The expedition team can confirm them for you.');
    return { blocks: [{ t: 'h', text: 'Getting there — ' + shortName(t) }, { t: 'list', mark: 'dot', items: lines },
      actions([A.nav('Full route page', t.url), A.cmd('Book / inquire', 'book:' + ref(t), true)])], suggest: focusSuggest(t), focus: ref(t) };
  }

  function faqAnswer(hit) {
    var it = hit.item;
    return { blocks: [{ t: 'kicker', text: 'From the ' + it.name + ' page' }, { t: 'h', text: hit.faq.q }, p(hit.faq.a),
      actions([A.nav('View ' + shortName(it), it.url), A.cmd('Book / inquire', 'book:' + ref(it))])], suggest: focusSuggest(it), focus: ref(it) };
  }

  function topicAnswer(tp, q) {
    var g = KB.guides[tp.key];
    var blocks = [{ t: 'h', text: tp.title }];
    if (tp.key === 'gear') {
      blocks.push(p('The site keeps a full, route-aware packing list — essentials first, filterable by route.'));
    } else if (tp.key === 'beforeYouGo') {
      var list = KB.guides.beforeYouGo || [];
      if (!list.length) return handoff();
      blocks.push({ t: 'list', mark: 'check', items: list });
    } else {
      if (!g) return handoff();
      if (g.intro) blocks.push(p(g.intro));
      if (g.signs && g.signs.length) { blocks.push(p('Signs to watch for:')); blocks.push({ t: 'list', mark: 'dot', items: g.signs }); }
      var pts = (g.points || []).concat(g.notes || []);
      if (pts.length) blocks.push({ t: 'list', mark: 'dot', items: pts.slice(0, 6) });
      if (g.disclaimer) blocks.push(p(g.disclaimer));
      if (g.verify) blocks.push(p('Rules and fees change — confirm the current position before you fly.'));
    }
    var extra = searchFaq(q, KB.treks);
    var acts = [tp.link ? A.nav(tp.link.label, tp.link.href, true) : null, A.cmd('Ask the desk', 'handoff')];
    if (extra && extra.score >= 4 && tp.key === 'guidePorter') {
      blocks.push({ t: 'kicker', text: 'On a specific route — ' + extra.item.name });
      blocks.push(p(sentences(extra.faq.a, 3)));
    }
    blocks.push(actions(acts));
    return { blocks: blocks, suggest: defaultSuggest() };
  }

  function compareAnswer(a, b) {
    if (a.kind !== b.kind) {
      return { blocks: [p('One is a trek and one is a climbing expedition, so they don’t compare line by line. Here are both:'),
        { t: 'cards', items: [ref(a), ref(b)] }], suggest: focusSuggest(a) };
    }
    var lead = a.kind === 'peak' ? 'Two very different objectives. Side by side:' : 'Both are excellent objectives, but the experience is quite different.';
    return {
      blocks: [p(lead), { t: 'compare', refs: [ref(a), ref(b)] },
        actions([A.cmd('Show ' + shortName(a), 'about:' + ref(a)), A.cmd('Show ' + shortName(b), 'about:' + ref(b))])],
      suggest: [shortName(a) + ' itinerary', shortName(b) + ' itinerary', 'What does ' + shortName(a) + ' cost?', 'Plan my trip'], focus: ref(a)
    };
  }
  function comparePrompt() {
    var pairs = [['everest-base-camp', 'annapurna-base-camp'], ['annapurna-circuit', 'manaslu-circuit'], ['everest-base-camp', 'gokyo-lakes'],
      ['langtang-valley', 'mardi-himal'], ['upper-mustang', 'upper-dolpo']];
    var items = pairs.filter(function (x) { return trek(x[0]) && trek(x[1]); }).map(function (x) {
      return A.cmd(shortName(trek(x[0])) + ' vs ' + shortName(trek(x[1])), 'compare:trek:' + x[0] + ',trek:' + x[1]);
    });
    return { blocks: [p('Pick a pair — or type any two route names, like “Gokyo or Three Passes?”'), { t: 'choices', items: items }], suggest: defaultSuggest() };
  }

  /* ---- recommendations -------------------------------------------------- */
  var STYLE = {
    scenic: { label: 'Scenic + comfort', test: function (t) { var s = t.suitability || {}; return !t.lowland && t.rank <= 2 && (s.technical == null || s.technical <= 3) && (s.altitude == null || s.altitude <= 7); } },
    challenging: { label: 'Challenging but non-technical', test: function (t) { var s = t.suitability || {}; return !t.lowland && t.rank >= 2.5 && t.rank <= 4 && (s.technical == null || s.technical <= 4); } },
    remote: { label: 'Remote + adventurous', test: function (t) { var s = t.suitability || {}; return !t.lowland && ((s.remoteness || 0) >= 7 || t.restricted); } },
    culture: { label: 'Culture + lowlands', test: function (t) { return t.lowland || (t.maxAltitudeM && t.maxAltitudeM < 3000) || /heritage|pilgrim|temple|safari/i.test(t.name); } }
  };

  function recommend(o) {
    var list = KB.treks.filter(function (t) {
      if (o.style && STYLE[o.style] && !STYLE[o.style].test(t)) return false;
      if (o.days && (!t.days || t.days[0] > o.days)) return false;
      if (!o.style && t.lowland) return false;
      return true;
    }).map(function (t) {
      var s = 0, why = [];
      if (o.days) { s += 3 - Math.min(3, (o.days - t.days[0]) / 3); why.push(daysLabel(t)); }
      if (o.months) {
        var ok = o.months.every(function (m) { return t.months[m]; });
        s += ok ? 3 : -3; if (ok) why.push('in season');
      }
      if (t.popular) s += 1;
      if (o.style === 'remote') s += (t.suitability && t.suitability.remoteness || 0) / 3;
      if (o.style === 'scenic') s -= t.rank / 2;
      return { t: t, s: s, why: why };
    }).sort(function (a, b) { return b.s - a.s; });
    return list.slice(0, o.limit || 3);
  }

  function recommendAnswer(o, lead) {
    var picks = recommend(o);
    if (!picks.length) {
      return { blocks: [p('Nothing on the site fits all of that at once. The desk builds custom itineraries — tell them what you have in mind.'),
        actions([A.cmd('Plan with the desk', 'book:custom', true), A.cmd('Start over', 'plan')])], suggest: defaultSuggest() };
    }
    var notes = {};
    picks.forEach(function (x) { if (x.why.length) notes[ref(x.t)] = x.why.join(' · '); });
    return {
      blocks: [p(lead), { t: 'cards', items: picks.map(function (x) { return ref(x.t); }), notes: notes },
        o.days ? p('Check each route page for whether its listed duration includes your Kathmandu days — most do not.') : null,
        actions([A.cmd('Compare the top two', picks.length > 1 ? 'compare:' + ref(picks[0].t) + ',' + ref(picks[1].t) : 'compare'),
          A.cmd('Plan with the desk', 'book:' + ref(picks[0].t), true)])].filter(Boolean),
      suggest: picks.map(function (x) { return 'Tell me about ' + shortName(x.t); }).concat(['Plan my trip']), focus: ref(picks[0].t)
    };
  }

  function styleQuestion(lead) {
    return { blocks: [p(lead || 'What sounds more like you?'), { t: 'choices', items: [
      A.cmd('Scenic + comfort', 'style:scenic'), A.cmd('Challenging but non-technical', 'style:challenging'),
      A.cmd('Remote + adventurous', 'style:remote'), A.cmd('Culture + lowlands', 'style:culture')] }],
    suggest: ['I have 10 days', 'Where can I trek in October?', 'Show me remote treks'] };
  }

  function peakList(cat) {
    var labels = { '8000': 'The eight-thousanders', '7000': 'The 7,000 m peaks', '6000': 'The 6,000 m peaks', trekking: 'Trekking peaks' };
    var paths = { '8000': '/expeditions/8000m', '7000': '/expeditions/7000m', '6000': '/expeditions/6000m', trekking: '/expeditions/trekking-peaks' };
    var list = KB.peaks.filter(function (x) { return x.category === cat; }).sort(function (a, b) { return (b.elevationM || 0) - (a.elevationM || 0); });
    if (!list.length) return handoff('I don’t have ' + labels[cat].toLowerCase() + ' listed yet. The expedition team can tell you what they run.');
    var nepal = list.filter(function (x) { return x.inNepal; }).length;
    return {
      blocks: [{ t: 'h', text: labels[cat] }, { t: 'meta', text: list.length + ' ON THE DESK' + (nepal !== list.length ? ' · ' + nepal + ' IN NEPAL' : '') },
        { t: 'cards', items: list.map(ref) },
        actions([A.nav('Open the collection', paths[cat], true), A.cmd('Send inquiry', 'book:custom')])],
      suggest: list.slice(0, 3).map(function (x) { return 'Tell me about ' + shortName(x); }).concat(['Best season for ' + shortName(list[0]) + '?'])
    };
  }
  function expeditionsMenu() {
    var counts = { '8000': 0, '7000': 0, '6000': 0, trekking: 0 };
    KB.peaks.forEach(function (x) { if (counts[x.category] != null) counts[x.category]++; });
    var items = [];
    if (counts['8000']) items.push(A.cmd('8,000 m · ' + counts['8000'] + ' peaks', 'peaks:8000'));
    if (counts['7000']) items.push(A.cmd('7,000 m · ' + counts['7000'] + ' peaks', 'peaks:7000'));
    if (counts['6000']) items.push(A.cmd('6,000 m · ' + counts['6000'] + ' peaks', 'peaks:6000'));
    if (counts.trekking) items.push(A.cmd('Trekking peaks · ' + counts.trekking, 'peaks:trekking'));
    return { blocks: [{ t: 'h', text: 'Expeditions' }, p('Choose an elevation band. Each peak has its own briefing — route, camps, season and history.'),
      { t: 'choices', items: items }, actions([A.nav('All expeditions', '/expeditions')])], suggest: ['Which 8000m peaks do you organize?', 'Tell me about Ama Dablam', 'Best first 6000m peak?'] };
  }

  function superlative(kind) {
    var pool = KB.treks.filter(function (t) { return !t.lowland; }), pick, lead;
    if (kind === 'hardest') {
      pool.sort(function (a, b) { var sa = a.suitability || {}, sb = b.suitability || {};
        return (b.rank - a.rank) || (((sb.physical || 0) + (sb.technical || 0) + (sb.altitude || 0)) - ((sa.physical || 0) + (sa.technical || 0) + (sa.altitude || 0))); });
      lead = 'By the site’s own grading, these are the hardest routes on the desk. The top ones cross glaciated passes and are closer to mountaineering than trekking.';
    } else if (kind === 'highest') {
      pool.sort(function (a, b) { return (b.maxAltitudeM || 0) - (a.maxAltitudeM || 0); });
      lead = 'The routes that go highest, by listed maximum altitude:';
    } else if (kind === 'shortest') {
      pool = KB.treks.filter(function (t) { return t.days; }).sort(function (a, b) { return a.days[0] - b.days[0]; });
      lead = 'The shortest listed routes:';
    } else if (kind === 'longest') {
      pool = pool.filter(function (t) { return t.days; }).sort(function (a, b) { return b.days[1] - a.days[1]; });
      lead = 'The longest journeys on the desk:';
    } else if (kind === 'quiet') {
      pool = pool.filter(function (t) { return !t.popular; }).sort(function (a, b) { return ((b.suitability || {}).remoteness || 0) - ((a.suitability || {}).remoteness || 0); });
      lead = 'Routes the site rates most remote — far fewer trekkers than Everest or Annapurna:';
    } else if (kind === 'restricted') {
      pool = KB.treks.filter(function (t) { return t.restricted; });
      lead = 'Restricted-area routes need a special permit and an organised, guided trip:';
    }
    pick = pool.slice(0, 4);
    return { blocks: [p(lead), { t: 'cards', items: pick.map(ref) }, actions([A.nav('Browse all treks', '/treks'), A.cmd('Compare two of these', pick.length > 1 ? 'compare:' + ref(pick[0]) + ',' + ref(pick[1]) : 'compare')])],
      suggest: pick.slice(0, 3).map(function (x) { return 'Tell me about ' + shortName(x); }).concat(['Plan my trip']), focus: pick[0] && ref(pick[0]) };
  }

  function monthList(month, sw) {
    var ms = month != null ? [month] : sw.months, label = month != null ? MON_FULL[month] : sw.label;
    var pool = KB.treks.filter(function (t) { return !t.lowland && ms.every(function (m) { return t.months[m]; }); })
      .sort(function (a, b) { return (b.popular ? 1 : 0) - (a.popular ? 1 : 0); });
    if (!pool.length) return handoff('None of the listed treks show ' + label + ' inside their best season. The team can suggest what’s realistic then.');
    return { blocks: [p('Routes whose listed best season includes **' + label + '**:'), { t: 'cards', items: pool.slice(0, 5).map(ref) },
      pool.length > 5 ? p(pool.length + ' routes in total — these are the most walked.') : null, actions([A.nav('Browse all treks', '/treks')])].filter(Boolean),
      suggest: pool.slice(0, 3).map(function (x) { return 'Tell me about ' + shortName(x); }) };
  }

  function storiesAnswer(it) {
    var list = KB.stories.filter(function (s) { return !it || (s.related || []).indexOf(it.slug) > -1; });
    if (!list.length) list = KB.stories;
    if (!list.length) return handoff('The field journal is empty right now.');
    return { blocks: [p(it ? 'From the field journal, on and around ' + shortName(it) + ':' : 'From the field journal:'), { t: 'stories', items: list.slice(0, 4).map(function (s) { return s.slug; }) },
      actions([A.nav('Open the field journal', '/stories')])], suggest: defaultSuggest() };
  }

  /* ---- plan flow -------------------------------------------------------- */
  function planStep(ctx) {
    var pl = ctx.plan;
    if (!pl.days) {
      return { blocks: [p(pl.started ? 'How many days do you have in Nepal?' : 'Let’s shape it. How many days do you have in Nepal?'), { t: 'choices', items: [
        A.cmd('Up to 7 days', 'plan:days:7'), A.cmd('8–12 days', 'plan:days:12'), A.cmd('13–16 days', 'plan:days:16'), A.cmd('17 days or more', 'plan:days:30')] }],
      suggest: ['I have 10 days', 'Two weeks'], plan: pl };
    }
    if (!pl.style) return Object.assign(styleQuestion('And what kind of trip?'), { plan: pl });
    if (!pl.when) {
      return { blocks: [p('When are you thinking of going?'), { t: 'choices', items: [
        A.cmd('Spring · Mar–May', 'plan:when:spring'), A.cmd('Autumn · Sep–Nov', 'plan:when:autumn'), A.cmd('Winter · Dec–Feb', 'plan:when:winter'),
        A.cmd('Monsoon · Jun–Aug', 'plan:when:monsoon'), A.cmd('Not sure yet', 'plan:when:any')] }], suggest: ['October', 'Not sure yet'], plan: pl };
    }
    var sw = { spring: [2, 3, 4], autumn: [8, 9, 10], winter: [11, 0, 1], monsoon: [5, 6, 7] }[pl.when];
    var r = recommendAnswer({ days: pl.days, style: pl.style, months: typeof pl.when === 'number' ? [pl.when] : sw },
      'For ' + (pl.days >= 30 ? '17+ days' : pl.days + ' days') + ', ' + STYLE[pl.style].label.toLowerCase() +
      (pl.when !== 'any' ? ', ' + (typeof pl.when === 'number' ? 'in ' + MON_FULL[pl.when] : 'in ' + pl.when) : '') + ' — here is where I’d start:');
    r.plan = null;
    return r;
  }

  /* ---- the dispatcher --------------------------------------------------- */
  function command(cmd, ctx) {
    var parts = cmd.split(':'), c = parts[0], rest = parts.slice(1).join(':');
    var t;
    switch (c) {
      case 'find': return styleQuestion('Happy to narrow it down. What sounds more like you? Or just tell me how many days you have.');
      case 'compare':
        if (rest) { var rr = rest.split(','); var a = item(rr[0]), b = item(rr[1]); if (a && b) return compareAnswer(a, b); }
        return comparePrompt();
      case 'expeditions': return expeditionsMenu();
      case 'peaks': return peakList(rest);
      case 'ask': return { blocks: [p('Go ahead — routes, seasons, permits, prices, altitude, anything. If the answer isn’t on the site, I’ll say so and put you in touch with the team.')], suggest: defaultSuggest(), focusInput: true };
      case 'plan': return planStep(Object.assign(ctx, { plan: { started: false } }));
      case 'handoff': return { blocks: [p('Want to speak with the team directly?'), actions([A.wa('Chat on WhatsApp', 'Hello Himalayan Magic — I was talking to Mr Yeti on your website.'), A.mail(), A.nav('Contact page', '/contact')])], suggest: defaultSuggest() };
      case 'style':
        if (ctx.plan && STYLE[rest]) { ctx.plan.style = rest; ctx.plan.started = true; return planStep(ctx); }
        return recommendAnswer({ style: rest }, STYLE[rest] ? STYLE[rest].label + ' — here are the routes I’d look at first:' : 'Here are some routes:');
      case 'about': t = item(rest); return t ? about(t) : null;
      case 'itinerary': t = trek(rest); return t ? itineraryAnswer(t) : null;
      case 'price': t = trek(rest) || peak(rest); return t ? priceAnswer(t) : null;
      case 'included': t = trek(rest); return t ? includedAnswer(t) : null;
      case 'book': return bookAnswer(rest === 'custom' ? null : item(rest));
    }
    return null;
  }
  function planCommand(cmd, ctx) {
    var m = cmd.match(/^plan:(days|when):(.+)$/);
    if (!m) return null;
    ctx.plan = ctx.plan || { started: true };
    ctx.plan.started = true;
    if (m[1] === 'days') ctx.plan.days = +m[2];
    else ctx.plan.when = m[2];
    return planStep(ctx);
  }

  function combineAnswer(it) {
    if (it && it.kind === 'trek') {
      var rel = (it.related || []).map(trek).filter(Boolean);
      if (rel.length) {
        return { blocks: [p('The ' + shortName(it) + ' page lists these as related routes. Which ones actually link up on the ground depends on passes, permits and your dates — the desk plans that part.'),
          { t: 'cards', items: rel.slice(0, 4).map(ref) }, actions([A.cmd('Plan it with the desk', 'book:' + ref(it), true)])], suggest: focusSuggest(it), focus: ref(it) };
      }
    }
    return { blocks: [p('Often, yes — routes in the same region can share trailheads or passes. Whether a pairing works depends on permits, acclimatisation and your dates, so the desk plans combinations individually.'),
      p('Tell me the first route you have in mind, or shape the whole trip with me first.'),
      actions([A.cmd('Plan my trip', 'plan'), A.cmd('Send inquiry', 'book:custom', true)])], suggest: ['Treks in the Everest region', 'Treks in the Annapurna region', 'I have 20 days'] };
  }

  function bookAnswer(it) {
    return { blocks: [{ t: 'h', text: 'Let’s get your expedition started.' },
      p('A few details and the desk will come back to you — usually within 24 hours.'),
      { t: 'form', ref: it ? ref(it) : '' }], suggest: [], focus: it ? ref(it) : undefined };
  }

  function regionWord(q, ents, weakOnly) {
    if (weakOnly) return ents[0].text;
    if (!/\b(region|area|treks in|trails in|routes in|treks around|trekking in)\b/.test(q)) return null;
    var words = q.split(/[^a-z0-9]+/).filter(function (w) { return w.length >= 4 && !GENERIC[w] && !STOP[w] && !/^(region|area|treks|trails|routes|show|best|around|good)$/.test(w); });
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (KB.treks.some(function (t) { return norm(t.region).indexOf(w) > -1; })) return w;
    }
    return null;
  }

  function respond(raw, ctx) {
    var q = norm(raw);
    if (!q) return null;
    if (RX.reset.test(q)) return { reset: true };

    var ents = findEntities(q);
    var month = parseMonth(q), sw = parseSeasonWord(q), days = parseDays(q), style = parseStyle(q);
    var climb = RX.climb.test(q), trekish = RX.trekish.test(q);

    // Plan flow: fill whatever the visitor just told us, unless they changed the subject.
    if (ctx.plan && !ents.length && (days || style || month != null || sw || /not sure|any time|whenever/.test(q))) {
      if (days) ctx.plan.days = days;
      if (style) ctx.plan.style = style;
      if (month != null) ctx.plan.when = month;
      else if (sw) ctx.plan.when = { spring: 'spring', autumn: 'autumn', winter: 'winter', 'the monsoon months': 'monsoon' }[sw.label];
      else if (/not sure|any time|whenever/.test(q)) ctx.plan.when = 'any';
      ctx.plan.started = true;
      return planStep(ctx);
    }
    ctx.plan = null;

    // Resolve mountain-vs-trek ambiguity.
    var entIntent = month != null || !!sw || /\b(season|best time|when)\b/.test(q) || RX.compare.test(q) || RX.price.test(q) || RX.itinerary.test(q) || days || RX.beginner.test(q) || RX.included.test(q) || RX.permit.test(q);
    var list = ents.map(function (e) {
      var it = e.item;
      if (it.kind === 'peak' && PEAK_TREK[it.slug] && !climb && (trekish || entIntent)) return trek(PEAK_TREK[it.slug]) || it;
      return it;
    });
    list = uniq(list);
    var weakOnly = ents.length > 1 && ents.every(function (e) { return !e.strong; });
    var focus = list[0] || (ctx.focus && item(ctx.focus)) || null;
    var named = list.length > 0;

    if (RX.human.test(q) && !RX.book.test(q)) return command('handoff', ctx);
    if (RX.book.test(q) && !RX.price.test(q)) return bookAnswer(focus);

    if (list.length >= 2 && (RX.compare.test(q) || list.length === 2) && !weakOnly) return compareAnswer(list[0], list[1]);
    if (RX.compare.test(q) && /\b(compare|vs|versus|difference)\b/.test(q) && list.length < 2) return comparePrompt();

    // "Treks in the Everest region", or a name several routes share ("Dolpo") → the whole area.
    var area = regionWord(q, ents, weakOnly);
    if (area) {
      var inArea = KB.treks.filter(function (t) { return norm(t.region + ' ' + t.name).indexOf(area) > -1; });
      if (inArea.length > 1) {
        return { blocks: [{ t: 'h', text: 'Routes around ' + area.charAt(0).toUpperCase() + area.slice(1) }, { t: 'meta', text: inArea.length + ' ROUTES ON THE DESK' },
          { t: 'cards', items: inArea.map(ref) }, actions([A.nav('Browse all treks', '/treks'), A.cmd('Compare two of these', 'compare:' + ref(inArea[0]) + ',' + ref(inArea[1]))])],
          suggest: inArea.slice(0, 3).map(function (x) { return 'Tell me about ' + shortName(x); }) };
      }
    }
    if (list.length > 2) {
      return { blocks: [p('Pick one and I\u2019ll go deeper:'), { t: 'cards', items: list.map(ref) }], suggest: list.slice(0, 3).map(function (x) { return 'Tell me about ' + shortName(x); }) };
    }

    var topic = TOPICS.filter(function (tp) { return tp.re.test(q); })[0];
    if (topic && !named) return topicAnswer(topic, q);
    if (RX.quiet.test(q) && (!named || /\b(than|instead of|alternative|alternatives|besides|other than|like)\b/.test(q))) return superlative('quiet');
    if (/\b(combine|combining|combination|link up|two treks|both treks)\b/.test(q)) return combineAnswer(named ? list[0] : null);
    // "Which trek…", "where can I…" — a fresh question, not a follow-up on the last route.
    var generic = !named && /\b(where|which|what (treks|routes|trails)|any (treks|routes)|options|recommend|suggest)\b/.test(q);
    if (generic) focus = null;

    if (focus) {
      if (RX.price.test(q)) return priceAnswer(focus, q);
      if (RX.itinerary.test(q) && focus.kind === 'trek') return itineraryAnswer(focus);
      if (RX.included.test(q) && focus.kind === 'trek') return includedAnswer(focus);
      if (RX.permit.test(q)) return permitsAnswer(focus);
      if (month != null || sw || (RX.season.test(q) && (named || /\b(season|best time|when (should|can|to|is))\b/.test(q)))) return seasonAnswer(focus, month, sw);
      if (RX.altitude.test(q)) return altitudeAnswer(focus);
      if (RX.howlong.test(q)) return durationAnswer(focus);
      if (RX.transport.test(q) && focus.kind === 'trek') return transportAnswer(focus);
      if (RX.difficulty.test(q) || (named && RX.beginner.test(q))) return difficultyAnswer(focus);
      if (RX.stories.test(q) && named) return storiesAnswer(focus);
      var own = named ? searchFaq(q, [focus], list) : null;
      if (own) return faqAnswer(own);
      if (named) {
        // "Tell me about Dhaulagiri" — the mountain and the walk around it.
        var pk = list[0].kind === 'peak' ? list[0] : null;
        if (pk && PEAK_TREK[pk.slug] && !climb && trek(PEAK_TREK[pk.slug])) {
          var tk = trek(PEAK_TREK[pk.slug]);
          return { blocks: [{ t: 'h', text: shortName(pk) }, p(shortName(pk) + ' is both a climbing objective and the goal of one of the classic treks. Which one do you mean?'),
            { t: 'cards', items: [ref(pk), ref(tk)] },
            actions([A.cmd('The expedition', 'about:' + ref(pk)), A.cmd('The trek', 'about:' + ref(tk))])], suggest: focusSuggest(tk), focus: ref(tk) };
        }
        var topicNamed = TOPICS.filter(function (tp) { return tp.re.test(q); })[0];
        if (topicNamed && !RX.about.test(q)) return topicAnswer(topicNamed, q);
        return about(list[0]);
      }
    }

    if (RX.stories.test(q)) return storiesAnswer(null);

    if (/^other (8000|7000|6000)m peaks$/.test(q)) return peakList(q.match(/\d+/)[0]);
    if (q === 'other trekking peaks') return peakList('trekking');
    if (/^send an inquiry$/.test(q)) return bookAnswer(focus);
    if (climb && !trekish) {
      if (/\b(8000|8,000|8000m|eight thousand|eight-thousand|14 peaks)/.test(q)) return peakList('8000');
      if (/\b7000/.test(q)) return peakList('7000');
      if (/\b6000|first 6000/.test(q)) return peakList('6000');
      if (/trekking peaks?/.test(q)) return peakList('trekking');
      return expeditionsMenu();
    }
    if (RX.hardest.test(q)) return superlative('hardest');
    if (RX.highest.test(q)) return superlative('highest');
    if (RX.restricted.test(q)) return superlative('restricted');
    if (RX.quiet.test(q) && !days) return superlative('quiet');
    if (RX.beginner.test(q)) return styleQuestion('That’s completely fine. I’d narrow your search to routes where altitude gain and technical difficulty are manageable for a first Himalayan trek. What sounds more like you?');
    if (RX.plan.test(q) && !days) return command('plan', ctx);
    if (days) return recommendAnswer({ days: days, style: style, months: month != null ? [month] : sw ? sw.months : null },
      'With ' + days + ' days, these fit' + (month != null ? ' and are in season for ' + MON_FULL[month] : '') + ':');
    if (month != null || sw) return monthList(month, sw);
    if (RX.shortest.test(q)) return superlative('shortest');
    if (RX.longest.test(q)) return superlative('longest');
    if (style) return recommendAnswer({ style: style }, STYLE[style].label + ' — here are the routes I’d look at first:');
    if (RX.price.test(q)) return { blocks: [p('Prices are route-specific. Which route are you looking at?'), { t: 'choices', items: KB.treks.filter(function (t) { return t.popular; }).slice(0, 5).map(function (t) { return A.cmd(shortName(t), 'price:' + t.slug); }) }], suggest: defaultSuggest() };
    if (RX.itinerary.test(q)) return { blocks: [p('Which route? Here are the most walked:'), { t: 'choices', items: KB.treks.filter(function (t) { return t.popular; }).slice(0, 5).map(function (t) { return A.cmd(shortName(t), 'itinerary:' + t.slug); }) }], suggest: defaultSuggest() };

    var dest = KB.destinations.filter(function (d) { return d.re.test(q); });
    if (dest.length) {
      var d0 = dest[0], treksThere = uniq(dest.filter(function (d) { return d.key === d0.key; }).map(function (d) { return d.trek; }));
      return { blocks: [{ t: 'h', text: d0.name }, d0.note ? p(d0.note) : null, p('It comes up on ' + (treksThere.length === 1 ? 'this route:' : 'these routes:')),
        { t: 'cards', items: treksThere.slice(0, 4).map(ref) }].filter(Boolean), suggest: defaultSuggest() };
    }

    if (RX.greet.test(q)) return { blocks: [p('Namaste! Big feet, bigger map. Where in the Himalaya are you thinking about?')], suggest: defaultSuggest() };
    if (RX.thanks.test(q)) return { blocks: [p('Any time. If you want a person on the other end, the team is on WhatsApp.'), actions([A.wa('Chat on WhatsApp')])], suggest: defaultSuggest() };

    var hit = searchFaq(q, KB.treks.concat(KB.peaks), list);
    if (hit && hit.score >= 4) return faqAnswer(hit);
    return handoff();
  }

  var Brain = { respond: respond, command: command, planCommand: planCommand };

  /* ============================================================ RENDERING */
  var ARROW = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
  var ICON = {
    close: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" stroke="currentColor" stroke-width="1.6"/></svg>',
    restart: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10a5.5 5.5 0 1 0 1.8-4.1M4.5 3.5v3h3" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    send: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8.2 8.2 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.5 13.5 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.1-.3-.2-.6-.3zM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zM12 0a12 12 0 0 0-10.3 18L0 24l6.2-1.6A12 12 0 1 0 12 0z"/></svg>'
  };
  var TOPO = '<svg class="mry-topo" viewBox="0 0 400 90" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".8">' +
    '<path d="M-10 70C40 52 70 30 118 34s70 30 118 22 82-40 120-38 60 12 64 12"/><path d="M-10 80C44 64 78 44 122 47s74 28 116 22 86-36 124-34 52 10 58 10"/>' +
    '<path d="M-10 60C36 40 66 18 114 22s66 30 120 20 78-44 118-42 64 14 68 14"/><path d="M160 88c20-14 44-22 70-20s40 12 62 8"/></g></svg>';

  function placeholder(el) {
    el.onerror = null;
    el.removeAttribute('src');
    el.classList.add('is-empty');
  }

  function cardHtml(it, note) {
    var href = safeHref(it.url), img = safeImg(it.image);
    var isPeak = it.kind === 'peak';
    var kicker = isPeak ? [it.elevation, it.range].filter(Boolean).join(' · ') : [it.region, it.restricted ? 'Restricted area' : null].filter(Boolean).join(' · ');
    var stats = isPeak
      ? [['Summit', it.elevation], ['Duration', it.days ? (it.days[0] === it.days[1] ? it.days[0] : it.days[0] + '–' + it.days[1]) + ' d' : null], ['Grade', it.grade]]
      : [['Max', it.maxAltitude && it.maxAltitude.replace(/^≈\s*/, '')], ['Days', it.days ? (it.days[0] === it.days[1] ? it.days[0] : it.days[0] + '–' + it.days[1]) : null], ['Grade', it.difficulty]];
    var season = isPeak ? it.season && it.season.window : it.bestSeason;
    return '<a class="mry-card" href="' + esc(href || '#') + '" data-mry-nav>' +
      '<span class="mry-card-media">' + (img ? '<img src="' + esc(img) + '" alt="" loading="lazy" decoding="async">' : '<img alt="" class="is-empty">') +
      '<span class="mry-card-kicker">' + esc(kicker) + '</span></span>' +
      '<span class="mry-card-body"><span class="mry-card-title">' + esc(it.name) + '</span>' +
      '<span class="mry-card-stats">' + stats.filter(function (s) { return s[1]; }).map(function (s) {
        return '<span><em>' + esc(s[0]) + '</em><b>' + esc(s[1]) + '</b></span>';
      }).join('') + '</span>' +
      (season ? '<span class="mry-card-season"><em>Best</em> ' + esc(String(season).split('(')[0].trim()) + '</span>' : '') +
      (note ? '<span class="mry-card-note">' + esc(note) + '</span>' : '') +
      '<span class="mry-card-cta">' + (isPeak ? 'View expedition' : 'View route') + ARROW + '</span></span></a>';
  }

  function actionHtml(a, cls) {
    var label = esc(a.label);
    var klass = (cls || 'mry-act') + (a.primary ? ' is-primary' : '');
    if (a.act === 'nav') { var h = safeHref(a.value); return h ? '<a class="' + klass + '" href="' + esc(h) + '" data-mry-nav>' + label + ARROW + '</a>' : ''; }
    if (a.act === 'wa') return '<a class="' + klass + ' is-wa" href="' + esc(waLink(a.value)) + '" target="_blank" rel="noopener">' + ICON.wa + label + '</a>';
    if (a.act === 'mail') return '<a class="' + klass + '" href="mailto:' + esc(a.value) + '">' + label + ARROW + '</a>';
    return '<button type="button" class="' + klass + '" data-mry-do="' + esc(a.value) + '" data-mry-label="' + label + '">' + label + ARROW + '</button>';
  }

  function barRow(label, v) {
    if (typeof v !== 'number') return '';
    return '<div class="mry-bar"><span>' + esc(label) + '</span><i><s style="width:' + Math.max(0, Math.min(10, v)) * 10 + '%"></s></i><b>' + v + '/10</b></div>';
  }

  function profileSvg(days) {
    var pts = days.filter(function (d) { return typeof d.ele === 'number'; });
    if (pts.length < 2) return '';
    var max = Math.max.apply(null, pts.map(function (d) { return d.ele; })), min = Math.min.apply(null, pts.map(function (d) { return d.ele; }));
    var span = Math.max(1, max - min), w = 300, h = 64;
    var path = pts.map(function (d, i) { return (i ? 'L' : 'M') + (i / (pts.length - 1) * w).toFixed(1) + ' ' + (h - 6 - (d.ele - min) / span * (h - 16)).toFixed(1); }).join(' ');
    var top = pts.reduce(function (a, d, i) { return d.ele === max && a < 0 ? i : a; }, -1);
    var tx = (top / (pts.length - 1) * w);
    return '<figure class="mry-profile"><svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="' + path + ' L' + w + ' ' + h + ' L0 ' + h + 'Z" class="mry-profile-fill"/><path d="' + path + '" class="mry-profile-line"/>' +
      '<circle cx="' + tx.toFixed(1) + '" cy="10" r="2.6" class="mry-profile-dot"/></svg>' +
      '<figcaption><span>' + min.toLocaleString('en-US') + ' m</span><span>High point ' + max.toLocaleString('en-US') + ' m</span></figcaption></figure>';
  }

  function monthsHtml(it) {
    return '<div class="mry-months" role="img" aria-label="Season by month">' + MON.map(function (m, i) {
      var v = it.months[i];
      return '<span class="' + (v === 1 ? 'is-on' : v === 0.5 ? 'is-edge' : '') + '">' + m.charAt(0).toUpperCase() + '</span>';
    }).join('') + '</div><div class="mry-months-key"><span class="is-on"></span>' + (it.kind === 'peak' ? 'Prime<span class="is-edge"></span>Shoulder' : 'Listed best season') + '</div>';
  }

  function compareHtml(a, b) {
    var rows;
    function dl(x) { return daysLabel(x) || '—'; }
    function price(x) { var t = x.pricing && x.pricing.tiers && x.pricing.tiers[0]; return t ? 'from ' + t.range.split('–')[0] : 'On request'; }
    function bars(x, k) { var v = (x.suitability || {})[k]; return typeof v === 'number' ? '<i class="mry-mini"><s style="width:' + v * 10 + '%"></s></i>' + v : '—'; }
    if (a.kind === 'peak') {
      rows = [['Summit', a.elevation, b.elevation], ['Range', a.range, b.range], ['Duration', a.duration, b.duration],
        ['Grade', a.grade, b.grade], ['Season', a.season && a.season.window, b.season && b.season.window],
        ['First ascent', a.firstAscent && a.firstAscent.year, b.firstAscent && b.firstAscent.year]];
    } else {
      rows = [['Duration', dl(a), dl(b)], ['Highest point', a.maxAltitude, b.maxAltitude], ['Difficulty', a.difficulty, b.difficulty],
        ['Best season', a.bestSeason, b.bestSeason], ['Region', a.region, b.region], ['Walking', a.walkHours, b.walkHours],
        ['Physical', { h: bars(a, 'physical') }, { h: bars(b, 'physical') }], ['Altitude', { h: bars(a, 'altitude') }, { h: bars(b, 'altitude') }],
        ['Remoteness', { h: bars(a, 'remoteness') }, { h: bars(b, 'remoteness') }], ['Character', a.tagline, b.tagline], ['Listed price', price(a), price(b)]];
    }
    function cell(v) { return v && v.h ? v.h : esc(v == null || v === '' ? '—' : String(v).split('(')[0].trim()); }
    return '<div class="mry-compare" role="table"><div class="mry-cmp-head" role="row"><span role="columnheader"></span><span role="columnheader">' + esc(shortName(a)) +
      '</span><span role="columnheader">' + esc(shortName(b)) + '</span></div>' +
      rows.map(function (r) { return '<div class="mry-cmp-row" role="row"><span role="rowheader">' + esc(r[0]) + '</span><span role="cell">' + cell(r[1]) + '</span><span role="cell">' + cell(r[2]) + '</span></div>'; }).join('') + '</div>';
  }

  function formHtml(prefRef, id) {
    var opts = '<option value="">Custom / not sure yet</option>' +
      '<optgroup label="Treks">' + KB.treks.map(function (t) { return '<option value="' + esc(ref(t)) + '"' + (ref(t) === prefRef ? ' selected' : '') + '>' + esc(t.name) + '</option>'; }).join('') + '</optgroup>' +
      '<optgroup label="Expeditions">' + KB.peaks.map(function (x) { return '<option value="' + esc(ref(x)) + '"' + (ref(x) === prefRef ? ' selected' : '') + '>' + esc(x.name) + '</option>'; }).join('') + '</optgroup>';
    var now = new Date(), min = now.toISOString().slice(0, 7);
    return '<form class="mry-form" novalidate data-mry-form="' + id + '">' +
      '<label class="mry-f mry-f-wide"><span>Trek / expedition</span><select name="trip">' + opts + '</select></label>' +
      '<label class="mry-f"><span>Name *</span><input name="name" autocomplete="name" required maxlength="120"></label>' +
      '<label class="mry-f"><span>Email *</span><input name="email" type="email" autocomplete="email" required maxlength="200"></label>' +
      '<label class="mry-f"><span>Phone / WhatsApp</span><input name="phone" type="tel" autocomplete="tel" maxlength="40"></label>' +
      '<label class="mry-f mry-f-half"><span>Travellers</span><input name="people" type="number" min="1" max="50" value="1" inputmode="numeric"></label>' +
      '<label class="mry-f mry-f-half"><span>Month</span><input name="month" type="month" min="' + min + '" placeholder="YYYY-MM"></label>' +
      '<label class="mry-f mry-f-wide"><span>Anything we should know?</span><textarea name="message" rows="2" maxlength="2000" placeholder="Dates, experience, dietary needs…"></textarea></label>' +
      '<label class="mry-hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>' +
      '<p class="mry-form-err" role="alert" hidden></p>' +
      '<div class="mry-form-foot"><button type="submit" class="mry-act is-primary">Send inquiry' + ARROW + '</button>' +
      '<a class="mry-act is-wa" href="' + esc(waLink('Hello Himalayan Magic — I would like to plan a trip.')) + '" target="_blank" rel="noopener">' + ICON.wa + 'WhatsApp instead</a></div>' +
      '<p class="mry-form-fine">Goes straight to the expedition desk with the questions you asked me, so they have context. No account needed.</p></form>';
  }

  function renderBlocks(blocks, msgId) {
    return (blocks || []).map(function (b, bi) {
      var it;
      switch (b.t) {
        case 'h': return '<h3 class="mry-h">' + esc(b.text) + '</h3>';
        case 'kicker': return '<p class="mry-kick">' + esc(b.text) + '</p>';
        case 'meta': return b.text ? '<p class="mry-meta">' + esc(b.text) + '</p>' : '';
        case 'p': return '<p>' + md(b.text) + '</p>';
        case 'list': return '<ul class="mry-list is-' + (b.mark || 'dot') + '">' + (b.items || []).map(function (x) { return '<li>' + md(x) + '</li>'; }).join('') + '</ul>';
        case 'cards': {
          var items = (b.items || []).map(item).filter(Boolean);
          if (!items.length) return '';
          return '<div class="mry-rail' + (items.length === 1 ? ' is-single' : '') + '">' + items.map(function (x) { return cardHtml(x, b.notes && b.notes[ref(x)]); }).join('') + '</div>';
        }
        case 'stories': {
          var st = (b.items || []).map(function (s) { return KB.stories.filter(function (x) { return x.slug === s; })[0]; }).filter(Boolean);
          return '<div class="mry-stories">' + st.map(function (s) {
            var img = safeImg(s.image);
            return '<a class="mry-story" href="' + esc(safeHref(s.url) || '#') + '" data-mry-nav>' + (img ? '<img src="' + esc(img) + '" alt="" loading="lazy">' : '<img alt="" class="is-empty">') +
              '<span><em>' + esc([s.category, s.author].filter(Boolean).join(' · ')) + '</em><b>' + esc(s.title) + '</b>' + (s.excerpt ? '<small>' + esc(sentences(s.excerpt, 1)) + '</small>' : '') + '</span></a>';
          }).join('') + '</div>';
        }
        case 'compare': { var a = item(b.refs[0]), c = item(b.refs[1]); return a && c ? compareHtml(a, c) : ''; }
        case 'prices': {
          it = item(b.ref); if (!it || !it.pricing) return '';
          return '<div class="mry-prices">' + it.pricing.tiers.map(function (t) {
            return '<div class="mry-tier"><div class="mry-tier-top"><span>' + esc(t.name) + '</span><b>' + esc(t.range) + '</b></div>' +
              (t.includes && t.includes.length ? '<ul class="mry-list is-check">' + t.includes.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') + '</div>';
          }).join('') + '</div>' + (it.pricing.note && !b.compact ? '<p class="mry-fine">' + esc(it.pricing.note) + '</p>' : '');
        }
        case 'itinerary': {
          it = item(b.ref); if (!it) return '';
          return profileSvg(it.itinerary) + '<ol class="mry-itin">' + it.itinerary.map(function (d) {
            return '<li><span class="mry-itin-day">' + esc(d.day) + '</span><span class="mry-itin-t">' + esc(d.title || '') + '</span>' +
              (d.ele ? '<span class="mry-itin-e">' + d.ele.toLocaleString('en-US') + ' m</span>' : '') + '</li>';
          }).join('') + '</ol>';
        }
        case 'profile': it = item(b.ref); return it ? profileSvg(it.itinerary) : '';
        case 'months': it = item(b.ref); return it ? monthsHtml(it) : '';
        case 'bars': {
          it = item(b.ref); if (!it) return ''; var s = it.suitability || {};
          return '<div class="mry-bars">' + barRow('Physical', s.physical) + barRow('Technical', s.technical) + barRow('Altitude', s.altitude) + barRow('Remoteness', s.remoteness) + '</div>';
        }
        case 'actions': return '<div class="mry-acts">' + (b.items || []).map(function (a) { return actionHtml(a); }).join('') + '</div>';
        case 'choices': return '<div class="mry-choices">' + (b.items || []).map(function (a) { return actionHtml(a, 'mry-choice'); }).join('') + '</div>';
        case 'menu': return '<div class="mry-menu">' + (b.items || []).map(function (a, i) {
          return '<button type="button" class="mry-menu-item" data-mry-do="' + esc(a.value) + '" data-mry-label="' + esc(a.label) + '"><span>0' + (i + 1) + '</span>' + esc(a.label) + ARROW + '</button>';
        }).join('') + '</div>';
        case 'form': return formHtml(b.ref, msgId + '-' + bi);
        case 'done': return '<div class="mry-done"><span class="mry-kick">Inquiry received</span><b>' + esc(b.ref) + '</b><p>' + esc(b.message) + '</p></div>';
      }
      return '';
    }).join('');
  }

  /* ============================================================ UI SHELL */
  var CSS = [
    /* ---- launcher: one round medallion on every screen — the yeti on an orange ring with an
       "ASK" tab. Hover / focus / open fills it orange; on pointer devices a label slides out
       to the left without taking any layout space. */
    '#mry-launch{--mry-acc:var(--accent,#f06225);--mry-ink:#14161a;position:relative;display:inline-flex;align-items:center;justify-content:center;',
      'width:4.6rem;height:4.6rem;padding:0;border-radius:50%;border:2px solid var(--mry-acc);background:var(--card,#20232a);color:var(--foreground,#f3f4f6);',
      'cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:0 18px 38px -16px rgba(0,0,0,.85),0 0 0 4px color-mix(in srgb,var(--mry-acc) 12%,transparent);',
      'transition:background-color .3s ease,box-shadow .35s ease,transform .35s cubic-bezier(.2,.7,.2,1)}',
    '#mry-launch .mry-l-av{position:relative;flex:none;width:4.05rem;height:4.05rem;border-radius:50%;padding:2px;background:transparent;transition:background-color .3s ease}',
    '#mry-launch .mry-l-av img{display:block;width:100%;height:100%;border-radius:50%;object-fit:cover;background:#e8f2f7;transition:transform .45s cubic-bezier(.2,.7,.2,1)}',
    '#mry-launch .mry-l-av::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:2px solid var(--mry-acc);opacity:0;pointer-events:none;animation:mry-halo 2.6s ease-out 1.4s 3}',
    '@keyframes mry-halo{0%{transform:scale(1);opacity:.75}100%{transform:scale(1.55);opacity:0}}',
    '#mry-launch .mry-l-dot{position:absolute;right:0;top:2px;width:13px;height:13px;border-radius:50%;background:#3fb27f;box-shadow:0 0 0 2px var(--card,#20232a);transition:box-shadow .3s ease}',
    '#mry-launch .mry-l-tag{position:absolute;left:50%;bottom:-.65rem;transform:translateX(-50%);padding:.28rem .55rem .24rem;border-radius:999px;background:var(--mry-acc);color:var(--mry-ink);',
      'font:700 9px/1 "IBM Plex Mono",ui-monospace,monospace;letter-spacing:.18em;text-transform:uppercase;box-shadow:0 0 0 2px var(--background,#16181b);transition:background-color .3s ease,color .3s ease}',
    '#mry-launch .mry-l-arrow{display:none}',
    /* the slide-out label (pointer devices only) */
    '#mry-launch .mry-l-txt{position:absolute;right:calc(100% + .8rem);top:50%;display:flex;flex-direction:column;align-items:flex-end;gap:.32rem;padding:.6rem .85rem;',
      'border:1px solid var(--border,#33373e);background:var(--card,#20232a);color:var(--foreground,#f3f4f6);white-space:nowrap;pointer-events:none;',
      'opacity:0;transform:translate(8px,-50%);transition:opacity .25s ease,transform .35s cubic-bezier(.2,.7,.2,1);box-shadow:0 16px 36px -18px rgba(0,0,0,.8)}',
    '#mry-launch .mry-l-txt::after{content:"";position:absolute;right:-5px;top:50%;width:8px;height:8px;margin-top:-4px;background:inherit;border-top:1px solid var(--border,#33373e);border-right:1px solid var(--border,#33373e);transform:rotate(45deg)}',
    '#mry-launch .mry-l-name{font:500 14px/1 Oswald,"Arial Narrow",sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--mry-acc)}',
    '#mry-launch .mry-l-sub{font:500 8.5px/1 "IBM Plex Mono",ui-monospace,monospace;letter-spacing:.18em;text-transform:uppercase;color:var(--muted-foreground,#9ca3af)}',
    '@media (hover:hover){',
      '#mry-launch:hover{background:var(--mry-acc);transform:translateY(-2px);box-shadow:0 22px 44px -16px color-mix(in srgb,var(--mry-acc) 75%,transparent),0 0 0 5px color-mix(in srgb,var(--mry-acc) 18%,transparent)}',
      '#mry-launch:hover .mry-l-av img{transform:scale(1.06) rotate(-6deg)}',
      '#mry-launch:hover .mry-l-tag{background:var(--mry-ink);color:var(--mry-acc)}',
      '#mry-launch:hover .mry-l-dot{box-shadow:0 0 0 2px var(--mry-acc)}',
      '#mry-launch:hover:not([aria-expanded="true"]) .mry-l-txt,#mry-launch:focus-visible:not([aria-expanded="true"]) .mry-l-txt{opacity:1;transform:translate(0,-50%)}',
    '}',
    '#mry-launch:is(:focus-visible,:active,[aria-expanded="true"]){background:var(--mry-acc);box-shadow:0 22px 44px -16px color-mix(in srgb,var(--mry-acc) 75%,transparent),0 0 0 5px color-mix(in srgb,var(--mry-acc) 18%,transparent)}',
    '#mry-launch:focus-visible{outline:2px solid var(--foreground,#f3f4f6);outline-offset:4px}',
    '#mry-launch:is(:focus-visible,:active,[aria-expanded="true"]) .mry-l-tag{background:var(--mry-ink);color:var(--mry-acc)}',
    '#mry-launch:is(:focus-visible,:active,[aria-expanded="true"]) .mry-l-dot{box-shadow:0 0 0 2px var(--mry-acc)}',
    '#mry-dock{position:fixed;right:1.5rem;bottom:1.5rem;z-index:50;transition:bottom .35s cubic-bezier(.2,.7,.2,1)}',
    '@media (max-width:640px){#mry-launch{width:4.5rem;height:4.5rem}#mry-launch .mry-l-av{width:3.95rem;height:3.95rem}#mry-launch .mry-l-txt{display:none}}',
    '#mry-panel{--mry-bg:var(--background,#16181b);--mry-card:var(--card,#20232a);--mry-line:var(--border,#33373e);--mry-fg:var(--foreground,#f3f4f6);',
    '--mry-mute:var(--muted-foreground,#9ca3af);--mry-acc:var(--accent,#f06225);--mry-soft:var(--muted,#272b32);',
    'position:fixed;right:1.5rem;bottom:6.9rem;z-index:58;width:min(452px,calc(100vw - 3rem));height:min(720px,calc(100vh - 15.1rem));',
    'display:flex;flex-direction:column;background:var(--mry-bg);color:var(--mry-fg);border:1px solid var(--mry-line);border-radius:3px;',
    'box-shadow:0 40px 90px -30px rgba(0,0,0,.85),0 0 0 1px rgba(0,0,0,.2);font:400 14px/1.6 "IBM Plex Sans",system-ui,sans-serif;',
    'opacity:0;transform:translateY(14px);visibility:hidden;transition:opacity .28s ease,transform .38s cubic-bezier(.2,.7,.2,1),visibility 0s linear .38s}',
    '#mry-panel.is-open{opacity:1;transform:none;visibility:visible;transition:opacity .28s ease,transform .38s cubic-bezier(.2,.7,.2,1),visibility 0s}',
    '#mry-panel::before,#mry-panel::after{content:"";position:absolute;width:11px;height:11px;border-color:var(--mry-acc);pointer-events:none;z-index:3}',
    '#mry-panel::before{top:-1px;left:-1px;border-top:1px solid;border-left:1px solid}#mry-panel::after{bottom:-1px;right:-1px;border-bottom:1px solid;border-right:1px solid}',
    '#mry-panel *{box-sizing:border-box}',

    '.mry-head{position:relative;flex:none;display:flex;align-items:center;gap:.85rem;padding:1rem 1rem .95rem 1.1rem;border-bottom:1px solid var(--mry-line);overflow:hidden}',
    '.mry-topo{position:absolute;inset:0;width:100%;height:100%;color:var(--mry-fg);opacity:.07;pointer-events:none}',
    '.mry-head img{position:relative;width:2.6rem;height:2.6rem;border-radius:50%;object-fit:cover;background:#e8f2f7;flex:none;box-shadow:0 0 0 1px var(--mry-line)}',
    '.mry-head-id{position:relative;flex:1;min-width:0}',
    '.mry-name{margin:0;font:500 1.3rem/1 Oswald,"Arial Narrow",sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--mry-fg)}',
    '.mry-sub{margin:.35rem 0 0;font:500 9px/1.2 "IBM Plex Mono",monospace;letter-spacing:.22em;text-transform:uppercase;color:var(--mry-mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.mry-status{position:relative;display:flex;align-items:center;gap:.7rem;margin:.4rem 0 0;font:500 9px/1 "IBM Plex Mono",monospace;letter-spacing:.18em;text-transform:uppercase;color:var(--mry-mute);white-space:nowrap}',
    '.mry-status b{font-weight:500;color:#3fb27f}.mry-status b::before{content:"";display:inline-block;width:6px;height:6px;border-radius:50%;background:currentColor;margin-right:.4rem;vertical-align:1px}',
    '.mry-icon{position:relative;flex:none;display:inline-flex;align-items:center;justify-content:center;width:2.1rem;height:2.1rem;border:1px solid transparent;border-radius:2px;background:none;color:var(--mry-mute);cursor:pointer}',
    '.mry-icon:hover,.mry-icon:focus-visible{color:var(--mry-fg);border-color:var(--mry-line);outline:none}.mry-icon svg{width:17px;height:17px}',

    '.mry-log{position:relative;flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:1.2rem 1.1rem .6rem;scroll-behavior:smooth;scrollbar-width:thin;scrollbar-color:var(--mry-line) transparent}',
    '.mry-msg{margin:0 0 1.35rem;animation:mry-in .35s ease both}',
    '@keyframes mry-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}',
    '.mry-by{display:flex;align-items:center;gap:.5rem;margin:0 0 .5rem;font:500 9px/1 "IBM Plex Mono",monospace;letter-spacing:.2em;text-transform:uppercase;color:var(--mry-mute)}',
    '.mry-by::before{content:"";width:14px;height:1px;background:var(--mry-acc)}',
    '.mry-msg p{margin:0 0 .6rem}.mry-msg strong{color:var(--mry-fg);font-weight:600}',
    '.mry-user{display:flex;justify-content:flex-end}',
    '.mry-user span{max-width:85%;padding:.55rem .85rem;border:1px solid var(--mry-line);border-radius:2px;background:var(--mry-soft);color:var(--mry-fg);font-size:13.5px;white-space:pre-wrap;word-break:break-word}',
    '.mry-h{margin:.1rem 0 .35rem;font:500 1.2rem/1.15 Oswald,"Arial Narrow",sans-serif;letter-spacing:.03em;text-transform:uppercase;color:var(--mry-fg)}',
    '.mry-kick{margin:0 0 .3rem!important;font:500 9.5px/1.3 "IBM Plex Mono",monospace;letter-spacing:.18em;text-transform:uppercase;color:var(--mry-acc)}',
    '.mry-meta{margin:0 0 .7rem!important;font:500 10.5px/1.4 "IBM Plex Mono",monospace;letter-spacing:.14em;color:var(--mry-acc)}',
    '.mry-fine{font-size:11.5px;color:var(--mry-mute)}',
    '.mry-list{list-style:none;margin:0 0 .75rem;padding:0}.mry-list li{position:relative;padding:0 0 0 1.3rem;margin:0 0 .3rem;font-size:13.5px}',
    '.mry-list li::before{position:absolute;left:0;top:0;font:500 12px/1.6 "IBM Plex Mono",monospace}',
    '.mry-list.is-check li::before{content:"\\2713";color:#3fb27f}.mry-list.is-x li::before{content:"\\00d7";color:var(--mry-mute);font-size:14px}.mry-list.is-dot li::before{content:"\\2014";color:var(--mry-acc)}',

    '.mry-rail{display:flex;gap:.7rem;overflow-x:auto;scroll-snap-type:x mandatory;margin:.35rem -1.1rem .8rem;padding:0 1.1rem .35rem;scrollbar-width:thin;scrollbar-color:var(--mry-line) transparent}',
    '.mry-card{flex:0 0 15.5rem;scroll-snap-align:start;display:flex;flex-direction:column;border:1px solid var(--mry-line);border-radius:2px;background:var(--mry-card);color:var(--mry-fg);text-decoration:none;overflow:hidden;transition:border-color .2s}',
    '.mry-rail.is-single .mry-card{flex-basis:100%}',
    '.mry-card:hover,.mry-card:focus-visible{border-color:var(--mry-acc);outline:none}',
    '.mry-card-media{position:relative;display:block;aspect-ratio:16/9;overflow:hidden;background:var(--mry-soft)}',
    '.mry-card-media img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s cubic-bezier(.2,.7,.2,1)}',
    '.mry-card:hover .mry-card-media img{transform:scale(1.05)}',
    '.mry-card-media::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(10,11,13,.75),transparent 55%)}',
    'img.is-empty{visibility:hidden}.mry-card-media:has(img.is-empty){background:repeating-linear-gradient(135deg,var(--mry-soft) 0 10px,var(--mry-card) 10px 11px)}',
    '.mry-card-kicker{position:absolute;left:.75rem;right:.75rem;bottom:.6rem;z-index:1;font:500 9px/1.3 "IBM Plex Mono",monospace;letter-spacing:.18em;text-transform:uppercase;color:#e9eaec;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.mry-card-body{display:flex;flex-direction:column;gap:.55rem;padding:.8rem .8rem .85rem}',
    '.mry-card-title{font:500 1.02rem/1.15 Oswald,"Arial Narrow",sans-serif;letter-spacing:.04em;text-transform:uppercase}',
    '.mry-card-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1px solid var(--mry-line);border-bottom:1px solid var(--mry-line)}',
    '.mry-card-stats span{display:flex;flex-direction:column;gap:.2rem;padding:.45rem .5rem .45rem 0;min-width:0}.mry-card-stats span+span{padding-left:.55rem;border-left:1px solid var(--mry-line)}',
    '.mry-card-stats em,.mry-card-season em{font:500 8.5px/1 "IBM Plex Mono",monospace;font-style:normal;letter-spacing:.18em;text-transform:uppercase;color:var(--mry-mute)}',
    '.mry-card-stats b{font:500 11.5px/1.25 "IBM Plex Mono",monospace;color:var(--mry-fg);overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}',
    '.mry-card-season{font:500 10.5px/1.4 "IBM Plex Mono",monospace;letter-spacing:.06em;color:var(--mry-fg)}.mry-card-season em{margin-right:.35rem}',
    '.mry-card-note{font-size:12px;color:var(--mry-mute)}',
    '.mry-card-cta,.mry-act,.mry-choice{display:inline-flex;align-items:center;gap:.45rem;font:600 10px/1 "IBM Plex Mono",monospace;letter-spacing:.16em;text-transform:uppercase}',
    '.mry-card-cta{color:var(--mry-acc);margin-top:.1rem}',
    '.mry-card-cta svg,.mry-act svg,.mry-choice svg,.mry-menu-item svg{width:13px;height:13px;flex:none;transition:transform .25s}',
    '.mry-card:hover .mry-card-cta svg,.mry-act:hover svg,.mry-choice:hover svg,.mry-menu-item:hover svg{transform:translateX(3px)}',

    '.mry-acts{display:flex;flex-wrap:wrap;gap:.45rem;margin:.55rem 0 .2rem}',
    '.mry-act{min-height:2.35rem;padding:0 .85rem;border:1px solid var(--mry-line);border-radius:2px;background:transparent;color:var(--mry-fg);text-decoration:none;cursor:pointer;transition:border-color .2s,color .2s,background .2s}',
    '.mry-act:hover,.mry-act:focus-visible{border-color:var(--mry-acc);color:var(--mry-acc);outline:none}',
    '.mry-act.is-primary{background:var(--mry-acc);border-color:var(--mry-acc);color:#14161a}.mry-act.is-primary:hover{background:transparent;color:var(--mry-acc)}',
    '.mry-act.is-wa svg,.mry-choice.is-wa svg{width:15px;height:15px;transform:none!important}',
    '.mry-choices{display:flex;flex-direction:column;gap:.4rem;margin:.4rem 0 .3rem}',
    '.mry-choice{justify-content:space-between;min-height:2.6rem;padding:0 .9rem;border:1px solid var(--mry-line);border-radius:2px;background:var(--mry-card);color:var(--mry-fg);cursor:pointer;text-align:left;text-decoration:none;line-height:1.35}',
    '.mry-choice:hover,.mry-choice:focus-visible{border-color:var(--mry-acc);outline:none}',
    '.mry-menu{display:grid;margin:.9rem 0 .2rem;border-top:1px solid var(--mry-line)}',
    '.mry-menu-item{display:flex;align-items:center;gap:.9rem;min-height:3rem;padding:0 .2rem;border:0;border-bottom:1px solid var(--mry-line);background:none;color:var(--mry-fg);cursor:pointer;text-align:left;',
    'font:500 1rem/1 Oswald,"Arial Narrow",sans-serif;letter-spacing:.08em;text-transform:uppercase;transition:color .2s,padding .25s}',
    '.mry-menu-item span{font:500 9.5px/1 "IBM Plex Mono",monospace;letter-spacing:.14em;color:var(--mry-mute)}.mry-menu-item svg{margin-left:auto;color:var(--mry-mute)}',
    '.mry-menu-item:hover,.mry-menu-item:focus-visible{color:var(--mry-acc);padding-left:.55rem;outline:none}.mry-menu-item:hover svg{color:var(--mry-acc)}',

    '.mry-compare{margin:.4rem 0 .6rem;border:1px solid var(--mry-line);border-radius:2px;font-size:12.5px}',
    '.mry-cmp-head,.mry-cmp-row{display:grid;grid-template-columns:5.8rem minmax(0,1fr) minmax(0,1fr)}',
    '.mry-cmp-head span{padding:.6rem .6rem;font:500 .85rem/1.15 Oswald,"Arial Narrow",sans-serif;letter-spacing:.04em;text-transform:uppercase;color:var(--mry-fg);border-bottom:1px solid var(--mry-line)}',
    '.mry-cmp-head span+span,.mry-cmp-row span+span{border-left:1px solid var(--mry-line)}',
    '.mry-cmp-row span{padding:.45rem .6rem;line-height:1.4}.mry-cmp-row+.mry-cmp-row span{border-top:1px solid color-mix(in srgb,var(--mry-line) 60%,transparent)}',
    '.mry-cmp-row span:first-child{font:500 8.5px/1.6 "IBM Plex Mono",monospace;letter-spacing:.16em;text-transform:uppercase;color:var(--mry-mute)}',
    '.mry-mini{display:inline-block;width:2.6rem;height:3px;margin-right:.4rem;vertical-align:middle;background:var(--mry-soft)}.mry-mini s{display:block;height:100%;background:var(--mry-acc)}',
    '.mry-bars{display:grid;gap:.4rem;margin:.3rem 0 .8rem}',
    '.mry-bar{display:grid;grid-template-columns:6rem 1fr 2.6rem;align-items:center;gap:.6rem;font:500 9.5px/1 "IBM Plex Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--mry-mute)}',
    '.mry-bar i{height:4px;background:var(--mry-soft)}.mry-bar s{display:block;height:100%;background:var(--mry-acc)}.mry-bar b{font-weight:500;color:var(--mry-fg);text-align:right}',
    '.mry-prices{display:grid;gap:.5rem;margin:.3rem 0 .6rem}',
    '.mry-tier{padding:.7rem .8rem .35rem;border:1px solid var(--mry-line);border-radius:2px;background:var(--mry-card)}',
    '.mry-tier-top{display:flex;justify-content:space-between;align-items:baseline;gap:.8rem;margin-bottom:.5rem}',
    '.mry-tier-top span{font:500 9.5px/1.3 "IBM Plex Mono",monospace;letter-spacing:.16em;text-transform:uppercase;color:var(--mry-mute)}',
    '.mry-tier-top b{font:500 1.05rem/1 Oswald,"Arial Narrow",sans-serif;letter-spacing:.03em;color:var(--mry-fg);white-space:nowrap}',
    '.mry-tier .mry-list li{font-size:12.5px}',
    '.mry-profile{margin:.3rem 0 .6rem}.mry-profile svg{display:block;width:100%;height:64px}',
    '.mry-profile-fill{fill:color-mix(in srgb,var(--mry-acc) 14%,transparent)}.mry-profile-line{fill:none;stroke:var(--mry-acc);stroke-width:1.4;vector-effect:non-scaling-stroke}.mry-profile-dot{fill:var(--mry-acc)}',
    '.mry-profile figcaption{display:flex;justify-content:space-between;margin-top:.3rem;font:500 9px/1 "IBM Plex Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--mry-mute)}',
    '.mry-itin{list-style:none;margin:0 0 .7rem;padding:0;border-top:1px solid var(--mry-line)}',
    '.mry-itin li{display:grid;grid-template-columns:2rem 1fr auto;gap:.6rem;align-items:baseline;padding:.42rem 0;border-bottom:1px solid color-mix(in srgb,var(--mry-line) 70%,transparent);font-size:13px}',
    '.mry-itin-day{font:500 10px/1 "IBM Plex Mono",monospace;color:var(--mry-acc)}.mry-itin-day::before{content:"D"}',
    '.mry-itin-e{font:500 10.5px/1 "IBM Plex Mono",monospace;color:var(--mry-mute);white-space:nowrap}',
    '.mry-months{display:grid;grid-template-columns:repeat(12,1fr);gap:3px;margin:.3rem 0 .35rem}',
    '.mry-months span{padding:.4rem 0;text-align:center;font:500 10px/1 "IBM Plex Mono",monospace;color:var(--mry-mute);background:var(--mry-soft);border-radius:1px}',
    '.mry-months .is-on{background:var(--mry-acc);color:#14161a}.mry-months .is-edge{background:color-mix(in srgb,var(--mry-acc) 35%,var(--mry-soft));color:var(--mry-fg)}',
    '.mry-months-key{display:flex;align-items:center;gap:.4rem;margin:0 0 .6rem;font:500 9px/1 "IBM Plex Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--mry-mute)}',
    '.mry-months-key span{width:9px;height:9px;background:var(--mry-acc)}.mry-months-key span.is-edge{margin-left:.6rem;background:color-mix(in srgb,var(--mry-acc) 35%,var(--mry-soft))}',
    '.mry-stories{display:grid;gap:.5rem;margin:.3rem 0 .6rem}',
    '.mry-story{display:grid;grid-template-columns:4.6rem 1fr;gap:.75rem;padding:.5rem;border:1px solid var(--mry-line);border-radius:2px;background:var(--mry-card);color:var(--mry-fg);text-decoration:none}',
    '.mry-story:hover{border-color:var(--mry-acc)}.mry-story img{width:100%;height:4.2rem;object-fit:cover;background:var(--mry-soft)}',
    '.mry-story span{display:flex;flex-direction:column;gap:.25rem;min-width:0}.mry-story em{font:500 8.5px/1.2 "IBM Plex Mono",monospace;font-style:normal;letter-spacing:.16em;text-transform:uppercase;color:var(--mry-mute)}',
    '.mry-story b{font:500 .9rem/1.2 Oswald,"Arial Narrow",sans-serif;letter-spacing:.03em;text-transform:uppercase}.mry-story small{font-size:12px;color:var(--mry-mute);line-height:1.45}',

    '.mry-form{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin:.5rem 0 .3rem;padding:.9rem;border:1px solid var(--mry-line);border-radius:2px;background:var(--mry-card)}',
    '.mry-f{display:flex;flex-direction:column;gap:.35rem;grid-column:1/-1}.mry-f-half{grid-column:auto}',
    '.mry-f span{font:500 9px/1 "IBM Plex Mono",monospace;letter-spacing:.18em;text-transform:uppercase;color:var(--mry-mute)}',
    '.mry-f input,.mry-f select,.mry-f textarea{width:100%;min-height:2.5rem;padding:.5rem .65rem;border:1px solid var(--mry-line);border-radius:2px;background:var(--mry-bg);color:var(--mry-fg);font:400 16px/1.35 "IBM Plex Sans",system-ui,sans-serif}',
    '@media (min-width:641px){.mry-f input,.mry-f select,.mry-f textarea{font-size:13.5px}}',
    '.mry-f textarea{resize:vertical;min-height:3.4rem}.mry-f input:focus,.mry-f select:focus,.mry-f textarea:focus{outline:none;border-color:var(--mry-acc)}',
    '.mry-f.is-bad input,.mry-f.is-bad select{border-color:#e5484d}',
    '.mry-hp{position:absolute!important;left:-9999px;width:1px;height:1px;overflow:hidden}',
    '.mry-form-err{grid-column:1/-1;margin:0!important;font-size:12.5px;color:#ff8a8d}',
    '.mry-form-foot{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:.45rem;margin-top:.2rem}',
    '.mry-form-fine{grid-column:1/-1;margin:.1rem 0 0!important;font-size:11px;color:var(--mry-mute)}',
    '.mry-form[aria-busy="true"] button[type=submit]{opacity:.6;pointer-events:none}',
    '.mry-done{padding:.9rem;border:1px solid #3fb27f;border-radius:2px;background:color-mix(in srgb,#3fb27f 8%,var(--mry-card))}',
    '.mry-done b{display:block;margin:.2rem 0 .4rem;font:500 1.3rem/1 Oswald,"Arial Narrow",sans-serif;letter-spacing:.06em}.mry-done p{margin:0!important;font-size:13px}',

    '.mry-typing{display:flex;align-items:center;gap:.6rem;margin:0 0 1.2rem;font:500 9.5px/1 "IBM Plex Mono",monospace;letter-spacing:.18em;text-transform:uppercase;color:var(--mry-mute)}',
    '.mry-typing i{display:inline-flex;gap:3px}.mry-typing i b{width:4px;height:4px;border-radius:50%;background:var(--mry-acc);animation:mry-dot 1.1s infinite ease-in-out}',
    '.mry-typing i b:nth-child(2){animation-delay:.15s}.mry-typing i b:nth-child(3){animation-delay:.3s}',
    '@keyframes mry-dot{0%,80%,100%{opacity:.25}40%{opacity:1}}',

    '.mry-foot{flex:none;border-top:1px solid var(--mry-line);background:var(--mry-bg);padding:.55rem .75rem calc(.7rem + env(safe-area-inset-bottom,0px))}',
    '.mry-sugg{display:flex;gap:.4rem;overflow-x:auto;padding:0 0 .55rem;scrollbar-width:none}.mry-sugg::-webkit-scrollbar{display:none}',
    '.mry-sugg button{flex:none;min-height:2rem;padding:0 .75rem;border:1px solid var(--mry-line);border-radius:999px;background:transparent;color:var(--mry-mute);cursor:pointer;font:400 12px/1 "IBM Plex Sans",system-ui,sans-serif;white-space:nowrap;transition:color .2s,border-color .2s}',
    '.mry-sugg button:hover,.mry-sugg button:focus-visible{color:var(--mry-fg);border-color:var(--mry-acc);outline:none}',
    '.mry-input{display:flex;align-items:flex-end;gap:.5rem;border:1px solid var(--mry-line);border-radius:2px;background:var(--mry-card);padding:.25rem .25rem .25rem .8rem;transition:border-color .2s}',
    '.mry-input:focus-within{border-color:var(--mry-acc)}',
    '.mry-input textarea{flex:1;min-width:0;max-height:7.5rem;min-height:2.4rem;padding:.55rem 0;border:0;background:none;color:var(--mry-fg);resize:none;font:400 16px/1.4 "IBM Plex Sans",system-ui,sans-serif;outline:none}',
    '@media (min-width:641px){.mry-input textarea{font-size:14px}}',
    '.mry-input textarea::placeholder{color:var(--mry-mute)}',
    '.mry-send{flex:none;display:inline-flex;align-items:center;justify-content:center;width:2.4rem;height:2.4rem;border:0;border-radius:2px;background:var(--mry-acc);color:#14161a;cursor:pointer;transition:opacity .2s}',
    '.mry-send:disabled{opacity:.35;cursor:default}.mry-send svg{width:18px;height:18px}',
    '.mry-legal{margin:.45rem .1rem 0;font:400 10.5px/1.4 "IBM Plex Sans",system-ui,sans-serif;color:var(--mry-mute)}',
    '.mry-legal a{color:inherit;text-decoration:underline;text-underline-offset:2px}',

    '@media (max-width:640px){',
    '#mry-panel{inset:0 0 auto 0;top:var(--mry-vv-top,0px);width:100%;height:var(--mry-vv,100dvh);max-height:none;border:0;border-radius:0;z-index:70;box-shadow:none;transform:translateY(24px)}',
    '#mry-panel::before,#mry-panel::after{display:none}',
    '.mry-head{padding:.8rem .75rem .8rem 1rem}.mry-sub{letter-spacing:.12em}.mry-status{gap:.5rem;letter-spacing:.12em}',
    '.mry-log{padding:1.1rem 1rem .5rem}.mry-rail{margin:.35rem -1rem .8rem;padding:0 1rem .35rem}',
    '.mry-card{flex-basis:82%}.mry-cmp-head,.mry-cmp-row{grid-template-columns:4.9rem minmax(0,1fr) minmax(0,1fr)}}',
    'html.mry-lock,html.mry-lock body{overflow:hidden!important}',
    '@media (prefers-reduced-motion:reduce){#mry-panel,#mry-panel *,#mry-launch,#mry-dock{animation:none!important;transition:none!important}}',
    'body.light-mode #mry-panel .mry-card-media::after{background:linear-gradient(to top,rgba(10,11,13,.7),transparent 55%)}'
  ].join('');

  /* ------------------------------------------------------------- state */
  var state = { msgs: [], ctx: { focus: null, plan: null } };
  function load() {
    try {
      var s = JSON.parse(sessionStorage.getItem(CFG.store) || 'null');
      if (s && Array.isArray(s.msgs)) state = { msgs: s.msgs.slice(-CFG.maxMessages), ctx: s.ctx || { focus: null, plan: null } };
    } catch (e) { /* storage blocked — the chat still works for this page */ }
  }
  function save() {
    try { sessionStorage.setItem(CFG.store, JSON.stringify({ msgs: state.msgs.slice(-CFG.maxMessages), ctx: state.ctx })); } catch (e) { /* ignore */ }
  }

  var els = {}, isOpen = false, busy = false, seq = 0;

  function build() {
    var style = document.createElement('style');
    style.id = 'mry-style';
    style.textContent = CSS;
    document.head.appendChild(style);

    var launch = document.createElement('button');
    launch.id = 'mry-launch';
    launch.type = 'button';
    launch.setAttribute('aria-expanded', 'false');
    launch.setAttribute('aria-controls', 'mry-panel');
    launch.setAttribute('aria-label', 'Ask Mr Yeti — Himalayan expedition assistant');
    launch.innerHTML = '<span class="mry-l-av"><img src="' + CFG.avatar2x + '" alt="" width="48" height="48"><span class="mry-l-dot" aria-hidden="true"></span></span>' +
      '<span class="mry-l-txt"><span class="mry-l-name">Ask Mr Yeti</span><span class="mry-l-sub">I\u2019ve been everywhere</span></span>' +
      '<span class="mry-l-arrow" aria-hidden="true">' + ARROW + '</span><span class="mry-l-tag" aria-hidden="true">Ask</span>';

    // Join the existing bottom-right theme / language cluster when the page has one.
    var cluster = document.querySelector('.fixed.bottom-6.right-6');
    if (cluster) cluster.insertBefore(launch, cluster.firstChild);
    else {
      var dock = document.createElement('div');
      dock.id = 'mry-dock';
      dock.appendChild(launch);
      document.body.appendChild(dock);
      els.dock = dock;
    }

    var panel = document.createElement('section');
    panel.id = 'mry-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-labelledby', 'mry-title');
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML =
      '<header class="mry-head">' + TOPO +
        '<img src="' + CFG.avatar + '" srcset="' + CFG.avatar + ' 1x, ' + CFG.avatar2x + ' 2x" alt="" width="42" height="42">' +
        '<div class="mry-head-id"><h2 class="mry-name" id="mry-title">Mr Yeti</h2><p class="mry-sub">Himalayan expedition assistant</p>' +
        '<p class="mry-status"><b>Online</b><span>' + esc(CFG.coords) + '</span></p></div>' +
        '<button type="button" class="mry-icon" data-mry-restart aria-label="Restart conversation" title="Restart conversation">' + ICON.restart + '</button>' +
        '<button type="button" class="mry-icon" data-mry-close aria-label="Close Mr Yeti" title="Close">' + ICON.close + '</button>' +
      '</header>' +
      '<div class="mry-log" aria-live="polite" aria-relevant="additions"></div>' +
      '<div class="mry-foot"><div class="mry-sugg" aria-label="Suggested questions"></div>' +
        '<form class="mry-input"><label for="mry-q" class="mry-hp">Ask Mr Yeti</label>' +
        '<textarea id="mry-q" rows="1" maxlength="500" placeholder="Ask about a trek, season, price…" enterkeyhint="send"></textarea>' +
        '<button type="submit" class="mry-send" aria-label="Send" disabled>' + ICON.send + '</button></form>' +
        '<p class="mry-legal">Answers come from this site’s route library. Prices are indicative — the desk confirms. <a href="https://wa.me/' + CFG.whatsapp + '" target="_blank" rel="noopener">Talk to a person</a></p>' +
      '</div>';
    document.body.appendChild(panel);

    els.launch = launch;
    els.panel = panel;
    els.log = panel.querySelector('.mry-log');
    els.sugg = panel.querySelector('.mry-sugg');
    els.form = panel.querySelector('.mry-input');
    els.q = panel.querySelector('#mry-q');
    els.send = panel.querySelector('.mry-send');

    launch.addEventListener('click', function () { isOpen ? close() : open(); });
    panel.querySelector('[data-mry-close]').addEventListener('click', function () { close(); });
    panel.querySelector('[data-mry-restart]').addEventListener('click', restart);
    els.form.addEventListener('submit', function (e) { e.preventDefault(); ask(els.q.value); });
    els.q.addEventListener('input', autosize);
    els.q.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); ask(els.q.value); }
    });
    panel.addEventListener('click', onPanelClick);
    panel.addEventListener('submit', onInquirySubmit, true);
    panel.addEventListener('error', function (e) { if (e.target && e.target.tagName === 'IMG') placeholder(e.target); }, true);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) close(); });

    if (els.dock) {
      var tick = false;
      var place = function () {
        tick = false;
        var d = document.querySelector('.hmb-dock.is-visible');
        els.dock.style.bottom = d ? (d.getBoundingClientRect().height + 14) + 'px' : '';
        if (isOpen && window.innerWidth > 640) els.panel.style.bottom = d ? (d.getBoundingClientRect().height + 100) + 'px' : '';
      };
      var req = function () { if (!tick) { tick = true; requestAnimationFrame(place); } };
      window.addEventListener('scroll', req, { passive: true });
      window.addEventListener('resize', req);
      setTimeout(place, 800);
    }
    if (window.visualViewport) {
      var vv = function () {
        els.panel.style.setProperty('--mry-vv', window.visualViewport.height + 'px');
        els.panel.style.setProperty('--mry-vv-top', window.visualViewport.offsetTop + 'px');
      };
      window.visualViewport.addEventListener('resize', vv);
      window.visualViewport.addEventListener('scroll', vv);
      vv();
    }
  }

  function autosize() {
    els.q.style.height = 'auto';
    els.q.style.height = Math.min(els.q.scrollHeight, 120) + 'px';
    els.send.disabled = !els.q.value.trim() || busy;
  }

  function isPhone() { return window.matchMedia('(max-width:640px)').matches; }

  function open() {
    if (isOpen) return;
    isOpen = true;
    els.panel.classList.add('is-open');
    els.panel.setAttribute('aria-hidden', 'false');
    els.launch.setAttribute('aria-expanded', 'true');
    if (isPhone()) document.documentElement.classList.add('mry-lock');
    if (!els.log.childNodes.length) boot();
    setTimeout(function () { if (!isPhone()) els.q.focus({ preventScroll: true }); scrollEnd(); }, 60);
  }
  function close() {
    if (!isOpen) return;
    isOpen = false;
    els.panel.classList.remove('is-open');
    els.panel.setAttribute('aria-hidden', 'true');
    els.launch.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('mry-lock');
    if (els.panel.contains(document.activeElement)) els.launch.focus({ preventScroll: true });
  }

  function scrollEnd() {
    els.log.style.scrollBehavior = 'auto';
    els.log.scrollTop = els.log.scrollHeight;
    requestAnimationFrame(function () { els.log.style.scrollBehavior = ''; });
  }

  function typing(on) {
    var t = els.log.querySelector('.mry-typing');
    if (on && !t) {
      t = document.createElement('div');
      t.className = 'mry-typing';
      t.innerHTML = '<i><b></b><b></b><b></b></i>Checking the route library';
      els.log.appendChild(t);
      scrollEnd();
    } else if (!on && t) t.remove();
  }

  function drawMsg(m) {
    var el = document.createElement('div');
    if (m.who === 'user') {
      el.className = 'mry-msg mry-user';
      el.innerHTML = '<span>' + esc(m.text) + '</span>';
    } else {
      el.className = 'mry-msg mry-bot';
      el.dataset.id = m.id;
      el.innerHTML = '<p class="mry-by">Mr Yeti</p>' + renderBlocks(m.blocks, m.id);
    }
    els.log.appendChild(el);
    return el;
  }

  function setSuggest(list) {
    els.sugg.innerHTML = (list || []).slice(0, 6).map(function (s) { return '<button type="button" data-mry-ask="' + esc(s) + '">' + esc(s) + '</button>'; }).join('');
    els.sugg.scrollLeft = 0;
  }

  function botSay(res) {
    if (!res) return;
    var m = { who: 'bot', id: 'm' + Date.now().toString(36) + (seq++), blocks: res.blocks || [] };
    state.msgs.push(m);
    if (res.focus !== undefined) state.ctx.focus = res.focus || null;
    if (res.plan !== undefined) state.ctx.plan = res.plan;
    save();
    var el = drawMsg(m);
    setSuggest(res.suggest);
    // Keep the start of a long answer in view rather than its end.
    els.log.scrollTop = Math.max(0, el.offsetTop - 12);
    if (res.focusInput) els.q.focus();
  }

  function boot() {
    load();
    els.log.innerHTML = '';
    typing(true);
    loadKB().then(function () {
      typing(false);
      if (state.msgs.length) {
        state.msgs.forEach(drawMsg);
        setSuggest(focusSuggest(state.ctx.focus && item(state.ctx.focus)));
        scrollEnd();
      } else botSay(welcome());
    }).catch(offline);
  }

  function offline() {
    typing(false);
    els.log.innerHTML = '';
    drawMsg({ who: 'bot', id: 'offline', blocks: [{ t: 'h', text: 'Namaste. I\u2019m Mr Yeti.' },
      p('I seem to have wandered out of signal range — I can\u2019t reach my route notes right now, and I won\u2019t guess. The team can answer you directly:'),
      actions([A.wa('Chat on WhatsApp', 'Hello Himalayan Magic — I have a question from your website.'), A.nav('Contact expedition desk', '/contact', true), A.nav('Browse treks', '/treks')])] });
    setSuggest([]);
  }

  function restart() {
    state = { msgs: [], ctx: { focus: null, plan: null } };
    save();
    els.log.innerHTML = '';
    if (!KB) return boot();
    botSay(welcome());
    els.log.scrollTop = 0;
  }

  function run(fn, userText) {
    if (busy) return;
    busy = true;
    if (userText) {
      var um = { who: 'user', text: userText };
      state.msgs.push(um);
      save();
      drawMsg(um);
    }
    setSuggest([]);
    typing(true);
    var started = Date.now();
    loadKB().then(function () {
      var res;
      try { res = fn(); } catch (err) { console.error('[mr-yeti]', err); res = handoff(); }
      var wait = Math.max(0, 380 - (Date.now() - started));
      setTimeout(function () {
        typing(false);
        busy = false;
        autosize();
        if (res && res.reset) return restart();
        botSay(res || handoff());
      }, wait);
    }).catch(function () { busy = false; offline(); });
  }

  function ask(text) {
    text = String(text || '').trim().slice(0, 500);
    if (!text || busy) return;
    els.q.value = '';
    autosize();
    run(function () { return Brain.respond(text, state.ctx); }, text);
  }

  function doCommand(cmd, label) {
    run(function () {
      var r = /^plan:(days|when):/.test(cmd) ? Brain.planCommand(cmd, state.ctx) : Brain.command(cmd, state.ctx);
      if (r && r.plan === undefined && !/^(style|plan)/.test(cmd)) r.plan = null;
      return r;
    }, label);
  }

  function onPanelClick(e) {
    var t = e.target.closest('[data-mry-do],[data-mry-ask],[data-mry-nav]');
    if (!t || !els.panel.contains(t)) return;
    if (t.hasAttribute('data-mry-ask')) { ask(t.getAttribute('data-mry-ask')); return; }
    if (t.hasAttribute('data-mry-do')) { doCommand(t.getAttribute('data-mry-do'), t.getAttribute('data-mry-label')); return; }
    // data-mry-nav: a normal same-origin link. The conversation is already saved, so
    // it is waiting when the next page loads. On phones, close first so the page shows.
    if (isPhone()) close();
  }

  /* ---- inquiry submission (phase 3) ------------------------------------- */
  function onInquirySubmit(e) {
    var f = e.target;
    if (!f.matches || !f.matches('form[data-mry-form]')) return;
    e.preventDefault();
    if (f.getAttribute('aria-busy') === 'true') return;
    var fd = new FormData(f), err = f.querySelector('.mry-form-err');
    var name = String(fd.get('name') || '').trim(), email = String(fd.get('email') || '').trim();
    var phone = String(fd.get('phone') || '').trim(), month = String(fd.get('month') || '').trim();
    var people = parseInt(fd.get('people'), 10) || 1, trip = item(String(fd.get('trip') || ''));
    f.querySelectorAll('.is-bad').forEach(function (x) { x.classList.remove('is-bad'); });
    var bad = [];
    if (name.length < 2) bad.push(['name', 'Please enter your name.']);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) bad.push(['email', 'Please enter a valid email address.']);
    if (month && !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) bad.push(['month', 'Please use the format YYYY-MM for the month.']);
    if (bad.length) return showErr(f, err, bad);

    var asked = state.msgs.filter(function (m) { return m.who === 'user'; }).slice(-4).map(function (m) { return m.text; }).join(' | ');
    var payload = {
      source: 'assistant', name: name, email: email, phone: phone || undefined, people: people,
      preferred_month: month || undefined,
      trip_slug: trip ? trip.slug : undefined, trip_type: trip ? (trip.kind === 'peak' ? 'expedition' : 'trek') : undefined,
      trip_name: trip ? trip.name : 'Custom / undecided (via Mr Yeti)',
      message: String(fd.get('message') || '').trim(),
      website: String(fd.get('website') || ''),
      details: { channel: 'Mr Yeti chat', page: location.pathname, asked: asked || undefined }
    };
    f.setAttribute('aria-busy', 'true');
    err.hidden = true;
    submitBooking(payload, f.__mryKey).then(function (r) {
      f.removeAttribute('aria-busy');
      f.__mryKey = r.key;
      if (!r.ok) {
        var fields = r.fields || {}, list = Object.keys(fields).map(function (k) { return [k === 'preferred_date' ? 'month' : k, fields[k]]; });
        return showErr(f, err, list.length ? list : [[null, r.message]]);
      }
      // Swap the form for the receipt in the saved history too.
      var host = f.closest('.mry-msg'), id = host && host.dataset.id;
      state.msgs.forEach(function (m) {
        if (m.id !== id) return;
        m.blocks = m.blocks.map(function (b) { return b.t === 'form' ? { t: 'done', ref: r.ref, message: r.message } : b; });
        m.blocks = m.blocks.filter(function (b) { return b.t !== 'p' || !/A few details/.test(b.text); });
      });
      save();
      f.outerHTML = renderBlocks([{ t: 'done', ref: r.ref, message: r.message }]);
      botSay({ blocks: [p('Want to speak with the team directly in the meantime?'), actions([A.wa('Chat on WhatsApp', 'Hello — my inquiry reference is ' + r.ref + '.')])], suggest: defaultSuggest() });
    });
  }
  function showErr(f, err, list) {
    list.forEach(function (x) { var el = x[0] && f.querySelector('[name="' + x[0] + '"]'); if (el) el.closest('.mry-f').classList.add('is-bad'); });
    err.textContent = list.map(function (x) { return x[1]; }).join(' ');
    err.hidden = false;
    var first = f.querySelector('.is-bad input,.is-bad select');
    if (first) first.focus();
  }
  function submitBooking(payload, key) {
    if (window.HMABooking && window.HMABooking.submit) return window.HMABooking.submit(payload, { key: key });
    key = key || (window.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));
    return fetch('/api/bookings', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'Idempotency-Key': key },
      body: JSON.stringify(Object.assign({ page_url: location.href }, payload))
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (j) {
        if (res.ok && j.status === 'success') return { ok: true, key: key, ref: j.ref, message: j.message };
        return { ok: false, key: key, message: j.message || 'Something went wrong. Please try again.', fields: j.fields || {} };
      });
    }).catch(function () { return { ok: false, key: key, message: 'Connection problem — try again, or message us on WhatsApp.', fields: {} }; });
  }

  /* ---- boot -------------------------------------------------------------- */
  function init() {
    build();
    // Warm the knowledge cache when the visitor shows intent, not on page load.
    ['pointerenter', 'focus', 'touchstart'].forEach(function (ev) {
      els.launch.addEventListener(ev, function () { loadKB().catch(function () {}); }, { once: true, passive: true });
    });
    // #ask-yeti in any link opens the desk.
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href="#ask-yeti"],[data-ask-yeti]');
      if (!a) return;
      e.preventDefault();
      open();
      var q = a.getAttribute('data-ask-yeti');
      if (q) setTimeout(function () { ask(q); }, 400);
    });
    if (location.hash === '#ask-yeti') open();
  }

  // Public surface: the page (or a future model-backed brain) can drive the desk.
  window.MrYeti = {
    open: function () { open(); }, close: function () { close(); },
    ask: function (q) { open(); setTimeout(function () { ask(q); }, 300); },
    brain: Brain,
    ready: function () { return loadKB(); }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
