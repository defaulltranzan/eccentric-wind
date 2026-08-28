/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — EIGHT-THOUSANDERS DATA MODEL
   ----------------------------------------------------------------------------
   The 14 mountains on Earth that rise above 8,000 m. One index page
   (expeditions.html) and one reusable mountain-page template
   (expedition.html + expedition-render.js) render everything from here.

   CONTENT RULE
   Only STATIC facts are written inline — elevations, ranks, coordinates,
   ranges, first-ascent history, the shape of the normal route. Anything
   TIME-SENSITIVE — permit fees, current regulations, route conditions,
   rescue arrangements, operator lists, weather, fatality/success statistics —
   is omitted, kept qualitative, or flagged { verify:true } so the template
   shows a "Confirm before you commit" note. Difficulty scores are a
   comparative editorial reading of established mountaineering literature,
   not a measured index, and are labelled as such.
   ========================================================================== */

window.EXPED_DEFAULTS = {
  disclaimer: 'High-altitude mountaineering involves serious and potentially fatal risks. Professional expedition leadership, appropriate training and prior altitude experience, current route information and comprehensive insurance covering high-altitude rescue are essential. This page is for orientation and planning only — it is not climbing instruction.',

  difficultyNote: 'These profiles are a comparative reading of established mountaineering literature and expedition reports, not a measured index. Real difficulty varies with the route, the season, the conditions on the day and the party. Treat them as a way to compare the 14 peaks against each other, nothing more.',

  seasonsIntro: 'The Himalayan eight-thousanders are climbed mainly in the pre-monsoon spring (April–May), with a smaller autumn window on several peaks. The Karakoram peaks are summer mountains, climbed in July and August. Every one of the 14 has now also been climbed in winter — a specialist undertaking in its own category.',

  planning: {
    intro: 'An 8,000 m expedition is a months-long project that begins a year or more before you fly. This is the orientation; the detail lives on each mountain’s page and, ultimately, with your expedition leader.',
    points: [
      { label: 'Experience', text: 'Expect operators to require prior 6,000 m and often 7,000 m summits, fixed-rope and crampon proficiency, and — for the technical peaks — genuine alpine climbing experience. Cho Oyu and Everest are the usual first 8,000ers; K2, Nanga Parbat, Kangchenjunga and the Gasherbrums are not.' },
      { label: 'Physical preparation', text: 'A 6–12 month structured programme: aerobic base, strength, and long days carrying weight at gradient. Arriving under-prepared makes the altitude far harder to cope with and raises the risk to you and the team.' },
      { label: 'Acclimatisation', text: 'Every expedition uses a rotation strategy — climbing to progressively higher camps and returning to Base Camp to recover — over several weeks before a summit push. Some teams pre-acclimatise at home in hypoxic tents. The strategy is set by your leader for the specific mountain and season.' },
      { label: 'Guides & Sherpa support', text: 'Most commercial 8,000 m expeditions run with a high climber-to-Sherpa or climber-to-guide ratio, fixed ropes on the route, and stocked camps. Ask exactly what is included, who fixes the route, what the turnaround policy is, and how a rescue would be run.' },
      { label: 'Supplemental oxygen', text: 'The majority of commercial ascents use bottled oxygen from around 7,000–7,500 m upward, plus oxygen for sleeping high and for emergencies. Climbing without it is a serious step up in difficulty and risk and should only be considered with the relevant experience.' },
      { label: 'Permits & logistics', text: 'Each mountain has its own permit requirements, liaison-officer rules and access logistics, set by Nepal, Pakistan or China (Tibet) and revised regularly. Your operator arranges these — confirm the current position for your peak and year before committing.' },
      { label: 'Insurance', text: 'You need a policy that explicitly covers mountaineering to the summit altitude, helicopter search and rescue, long-line evacuation where used, and repatriation. Read the exclusions. Carry the policy details on paper and with your leader.' },
      { label: 'Communication & weather', text: 'Expeditions run on satellite communications and a professional mountain weather forecast, which drives the timing of the summit push. Personal satellite messengers are standard.' }
    ]
  },

  safety: {
    intro: 'The hazards below are inherent to climbing above 8,000 m. Good expedition practice manages them; it does not remove them.',
    categories: [
      { name: 'Altitude', text: 'Above 8,000 m — the “death zone” — the body deteriorates even at rest. HAPE and HACE are life-threatening and require immediate descent. Frostbite risk is constant.' },
      { name: 'Extreme weather', text: 'Summit-day windows are short and defined by the jet stream. Being caught high in a storm is one of the deadliest scenarios in the mountains.' },
      { name: 'Avalanche & slab', text: 'Loaded slopes on the approach and the route release with little warning, especially after snowfall or in the afternoon sun.' },
      { name: 'Serac & icefall', text: 'Collapsing ice cliffs — the Khumbu Icefall, K2’s Bottleneck serac, Manaslu’s upper slopes — are objective hazards you can only limit by timing, not avoid.' },
      { name: 'Rock & stonefall', text: 'Couloirs and mixed ground funnel falling rock, worst when the face warms.' },
      { name: 'Crevasses', text: 'Glaciated approaches and upper slopes are crevassed; roped travel and probing are standard.' },
      { name: 'Cold & exposure', text: 'Windchill on summit day routinely reaches −40°C and below. Frostbite and hypothermia end expeditions and cost fingers and toes.' },
      { name: 'Fatigue & judgement', text: 'Exhaustion and hypoxia erode decision-making. A firm, pre-agreed turnaround time is the single most protective rule on any 8,000 m push.' },
      { name: 'Remoteness & rescue', text: 'Helicopter rescue is possible on some Nepal peaks up to a limited altitude and in good weather only; on the Karakoram and Tibetan peaks it is far more constrained. Self-rescue and teammate rescue are the realistic first response high on the mountain.' }
    ]
  },

  planningCta: {
    heading: 'Which summit comes next?',
    sub: 'Talk to someone who has run expeditions on these mountains. We will tell you honestly where you are in your progression and what the right next objective is.',
    actions: [
      { label: 'Explore the mountains', href: '#peaks' },
      { label: 'Plan an expedition', href: '/contact' },
      { label: 'Talk to an expedition expert', href: '/contact' }
    ]
  },

  trust: [
    { title: 'Facts, checked', note: 'Elevations, ranks, coordinates and first-ascent history are static and sourced. Anything that changes is marked to verify.' },
    { title: 'Operated in Nepal since 1993', note: 'Three decades of Himalayan expedition logistics, with Sherpa climbing teams on every departure.' },
    { title: 'Honest about progression', note: 'We will tell you if a mountain is the wrong next step — and what to climb first.' },
    { title: 'Responsible on the mountain', note: 'Fair Sherpa wages and insurance, carry-in carry-out, and a hard turnaround discipline on every push.' }
  ]
};

/* ----------------------------------------------------------------------------
   THE 14 EIGHT-THOUSANDERS  (west to east is not the order; ranked by height)
   -------------------------------------------------------------------------- */
window.MOUNTAINS = {};

MOUNTAINS['everest'] = {
  slug: 'everest',
  bestseller: 1,
  name: 'Mount Everest',
  aka: 'Sagarmatha · Chomolungma',
  rank: 1,
  elevationM: 8849, elevationLabel: '8,848.86 m', elevationFt: 29032,
  countries: ['Nepal', 'China (Tibet)'], countryLabel: 'Nepal / China',
  range: 'Mahalangur Himalaya', region: 'Khumbu, Nepal / Tingri, Tibet',
  coordinates: { lat: 27.9881, lon: 86.9250 },
  inNepal: true,
  heroImage: '/images/everest_real.jpg',
  gallery: ['/images/everest_real.jpg', '/images/ebc.png', '/images/hero-mountain.jpg'],
  tagline: 'The highest point on Earth',
  summary: 'The highest mountain on Earth at 8,848.86 m, on the Nepal–Tibet border in the Mahalangur Himalaya. First climbed in 1953. The two normal routes — the South Col from Nepal and the Northeast Ridge from Tibet — are non-technical by 8,000 m standards but sustained, crowded in season, and unforgiving of any mistake in the death zone.',
  seo: {
    title: 'Mount Everest Expedition — 8,848.86 m | Routes, History, Season & Planning',
    description: 'A factual guide to Mount Everest, the highest mountain on Earth: elevation and rank, the South Col and Northeast Ridge routes, camps, first-ascent history, climbing season and expedition planning orientation.'
  },
  character: [
    'Everest sits astride the Nepal–Tibet border at the head of the Khumbu valley, the highest of a cluster of giants — Lhotse, Nuptse and Changtse — that share its glaciers. Its summit is roughly 8,849 m above sea level and about 3,700 m above its own base, and the air there holds around a third of the oxygen available at sea level.',
    'By the standards of the 8,000 m peaks it is not technically hard: the South Col route involves the Khumbu Icefall, the long Western Cwm, the Lhotse Face, and a final ridge with the Hillary Step, but no sustained steep climbing. What makes Everest serious is scale and altitude — days spent above 7,000 m, a summit day of 12–18 hours from the South Col, extreme cold and wind, and, in the commercial season, large numbers of climbers moving on fixed ropes through a small number of weather windows.',
    'The Northeast Ridge from Tibet is a similar grade with a longer, colder, higher exposed summit ridge and the three rock “Steps”. Both routes are fixed with rope each season by Sherpa teams.'
  ],
  firstAscent: {
    year: 1953, date: '29 May 1953',
    climbers: 'Edmund Hillary (New Zealand) and Tenzing Norgay (Nepal/India)',
    expedition: 'British Mount Everest Expedition, led by John Hunt',
    route: 'South Col and Southeast Ridge (from Nepal)'
  },
  notableAscents: [
    { label: 'First ascent from the north', detail: '1960 — Chinese expedition (Wang Fuzhou, Gonpo, Qu Yinhua), Northeast Ridge.' },
    { label: 'First ascent without supplemental oxygen', detail: '1978 — Reinhold Messner and Peter Habeler.' },
    { label: 'First solo ascent (and without oxygen)', detail: '1980 — Reinhold Messner, from the north in the monsoon period.' },
    { label: 'First winter ascent', detail: '1980 — Leszek Cichy and Krzysztof Wielicki (Polish expedition).' },
    { label: 'First female ascent', detail: '1975 — Junko Tabei (Japan). First woman from the north: Phanthog (China), also 1975.' }
  ],
  normalRoute: {
    name: 'South Col Route (Southeast Ridge), from Nepal',
    character: 'Non-technical by 8,000 m standards but long, high and objectively hazardous in the Icefall. Fixed with rope each season.',
    sections: [
      { name: 'Khumbu Icefall', detail: 'A shifting maze of seracs and crevasses between Base Camp and Camp 1, crossed on ladders and fixed lines, ideally before dawn. The single most dangerous section of the route.' },
      { name: 'Western Cwm', detail: 'A broad, glaciated valley from Camp 1 to Camp 2 (Advanced Base Camp). Deceptively hot and airless by mid-morning.' },
      { name: 'Lhotse Face', detail: 'A 1,000 m wall of hard blue ice, climbed on fixed rope to Camp 3 at around 7,200 m.' },
      { name: 'Geneva Spur & Yellow Band', detail: 'Mixed rock and ice traverses leading to the South Col.' },
      { name: 'South Col (Camp 4)', detail: 'A stony saddle at about 7,950 m between Everest and Lhotse — the launch point for the summit, and a place you do not want to be stuck.' },
      { name: 'Summit ridge', detail: 'The Balcony, the South Summit, the corniced ridge and the Hillary Step (~8,790 m), then the final snow slopes to the summit.' }
    ]
  },
  alternativeRoutes: ['Northeast Ridge (Tibet) — the other normal route', 'West Ridge (1963, Hornbein–Unsoeld) — rarely repeated', 'South-West Face (1975) — a serious big-wall objective', 'Kangshung (East) Face — remote and hazardous, seldom attempted'],
  baseCampM: 5364,
  baseCampNote: 'South Base Camp sits on the Khumbu Glacier at about 5,364 m, reached on foot in 8–10 days from Lukla. The North (Tibet) Base Camp is a vehicle-accessible site at about 5,150 m, with Advanced Base Camp at ~6,400 m.',
  camps: [
    { name: 'Base Camp', altM: 5364, note: 'Khumbu Glacier' },
    { name: 'Camp 1', altM: 6050, note: 'Top of the Icefall' },
    { name: 'Camp 2 (ABC)', altM: 6400, note: 'Head of the Western Cwm' },
    { name: 'Camp 3', altM: 7200, note: 'Mid Lhotse Face' },
    { name: 'Camp 4 (South Col)', altM: 7950, note: 'Death zone — summit launch' },
    { name: 'Summit', altM: 8849, note: '' }
  ],
  approach: 'Nepal side: fly Kathmandu–Lukla, then the standard Everest Base Camp trek (8–10 days) with the expedition caravan. Tibet side: drive from Kathmandu or Lhasa to a Base Camp near Rongbuk, subject to Chinese access rules.',
  season: {
    primary: 'Spring', window: 'April–May',
    months: { Jan: 'winter', Feb: 'winter', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'rare', Oct: 'rare', Nov: 'closed', Dec: 'winter' },
    note: 'The overwhelming majority of ascents are in the pre-monsoon spring, with summit windows typically mid- to late May. A small autumn season exists but is cold, snowy and lightly used. Winter ascents have been made but are exceptional.'
  },
  typicalDurationDays: '55–65 days (Nepal side, including trek and acclimatisation)',
  difficulty: { technical: 2, altitude: 5, exposure: 3, weather: 4, remoteness: 2, objectiveHazard: 4, summary: 'Non-technical but extreme altitude, long summit days, severe cold, and the objective danger of the Khumbu Icefall. Route congestion in peak season adds its own risk.' },
  objectiveHazards: ['Khumbu Icefall serac collapse and crevasse falls', 'Avalanche onto the route (notably the 2014 and 2015 events near Base Camp and Camp 1)', 'Extreme windchill and frostbite on summit day', 'Bottlenecks and queuing on fixed ropes in narrow windows', 'HACE / HAPE in the death zone'],
  history: [
    'Everest was identified as the world’s highest mountain by the Great Trigonometrical Survey of India in 1856 and named after Sir George Everest. Early attempts came from the Tibetan side in the 1920s and 1930s — including George Mallory and Andrew Irvine’s disappearance high on the Northeast Ridge in 1924.',
    'After Nepal opened and Tibet closed in the late 1940s, a Swiss expedition came close in 1952, and the British expedition of 1953 put Hillary and Tenzing on the summit via the South Col. The north side was climbed by a Chinese team in 1960, and the mountain was climbed without supplemental oxygen by Messner and Habeler in 1978.',
    'Commercial guided expeditions began in earnest in the 1990s and now account for most ascents. The mountain has been climbed many thousands of times, and remains, for all its infrastructure, a place where people die every year.'
  ],
  logistics: 'A full-service Nepal-side expedition includes Kathmandu logistics and permits, the trek in, a stocked Base Camp with catering and communications, Icefall route maintenance fees, fixed rope on the route, Sherpa climbing support, bottled oxygen, and weather forecasting. Expeditions run roughly two months. Confirm the current permit position, liaison-officer rules and Icefall arrangements for your year.',
  permit: { authority: 'Department of Tourism, Government of Nepal (south side); China Tibet Mountaineering Association (north side)', note: 'Both sides require a climbing permit, a liaison officer or equivalent, and use of a registered operator. Fees and rules are set annually and differ by side and season.', verify: true },
  equipment: ['8,000 m down suit and summit boots', 'High-altitude sleeping system (−40°C and below)', 'Oxygen system (mask, regulator, bottles) for most climbers', 'Crampons, ice axe, harness, ascender, belay device', 'Ladder-crossing technique for the Icefall', 'Goggles and glacier glasses, expedition mittens', 'Personal medical kit and a team medical / oxygen cache'],
  weather: 'Everest’s summit sits in the jet stream for much of the year. Climbable windows open when the jet lifts north, usually briefly in May and again for a short period in autumn. Summit-day temperatures run to −30°C or colder before windchill; winds above 40–50 km/h on the summit ridge stop movement.',
  acclimatisation: 'Standard practice is two or three rotations up the mountain over several weeks — typically touching Camp 1, then Camp 2, then Camp 3 (sometimes with a night on oxygen) — before descending to Base Camp or lower to rest fully, then committing to the summit push on a forecast window.',
  rescue: { note: 'Helicopter evacuation operates from Base Camp and, in good conditions, from Camps 1 and 2; above that, rescue is by climbers and Sherpa teams. The Everest ER clinic operates at Base Camp in season. Arrangements change year to year.', verify: true },
  guideSupport: 'Nepal-side commercial expeditions run with Sherpa climbing teams who fix rope, carry loads, stock camps and climb with clients on summit day. Ratios, oxygen allocation and turnaround policy vary between operators — ask precisely.',
  faq: [
    { q: 'How tall is Mount Everest?', a: '8,848.86 m (29,031.7 ft), the figure jointly announced by Nepal and China in 2020. It is the highest point on Earth above sea level.' },
    { q: 'Which countries is Everest in?', a: 'The summit and the watershed sit on the border between Nepal (Province 1 / Koshi, Khumbu region) and the Tibet Autonomous Region of China.' },
    { q: 'Is Everest technically difficult to climb?', a: 'Not by the standards of the other 8,000 m peaks — the normal routes have no sustained hard climbing. The difficulty is altitude, cold, the length of summit day and the objective danger of the Khumbu Icefall, plus congestion in peak season.' },
    { q: 'When do people climb Everest?', a: 'Almost entirely in the pre-monsoon spring, with summit windows usually in mid- to late May. There is a small, cold autumn season and rare winter ascents.' },
    { q: 'Do you need supplemental oxygen?', a: 'Most climbers use it from around Camp 3 upward. Climbing without oxygen has been done since 1978 but is a major increase in difficulty and risk.' },
    { q: 'How long is an Everest expedition?', a: 'Roughly two months on the Nepal side, including the trek in and several weeks of acclimatisation rotations before a summit push.' },
    { q: 'What experience do I need?', a: 'Reputable operators expect prior high-altitude climbs (commonly a 6,000 m and often a 7,000 m peak), fixed-rope and crampon competence, and the fitness for very long days. Everest is a common first 8,000 m peak for well-prepared climbers.' },
    { q: 'What is the first-ascent history?', a: 'First climbed on 29 May 1953 by Edmund Hillary and Tenzing Norgay (British expedition, South Col route). First without oxygen: Messner and Habeler, 1978. First winter: Cichy and Wielicki, 1980.' }
  ],
  relatedTreks: ['everest-base-camp', 'gokyo-lakes', 'three-passes'],
  relatedDestinations: ['Namche Bazaar', 'Tengboche Monastery', 'Kathmandu — Boudhanath']
};

