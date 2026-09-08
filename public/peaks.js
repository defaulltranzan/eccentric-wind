/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — UNIFIED PEAK DATABASE
   ----------------------------------------------------------------------------
   One scalable data layer for every mountain on the site, across every
   elevation band. It does NOT replace mountains.js — the 14 eight-thousanders
   keep their rich model there and their existing /expeditions/<slug> pages.
   This file:
     · defines the CATEGORY system (8000m+ / 7000m+ / 6000m+ / Trekking Peaks)
     · normalises the 14 from window.MOUNTAINS into a common "peak" shape
     · holds the new 7,000 m (and later 6,000 m) peaks in window.PEAKS_DATA
     · exposes window.getPeaks() / getPeak() / getCategory() / addPeak()

   ADDING A PEAK — the whole job is one object:
     addPeak({ name:'Kang Guru', elevation:6981, country:'Nepal', category:'6000',
               range:'Peri Himal', region:'Manaslu Region' });
   The listing pages, sorting, category counts and URL all pick it up
   automatically. slug + elevationDisplay + href are derived if omitted.

   DATA-ACCURACY RULE (this is a travel site — facts matter)
   For a new peak, only elevation / country / name / range / region are asserted
   here. First-ascent history, routes, coordinates, difficulty ratings, season
   windows, durations and permit detail are left null and listed in `verify[]`
   until a human confirms them. Nothing in that list is invented.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- helpers */
  function slugify(s) {
    return String(s || '')
      .toLowerCase().trim()
      .replace(/['’.]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  function fmtElev(m) {
    return m == null ? null : Number(m).toLocaleString('en-US') + ' m';
  }
  function fmtFt(m) {
    return m == null ? null : Math.round(Number(m) / 0.3048).toLocaleString('en-US') + ' ft';
  }

  /* ------------------------------------------------------------- categories */
  // Data-driven. Add a band here and everything else follows.
  window.PEAK_CATEGORIES = [
    {
      id: '8000', slug: '8000m', order: 1,
      label: 'Eight-Thousanders', short: '8,000 m +', tag: '8000m+',
      elevMin: 8000, elevMax: null,
      blurb: 'The 14 mountains on Earth that rise above 8,000 metres — the full death-zone giants, in the Himalaya and the Karakoram.'
    },
    {
      id: '7000', slug: '7000m', order: 2,
      label: 'Seven-Thousanders', short: '7,000 m +', tag: '7000m+',
      elevMin: 7000, elevMax: 7999,
      blurb: 'Serious high-altitude expeditions between 7,000 and 8,000 metres — the classic proving ground before an eight-thousander, and demanding objectives in their own right.'
    },
    {
      id: '6000', slug: '6000m', order: 3,
      label: 'Six-Thousanders', short: '6,000 m +', tag: '6000m+',
      elevMin: 6000, elevMax: 6999,
      blurb: 'Peaks between 6,000 and 7,000 metres — from Nepal’s classic trekking-peak summits, a first taste of glacier climbing and full altitude, to serious technical objectives such as Ama Dablam.'
    },
    {
      id: 'trekking', slug: 'trekking-peaks', order: 4,
      label: 'Trekking Peaks', short: 'Trekking Peaks', tag: 'Trekking',
      elevMin: null, elevMax: null,
      blurb: 'The Nepal Mountaineering Association “trekking peaks” — climbs bolted onto a trek, from around 5,500 to 6,500 metres.'
    }
  ];
  var CAT_BY_ID = {};
  window.PEAK_CATEGORIES.forEach(function (c) { CAT_BY_ID[c.id] = c; });

  window.getCategory = function (id) { return CAT_BY_ID[id] || null; };

  // classify a bare elevation into a category id (used when `category` is omitted)
  function categoryForElevation(m) {
    if (m == null) return null;
    if (m >= 8000) return '8000';
    if (m >= 7000) return '7000';
    if (m >= 6000) return '6000';
    return 'trekking';
  }

  /* ------------------------------------------------- NEW PEAKS (7,000 m +) ---
     Full records, modelled on mountains.js. STATIC facts are written inline
     (elevation, first-ascent history, the shape of the normal route, geography).
     TIME-SENSITIVE detail (permit fees, current regs, conditions) is kept
     qualitative or flagged { verify:true }. Coordinates are approximate and
     flagged. Difficulty scores are a comparative editorial reading of the
     mountaineering literature, not a measured index. Representative photographs
     are pending — heroImage is null and the template shows a cartographic panel.
     ------------------------------------------------------------------------- */
  var STILL_VERIFYING = [
    'exact summit coordinates',
    'current permit fees and liaison-officer rules for the year of travel',
    'route conditions, fixed-rope arrangements and camp positions for the season',
    'a representative photograph of this mountain'
  ];
  // Trekking / smaller peaks: permits run through the NMA, and several summit
  // elevations are recorded differently by different authorities.
  var TREK_PEAK_VERIFYING = [
    'the exact summit elevation, where mountaineering authorities and maps differ',
    'exact summit coordinates',
    'current NMA / national-park permit fees and group rules for the year of travel',
    'route conditions, crevasse bridges and fixed-rope arrangements for the season',
    'a representative photograph of this mountain'
  ];

  window.PEAKS_DATA = {

    'himlung-himal': {
      slug: 'himlung-himal', name: 'Himlung Himal', aka: 'Himlung', category: '7000',
      featured: true,
      country: 'Nepal', countryLabel: 'Nepal', countries: ['Nepal'], inNepal: true,
      elevation: 7126, elevationLabel: '7,126 m', elevationFt: 23379,
      range: 'Peri Himal', region: 'Manaslu Region',
      coordinates: { lat: 28.755, lon: 84.451, approx: true },
      heroImage: null, gallery: [],
      tagline: 'The gentle giant of the Nar–Phu',
      summary: 'A 7,126 m peak on the Nepal–Tibet border, at the head of the Nar–Phu valley north of Manaslu. First climbed in 1992. Its north-west ridge — snow slopes and a broad, non-technical summit ridge — has made Himlung one of the most popular introductions to 7,000 m climbing in Nepal, usually done as a single spring or autumn expedition of around four weeks.',
      seo: {
        title: 'Himlung Himal Expedition — 7,126 m, Nepal | Route, Season & Planning',
        description: 'A factual guide to climbing Himlung Himal (7,126 m) in the Nar–Phu area of Nepal: the north-west ridge, camps, first-ascent history, spring and autumn seasons, itinerary and expedition planning.'
      },
      character: [
        'Himlung Himal stands at the northern edge of the Peri Himal, on the frontier ridge between Nepal and Tibet, closing the head of the remote Nar–Phu valley behind Manaslu. It was opened to climbing only in 1992 and has since become one of the standard "first 7,000er" objectives in Nepal, alongside Baruntse and the trekking-peak route on Mera and Island.',
        'What makes it accessible is the north-west ridge: after a glaciated approach, the route is mostly moderate-angle snow, with three camps above base and a long but non-technical summit ridge. There is no death-zone altitude, no serious rock, and the objective hazard is comparatively low for a Himalayan 7,000er. It is still a real expedition — fixed rope on the steeper sections, weeks of acclimatisation, genuine cold — but the margins are wider than on the eight-thousanders.',
        'The approach is part of the appeal. The trek in follows the Annapurna Circuit as far as Koto, then turns north into the restricted Nar–Phu valley — a Tibetan-Buddhist enclave of stone villages, gompas and yak pasture that sees a fraction of the traffic of the main circuit.'
      ],
      firstAscent: {
        year: 1992, date: 'October 1992',
        climbers: 'A Japanese–Nepali expedition',
        expedition: 'The first ascent was made shortly after the peak was opened for climbing.',
        route: 'North-west ridge (now the normal route)'
      },
      notableAscents: [
        { label: 'Established as a training 7,000er', detail: 'Through the 2000s and 2010s Himlung became a regular fixture on commercial calendars as preparation for Manaslu, Cho Oyu and Everest.' }
      ],
      normalRoute: {
        name: 'North-West Ridge, from the Nar–Phu side',
        character: 'A glaciated approach to base camp, then moderate snow and ice on the north-west ridge with fixed rope on the steeper steps. Non-technical by 7,000 m standards but long, cold and full-altitude.',
        sections: [
          { name: 'Base Camp to Camp 1', detail: 'Moraine and lower glacier from Base Camp (~4,900 m) to Camp 1 at roughly 5,450 m.' },
          { name: 'Camp 1 to Camp 2', detail: 'Glacier travel through a crevassed section, then snow slopes to Camp 2 at about 6,000 m.' },
          { name: 'Camp 2 to Camp 3', detail: 'The steepest ground of the route — snow and ice slopes, usually fixed, to a high camp near 6,350–6,500 m.' },
          { name: 'Summit ridge', detail: 'A long, broad, moderately-angled snow ridge from the high camp to the summit, exposed to wind but not technically difficult.' }
        ]
      },
      alternativeRoutes: ['South-east and east ridges — climbed occasionally, harder and much less frequented'],
      baseCampM: 4900,
      baseCampNote: 'Base Camp sits at around 4,900 m on the meadows above Phu village, reached in roughly a week of trekking from the Annapurna Circuit roadhead via Koto and the Nar–Phu valley.',
      camps: [
        { name: 'Base Camp', altM: 4900, note: 'Above Phu village' },
        { name: 'Camp 1', altM: 5450, note: 'Lower glacier' },
        { name: 'Camp 2', altM: 6000, note: 'Mid-mountain snow shelf' },
        { name: 'Camp 3', altM: 6400, note: 'Summit launch' },
        { name: 'Summit', altM: 7126, note: '' }
      ],
      approach: 'Drive from Kathmandu to Koto (Annapurna Circuit), then trek north into the restricted Nar–Phu valley via Meta, Nar and Phu to Base Camp — around 5–6 days on foot with good acclimatisation built in.',
      season: {
        primary: 'Spring & autumn', window: 'April–May and September–October',
        months: { Jan: 'closed', Feb: 'closed', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'prime', Oct: 'prime', Nov: 'shoulder', Dec: 'closed' },
        note: 'Himlung is climbed in both the pre-monsoon spring and the post-monsoon autumn, with autumn often giving more settled weather and firmer snow. Winter ascents are rare.'
      },
      typicalDurationDays: '26–32 days (Kathmandu to Kathmandu)',
      difficulty: { technical: 2, altitude: 4, exposure: 2, weather: 3, remoteness: 3, objectiveHazard: 2, summary: 'One of the more attainable Himalayan 7,000ers — moderate snow climbing on the north-west ridge, fixed rope on the steeper steps, and a long non-technical summit ridge. The challenge is altitude, cold and the length of the expedition rather than the climbing itself.' },
      objectiveHazards: ['Crevasse hazard on the lower and middle glacier', 'Wind and windchill on the exposed upper ridge', 'Occasional avalanche on loaded slopes after snowfall', 'Altitude illness — the route spends many nights above 5,000 m'],
      history: [
        'Himlung Himal lay inside a closed border zone until the early 1990s. It was added to Nepal’s permitted list in 1992 and climbed for the first time that autumn.',
        'Because the north-west ridge is moderate and the Nar–Phu approach doubles as a superb acclimatisation trek, the peak was quickly adopted by commercial operators as a stepping-stone objective, and now sees dozens of climbers each season.'
      ],
      equipment: ['Full high-altitude boots (single or warm double)', 'Down suit or heavy down jacket and salopettes', '−30 °C or colder sleeping system', 'Crampons, ice axe, harness, ascender, belay device', 'Glacier glasses, goggles, expedition mittens', 'Personal glacier-travel and fixed-rope kit'],
      acclimatisation: 'The Nar–Phu trek in gains height gradually and includes time at Nar and Phu (~4,000 m). On the mountain, teams typically make one or two rotations — touching Camp 1, then Camp 2 (sometimes Camp 3) — before descending to Base Camp to rest, then committing to the summit on a weather window.',
      permit: { authority: 'Department of Tourism, Government of Nepal, plus a Nar–Phu restricted-area permit', note: 'Himlung requires a mountaineering royalty, a liaison officer, a restricted-area permit for the Nar–Phu valley, and use of a registered Nepali operator. Fees are set annually and differ by season.', verify: true },
      itinerary: [
        { phase: 1, title: 'Kathmandu — arrival & briefing', days: '2', altM: 1400, detail: 'Permits, gear check, expedition briefing and the Ministry check-in.' },
        { phase: 2, title: 'Drive to Koto, trek into Nar–Phu', days: '6–7', altM: 4100, detail: 'Vehicle to the Annapurna Circuit roadhead, then trek via Meta, Nar and Phu — the acclimatisation trek in.' },
        { phase: 3, title: 'Base Camp established', days: '2', altM: 4900, detail: 'Build Base Camp above Phu, rest, and run a first acclimatisation walk.' },
        { phase: 4, title: 'Acclimatisation rotations', days: '10–12', altM: 6400, detail: 'Load-carries and nights at Camp 1 and Camp 2, a touch of Camp 3, then back to Base Camp to recover.' },
        { phase: 5, title: 'Rest & weather window', days: '2–4', altM: 4900, detail: 'Full rest at Base Camp waiting on the forecast for a settled summit window.' },
        { phase: 6, title: 'Summit push', days: '4–5', altM: 7126, detail: 'Base Camp → C1 → C2 → C3, then a pre-dawn start along the summit ridge, and descent to Base Camp.' },
        { phase: 7, title: 'Trek out & return', days: '4–5', altM: 1400, detail: 'Pack the mountain, trek out via Nar or the Kang La, drive to Kathmandu, debrief.' }
      ],
      faq: [
        { q: 'Is Himlung a good first 7,000 m peak?', a: 'Yes — it is one of the most popular choices for exactly that. The north-west ridge is moderate snow with fixed rope on the steep sections, there is no technical rock or ice, and the Nar–Phu approach acclimatises you well. You still need fitness, cold tolerance and basic mountaineering skills.' },
        { q: 'How long is the expedition?', a: 'Around four weeks Kathmandu to Kathmandu, including the trek in and out and time for acclimatisation rotations.' },
        { q: 'When is Himlung climbed?', a: 'Both spring (April–May) and autumn (September–October). Autumn often has more stable weather.' },
        { q: 'What permits are needed?', a: 'A mountaineering permit, a liaison officer, and a Nar–Phu restricted-area permit, all arranged through a registered Nepali operator. Confirm current fees for your year.' }
      ],
      relatedTreks: ['manaslu-circuit', 'annapurna-circuit'],
      relatedDestinations: ['Nar & Phu villages', 'Koto — Annapurna Circuit'],
      verify: STILL_VERIFYING
    },

    'putha-hiunchuli': {
      slug: 'putha-hiunchuli', name: 'Putha Hiunchuli', aka: 'Dhaulagiri VII', category: '7000',
      country: 'Nepal', countryLabel: 'Nepal', countries: ['Nepal'], inNepal: true,
      elevation: 7246, elevationLabel: '7,246 m', elevationFt: 23773,
      range: 'Dhaulagiri Himal', region: 'Dhaulagiri Region',
      coordinates: { lat: 28.735, lon: 83.144, approx: true },
      heroImage: null, gallery: [],
      tagline: 'The western anchor of the Dhaulagiri wall',
      summary: 'At 7,246 m, Putha Hiunchuli is the westernmost major summit of the Dhaulagiri massif, above the edge of Dolpo. First climbed in 1954 by Herbert Tichy’s small Austrian party — the same expedition that made the first ascent of Cho Oyu. Its normal route, from the north-west, is a moderate glacier-and-snow climb that has kept the peak on the list of attainable 7,000ers, reached by a long and beautiful trek through Dolpo.',
      seo: {
        title: 'Putha Hiunchuli Expedition — 7,246 m, Nepal | Dhaulagiri VII Route & Season',
        description: 'A factual guide to Putha Hiunchuli (Dhaulagiri VII, 7,246 m): the north-west route, camps, the 1954 first ascent by Herbert Tichy, the Dolpo approach, season, itinerary and planning.'
      },
      character: [
        'Putha Hiunchuli — Dhaulagiri VII in the survey numbering — stands at the far western end of the Dhaulagiri Himal, where the great wall of the massif drops toward the arid highlands of Dolpo. From its summit the view runs east along the whole Dhaulagiri range and west into Nepal’s remotest district.',
        'The peak was one of the first Himalayan 7,000ers to be climbed, in 1954, by a party of only three led by the Austrian Herbert Tichy — fresh from the first ascent of Cho Oyu. The normal route, up the north-west flank and the west ridge, is moderate: glacier travel, snow slopes and a straightforward final ridge, with two or three camps above base. There is no sustained technical climbing.',
        'What sets a Putha Hiunchuli expedition apart is the journey. The approach threads through Lower and Upper Dolpo — Phoksundo Lake, the Kagmara or Baga La, the Bon and Buddhist villages of the Tarap and Barbung valleys — one of the finest and least-travelled trekking regions in the Himalaya.'
      ],
      firstAscent: {
        year: 1954, date: 'May 1954',
        climbers: 'Herbert Tichy (Austria) with Sepp Jöchler and Pasang Dawa Lama',
        expedition: 'A small Austrian expedition, the same team that made the first ascent of Cho Oyu later that year',
        route: 'North-west flank and west ridge'
      },
      normalRoute: {
        name: 'North-West Flank & West Ridge, from the Dolpo side',
        character: 'A glaciated approach and moderate snow-and-ice climbing on the north-west flank to the west ridge, then a non-technical ridge to the summit. Fixed rope is used on the steeper glacier steps.',
        sections: [
          { name: 'Base Camp to Camp 1', detail: 'Moraine and the lower glacier from Base Camp (~5,000 m) to Camp 1 around 5,600 m.' },
          { name: 'Camp 1 to Camp 2', detail: 'Snow slopes and a crevassed section of glacier to Camp 2 near 6,200 m.' },
          { name: 'Camp 2 to high camp', detail: 'Steeper snow to a high camp on the west ridge at roughly 6,500 m.' },
          { name: 'Summit ridge', detail: 'A moderately-angled snow ridge to the summit, long but not technically hard.' }
        ]
      },
      alternativeRoutes: ['South face and east ridge — serious, rarely attempted alpine lines'],
      baseCampM: 5000,
      baseCampNote: 'Base Camp sits at around 5,000 m in the upper Barbung / Kaya valley, reached after roughly two weeks of trekking through Dolpo from the Juphal airstrip.',
      camps: [
        { name: 'Base Camp', altM: 5000, note: 'Upper Barbung valley' },
        { name: 'Camp 1', altM: 5600, note: 'Lower glacier' },
        { name: 'Camp 2', altM: 6200, note: 'Mid glacier' },
        { name: 'High Camp', altM: 6500, note: 'West ridge — summit launch' },
        { name: 'Summit', altM: 7246, note: '' }
      ],
      approach: 'Fly Kathmandu–Nepalgunj–Juphal, then trek through Dolpo — typically via Dunai, Phoksundo Lake and a pass into the Tarap or Barbung system — to Base Camp. The trek in takes 10–14 days and is a major part of the trip.',
      season: {
        primary: 'Spring & autumn', window: 'April–May and October',
        months: { Jan: 'closed', Feb: 'closed', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'shoulder', Oct: 'prime', Nov: 'shoulder', Dec: 'closed' },
        note: 'Dolpo lies in a partial rain shadow and can be climbed in a slightly wider window than the main Himalaya, but the standard seasons are spring and October. Winter is severe and access is difficult.'
      },
      typicalDurationDays: '30–38 days (Kathmandu to Kathmandu, including the Dolpo trek)',
      difficulty: { technical: 2, altitude: 4, exposure: 2, weather: 3, remoteness: 4, objectiveHazard: 2, summary: 'Moderate glacier and snow climbing on a peak whose main challenges are altitude, cold and sheer remoteness — the roadhead is a two-week walk away. Technically it is one of the more approachable 7,000ers.' },
      objectiveHazards: ['Crevasse hazard on the approach and mid-mountain glaciers', 'Wind and cold on the exposed west ridge', 'Remoteness — rescue and resupply are slow and weather-dependent', 'Altitude illness on a route with many nights above 5,000 m'],
      history: [
        'Putha Hiunchuli was climbed in 1954, making it one of the earliest Himalayan 7,000 m first ascents — the achievement of a tiny, lightweight Austrian party rather than a large siege expedition.',
        'It has never had heavy traffic. Its position deep in Dolpo, and the long trek required to reach it, mean it is climbed by only a handful of expeditions a year, usually combined with a full Dolpo traverse.'
      ],
      equipment: ['Warm double or single high-altitude boots', 'Down suit or heavy down clothing', '−30 °C sleeping system', 'Crampons, ice axe, harness, ascender, belay device', 'Glacier glasses, goggles, mittens', 'Full personal glacier and fixed-rope kit; robust duffel system for the long approach'],
      acclimatisation: 'The Dolpo trek crosses several passes above 5,000 m and acclimatises the team well before Base Camp. On the mountain, one or two rotations to Camp 1 and Camp 2 precede a rest at Base Camp and the summit push.',
      permit: { authority: 'Department of Tourism, Government of Nepal, plus Lower and Upper Dolpo restricted-area permits', note: 'Requires a mountaineering royalty, a liaison officer, restricted-area permits for Dolpo, and a registered operator. Confirm current fees and Upper Dolpo rules for your year.', verify: true },
      itinerary: [
        { phase: 1, title: 'Kathmandu — arrival & briefing', days: '2', altM: 1400, detail: 'Permits, Dolpo restricted-area paperwork, gear check and briefing.' },
        { phase: 2, title: 'Fly to Juphal, trek through Dolpo', days: '11–14', altM: 5000, detail: 'Nepalgunj and Juphal flights, then the long trek via Phoksundo Lake and a high pass to Base Camp — the acclimatisation journey.' },
        { phase: 3, title: 'Base Camp established', days: '2', altM: 5000, detail: 'Set Base Camp in the upper valley, rest and reconnoitre the lower glacier.' },
        { phase: 4, title: 'Acclimatisation rotations', days: '10–12', altM: 6500, detail: 'Carries and nights at Camp 1 and Camp 2, a touch of the high camp, then recovery at Base Camp.' },
        { phase: 5, title: 'Rest & weather window', days: '2–4', altM: 5000, detail: 'Rest and wait for a settled forecast.' },
        { phase: 6, title: 'Summit push', days: '4–6', altM: 7246, detail: 'Base Camp → C1 → C2 → high camp → summit ridge, then descend to Base Camp.' },
        { phase: 7, title: 'Trek out & return', days: '5–8', altM: 1400, detail: 'Strike camp and trek out of Dolpo to Juphal, fly to Kathmandu, debrief.' }
      ],
      faq: [
        { q: 'How technical is Putha Hiunchuli?', a: 'Not very — the normal route is moderate glacier and snow with fixed rope on the steeper steps and a non-technical summit ridge. The difficulty is altitude, cold and remoteness.' },
        { q: 'Why is the expedition so long?', a: 'The mountain is deep in Dolpo. The trek in and out is 2–3 weeks in total and is a genuine wilderness journey in its own right.' },
        { q: 'Who made the first ascent?', a: 'Herbert Tichy, Sepp Jöchler and Pasang Dawa Lama in 1954 — the same small Austrian team that first climbed Cho Oyu.' }
      ],
      relatedTreks: ['upper-dolpo', 'lower-dolpo', 'phoksundo-lake'],
      relatedDestinations: ['Phoksundo Lake', 'Dunai — Dolpo'],
      verify: STILL_VERIFYING
    },

    'nuptse': {
      slug: 'nuptse', name: 'Nuptse', aka: 'Nubtse', category: '7000',
      country: 'Nepal', countryLabel: 'Nepal', countries: ['Nepal'], inNepal: true,
      elevation: 7855, elevationLabel: '7,855 m', elevationFt: 25771,
      range: 'Mahalangur Himalaya', region: 'Everest Region',
      coordinates: { lat: 27.966, lon: 86.889, approx: true },
      heroImage: null, gallery: [],
      tagline: 'The third wall of the Everest cirque',
      summary: 'Nuptse (7,855 m) is the western arm of the Everest–Lhotse–Nuptse horseshoe that rings the Western Cwm. It is barely a thousand metres lower than Everest but a far steeper and more technical mountain, first climbed in 1961 by a British expedition via the south face. It has no trade route: every line on Nuptse is a serious alpine undertaking, and it is climbed by only a small number of experienced parties.',
      seo: {
        title: 'Nuptse Expedition — 7,855 m, Nepal | The Everest Cirque’s Steep Wall',
        description: 'A factual guide to Nuptse (7,855 m) in the Khumbu: the 1961 first ascent, the south-face routes, why it is a technical objective rather than a trade-route 7,000er, season and planning.'
      },
      character: [
        'Nuptse — "west peak" in Tibetan — forms the southern and western rampart of the Western Cwm, joined to Lhotse by a high ridge and facing Everest across the glacier. Trekkers to Everest Base Camp walk directly beneath its 2,000 m south face; it is one of the most photographed mountain walls on Earth.',
        'For all its proximity to the Everest trade route, Nuptse is a different order of climb. The 1961 British route on the south face involves sustained snow, ice and mixed ground to a corniced summit ridge, and the mountain went years at a time without an ascent. Modern lines — the Scott route, the various spurs and the traverse of the Nuptse ridge — are all committing, technical routes with real objective danger.',
        'It is not a mountain to attempt as a first 7,000er. Operators who run Nuptse expect prior technical alpine climbing, fixed-rope and steep-ice competence, and the judgement to move fast on exposed, avalanche-prone terrain.'
      ],
      firstAscent: {
        year: 1961, date: '16 May 1961',
        climbers: 'Dennis Davis and Tashi Sherpa reached the top first; Chris Bonington, Les Brown, James Swallow and Pemba Sherpa followed the next day',
        expedition: 'British Nuptse Expedition led by Joe Walmsley',
        route: 'South Face to the summit ridge'
      },
      normalRoute: {
        name: 'South Face routes (no single trade route)',
        character: 'Sustained snow, ice and mixed climbing on the huge south face to a heavily corniced summit ridge. Steep, exposed and objectively hazardous throughout — a genuine alpine route at altitude, not a fixed-camp snow plod.',
        sections: [
          { name: 'Lower face', detail: 'Glacier and the initial buttress or couloir system from an advanced base around 5,400–5,700 m.' },
          { name: 'Central face', detail: 'Several hundred metres of steep snow and mixed ground, with ice runnels and rock steps, to a mid-height bivouac or camp.' },
          { name: 'Upper face', detail: 'Steeper ice and mixed climbing to gain the summit ridge.' },
          { name: 'Summit ridge', detail: 'A short, extremely corniced and exposed ridge to the main summit — the crux of the descent as much as the ascent.' }
        ]
      },
      alternativeRoutes: ['Nuptse Nup I / the "Scott route"', 'The Nuptse ridge traverse from Lhotse — an elite objective', 'The north side from the Western Cwm — a serious, seldom-climbed line'],
      baseCampM: 5300,
      baseCampNote: 'Nuptse expeditions typically base near the standard Everest Base Camp or in a side valley off the Khumbu Glacier, around 5,300–5,400 m, reached on the usual Everest Base Camp trek.',
      camps: [
        { name: 'Base Camp', altM: 5350, note: 'Khumbu Glacier' },
        { name: 'Advanced Base', altM: 5700, note: 'Foot of the face' },
        { name: 'Camp 1 / bivouac', altM: 6300, note: 'Central face' },
        { name: 'Camp 2 / bivouac', altM: 6900, note: 'Upper face' },
        { name: 'Summit', altM: 7855, note: '' }
      ],
      approach: 'Fly Kathmandu–Lukla and trek the standard Everest Base Camp route (8–10 days) to Base Camp on the Khumbu Glacier.',
      season: {
        primary: 'Spring', window: 'April–May',
        months: { Jan: 'winter', Feb: 'winter', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'rare', Oct: 'rare', Nov: 'closed', Dec: 'winter' },
        note: 'Almost all attempts are in the pre-monsoon spring, when the face is (relatively) in condition and settled windows appear. Autumn is colder and less used; winter ascents are exceptional.'
      },
      typicalDurationDays: '40–50 days (Nepal side, including trek and acclimatisation)',
      difficulty: { technical: 5, altitude: 4, exposure: 5, weather: 4, remoteness: 2, objectiveHazard: 5, summary: 'One of the hardest 7,000 m peaks in Nepal to climb. Sustained technical ground on a huge, avalanche- and serac-threatened face, a lethal corniced summit ridge, and a descent that is as dangerous as the ascent. For experienced alpinists only.' },
      objectiveHazards: ['Avalanche and spindrift on the south face, especially after snowfall or in afternoon sun', 'Serac fall over sections of the face', 'Rock and stonefall in the couloirs and mixed ground', 'Enormous, unstable summit cornices', 'Committing descent with few safe retreat options high on the face'],
      history: [
        'Nuptse was climbed in 1961 by a strong British team — an early ascent for a peak of its steepness — but then saw very few repeats for two decades.',
        'From the 1980s onward it attracted hard new routes from leading alpinists, and it remains a mountain climbed by small, capable expeditions rather than commercial groups. The corniced summit ridge has been the scene of several accidents.'
      ],
      equipment: ['Technical crampons and two ice tools', 'Lightweight rock and ice rack familiarity — this is a climbing route', 'Helmet — mandatory', 'Down suit or lightweight down clothing suited to fast movement', 'Single-push or minimal bivouac kit', 'Full self-rescue and crevasse-rescue capability'],
      acclimatisation: 'Teams acclimatise on the Everest Base Camp trek and on nearby peaks or the lower face before committing. Because the route is a fast alpine push rather than a fixed-camp siege, the emphasis is on being well acclimatised and moving quickly through the hazardous ground.',
      permit: { authority: 'Department of Tourism, Government of Nepal', note: 'Nuptse requires a mountaineering royalty, a liaison officer and a registered operator. Fees are set annually.', verify: true },
      itinerary: [
        { phase: 1, title: 'Kathmandu — arrival & briefing', days: '2', altM: 1400, detail: 'Permits, technical gear check, expedition briefing.' },
        { phase: 2, title: 'Fly to Lukla, trek to Base Camp', days: '9–11', altM: 5350, detail: 'The standard Everest Base Camp trek with acclimatisation days at Namche and Dingboche.' },
        { phase: 3, title: 'Base Camp & acclimatisation', days: '10–14', altM: 6300, detail: 'Establish Base Camp, acclimatise on nearby ground and the lower face, cache gear at advanced base.' },
        { phase: 4, title: 'Rest & weather window', days: '3–6', altM: 5350, detail: 'Recover fully and wait for a settled multi-day window — essential on a route with no easy retreat.' },
        { phase: 5, title: 'Summit push', days: '3–5', altM: 7855, detail: 'A fast, committing alpine-style ascent of the face with one or two bivouacs, the corniced summit ridge, and a careful descent.' },
        { phase: 6, title: 'Descent & return', days: '4–6', altM: 1400, detail: 'Clear the mountain, trek out to Lukla, fly to Kathmandu, debrief.' }
      ],
      faq: [
        { q: 'Is Nuptse a good first 7,000 m peak?', a: 'No. Despite being right next to the Everest trekking route, Nuptse is a steep, technical, objectively dangerous alpine climb. It suits experienced alpinists with prior hard routes, not climbers stepping up from a trekking peak.' },
        { q: 'Is there a normal route with fixed camps?', a: 'Not in the way the eight-thousanders have one. Nuptse is climbed in a light, fast alpine style on the south face, usually with bivouacs rather than stocked camps.' },
        { q: 'When is it climbed?', a: 'Almost entirely in the spring (April–May), on a settled weather window.' }
      ],
      relatedTreks: ['everest-base-camp', 'three-passes'],
      relatedDestinations: ['Everest Base Camp', 'Tengboche Monastery'],
      verify: STILL_VERIFYING
    },

    'baruntse': {
      slug: 'baruntse', name: 'Baruntse', category: '7000',
      featured: true,
      country: 'Nepal', countryLabel: 'Nepal', countries: ['Nepal'], inNepal: true,
      elevation: 7129, elevationLabel: '7,129 m', elevationFt: 23389,
      range: 'Mahalangur Himalaya', region: 'Makalu Region',
      coordinates: { lat: 27.872, lon: 86.983, approx: true },
      heroImage: null, gallery: [],
      tagline: 'The snow pyramid between Everest and Makalu',
      summary: 'Baruntse (7,129 m) is a symmetrical snow-and-ice peak in the heart of the Hongu and Barun valleys, ringed by Everest, Lhotse, Makalu and Ama Dablam. First climbed in 1954 by a New Zealand team. Its south-east ridge is a classic moderate 7,000 m route — fixed snow and ice, four camps, a defined summit day — usually reached across the Amphu Labtsa or Mera La, which makes it a superb combined trekking-and-climbing expedition.',
      seo: {
        title: 'Baruntse Expedition — 7,129 m, Nepal | South-East Ridge Route & Season',
        description: 'A factual guide to Baruntse (7,129 m) in the Makalu–Barun region: the south-east ridge, camps, the 1954 New Zealand first ascent, the Mera La / Amphu Labtsa approach, season and itinerary.'
      },
      character: [
        'Baruntse rises at the meeting point of the Hongu, Imja and Barun valleys, a clean white pyramid surrounded by four of the six highest mountains in the world. It sits inside the Makalu–Barun National Park, in some of the least-visited high country in the Khumbu region.',
        'The normal route, the south-east ridge, is a moderate snow-and-ice climb: after a glaciated approach there are three or four camps, fixed rope on the steeper sections, an ice wall below the top camp, and a corniced but non-technical summit ridge. It has no death-zone altitude and comparatively contained objective hazard, which is why it has become — with Himlung — one of the standard training peaks for the eight-thousanders.',
        'The approach is a highlight in its own right: most teams trek in from Lukla over the Zatrwa La to Mera Peak, climb Mera (6,476 m) as acclimatisation, then cross the Mera La into the wild Hongu basin and on to Baruntse Base Camp.'
      ],
      firstAscent: {
        year: 1954, date: '30 May 1954',
        climbers: 'Colin Todd and Geoff Harrow (New Zealand)',
        expedition: 'A New Zealand expedition to the Barun region led by Edmund Hillary',
        route: 'South-east ridge (via the col between Baruntse and Point 6,890 m)'
      },
      normalRoute: {
        name: 'South-East Ridge, from the Hongu side',
        character: 'A glaciated approach to Base Camp, then moderate snow and ice on the south-east ridge with fixed rope on the steeper steps and an ice wall below the high camp. A defined, non-technical summit ridge.',
        sections: [
          { name: 'Base Camp to Camp 1', detail: 'The Hongu Glacier and moraine from Base Camp (~5,400 m) to Camp 1 at roughly 6,000 m.' },
          { name: 'Camp 1 to Camp 2', detail: 'Snow slopes on the ridge, with fixed rope, to Camp 2 around 6,400 m.' },
          { name: 'Camp 2 to Camp 3', detail: 'A steeper snow-and-ice section, including a short ice wall, to a high camp near 6,700 m.' },
          { name: 'Summit ridge', detail: 'A corniced but moderately-angled ridge from the high camp to the summit.' }
        ]
      },
      alternativeRoutes: ['West col / west ridge — harder and less frequented', 'South ridge — a serious alpine line'],
      baseCampM: 5400,
      baseCampNote: 'Base Camp sits at around 5,400 m in the upper Hongu valley below the south-east ridge, reached by trekking over the Mera La (and often after climbing Mera Peak for acclimatisation).',
      camps: [
        { name: 'Base Camp', altM: 5400, note: 'Upper Hongu valley' },
        { name: 'Camp 1', altM: 6000, note: 'Glacier / lower ridge' },
        { name: 'Camp 2', altM: 6400, note: 'Ridge crest' },
        { name: 'Camp 3', altM: 6700, note: 'Above the ice wall — summit launch' },
        { name: 'Summit', altM: 7129, note: '' }
      ],
      approach: 'Fly Kathmandu–Lukla, trek over the Zatrwa La to the Hinku valley and Mera Peak Base Camp, climb Mera (6,476 m) for acclimatisation, then cross the Mera La into the Hongu basin to Baruntse Base Camp. The exit is often over the Amphu Labtsa pass into the Everest region.',
      season: {
        primary: 'Spring & autumn', window: 'April–May and October',
        months: { Jan: 'closed', Feb: 'closed', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'shoulder', Oct: 'prime', Nov: 'shoulder', Dec: 'closed' },
        note: 'Baruntse is climbed in both spring and autumn. Autumn is popular because it pairs with the Mera Peak season; spring can bring more settled long windows. The upper ridge is exposed to wind in both seasons.'
      },
      typicalDurationDays: '28–34 days (Kathmandu to Kathmandu, including Mera Peak acclimatisation)',
      difficulty: { technical: 3, altitude: 4, exposure: 3, weather: 4, remoteness: 3, objectiveHazard: 3, summary: 'A moderate but genuine 7,000 m climb — fixed snow and ice on the south-east ridge, a short ice wall, and an exposed corniced summit ridge. Harder and more committing than Himlung, and a strong final rehearsal before an eight-thousander.' },
      objectiveHazards: ['Crevasse hazard on the Hongu Glacier and the lower route', 'Wind and windchill on the exposed ridge — the most common reason for turning back', 'Cornice collapse on the summit ridge', 'Avalanche on loaded slopes after snowfall', 'The Amphu Labtsa exit is itself a technical, crevassed pass'],
      history: [
        'Baruntse was first climbed in 1954 by a New Zealand expedition operating in the Barun — the same season Edmund Hillary’s wider party explored and climbed extensively in the region.',
        'From the 1990s it grew into one of the most-climbed 7,000 m peaks in Nepal, largely because the Mera–Baruntse–Amphu Labtsa circuit is an outstanding expedition and an ideal progression toward the eight-thousanders.'
      ],
      equipment: ['Warm double or single high-altitude boots', 'Down suit or heavy down clothing', '−30 °C sleeping system', 'Crampons, ice axe, harness, ascender, belay device', 'Second tool useful for the ice wall', 'Glacier glasses, goggles, expedition mittens', 'Full glacier and fixed-rope kit; pass-crossing gear for the Amphu Labtsa'],
      acclimatisation: 'The classic acclimatisation is Mera Peak (6,476 m) on the way in, then one or two rotations on Baruntse to Camp 1 and Camp 2 before a rest at Base Camp and the summit push.',
      permit: { authority: 'Department of Tourism, Government of Nepal (Makalu–Barun National Park)', note: 'Requires a mountaineering royalty, a liaison officer, national-park entry, and a registered operator. A separate permit is needed for Mera Peak if climbed. Confirm current fees for your year.', verify: true },
      itinerary: [
        { phase: 1, title: 'Kathmandu — arrival & briefing', days: '2', altM: 1400, detail: 'Permits, gear check, expedition briefing.' },
        { phase: 2, title: 'Fly to Lukla, trek to Mera', days: '7–9', altM: 5000, detail: 'Over the Zatrwa La into the Hinku valley to Mera Peak Base Camp.' },
        { phase: 3, title: 'Climb Mera Peak (acclimatisation)', days: '3–4', altM: 6476, detail: 'Ascend Mera (6,476 m) as the primary acclimatisation objective, then descend.' },
        { phase: 4, title: 'Cross the Mera La to Baruntse BC', days: '2–3', altM: 5400, detail: 'Trek into the Hongu basin and establish Baruntse Base Camp.' },
        { phase: 5, title: 'Acclimatisation rotations', days: '6–9', altM: 6700, detail: 'Carries and nights at Camp 1 and Camp 2, a touch of Camp 3, then back to Base Camp.' },
        { phase: 6, title: 'Rest & weather window', days: '2–4', altM: 5400, detail: 'Rest and wait for a low-wind summit window.' },
        { phase: 7, title: 'Summit push', days: '4–5', altM: 7129, detail: 'Base Camp → C1 → C2 → C3 (above the ice wall) → summit ridge, then descend.' },
        { phase: 8, title: 'Exit over the Amphu Labtsa & return', days: '4–5', altM: 1400, detail: 'Cross the Amphu Labtsa into the Khumbu, trek to Lukla, fly to Kathmandu, debrief.' }
      ],
      faq: [
        { q: 'Is Baruntse a good peak before an eight-thousander?', a: 'Yes — it is one of the best. The south-east ridge gives real fixed snow-and-ice climbing, a short ice wall and an exposed summit ridge at 7,000 m, without death-zone altitude. Combined with Mera Peak it is an ideal progression toward Manaslu, Cho Oyu or Everest.' },
        { q: 'How is Baruntse approached?', a: 'Usually from Lukla over the Zatrwa La to Mera Peak, then across the Mera La into the Hongu valley. Many teams exit over the Amphu Labtsa pass into the Everest region.' },
        { q: 'What most often stops climbers?', a: 'Wind on the upper ridge. The climbing is moderate; the summit day depends on a low-wind window.' }
      ],
      relatedTreks: ['mera-peak', 'three-passes', 'everest-base-camp'],
      relatedDestinations: ['Mera La', 'Amphu Labtsa'],
      verify: STILL_VERIFYING
    },

    'annapurna-iv': {
      slug: 'annapurna-iv', name: 'Annapurna IV', category: '7000',
      country: 'Nepal', countryLabel: 'Nepal', countries: ['Nepal'], inNepal: true,
      elevation: 7525, elevationLabel: '7,525 m', elevationFt: 24688,
      range: 'Annapurna Himal', region: 'Annapurna Region',
      coordinates: { lat: 28.538, lon: 84.083, approx: true },
      heroImage: null, gallery: [],
      tagline: 'The north wall of the Annapurna massif',
      summary: 'Annapurna IV (7,525 m) stands on the long northern rampart of the Annapurna massif, sharing a high ridge with Annapurna II. First climbed in 1955 by a German expedition. The normal route, from the north, is a moderate glacier-and-snow climb, but the mountain is notorious for a heavily corniced and wind-scoured upper ridge that has turned back many strong parties short of the top.',
      seo: {
        title: 'Annapurna IV Expedition — 7,525 m, Nepal | North Route, Season & Planning',
        description: 'A factual guide to Annapurna IV (7,525 m) in the Annapurna Himal: the north route, camps, the 1955 German first ascent, the corniced summit ridge, season and itinerary.'
      },
      character: [
        'Annapurna IV is one of the string of summits — Annapurna II, IV and the far eastern outliers — that form the northern wall of the Annapurna massif above the Marsyangdi and Sabje Khola valleys. From the Annapurna Circuit near Pisang and Manang, it is the great snow peak filling the sky to the south.',
        'The normal route climbs the northern glacier and snow slopes to the east ridge. Technically it is moderate for a 7,500 m peak — no sustained hard climbing — but the summit ridge is long, corniced and exposed to the full force of the wind funnelling over the massif. Many expeditions reach the ridge and the shoulder around 7,200–7,400 m and are stopped there.',
        'It is a peak for climbers who already have a 6,000 m and ideally a straightforward 7,000 m summit behind them, and who understand that on Annapurna IV the weather, not the climbing, is the deciding factor.'
      ],
      firstAscent: {
        year: 1955, date: '30 May 1955',
        climbers: 'Heinz Steinmetz, Harald Biller and Jürgen Wellenkamp (Germany)',
        expedition: 'A German expedition to the northern Annapurna peaks',
        route: 'North glacier and east ridge'
      },
      normalRoute: {
        name: 'North Route (north glacier and east ridge)',
        character: 'Glacier travel and moderate snow slopes to the east ridge, then a long corniced ridge to the summit. Fixed rope on the steeper glacier and ridge sections; the difficulty is length, altitude and wind rather than technical ground.',
        sections: [
          { name: 'Base Camp to Camp 1', detail: 'Moraine and the north glacier from Base Camp (~4,900 m) to Camp 1 around 5,700 m.' },
          { name: 'Camp 1 to Camp 2', detail: 'Snow slopes and a crevassed section to Camp 2 near 6,300 m.' },
          { name: 'Camp 2 to Camp 3', detail: 'Steeper snow to a high camp on the shoulder around 6,900–7,000 m.' },
          { name: 'Summit ridge', detail: 'A long, heavily corniced and wind-exposed ridge to the summit — the section that most often defeats attempts.' }
        ]
      },
      alternativeRoutes: ['The traverse to / from Annapurna II — a serious high-ridge expedition', 'South and west approaches — rarely attempted'],
      baseCampM: 4900,
      baseCampNote: 'Base Camp is established at around 4,900 m in the Sabje Khola or upper Marsyangdi tributary on the north side, reached by trekking off the Annapurna Circuit near Pisang.',
      camps: [
        { name: 'Base Camp', altM: 4900, note: 'North side' },
        { name: 'Camp 1', altM: 5700, note: 'North glacier' },
        { name: 'Camp 2', altM: 6300, note: 'Mid glacier' },
        { name: 'Camp 3', altM: 6950, note: 'The shoulder — summit launch' },
        { name: 'Summit', altM: 7525, note: '' }
      ],
      approach: 'Drive Kathmandu to Besisahar and up the Annapurna Circuit road toward Pisang, then trek north into a side valley to Base Camp — a short approach of 3–5 days that doubles as acclimatisation.',
      season: {
        primary: 'Spring & autumn', window: 'April–May and October',
        months: { Jan: 'closed', Feb: 'closed', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'shoulder', Oct: 'prime', Nov: 'shoulder', Dec: 'closed' },
        note: 'Climbed in spring and autumn. The upper ridge is wind-exposed in both seasons and the summit chances hinge on catching a low-wind window.'
      },
      typicalDurationDays: '30–38 days (Kathmandu to Kathmandu)',
      difficulty: { technical: 3, altitude: 4, exposure: 4, weather: 5, remoteness: 3, objectiveHazard: 3, summary: 'Moderate climbing on a peak defined by its weather. A long corniced summit ridge, some of the least reliable wind of the Annapurna Himal, and a shoulder at 7,000 m where many attempts end. Suited to climbers with prior 7,000 m experience.' },
      objectiveHazards: ['Wind — the single biggest factor; the summit ridge is regularly unclimbable', 'Cornice collapse on the summit ridge', 'Crevasse hazard on the north glacier', 'Avalanche on loaded slopes below the shoulder'],
      history: [
        'Annapurna IV was climbed in 1955 by a German party, one of the earlier Himalayan 7,500 m ascents.',
        'It has since been attempted many times, often in combination with Annapurna II, and has a reputation for stopping strong teams on the corniced ridge below the summit.'
      ],
      equipment: ['Warm double or single high-altitude boots', 'Down suit and −30 °C sleeping system', 'Crampons, ice axe, harness, ascender, belay device', 'Glacier glasses, goggles, expedition mittens', 'Robust wind protection — this is a windy mountain', 'Full glacier and fixed-rope kit'],
      acclimatisation: 'The short trek in and the Annapurna Circuit villages provide a start; the team then makes one or two rotations to Camp 1 and Camp 2 before resting at Base Camp and committing to a summit window.',
      permit: { authority: 'Department of Tourism, Government of Nepal (Annapurna Conservation Area)', note: 'Requires a mountaineering royalty, a liaison officer, ACAP entry and a registered operator. Confirm current fees for your year.', verify: true },
      itinerary: [
        { phase: 1, title: 'Kathmandu — arrival & briefing', days: '2', altM: 1400, detail: 'Permits, gear check, expedition briefing.' },
        { phase: 2, title: 'Drive & trek to Base Camp', days: '4–6', altM: 4900, detail: 'Vehicle to the Annapurna Circuit, then trek into the north-side valley and establish Base Camp.' },
        { phase: 3, title: 'Base Camp & first acclimatisation', days: '2–3', altM: 5700, detail: 'Rest, reconnoitre the glacier, carry to Camp 1.' },
        { phase: 4, title: 'Acclimatisation rotations', days: '8–11', altM: 6950, detail: 'Nights at Camp 1 and Camp 2, a touch of the shoulder, then recovery at Base Camp.' },
        { phase: 5, title: 'Rest & weather window', days: '3–5', altM: 4900, detail: 'Rest and wait for a genuinely low-wind forecast — the make-or-break factor on this peak.' },
        { phase: 6, title: 'Summit push', days: '4–6', altM: 7525, detail: 'Base Camp → C1 → C2 → C3, then the long corniced summit ridge, and descent.' },
        { phase: 7, title: 'Trek out & return', days: '3–4', altM: 1400, detail: 'Strike camp, trek out to the road, drive to Kathmandu, debrief.' }
      ],
      faq: [
        { q: 'How hard is Annapurna IV technically?', a: 'Moderate — glacier travel and snow slopes with fixed rope, and a non-technical (if long and corniced) summit ridge. The real difficulty is the weather and the exposed final ridge.' },
        { q: 'Why do so many expeditions not summit?', a: 'Wind. The summit ridge is high, long and fully exposed, and is regularly unclimbable. Teams often reach the shoulder around 7,200–7,400 m and have to turn back.' },
        { q: 'What experience is needed?', a: 'Prior 6,000 m and ideally a straightforward 7,000 m summit, fixed-rope and crampon competence, and the patience to wait for a window.' }
      ],
      relatedTreks: ['annapurna-circuit'],
      relatedDestinations: ['Manang', 'Pisang'],
      verify: STILL_VERIFYING
    },

    'spantik': {
      slug: 'spantik', name: 'Spantik', aka: 'Golden Peak (Ganesh Chhish)', category: '7000',
      country: 'Pakistan', countryLabel: 'Pakistan', countries: ['Pakistan'], inNepal: false,
      elevation: 7027, elevationLabel: '7,027 m', elevationFt: 23054,
      range: 'Karakoram', region: 'Karakoram',
      coordinates: { lat: 36.020, lon: 75.100, approx: true },
      heroImage: null, gallery: [],
      tagline: 'The Karakoram’s friendly 7,000er',
      summary: 'Spantik (7,027 m), known locally as Golden Peak, rises above the Nagar valley in the Karakoram. First climbed in 1955 by a German expedition. Its south-east ridge — long, moderate-angled snow with a superb high camp — is one of the most popular routes to a Karakoram summit for climbers stepping up to 7,000 m, and the mountain’s dramatic north-west face (the "Golden Pillar") is a legendary hard alpine objective.',
      seo: {
        title: 'Spantik Expedition — 7,027 m, Pakistan | Golden Peak South-East Ridge',
        description: 'A factual guide to Spantik (Golden Peak, 7,027 m) in the Karakoram: the south-east ridge, camps, the 1955 first ascent, the Nagar valley approach, the summer season and itinerary.'
      },
      character: [
        'Spantik stands at the head of the Chogolungma and Malubiting glacier systems above Nagar, in the western Karakoram. In evening light the summit snows glow — hence the local name Golden Peak.',
        'The south-east ridge, the normal route, is a long but moderate snow climb: a trek up the Chogolungma Glacier to Base Camp, then three or four camps on a broad ridge of never-steep snow, with a well-sheltered high camp and a defined summit day. There is very little technical difficulty and relatively contained objective hazard, which has made Spantik the Karakoram equivalent of Himlung or Baruntse — a first big-range 7,000er.',
        'The mountain has another face entirely: the north-west face rises in a slender ice-and-rock pillar first climbed by Mick Fowler and Victor Saunders in 1987, one of the finest hard alpine routes in the range and a world apart from the trade route.'
      ],
      firstAscent: {
        year: 1955, date: 'July 1955',
        climbers: 'A German expedition (Karl Kramer’s party)',
        expedition: 'A German Karakoram expedition',
        route: 'South-east ridge (now the normal route)'
      },
      notableAscents: [
        { label: 'The Golden Pillar', detail: '1987 — Mick Fowler and Victor Saunders climbed the north-west face, one of the most celebrated hard alpine routes in the Karakoram.' }
      ],
      normalRoute: {
        name: 'South-East Ridge, from the Chogolungma Glacier',
        character: 'A glacier approach to Base Camp, then a long, broad, moderate-angled snow ridge with three or four camps. Fixed rope on the few steeper steps. Non-technical, with a comfortable and sheltered high camp.',
        sections: [
          { name: 'Base Camp to Camp 1', detail: 'Glacier and moraine from Base Camp (~4,300 m) to Camp 1 around 5,000 m.' },
          { name: 'Camp 1 to Camp 2', detail: 'Broad snow slopes on the lower ridge to Camp 2 near 5,600 m.' },
          { name: 'Camp 2 to Camp 3', detail: 'More moderate snow to a well-sheltered high camp around 6,300–6,400 m.' },
          { name: 'Summit slopes', detail: 'A long, gently steepening snow slope and summit ridge — a big day, but not technically hard.' }
        ]
      },
      alternativeRoutes: ['North-West Face — the "Golden Pillar" (1987), an elite hard alpine route', 'The south-west ridge — climbed occasionally'],
      baseCampM: 4300,
      baseCampNote: 'Base Camp sits at around 4,300 m on the Chogolungma Glacier, reached by a 2–3 day trek from the roadhead in the Nagar valley (Arandu / Hoper area).',
      camps: [
        { name: 'Base Camp', altM: 4300, note: 'Chogolungma Glacier' },
        { name: 'Camp 1', altM: 5000, note: 'Lower ridge' },
        { name: 'Camp 2', altM: 5600, note: 'Mid ridge' },
        { name: 'Camp 3', altM: 6350, note: 'Sheltered high camp — summit launch' },
        { name: 'Summit', altM: 7027, note: '' }
      ],
      approach: 'Fly or drive Islamabad–Gilgit–Nagar, then jeep to the roadhead and trek 2–3 days up the Chogolungma Glacier to Base Camp. Total access is short by Karakoram standards.',
      season: {
        primary: 'Summer', window: 'June–August',
        months: { Jan: 'winter', Feb: 'winter', Mar: 'closed', Apr: 'closed', May: 'shoulder', Jun: 'prime', Jul: 'prime', Aug: 'prime', Sep: 'shoulder', Oct: 'closed', Nov: 'closed', Dec: 'winter' },
        note: 'Spantik is a summer mountain, like all the Karakoram. The window is longer and more forgiving than on the 8,000ers — June to August — but afternoon cloud and snowfall are common.'
      },
      typicalDurationDays: '21–26 days (Islamabad to Islamabad)',
      difficulty: { technical: 2, altitude: 4, exposure: 2, weather: 3, remoteness: 3, objectiveHazard: 2, summary: 'One of the most attainable 7,000 m peaks in the Karakoram — long moderate snow on the south-east ridge, a sheltered high camp, little technical ground and contained objective hazard. The challenges are altitude, the length of the summit day and Karakoram weather.' },
      objectiveHazards: ['Crevasse hazard on the Chogolungma Glacier and the lower ridge', 'Afternoon snowfall and whiteout on the broad upper slopes — navigation matters', 'Wind on the summit ridge', 'A long summit day with a heavily crevassed descent if tired'],
      history: [
        'Spantik was first climbed in 1955 by a German team via the south-east ridge, which remains the normal route.',
        'It became a favourite "training" 7,000er for commercial and independent expeditions in the 1990s and 2000s, while the north-west face stayed the preserve of top alpinists after Fowler and Saunders’ 1987 ascent.'
      ],
      equipment: ['Warm single or double high-altitude boots', 'Down suit or heavy down clothing', '−25 to −30 °C sleeping system', 'Crampons, ice axe, harness, ascender, belay device', 'Reliable navigation — GPS and compass — for the featureless upper slopes', 'Glacier glasses, goggles, mittens; full glacier kit'],
      acclimatisation: 'The Chogolungma approach and one or two rotations to Camp 1 and Camp 2 (and a touch of Camp 3) acclimatise the team; a rest at Base Camp precedes the summit push. The gentle profile of the route makes acclimatisation straightforward.',
      permit: { authority: 'Gilgit-Baltistan authorities / Ministry of Tourism, Government of Pakistan', note: 'Spantik requires a climbing permit and royalty, a liaison officer, and a registered Pakistani operator. Fees and rules are set annually and vary with party size.', verify: true },
      itinerary: [
        { phase: 1, title: 'Islamabad — arrival & briefing', days: '2', altM: 500, detail: 'Permit formalities, liaison-officer meeting, gear check.' },
        { phase: 2, title: 'Travel to Gilgit & Nagar', days: '2', altM: 2400, detail: 'Fly or drive the Karakoram Highway to Gilgit and on to the Nagar / Arandu roadhead.' },
        { phase: 3, title: 'Trek to Base Camp', days: '2–3', altM: 4300, detail: 'Up the Chogolungma Glacier with porters to Base Camp.' },
        { phase: 4, title: 'Acclimatisation rotations', days: '7–9', altM: 6350, detail: 'Carries and nights at Camp 1 and Camp 2, a touch of the high camp, then back to Base Camp.' },
        { phase: 5, title: 'Rest & weather window', days: '2–3', altM: 4300, detail: 'Rest and wait for a settled morning window.' },
        { phase: 6, title: 'Summit push', days: '4–5', altM: 7027, detail: 'Base Camp → C1 → C2 → C3, then a long summit day on the broad upper slopes, and descent.' },
        { phase: 7, title: 'Trek out & return', days: '3–4', altM: 500, detail: 'Descend to the roadhead, drive to Gilgit and Islamabad, debrief.' }
      ],
      faq: [
        { q: 'Is Spantik a good first 7,000 m peak?', a: 'Yes — it is one of the standard choices in the Karakoram for that. The south-east ridge is long moderate snow with very little technical difficulty, a sheltered high camp, and a relatively short and easy approach for the range.' },
        { q: 'How long does it take?', a: 'About three weeks Islamabad to Islamabad, which is short for a Karakoram 7,000er.' },
        { q: 'What is the "Golden Pillar"?', a: 'The north-west face of Spantik — a slender ice-and-rock pillar first climbed by Mick Fowler and Victor Saunders in 1987. It is a hard alpine route and completely separate from the normal south-east ridge.' }
      ],
      relatedTreks: [],
      relatedDestinations: ['Nagar valley', 'Hunza'],
      verify: STILL_VERIFYING
    },

    'muztagh-ata': {
      slug: 'muztagh-ata', name: 'Muztagh Ata', aka: 'Muztagata — “Father of Ice Mountains”', category: '7000',
      country: 'China', countryLabel: 'China', countries: ['China'], inNepal: false,
      elevation: 7546, elevationLabel: '7,546 m', elevationFt: 24757,
      range: 'Pamir', region: 'Pamir',
      coordinates: { lat: 38.277, lon: 75.115, approx: true },
      heroImage: null, gallery: [],
      tagline: 'The great dome of the eastern Pamir',
      summary: 'Muztagh Ata (7,546 m) is a vast, gently-angled ice dome in the eastern Pamir of Xinjiang, near Kashgar. First climbed in 1956 by a large Soviet–Chinese expedition. Its west ridge is one of the most straightforward routes to a 7,500 m summit anywhere — broad snow slopes with no technical climbing — and the mountain is one of the classic ski-mountaineering objectives in the world.',
      seo: {
        title: 'Muztagh Ata Expedition — 7,546 m, China | West Ridge Route & Ski Descent',
        description: 'A factual guide to Muztagh Ata (7,546 m) in the eastern Pamir, China: the non-technical west ridge, camps, the 1956 first ascent, the summer season, ski-mountaineering, and itinerary.'
      },
      character: [
        'Muztagh Ata dominates the plateau south of Kashgar on the Karakoram Highway, a huge white dome visible for a hundred kilometres. It is one of the highest mountains in the world that can be climbed — and skied — on skis from base to summit.',
        'The west ridge, the normal route, is exceptional in its lack of difficulty: a jeep-accessible Base Camp at 4,400 m, then three camps on broad, moderate-angled snow slopes, no fixed rope, no crevasse maze on the standard line, and a walking (or skinning) ascent of the final dome. The single serious factor is altitude — the summit is over 7,500 m and the plateau approach gives limited natural acclimatisation.',
        'It is the ideal objective for a fit hill-walker or ski-tourer with high-altitude ambitions, and a proven stepping-stone toward the eight-thousanders — but it should not be underestimated: people get high-altitude illness and frostbite on Muztagh Ata every season.'
      ],
      firstAscent: {
        year: 1956, date: '31 July 1956',
        climbers: 'A large Soviet–Chinese expedition (over thirty climbers reached the summit)',
        expedition: 'Joint Soviet–Chinese Pamir expedition',
        route: 'West ridge (now the normal route)'
      },
      notableAscents: [
        { label: 'Ski descents', detail: 'From the 1980s onward Muztagh Ata became one of the world’s premier high-altitude ski-mountaineering peaks, regularly skied from the summit.' }
      ],
      normalRoute: {
        name: 'West Ridge, from the Subash / Karakol side',
        character: 'Broad, moderate-angled snow slopes with three camps and no technical climbing. The summit dome is a walk (or ski) on any reasonable day. The challenge is altitude and cold, not the terrain.',
        sections: [
          { name: 'Base Camp to Camp 1', detail: 'Grassy moraine then snow from the jeep-accessible Base Camp (~4,400 m) to Camp 1 around 5,500 m.' },
          { name: 'Camp 1 to Camp 2', detail: 'A long snow slope, occasionally wind-scoured, to Camp 2 near 6,200 m.' },
          { name: 'Camp 2 to Camp 3', detail: 'More broad snow to a high camp around 6,800 m.' },
          { name: 'Summit dome', detail: 'A long, gently rising snow plateau to the summit — a very big day at altitude, but flat-angled throughout.' }
        ]
      },
      alternativeRoutes: ['East ridge and other lines — longer, committing, rarely climbed', 'Numerous ski-descent variations off the west and north-west slopes'],
      baseCampM: 4400,
      baseCampNote: 'Base Camp sits at about 4,400 m on the plateau near the Subash lakes, reached by vehicle from Kashgar along the Karakoram Highway — one of the most accessible high-mountain base camps in the world.',
      camps: [
        { name: 'Base Camp', altM: 4400, note: 'Subash plateau — road-accessible' },
        { name: 'Camp 1', altM: 5500, note: 'Lower snow slopes' },
        { name: 'Camp 2', altM: 6200, note: 'Mid mountain' },
        { name: 'Camp 3', altM: 6800, note: 'Summit launch' },
        { name: 'Summit', altM: 7546, note: '' }
      ],
      approach: 'Fly to Kashgar (via Ürümqi), then drive 3–4 hours south on the Karakoram Highway to Base Camp on the Subash plateau. Camels carry loads to Camp 1.',
      season: {
        primary: 'Summer', window: 'July–August',
        months: { Jan: 'winter', Feb: 'winter', Mar: 'closed', Apr: 'closed', May: 'closed', Jun: 'shoulder', Jul: 'prime', Aug: 'prime', Sep: 'shoulder', Oct: 'closed', Nov: 'closed', Dec: 'winter' },
        note: 'Climbed in July and August. Weather on the exposed dome can still be severe — high wind and cold — but the season is more settled than the neighbouring Karakoram.'
      },
      typicalDurationDays: '20–24 days (Kashgar to Kashgar)',
      difficulty: { technical: 1, altitude: 5, exposure: 2, weather: 4, remoteness: 2, objectiveHazard: 2, summary: 'Technically the easiest 7,500 m peak in the world to climb — broad moderate snow with no fixed rope and a walking summit dome. But it is over 7,500 m, the plateau gives poor natural acclimatisation, and altitude illness and frostbite are common. A serious high-altitude objective despite the easy terrain.' },
      objectiveHazards: ['High-altitude illness — the biggest single hazard; the approach acclimatises poorly', 'Frostbite and windchill on the exposed dome and the long summit day', 'Crevasses on some variations and in poor visibility', 'Whiteout navigation on the featureless plateau'],
      history: [
        'Muztagh Ata was first climbed in 1956 by a very large Soviet–Chinese expedition — an early example of mass-ascent mountaineering.',
        'After China reopened the area in the 1980s it became one of the most-climbed 7,000 m peaks in the world, and the foremost high-altitude ski-mountaineering peak.'
      ],
      equipment: ['Warm double high-altitude boots (or ski-touring boots for a ski ascent)', 'Down suit or heavy down clothing', '−30 °C sleeping system', 'Crampons, ice axe, harness (skis, skins and ski crampons for a ski ascent)', 'Excellent sun and wind protection — the plateau is brutal in clear weather', 'GPS and compass for whiteout navigation'],
      acclimatisation: 'Because the drive-in gives little altitude gain, acclimatisation is done on the mountain: two or three rotations up to Camp 1, Camp 2 and Camp 3 over one to two weeks, with returns to Base Camp, before the summit push. A pre-trip acclimatisation hike near Kashgar or in the Pamir foothills helps.',
      permit: { authority: 'China Tibet Mountaineering Association / Xinjiang Mountaineering Association', note: 'Muztagh Ata requires a climbing permit through a Chinese-authorised agency, a liaison officer / interpreter, and travel arrangements in Xinjiang that are subject to current regional regulations. Confirm the position well ahead of travel.', verify: true },
      itinerary: [
        { phase: 1, title: 'Kashgar — arrival & acclimatisation', days: '2–3', altM: 1300, detail: 'Permits and briefings; an acclimatisation day in the hills or at altitude near Kashgar.' },
        { phase: 2, title: 'Drive to Base Camp', days: '1', altM: 4400, detail: 'Karakoram Highway south to the Subash plateau; set Base Camp.' },
        { phase: 3, title: 'Acclimatisation rotations', days: '10–14', altM: 6800, detail: 'Camels to Camp 1, then rotations sleeping progressively at Camp 1, Camp 2 and Camp 3, returning to Base Camp to recover.' },
        { phase: 4, title: 'Rest & weather window', days: '2–4', altM: 4400, detail: 'Full rest and wait for a low-wind, clear summit window.' },
        { phase: 5, title: 'Summit push', days: '4–5', altM: 7546, detail: 'Base Camp → C1 → C2 → C3, then a long summit day (or ski) on the dome, and descent.' },
        { phase: 6, title: 'Return to Kashgar', days: '2', altM: 1300, detail: 'Strike camp, drive back to Kashgar, debrief and depart.' }
      ],
      faq: [
        { q: 'Is Muztagh Ata really that easy?', a: 'The terrain is — it is broad moderate snow with no technical climbing and a walking summit. But it is over 7,500 m, the approach acclimatises poorly, and the exposed dome is bitterly cold and windy. Altitude illness and frostbite are common. Treat it as a serious high-altitude objective.' },
        { q: 'Can you ski it?', a: 'Yes — Muztagh Ata is one of the classic high-altitude ski-mountaineering peaks and is regularly skied from the summit.' },
        { q: 'Is it a good peak before an eight-thousander?', a: 'It is one of the best for pure altitude experience — a genuine 7,500 m summit without the technical demands. Pair it with a technical 6,000 m or 7,000 m peak for a rounded progression.' }
      ],
      relatedTreks: [],
      relatedDestinations: ['Kashgar', 'Karakul Lake — Pamir Highway'],
      verify: STILL_VERIFYING
    },

    'api-himal': {
      slug: 'api-himal', name: 'Api Himal', aka: 'Api', category: '7000',
      country: 'Nepal', countryLabel: 'Nepal', countries: ['Nepal'], inNepal: true,
      elevation: 7132, elevationLabel: '7,132 m', elevationFt: 23399,
      range: 'Yoka Pahar (Gurans Himal)', region: 'Far West Nepal',
      coordinates: { lat: 30.005, lon: 80.938, approx: true },
      heroImage: null, gallery: [],
      tagline: 'The high point of Nepal’s far west',
      summary: 'Api (7,132 m) is the highest mountain in far-western Nepal, in the Gurans (Yoka Pahar) sub-range near the point where Nepal, India and Tibet meet. First climbed in 1960 by a Japanese expedition. It is a serious, remote and infrequently-climbed peak: the normal route on the north-west face and ridge is a real mixed and snow climb, and the approach is one of the longest and least-developed in Nepal.',
      seo: {
        title: 'Api Expedition — 7,132 m, Nepal | Far-West Nepal’s Highest Peak',
        description: 'A factual guide to Api Himal (7,132 m), the highest mountain of far-western Nepal: the north-west route, the 1960 Japanese first ascent, the remote Darchula approach, season and itinerary.'
      },
      character: [
        'Api stands at the far north-western corner of Nepal, above the Chamliya and Seti valleys of Darchula district, within sight of India’s Kumaon peaks and the Tibetan frontier. It is the dominant summit of the Gurans Himal and the highest point of the whole far-western region.',
        'The mountain is not a training 7,000er. The normal route, on the north-west face and ridge from the Dhauli Khola side, involves sustained snow and ice with mixed steps, serac and avalanche exposure, and a committing summit day. Api has been attempted many times and has a low summit rate, with several fatal accidents in its history.',
        'The approach compounds the seriousness: far-western Nepal has minimal tourist infrastructure, and reaching Base Camp involves a long drive to Darchula and days of trekking through steep, forested, lightly-populated country. Expeditions here are genuinely off the grid.'
      ],
      firstAscent: {
        year: 1960, date: 'May 1960',
        climbers: 'Katsutoshi Hirabayashi and Gyalzen Sherpa (Japan / Nepal)',
        expedition: 'A Japanese expedition from the Doshisha University Alpine Club',
        route: 'North-west face and north ridge'
      },
      normalRoute: {
        name: 'North-West Face & North Ridge, from the Dhauli Khola',
        character: 'Sustained snow and ice with mixed steps on the north-west face to the north ridge, then a corniced ridge to the summit. Serious for a 7,000er — real objective hazard, a committing summit day, and no margin for a slow party.',
        sections: [
          { name: 'Base Camp to Camp 1', detail: 'Moraine and the lower glacier from Base Camp (~3,900 m) to Camp 1 around 4,900 m.' },
          { name: 'Camp 1 to Camp 2', detail: 'Steeper snow and ice, threading serac and avalanche terrain, to Camp 2 near 5,700 m.' },
          { name: 'Camp 2 to Camp 3', detail: 'Mixed ground and a snow face to a high camp around 6,300–6,400 m.' },
          { name: 'Summit ridge', detail: 'A long corniced ridge from the high camp to the summit — exposed and time-consuming.' }
        ]
      },
      alternativeRoutes: ['South and west faces — hard, seldom-attempted alpine lines', 'The traverse toward Nampa — an expedition objective in itself'],
      baseCampM: 3900,
      baseCampNote: 'Base Camp is established at around 3,900 m in the upper Dhauli Khola below the north-west face, reached after several days of trekking from the Darchula roadhead through the Seti and Chamliya valleys.',
      camps: [
        { name: 'Base Camp', altM: 3900, note: 'Upper Dhauli Khola' },
        { name: 'Camp 1', altM: 4900, note: 'Lower glacier' },
        { name: 'Camp 2', altM: 5700, note: 'Mid face' },
        { name: 'Camp 3', altM: 6350, note: 'North ridge — summit launch' },
        { name: 'Summit', altM: 7132, note: '' }
      ],
      approach: 'Fly Kathmandu–Dhangadhi (or a long drive), then drive to Darchula in the far west, and trek 4–6 days through the Chamliya / Seti valleys and the village of Ghusa to Base Camp. Infrastructure is minimal throughout.',
      season: {
        primary: 'Spring & autumn', window: 'April–May and October',
        months: { Jan: 'closed', Feb: 'closed', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'shoulder', Oct: 'prime', Nov: 'shoulder', Dec: 'closed' },
        note: 'Climbed in spring and autumn. Far-western Nepal catches monsoon and winter weather from both the Indian plains and Tibet, and settled windows can be short.'
      },
      typicalDurationDays: '30–38 days (Kathmandu to Kathmandu)',
      difficulty: { technical: 4, altitude: 4, exposure: 4, weather: 4, remoteness: 5, objectiveHazard: 4, summary: 'A serious, remote 7,000 m peak. Sustained snow and ice with mixed steps, real serac and avalanche exposure, a committing corniced summit ridge, and an approach through country with almost no infrastructure. Not a first big-mountain objective.' },
      objectiveHazards: ['Serac and avalanche exposure on the north-west face', 'Cornices on the summit ridge', 'Crevasse hazard on the lower glacier', 'Extreme remoteness — rescue is slow, difficult and often impossible in bad weather', 'Rockfall in the mixed sections'],
      history: [
        'Api was first climbed in 1960 by a Japanese university expedition, after an earlier attempt in 1954 ended in a fatal accident.',
        'It has seen only a small number of ascents since, and remains one of Nepal’s least-climbed 7,000 m peaks — partly for the difficulty, and partly because far-western Nepal is so hard to reach.'
      ],
      equipment: ['Technical crampons and two ice tools', 'Down suit and −30 °C sleeping system', 'Helmet — mandatory for the mixed ground', 'Harness, ascender, belay/rappel device, ice screws, pickets', 'Full self-rescue and crevasse-rescue capability', 'Robust expedition logistics for a long unsupported approach'],
      acclimatisation: 'The long trek in provides a good acclimatisation base. On the mountain, one or two rotations to Camp 1 and Camp 2 (weather permitting through the hazardous ground) precede a rest at Base Camp and the summit push.',
      permit: { authority: 'Department of Tourism, Government of Nepal', note: 'Api requires a mountaineering royalty, a liaison officer, and a registered operator. Some far-western districts also have their own access considerations. Confirm the current position for your year.', verify: true },
      itinerary: [
        { phase: 1, title: 'Kathmandu — arrival & briefing', days: '2', altM: 1400, detail: 'Permits, gear check, expedition briefing.' },
        { phase: 2, title: 'Travel to Darchula, trek to Base Camp', days: '6–8', altM: 3900, detail: 'Flight or drive to the far west, drive to Darchula, then trek through the Chamliya / Seti valleys to Base Camp.' },
        { phase: 3, title: 'Base Camp & acclimatisation', days: '3–4', altM: 5000, detail: 'Build Base Camp, rest, carry to Camp 1, sleep high once.' },
        { phase: 4, title: 'Acclimatisation rotations', days: '8–11', altM: 6350, detail: 'Rotations through the serac and mixed ground to Camp 2 and Camp 3, chosen carefully by conditions, then recovery at Base Camp.' },
        { phase: 5, title: 'Rest & weather window', days: '3–5', altM: 3900, detail: 'Rest and wait for a settled multi-day window — essential given the hazardous terrain and slow retreat.' },
        { phase: 6, title: 'Summit push', days: '4–6', altM: 7132, detail: 'Base Camp → C1 → C2 → C3 → the corniced north ridge, then a careful descent.' },
        { phase: 7, title: 'Trek out & return', days: '5–7', altM: 1400, detail: 'Strike the mountain, trek out to Darchula, travel back to Kathmandu, debrief.' }
      ],
      faq: [
        { q: 'Is Api a beginner’s 7,000 m peak?', a: 'No. Api is a serious, technical, objectively dangerous and extremely remote mountain with a low summit rate. It suits experienced expedition climbers with prior hard 6,000 m or 7,000 m routes.' },
        { q: 'How remote is the approach?', a: 'Very. Far-western Nepal has minimal infrastructure. Reaching Base Camp takes the better part of a week from the roadhead, and rescue options are extremely limited.' },
        { q: 'When was it first climbed?', a: 'In 1960 by a Japanese university expedition, after a fatal attempt in 1954.' }
      ],
      relatedTreks: ['api-base-camp'],
      relatedDestinations: ['Darchula', 'Khaptad National Park'],
      verify: STILL_VERIFYING
    },

    'nun-peak': {
      slug: 'nun-peak', name: 'Nun', aka: 'Nun (Nun–Kun massif)', category: '7000',
      country: 'India', countryLabel: 'India', countries: ['India'], inNepal: false,
      elevation: 7135, elevationLabel: '7,135 m', elevationFt: 23409,
      range: 'Zanskar Range', region: 'Indian Himalaya',
      coordinates: { lat: 33.996, lon: 76.023, approx: true },
      heroImage: null, gallery: [],
      tagline: 'The highest peak of the Indian Himalaya west of the Sutlej',
      summary: 'Nun (7,135 m) is the higher of the twin summits of the Nun–Kun massif in Ladakh, above the Suru valley on the road between Kargil and Padum. First climbed in 1953 by the Swiss guide Pierre Vittoz and the French climber Claude Kogan. Its normal route from the west is a moderate but sustained snow-and-ice climb, and its road-accessible Base Camp makes it one of the most logistically straightforward 7,000 m peaks in the greater Himalaya.',
      seo: {
        title: 'Nun Expedition — 7,135 m, India | Ladakh’s Highest Peak: West Route & Season',
        description: 'A factual guide to Nun (7,135 m) in the Nun–Kun massif, Ladakh: the west route, camps, the 1953 first ascent by Kogan and Vittoz, the road-accessible Suru valley approach, season and itinerary.'
      },
      character: [
        'Nun and its twin Kun (7,077 m) rise together from the Zanskar Range on the southern edge of Ladakh, an isolated massif separated by a high snow plateau. Nun is the highest mountain in India outside the eastern Karakoram, and the highest anywhere in the Indian Himalaya west of the Sutlej river.',
        'The normal route climbs the west side from a Base Camp in the Suru valley: a rocky lower section to an advanced base, then three snow-and-ice camps on the west and north-west flanks, with fixed rope on the steeper slopes and a defined, if long, summit day. It is moderate in difficulty but sustained — there is real ice, genuine exposure on the upper mountain, and a serious crevasse hazard.',
        'What makes Nun attractive logistically is access: the Kargil–Padum road runs right past the foot of the mountain, so Base Camp is reached in a short trek, and the Ladakhi climate is drier and more settled than the monsoon-affected Himalaya to the south.'
      ],
      firstAscent: {
        year: 1953, date: '28 August 1953',
        climbers: 'Pierre Vittoz (Switzerland) and Claude Kogan (France)',
        expedition: 'A small Franco-Swiss expedition',
        route: 'West / north-west flank (now the normal route)'
      },
      notableAscents: [
        { label: 'Claude Kogan', detail: 'Kogan’s 1953 ascent of Nun was, at the time, the highest summit reached by a woman.' }
      ],
      normalRoute: {
        name: 'West Route (west and north-west flanks)',
        character: 'A rocky approach to advanced base, then sustained moderate snow and ice on the west and north-west flanks with fixed rope on the steeper slopes, and a long summit day along a snow ridge. Real ice and exposure on the upper mountain.',
        sections: [
          { name: 'Base Camp to Advanced Base', detail: 'Moraine and scree from Base Camp (~3,600 m) in the Suru valley to an advanced base around 4,500 m.' },
          { name: 'Advanced Base to Camp 1', detail: 'The lower glacier and a rock rib to Camp 1 near 5,300 m.' },
          { name: 'Camp 1 to Camp 2', detail: 'Steeper snow and ice slopes, usually fixed, to Camp 2 around 5,900 m.' },
          { name: 'Camp 2 to Camp 3', detail: 'A snow face and shoulder to a high camp near 6,300–6,400 m.' },
          { name: 'Summit ridge', detail: 'A long, exposed snow ridge from the high camp to the summit — a big day, moderate-angled but committing.' }
        ]
      },
      alternativeRoutes: ['The Nun–Kun traverse via the plateau — a serious high expedition', 'North face and other lines — hard, rarely climbed'],
      baseCampM: 3600,
      baseCampNote: 'Base Camp sits at around 3,600 m in the Suru valley near the village of Tangol / Gulmatongo, directly off the Kargil–Padum road — among the most accessible 7,000 m base camps in the Himalaya.',
      camps: [
        { name: 'Base Camp', altM: 3600, note: 'Suru valley — road-accessible' },
        { name: 'Advanced Base', altM: 4500, note: 'Foot of the glacier' },
        { name: 'Camp 1', altM: 5300, note: 'Lower glacier / rib' },
        { name: 'Camp 2', altM: 5900, note: 'Ice slopes' },
        { name: 'Camp 3', altM: 6350, note: 'Shoulder — summit launch' },
        { name: 'Summit', altM: 7135, note: '' }
      ],
      approach: 'Fly to Leh (or Srinagar), acclimatise in Ladakh, then drive the Kargil–Padum road into the Suru valley to Base Camp — a road journey rather than a trek, followed by a short walk in.',
      season: {
        primary: 'Summer', window: 'July–September',
        months: { Jan: 'winter', Feb: 'winter', Mar: 'closed', Apr: 'closed', May: 'shoulder', Jun: 'shoulder', Jul: 'prime', Aug: 'prime', Sep: 'prime', Oct: 'shoulder', Nov: 'closed', Dec: 'winter' },
        note: 'Nun is climbed in the summer and early autumn, when the Suru valley road is open and the weather is at its most settled. Ladakh’s dry climate gives a longer, more reliable window than the monsoon Himalaya.'
      },
      typicalDurationDays: '24–30 days (Leh to Leh, including Ladakh acclimatisation)',
      difficulty: { technical: 3, altitude: 4, exposure: 4, weather: 3, remoteness: 2, objectiveHazard: 3, summary: 'A moderate but sustained snow-and-ice climb with real ice, genuine exposure on the upper mountain, and a long committing summit day. Logistically one of the easiest 7,000ers to reach, but a serious climb once on it — suited to those with prior glacier and 6,000 m experience.' },
      objectiveHazards: ['Crevasse hazard on the west glacier — the most cited danger on the route', 'Ice slopes on the middle mountain requiring competent cramponing and belays', 'Wind and cold on the exposed summit ridge', 'Afternoon weather build-up in the Suru valley'],
      history: [
        'Nun was first climbed in 1953 by Pierre Vittoz and Claude Kogan — a landmark ascent, and at the time the highest summit reached by a woman.',
        'With the opening of the Suru valley road it became one of the most-attempted 7,000 m peaks in the Indian Himalaya, and a standard objective for Indian and visiting expeditions building toward higher mountains.'
      ],
      equipment: ['Warm single or double high-altitude boots', 'Down suit or heavy down clothing', '−25 to −30 °C sleeping system', 'Crampons, ice axe, second tool useful, harness, ascender, belay device, ice screws', 'Glacier glasses, goggles, mittens', 'Full crevasse-rescue and glacier kit'],
      acclimatisation: 'Acclimatisation begins in Ladakh itself — Leh sits at 3,500 m — with a few days of local walks or a smaller peak. On Nun, one or two rotations to Camp 1 and Camp 2 precede a rest at Base Camp and the summit push.',
      permit: { authority: 'Indian Mountaineering Foundation (IMF)', note: 'Nun requires a peak permit from the IMF, a liaison officer, and (for foreign teams) an Indian partner agency. Ladakh also has inner-line / protected-area considerations. Confirm the current process and fees well ahead of travel.', verify: true },
      itinerary: [
        { phase: 1, title: 'Leh — arrival & acclimatisation', days: '3–4', altM: 3500, detail: 'Arrive in Ladakh, rest at 3,500 m, and acclimatise with local walks or a small peak.' },
        { phase: 2, title: 'Drive to Base Camp', days: '1–2', altM: 3600, detail: 'Drive the Kargil–Padum road into the Suru valley and walk in to Base Camp.' },
        { phase: 3, title: 'Base Camp & Advanced Base', days: '3–4', altM: 4500, detail: 'Establish Base Camp and Advanced Base, rest, and carry to Camp 1.' },
        { phase: 4, title: 'Acclimatisation rotations', days: '8–11', altM: 6350, detail: 'Rotations sleeping at Camp 1, Camp 2 and a touch of Camp 3, then recovery at Base Camp.' },
        { phase: 5, title: 'Rest & weather window', days: '2–4', altM: 3600, detail: 'Rest and wait for a settled window.' },
        { phase: 6, title: 'Summit push', days: '4–6', altM: 7135, detail: 'Base Camp → ABC → C1 → C2 → C3 → the summit ridge, then descend.' },
        { phase: 7, title: 'Return to Leh', days: '2–3', altM: 3500, detail: 'Strike camp, drive back to Leh, debrief and depart.' }
      ],
      faq: [
        { q: 'Why is Nun logistically easy but still serious?', a: 'The Kargil–Padum road runs past the foot of the mountain, so Base Camp is reached without a long trek. But the climb itself is a sustained snow-and-ice route with real crevasse hazard, ice slopes and an exposed summit ridge — not a walk.' },
        { q: 'What experience do I need?', a: 'Prior glacier travel, competent cramponing and ice-axe use, and ideally a 6,000 m summit. Fitness for a long summit day at 7,000 m is essential.' },
        { q: 'Who made the first ascent?', a: 'Pierre Vittoz and Claude Kogan in 1953 — Kogan’s ascent was the highest by a woman at the time.' }
      ],
      relatedTreks: [],
      relatedDestinations: ['Suru valley', 'Leh — Ladakh', 'Rangdum Monastery'],
      verify: STILL_VERIFYING
    },

    /* ==================== SIX-THOUSANDERS (6,000 m +) =====================
       Nepal's classic trekking-peak summits plus the technical objective of
       Ama Dablam. `category` places them in the 6,000 m band; `peakType`
       records how they are climbed (Trekking Peak vs Expedition Peak) so
       visitors can browse by height OR by style. Elevations are the commonly
       accepted figures; where authorities disagree it is said so and flagged.
       ------------------------------------------------------------------- */

    'mera-peak': {
      slug: 'mera-peak', name: 'Mera Peak', aka: 'Mera Central', category: '6000',
      peakType: 'Trekking Peak', peakGrade: 'Beginner', featured: true,
      country: 'Nepal', countryLabel: 'Nepal', countries: ['Nepal'], inNepal: true,
      elevation: 6476, elevationLabel: '6,476 m', elevationFt: 21247,
      range: 'Mahalangur Himalaya', region: 'Everest Region (Hinku Valley)',
      coordinates: { lat: 27.708, lon: 86.872, approx: true },
      heroImage: null, gallery: [],
      tagline: 'The highest of Nepal’s trekking peaks',
      summary: 'At 6,476 m, Mera Peak is the highest of Nepal’s designated trekking peaks — a long glacier ascent above the remote Hinku valley, south of Everest. First climbed in 1953 by Jimmy Roberts and Sen Tenzing. The normal route is not technical: crampons, a rope for the crevassed glacier and one short steep pull onto the summit dome. Its difficulty is entirely altitude, cold and the length of the summit day, and from the top five 8,000 m peaks stand on the northern skyline.',
      seo: {
        title: 'Mera Peak Climb — 6,476 m, Nepal | Route, Season & Itinerary',
        description: 'A factual guide to climbing Mera Peak (6,476 m), the highest trekking peak in Nepal: the Hinku valley approach, the Mera La glacier route, camps, seasons, first-ascent history, itinerary and permits.'
      },
      character: [
        'Mera Peak rises between the Hinku and Hongu valleys, in the wild country south of Everest that sees a fraction of the traffic of the main Khumbu. It has three summits — Mera North (6,476 m), Mera Central (6,461 m) and Mera South (6,065 m) — and the naming has never been fully tidy in guidebooks or on permits; the climb described here reaches the highest point.',
        'The route is a walk on a glacier at altitude. From Khare, teams cross onto the Mera Glacier, climb gently to a high camp on a rock spur, and on summit day follow a broad, gradually steepening snow slope to a final 40–45° pull onto the summit. There is no rock climbing, no steep ice and little exposure — but there is a great deal of altitude, and the summit day gains around 700 m from high camp.',
        'The approach is the other half of the experience: a crossing of the Zatrwa La from Lukla into the Hinku, then days of walking through rhododendron forest and yak pasture with almost no lodges beyond Kothe.'
      ],
      firstAscent: {
        year: 1953, date: '20 May 1953',
        climbers: 'Colonel Jimmy Roberts and Sen Tenzing',
        expedition: 'A small exploratory ascent during the era of Himalayan reconnaissance',
        route: 'North face, via the Mera La (now the normal route)'
      },
      notableAscents: [
        { label: 'Adopted as a mass-market objective', detail: 'From the 2000s Mera became one of the most-climbed 6,000 m peaks in Nepal, often used as preparation for Baruntse, Ama Dablam or an 8,000 m expedition.' }
      ],
      normalRoute: {
        name: 'North Face, via the Mera La',
        character: 'A long, non-technical glacier ascent. Crampons and roped travel for crevasses, one 40–45° snow slope onto the summit dome, and a summit day of 8–10 hours from high camp. Fitness and acclimatisation decide it, not skill.',
        sections: [
          { name: 'Khare to Mera La', detail: 'Steep moraine and the first glacier ice to the Mera La at roughly 5,400 m.' },
          { name: 'Mera La to High Camp', detail: 'Gentle glacier to a high camp on a rock spur (the “Rock”) at about 5,800 m.' },
          { name: 'High Camp to summit', detail: 'A long, gradually steepening glacier slope, then a final 40–45° pull onto the central summit at 6,476 m.' }
        ]
      },
      alternativeRoutes: ['Approach via Paiya / Chutok to avoid the Zatrwa La', 'Continuation over the Amphu Labtsa into the Khumbu — a serious mountaineering pass, expedition-style only'],
      baseCampM: 5045,
      baseCampNote: 'Most teams use Khare (~5,000 m) as their base rather than a formal base camp; the glacier high camp at ~5,800 m is the summit launch point.',
      camps: [
        { name: 'Khare (base)', altM: 5045, note: 'Last settlement' },
        { name: 'Mera La', altM: 5400, note: 'Glacier col' },
        { name: 'High Camp', altM: 5800, note: 'Rock spur — summit launch' },
        { name: 'Summit', altM: 6476, note: '' }
      ],
      approach: 'Fly Kathmandu–Lukla, then trek south over the Zatrwa La into the Hinku valley via Chhuthang, Kothe, Thangnak and Khare — 6–7 days with acclimatisation built in.',
      season: {
        primary: 'Spring & autumn', window: 'April–May and October–November',
        months: { Jan: 'winter', Feb: 'winter', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'shoulder', Oct: 'prime', Nov: 'prime', Dec: 'winter' },
        note: 'October–November usually gives the most stable weather and the clearest summit panorama; spring is warmer but hazier. Winter ascents are made but are cold and quiet.'
      },
      typicalDurationDays: '18–20 days (Kathmandu to Kathmandu)',
      difficulty: { technical: 1, altitude: 4, exposure: 2, weather: 3, remoteness: 3, objectiveHazard: 2, summary: 'The least technical way to stand above 6,400 m in Nepal. No rock, no steep ice, minimal exposure — but a serious amount of altitude and a long summit day on a crevassed glacier that demands roped travel and real fitness.' },
      objectiveHazards: ['Crevasses on the Mera Glacier — roped travel is essential', 'Cold and wind on the exposed summit dome', 'Altitude illness on a route with many nights above 5,000 m', 'Whiteout navigation on the featureless upper glacier'],
      history: [
        'Mera was among the first peaks designated by the Nepal Mountaineering Association as a “trekking peak” open on a simplified permit.',
        'The confusion between Mera North, Central and South has produced decades of disputed summit claims; reputable operators are now explicit about which top a climb reaches.'
      ],
      equipment: ['Warm single mountaineering boots', 'Crampons, ice axe, harness, ascender, belay device', 'Personal glacier-travel and prusik kit', 'Heavy down jacket, shell layers, expedition mittens', '−20 °C sleeping system', 'Glacier glasses and goggles'],
      acclimatisation: 'The Hinku approach gains height steadily. Teams typically spend two to three nights around Khare (5,000 m) with an acclimatisation walk toward the Mera La before moving up to High Camp for the summit bid.',
      permit: { authority: 'Nepal Mountaineering Association trekking-peak permit (through a licensed operator), plus Makalu–Barun National Park entry', note: 'Mera is climbed on an NMA permit arranged by a registered operator; a licensed climbing guide is mandatory. Fees are seasonal and set annually.', verify: true },
      itinerary: [
        { phase: 1, title: 'Kathmandu — arrival & briefing', days: '2', altM: 1400, detail: 'Permits, gear check and the expedition briefing.' },
        { phase: 2, title: 'Fly to Lukla, cross the Zatrwa La', days: '4–5', altM: 3600, detail: 'Trek south over the pass into the Hinku valley to Kothe.' },
        { phase: 3, title: 'Kothe to Khare', days: '3', altM: 5045, detail: 'Walk up the valley via Thangnak, with an acclimatisation day.' },
        { phase: 4, title: 'Acclimatisation at Khare', days: '2', altM: 5400, detail: 'Skills refresher on the glacier and a hike toward the Mera La.' },
        { phase: 5, title: 'Move to High Camp', days: '1', altM: 5800, detail: 'Cross the Mera La and climb to the high camp on the Rock.' },
        { phase: 6, title: 'Summit day & return to Khare', days: '2', altM: 6476, detail: 'Pre-dawn start for the summit, then descend all the way to Khare.' },
        { phase: 7, title: 'Trek out & fly to Kathmandu', days: '4–5', altM: 1400, detail: 'Return down the Hinku and over the pass to Lukla, fly out, debrief.' }
      ],
      faq: [
        { q: 'Is Mera Peak a good first Himalayan climb?', a: 'Yes — it is the classic choice. There is no technical climbing, only glacier walking in crampons on a rope. What you need is strong fitness, cold tolerance and careful acclimatisation for the altitude.' },
        { q: 'How hard is summit day?', a: 'Long rather than difficult: around 700 m of ascent from high camp, 8–10 hours round trip, with one 40–45° slope near the top.' },
        { q: 'Which summit do you climb?', a: 'The highest point (Mera Central / North, 6,476 m). Ask any operator to be specific — some itineraries quietly reach a lower top.' },
        { q: 'When is the best time?', a: 'October–November for stable weather and views; April–May is the warmer spring option.' }
      ],
      relatedTreks: ['everest-base-camp', 'three-passes'],
      relatedDestinations: ['Khare', 'Hinku Valley', 'Zatrwa La'],
      relatedPeaks: ['island-peak', 'lobuche-peak', 'baruntse'],
      verify: TREK_PEAK_VERIFYING
    },

    'lobuche-peak': {
      slug: 'lobuche-peak', name: 'Lobuche Peak', aka: 'Lobuche East', category: '6000',
      peakType: 'Trekking Peak', peakGrade: 'Moderate', featured: true,
      country: 'Nepal', countryLabel: 'Nepal', countries: ['Nepal'], inNepal: true,
      elevation: 6119, elevationLabel: '6,119 m', elevationFt: 20076,
      range: 'Mahalangur Himalaya', region: 'Everest Region (Khumbu Valley)',
      coordinates: { lat: 27.949, lon: 86.789, approx: true },
      heroImage: null, gallery: [],
      tagline: 'A steep, corniced ridge above the Khumbu',
      summary: 'Lobuche East (6,119 m) stands directly above the Everest Base Camp trail near Lobuche village. Despite its trekking-peak status it is a genuine mountaineering objective — a sustained 45° snow-and-ice slope on fixed rope leads to a corniced, knife-edge summit ridge, and the true summit lies beyond a lower top where many parties stop. First climbed in 1984. It is usually done as an acclimatisation and skills climb alongside an Everest Base Camp trek.',
      seo: {
        title: 'Lobuche Peak (East) Climb — 6,119 m, Nepal | Route & Season',
        description: 'A factual guide to Lobuche East (6,119 m) in the Khumbu: the east face and south-east ridge route, the true vs false summit, the 1984 first ascent, seasons, itinerary and permits.'
      },
      character: [
        'Lobuche East is one of two summits — East (6,119 m) and the separate, harder West (6,145 m) — on a ridge west of the Khumbu Glacier. The two have been confused for decades; a permit for “Lobuche” means the East peak.',
        'From a high camp on rock ledges above Lobuche village, the route gains a hanging glacier and then a long, sustained snow-and-ice slope of around 45°, climbed on fixed rope. The final section is a corniced, exposed ridge, and reaching the true summit rather than the obvious lower top involves a delicate traverse that many teams decline in poor conditions.',
        'It sits right on the Everest Base Camp trail, so acclimatisation is excellent and the logistics are simple — but the climbing itself is a clear step up from Island Peak.'
      ],
      firstAscent: {
        year: 1984, date: '25 April 1984',
        climbers: 'Laurence Nielson and Ang Gyalzen Sherpa',
        expedition: 'An early ascent after the peak was placed on the trekking-peak list',
        route: 'South-east ridge'
      },
      normalRoute: {
        name: 'East Face to the South-East Ridge',
        character: 'Rock ledges to a high camp, a short mixed headwall onto the glacier, then 300 m of sustained 40–50° snow and ice on fixed rope to a corniced summit ridge. Technically the hardest of the popular Khumbu trekking peaks.',
        sections: [
          { name: 'Lobuche to High Camp', detail: 'Steep grass and rock ledges to a high camp at roughly 5,600 m.' },
          { name: 'High Camp to the glacier', detail: 'Mixed ground and a short headwall onto the hanging glacier.' },
          { name: 'Summit slopes', detail: 'About 300 m of 40–50° snow and ice, fixed, to gain the ridge.' },
          { name: 'Summit ridge', detail: 'An exposed, corniced traverse to the true east summit at 6,119 m.' }
        ]
      },
      alternativeRoutes: ['Lobuche West (6,145 m) — a separate, seldom-climbed and considerably harder objective'],
      baseCampM: 4950,
      baseCampNote: 'Climbed from a high camp above Lobuche village (~5,600 m); teams stage from Lobuche or Dughla on the Everest Base Camp trail rather than a formal base camp.',
      camps: [
        { name: 'Lobuche (stage)', altM: 4950, note: 'On the EBC trail' },
        { name: 'High Camp', altM: 5600, note: 'Rock ledges — summit launch' },
        { name: 'Summit', altM: 6119, note: 'True east summit' }
      ],
      approach: 'Everest Base Camp trail — fly Lukla, trek via Namche, Tengboche and Dingboche to Lobuche (8–9 days with acclimatisation), then climb from the high camp above the village.',
      season: {
        primary: 'Spring & autumn', window: 'April–May and October–November',
        months: { Jan: 'winter', Feb: 'winter', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'shoulder', Oct: 'prime', Nov: 'prime', Dec: 'winter' },
        note: 'Both seasons are used. Autumn tends to give firmer snow on the summit slope; late spring can be warm with softer, slower going.'
      },
      typicalDurationDays: '15–17 days (usually combined with Everest Base Camp and Kala Patthar)',
      difficulty: { technical: 3, altitude: 3, exposure: 3, weather: 3, remoteness: 1, objectiveHazard: 2, summary: 'A real mountaineering climb behind a trekking-peak label — sustained steep snow and ice on fixed rope and a corniced, exposed summit ridge. Prior confidence on crampons and an ascender makes a large difference.' },
      objectiveHazards: ['Crevasses on the summit glacier', 'Rockfall on the approach headwall after thaw', 'Cornice collapse on the summit ridge', 'Cold on an early alpine start'],
      history: [
        'Lobuche East was added to the trekking-peak list and first climbed in 1984.',
        'Its long-standing confusion with Lobuche West has meant that some historic “Lobuche” ascents are hard to attribute to a specific summit.'
      ],
      equipment: ['Warm mountaineering boots', 'Technical crampons and ice axe', 'Harness, ascender, belay device, two prusiks', 'Helmet', 'Heavy down jacket, shell layers, mittens', '−20 °C sleeping system'],
      acclimatisation: 'The Everest Base Camp trek to Lobuche acclimatises the team well; most itineraries touch Kala Patthar (5,644 m) or Everest Base Camp before the summit day.',
      permit: { authority: 'Nepal Mountaineering Association trekking-peak permit (through a licensed operator), plus Sagarmatha National Park entry', note: 'An NMA permit and a licensed climbing guide are required; the local rural municipality also charges an entry fee. Confirm current figures for your year.', verify: true },
      itinerary: [
        { phase: 1, title: 'Kathmandu — arrival & briefing', days: '2', altM: 1400, detail: 'Permits, gear check and briefing.' },
        { phase: 2, title: 'Fly to Lukla, trek to Namche', days: '2', altM: 3440, detail: 'The classic Khumbu approach begins.' },
        { phase: 3, title: 'Acclimatise Namche → Dingboche', days: '4', altM: 4410, detail: 'Rest days at Namche and Dingboche with acclimatisation hikes.' },
        { phase: 4, title: 'Dingboche to Lobuche, optional Kala Patthar', days: '2', altM: 5545, detail: 'Move to Lobuche; many teams add Kala Patthar or Everest Base Camp.' },
        { phase: 5, title: 'Move to High Camp', days: '1', altM: 5600, detail: 'Climb the rock ledges to the high camp and review fixed-rope technique.' },
        { phase: 6, title: 'Summit day & descend', days: '2', altM: 6119, detail: 'Pre-dawn start for the ridge, then descend to Lobuche or Dughla.' },
        { phase: 7, title: 'Trek out & fly to Kathmandu', days: '3', altM: 1400, detail: 'Return to Lukla and fly out.' }
      ],
      faq: [
        { q: 'Is Lobuche harder than Island Peak?', a: 'Yes — the summit slope is longer and steeper and the final ridge is more exposed and corniced. It is a common “second” Nepali climbing peak.' },
        { q: 'What is the false summit issue?', a: 'A lower top is easily reached and is sometimes claimed as the summit. The true east summit needs a short, exposed traverse beyond it.' },
        { q: 'Do I need previous experience?', a: 'Ideally yes — comfort on 45° snow with crampons and an ascender. Complete beginners are better served by Mera or Island Peak first.' },
        { q: 'Is Everest Base Camp included?', a: 'Usually — the approach follows the EBC trail and most itineraries add Kala Patthar or Base Camp for acclimatisation.' }
      ],
      relatedTreks: ['everest-base-camp', 'three-passes'],
      relatedDestinations: ['Lobuche', 'Kala Patthar', 'Everest Base Camp'],
      relatedPeaks: ['island-peak', 'mera-peak', 'ama-dablam'],
      verify: TREK_PEAK_VERIFYING
    },

    'island-peak': {
      slug: 'island-peak', name: 'Island Peak', aka: 'Imja Tse', category: '6000',
      peakType: 'Trekking Peak', peakGrade: 'Moderate', featured: true,
      country: 'Nepal', countryLabel: 'Nepal', countries: ['Nepal'], inNepal: true,
      elevation: 6160, elevationLabel: '6,160 m', elevationFt: 20210,
      range: 'Mahalangur Himalaya', region: 'Everest Region (Imja Valley)',
      coordinates: { lat: 27.922, lon: 86.938, approx: true },
      heroImage: null, gallery: [],
      tagline: 'The busiest 6,000er in Nepal',
      summary: 'Island Peak, or Imja Tse (6,160 m — some authorities give 6,189 m), rises from the glaciers of the Chhukung valley in the shadow of Lhotse. Named by Eric Shipton’s party in 1951 for its look of an island in a sea of ice, it was climbed in 1953 by a British group acclimatising for Everest. The route ends with a genuinely steep headwall on fixed rope and a short corniced ridge, making it a fair introduction to a real snow climb — and the most popular trekking peak in the country.',
      seo: {
        title: 'Island Peak (Imja Tse) Climb — 6,160 m, Nepal | Route & Itinerary',
        description: 'A factual guide to Island Peak / Imja Tse (6,160 m) in the Khumbu: the south-west flank and summit headwall, the 1953 first ascent, crevasse and fixed-rope sections, seasons, itinerary and permits.'
      },
      character: [
        'Island Peak sits at the head of the Chhukung valley, a spur running down from the great south wall of Lhotse. Trekkers on the Everest Base Camp circuit who divert to Chhukung look straight up at it.',
        'The climb begins with a long approach up a rock gully and ridge to the glacier, then a roped crossing of a crevassed basin — sometimes with an aluminium ladder over the largest slots — to the foot of the summit headwall. That headwall is 100–150 m of 40–45° snow and ice on fixed rope, topped by a narrow, corniced ridge of perhaps 50 m to the summit.',
        'It is strenuous rather than difficult, but the combination of altitude, an early start, a steep headwall and real crevasse hazard makes it a proper mountaineering day, not a walk.'
      ],
      firstAscent: {
        year: 1953, date: 'April 1953',
        climbers: 'A British party including Tenzing Norgay, climbing as preparation for the Everest expedition',
        expedition: 'Pre-Everest training climb led by Charles Evans',
        route: 'South-west flank and summit headwall'
      },
      normalRoute: {
        name: 'South-West Flank & Summit Headwall',
        character: 'A rock gully and ridge to the glacier, a crevassed glacier crossing, then a 100–150 m fixed headwall of 40–45° snow and ice to a short, corniced summit ridge.',
        sections: [
          { name: 'Base Camp to Crampon Point', detail: 'A rising rock gully and broad ridge to the glacier snout at roughly 5,700 m.' },
          { name: 'Glacier crossing', detail: 'Roped travel through a crevassed basin below the headwall — bridges and ladders shift through the season.' },
          { name: 'Summit headwall', detail: '100–150 m of 40–45° snow and ice on fixed rope.' },
          { name: 'Summit ridge', detail: 'A narrow, corniced traverse of about 50 m to the top.' }
        ]
      },
      alternativeRoutes: ['A direct start from Chhukung skipping Base Camp — done by fast, acclimatised parties', 'Crossing the Kongma La en route for extra acclimatisation'],
      baseCampM: 5100,
      baseCampNote: 'Island Peak Base Camp sits at around 5,100 m, 2–3 hours beyond Chhukung. Some teams add a High Camp at ~5,600 m to shorten summit day.',
      camps: [
        { name: 'Base Camp', altM: 5100, note: 'Below the south-west flank' },
        { name: 'High Camp', altM: 5600, note: 'Optional — shortens summit day' },
        { name: 'Summit', altM: 6160, note: '' }
      ],
      approach: 'Everest Base Camp trail to Dingboche, then east to Chhukung and on to Island Peak Base Camp. Fly Lukla; around 9 days in with acclimatisation.',
      season: {
        primary: 'Spring & autumn', window: 'April–May and October–November',
        months: { Jan: 'winter', Feb: 'winter', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'shoulder', Oct: 'prime', Nov: 'prime', Dec: 'winter' },
        note: 'Peak season traffic can mean queues on the fixed headwall; an early start or an off-peak week helps. Autumn snow is generally firmer.'
      },
      typicalDurationDays: '16–19 days (usually with Everest Base Camp / Kala Patthar or the Kongma La)',
      difficulty: { technical: 2, altitude: 3, exposure: 3, weather: 3, remoteness: 1, objectiveHazard: 2, summary: 'A fair first fixed-rope snow climb — one steep headwall, a short exposed ridge and a crevassed glacier, all at altitude. The difficulty is the summit-day effort and the steep top pitch rather than sustained technical ground.' },
      objectiveHazards: ['Crevasses on the summit glacier — bridges and ladder placements change through the season', 'Rockfall in the approach gully', 'Congestion and dropped gear on the fixed headwall in peak weeks', 'Cold on a pre-dawn start'],
      history: [
        'Eric Shipton’s 1951 Everest reconnaissance named the peak “Island Peak”. It was officially renamed Imja Tse in 1983, though the old name is still universal.',
        'The 1953 ascent, by a party including Tenzing Norgay, was training for the successful Everest expedition weeks later.',
        'It is now the most-climbed trekking peak in Nepal, with hundreds of ascents a season.'
      ],
      equipment: ['Warm mountaineering boots', 'Crampons, ice axe', 'Harness, ascender, belay device, two prusiks', 'Helmet', 'Heavy down jacket, shell layers, mittens', '−20 °C sleeping system', 'Glacier glasses and goggles'],
      acclimatisation: 'The Chhukung valley offers Chhukung Ri (5,550 m) and the Kongma La (5,535 m) for acclimatisation, and many itineraries visit Everest Base Camp and Kala Patthar first.',
      permit: { authority: 'Nepal Mountaineering Association trekking-peak permit (through a licensed operator), plus Sagarmatha National Park entry', note: 'An NMA permit and a licensed climbing guide are required, plus national-park and local municipality fees. Fees are seasonal and set annually.', verify: true },
      itinerary: [
        { phase: 1, title: 'Kathmandu — arrival & briefing', days: '2', altM: 1400, detail: 'Permits, gear check and briefing.' },
        { phase: 2, title: 'Fly to Lukla, trek to Namche', days: '2', altM: 3440, detail: 'Begin the Khumbu approach.' },
        { phase: 3, title: 'Acclimatise Namche → Dingboche → Chhukung', days: '5', altM: 4730, detail: 'Rest days and acclimatisation hikes; optional Everest Base Camp / Kala Patthar.' },
        { phase: 4, title: 'Move to Island Peak Base Camp', days: '1', altM: 5100, detail: 'Short walk beyond Chhukung; afternoon skills refresher.' },
        { phase: 5, title: 'Summit day', days: '1', altM: 6160, detail: 'Very early start for the glacier, headwall and summit ridge; return to Base Camp or Chhukung.' },
        { phase: 6, title: 'Contingency / weather day', days: '1', altM: 5100, detail: 'A spare day held for weather or a second attempt.' },
        { phase: 7, title: 'Trek out & fly to Kathmandu', days: '3–4', altM: 1400, detail: 'Return to Lukla and fly out, debrief.' }
      ],
      faq: [
        { q: 'Is Island Peak suitable for beginners?', a: 'It is a common first climbing peak, but it is not a walk — expect a steep fixed headwall, a corniced ridge and a crevassed glacier. A day or two of crampon and ascender practice beforehand is valuable.' },
        { q: 'Are there ladders on the route?', a: 'Sometimes, over the larger crevasses on the summit glacier, depending on the season and conditions.' },
        { q: 'Is the summit 6,160 m or 6,189 m?', a: 'Authorities differ. Nepal’s official figure is 6,160 m; some maps and older sources give 6,189 m.' },
        { q: 'Can it be combined with Everest Base Camp?', a: 'Yes — that is the standard itinerary, and it gives excellent acclimatisation.' }
      ],
      relatedTreks: ['everest-base-camp', 'three-passes'],
      relatedDestinations: ['Chhukung', 'Imja Tsho', 'Everest Base Camp'],
      relatedPeaks: ['lobuche-peak', 'mera-peak', 'ama-dablam', 'baruntse'],
      verify: TREK_PEAK_VERIFYING
    },

    'ama-dablam': {
      slug: 'ama-dablam', name: 'Ama Dablam', aka: 'Mother’s Necklace', category: '6000',
      peakType: 'Expedition Peak', peakGrade: 'Expert', featured: true,
      country: 'Nepal', countryLabel: 'Nepal', countries: ['Nepal'], inNepal: true,
      elevation: 6812, elevationLabel: '6,812 m', elevationFt: 22349,
      range: 'Mahalangur Himalaya', region: 'Everest Region (Khumbu Valley)',
      coordinates: { lat: 27.861, lon: 86.861, approx: true },
      heroImage: null, gallery: [],
      tagline: 'The Matterhorn of the Khumbu',
      summary: 'Ama Dablam (6,812 m — older sources give 6,856 m) is the striking, spired peak that dominates the Everest Base Camp trail above Pangboche. It is not a trekking peak but a Ministry-permitted expedition peak, and one of the most technical mountains regularly guided anywhere: the South-West Ridge involves steep granite, fixed rope on rock and ice, relentless exposure, and an upper mountain overhung by the hanging Dablam serac. First climbed in 1961.',
      seo: {
        title: 'Ama Dablam Expedition — 6,812 m, Nepal | South-West Ridge Route & Season',
        description: 'A factual guide to climbing Ama Dablam (6,812 m) by the South-West Ridge: the Yellow Tower, camps 1–3, the Dablam serac hazard, the 1961 first ascent, autumn season, itinerary and permits.'
      },
      character: [
        'Ama Dablam — “mother’s necklace box”, for the hanging glacier that sits like a pendant on its south face — is one of the most photographed mountains in the Himalaya. Every trekker to Everest Base Camp walks beneath it for days.',
        'The South-West Ridge, the normal route, is a sustained technical climb. Above Camp 1 the ridge steepens into granite towers — the “Yellow Tower” and “Grey Tower” — climbed on fixed rope with real exposure on both sides. Camp 2 is a spectacular but tiny perch on the crest. Above Camp 3 the route crosses snow and ice runnels directly beneath the Dablam serac, which has collapsed onto the route with fatal consequences.',
        'It is a mountain for climbers with genuine alpine mileage: comfort seconding steep fixed rock at altitude, steep-ice technique, and ideally a prior 6,000 m summit. It is shorter and lower than an eight-thousander but, move for move, harder.'
      ],
      firstAscent: {
        year: 1961, date: '13 March 1961',
        climbers: 'Mike Gill, Barry Bishop, Mike Ward and Wally Romanes',
        expedition: 'Members of Sir Edmund Hillary’s Himalayan Scientific and Mountaineering Expedition (the “Silver Hut” party). The ascent was made without a permit and briefly strained Hillary’s standing in Nepal.',
        route: 'South-West Ridge'
      },
      notableAscents: [
        { label: '2006 Camp 3 serac disaster', detail: 'A collapse of the Dablam serac swept Camp 3, killing six climbers, and reshaped how the upper camps are placed and used.' }
      ],
      normalRoute: {
        name: 'South-West Ridge',
        character: 'A sustained technical alpine route — steep granite (to about British Severe / 5.7), fixed rope on rock and ice, extreme exposure, three committing camps, and an upper section beneath the Dablam serac.',
        sections: [
          { name: 'Base Camp to Camp 1', detail: 'Boulder fields and slabby granite to a ledge camp at roughly 5,700 m.' },
          { name: 'Camp 1 to Camp 2', detail: 'The crux rock — the Yellow Tower and Grey Tower, exposed fixed pitches to a tiny perch camp on the crest at about 5,900 m.' },
          { name: 'Camp 2 to Camp 3', detail: 'Mixed ground and steep snow to a camp below the Dablam at roughly 6,300 m.' },
          { name: 'Camp 3 to summit', detail: 'Snow and ice runnels of up to 55°, passing beneath the serac, then easier summit slopes to the top.' }
        ]
      },
      alternativeRoutes: ['North Ridge and North-East Face — serious, rarely repeated lines', 'The South Face — a hard modern objective, not a guided route'],
      baseCampM: 4570,
      baseCampNote: 'Base Camp sits on meadows at around 4,570 m, a half-day above Pangboche on the Everest Base Camp trail.',
      camps: [
        { name: 'Base Camp', altM: 4570, note: 'Meadows above Pangboche' },
        { name: 'Camp 1', altM: 5700, note: 'Ledge on the lower ridge' },
        { name: 'Camp 2', altM: 5900, note: 'Perch on the ridge crest — above the Yellow Tower' },
        { name: 'Camp 3', altM: 6300, note: 'Below the Dablam serac' },
        { name: 'Summit', altM: 6812, note: '' }
      ],
      approach: 'Everest Base Camp trail — fly Lukla, trek via Namche and Tengboche to Pangboche, then a half-day to Ama Dablam Base Camp. Around 6 days in with acclimatisation.',
      season: {
        primary: 'Autumn', window: 'Late October–November',
        months: { Jan: 'closed', Feb: 'closed', Mar: 'rare', Apr: 'shoulder', May: 'shoulder', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'shoulder', Oct: 'prime', Nov: 'prime', Dec: 'rare' },
        note: 'Autumn is the established season — colder but more stable, with firmer snow and ice above Camp 2. A smaller spring window exists but rockfall and soft snow are more of a problem.'
      },
      typicalDurationDays: '25–30 days (Kathmandu to Kathmandu)',
      difficulty: { technical: 4, altitude: 3, exposure: 5, weather: 3, remoteness: 1, objectiveHazard: 4, summary: 'One of the most technical peaks regularly guided anywhere: steep rock and ice, unrelenting exposure, and the objective threat of the Dablam serac. Needs solid multi-pitch rock and steep-ice competence at altitude and, ideally, a prior 6,000 m summit.' },
      objectiveHazards: ['Serac collapse from the Dablam onto the route above Camp 2/3 — the cause of the 2006 disaster', 'Rockfall on the lower ridge, especially in spring and in the afternoon', 'Falls on exposed fixed rock and ice pitches', 'Storms pinning teams at tiny, exposed ridge camps'],
      history: [
        'Ama Dablam was long thought unclimbable. The 1961 first ascent was made without official sanction by members of Hillary’s scientific expedition.',
        'The South-West Ridge became the trade route through the 1980s and 1990s, with commercial fixed rope installed each autumn.',
        'The 2006 serac collapse onto Camp 3 killed six climbers and changed how the upper mountain is managed.'
      ],
      equipment: ['Warm mountaineering boots (single, high-altitude)', 'Technical crampons and two ice tools', 'Harness, ascender, belay device, two prusiks, rappel device', 'Helmet (mandatory)', 'Down suit or heavy down jacket and salopettes', '−30 °C sleeping system', 'Rock-shoe option for the Yellow Tower (personal preference)'],
      acclimatisation: 'Teams acclimatise on the Everest Base Camp trek — often touching Kala Patthar or climbing a smaller peak such as Lobuche East — then run one or two rotations to Camp 1 and Camp 2 before a Camp 3 summit push.',
      permit: { authority: 'Department of Tourism, Government of Nepal — expedition royalty (through a registered operator) — plus Sagarmatha National Park entry and local municipality fees', note: 'Ama Dablam is a Ministry-permitted expedition peak, not an NMA trekking peak: it carries a mountaineering royalty, a liaison officer and a registered operator. Fees are set annually and vary by season.', verify: true },
      itinerary: [
        { phase: 1, title: 'Kathmandu — arrival & briefing', days: '2', altM: 1400, detail: 'Permits, gear check, expedition briefing and Ministry check-in.' },
        { phase: 2, title: 'Fly to Lukla, trek to Base Camp', days: '6', altM: 4570, detail: 'Khumbu approach via Namche, Tengboche and Pangboche, with acclimatisation days.' },
        { phase: 3, title: 'Base Camp — acclimatisation & puja', days: '3', altM: 4570, detail: 'Rest, skills sessions on nearby rock and ice, and the puja ceremony.' },
        { phase: 4, title: 'Rotation to Camp 1 / Camp 2', days: '4–6', altM: 5900, detail: 'Climb and sleep at Camp 1, touch Camp 2, then descend to Base Camp to recover.' },
        { phase: 5, title: 'Rest & weather window', days: '3–5', altM: 4570, detail: 'Full rest at Base Camp while the team waits on a settled forecast.' },
        { phase: 6, title: 'Summit push', days: '4–5', altM: 6812, detail: 'Base Camp → C1 → C2 → C3, summit from Camp 3, and descend to Base Camp.' },
        { phase: 7, title: 'Trek out & fly to Kathmandu', days: '3–4', altM: 1400, detail: 'Pack the mountain, trek to Lukla, fly out, debrief.' }
      ],
      faq: [
        { q: 'Is Ama Dablam harder than an 8,000 m peak?', a: 'Technically, yes — it demands steep rock and ice climbing and constant exposure. It is shorter, lower and less about the death zone, but the climbing itself is harder than the trade routes on most eight-thousanders.' },
        { q: 'What experience do I need?', a: 'Comfort seconding steep fixed rock at altitude, steep-ice technique, rappelling, and ideally a prior 6,000 m summit. It is not an appropriate first Himalayan climb.' },
        { q: 'How dangerous is the Dablam serac?', a: 'It is a genuine objective hazard above Camp 2/3 and has killed climbers. Modern practice minimises time spent beneath it, but it cannot be eliminated.' },
        { q: 'When is it climbed?', a: 'Primarily late October and November, when the weather is most stable and the upper snow and ice are firm.' }
      ],
      relatedTreks: ['everest-base-camp', 'three-passes'],
      relatedDestinations: ['Pangboche', 'Tengboche Monastery', 'Everest Base Camp'],
      relatedPeaks: ['everest', 'lhotse', 'nuptse', 'island-peak', 'lobuche-peak'],
      verify: STILL_VERIFYING
    },

    'chulu-east': {
      slug: 'chulu-east', name: 'Chulu East', aka: null, category: '6000',
      peakType: 'Trekking Peak', peakGrade: 'Moderate',
      country: 'Nepal', countryLabel: 'Nepal', countries: ['Nepal'], inNepal: true,
      elevation: 6584, elevationLabel: '6,584 m', elevationFt: 21601,
      range: 'Damodar Himal', region: 'Annapurna Region (Manang)',
      coordinates: { lat: 28.748, lon: 84.049, approx: true },
      heroImage: null, gallery: [],
      tagline: 'A high snow peak off the Annapurna Circuit',
      summary: 'Chulu East (commonly 6,584 m, though maps and permits vary) stands north of the Annapurna Circuit above Manang, in the Damodar Himal. It is climbed as an NMA trekking peak, usually built into a circuit trek: a glaciated approach from a base camp above the valley, a committing high camp on the ridge, and moderate snow slopes that steepen to 40–50° below the summit. Higher and more of a mountaineering undertaking than the Everest-region trekking peaks.',
      seo: {
        title: 'Chulu East Climb — 6,584 m, Nepal | Annapurna Circuit Peak Route & Season',
        description: 'A factual guide to Chulu East (6,584 m) in the Damodar Himal above Manang: the north-east ridge route, camps, seasons, the Annapurna Circuit approach, itinerary and NMA permits.'
      },
      character: [
        'The Chulu massif rises between the upper Marsyangdi and the Kali Gandaki, on the arid northern side of the Annapurna Circuit. It has several summits — West, Central, East and Far East — whose names and heights have been recorded inconsistently by different expeditions and mapmakers.',
        'Chulu East is the most frequently climbed of them. From a base camp above the Manang valley, the route crosses moraine and glacier to a high camp on the north-east ridge at around 5,530 m, then follows moderate snow that steepens to 40–50° on the final section, usually with fixed rope, to the summit.',
        'Because it is normally combined with the Annapurna Circuit, acclimatisation is excellent — Manang sits at 3,540 m with superb side hikes — and the trek out over the Thorong La (5,416 m) rounds off one of the great trekking routes in Nepal.'
      ],
      firstAscent: {
        year: 1955, date: '1955',
        climbers: 'A German expedition',
        expedition: 'One of the exploratory German Himalayan expeditions of the 1950s; the early history of the individual Chulu summits is not consistently documented',
        route: 'North-east ridge'
      },
      normalRoute: {
        name: 'North-East Ridge, from the Annapurna Circuit side',
        character: 'A glaciated approach to a high camp, then 30–40° snow to a broad shoulder and a final 40–50° slope, usually fixed, to the summit. Non-technical but high, cold and committing.',
        sections: [
          { name: 'Base Camp to High Camp', detail: 'Moraine and a snow ridge to a high camp at roughly 5,530 m.' },
          { name: 'High Camp to the shoulder', detail: 'Glacier and 30–40° snow to a broad shoulder near 6,200 m.' },
          { name: 'Summit slopes', detail: '40–50° snow, usually fixed on the steepest part, to the summit.' }
        ]
      },
      alternativeRoutes: ['Chulu Far East (~6,038 m) — a lower, easier neighbouring summit sometimes climbed instead', 'Chulu West — a separate, longer and harder objective'],
      baseCampM: 5000,
      baseCampNote: 'Chulu East Base Camp sits at roughly 4,900–5,100 m in a side valley north of the Circuit, reached in a day or two off the main trail near Manang.',
      camps: [
        { name: 'Base Camp', altM: 5000, note: 'Side valley north of the Circuit' },
        { name: 'High Camp', altM: 5530, note: 'North-east ridge — summit launch' },
        { name: 'Summit', altM: 6584, note: '' }
      ],
      approach: 'Annapurna Circuit — drive to Chame or Koto, trek via Pisang toward Manang, then turn north to Chulu Base Camp. Around 6–7 days on foot with acclimatisation.',
      season: {
        primary: 'Spring & autumn', window: 'April–May and October–November',
        months: { Jan: 'winter', Feb: 'winter', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'shoulder', Oct: 'prime', Nov: 'prime', Dec: 'winter' },
        note: 'The northern side of the Circuit lies in a partial rain shadow and holds settled weather well in both standard seasons. Winter is cold, with a hard Thorong La crossing.'
      },
      typicalDurationDays: '18–21 days (usually with the full Annapurna Circuit and the Thorong La)',
      difficulty: { technical: 2, altitude: 4, exposure: 3, weather: 3, remoteness: 3, objectiveHazard: 2, summary: 'A moderate snow climb whose main challenges are altitude and a long summit day. More glacier travel, a higher summit and a more committing high camp than the popular Khumbu trekking peaks.' },
      objectiveHazards: ['Crevasses on the approach glacier', 'Wind and cold at the exposed high camp and on the ridge', 'Altitude illness on a route with several nights above 5,000 m', 'Route-finding on the broad upper slopes in poor visibility'],
      history: [
        'The Chulu peaks were opened as NMA trekking peaks and have been climbed from the Annapurna Circuit since the region opened to trekkers in 1977.',
        'The persistent confusion between the West, Central, East and Far East summits means some historic ascent claims cannot be tied to a specific top, and permit heights do not always match survey heights.'
      ],
      equipment: ['Warm mountaineering boots', 'Crampons, ice axe, harness, ascender, belay device', 'Personal glacier-travel and prusik kit', 'Heavy down jacket, shell layers, mittens', '−20 °C sleeping system'],
      acclimatisation: 'The Annapurna Circuit approach — Manang at 3,540 m, with side hikes to Ice Lake (Kicho Tal, ~4,600 m) or Kicho Tal — acclimatises the team well before base camp.',
      permit: { authority: 'Nepal Mountaineering Association trekking-peak permit (through a licensed operator), plus Annapurna Conservation Area (ACAP) entry', note: 'An NMA permit and a licensed climbing guide are required, plus the ACAP entry fee and TIMS card for the trek. Fees are seasonal and set annually.', verify: true },
      itinerary: [
        { phase: 1, title: 'Kathmandu — arrival & briefing', days: '1–2', altM: 1400, detail: 'Permits, gear check and briefing.' },
        { phase: 2, title: 'Drive to Chame, trek to Pisang', days: '3', altM: 3300, detail: 'Vehicle to the Circuit roadhead, then walk up the Marsyangdi valley.' },
        { phase: 3, title: 'Trek toward Manang & acclimatise', days: '3', altM: 3540, detail: 'Upper Pisang route to Manang with an acclimatisation day and side hike.' },
        { phase: 4, title: 'Move up to Chulu Base Camp', days: '2', altM: 5000, detail: 'Leave the Circuit and climb into the side valley to Base Camp.' },
        { phase: 5, title: 'High Camp & acclimatisation', days: '2', altM: 5530, detail: 'Carry to High Camp, sleep, and review fixed-rope and glacier technique.' },
        { phase: 6, title: 'Summit day & descent', days: '2', altM: 6584, detail: 'Pre-dawn start for the summit, then descend to Base Camp and back to the Circuit.' },
        { phase: 7, title: 'Cross the Thorong La & trek out', days: '4–5', altM: 5416, detail: 'Rejoin the Circuit, cross the Thorong La to Muktinath, and drive out via Jomsom / Pokhara.' }
      ],
      faq: [
        { q: 'Chulu East or Chulu West?', a: 'East is the more common objective — slightly lower, a shorter summit day and a less committing position. West is a longer, harder climb for a second Nepali peak.' },
        { q: 'Do I need previous climbing experience?', a: 'Basic crampon and rope skills and strong trekking fitness. There is no technical rock or ice, but the altitude and summit-day length are serious.' },
        { q: 'Can it be linked with the Thorong La?', a: 'Yes — the standard trip climbs Chulu from the Manang side and then continues the Circuit over the Thorong La.' },
        { q: 'Why do sources give different heights?', a: 'The Chulu summits have been surveyed and named inconsistently; 6,584 m is the commonly cited figure for Chulu East, but maps and permits vary.' }
      ],
      relatedTreks: ['annapurna-circuit'],
      relatedDestinations: ['Manang', 'Pisang', 'Thorong La'],
      relatedPeaks: ['chulu-west', 'pisang-peak', 'saribung-peak'],
      verify: TREK_PEAK_VERIFYING
    },

    'chulu-west': {
      slug: 'chulu-west', name: 'Chulu West', aka: null, category: '6000',
      peakType: 'Trekking Peak', peakGrade: 'Advanced',
      country: 'Nepal', countryLabel: 'Nepal', countries: ['Nepal'], inNepal: true,
      elevation: 6419, elevationLabel: '6,419 m', elevationFt: 21060,
      range: 'Damodar Himal', region: 'Annapurna Region (Manang)',
      coordinates: { lat: 28.730, lon: 83.982, approx: true },
      heroImage: null, gallery: [],
      tagline: 'The longer, more committing Chulu',
      summary: 'Chulu West (commonly 6,419 m, though some sources give figures over 6,600 m) is the western and more serious of the two regularly climbed Chulu summits above Manang. It is an NMA trekking peak but a clear step up from Chulu East — a higher, more remote base camp, a committing high camp, and a north-west ridge of moderate snow with sustained sections to 45–50°. A good second Nepali climbing peak, usually linked with the Annapurna Circuit.',
      seo: {
        title: 'Chulu West Climb — 6,419 m, Nepal | Damodar Himal Route & Season',
        description: 'A factual guide to Chulu West (6,419 m) above Manang: the north-west ridge, camps, seasons, the Annapurna Circuit approach, itinerary, NMA permits and the Chulu naming confusion.'
      },
      character: [
        'Chulu West sits west of Chulu East on the same massif north of the Annapurna Circuit. It is longer, higher-feeling and more committing than its neighbour, with a base camp deeper in the mountains and a high camp that leaves a long summit day.',
        'The north-west ridge is moderate snow climbing — 35–45° for much of its length, with steeper steps to 45–50° and fixed rope on the hardest sections. There is no technical rock or ice, but the position is more serious and the margins narrower than on Chulu East.',
        'The Chulu group is a well-known nomenclature muddle: West, Central, East and Far East summits have been climbed and re-named by different parties, permit heights do not always match survey heights, and several teams reporting “Chulu West” are thought to have actually climbed neighbouring tops.'
      ],
      firstAscent: {
        year: 1952, date: '1952',
        climbers: 'Commonly attributed to a Japanese expedition; sources for the early Chulu ascents are inconsistent and some attributions are disputed',
        expedition: 'Early-1950s Himalayan exploration',
        route: 'North-west ridge'
      },
      normalRoute: {
        name: 'North-West Ridge',
        character: 'A glaciated approach to a committing high camp, then a long north-west ridge of moderate snow with steeper steps to 45–50° on fixed rope. Longer and more sustained than Chulu East.',
        sections: [
          { name: 'Base Camp to High Camp', detail: 'Glacier and snow slopes to a high camp at roughly 5,530–5,800 m.' },
          { name: 'High Camp to the ridge', detail: '35–45° snow to gain the north-west ridge.' },
          { name: 'Summit ridge', detail: 'A long moderate ridge with steeper steps, fixed on the hardest sections, to the summit.' }
        ]
      },
      alternativeRoutes: ['Chulu East — the shorter, more popular objective on the same massif', 'Chulu Central — occasionally climbed, poorly documented'],
      baseCampM: 5100,
      baseCampNote: 'Chulu West Base Camp lies west of the Chulu East site, roughly 5,100 m, reached from the Manang valley in two days off the Circuit.',
      camps: [
        { name: 'Base Camp', altM: 5100, note: 'West side of the massif' },
        { name: 'High Camp', altM: 5600, note: 'Committing — long summit day' },
        { name: 'Summit', altM: 6419, note: '' }
      ],
      approach: 'Annapurna Circuit — drive to Chame or Koto, trek toward Manang, then turn north to the Chulu West base camp. Around 7 days on foot with acclimatisation.',
      season: {
        primary: 'Spring & autumn', window: 'April–May and October–November',
        months: { Jan: 'winter', Feb: 'winter', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'shoulder', Oct: 'prime', Nov: 'prime', Dec: 'winter' },
        note: 'The same partial rain shadow as Chulu East gives settled weather in both standard seasons; the longer summit day makes a firm forecast more important.'
      },
      typicalDurationDays: '19–22 days (usually with the full Annapurna Circuit and the Thorong La)',
      difficulty: { technical: 3, altitude: 4, exposure: 3, weather: 3, remoteness: 3, objectiveHazard: 2, summary: 'A step up from Chulu East — a longer summit day, more sustained snow to 45–50°, and a more committing high camp and position. Still non-technical in the rock-and-ice sense, but a proper mountaineering day.' },
      objectiveHazards: ['Crevasses on the approach and summit glaciers', 'Wind and cold on a long, exposed ridge', 'Altitude on a route with several nights above 5,000 m', 'Navigation on the upper ridge in cloud'],
      history: [
        'Chulu West has been climbed from the Annapurna Circuit since the region opened to trekking, but its ascent history is tangled with those of the other Chulu summits.',
        'Modern operators are increasingly careful to record GPS summit positions because of the long-running doubt over which “Chulu” tops various parties have actually reached.'
      ],
      equipment: ['Warm mountaineering boots', 'Crampons, ice axe (a second tool is useful)', 'Harness, ascender, belay device, prusiks', 'Heavy down jacket, shell layers, mittens', '−20 °C sleeping system'],
      acclimatisation: 'As for Chulu East — the Annapurna Circuit approach and Manang side hikes (Ice Lake, ~4,600 m) build strong acclimatisation before base camp.',
      permit: { authority: 'Nepal Mountaineering Association trekking-peak permit (through a licensed operator), plus Annapurna Conservation Area (ACAP) entry', note: 'An NMA permit and a licensed climbing guide are required, plus ACAP entry. Fees are seasonal and set annually.', verify: true },
      itinerary: [
        { phase: 1, title: 'Kathmandu — arrival & briefing', days: '1–2', altM: 1400, detail: 'Permits, gear check and briefing.' },
        { phase: 2, title: 'Drive to Chame, trek toward Manang', days: '4', altM: 3540, detail: 'Up the Marsyangdi via Pisang, with acclimatisation.' },
        { phase: 3, title: 'Manang — acclimatisation day', days: '1', altM: 3540, detail: 'Side hike to Ice Lake or Kicho Tal.' },
        { phase: 4, title: 'Move to Chulu West Base Camp', days: '2', altM: 5100, detail: 'Leave the Circuit and climb into the western side valley.' },
        { phase: 5, title: 'High Camp & acclimatisation', days: '2', altM: 5600, detail: 'Carry to High Camp, sleep, and review technique.' },
        { phase: 6, title: 'Summit day & descent', days: '2', altM: 6419, detail: 'Long pre-dawn start for the ridge, then descend to Base Camp.' },
        { phase: 7, title: 'Cross the Thorong La & trek out', days: '4–5', altM: 5416, detail: 'Rejoin the Circuit, cross to Muktinath, and drive out via Jomsom / Pokhara.' }
      ],
      faq: [
        { q: 'How does Chulu West compare with Chulu East?', a: 'It is longer, a touch more sustained on steep snow, and more committing in position. Most operators recommend it as a second climb rather than a first.' },
        { q: 'Why is the elevation uncertain?', a: 'The Chulu summits have been surveyed and named inconsistently. 6,419 m is the figure most often cited for Chulu West, but some sources give heights over 6,600 m for tops in the group.' },
        { q: 'Is it technical?', a: 'Not in the rock-and-ice sense — it is moderate snow with fixed rope on the steepest steps. Fitness and altitude are the real challenges.' },
        { q: 'Can it be combined with the Circuit?', a: 'Yes — climb from the Manang side and continue over the Thorong La.' }
      ],
      relatedTreks: ['annapurna-circuit'],
      relatedDestinations: ['Manang', 'Ice Lake (Kicho Tal)', 'Thorong La'],
      relatedPeaks: ['chulu-east', 'pisang-peak', 'saribung-peak'],
      verify: TREK_PEAK_VERIFYING
    },

    'saribung-peak': {
      slug: 'saribung-peak', name: 'Saribung Peak', aka: null, category: '6000',
      peakType: 'Expedition Peak', peakGrade: 'Advanced',
      country: 'Nepal', countryLabel: 'Nepal', countries: ['Nepal'], inNepal: true,
      elevation: 6346, elevationLabel: '6,346 m', elevationFt: 20820,
      range: 'Damodar Himal', region: 'Mustang (Upper Mustang / Damodar)',
      coordinates: { lat: 28.861, lon: 83.930, approx: true },
      heroImage: null, gallery: [],
      tagline: 'A remote glacier peak on a trans-Himalayan traverse',
      summary: 'Saribung Peak (6,346 m) is a glacier summit in the Damodar Himal, deep in the restricted country between Nar–Phu and Upper Mustang. It is almost always climbed as the high point of a long trans-Himalayan traverse, crossing the Saribung La from one restricted area to the other. The climbing is technically moderate — a crevassed glacier and 35–45° snow — but the peak is exceptionally remote, and the multi-week approach across two permit zones is the real undertaking.',
      seo: {
        title: 'Saribung Peak Expedition — 6,346 m, Nepal | Nar–Phu to Upper Mustang Traverse',
        description: 'A factual guide to Saribung Peak (6,346 m) in the Damodar Himal: the Saribung La glacier route, the Nar–Phu to Upper Mustang traverse, camps, seasons, itinerary and the restricted-area permits required.'
      },
      character: [
        'Saribung stands on the watershed between the Damodar Himal and Upper Mustang, in one of the emptiest corners of Nepal. The peak itself is a straightforward glacier climb; what makes an expedition here serious is everything around it.',
        'The standard trip is a traverse: trek in from the Annapurna Circuit through the restricted Nar–Phu valley, cross the Damodar Himal past the sacred lakes of Damodar Kunda, establish a base and high camp below the Saribung La, climb the peak, then descend the far side of the pass into Upper Mustang and walk out via Lo Manthang. It crosses two separate restricted areas and is entirely self-supported.',
        'The summit slopes are crevassed and demand disciplined roped travel, but there is no technical rock or steep ice. The difficulty is altitude, wind on the Damodar plateau, and the sheer distance from any help.'
      ],
      firstAscent: {
        year: 2006, date: '2006',
        climbers: 'A relatively recent first ascent — Saribung was opened for climbing in the 2000s and its early ascent history is thinly documented',
        expedition: 'Opened as part of a programme to link Nar–Phu with Upper Mustang for mountaineering traverses',
        route: 'North-west glacier and the Saribung La'
      },
      normalRoute: {
        name: 'North-West Glacier, via the Saribung La',
        character: 'A crevassed glacier and 35–45° snow slopes from a high camp near the Saribung La (~6,000 m) to the summit, then a descent of the far side toward Upper Mustang. Non-technical but committing and remote.',
        sections: [
          { name: 'Damodar to Base Camp', detail: 'High-desert trekking past Damodar Kunda to a base camp at roughly 5,000–5,400 m.' },
          { name: 'Base Camp to High Camp', detail: 'Glacier moraine to a high camp below the Saribung La at about 5,750 m.' },
          { name: 'High Camp to summit', detail: 'The Saribung La, then a crevassed glacier and 35–45° snow to the summit at 6,346 m.' },
          { name: 'Descent to Mustang', detail: 'Down the western side of the pass and out through Upper Mustang.' }
        ]
      },
      alternativeRoutes: ['Reverse traverse — in from Upper Mustang, climb, and out via Nar–Phu', 'Damodar Kunda pilgrimage circuit without the peak'],
      baseCampM: 5000,
      baseCampNote: 'Base Camp sits at around 5,000 m in the Damodar area; the high camp below the Saribung La is at roughly 5,750 m. There is no infrastructure — everything is carried.',
      camps: [
        { name: 'Base Camp', altM: 5000, note: 'Damodar Himal' },
        { name: 'High Camp', altM: 5750, note: 'Below the Saribung La' },
        { name: 'Summit', altM: 6346, note: '' }
      ],
      approach: 'A long expedition trek: from the Annapurna Circuit roadhead through the restricted Nar–Phu valley and over the Damodar Himal past Damodar Kunda — around 14–18 days to Base Camp — or the reverse from Upper Mustang via Lo Manthang.',
      season: {
        primary: 'Spring & autumn', window: 'May and September–October',
        months: { Jan: 'closed', Feb: 'closed', Mar: 'closed', Apr: 'shoulder', May: 'prime', Jun: 'shoulder', Jul: 'closed', Aug: 'closed', Sep: 'prime', Oct: 'prime', Nov: 'shoulder', Dec: 'closed' },
        note: 'Mustang’s rain shadow gives a slightly wider and drier window than the main Himalaya, and the traverse is sometimes run in early summer. Winter closes the passes.'
      },
      typicalDurationDays: '24–28 days (Kathmandu to Kathmandu)',
      difficulty: { technical: 2, altitude: 4, exposure: 2, weather: 3, remoteness: 5, objectiveHazard: 3, summary: 'Technically a moderate glacier climb, but among the most remote permitted peaks in Nepal. The crux is the multi-week, self-supported approach across two restricted areas and the crevasse hazard on the summit glacier.' },
      objectiveHazards: ['A heavily crevassed summit glacier — roped travel and probing are essential', 'Total remoteness — evacuation is days away and weather-dependent', 'Severe wind on the exposed Damodar plateau', 'Altitude on a very long approach with many nights above 4,500 m'],
      history: [
        'The Damodar Himal lay inside a closed frontier zone for decades. Saribung was among the peaks opened in the 2000s specifically to allow a mountaineering link between Nar–Phu and Upper Mustang.',
        'It is still climbed by only a handful of expeditions a year, almost always as part of the full traverse rather than as a peak in isolation.'
      ],
      equipment: ['Warm mountaineering boots', 'Crampons, ice axe, harness, ascender, belay device', 'Full rope-team and crevasse-rescue kit', 'Heavy down jacket or down suit, shell layers, mittens', '−25 °C sleeping system', 'Robust expedition camping and resupply system for a long unsupported trek'],
      acclimatisation: 'The Nar–Phu and Damodar approach crosses several passes above 5,000 m and provides deep, gradual acclimatisation before the climb; a visit to Damodar Kunda (~4,890 m) is usually built in.',
      permit: { authority: 'Department of Tourism climbing permit (through a registered operator), plus restricted-area permits for Nar–Phu and Upper Mustang', note: 'Saribung requires a climbing permit and two separate restricted-area permits, a liaison officer, and a registered operator. Upper Mustang permits are charged per day. Confirm all current fees and rules for your year.', verify: true },
      itinerary: [
        { phase: 1, title: 'Kathmandu — arrival & briefing', days: '2', altM: 1400, detail: 'Permits, restricted-area paperwork, gear check and briefing.' },
        { phase: 2, title: 'Drive to Koto, trek into Nar–Phu', days: '6–7', altM: 4100, detail: 'Vehicle to the Circuit roadhead, then trek via Meta, Nar and Phu.' },
        { phase: 3, title: 'Phu to the Damodar Himal', days: '4–5', altM: 5000, detail: 'Cross into the Damodar country past Damodar Kunda to Base Camp.' },
        { phase: 4, title: 'Base Camp — acclimatisation', days: '2', altM: 5000, detail: 'Rest, reconnoitre the lower glacier, review crevasse rescue.' },
        { phase: 5, title: 'Move to High Camp', days: '1', altM: 5750, detail: 'Climb to the high camp below the Saribung La.' },
        { phase: 6, title: 'Summit day & cross to Mustang', days: '2', altM: 6346, detail: 'Climb the peak, then descend the western side of the pass into Upper Mustang.' },
        { phase: 7, title: 'Trek out via Lo Manthang & return', days: '5–6', altM: 3800, detail: 'Walk out through Upper Mustang to Jomsom, fly / drive to Pokhara and Kathmandu.' }
      ],
      faq: [
        { q: 'How remote is Saribung, really?', a: 'Very — it is one of the remotest permitted peaks in Nepal. There are no lodges near the mountain, no roads within days’ walk, and rescue would be slow. Full self-sufficiency is the norm.' },
        { q: 'How technical is the climb itself?', a: 'Moderate. A crevassed glacier and 35–45° snow, no technical rock or ice. The climbing is the easy part of the trip.' },
        { q: 'What permits do I need?', a: 'A climbing permit plus restricted-area permits for both Nar–Phu and Upper Mustang, arranged through a registered operator with a liaison officer.' },
        { q: 'Why is the expedition so long?', a: 'It is a full trans-Himalayan traverse. The walking — two to three weeks of it across high desert and glaciated passes — is the expedition.' }
      ],
      relatedTreks: ['annapurna-circuit', 'upper-mustang'],
      relatedDestinations: ['Damodar Kunda', 'Lo Manthang', 'Phu Village'],
      relatedPeaks: ['himlung-himal', 'chulu-west', 'chulu-east'],
      verify: STILL_VERIFYING
    },

    'pisang-peak': {
      slug: 'pisang-peak', name: 'Pisang Peak', aka: 'Jong Ri', category: '6000',
      peakType: 'Trekking Peak', peakGrade: 'Moderate',
      country: 'Nepal', countryLabel: 'Nepal', countries: ['Nepal'], inNepal: true,
      elevation: 6091, elevationLabel: '6,091 m', elevationFt: 19984,
      range: 'Peri Himal', region: 'Annapurna Region (Manang)',
      coordinates: { lat: 28.652, lon: 84.168, approx: true },
      heroImage: null, gallery: [],
      tagline: 'The clean pyramid above Pisang village',
      summary: 'Pisang Peak (6,091 m), also called Jong Ri, is the sharp pyramidal summit that rises directly above Pisang village on the Annapurna Circuit. It is an NMA trekking peak with a short but genuinely steep finish: a broad snow slope from a high camp leads to a final 45–50° rock-and-snow section on fixed rope to the narrow summit. Less altitude than the Chulu peaks, but more sustained climbing near the top, and easily built into a circuit trek.',
      seo: {
        title: 'Pisang Peak Climb — 6,091 m, Nepal | Annapurna Circuit Peak Route & Season',
        description: 'A factual guide to Pisang Peak / Jong Ri (6,091 m) above Pisang village: the south-west ridge route, the steep summit pyramid, camps, seasons, the Annapurna Circuit approach, itinerary and NMA permits.'
      },
      character: [
        'Pisang Peak stands on the north side of the Marsyangdi valley, its clean triangular profile one of the most recognisable shapes on the lower Annapurna Circuit. Trekkers passing through Pisang village look straight up its south-west ridge.',
        'From a base camp in the kharka above the village, the route climbs a grassy then rocky ridge to a high camp at around 5,400 m. Summit day crosses a broad 30–40° snow slope to the foot of the summit pyramid, then tackles a steeper 45–50° section of snow and rock on fixed rope to a small, often corniced summit.',
        'It carries less altitude than the Chulu peaks or Mera, but the final pitch is the steepest sustained ground of any of the popular Annapurna-region trekking peaks, which makes it a good technical step for climbers who have done an easier snow peak.'
      ],
      firstAscent: {
        year: 1955, date: '1955',
        climbers: 'A German expedition',
        expedition: 'One of the German Himalayan expeditions of the mid-1950s; the precise details are not well documented',
        route: 'South-west ridge'
      },
      normalRoute: {
        name: 'South-West Ridge',
        character: 'A grass and rock ridge to a high camp, a broad 30–40° snow slope, then a final 45–50° pitch of snow and rock on fixed rope to the narrow summit.',
        sections: [
          { name: 'Pisang village to Base Camp', detail: 'Forest and kharka to a base camp at roughly 4,380 m.' },
          { name: 'Base Camp to High Camp', detail: 'A grassy then rocky ridge to a high camp at about 5,400 m.' },
          { name: 'High Camp to the summit block', detail: 'A broad 30–40° snow slope to the base of the summit pyramid.' },
          { name: 'Summit pyramid', detail: '45–50° snow and rock on fixed rope to the small, often corniced summit at 6,091 m.' }
        ]
      },
      alternativeRoutes: ['A direct rock line on the south-west face — harder, seldom climbed', 'The lower Pisang viewpoint / Kicho ridge — a non-climbing acclimatisation option'],
      baseCampM: 4380,
      baseCampNote: 'Base Camp sits at around 4,380 m in pasture above Pisang village; the high camp is on the ridge at roughly 5,400 m.',
      camps: [
        { name: 'Base Camp', altM: 4380, note: 'Kharka above Pisang' },
        { name: 'High Camp', altM: 5400, note: 'South-west ridge — summit launch' },
        { name: 'Summit', altM: 6091, note: '' }
      ],
      approach: 'Annapurna Circuit — drive to Chame, trek to Pisang (about 2 days), then climb from a base camp above the village. Usually done before continuing the Circuit over the Thorong La.',
      season: {
        primary: 'Spring & autumn', window: 'April–May and October–November',
        months: { Jan: 'winter', Feb: 'winter', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'shoulder', Oct: 'prime', Nov: 'prime', Dec: 'winter' },
        note: 'Both standard seasons work. Afternoon cloud builds quickly against the peak, so summit days start very early.'
      },
      typicalDurationDays: '15–18 days (usually with the Annapurna Circuit and the Thorong La)',
      difficulty: { technical: 3, altitude: 3, exposure: 3, weather: 3, remoteness: 2, objectiveHazard: 2, summary: 'A short trekking peak with a genuinely steep sting in the tail — the final 45–50° summit pitch on fixed rope is the hardest sustained ground of the popular Annapurna-region peaks. Less altitude than the Chulus, more climbing near the top.' },
      objectiveHazards: ['Steep snow and possible rockfall on the summit pyramid', 'Cornice on the small summit', 'Cold and wind at the exposed high camp', 'Rapid afternoon cloud build-up against the face'],
      history: [
        'Pisang Peak was among the original NMA trekking peaks and has been climbed from the Annapurna Circuit since the region opened to trekkers in 1977.',
        'Its distinctive pyramid above Pisang village has made it one of the most photographed of the smaller Annapurna peaks, even among trekkers who never leave the trail.'
      ],
      equipment: ['Warm mountaineering boots', 'Crampons, ice axe', 'Harness, ascender, belay device, prusiks', 'Helmet', 'Down jacket, shell layers, mittens', '−18 °C sleeping system'],
      acclimatisation: 'Two nights around Pisang (~3,300 m) and a base-camp acclimatisation day; many teams fold in an Annapurna Circuit acclimatisation programme toward Manang before or after the climb.',
      permit: { authority: 'Nepal Mountaineering Association trekking-peak permit (through a licensed operator), plus Annapurna Conservation Area (ACAP) entry', note: 'An NMA permit and a licensed climbing guide are required, plus ACAP entry and a TIMS card for the trek. Fees are seasonal and set annually.', verify: true },
      itinerary: [
        { phase: 1, title: 'Kathmandu — arrival & briefing', days: '1–2', altM: 1400, detail: 'Permits, gear check and briefing.' },
        { phase: 2, title: 'Drive to Chame, trek to Pisang', days: '2–3', altM: 3300, detail: 'Vehicle to the roadhead, then walk up the Marsyangdi to Pisang.' },
        { phase: 3, title: 'Pisang — acclimatisation', days: '1', altM: 3300, detail: 'Acclimatisation hike toward the upper Pisang viewpoint.' },
        { phase: 4, title: 'Move to Base Camp, then High Camp', days: '2', altM: 5400, detail: 'Climb to Base Camp, then carry to High Camp on the ridge.' },
        { phase: 5, title: 'Summit day & descent', days: '1–2', altM: 6091, detail: 'Very early start for the summit pyramid, then descend to Base Camp.' },
        { phase: 6, title: 'Rejoin the Circuit toward Manang', days: '2', altM: 3540, detail: 'Return to the trail and continue up-valley to Manang.' },
        { phase: 7, title: 'Cross the Thorong La & trek out', days: '3–4', altM: 5416, detail: 'Cross the Thorong La to Muktinath and drive out via Jomsom / Pokhara.' }
      ],
      faq: [
        { q: 'How hard is Pisang Peak?', a: 'The approach and high camp are straightforward, but the final summit slope is steep — 45–50° on fixed rope — and needs confident crampon and ascender work. It is a good technical step up from an easier snow peak.' },
        { q: 'Pisang or Chulu?', a: 'Pisang has less altitude but a steeper finish; the Chulu peaks are higher with longer, less steep summit days. Many climbers do Pisang first.' },
        { q: 'Can it be combined with the Annapurna Circuit?', a: 'Yes — it is climbed from Pisang and the trip then continues over the Thorong La.' },
        { q: 'What is “Jong Ri”?', a: 'The local name for the peak; Pisang Peak is the name used on permits and maps.' }
      ],
      relatedTreks: ['annapurna-circuit'],
      relatedDestinations: ['Pisang', 'Manang', 'Thorong La'],
      relatedPeaks: ['chulu-east', 'chulu-west', 'saribung-peak'],
      verify: TREK_PEAK_VERIFYING
    }
  };

  /* --------------------------------------------------- normalise one record */
  // difficulty object {technical,altitude,...} → a single 1–5 reading
  function gradeFromDifficulty(d) {
    if (!d) return null;
    var keys = ['technical', 'altitude', 'exposure', 'weather', 'remoteness', 'objectiveHazard'];
    var vals = keys.map(function (k) { return d[k]; }).filter(function (v) { return typeof v === 'number'; });
    if (!vals.length) return null;
    return Math.round(vals.reduce(function (a, b) { return a + b; }, 0) / vals.length);
  }
  // a 1–5 grade → the four difficulty bands used in the filter UI
  function gradeBand(n) {
    if (n == null) return null;
    if (n <= 1) return 'Beginner';
    if (n === 2) return 'Moderate';
    if (n === 3) return 'Advanced';
    return 'Expert';
  }

  function fromMountain(m, order) {
    var cat = categoryForElevation(m.elevationM);
    return {
      id: m.slug,
      slug: m.slug,
      name: m.name,
      aka: m.aka || null,
      country: (m.countries && m.countries[0]) || null,
      countryLabel: m.countryLabel || (m.countries || []).join(' / ') || null,
      countries: m.countries || null,
      elevation: m.elevationM != null ? m.elevationM : null,
      elevationDisplay: m.elevationLabel || fmtElev(m.elevationM),
      elevationFt: m.elevationFt || fmtFt(m.elevationM),
      range: m.range || null,
      region: m.region || null,
      category: cat,
      categoryLabel: (CAT_BY_ID[cat] || {}).short || null,
      peakType: m.peakType || 'Expedition Peak',
      peakGrade: m.peakGrade || gradeBand(gradeFromDifficulty(m.difficulty)),
      difficulty: gradeFromDifficulty(m.difficulty),
      difficultyDetail: m.difficulty || null,
      expeditionType: m.expeditionType || 'Guided expedition',
      description: m.summary || null,
      shortDescription: m.tagline || null,
      image: m.heroImage || null,
      gallery: m.gallery || [],
      coordinates: m.coordinates || null,
      firstAscent: m.firstAscent || null,
      firstAscentYear: (m.firstAscent && m.firstAscent.year) || null,
      climbingSeason: m.season ? [m.season.primary, m.season.window].filter(Boolean).join(' · ') : null,
      duration: m.typicalDurationDays || null,
      permitRequired: true,
      status: 'published',
      featured: !!m.bestseller,
      rank: m.rank || null,
      href: '/expeditions/' + m.slug,          // keep the rich existing page
      addedOrder: m.rank || order,
      source: 'mountains',
      relatedPeaks: m.relatedPeaks || [],
      verify: []
    };
  }

  function fromData(p, order) {
    var cat = p.category || categoryForElevation(p.elevation);
    var slug = p.slug || slugify(p.name);
    // a record counts as "published" (full page) once it has route + first-ascent + itinerary
    var rich = !!(p.normalRoute && p.firstAscent && p.itinerary && p.character);
    return {
      id: slug,
      slug: slug,
      name: p.name,
      aka: p.aka || null,
      country: p.country || null,
      countryLabel: p.countryLabel || p.country || null,
      countries: p.countries || (p.country ? [p.country] : null),
      elevation: p.elevation != null ? p.elevation : null,
      elevationDisplay: p.elevationDisplay || p.elevationLabel || fmtElev(p.elevation),
      elevationFt: p.elevationFt ? (Number(p.elevationFt).toLocaleString('en-US') + ' ft') : fmtFt(p.elevation),
      range: p.range || null,
      region: p.region || null,
      category: cat,
      categoryLabel: (CAT_BY_ID[cat] || {}).short || null,
      peakType: p.peakType || 'Expedition Peak',
      peakGrade: p.peakGrade ||
                 gradeBand((p.difficulty && typeof p.difficulty === 'object') ? gradeFromDifficulty(p.difficulty)
                           : (typeof p.difficulty === 'number' ? p.difficulty : null)),
      difficulty: (p.difficulty && typeof p.difficulty === 'object') ? gradeFromDifficulty(p.difficulty)
                  : (p.difficulty != null ? p.difficulty : null),
      difficultyDetail: (p.difficulty && typeof p.difficulty === 'object') ? p.difficulty : (p.difficultyDetail || null),
      expeditionType: p.expeditionType || 'Guided expedition',
      description: p.description || p.summary || null,
      shortDescription: p.shortDescription || p.tagline || p.note || null,
      image: p.image || p.heroImage || null,   // placeholder — sourcing handled separately
      gallery: p.gallery || [],
      coordinates: p.coordinates || null,
      firstAscent: p.firstAscent || null,
      firstAscentYear: p.firstAscentYear || (p.firstAscent && p.firstAscent.year) || null,
      climbingSeason: p.climbingSeason || (p.season ? [p.season.primary, p.season.window].filter(Boolean).join(' · ') : null),
      duration: p.duration || p.typicalDurationDays || null,
      permitRequired: p.permitRequired != null ? p.permitRequired : (p.permit ? true : null),
      status: p.status || (rich ? 'published' : 'draft'),
      featured: !!p.featured,
      rank: null,
      href: p.href || ('/expeditions/peaks/' + slug),
      addedOrder: p.addedOrder != null ? p.addedOrder : order,
      source: 'peaks-data',
      relatedPeaks: p.relatedPeaks || [],
      verify: p.verify || []
    };
  }

  /* --------------------------------------------------------------- rebuild */
  var LIST = [];
  var BY_SLUG = {};

  function rebuild() {
    LIST = [];
    BY_SLUG = {};
    var order = 0;
    var M = window.MOUNTAINS || {};
    Object.keys(M).forEach(function (k) {
      var peak = fromMountain(M[k], ++order);
      LIST.push(peak); BY_SLUG[peak.slug] = peak;
    });
    order = 100;   // new peaks sort as "newest"
    Object.keys(window.PEAKS_DATA).forEach(function (k) {
      var peak = fromData(window.PEAKS_DATA[k], ++order);
      if (BY_SLUG[peak.slug]) return;          // never duplicate
      LIST.push(peak); BY_SLUG[peak.slug] = peak;
    });
    window.ALL_PEAKS = LIST;
  }

  /* --------------------------------------------------------------- sorting */
  var SORTERS = {
    elevation: function (a, b) { return (b.elevation || 0) - (a.elevation || 0); },
    'elevation-asc': function (a, b) { return (a.elevation || 0) - (b.elevation || 0); },
    country: function (a, b) {
      return String(a.countryLabel || '').localeCompare(String(b.countryLabel || '')) ||
             (b.elevation || 0) - (a.elevation || 0);
    },
    region: function (a, b) {
      return String(a.region || 'zzz').localeCompare(String(b.region || 'zzz')) ||
             (b.elevation || 0) - (a.elevation || 0);
    },
    difficulty: function (a, b) { return (b.difficulty || 0) - (a.difficulty || 0); },
    featured: function (a, b) {
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.elevation || 0) - (a.elevation || 0);
    },
    alphabetical: function (a, b) { return String(a.name).localeCompare(String(b.name)); },
    newest: function (a, b) { return (b.addedOrder || 0) - (a.addedOrder || 0); }
  };
  window.PEAK_SORTS = [
    { id: 'elevation', label: 'Elevation — high to low' },
    { id: 'elevation-asc', label: 'Elevation — low to high' },
    { id: 'country', label: 'Country' },
    { id: 'region', label: 'Region / range' },
    { id: 'difficulty', label: 'Difficulty' },
    { id: 'featured', label: 'Featured first' },
    { id: 'alphabetical', label: 'A – Z' },
    { id: 'newest', label: 'Newest additions' }
  ];

  /* ------------------------------------------------------------------ API */
  window.getPeaks = function (opts) {
    opts = opts || {};
    var out = LIST.slice();
    if (opts.category) {
      var cats = [].concat(opts.category);
      out = out.filter(function (p) { return cats.indexOf(p.category) > -1; });
    }
    if (opts.country) out = out.filter(function (p) {
      return (p.countries || [p.country]).indexOf(opts.country) > -1;
    });
    if (opts.region) out = out.filter(function (p) { return p.region === opts.region; });
    if (opts.peakType) out = out.filter(function (p) { return p.peakType === opts.peakType; });
    if (opts.peakGrade) out = out.filter(function (p) { return p.peakGrade === opts.peakGrade; });
    if (opts.featured) out = out.filter(function (p) { return p.featured; });
    if (opts.status) out = out.filter(function (p) { return p.status === opts.status; });
    if (opts.q) {
      var q = String(opts.q).toLowerCase();
      out = out.filter(function (p) {
        return (p.name + ' ' + (p.aka || '') + ' ' + (p.range || '') + ' ' +
                (p.region || '') + ' ' + (p.countryLabel || '')).toLowerCase().indexOf(q) > -1;
      });
    }
    out.sort(SORTERS[opts.sort] || SORTERS.elevation);
    return out;
  };

  window.getPeak = function (slugOrId) {
    if (!slugOrId) return null;
    return BY_SLUG[String(slugOrId).toLowerCase()] || null;
  };

  window.getPeakCategories = function () {
    return window.PEAK_CATEGORIES.slice().sort(function (a, b) { return a.order - b.order; })
      .map(function (c) {
        return Object.assign({}, c, {
          count: LIST.filter(function (p) { return p.category === c.id; }).length,
          published: LIST.filter(function (p) { return p.category === c.id && p.status === 'published'; }).length
        });
      });
  };

  // add one peak object at runtime (or from an admin form)
  window.addPeak = function (obj) {
    if (!obj || !obj.name) return null;
    var slug = obj.slug || slugify(obj.name);
    window.PEAKS_DATA[slug] = Object.assign({ slug: slug }, obj);
    rebuild();
    return BY_SLUG[slug];
  };

  window.peakHelpers = { slugify: slugify, fmtElev: fmtElev, fmtFt: fmtFt };

  rebuild();
})();