MOUNTAINS['k2'] = {
  slug: 'k2',
  name: 'K2',
  aka: 'Chhogori · Mount Godwin-Austen',
  rank: 2,
  elevationM: 8611, elevationLabel: '8,611 m', elevationFt: 28251,
  countries: ['Pakistan', 'China'], countryLabel: 'Pakistan / China',
  range: 'Karakoram', region: 'Gilgit-Baltistan, Pakistan / Xinjiang, China',
  coordinates: { lat: 35.8825, lon: 76.5133 },
  inNepal: false,
  heroImage: '/images/hero-mountain.jpg',
  gallery: ['/images/hero-mountain.jpg', '/images/manaslu_real.jpg', '/images/everest_real.jpg'],
  tagline: 'The Savage Mountain',
  summary: 'The second-highest mountain on Earth at 8,611 m, at the head of the Baltoro Glacier in the Karakoram. Steeper, colder, more technical and more remote than Everest, with a short and violent summer weather window. Long regarded as the hardest of the 8,000 m peaks to climb and among the most dangerous.',
  seo: {
    title: 'K2 Expedition — 8,611 m | The Savage Mountain: Routes, History & Season',
    description: 'A factual guide to K2, the second-highest mountain on Earth: elevation and rank, the Abruzzi Spur route and the Bottleneck, first-ascent history, the summer Karakoram season and expedition planning orientation.'
  },
  character: [
    'K2 stands at the far north of the Karakoram, on the border between Pakistan’s Gilgit-Baltistan and China’s Xinjiang, rising as a near-perfect pyramid of rock and ice above the confluence of the Baltoro and Godwin-Austen glaciers. It is only about 240 m lower than Everest but is a fundamentally harder mountain.',
    'Every route on K2 is steep and sustained. The normal line, the Abruzzi Spur, is a rib of rock and ice with named difficulties — House’s Chimney, the Black Pyramid — before it reaches the Shoulder at around 7,900 m. Above that, the Bottleneck: a couloir directly beneath a band of enormous seracs, traversed on fixed rope, that has been the scene of the mountain’s worst disasters.',
    'K2 also has the shortest usable weather window of the 8,000 m peaks — a few spells of settled weather in July and early August — and no easy escape: the approach is a week-long glacier trek from the roadhead, and helicopter support is limited. It was the last 8,000er to be climbed in winter, in January 2021, by an all-Nepali team.'
  ],
  firstAscent: {
    year: 1954, date: '31 July 1954',
    climbers: 'Lino Lacedelli and Achille Compagnoni (Italy)',
    expedition: 'Italian Karakoram Expedition, led by Ardito Desio',
    route: 'Abruzzi Spur (Southeast Ridge)'
  },
  notableAscents: [
    { label: 'First ascent without supplemental oxygen', detail: '1978 — the second ascent overall, by Louis Reichardt (American expedition), soon followed by teammates.' },
    { label: 'First female ascent', detail: '1986 — Wanda Rutkiewicz (Poland), during the deadly 1986 season on the mountain.' },
    { label: 'First winter ascent', detail: '16 January 2021 — Nirmal Purja, Mingma David Sherpa, Mingma Tenzi Sherpa, Dawa Temba Sherpa, Pem Chiri Sherpa, Mingma Gyalje Sherpa, Sona Sherpa, Gelje Sherpa and Kili Pemba Sherpa — an all-Nepali team, the last of the 14 to be climbed in winter.' }
  ],
  normalRoute: {
    name: 'Abruzzi Spur (Southeast Ridge), from Pakistan',
    character: 'Steep, sustained rock and ice with named cruxes, then the Bottleneck traverse beneath hanging seracs. Fixed rope in season, but a serious mountaineering route throughout.',
    sections: [
      { name: 'Advanced Base Camp to Camp 1', detail: 'The base of the spur, on snow and easy rock.' },
      { name: 'House’s Chimney', detail: 'A ~30 m rock chimney around 6,600 m, historically the first real technical crux.' },
      { name: 'Black Pyramid', detail: 'Several hundred metres of steep, loose mixed climbing between Camps 2 and 3 — the hardest sustained ground on the route.' },
      { name: 'The Shoulder', detail: 'A snow ramp at around 7,900 m leading to Camp 4, the last camp before the summit.' },
      { name: 'The Bottleneck', detail: 'A ~100 m couloir at about 8,200 m directly under a serac band, followed by a leftward traverse on steep ice. The most dangerous section of the route.' },
      { name: 'Summit snowfields', detail: 'Steep snow above the traverse to the summit ridge and the top.' }
    ]
  },
  alternativeRoutes: ['Cesen Route (South-Southeast Spur / “Basque Route”) — the other commonly climbed line', 'North Ridge (China) — remote, committing, rarely attempted', 'West Face, South Face (“Central Rib”), Northwest Ridge — elite alpine objectives'],
  baseCampM: 5150,
  baseCampNote: 'Base Camp sits on the Godwin-Austen Glacier at about 5,150 m, reached by a 7–8 day trek up the Baltoro Glacier from Askole, the roadhead.',
  camps: [
    { name: 'Base Camp', altM: 5150, note: 'Godwin-Austen Glacier' },
    { name: 'Camp 1', altM: 6050, note: 'Base of the spur' },
    { name: 'Camp 2', altM: 6700, note: 'Above House’s Chimney' },
    { name: 'Camp 3', altM: 7300, note: 'Top of the Black Pyramid' },
    { name: 'Camp 4', altM: 7900, note: 'The Shoulder — summit launch' },
    { name: 'Summit', altM: 8611, note: '' }
  ],
  approach: 'Fly or drive Islamabad–Skardu, then jeep to Askole and a 7–8 day trek up the Baltoro Glacier via Concordia to Base Camp. The trek out is the same. Total access is around two weeks return.',
  season: {
    primary: 'Summer', window: 'July (into early August)',
    months: { Jan: 'winter', Feb: 'winter', Mar: 'closed', Apr: 'closed', May: 'rare', Jun: 'shoulder', Jul: 'prime', Aug: 'shoulder', Sep: 'rare', Oct: 'closed', Nov: 'closed', Dec: 'winter' },
    note: 'K2 is a summer mountain. Usable windows are a small number of settled spells in July and early August; June and late August are marginal. The winter ascent of 2021 was a landmark expedition, not a season.'
  },
  typicalDurationDays: '50–65 days (including the Baltoro trek in and out)',
  difficulty: { technical: 5, altitude: 5, exposure: 5, weather: 5, remoteness: 4, objectiveHazard: 5, summary: 'The benchmark hard 8,000 m peak: sustained technical climbing, extreme exposure, a brutal weather window, a week-long glacier approach, and the Bottleneck serac overhead on summit day.' },
  objectiveHazards: ['The Bottleneck serac — sudden, total ice-cliff collapse onto the route', 'Storms arriving fast with no easy retreat from high on the mountain', 'Rockfall in the Black Pyramid and couloirs', 'Avalanche on the Shoulder and approach slopes', 'Crevasse hazard on the Godwin-Austen Glacier', 'Extreme cold and windchill; very limited high-altitude rescue'],
  history: [
    'K2 takes its name from the Karakoram survey notation of the 1850s — the second peak measured — and the label stuck because it has no single well-established local name. It was reconnoitred by the Duke of the Abruzzi’s Italian expedition in 1909, which explored the spur that now bears his name.',
    'American expeditions came close in 1938, 1939 and 1953 — the 1953 expedition famous for Pete Schoening’s belay that held a falling roped team. The Italians summited in 1954 via the Abruzzi Spur.',
    'The mountain has a hard history: 1986 saw thirteen deaths across the season, and 2008 saw eleven in a single serac-triggered accident above the Bottleneck. K2 has never had the infrastructure of Everest, though guided expeditions and fixed-rope operations have grown since the mid-2010s.'
  ],
  logistics: 'A K2 expedition is a Pakistan-based project: Islamabad and Skardu logistics, a mandatory liaison officer, porters or helicopter lift for the Baltoro approach, a fully stocked Base Camp for the whole team, fixed rope on the route (usually a shared, cost-split effort between operators), Sherpa or high-altitude porter support, and bottled oxygen for most climbers. Confirm current permit and liaison-officer rules, and the fixed-rope arrangement, for your year.',
  permit: { authority: 'Gilgit-Baltistan Council / Ministry of Tourism, Government of Pakistan (south side); China Tibet Mountaineering Association / local authorities (north side)', note: 'The Pakistan side requires a royalty payment, a liaison officer and a registered operator. Fees vary by peak and party size and are revised regularly.', verify: true },
  equipment: ['8,000 m down suit and summit boots', 'Full technical rack familiarity — this is a real climbing route', 'High-altitude sleeping system (−40°C and below)', 'Oxygen system for most climbers', 'Crampons, two tools or an axe plus a technical tool, harness, ascender, belay/rappel device', 'Helmet — mandatory for rock and icefall ground', 'Expedition mittens, goggles, robust glacier glasses'],
  weather: 'The Karakoram summer brings periods of settled high pressure between disturbances tracking off the Arabian Sea and Central Asia. Windows are short. Summit-day temperatures run to −30°C to −40°C before windchill; the mountain’s height and latitude make it colder than its elevation alone suggests.',
  acclimatisation: 'Teams typically run two or three rotations on the Abruzzi Spur — to Camp 1, then Camp 2, then Camp 3 — over three to four weeks, often with an acclimatisation trip on a nearby peak (Broad Peak is sometimes used), before descending to rest and waiting for a forecast window to Camp 4 and the summit.',
  rescue: { note: 'Pakistan Army Aviation helicopters can, in good weather, reach Base Camp and occasionally a little higher; above Camp 1 rescue is by the team. There is no permanent medical facility at Base Camp comparable to Everest ER. Evacuation off the Baltoro is slow. Confirm the current arrangements and insurance requirements.', verify: true },
  guideSupport: 'Commercial K2 expeditions run with experienced Sherpa or Pakistani high-altitude climbers who fix the route and support clients, but the ratio and the amount of independent climbing expected of you are higher than on Everest. This is not a mountain to attempt without prior technical 8,000 m or hard 7,000 m experience.',
  faq: [
    { q: 'How high is K2?', a: '8,611 m (28,251 ft) — the second-highest mountain on Earth, about 238 m lower than Everest.' },
    { q: 'Where is K2?', a: 'At the head of the Baltoro Glacier in the Karakoram range, on the border between Gilgit-Baltistan in Pakistan and Xinjiang in China. The normal route is climbed from the Pakistan side.' },
    { q: 'Why is K2 considered harder than Everest?', a: 'Every route is steeper and more sustained, the weather window is shorter and more violent, the approach is a week-long glacier trek, high-altitude rescue is very limited, and the Bottleneck serac hangs over the summit-day route.' },
    { q: 'When is K2 climbed?', a: 'In the Karakoram summer, with usable windows a small number of settled spells in July and early August. It was first climbed in winter in January 2021.' },
    { q: 'What experience do I need for K2?', a: 'Prior technical experience at altitude — ideally another 8,000 m peak, and hard 6,000–7,000 m routes — plus real competence on steep mixed ground. It is not a first 8,000er.' },
    { q: 'Who first climbed K2?', a: 'Lino Lacedelli and Achille Compagnoni, on 31 July 1954, via the Abruzzi Spur, on the Italian expedition led by Ardito Desio.' },
    { q: 'How long is a K2 expedition?', a: 'Around 50–65 days, including the trek up the Baltoro Glacier and out again and several weeks of acclimatisation.' }
  ],
  relatedTreks: [],
  relatedDestinations: ['Baltoro Glacier & Concordia trek', 'Skardu, Gilgit-Baltistan', 'Trango Towers']
};

MOUNTAINS['kangchenjunga'] = {
  slug: 'kangchenjunga',
  name: 'Kangchenjunga',
  aka: 'Kanchenjunga · “Five Treasures of Snow”',
  rank: 3,
  elevationM: 8586, elevationLabel: '8,586 m', elevationFt: 28169,
  countries: ['Nepal', 'India'], countryLabel: 'Nepal / India',
  range: 'Kangchenjunga Himal', region: 'Taplejung, Nepal / Sikkim, India',
  coordinates: { lat: 27.7025, lon: 88.1475 },
  inNepal: true,
  heroImage: '/images/hero-mountain.jpg',
  gallery: ['/images/hero-mountain.jpg', '/images/manaslu_real.jpg', '/images/langtang_real.jpg'],
  tagline: 'The third pole, on the eastern edge of Nepal',
  summary: 'The third-highest mountain on Earth at 8,586 m, on the Nepal–Sikkim border in far-eastern Nepal. A vast, complex massif of five main summits, remote, weather-exposed and technically demanding, climbed by relatively few. By tradition, climbers stop a few metres short of the true summit out of respect for the mountain’s sanctity in Sikkim.',
  seo: {
    title: 'Kangchenjunga Expedition — 8,586 m | Routes, History, Season & Planning',
    description: 'A factual guide to Kangchenjunga, the third-highest mountain on Earth: elevation and rank, the Southwest Face route, first-ascent history, climbing season and expedition planning orientation.'
  },
  character: [
    'Kangchenjunga is the great mountain of the eastern Himalaya, straddling the border between Taplejung district in Nepal and the Indian state of Sikkim. Its name means roughly “the five treasures of the high snows”, for its five summits, and it was thought to be the highest mountain on Earth until surveys in the 1850s corrected that to Everest.',
    'It is a big, sprawling, serious objective. The normal route, the Southwest (Yalung) Face from Nepal, is long and sustained, with a high, exposed upper section and a summit day that involves genuine climbing above 8,000 m. The mountain is far from any road — the approach is one of the longest trekking-in routes of the 8,000 m peaks — and its position on the eastern rim of the range makes it exceptionally exposed to weather off the Bay of Bengal.',
    'Ascents are relatively few, and the mountain has a reputation for hard, cold days and difficult descents. By a widely respected tradition begun by the first-ascent party, climbers stop just short of the true summit.'
  ],
  firstAscent: {
    year: 1955, date: '25 May 1955',
    climbers: 'George Band and Joe Brown (United Kingdom); Norman Hardie and Tony Streather summited the following day',
    expedition: 'British Kangchenjunga Expedition, led by Charles Evans',
    route: 'Southwest (Yalung) Face, from Nepal'
  },
  notableAscents: [
    { label: 'First ascent without supplemental oxygen', detail: '1979 — Doug Scott, Peter Boardman and Joe Tasker, a lightweight ascent of the North Ridge.' },
    { label: 'First female ascent', detail: '1998 — Ginette Harrison (United Kingdom).' },
    { label: 'First winter ascent', detail: '1986 — Jerzy Kukuczka and Krzysztof Wielicki (Polish expedition).' }
  ],
  normalRoute: {
    name: 'Southwest (Yalung) Face, from Nepal',
    character: 'Long and sustained, with a high, technical and exposed upper face. Fixed rope in season, but a demanding route with a serious summit day above 8,000 m.',
    sections: [
      { name: 'Yalung Glacier to Camp 1', detail: 'Glaciated approach beneath the enormous Southwest Face.' },
      { name: 'The lower face', detail: 'Snow and ice slopes and a rock band leading to Camps 2 and 3, with icefall and serac hazard.' },
      { name: 'The upper face', detail: 'Steepening mixed ground to Camp 4 at around 7,500 m.' },
      { name: 'Summit day', detail: 'A long traverse and a rock gully high on the mountain, then steep snow to the summit ridge — real climbing at extreme altitude.' }
    ]
  },
  alternativeRoutes: ['North Ridge / North Face (from Nepal, via the Kangchenjunga Glacier) — the 1979 lightweight line', 'Northeast Spur (from the former Sikkim side) — the 1977 Indian route', 'Southwest Face direct and other elite alpine lines'],
  baseCampM: 5140,
  baseCampNote: 'Base Camp for the Southwest Face is on the Yalung Glacier at around 5,140–5,500 m, reached by a long trek (roughly 8–11 days) from the Taplejung roadhead in far-eastern Nepal.',
  camps: [
    { name: 'Base Camp', altM: 5400, note: 'Yalung Glacier' },
    { name: 'Camp 1', altM: 6100, note: '' },
    { name: 'Camp 2', altM: 6600, note: '' },
    { name: 'Camp 3', altM: 7100, note: '' },
    { name: 'Camp 4', altM: 7500, note: 'Summit launch' },
    { name: 'Summit', altM: 8586, note: 'By tradition, climbers stop a few metres below the true top' }
  ],
  approach: 'Fly Kathmandu–Bhadrapur, then a long drive to Taplejung, and 8–11 days trekking in via the Yalung valley (much of the Kangchenjunga South Base Camp trekking route). The remoteness of the approach is part of the expedition’s difficulty.',
  season: {
    primary: 'Spring', window: 'April–May',
    months: { Jan: 'winter', Feb: 'winter', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'rare', Oct: 'rare', Nov: 'closed', Dec: 'winter' },
    note: 'Pre-monsoon spring is the main season. Autumn attempts are rare because of cold and the mountain’s exposure. The eastern position makes weather windows less reliable than on the central Nepal peaks.'
  },
  typicalDurationDays: '50–60 days (including the long approach)',
  difficulty: { technical: 4, altitude: 5, exposure: 4, weather: 4, remoteness: 4, objectiveHazard: 4, summary: 'A long, cold, technically sustained route with a hard summit day above 8,000 m, a very long approach, and heightened weather exposure on the eastern rim of the Himalaya.' },
  objectiveHazards: ['Serac and icefall on the lower Southwest Face', 'Avalanche on the face after snowfall', 'Storms arriving from the east with little warning', 'Difficult, disorienting descent from the high traverse in poor visibility', 'Extreme cold on a long summit day'],
  history: [
    'Kangchenjunga was attempted from the Sikkim side by Aleister Crowley’s party in 1905 and by German expeditions in the 1930s, all unsuccessful and some fatal. The British reconnaissance of 1954 and full expedition of 1955 found and climbed the Southwest Face from Nepal.',
    'Out of respect for the beliefs of the people of Sikkim, for whom the summit is sacred, Charles Evans’s team stopped a few metres short of the true top — a tradition most subsequent expeditions have honoured.',
    'The mountain saw a bold oxygen-free ascent of the North Ridge in 1979 and a winter ascent in 1986, but it has never attracted the numbers of the more accessible 8,000ers, and remains a serious, lightly-travelled objective.'
  ],
  logistics: 'A Kangchenjunga expedition is a long, logistically heavy project because of the approach: a large porter caravan or helicopter lift to Base Camp, a fully stocked and staffed Base Camp for two months, fixed rope on the Southwest Face, Sherpa climbing support, and oxygen for most climbers. Confirm the current permit, liaison-officer and conservation-area rules for the year.',
  permit: { authority: 'Department of Tourism, Government of Nepal, plus Kangchenjunga Conservation Area permits', note: 'A climbing permit, a liaison officer and a registered operator are required, along with conservation-area fees. Rules are revised regularly.', verify: true },
  equipment: ['8,000 m down suit and summit boots', 'High-altitude sleeping system (−40°C and below)', 'Oxygen system for most climbers', 'Crampons, ice axe plus a technical tool, harness, ascender, belay/rappel device', 'Helmet for the face', 'Expedition mittens, goggles, robust glacier glasses'],
  weather: 'Kangchenjunga’s position on the eastern edge of the range exposes it directly to systems from the Bay of Bengal, and its five summits generate their own weather. Spring windows are shorter and less predictable than on Everest, and the upper mountain is bitterly cold.',
  acclimatisation: 'Two or three rotations on the Southwest Face over three to four weeks — typically to Camp 1, then Camp 2, then a touch of Camp 3 — before descending to Base Camp to recover and committing to a summit push on a forecast window.',
  rescue: { note: 'Helicopter evacuation is possible from Base Camp and, in good conditions, a little higher, but the remoteness of the region and the distance to a hospital make rescue slow and weather-dependent. Confirm current arrangements and carry appropriate insurance.', verify: true },
  guideSupport: 'Commercial expeditions run with Sherpa climbing teams who fix the route and support clients, but Kangchenjunga expects more independent competence than Everest — prior 8,000 m experience is the norm.',
  faq: [
    { q: 'How high is Kangchenjunga?', a: '8,586 m (28,169 ft) — the third-highest mountain on Earth.' },
    { q: 'Where is Kangchenjunga?', a: 'On the border between Taplejung district in far-eastern Nepal and the Indian state of Sikkim, in the Kangchenjunga Himal.' },
    { q: 'Why do climbers stop below the summit?', a: 'The 1955 first-ascent party stopped a few metres short of the true top out of respect for the mountain’s sanctity to the people of Sikkim. Most expeditions have honoured that tradition since.' },
    { q: 'Is Kangchenjunga harder than Everest?', a: 'Technically and logistically, yes — a longer, more sustained route, a much longer approach, a harder summit day above 8,000 m, and greater weather exposure. It sees a fraction of Everest’s traffic.' },
    { q: 'When is Kangchenjunga climbed?', a: 'Mainly in the pre-monsoon spring (April–May). Autumn and winter attempts are rare.' },
    { q: 'Who first climbed Kangchenjunga?', a: 'George Band and Joe Brown on 25 May 1955 (British expedition led by Charles Evans, Southwest Face), stopping just below the true summit.' }
  ],
  relatedTreks: ['kanchenjunga-base-camp'],
  relatedDestinations: ['Kangchenjunga Conservation Area', 'Ilam tea country', 'Taplejung']
};

MOUNTAINS['lhotse'] = {
  slug: 'lhotse',
  bestseller: 3,
  name: 'Lhotse',
  aka: '“South Peak” (of Everest)',
  rank: 4,
  elevationM: 8516, elevationLabel: '8,516 m', elevationFt: 27940,
  countries: ['Nepal', 'China (Tibet)'], countryLabel: 'Nepal / China',
  range: 'Mahalangur Himalaya', region: 'Khumbu, Nepal / Tibet',
  coordinates: { lat: 27.9617, lon: 86.9333 },
  inNepal: true,
  heroImage: '/images/ebc.png',
  gallery: ['/images/ebc.png', '/images/everest_real.jpg', '/images/hero-mountain.jpg'],
  tagline: 'Everest’s southern neighbour — and a mountain in its own right',
  summary: 'The fourth-highest mountain on Earth at 8,516 m, connected to Everest by the South Col. The normal route shares Everest’s line to Camp 3, then breaks off up the steep Lhotse Couloir. Often climbed as a paired objective with Everest, but the couloir makes it a real climb in the final 500 metres.',
  seo: {
    title: 'Lhotse Expedition — 8,516 m | The Lhotse Couloir: Routes, History & Season',
    description: 'A factual guide to Lhotse, the fourth-highest mountain on Earth: elevation and rank, the West Face and Lhotse Couloir route shared with Everest, first-ascent history, season and planning orientation.'
  },
  character: [
    'Lhotse — Tibetan for “south peak” — is the great wall that closes the head of the Western Cwm behind Everest, joined to it by the 7,900 m South Col. It has three summits; the main summit is 8,516 m, and the subsidiary Lhotse Middle (8,410 m) was the last named 8,000 m top in the world to be climbed, in 2001.',
    'For its first 7,200 m the normal route on Lhotse is the Everest route — the Khumbu Icefall, the Western Cwm, the Lhotse Face to Camp 3. From a Camp 4 on the face, it diverges up the Lhotse Couloir (the “Reiss Couloir”): a narrowing gully of steep snow and ice, 45–50° in places, that is the technical crux of the climb and a serious proposition when hard or windblown.',
    'Because so much of the route is shared, Lhotse is frequently climbed by expeditions also attempting Everest, sometimes both within a few days. But the couloir is real climbing at extreme altitude, and Lhotse deserves to be treated as its own mountain.'
  ],
  firstAscent: {
    year: 1956, date: '18 May 1956',
    climbers: 'Ernst Reiss and Fritz Luchsinger (Switzerland)',
    expedition: 'Swiss Mount Everest / Lhotse Expedition',
    route: 'West Face and Lhotse Couloir, from Nepal'
  },
  notableAscents: [
    { label: 'First winter ascent', detail: '1988 — Krzysztof Wielicki (Poland), solo on the day, from a Polish expedition.' },
    { label: 'Lhotse Middle (8,410 m)', detail: '2001 — a Russian team made the first ascent of this subsidiary summit, the last named 8,000 m point on Earth to be climbed.' },
    { label: 'South Face', detail: 'The enormous Lhotse South Face was a defining big-wall objective of the 1970s–90s; Tomo Česen’s disputed 1990 solo and the Russian route of 1990 are part of its history.' }
  ],
  normalRoute: {
    name: 'West Face & Lhotse Couloir (shared with Everest to Camp 3), from Nepal',
    character: 'Everest’s route for the first two-thirds, then a steep 45–50° couloir of snow and ice for the final ~500 m to the summit.',
    sections: [
      { name: 'Khumbu Icefall & Western Cwm', detail: 'Shared with Everest — Base Camp to Camp 2.' },
      { name: 'Lhotse Face to Camp 3', detail: 'The 1,000 m ice wall, on fixed rope.' },
      { name: 'Camp 4 (Lhotse)', detail: 'A camp on the face at around 7,800–8,000 m, below the couloir.' },
      { name: 'Lhotse Couloir', detail: 'A steepening, narrowing gully of snow and ice — the crux — leading to a short rock exit and the summit.' }
    ]
  },
  alternativeRoutes: ['Lhotse South Face — one of the great Himalayan walls, elite only', 'Lhotse Shar (8,383 m) and Lhotse Middle — subsidiary summits, separate objectives', 'A traverse of Everest and Lhotse from the South Col — attempted, rarely completed'],
  baseCampM: 5364,
  baseCampNote: 'Lhotse expeditions share Everest South Base Camp on the Khumbu Glacier at about 5,364 m, and the same acclimatisation infrastructure.',
  camps: [
    { name: 'Base Camp', altM: 5364, note: 'Shared with Everest' },
    { name: 'Camp 1', altM: 6050, note: 'Top of the Icefall' },
    { name: 'Camp 2', altM: 6400, note: 'Western Cwm' },
    { name: 'Camp 3', altM: 7200, note: 'Lhotse Face' },
    { name: 'Camp 4 (Lhotse)', altM: 7900, note: 'Below the couloir' },
    { name: 'Summit', altM: 8516, note: '' }
  ],
  approach: 'Identical to Everest from Nepal: fly Kathmandu–Lukla and trek 8–10 days to Everest Base Camp.',
  season: {
    primary: 'Spring', window: 'April–May',
    months: { Jan: 'winter', Feb: 'winter', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'rare', Oct: 'rare', Nov: 'closed', Dec: 'winter' },
    note: 'The same pre-monsoon spring window as Everest. Many climbers use the shared acclimatisation and attempt Lhotse alongside or just after an Everest summit.'
  },
  typicalDurationDays: '50–60 days (as for Everest)',
  difficulty: { technical: 3, altitude: 5, exposure: 3, weather: 4, remoteness: 2, objectiveHazard: 4, summary: 'Everest’s altitude and objective hazards for most of the route, plus a genuinely steep ice couloir for the final 500 m that raises the technical bar above Everest’s normal route.' },
  objectiveHazards: ['Khumbu Icefall (shared with Everest)', 'Avalanche and windslab in and around the couloir', 'Ice and rockfall in the confined couloir when parties are above you', 'Extreme cold and wind on the exposed face', 'HACE / HAPE at extreme altitude'],
  history: [
    'Lhotse was first climbed by the Swiss in 1956, the same expedition that made the second ascent of Everest. Because the route shares Everest’s infrastructure, it became a natural second objective, and the “Everest–Lhotse” double is now a recognised — if demanding — commercial package.',
    'The mountain’s more serious history is on its walls: the Lhotse South Face drew repeated attempts and controversy through the 1970s–90s, and Lhotse Middle held out as the last unclimbed named 8,000 m point until a Russian team reached it in 2001.',
    'Krzysztof Wielicki made the first winter ascent, solo on summit day, in 1988.'
  ],
  logistics: 'Run as an Everest-side expedition, often by the same operators, using the shared Base Camp, Icefall route and fixed ropes to Camp 3 and a dedicated fixed line in the couloir. Oxygen for most climbers. Confirm permit and Icefall arrangements for the year.',
  permit: { authority: 'Department of Tourism, Government of Nepal', note: 'A separate climbing permit from Everest, though often arranged together. Liaison officer and registered operator required.', verify: true },
  equipment: ['8,000 m down suit and summit boots', 'A technical ice tool in addition to a walking axe, for the couloir', 'High-altitude sleeping system (−40°C and below)', 'Oxygen system for most climbers', 'Crampons, harness, ascender, belay/rappel device, helmet', 'Expedition mittens, goggles, glacier glasses'],
  weather: 'The same jet-stream-driven spring window as Everest. The couloir catches wind and spindrift and can be scoured to hard ice, which changes the character of the climb from year to year.',
  acclimatisation: 'The standard Everest rotation strategy up the shared route to Camp 3, then a summit push that diverges into the couloir from a Camp 4 on the face.',
  rescue: { note: 'The same as Everest for the shared section — helicopter from Base Camp and, in good conditions, Camps 1 and 2; above that, team rescue. Everest ER at Base Camp in season.', verify: true },
  guideSupport: 'Commercial expeditions run with Sherpa climbing support and a fixed line in the couloir. Because the couloir is steeper than anything on Everest’s normal route, some prior steep-ice experience is valuable.',
  faq: [
    { q: 'How high is Lhotse?', a: '8,516 m (27,940 ft) — the fourth-highest mountain on Earth.' },
    { q: 'Is Lhotse part of Everest?', a: 'It is a separate mountain, connected to Everest by the 7,900 m South Col. Its Tibetan name means “south peak”, referring to its position relative to Everest.' },
    { q: 'Is Lhotse easier than Everest?', a: 'The route shares Everest’s line and hazards for most of its length, then adds a steep 45–50° ice couloir for the final 500 m, which is more technical than anything on Everest’s normal route. Overall it is a comparable undertaking with a harder finish.' },
    { q: 'Can you climb Everest and Lhotse together?', a: 'Yes — the “Everest–Lhotse double” is a recognised objective, using the shared acclimatisation, sometimes with both summits within a few days. It is demanding and not guaranteed.' },
    { q: 'When is Lhotse climbed?', a: 'In the pre-monsoon spring (April–May), the same window as Everest.' },
    { q: 'Who first climbed Lhotse?', a: 'Ernst Reiss and Fritz Luchsinger (Switzerland) on 18 May 1956.' }
  ],
  relatedTreks: ['everest-base-camp', 'gokyo-lakes', 'three-passes'],
  relatedDestinations: ['Everest Base Camp', 'Chukhung', 'Namche Bazaar']
};

MOUNTAINS['makalu'] = {
  slug: 'makalu',
  bestseller: 6,
  name: 'Makalu',
  aka: 'Makaru',
  rank: 5,
  elevationM: 8485, elevationLabel: '8,485 m', elevationFt: 27838,
  countries: ['Nepal', 'China (Tibet)'], countryLabel: 'Nepal / China',
  range: 'Mahalangur Himalaya (Barun section)', region: 'Sankhuwasabha, Nepal / Tibet',
  coordinates: { lat: 27.8897, lon: 87.0883 },
  inNepal: true,
  heroImage: '/images/hero-mountain.jpg',
  gallery: ['/images/hero-mountain.jpg', '/images/ebc.png', '/images/manaslu_real.jpg'],
  tagline: 'The four-sided pyramid of the Barun',
  summary: 'The fifth-highest mountain on Earth at 8,485 m, a striking four-ridged pyramid at the head of the remote Barun valley east of Everest. The normal route via the Makalu La and the Northwest Ridge is genuinely technical high on the mountain, with a rock step near the summit. Isolated, cold and lightly climbed.',
  seo: {
    title: 'Makalu Expedition — 8,485 m | Northwest Ridge Route, History & Season',
    description: 'A factual guide to Makalu, the fifth-highest mountain on Earth: elevation and rank, the Makalu La and Northwest Ridge normal route, first-ascent history, season and expedition planning orientation.'
  },
  character: [
    'Makalu rises alone at the head of the Barun valley, about 19 km east-southeast of Everest, inside the Makalu Barun National Park — one of the wildest corners of the Nepal Himalaya. Its distinctive shape, a clean pyramid with four sharp ridges, makes it one of the most recognisable of the 8,000ers.',
    'The normal route climbs the Northwest Ridge from a high col, the Makalu La (about 7,400 m). The lower mountain is glacier and snow slopes; the upper mountain steepens into mixed climbing, and the final section includes a rock band — the “French Couloir” or the ridge crest depending on conditions — that is real climbing above 8,000 m. Summit day is long and technical by 8,000 m standards.',
    'Makalu’s isolation is part of its difficulty: the approach is a long trek from the Tumlingtar airstrip, the weather is exposed, and the mountain sees far fewer climbers than Everest or Cho Oyu.'
  ],
  firstAscent: {
    year: 1955, date: '15 May 1955',
    climbers: 'Lionel Terray and Jean Couzy (France), followed over the next two days by the rest of the team including Jean Franco and Guido Magnone',
    expedition: 'French Makalu Expedition, led by Jean Franco — a rare expedition on which nearly every member summited',
    route: 'North Face and Northeast Ridge (via the Makalu La), from Nepal'
  },
  notableAscents: [
    { label: 'First winter ascent', detail: '2009 — Simone Moro and Denis Urubko.' },
    { label: 'West Pillar', detail: '1971 — a landmark hard route by a French team (Bernard Mellet, Yannick Seigneur), one of the most difficult Himalayan lines of its era.' },
    { label: 'First ascent without supplemental oxygen', detail: '1975 — a Yugoslav expedition climbed the difficult South Face; Marjan Manfreda reached the summit without oxygen.' }
  ],
  normalRoute: {
    name: 'Northwest Ridge via the Makalu La, from Nepal',
    character: 'Straightforward glacier and snow on the lower mountain; genuinely technical mixed ground and a rock step near the summit. Fixed rope high in season.',
    sections: [
      { name: 'Base Camp to Camp 1', detail: 'Moraine and lower glacier.' },
      { name: 'Camps 1–2', detail: 'Snow slopes and a crevassed glacier shelf.' },
      { name: 'The Makalu La (Camp 3, ~7,400 m)', detail: 'A high, windswept col — the pivot of the route.' },
      { name: 'Camp 4 (~7,700 m)', detail: 'On the Northwest Ridge, the summit launch.' },
      { name: 'Summit day', detail: 'Steepening mixed ground and a rock band / couloir near the top — technical climbing at extreme altitude, on fixed rope in season.' }
    ]
  },
  alternativeRoutes: ['West Pillar (1971) — a famous hard rock-and-mixed route', 'South Face — a major wall, elite alpine only', 'Southeast Ridge (1970, Japanese) — long and committing'],
  baseCampM: 4870,
  baseCampNote: 'Base Camp is on the Barun Glacier at around 4,870–5,700 m depending on the camp used, reached by an 8–10 day trek from the Tumlingtar airstrip through the Makalu Barun National Park.',
  camps: [
    { name: 'Base Camp', altM: 4870, note: 'Barun Glacier' },
    { name: 'Camp 1', altM: 6100, note: '' },
    { name: 'Camp 2', altM: 6600, note: '' },
    { name: 'Camp 3 (Makalu La)', altM: 7400, note: 'High col' },
    { name: 'Camp 4', altM: 7700, note: 'Northwest Ridge — summit launch' },
    { name: 'Summit', altM: 8485, note: '' }
  ],
  approach: 'Fly Kathmandu–Tumlingtar (frequently delayed), jeep to the roadhead, then 8–10 days trekking up the Barun valley — much of the Makalu Base Camp trekking route — to Base Camp.',
  season: {
    primary: 'Spring', window: 'April–May',
    months: { Jan: 'winter', Feb: 'winter', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'rare', Oct: 'rare', Nov: 'closed', Dec: 'winter' },
    note: 'Pre-monsoon spring is the season. Autumn attempts are rare because of cold and wind on the exposed upper ridge. The first winter ascent was in 2009.'
  },
  typicalDurationDays: '45–55 days (including the Barun approach)',
  difficulty: { technical: 4, altitude: 5, exposure: 4, weather: 4, remoteness: 4, objectiveHazard: 3, summary: 'A technical summit day with a rock step above 8,000 m, a high and windswept upper mountain, and a long, isolated approach. Harder than the trade-route 8,000ers.' },
  objectiveHazards: ['High wind and extreme cold on the exposed Makalu La and upper ridge', 'Difficult route-finding and downclimbing of the summit rock band in poor conditions', 'Crevasse hazard on the lower glacier', 'Avalanche on the face after snowfall', 'Isolation — slow, weather-dependent rescue'],
  history: [
    'Makalu was reconnoitred by American and New Zealand parties in 1954 (including Edmund Hillary) before the French expedition of 1955 climbed it cleanly via the Makalu La, with almost the entire team reaching the summit — an unusual outcome for an 8,000 m first ascent.',
    'The mountain became a proving ground for hard routes: the French West Pillar in 1971 and the Yugoslav South Face in 1975 were among the most difficult Himalayan climbs of their time.',
    'Winter defeated a series of strong attempts until Simone Moro and Denis Urubko succeeded in 2009. Makalu remains a serious, lightly-travelled objective.'
  ],
  logistics: 'A Makalu expedition carries the logistics of a remote approach: an unreliable Tumlingtar flight, a long porter caravan or helicopter lift up the Barun, a stocked Base Camp for six weeks, fixed rope on the upper mountain, Sherpa climbing support, and oxygen for most climbers. Confirm current permit, park and liaison-officer rules for the year.',
  permit: { authority: 'Department of Tourism, Government of Nepal, plus Makalu Barun National Park permits', note: 'Climbing permit, liaison officer, registered operator and national-park fees required. Rules are revised regularly.', verify: true },
  equipment: ['8,000 m down suit and summit boots', 'A technical ice tool plus a walking axe for the summit day', 'High-altitude sleeping system (−40°C and below)', 'Oxygen system for most climbers', 'Crampons, harness, ascender, belay/rappel device, helmet', 'Expedition mittens, goggles, glacier glasses'],
  weather: 'Makalu’s isolated pyramid and its position east of Everest expose the upper mountain to strong, cold winds. Spring windows are shorter and less predictable than on the central peaks, and the summit ridge is a notoriously cold place.',
  acclimatisation: 'Two or three rotations up the route over three to four weeks — to Camp 1, then Camp 2, then a touch of the Makalu La — before descending to Base Camp to recover and committing to a summit push on a forecast window.',
  rescue: { note: 'Helicopter evacuation is possible from Base Camp and the lower glacier in good weather; the remoteness of the Barun and the unreliable Tumlingtar flight make evacuation slow. Confirm current arrangements and carry appropriate insurance.', verify: true },
  guideSupport: 'Commercial expeditions run with Sherpa climbing teams and fixed rope on the upper mountain. The technical summit day means prior experience on steep mixed ground at altitude is valuable; Makalu is not a first 8,000er.',
  faq: [
    { q: 'How high is Makalu?', a: '8,485 m (27,838 ft) — the fifth-highest mountain on Earth.' },
    { q: 'Where is Makalu?', a: 'At the head of the Barun valley in the Makalu Barun National Park, Sankhuwasabha district, east-southeast of Everest, on the Nepal–Tibet border.' },
    { q: 'Is Makalu technically hard?', a: 'Yes, by 8,000 m standards. The lower mountain is straightforward, but the summit day involves a rock band and steep mixed ground above 8,000 m, and the upper ridge is exposed and cold.' },
    { q: 'When is Makalu climbed?', a: 'In the pre-monsoon spring (April–May). It was first climbed in winter in 2009.' },
    { q: 'How remote is a Makalu expedition?', a: 'Very. Access is via the frequently-delayed Tumlingtar flight and an 8–10 day trek up the Barun valley, and high-altitude rescue is slow.' },
    { q: 'Who first climbed Makalu?', a: 'Lionel Terray and Jean Couzy (France) on 15 May 1955, on the French expedition led by Jean Franco — a climb on which nearly the whole team summited.' }
  ],
  relatedTreks: ['makalu-base-camp'],
  relatedDestinations: ['Barun valley', 'Makalu Barun National Park', 'Tumlingtar & the Arun valley']
};

MOUNTAINS['cho-oyu'] = {
  slug: 'cho-oyu',
  bestseller: 4,
  name: 'Cho Oyu',
  aka: '“Turquoise Goddess”',
  rank: 6,
  elevationM: 8188, elevationLabel: '8,188 m', elevationFt: 26864,
  countries: ['Nepal', 'China (Tibet)'], countryLabel: 'Nepal / China',
  range: 'Mahalangur Himalaya', region: 'Khumbu, Nepal / Tingri, Tibet',
  coordinates: { lat: 28.0942, lon: 86.6608 },
  inNepal: true,
  heroImage: '/images/hero-mountain.jpg',
  gallery: ['/images/hero-mountain.jpg', '/images/langtang_real.jpg', '/images/ebc.png'],
  tagline: 'The most accessible eight-thousander',
  summary: 'The sixth-highest mountain on Earth at 8,188 m, about 20 km west of Everest on the Nepal–Tibet border. The normal route, the Northwest Face from the Tibetan side, is the least technical of the 14 and has a vehicle-accessible Base Camp, which has made Cho Oyu the standard first 8,000 m peak — though a serac band on the route is a real hazard.',
  seo: {
    title: 'Cho Oyu Expedition — 8,188 m | The First Eight-Thousander: Route, History & Season',
    description: 'A factual guide to Cho Oyu, the sixth-highest mountain on Earth and the usual first 8,000 m peak: elevation and rank, the Northwest Face normal route, first-ascent history, season and planning orientation.'
  },
  character: [
    'Cho Oyu sits on the Nepal–Tibet border about 20 km west of Everest, at the head of the Gokyo valley on the Nepal side. Its Tibetan name is usually rendered “turquoise goddess”. It is the sixth-highest mountain on Earth but, on its normal route, the most straightforward to climb.',
    'That normal route is the Northwest Face, approached from the Tibetan side, where a road reaches a Base Camp at around 4,900 m and Advanced Base Camp at about 5,700 m. The route is snow and ice slopes with one steepish icefall/serac section around 6,400–6,500 m (the “Yellow Band” and a serac barrier), then broad, moderate slopes to a summit plateau. There is no sharp summit ridge and no rock step.',
    'This combination — moderate angle, vehicle-accessible Base Camp, short overall expedition — has made Cho Oyu the standard first 8,000er for climbers building toward Everest. Access, however, depends entirely on Chinese permitting of the Tibetan side, which has been open and closed in different years. A harder Nepal-side route exists but is rarely used.'
  ],
  firstAscent: {
    year: 1954, date: '19 October 1954',
    climbers: 'Herbert Tichy and Sepp Jöchler (Austria) with Pasang Dawa Lama (Nepal)',
    expedition: 'A small, lightweight Austrian expedition — remarkable for its era',
    route: 'Northwest Face, from Tibet'
  },
  notableAscents: [
    { label: 'A landmark lightweight ascent', detail: 'The 1954 first ascent was made by a tiny, low-budget team without supplemental oxygen — years ahead of its time in style.' },
    { label: 'First winter ascent', detail: '1985 — a Polish expedition (Maciej Berbeka and Maciej Pawlikowski; a second pair, Jerzy Kukuczka and Zygmunt Heinrich, summited days later via a new route).' },
    { label: 'First female ascent', detail: '1988 — several women summited in this period as Cho Oyu became a popular objective.' }
  ],
  normalRoute: {
    name: 'Northwest Face, from Tibet',
    character: 'The least technical of the 14 normal routes — moderate snow and ice slopes with one serac/ice-cliff section, and a broad summit plateau.',
    sections: [
      { name: 'Base Camp to Advanced Base Camp', detail: 'A day’s walk from the roadhead BC (~4,900 m) to ABC (~5,700 m) on the glacier.' },
      { name: 'ABC to Camp 1', detail: 'Moraine and lower snow slopes to a camp around 6,400 m.' },
      { name: 'The serac band / Yellow Band', detail: 'A steeper ice section and a barrier of seracs around 6,500–6,700 m — the technical crux and the main objective hazard.' },
      { name: 'Camps 2 and 3', detail: 'Broad snow slopes to camps at roughly 7,100 m and 7,400–7,500 m.' },
      { name: 'Summit plateau', detail: 'Gently angled snow slopes across a large plateau to the true summit — long, but not steep.' }
    ]
  },
  alternativeRoutes: ['Southeast Face / Southwest Ridge (Nepal side) — harder, seldom climbed', 'Various new routes on the Southwest and South faces — elite alpine only'],
  baseCampM: 4900,
  baseCampNote: 'The Tibet-side Base Camp at about 4,900 m is vehicle-accessible; Advanced Base Camp is at around 5,700 m, a day’s walk in. Access is subject to Chinese permitting of the Tibetan side.',
  camps: [
    { name: 'Base Camp', altM: 4900, note: 'Roadhead (Tibet)' },
    { name: 'Advanced Base Camp', altM: 5700, note: 'On the glacier' },
    { name: 'Camp 1', altM: 6400, note: 'Below the serac band' },
    { name: 'Camp 2', altM: 7100, note: '' },
    { name: 'Camp 3', altM: 7450, note: 'Summit launch' },
    { name: 'Summit', altM: 8188, note: 'Broad plateau' }
  ],
  approach: 'Drive from Kathmandu or Lhasa to the Tibet-side Base Camp, subject to Chinese access rules. When the Tibetan side is closed, expeditions do not run — the Nepal-side route is a different, harder undertaking.',
  season: {
    primary: 'Autumn', window: 'September–October (spring also used)',
    months: { Jan: 'winter', Feb: 'winter', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'prime', Oct: 'prime', Nov: 'shoulder', Dec: 'winter' },
    note: 'Cho Oyu has long been climbed in the post-monsoon autumn (September–October), as well as the pre-monsoon spring. Access depends on Chinese permitting of the Tibetan side in a given year.'
  },
  typicalDurationDays: '30–40 days',
  difficulty: { technical: 2, altitude: 4, exposure: 2, weather: 3, remoteness: 3, objectiveHazard: 3, summary: 'The most accessible of the 14 — moderate slopes, a vehicle-accessible Base Camp and a short expedition — but still 8,188 m of real altitude, with a serac band on the route that has caused fatalities.' },
  objectiveHazards: ['The serac band around 6,500–6,700 m — ice-cliff collapse onto the route', 'Avalanche on the broad slopes after snowfall', 'Cold and wind on the exposed summit plateau', 'The long, featureless plateau is disorienting in whiteout', 'HAPE / HACE at 8,000 m despite the moderate terrain'],
  history: [
    'Cho Oyu was first climbed in 1954 by Herbert Tichy, Sepp Jöchler and Pasang Dawa Lama — a tiny Austrian team on a shoestring, without oxygen, in a style that would not become normal for decades. It was only the fifth 8,000er to be climbed.',
    'From the 1980s the Tibetan-side Northwest Face became the standard route, and Cho Oyu grew into the busiest 8,000er after Everest and the accepted stepping stone toward it — helped by the road access and the short expedition length.',
    'A Polish team made the first winter ascent in 1985. Access to the Tibetan side has fluctuated with Chinese policy, and in years when it is closed, Cho Oyu expeditions largely do not run.'
  ],
  logistics: 'A Tibet-side Cho Oyu expedition is comparatively simple: overland travel from Kathmandu or Lhasa, Chinese permits and a liaison arrangement, a road-accessible Base Camp, a stocked ABC, fixed rope through the serac band and on the upper slopes, Sherpa support and oxygen for most climbers. The expedition is short by 8,000 m standards. Confirm whether the Tibetan side is open for your year before committing.',
  permit: { authority: 'China Tibet Mountaineering Association', note: 'Chinese climbing permit, liaison officer / guide requirement and a registered operator. Access to the Tibetan side is opened and closed by Chinese authorities and cannot be assumed.', verify: true },
  equipment: ['8,000 m down suit and summit boots', 'High-altitude sleeping system (−40°C and below)', 'Oxygen system for most climbers', 'Crampons, ice axe, harness, ascender, belay/rappel device', 'Goggles and glacier glasses, expedition mittens', 'GPS or compass discipline for the summit plateau in whiteout'],
  weather: 'Cho Oyu’s autumn window is generally more settled than the spring, with colder but clearer conditions. The summit plateau is fully exposed to wind, and the featureless terrain makes navigation in poor visibility a real hazard.',
  acclimatisation: 'A short, efficient rotation strategy — touching Camp 1, then Camp 2, sometimes Camp 3 — over two to three weeks from ABC, then a summit push on a forecast window. Many climbers use Cho Oyu itself as acclimatisation for a subsequent Everest attempt.',
  rescue: { note: 'Helicopter rescue on the Tibetan side is far more constrained than in Nepal; evacuation is typically overland from Base Camp. Confirm the current arrangements and carry insurance that covers the Tibetan side.', verify: true },
  guideSupport: 'Commercial expeditions run with Sherpa climbing support and fixed rope on the route. Cho Oyu is the standard guided first 8,000 m peak for well-prepared climbers with prior 6,000 m experience.',
  faq: [
    { q: 'How high is Cho Oyu?', a: '8,188 m (26,864 ft) — the sixth-highest mountain on Earth.' },
    { q: 'Why is Cho Oyu the usual first 8,000er?', a: 'Its normal route is the least technical of the 14, the Tibet-side Base Camp is vehicle-accessible, and the expedition is short — around 30–40 days. It is the accepted stepping stone toward Everest.' },
    { q: 'Is Cho Oyu safe?', a: 'It is the most accessible 8,000er, but it is still 8,188 m with a serac band on the route that has caused fatalities, and full death-zone altitude on the summit plateau. It is a serious expedition, not a walk.' },
    { q: 'Which side is Cho Oyu climbed from?', a: 'The normal route is the Northwest Face from the Tibetan (Chinese) side. Access depends on Chinese permitting, which is opened and closed in different years. The Nepal-side route is harder and rarely used.' },
    { q: 'When is Cho Oyu climbed?', a: 'Traditionally in the post-monsoon autumn (September–October), and also in the pre-monsoon spring.' },
    { q: 'Who first climbed Cho Oyu?', a: 'Herbert Tichy and Sepp Jöchler (Austria) with Pasang Dawa Lama (Nepal), on 19 October 1954, without supplemental oxygen — a remarkably lightweight ascent for its time.' }
  ],
  relatedTreks: ['gokyo-lakes', 'everest-base-camp', 'three-passes'],
  relatedDestinations: ['Gokyo valley', 'Nangpa La (historic trade pass)', 'Tingri, Tibet']
};

MOUNTAINS['dhaulagiri'] = {
  slug: 'dhaulagiri',
  bestseller: 5,
  name: 'Dhaulagiri I',
  aka: '“White Mountain”',
  rank: 7,
  elevationM: 8167, elevationLabel: '8,167 m', elevationFt: 26795,
  countries: ['Nepal'], countryLabel: 'Nepal',
  range: 'Dhaulagiri Himal', region: 'Myagdi, Nepal',
  coordinates: { lat: 28.6967, lon: 83.4875 },
  inNepal: true,
  heroImage: '/images/hero-mountain.jpg',
  gallery: ['/images/hero-mountain.jpg', '/images/manaslu.png', '/images/annapurna_real.jpg'],
  tagline: 'The white mountain, once thought the highest on Earth',
  summary: 'The seventh-highest mountain on Earth at 8,167 m, entirely within Nepal, separated from the Annapurna massif by the Kali Gandaki — the deepest gorge in the world. Briefly believed to be the highest mountain on Earth in the 19th century. The Northeast Ridge normal route is exposed, avalanche-prone and notoriously weather-beaten.',
  seo: {
    title: 'Dhaulagiri I Expedition — 8,167 m | Northeast Ridge Route, History & Season',
    description: 'A factual guide to Dhaulagiri I, the seventh-highest mountain on Earth: elevation and rank, the Northeast Ridge normal route, first-ascent history, season and expedition planning orientation.'
  },
  character: [
    'Dhaulagiri — from the Sanskrit for “white mountain” — is a massive, isolated peak in west-central Nepal, rising more than 5,500 m above the Kali Gandaki valley to its east. For about thirty years in the early 19th century, before the survey of Kangchenjunga and Everest, Dhaulagiri was believed to be the highest mountain in the world.',
    'The normal route, the Northeast Ridge, is not desperately technical, but it is long, exposed and serious. The lower route crosses avalanche-prone slopes; the ridge itself is corniced and wind-blasted, with camps in exposed positions; and Dhaulagiri has a reputation among the 8,000ers for foul, unstable weather and for turning back strong parties.',
    'The mountain is also linked to a demanding trek — the Dhaulagiri Circuit, which crosses two 5,200 m-plus passes past the base of the peak.'
  ],
  firstAscent: {
    year: 1960, date: '13 May 1960',
    climbers: 'Kurt Diemberger, Peter Diener, Ernst Forrer, Albin Schelbert (with Nawang Dorje and Nyima Dorje, Sherpa)',
    expedition: 'Swiss / Austrian expedition, partly supported by a fixed-wing aircraft (the “Yeti”) landing on the glacier',
    route: 'Northeast Ridge, from Nepal'
  },
  notableAscents: [
    { label: 'Last of the first eight 8,000ers', detail: 'Dhaulagiri was the last of the eight highest 8,000 m peaks to be first climbed, in 1960, a decade after Annapurna.' },
    { label: 'First winter ascent', detail: '1985 — Jerzy Kukuczka and Andrzej Czok (Polish expedition).' },
    { label: 'South Face', detail: 'The huge Dhaulagiri South Face has repelled almost all attempts and remains one of the great unsolved problems of Himalayan climbing.' }
  ],
  normalRoute: {
    name: 'Northeast Ridge, from Nepal',
    character: 'Moderate technical difficulty but long, exposed and corniced, with avalanche hazard low on the route and severe weather exposure on the ridge.',
    sections: [
      { name: 'Base Camp to Camp 1', detail: 'Glacier and moraine below the northeast side of the mountain.' },
      { name: 'Camps 1–2', detail: 'Snow slopes onto the Northeast Ridge, with avalanche-exposed sections.' },
      { name: 'The Northeast Ridge', detail: 'A long, corniced, wind-exposed ridge to Camps 3 and 4 (~7,200–7,400 m).' },
      { name: 'Summit day', detail: 'Steepening snow slopes and a final ridge to the summit — not steep, but a long day in a very exposed place.' }
    ]
  },
  alternativeRoutes: ['Northwest Ridge / North Face routes', 'South Face — a legendary, near-unclimbed wall', 'The 1960 line via the Northeast Col'],
  baseCampM: 4750,
  baseCampNote: 'Base Camp is on the Chhonbardan Glacier at around 4,750 m, reached either by a demanding trek up the Myagdi Khola (the Dhaulagiri Circuit approach) or, on some expeditions, by helicopter.',
  camps: [
    { name: 'Base Camp', altM: 4750, note: 'Chhonbardan Glacier' },
    { name: 'Camp 1', altM: 5900, note: '' },
    { name: 'Camp 2', altM: 6400, note: '' },
    { name: 'Camp 3', altM: 7200, note: '' },
    { name: 'Camp 4', altM: 7400, note: 'Summit launch' },
    { name: 'Summit', altM: 8167, note: '' }
  ],
  approach: 'Fly or drive Pokhara–Beni, then trek up the Myagdi Khola for several days to Base Camp (the Dhaulagiri Circuit approach), or fly in by helicopter. The trek out is often over the French Col and Dhampus Pass into the Kali Gandaki.',
  season: {
    primary: 'Spring', window: 'April–May (some autumn)',
    months: { Jan: 'winter', Feb: 'winter', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'shoulder', Oct: 'shoulder', Nov: 'rare', Dec: 'winter' },
    note: 'Pre-monsoon spring is the main season; autumn is also used but colder and windier. Dhaulagiri is known for unusually poor and changeable weather.'
  },
  typicalDurationDays: '40–50 days',
  difficulty: { technical: 3, altitude: 5, exposure: 4, weather: 5, remoteness: 4, objectiveHazard: 4, summary: 'Moderate climbing but a long, corniced, wind-hammered ridge, avalanche hazard low down, and some of the least reliable weather of the 8,000 m peaks.' },
  objectiveHazards: ['Avalanche and slab on the lower route after snowfall', 'Cornice collapse along the Northeast Ridge', 'Severe, rapidly changing weather and high wind on the ridge', 'Exposed camp positions vulnerable to storms', 'Crevasse hazard on the approach glacier'],
  history: [
    'Dhaulagiri’s height was measured in the 1800s and it was, for a time, thought to be the highest mountain in the world. It was attempted repeatedly from 1950 onward — including by the French party that then switched to Annapurna — before the Swiss/Austrian expedition of 1960 climbed it via the Northeast Ridge, famously supported by a small aircraft landing on the glacier.',
    'It was the last of the eight highest 8,000ers to be first climbed. A Polish team made the first winter ascent in 1985. The South Face remains one of the hardest unclimbed objectives in the Himalaya.'
  ],
  logistics: 'A Dhaulagiri expedition combines a hard trekking approach (or a helicopter lift) with a stocked Base Camp for six weeks, fixed rope on the route, Sherpa climbing support and oxygen for most climbers. The weather demands patience and a generous supply of Base Camp days. Confirm the current permit and liaison-officer position for the year.',
  permit: { authority: 'Department of Tourism, Government of Nepal, plus Annapurna Conservation Area permits', note: 'Climbing permit, liaison officer, registered operator and conservation-area fees required. Rules are revised regularly.', verify: true },
  equipment: ['8,000 m down suit and summit boots', 'High-altitude sleeping system (−40°C and below)', 'Oxygen system for most climbers', 'Crampons, ice axe plus a technical tool, harness, ascender, belay/rappel device', 'Helmet', 'Expedition mittens, goggles, glacier glasses', 'Robust tents and anchors for exposed camps'],
  weather: 'Dhaulagiri stands alone on the western edge of the central Nepal Himalaya and takes the full force of systems moving up the range. Its weather is a byword for unpredictability, and expeditions routinely spend long spells at Base Camp waiting for the ridge to become climbable.',
  acclimatisation: 'Two or three rotations up the Northeast Ridge over three to four weeks — to Camp 1, then Camp 2, then a touch of Camp 3 — before descending to Base Camp and committing to a summit push on a forecast window.',
  rescue: { note: 'Helicopter evacuation is possible from Base Camp and the lower glacier in good weather. The exposed ridge and the mountain’s weather make higher rescue difficult and slow. Confirm current arrangements and carry appropriate insurance.', verify: true },
  guideSupport: 'Commercial expeditions run with Sherpa climbing teams and fixed rope on the route. The exposure and weather make Dhaulagiri a step up from the trade-route 8,000ers; prior 8,000 m or hard 7,000 m experience is expected.',
  faq: [
    { q: 'How high is Dhaulagiri I?', a: '8,167 m (26,795 ft) — the seventh-highest mountain on Earth, and the highest mountain that lies entirely within Nepal.' },
    { q: 'Was Dhaulagiri once thought to be the highest mountain?', a: 'Yes — after its height was measured in the early 19th century, Dhaulagiri was believed to be the highest mountain in the world for about thirty years, until Kangchenjunga and then Everest were surveyed.' },
    { q: 'Is Dhaulagiri technically difficult?', a: 'The normal route is moderate in pure climbing terms, but it is long, corniced and severely exposed to weather, with avalanche hazard on the lower slopes. It has a reputation for turning back strong parties.' },
    { q: 'When is Dhaulagiri climbed?', a: 'Mainly in the pre-monsoon spring (April–May), with some autumn attempts. Its weather is notably unreliable in any season.' },
    { q: 'Who first climbed Dhaulagiri?', a: 'A Swiss/Austrian team — Kurt Diemberger, Peter Diener, Ernst Forrer, Albin Schelbert with Nawang Dorje and Nyima Dorje — on 13 May 1960, via the Northeast Ridge.' }
  ],
  relatedTreks: ['dhaulagiri-circuit', 'annapurna-circuit', 'upper-mustang'],
  relatedDestinations: ['Kali Gandaki gorge', 'Marpha & Jomsom', 'Pokhara']
};

MOUNTAINS['manaslu'] = {
  slug: 'manaslu',
  bestseller: 2,
  name: 'Manaslu',
  aka: '“Mountain of the Spirit”',
  rank: 8,
  elevationM: 8163, elevationLabel: '8,163 m', elevationFt: 26781,
  countries: ['Nepal'], countryLabel: 'Nepal',
  range: 'Mansiri Himal (Gorkha Himal)', region: 'Gorkha, Nepal',
  coordinates: { lat: 28.5497, lon: 84.5597 },
  inNepal: true,
  heroImage: '/images/manaslu_real.jpg',
  gallery: ['/images/manaslu_real.jpg', '/images/manaslu.png', '/images/hero-mountain.jpg'],
  tagline: 'The eighth-highest — and a common route toward Everest',
  summary: 'The eighth-highest mountain on Earth at 8,163 m, entirely in Nepal’s Gorkha district. Its name derives from the Sanskrit for “intellect” or “spirit”. The Northeast Face normal route is one of the less technical 8,000 m routes and has become a popular pre-Everest objective — though the upper slopes are seriously avalanche- and serac-prone.',
  seo: {
    title: 'Manaslu Expedition — 8,163 m | Northeast Face Route, History & Season',
    description: 'A factual guide to Manaslu, the eighth-highest mountain on Earth: elevation and rank, the Northeast Face normal route, first-ascent history, season and expedition planning orientation.'
  },
  character: [
    'Manaslu dominates the Gorkha Himal in west-central Nepal, its long summit ridge and multiple tops visible from far across the middle hills. Its name comes from the Sanskrit manasa, “intellect” or “spirit”. It was first climbed by a Japanese expedition in 1956, and Japanese climbers have a long association with the mountain.',
    'The normal route, the Northeast Face, is among the more approachable 8,000 m routes technically — snow and ice slopes with a few steeper steps, and a broad upper mountain — which, together with a relatively short approach and both spring and autumn seasons, has made it a very popular objective and a common acclimatisation peak for climbers preparing for Everest.',
    'That said, the upper mountain carries real avalanche and serac hazard: a 2012 serac collapse above Camp 3 killed a number of climbers, and the route above Camp 2 is a place to move early and fast.'
  ],
  firstAscent: {
    year: 1956, date: '9 May 1956',
    climbers: 'Toshio Imanishi (Japan) and Gyalzen Norbu (Nepal)',
    expedition: 'Japanese Manaslu Expedition',
    route: 'Northeast Face, from Nepal'
  },
  notableAscents: [
    { label: 'A Japanese mountain', detail: 'Japanese expeditions reconnoitred and attempted Manaslu through the early 1950s and made the first ascent in 1956; the mountain is sometimes called “the Japanese peak”.' },
    { label: 'First winter ascent', detail: '1984 — Maciej Berbeka and Ryszard Gajewski (Polish expedition).' },
    { label: 'A note on summit integrity', detail: 'In the 2010s it emerged that many climbers had been stopping at a fore-summit rather than the true, corniced top; reputable operators now emphasise reaching the genuine summit.' }
  ],
  normalRoute: {
    name: 'Northeast Face, from Nepal',
    character: 'One of the less technical 8,000 m normal routes — snow and ice slopes with some steeper steps — but with significant avalanche and serac hazard on the upper mountain.',
    sections: [
      { name: 'Base Camp to Camp 1', detail: 'Glacier and moraine to a camp around 5,700 m.' },
      { name: 'Camps 1–2', detail: 'A steeper icefall and snow slopes to Camp 2 (~6,300 m).' },
      { name: 'The upper face', detail: 'Broad snow slopes past serac barriers to Camps 3 and 4 (~6,800 m and ~7,400 m) — the most avalanche- and serac-exposed section.' },
      { name: 'Summit ridge', detail: 'A long snow slope to the corniced summit ridge, and a short, exposed step to the true top.' }
    ]
  },
  alternativeRoutes: ['Northwest Face / West Face routes', 'South Face (1972, Tyrolean; and later hard variants)', 'The Northeast Ridge proper — longer and more technical'],
  baseCampM: 4800,
  baseCampNote: 'Base Camp is at around 4,800 m, reached by a 6–8 day trek from the Budhi Gandaki roadhead (the Manaslu Circuit approach) or by helicopter.',
  camps: [
    { name: 'Base Camp', altM: 4800, note: 'Manaslu Glacier' },
    { name: 'Camp 1', altM: 5700, note: '' },
    { name: 'Camp 2', altM: 6300, note: '' },
    { name: 'Camp 3', altM: 6800, note: 'Serac-exposed' },
    { name: 'Camp 4', altM: 7400, note: 'Summit launch' },
    { name: 'Summit', altM: 8163, note: 'Corniced true top beyond a fore-summit' }
  ],
  approach: 'Drive from Kathmandu to Soti Khola / Machha Khola, then trek 6–8 days up the Budhi Gandaki (the Manaslu Circuit trail) to Base Camp, or fly in by helicopter. The trek passes through the restricted Manaslu Conservation Area.',
  season: {
    primary: 'Autumn', window: 'September–October (spring also used)',
    months: { Jan: 'winter', Feb: 'winter', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'prime', Oct: 'prime', Nov: 'shoulder', Dec: 'winter' },
    note: 'Manaslu is now most popular in the post-monsoon autumn, and also climbed in spring. Autumn snow conditions can raise the avalanche hazard on the upper face.'
  },
  typicalDurationDays: '35–45 days',
  difficulty: { technical: 2, altitude: 4, exposure: 3, weather: 4, remoteness: 3, objectiveHazard: 4, summary: 'Moderate climbing and a relatively short approach, but serious avalanche and serac hazard on the upper mountain, and a genuine (often skipped) final step to the true summit.' },
  objectiveHazards: ['Serac collapse and avalanche on the upper face above Camp 2 (fatal events in 2012 and other years)', 'Windslab after autumn snowfall', 'Crevasse hazard in the icefall between Camps 1 and 2', 'The exposed final ridge step to the true summit', 'Congestion on fixed ropes in the busy autumn season'],
  history: [
    'Japanese expeditions were closely involved with Manaslu from the start, reconnoitring it in 1952–53 and climbing it in 1956 via the Northeast Face. A Polish team made the first winter ascent in 1984.',
    'From the 2000s Manaslu grew into one of the most-climbed 8,000ers, valued as a less-technical objective and a stepping stone toward Everest. The 2012 serac accident above Camp 3, and later scrutiny of climbers stopping short of the true summit, both shaped how the mountain is guided today.'
  ],
  logistics: 'A Manaslu expedition combines the Manaslu Conservation Area approach (restricted-area permits, a trek in or a helicopter lift) with a stocked Base Camp, fixed rope on the route, Sherpa climbing support and oxygen for most climbers. The expedition is short by 8,000 m standards. Confirm current permit and restricted-area rules for the year.',
  permit: { authority: 'Department of Tourism, Government of Nepal, plus Manaslu Conservation Area and restricted-area permits', note: 'Climbing permit, restricted-area trekking permits, liaison officer and registered operator required. Rules are revised regularly.', verify: true },
  equipment: ['8,000 m down suit and summit boots', 'High-altitude sleeping system (−40°C and below)', 'Oxygen system for most climbers', 'Crampons, ice axe, harness, ascender, belay/rappel device, helmet', 'Expedition mittens, goggles, glacier glasses'],
  weather: 'Manaslu’s autumn window is generally settled, but post-monsoon snow can sit unstable on the upper face for days. Spring is warmer with a different snowpack. Summit day is cold and the final ridge is wind-exposed.',
  acclimatisation: 'A short rotation strategy — touching Camp 1, then Camp 2, sometimes Camp 3 — over two to three weeks, then a summit push on a forecast window. Many climbers use Manaslu as acclimatisation for a subsequent Everest attempt.',
  rescue: { note: 'Helicopter evacuation is possible from Base Camp and the lower glacier in good weather, and helicopters are used routinely on the Manaslu approach. Higher rescue depends on conditions. Confirm current arrangements and carry appropriate insurance.', verify: true },
  guideSupport: 'Commercial expeditions run with Sherpa climbing support and fixed rope on the route. Manaslu is a common guided objective for climbers with prior 6,000 m and ideally 7,000 m experience, often as a rehearsal for Everest.',
  faq: [
    { q: 'How high is Manaslu?', a: '8,163 m (26,781 ft) — the eighth-highest mountain on Earth, entirely within Nepal.' },
    { q: 'Why is Manaslu a popular pre-Everest peak?', a: 'Its normal route is one of the less technical 8,000 m routes, the approach is relatively short, and it has both spring and autumn seasons — so it is widely used as an acclimatisation and experience-building objective before an Everest attempt.' },
    { q: 'Is Manaslu dangerous?', a: 'The upper face carries real avalanche and serac hazard — a 2012 collapse above Camp 3 killed several climbers. It is a moderate climb on a serious mountain, not a soft option.' },
    { q: 'What is the issue with the Manaslu summit?', a: 'For years many climbers stopped at a fore-summit short of the true, corniced top. Reputable operators now make a point of taking clients to the genuine summit, which involves a short, exposed final step.' },
    { q: 'When is Manaslu climbed?', a: 'Most often in the post-monsoon autumn (September–October), and also in the pre-monsoon spring.' },
    { q: 'Who first climbed Manaslu?', a: 'Toshio Imanishi (Japan) and Gyalzen Norbu (Nepal) on 9 May 1956, on the Japanese expedition.' }
  ],
  relatedTreks: ['manaslu-circuit', 'tsum-valley', 'ganesh-himal-trek'],
  relatedDestinations: ['Budhi Gandaki gorge', 'Samagaon & Samdo', 'Tsum Valley']
};

MOUNTAINS['nanga-parbat'] = {
  slug: 'nanga-parbat',
  name: 'Nanga Parbat',
  aka: 'Diamir · “The Naked Mountain” / “Killer Mountain”',
  rank: 9,
  elevationM: 8126, elevationLabel: '8,126 m', elevationFt: 26660,
  countries: ['Pakistan'], countryLabel: 'Pakistan',
  range: 'Himalaya (western anchor)', region: 'Gilgit-Baltistan, Pakistan',
  coordinates: { lat: 35.2375, lon: 74.5892 },
  inNepal: false,
  heroImage: '/images/hero-mountain.jpg',
  gallery: ['/images/hero-mountain.jpg', '/images/manaslu_real.jpg', '/images/everest_real.jpg'],
  tagline: 'The western anchor of the Himalaya',
  summary: 'The ninth-highest mountain on Earth at 8,126 m, standing alone at the far western end of the Himalaya in Pakistan. Its Rupal Face is the highest mountain wall in the world, about 4,600 m from base to summit. A serious, exposed, weather-battered peak with an especially grim early history.',
  seo: {
    title: 'Nanga Parbat Expedition — 8,126 m | Kinshofer Route, History & Season',
    description: 'A factual guide to Nanga Parbat, the ninth-highest mountain on Earth: elevation and rank, the Kinshofer (Diamir Face) normal route, the Rupal Face, first-ascent history, season and planning orientation.'
  },
  character: [
    'Nanga Parbat — “naked mountain” in the local languages — is the western pillar of the Himalaya, isolated by more than 180 km from the next 8,000er, K2. It rises abruptly from the Indus valley, and its southern Rupal Face, roughly 4,600 m from bottom to top, is the highest mountain wall on Earth.',
    'The normal route today is the Kinshofer Route on the western Diamir Face — steep mixed climbing low down (the Kinshofer Wall), then snow and ice slopes and a long, complex traverse and gully system to the summit. It is a genuinely technical and committing 8,000 m route with severe weather exposure and objective hazard from rock and icefall.',
    'The mountain’s early history was brutal — 31 people died on it before the first ascent in 1953 — and it earned the nickname “Killer Mountain”. It was the last 8,000er to be climbed in winter but for K2, in 2016.'
  ],
  firstAscent: {
    year: 1953, date: '3 July 1953',
    climbers: 'Hermann Buhl (Austria) — solo on the final 1,300 m, without supplemental oxygen, in a legendary and near-fatal push',
    expedition: 'German–Austrian Nanga Parbat Expedition, led by Karl Herrligkoffer',
    route: 'Rakhiot Face and East Ridge, from the north'
  },
  notableAscents: [
    { label: 'The 1953 solo summit push', detail: 'Buhl continued alone after his partner turned back, reached the summit near nightfall, and survived a standing bivouac at over 8,000 m without shelter or oxygen — one of the most celebrated feats in mountaineering.' },
    { label: 'Rupal Face', detail: '1970 — Reinhold and Günther Messner climbed the enormous Rupal Face; Günther died on the descent of the Diamir side, a defining tragedy of Himalayan climbing.' },
    { label: 'First winter ascent', detail: '26 February 2016 — Simone Moro, Alex Txikon and Muhammad Ali “Sadpara”, via a line on the Diamir Face.' }
  ],
  normalRoute: {
    name: 'Kinshofer Route (Diamir Face), from Pakistan',
    character: 'Steep, technical mixed climbing on the Kinshofer Wall low down, then snow and ice and a long, complex upper traverse. A serious mountaineering route, not a trade route.',
    sections: [
      { name: 'Base Camp to Camp 1', detail: 'Glacier and moraine on the Diamir side to a camp around 4,900 m.' },
      { name: 'The Kinshofer Wall', detail: 'A steep rock-and-ice step (up to ~60–70°) between Camps 1 and 2 — the technical crux of the route.' },
      { name: 'Camps 2–3', detail: 'Snow and ice slopes and a hanging glacier to camps at roughly 6,000 m and 6,700 m.' },
      { name: 'Camp 4 (~7,100 m)', detail: 'On a shoulder, below the summit traverse.' },
      { name: 'Summit day', detail: 'A long ascending traverse across the Bazhin Gap and gullies to the summit ridge — complex route-finding at extreme altitude.' }
    ]
  },
  alternativeRoutes: ['Rupal Face (the highest wall on Earth) — elite alpine only', 'Rakhiot Face (the 1953 route) — long and hazardous, rarely climbed now', 'Mazeno Ridge — a long, hard ridge traverse, climbed only once to the summit'],
  baseCampM: 4200,
  baseCampNote: 'The Diamir-side Base Camp is at around 4,200 m, reached by a short trek (1–2 days) from a roadhead in the Diamir valley off the Karakoram Highway.',
  camps: [
    { name: 'Base Camp', altM: 4200, note: 'Diamir valley' },
    { name: 'Camp 1', altM: 4900, note: '' },
    { name: 'Camp 2', altM: 6000, note: 'Above the Kinshofer Wall' },
    { name: 'Camp 3', altM: 6700, note: '' },
    { name: 'Camp 4', altM: 7100, note: 'Summit launch' },
    { name: 'Summit', altM: 8126, note: '' }
  ],
  approach: 'Drive from Islamabad up the Karakoram Highway toward Chilas / the Diamir valley, then a short 1–2 day trek to Base Camp. The approach is one of the shortest of the Karakoram-region 8,000ers.',
  season: {
    primary: 'Summer', window: 'June–July',
    months: { Jan: 'winter', Feb: 'winter', Mar: 'closed', Apr: 'closed', May: 'rare', Jun: 'prime', Jul: 'prime', Aug: 'shoulder', Sep: 'rare', Oct: 'closed', Nov: 'closed', Dec: 'winter' },
    note: 'Nanga Parbat is a summer mountain, climbed mainly in June and July. It has a notable winter-climbing history, culminating in the first winter ascent in 2016.'
  },
  typicalDurationDays: '35–50 days',
  difficulty: { technical: 4, altitude: 5, exposure: 5, weather: 5, remoteness: 4, objectiveHazard: 5, summary: 'Steep technical climbing low on the route, a long and complex summit traverse, extreme exposure, violent weather and heavy objective hazard. A hard, serious 8,000er with a grim safety record.' },
  objectiveHazards: ['Rock and icefall on and around the Kinshofer Wall', 'Serac collapse from the hanging glacier above Camp 2', 'Avalanche on the face and the summit traverse after snowfall', 'Storms with little warning and no easy retreat from the upper mountain', 'Route-finding on the complex summit traverse in poor visibility'],
  history: [
    'Nanga Parbat was a German obsession before the Second World War, with expeditions in 1934 and 1937 ending in disaster — avalanches and storms killing large parties. By 1953, 31 people had died on the mountain.',
    'Hermann Buhl’s solo summit push that year, after being ordered to retreat, is one of the defining stories in the sport. The Messner brothers climbed the Rupal Face in 1970 in a tragedy that shaped Günther Messner’s and Reinhold Messner’s legacies.',
    'The mountain was climbed in winter for the first time in 2016. It was also the site of a 2013 attack on Base Camp climbers, which affected access and security arrangements for years afterward.'
  ],
  logistics: 'A Nanga Parbat expedition is a Pakistan-based project with a short approach but serious security and logistical planning: Islamabad and Chilas logistics, a mandatory liaison officer, a stocked Base Camp, fixed rope on the Kinshofer Wall and upper route, Sherpa or Pakistani high-altitude support, and oxygen for most climbers. Confirm current permit, liaison-officer and security arrangements for the year.',
  permit: { authority: 'Gilgit-Baltistan Council / Ministry of Tourism, Government of Pakistan', note: 'Royalty payment, liaison officer and registered operator required. Fees and security arrangements are revised regularly.', verify: true },
  equipment: ['8,000 m down suit and summit boots', 'Full technical competence — the Kinshofer Wall is real climbing', 'A technical ice tool plus an axe', 'High-altitude sleeping system (−40°C and below)', 'Oxygen system for most climbers', 'Crampons, harness, ascender, belay/rappel device, helmet (mandatory)', 'Expedition mittens, goggles, glacier glasses'],
  weather: 'Nanga Parbat’s isolated position at the western end of the range exposes it to weather from several directions, and its enormous relief generates its own storms. Summer windows are short; the mountain has a reputation for savage, fast-arriving weather.',
  acclimatisation: 'Two or three rotations up the route over three to four weeks — to Camp 1, then Camp 2 above the Kinshofer Wall, then a touch of Camp 3 — before descending to rest and committing to a summit push on a forecast window.',
  rescue: { note: 'Pakistan Army Aviation helicopters can reach Base Camp and the lower route in good weather; above Camp 1 rescue is by the team. The summit traverse is a difficult place to effect any rescue. Confirm current arrangements and carry appropriate insurance.', verify: true },
  guideSupport: 'Commercial expeditions run with Sherpa or Pakistani high-altitude climbers who fix the route and support clients, but Nanga Parbat expects genuine independent competence on steep ground. Prior technical 8,000 m or hard 7,000 m experience is essential.',
  faq: [
    { q: 'How high is Nanga Parbat?', a: '8,126 m (26,660 ft) — the ninth-highest mountain on Earth, and the western anchor of the Himalaya.' },
    { q: 'Where is Nanga Parbat?', a: 'In Gilgit-Baltistan, Pakistan, standing alone above the Indus valley more than 180 km west of K2. It is not in the Karakoram — it is the westernmost Himalayan 8,000er.' },
    { q: 'Why is Nanga Parbat called the “Killer Mountain”?', a: 'Because of its early history: pre-war German expeditions lost large parties to avalanches and storms, and 31 people died on the mountain before the first ascent in 1953. It remains a serious and dangerous peak.' },
    { q: 'What is the Rupal Face?', a: 'The southern face of Nanga Parbat, about 4,600 m from base to summit — the highest mountain wall on Earth. It is an elite alpine objective, not the normal route.' },
    { q: 'When is Nanga Parbat climbed?', a: 'In the summer, mainly June and July. It was first climbed in winter in February 2016.' },
    { q: 'Who first climbed Nanga Parbat?', a: 'Hermann Buhl (Austria), on 3 July 1953, solo on the final section, without supplemental oxygen, on the German–Austrian expedition led by Karl Herrligkoffer.' }
  ],
  relatedTreks: [],
  relatedDestinations: ['Fairy Meadows & the Rakhiot Face', 'Karakoram Highway', 'Gilgit']
};

MOUNTAINS['annapurna'] = {
  slug: 'annapurna',
  name: 'Annapurna I',
  aka: 'Annapurna Main',
  rank: 10,
  elevationM: 8091, elevationLabel: '8,091 m', elevationFt: 26545,
  countries: ['Nepal'], countryLabel: 'Nepal',
  range: 'Annapurna Himal', region: 'Myagdi / Kaski, Nepal',
  coordinates: { lat: 28.5958, lon: 83.8203 },
  inNepal: true,
  heroImage: '/images/annapurna_real.jpg',
  gallery: ['/images/annapurna_real.jpg', '/images/annapurna.png', '/images/hero-mountain.jpg'],
  tagline: 'The first eight-thousander ever climbed',
  summary: 'The tenth-highest mountain on Earth at 8,091 m, in north-central Nepal — and the first of the 8,000 m peaks to be climbed, by a French team in 1950. Every route on Annapurna I is threatened by avalanche and serac fall, and it has historically been regarded as the most dangerous of the fourteen.',
  seo: {
    title: 'Annapurna I Expedition — 8,091 m | The First Eight-Thousander: Routes, History & Season',
    description: 'A factual guide to Annapurna I, the tenth-highest mountain on Earth and the first 8,000er ever climbed: elevation and rank, the North Face normal route, first-ascent history, season and planning orientation.'
  },
  character: [
    'Annapurna I is the high point of the Annapurna Himal, a 55 km wall of peaks north of Pokhara, separated from Dhaulagiri by the Kali Gandaki gorge. Its name means roughly “goddess of the harvests”. It was the first 8,000 m mountain to be climbed, by Maurice Herzog and Louis Lachenal on 3 June 1950 — an ascent that cost both men fingers and toes to frostbite on a desperate descent.',
    'Annapurna has no easy line. The normal route today is the North Face (the “Dutch Rib” and adjacent lines), which climbs directly beneath a band of seracs and through avalanche terrain; the French route of 1950 followed the same face. Other routes — the South Face, the huge Northwest Face — are among the hardest and most dangerous in the Himalaya.',
    'The mountain is closely tied to the trekking region around it: the Annapurna Sanctuary, the Annapurna Circuit and Annapurna Base Camp all lie on its flanks, though the climbers’ Base Camp is a separate site on the north side.'
  ],
  firstAscent: {
    year: 1950, date: '3 June 1950',
    climbers: 'Maurice Herzog and Louis Lachenal (France)',
    expedition: 'French Annapurna Expedition, led by Maurice Herzog — the first ascent of any 8,000 m peak',
    route: 'North Face, from Nepal'
  },
  notableAscents: [
    { label: 'The first 8,000er', detail: 'Annapurna I was climbed three years before Everest — the breakthrough that opened the era of Himalayan 8,000 m climbing.' },
    { label: 'South Face', detail: '1970 — a British team led by Chris Bonington climbed the enormous Annapurna South Face, a landmark in big-wall Himalayan climbing.' },
    { label: 'First winter ascent', detail: '1987 — Jerzy Kukuczka and Artur Hajzer (Polish expedition), via a hard line on the South Face.' }
  ],
  normalRoute: {
    name: 'North Face, from Nepal',
    character: 'Moderate in pure climbing terms but severely threatened by avalanche and serac fall for much of its length — the defining hazard of the mountain.',
    sections: [
      { name: 'Base Camp to Camp 1', detail: 'Glacier and moraine on the north side to a camp around 5,100 m.' },
      { name: 'Camps 1–2', detail: 'Snow slopes and an icefall beneath serac barriers to Camp 2 (~5,600 m).' },
      { name: 'The upper face', detail: 'Ascending traverses and snow slopes past hanging glaciers to Camps 3 and 4 (~6,500 m and ~7,000 m) — the most avalanche- and serac-exposed section.' },
      { name: 'Summit day', detail: 'A long snow slope and a final ridge to the summit — not steep, but a long day in dangerous terrain.' }
    ]
  },
  alternativeRoutes: ['South Face (1970) — one of the great Himalayan walls', 'Northwest Face — extremely hazardous, few ascents', 'East Ridge traverse — long and committing'],
  baseCampM: 4130,
  baseCampNote: 'The climbers’ Base Camp on the north side is at around 4,130–4,200 m, reached by a short trek or a helicopter lift from the Pokhara side. This is a different site from the trekkers’ Annapurna Base Camp in the Sanctuary to the south.',
  camps: [
    { name: 'Base Camp (North)', altM: 4130, note: 'North-side glacier' },
    { name: 'Camp 1', altM: 5100, note: '' },
    { name: 'Camp 2', altM: 5600, note: 'Serac-exposed' },
    { name: 'Camp 3', altM: 6500, note: '' },
    { name: 'Camp 4', altM: 7000, note: 'Summit launch' },
    { name: 'Summit', altM: 8091, note: '' }
  ],
  approach: 'Fly or drive to Pokhara, then a short trek or (commonly) a helicopter lift to the north-side Base Camp. The trekking routes on the mountain’s southern flanks — the Annapurna Sanctuary and Circuit — are separate.',
  season: {
    primary: 'Spring', window: 'April–May (some autumn)',
    months: { Jan: 'winter', Feb: 'winter', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'shoulder', Oct: 'shoulder', Nov: 'rare', Dec: 'winter' },
    note: 'Pre-monsoon spring is the main season, with limited autumn attempts. Avalanche conditions on the North Face are a major factor in the timing of any push.'
  },
  typicalDurationDays: '40–50 days',
  difficulty: { technical: 4, altitude: 5, exposure: 4, weather: 4, remoteness: 3, objectiveHazard: 5, summary: 'The objective hazard defines this mountain: every route runs under avalanche and serac terrain. Historically the most dangerous of the 14. Moderate climbing, extreme exposure to falling ice and snow.' },
  objectiveHazards: ['Serac collapse from hanging glaciers across the North Face', 'Avalanche on the face after snowfall or in afternoon warmth', 'Little safe ground — camps and the route itself are in the fall line', 'Storms on an exposed upper mountain', 'A long summit day with a committing descent through the hazard zone'],
  history: [
    'The 1950 French expedition arrived with almost no reliable maps, spent weeks finding the mountain, and then climbed it in a single rapid push. Herzog and Lachenal reached the summit and paid for it: caught by storm and exhaustion on the descent, both suffered severe frostbite and lost fingers and toes. Herzog’s account, "Annapurna", became one of the best-selling mountaineering books ever written.',
    'The 1970 British South Face expedition redefined what was possible on a Himalayan wall. Annapurna was first climbed in winter in 1987.',
    'The mountain has never been busy. Its combination of moderate climbing and extreme, unavoidable objective hazard has given it a fearsome reputation among the 8,000ers.'
  ],
  logistics: 'An Annapurna expedition combines a short approach (often by helicopter) with a stocked Base Camp, fixed rope on the North Face, Sherpa climbing support and oxygen for most climbers. Timing the summit push around avalanche conditions is the central problem, and expeditions need patience and a firm hazard-assessment discipline. Confirm current permit and liaison-officer rules for the year.',
  permit: { authority: 'Department of Tourism, Government of Nepal, plus Annapurna Conservation Area permits', note: 'Climbing permit, liaison officer, registered operator and conservation-area fees required. Rules are revised regularly.', verify: true },
  equipment: ['8,000 m down suit and summit boots', 'High-altitude sleeping system (−40°C and below)', 'Oxygen system for most climbers', 'Crampons, ice axe plus a technical tool, harness, ascender, belay/rappel device', 'Helmet', 'Expedition mittens, goggles, glacier glasses'],
  weather: 'Annapurna’s spring weather is broadly similar to the central Nepal peaks, but the key variable is snowfall on the North Face — fresh snow dramatically raises the avalanche hazard on a route that is already in the fall line for much of its length.',
  acclimatisation: 'Two or three rotations up the North Face over three to four weeks — to Camp 1, then Camp 2, then a touch of Camp 3 — with camps and rotations timed to minimise exposure to the hazard zones, before a summit push on a settled, cold window.',
  rescue: { note: 'Helicopter evacuation is possible from Base Camp and the lower glacier in good weather. The exposed North Face is a very difficult place to effect a rescue. Confirm current arrangements and carry appropriate insurance.', verify: true },
  guideSupport: 'Commercial expeditions run with Sherpa climbing support and fixed rope on the route. Given the objective hazard, Annapurna is a mountain for experienced 8,000 m climbers who understand and accept the risk profile — it is not a first or second 8,000er.',
  faq: [
    { q: 'How high is Annapurna I?', a: '8,091 m (26,545 ft) — the tenth-highest mountain on Earth, entirely within Nepal.' },
    { q: 'Was Annapurna the first 8,000er to be climbed?', a: 'Yes. Maurice Herzog and Louis Lachenal reached the summit on 3 June 1950, three years before Everest — the first ascent of any mountain over 8,000 m.' },
    { q: 'Is Annapurna the most dangerous of the 8,000ers?', a: 'It has historically been regarded as the most dangerous of the fourteen. Every route runs under avalanche and serac terrain, and there is very little safe ground on the mountain. The climbing itself is moderate.' },
    { q: 'Is the climbers’ Base Camp the same as Annapurna Base Camp on the trek?', a: 'No. The trekkers’ Annapurna Base Camp is in the Annapurna Sanctuary on the south side. Climbing expeditions use a separate Base Camp on the north side of the mountain.' },
    { q: 'When is Annapurna I climbed?', a: 'Mainly in the pre-monsoon spring (April–May), with the summit push timed around avalanche conditions on the North Face.' },
    { q: 'Who first climbed Annapurna?', a: 'Maurice Herzog and Louis Lachenal (France) on 3 June 1950, via the North Face — both suffered severe frostbite on the descent.' }
  ],
  relatedTreks: ['annapurna-base-camp', 'annapurna-circuit', 'mardi-himal'],
  relatedDestinations: ['Annapurna Sanctuary', 'Pokhara & Phewa Lake', 'Kali Gandaki gorge']
};

MOUNTAINS['gasherbrum-i'] = {
  slug: 'gasherbrum-i',
  name: 'Gasherbrum I',
  aka: 'Hidden Peak · K5',
  rank: 11,
  elevationM: 8080, elevationLabel: '8,080 m', elevationFt: 26509,
  countries: ['Pakistan', 'China'], countryLabel: 'Pakistan / China',
  range: 'Karakoram (Gasherbrum group)', region: 'Gilgit-Baltistan, Pakistan / Xinjiang, China',
  coordinates: { lat: 35.7239, lon: 76.6964 },
  inNepal: false,
  heroImage: '/images/manaslu_real.jpg',
  gallery: ['/images/manaslu_real.jpg', '/images/hero-mountain.jpg', '/images/manaslu.png'],
  tagline: 'Hidden Peak, deep in the Karakoram',
  summary: 'The eleventh-highest mountain on Earth at 8,080 m, in the heart of the Karakoram near the Chinese border. Called “Hidden Peak” because it is screened from the Baltoro Glacier by its neighbours. A remote, glaciated, technically moderate 8,000er most often climbed in combination with Gasherbrum II.',
  seo: {
    title: 'Gasherbrum I Expedition — 8,080 m (Hidden Peak) | Route, History & Season',
    description: 'A factual guide to Gasherbrum I (Hidden Peak), the eleventh-highest mountain on Earth: elevation and rank, the Japanese Couloir normal route, first-ascent history, the summer Karakoram season and planning orientation.'
  },
  character: [
    'Gasherbrum I is the highest of the Gasherbrum group, a cluster of peaks at the head of the Baltoro Glacier straddling the Pakistan–China border. It was labelled “K5” in the Karakoram survey and nicknamed “Hidden Peak” because, unlike Broad Peak and Gasherbrum II, it cannot be seen from the main Baltoro approach — it sits behind its neighbours.',
    'The normal route climbs from the South Gasherbrum Glacier via the “Japanese Couloir” — a snow-and-ice gully — onto the upper mountain, then a long snow slope and summit ridge. It is technically moderate by Karakoram standards, but it is high, cold, heavily glaciated and extremely remote: the approach is a full Baltoro Glacier trek, the same as for K2.',
    'Because Gasherbrum I and Gasherbrum II share a Base Camp and much of their lower approach, many expeditions attempt both in a single trip.'
  ],
  firstAscent: {
    year: 1958, date: '5 July 1958',
    climbers: 'Andrew Kauffman and Pete Schoening (United States)',
    expedition: 'American Karakoram Expedition, led by Nicholas Clinch — the only American first ascent of an 8,000 m peak',
    route: 'Roch Ridge / Northeast face (the “IHE route”), from Pakistan'
  },
  notableAscents: [
    { label: 'The only American 8,000er first ascent', detail: 'Gasherbrum I is the sole 8,000 m peak first climbed by an American expedition.' },
    { label: 'A landmark alpine-style ascent', detail: '1975 — Reinhold Messner and Peter Habeler climbed a new route on the Northwest Face in pure alpine style, without fixed ropes, camps or support — a turning point for how 8,000ers could be climbed.' },
    { label: 'First winter ascent', detail: '2012 — Adam Bielecki and Janusz Gołąb (Polish expedition).' }
  ],
  normalRoute: {
    name: 'Japanese Couloir / South Gasherbrum Glacier, from Pakistan',
    character: 'Technically moderate — a snow-and-ice couloir, then glacier and snow slopes — but remote, heavily crevassed and cold.',
    sections: [
      { name: 'Base Camp to Camp 1', detail: 'The South Gasherbrum Glacier, crevassed, to a camp around 5,900 m.' },
      { name: 'The Japanese Couloir', detail: 'A snow-and-ice gully (up to ~45–50°) leading onto the upper mountain, between Camps 1 and 2.' },
      { name: 'Camps 2–3', detail: 'Glacier and snow slopes to camps at roughly 6,400 m and 7,000 m.' },
      { name: 'Summit day', detail: 'A long snow slope and a final ridge to the summit — moderate angle, but a long day at altitude.' }
    ]
  },
  alternativeRoutes: ['Northwest Face (1975 Messner–Habeler alpine route)', 'Southwest Ridge / South Face variants', 'North side routes from China — rarely climbed'],
  baseCampM: 5000,
  baseCampNote: 'Base Camp is on the Abruzzi / South Gasherbrum Glacier at around 5,000 m, shared with Gasherbrum II, reached by a 7–8 day trek up the Baltoro Glacier from Askole.',
  camps: [
    { name: 'Base Camp', altM: 5000, note: 'Shared with Gasherbrum II' },
    { name: 'Camp 1', altM: 5900, note: '' },
    { name: 'Camp 2', altM: 6400, note: 'Above the Japanese Couloir' },
    { name: 'Camp 3', altM: 7000, note: 'Summit launch' },
    { name: 'Summit', altM: 8080, note: '' }
  ],
  approach: 'Fly or drive Islamabad–Skardu, jeep to Askole, then a 7–8 day trek up the Baltoro Glacier via Concordia to Base Camp — the same approach as K2 and Broad Peak.',
  season: {
    primary: 'Summer', window: 'July–August',
    months: { Jan: 'winter', Feb: 'winter', Mar: 'closed', Apr: 'closed', May: 'rare', Jun: 'shoulder', Jul: 'prime', Aug: 'prime', Sep: 'rare', Oct: 'closed', Nov: 'closed', Dec: 'winter' },
    note: 'A Karakoram summer mountain, climbed in July and August. First winter ascent in 2012.'
  },
  typicalDurationDays: '45–55 days (including the Baltoro trek)',
  difficulty: { technical: 4, altitude: 4, exposure: 4, weather: 4, remoteness: 5, objectiveHazard: 4, summary: 'Moderate climbing on a very remote, heavily glaciated mountain with a week-long glacier approach. The Japanese Couloir and the crevassed lower glacier are the main technical and objective challenges.' },
  objectiveHazards: ['Crevasse hazard on the South Gasherbrum Glacier', 'Avalanche and windslab in the Japanese Couloir', 'Storms with no easy retreat from a remote high camp', 'Cold and windchill typical of the Karakoram', 'Very limited high-altitude rescue'],
  history: [
    'Gasherbrum I was reconnoitred in 1934 and 1936 and climbed in 1958 by the American expedition led by Nicholas Clinch — the only 8,000 m first ascent by an American team.',
    'In 1975 Reinhold Messner and Peter Habeler climbed a new route on the Northwest Face in pure alpine style — no fixed ropes, no camps stocked in advance, no support — proving that an 8,000er could be climbed like a big Alpine peak. It is one of the most influential ascents in the sport.',
    'A Polish team made the first winter ascent in 2012.'
  ],
  logistics: 'A Gasherbrum I expedition shares its Base Camp and approach with Gasherbrum II, and many trips attempt both. Pakistan-based logistics, a mandatory liaison officer, a stocked Base Camp for the whole team, fixed rope in the couloir and on the upper route, Sherpa or Pakistani high-altitude support, and oxygen for most climbers. Confirm current permit and liaison-officer rules for the year.',
  permit: { authority: 'Gilgit-Baltistan Council / Ministry of Tourism, Government of Pakistan', note: 'Royalty payment, liaison officer and registered operator required. Fees vary by peak and party size and are revised regularly.', verify: true },
  equipment: ['8,000 m down suit and summit boots', 'A technical ice tool plus an axe for the couloir', 'High-altitude sleeping system (−40°C and below)', 'Oxygen system for most climbers', 'Crampons, harness, ascender, belay/rappel device, helmet', 'Crevasse-rescue kit for the glacier', 'Expedition mittens, goggles, glacier glasses'],
  weather: 'Karakoram summer weather — settled spells between disturbances, short windows, and cold typical of the range’s high latitude. The Gasherbrum group generates its own weather at the head of the glacier system.',
  acclimatisation: 'Two or three rotations over three to four weeks — to Camp 1, then Camp 2 above the couloir, then a touch of Camp 3 — before a summit push on a forecast window. Teams attempting both Gasherbrums often use one peak’s rotations to acclimatise for the other.',
  rescue: { note: 'Pakistan Army Aviation helicopters can reach Base Camp in good weather; above Camp 1, rescue is by the team. Evacuation off the Baltoro is slow. Confirm current arrangements and carry appropriate insurance.', verify: true },
  guideSupport: 'Commercial expeditions run with Sherpa or Pakistani high-altitude support and fixed rope on the couloir and upper route. Prior 7,000 m or 8,000 m experience and glacier-travel competence are expected.',
  faq: [
    { q: 'How high is Gasherbrum I?', a: '8,080 m (26,509 ft) — the eleventh-highest mountain on Earth.' },
    { q: 'Why is it called “Hidden Peak”?', a: 'Because, unlike Broad Peak and Gasherbrum II, it is screened by other peaks and cannot be seen from the main Baltoro Glacier approach. The surveyors labelled it K5.' },
    { q: 'Can you climb both Gasherbrums in one trip?', a: 'Yes — Gasherbrum I and Gasherbrum II share a Base Camp and much of the lower approach, and many expeditions attempt both in a single season.' },
    { q: 'How difficult is Gasherbrum I?', a: 'Technically moderate by Karakoram standards — a snow-and-ice couloir and glacier slopes — but very remote, heavily crevassed, cold, and a week-long glacier trek from the roadhead.' },
    { q: 'When is Gasherbrum I climbed?', a: 'In the Karakoram summer, July and August. First winter ascent in 2012.' },
    { q: 'Who first climbed Gasherbrum I?', a: 'Andrew Kauffman and Pete Schoening (USA) on 5 July 1958 — the only 8,000 m first ascent by an American expedition.' }
  ],
  relatedTreks: [],
  relatedDestinations: ['Baltoro Glacier & Concordia trek', 'Gasherbrum II', 'Skardu']
};

MOUNTAINS['broad-peak'] = {
  slug: 'broad-peak',
  name: 'Broad Peak',
  aka: 'Falchan Kangri · K3',
  rank: 12,
  elevationM: 8051, elevationLabel: '8,051 m', elevationFt: 26414,
  countries: ['Pakistan', 'China'], countryLabel: 'Pakistan / China',
  range: 'Karakoram (Gasherbrum group)', region: 'Gilgit-Baltistan, Pakistan / Xinjiang, China',
  coordinates: { lat: 35.8106, lon: 76.5656 },
  inNepal: false,
  heroImage: '/images/hero-mountain.jpg',
  gallery: ['/images/hero-mountain.jpg', '/images/manaslu_real.jpg', '/images/manaslu.png'],
  tagline: 'K2’s broad-shouldered neighbour',
  summary: 'The twelfth-highest mountain on Earth at 8,051 m, immediately south-east of K2 and sharing its Base Camp approach. A wide massif with a long summit ridge; the normal route is technically moderate, but the summit day is exceptionally long, with a false summit that has cost lives.',
  seo: {
    title: 'Broad Peak Expedition — 8,051 m | West Spur Route, History & Season',
    description: 'A factual guide to Broad Peak, the twelfth-highest mountain on Earth: elevation and rank, the West Spur normal route, the long summit day and false summit, first-ascent history, season and planning orientation.'
  },
  character: [
    'Broad Peak sits directly across the Godwin-Austen Glacier from K2, so close that expeditions to the two mountains share a Base Camp approach. Its local name, Falchan Kangri, and the survey label K3 both predate the English name, which comes from the mountain’s wide, multi-summited crest — a summit ridge over 1.5 km long.',
    'The normal route, the West Spur, is technically moderate: snow and ice slopes and a rock band to a col at around 7,800 m, then a long traverse along the summit ridge. The difficulty is the summit day. From the last camp it is a very long push to the col, then a deceptive ridge with a prominent fore-summit; climbers have summited the fore-summit believing it to be the top, and others have run out of daylight or strength on the traverse to the true summit and not returned.',
    'Broad Peak is often climbed as an acclimatisation peak for K2, and was the site, in 1957, of the first ascent of an 8,000er by a team climbing without high-altitude porters or supplemental oxygen.'
  ],
  firstAscent: {
    year: 1957, date: '9 June 1957',
    climbers: 'Fritz Wintersteller, Marcus Schmuck, Kurt Diemberger and Hermann Buhl (Austria)',
    expedition: 'A small Austrian expedition with no high-altitude porters and no supplemental oxygen — radical for its time',
    route: 'West Spur, from Pakistan'
  },
  notableAscents: [
    { label: 'A landmark in style', detail: 'The 1957 first ascent was made by a four-man team carrying their own loads, without porters above Base Camp and without oxygen — a preview of the alpine-style era.' },
    { label: 'Hermann Buhl’s last summit', detail: 'Buhl summited Broad Peak weeks before dying on nearby Chogolisa in 1957, when a cornice collapsed.' },
    { label: 'First winter ascent', detail: '2013 — Maciej Berbeka, Adam Bielecki, Tomasz Kowalski and Artur Małek (Polish expedition); Berbeka and Kowalski died on the descent.' }
  ],
  normalRoute: {
    name: 'West Spur, from Pakistan',
    character: 'Technically moderate — snow and ice slopes and a rock band — but with an exceptionally long summit day and a deceptive summit ridge with a false top.',
    sections: [
      { name: 'Base Camp to Camp 1', detail: 'The lower spur, on snow and easy rock, to a camp around 5,800 m.' },
      { name: 'Camps 1–3', detail: 'Snow and ice slopes and a rock band to camps at roughly 6,300 m, 7,000 m and 7,400 m.' },
      { name: 'The col (~7,800 m)', detail: 'A long push from the top camp to the col on the summit ridge — the point at which many summit days go wrong on timing.' },
      { name: 'Summit ridge', detail: 'A traverse of over a kilometre along the ridge, over or around a prominent fore-summit, to the true summit. The false summit has been fatal.' }
    ]
  },
  alternativeRoutes: ['Northwest Ridge — long and rarely climbed', 'The full traverse of the three summits — an elite objective', 'Chinese-side routes — seldom attempted'],
  baseCampM: 4900,
  baseCampNote: 'Base Camp is on the Godwin-Austen Glacier at around 4,900–5,000 m, near the K2 Base Camp approach, reached by a 7–8 day trek up the Baltoro Glacier from Askole.',
  camps: [
    { name: 'Base Camp', altM: 4900, note: 'Godwin-Austen Glacier' },
    { name: 'Camp 1', altM: 5800, note: '' },
    { name: 'Camp 2', altM: 6300, note: '' },
    { name: 'Camp 3', altM: 7000, note: '' },
    { name: 'Camp 4', altM: 7400, note: 'Summit launch' },
    { name: 'The Col', altM: 7800, note: 'Gateway to the summit ridge' },
    { name: 'Summit', altM: 8051, note: 'True summit beyond a prominent fore-summit' }
  ],
  approach: 'Fly or drive Islamabad–Skardu, jeep to Askole, then a 7–8 day trek up the Baltoro Glacier via Concordia to Base Camp — the same approach as K2.',
  season: {
    primary: 'Summer', window: 'July–August',
    months: { Jan: 'winter', Feb: 'winter', Mar: 'closed', Apr: 'closed', May: 'rare', Jun: 'shoulder', Jul: 'prime', Aug: 'prime', Sep: 'rare', Oct: 'closed', Nov: 'closed', Dec: 'winter' },
    note: 'A Karakoram summer mountain, climbed in July and August, often as acclimatisation for K2. First winter ascent in 2013.'
  },
  typicalDurationDays: '40–55 days (including the Baltoro trek)',
  difficulty: { technical: 3, altitude: 4, exposure: 4, weather: 4, remoteness: 5, objectiveHazard: 4, summary: 'Moderate climbing on a very remote mountain, but with an unusually long and committing summit day and a false summit that has repeatedly caught out tired climbers late in the day.' },
  objectiveHazards: ['The length of the summit day — running out of time or strength on the ridge', 'The false summit — mistaking it for the true top, or being defeated by the traverse beyond it', 'Avalanche and windslab on the spur after snowfall', 'Cornice collapse along the summit ridge', 'Cold and windchill; very limited high-altitude rescue'],
  history: [
    'Broad Peak was reconnoitred by an unsuccessful German expedition in 1954 and climbed in 1957 by a small Austrian team — Wintersteller, Schmuck, Diemberger and Buhl — who carried their own loads and used no oxygen, an approach far ahead of its time.',
    'Buhl, already famous for Nanga Parbat, died weeks later on nearby Chogolisa. The mountain’s modern reputation is built on its summit day: the long traverse past the fore-summit has cost the lives of climbers who summited the false top or could not complete the ridge in daylight.',
    'A Polish team made the first winter ascent in 2013, a success marred by the deaths of two of the four climbers on the descent.'
  ],
  logistics: 'A Broad Peak expedition uses the same Baltoro approach and much of the same infrastructure as K2, and is often run alongside a K2 attempt. Pakistan-based logistics, a mandatory liaison officer, a stocked Base Camp, fixed rope on the spur and upper route, Sherpa or Pakistani high-altitude support, and oxygen for most climbers. Confirm current permit and liaison-officer rules for the year.',
  permit: { authority: 'Gilgit-Baltistan Council / Ministry of Tourism, Government of Pakistan', note: 'Royalty payment, liaison officer and registered operator required. Fees vary by peak and party size and are revised regularly.', verify: true },
  equipment: ['8,000 m down suit and summit boots', 'High-altitude sleeping system (−40°C and below)', 'Oxygen system for most climbers', 'Crampons, ice axe, harness, ascender, belay/rappel device, helmet', 'A reliable headlamp and spare batteries for the long summit day', 'Expedition mittens, goggles, glacier glasses'],
  weather: 'Karakoram summer weather — short settled windows between disturbances, and cold typical of the range. The long summit day means a window has to be genuinely settled to be usable.',
  acclimatisation: 'Two or three rotations over three to four weeks — to Camp 1, then Camp 2, then a touch of Camp 3 — before a summit push on a forecast window. Broad Peak is frequently used as the acclimatisation objective for a K2 attempt in the same season.',
  rescue: { note: 'Pakistan Army Aviation helicopters can reach Base Camp in good weather; above Camp 1, rescue is by the team. The summit ridge is a very difficult place to effect any rescue. Confirm current arrangements and carry appropriate insurance.', verify: true },
  guideSupport: 'Commercial expeditions run with Sherpa or Pakistani high-altitude support and fixed rope on the route. Prior 7,000 m or 8,000 m experience is expected; the summit day demands good pacing and a firm turnaround discipline.',
  faq: [
    { q: 'How high is Broad Peak?', a: '8,051 m (26,414 ft) — the twelfth-highest mountain on Earth.' },
    { q: 'Where is Broad Peak?', a: 'In the Karakoram, immediately south-east of K2 across the Godwin-Austen Glacier, on the Pakistan–China border. It shares K2’s Baltoro Glacier approach.' },
    { q: 'What is the false summit on Broad Peak?', a: 'The summit ridge is over a kilometre long, with a prominent fore-summit before the true top. Tired climbers have summited the fore-summit believing it to be the highest point, and others have been unable to complete the traverse to the true summit in daylight — both scenarios have been fatal.' },
    { q: 'Is Broad Peak a good acclimatisation peak for K2?', a: 'It is commonly used that way, since it shares K2’s Base Camp approach and is technically more moderate. It is still a full 8,000 m peak with a serious summit day.' },
    { q: 'When is Broad Peak climbed?', a: 'In the Karakoram summer, July and August. First winter ascent in 2013.' },
    { q: 'Who first climbed Broad Peak?', a: 'Fritz Wintersteller, Marcus Schmuck, Kurt Diemberger and Hermann Buhl (Austria) on 9 June 1957, without porters above Base Camp and without supplemental oxygen.' }
  ],
  relatedTreks: [],
  relatedDestinations: ['Baltoro Glacier & Concordia trek', 'K2 Base Camp', 'Skardu']
};

MOUNTAINS['gasherbrum-ii'] = {
  slug: 'gasherbrum-ii',
  name: 'Gasherbrum II',
  aka: 'K4',
  rank: 13,
  elevationM: 8035, elevationLabel: '8,035 m', elevationFt: 26362,
  countries: ['Pakistan', 'China'], countryLabel: 'Pakistan / China',
  range: 'Karakoram (Gasherbrum group)', region: 'Gilgit-Baltistan, Pakistan / Xinjiang, China',
  coordinates: { lat: 35.7583, lon: 76.6533 },
  inNepal: false,
  heroImage: '/images/manaslu.png',
  gallery: ['/images/manaslu.png', '/images/manaslu_real.jpg', '/images/hero-mountain.jpg'],
  tagline: 'Often considered the most attainable Karakoram eight-thousander',
  summary: 'The thirteenth-highest mountain on Earth at 8,035 m, in the Gasherbrum group on the Pakistan–China border. Its Southwest Ridge normal route is widely regarded as the most attainable of the Karakoram 8,000ers — technically moderate and objectively safer than its neighbours — though the remote glacier approach keeps it serious.',
  seo: {
    title: 'Gasherbrum II Expedition — 8,035 m | Southwest Ridge Route, History & Season',
    description: 'A factual guide to Gasherbrum II, the thirteenth-highest mountain on Earth: elevation and rank, the Southwest Ridge normal route, first-ascent history, the summer Karakoram season and planning orientation.'
  },
  character: [
    'Gasherbrum II stands next to Gasherbrum I at the head of the Baltoro Glacier system. Labelled K4 by the survey, it is the more frequently climbed of the two, and is often described as the most attainable of the five Karakoram 8,000 m peaks — the closest thing the range has to a “trade route”.',
    'The normal route, the Southwest Ridge, climbs a rock band and snow slopes to a shoulder, then follows the ridge and a final snow pyramid to the summit. It is technically moderate, and the route is less exposed to serac and avalanche hazard than K2, Broad Peak or the Gasherbrum I couloir. What keeps it serious is the setting: an 8,000 m peak reached only by the full week-long Baltoro Glacier trek, with all the remoteness and limited rescue that implies.',
    'Because it shares a Base Camp with Gasherbrum I, the two are frequently climbed together.'
  ],
  firstAscent: {
    year: 1956, date: '7 July 1956',
    climbers: 'Fritz Moravec, Josef Larch and Hans Willenpart (Austria)',
    expedition: 'Austrian Karakoram Expedition',
    route: 'Southwest Ridge, from Pakistan — including a bold push from a high bivouac'
  },
  notableAscents: [
    { label: 'First winter ascent', detail: '2 February 2011 — Simone Moro, Denis Urubko and Cory Richards, the first winter ascent of any Karakoram 8,000er.' },
    { label: 'Alpine-style ascents', detail: 'Gasherbrum II has seen many fast, lightweight ascents and is a common objective for climbers moving toward a self-supported style.' }
  ],
  normalRoute: {
    name: 'Southwest Ridge, from Pakistan',
    character: 'Technically moderate — a rock band, snow slopes, a ridge and a final snow pyramid — and less objectively hazardous than its Karakoram neighbours.',
    sections: [
      { name: 'Base Camp to Camp 1', detail: 'The South Gasherbrum Glacier, crevassed, to a camp around 5,900 m.' },
      { name: 'The rock band', detail: 'A short mixed step between Camps 1 and 2 (~6,500 m).' },
      { name: 'Camps 2–3', detail: 'Snow slopes and the ridge to a top camp around 7,000 m.' },
      { name: 'Summit day', detail: 'The ridge and a final snow pyramid to the summit — moderate angle, a long but not technical day.' }
    ]
  },
  alternativeRoutes: ['East Ridge / East Face routes', 'The 1975 Messner–Habeler style ascents', 'North side routes from China — rarely climbed'],
  baseCampM: 5000,
  baseCampNote: 'Base Camp is on the Abruzzi / South Gasherbrum Glacier at around 5,000 m, shared with Gasherbrum I, reached by a 7–8 day trek up the Baltoro Glacier from Askole.',
  camps: [
    { name: 'Base Camp', altM: 5000, note: 'Shared with Gasherbrum I' },
    { name: 'Camp 1', altM: 5900, note: '' },
    { name: 'Camp 2', altM: 6500, note: 'Above the rock band' },
    { name: 'Camp 3', altM: 7000, note: 'Summit launch' },
    { name: 'Summit', altM: 8035, note: '' }
  ],
  approach: 'Fly or drive Islamabad–Skardu, jeep to Askole, then a 7–8 day trek up the Baltoro Glacier via Concordia to Base Camp — the same approach as K2, Broad Peak and Gasherbrum I.',
  season: {
    primary: 'Summer', window: 'July–August',
    months: { Jan: 'winter', Feb: 'winter', Mar: 'closed', Apr: 'closed', May: 'rare', Jun: 'shoulder', Jul: 'prime', Aug: 'prime', Sep: 'rare', Oct: 'closed', Nov: 'closed', Dec: 'winter' },
    note: 'A Karakoram summer mountain, climbed in July and August. It was the first Karakoram 8,000er to be climbed in winter, in 2011.'
  },
  typicalDurationDays: '40–50 days (including the Baltoro trek)',
  difficulty: { technical: 3, altitude: 4, exposure: 3, weather: 4, remoteness: 5, objectiveHazard: 3, summary: 'The most attainable Karakoram 8,000er — moderate climbing, relatively low objective hazard — but still a very remote, glaciated 8,000 m peak a week’s trek from the roadhead.' },
  objectiveHazards: ['Crevasse hazard on the South Gasherbrum Glacier', 'Windslab and avalanche on the route after snowfall', 'Storms with a slow retreat from a remote high camp', 'Cold and windchill typical of the Karakoram', 'Very limited high-altitude rescue'],
  history: [
    'Gasherbrum II was climbed in 1956 by an Austrian team, including a committing push from a high bivouac to reach the summit. It went on to become the most-climbed of the Karakoram 8,000ers, valued as a moderate objective with relatively low objective hazard.',
    'In February 2011 Simone Moro, Denis Urubko and Cory Richards made the first winter ascent of any Karakoram 8,000 m peak, escaping an avalanche on the descent — an ascent documented in Richards’s film "Cold".'
  ],
  logistics: 'A Gasherbrum II expedition shares its Base Camp and approach with Gasherbrum I, and many trips attempt both. Pakistan-based logistics, a mandatory liaison officer, a stocked Base Camp, fixed rope on the rock band and upper route, Sherpa or Pakistani high-altitude support, and oxygen for most (though a meaningful number climb it without). Confirm current permit and liaison-officer rules for the year.',
  permit: { authority: 'Gilgit-Baltistan Council / Ministry of Tourism, Government of Pakistan', note: 'Royalty payment, liaison officer and registered operator required. Fees vary by peak and party size and are revised regularly.', verify: true },
  equipment: ['8,000 m down suit and summit boots', 'High-altitude sleeping system (−40°C and below)', 'Oxygen system (used by many, not all)', 'Crampons, ice axe, harness, ascender, belay/rappel device, helmet', 'Crevasse-rescue kit for the glacier', 'Expedition mittens, goggles, glacier glasses'],
  weather: 'Karakoram summer weather — settled spells between disturbances, short windows, and the cold typical of the range. Gasherbrum II’s moderate summit day makes it a little more forgiving of a marginal window than Broad Peak or K2.',
  acclimatisation: 'Two or three rotations over three to four weeks — to Camp 1, then Camp 2, then a touch of Camp 3 — before a summit push on a forecast window. Teams doing both Gasherbrums use one peak to acclimatise for the other.',
  rescue: { note: 'Pakistan Army Aviation helicopters can reach Base Camp in good weather; above Camp 1, rescue is by the team. Evacuation off the Baltoro is slow. Confirm current arrangements and carry appropriate insurance.', verify: true },
  guideSupport: 'Commercial expeditions run with Sherpa or Pakistani high-altitude support and fixed rope on the route. Gasherbrum II is a reasonable first Karakoram 8,000er for climbers with prior 7,000 m experience and solid glacier-travel skills.',
  faq: [
    { q: 'How high is Gasherbrum II?', a: '8,035 m (26,362 ft) — the thirteenth-highest mountain on Earth.' },
    { q: 'Is Gasherbrum II the easiest Karakoram 8,000er?', a: 'It is generally considered the most attainable of the five Karakoram 8,000ers — technically moderate and with lower objective hazard than K2, Broad Peak or Gasherbrum I. It is still a very remote 8,000 m peak.' },
    { q: 'Can you climb it without supplemental oxygen?', a: 'Many climbers do — it is one of the more common 8,000ers to be climbed without oxygen — but that remains a significant step up in difficulty and should only be considered with the relevant experience.' },
    { q: 'When is Gasherbrum II climbed?', a: 'In the Karakoram summer, July and August. It was the first Karakoram 8,000er climbed in winter, in February 2011.' },
    { q: 'Who first climbed Gasherbrum II?', a: 'Fritz Moravec, Josef Larch and Hans Willenpart (Austria) on 7 July 1956, via the Southwest Ridge.' }
  ],
  relatedTreks: [],
  relatedDestinations: ['Baltoro Glacier & Concordia trek', 'Gasherbrum I', 'Skardu']
};

MOUNTAINS['shishapangma'] = {
  slug: 'shishapangma',
  name: 'Shishapangma',
  aka: 'Gosainthan · Xixabangma',
  rank: 14,
  elevationM: 8027, elevationLabel: '8,027 m', elevationFt: 26335,
  countries: ['China (Tibet)'], countryLabel: 'China (Tibet)',
  range: 'Jugal / Langtang Himal', region: 'Tingri, Tibet',
  coordinates: { lat: 28.3525, lon: 85.7792 },
  inNepal: false,
  heroImage: '/images/langtang_real.jpg',
  gallery: ['/images/langtang_real.jpg', '/images/hero-mountain.jpg', '/images/manaslu.png'],
  tagline: 'The only eight-thousander entirely in Tibet — and the last to be climbed',
  summary: 'The fourteenth-highest mountain on Earth at 8,027 m, and the only one that lies entirely within China (Tibet). It was the last of the 14 to be first climbed, in 1964, because access to Tibet was closed to foreign expeditions. Technically moderate, but avalanche-prone, and complicated by the distinction between its central and true summits.',
  seo: {
    title: 'Shishapangma Expedition — 8,027 m | The Last Eight-Thousander: Route, History & Season',
    description: 'A factual guide to Shishapangma, the fourteenth-highest mountain on Earth and the only one entirely in Tibet: elevation and rank, the normal route, the central vs true summit issue, first-ascent history, season and planning.'
  },
  character: [
    'Shishapangma rises north of the main Himalayan crest in Tibet, about 10 km from the Nepal border, at the western end of the Langtang region. It is the smallest of the 14 by a narrow margin, and the only one located entirely within China. Its Tibetan name is often translated as “the range above the grassy plains”; the older Sanskrit name is Gosainthan.',
    'It was the last of the eight-thousanders to be climbed — not because it is especially hard, but because Tibet was closed to foreign expeditions until the late 1970s. A Chinese team made the first ascent in 1964.',
    'The normal route, from the north, is technically moderate: glacier, snow slopes and a summit ridge. Its complications are avalanche hazard on the upper slopes, and the geography of the top — the broad Central Summit (~8,008 m) is significantly easier to reach than the True (Main) Summit (~8,027 m), which lies beyond a corniced, exposed connecting ridge. For decades many “Shishapangma” ascents stopped at the central summit; a genuine ascent of the 14 requires the true top.'
  ],
  firstAscent: {
    year: 1964, date: '2 May 1964',
    climbers: 'Xu Jing and a team of nine other Chinese and Tibetan climbers',
    expedition: 'Chinese Shishapangma Expedition — the first ascent of the last unclimbed 8,000er',
    route: 'North Ridge / Northwest Face, from Tibet'
  },
  notableAscents: [
    { label: 'The last 8,000er to be first climbed', detail: 'Shishapangma completed the roster of the 14 in 1964, fourteen years after Annapurna.' },
    { label: 'First winter ascent', detail: '14 January 2005 — Piotr Morawski and Simone Moro.' },
    { label: 'Southwest Face', detail: 'The steep Southwest Face was climbed by a British team (Doug Scott, Alex MacIntyre, Roger Baxter-Jones) in alpine style in 1982 — a celebrated ascent.' }
  ],
  normalRoute: {
    name: 'North Ridge / Northwest Face, from Tibet',
    character: 'Technically moderate — glacier and snow slopes to a summit ridge — but avalanche-prone on the upper face, with a corniced final ridge to the true summit.',
    sections: [
      { name: 'Base Camp to Advanced Base Camp', detail: 'A road-accessible BC around 5,000 m; ABC on the glacier around 5,600–5,800 m, reached over one to two days.' },
      { name: 'ABC to Camp 1', detail: 'Glacier and moraine to a camp around 6,400 m.' },
      { name: 'Camps 1–3', detail: 'Snow slopes past avalanche-prone terrain to camps at roughly 6,900 m and 7,300 m.' },
      { name: 'Central Summit (~8,008 m)', detail: 'Reached by a snow slope and short ridge — historically where many ascents stopped.' },
      { name: 'True Summit (~8,027 m)', detail: 'Beyond a corniced, exposed connecting ridge from the central summit — the genuine top of the mountain.' }
    ]
  },
  alternativeRoutes: ['Southwest Face (1982 alpine-style route) — steeper and more direct', 'South and Southeast routes from the Nepal-border side — less common', 'Various new lines on the south faces — elite alpine only'],
  baseCampM: 5000,
  baseCampNote: 'The northern Base Camp at around 5,000 m is road-accessible from Tingri; Advanced Base Camp is on the glacier at around 5,600–5,800 m. Access is subject to Chinese permitting of the Tibetan side.',
  camps: [
    { name: 'Base Camp', altM: 5000, note: 'Road-accessible (Tibet)' },
    { name: 'Advanced Base Camp', altM: 5700, note: 'On the glacier' },
    { name: 'Camp 1', altM: 6400, note: '' },
    { name: 'Camp 2', altM: 6900, note: '' },
    { name: 'Camp 3', altM: 7300, note: 'Summit launch' },
    { name: 'Central Summit', altM: 8008, note: 'Not the true top' },
    { name: 'True Summit', altM: 8027, note: 'Beyond a corniced connecting ridge' }
  ],
  approach: 'Drive from Kathmandu or Lhasa to the northern Base Camp near Tingri, subject to Chinese access rules, then a short trek to Advanced Base Camp. When the Tibetan side is closed, expeditions do not run.',
  season: {
    primary: 'Autumn', window: 'September–October (spring also used)',
    months: { Jan: 'winter', Feb: 'winter', Mar: 'shoulder', Apr: 'prime', May: 'prime', Jun: 'closed', Jul: 'closed', Aug: 'closed', Sep: 'prime', Oct: 'prime', Nov: 'shoulder', Dec: 'winter' },
    note: 'Climbed in both the post-monsoon autumn and the pre-monsoon spring. Autumn snow conditions strongly influence the avalanche hazard on the upper face. Access depends on Chinese permitting for the year.'
  },
  typicalDurationDays: '30–40 days',
  difficulty: { technical: 3, altitude: 4, exposure: 3, weather: 3, remoteness: 3, objectiveHazard: 4, summary: 'Technically moderate with road-accessible Base Camp access, but real avalanche hazard on the upper face, and a genuinely exposed corniced ridge between the easier central summit and the true top.' },
  objectiveHazards: ['Avalanche and slab on the upper Northwest Face after snowfall (fatal events including in 2023)', 'The corniced, exposed connecting ridge to the true summit', 'Confusion between the central and true summits', 'Cold and wind on the summit ridge', 'Crevasse hazard on the glacier approach'],
  history: [
    'Shishapangma was the last 8,000er to be climbed, in 1964, by a large Chinese and Tibetan team — the delay caused entirely by Tibet being closed to foreign mountaineers.',
    'When Tibet reopened, the mountain became a relatively popular objective because of its road-accessible Base Camp and short expedition. The 1982 British alpine-style ascent of the Southwest Face is one of its landmark climbs. Piotr Morawski and Simone Moro made the first winter ascent in 2005.',
    'In recent years the mountain has drawn attention both for avalanche fatalities on the normal route and for renewed scrutiny of the central-versus-true-summit question in the context of climbers completing all 14.'
  ],
  logistics: 'A Tibet-side Shishapangma expedition is comparatively short and simple: overland travel from Kathmandu or Lhasa, Chinese permits and a liaison arrangement, a road-accessible Base Camp, a stocked ABC, fixed rope on the upper route, Sherpa support and oxygen for most climbers. Confirm whether the Tibetan side is open for your year before committing.',
  permit: { authority: 'China Tibet Mountaineering Association', note: 'Chinese climbing permit, liaison officer / guide requirement and a registered operator. Access to the Tibetan side is opened and closed by Chinese authorities and cannot be assumed.', verify: true },
  equipment: ['8,000 m down suit and summit boots', 'High-altitude sleeping system (−40°C and below)', 'Oxygen system for most climbers', 'Crampons, ice axe, harness, ascender, belay/rappel device', 'Helmet for the summit ridge', 'Avalanche awareness and the discipline to wait out loaded slopes', 'Expedition mittens, goggles, glacier glasses'],
  weather: 'Shishapangma’s position north of the main crest gives it a somewhat drier, more continental climate than the Nepal peaks, but the upper face holds snow and the avalanche hazard is condition-dependent. Both autumn and spring windows are used.',
  acclimatisation: 'A short rotation strategy — touching Camp 1, then Camp 2, sometimes Camp 3 — over two to three weeks from ABC, then a summit push on a forecast window, with a clear commitment to continuing past the central summit to the true top.',
  rescue: { note: 'Helicopter rescue on the Tibetan side is far more constrained than in Nepal; evacuation is typically overland from the road-accessible Base Camp. Confirm current arrangements and carry insurance that covers the Tibetan side.', verify: true },
  guideSupport: 'Commercial expeditions run with Sherpa climbing support and fixed rope on the route. Shishapangma is one of the more accessible 8,000ers, but the avalanche hazard and the true-summit ridge mean it should not be treated casually.',
  faq: [
    { q: 'How high is Shishapangma?', a: '8,027 m (26,335 ft) — the fourteenth-highest mountain on Earth, and the smallest of the 8,000ers.' },
    { q: 'Where is Shishapangma?', a: 'In Tibet, about 10 km north of the Nepal border at the western end of the Langtang region. It is the only 8,000er located entirely within China.' },
    { q: 'Why was Shishapangma the last 8,000er to be climbed?', a: 'Not because of difficulty, but because Tibet was closed to foreign expeditions. A Chinese team made the first ascent in 1964, fourteen years after Annapurna.' },
    { q: 'What is the central summit vs true summit issue?', a: 'Shishapangma has a broad Central Summit (~8,008 m) that is much easier and safer to reach than the True Summit (~8,027 m), which lies beyond a corniced, exposed connecting ridge. For decades many ascents stopped at the central summit; a genuine ascent requires the true top.' },
    { q: 'When is Shishapangma climbed?', a: 'In both the post-monsoon autumn (September–October) and the pre-monsoon spring, with the avalanche hazard on the upper face a key factor. Access depends on Chinese permitting.' },
    { q: 'Who first climbed Shishapangma?', a: 'A Chinese and Tibetan team led by Xu Jing, on 2 May 1964 — the first ascent of the last unclimbed 8,000 m peak.' }
  ],
  relatedTreks: ['langtang-valley', 'gosaikunda'],
  relatedDestinations: ['Langtang valley', 'Kyirong / Tingri, Tibet', 'Gosaikunda']
};

