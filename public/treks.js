/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — TREKKING TRAILS DATA MODEL
   ----------------------------------------------------------------------------
   One reusable template (trek.html) renders every route from the records below.
   To add a trek: add one TREKS['slug'] = { ... } object. Missing sections
   simply do not render.

   CONTENT RULE
   Static, slow-changing information is written inline. Anything that changes
   over time — permit fees, transport schedules, emergency numbers, prices,
   visa rules, network coverage — is either omitted, given as an indicative
   range, or flagged verify:true so the template shows a
   "Verify before departure" note. Do not hard-code live figures here.
   ========================================================================== */

/* ----------------------------------------------------------------------------
   PROVINCES — matches the Explore map on the homepage
   -------------------------------------------------------------------------- */
window.TREK_PROVINCES = {
  koshi:         { name: 'Koshi Province',         label: 'Province 1 · Eastern Nepal',        blurb: 'The Everest, Makalu and Kanchenjunga massifs — five of the world’s eight-thousanders and the Sherpa heartland of the Khumbu.' },
  bagmati:       { name: 'Bagmati Province',       label: 'Province 3 · Central Nepal',        blurb: 'Alpine wilderness within a day of Kathmandu — the glaciers of Langtang, the sacred lakes of Gosaikunda and the remote Rolwaling valley.' },
  gandaki:       { name: 'Gandaki Province',       label: 'Province 4 · West-Central Nepal',   blurb: 'Nepal’s most-walked trails — the Annapurna Circuit and Sanctuary, the deepest gorge on earth and the walled kingdom of Upper Mustang.' },
  karnali:       { name: 'Karnali Province',       label: 'Province 6 · Northwest Nepal',      blurb: 'The wild trans-Himalaya — Dolpo’s medieval valleys, the turquoise of Phoksundo and Rara, and Nepal’s least-trodden trails.' },
  lumbini:       { name: 'Lumbini Province',       label: 'Province 5 · Southwestern Nepal',   blurb: 'The lowland gateway and spiritual cradle — the birthplace of the Buddha, the wildlife of Bardiya and the mid-hill trails of Rukum and Rolpa.' },
  madhesh:       { name: 'Madhesh Province',       label: 'Province 2 · Southeastern Plains',  blurb: 'The Terai plains — the temple city of Janakpur and the Mithila cultural heartland. Pilgrimage and heritage, not high altitude.' },
  sudurpashchim: { name: 'Sudurpashchim Province', label: 'Province 7 · Far-Western Nepal',    blurb: 'Nepal’s quietest frontier — the Api and Saipal ice giants and the meadow plateau of Khaptad.' }
};

/* ----------------------------------------------------------------------------
   SHARED DEFAULTS
   Every trek inherits these unless it overrides the field. This is how a
   lightly-documented route still produces a complete, trustworthy page.
   -------------------------------------------------------------------------- */
window.TREK_DEFAULTS = {
  operator: 'Himalayan Magic Adventure',

  altitudeAms: {
    intro: 'Above roughly 2,500–3,000 m the air holds less oxygen, and the body needs time to adjust. Acute Mountain Sickness (AMS) is the mild, common form and is usually manageable if you respond to it early. The two serious forms — HAPE (fluid in the lungs) and HACE (swelling of the brain) — are rare but are emergencies.',
    signs: [
      'Headache that does not settle with rest, fluid and simple painkillers',
      'Nausea or loss of appetite, unusual fatigue, dizziness',
      'Disturbed sleep or breathlessness at rest',
      'Loss of coordination or confusion, or a persistent wet cough — descend now and seek help'
    ],
    principles: [
      'Ascend slowly. Once above 3,000 m, aim to raise your sleeping altitude by no more than about 500 m per day, with a rest day every 600–900 m.',
      '“Climb high, sleep low” — a short walk to a higher point during a rest day helps.',
      'Drink enough that your urine stays pale. Avoid alcohol and sleeping pills.',
      'Mild AMS means stop ascending until it clears. If it worsens, or serious signs appear, descend without waiting for morning.',
      'Tell your guide how you feel honestly. Descent is the treatment that always works.'
    ],
    disclaimer: 'This information is for trip planning and does not replace medical advice. If you have heart, lung or blood conditions, are pregnant, or take regular medication, speak to a travel-medicine doctor before booking. Carry comprehensive insurance that explicitly covers high-altitude trekking and helicopter evacuation.'
  },

  emergency: {
    verify: true,
    note: 'Emergency contacts, health-post locations and evacuation arrangements change. Your trip dossier carries the current numbers for your route, and your guide files a daily check-in. Always confirm this information with your operator before you leave Kathmandu.',
    fields: [
      { label: 'Your guide / operations desk', value: 'Provided in your pre-departure dossier (24/7 during the trek)' },
      { label: 'Tourist Police, Nepal', value: '1144 (nationwide, where coverage exists)' },
      { label: 'Nepal general emergency', value: '112' },
      { label: 'Helicopter evacuation', value: 'Arranged by the operator through your insurer — confirm your policy covers it before departure' }
    ]
  },

  insurance: {
    intro: 'Travel insurance is not optional on a Himalayan trek. A helicopter evacuation from altitude can cost many thousands of US dollars and is paid up front.',
    points: [
      'Cover must explicitly include trekking to your route’s maximum altitude — many standard policies stop at 3,000–4,000 m.',
      'Check that helicopter search, rescue and evacuation is included, not just hospital treatment.',
      'Medical treatment and repatriation, trip cancellation and curtailment, and baggage / gear cover are all worth having.',
      'Carry your policy number and the insurer’s 24-hour assistance line on paper and on your phone, and leave a copy with someone at home.'
    ],
    disclaimer: 'We do not sell insurance and do not recommend a specific provider. Compare policies yourself against the points above.'
  },

  visa: {
    verify: true,
    intro: 'Most nationalities can obtain a tourist visa on arrival at Kathmandu (Tribhuvan International Airport) or apply online in advance. A small number of nationalities must arrange a visa beforehand.',
    points: [
      'Passport valid for at least six months beyond your date of entry, with blank pages.',
      'Tourist visas are issued for 15, 30 or 90 days and are extendable in Kathmandu or Pokhara.',
      'Bring passport photos and the visa fee in US dollars cash; card payment at the airport is unreliable.',
      'Immigration rules change — confirm the current fee, process and eligibility on the Nepal Department of Immigration website before you fly.'
    ]
  },

  money: {
    verify: true,
    intro: 'The currency is the Nepalese Rupee (NPR). It is a closed currency — get it inside Nepal and change any surplus back before you leave.',
    points: [
      'Draw cash from ATMs in Kathmandu or Pokhara before the trek. Machines have a per-withdrawal cap and charge a fee.',
      'On the trail it is cash only. Carry enough NPR in small notes for meals, drinks, charging, hot showers, Wi-Fi, snacks, tips and a contingency.',
      'Card payment and reliable ATMs effectively end at the road head. A few large villages have card machines that often do not work.',
      'Keep cash in two or three places, dry and out of sight. US dollars cash is a useful backup.'
    ]
  },

  connectivity: {
    intro: 'Expect to be largely offline. Coverage exists in patches and cannot be relied on for anything time-critical.',
    scale: [
      { label: 'Mobile data', level: 2, note: 'Ncell / Nepal Telecom reach many villages lower down and some ridgelines; dead zones are long and normal. Buy a tourist SIM at the airport or in Kathmandu with your passport.' },
      { label: 'Tea-house Wi-Fi', level: 2, note: 'Sold per device per day in many lodges (e.g. “Everest Link” / “Airlink” cards). Slow, weather-dependent, fine for messages.' },
      { label: 'Charging', level: 2, note: 'Available in most tea-house dining rooms for a per-hour or per-device fee, often solar. Bring a power bank and charge whenever you can.' },
      { label: 'Offline navigation', level: 4, note: 'Download offline maps (maps.me / Gaia / Organic Maps) and your itinerary before you leave the city. A GPS watch or Garmin inReach is worth carrying on remote routes.' }
    ]
  },

  water: {
    intro: 'Never drink untreated tap, stream or spring water. Plastic bottled water is available low on most trails but the empties are a serious waste problem at altitude — treat your own instead.',
    points: [
      'Carry 2–3 litres of capacity and a treatment method: chlorine dioxide drops or tablets, a SteriPEN, or a filter rated for the conditions.',
      'Boiled water and “safe drinking water station” refills are sold in many villages and are cheaper and greener than bottles.',
      'Hot drinks are safe. Start each day fully hydrated and drink steadily.',
      'A wide-mouth bottle doubles as a hot-water bottle in your sleeping bag on cold nights.'
    ]
  },

  food: {
    intro: 'Tea houses cook simple, filling food to order. Portions are generous and vegetarian dishes are the safest choice as you get higher.',
    typical: ['Dal bhat — rice, lentil soup, curried vegetables (free refills, the trekker’s staple)', 'Tibetan bread, chapati, pancakes and porridge for breakfast', 'Fried rice, fried noodles, thukpa and other noodle soups', 'Momo (dumplings), potatoes in many forms, spring rolls', 'Eggs, pasta, soups, and often “apple pie” and other baked treats lower down'],
    points: [
      'Eat mostly vegetarian above 3,000 m — meat is carried up unrefrigerated.',
      'Prices rise predictably with altitude because everything is carried or flown in.',
      'Bring your own favourite snacks, electrolyte powder and a little instant coffee; trail-side choice is limited and dear.'
    ]
  },

  accommodation: {
    intro: 'On the main trails you sleep in tea houses — family-run lodges with a heated communal dining room and simple twin bedrooms. On remote or restricted routes some or all nights are camping, fully supported by a crew.',
    amenities: [
      { label: 'Rooms', note: 'Usually unheated plywood-walled twins with a foam mattress, pillow and a blanket or two. Bring a sleeping bag.' },
      { label: 'Bathrooms', note: 'Mostly shared. Squat toilets are common; Western-style appears lower down. Carry your own paper and hand sanitiser.' },
      { label: 'Hot showers', note: 'Gas or solar, charged per use, and less reliable the higher you go. Above ~4,000 m expect a bowl of hot water instead.' },
      { label: 'Heating', note: 'A single stove in the dining room, lit in the evening, often burning dung or wood. Bedrooms are not heated.' },
      { label: 'Power & Wi-Fi', note: 'In the dining room, for a fee, where they exist. Do not count on either.' }
    ],
    points: [
      'In high season on popular routes, rooms fill by mid-afternoon — a guide phoning ahead matters.',
      'A booked trip guarantees your bed and meals; independent trekkers pay as they go.'
    ]
  },

  guidePorter: {
    intro: 'A licensed guide handles route-finding, weather calls, tea-house bookings, permits, acclimatisation pacing and — the part that matters most — spotting trouble early and getting you down. A porter carries the heavy load so you walk with a light day pack.',
    guide: [
      'Reads the group every day and adjusts the plan; makes the call to rest, reroute or descend.',
      'Carries a first-aid kit and often a pulse oximeter; coordinates any evacuation.',
      'Translates, explains what you are seeing, and smooths every tea-house and checkpoint.'
    ],
    porter: [
      'Carries up to about 20–25 kg (typically one bag between two trekkers) so you carry only water, layers and camera.',
      'Walks at their own pace and meets you at the overnight stop.'
    ],
    ethics: [
      'Fair wage, insurance, and a cap on load weight.',
      'Proper footwear, warm clothing and shelter at altitude — ask your operator how porters are equipped and housed.',
      'Porters get sick too. A good operator treats a porter’s AMS exactly like a client’s.'
    ],
    goodGuide: 'A good guide talks less about summits and more about how you slept, what you ate and how your headache is. They know the tea-house owners by name, carry a plan B for every pass, and are visibly relieved rather than disappointed when a struggling trekker agrees to turn around.'
  },

  responsible: {
    intro: 'The trails are lived-in landscapes. A few habits keep them that way.',
    points: [
      'Treat water instead of buying bottled; carry out every wrapper, including down to Kathmandu if bins are unreliable.',
      'Keep to the main trail on switchbacks; walk through, not around, mud to stop path-widening.',
      'Spend locally — eat and sleep where you are, buy the tea-house owner’s food rather than carrying all your own.',
      'Ask before photographing people, homes or ceremonies, and respect a no.',
      'Give wildlife and grazing stock a wide berth; never feed animals.',
      'Use toilets where they exist; otherwise go 50 m from water and the path and bury it.',
      'Choose an operator that pays, equips and insures its porters properly.'
    ]
  },

  culture: {
    intro: 'Nepal’s hill and mountain communities are welcoming and largely Hindu and Buddhist. Small courtesies go a long way.',
    points: [
      'Dress modestly — shoulders and knees covered in villages, monasteries and temples.',
      'Walk clockwise around stupas, mani walls and prayer wheels; pass chortens on their left.',
      'Ask before entering a monastery or home; remove shoes and hats; do not point your feet at an altar or a person.',
      'A palms-together “Namaste” is the universal greeting. Use your right hand, or both, to give and receive.',
      'Ask before photographing people; never photograph inside shrines unless invited.',
      'Public displays of affection, and losing your temper, both read as poor manners.'
    ]
  },

  packingList: [
    { category: 'Documents', items: [
      { name: 'Passport + 4 passport photos', tier: 'essential' },
      { name: 'Nepal visa', tier: 'essential' },
      { name: 'Trekking permits / TIMS (arranged by operator)', tier: 'essential' },
      { name: 'Travel insurance certificate (with 24h assistance line)', tier: 'essential' },
      { name: 'Printed + digital copies of all of the above, stored separately', tier: 'essential' },
      { name: 'Emergency contacts card', tier: 'essential' },
      { name: 'Cash in NPR (small notes) + USD backup', tier: 'essential' }
    ]},
    { category: 'Clothing', items: [
      { name: 'Base layers, moisture-wicking (2–3 sets)', tier: 'essential' },
      { name: 'Insulated down or synthetic jacket', tier: 'essential' },
      { name: 'Waterproof / windproof hardshell jacket', tier: 'essential' },
      { name: 'Fleece or light insulated mid-layer', tier: 'essential' },
      { name: 'Trekking trousers (2) + waterproof over-trousers', tier: 'essential' },
      { name: 'Warm hat, sun hat, buff / neck gaiter', tier: 'essential' },
      { name: 'Liner gloves + warm insulated gloves', tier: 'essential' },
      { name: 'Underwear + warm sleeping socks', tier: 'essential' },
      { name: 'Shorts / t-shirts for lower altitudes', tier: 'recommended' }
    ]},
    { category: 'Footwear', items: [
      { name: 'Broken-in waterproof trekking boots', tier: 'essential' },
      { name: 'Trekking socks (3–4 pairs, wool or synthetic)', tier: 'essential' },
      { name: 'Camp shoes / sandals', tier: 'recommended' },
      { name: 'Gaiters', tier: 'optional' },
      { name: 'Microspikes (for snow / early or late season)', tier: 'optional' }
    ]},
    { category: 'Sleeping', items: [
      { name: 'Sleeping bag rated to about −10°C to −15°C', tier: 'essential' },
      { name: 'Sleeping bag liner (adds warmth + hygiene)', tier: 'recommended' },
      { name: 'Inflatable pillow', tier: 'optional' },
      { name: 'Earplugs + eye mask', tier: 'recommended' }
    ]},
    { category: 'Hydration', items: [
      { name: 'Water bottles / bladder, 2–3 L total capacity', tier: 'essential' },
      { name: 'Water treatment: drops/tablets, filter or SteriPEN', tier: 'essential' },
      { name: 'Insulated bottle cover / thermos', tier: 'recommended' },
      { name: 'Electrolyte / rehydration powder', tier: 'recommended' }
    ]},
    { category: 'Electronics', items: [
      { name: 'Power bank (10,000–20,000 mAh)', tier: 'essential' },
      { name: 'Charging cables + universal adapter (Type C/D/M)', tier: 'essential' },
      { name: 'Headlamp + spare batteries', tier: 'essential' },
      { name: 'Phone with offline maps + itinerary downloaded', tier: 'essential' },
      { name: 'Camera + spare batteries (drain fast in cold)', tier: 'recommended' },
      { name: 'GPS watch / satellite messenger', tier: 'optional' }
    ]},
    { category: 'Personal care', items: [
      { name: 'Sunscreen SPF 50+ and SPF lip balm', tier: 'essential' },
      { name: 'Category 4 glacier sunglasses', tier: 'essential' },
      { name: 'Toothbrush, small toiletries, quick-dry towel', tier: 'essential' },
      { name: 'Wet wipes + hand sanitiser + toilet paper', tier: 'essential' },
      { name: 'Blister care / tape', tier: 'essential' },
      { name: 'Personal medications (in original packaging)', tier: 'essential' }
    ]},
    { category: 'First aid', items: [
      { name: 'Personal first-aid kit (your guide also carries one)', tier: 'essential' },
      { name: 'Painkillers, ibuprofen, anti-diarrhoeal, rehydration salts', tier: 'essential' },
      { name: 'Blister plasters, antiseptic, plasters, bandage', tier: 'essential' },
      { name: 'Throat lozenges + any personal AMS medication discussed with your doctor', tier: 'recommended' }
    ]},
    { category: 'Trekking equipment', items: [
      { name: 'Adjustable trekking poles', tier: 'recommended' },
      { name: '30–40 L day pack + rain cover', tier: 'essential' },
      { name: 'Duffel bag ~70–80 L for the porter (lockable)', tier: 'essential' },
      { name: 'Dry bags / stuff sacks', tier: 'recommended' }
    ]},
    { category: 'Optional', items: [
      { name: 'Book / e-reader, journal, cards', tier: 'optional' },
      { name: 'Small padlock', tier: 'recommended' },
      { name: 'Repair kit (tape, cord, safety pins)', tier: 'optional' },
      { name: 'Lightweight down booties', tier: 'optional' }
    ]}
  ],

  beforeYouGo: [
    'Passport valid 6+ months, with blank pages',
    'Nepal visa (on arrival or online)',
    'Insurance covering high-altitude trekking + helicopter evacuation',
    'International flights booked with a day or two of buffer at each end',
    'Kathmandu accommodation for arrival + contingency nights',
    'Permits arranged (operator handles these for booked trips)',
    'Passport photos × 4–6',
    'Enough NPR cash for the trail + USD backup',
    'Tourist SIM / eSIM plan decided',
    'Gear checked, boots broken in, sleeping bag rated for the route',
    'Personal medicines + first-aid kit',
    'Offline maps + itinerary downloaded to your phone',
    'Copies of documents stored separately + left with someone at home',
    'Travel-medicine consultation done (routine vaccines, altitude advice)',
    'A realistic look at the weather window for your dates'
  ],

  beforeKathmandu: [
    'Collect / confirm all trekking permits and your TIMS card',
    'Draw enough NPR cash — the last reliable ATMs are in the city',
    'Buy or top up a tourist SIM',
    'Hire or buy any missing gear (Thamel has everything) and test it',
    'Leave spare luggage at your hotel or the operator’s office',
    'Photograph your permits, passport and insurance; store them offline',
    'Confirm the meeting time, transport plan and weather outlook with your guide'
  ],

  seasonsIntro: 'Nepal has two prime trekking windows either side of the summer monsoon. The notes below are the general pattern for this route — mountain weather still does what it likes.',

  planningCta: {
    heading: 'Ready to plan your trek?',
    sub: 'Talk to someone who has walked this route. No hard sell — just honest advice on dates, fitness and whether this is the right trek for you.',
    actions: [
      { label: 'Build my itinerary', href: '/contact' },
      { label: 'Find a guide', href: '/services' },
      { label: 'Ask a local expert', href: '/contact' }
    ]
  },

  trust: [
    { title: 'Verified on the ground', note: 'Route notes are written and checked by guides who walk these trails every season, not copied from other sites.' },
    { title: 'Local knowledge', note: 'Nepali-owned and Nepali-led since 1993, with Sherpa and local crew on every departure.' },
    { title: 'Responsible by default', note: 'Fair porter loads, wages and insurance; a leave-no-trace policy on every trip.' },
    { title: 'Human support', note: 'A real person answers your questions before you book and stays reachable while you are on the mountain.' }
  ]
};

/* ----------------------------------------------------------------------------
   TREKS
   -------------------------------------------------------------------------- */
window.TREKS = {};

/* ========================= KOSHI PROVINCE ========================= */

TREKS['everest-base-camp'] = {
  slug: 'everest-base-camp',
  featured: true, popular: true,
  name: 'Everest Base Camp Trek',
  tagline: 'To the foot of the highest mountain on earth',
  province: 'koshi',
  region: 'Khumbu (Everest)',
  heroImage: '/images/ebc.png',
  summary: 'The classic 12-day walk through the Sherpa heartland of the Khumbu to Everest Base Camp (5,364 m) and the sunrise viewpoint of Kala Patthar (5,545 m). No climbing — but real altitude, and the most famous trail in the Himalaya.',
  stats: {
    duration: '12 days on the trail (14–16 with Kathmandu)',
    difficulty: 'Challenging',
    maxAltitude: '5,545 m',
    maxAltitudePoint: 'Kala Patthar',
    bestSeason: 'Mar–May · Sep–Nov',
    startPoint: 'Lukla (2,840 m), by flight from Kathmandu or Ramechhap',
    endPoint: 'Lukla',
    distanceKm: '≈ 130 km round trip',
    walkHours: '5–7 hrs/day'
  },
  seo: {
    title: 'Everest Base Camp Trek — Nepal | Itinerary, Cost, Difficulty & Best Time',
    description: 'A complete, honest guide to the Everest Base Camp trek in Nepal: 12-day itinerary, difficulty and altitude, permits and cost, best time to go, packing list, acclimatisation and FAQ.'
  },
  overview: [
    'The Everest Base Camp trek is the best-known walk in Nepal and, for many people, the first serious high-altitude trek they ever do. From the airstrip at Lukla the trail follows the Dudh Koshi river up into the Khumbu, the homeland of the Sherpa people, climbing through pine forest and across long suspension bridges to Namche Bazaar — the natural hub of the region and the place most itineraries spend a second night to acclimatise.',
    'Above Namche the treeline thins and the giants appear: Ama Dablam, Lhotse, Nuptse and finally Everest itself. The route passes the monastery at Tengboche, the winter settlements of Dingboche and Lobuche, and the memorials at Thukla pass before reaching Gorak Shep, the last lodges. From there it is a rocky half-day to Base Camp and, the next dawn, a steep pull up Kala Patthar for the classic head-on view of Everest.',
    'It is not a technical climb — there is no rope, ice axe or crampon work on the standard route — but it is a demanding walk. You are above 5,000 m for two to three days, the nights are genuinely cold, and the descent back to Lukla is long. Done at the right pace, with proper acclimatisation days, it is within reach of any fit, determined walker.'
  ],
  highlights: [
    'Everest Base Camp at 5,364 m and sunrise from Kala Patthar (5,545 m)',
    'Namche Bazaar — the Sherpa capital, wedged into a mountain amphitheatre',
    'Tengboche Monastery with Ama Dablam filling the skyline behind it',
    'The Khumbu Icefall seen from close range at Base Camp',
    'Sagarmatha National Park — glaciers, danphe pheasants, tahr and, rarely, musk deer',
    'Sherpa villages, mani walls and high-altitude monasteries the whole way up'
  ],
  suitability: {
    physical: 7, technical: 2, altitude: 9, remoteness: 5,
    walkHours: '5–7 hours a day, with two longer days near Base Camp',
    terrain: 'Well-defined trail: stone steps, moraine, glacial rubble up high. No scrambling.',
    weatherExposure: 'High above Dingboche — wind and cold are the main hazards, not rain.',
    goodFor: [
      'Fit walkers who train for a few months beforehand',
      'First-time high-altitude trekkers who accept a slow, patient schedule',
      'Anyone who wants the iconic Himalayan experience with tea-house comfort'
    ],
    notIdeal: [
      'Trekkers on a tight schedule who cannot afford flight delays at Lukla',
      'People who have had serious altitude problems below 4,000 m',
      'Those looking for solitude in peak season — the trail is busy in Oct and Apr'
    ]
  },
  why: {
    lead: 'You do this trek for the scale of it — and for the culture that has grown up around climbing on the roof of the world.',
    paragraphs: [
      'The Khumbu is not a wilderness. It is a lived-in, farmed, prayed-in landscape, and the trek is as much about Sherpa life — the lodges, the monasteries, the yak trains, the mountaineering history stacked up in Namche’s museums and bakeries — as it is about the view from Kala Patthar.',
      'And the view does deliver. There is a moment, usually somewhere above Tengboche, when the trail turns and the whole Everest–Lhotse–Nuptse wall is simply there, and it reorganises your sense of how big mountains can be. Base Camp itself is a jumble of rock and ice at the foot of the Icefall; in spring it is a tented city of climbers, in autumn it is empty and silent.'
    ],
    gallery: [
      { img: '/images/ebc.png', caption: 'The Khumbu valley on the approach to Base Camp' },
      { img: '/images/everest_real.jpg', caption: 'Everest and Nuptse from the Kala Patthar side' },
      { img: '/images/hero-mountain.jpg', caption: 'First light on the high peaks above the Khumbu' }
    ]
  },
  passes: [],
  acclimatization: {
    days: [3, 6],
    note: 'The standard itinerary builds in two acclimatisation nights — a second night at Namche (3,440 m) with a walk up towards the Everest View Hotel, and a second night at Dingboche (4,410 m) with a climb toward Nangkartshang. Both follow “climb high, sleep low”. Skipping either is the single most common reason trekkers have to turn back.'
  },
  itinerary: [
    { day: 1, title: 'Fly to Lukla, trek to Phakding', from: 'Lukla (2,840 m)', to: 'Phakding (2,610 m)', distanceKm: '6.2 km', walkHours: '3–4 hrs', startEle: 2840, endEle: 2610, terrain: 'Gentle descent along the Dudh Koshi', stay: 'Tea house', meals: 'B/L/D', highlights: ['The mountain flight itself', 'First suspension bridges and mani walls'], tips: 'Walk slowly today even though it is easy — you have started high.' },
    { day: 2, title: 'Phakding to Namche Bazaar', from: 'Phakding (2,610 m)', to: 'Namche Bazaar (3,440 m)', distanceKm: '7.4 km', walkHours: '5–6 hrs', startEle: 2610, endEle: 3440, terrain: 'River valley then a long, steep forested climb', stay: 'Tea house', meals: 'B/L/D', highlights: ['Hillary Suspension Bridge', 'First glimpse of Everest on the climb, weather permitting'], tips: 'The final climb to Namche is the hardest hour of the first three days. Pace it.' },
    { day: 3, title: 'Namche — acclimatisation day', from: 'Namche Bazaar (3,440 m)', to: 'Namche Bazaar (3,440 m)', distanceKm: '5–7 km', walkHours: '3–4 hrs', startEle: 3440, endEle: 3440, terrain: 'Acclimatisation walk to ~3,880 m and back', stay: 'Tea house', meals: 'B/L/D', highlights: ['Everest View Hotel panorama', 'Sherpa museum and the Saturday market'], tips: 'Do the walk high, then come back down to sleep. Rest, eat, hydrate.' },
    { day: 4, title: 'Namche to Tengboche', from: 'Namche Bazaar (3,440 m)', to: 'Tengboche (3,860 m)', distanceKm: '9.2 km', walkHours: '5–6 hrs', startEle: 3440, endEle: 3860, terrain: 'Traverse, steep drop to the river, steep climb to the monastery', stay: 'Tea house', meals: 'B/L/D', highlights: ['Tengboche Monastery', 'Ama Dablam close up', 'Afternoon prayers if timing allows'], tips: 'Afternoons cloud over — leave Namche early for the views.' },
    { day: 5, title: 'Tengboche to Dingboche', from: 'Tengboche (3,860 m)', to: 'Dingboche (4,410 m)', distanceKm: '9 km', walkHours: '5–6 hrs', startEle: 3860, endEle: 4410, terrain: 'Rhododendron forest, then open alpine valley above the treeline', stay: 'Tea house', meals: 'B/L/D', highlights: ['Last of the trees', 'Mani-wall village of Pangboche'], tips: 'You are now above 4,000 m every night. Headaches are common; report them.' },
    { day: 6, title: 'Dingboche — acclimatisation day', from: 'Dingboche (4,410 m)', to: 'Dingboche (4,410 m)', distanceKm: '4–5 km', walkHours: '3–4 hrs', startEle: 4410, endEle: 4410, terrain: 'Climb toward Nangkartshang (~5,050 m) and return', stay: 'Tea house', meals: 'B/L/D', highlights: ['Makalu (8,485 m) visible from the ridge', 'Big views back down the valley'], tips: 'Second rest day. Go high on the ridge, then rest hard in the afternoon.' },
    { day: 7, title: 'Dingboche to Lobuche', from: 'Dingboche (4,410 m)', to: 'Lobuche (4,940 m)', distanceKm: '8.5 km', walkHours: '5–6 hrs', startEle: 4410, endEle: 4940, terrain: 'Valley traverse, the climb to Thukla, then moraine', stay: 'Tea house', meals: 'B/L/D', highlights: ['Thukla Pass memorials to climbers lost on Everest', 'Edge of the Khumbu Glacier'], tips: 'A short but hard day. The memorial ground is a sombre, important place — give it time.' },
    { day: 8, title: 'Lobuche to Gorak Shep, then Everest Base Camp', from: 'Lobuche (4,940 m)', to: 'Gorak Shep (5,164 m) / EBC (5,364 m)', distanceKm: '13 km round', walkHours: '7–8 hrs', startEle: 4940, endEle: 5164, terrain: 'Glacial moraine, loose rock, undulating', stay: 'Tea house (Gorak Shep)', meals: 'B/L/D', highlights: ['Everest Base Camp and the Khumbu Icefall', 'Prayer flags and the climbers’ camp in spring'], tips: 'The longest, highest day. Drop the pack at Gorak Shep and carry only essentials to Base Camp.' },
    { day: 9, title: 'Kala Patthar at dawn, descend to Pheriche', from: 'Gorak Shep (5,164 m)', to: 'Kala Patthar (5,545 m) → Pheriche (4,240 m)', distanceKm: '15 km', walkHours: '7–8 hrs', startEle: 5164, endEle: 4240, terrain: 'Steep pre-dawn climb, then a long descent', stay: 'Tea house', meals: 'B/L/D', highlights: ['Sunrise on Everest from Kala Patthar', 'Real relief as you drop into thicker air'], tips: 'Very cold before dawn — every layer, plus a warm flask. Then enjoy going down.' },
    { day: 10, title: 'Pheriche to Namche Bazaar', from: 'Pheriche (4,240 m)', to: 'Namche Bazaar (3,440 m)', distanceKm: '14 km', walkHours: '6–7 hrs', startEle: 4240, endEle: 3440, terrain: 'Long descent with one sharp climb back to Namche', stay: 'Tea house', meals: 'B/L/D', highlights: ['A hot shower and a bakery', 'The forest and birdsong return'], tips: 'Knees take a beating on the way down — poles help.' },
    { day: 11, title: 'Namche to Lukla', from: 'Namche Bazaar (3,440 m)', to: 'Lukla (2,840 m)', distanceKm: '13.5 km', walkHours: '6–7 hrs', startEle: 3440, endEle: 2840, terrain: 'Descent to the river, then rolling trail with a final climb', stay: 'Tea house', meals: 'B/L/D', highlights: ['Last of the big bridges', 'A celebratory dinner with the crew'], tips: 'Longer than it looks. Keep something in reserve for the last climb to Lukla.' },
    { day: 12, title: 'Fly Lukla to Kathmandu', from: 'Lukla (2,840 m)', to: 'Kathmandu (1,400 m)', distanceKm: '—', walkHours: '—', startEle: 2840, endEle: 1400, terrain: 'Morning flight', stay: 'Hotel', meals: 'B', highlights: ['The flight out over the foothills'], tips: 'Build a spare day into your plans — Lukla flights are regularly delayed or cancelled by weather.' }
  ],
  routePoints: [
    { name: 'Lukla', elevation: '2,840 m', day: 1, walkTime: 'Trailhead', stay: 'Lodges', highlight: 'One of the most dramatic airstrips in the world', warning: 'Flights are weather-dependent — keep buffer days.' },
    { name: 'Namche Bazaar', elevation: '3,440 m', day: 2, walkTime: '5–6 hrs from Phakding', stay: 'Lodges, bakeries, gear shops, ATM (unreliable)', highlight: 'The acclimatisation hub — plan two nights', warning: 'The climb up is steep; do not rush it.' },
    { name: 'Tengboche', elevation: '3,860 m', day: 4, walkTime: '5–6 hrs from Namche', stay: 'Lodges by the monastery', highlight: 'The spiritual centre of the Khumbu', warning: 'Cold and cloudy by mid-afternoon.' },
    { name: 'Dingboche', elevation: '4,410 m', day: 5, walkTime: '5–6 hrs from Tengboche', stay: 'Lodges', highlight: 'Second acclimatisation stop, Makalu views', warning: 'First nights above 4,000 m — monitor AMS closely.' },
    { name: 'Lobuche', elevation: '4,940 m', day: 7, walkTime: '5–6 hrs from Dingboche', stay: 'Basic lodges', highlight: 'Thukla memorials on the approach', warning: 'Limited beds; nights are bitterly cold.' },
    { name: 'Gorak Shep', elevation: '5,164 m', day: 8, walkTime: '2–3 hrs from Lobuche', stay: 'The highest, most basic lodges', highlight: 'Launch point for both EBC and Kala Patthar', warning: 'Sleep is poor at this altitude — expect a rough night.' },
    { name: 'Everest Base Camp', elevation: '5,364 m', day: 8, walkTime: '3–4 hrs return from Gorak Shep', stay: 'Day visit only', highlight: 'The Khumbu Icefall from its foot', warning: 'No shelter — turn back if weather closes in.' },
    { name: 'Kala Patthar', elevation: '5,545 m', day: 9, walkTime: '2–3 hrs return from Gorak Shep', stay: 'Day visit only', highlight: 'The best straight-on view of Everest on the trek', warning: 'Pre-dawn start in extreme cold; windchill is severe.' }
  ],
  permits: [
    { name: 'Sagarmatha National Park entry permit', where: 'Nepal Tourism Board, Kathmandu, or Monjo park gate', feeNote: 'Fixed annual fee — verify current amount', notes: 'Carry your passport; keep the receipt to the end.' },
    { name: 'Khumbu Pasang Lhamu Rural Municipality permit', where: 'Lukla or Monjo (issued locally)', feeNote: 'Local fee, tiered by number of days — verify', notes: 'Replaced the old TIMS card for this region.' }
  ],
  cost: {
    note: 'Prices move with fuel, flight and permit costs. Treat the ranges below as indicative and confirm a firm quote for your dates.',
    tiers: [
      { name: 'Budget / teahouse', rangeUSD: '$1,200–$1,600', includes: ['Group guide', 'Lukla flights', 'Permits', 'Tea-house twin rooms', 'Breakfast + main meals'] },
      { name: 'Comfort', rangeUSD: '$1,700–$2,400', includes: ['Private guide + porter', 'Better lodges where they exist', 'Kathmandu 4★ either side', 'Some à la carte meals'] },
      { name: 'Premium', rangeUSD: '$3,000+', includes: ['Private trip', 'Best available lodges / “luxury” chain', 'Helicopter return option', 'Full board, extra staff'] }
    ],
    breakdown: [
      { item: 'Permits', note: 'National park + rural municipality — set annually' },
      { item: 'Kathmandu ⇆ Lukla flights', note: 'The single biggest variable; may fly from Ramechhap in peak season' },
      { item: 'Guide', note: 'Per day; licensed, insured, English-speaking' },
      { item: 'Porter', note: 'Per day; one porter per two trekkers is standard' },
      { item: 'Lodging + meals on trail', note: 'Rises steadily with altitude' },
      { item: 'Tips', note: 'Customary for guide and porter at the end — budget a few percent of trip cost' }
    ],
    independentVsGuided: 'You can trek the Khumbu without a guide, but a licensed guide is strongly recommended here for the altitude alone. A supported trip also guarantees your beds in high season, when Gorak Shep and Lobuche fill early.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Lukla', mode: 'Fixed-wing flight (~35 min)', duration: '35 min', note: 'In spring and autumn flights often shift to Ramechhap (Manthali), a 4–5 hr drive from Kathmandu, leaving pre-dawn.' },
      { from: 'Lukla', to: 'Trail', mode: 'On foot from the airstrip', duration: '—', note: 'The trek begins the moment you land.' }
    ],
    note: 'Helicopter charters in and out of the Khumbu are common and can rescue a tight schedule, at a price. Always keep at least one contingency day for Lukla weather.'
  },
  equipment: [
    { item: 'Sleeping bag rated to ≈ −15°C', need: 'essential', note: 'Tea-house blankets are not enough above Dingboche.' },
    { item: 'Down jacket', need: 'essential', note: 'For Base Camp morning and Kala Patthar.' },
    { item: 'Trekking poles', need: 'recommended', note: 'Save your knees on the long descents.' },
    { item: 'Category 4 sunglasses', need: 'essential', note: 'Glare off snow and glacier is intense.' },
    { item: 'Microspikes', need: 'optional', note: 'Useful for snow on the passes early or late in the season.' },
    { item: 'Insulated flask', need: 'recommended', note: 'Hot water for the Kala Patthar dawn.' }
  ],
  safety: {
    risks: [
      { name: 'Altitude', note: 'The primary risk. Two acclimatisation days are built in for a reason; the Pheriche HRA aid post and helicopter access make the Khumbu one of the safer high routes if you descend when told to.' },
      { name: 'Lukla flights', note: 'Delays and cancellations are routine. Never book an international flight home the day after your scheduled Lukla return.' },
      { name: 'Cold', note: 'Nights at Gorak Shep drop well below −10°C. Frostnip on fingers and toes at Kala Patthar is a real risk without proper gloves and boots.' },
      { name: 'Trail traffic', note: 'Yak and dzo trains have right of way — always step to the uphill side.' },
      { name: 'Stomach upsets', note: 'Common. Treat your own water, eat vegetarian high up, wash hands.' }
    ],
    turnaround: 'If AMS is not improving on a rest day, or serious signs appear, the plan changes to descent — Pheriche, then Namche. Reaching Base Camp is never worth pushing a sick trekker higher.',
    note: 'Your guide carries a first-aid kit and pulse oximeter and files a daily check-in. The Himalayan Rescue Association aid posts at Pheriche and Everest Base Camp (spring) are staffed by volunteer doctors.'
  },
  faq: [
    { q: 'How difficult is the Everest Base Camp trek?', a: 'Challenging but non-technical. If you can walk 5–7 hours a day on hills for two weeks and you acclimatise properly, you can do it. The difficulty is the altitude and the cold, not the terrain.' },
    { q: 'How fit do I need to be?', a: 'Train for 2–3 months: long hill walks with a pack, plus cardio. You do not need to be an athlete, but arriving unfit makes the altitude much harder to cope with.' },
    { q: 'Can a beginner do Everest Base Camp?', a: 'Yes, provided it is a beginner who prepares. Many people’s first-ever trek is EBC. A patient itinerary with both acclimatisation days is essential.' },
    { q: 'How high is Everest Base Camp?', a: 'Base Camp is 5,364 m. The trek’s highest point is Kala Patthar at 5,545 m, climbed for the Everest view.' },
    { q: 'Do I need a guide?', a: 'It is strongly recommended and, under current rules for many trekking areas, effectively required. For the altitude alone, a licensed guide is worth it.' },
    { q: 'When is the best time to trek to Everest Base Camp?', a: 'Mid-March to May and late September to November. October is the clearest and busiest; spring is warmer with rhododendron in bloom and the climbing season at Base Camp.' },
    { q: 'How cold does it get?', a: 'Daytime walking is often mild in the sun. Nights at the top range from about −10°C to −20°C in season, colder in winter. Kala Patthar before dawn is the coldest you will feel.' },
    { q: 'Is there Wi-Fi and mobile coverage?', a: 'Patchy. Paid Wi-Fi cards work in many lodges up to Gorak Shep; mobile data reaches Namche and some points beyond. Assume you are offline.' },
    { q: 'Can I charge my phone and camera?', a: 'Yes, in tea-house dining rooms for a per-hour fee that rises with altitude. Bring a power bank; cold drains batteries fast.' },
    { q: 'Are there ATMs on the trek?', a: 'Only in Namche, and they frequently run out of cash or are offline. Carry all the rupees you will need from Kathmandu.' },
    { q: 'What food is available?', a: 'Tea-house menus of dal bhat, noodles, soups, potatoes, eggs, pasta and bread. Dal bhat with free refills is the reliable choice. Eat vegetarian above Namche.' },
    { q: 'Can I shower?', a: 'Hot showers (gas or solar, paid) are available up to around Dingboche. Higher up it is a bowl of hot water, or nothing.' },
    { q: 'Do I need a sleeping bag?', a: 'Yes — one rated to about −15°C. You can hire a good one in Kathmandu if you do not want to carry your own.' },
    { q: 'What permits do I need?', a: 'The Sagarmatha National Park entry permit and the Khumbu Pasang Lhamu Rural Municipality permit. Your operator arranges both; fees are set annually — verify current amounts.' },
    { q: 'What happens if I get altitude sickness?', a: 'Mild AMS: stop ascending, rest, hydrate, treat symptoms, and only continue once it clears. If it worsens or serious signs appear, you descend immediately, on foot or by helicopter. Your guide makes this call with you.' },
    { q: 'Can I shorten the itinerary?', a: 'Not safely on the way up — the acclimatisation days are the safety margin. You can speed the descent, or fly out from Gorak Shep, Pheriche or Lukla by helicopter.' },
    { q: 'What happens in bad weather?', a: 'Snow can close the trail near Gorak Shep for a day; your guide will wait it out or adjust. The bigger disruption is cloud grounding the Lukla flights at either end.' },
    { q: 'Can I do Everest Base Camp by helicopter instead?', a: 'Yes — scenic helicopter tours land at Kala Patthar or Gorak Shep for a short stop. It is a different experience and still carries a brief-altitude risk, but it suits those who cannot spare two weeks.' },
    { q: 'Is the Lukla flight safe?', a: 'It is a short flight to a demanding airstrip, flown by experienced crews in good conditions only — which is why it is delayed so often. Delays are a schedule problem, not usually a safety one.' },
    { q: 'How much should I tip the guide and porter?', a: 'Tipping is customary. A common guideline is to pool roughly 10% of the trip cost for the crew, more for exceptional service, handed over at the final dinner.' }
  ],
  relatedTreks: ['gokyo-lakes', 'three-passes', 'everest-view-trek', 'annapurna-base-camp'],
  relatedDestinations: [
    { name: 'Namche Bazaar', note: 'Worth an extra night on the way down for the museums and bakeries.' },
    { name: 'Kathmandu — Boudhanath & Thamel', note: 'Sherpa and Tibetan Buddhist Kathmandu; the obvious pre- and post-trek base.' },
    { name: 'Chitwan National Park', note: 'A warm, low-altitude contrast a day’s drive south — jungle, rhino, birdlife.' }
  ],
  hotelsNote: 'Most trips include the first and last nights in a Kathmandu hotel (Thamel or Boudhanath). On the trail you stay in tea houses booked by your guide. We can arrange extra Kathmandu nights, an airport pickup and a Namche upgrade — ask when you plan the trip.'
};

TREKS['three-passes'] = {
  slug: 'three-passes',
  popular: true,
  name: 'Everest Three Passes Trek',
  tagline: 'The complete high circuit of the Khumbu',
  province: 'koshi',
  region: 'Khumbu (Everest)',
  heroImage: '/images/everest_real.jpg',
  summary: 'The most complete way to see the Everest region: a strenuous 18-day loop crossing Kongma La (5,535 m), Cho La (5,420 m) and Renjo La (5,360 m), taking in Everest Base Camp, Kala Patthar, Gokyo Ri and the Gokyo lakes along the way.',
  stats: {
    duration: '18 days on the trail',
    difficulty: 'Strenuous',
    maxAltitude: '5,545 m',
    maxAltitudePoint: 'Kala Patthar (passes to 5,535 m)',
    bestSeason: 'Apr–May · Oct–early Nov',
    startPoint: 'Lukla (2,840 m)',
    endPoint: 'Lukla',
    distanceKm: '≈ 160–170 km',
    walkHours: '6–9 hrs/day'
  },
  seo: {
    title: 'Everest Three Passes Trek — Nepal | 18-Day Itinerary, Difficulty & Cost',
    description: 'The Everest Three Passes trek in full: crossing Kongma La, Cho La and Renjo La with EBC, Kala Patthar and Gokyo. Itinerary, difficulty, altitude, permits, cost and FAQ.'
  },
  overview: [
    'The Three Passes trek links the three main valleys of the Khumbu — Chukhung, Khumbu and Gokyo — by crossing the high cols that separate them. It includes everything the standard Everest Base Camp trek does, plus the Gokyo lakes and Gokyo Ri, and joins them with three genuine 5,300 m-plus passes.',
    'This is a serious undertaking. Several days involve 7–9 hours of walking on steep, rocky ground, and the Cho La in particular has a short glacier crossing and a scramble that can be icy. You need to be a strong, experienced hill walker, comfortable with long days and exposure, and you must have had a clean run at altitude before.',
    'The reward is the Khumbu seen whole — from every angle, over passes rather than out-and-back — and far fewer people once you leave the main EBC highway.'
  ],
  highlights: [
    'Three high passes: Kongma La (5,535 m), Cho La (5,420 m), Renjo La (5,360 m)',
    'Everest Base Camp and Kala Patthar',
    'The Gokyo lakes and the Everest panorama from Gokyo Ri (5,357 m)',
    'The Ngozumpa Glacier — the largest in Nepal',
    'Quiet, high trail away from the main crowds for much of the loop',
    'Chukhung and the Imja valley beneath Ama Dablam and Lhotse'
  ],
  suitability: {
    physical: 9, technical: 4, altitude: 10, remoteness: 7,
    walkHours: '6–9 hours a day, several very long pass days',
    terrain: 'Steep moraine, boulder fields, a short glacier on Cho La, exposed ridgelines. Basic scrambling.',
    weatherExposure: 'Very high on the passes — a bad-weather day means you do not cross.',
    goodFor: [
      'Experienced trekkers who have already been above 5,000 m without problems',
      'Strong walkers comfortable with 8-hour days and some exposure',
      'Anyone who wants the Everest region without the out-and-back crowds'
    ],
    notIdeal: [
      'First-time high-altitude trekkers — do standard EBC or Gokyo first',
      'Anyone nervous about a short glacier crossing or airy ridge',
      'Tight schedules — the passes need weather flexibility'
    ]
  },
  why: {
    lead: 'Anyone can walk up the valley to Base Camp. The passes are what turn the Khumbu into a proper mountain circuit.',
    paragraphs: [
      'Standing on Kongma La with the Khumbu Glacier spread out below and nobody else in sight is a completely different experience from queuing on the trail to Gorak Shep. The Three Passes route spends its time on the edges of the region, high on the containing walls, and it strings together the two best viewpoints in Nepal — Kala Patthar and Gokyo Ri — in a single trip.',
      'It also earns the Gokyo lakes, a chain of startlingly blue glacial pools below Cho Oyu, which on their own justify the detour.'
    ],
    gallery: [
      { img: '/images/everest_real.jpg', caption: 'High on the Khumbu circuit' },
      { img: '/images/ebc.png', caption: 'The Khumbu Glacier from the Kongma La side' },
      { img: '/images/hero-mountain.jpg', caption: 'Dawn over the Gokyo peaks' }
    ]
  },
  passes: [
    { name: 'Kongma La', elevation: '5,535 m', day: 8 },
    { name: 'Cho La', elevation: '5,420 m', day: 12 },
    { name: 'Renjo La', elevation: '5,360 m', day: 15 }
  ],
  acclimatization: {
    days: [3, 6, 10],
    note: 'The itinerary acclimatises at Namche, Chukhung (or Dingboche) and Gokyo before the harder passes. The order of the passes matters — most itineraries cross Kongma La first, then Cho La, then Renjo La — so that you are already well acclimatised for the biggest one.'
  },
  itinerary: [
    { day: 1, title: 'Fly to Lukla, trek to Phakding', from: 'Lukla', to: 'Phakding (2,610 m)', distanceKm: '6 km', walkHours: '3–4 hrs', startEle: 2840, endEle: 2610, terrain: 'Gentle river trail', stay: 'Tea house', meals: 'B/L/D', highlights: ['The mountain flight'], tips: 'Ease in.' },
    { day: 2, title: 'Phakding to Namche Bazaar', from: 'Phakding', to: 'Namche (3,440 m)', distanceKm: '7.4 km', walkHours: '5–6 hrs', startEle: 2610, endEle: 3440, terrain: 'Forested climb', stay: 'Tea house', meals: 'B/L/D', highlights: ['Hillary Bridge', 'First Everest view'], tips: 'Slow on the final climb.' },
    { day: 3, title: 'Namche — acclimatisation', from: 'Namche', to: 'Namche', distanceKm: '6 km', walkHours: '3–4 hrs', startEle: 3440, endEle: 3440, terrain: 'Walk to ~3,880 m', stay: 'Tea house', meals: 'B/L/D', highlights: ['Everest View Hotel'], tips: 'Climb high, sleep low.' },
    { day: 4, title: 'Namche to Tengboche', from: 'Namche', to: 'Tengboche (3,860 m)', distanceKm: '9 km', walkHours: '5–6 hrs', startEle: 3440, endEle: 3860, terrain: 'Traverse and climb', stay: 'Tea house', meals: 'B/L/D', highlights: ['Tengboche Monastery'], tips: 'Leave early for clear views.' },
    { day: 5, title: 'Tengboche to Dingboche', from: 'Tengboche', to: 'Dingboche (4,410 m)', distanceKm: '9 km', walkHours: '5–6 hrs', startEle: 3860, endEle: 4410, terrain: 'Above the treeline', stay: 'Tea house', meals: 'B/L/D', highlights: ['Pangboche', 'Alpine valley'], tips: 'Report headaches.' },
    { day: 6, title: 'Dingboche — acclimatisation', from: 'Dingboche', to: 'Dingboche', distanceKm: '5 km', walkHours: '3–4 hrs', startEle: 4410, endEle: 4410, terrain: 'Climb toward Nangkartshang', stay: 'Tea house', meals: 'B/L/D', highlights: ['Makalu from the ridge'], tips: 'Rest in the afternoon.' },
    { day: 7, title: 'Dingboche to Chukhung', from: 'Dingboche', to: 'Chukhung (4,730 m)', distanceKm: '6 km', walkHours: '3–4 hrs', startEle: 4410, endEle: 4730, terrain: 'Gentle valley climb', stay: 'Tea house', meals: 'B/L/D', highlights: ['Lhotse wall', 'Island Peak in view'], tips: 'Optional Chukhung Ri for acclimatisation.' },
    { day: 8, title: 'Chukhung to Lobuche via Kongma La', from: 'Chukhung', to: 'Lobuche (4,940 m)', distanceKm: '10 km', walkHours: '8–9 hrs', startEle: 4730, endEle: 4940, terrain: 'Boulder fields, the pass, glacier moraine', stay: 'Tea house', meals: 'B/L/D', highlights: ['Kongma La (5,535 m)', 'Khumbu Glacier crossing'], tips: 'The hardest day so far — pre-dawn start, full water and food.' },
    { day: 9, title: 'Lobuche to Gorak Shep and Everest Base Camp', from: 'Lobuche', to: 'Gorak Shep (5,164 m) / EBC', distanceKm: '13 km round', walkHours: '7–8 hrs', startEle: 4940, endEle: 5164, terrain: 'Moraine', stay: 'Tea house', meals: 'B/L/D', highlights: ['Everest Base Camp'], tips: 'Light pack to Base Camp.' },
    { day: 10, title: 'Kala Patthar, then Dzongla', from: 'Gorak Shep', to: 'Dzongla (4,830 m)', distanceKm: '12 km', walkHours: '7–8 hrs', startEle: 5164, endEle: 4830, terrain: 'Dawn climb, then descent and traverse', stay: 'Tea house', meals: 'B/L/D', highlights: ['Sunrise from Kala Patthar (5,545 m)'], tips: 'Cold start; then position for Cho La.' },
    { day: 11, title: 'Dzongla to Thagnak via Cho La', from: 'Dzongla', to: 'Thagnak (4,700 m)', distanceKm: '9 km', walkHours: '7–8 hrs', startEle: 4830, endEle: 4700, terrain: 'Scramble to the col, short glacier, steep descent', stay: 'Tea house', meals: 'B/L/D', highlights: ['Cho La (5,420 m)'], tips: 'Microspikes on the glacier; do not cross in fresh snow or high wind.' },
    { day: 12, title: 'Thagnak to Gokyo', from: 'Thagnak', to: 'Gokyo (4,790 m)', distanceKm: '7 km', walkHours: '3–4 hrs', startEle: 4700, endEle: 4790, terrain: 'Ngozumpa Glacier crossing', stay: 'Tea house', meals: 'B/L/D', highlights: ['First Gokyo lakes', 'Cho Oyu ahead'], tips: 'An easier day to recover.' },
    { day: 13, title: 'Gokyo Ri and the fourth/fifth lakes', from: 'Gokyo', to: 'Gokyo', distanceKm: '8–12 km', walkHours: '4–6 hrs', startEle: 4790, endEle: 4790, terrain: 'Steep climb to Gokyo Ri (5,357 m)', stay: 'Tea house', meals: 'B/L/D', highlights: ['Four 8,000ers from one summit', 'Scoundrel’s Viewpoint over the glacier'], tips: 'One of the two best viewpoints in Nepal.' },
    { day: 14, title: 'Gokyo to Marlung via Renjo La', from: 'Gokyo', to: 'Marlung (4,210 m)', distanceKm: '12 km', walkHours: '7–8 hrs', startEle: 4790, endEle: 4210, terrain: 'Climb to the pass, long stone-staircase descent', stay: 'Tea house', meals: 'B/L/D', highlights: ['Renjo La (5,360 m)', 'Everest framed over the Gokyo lakes'], tips: 'The classic Renjo La view is the best of the three passes.' },
    { day: 15, title: 'Marlung to Namche Bazaar', from: 'Marlung', to: 'Namche (3,440 m)', distanceKm: '14 km', walkHours: '6–7 hrs', startEle: 4210, endEle: 3440, terrain: 'Thame valley descent', stay: 'Tea house', meals: 'B/L/D', highlights: ['Thame monastery', 'Back into thicker air'], tips: 'Celebrate — the hard part is done.' },
    { day: 16, title: 'Namche to Lukla', from: 'Namche', to: 'Lukla (2,840 m)', distanceKm: '13.5 km', walkHours: '6–7 hrs', startEle: 3440, endEle: 2840, terrain: 'Descent then final climb', stay: 'Tea house', meals: 'B/L/D', highlights: ['Last big bridges'], tips: 'Longer than it looks.' },
    { day: 17, title: 'Fly Lukla to Kathmandu', from: 'Lukla', to: 'Kathmandu', distanceKm: '—', walkHours: '—', startEle: 2840, endEle: 1400, terrain: 'Flight', stay: 'Hotel', meals: 'B', highlights: ['The flight out'], tips: 'Keep a buffer day.' },
    { day: 18, title: 'Contingency / departure day', from: 'Kathmandu', to: 'Kathmandu', distanceKm: '—', walkHours: '—', startEle: 1400, endEle: 1400, terrain: '—', stay: 'Hotel', meals: 'B', highlights: ['Spare day for Lukla weather'], tips: 'If unused, a good day for Patan or Bhaktapur.' }
  ],
  routePoints: [
    { name: 'Chukhung', elevation: '4,730 m', day: 7, walkTime: '3–4 hrs from Dingboche', stay: 'Lodges', highlight: 'Staging post for Kongma La and Island Peak', warning: 'Thin services; nights are cold.' },
    { name: 'Kongma La', elevation: '5,535 m', day: 8, walkTime: 'Long day from Chukhung', stay: 'Pass — no shelter', highlight: 'Highest of the three passes', warning: 'Icy boulders; do not attempt in poor visibility.' },
    { name: 'Cho La', elevation: '5,420 m', day: 11, walkTime: 'From Dzongla', stay: 'Pass — no shelter', highlight: 'Short glacier crossing', warning: 'The most hazardous pass — needs firm snow and clear weather.' },
    { name: 'Gokyo', elevation: '4,790 m', day: 12, walkTime: 'From Thagnak', stay: 'Lodges by the third lake', highlight: 'Base for Gokyo Ri', warning: 'Crossing the Ngozumpa Glacier requires care in mist.' },
    { name: 'Renjo La', elevation: '5,360 m', day: 14, walkTime: 'From Gokyo', stay: 'Pass — no shelter', highlight: 'The finest Everest view of the trek', warning: 'Long stone staircase on the west side — hard on the knees.' }
  ],
  permits: [
    { name: 'Sagarmatha National Park entry permit', where: 'Kathmandu or Monjo gate', feeNote: 'Fixed annual fee — verify', notes: 'Same as standard EBC.' },
    { name: 'Khumbu Pasang Lhamu Rural Municipality permit', where: 'Lukla or Monjo', feeNote: 'Local tiered fee — verify', notes: 'Covers the whole Khumbu.' }
  ],
  cost: {
    note: 'A longer trip than standard EBC with more remote nights — budget accordingly and confirm a quote for your dates.',
    tiers: [
      { name: 'Budget / teahouse', rangeUSD: '$1,700–$2,200', includes: ['Group guide', 'Lukla flights', 'Permits', 'Tea houses', 'Main meals'] },
      { name: 'Comfort', rangeUSD: '$2,300–$3,200', includes: ['Private guide + porter', 'Assistant guide on pass days', 'Kathmandu 4★', 'Better lodges'] },
      { name: 'Premium', rangeUSD: '$3,800+', includes: ['Private trip', 'Extra crew', 'Helicopter return', 'Best available lodges'] }
    ],
    breakdown: [
      { item: 'Permits', note: 'Same two as EBC' },
      { item: 'Lukla flights', note: 'May run from Ramechhap in season' },
      { item: 'Guide + assistant', note: 'A second guide on the pass days is worth it' },
      { item: 'Porter', note: 'One per two trekkers' },
      { item: 'Lodging + meals', note: '18 nights, most of them high' },
      { item: 'Tips', note: 'Customary at the end' }
    ],
    independentVsGuided: 'This route should be done with a guide. The passes require route-finding, weather judgement and, on Cho La, glacier travel skills that most independent trekkers do not have.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Lukla', mode: 'Flight (~35 min)', duration: '35 min', note: 'Often via Ramechhap in peak season.' },
      { from: 'Lukla', to: 'Trail', mode: 'On foot', duration: '—', note: '' }
    ],
    note: 'Two contingency days are wise on this route — one for Lukla, one for a weather day on the passes.'
  },
  equipment: [
    { item: 'Microspikes / crampons', need: 'essential', note: 'For the Cho La glacier and any snow on the passes.' },
    { item: 'Sleeping bag to ≈ −18°C', need: 'essential', note: 'Colder, higher camps than standard EBC.' },
    { item: 'Down jacket + insulated trousers', need: 'recommended', note: 'Pre-dawn pass starts.' },
    { item: 'Trekking poles', need: 'essential', note: 'The Renjo La descent is a long stone staircase.' },
    { item: 'Buff / balaclava + goggles', need: 'recommended', note: 'Windchill on the cols is severe.' }
  ],
  safety: {
    risks: [
      { name: 'The passes', note: 'Each is a committing day with no shelter at the top. Your guide will not cross in fresh snow, high wind or poor visibility — be ready to wait or reroute.' },
      { name: 'Cho La glacier', note: 'Crevassed and icy. Firm morning snow and spikes make it straightforward; afternoon slush and rockfall do not.' },
      { name: 'Altitude', note: 'You sleep above 4,700 m for the better part of a week. This route is only safe if you have acclimatised on the standard schedule first.' },
      { name: 'Glacier navigation', note: 'The Ngozumpa Glacier crossing to Gokyo is confusing in mist — stay with the guide.' },
      { name: 'Cold injury', note: 'Frostnip risk on all three pass mornings without proper gloves, boots and face cover.' }
    ],
    turnaround: 'A pass not crossed is a pass attempted another day, or bypassed via the valley. None of the three is worth crossing in bad conditions; all have lower-level alternatives.',
    note: 'Carry a satellite messenger on this route. Helicopter evacuation is possible from Chukhung, Lobuche, Gorak Shep, Dzongla and Gokyo in clear weather.'
  },
  faq: [
    { q: 'How hard is the Three Passes trek compared to Everest Base Camp?', a: 'Considerably harder. It is longer, higher for longer, and includes three 5,300 m-plus passes with steep, rocky ground and a short glacier. Do standard EBC or Gokyo first.' },
    { q: 'Do I need mountaineering experience?', a: 'Not technical climbing, but you should be a confident hill walker happy with scrambling, exposure and using microspikes on a glacier. Your guide handles the rest.' },
    { q: 'Which direction should I do the passes?', a: 'Most guides go clockwise — Kongma La, then Cho La, then Renjo La — so you are best acclimatised for the highest pass and finish on the best view.' },
    { q: 'Is the Cho La dangerous?', a: 'It is the most serious of the three because of the glacier. In firm morning conditions with spikes and a guide it is manageable; in fresh snow it is not crossed.' },
    { q: 'How fit do I need to be?', a: 'Very. Expect several 8–9 hour days on rough ground at altitude. Train hard for months with weighted hill walking.' },
    { q: 'Can the passes be skipped if the weather is bad?', a: 'Yes. Each pass has a valley-level bypass, and your itinerary can drop to a standard EBC or Gokyo route if conditions do not allow a crossing.' },
    { q: 'When is the best time?', a: 'Late April–May and October to early November. Winter snow closes the passes; monsoon makes them dangerous.' },
    { q: 'How many contingency days should I allow?', a: 'At least two — one for the Lukla flight, one for a weather day on a pass.' },
    { q: 'Where are the acclimatisation days?', a: 'Namche, Chukhung/Dingboche and Gokyo, before the harder crossings. The schedule is built around them.' },
    { q: 'Is there mobile coverage and Wi-Fi?', a: 'Same as the Everest region generally — paid Wi-Fi in many lodges, patchy mobile data, long dead zones. Carry a satellite messenger.' },
    { q: 'Can I charge devices?', a: 'Yes, for a fee in tea-house dining rooms, less reliably the higher and more remote you are. Bring a large power bank.' },
    { q: 'What is the accommodation like on the passes?', a: 'Tea houses on both sides of each pass, but the highest ones (Dzongla, Thagnak, Lobuche) are basic and fill fast. A guide booking ahead matters.' },
    { q: 'What permits are required?', a: 'The Sagarmatha National Park permit and the Khumbu Pasang Lhamu Rural Municipality permit — the same two as standard EBC.' },
    { q: 'What if I get altitude sickness mid-circuit?', a: 'You descend to the nearest lower valley — the route is never far from a downward option — and either recover and rejoin a simpler itinerary or fly out.' },
    { q: 'Are the Gokyo lakes worth the extra days?', a: 'Yes. Many trekkers rate Gokyo Ri and the lakes above the Base Camp side of the trip.' },
    { q: 'Can I add a trekking peak?', a: 'Island Peak (6,189 m) combines naturally from Chukhung and needs a climbing permit and an extra 2–3 days with a climbing guide. Ask when you plan the trip.' }
  ],
  relatedTreks: ['everest-base-camp', 'gokyo-lakes', 'everest-view-trek', 'manaslu-circuit'],
  relatedDestinations: [
    { name: 'Gokyo valley', note: 'Can also be done on its own as a gentler high trek.' },
    { name: 'Thame', note: 'The old trans-Himalayan trade village and home of many famous climbers.' },
    { name: 'Kathmandu Valley — Patan & Bhaktapur', note: 'Ideal use of a contingency day if the weather behaves.' }
  ],
  hotelsNote: 'Kathmandu nights either side are typically included; the trail is all tea houses, booked ahead by your guide because the high pass-side lodges are small. Ask us about an extra recovery night in Namche.'
};

TREKS['gokyo-lakes'] = {
  slug: 'gokyo-lakes',
  popular: true,
  name: 'Gokyo Lakes Trek',
  tagline: 'Turquoise lakes and the widest view in the Khumbu',
  province: 'koshi',
  region: 'Khumbu (Everest)',
  heroImage: '/images/hero-mountain.jpg',
  summary: 'A quieter alternative to Everest Base Camp: 12 days up the Dudh Koshi and into the Gokyo valley, to a chain of glacial lakes below Cho Oyu and the summit of Gokyo Ri (5,357 m), where four eight-thousanders line up in a single view.',
  stats: {
    duration: '12 days on the trail',
    difficulty: 'Moderate',
    maxAltitude: '5,357 m',
    maxAltitudePoint: 'Gokyo Ri',
    bestSeason: 'Mar–May · Sep–Nov',
    startPoint: 'Lukla (2,840 m)',
    endPoint: 'Lukla',
    distanceKm: '≈ 110 km',
    walkHours: '4–6 hrs/day'
  },
  seo: {
    title: 'Gokyo Lakes Trek — Nepal | Itinerary, Difficulty, Cost & Best Time',
    description: 'The Gokyo Lakes trek in the Everest region: 12-day itinerary to the glacial lakes and Gokyo Ri, difficulty and altitude, permits, cost, best time and FAQ.'
  },
  overview: [
    'The Gokyo valley runs parallel to the main Everest Base Camp trail, one ridge to the west. It carries a fraction of the traffic, the walking days are shorter and gentler, and the payoff — the view from Gokyo Ri of Everest, Lhotse, Makalu and Cho Oyu at once, above a string of impossibly blue lakes — is, for many trekkers, better than Kala Patthar.',
    'The route shares the first few days with the EBC trek to Namche, then branches north-west at Sanasa, climbing through Dole and Machhermo to Gokyo village on the shore of the third lake. From there it is a steep pre-dawn climb up Gokyo Ri, plus optional walks out to the fourth and fifth lakes and “Scoundrel’s Viewpoint” over the Ngozumpa Glacier.',
    'It reaches similar altitude to EBC but with less time spent above 5,000 m, which many people find easier to cope with. It can also be linked to EBC over the Cho La pass for those who want both.'
  ],
  highlights: [
    'Gokyo Ri (5,357 m) — Everest, Lhotse, Makalu and Cho Oyu in one panorama',
    'The Gokyo lakes — a chain of six turquoise glacial pools',
    'The Ngozumpa Glacier, the longest in Nepal, seen from its edge',
    'Fewer trekkers and shorter days than the main EBC route',
    'Machhermo and Dole — classic small Sherpa summer-pasture villages',
    'Option to link with EBC via the Cho La'
  ],
  suitability: {
    physical: 6, technical: 2, altitude: 8, remoteness: 5,
    walkHours: '4–6 hours a day',
    terrain: 'Good trail throughout; the Gokyo Ri climb is steep but a path the whole way.',
    weatherExposure: 'Moderate — the valley is somewhat sheltered until Gokyo itself.',
    goodFor: [
      'Trekkers who want the Everest region without the crowds',
      'Those who find shorter days and less time above 5,000 m more manageable',
      'Photographers — the lake-and-peak combination is exceptional'
    ],
    notIdeal: [
      'Anyone whose heart is set on standing at Base Camp itself',
      'Trekkers wanting to link to EBC but not comfortable with the Cho La glacier',
      'Very tight schedules — still needs Lukla buffer days'
    ]
  },
  why: {
    lead: 'Gokyo is the Everest region for people who came for the mountains, not the milestone.',
    paragraphs: [
      'The lakes are the thing. Fed by the Ngozumpa Glacier, they sit in a bare, high valley and hold a blue that does not photograph as vividly as it looks. Gokyo village is a cluster of lodges on the third lake’s shore, and the walk out along the chain to the fifth lake, with Cho Oyu’s north face filling the head of the valley, is one of the great short walks in Nepal.',
      'Gokyo Ri delivers the view that the whole trek is built around: a 360-degree sweep that includes more of the high Khumbu than you can see from anywhere on the standard route.'
    ],
    gallery: [
      { img: '/images/hero-mountain.jpg', caption: 'The Gokyo lakes below Cho Oyu' },
      { img: '/images/everest_real.jpg', caption: 'The Khumbu giants from Gokyo Ri' },
      { img: '/images/ebc.png', caption: 'The Ngozumpa Glacier' }
    ]
  },
  passes: [],
  acclimatization: {
    days: [3, 7],
    note: 'A second night at Namche, and a second night at Machhermo (4,470 m) with an acclimatisation walk toward Gokyo, keep the ascent within safe limits. Gokyo Ri is climbed on the day after arriving at Gokyo, not the same day.'
  },
  itinerary: [
    { day: 1, title: 'Fly to Lukla, trek to Phakding', from: 'Lukla', to: 'Phakding (2,610 m)', distanceKm: '6 km', walkHours: '3–4 hrs', startEle: 2840, endEle: 2610, terrain: 'River trail', stay: 'Tea house', meals: 'B/L/D', highlights: ['The flight in'], tips: 'Ease in.' },
    { day: 2, title: 'Phakding to Namche', from: 'Phakding', to: 'Namche (3,440 m)', distanceKm: '7.4 km', walkHours: '5–6 hrs', startEle: 2610, endEle: 3440, terrain: 'Forested climb', stay: 'Tea house', meals: 'B/L/D', highlights: ['Hillary Bridge'], tips: 'Slow and steady.' },
    { day: 3, title: 'Namche — acclimatisation', from: 'Namche', to: 'Namche', distanceKm: '6 km', walkHours: '3–4 hrs', startEle: 3440, endEle: 3440, terrain: 'Walk high', stay: 'Tea house', meals: 'B/L/D', highlights: ['Everest View Hotel'], tips: 'Rest, hydrate.' },
    { day: 4, title: 'Namche to Dole', from: 'Namche', to: 'Dole (4,040 m)', distanceKm: '10 km', walkHours: '5–6 hrs', startEle: 3440, endEle: 4040, terrain: 'Traverse then climb after Mong La', stay: 'Tea house', meals: 'B/L/D', highlights: ['Branch away from the EBC crowds at Sanasa'], tips: 'The valley quietens immediately.' },
    { day: 5, title: 'Dole to Machhermo', from: 'Dole', to: 'Machhermo (4,470 m)', distanceKm: '7 km', walkHours: '4–5 hrs', startEle: 4040, endEle: 4470, terrain: 'Open valley climb', stay: 'Tea house', meals: 'B/L/D', highlights: ['Summer yak pastures', 'Cho Oyu appears'], tips: 'Short day by design.' },
    { day: 6, title: 'Machhermo — acclimatisation', from: 'Machhermo', to: 'Machhermo', distanceKm: '4 km', walkHours: '2–3 hrs', startEle: 4470, endEle: 4470, terrain: 'Ridge walk toward Gokyo', stay: 'Tea house', meals: 'B/L/D', highlights: ['IPPG altitude talk at the rescue post'], tips: 'Attend the afternoon health briefing.' },
    { day: 7, title: 'Machhermo to Gokyo', from: 'Machhermo', to: 'Gokyo (4,790 m)', distanceKm: '7 km', walkHours: '4–5 hrs', startEle: 4470, endEle: 4790, terrain: 'Past the first two lakes to the third', stay: 'Tea house', meals: 'B/L/D', highlights: ['First and second Gokyo lakes', 'Gokyo village on the third'], tips: 'Save Gokyo Ri for tomorrow.' },
    { day: 8, title: 'Gokyo Ri and the fifth lake', from: 'Gokyo', to: 'Gokyo', distanceKm: '10–14 km', walkHours: '5–7 hrs', startEle: 4790, endEle: 4790, terrain: 'Steep climb to Gokyo Ri (5,357 m); walk out along the lakes', stay: 'Tea house', meals: 'B/L/D', highlights: ['Four 8,000ers from Gokyo Ri', 'Scoundrel’s Viewpoint over the glacier'], tips: 'Pre-dawn start for Gokyo Ri; afternoon for the lake walk.' },
    { day: 9, title: 'Gokyo to Dole', from: 'Gokyo', to: 'Dole (4,040 m)', distanceKm: '13 km', walkHours: '5–6 hrs', startEle: 4790, endEle: 4040, terrain: 'Valley descent', stay: 'Tea house', meals: 'B/L/D', highlights: ['Easier breathing with every hour'], tips: 'Enjoy the descent.' },
    { day: 10, title: 'Dole to Namche', from: 'Dole', to: 'Namche (3,440 m)', distanceKm: '11 km', walkHours: '5–6 hrs', startEle: 4040, endEle: 3440, terrain: 'Traverse and climb back to Namche', stay: 'Tea house', meals: 'B/L/D', highlights: ['Bakeries and a hot shower'], tips: 'Rejoin the main trail at Sanasa.' },
    { day: 11, title: 'Namche to Lukla', from: 'Namche', to: 'Lukla (2,840 m)', distanceKm: '13.5 km', walkHours: '6–7 hrs', startEle: 3440, endEle: 2840, terrain: 'Descent then final climb', stay: 'Tea house', meals: 'B/L/D', highlights: ['Crew dinner'], tips: 'Pace the last climb.' },
    { day: 12, title: 'Fly Lukla to Kathmandu', from: 'Lukla', to: 'Kathmandu', distanceKm: '—', walkHours: '—', startEle: 2840, endEle: 1400, terrain: 'Flight', stay: 'Hotel', meals: 'B', highlights: ['Flight out'], tips: 'Keep a buffer day for weather.' }
  ],
  routePoints: [
    { name: 'Dole', elevation: '4,040 m', day: 4, walkTime: '5–6 hrs from Namche', stay: 'Lodges', highlight: 'Where the Gokyo valley empties out', warning: 'First night at 4,000 m — watch for AMS.' },
    { name: 'Machhermo', elevation: '4,470 m', day: 5, walkTime: '4–5 hrs from Dole', stay: 'Lodges + a rescue post', highlight: 'Free afternoon altitude briefing at the aid post', warning: 'Acclimatisation night — do not skip.' },
    { name: 'Gokyo', elevation: '4,790 m', day: 7, walkTime: '4–5 hrs from Machhermo', stay: 'Lodges on the third lake', highlight: 'Base for Gokyo Ri and the lake walks', warning: 'The Ri climb is steep and cold before dawn.' },
    { name: 'Gokyo Ri', elevation: '5,357 m', day: 8, walkTime: '2.5–3.5 hrs return', stay: 'Day visit only', highlight: 'The signature panorama of the trek', warning: 'Windchill on the summit is severe — full layers.' }
  ],
  permits: [
    { name: 'Sagarmatha National Park entry permit', where: 'Kathmandu or Monjo gate', feeNote: 'Fixed annual fee — verify', notes: 'Same as EBC.' },
    { name: 'Khumbu Pasang Lhamu Rural Municipality permit', where: 'Lukla or Monjo', feeNote: 'Local tiered fee — verify', notes: 'Same as EBC.' }
  ],
  cost: {
    note: 'Similar structure to Everest Base Camp; a slightly shorter, quieter trip. Confirm a quote for your dates.',
    tiers: [
      { name: 'Budget / teahouse', rangeUSD: '$1,150–$1,550', includes: ['Group guide', 'Lukla flights', 'Permits', 'Tea houses', 'Main meals'] },
      { name: 'Comfort', rangeUSD: '$1,650–$2,300', includes: ['Private guide + porter', 'Better lodges', 'Kathmandu 4★'] },
      { name: 'Premium', rangeUSD: '$2,900+', includes: ['Private trip', 'Helicopter return', 'Best available lodges'] }
    ],
    breakdown: [
      { item: 'Permits', note: 'Same two as EBC' },
      { item: 'Lukla flights', note: 'May run from Ramechhap in season' },
      { item: 'Guide + porter', note: 'Per day' },
      { item: 'Lodging + meals', note: '12 nights, rising with altitude' },
      { item: 'Tips', note: 'Customary at the end' }
    ],
    independentVsGuided: 'A guide is recommended for the altitude and for booking beds in Gokyo, which is a small village. The trail itself is straightforward.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Lukla', mode: 'Flight (~35 min)', duration: '35 min', note: 'Often via Ramechhap in peak season.' },
      { from: 'Lukla', to: 'Trail', mode: 'On foot', duration: '—', note: '' }
    ],
    note: 'Keep at least one contingency day for the Lukla flight at each end.'
  },
  equipment: [
    { item: 'Sleeping bag to ≈ −15°C', need: 'essential', note: 'Gokyo nights are cold.' },
    { item: 'Down jacket', need: 'essential', note: 'For the Gokyo Ri dawn.' },
    { item: 'Trekking poles', need: 'recommended', note: 'Steep on the Ri and the descent.' },
    { item: 'Category 4 sunglasses', need: 'essential', note: 'Glare off the lakes and glacier.' }
  ],
  safety: {
    risks: [
      { name: 'Altitude', note: 'Gokyo is 4,790 m and the Ri is 5,357 m. The schedule’s two acclimatisation nights are the safety margin.' },
      { name: 'Cold on Gokyo Ri', note: 'A pre-dawn climb into strong wind. Frostnip risk without proper gloves and face cover.' },
      { name: 'Glacier edges', note: 'The walk to the fourth and fifth lakes skirts the Ngozumpa Glacier — stay on the marked path, especially in mist.' },
      { name: 'Lukla flights', note: 'Same weather disruption as the whole region.' }
    ],
    turnaround: 'If AMS does not clear at Machhermo or Gokyo, you descend to Dole or Namche. Gokyo Ri is optional — plenty of trekkers enjoy the lakes and skip the summit if they are not feeling strong.',
    note: 'The IPPG-run rescue post at Machhermo gives free daily altitude talks and can assess you if you are unsure. Helicopter evacuation is possible from Gokyo in clear weather.'
  },
  faq: [
    { q: 'Is Gokyo Lakes easier than Everest Base Camp?', a: 'Slightly. The days are shorter and gentler and you spend less time above 5,000 m, though the maximum altitude is similar. Most people find it more comfortable.' },
    { q: 'Which has the better views, Gokyo or EBC?', a: 'Gokyo Ri gives a wider mountain panorama and adds the lakes; EBC puts you at the foot of Everest itself. Many trekkers rate Gokyo higher for scenery.' },
    { q: 'Can I combine Gokyo and Everest Base Camp?', a: 'Yes, by crossing the Cho La pass (5,420 m) between the two valleys — about 18 days total. It needs microspikes and a guide, and good weather for the pass.' },
    { q: 'How fit do I need to be?', a: 'A good level of hill fitness. Train with hill walks for a couple of months. The Gokyo Ri climb is the hardest single effort.' },
    { q: 'Can beginners do the Gokyo Lakes trek?', a: 'Yes, with preparation and a sensible itinerary. It is a common choice for a first Himalayan trek.' },
    { q: 'When is the best time to go?', a: 'March–May and late September–November. October is clearest; spring brings rhododendron lower down.' },
    { q: 'How cold does it get at Gokyo?', a: 'Nights around −10°C in season, colder on the Ri before dawn. Days are often pleasant in the sun.' },
    { q: 'Is there Wi-Fi and phone coverage?', a: 'Paid Wi-Fi in many lodges to Gokyo; mobile data is patchy above Namche. Plan to be mostly offline.' },
    { q: 'Can I charge my devices?', a: 'Yes, for a fee in tea-house dining rooms, pricier higher up. Bring a power bank.' },
    { q: 'Are there ATMs?', a: 'Only in Namche, and unreliable. Carry enough cash from Kathmandu.' },
    { q: 'What food is available?', a: 'The usual tea-house menu — dal bhat, noodles, soups, potatoes, eggs, pancakes. Eat vegetarian above Namche.' },
    { q: 'Can I shower?', a: 'Paid hot showers up to about Machhermo; a bowl of hot water at Gokyo.' },
    { q: 'Do I need a sleeping bag?', a: 'Yes, rated to around −15°C. Hire one in Kathmandu if needed.' },
    { q: 'What permits do I need?', a: 'The Sagarmatha National Park permit and the Khumbu Pasang Lhamu Rural Municipality permit — the same as EBC. Your operator arranges both.' },
    { q: 'Do I have to climb Gokyo Ri?', a: 'No. It is the highlight but entirely optional. The lakes and the valley are rewarding on their own.' },
    { q: 'How many lakes are there?', a: 'Six in the chain; most treks visit the first three at Gokyo and walk out to the fourth and fifth. The sixth is a longer day.' }
  ],
  relatedTreks: ['everest-base-camp', 'three-passes', 'everest-view-trek', 'annapurna-base-camp'],
  relatedDestinations: [
    { name: 'Namche Bazaar', note: 'The regional hub — good for an extra night either way.' },
    { name: 'Khumjung & Khunde', note: 'Traditional Sherpa villages with a Hillary school and hospital, an easy detour.' },
    { name: 'Kathmandu — Boudhanath', note: 'The Tibetan-Buddhist quarter, a natural pairing with a Khumbu trek.' }
  ],
  hotelsNote: 'Kathmandu nights either side are usually included. On the trail you are in tea houses, with beds booked ahead in Gokyo because the village is small. Ask us about extra nights or a Namche upgrade.'
};

TREKS['everest-view-trek'] = {
  slug: 'everest-view-trek',
  name: 'Everest View Trek',
  tagline: 'The Khumbu in a week, without the extreme altitude',
  province: 'koshi',
  region: 'Khumbu (Everest)',
  heroImage: '/images/everest_real.jpg',
  summary: 'A 9-day taste of the Everest region for those short on time or wary of very high altitude: Lukla, Namche, the Everest View Hotel panorama, Khumjung village and the Tengboche monastery, topping out around 3,860–3,960 m.',
  stats: {
    duration: '9 days on the trail',
    difficulty: 'Moderate',
    maxAltitude: '≈ 3,960 m',
    maxAltitudePoint: 'Hotel Everest View / Tengboche',
    bestSeason: 'Mar–May · Oct–Dec',
    startPoint: 'Lukla (2,840 m)',
    endPoint: 'Lukla',
    distanceKm: '≈ 55 km',
    walkHours: '4–6 hrs/day'
  },
  seo: {
    title: 'Everest View Trek — Nepal | Short Everest Trek Itinerary, Cost & Difficulty',
    description: 'The Everest View trek: a short 9-day walk to Namche, the Everest View Hotel and Tengboche without the extreme altitude of Base Camp. Itinerary, cost, best time and FAQ.'
  },
  overview: [
    'Not everyone has two or three weeks, and not everyone wants to sleep at 5,000 m. The Everest View trek keeps to the lower Khumbu — nothing above about 3,960 m — and still delivers Namche Bazaar, a close view of Everest and Ama Dablam from the ridge above Namche, the Sherpa villages of Khumjung and Khunde, and the great hillside monastery at Tengboche.',
    'The walking is the same character as the first four days of the Base Camp trek: forest, suspension bridges, the steep climb to Namche, then traverses along the valley wall. Because the altitude stays moderate, the acclimatisation demands are lighter and the trip is far more forgiving of a tight schedule.',
    'It suits older travellers, families with teenagers, anyone with a genuine reason to avoid extreme altitude, and time-pressed visitors who still want to stand in the Khumbu and see the mountain.'
  ],
  highlights: [
    'Everest, Lhotse, Nuptse and Ama Dablam from the Everest View Hotel (3,880 m)',
    'Namche Bazaar and its Saturday market',
    'Khumjung — the largest traditional Sherpa village, with a Hillary school',
    'Tengboche Monastery and its afternoon prayers',
    'The Sherpa museum and mountaineering heritage of Namche',
    'A realistic Himalayan trek in under two weeks'
  ],
  suitability: {
    physical: 5, technical: 1, altitude: 5, remoteness: 3,
    walkHours: '4–6 hours a day',
    terrain: 'Well-built trail, stone steps, one big climb to Namche. No high passes.',
    weatherExposure: 'Low to moderate — you stay in the sheltered lower valley.',
    goodFor: [
      'Travellers with only 8–10 days',
      'Older trekkers and active families with teenagers',
      'Anyone advised to avoid altitudes above 4,000 m',
      'A first, cautious look at whether high trekking is for you'
    ],
    notIdeal: [
      'Trekkers whose goal is Base Camp or a 5,000 m viewpoint',
      'People wanting a remote, crowd-free experience in peak season'
    ]
  },
  why: {
    lead: 'The best view of Everest that does not require a week of acclimatisation.',
    paragraphs: [
      'From the terrace of the Everest View Hotel, Everest, Lhotse and Ama Dablam stand across the valley in clean morning light. It is a genuinely great Himalayan view, and you can be standing there on the third full day of the trek.',
      'The rest of the walk is about Sherpa life at close range — Namche’s bakeries and gear shops, the school and hospital at Khunde that Edmund Hillary helped build, the monks and the incense at Tengboche — without the grind of the upper valley.'
    ],
    gallery: [
      { img: '/images/everest_real.jpg', caption: 'Everest and Ama Dablam from the Namche ridge' },
      { img: '/images/ebc.png', caption: 'The trail into the Khumbu' },
      { img: '/images/hero-mountain.jpg', caption: 'Morning over the lower Khumbu' }
    ]
  },
  passes: [],
  acclimatization: {
    days: [3],
    note: 'One acclimatisation day at Namche (3,440 m), spent walking up to the Everest View Hotel and Khumjung and back, is enough for a trek that does not go higher than about 3,960 m.'
  },
  itinerary: [
    { day: 1, title: 'Fly to Lukla, trek to Phakding', from: 'Lukla', to: 'Phakding (2,610 m)', distanceKm: '6 km', walkHours: '3–4 hrs', startEle: 2840, endEle: 2610, terrain: 'River trail', stay: 'Tea house', meals: 'B/L/D', highlights: ['The flight in'], tips: 'Ease in.' },
    { day: 2, title: 'Phakding to Namche', from: 'Phakding', to: 'Namche (3,440 m)', distanceKm: '7.4 km', walkHours: '5–6 hrs', startEle: 2610, endEle: 3440, terrain: 'Forested climb', stay: 'Tea house', meals: 'B/L/D', highlights: ['Hillary Bridge', 'First Everest view'], tips: 'Slow on the final climb.' },
    { day: 3, title: 'Namche — Everest View Hotel & Khumjung', from: 'Namche', to: 'Namche', distanceKm: '8 km', walkHours: '4–5 hrs', startEle: 3440, endEle: 3440, terrain: 'Climb to 3,880 m, loop through Khumjung', stay: 'Tea house', meals: 'B/L/D', highlights: ['The Everest View panorama', 'Khumjung monastery and Hillary school'], tips: 'This is the scenic high point of the trek — go on a clear morning.' },
    { day: 4, title: 'Namche to Tengboche', from: 'Namche', to: 'Tengboche (3,860 m)', distanceKm: '9 km', walkHours: '5–6 hrs', startEle: 3440, endEle: 3860, terrain: 'Traverse, drop to the river, steep climb', stay: 'Tea house', meals: 'B/L/D', highlights: ['Tengboche Monastery', 'Ama Dablam close up'], tips: 'Aim to catch the late-afternoon prayer ceremony.' },
    { day: 5, title: 'Tengboche to Namche', from: 'Tengboche', to: 'Namche (3,440 m)', distanceKm: '9 km', walkHours: '4–5 hrs', startEle: 3860, endEle: 3440, terrain: 'Return traverse', stay: 'Tea house', meals: 'B/L/D', highlights: ['A relaxed second look at the valley'], tips: 'Time for the Sherpa museum back in Namche.' },
    { day: 6, title: 'Namche to Monjo / Phakding', from: 'Namche', to: 'Monjo (2,835 m)', distanceKm: '8 km', walkHours: '3–4 hrs', startEle: 3440, endEle: 2835, terrain: 'Descent to the river', stay: 'Tea house', meals: 'B/L/D', highlights: ['The forest and birds return'], tips: 'An easy half-day.' },
    { day: 7, title: 'Monjo to Lukla', from: 'Monjo', to: 'Lukla (2,840 m)', distanceKm: '9 km', walkHours: '3–4 hrs', startEle: 2835, endEle: 2840, terrain: 'Rolling trail, final climb', stay: 'Tea house', meals: 'B/L/D', highlights: ['Crew dinner in Lukla'], tips: 'Short day; enjoy it.' },
    { day: 8, title: 'Fly Lukla to Kathmandu', from: 'Lukla', to: 'Kathmandu', distanceKm: '—', walkHours: '—', startEle: 2840, endEle: 1400, terrain: 'Flight', stay: 'Hotel', meals: 'B', highlights: ['Flight out'], tips: 'Keep a buffer day.' },
    { day: 9, title: 'Contingency / departure day', from: 'Kathmandu', to: 'Kathmandu', distanceKm: '—', walkHours: '—', startEle: 1400, endEle: 1400, terrain: '—', stay: 'Hotel', meals: 'B', highlights: ['Spare day for Lukla weather'], tips: 'Great for the Kathmandu Valley temples if unused.' }
  ],
  routePoints: [
    { name: 'Namche Bazaar', elevation: '3,440 m', day: 2, walkTime: '5–6 hrs from Phakding', stay: 'Lodges, bakeries, museums', highlight: 'The Sherpa capital and the trek’s base', warning: 'The climb up is the hardest hour of the trip.' },
    { name: 'Hotel Everest View', elevation: '3,880 m', day: 3, walkTime: '2 hrs from Namche', stay: 'Day visit (or a night, at a price)', highlight: 'The signature Everest panorama', warning: 'Views close out by mid-morning — go early.' },
    { name: 'Khumjung', elevation: '3,790 m', day: 3, walkTime: 'Loop from the Everest View Hotel', stay: 'Lodges', highlight: 'Traditional Sherpa village, monastery, Hillary school', warning: '—' },
    { name: 'Tengboche', elevation: '3,860 m', day: 4, walkTime: '5–6 hrs from Namche', stay: 'Lodges by the monastery', highlight: 'The spiritual centre of the Khumbu', warning: 'Cold and cloudy by afternoon.' }
  ],
  permits: [
    { name: 'Sagarmatha National Park entry permit', where: 'Kathmandu or Monjo gate', feeNote: 'Fixed annual fee — verify', notes: 'Same as EBC.' },
    { name: 'Khumbu Pasang Lhamu Rural Municipality permit', where: 'Lukla or Monjo', feeNote: 'Local tiered fee — verify', notes: 'Same as EBC.' }
  ],
  cost: {
    note: 'A shorter trip than Base Camp, so lower overall — but the Lukla flights are still the biggest single cost. Confirm a quote for your dates.',
    tiers: [
      { name: 'Budget / teahouse', rangeUSD: '$900–$1,250', includes: ['Group guide', 'Lukla flights', 'Permits', 'Tea houses', 'Main meals'] },
      { name: 'Comfort', rangeUSD: '$1,350–$1,900', includes: ['Private guide + porter', 'Better lodges', 'A night at the Everest View Hotel', 'Kathmandu 4★'] },
      { name: 'Premium', rangeUSD: '$2,400+', includes: ['Private trip', 'Everest View Hotel night', 'Helicopter scenic add-on', 'Best lodges'] }
    ],
    breakdown: [
      { item: 'Permits', note: 'Same two as EBC' },
      { item: 'Lukla flights', note: 'The main cost; may run from Ramechhap' },
      { item: 'Guide + porter', note: 'Per day' },
      { item: 'Lodging + meals', note: '7 nights, moderate altitude' },
      { item: 'Tips', note: 'Customary at the end' }
    ],
    independentVsGuided: 'The trail is easy to follow, but a guide adds the Sherpa-life context that is the point of this trek, and handles Lukla logistics. Recommended.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Lukla', mode: 'Flight (~35 min)', duration: '35 min', note: 'May run from Ramechhap (4–5 hr drive) in peak season.' },
      { from: 'Lukla', to: 'Trail', mode: 'On foot', duration: '—', note: '' }
    ],
    note: 'Even a short trek needs a contingency day for the Lukla flight. Helicopter shuttles are an option if you are truly stuck.'
  },
  equipment: [
    { item: 'Sleeping bag to ≈ −8°C to −10°C', need: 'essential', note: 'Lower altitude means a lighter bag than EBC.' },
    { item: 'Warm jacket + waterproof shell', need: 'essential', note: 'Evenings are cold; afternoons can be damp.' },
    { item: 'Trekking poles', need: 'recommended', note: 'For the Namche climb and descent.' },
    { item: 'Sun hat + sunglasses', need: 'essential', note: 'Strong sun on the open traverses.' }
  ],
  safety: {
    risks: [
      { name: 'Altitude', note: 'Real but modest — Namche and Tengboche are around 3,400–3,900 m. Mild AMS is possible; the itinerary’s Namche day handles it.' },
      { name: 'The Namche climb', note: 'A sustained steep hour that catches unfit trekkers out. Go slowly and it is fine.' },
      { name: 'Lukla flights', note: 'The usual weather disruption. Do not book onward travel tight to your return date.' },
      { name: 'Trail traffic', note: 'Yak and porter trains — step to the uphill side.' }
    ],
    turnaround: 'There is very little to turn around from on this route — it stays low. If someone is unwell at Namche the plan simply becomes a rest day or an early descent to Lukla.',
    note: 'The Kunde hospital and the Namche health post are both on or near the route, which makes this one of the most medically-covered treks in Nepal.'
  },
  faq: [
    { q: 'Can you actually see Everest on the Everest View trek?', a: 'Yes — clearly, from the ridge above Namche and the Everest View Hotel, weather permitting, along with Lhotse, Nuptse and Ama Dablam. You do not reach Everest itself.' },
    { q: 'How high does the Everest View trek go?', a: 'About 3,880 m at the Everest View Hotel and 3,860 m at Tengboche. It deliberately avoids the extreme altitude of the Base Camp route.' },
    { q: 'Is it suitable for beginners and families?', a: 'Yes. It is one of the best introductory Himalayan treks — moderate days, moderate altitude, tea-house comfort — and works for fit families with teenagers.' },
    { q: 'How fit do I need to be?', a: 'Moderately fit. If you can manage 4–6 hours of hill walking on consecutive days, you can do this trek. The Namche climb is the crux.' },
    { q: 'How many days do I need?', a: 'Seven on the trail plus a Lukla buffer — call it 9–10 days including Kathmandu.' },
    { q: 'When is the best time to go?', a: 'March–May and October–December. Because it stays low, it holds up better into early winter than the Base Camp trek.' },
    { q: 'Do I still need a guide and permits?', a: 'Permits, yes — the same national park and rural municipality permits as EBC. A guide is recommended and, under current rules, generally required.' },
    { q: 'Is there a risk of altitude sickness on such a short trek?', a: 'Mild AMS is possible at Namche and Tengboche. The acclimatisation day and the moderate ceiling keep the risk low, and descent is always close.' },
    { q: 'Can I stay at the Everest View Hotel?', a: 'Yes, as a paid upgrade — it is a real hotel at 3,880 m. Many trekkers just visit for the view and a coffee.' },
    { q: 'Is there Wi-Fi and phone coverage?', a: 'Better than the upper Khumbu — paid Wi-Fi in Namche and Tengboche lodges, mobile data around Namche.' },
    { q: 'Can I charge my phone?', a: 'Yes, easily, in the lodges on this route — no need to ration power the way you would higher up.' },
    { q: 'Are there ATMs?', a: 'In Namche, unreliably. Bring cash from Kathmandu.' },
    { q: 'Can I shower every day?', a: 'Effectively yes — paid hot showers are available at every overnight stop on this route.' },
    { q: 'What if the Lukla flight is cancelled?', a: 'You wait, or take a helicopter shuttle. Build in at least one spare day; two is safer in monsoon-shoulder months.' },
    { q: 'Can I extend the trek if I feel strong?', a: 'Yes — you can continue toward Dingboche or add the Gokyo or Base Camp route, subject to acclimatisation and time. Decide with your guide en route.' }
  ],
  relatedTreks: ['everest-base-camp', 'gokyo-lakes', 'tamang-heritage-trail', 'mardi-himal'],
  relatedDestinations: [
    { name: 'Khumjung & Khunde', note: 'Built into the itinerary — the Hillary school and hospital.' },
    { name: 'Namche Saturday market', note: 'Time the trek to catch it if you can.' },
    { name: 'Kathmandu Valley temples', note: 'Perfect for a spare day — Bhaktapur, Patan, Swayambhunath.' }
  ],
  hotelsNote: 'Kathmandu nights either side are usually included; the trail is tea houses. The Everest View Hotel can be added as a night’s upgrade — tell us when you plan the trip.'
};

TREKS['makalu-base-camp'] = {
  slug: 'makalu-base-camp',
  name: 'Makalu Base Camp Trek',
  tagline: 'A wild, near-empty trail to the fifth-highest mountain',
  province: 'koshi',
  region: 'Makalu–Barun',
  heroImage: '/images/hero-mountain.jpg',
  summary: 'An 18-day expedition-style trek through the Makalu–Barun National Park to the base camp of Makalu (8,485 m). Remote, strenuous, sparsely lodged, and one of the least-walked major trails in Nepal.',
  stats: {
    duration: '18 days on the trail',
    difficulty: 'Strenuous',
    maxAltitude: '≈ 4,870 m',
    maxAltitudePoint: 'Makalu Base Camp',
    bestSeason: 'Mar–May · Oct–Nov',
    startPoint: 'Num / Chichila (road head from Tumlingtar)',
    endPoint: 'Num / Chichila',
    distanceKm: '≈ 130–150 km',
    walkHours: '5–8 hrs/day'
  },
  seo: {
    title: 'Makalu Base Camp Trek — Nepal | Remote Eastern Nepal Trek Itinerary & Cost',
    description: 'The Makalu Base Camp trek through the Barun valley to the foot of Makalu (8,485 m). Itinerary, difficulty, permits, cost, best season and FAQ for one of Nepal’s wildest trails.'
  },
  overview: [
    'Makalu Base Camp is what Everest Base Camp was fifty years ago: a hard walk into a big mountain through country where the tea houses are few, basic and sometimes closed, and where you can go a full day without meeting another trekker.',
    'From the road head near Tumlingtar the trail climbs over forested ridges — losing and regaining altitude repeatedly in the first week — before dropping into the Barun valley, a deep glacial trench inside the Makalu–Barun National Park. The valley then leads steadily up past Yangle Kharka and Langmale to the moraine below Makalu, with Baruntse, Everest and Lhotse appearing at the head of the valley.',
    'It rewards self-sufficient, experienced trekkers who want wilderness and are relaxed about comfort. Some nights are in very simple lodges, some may be camping depending on the season, and the weather in the east arrives with little warning.'
  ],
  highlights: [
    'Makalu Base Camp (≈ 4,870 m) beneath the world’s fifth-highest peak',
    'The Barun valley — glaciers, waterfalls and 2,000 m walls inside a protected wilderness',
    'Everest and Lhotse’s south faces from the head of the valley',
    'One of the richest biodiversity corridors in Nepal, from subtropical forest to glacier',
    'Genuine solitude — a fraction of the traffic of any other 8,000 m base camp',
    'Rai and Sherpa villages on the approach, largely untouched by trekking tourism'
  ],
  suitability: {
    physical: 9, technical: 3, altitude: 8, remoteness: 9,
    walkHours: '5–8 hours a day, with a punishing ridge section early on',
    terrain: 'Steep forest trails, landslide-prone slopes, glacial moraine. Occasional exposure.',
    weatherExposure: 'High — eastern Nepal is wetter and stormier, and the Barun holds cloud.',
    goodFor: [
      'Experienced trekkers who have done a remote route before',
      'Walkers who value solitude over comfort and infrastructure',
      'Anyone comfortable with basic lodges or camping and flexible plans'
    ],
    notIdeal: [
      'First-time trekkers or anyone expecting Khumbu-style tea houses',
      'Tight schedules — flights to Tumlingtar are weather-sensitive',
      'Trekkers who need reliable connectivity or resupply'
    ]
  },
  why: {
    lead: 'This is the trek for people who found the Everest trail too crowded and want to know what the Himalaya felt like before.',
    paragraphs: [
      'The Barun valley is spectacular and almost nobody sees it. It is a national park managed for wilderness, with a corridor of forest running unbroken from near-tropical foothills to the ice, and a level of quiet that is genuinely rare in Nepal now.',
      'The approach is deceptively hard — the first week is a rollercoaster of forested ridges with big daily height changes — but once you are in the valley the walking eases and the mountains take over. Standing on the moraine below Makalu with Everest and Lhotse framing the valley head, and no other trekkers in sight, is the whole point.'
    ],
    gallery: [
      { img: '/images/hero-mountain.jpg', caption: 'The Barun valley below Makalu' },
      { img: '/images/everest_real.jpg', caption: 'Everest and Lhotse from the valley head' },
      { img: '/images/ebc.png', caption: 'Glacial moraine on the approach to base camp' }
    ]
  },
  passes: [],
  acclimatization: {
    days: [10, 13],
    note: 'Because the first week undulates between roughly 1,500 m and 3,000 m, formal acclimatisation days come later — typically at Yangle Kharka / Langmale and again before or at Base Camp. The valley’s steady grade helps, but the schedule still needs rest days built in.'
  },
  itinerary: [
    { day: 1, title: 'Fly Kathmandu–Tumlingtar, drive to Chichila', from: 'Kathmandu', to: 'Chichila (1,980 m)', distanceKm: '—', walkHours: 'flight + 3–4 hr drive', startEle: 1400, endEle: 1980, terrain: 'Flight then rough road', stay: 'Tea house', meals: 'B/L/D', highlights: ['First views of Makalu on the drive'], tips: 'The Tumlingtar flight is weather-dependent — allow slack.' },
    { day: 2, title: 'Chichila to Num', from: 'Chichila', to: 'Num (1,560 m)', distanceKm: '13 km', walkHours: '5–6 hrs', startEle: 1980, endEle: 1560, terrain: 'Ridge trail through villages', stay: 'Tea house', meals: 'B/L/D', highlights: ['Rai farming villages'], tips: 'Ease into the rhythm.' },
    { day: 3, title: 'Num to Seduwa', from: 'Num', to: 'Seduwa (1,540 m)', distanceKm: '10 km', walkHours: '5–6 hrs', startEle: 1560, endEle: 1540, terrain: 'Steep drop to the river, steep climb out', stay: 'Tea house', meals: 'B/L/D', highlights: ['Barun river crossing', 'Park entry checkpoint'], tips: 'Big descent-then-ascent — pace it.' },
    { day: 4, title: 'Seduwa to Tashigaon', from: 'Seduwa', to: 'Tashigaon (2,100 m)', distanceKm: '11 km', walkHours: '5–6 hrs', startEle: 1540, endEle: 2100, terrain: 'Farmland and forest climb', stay: 'Tea house', meals: 'B/L/D', highlights: ['Last permanent village on the route'], tips: 'Stock up — services thin out from here.' },
    { day: 5, title: 'Tashigaon to Khongma Danda', from: 'Tashigaon', to: 'Khongma Danda (3,560 m)', distanceKm: '7 km', walkHours: '6–7 hrs', startEle: 2100, endEle: 3560, terrain: 'Relentless forested climb', stay: 'Basic lodge', meals: 'B/L/D', highlights: ['Treeline and first alpine views'], tips: '1,400 m of ascent — the hardest single day of the approach.' },
    { day: 6, title: 'Acclimatisation / crossing the ridge passes', from: 'Khongma Danda', to: 'Dobato (3,650 m)', distanceKm: '9 km', walkHours: '6–7 hrs', startEle: 3560, endEle: 3650, terrain: 'Two minor passes (~4,100 m), rhododendron and rock', stay: 'Basic lodge', meals: 'B/L/D', highlights: ['Shipton La / Keke La', 'Big Himalayan skyline'], tips: 'Short in distance, high in effort; “climb high, sleep low” in action.' },
    { day: 7, title: 'Dobato to Yangle Kharka', from: 'Dobato', to: 'Yangle Kharka (3,600 m)', distanceKm: '12 km', walkHours: '6–7 hrs', startEle: 3650, endEle: 3600, terrain: 'Steep descent into the Barun valley', stay: 'Basic lodge / camp', meals: 'B/L/D', highlights: ['Entering the Barun', 'Waterfalls off the valley walls'], tips: 'The undulating approach is over — the valley walk begins.' },
    { day: 8, title: 'Yangle Kharka to Langmale Kharka', from: 'Yangle Kharka', to: 'Langmale Kharka (4,410 m)', distanceKm: '11 km', walkHours: '5–6 hrs', startEle: 3600, endEle: 4410, terrain: 'Valley floor, moraine, yak pastures', stay: 'Basic lodge / camp', meals: 'B/L/D', highlights: ['Peak 6 and Peak 7', 'Glacier meltwater'], tips: 'Slow the pace — you are gaining real altitude now.' },
    { day: 9, title: 'Acclimatisation at Langmale', from: 'Langmale Kharka', to: 'Langmale Kharka', distanceKm: '4–6 km', walkHours: '2–4 hrs', startEle: 4410, endEle: 4410, terrain: 'Short climb up-valley and back', stay: 'Basic lodge / camp', meals: 'B/L/D', highlights: ['First clear Makalu views'], tips: 'A genuine rest day before Base Camp.' },
    { day: 10, title: 'Langmale to Makalu Base Camp', from: 'Langmale Kharka', to: 'Makalu Base Camp (4,870 m)', distanceKm: '10 km', walkHours: '5–6 hrs', startEle: 4410, endEle: 4870, terrain: 'Moraine and glacier edge', stay: 'Basic lodge / camp', meals: 'B/L/D', highlights: ['Makalu’s south-west face', 'Everest and Lhotse at the valley head'], tips: 'Arrive with time to explore the moraine in the afternoon light.' },
    { day: 11, title: 'Makalu Base Camp — exploration day', from: 'Makalu Base Camp', to: 'Makalu Base Camp', distanceKm: '6–10 km', walkHours: '3–5 hrs', startEle: 4870, endEle: 4870, terrain: 'Glacier viewpoints and moraine ridges', stay: 'Basic lodge / camp', meals: 'B/L/D', highlights: ['Sunrise on Makalu', 'Walk toward the Sherpani Col viewpoint'], tips: 'Weather permitting — a storm day here means staying put.' },
    { day: 12, title: 'Base Camp to Yangle Kharka', from: 'Makalu Base Camp', to: 'Yangle Kharka (3,600 m)', distanceKm: '20 km', walkHours: '7–8 hrs', startEle: 4870, endEle: 3600, terrain: 'Long descent down the valley', stay: 'Basic lodge / camp', meals: 'B/L/D', highlights: ['Easier breathing quickly'], tips: 'A big day, but downhill and rewarding.' },
    { day: 13, title: 'Yangle Kharka to Dobato', from: 'Yangle Kharka', to: 'Dobato (3,650 m)', distanceKm: '12 km', walkHours: '6–7 hrs', startEle: 3600, endEle: 3650, terrain: 'Climb back out of the valley', stay: 'Basic lodge', meals: 'B/L/D', highlights: ['Last of the high peaks'], tips: 'The re-ascent is tougher than it looks after Base Camp.' },
    { day: 14, title: 'Dobato to Khongma Danda', from: 'Dobato', to: 'Khongma Danda (3,560 m)', distanceKm: '9 km', walkHours: '6–7 hrs', startEle: 3650, endEle: 3560, terrain: 'Recross the ridge passes', stay: 'Basic lodge', meals: 'B/L/D', highlights: ['Final panoramic ridge'], tips: 'Enjoy the last big views before the forest.' },
    { day: 15, title: 'Khongma Danda to Tashigaon', from: 'Khongma Danda', to: 'Tashigaon (2,100 m)', distanceKm: '7 km', walkHours: '4–5 hrs', startEle: 3560, endEle: 2100, terrain: 'Steep forest descent', stay: 'Tea house', meals: 'B/L/D', highlights: ['Back to permanent villages'], tips: 'Hard on the knees — poles help.' },
    { day: 16, title: 'Tashigaon to Seduwa / Num', from: 'Tashigaon', to: 'Num (1,560 m)', distanceKm: '18 km', walkHours: '7–8 hrs', startEle: 2100, endEle: 1560, terrain: 'Descend, cross the river, climb to Num', stay: 'Tea house', meals: 'B/L/D', highlights: ['The last big river crossing'], tips: 'Long day with a stinging climb at the end.' },
    { day: 17, title: 'Num to Tumlingtar', from: 'Num', to: 'Tumlingtar (460 m)', distanceKm: '—', walkHours: '4–5 hr drive', startEle: 1560, endEle: 460, terrain: 'Rough road', stay: 'Guesthouse', meals: 'B/L/D', highlights: ['Trek complete'], tips: 'Position for the morning flight.' },
    { day: 18, title: 'Fly Tumlingtar to Kathmandu', from: 'Tumlingtar', to: 'Kathmandu', distanceKm: '—', walkHours: '—', startEle: 460, endEle: 1400, terrain: 'Flight', stay: 'Hotel', meals: 'B', highlights: ['Flight out over the eastern hills'], tips: 'Keep a spare day — Tumlingtar flights are frequently delayed.' }
  ],
  routePoints: [
    { name: 'Tashigaon', elevation: '2,100 m', day: 4, walkTime: '5–6 hrs from Seduwa', stay: 'Simple tea houses', highlight: 'Last permanent village — final resupply', warning: 'Services above here are minimal and seasonal.' },
    { name: 'Khongma Danda', elevation: '3,560 m', day: 5, walkTime: '6–7 hrs / 1,400 m climb', stay: 'One or two basic lodges', highlight: 'Treeline and the start of the ridge crossings', warning: 'Beds are very limited; camping backup often needed.' },
    { name: 'Yangle Kharka', elevation: '3,600 m', day: 7, walkTime: '6–7 hrs from Dobato', stay: 'Basic lodge / camp', highlight: 'Gateway to the Barun valley proper', warning: 'Lodges may be shut outside peak weeks.' },
    { name: 'Langmale Kharka', elevation: '4,410 m', day: 8, walkTime: '5–6 hrs from Yangle', stay: 'Basic lodge / camp', highlight: 'Acclimatisation base and first big Makalu views', warning: 'Cold; limited food choice.' },
    { name: 'Makalu Base Camp', elevation: '≈ 4,870 m', day: 10, walkTime: '5–6 hrs from Langmale', stay: 'Basic lodge / camp', highlight: 'Makalu, Everest and Lhotse from one moraine', warning: 'No shelter beyond camp; storms roll in fast.' }
  ],
  permits: [
    { name: 'Makalu Barun National Park entry permit', where: 'Kathmandu (NTB) or the Seduwa checkpoint', feeNote: 'Fixed park fee — verify', notes: 'Carry passport and photos.' },
    { name: 'Local area / rural municipality permit', where: 'Issued locally on the route', feeNote: 'Local fee — verify', notes: 'Replaces TIMS for this area; requirements change.' }
  ],
  cost: {
    note: 'A remote, staff-heavy trip — often part-camping — so it costs more per day than a Khumbu tea-house trek. Confirm a quote for your dates.',
    tiers: [
      { name: 'Lodge + camping mix', rangeUSD: '$1,900–$2,600', includes: ['Guide + cook where camping', 'Domestic flights', 'Permits', 'Lodges / tents', 'All meals on trek'] },
      { name: 'Fully supported camping', rangeUSD: '$2,700–$3,600', includes: ['Full camp crew', 'Private trip', 'Kathmandu hotels', 'Porter team'] },
      { name: 'Premium expedition style', rangeUSD: '$4,000+', includes: ['Larger crew', 'Better tents / mess', 'Helicopter contingency', 'Extra rest days'] }
    ],
    breakdown: [
      { item: 'Domestic flights', note: 'Kathmandu–Tumlingtar return, weather-prone' },
      { item: 'Permits', note: 'National park + local area fee' },
      { item: 'Crew', note: 'Guide, cook and porters — more staff than a tea-house trek' },
      { item: 'Food + fuel', note: 'Much carried in; camping resupply is limited' },
      { item: 'Contingency', note: 'Budget for extra days for weather and flights' }
    ],
    independentVsGuided: 'This is not a route to do independently. It needs a guide who knows the ridge section, the state of the seasonal lodges, and how to run a camp if beds are unavailable.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Tumlingtar', mode: 'Flight (~45 min)', duration: '45 min', note: 'Small aircraft, frequently delayed. An overland alternative from Kathmandu is a very long two-day drive.' },
      { from: 'Tumlingtar', to: 'Num / Chichila', mode: 'Jeep on rough road', duration: '3–5 hrs', note: 'Road quality varies with the season and can be cut by monsoon damage.' }
    ],
    note: 'Allow two spare days on this itinerary — the Tumlingtar flight is one of the least reliable in the country.'
  },
  equipment: [
    { item: '4-season sleeping bag (≈ −15°C to −18°C)', need: 'essential', note: 'Camping and cold basic lodges.' },
    { item: 'Sleeping mat', need: 'essential', note: 'Needed on any camping night.' },
    { item: 'Trekking poles', need: 'essential', note: 'The ridge section is brutal on the knees.' },
    { item: 'Full waterproofs', need: 'essential', note: 'The east is wetter — expect rain even in season.' },
    { item: 'Water filter + chemical backup', need: 'essential', note: 'Fewer safe-water stations than the Khumbu.' },
    { item: 'Satellite messenger', need: 'recommended', note: 'Long stretches with no mobile coverage at all.' }
  ],
  safety: {
    risks: [
      { name: 'Remoteness', note: 'Evacuation from the Barun valley is slow and weather-dependent. Small problems become serious faster here than on busier trails.' },
      { name: 'The approach ridge', note: 'Steep, sometimes muddy, with big daily height changes and landslide-prone sections in and after rain.' },
      { name: 'Weather', note: 'Eastern Nepal gets more cloud and storms. A settled forecast can turn within hours.' },
      { name: 'Accommodation gaps', note: 'Seasonal lodges may be closed or full; your operator must be able to camp instead.' },
      { name: 'Altitude', note: 'Base Camp is 4,870 m after a fast valley climb — the built-in rest days matter.' }
    ],
    turnaround: 'On this route the plan flexes constantly with weather and lodge availability. If a storm sets in below Base Camp, you wait or turn — pushing on into bad weather in the upper Barun is not an option worth taking.',
    note: 'Carry a satellite messenger. The nearest helicopter-capable pickup points are in the valley and require a weather window; the nearest hospital is a flight away in Kathmandu.'
  },
  faq: [
    { q: 'How hard is the Makalu Base Camp trek?', a: 'Strenuous and committing. The first week undulates hard through forested ridges with big height changes, the lodges are basic or absent, and the weather is less predictable than the Khumbu. It suits experienced, self-reliant trekkers.' },
    { q: 'Is it a technical climb?', a: 'No. There is no roped or glacier travel on the standard Base Camp route. It is a hard walk, not a mountaineering objective.' },
    { q: 'How remote is it really?', a: 'Very. You can walk all day without seeing another trekking group, mobile coverage is absent for long stretches, and resupply above Tashigaon is minimal.' },
    { q: 'Do I camp or stay in tea houses?', a: 'A mix. Villages on the approach have simple tea houses; higher up, seasonal lodges exist but may be shut or full, so a good operator carries camping gear as backup.' },
    { q: 'How fit do I need to be?', a: 'Very fit, with previous multi-day trekking experience ideally at altitude. Expect 6–8 hour days on rough ground with large ascents and descents.' },
    { q: 'When is the best time to trek to Makalu Base Camp?', a: 'April–May and October–November. Spring is greener with rhododendron; autumn is more stable. Winter closes the ridge; monsoon makes it dangerous.' },
    { q: 'How do I get to the trailhead?', a: 'Fly Kathmandu–Tumlingtar (about 45 min, often delayed), then jeep 3–5 hours to Num or Chichila on rough road.' },
    { q: 'What permits are required?', a: 'The Makalu Barun National Park entry permit and a local area permit issued on the route. Your operator arranges both; fees are set periodically — verify current amounts.' },
    { q: 'Is there mobile coverage or Wi-Fi?', a: 'Very little. Some coverage around Tumlingtar and the lower villages; effectively nothing in the Barun valley. Carry a satellite messenger.' },
    { q: 'Can I charge my devices?', a: 'Occasionally, at lower lodges, sometimes for a fee. Above Tashigaon, assume solar or nothing — bring a large power bank and a small solar panel.' },
    { q: 'What is the food like?', a: 'Dal bhat, noodles and eggs at the lower lodges; a cook-prepared camp menu higher up. Choice is narrow and you should carry extra snacks.' },
    { q: 'How high is Makalu Base Camp?', a: 'About 4,870 m. The trek does not go above this on the standard route.' },
    { q: 'What if the weather closes in at Base Camp?', a: 'You wait it out or descend. The itinerary should carry spare days precisely for this.' },
    { q: 'Can this be combined with other treks?', a: 'Experienced parties with mountaineering skills cross the Sherpani Col and Amphu Labtsa into the Khumbu — a serious expedition, not a trek. The standard trip is out-and-back via Tumlingtar.' },
    { q: 'Are there ATMs or resupply points?', a: 'No. Carry all the cash you need from Kathmandu, in small notes.' },
    { q: 'How many spare days should I budget?', a: 'At least two, mostly for the Tumlingtar flight, plus flexibility for a weather day near Base Camp.' }
  ],
  relatedTreks: ['kanchenjunga-base-camp', 'everest-base-camp', 'three-passes', 'upper-dolpo'],
  relatedDestinations: [
    { name: 'Tumlingtar & the Arun valley', note: 'Lowland Rai and Chhetri country, rarely visited, worth a night either side.' },
    { name: 'Chitwan or Koshi Tappu', note: 'A warm wildlife contrast on the way back, both reachable from the east.' },
    { name: 'Kathmandu — Boudhanath', note: 'The usual staging point before and after.' }
  ],
  hotelsNote: 'Kathmandu hotels either side are included; Tumlingtar has only simple guesthouses. On the trail it is basic lodges and tents. Ask us about extra contingency nights for the flights.'
};

TREKS['kanchenjunga-base-camp'] = {
  slug: 'kanchenjunga-base-camp',
  name: 'Kanchenjunga Base Camp Trek',
  tagline: 'The far-eastern giant, on Nepal’s wildest long trail',
  province: 'koshi',
  region: 'Kanchenjunga',
  heroImage: '/images/hero-mountain.jpg',
  summary: 'A 20-day restricted-area trek to both base camps of Kanchenjunga (8,586 m) — Pangpema in the north and Oktang in the south — through the far-eastern corner of Nepal, where the trail is long, the villages are Limbu and Sherpa, and other trekkers are rare.',
  stats: {
    duration: '20 days on the trail',
    difficulty: 'Strenuous',
    maxAltitude: '≈ 5,140 m',
    maxAltitudePoint: 'Pangpema (North Base Camp)',
    bestSeason: 'Mar–May · Oct–Nov',
    startPoint: 'Taplejung / Suketar (flight or long drive)',
    endPoint: 'Taplejung / Suketar',
    distanceKm: '≈ 200–220 km',
    walkHours: '5–8 hrs/day'
  },
  seo: {
    title: 'Kanchenjunga Base Camp Trek — Nepal | Restricted-Area Trek Itinerary & Cost',
    description: 'The Kanchenjunga Base Camp trek to Pangpema and Oktang in far-eastern Nepal: 20-day itinerary, restricted-area permits, difficulty, cost, best season and FAQ.'
  },
  overview: [
    'Kanchenjunga sits in the extreme north-east of Nepal, on the border with Sikkim, and the trek to its base camps is one of the longest and least-developed major routes in the country. It is a restricted area: you must trek with a licensed guide, in a group of two or more, on a special permit.',
    'The full route visits both sides of the massif. The northern arm climbs the Ghunsa valley to Pangpema (≈ 5,140 m), directly below the mountain’s enormous north face. The southern arm crosses high pastures to Oktang, facing the Yalung Glacier. Linking the two means crossing the Sele La ridge — a set of passes around 4,700–4,800 m — or, for shorter trips, choosing just one side.',
    'The infrastructure is basic home-stays and small lodges, with camping support on the highest sections. It is a trek for people who want distance, remoteness and cultural depth, and who are relaxed about simple food and simple beds for three weeks.'
  ],
  highlights: [
    'Pangpema (North Base Camp, ≈ 5,140 m) under Kanchenjunga’s 3,000 m north face',
    'Oktang (South Base Camp) and the Yalung Glacier',
    'The Sele La ridge passes linking the two valleys',
    'Ghunsa — a Tibetan-Buddhist village deep in the mountains',
    'Limbu villages, terraced hills and cardamom forest on the approach',
    'Kanchenjunga Conservation Area — red panda, blue sheep and snow-leopard habitat'
  ],
  suitability: {
    physical: 9, technical: 3, altitude: 9, remoteness: 10,
    walkHours: '5–8 hours a day for three weeks',
    terrain: 'Long forest trails, landslide sections, high pasture, moraine and the Sele La ridge.',
    weatherExposure: 'High and prolonged — you are far from any road for two weeks.',
    goodFor: [
      'Experienced long-distance trekkers who have done remote routes before',
      'Walkers who want three weeks in genuine wilderness and cultural immersion',
      'Anyone comfortable with home-stays, basic food and a flexible plan'
    ],
    notIdeal: [
      'First-timers, or anyone on fewer than ~22–24 days total',
      'Trekkers who need comfort, resupply or reliable communications',
      'Solo trekkers — the restricted-area rules require a group of two or more'
    ]
  },
  why: {
    lead: 'Kanchenjunga is the third-highest mountain on earth and almost nobody walks to look at it.',
    paragraphs: [
      'The scale of the north face from Pangpema is hard to overstate — a wall of ice and rock that fills the sky and dwarfs the moraine you stand on. Because the approach is so long, the few trekkers who make it tend to be there for the right reasons, and the villages along the way — especially Ghunsa — still relate to visitors as guests rather than customers.',
      'The conservation area is one of the most intact ecosystems in the Himalaya, a continuous corridor from subtropical forest to permanent ice, and the walk passes through every band of it.'
    ],
    gallery: [
      { img: '/images/hero-mountain.jpg', caption: 'Kanchenjunga’s north face from the Pangpema side' },
      { img: '/images/everest_real.jpg', caption: 'High pasture on the Sele La crossing' },
      { img: '/images/ebc.png', caption: 'The Yalung Glacier below Oktang' }
    ]
  },
  passes: [
    { name: 'Sele La (and adjoining Sinion La / Mirgin La)', elevation: '≈ 4,700–4,800 m', day: 14 }
  ],
  acclimatization: {
    days: [9, 12, 16],
    note: 'The long, gradual approach up the Ghunsa valley does much of the acclimatisation work, but the schedule still builds rest days at Ghunsa, Lhonak (before Pangpema) and before the Sele La ridge. The ridge crossing between the two base camps is the section most likely to catch out an under-acclimatised trekker.'
  },
  itinerary: [
    { day: 1, title: 'Fly Kathmandu–Bhadrapur, drive to Taplejung', from: 'Kathmandu', to: 'Taplejung (1,820 m)', distanceKm: '—', walkHours: 'flight + 7–9 hr drive', startEle: 1400, endEle: 1820, terrain: 'Flight then long mountain road', stay: 'Guesthouse', meals: 'B/L/D', highlights: ['Tea gardens of the eastern hills'], tips: 'A long travel day; a Suketar flight sometimes shortens it.' },
    { day: 2, title: 'Taplejung to Chiruwa', from: 'Taplejung', to: 'Chiruwa (1,270 m)', distanceKm: '13 km + jeep', walkHours: '4–5 hrs', startEle: 1820, endEle: 1270, terrain: 'Descent along the Tamor river', stay: 'Home-stay', meals: 'B/L/D', highlights: ['Cardamom and terraced farms'], tips: 'Warm and humid down here — different world from the peaks.' },
    { day: 3, title: 'Chiruwa to Sekathum', from: 'Chiruwa', to: 'Sekathum (1,660 m)', distanceKm: '13 km', walkHours: '5–6 hrs', startEle: 1270, endEle: 1660, terrain: 'River trail, suspension bridges', stay: 'Home-stay', meals: 'B/L/D', highlights: ['The Ghunsa Khola joins the Tamor'], tips: 'The northern arm begins here.' },
    { day: 4, title: 'Sekathum to Amjilosa', from: 'Sekathum', to: 'Amjilosa (2,510 m)', distanceKm: '12 km', walkHours: '6–7 hrs', startEle: 1660, endEle: 2510, terrain: 'Steep, exposed climbs above the gorge', stay: 'Home-stay', meals: 'B/L/D', highlights: ['Waterfalls and cliff trail'], tips: 'A tough, airy day — take it slowly.' },
    { day: 5, title: 'Amjilosa to Gyabla', from: 'Amjilosa', to: 'Gyabla (2,730 m)', distanceKm: '11 km', walkHours: '5–6 hrs', startEle: 2510, endEle: 2730, terrain: 'Forest, river crossings', stay: 'Home-stay', meals: 'B/L/D', highlights: ['Dense rhododendron and fir forest'], tips: 'Look for red panda sign in the mossy forest.' },
    { day: 6, title: 'Gyabla to Ghunsa', from: 'Gyabla', to: 'Ghunsa (3,430 m)', distanceKm: '10 km', walkHours: '5–6 hrs', startEle: 2730, endEle: 3430, terrain: 'Gentler valley trail', stay: 'Lodge', meals: 'B/L/D', highlights: ['Ghunsa village and monastery'], tips: 'The cultural heart of the trek.' },
    { day: 7, title: 'Ghunsa — acclimatisation day', from: 'Ghunsa', to: 'Ghunsa', distanceKm: '5–7 km', walkHours: '3–4 hrs', startEle: 3430, endEle: 3430, terrain: 'Climb the ridge behind the village', stay: 'Lodge', meals: 'B/L/D', highlights: ['Micro-hydro and a nunnery', 'Views up the valley'], tips: 'Essential rest day — do the high walk, then relax.' },
    { day: 8, title: 'Ghunsa to Kambachen', from: 'Ghunsa', to: 'Kambachen (4,145 m)', distanceKm: '10 km', walkHours: '5–6 hrs', startEle: 3430, endEle: 4145, terrain: 'Valley trail, a landslide-prone section', stay: 'Basic lodge', meals: 'B/L/D', highlights: ['Jannu (Kumbhakarna) towering above'], tips: 'Cross the landslide area early, before the sun loosens it.' },
    { day: 9, title: 'Kambachen — acclimatisation day', from: 'Kambachen', to: 'Kambachen', distanceKm: '4–6 km', walkHours: '2–4 hrs', startEle: 4145, endEle: 4145, terrain: 'Short up-valley walk', stay: 'Basic lodge', meals: 'B/L/D', highlights: ['Jannu north face'], tips: 'Second acclimatisation day of the north arm.' },
    { day: 10, title: 'Kambachen to Lhonak', from: 'Kambachen', to: 'Lhonak (4,790 m)', distanceKm: '10 km', walkHours: '5–6 hrs', startEle: 4145, endEle: 4790, terrain: 'Moraine and glacial outwash', stay: 'Basic lodge / camp', meals: 'B/L/D', highlights: ['The valley opens toward Kanchenjunga'], tips: 'Slow and steady — big altitude gain.' },
    { day: 11, title: 'Lhonak to Pangpema and back', from: 'Lhonak', to: 'Pangpema (5,140 m) → Lhonak', distanceKm: '16 km round', walkHours: '7–8 hrs', startEle: 4790, endEle: 4790, terrain: 'Moraine trail along the glacier', stay: 'Basic lodge / camp', meals: 'B/L/D', highlights: ['North Base Camp under the 3,000 m face'], tips: 'The climax of the north arm — start early for light and weather.' },
    { day: 12, title: 'Lhonak to Ghunsa', from: 'Lhonak', to: 'Ghunsa (3,430 m)', distanceKm: '20 km', walkHours: '7–8 hrs', startEle: 4790, endEle: 3430, terrain: 'Long valley descent', stay: 'Lodge', meals: 'B/L/D', highlights: ['Relief of thicker air'], tips: 'A long day, but downhill.' },
    { day: 13, title: 'Ghunsa to Selele Camp', from: 'Ghunsa', to: 'Selele Camp (4,290 m)', distanceKm: '9 km', walkHours: '5–6 hrs', startEle: 3430, endEle: 4290, terrain: 'Steep forest then open ridge', stay: 'Camp / basic hut', meals: 'B/L/D', highlights: ['Positioning for the ridge passes'], tips: 'Cold, exposed camp — an early night before the crossing.' },
    { day: 14, title: 'Cross the Sele La ridge to Tseram', from: 'Selele Camp', to: 'Tseram (3,870 m)', distanceKm: '13 km', walkHours: '7–9 hrs', startEle: 4290, endEle: 3870, terrain: 'A sequence of passes ~4,700–4,800 m, then a long descent', stay: 'Basic lodge / camp', meals: 'B/L/D', highlights: ['Sele La / Sinion La / Mirgin La', 'First views into the Yalung valley'], tips: 'The hardest day of the trek — several passes, big descent. Do not cross in fresh snow.' },
    { day: 15, title: 'Tseram to Ramche', from: 'Tseram', to: 'Ramche (4,580 m)', distanceKm: '8 km', walkHours: '4–5 hrs', startEle: 3870, endEle: 4580, terrain: 'Up the Yalung valley past the glacier snout', stay: 'Basic lodge / camp', meals: 'B/L/D', highlights: ['Yalung Glacier', 'Alpine lakes'], tips: 'Short day to acclimatise for Oktang.' },
    { day: 16, title: 'Ramche to Oktang and back', from: 'Ramche', to: 'Oktang (≈ 4,730 m) → Ramche', distanceKm: '10 km round', walkHours: '4–6 hrs', startEle: 4580, endEle: 4580, terrain: 'Moraine trail to the south base camp viewpoint', stay: 'Basic lodge / camp', meals: 'B/L/D', highlights: ['South face of Kanchenjunga from Oktang'], tips: 'Both base camps now done — a real achievement.' },
    { day: 17, title: 'Ramche to Tortong', from: 'Ramche', to: 'Tortong (2,995 m)', distanceKm: '16 km', walkHours: '6–7 hrs', startEle: 4580, endEle: 2995, terrain: 'Long descent back into forest', stay: 'Basic lodge', meals: 'B/L/D', highlights: ['Rhododendron forest'], tips: 'Knees will feel it — poles out.' },
    { day: 18, title: 'Tortong to Yamphudin', from: 'Tortong', to: 'Yamphudin (2,080 m)', distanceKm: '13 km', walkHours: '6–7 hrs', startEle: 2995, endEle: 2080, terrain: 'Forest and a minor pass, then farmland', stay: 'Home-stay', meals: 'B/L/D', highlights: ['Back among villages and fields'], tips: 'The mountains recede behind you.' },
    { day: 19, title: 'Yamphudin to road head, drive toward Taplejung', from: 'Yamphudin', to: 'Taplejung area', distanceKm: 'walk + jeep', walkHours: '3–4 hrs walk + drive', startEle: 2080, endEle: 1820, terrain: 'Trail to the road, then jeep', stay: 'Guesthouse', meals: 'B/L/D', highlights: ['Trek complete'], tips: 'Road conditions dictate the day’s length.' },
    { day: 20, title: 'Drive/fly back to Kathmandu', from: 'Taplejung / Bhadrapur', to: 'Kathmandu', distanceKm: '—', walkHours: 'drive + flight', startEle: 1820, endEle: 1400, terrain: 'Long drive to Bhadrapur, then flight', stay: 'Hotel', meals: 'B', highlights: ['The eastern tea country from the air'], tips: 'Keep a spare day for eastern-Nepal flight and road delays.' }
  ],
  routePoints: [
    { name: 'Ghunsa', elevation: '3,430 m', day: 6, walkTime: '5–6 hrs from Gyabla', stay: 'Lodges + monastery', highlight: 'The Tibetan-Buddhist heart of the trek and a key acclimatisation stop', warning: 'Beyond here, services are basic and seasonal.' },
    { name: 'Kambachen', elevation: '4,145 m', day: 8, walkTime: '5–6 hrs from Ghunsa', stay: 'Basic lodges', highlight: 'Jannu’s north face fills the sky', warning: 'A landslide-prone section on the approach — cross early.' },
    { name: 'Lhonak', elevation: '4,790 m', day: 10, walkTime: '5–6 hrs from Kambachen', stay: 'Basic lodge / camp', highlight: 'Launch point for Pangpema', warning: 'Cold, exposed, few beds — camping backup needed.' },
    { name: 'Pangpema (North Base Camp)', elevation: '≈ 5,140 m', day: 11, walkTime: '3–4 hrs from Lhonak', stay: 'Day visit only', highlight: 'Kanchenjunga’s north face head-on', warning: 'No shelter; turn back if the weather turns.' },
    { name: 'Sele La ridge', elevation: '≈ 4,700–4,800 m', day: 14, walkTime: 'Full day from Selele Camp', stay: 'Passes — no shelter', highlight: 'The link between the two base camps', warning: 'Multiple passes in one day; impassable in fresh snow.' },
    { name: 'Oktang (South Base Camp)', elevation: '≈ 4,730 m', day: 16, walkTime: '2–3 hrs from Ramche', stay: 'Day visit only', highlight: 'The south face and the Yalung Glacier', warning: 'Exposed moraine; weather-dependent.' }
  ],
  permits: [
    { name: 'Kanchenjunga Restricted Area Permit', where: 'Kathmandu, through a licensed operator only', feeNote: 'Per-week fee, set by the government — verify', notes: 'Requires a group of at least two trekkers and a licensed guide; independent trekking is not allowed.' },
    { name: 'Kanchenjunga Conservation Area Permit', where: 'Kathmandu (NTB) or the entry checkpoint', feeNote: 'Fixed area fee — verify', notes: 'Carry passport and photos.' }
  ],
  cost: {
    note: 'A long restricted-area trek with camping support and expensive access — one of the pricier trips in Nepal. Confirm a quote for your dates.',
    tiers: [
      { name: 'Group / lodge-camp mix', rangeUSD: '$2,400–$3,200', includes: ['Licensed guide', 'Restricted-area + conservation permits', 'Domestic flights', 'Lodges / camp', 'All trek meals'] },
      { name: 'Fully supported camping', rangeUSD: '$3,300–$4,400', includes: ['Full camp crew', 'Private departure', 'Kathmandu hotels', 'Porter team'] },
      { name: 'Premium expedition style', rangeUSD: '$5,000+', includes: ['Larger crew and better camp', 'Extra rest days', 'Helicopter contingency', 'Naturalist guide'] }
    ],
    breakdown: [
      { item: 'Restricted-area permit', note: 'Charged per week — the longer the trip, the higher the fee' },
      { item: 'Conservation area permit', note: 'Fixed' },
      { item: 'Access travel', note: 'Kathmandu–Bhadrapur flight + long drives, or a Suketar flight' },
      { item: 'Crew', note: 'Guide, cook, porters — a full team for three weeks' },
      { item: 'Food + fuel', note: 'Much carried in' },
      { item: 'Contingency', note: 'Spare days for eastern-Nepal weather and roads' }
    ],
    independentVsGuided: 'Independent trekking is not permitted. The restricted-area permit is only issued to groups of two or more travelling with a licensed guide through a registered operator.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Bhadrapur', mode: 'Flight (~55 min)', duration: '55 min', note: 'Then a long mountain drive. A direct flight to Suketar (Taplejung) runs sometimes and cuts hours off the approach.' },
      { from: 'Bhadrapur', to: 'Taplejung', mode: 'Jeep / bus', duration: '7–9 hrs', note: 'Winding road through the tea hills; slower in and after rain.' },
      { from: 'Taplejung', to: 'Trailhead', mode: 'Jeep then on foot', duration: '2–4 hrs', note: 'Road head shifts with construction and monsoon damage.' }
    ],
    note: 'Access is the hardest logistics of any trek in this list. Budget two contingency days for flights and roads.'
  },
  equipment: [
    { item: '4-season sleeping bag (≈ −18°C)', need: 'essential', note: 'Camping and cold basic lodges for three weeks.' },
    { item: 'Sleeping mat + liner', need: 'essential', note: 'For every camping night.' },
    { item: 'Full waterproofs + pack cover', need: 'essential', note: 'The east is wet.' },
    { item: 'Trekking poles', need: 'essential', note: 'Huge cumulative descent, especially after the Sele La.' },
    { item: 'Microspikes', need: 'recommended', note: 'For snow on the ridge passes.' },
    { item: 'Satellite messenger', need: 'essential', note: 'You are two weeks from a road with almost no mobile coverage.' },
    { item: 'Water filter + chemical backup', need: 'essential', note: 'Few treated-water points.' }
  ],
  safety: {
    risks: [
      { name: 'Extreme remoteness', note: 'From Ghunsa onward you are days from a road. Evacuation means a helicopter and a weather window, or a multi-day carry.' },
      { name: 'The Sele La ridge', note: 'A long day over several passes with no shelter. Fresh snow or high wind means you do not cross that day.' },
      { name: 'Landslide sections', note: 'The Ghunsa gorge and the Kambachen approach have active slide zones — cross early and quickly.' },
      { name: 'Weather', note: 'Far-eastern Nepal gets more precipitation and less predictable windows than the central Himalaya.' },
      { name: 'Altitude', note: 'Pangpema is 5,140 m and the ridge is near 4,800 m. The three built-in rest days are non-negotiable.' }
    ],
    turnaround: 'On a three-week trek this remote, the itinerary is a plan, not a promise. If the Sele La is out, the trip becomes an out-and-back on one arm. If someone is unwell, the group descends together toward Ghunsa. Reaching both base camps is never worth a forced high crossing.',
    note: 'A satellite messenger is mandatory on this route. Discuss the evacuation plan and insurance limits with your operator before departure — a helicopter from Lhonak or Ramche is a long, costly flight.'
  },
  faq: [
    { q: 'Can I trek to Kanchenjunga Base Camp independently?', a: 'No. It is a restricted area. You must trek with a licensed guide, in a group of at least two, on a special permit arranged through a registered operator.' },
    { q: 'How hard is the Kanchenjunga Base Camp trek?', a: 'It is one of the hardest treks in Nepal — 20 days, around 200 km, remote, with basic accommodation and a demanding ridge crossing between the two base camps.' },
    { q: 'Do I visit one base camp or both?', a: 'The full circuit visits both — Pangpema in the north and Oktang in the south — linked by the Sele La ridge. Shorter versions do just the north or just the south side.' },
    { q: 'How high does the trek go?', a: 'About 5,140 m at Pangpema (North Base Camp). The Sele La ridge passes reach roughly 4,700–4,800 m.' },
    { q: 'How fit and experienced do I need to be?', a: 'Very fit, and ideally with previous remote multi-day trekking at altitude. This is not a first Himalayan trek.' },
    { q: 'When is the best time to go?', a: 'April–May and October–November. Spring brings rhododendron and warmer forest walking; autumn is drier and clearer. The ridge passes are snow-blocked in winter.' },
    { q: 'How do I get to the trailhead?', a: 'Fly Kathmandu–Bhadrapur then drive 7–9 hours to Taplejung, or take an occasional direct flight to Suketar. Then jeep and walk to the trail.' },
    { q: 'What accommodation is there?', a: 'Home-stays and simple lodges in the villages, basic seasonal lodges higher up, and camping on the highest sections. Comfort is minimal throughout.' },
    { q: 'Is there mobile coverage or Wi-Fi?', a: 'Almost none once you are past the lower villages. A satellite messenger is essential.' },
    { q: 'Can I charge devices?', a: 'Rarely, and often only via solar at the lodges that have power. Bring a large power bank and a solar panel.' },
    { q: 'What permits do I need?', a: 'The Kanchenjunga Restricted Area Permit (charged per week) and the Kanchenjunga Conservation Area Permit. Both are arranged by your operator; fees are set by the government — verify current amounts.' },
    { q: 'What is the food like?', a: 'Dal bhat, noodles, potatoes and eggs at the lodges; a cook-prepared menu on camping sections. Variety is limited — carry your own snacks and supplements.' },
    { q: 'What happens if the Sele La is blocked?', a: 'You trek one arm out and back instead of linking both. Your operator should plan the itinerary with this contingency in mind.' },
    { q: 'What if I get altitude sickness?', a: 'You descend toward Ghunsa with the group and either recover and continue on a reduced plan or arrange evacuation. Descent is the treatment; the schedule’s rest days are there to prevent it.' },
    { q: 'Are there ATMs on the route?', a: 'No. Carry all the rupees you need from Kathmandu, in small notes, split across your bags.' },
    { q: 'How many spare days should I budget?', a: 'At least two, mainly for eastern-Nepal flights and roads, plus flexibility for a weather day on the ridge.' },
    { q: 'Will I see wildlife?', a: 'The conservation area holds red panda, blue sheep, Himalayan black bear and, rarely, snow leopard. Sightings are luck, but the forest is alive with birds.' }
  ],
  relatedTreks: ['makalu-base-camp', 'everest-base-camp', 'upper-dolpo', 'limi-valley'],
  relatedDestinations: [
    { name: 'Ilam tea country', note: 'The green tea hills on the drive in — worth a night for the estates and the views to Kanchenjunga.' },
    { name: 'Koshi Tappu Wildlife Reserve', note: 'A birdwatching wetland on the eastern plains, an easy add-on on the way back.' },
    { name: 'Kathmandu — Boudhanath', note: 'The standard staging point before and after.' }
  ],
  hotelsNote: 'Kathmandu hotels either side are included. Eastern towns (Bhadrapur, Taplejung, Ilam) have simple guesthouses; the trail is home-stays, basic lodges and tents. Ask us about an Ilam tea-estate night on the way in.'
};

/* ========================= BAGMATI PROVINCE ========================= */

TREKS['langtang-valley'] = {
  slug: 'langtang-valley',
  popular: true,
  name: 'Langtang Valley Trek',
  tagline: 'The closest high valley to Kathmandu',
  province: 'bagmati',
  region: 'Langtang',
  heroImage: '/images/langtang_real.jpg',
  summary: 'An 8-day trek into a glacier-carved valley a short drive north of Kathmandu, climbing through forest to the Tamang villages of Langtang and Kyanjin Gompa (3,870 m), with an optional dawn climb of Kyanjin Ri or Tserko Ri for a wall of 6,000–7,000 m peaks.',
  stats: {
    duration: '8 days (7 on the trail)',
    difficulty: 'Moderate',
    maxAltitude: '≈ 4,770 m',
    maxAltitudePoint: 'Tserko Ri (optional)',
    bestSeason: 'Mar–May · Oct–Dec',
    startPoint: 'Syabrubesi (1,470 m), 7–8 hr drive from Kathmandu',
    endPoint: 'Syabrubesi',
    distanceKm: '≈ 65 km',
    walkHours: '5–6 hrs/day'
  },
  seo: {
    title: 'Langtang Valley Trek — Nepal | 8-Day Itinerary, Difficulty, Cost & Best Time',
    description: 'A full guide to the Langtang Valley trek near Kathmandu: 8-day itinerary to Kyanjin Gompa, difficulty and altitude, permits, cost, best season, packing and FAQ.'
  },
  overview: [
    'Langtang is the nearest true Himalayan valley to Kathmandu, which makes it the best short trek in the country for anyone without the time or the acclimatisation history for Everest or Annapurna. A long drive north gets you to Syabrubesi, and from there the trail climbs steadily through old-growth forest — langur monkeys, red panda country — into an open glacial valley ringed by Langtang Lirung (7,227 m) and its neighbours.',
    'The valley was hit hard by the 2015 earthquake; the village of Langtang was rebuilt on a new site, and the community has put enormous effort into welcoming trekkers back. Kyanjin Gompa, at the head of the valley, has a monastery, a cheese factory and a cluster of lodges, and serves as a base for day walks and short peak climbs.',
    'It is a moderate trek — no passes, no scrambling — but it does reach nearly 4,000 m for the overnight and higher on the day walks, so a sensible pace still matters.'
  ],
  highlights: [
    'Kyanjin Gompa (3,870 m) — monastery, yak-cheese factory and mountain amphitheatre',
    'Dawn from Kyanjin Ri (4,600 m) or Tserko Ri (4,770 m)',
    'Langtang Lirung’s glaciers hanging above the valley',
    'Langtang National Park forest — one of the best red panda habitats in Nepal',
    'Tamang villages and the story of the valley’s recovery since 2015',
    'A genuine Himalayan trek in a week, close to Kathmandu'
  ],
  suitability: {
    physical: 5, technical: 1, altitude: 5, remoteness: 4,
    walkHours: '5–6 hours a day, with steeper optional peak days',
    terrain: 'Forest trail, then open valley path. Well-defined throughout. The Ri climbs are steep but pathed.',
    weatherExposure: 'Moderate — the valley is somewhat sheltered until Kyanjin.',
    goodFor: [
      'Trekkers with only 8–10 days total',
      'Fit first-timers wanting a real Himalayan valley without extreme altitude',
      'Those who prefer a drive-in start to a mountain flight'
    ],
    notIdeal: [
      'Anyone prone to motion sickness — the road in is long and winding',
      'Trekkers set on crossing a high pass or reaching 5,000 m',
      'People wanting tea-house density and choice on the scale of the Khumbu'
    ]
  },
  why: {
    lead: 'Langtang gives you the Himalaya in a week — and a community worth supporting.',
    paragraphs: [
      'The valley narrows and then opens, and suddenly the whole north wall is ice: Langtang Lirung, Kimshung, Yansa Tsenji, glaciers spilling almost to the trail. Kyanjin Gompa sits in the middle of it, and the walk up Tserko Ri behind the village puts you level with the lower summits at sunrise.',
      'Every rupee spent in the valley matters here. The lodges, the guides, the cheese factory — these are how Langtang rebuilt itself after 2015, and trekkers who come back are part of that story.'
    ],
    gallery: [
      { img: '/images/langtang_real.jpg', caption: 'The Langtang valley opening toward Kyanjin' },
      { img: '/images/hero-mountain.jpg', caption: 'Langtang Lirung at first light' },
      { img: '/images/itinerary.png', caption: 'Forest trail on the climb from Syabrubesi' }
    ]
  },
  passes: [],
  acclimatization: {
    days: [5],
    note: 'A day based at Kyanjin Gompa (3,870 m) — climbing Kyanjin Ri or Tserko Ri and returning to sleep low — is the acclimatisation built into the standard itinerary. It is also the scenic highlight, so it does double duty.'
  },
  itinerary: [
    { day: 1, title: 'Drive Kathmandu to Syabrubesi', from: 'Kathmandu (1,400 m)', to: 'Syabrubesi (1,470 m)', distanceKm: '—', walkHours: '7–8 hr drive', startEle: 1400, endEle: 1470, terrain: 'Mountain highway, rough in sections', stay: 'Guesthouse', meals: 'B/L/D', highlights: ['Trishuli river gorge', 'First views of Ganesh Himal'], tips: 'Leave early; the road is slow. Sit near the front if you get carsick.' },
    { day: 2, title: 'Syabrubesi to Lama Hotel', from: 'Syabrubesi (1,470 m)', to: 'Lama Hotel (2,480 m)', distanceKm: '11 km', walkHours: '5–6 hrs', startEle: 1470, endEle: 2480, terrain: 'River trail then steep forest climb', stay: 'Tea house', meals: 'B/L/D', highlights: ['Langur monkeys', 'Dense oak and rhododendron forest'], tips: 'A long climbing day — settle into a slow rhythm.' },
    { day: 3, title: 'Lama Hotel to Mundu / Langtang', from: 'Lama Hotel (2,480 m)', to: 'Mundu (3,540 m)', distanceKm: '13 km', walkHours: '6 hrs', startEle: 2480, endEle: 3540, terrain: 'Forest, then open valley past the new Langtang village', stay: 'Tea house', meals: 'B/L/D', highlights: ['The rebuilt Langtang village and memorial', 'The valley opens to the peaks'], tips: 'Take time at the 2015 memorial — it matters to the people here.' },
    { day: 4, title: 'Mundu to Kyanjin Gompa', from: 'Mundu (3,540 m)', to: 'Kyanjin Gompa (3,870 m)', distanceKm: '7 km', walkHours: '3–4 hrs', startEle: 3540, endEle: 3870, terrain: 'Gentle valley climb past mani walls', stay: 'Tea house', meals: 'B/L/D', highlights: ['Kyanjin monastery', 'The yak-cheese factory'], tips: 'Short day on purpose — arrive with energy for the afternoon.' },
    { day: 5, title: 'Kyanjin Gompa — Tserko Ri or Kyanjin Ri', from: 'Kyanjin Gompa (3,870 m)', to: 'Kyanjin Gompa (3,870 m)', distanceKm: '8–12 km', walkHours: '5–7 hrs', startEle: 3870, endEle: 3870, terrain: 'Steep climb to 4,600–4,770 m and back', stay: 'Tea house', meals: 'B/L/D', highlights: ['Sunrise over Langtang Lirung', 'Glacier views from the ridge'], tips: 'Pre-dawn start. Turn back at your own ceiling — the view is huge from anywhere on the ridge.' },
    { day: 6, title: 'Kyanjin Gompa to Lama Hotel', from: 'Kyanjin Gompa (3,870 m)', to: 'Lama Hotel (2,480 m)', distanceKm: '20 km', walkHours: '6–7 hrs', startEle: 3870, endEle: 2480, terrain: 'Long valley and forest descent', stay: 'Tea house', meals: 'B/L/D', highlights: ['A last look back up the valley'], tips: 'A big descent — poles help the knees.' },
    { day: 7, title: 'Lama Hotel to Syabrubesi', from: 'Lama Hotel (2,480 m)', to: 'Syabrubesi (1,470 m)', distanceKm: '11 km', walkHours: '5 hrs', startEle: 2480, endEle: 1470, terrain: 'Steep forest descent to the river', stay: 'Guesthouse', meals: 'B/L/D', highlights: ['Back into warm, green forest'], tips: 'Celebrate with the crew tonight.' },
    { day: 8, title: 'Drive Syabrubesi to Kathmandu', from: 'Syabrubesi (1,470 m)', to: 'Kathmandu (1,400 m)', distanceKm: '—', walkHours: '7–8 hr drive', startEle: 1470, endEle: 1400, terrain: 'Mountain highway', stay: 'Hotel', meals: 'B', highlights: ['Terraced hills and river gorges'], tips: 'A long drive back — a good book helps.' }
  ],
  routePoints: [
    { name: 'Syabrubesi', elevation: '1,470 m', day: 1, walkTime: 'Road head', stay: 'Guesthouses', highlight: 'Trailhead and the last shops', warning: 'The drive here is long and winding.' },
    { name: 'Lama Hotel', elevation: '2,480 m', day: 2, walkTime: '5–6 hrs from Syabrubesi', stay: 'Cluster of forest lodges', highlight: 'Deep in prime red panda forest', warning: 'Damp and cold in the trees — nothing dries.' },
    { name: 'Langtang village', elevation: '3,430 m', day: 3, walkTime: '4 hrs from Lama Hotel', stay: 'Rebuilt lodges', highlight: 'The 2015 memorial and the valley’s recovery', warning: 'Weather closes in by afternoon in the open valley.' },
    { name: 'Kyanjin Gompa', elevation: '3,870 m', day: 4, walkTime: '3–4 hrs from Mundu', stay: 'Lodges, monastery, cheese factory', highlight: 'Base for the ridge climbs', warning: 'First night near 3,900 m — take the Ri climb slowly.' },
    { name: 'Tserko Ri', elevation: '4,770 m', day: 5, walkTime: '3–4 hrs up', stay: 'Day visit only', highlight: 'The best viewpoint of the trek', warning: 'Steep, cold and exposed before dawn.' }
  ],
  permits: [
    { name: 'Langtang National Park entry permit', where: 'Kathmandu (NTB) or the Dhunche checkpoint', feeNote: 'Fixed park fee — verify', notes: 'Carry passport and photos.' },
    { name: 'Local area / rural municipality permit', where: 'Issued at the checkpoint on the route', feeNote: 'Local fee — verify', notes: 'Requirements for this region change periodically.' }
  ],
  cost: {
    note: 'One of the better-value Himalayan treks — no flights, short duration. Confirm a quote for your dates.',
    tiers: [
      { name: 'Budget / teahouse', rangeUSD: '$550–$800', includes: ['Group guide', 'Private jeep transfers', 'Permits', 'Tea houses', 'Main meals'] },
      { name: 'Comfort', rangeUSD: '$850–$1,300', includes: ['Private guide + porter', 'Better lodges', 'Kathmandu 4★ either side'] },
      { name: 'Premium', rangeUSD: '$1,600+', includes: ['Private trip', 'Best available lodges', 'Extra day at Kyanjin', 'Helicopter return option'] }
    ],
    breakdown: [
      { item: 'Permits', note: 'National park + local area fee' },
      { item: 'Transport', note: 'Kathmandu–Syabrubesi jeep or bus each way' },
      { item: 'Guide + porter', note: 'Per day' },
      { item: 'Lodging + meals', note: '7 nights, moderate altitude' },
      { item: 'Tips', note: 'Customary at the end' }
    ],
    independentVsGuided: 'The trail is easy to follow, but a guide is recommended — for the altitude, for arranging the jeep, and because guiding work is important income for the recovering valley.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Syabrubesi', mode: 'Private jeep or local bus', duration: '7–8 hrs', note: 'A rough, winding mountain road via Trishuli and Dhunche. A jeep is faster and more comfortable than the bus.' },
      { from: 'Syabrubesi', to: 'Trail', mode: 'On foot', duration: '—', note: '' }
    ],
    note: 'No flights involved — this is a drive-in trek, which is why it works on a short schedule.'
  },
  equipment: [
    { item: 'Sleeping bag to ≈ −10°C', need: 'essential', note: 'Kyanjin nights are cold; forest lodges are damp.' },
    { item: 'Warm jacket + waterproof shell', need: 'essential', note: 'The open valley is windy and afternoons cloud over.' },
    { item: 'Trekking poles', need: 'recommended', note: 'The Day 6 descent is long.' },
    { item: 'Headlamp', need: 'essential', note: 'For the pre-dawn Tserko Ri start.' }
  ],
  safety: {
    risks: [
      { name: 'The road', note: 'The Kathmandu–Syabrubesi road is long, rough and prone to delays and, in monsoon, landslides. It is the least comfortable part of the trip.' },
      { name: 'Altitude', note: 'Modest but real — Kyanjin is 3,870 m and the Ri climbs go to 4,600–4,770 m. Do the Ri on the acclimatisation day, not on arrival.' },
      { name: 'Weather', note: 'The upper valley clouds over most afternoons; snow is possible at Kyanjin from late autumn.' },
      { name: 'Cold, damp forest', note: 'The Lama Hotel section stays wet — pack everything in dry bags.' }
    ],
    turnaround: 'The peak climbs on Day 5 are optional. If you are not feeling strong, enjoy Kyanjin and the valley walks and skip the summit — there is no pass or milestone you have to reach.',
    note: 'A health post operates at Kyanjin Gompa in the main seasons. Helicopter evacuation from the valley is straightforward in clear weather.'
  },
  faq: [
    { q: 'How difficult is the Langtang Valley trek?', a: 'Moderate. There are no passes and no scrambling, but the forest climb on Day 2 is long and the trek reaches nearly 4,000 m for the night, with optional day climbs to 4,600–4,770 m.' },
    { q: 'Is Langtang safe after the 2015 earthquake?', a: 'Yes. The trail and villages were rebuilt years ago, the community actively welcomes trekkers, and tourism is central to the valley’s recovery.' },
    { q: 'How fit do I need to be?', a: 'A reasonable level of hill fitness. If you can walk 5–6 hours on hills for a week, you can do the core trek. The Tserko Ri climb is a harder, optional extra.' },
    { q: 'Can beginners do the Langtang trek?', a: 'Yes — it is one of the best first Himalayan treks: short, drive-in, moderate altitude, tea-house comfort.' },
    { q: 'How do I get to the trailhead?', a: 'A 7–8 hour drive north of Kathmandu to Syabrubesi by private jeep or local bus. No flights.' },
    { q: 'When is the best time to trek Langtang?', a: 'March–May for rhododendron and warmer walking, and October–December for clear skies. It holds up better into early winter than higher treks because the overnight altitude is moderate.' },
    { q: 'How cold does it get?', a: 'Nights at Kyanjin are around −5°C to −10°C in season, colder from December and on the Ri before dawn. Days are often mild in the sun.' },
    { q: 'Do I need a guide and permits?', a: 'Permits, yes — the Langtang National Park permit and a local area permit. A guide is recommended and, under current rules, generally required.' },
    { q: 'Is there Wi-Fi and mobile coverage?', a: 'Mobile coverage reaches parts of the valley; some lodges sell Wi-Fi. Expect patchy service and long gaps.' },
    { q: 'Can I charge my phone?', a: 'Yes, in tea-house dining rooms for a small fee, more expensive at Kyanjin. Bring a power bank.' },
    { q: 'Are there ATMs?', a: 'No — the nearest are in Kathmandu (and unreliably in Dhunche). Carry all your cash from the city.' },
    { q: 'What food is available?', a: 'The standard tea-house menu — dal bhat, noodles, soups, potatoes, eggs, pancakes — plus local yak cheese at Kyanjin.' },
    { q: 'Can I shower?', a: 'Paid hot showers at most lodges up to Langtang village; a bowl of hot water at Kyanjin.' },
    { q: 'Can the trek be extended?', a: 'Yes — you can add the Gosaikunda lakes and cross the Laurebina La to Helambu, turning it into a 12–14 day trip. Decide when you plan the trip.' },
    { q: 'What if I get altitude sickness?', a: 'It is unlikely to be severe at these altitudes, but if it happens you rest at Kyanjin or descend to Langtang village. Do the Ri climbs only when you feel well.' }
  ],
  relatedTreks: ['gosaikunda', 'helambu-circuit', 'tamang-heritage-trail', 'mardi-himal'],
  relatedDestinations: [
    { name: 'Gosaikunda lakes', note: 'A natural 3–4 day extension over the Laurebina La.' },
    { name: 'Kathmandu Valley — Bhaktapur & Patan', note: 'The obvious pre/post base; medieval Newar cities.' },
    { name: 'Chitwan or Nagarkot', note: 'A warm-down after the trek — jungle wildlife or an easy Kathmandu-rim hill station.' }
  ],
  hotelsNote: 'Kathmandu hotels either side are usually included; the trail is tea houses. We can add a night at Nagarkot or extra Kathmandu Valley sightseeing before or after — ask when you plan the trip.'
};

TREKS['gosaikunda'] = {
  slug: 'gosaikunda',
  name: 'Gosaikunda Trek',
  tagline: 'A sacred alpine lake in the hills above Kathmandu',
  province: 'bagmati',
  region: 'Langtang / Gosaikunda',
  heroImage: '/images/hero-mountain.jpg',
  summary: 'A 9-day trek to the sacred lakes of Gosaikunda (4,380 m), an important Hindu and Buddhist pilgrimage site set among 4,000 m ridgelines, usually approached via Dhunche or combined with Langtang or Helambu over the Laurebina La pass.',
  stats: {
    duration: '9 days (7–8 on the trail)',
    difficulty: 'Moderate',
    maxAltitude: '≈ 4,610 m',
    maxAltitudePoint: 'Laurebina La',
    bestSeason: 'Mar–May · Oct–Nov',
    startPoint: 'Dhunche / Syabrubesi (drive from Kathmandu)',
    endPoint: 'Dhunche, or Sundarijal via Helambu',
    distanceKm: '≈ 55–70 km',
    walkHours: '5–7 hrs/day'
  },
  seo: {
    title: 'Gosaikunda Trek — Nepal | Itinerary, Laurebina La, Cost & Best Time',
    description: 'The Gosaikunda lake trek near Kathmandu: itinerary to the sacred lakes and Laurebina La, difficulty and altitude, permits, cost, best season and FAQ.'
  },
  overview: [
    'Gosaikunda is a cluster of glacial lakes at 4,380 m in the Langtang National Park, and one of Nepal’s most significant pilgrimage sites — tens of thousands of pilgrims walk up for the Janai Purnima festival in August. For trekkers the rest of the year it is a quiet, sharp-edged alpine bowl reached in a few days from Kathmandu.',
    'The classic route starts at Dhunche and climbs hard through forest to the ridge village of Sing Gompa (with its cheese factory), then up to the lakes. From Gosaikunda the trail crosses the Laurebina La (≈ 4,610 m) and descends south into the Helambu region and eventually to Sundarijal, on the edge of the Kathmandu Valley — a satisfying point-to-point line rather than an out-and-back.',
    'It packs a real pass and 4,000 m-plus sleeping altitude into a short trip, so acclimatisation and a sensible pace matter more than the modest daily distances suggest.'
  ],
  highlights: [
    'The sacred lakes of Gosaikunda (4,380 m) below Surya Peak',
    'Crossing the Laurebina La (≈ 4,610 m) into Helambu',
    'The ridge panorama from Sing Gompa and Laurebina — Langtang, Ganesh and Manaslu ranges',
    'Sing Gompa’s monastery and cheese factory',
    'A point-to-point route finishing on the rim of the Kathmandu Valley',
    'Combines naturally with Langtang or Helambu'
  ],
  suitability: {
    physical: 6, technical: 1, altitude: 6, remoteness: 4,
    walkHours: '5–7 hours a day, one long pass day',
    terrain: 'Steep forest climbs, open ridge, a rocky pass, then a long descent. No scrambling.',
    weatherExposure: 'Moderate to high on the Laurebina La — snow lingers there into spring.',
    goodFor: [
      'Trekkers wanting a short route with a genuine high pass',
      'Anyone interested in living pilgrimage culture',
      'Those who like a point-to-point line over an out-and-back'
    ],
    notIdeal: [
      'Complete beginners with no hill-walking base — the climbs are steep',
      'Trekkers uneasy about a snowy pass in shoulder season',
      'Anyone wanting the festival crowds avoided who books for August'
    ]
  },
  why: {
    lead: 'A high pass, a sacred lake and a finish on the doorstep of Kathmandu — in nine days.',
    paragraphs: [
      'Gosaikunda earns its altitude quickly. The lakes sit in a bare granite bowl, half-frozen for much of the year, with a small temple on the shore and prayer flags snapping in the wind. Cross the Laurebina La the next morning and you swap the Langtang side for the green terraced ridges of Helambu, walking down through Sherpa and Tamang villages toward the valley.',
      'It is one of the few treks that both starts and finishes within a short drive of Kathmandu, which makes it a superb option when time is tight.'
    ],
    gallery: [
      { img: '/images/hero-mountain.jpg', caption: 'The Gosaikunda lakes in early season ice' },
      { img: '/images/langtang_real.jpg', caption: 'Ridge walking toward Laurebina' },
      { img: '/images/itinerary.png', caption: 'Forest on the climb from Dhunche' }
    ]
  },
  passes: [{ name: 'Laurebina La', elevation: '≈ 4,610 m', day: 5 }],
  acclimatization: {
    days: [4],
    note: 'A night at Sing Gompa / Chandanbari (≈ 3,330 m) and, ideally, a short acclimatisation walk before pushing to the lakes keeps the ascent within safe limits. Crossing the Laurebina La the morning after sleeping at Gosaikunda is the section most likely to bite an under-acclimatised trekker.'
  },
  itinerary: [
    { day: 1, title: 'Drive Kathmandu to Dhunche', from: 'Kathmandu (1,400 m)', to: 'Dhunche (1,960 m)', distanceKm: '—', walkHours: '6–7 hr drive', startEle: 1400, endEle: 1960, terrain: 'Mountain road', stay: 'Guesthouse', meals: 'B/L/D', highlights: ['Trishuli gorge'], tips: 'Leave early.' },
    { day: 2, title: 'Dhunche to Sing Gompa', from: 'Dhunche (1,960 m)', to: 'Sing Gompa (3,330 m)', distanceKm: '10 km', walkHours: '5–6 hrs', startEle: 1960, endEle: 3330, terrain: 'Steep forest climb', stay: 'Tea house', meals: 'B/L/D', highlights: ['Cheese factory and monastery', 'Ridge views open up'], tips: '1,400 m of ascent — pace it hard.' },
    { day: 3, title: 'Sing Gompa — acclimatisation / short day to Lauribina', from: 'Sing Gompa (3,330 m)', to: 'Lauribina (3,910 m)', distanceKm: '7 km', walkHours: '4–5 hrs', startEle: 3330, endEle: 3910, terrain: 'Open ridge climb', stay: 'Tea house', meals: 'B/L/D', highlights: ['Manaslu and Ganesh Himal on the skyline'], tips: 'A short day by design to aid acclimatisation.' },
    { day: 4, title: 'Lauribina to Gosaikunda', from: 'Lauribina (3,910 m)', to: 'Gosaikunda (4,380 m)', distanceKm: '4 km', walkHours: '3–4 hrs', startEle: 3910, endEle: 4380, terrain: 'Rocky ridge past smaller lakes', stay: 'Basic lodge', meals: 'B/L/D', highlights: ['The sacred lakes and shore temple'], tips: 'Arrive with time to rest before the pass day.' },
    { day: 5, title: 'Cross the Laurebina La to Ghopte / Phedi', from: 'Gosaikunda (4,380 m)', to: 'Ghopte (3,430 m)', distanceKm: '12 km', walkHours: '6–7 hrs', startEle: 4380, endEle: 3430, terrain: 'Climb to the pass, then a long rocky descent', stay: 'Basic lodge', meals: 'B/L/D', highlights: ['Laurebina La (≈ 4,610 m)', 'Into the Helambu side'], tips: 'The hardest day — early start, do not cross in fresh snow.' },
    { day: 6, title: 'Ghopte to Kutumsang', from: 'Ghopte (3,430 m)', to: 'Kutumsang (2,470 m)', distanceKm: '13 km', walkHours: '6 hrs', startEle: 3430, endEle: 2470, terrain: 'Forest ridge, ups and downs', stay: 'Tea house', meals: 'B/L/D', highlights: ['Tharepati ridge', 'Back among villages'], tips: 'Undulating — more climbing than the profile suggests.' },
    { day: 7, title: 'Kutumsang to Chisapani', from: 'Kutumsang (2,470 m)', to: 'Chisapani (2,140 m)', distanceKm: '14 km', walkHours: '5–6 hrs', startEle: 2470, endEle: 2140, terrain: 'Ridge trail through Tamang villages', stay: 'Tea house', meals: 'B/L/D', highlights: ['Sunset over the Kathmandu Valley rim'], tips: 'An easier, scenic ridge day.' },
    { day: 8, title: 'Chisapani to Sundarijal, drive to Kathmandu', from: 'Chisapani (2,140 m)', to: 'Kathmandu (1,400 m)', distanceKm: '12 km walk + drive', walkHours: '4 hrs + 1 hr drive', startEle: 2140, endEle: 1400, terrain: 'Descent through Shivapuri National Park', stay: 'Hotel', meals: 'B/L', highlights: ['Shivapuri forest', 'Back in the city by afternoon'], tips: 'Passport needed for the Shivapuri park gate.' },
    { day: 9, title: 'Contingency / departure day', from: 'Kathmandu', to: 'Kathmandu', distanceKm: '—', walkHours: '—', startEle: 1400, endEle: 1400, terrain: '—', stay: 'Hotel', meals: 'B', highlights: ['Spare day for weather on the pass'], tips: 'Good for Kathmandu sightseeing if unused.' }
  ],
  routePoints: [
    { name: 'Sing Gompa (Chandanbari)', elevation: '3,330 m', day: 2, walkTime: '5–6 hrs from Dhunche', stay: 'Lodges, monastery, cheese factory', highlight: 'The acclimatisation stop', warning: '1,400 m climb to get here — do not rush it.' },
    { name: 'Lauribina', elevation: '3,910 m', day: 3, walkTime: '4–5 hrs from Sing Gompa', stay: 'A few lodges', highlight: 'Ridge panorama of Manaslu and Ganesh Himal', warning: 'Exposed and cold; limited beds.' },
    { name: 'Gosaikunda', elevation: '4,380 m', day: 4, walkTime: '3–4 hrs from Lauribina', stay: 'Basic lakeside lodges', highlight: 'The sacred lakes and temple', warning: 'Basic, cold lodges; a rough night at this altitude.' },
    { name: 'Laurebina La', elevation: '≈ 4,610 m', day: 5, walkTime: '2–3 hrs from Gosaikunda', stay: 'Pass — no shelter', highlight: 'The gateway into Helambu', warning: 'Snow-covered into spring; not crossed in poor weather.' }
  ],
  permits: [
    { name: 'Langtang National Park entry permit', where: 'Kathmandu (NTB) or Dhunche checkpoint', feeNote: 'Fixed park fee — verify', notes: 'Same as Langtang.' },
    { name: 'Shivapuri Nagarjun National Park permit', where: 'Sundarijal gate (for the finish)', feeNote: 'Small park fee — verify', notes: 'Only if you exit via Sundarijal.' },
    { name: 'Local area / rural municipality permit', where: 'On the route', feeNote: 'Local fee — verify', notes: 'Requirements change.' }
  ],
  cost: {
    note: 'A short, drive-in/drive-out trip — good value. Confirm a quote for your dates.',
    tiers: [
      { name: 'Budget / teahouse', rangeUSD: '$600–$850', includes: ['Group guide', 'Jeep transfers', 'Permits', 'Tea houses', 'Main meals'] },
      { name: 'Comfort', rangeUSD: '$900–$1,300', includes: ['Private guide + porter', 'Better lodges where they exist', 'Kathmandu 4★'] },
      { name: 'Premium', rangeUSD: '$1,600+', includes: ['Private trip', 'Extra acclimatisation day', 'Best available lodges'] }
    ],
    breakdown: [
      { item: 'Permits', note: 'National park + local + (Shivapuri if finishing at Sundarijal)' },
      { item: 'Transport', note: 'Jeep to Dhunche; short transfer from Sundarijal' },
      { item: 'Guide + porter', note: 'Per day' },
      { item: 'Lodging + meals', note: 'Basic and cold at the lakes' },
      { item: 'Tips', note: 'Customary at the end' }
    ],
    independentVsGuided: 'A guide is recommended — the Laurebina La needs a weather judgement call, the lakeside lodges are few, and the route-finding on the Helambu descent is not always obvious.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Dhunche', mode: 'Private jeep or bus', duration: '6–7 hrs', note: 'Same road as Langtang, one stop earlier.' },
      { from: 'Sundarijal', to: 'Kathmandu', mode: 'Taxi / private car', duration: '45–60 min', note: 'The Helambu finish drops you on the Kathmandu Valley rim.' }
    ],
    note: 'Point-to-point — you do not return to the start, which keeps the trek efficient.'
  },
  equipment: [
    { item: 'Sleeping bag to ≈ −12°C', need: 'essential', note: 'The lakeside lodges are cold and basic.' },
    { item: 'Microspikes', need: 'recommended', note: 'For snow on the Laurebina La, especially Mar–Apr and Nov onward.' },
    { item: 'Trekking poles', need: 'essential', note: 'Steep climbs and a very long descent.' },
    { item: 'Down jacket', need: 'recommended', note: 'For the pass morning and the lake.' }
  ],
  safety: {
    risks: [
      { name: 'The Laurebina La', note: 'A real pass at ~4,610 m with snow much of the year. Your guide will not cross in fresh snow or a storm — be ready for a weather day.' },
      { name: 'Fast altitude gain', note: 'Dhunche to Gosaikunda is a lot of height in three days. The short Day 3 is deliberate; do not compress the schedule.' },
      { name: 'Basic accommodation at the lakes', note: 'Cold, simple lodges with limited food — a poor place to be unwell.' },
      { name: 'The Helambu descent', note: 'Long, rocky and tiring after the pass, with a couple of confusing junctions.' }
    ],
    turnaround: 'If weather or snow shuts the Laurebina La, the trek reverts to an out-and-back — return to Dhunche the way you came. The lakes are the goal; the pass is a bonus that depends on conditions.',
    note: 'Helicopter evacuation from Gosaikunda or Lauribina is feasible in clear weather. Carry a means of contact — coverage exists in patches on this route.'
  },
  faq: [
    { q: 'How hard is the Gosaikunda trek?', a: 'Moderate but front-loaded — a 1,400 m climbing day from Dhunche, fast altitude gain to 4,380 m, and a 4,610 m pass. It is harder than the daily distances suggest.' },
    { q: 'Do I have to cross the Laurebina La?', a: 'No. Many trekkers go up to the lakes from Dhunche and return the same way. The pass into Helambu depends on snow and weather.' },
    { q: 'How high is Gosaikunda?', a: 'The main lake is 4,380 m; the Laurebina La is about 4,610 m.' },
    { q: 'Can I combine it with Langtang or Helambu?', a: 'Yes — both are natural extensions. Langtang + Gosaikunda is about 12–14 days; Gosaikunda + Helambu is the standard point-to-point version.' },
    { q: 'When is the best time to go?', a: 'March–May and October–November. The pass is snowbound in winter; the lakes are busy with pilgrims during Janai Purnima in August.' },
    { q: 'How fit do I need to be?', a: 'A solid hill-walking base. The steep climbs and the altitude are the challenge, not technical difficulty.' },
    { q: 'Do I need a guide and permits?', a: 'Permits, yes — Langtang National Park plus a local permit (and Shivapuri if you finish at Sundarijal). A guide is recommended and generally required under current rules.' },
    { q: 'Is there mobile coverage?', a: 'Patchy. Some signal around Dhunche, Sing Gompa and on the ridges; long gaps elsewhere.' },
    { q: 'Can I charge devices?', a: 'Yes, for a fee at the lodges up to Sing Gompa; more limited and pricier at the lakes. Bring a power bank.' },
    { q: 'What is the accommodation like at the lakes?', a: 'Basic — a handful of simple stone lodges, cold at night, with a limited menu. Comfortable lodging is lower down at Sing Gompa.' },
    { q: 'Are there ATMs?', a: 'No. Carry cash from Kathmandu.' },
    { q: 'What if I get altitude sickness?', a: 'Descend toward Sing Gompa, which is low enough to recover. Do the pass only if you are well; otherwise return via Dhunche.' },
    { q: 'How many spare days should I allow?', a: 'One, mainly for a weather day on the Laurebina La.' }
  ],
  relatedTreks: ['langtang-valley', 'helambu-circuit', 'tamang-heritage-trail', 'mardi-himal'],
  relatedDestinations: [
    { name: 'Helambu', note: 'The green Sherpa ridge country the trek descends into — extend a couple of days.' },
    { name: 'Langtang Valley', note: 'Combine for a fuller Langtang-region trip.' },
    { name: 'Kathmandu Valley', note: 'The trek finishes on its rim — easy to add temple sightseeing.' }
  ],
  hotelsNote: 'Kathmandu hotels either side are usually included; the trail is tea houses and, at the lakes, basic stone lodges. Ask us about combining with Langtang or Helambu.'
};

TREKS['helambu-circuit'] = {
  slug: 'helambu-circuit',
  name: 'Helambu Circuit Trek',
  tagline: 'Sherpa ridge villages a day from Kathmandu',
  province: 'bagmati',
  region: 'Helambu',
  heroImage: '/images/itinerary.png',
  summary: 'A gentle 7-day loop through the Sherpa and Hyolmo villages of the Helambu region on the northern rim of the Kathmandu Valley — low altitude, forest ridges, monasteries and mountain views, with a start and finish within an hour of the city.',
  stats: {
    duration: '7 days (5–6 on the trail)',
    difficulty: 'Easy to Moderate',
    maxAltitude: '≈ 3,650 m',
    maxAltitudePoint: 'Tharepati',
    bestSeason: 'Oct–May (year-round possible)',
    startPoint: 'Sundarijal (1,460 m), 1 hr from Kathmandu',
    endPoint: 'Melamchi Pul / Timbu, drive to Kathmandu',
    distanceKm: '≈ 55 km',
    walkHours: '4–6 hrs/day'
  },
  seo: {
    title: 'Helambu Circuit Trek — Nepal | Short Easy Trek near Kathmandu, Itinerary & Cost',
    description: 'The Helambu Circuit: an easy, low-altitude trek through Sherpa and Hyolmo villages near Kathmandu. Itinerary, difficulty, cost, best time and FAQ.'
  },
  overview: [
    'Helambu is the trekking region closest to Kathmandu that still feels genuinely mountain. The circuit stays mostly between 1,500 m and 3,600 m, so there is little altitude risk, and it can be walked comfortably in a week — or shortened to four or five days.',
    'From Sundarijal, on the Kathmandu Valley rim, the trail climbs through the Shivapuri forest and along ridgelines to the villages of Chisapani, Kutumsang and Tharepati, then loops down into the Melamchi valley through Tarke Ghyang and Sermathang — old Hyolmo (Helambu Sherpa) settlements with hillside monasteries, apple orchards and a distinctive Tibetan-influenced culture.',
    'It suits families, older trekkers, people acclimatising for a bigger trek, and anyone who wants forest, villages and mountain views without a demanding schedule.'
  ],
  highlights: [
    'Hyolmo Sherpa villages — Tarke Ghyang, Sermathang, Melamchi Ghyang — and their monasteries',
    'Ridge views of Langtang, Dorje Lakpa, Ganesh and, on clear days, the Everest range far east',
    'Shivapuri Nagarjun National Park forest at the start',
    'Apple orchards, cheese and Hyolmo weaving',
    'Very low altitude risk — a good acclimatisation or warm-up trek',
    'Start and finish within an hour or two of Kathmandu'
  ],
  suitability: {
    physical: 4, technical: 1, altitude: 3, remoteness: 3,
    walkHours: '4–6 hours a day on ridge and village trails',
    terrain: 'Forest paths, stone village steps, rolling ridgelines. Nothing steep or exposed for long.',
    weatherExposure: 'Low — you are rarely far from a village.',
    goodFor: [
      'Families, older trekkers and first-timers',
      'Trekkers with only 4–7 days',
      'Anyone wanting a gentle warm-up or a cultural trek over a high-altitude one'
    ],
    notIdeal: [
      'Trekkers seeking a high pass, a glacier or a 4,000 m-plus milestone',
      'Those wanting deep wilderness — this is lived-in ridge country'
    ]
  },
  why: {
    lead: 'The mountains start closer to Kathmandu than most visitors realise.',
    paragraphs: [
      'Helambu is a working landscape of terraced ridges, buckwheat fields and cardamom, with the big Langtang peaks lined up along the northern horizon. The Hyolmo villages have their own language, their own weaving and a string of quiet gompas where you are as likely to be offered tea as asked for a donation.',
      'Because it stays low, the trek is a genuine year-round option, and it is one of the few Nepal treks where a family with younger children can take part without worrying about altitude.'
    ],
    gallery: [
      { img: '/images/itinerary.png', caption: 'Ridge trail through the Helambu forest' },
      { img: '/images/langtang_real.jpg', caption: 'The Langtang skyline from a Helambu ridge' },
      { img: '/images/footer.png', caption: 'A Hyolmo village and its monastery' }
    ]
  },
  passes: [],
  acclimatization: { days: [], note: 'With a maximum sleeping altitude around 3,500 m, formal acclimatisation days are not needed. The trek is itself a good acclimatisation warm-up for a higher route afterwards.' },
  itinerary: [
    { day: 1, title: 'Drive to Sundarijal, trek to Chisapani', from: 'Kathmandu (1,400 m)', to: 'Chisapani (2,140 m)', distanceKm: '9 km', walkHours: '4 hrs', startEle: 1400, endEle: 2140, terrain: 'Forest climb through Shivapuri National Park', stay: 'Tea house', meals: 'B/L/D', highlights: ['Sunset over the Himalayan skyline'], tips: 'Passport needed at the park gate.' },
    { day: 2, title: 'Chisapani to Kutumsang', from: 'Chisapani (2,140 m)', to: 'Kutumsang (2,470 m)', distanceKm: '14 km', walkHours: '5–6 hrs', startEle: 2140, endEle: 2470, terrain: 'Rolling ridge through Tamang villages', stay: 'Tea house', meals: 'B/L/D', highlights: ['Village life on the ridge'], tips: 'More up and down than the net gain suggests.' },
    { day: 3, title: 'Kutumsang to Tharepati', from: 'Kutumsang (2,470 m)', to: 'Tharepati (3,650 m)', distanceKm: '13 km', walkHours: '6 hrs', startEle: 2470, endEle: 3650, terrain: 'Forest ridge climb to the high point', stay: 'Tea house', meals: 'B/L/D', highlights: ['Big mountain panorama from the ridge'], tips: 'The highest and longest climb of the trek.' },
    { day: 4, title: 'Tharepati to Tarke Ghyang', from: 'Tharepati (3,650 m)', to: 'Tarke Ghyang (2,600 m)', distanceKm: '13 km', walkHours: '6 hrs', startEle: 3650, endEle: 2600, terrain: 'Long descent into the Melamchi valley', stay: 'Tea house / home-stay', meals: 'B/L/D', highlights: ['Tarke Ghyang monastery', 'Entering Hyolmo country'], tips: 'A big descent — poles help.' },
    { day: 5, title: 'Tarke Ghyang to Sermathang', from: 'Tarke Ghyang (2,600 m)', to: 'Sermathang (2,620 m)', distanceKm: '11 km', walkHours: '4–5 hrs', startEle: 2600, endEle: 2620, terrain: 'Gentle forest and village traverse', stay: 'Tea house / home-stay', meals: 'B/L/D', highlights: ['Apple orchards', 'Sermathang monastery'], tips: 'An easy, pretty day.' },
    { day: 6, title: 'Sermathang to Melamchi Pul, drive to Kathmandu', from: 'Sermathang (2,620 m)', to: 'Kathmandu (1,400 m)', distanceKm: '14 km walk + drive', walkHours: '4 hrs + 3 hr drive', startEle: 2620, endEle: 1400, terrain: 'Descent to the valley floor, then road', stay: 'Hotel', meals: 'B/L', highlights: ['Back in the city by evening'], tips: 'Road conditions vary in the Melamchi valley.' },
    { day: 7, title: 'Departure / contingency day', from: 'Kathmandu', to: 'Kathmandu', distanceKm: '—', walkHours: '—', startEle: 1400, endEle: 1400, terrain: '—', stay: 'Hotel', meals: 'B', highlights: ['Spare day / sightseeing'], tips: 'Ideal for the Kathmandu Valley temples.' }
  ],
  routePoints: [
    { name: 'Chisapani', elevation: '2,140 m', day: 1, walkTime: '4 hrs from Sundarijal', stay: 'Ridge lodges', highlight: 'First-night Himalayan sunset', warning: 'Can be cold and windy on the exposed ridge.' },
    { name: 'Tharepati', elevation: '3,650 m', day: 3, walkTime: '6 hrs from Kutumsang', stay: 'A few ridge lodges', highlight: 'The trek’s high point and best panorama', warning: 'The one section where a mild headache is possible.' },
    { name: 'Tarke Ghyang', elevation: '2,600 m', day: 4, walkTime: '6 hrs from Tharepati', stay: 'Lodges and home-stays', highlight: 'The cultural heart of Hyolmo Helambu', warning: '—' },
    { name: 'Sermathang', elevation: '2,620 m', day: 5, walkTime: '4–5 hrs from Tarke Ghyang', stay: 'Lodges and home-stays', highlight: 'Orchards, weaving and a hilltop monastery', warning: '—' }
  ],
  permits: [
    { name: 'Shivapuri Nagarjun National Park permit', where: 'Sundarijal gate', feeNote: 'Small park fee — verify', notes: 'For the first day through the park.' },
    { name: 'Local area / rural municipality permit', where: 'On the route', feeNote: 'Local fee — verify', notes: 'Langtang National Park permit is required if you extend toward Gosaikunda.' }
  ],
  cost: {
    note: 'The most affordable multi-day trek in this directory — short, low, no flights. Confirm a quote for your dates.',
    tiers: [
      { name: 'Budget / teahouse', rangeUSD: '$400–$650', includes: ['Group guide', 'Transfers', 'Permits', 'Tea houses / home-stays', 'Main meals'] },
      { name: 'Comfort', rangeUSD: '$700–$1,000', includes: ['Private guide + porter', 'Best available village lodging', 'Kathmandu 4★'] },
      { name: 'Premium', rangeUSD: '$1,200+', includes: ['Private trip', 'Home-stay cultural focus', 'Extra Kathmandu Valley touring'] }
    ],
    breakdown: [
      { item: 'Permits', note: 'Shivapuri park + local fee' },
      { item: 'Transport', note: 'Short transfers at each end' },
      { item: 'Guide + porter', note: 'Per day' },
      { item: 'Lodging + meals', note: '5–6 nights, low altitude, inexpensive' },
      { item: 'Tips', note: 'Customary at the end' }
    ],
    independentVsGuided: 'Helambu can be walked independently by confident hikers, but a guide adds the Hyolmo cultural context that is the point of the trek, and current rules generally require one.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Sundarijal', mode: 'Taxi / private car', duration: '45–60 min', note: 'On the Kathmandu Valley rim.' },
      { from: 'Melamchi Pul / Timbu', to: 'Kathmandu', mode: 'Jeep / bus', duration: '2.5–3.5 hrs', note: 'Via the Melamchi valley road.' }
    ],
    note: 'One of very few Nepal treks with no domestic flight and only short road transfers.'
  },
  equipment: [
    { item: 'Sleeping bag to ≈ −5°C to −8°C', need: 'essential', note: 'Only Tharepati is genuinely cold.' },
    { item: 'Light waterproof shell', need: 'essential', note: 'Afternoon showers on the ridges.' },
    { item: 'Trekking poles', need: 'recommended', note: 'For the descent off Tharepati.' },
    { item: 'Warm layer + hat', need: 'recommended', note: 'For the exposed ridge evenings.' }
  ],
  safety: {
    risks: [
      { name: 'Trail junctions', note: 'The ridge and village network has several unmarked forks — the main reason a guide is useful here.' },
      { name: 'Weather', note: 'Ridge afternoons cloud over and can turn wet and cold quickly, even in the dry seasons.' },
      { name: 'Mild altitude', note: 'Only around Tharepati (3,650 m), and only for one night — a mild headache is the worst most people feel.' },
      { name: 'Dogs and livestock', note: 'Village dogs can be territorial — your guide will manage this.' }
    ],
    turnaround: 'There is very little to turn around from. If the weather is poor on the Tharepati ridge, the route can be shortened to a Chisapani–Nagarkot loop or a direct Tarke Ghyang out-and-back.',
    note: 'You are never more than a few hours from a road on this trek, which makes it one of the lowest-risk options in Nepal.'
  },
  faq: [
    { q: 'Is the Helambu Circuit easy?', a: 'It is one of the easier multi-day treks in Nepal — low altitude, moderate days, tea-house comfort. There are still real climbs, particularly to Tharepati.' },
    { q: 'Is it good for families?', a: 'Yes. The low altitude and short days make it one of the best options in Nepal for fit families with children.' },
    { q: 'How high does it go?', a: 'About 3,650 m at Tharepati, for a single night. Everywhere else is below 2,700 m.' },
    { q: 'Can I do a shorter version?', a: 'Yes — a 3–4 day Sundarijal–Chisapani–Tarke Ghyang–Melamchi loop, or a simple Sermathang out-and-back, both work.' },
    { q: 'When can I trek Helambu?', a: 'October to May is best; because it stays low it is one of the few treks that also works in winter, and even parts of the monsoon.' },
    { q: 'Do I need a guide and permits?', a: 'A Shivapuri National Park permit and a local permit are required. A guide is recommended (route-finding, culture) and generally required under current rules.' },
    { q: 'Is there mobile coverage and Wi-Fi?', a: 'Reasonable by trekking standards — coverage in most villages, Wi-Fi in some lodges.' },
    { q: 'Can I charge my phone?', a: 'Yes, easily, at every overnight stop.' },
    { q: 'What is the accommodation like?', a: 'Simple tea houses and village home-stays — clean and friendly, with fewer trekkers than the big routes.' },
    { q: 'Are there ATMs?', a: 'No. Carry cash from Kathmandu, though daily costs here are low.' },
    { q: 'Can it be combined with other treks?', a: 'Yes — it links to Gosaikunda over the Laurebina La and to Langtang, turning it into a longer regional trip.' },
    { q: 'Will I see the big mountains?', a: 'Yes, on clear days — Langtang, Dorje Lakpa and Ganesh Himal along the ridge, with the Everest group visible far to the east from Tharepati.' }
  ],
  relatedTreks: ['gosaikunda', 'langtang-valley', 'tamang-heritage-trail', 'everest-view-trek'],
  relatedDestinations: [
    { name: 'Nagarkot', note: 'A Kathmandu-rim hill station with a sunrise Himalaya view — an easy add-on.' },
    { name: 'Gosaikunda', note: 'Reachable over the Laurebina La for a longer trip.' },
    { name: 'Bhaktapur', note: 'The best-preserved medieval city in the valley, near the Helambu road.' }
  ],
  hotelsNote: 'Kathmandu hotels either side are usually included; the trail is tea houses and home-stays. A Nagarkot night pairs naturally with this trek — ask us.'
};

TREKS['tamang-heritage-trail'] = {
  slug: 'tamang-heritage-trail',
  name: 'Tamang Heritage Trail Trek',
  tagline: 'Tamang villages, hot springs and a border viewpoint',
  province: 'bagmati',
  region: 'Langtang (Tamang Heritage)',
  heroImage: '/images/footer.png',
  summary: 'A 9-day cultural trek through the Tamang villages north-west of Syabrubesi — Gatlang, Tatopani, Nagthali, Briddim — with hot springs, home-stays, a Tibet-border viewpoint at Nagthali (3,165 m) and an optional link into the Langtang valley.',
  stats: {
    duration: '9 days (6–7 on the trail)',
    difficulty: 'Moderate',
    maxAltitude: '≈ 3,700 m',
    maxAltitudePoint: 'Taruche / Nagthali ridge',
    bestSeason: 'Oct–May',
    startPoint: 'Syabrubesi (1,470 m), drive from Kathmandu',
    endPoint: 'Syabrubesi (or continue into Langtang)',
    distanceKm: '≈ 45–60 km',
    walkHours: '4–6 hrs/day'
  },
  seo: {
    title: 'Tamang Heritage Trail Trek — Nepal | Cultural Trek Itinerary, Cost & Best Time',
    description: 'The Tamang Heritage Trail near Langtang: a cultural home-stay trek through Tamang villages with hot springs and Tibet-border views. Itinerary, cost, best time and FAQ.'
  },
  overview: [
    'The Tamang Heritage Trail was developed as a community tourism project to spread trekking income into the villages west of the main Langtang route. It is a lower-altitude, culture-first trek: the accommodation is largely home-stays, the walking days are short, and the interest is in Tamang life — a Tibetan-Buddhist people with their own language, dress, dance and architecture — rather than in reaching a high point.',
    'From Syabrubesi the loop runs through Gatlang, with its lake and Tamang monastery, to the hot springs at Tatopani, up to the ridge viewpoint of Nagthali looking into Tibet, and back through Briddim, a village known for its organised home-stay system. It can be walked on its own in under a week or bolted onto the Langtang valley trek for a fuller regional trip.',
    'The altitude stays under 3,700 m, so it carries little AMS risk and works across a long season, including much of winter.'
  ],
  highlights: [
    'Home-stays in Tamang villages — Gatlang, Briddim, Tatopani',
    'The natural hot springs at Tatopani after a day’s walk',
    'The Nagthali ridge (≈ 3,165 m) with views into Tibet and across to Langtang and Ganesh Himal',
    'Gatlang’s hilltop monastery and sacred Parvati Kunda lake',
    'Tamang dance, dress and daily life, largely undiluted by tourism',
    'Low altitude — an easy season and a gentle profile'
  ],
  suitability: {
    physical: 4, technical: 1, altitude: 3, remoteness: 4,
    walkHours: '4–6 hours a day',
    terrain: 'Village trails, forest paths and one ridge climb. Straightforward underfoot.',
    weatherExposure: 'Low — the route stays among villages and forest.',
    goodFor: [
      'Trekkers who want cultural depth over altitude',
      'Families and older walkers',
      'Anyone wanting a gentle add-on to a Langtang trek'
    ],
    notIdeal: [
      'Trekkers whose goal is a summit, pass or big-mountain base camp',
      'Anyone uncomfortable with basic home-stay conditions (shared rooms, squat toilets)'
    ]
  },
  why: {
    lead: 'This is the trek where the villages are the destination, not the scenery between camps.',
    paragraphs: [
      'Staying in a Tamang home-stay — eating in the kitchen, watching the buckwheat being threshed, being pulled into a dance in the evening — is a different kind of trekking. The Nagthali ridge gives you the mountain view, and the hot springs at Tatopani give you the reward, but the point of the trail is the time spent in Gatlang and Briddim.',
      'It also does real good: the home-stay income is shared through village committees, and the trail exists specifically to keep young people from having to leave.'
    ],
    gallery: [
      { img: '/images/footer.png', caption: 'A Tamang village on the heritage trail' },
      { img: '/images/langtang_real.jpg', caption: 'The Langtang skyline from Nagthali' },
      { img: '/images/itinerary.png', caption: 'Forest path between villages' }
    ]
  },
  passes: [],
  acclimatization: { days: [], note: 'With nothing above about 3,700 m and only for a day walk, acclimatisation days are not required. The trail is a good warm-up if you plan to continue into the Langtang valley.' },
  itinerary: [
    { day: 1, title: 'Drive Kathmandu to Syabrubesi', from: 'Kathmandu (1,400 m)', to: 'Syabrubesi (1,470 m)', distanceKm: '—', walkHours: '7–8 hr drive', startEle: 1400, endEle: 1470, terrain: 'Mountain road', stay: 'Guesthouse', meals: 'B/L/D', highlights: ['Trishuli gorge'], tips: 'Leave early.' },
    { day: 2, title: 'Syabrubesi to Gatlang', from: 'Syabrubesi (1,470 m)', to: 'Gatlang (2,240 m)', distanceKm: '10 km', walkHours: '5–6 hrs', startEle: 1470, endEle: 2240, terrain: 'Climb over the Bahun Danda ridge', stay: 'Home-stay', meals: 'B/L/D', highlights: ['Gatlang monastery and Parvati Kunda lake'], tips: 'A steady climbing day into the first village.' },
    { day: 3, title: 'Gatlang to Tatopani', from: 'Gatlang (2,240 m)', to: 'Tatopani (2,610 m)', distanceKm: '12 km', walkHours: '5–6 hrs', startEle: 2240, endEle: 2610, terrain: 'Descend to the Bhote Koshi, then climb', stay: 'Home-stay', meals: 'B/L/D', highlights: ['Natural hot springs'], tips: 'Bring a quick-dry towel for the springs.' },
    { day: 4, title: 'Tatopani to Nagthali, on to Thuman', from: 'Tatopani (2,610 m)', to: 'Thuman (2,340 m)', distanceKm: '10 km', walkHours: '5–6 hrs', startEle: 2610, endEle: 2340, terrain: 'Climb to the Nagthali ridge, then descend', stay: 'Home-stay', meals: 'B/L/D', highlights: ['Nagthali viewpoint into Tibet', 'Langtang and Ganesh Himal panorama'], tips: 'The scenic high point — go on a clear morning.' },
    { day: 5, title: 'Thuman to Briddim', from: 'Thuman (2,340 m)', to: 'Briddim (2,230 m)', distanceKm: '10 km', walkHours: '4–5 hrs', startEle: 2340, endEle: 2230, terrain: 'Forest traverse and river crossing', stay: 'Home-stay', meals: 'B/L/D', highlights: ['Briddim’s community home-stay system'], tips: 'A relaxed cultural day.' },
    { day: 6, title: 'Briddim to Syabrubesi', from: 'Briddim (2,230 m)', to: 'Syabrubesi (1,470 m)', distanceKm: '7 km', walkHours: '3–4 hrs', startEle: 2230, endEle: 1470, terrain: 'Descent to the valley', stay: 'Guesthouse', meals: 'B/L/D', highlights: ['Trail complete — or continue into Langtang'], tips: 'Short day; this is where a Langtang extension begins.' },
    { day: 7, title: 'Drive Syabrubesi to Kathmandu', from: 'Syabrubesi (1,470 m)', to: 'Kathmandu (1,400 m)', distanceKm: '—', walkHours: '7–8 hr drive', startEle: 1470, endEle: 1400, terrain: 'Mountain road', stay: 'Hotel', meals: 'B', highlights: ['Terraced hills'], tips: 'Long drive back.' },
    { day: 8, title: 'Contingency / Kathmandu day', from: 'Kathmandu', to: 'Kathmandu', distanceKm: '—', walkHours: '—', startEle: 1400, endEle: 1400, terrain: '—', stay: 'Hotel', meals: 'B', highlights: ['Spare day'], tips: 'Sightseeing if unused.' },
    { day: 9, title: 'Departure', from: 'Kathmandu', to: '—', distanceKm: '—', walkHours: '—', startEle: 1400, endEle: 1400, terrain: '—', stay: '—', meals: 'B', highlights: ['Transfer to the airport'], tips: '' }
  ],
  routePoints: [
    { name: 'Gatlang', elevation: '2,240 m', day: 2, walkTime: '5–6 hrs from Syabrubesi', stay: 'Community home-stays', highlight: 'Hilltop monastery and the sacred Parvati Kunda', warning: 'Home-stay rooms are simple and shared.' },
    { name: 'Tatopani', elevation: '2,610 m', day: 3, walkTime: '5–6 hrs from Gatlang', stay: 'Home-stays by the springs', highlight: 'Natural hot springs — “tato pani” means hot water', warning: 'The springs are open-air and communal.' },
    { name: 'Nagthali ridge', elevation: '≈ 3,165 m', day: 4, walkTime: '2–3 hrs above Tatopani', stay: 'Day visit (a few basic huts)', highlight: 'Views into Tibet and across the Langtang range', warning: 'Exposed; cold and windy if the weather turns.' },
    { name: 'Briddim', elevation: '2,230 m', day: 5, walkTime: '4–5 hrs from Thuman', stay: 'Organised village home-stay rota', highlight: 'The most developed community home-stay on the trail', warning: '—' }
  ],
  permits: [
    { name: 'Langtang National Park entry permit', where: 'Kathmandu (NTB) or Dhunche checkpoint', feeNote: 'Fixed park fee — verify', notes: 'The trail lies within the national park.' },
    { name: 'Local area / rural municipality permit', where: 'On the route', feeNote: 'Local fee — verify', notes: 'Requirements change.' }
  ],
  cost: {
    note: 'Low-cost and short. Home-stay fees support village committees directly. Confirm a quote for your dates.',
    tiers: [
      { name: 'Budget / home-stay', rangeUSD: '$500–$750', includes: ['Group guide', 'Jeep transfers', 'Permits', 'Home-stays', 'All meals on trek'] },
      { name: 'Comfort', rangeUSD: '$800–$1,150', includes: ['Private guide + porter', 'Best home-stays', 'Kathmandu 4★', 'Cultural programme'] },
      { name: 'Premium', rangeUSD: '$1,400+', includes: ['Private trip', 'Combined with Langtang valley', 'Extra village days'] }
    ],
    breakdown: [
      { item: 'Permits', note: 'National park + local fee' },
      { item: 'Transport', note: 'Kathmandu–Syabrubesi jeep each way' },
      { item: 'Guide + porter', note: 'Per day' },
      { item: 'Home-stay fees', note: 'Shared through village tourism committees' },
      { item: 'Tips', note: 'Customary at the end' }
    ],
    independentVsGuided: 'A guide is recommended — the village trail network is easy to lose, and a guide who can interpret makes the home-stay experience far richer. Current rules generally require one.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Syabrubesi', mode: 'Private jeep or bus', duration: '7–8 hrs', note: 'The Langtang road.' },
      { from: 'Syabrubesi', to: 'Trail', mode: 'On foot', duration: '—', note: '' }
    ],
    note: 'Drive-in, drive-out. If you continue into Langtang the return is still via Syabrubesi.'
  },
  equipment: [
    { item: 'Sleeping bag to ≈ −5°C', need: 'essential', note: 'Home-stay bedding is basic; a liner adds comfort and hygiene.' },
    { item: 'Quick-dry towel + swimwear', need: 'recommended', note: 'For the Tatopani hot springs.' },
    { item: 'Head torch', need: 'essential', note: 'Village power is intermittent.' },
    { item: 'Small gifts (optional)', need: 'optional', note: 'Photos printed later, or school supplies — ask your guide what is genuinely useful.' }
  ],
  safety: {
    risks: [
      { name: 'The road', note: 'The Kathmandu–Syabrubesi drive is the main discomfort and delay risk.' },
      { name: 'Trail-finding', note: 'A web of village and forest paths with few signs — stay with your guide.' },
      { name: 'Basic sanitation', note: 'Home-stay hygiene varies; bring hand sanitiser and be careful with water.' },
      { name: 'Weather', note: 'Snow can reach Nagthali from December, making the ridge slippery.' }
    ],
    turnaround: 'There is little to turn around from. In poor weather the Nagthali ridge day can be dropped and the loop shortened — the villages are the core of the trek regardless.',
    note: 'The route stays close to villages and roads throughout, keeping evacuation options simple and quick.'
  },
  faq: [
    { q: 'What is the Tamang Heritage Trail?', a: 'A community-tourism trek through Tamang villages west of Syabrubesi, focused on home-stays and culture rather than altitude. It stays below about 3,200 m for overnights.' },
    { q: 'How difficult is it?', a: 'Moderate but gentle — short days, no passes, low altitude. There are still real climbs between villages.' },
    { q: 'Is it suitable for families and beginners?', a: 'Yes. The low altitude, short days and cultural focus make it a good family or first trek.' },
    { q: 'Where do I sleep?', a: 'Mostly in village home-stays, run on a rota by community committees, plus simple guesthouses at Syabrubesi.' },
    { q: 'Are the hot springs worth it?', a: 'Yes — Tatopani’s open-air springs are a genuine highlight after a day’s walk. Bring swimwear and a towel.' },
    { q: 'When is the best time to go?', a: 'October to May. Because it stays low it is a strong winter option, when higher treks are snowbound.' },
    { q: 'Do I need a guide and permits?', a: 'A Langtang National Park permit and a local permit are required. A guide is recommended for route-finding and interpretation and generally required under current rules.' },
    { q: 'Can I combine it with the Langtang Valley trek?', a: 'Yes — it is the natural pairing. Do the heritage loop first as acclimatisation, then continue up the Langtang valley (about 14–16 days total).' },
    { q: 'Is there mobile coverage and Wi-Fi?', a: 'Coverage in most villages; Wi-Fi in a few home-stays. Better than the higher Langtang route.' },
    { q: 'Can I charge my devices?', a: 'Usually yes, in the home-stays, though village power can be intermittent. Bring a power bank.' },
    { q: 'What is the food like?', a: 'Home-cooked Tamang meals — dal bhat, local greens, buckwheat, potatoes, millet — eaten with the family. Simple and good.' },
    { q: 'Are there ATMs?', a: 'No. Carry cash from Kathmandu; daily costs are low.' }
  ],
  relatedTreks: ['langtang-valley', 'gosaikunda', 'helambu-circuit', 'everest-view-trek'],
  relatedDestinations: [
    { name: 'Langtang Valley', note: 'Continue straight on from Syabrubesi for the full regional trek.' },
    { name: 'Gatlang & Parvati Kunda', note: 'Built into the itinerary — one of the prettier villages in the region.' },
    { name: 'Kathmandu Valley', note: 'Newar cities and temples for the days either side.' }
  ],
  hotelsNote: 'Kathmandu hotels either side are usually included; the trail is village home-stays by design. Ask us about combining with the Langtang valley.'
};

TREKS['rolwaling-valley'] = {
  slug: 'rolwaling-valley',
  name: 'Rolwaling Valley Trek',
  tagline: 'A hidden valley between Langtang and the Khumbu',
  province: 'bagmati',
  region: 'Rolwaling',
  heroImage: '/images/hero-mountain.jpg',
  summary: 'A strenuous 14-day trek into the remote Rolwaling valley beneath Gauri Shankar (7,134 m), culminating — for experienced parties — in the crossing of the Tashi Lapcha pass (5,755 m) into the Khumbu. A serious, lightly-travelled route on the edge of mountaineering terrain.',
  stats: {
    duration: '14 days on the trail',
    difficulty: 'Strenuous',
    maxAltitude: '5,755 m',
    maxAltitudePoint: 'Tashi Lapcha pass',
    bestSeason: 'Apr–May · Oct–early Nov',
    startPoint: 'Chetchet / Gongar (drive from Kathmandu)',
    endPoint: 'Namche Bazaar / Lukla (via Tashi Lapcha), or out-and-back',
    distanceKm: '≈ 110–130 km',
    walkHours: '5–8 hrs/day'
  },
  seo: {
    title: 'Rolwaling Valley Trek & Tashi Lapcha Pass — Nepal | Itinerary, Difficulty & Cost',
    description: 'The Rolwaling Valley trek beneath Gauri Shankar, with the Tashi Lapcha pass crossing into the Khumbu. Itinerary, difficulty, permits, cost, best season and FAQ.'
  },
  overview: [
    'Rolwaling is the deep glacial valley immediately west of the Khumbu, sealed off by the Tashi Lapcha pass and rarely visited. Sherpa legend calls it a beyul — a hidden sacred valley — and it still feels that way: a handful of villages, one sacred lake, and the enormous south face of Gauri Shankar dominating everything.',
    'The standard trek follows the Rolwaling Khola up through Simigaon and Beding to Na, then to the sacred lake of Tsho Rolpa, a large and growing glacial lake held back by a moraine dam. Experienced parties with a climbing guide then cross the Tashi Lapcha (5,755 m) — a glaciated pass requiring rope, crampons and fixed-line skills — and descend into the Khumbu at Thame, finishing at Namche and Lukla.',
    'This is the most serious trek in Bagmati province. Without the pass it is a demanding out-and-back to Tsho Rolpa; with the pass it is a mini-expedition and should be treated as one.'
  ],
  highlights: [
    'The south face of Gauri Shankar (7,134 m) filling the valley head',
    'Tsho Rolpa — one of Nepal’s largest and most-studied glacial lakes',
    'Beding and Na — traditional Rolwaling Sherpa villages',
    'The Tashi Lapcha pass (5,755 m) crossing into the Khumbu (experienced parties only)',
    'Genuine solitude — one of the least-walked valleys in central Nepal',
    'A rugged, wild alternative approach to the Everest region'
  ],
  suitability: {
    physical: 9, technical: 6, altitude: 10, remoteness: 9,
    walkHours: '5–8 hours a day, with a very long glaciated pass day',
    terrain: 'Steep forest, exposed cliff trails, moraine, and — on the pass — a crevassed glacier needing crampons and rope.',
    weatherExposure: 'Extreme on the Tashi Lapcha — one of the most weather-sensitive pass crossings in Nepal.',
    goodFor: [
      'Experienced trekkers with previous glacier travel or a mountaineering course',
      'Parties wanting a committing, crowd-free route into the Khumbu',
      'Strong walkers comfortable with exposure and camping'
    ],
    notIdeal: [
      'Anyone without glacier-travel experience (for the pass version)',
      'First-time high-altitude trekkers',
      'Trips with no flexibility for multi-day weather holds at altitude'
    ]
  },
  why: {
    lead: 'Rolwaling is what a hidden valley actually looks like — and the back door into Everest country.',
    paragraphs: [
      'Very few trekkers come here, and the reasons are the reasons to go: the approach is hard, the accommodation is basic, and the pass at the end is a real mountaineering objective. In between, you get a valley that feels sealed off from the rest of Nepal, with Gauri Shankar — sacred, unclimbed from Nepal until 1979 — presiding over it.',
      'Crossing the Tashi Lapcha and dropping into Thame, on the classic Everest trail, is one of the great linkages in the Nepal Himalaya. It should only be attempted with a climbing guide, proper equipment and a genuine weather window.'
    ],
    gallery: [
      { img: '/images/hero-mountain.jpg', caption: 'Gauri Shankar above the Rolwaling valley' },
      { img: '/images/everest_real.jpg', caption: 'The Tashi Lapcha glacier on the crossing to the Khumbu' },
      { img: '/images/ebc.png', caption: 'Moraine and ice near Tsho Rolpa' }
    ]
  },
  passes: [{ name: 'Tashi Lapcha', elevation: '5,755 m', day: 10 }],
  acclimatization: {
    days: [6, 9],
    note: 'Acclimatisation days at Beding (3,690 m) and Na (4,180 m), plus a rest/prep day before the Tashi Lapcha, are essential. The pass involves sleeping around 5,000 m either side and a summit day to 5,755 m — this route punishes any shortcut in the schedule.'
  },
  itinerary: [
    { day: 1, title: 'Drive Kathmandu to Chetchet / Gongar', from: 'Kathmandu (1,400 m)', to: 'Gongar (1,440 m)', distanceKm: '—', walkHours: '7–9 hr drive', startEle: 1400, endEle: 1440, terrain: 'Arniko highway then rough road', stay: 'Guesthouse', meals: 'B/L/D', highlights: ['Bhote Koshi gorge'], tips: 'A long drive toward the Tibet border road.' },
    { day: 2, title: 'Gongar to Simigaon', from: 'Gongar (1,440 m)', to: 'Simigaon (2,000 m)', distanceKm: '7 km', walkHours: '4–5 hrs', startEle: 1440, endEle: 2000, terrain: 'Steep climb from the river', stay: 'Home-stay', meals: 'B/L/D', highlights: ['First Sherpa village', 'Gauri Shankar appears'], tips: 'A sharp climb to start.' },
    { day: 3, title: 'Simigaon to Dongang', from: 'Simigaon (2,000 m)', to: 'Dongang (2,790 m)', distanceKm: '11 km', walkHours: '6–7 hrs', startEle: 2000, endEle: 2790, terrain: 'Forest and exposed cliff trail above the gorge', stay: 'Basic lodge / camp', meals: 'B/L/D', highlights: ['Deep old-growth forest'], tips: 'Some exposed sections — steady footing.' },
    { day: 4, title: 'Dongang to Beding', from: 'Dongang (2,790 m)', to: 'Beding (3,690 m)', distanceKm: '10 km', walkHours: '6 hrs', startEle: 2790, endEle: 3690, terrain: 'Climb into the open upper valley', stay: 'Lodge / camp', meals: 'B/L/D', highlights: ['Beding village and monastery', 'Gauri Shankar close up'], tips: 'You are into the beyul now.' },
    { day: 5, title: 'Beding — acclimatisation day', from: 'Beding (3,690 m)', to: 'Beding (3,690 m)', distanceKm: '5–7 km', walkHours: '3–4 hrs', startEle: 3690, endEle: 3690, terrain: 'Climb the ridge behind the village', stay: 'Lodge / camp', meals: 'B/L/D', highlights: ['Valley panorama', 'Village life'], tips: 'Rest and hydrate; the hard part is ahead.' },
    { day: 6, title: 'Beding to Na', from: 'Beding (3,690 m)', to: 'Na (4,180 m)', distanceKm: '6 km', walkHours: '3 hrs', startEle: 3690, endEle: 4180, terrain: 'Gentle valley climb', stay: 'Lodge / camp', meals: 'B/L/D', highlights: ['Na — the highest village', 'Yak pastures'], tips: 'Short day for acclimatisation.' },
    { day: 7, title: 'Na — day walk to Tsho Rolpa', from: 'Na (4,180 m)', to: 'Na (4,180 m)', distanceKm: '10 km', walkHours: '5–6 hrs', startEle: 4180, endEle: 4180, terrain: 'Moraine trail to the lake (≈ 4,580 m) and back', stay: 'Lodge / camp', meals: 'B/L/D', highlights: ['Tsho Rolpa glacial lake and moraine dam'], tips: 'Non-pass parties turn around here.' },
    { day: 8, title: 'Na to Kabug / glacier camp', from: 'Na (4,180 m)', to: 'Kabug (≈ 4,750 m)', distanceKm: '8 km', walkHours: '5–6 hrs', startEle: 4180, endEle: 4750, terrain: 'Moraine above Tsho Rolpa', stay: 'Camp', meals: 'B/L/D', highlights: ['Positioning for the pass'], tips: 'Camping from here — a cold, high night.' },
    { day: 9, title: 'Kabug to high camp below Tashi Lapcha', from: 'Kabug (4,750 m)', to: 'Tashi Lapcha high camp (≈ 5,050 m)', distanceKm: '6 km', walkHours: '4–5 hrs', startEle: 4750, endEle: 5050, terrain: 'Glacier moraine and ice edges', stay: 'Camp', meals: 'B/L/D', highlights: ['The pass wall ahead'], tips: 'Gear check and rope briefing tonight.' },
    { day: 10, title: 'Cross the Tashi Lapcha to Ngole', from: 'High camp (5,050 m)', to: 'Ngole (≈ 4,700 m)', distanceKm: '10 km', walkHours: '8–10 hrs', startEle: 5050, endEle: 4700, terrain: 'Glaciated pass (5,755 m) with fixed lines, then steep descent', stay: 'Camp', meals: 'B/L/D', highlights: ['Tashi Lapcha (5,755 m) into the Khumbu'], tips: 'Alpine start; crampons and rope; only crossed in a settled window.' },
    { day: 11, title: 'Ngole to Thame', from: 'Ngole (4,700 m)', to: 'Thame (3,800 m)', distanceKm: '10 km', walkHours: '5–6 hrs', startEle: 4700, endEle: 3800, terrain: 'Descend into the Thame valley', stay: 'Tea house', meals: 'B/L/D', highlights: ['Thame monastery', 'Back on the classic Everest trail'], tips: 'Relief — the technical part is done.' },
    { day: 12, title: 'Thame to Namche Bazaar', from: 'Thame (3,800 m)', to: 'Namche Bazaar (3,440 m)', distanceKm: '10 km', walkHours: '4–5 hrs', startEle: 3800, endEle: 3440, terrain: 'Valley traverse', stay: 'Tea house', meals: 'B/L/D', highlights: ['Bakeries and a hot shower'], tips: 'Celebrate in Namche.' },
    { day: 13, title: 'Namche to Lukla', from: 'Namche Bazaar (3,440 m)', to: 'Lukla (2,840 m)', distanceKm: '13.5 km', walkHours: '6–7 hrs', startEle: 3440, endEle: 2840, terrain: 'Descent then final climb', stay: 'Tea house', meals: 'B/L/D', highlights: ['Suspension bridges'], tips: 'Longer than it looks.' },
    { day: 14, title: 'Fly Lukla to Kathmandu', from: 'Lukla (2,840 m)', to: 'Kathmandu (1,400 m)', distanceKm: '—', walkHours: '—', startEle: 2840, endEle: 1400, terrain: 'Flight', stay: 'Hotel', meals: 'B', highlights: ['Flight out'], tips: 'Keep a buffer day for Lukla weather.' }
  ],
  routePoints: [
    { name: 'Beding', elevation: '3,690 m', day: 4, walkTime: '6 hrs from Dongang', stay: 'Basic lodges / camp + monastery', highlight: 'The main Rolwaling Sherpa village and key acclimatisation stop', warning: 'Services are minimal and seasonal.' },
    { name: 'Na', elevation: '4,180 m', day: 6, walkTime: '3 hrs from Beding', stay: 'Basic lodges / camp', highlight: 'The highest village; base for Tsho Rolpa', warning: 'Cold; the turnaround point for non-pass trips.' },
    { name: 'Tsho Rolpa', elevation: '≈ 4,580 m', day: 7, walkTime: '2.5–3 hrs from Na', stay: 'Day visit only', highlight: 'A major glacial lake behind a fragile moraine dam', warning: 'Do not linger on the dam; the lake is monitored for outburst risk.' },
    { name: 'Tashi Lapcha', elevation: '5,755 m', day: 10, walkTime: 'Full alpine day from high camp', stay: 'Pass — no shelter', highlight: 'The glaciated gateway to the Khumbu', warning: 'A mountaineering pass — rope, crampons, fixed lines and a settled forecast are mandatory.' }
  ],
  permits: [
    { name: 'Gaurishankar Conservation Area Permit', where: 'Kathmandu (NTB) or the entry checkpoint', feeNote: 'Fixed area fee — verify', notes: 'Covers the Rolwaling approach.' },
    { name: 'Sagarmatha National Park + Khumbu Rural Municipality permits', where: 'On the Khumbu side (if crossing the pass)', feeNote: 'Fixed / local fees — verify', notes: 'Needed once you descend into the Everest region.' },
    { name: 'Climbing / pass permit for Tashi Lapcha', where: 'Arranged by the operator (NMA)', feeNote: 'Peak/pass fee — verify', notes: 'The Tashi Lapcha is treated as a climbing pass; a climbing guide is required.' }
  ],
  cost: {
    note: 'A camping, staff-heavy trip with mountaineering support on the pass — priced accordingly. The out-and-back (no pass) version is cheaper. Confirm a quote for your dates.',
    tiers: [
      { name: 'Tsho Rolpa out-and-back', rangeUSD: '$1,600–$2,300', includes: ['Guide + porters', 'Transfers', 'Conservation permit', 'Lodges / camp', 'All trek meals'] },
      { name: 'Full traverse with Tashi Lapcha', rangeUSD: '$2,800–$4,000', includes: ['Climbing guide + Sherpa', 'Group climbing equipment', 'All permits', 'Full camp crew', 'Lukla flight out'] },
      { name: 'Premium expedition style', rangeUSD: '$4,500+', includes: ['Higher guide ratio', 'Better camp', 'Extra weather days', 'Helicopter contingency'] }
    ],
    breakdown: [
      { item: 'Conservation + park permits', note: 'Gaurishankar, and Sagarmatha/Khumbu if crossing' },
      { item: 'Tashi Lapcha climbing permit', note: 'Treated as a climbing pass' },
      { item: 'Climbing guide + Sherpa', note: 'Required for the pass; fixes lines and manages the glacier' },
      { item: 'Group equipment', note: 'Rope, hardware, sometimes tents for the high camps' },
      { item: 'Crew + food', note: 'Full camp support for the high sections' },
      { item: 'Lukla flight', note: 'For the traverse finish' }
    ],
    independentVsGuided: 'The Tsho Rolpa trek needs a guide; the Tashi Lapcha crossing needs a climbing guide and a proper support team, and should be booked as a supported mini-expedition.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Chetchet / Gongar', mode: 'Private jeep', duration: '7–9 hrs', note: 'Via the Arniko highway toward the Tibet border, then rough road.' },
      { from: 'Lukla', to: 'Kathmandu', mode: 'Flight (~35 min)', duration: '35 min', note: 'For the traverse finish; often via Ramechhap in peak season.' }
    ],
    note: 'The out-and-back version returns by jeep from Chetchet. The traverse finishes with a Lukla flight — keep a buffer day.'
  },
  equipment: [
    { item: 'Mountaineering boots (crampon-compatible)', need: 'essential', note: 'For the Tashi Lapcha glacier — provided/hired if you do not own them.' },
    { item: 'Crampons + ice axe + harness', need: 'essential', note: 'Group hardware supplied by the operator; personal fit checked before the pass.' },
    { item: '4-season sleeping bag (≈ −20°C)', need: 'essential', note: 'High glacier camps around 5,000 m.' },
    { item: 'Trekking poles', need: 'essential', note: 'For the long approach and the steep descent to Thame.' },
    { item: 'Glacier glasses + goggles', need: 'essential', note: 'Intense glare and possible spindrift on the pass.' },
    { item: 'Satellite messenger', need: 'essential', note: 'The upper valley and pass have no coverage.' }
  ],
  safety: {
    risks: [
      { name: 'The Tashi Lapcha', note: 'A crevassed, rockfall-prone glaciated pass. It is only crossed with a climbing guide, fixed lines and a settled forecast — and parties routinely wait days for the window or turn back.' },
      { name: 'Tsho Rolpa', note: 'A monitored glacial lake with a recognised outburst-flood risk. Follow your guide’s instructions around the dam and do not camp in the flood path.' },
      { name: 'Remoteness', note: 'The upper valley is far from any road; evacuation means a helicopter and a weather window.' },
      { name: 'Altitude', note: 'Sleeping near 5,000 m for two nights and a 5,755 m pass — the acclimatisation days are non-negotiable.' },
      { name: 'Exposed approach trails', note: 'The Simigaon–Dongang cliff sections need care, especially when wet.' }
    ],
    turnaround: 'If the Tashi Lapcha window does not come, the trip becomes the Tsho Rolpa out-and-back and you exit the way you came in. The pass is never forced — every experienced Rolwaling guide has turned around on it.',
    note: 'Book this as a supported mini-expedition with a climbing guide, group hardware and spare days. Carry a satellite messenger and confirm your insurance covers a glaciated pass to 5,755 m.'
  },
  faq: [
    { q: 'Is the Rolwaling trek a climbing trip?', a: 'The valley walk to Tsho Rolpa is a strenuous trek. The Tashi Lapcha crossing into the Khumbu is a mountaineering pass requiring crampons, rope, a climbing guide and glacier-travel skills.' },
    { q: 'Can I do Rolwaling without crossing the pass?', a: 'Yes — many parties trek to Beding, Na and Tsho Rolpa and return the same way, a demanding but non-technical 10–11 day trip.' },
    { q: 'How high is the Tashi Lapcha?', a: '5,755 m, with camps around 4,750–5,050 m on either side.' },
    { q: 'What experience do I need for the pass?', a: 'Previous glacier travel, a mountaineering skills course, or comparable experience — plus real fitness. Your operator will assess you before confirming the crossing.' },
    { q: 'When can the Tashi Lapcha be crossed?', a: 'Late April–May and October to early November, and only in a settled weather window. It is impassable and dangerous in snow or wind.' },
    { q: 'How do I get to the trailhead?', a: 'A 7–9 hour jeep drive from Kathmandu toward the Tibet border, to Chetchet or Gongar.' },
    { q: 'What permits are needed?', a: 'The Gaurishankar Conservation Area Permit for the approach, the Sagarmatha National Park and Khumbu permits if you cross into the Everest region, and a Tashi Lapcha climbing/pass permit. Your operator arranges all of them.' },
    { q: 'What is the accommodation like?', a: 'Home-stays and basic lodges on the lower approach, then camping for the high valley and the pass. The Khumbu side reverts to tea houses.' },
    { q: 'Is there mobile coverage?', a: 'Some near the road head and in Beding; none on the upper glacier or the pass. Carry a satellite messenger.' },
    { q: 'What is Tsho Rolpa and is it safe to visit?', a: 'A large glacial lake dammed by moraine, monitored for outburst-flood risk. It is safe to visit on foot with a guide; do not linger on the dam or camp below it.' },
    { q: 'What if I get altitude sickness?', a: 'You descend the valley toward Beding, which is low enough to recover. If it happens near the pass, the crossing is off and you return via Rolwaling.' },
    { q: 'How many spare days should I budget?', a: 'At least two — one or more for the Tashi Lapcha weather window, one for the Lukla flight.' }
  ],
  relatedTreks: ['everest-base-camp', 'three-passes', 'gokyo-lakes', 'ganesh-himal-trek'],
  relatedDestinations: [
    { name: 'Thame', note: 'The historic Khumbu village where the pass route rejoins the Everest trail.' },
    { name: 'Namche Bazaar', note: 'A well-earned rest stop after the crossing.' },
    { name: 'Kathmandu Valley', note: 'For the days either side of a committing route like this.' }
  ],
  hotelsNote: 'Kathmandu hotels either side are included. The approach is home-stays and camp; the pass is camp; the Khumbu side is tea houses. This route is sold as a supported mini-expedition — talk to us early about dates and your experience.'
};

TREKS['ganesh-himal-trek'] = {
  slug: 'ganesh-himal-trek',
  name: 'Ganesh Himal Trek',
  tagline: 'Empty ridges between Langtang and Manaslu',
  province: 'bagmati',
  region: 'Ganesh Himal (Tamang Heritage)',
  heroImage: '/images/langtang_real.jpg',
  summary: 'A 12-day off-the-beaten-track trek through the foothills of the Ganesh Himal, north-west of Kathmandu — Tamang and Gurung villages, high pastures, the Singla and Pangsang ridges, and views across to both the Langtang and Manaslu ranges, with almost no other trekkers.',
  stats: {
    duration: '12 days (9–10 on the trail)',
    difficulty: 'Challenging',
    maxAltitude: '≈ 4,000–4,300 m',
    maxAltitudePoint: 'Pangsang / Singla ridge',
    bestSeason: 'Oct–Nov · Mar–May',
    startPoint: 'Syabrubesi or Trishuli (drive from Kathmandu)',
    endPoint: 'Arughat / Dhading (drive to Kathmandu)',
    distanceKm: '≈ 90–110 km',
    walkHours: '5–7 hrs/day'
  },
  seo: {
    title: 'Ganesh Himal Trek — Nepal | Off-the-Beaten-Path Trek Itinerary, Cost & Best Time',
    description: 'The Ganesh Himal trek in the foothills between Langtang and Manaslu: a quiet home-stay and camping route. Itinerary, difficulty, permits, cost, best time and FAQ.'
  },
  overview: [
    'The Ganesh Himal massif sits between the Langtang and Manaslu ranges, and the trekking country below it is some of the quietest in central Nepal. There is no single fixed route — trips are stitched together from village trails, herders’ paths and ridge crossings — but the common thread is Tamang and Gurung villages, terraced middle-hills, and high kharkas (pastures) with a grandstand view of the Ganesh peaks and, beyond them, Manaslu.',
    'Most itineraries link Syabrubesi or the Tamang Heritage villages in the east with Arughat or Dhading in the west, crossing the Pangsang La or Singla ridge (around 4,000–4,300 m) in between. Accommodation is a mix of basic home-stays and camping, and the walking is genuinely rugged — big daily height changes, rough trails, and route-finding that needs a guide who knows the area.',
    'It suits experienced trekkers who have done the popular routes and want somewhere with no lodges to book ahead and no other groups on the trail.'
  ],
  highlights: [
    'Ganesh Himal and Manaslu from the Pangsang / Singla ridge',
    'Tamang and Gurung villages with almost no trekking tourism',
    'High summer pastures and the herders who use them',
    'A crossing between the Langtang and Manaslu regions on foot',
    'Kalo Seto Kunda and other sacred high lakes on some variants',
    'Total solitude — you may not see another trekking group for days'
  ],
  suitability: {
    physical: 8, technical: 2, altitude: 6, remoteness: 8,
    walkHours: '5–7 hours a day with large ascents and descents',
    terrain: 'Rough village and herder trails, forest, ridge crossings. Occasional faint path.',
    weatherExposure: 'Moderate to high on the ridges — cloud builds most afternoons.',
    goodFor: [
      'Experienced trekkers who have done the classic routes',
      'Walkers happy with camping and basic home-stays and a flexible plan',
      'Anyone who wants a genuinely quiet trail near Kathmandu'
    ],
    notIdeal: [
      'First-time trekkers or anyone expecting tea-house infrastructure',
      'Trips with a rigid schedule — weather and trail conditions dictate the pace',
      'Trekkers who need reliable resupply or communications'
    ]
  },
  why: {
    lead: 'A wild trek in the hills you can see from a Kathmandu rooftop — that almost nobody walks.',
    paragraphs: [
      'Ganesh Himal is the range framing the north-western skyline from Kathmandu, and yet the trails below it are as quiet as anywhere in Nepal. There is no “Ganesh Himal trek” in the way there is an Annapurna Circuit — you are following a route your guide has assembled from village paths — and that is exactly the appeal.',
      'From the high ridges you look one way to the Langtang peaks and the other way to Manaslu, with the Ganesh summits filling the middle distance, and the only sounds are bells from the pastures. It is a trek for people who have done the famous ones and want the feeling those had decades ago.'
    ],
    gallery: [
      { img: '/images/langtang_real.jpg', caption: 'Ridge walking below the Ganesh Himal' },
      { img: '/images/footer.png', caption: 'A Tamang village in the Ganesh foothills' },
      { img: '/images/hero-mountain.jpg', caption: 'Manaslu from a high pasture' }
    ]
  },
  passes: [{ name: 'Pangsang La / Singla', elevation: '≈ 4,000–4,300 m', day: 7 }],
  acclimatization: {
    days: [6],
    note: 'The route builds gradually through the middle hills, so a single rest / acclimatisation day before the highest ridge is usually enough. Because the maximum altitude is around 4,000–4,300 m, AMS risk is lower than on the base-camp treks, but the ridge day is still a big effort.'
  },
  itinerary: [
    { day: 1, title: 'Drive Kathmandu to Syabrubesi / Gatlang area', from: 'Kathmandu (1,400 m)', to: 'Gatlang (2,240 m)', distanceKm: '—', walkHours: '7–8 hr drive', startEle: 1400, endEle: 2240, terrain: 'Mountain road + rough spur', stay: 'Home-stay', meals: 'B/L/D', highlights: ['Into Tamang country'], tips: 'Long travel day.' },
    { day: 2, title: 'Gatlang to Somdang', from: 'Gatlang (2,240 m)', to: 'Somdang (3,270 m)', distanceKm: '13 km', walkHours: '6–7 hrs', startEle: 2240, endEle: 3270, terrain: 'Old mining road, then trail over the Khurpu Bhanjyang', stay: 'Basic lodge / camp', meals: 'B/L/D', highlights: ['Abandoned lead-zinc mine', 'Ridge crossing'], tips: 'A big climbing day.' },
    { day: 3, title: 'Somdang to Pansang / Tipling', from: 'Somdang (3,270 m)', to: 'Tipling (2,000 m)', distanceKm: '14 km', walkHours: '6–7 hrs', startEle: 3270, endEle: 2000, terrain: 'Cross the Pangsang La area, long descent', stay: 'Home-stay', meals: 'B/L/D', highlights: ['Ganesh Himal panorama from the ridge', 'Tipling’s mixed Buddhist–Christian community'], tips: 'A high crossing then a knee-testing descent.' },
    { day: 4, title: 'Tipling to Shertung / Chalish', from: 'Tipling (2,000 m)', to: 'Shertung (1,880 m)', distanceKm: '10 km', walkHours: '5 hrs', startEle: 2000, endEle: 1880, terrain: 'Village-to-village middle-hill trail', stay: 'Home-stay', meals: 'B/L/D', highlights: ['Gurung and Tamang villages', 'Terraced farmland'], tips: 'A cultural day at lower altitude.' },
    { day: 5, title: 'Shertung to Hindung / Borang', from: 'Shertung (1,880 m)', to: 'Hindung (2,800 m)', distanceKm: '12 km', walkHours: '6 hrs', startEle: 1880, endEle: 2800, terrain: 'Climb back toward the high pastures', stay: 'Home-stay / camp', meals: 'B/L/D', highlights: ['Last permanent village before the high route'], tips: 'Stock up — camping from here on some variants.' },
    { day: 6, title: 'Hindung — acclimatisation / to Kalo Seto Kunda area', from: 'Hindung (2,800 m)', to: 'High camp (≈ 3,700 m)', distanceKm: '9 km', walkHours: '5–6 hrs', startEle: 2800, endEle: 3700, terrain: 'Forest then open pasture', stay: 'Camp', meals: 'B/L/D', highlights: ['Sacred twin lakes on some routes', 'First close Ganesh views'], tips: 'A shorter day to adjust before the ridge.' },
    { day: 7, title: 'Cross the Singla / Pangsang ridge', from: 'High camp (3,700 m)', to: 'Pasture camp (≈ 3,500 m)', distanceKm: '12 km', walkHours: '7–8 hrs', startEle: 3700, endEle: 3500, terrain: 'Ridge to ≈ 4,000–4,300 m, then descent', stay: 'Camp', meals: 'B/L/D', highlights: ['Ganesh Himal and Manaslu from the high point'], tips: 'The scenic and physical climax — an early start, weather permitting.' },
    { day: 8, title: 'Descend toward Laba / Arughat side', from: 'Pasture camp (3,500 m)', to: 'Laba (2,900 m)', distanceKm: '13 km', walkHours: '6 hrs', startEle: 3500, endEle: 2900, terrain: 'Long descent through forest and villages', stay: 'Home-stay', meals: 'B/L/D', highlights: ['Into the Manaslu-side foothills'], tips: 'The mountains recede behind you.' },
    { day: 9, title: 'Laba to Arughat / road head', from: 'Laba (2,900 m)', to: 'Arughat area (600 m)', distanceKm: '16 km', walkHours: '6–7 hrs', startEle: 2900, endEle: 600, terrain: 'Steep descent to the Budhi Gandaki valley', stay: 'Guesthouse', meals: 'B/L/D', highlights: ['Trek complete', 'The Manaslu Circuit trail passes nearby'], tips: 'A big descent to the valley floor.' },
    { day: 10, title: 'Drive Arughat to Kathmandu', from: 'Arughat (600 m)', to: 'Kathmandu (1,400 m)', distanceKm: '—', walkHours: '6–7 hr drive', startEle: 600, endEle: 1400, terrain: 'Rough road then highway', stay: 'Hotel', meals: 'B/L', highlights: ['Dhading hill country'], tips: 'Road can be slow in the Budhi Gandaki section.' },
    { day: 11, title: 'Contingency / Kathmandu day', from: 'Kathmandu', to: 'Kathmandu', distanceKm: '—', walkHours: '—', startEle: 1400, endEle: 1400, terrain: '—', stay: 'Hotel', meals: 'B', highlights: ['Spare day for weather'], tips: 'Sightseeing if unused.' },
    { day: 12, title: 'Departure', from: 'Kathmandu', to: '—', distanceKm: '—', walkHours: '—', startEle: 1400, endEle: 1400, terrain: '—', stay: '—', meals: 'B', highlights: ['Airport transfer'], tips: '' }
  ],
  routePoints: [
    { name: 'Somdang', elevation: '3,270 m', day: 2, walkTime: '6–7 hrs from Gatlang', stay: 'Basic lodge / camp', highlight: 'Old mining settlement below the Ganesh peaks', warning: 'Very limited facilities; often a camping night.' },
    { name: 'Tipling', elevation: '2,000 m', day: 3, walkTime: 'Over the Pangsang La from Somdang', stay: 'Home-stays', highlight: 'A village with side-by-side Buddhist gompas and a church', warning: 'The ridge crossing to reach it is weather-dependent.' },
    { name: 'Hindung', elevation: '2,800 m', day: 5, walkTime: '6 hrs from Shertung', stay: 'Home-stays / camp', highlight: 'Last permanent village before the high route', warning: 'Resupply point — nothing above here.' },
    { name: 'Singla / Pangsang ridge', elevation: '≈ 4,000–4,300 m', day: 7, walkTime: 'Full day from high camp', stay: 'Ridge — no shelter', highlight: 'Langtang one side, Manaslu the other, Ganesh in the middle', warning: 'No crossing in fresh snow or storm; the route has no lodges here.' }
  ],
  permits: [
    { name: 'Gaurishankar Conservation Area / local area permits', where: 'Kathmandu (NTB) or checkpoints on the route', feeNote: 'Fixed / local fees — verify', notes: 'Exact permit mix depends on the variant walked — your operator confirms it.' },
    { name: 'Manaslu Conservation Area Permit (western variants)', where: 'Kathmandu or the Arughat side', feeNote: 'Fixed area fee — verify', notes: 'Only if the route dips into the Manaslu Conservation Area.' }
  ],
  cost: {
    note: 'A camping-supported trek in an area with no lodge network — more crew and logistics than a tea-house route. Confirm a quote for your dates and chosen variant.',
    tiers: [
      { name: 'Home-stay + camping mix', rangeUSD: '$1,300–$1,900', includes: ['Guide + cook', 'Jeep transfers', 'Permits', 'Home-stays / tents', 'All trek meals'] },
      { name: 'Fully supported camping', rangeUSD: '$2,000–$2,800', includes: ['Full camp crew', 'Private departure', 'Kathmandu hotels', 'Porter team'] },
      { name: 'Premium', rangeUSD: '$3,200+', includes: ['Naturalist guide', 'Better camp', 'Extra rest days', 'Route customisation'] }
    ],
    breakdown: [
      { item: 'Permits', note: 'Conservation area + local fees, variant-dependent' },
      { item: 'Transport', note: 'Jeep in from the Langtang side, out from Arughat / Dhading' },
      { item: 'Crew', note: 'Guide, cook and porters — no lodges to fall back on' },
      { item: 'Food + fuel', note: 'Largely carried; limited village resupply' },
      { item: 'Contingency', note: 'Spare days for ridge weather' }
    ],
    independentVsGuided: 'This is not an independent-trekking route. There is no marked trail, no lodge network and no beds to book — it needs a guide who knows the area and a small support crew.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Syabrubesi / Gatlang', mode: 'Private jeep', duration: '7–8 hrs', note: 'The Langtang road plus a rough spur.' },
      { from: 'Arughat / Dhading', to: 'Kathmandu', mode: 'Jeep then highway', duration: '6–7 hrs', note: 'Via the Budhi Gandaki valley, slow in places.' }
    ],
    note: 'Point-to-point across the foothills — you do not return to the start.'
  },
  equipment: [
    { item: '4-season sleeping bag (≈ −12°C to −15°C)', need: 'essential', note: 'Camping on the high sections.' },
    { item: 'Sleeping mat', need: 'essential', note: 'For every camping night.' },
    { item: 'Trekking poles', need: 'essential', note: 'Repeated big descents on rough trails.' },
    { item: 'Full waterproofs', need: 'essential', note: 'Afternoon cloud and rain are the norm on the ridges.' },
    { item: 'Water filter + chemical backup', need: 'essential', note: 'Few treated-water points.' },
    { item: 'Satellite messenger', need: 'recommended', note: 'Long sections with no mobile coverage.' }
  ],
  safety: {
    risks: [
      { name: 'Route-finding', note: 'There is no waymarked trail. A guide who genuinely knows the Ganesh foothills is essential — this is not a route to improvise.' },
      { name: 'The ridge crossing', note: 'The Pangsang / Singla high point has no shelter and is exposed to weather. Fresh snow or storm means waiting or rerouting.' },
      { name: 'Remoteness', note: 'Villages are small and far apart; evacuation is slow. Small injuries are more serious here than on a busy trail.' },
      { name: 'Weather', note: 'Cloud and rain build most afternoons; the best mountain views are early.' },
      { name: 'Leeches (spring / monsoon shoulder)', note: 'The forest sections can be leech-heavy in warm, damp conditions.' }
    ],
    turnaround: 'The itinerary is a framework, not a fixed line — your guide will change the ridge crossing or the village sequence for weather and trail conditions. If the high ridge is out, a lower village route still completes the traverse.',
    note: 'Carry a satellite messenger. Discuss the evacuation plan with your operator before departure — the nearest helicopter pickups are in the valleys at either end.'
  },
  faq: [
    { q: 'Is there a fixed Ganesh Himal trekking route?', a: 'No. Trips are built from village trails and herders’ paths, usually linking the Langtang / Tamang Heritage area with Arughat or Dhading over the Pangsang or Singla ridge. Your operator sets the exact line.' },
    { q: 'How hard is the Ganesh Himal trek?', a: 'Challenging — rough, unmarked trails, big daily ascents and descents, camping, and a high ridge crossing. It suits experienced trekkers.' },
    { q: 'How high does it go?', a: 'The ridge crossings reach roughly 4,000–4,300 m. Overnight altitudes are lower, so AMS risk is moderate.' },
    { q: 'Do I camp or use tea houses?', a: 'A mix of basic village home-stays and camping. There is no lodge network on the high sections.' },
    { q: 'When is the best time to go?', a: 'October–November and March–May. The monsoon makes the trails and leeches unbearable; winter snow closes the ridges.' },
    { q: 'How do I get there?', a: 'Jeep from Kathmandu to the Langtang/Tamang Heritage side to start, and out by jeep from Arughat or Dhading at the end.' },
    { q: 'What permits are required?', a: 'Conservation area and local permits, and sometimes a Manaslu Conservation Area Permit if the route touches that area. Your operator confirms and arranges the mix.' },
    { q: 'Is there mobile coverage?', a: 'Very little on the high and remote sections. Carry a satellite messenger.' },
    { q: 'Can I charge devices?', a: 'Occasionally in villages with power; assume you are mostly reliant on a power bank and, ideally, a small solar panel.' },
    { q: 'Will I see other trekkers?', a: 'Rarely. This is one of the quietest trekking areas within reach of Kathmandu.' },
    { q: 'Can it be combined with other treks?', a: 'It links naturally with the Tamang Heritage Trail at the eastern end and comes out near the Manaslu Circuit trailhead in the west.' },
    { q: 'What if the weather is bad on the ridge?', a: 'Your guide reroutes to a lower village line or waits a day. The traverse can still be completed without the highest crossing.' }
  ],
  relatedTreks: ['tamang-heritage-trail', 'manaslu-circuit', 'langtang-valley', 'tsum-valley'],
  relatedDestinations: [
    { name: 'Tamang Heritage Trail', note: 'The eastern end of the route — combine for a longer trip.' },
    { name: 'Manaslu Circuit', note: 'The western exit is near its trailhead at Arughat.' },
    { name: 'Kathmandu Valley', note: 'For the days either side.' }
  ],
  hotelsNote: 'Kathmandu hotels either side are included; the trail is home-stays and camp. This route is planned individually — talk to us about the variant that fits your dates and experience.'
};

/* ========================= GANDAKI PROVINCE ========================= */

TREKS['annapurna-circuit'] = {
  slug: 'annapurna-circuit',
  popular: true,
  name: 'Annapurna Circuit Trek',
  tagline: 'Around the Annapurna massif, over the Thorong La',
  province: 'gandaki',
  region: 'Annapurna',
  heroImage: '/images/annapurna_real.jpg',
  summary: 'The classic 12–16 day circuit of the Annapurna massif, from subtropical valleys through pine forest and the arid Manang plateau to the Thorong La (5,416 m) and down to the pilgrimage temple of Muktinath and the Kali Gandaki gorge.',
  stats: {
    duration: '12–16 days on the trail',
    difficulty: 'Moderate to Challenging',
    maxAltitude: '5,416 m',
    maxAltitudePoint: 'Thorong La',
    bestSeason: 'Mar–May · Sep–Nov',
    startPoint: 'Besisahar / Chame (drive from Kathmandu or Pokhara)',
    endPoint: 'Jomsom or Tatopani, then Pokhara',
    distanceKm: '≈ 160–200 km (road-shortened at both ends)',
    walkHours: '5–7 hrs/day'
  },
  seo: {
    title: 'Annapurna Circuit Trek — Nepal | Itinerary, Thorong La, Cost, Difficulty & Best Time',
    description: 'The complete Annapurna Circuit guide: 12–16 day itinerary over the Thorong La, difficulty and altitude, permits, cost, best season, packing list, acclimatisation and FAQ.'
  },
  overview: [
    'The Annapurna Circuit is the trek that made Nepal famous with independent walkers, and even with roads now reaching deep into both sides of the valley it remains one of the great long treks — a genuine journey around an 8,000 m massif, through more climate zones and cultures than any other route in the country.',
    'From the Marsyangdi valley the trail climbs steadily north-west: rice paddies give way to pine and then to the high, dry, Tibetan-influenced country around Manang, where most itineraries take two acclimatisation nights. The crux is the Thorong La (5,416 m), crossed in a long pre-dawn push to Muktinath, a temple sacred to both Hindus and Buddhists. The descent then follows the Kali Gandaki — the deepest gorge on earth, between Annapurna and Dhaulagiri — with a jeep or a flight from Jomsom finishing the trip.',
    'Roads have shortened the classic route; most trekkers now start walking at Chame or Dharapani and finish at Jomsom or Tatopani, keeping the best of the trail while skipping the dustiest road-walking sections. The NATT side trails also keep walkers off the road where possible.'
  ],
  highlights: [
    'The Thorong La (5,416 m) — one of the highest trekking passes in the world',
    'Manang — a high, dry Tibetan-style town with the Annapurnas as a backdrop',
    'Muktinath temple, sacred to Hindus and Buddhists alike',
    'The Kali Gandaki gorge between two eight-thousanders',
    'Every climate zone from subtropical paddy to high-alpine desert in one trek',
    'Ice Lake, Tilicho Lake and the Gangapurna viewpoint as acclimatisation side trips'
  ],
  suitability: {
    physical: 7, technical: 2, altitude: 9, remoteness: 4,
    walkHours: '5–7 hours a day, one very long pass day (8–10 hrs)',
    terrain: 'Well-defined trail and some shared road; the Thorong La is a long, non-technical rock-and-scree slog.',
    weatherExposure: 'High on the pass — wind and cold, and snow can close it for days.',
    goodFor: [
      'Fit trekkers who want a long, varied journey rather than an out-and-back',
      'First-time high-altitude trekkers who follow the Manang acclimatisation schedule',
      'Anyone who values cultural and landscape variety over wilderness'
    ],
    notIdeal: [
      'Trekkers who dislike sharing any trail with vehicles',
      'Tight schedules that cannot absorb a snow day on the Thorong La',
      'Those who have struggled with altitude below 4,000 m before'
    ]
  },
  why: {
    lead: 'No other trek in Nepal changes this much between the start and the finish.',
    paragraphs: [
      'You begin among banana palms and rice terraces and end in a wind-scoured desert of ochre cliffs and juniper. In between there is Manang, where the architecture, the faces and the gompas are essentially Tibetan; the slow, deliberate acclimatisation days with their side trips to Ice Lake and Tilicho; and then the pass — a cold, lung-bursting morning that drops you, blinking, into the very different world of Mustang.',
      'Muktinath, with its 108 water spouts and its eternal flame, is a fitting punctuation mark, and the walk down the Kali Gandaki past Marpha’s apple orchards and Kagbeni’s mud-brick lanes is a gentle, beautiful way to finish.'
    ],
    gallery: [
      { img: '/images/annapurna_real.jpg', caption: 'The Annapurna massif from the Manang valley' },
      { img: '/images/annapurna.png', caption: 'Prayer flags on the approach to the Thorong La' },
      { img: '/images/hero-mountain.jpg', caption: 'The dry country above Muktinath' }
    ]
  },
  passes: [{ name: 'Thorong La', elevation: '5,416 m', day: 9 }],
  acclimatization: {
    days: [5, 6],
    note: 'Two nights at Manang (3,540 m) are the heart of the acclimatisation plan, with day walks to Gangapurna Lake, the Ice Lake (4,600 m) or Milarepa’s Cave. Some itineraries add a Tilicho Lake side trip (2–3 days). Crossing the Thorong La the morning after sleeping at Thorong Phedi or High Camp is the point where an under-acclimatised trekker gets caught out.'
  },
  itinerary: [
    { day: 1, title: 'Drive to Chame', from: 'Kathmandu / Pokhara', to: 'Chame (2,710 m)', distanceKm: '—', walkHours: '8–9 hr drive', startEle: 1400, endEle: 2710, terrain: 'Highway then rough mountain road', stay: 'Tea house', meals: 'B/L/D', highlights: ['The Marsyangdi valley', 'First Annapurna II views'], tips: 'A jeep day — the walking starts tomorrow.' },
    { day: 2, title: 'Chame to Upper Pisang', from: 'Chame (2,710 m)', to: 'Upper Pisang (3,300 m)', distanceKm: '14 km', walkHours: '5–6 hrs', startEle: 2710, endEle: 3300, terrain: 'Pine forest, the Paungda Danda rock face', stay: 'Tea house', meals: 'B/L/D', highlights: ['The great curved cliff of Paungda Danda', 'Annapurna II and IV'], tips: 'Choose the upper (Pisang) trail for the views.' },
    { day: 3, title: 'Upper Pisang to Manang via Ghyaru', from: 'Upper Pisang (3,300 m)', to: 'Manang (3,540 m)', distanceKm: '17 km', walkHours: '6–7 hrs', startEle: 3300, endEle: 3540, terrain: 'High traverse via Ghyaru and Ngawal, then valley floor', stay: 'Tea house', meals: 'B/L/D', highlights: ['Ghyaru and Ngawal — old fortified villages', 'The full Annapurna wall'], tips: 'The high route is longer and harder but far better — and better for acclimatisation.' },
    { day: 4, title: 'Manang — acclimatisation day', from: 'Manang (3,540 m)', to: 'Manang (3,540 m)', distanceKm: '5–10 km', walkHours: '3–5 hrs', startEle: 3540, endEle: 3540, terrain: 'Day walk to Gangapurna Lake or the Ice Lake', stay: 'Tea house', meals: 'B/L/D', highlights: ['Gangapurna glacier and lake', 'HRA altitude talk'], tips: 'Attend the free Himalayan Rescue Association talk at 3 pm.' },
    { day: 5, title: 'Manang — second acclimatisation day (Ice Lake)', from: 'Manang (3,540 m)', to: 'Manang (3,540 m)', distanceKm: '12 km', walkHours: '6–7 hrs', startEle: 3540, endEle: 3540, terrain: 'Steep climb to Ice Lake (4,600 m) and back', stay: 'Tea house', meals: 'B/L/D', highlights: ['Ice Lake (Kicho Tal)', 'Big height gain then sleep low'], tips: 'The single best thing you can do for the Thorong La.' },
    { day: 6, title: 'Manang to Yak Kharka', from: 'Manang (3,540 m)', to: 'Yak Kharka (4,050 m)', distanceKm: '10 km', walkHours: '4–5 hrs', startEle: 3540, endEle: 4050, terrain: 'Gradual climb above the treeline', stay: 'Tea house', meals: 'B/L/D', highlights: ['Blue sheep on the slopes', 'Views back to Annapurna III'], tips: 'A short, easy day by design.' },
    { day: 7, title: 'Yak Kharka to Thorong Phedi / High Camp', from: 'Yak Kharka (4,050 m)', to: 'Thorong High Camp (4,880 m)', distanceKm: '9 km', walkHours: '4–5 hrs', startEle: 4050, endEle: 4880, terrain: 'Landslide-prone traverse, then a steep climb to High Camp', stay: 'Basic lodge', meals: 'B/L/D', highlights: ['The pass wall ahead'], tips: 'High Camp saves an hour on the pass day but sleeps higher — discuss with your guide.' },
    { day: 8, title: 'Cross the Thorong La to Muktinath', from: 'Thorong High Camp (4,880 m)', to: 'Muktinath (3,760 m)', distanceKm: '15 km', walkHours: '7–9 hrs', startEle: 4880, endEle: 3760, terrain: 'Long snow/scree climb to the pass, then a knee-punishing 1,600 m descent', stay: 'Tea house', meals: 'B/L/D', highlights: ['Thorong La (5,416 m)', 'Muktinath temple'], tips: 'Pre-dawn start to beat the wind. Poles essential for the descent.' },
    { day: 9, title: 'Muktinath to Jomsom via Kagbeni', from: 'Muktinath (3,760 m)', to: 'Jomsom (2,720 m)', distanceKm: '18 km', walkHours: '5–6 hrs', startEle: 3760, endEle: 2720, terrain: 'Desert plateau, then the Kali Gandaki riverbed', stay: 'Tea house', meals: 'B/L/D', highlights: ['Kagbeni — the gateway to Upper Mustang', 'The wind funnel of the Kali Gandaki'], tips: 'Walk the morning — the valley wind rises hard after midday.' },
    { day: 10, title: 'Fly or drive Jomsom to Pokhara', from: 'Jomsom (2,720 m)', to: 'Pokhara (820 m)', distanceKm: '—', walkHours: '20 min flight / 6–8 hr drive', startEle: 2720, endEle: 820, terrain: 'Mountain flight or jeep', stay: 'Hotel', meals: 'B', highlights: ['Dhaulagiri and Annapurna from the air'], tips: 'Morning flights only; keep a buffer day for weather.' }
  ],
  routePoints: [
    { name: 'Chame', elevation: '2,710 m', day: 1, walkTime: 'Road head', stay: 'Lodges, an ACAP checkpoint, hot springs', highlight: 'District headquarters of Manang', warning: 'The road reaches here — trekking begins beyond.' },
    { name: 'Upper Pisang', elevation: '3,300 m', day: 2, walkTime: '5–6 hrs from Chame', stay: 'Lodges', highlight: 'The high trail via Ghyaru starts here', warning: 'Choose the upper route despite the extra climb.' },
    { name: 'Manang', elevation: '3,540 m', day: 3, walkTime: '6–7 hrs from Upper Pisang', stay: 'Many lodges, bakeries, an HRA aid post', highlight: 'The acclimatisation hub — two nights', warning: 'Do not skip a night here to save time.' },
    { name: 'Thorong Phedi / High Camp', elevation: '4,500–4,880 m', day: 7, walkTime: '4–5 hrs from Yak Kharka', stay: 'Two large basic lodges', highlight: 'Launch point for the pass', warning: 'Beds fill fast in season; a guide phoning ahead matters.' },
    { name: 'Thorong La', elevation: '5,416 m', day: 8, walkTime: '3–4 hrs up from High Camp', stay: 'Pass — a tea shack only', highlight: 'The high point of the circuit', warning: 'Snow closes it for days at a time; high wind after mid-morning.' },
    { name: 'Muktinath', elevation: '3,760 m', day: 8, walkTime: '3–4 hrs down from the pass', stay: 'Lodges + the temple complex', highlight: '108 water spouts and an eternal flame', warning: 'The descent from the pass is long and hard on the knees.' }
  ],
  permits: [
    { name: 'Annapurna Conservation Area Permit (ACAP)', where: 'Kathmandu or Pokhara (NTB / ACAP office), or checkpoints', feeNote: 'Fixed area fee — verify', notes: 'Carry passport and photos; checked at Chame, Manang and elsewhere.' },
    { name: 'TIMS card', where: 'Kathmandu or Pokhara through a registered operator', feeNote: 'Fixed fee — verify', notes: 'Requirements for TIMS vs guide rules change — confirm current position.' }
  ],
  cost: {
    note: 'Good value for its length — no expensive access flight unless you fly out of Jomsom. Confirm a quote for your dates.',
    tiers: [
      { name: 'Budget / teahouse', rangeUSD: '$900–$1,300', includes: ['Group guide', 'Ground transport', 'ACAP + TIMS', 'Tea houses', 'Main meals'] },
      { name: 'Comfort', rangeUSD: '$1,400–$2,000', includes: ['Private guide + porter', 'Jomsom flight out', 'Better lodges in Manang / Pokhara', 'City 4★'] },
      { name: 'Premium', rangeUSD: '$2,400+', includes: ['Private trip', 'Tilicho Lake extension', 'Helicopter contingency on the pass', 'Best lodges throughout'] }
    ],
    breakdown: [
      { item: 'Permits', note: 'ACAP + TIMS' },
      { item: 'Transport', note: 'Jeep in; jeep or flight out from Jomsom' },
      { item: 'Guide + porter', note: 'Per day' },
      { item: 'Lodging + meals', note: 'Rises steeply between Manang and the pass' },
      { item: 'Tips', note: 'Customary at the end' }
    ],
    independentVsGuided: 'A guide is recommended for the Thorong La weather judgement and the Manang acclimatisation pacing, and under current rules a licensed guide is generally required in this area. A porter turns a hard trek into an enjoyable one.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu / Pokhara', to: 'Chame or Dharapani', mode: 'Private jeep or local bus + jeep', duration: '8–10 hrs', note: 'The road is rough beyond Besisahar. Starting at Chame skips the dustiest section.' },
      { from: 'Jomsom', to: 'Pokhara', mode: 'Flight (~20 min) or jeep (6–8 hrs)', duration: '20 min / 6–8 hrs', note: 'Jomsom flights are morning-only and weather-sensitive; the jeep road is dramatic but very rough.' }
    ],
    note: 'Roads have made the circuit shorter and more flexible — you can tailor the start and end points to your time and appetite for road-walking.'
  },
  equipment: [
    { item: 'Sleeping bag to ≈ −15°C', need: 'essential', note: 'High Camp is bitterly cold.' },
    { item: 'Down jacket + windproof shell', need: 'essential', note: 'The Thorong La morning is the coldest of the trek.' },
    { item: 'Trekking poles', need: 'essential', note: 'The 1,600 m descent to Muktinath is brutal without them.' },
    { item: 'Microspikes', need: 'recommended', note: 'For snow on the pass — common in spring and from late autumn.' },
    { item: 'Buff / face cover + goggles', need: 'recommended', note: 'Wind and dust in the Kali Gandaki and on the pass.' }
  ],
  safety: {
    risks: [
      { name: 'The Thorong La', note: 'The single biggest risk. Snow can close it for days, and a 2014 storm killed trekkers who pushed on in bad weather. Your guide will delay or turn back — trust that call.' },
      { name: 'Altitude', note: 'The circuit gains altitude relentlessly. The two Manang nights and the Ice Lake walk are the safety margin; do not compress them.' },
      { name: 'The descent to Muktinath', note: '1,600 m of steep descent after a pre-dawn pass climb — a common place for falls and blown knees.' },
      { name: 'Road sections', note: 'Where the trail shares the road, jeeps and dust are a nuisance and a minor hazard. Use the NATT alternative trails where possible.' },
      { name: 'Kali Gandaki wind', note: 'The valley funnels a fierce wind from late morning — walk the mornings on the Jomsom side.' }
    ],
    turnaround: 'If the Thorong La is snowed in, you wait at Manang or Yak Kharka, or abandon the pass and retrace to a road head — a disappointing but entirely normal outcome. A trekker not acclimatising well at Manang does not go higher.',
    note: 'The HRA aid post at Manang is staffed by volunteer doctors in season and gives a free daily altitude briefing. Helicopter evacuation is available from Manang, Yak Kharka and the pass area in clear weather.'
  },
  faq: [
    { q: 'How long does the Annapurna Circuit take?', a: 'Twelve to sixteen days on the trail, depending on where roads let you start and finish and whether you add Tilicho Lake. The full classic walk was longer before the roads.' },
    { q: 'How difficult is the Annapurna Circuit?', a: 'Moderate to challenging. The walking is non-technical, but the trek is long, gains a lot of altitude, and finishes each half-day with the Thorong La — an 8–10 hour day over a 5,416 m pass.' },
    { q: 'How high is the Thorong La?', a: '5,416 m. It is one of the highest trekking passes in the world that is crossed without mountaineering equipment.' },
    { q: 'How fit do I need to be?', a: 'Good hill fitness. Train for 2–3 months with long weighted hill walks. The pass day rewards preparation more than any other part of the trek.' },
    { q: 'Can beginners do the Annapurna Circuit?', a: 'Yes, with training and a properly paced itinerary. The two Manang acclimatisation nights are essential and non-negotiable.' },
    { q: 'When is the best time to trek the Annapurna Circuit?', a: 'Mid-September to November and March to May. October is the clearest and busiest. Winter can close the Thorong La; the monsoon brings leeches and cloud but the rain-shadow Manang side stays relatively dry.' },
    { q: 'Do I need a guide?', a: 'Recommended for the pass and pacing, and under current rules a licensed guide is generally required in the Annapurna region. Confirm the latest rules when you book.' },
    { q: 'What permits do I need?', a: 'The Annapurna Conservation Area Permit (ACAP) and a TIMS card, both arranged by your operator. Fees are set by the authorities — verify current amounts.' },
    { q: 'Is there Wi-Fi and mobile coverage?', a: 'Better than most treks — coverage in most villages up to Manang and around Muktinath, with Wi-Fi in many lodges. The pass area and High Camp are the main dead zones.' },
    { q: 'Can I charge my phone?', a: 'Yes, in tea-house dining rooms; free lower down, paid and pricier from Manang upward. Bring a power bank for the pass days.' },
    { q: 'Are there ATMs on the circuit?', a: 'In Chame, Manang and Jomsom, but they are unreliable and cap withdrawals. Carry the bulk of your cash from Kathmandu or Pokhara.' },
    { q: 'What food is available?', a: 'A wide tea-house menu — dal bhat, noodles, pasta, pizza lower down, plus bakeries in Manang. Eat mostly vegetarian above Manang.' },
    { q: 'Can I shower?', a: 'Paid hot showers as far as Yak Kharka; a bowl of hot water at High Camp. Muktinath onward, showers return.' },
    { q: 'Do I need a sleeping bag?', a: 'Yes — rated to about −15°C for High Camp. Hire one in Kathmandu or Pokhara if you prefer.' },
    { q: 'What happens if I get altitude sickness?', a: 'Mild AMS: rest at Manang or Yak Kharka until it clears. If it worsens, you descend — and the pass is abandoned for that trip. Serious signs mean immediate descent or helicopter.' },
    { q: 'Can I shorten the circuit?', a: 'Yes — start at Chame or Dharapani and finish at Jomsom or Muktinath. You cannot safely shorten the Manang acclimatisation, though.' },
    { q: 'What is the Tilicho Lake side trip?', a: 'A 2–3 day detour from Manang to one of the highest large lakes in the world (4,919 m). It adds a serious day and a night at Tilicho Base Camp; only for well-acclimatised, strong trekkers.' },
    { q: 'What happens on the Thorong La in bad weather?', a: 'You do not cross. Guides wait it out at Manang or the Phedi, and if the window does not come, the trek ends without the pass. Pushing on in a storm is how the 2014 disaster happened.' }
  ],
  relatedTreks: ['annapurna-base-camp', 'mardi-himal', 'manaslu-circuit', 'upper-mustang'],
  relatedDestinations: [
    { name: 'Pokhara', note: 'The lakeside city where the trek ends — Phewa Lake, paragliding, and the World Peace Pagoda.' },
    { name: 'Upper Mustang', note: 'Begins at Kagbeni, right on the circuit — a natural add-on for another week.' },
    { name: 'Tilicho Lake', note: 'A high-altitude side trip from Manang for the strong and well-acclimatised.' }
  ],
  hotelsNote: 'Trips usually include hotels in Kathmandu and Pokhara; the trail is tea houses. We can add the Jomsom–Pokhara flight, a Pokhara lake-view upgrade or an Upper Mustang extension — ask when you plan the trip.'
};

TREKS['annapurna-base-camp'] = {
  slug: 'annapurna-base-camp',
  popular: true,
  name: 'Annapurna Base Camp Trek',
  tagline: 'Into the Sanctuary, ringed by a wall of ice',
  province: 'gandaki',
  region: 'Annapurna',
  heroImage: '/images/annapurna.png',
  summary: 'A 10-day trek from the hills above Pokhara into the Annapurna Sanctuary — a glacial amphitheatre almost entirely surrounded by peaks over 7,000 m — to Annapurna Base Camp at 4,130 m, via the Gurung villages and rhododendron forests of the Modi Khola valley.',
  stats: {
    duration: '10 days (7–8 on the trail)',
    difficulty: 'Moderate',
    maxAltitude: '4,130 m',
    maxAltitudePoint: 'Annapurna Base Camp',
    bestSeason: 'Mar–Apr · Oct–Nov',
    startPoint: 'Nayapul / Kande / Ghandruk (drive from Pokhara)',
    endPoint: 'Nayapul / Jhinu Danda, then Pokhara',
    distanceKm: '≈ 70–90 km',
    walkHours: '5–7 hrs/day'
  },
  seo: {
    title: 'Annapurna Base Camp Trek — Nepal | Itinerary, Difficulty, Cost & Best Time',
    description: 'The Annapurna Base Camp (ABC) trek into the Annapurna Sanctuary: 10-day itinerary, difficulty and altitude, permits, cost, best season, packing and FAQ.'
  },
  overview: [
    'The Annapurna Base Camp trek — “ABC” — leads into the Annapurna Sanctuary, a high glacial basin ringed by Annapurna I (8,091 m), Annapurna South, Hiunchuli, Gangapurna, Machhapuchhre and more. Standing in the middle of it, with a 360-degree wall of ice and rock rising 3,000 m on every side, is one of the most concentrated mountain experiences in Nepal.',
    'The route climbs from the terraced Gurung hills above Pokhara — often starting with a night at the ridge village of Ghandruk or the sunrise hill of Poon Hill — then follows the deepening Modi Khola valley through bamboo and rhododendron forest to Machhapuchhre Base Camp and, an hour beyond, Annapurna Base Camp itself.',
    'The maximum altitude is a relatively modest 4,130 m, and the trek is shorter and less committing than the Circuit, but the valley narrows into an avalanche-prone corridor above Deurali, so the timing of that section — and the season — genuinely matter.'
  ],
  highlights: [
    'Annapurna Base Camp (4,130 m) inside a ring of 7,000–8,000 m peaks',
    'Sunrise on Annapurna and Machhapuchhre from the Sanctuary',
    'Machhapuchhre (“Fishtail”) — sacred and unclimbed — filling the valley head',
    'Gurung villages: Ghandruk, Chhomrong, Landruk',
    'Rhododendron forest in bloom (spring) and the hot springs at Jhinu Danda',
    'Optional Poon Hill sunrise add-on at the start'
  ],
  suitability: {
    physical: 6, technical: 1, altitude: 6, remoteness: 3,
    walkHours: '5–7 hours a day, with a lot of stone staircases',
    terrain: 'Endless stone steps in the lower valley, then a straightforward alpine trail. No scrambling.',
    weatherExposure: 'Moderate — but the upper valley is an avalanche path in heavy snow.',
    goodFor: [
      'Trekkers wanting a big-mountain payoff in under 10 days',
      'Fit first-timers — the altitude is moderate and the route is well-served',
      'Anyone based in Pokhara with a week to spare'
    ],
    notIdeal: [
      'Trekkers who dislike relentless stone-step climbing and descending',
      'Anyone trekking in mid-winter or right after heavy snow (avalanche risk above Deurali)',
      'Those seeking solitude in peak season — the Sanctuary is popular'
    ]
  },
  why: {
    lead: 'Few places let you stand completely surrounded by the high Himalaya. The Sanctuary is one.',
    paragraphs: [
      'The approach is a slow reveal: days in forest and terraced villages with the peaks appearing in slices, then the valley pinches to a gorge, and then it opens all at once into the Sanctuary. Machhapuchhre Base Camp is the first grandstand; Annapurna Base Camp, an hour higher, puts you in the centre of the bowl.',
      'Sunrise there is the thing everyone gets up for — Annapurna I turning gold while the basin is still in shadow — but the light on the walk out, back through the rhododendron with the hot springs at Jhinu waiting, is nearly as good.'
    ],
    gallery: [
      { img: '/images/annapurna.png', caption: 'The Annapurna Sanctuary from Base Camp' },
      { img: '/images/annapurna_real.jpg', caption: 'Machhapuchhre from the Modi Khola valley' },
      { img: '/images/itinerary.png', caption: 'Rhododendron forest on the climb from Chhomrong' }
    ]
  },
  passes: [],
  acclimatization: {
    days: [],
    note: 'At 4,130 m maximum, ABC does not need a dedicated acclimatisation day for most trekkers if the ascent is spread over three-plus days from Chhomrong. Sleeping at Deurali or MBC before ABC, rather than pushing straight through, keeps the gain sensible. Mild AMS is still possible — report headaches to your guide.'
  },
  itinerary: [
    { day: 1, title: 'Drive Pokhara to Ghandruk', from: 'Pokhara (820 m)', to: 'Ghandruk (1,940 m)', distanceKm: '4 km walk + drive', walkHours: '2 hr drive + 1–2 hr walk', startEle: 820, endEle: 1940, terrain: 'Road to Kimche, then stone steps', stay: 'Tea house', meals: 'B/L/D', highlights: ['Ghandruk — a large, handsome Gurung village', 'Annapurna South and Machhapuchhre close up'], tips: 'An easy start; visit the Gurung museum.' },
    { day: 2, title: 'Ghandruk to Chhomrong', from: 'Ghandruk (1,940 m)', to: 'Chhomrong (2,170 m)', distanceKm: '10 km', walkHours: '5–6 hrs', startEle: 1940, endEle: 2170, terrain: 'Descend to Kimrong Khola, long climb to Chhomrong', stay: 'Tea house', meals: 'B/L/D', highlights: ['The last permanent village on the route'], tips: 'More climbing than the net gain shows — lots of steps.' },
    { day: 3, title: 'Chhomrong to Dovan', from: 'Chhomrong (2,170 m)', to: 'Dovan (2,600 m)', distanceKm: '10 km', walkHours: '5–6 hrs', startEle: 2170, endEle: 2600, terrain: 'Steep drop and climb, then bamboo forest', stay: 'Tea house', meals: 'B/L/D', highlights: ['Into the Modi Khola gorge', 'Bamboo and rhododendron'], tips: 'Damp forest — keep gear in dry bags.' },
    { day: 4, title: 'Dovan to Machhapuchhre Base Camp', from: 'Dovan (2,600 m)', to: 'MBC (3,700 m)', distanceKm: '9 km', walkHours: '5–6 hrs', startEle: 2600, endEle: 3700, terrain: 'Forest, then the avalanche-prone corridor above Deurali', stay: 'Tea house', meals: 'B/L/D', highlights: ['The valley opens into the Sanctuary', 'Machhapuchhre overhead'], tips: 'Cross the Deurali–MBC section early; your guide checks conditions.' },
    { day: 5, title: 'MBC to Annapurna Base Camp; sunrise', from: 'MBC (3,700 m)', to: 'ABC (4,130 m)', distanceKm: '3 km', walkHours: '1.5–2 hrs', startEle: 3700, endEle: 4130, terrain: 'Gentle final climb into the basin', stay: 'Tea house', meals: 'B/L/D', highlights: ['Annapurna Base Camp', 'The full amphitheatre of peaks'], tips: 'Arrive by midday for the afternoon light, and be up for sunrise.' },
    { day: 6, title: 'ABC to Bamboo', from: 'ABC (4,130 m)', to: 'Bamboo (2,310 m)', distanceKm: '15 km', walkHours: '6–7 hrs', startEle: 4130, endEle: 2310, terrain: 'Long descent back through the gorge', stay: 'Tea house', meals: 'B/L/D', highlights: ['A last look back into the Sanctuary'], tips: 'A big descent — pace it and use poles.' },
    { day: 7, title: 'Bamboo to Jhinu Danda (hot springs)', from: 'Bamboo (2,310 m)', to: 'Jhinu Danda (1,780 m)', distanceKm: '9 km', walkHours: '5 hrs', startEle: 2310, endEle: 1780, terrain: 'Climb back to Chhomrong, then descend to Jhinu', stay: 'Tea house', meals: 'B/L/D', highlights: ['Natural hot springs by the river'], tips: 'The springs are a 20-minute walk below the village — worth it.' },
    { day: 8, title: 'Jhinu Danda to Nayapul, drive to Pokhara', from: 'Jhinu Danda (1,780 m)', to: 'Pokhara (820 m)', distanceKm: '11 km walk + drive', walkHours: '3–4 hrs + 1.5 hr drive', startEle: 1780, endEle: 820, terrain: 'River trail to the road head', stay: 'Hotel', meals: 'B/L', highlights: ['Back to lakeside Pokhara'], tips: 'A jeep can also meet you higher up at Kyumi/Siwai to shorten the day.' },
    { day: 9, title: 'Contingency / Pokhara day', from: 'Pokhara', to: 'Pokhara', distanceKm: '—', walkHours: '—', startEle: 820, endEle: 820, terrain: '—', stay: 'Hotel', meals: 'B', highlights: ['Spare day / Phewa Lake'], tips: 'Boat on the lake or paraglide if unused.' },
    { day: 10, title: 'Drive or fly Pokhara to Kathmandu', from: 'Pokhara', to: 'Kathmandu', distanceKm: '—', walkHours: '25 min flight / 6–7 hr drive', startEle: 820, endEle: 1400, terrain: 'Flight or highway', stay: 'Hotel', meals: 'B', highlights: ['Himalaya from the air on a clear day'], tips: '' }
  ],
  routePoints: [
    { name: 'Ghandruk', elevation: '1,940 m', day: 1, walkTime: '1–2 hrs from Kimche', stay: 'Many lodges', highlight: 'The largest Gurung village in the region', warning: '—' },
    { name: 'Chhomrong', elevation: '2,170 m', day: 2, walkTime: '5–6 hrs from Ghandruk', stay: 'Lodges, bakeries, gear shops', highlight: 'The gateway village; last resupply', warning: 'Endless stone steps in and out.' },
    { name: 'Deurali', elevation: '3,230 m', day: 4, walkTime: '3–4 hrs from Dovan', stay: 'Lodges', highlight: 'Last stop before the avalanche corridor', warning: 'The Deurali–MBC section is closed or escorted after heavy snow.' },
    { name: 'Machhapuchhre Base Camp (MBC)', elevation: '3,700 m', day: 4, walkTime: '2 hrs from Deurali', stay: 'A few lodges', highlight: 'First full Sanctuary view', warning: 'Cold; often the last night before ABC.' },
    { name: 'Annapurna Base Camp (ABC)', elevation: '4,130 m', day: 5, walkTime: '1.5–2 hrs from MBC', stay: 'Cluster of lodges', highlight: 'The centre of the Sanctuary', warning: 'Beds are limited and cold — book ahead in season.' }
  ],
  permits: [
    { name: 'Annapurna Conservation Area Permit (ACAP)', where: 'Pokhara or Kathmandu (NTB / ACAP), or checkpoints', feeNote: 'Fixed area fee — verify', notes: 'Carry passport and photos.' },
    { name: 'TIMS card', where: 'Pokhara or Kathmandu through a registered operator', feeNote: 'Fixed fee — verify', notes: 'Confirm current TIMS / guide requirements.' }
  ],
  cost: {
    note: 'A short, road-accessible trek from Pokhara — one of the better-value big-mountain treks. Confirm a quote for your dates.',
    tiers: [
      { name: 'Budget / teahouse', rangeUSD: '$650–$950', includes: ['Group guide', 'Pokhara–trailhead transport', 'ACAP + TIMS', 'Tea houses', 'Main meals'] },
      { name: 'Comfort', rangeUSD: '$1,000–$1,500', includes: ['Private guide + porter', 'Better lodges', 'Pokhara 4★', 'Pokhara–Kathmandu flight'] },
      { name: 'Premium', rangeUSD: '$1,800+', includes: ['Private trip', 'Poon Hill add-on', 'Lake-view Pokhara hotel', 'Helicopter option from the Sanctuary'] }
    ],
    breakdown: [
      { item: 'Permits', note: 'ACAP + TIMS' },
      { item: 'Transport', note: 'Jeep to and from the trailheads near Pokhara' },
      { item: 'Guide + porter', note: 'Per day' },
      { item: 'Lodging + meals', note: 'Rises with altitude; ABC is the priciest night' },
      { item: 'Tips', note: 'Customary at the end' }
    ],
    independentVsGuided: 'A guide is recommended — mainly for the avalanche-corridor timing above Deurali and to secure beds at MBC/ABC — and generally required under current Annapurna-region rules.'
  },
  transport: {
    steps: [
      { from: 'Pokhara', to: 'Ghandruk / Kande / Nayapul', mode: 'Private jeep', duration: '1.5–2.5 hrs', note: 'Several possible trailheads; your guide picks based on the itinerary and road conditions.' },
      { from: 'Jhinu / Nayapul', to: 'Pokhara', mode: 'Jeep', duration: '1.5–2.5 hrs', note: 'A jeep can meet you at Siwai/Kyumi to cut the last walking day.' }
    ],
    note: 'No domestic flight needed — everything runs from Pokhara, which is itself a 25-minute flight or 6–7 hour drive from Kathmandu.'
  },
  equipment: [
    { item: 'Sleeping bag to ≈ −10°C to −12°C', need: 'essential', note: 'MBC and ABC nights are cold.' },
    { item: 'Trekking poles', need: 'essential', note: 'The stone-step sections and the long descent day demand them.' },
    { item: 'Waterproof jacket + pack cover', need: 'essential', note: 'The lower valley is damp and prone to afternoon rain.' },
    { item: 'Microspikes', need: 'optional', note: 'Useful for snow near MBC/ABC in spring or from late autumn.' },
    { item: 'Swimwear + quick-dry towel', need: 'optional', note: 'For the Jhinu Danda hot springs on the way out.' }
  ],
  safety: {
    risks: [
      { name: 'Avalanche corridor above Deurali', note: 'The narrow section between Deurali and MBC crosses known avalanche paths. After heavy snow it is closed or crossed only early morning with a guide — this is the main reason to trek with one here.' },
      { name: 'Altitude', note: 'Modest at 4,130 m, but the climb from Chhomrong to ABC in two to three days can still bring mild AMS. Sleep at Deurali or MBC rather than pushing straight to ABC.' },
      { name: 'Slippery stone steps', note: 'The thousands of stone steps are hard on knees and treacherous when wet or icy.' },
      { name: 'Weather', note: 'The Sanctuary can cloud in for days; clear mornings are the norm and clear afternoons the exception.' }
    ],
    turnaround: 'If the avalanche corridor is unsafe, the trek waits at Deurali or turns around there — ABC is not worth crossing a loaded slope. Mild AMS means resting at MBC before deciding on the final push.',
    note: 'The route is popular and well-served; helicopter evacuation from MBC or ABC is straightforward in clear weather. Your guide checks avalanche conditions with the lodges before committing to the upper valley.'
  },
  faq: [
    { q: 'How difficult is the Annapurna Base Camp trek?', a: 'Moderate. There are no passes and the maximum altitude is 4,130 m, but the lower valley is a relentless series of stone staircases, and the descent day is long. Reasonable hill fitness is needed.' },
    { q: 'How high is Annapurna Base Camp?', a: '4,130 m. Machhapuchhre Base Camp, the usual last stop before it, is 3,700 m.' },
    { q: 'Is ABC good for beginners?', a: 'Yes — it is one of the best first big-mountain treks in Nepal: short, moderate altitude, well-served, with a spectacular payoff. Prepare for the stone steps.' },
    { q: 'How many days does the ABC trek take?', a: 'Seven to eight on the trail, or about 10 days including Pokhara and travel. A Poon Hill add-on brings it to 11–12.' },
    { q: 'When is the best time for the ABC trek?', a: 'March–April (rhododendron in bloom) and October–November (clearest skies). Avoid mid-winter and the weeks after heavy snowfall because of avalanche risk in the upper valley.' },
    { q: 'Do I need a guide and permits?', a: 'ACAP and TIMS permits are required. A guide is strongly recommended for the avalanche corridor and is generally required under current Annapurna rules.' },
    { q: 'Can I combine ABC with Poon Hill?', a: 'Yes — the classic combination starts with Ghorepani and the Poon Hill sunrise, then crosses to Chhomrong for ABC. Add 2–3 days.' },
    { q: 'Is there Wi-Fi and mobile coverage?', a: 'Coverage in the villages up to Chhomrong and patchily beyond; Wi-Fi for sale in many lodges. The upper Sanctuary is largely a dead zone.' },
    { q: 'Can I charge my phone?', a: 'Yes, for a fee in tea-house dining rooms, pricier higher up. Bring a power bank.' },
    { q: 'Are there ATMs?', a: 'No reliable ATMs on the route. Carry cash from Pokhara.' },
    { q: 'Can I shower?', a: 'Paid hot showers up to Deurali; a bowl of hot water at MBC and ABC. The Jhinu Danda hot springs on the way out are the real treat.' },
    { q: 'What food is available?', a: 'A broad tea-house menu — dal bhat, noodles, pasta, momos, and bakeries in Chhomrong. Eat vegetarian in the upper valley.' },
    { q: 'What if I get altitude sickness?', a: 'It is usually mild at these altitudes. Rest at MBC or descend to Deurali or Bamboo, all of which are low enough to recover. Serious signs mean immediate descent.' },
    { q: 'What is the avalanche risk really like?', a: 'Confined to the Deurali–MBC section and mainly a concern in and just after heavy snow. In the normal seasons, with a guide checking conditions, it is a managed risk rather than a constant danger.' }
  ],
  relatedTreks: ['mardi-himal', 'annapurna-circuit', 'upper-mustang', 'langtang-valley'],
  relatedDestinations: [
    { name: 'Poon Hill / Ghorepani', note: 'The classic sunrise ridge — combine at the start.' },
    { name: 'Pokhara', note: 'Phewa Lake, paragliding, the Peace Pagoda — the perfect wind-down.' },
    { name: 'Jhinu Danda hot springs', note: 'Built into the itinerary on the way out.' }
  ],
  hotelsNote: 'Trips usually include Kathmandu and Pokhara hotels; the trail is tea houses. Ask us about a lake-view Pokhara upgrade, the Poon Hill add-on or the Pokhara–Kathmandu flight.'
};

TREKS['mardi-himal'] = {
  slug: 'mardi-himal',
  popular: true,
  name: 'Mardi Himal Trek',
  tagline: 'A short high ridge under the Fishtail',
  province: 'gandaki',
  region: 'Annapurna',
  heroImage: '/images/annapurna_real.jpg',
  summary: 'A 7-day trek on a forested ridge east of the Annapurna Sanctuary, climbing above the treeline to Mardi Himal Base Camp (4,500 m) directly beneath Machhapuchhre — the best short, quiet, high-view trek from Pokhara.',
  stats: {
    duration: '7 days (4–5 on the trail)',
    difficulty: 'Moderate',
    maxAltitude: '4,500 m',
    maxAltitudePoint: 'Mardi Himal Base Camp (Upper Viewpoint)',
    bestSeason: 'Mar–Apr · Oct–Dec',
    startPoint: 'Kande / Phedi (drive from Pokhara)',
    endPoint: 'Sidhing / Lumre, then Pokhara',
    distanceKm: '≈ 35–45 km',
    walkHours: '4–6 hrs/day'
  },
  seo: {
    title: 'Mardi Himal Trek — Nepal | Short Annapurna Trek Itinerary, Cost & Best Time',
    description: 'The Mardi Himal trek near Pokhara: a short, quiet, high-viewpoint route under Machhapuchhre. 7-day itinerary, difficulty, altitude, permits, cost and FAQ.'
  },
  overview: [
    'Mardi Himal only opened as a tea-house trek in the last decade, and it has quickly become the pick of the short routes around Pokhara. It follows a single forested ridge — the one dividing the Modi Khola (ABC) valley from the Seti — climbing steadily through rhododendron to a string of small, well-run lodges perched on the crest: Forest Camp, Low Camp, High Camp.',
    'Above High Camp the trees end and the ridge narrows to a sharp path climbing to the Lower Viewpoint and then Mardi Himal Base Camp at 4,500 m, with Machhapuchhre’s fluted north face seemingly close enough to touch and the whole Annapurna South–Hiunchuli wall filling the western sky.',
    'It is short — four or five days of walking — with modest altitude and no technical ground, which makes it an ideal first Himalayan trek or a quick add-on to a Pokhara trip. The one catch is the exposed, sometimes icy final ridge above High Camp.'
  ],
  highlights: [
    'Mardi Himal Base Camp (4,500 m) directly under Machhapuchhre',
    'Ridge-crest lodges with sunrise and sunset over the Annapurnas',
    'Rhododendron and oak forest, often with langur monkeys and pheasants',
    'A genuinely quiet trail compared with ABC or Poon Hill',
    'Short enough to combine with Pokhara, Poon Hill or a rafting trip',
    'Low Camp and High Camp — some of the most scenically-sited lodges in Nepal'
  ],
  suitability: {
    physical: 5, technical: 2, altitude: 6, remoteness: 4,
    walkHours: '4–6 hours a day; the summit-ridge day is longer',
    terrain: 'Good forest trail, then a narrow, exposed ridge path above High Camp that can be snowy or icy.',
    weatherExposure: 'Moderate to high on the upper ridge — no shelter between High Camp and Base Camp.',
    goodFor: [
      'Trekkers with only 5–7 days',
      'Fit first-timers wanting a high viewpoint without a long expedition',
      'Anyone in Pokhara looking for a short, scenic trek'
    ],
    notIdeal: [
      'Trekkers uneasy on a narrow, exposed ridge, especially with snow',
      'Anyone wanting to reach 5,000 m or cross a pass',
      'Those expecting village culture — the ridge is lodges and forest, not settlements'
    ]
  },
  why: {
    lead: 'The shortest route in Nepal that puts you right under an 8,000 m wall.',
    paragraphs: [
      'Most short treks from Pokhara give you a distant panorama. Mardi puts you on a ridge that runs straight at Machhapuchhre, so the mountain grows day by day until, from Base Camp, it is a vertical mile of fluted ice directly overhead. Because the whole trek is on one crest, every lodge has the view, and sunrise from High Camp — the Annapurnas lighting up while the valleys stay dark — is worth the trip on its own.',
      'It is also refreshingly uncommercial: small family lodges, a narrow trail, and a fraction of the foot traffic of the nearby classics.'
    ],
    gallery: [
      { img: '/images/annapurna_real.jpg', caption: 'Machhapuchhre from the Mardi Himal ridge' },
      { img: '/images/annapurna.png', caption: 'The upper ridge above High Camp' },
      { img: '/images/itinerary.png', caption: 'Rhododendron forest on the lower ridge' }
    ]
  },
  passes: [],
  acclimatization: {
    days: [],
    note: 'At 4,500 m maximum and reached over three days from ~1,700 m, Mardi rarely needs a dedicated rest day. Sleeping at High Camp (3,580 m) before the Base Camp push, rather than day-tripping from Low Camp, keeps the gain reasonable. Mild AMS is still possible on the summit ridge — turn back if it develops.'
  },
  itinerary: [
    { day: 1, title: 'Drive Pokhara to Kande, trek to Forest Camp', from: 'Pokhara (820 m)', to: 'Forest Camp / Kokar (2,550 m)', distanceKm: '9 km', walkHours: '5–6 hrs', startEle: 820, endEle: 2550, terrain: 'Road to Kande, climb via Australian Camp and Pothana into forest', stay: 'Tea house', meals: 'B/L/D', highlights: ['Australian Camp panorama', 'Into deep rhododendron forest'], tips: 'A big climbing day — settle into a slow pace.' },
    { day: 2, title: 'Forest Camp to Low Camp', from: 'Forest Camp (2,550 m)', to: 'Low Camp (2,970 m)', distanceKm: '6 km', walkHours: '3–4 hrs', startEle: 2550, endEle: 2970, terrain: 'Ridge-crest forest trail', stay: 'Tea house', meals: 'B/L/D', highlights: ['First clear Machhapuchhre views', 'Moss forest'], tips: 'A short day — arrive for the afternoon light.' },
    { day: 3, title: 'Low Camp to High Camp', from: 'Low Camp (2,970 m)', to: 'High Camp (3,580 m)', distanceKm: '5 km', walkHours: '3–4 hrs', startEle: 2970, endEle: 3580, terrain: 'Out of the trees onto open ridge', stay: 'Tea house', meals: 'B/L/D', highlights: ['The Annapurna wall opens up', 'Sunset from the ridge'], tips: 'Short again by design — this is the altitude-gain day.' },
    { day: 4, title: 'High Camp to Mardi Himal Base Camp and back; descend to Badal Danda', from: 'High Camp (3,580 m)', to: 'Badal Danda (3,210 m)', distanceKm: '12 km', walkHours: '7–8 hrs', startEle: 3580, endEle: 3210, terrain: 'Narrow, exposed ridge to 4,500 m, then return and descend', stay: 'Tea house', meals: 'B/L/D', highlights: ['Mardi Himal Base Camp (4,500 m)', 'Machhapuchhre directly overhead'], tips: 'Pre-dawn start. Turn around at the Lower Viewpoint if the ridge is icy or you feel the altitude.' },
    { day: 5, title: 'Badal Danda to Sidhing, drive to Pokhara', from: 'Badal Danda (3,210 m)', to: 'Pokhara (820 m)', distanceKm: '10 km walk + drive', walkHours: '4–5 hrs + 2 hr drive', startEle: 3210, endEle: 820, terrain: 'Steep forest descent to the road at Sidhing/Lumre', stay: 'Hotel', meals: 'B/L', highlights: ['Back to lakeside Pokhara by evening'], tips: 'The descent is steep — poles help.' },
    { day: 6, title: 'Contingency / Pokhara day', from: 'Pokhara', to: 'Pokhara', distanceKm: '—', walkHours: '—', startEle: 820, endEle: 820, terrain: '—', stay: 'Hotel', meals: 'B', highlights: ['Spare day / Phewa Lake'], tips: 'Paragliding or a lake boat if unused.' },
    { day: 7, title: 'Drive or fly Pokhara to Kathmandu', from: 'Pokhara', to: 'Kathmandu', distanceKm: '—', walkHours: '25 min flight / 6–7 hr drive', startEle: 820, endEle: 1400, terrain: 'Flight or highway', stay: 'Hotel', meals: 'B', highlights: ['The Annapurnas from the air'], tips: '' }
  ],
  routePoints: [
    { name: 'Forest Camp (Kokar)', elevation: '2,550 m', day: 1, walkTime: '5–6 hrs from Kande', stay: 'A few ridge lodges', highlight: 'Deep, mossy rhododendron forest', warning: 'Damp — dry bags for everything.' },
    { name: 'Low Camp', elevation: '2,970 m', day: 2, walkTime: '3–4 hrs from Forest Camp', stay: 'Well-sited lodges', highlight: 'First big Machhapuchhre view', warning: '—' },
    { name: 'High Camp', elevation: '3,580 m', day: 3, walkTime: '3–4 hrs from Low Camp', stay: 'Cluster of lodges on the open ridge', highlight: 'Sunrise and sunset over the Annapurnas', warning: 'Beds fill in season; cold and windy on the crest.' },
    { name: 'Mardi Himal Base Camp', elevation: '4,500 m', day: 4, walkTime: '3–4 hrs up from High Camp', stay: 'Day visit only', highlight: 'Directly beneath Machhapuchhre', warning: 'The final ridge is narrow and exposed; icy after snow, and there is no shelter.' }
  ],
  permits: [
    { name: 'Annapurna Conservation Area Permit (ACAP)', where: 'Pokhara or Kathmandu (NTB / ACAP)', feeNote: 'Fixed area fee — verify', notes: 'Carry passport and photos.' },
    { name: 'TIMS card', where: 'Through a registered operator', feeNote: 'Fixed fee — verify', notes: 'Confirm current TIMS / guide requirements.' }
  ],
  cost: {
    note: 'The shortest and cheapest of the Annapurna high-view treks. Confirm a quote for your dates.',
    tiers: [
      { name: 'Budget / teahouse', rangeUSD: '$450–$700', includes: ['Group guide', 'Pokhara transfers', 'ACAP + TIMS', 'Tea houses', 'Main meals'] },
      { name: 'Comfort', rangeUSD: '$750–$1,150', includes: ['Private guide + porter', 'Best ridge lodges', 'Pokhara 4★', 'Pokhara–Kathmandu flight'] },
      { name: 'Premium', rangeUSD: '$1,400+', includes: ['Private trip', 'Lake-view Pokhara hotel', 'Combined with Poon Hill', 'Extra rest day'] }
    ],
    breakdown: [
      { item: 'Permits', note: 'ACAP + TIMS' },
      { item: 'Transport', note: 'Short jeep transfers from Pokhara' },
      { item: 'Guide + porter', note: 'Per day' },
      { item: 'Lodging + meals', note: '4 nights, moderate altitude' },
      { item: 'Tips', note: 'Customary at the end' }
    ],
    independentVsGuided: 'The lower ridge is easy to follow, but the exposed section above High Camp — especially with snow — is a real reason to have a guide, as is securing a High Camp bed in season. A guide is generally required in the Annapurna region under current rules.'
  },
  transport: {
    steps: [
      { from: 'Pokhara', to: 'Kande / Phedi', mode: 'Private jeep or taxi', duration: '45–60 min', note: 'The trek starts with a short climb from the road.' },
      { from: 'Sidhing / Lumre', to: 'Pokhara', mode: 'Jeep', duration: '2–3 hrs', note: 'The exit road is rough; a jeep can meet you at Sidhing.' }
    ],
    note: 'Everything runs from Pokhara — no domestic flight required for the trek itself.'
  },
  equipment: [
    { item: 'Sleeping bag to ≈ −10°C', need: 'essential', note: 'High Camp is cold and exposed.' },
    { item: 'Microspikes', need: 'recommended', note: 'The summit ridge is frequently icy in spring and from late autumn.' },
    { item: 'Trekking poles', need: 'essential', note: 'For the steep exit descent and the exposed ridge.' },
    { item: 'Windproof shell + warm hat and gloves', need: 'essential', note: 'The upper ridge has no shelter.' },
    { item: 'Headlamp', need: 'essential', note: 'For the pre-dawn Base Camp start.' }
  ],
  safety: {
    risks: [
      { name: 'The summit ridge', note: 'Above High Camp the path narrows and drops away on both sides. With snow or ice it is genuinely exposed — microspikes, a guide, and a willingness to turn back at the Lower Viewpoint all matter.' },
      { name: 'Altitude', note: 'Modest at 4,500 m, but reached quickly, and the summit-ridge day is a big effort. Mild AMS is possible — descend if it develops.' },
      { name: 'Weather', note: 'The ridge clouds over most afternoons; the Base Camp push must be an early one for both views and safety.' },
      { name: 'Damp forest and slippery steps', note: 'The lower ridge stays wet; the exit descent is steep and greasy in rain.' }
    ],
    turnaround: 'If the ridge above High Camp is iced up or the weather is poor, the Lower Viewpoint (≈ 3,900 m) is a fine, safer objective — the Machhapuchhre view from there is nearly as good and the exposure is far less.',
    note: 'The trek is short and never far from High Camp or Low Camp; helicopter evacuation from the ridge is possible in clear weather.'
  },
  faq: [
    { q: 'How difficult is the Mardi Himal trek?', a: 'Moderate. The forest sections are straightforward, but the trek climbs to 4,500 m and the final ridge above High Camp is narrow and exposed, especially with snow.' },
    { q: 'How high is Mardi Himal Base Camp?', a: '4,500 m at the Upper Viewpoint. The Lower Viewpoint, a common turnaround, is around 3,900 m.' },
    { q: 'Is Mardi Himal good for beginners?', a: 'Yes — it is one of the best short first treks in Nepal. The main thing to be aware of is the exposed summit ridge; a beginner should treat the Lower Viewpoint as a perfectly good goal.' },
    { q: 'How many days does the Mardi Himal trek take?', a: 'Four to five days on the trail, or about 7 days including Pokhara and travel. It combines well with Poon Hill for a 9–10 day trip.' },
    { q: 'When is the best time to trek Mardi Himal?', a: 'March–April and October–December. It holds up into early winter because the overnight altitude is moderate, though the summit ridge gets icy.' },
    { q: 'Do I need a guide and permits?', a: 'ACAP and TIMS permits are required. A guide is recommended for the exposed ridge and to get a High Camp bed, and generally required in the Annapurna region.' },
    { q: 'Is there Wi-Fi and mobile coverage?', a: 'Patchy coverage on the ridge; some lodges sell Wi-Fi. Expect to be mostly offline above Low Camp.' },
    { q: 'Can I charge my phone?', a: 'Yes, for a fee in the ridge lodges. Bring a power bank.' },
    { q: 'Are there ATMs?', a: 'No — carry cash from Pokhara.' },
    { q: 'Can I shower?', a: 'Paid hot showers at Forest, Low and (sometimes) High Camp. Higher is a bowl of hot water.' },
    { q: 'What is the accommodation like?', a: 'Small, family-run ridge lodges — some of the most scenically-placed in Nepal — with simple twin rooms and a shared dining room.' },
    { q: 'Can I combine Mardi Himal with other treks?', a: 'Yes — most often with the Poon Hill / Ghorepani ridge, and it also pairs well with an ABC trek for a fuller Annapurna trip.' },
    { q: 'What if the summit ridge is too icy or exposed for me?', a: 'Stop at the Lower Viewpoint. It is a legitimate, beautiful objective, and your guide will support that decision.' }
  ],
  relatedTreks: ['annapurna-base-camp', 'annapurna-circuit', 'upper-mustang', 'langtang-valley'],
  relatedDestinations: [
    { name: 'Poon Hill / Ghorepani', note: 'The classic pairing — add 2–3 days for the sunrise ridge.' },
    { name: 'Pokhara', note: 'Phewa Lake, paragliding and the Peace Pagoda, right where the trek ends.' },
    { name: 'Australian Camp', note: 'On the route out of Kande — a great short viewpoint in its own right.' }
  ],
  hotelsNote: 'Trips usually include Kathmandu and Pokhara hotels; the trail is ridge tea houses. Ask us about a lake-view Pokhara hotel or a Poon Hill add-on.'
};

TREKS['upper-mustang'] = {
  slug: 'upper-mustang',
  popular: true,
  name: 'Upper Mustang Trek',
  tagline: 'The walled kingdom in the Annapurna rain-shadow',
  province: 'gandaki',
  region: 'Mustang',
  heroImage: '/images/hero-mountain.jpg',
  summary: 'A 12–14 day restricted-area trek north from Jomsom into the former Kingdom of Lo — a high, arid, Tibetan-Buddhist plateau of eroded canyons, cliff-cut cave dwellings and fortress villages, to the walled capital of Lo Manthang (3,840 m).',
  stats: {
    duration: '12–14 days (10–12 on the trail)',
    difficulty: 'Moderate',
    maxAltitude: '≈ 4,200 m',
    maxAltitudePoint: 'Passes near Lo Manthang / Dhi',
    bestSeason: 'Mar–early Nov (including monsoon — it is in the rain-shadow)',
    startPoint: 'Jomsom (2,720 m), flight or drive from Pokhara',
    endPoint: 'Jomsom',
    distanceKm: '≈ 110–130 km',
    walkHours: '5–7 hrs/day'
  },
  seo: {
    title: 'Upper Mustang Trek — Nepal | Lo Manthang Itinerary, Permit Cost & Best Time',
    description: 'The Upper Mustang trek to the walled city of Lo Manthang: restricted-area permit and cost, 12–14 day itinerary, difficulty, best time (including monsoon) and FAQ.'
  },
  overview: [
    'Upper Mustang — the old Kingdom of Lo — sits in the deep rain-shadow of the Annapurna and Dhaulagiri massifs, on the Tibetan plateau’s southern edge. It is culturally and geographically Tibetan: a high desert of wind-carved cliffs, whitewashed villages, ancient Bön and Buddhist monasteries, and thousands of man-made caves cut into the canyon walls, some still lived in, some holding centuries-old murals.',
    'It is a restricted area — you need a special permit and a licensed guide, and trekking parties must have at least two members. The route runs north from Jomsom up the Kali Gandaki, then climbs onto the plateau through Chele, Syangboche, Ghami and Tsarang to Lo Manthang, the still-inhabited walled capital, where most itineraries spend two nights exploring the palace, the great monasteries and the nearby cave-temple of Chhoser. Many trips return by a different, more easterly route via Dhi and Yara for the Luri Gompa cave shrine.',
    'The altitude is moderate — rarely above 4,000 m — and the walking is not technical, but the days are long, exposed to a relentless afternoon wind, and the landscape is genuinely harsh. Crucially, because it is in the rain-shadow, Upper Mustang is one of the few Nepal treks that works right through the summer monsoon.'
  ],
  highlights: [
    'Lo Manthang — a walled, inhabited medieval capital on the Tibetan plateau',
    'The sky-caves of Chhoser and the cliff-monastery of Luri Gompa',
    'Tibetan Buddhist monasteries with rare 15th-century murals (Thubchen, Jampa, Tsarang)',
    'Eroded canyon country in ochre, grey and deep red',
    'A living Tibetan culture, largely closed to outsiders until 1992',
    'A trek that works in the monsoon, when the rest of Nepal is rained out'
  ],
  suitability: {
    physical: 6, technical: 1, altitude: 6, remoteness: 6,
    walkHours: '5–7 hours a day, frequently into a strong headwind',
    terrain: 'Trails and jeep track across high desert, canyon climbs and descents, several 3,800–4,200 m ridges. No scrambling.',
    weatherExposure: 'High for wind and sun; very low for rain. Little shelter on the plateau.',
    goodFor: [
      'Trekkers drawn to culture, history and landscape over peak-bagging',
      'Anyone wanting a trek during the June–August monsoon',
      'Moderately fit walkers comfortable with long, windy, exposed days'
    ],
    notIdeal: [
      'Trekkers wanting glaciers, high passes and 8,000 m base camps',
      'Solo trekkers — the restricted-area permit needs a group of two or more',
      'Anyone who struggles with heat, sun and dust'
    ]
  },
  why: {
    lead: 'This is the closest you can get to old Tibet without leaving Nepal.',
    paragraphs: [
      'Lo Manthang has been continuously inhabited for six centuries, and walking through its gate into the lanes of whitewashed houses, chortens and monastery courtyards is like stepping outside your own century. The murals in Thubchen and Jampa monasteries — restored over years by international conservators — are among the finest surviving Tibetan Buddhist art anywhere.',
      'The landscape matches it: a wind-scoured tableland of eroded pinnacles and striped cliffs, with the white summits of the Annapurnas and Nilgiri hanging to the south. And because the mountains wring the rain out before it reaches here, you can do this trek in July while the rest of the country is under cloud.'
    ],
    gallery: [
      { img: '/images/hero-mountain.jpg', caption: 'The eroded canyon country of Upper Mustang' },
      { img: '/images/annapurna.png', caption: 'Chortens on the trail toward Lo Manthang' },
      { img: '/images/annapurna_real.jpg', caption: 'Nilgiri from the Mustang plateau' }
    ]
  },
  passes: [{ name: 'Nyi La / Chogo La (approach ridges)', elevation: '≈ 4,000–4,200 m', day: 6 }],
  acclimatization: {
    days: [4],
    note: 'The climb from Jomsom (2,720 m) onto the plateau is gradual, and the maximum altitude is around 4,200 m, so a single easy day — often the second night at Syangboche or a short day into Ghami — is usually enough. Two nights at Lo Manthang (3,840 m) also serve as a rest.'
  },
  itinerary: [
    { day: 1, title: 'Fly / drive Pokhara to Jomsom, trek to Kagbeni', from: 'Pokhara (820 m)', to: 'Kagbeni (2,810 m)', distanceKm: '9 km', walkHours: '3 hrs', startEle: 820, endEle: 2810, terrain: 'Flight, then Kali Gandaki riverbed trail', stay: 'Tea house', meals: 'B/L/D', highlights: ['Kagbeni — the medieval gateway village', 'The Upper Mustang permit checkpoint'], tips: 'Jomsom flights are morning-only; the valley wind builds after midday.' },
    { day: 2, title: 'Kagbeni to Chele', from: 'Kagbeni (2,810 m)', to: 'Chele (3,050 m)', distanceKm: '13 km', walkHours: '5–6 hrs', startEle: 2810, endEle: 3050, terrain: 'Riverbed then a climb onto the plateau edge', stay: 'Tea house', meals: 'B/L/D', highlights: ['First red-cliff canyons', 'Tangbe and Chhusang villages'], tips: 'You cross into restricted Mustang beyond Kagbeni.' },
    { day: 3, title: 'Chele to Syangboche', from: 'Chele (3,050 m)', to: 'Syangboche (3,800 m)', distanceKm: '14 km', walkHours: '6–7 hrs', startEle: 3050, endEle: 3800, terrain: 'A series of canyon climbs and passes', stay: 'Tea house', meals: 'B/L/D', highlights: ['Taklam La and Dajori La', 'Cave-riddled cliffs at Ramchung'], tips: 'The most up-and-down day of the trek.' },
    { day: 4, title: 'Syangboche to Ghami', from: 'Syangboche (3,800 m)', to: 'Ghami (3,520 m)', distanceKm: '12 km', walkHours: '5 hrs', startEle: 3800, endEle: 3520, terrain: 'Plateau trail past Nyi La', stay: 'Tea house', meals: 'B/L/D', highlights: ['Nyi La (≈ 4,010 m)', 'The long Ghami mani wall — one of the longest in Nepal'], tips: 'An easier day; good for acclimatisation.' },
    { day: 5, title: 'Ghami to Tsarang', from: 'Ghami (3,520 m)', to: 'Tsarang (3,560 m)', distanceKm: '12 km', walkHours: '5 hrs', startEle: 3520, endEle: 3560, terrain: 'Cross the Ghami Khola, climb to the Tsarang plateau', stay: 'Tea house', meals: 'B/L/D', highlights: ['Tsarang’s fortress-monastery and old palace', 'Painted chortens'], tips: 'Visit the Tsarang gompa — the caretaker will usually open it.' },
    { day: 6, title: 'Tsarang to Lo Manthang', from: 'Tsarang (3,560 m)', to: 'Lo Manthang (3,840 m)', distanceKm: '13 km', walkHours: '5–6 hrs', startEle: 3560, endEle: 3840, terrain: 'Plateau trail over the Lo La', stay: 'Tea house / guesthouse', meals: 'B/L/D', highlights: ['First view of the walled city from the Lo La', 'Entering Lo Manthang'], tips: 'Arrive with the afternoon free to walk the walls.' },
    { day: 7, title: 'Lo Manthang — exploration day', from: 'Lo Manthang (3,840 m)', to: 'Lo Manthang (3,840 m)', distanceKm: '6–14 km', walkHours: '4–6 hrs', startEle: 3840, endEle: 3840, terrain: 'City walk + excursion to Chhoser caves or Namgyal', stay: 'Tea house / guesthouse', meals: 'B/L/D', highlights: ['Thubchen and Jampa monasteries', 'The Chhoser sky-caves (Jhong Cave)', 'The King’s palace'], tips: 'A local guide inside the monasteries is well worth arranging.' },
    { day: 8, title: 'Lo Manthang to Dhi (return via the eastern route)', from: 'Lo Manthang (3,840 m)', to: 'Dhi (3,300 m)', distanceKm: '15 km', walkHours: '6–7 hrs', startEle: 3840, endEle: 3300, terrain: 'Passes over toward the Kali Gandaki’s east bank', stay: 'Tea house', meals: 'B/L/D', highlights: ['A quieter, wilder return line', 'Yak herds and eroded badlands'], tips: 'The eastern route is more scenic and less travelled than retracing the way in.' },
    { day: 9, title: 'Dhi to Yara / Luri Gompa excursion', from: 'Dhi (3,300 m)', to: 'Yara (3,650 m)', distanceKm: '10 km', walkHours: '4–5 hrs + side trip', startEle: 3300, endEle: 3650, terrain: 'River crossing and climb; side trip to the Luri cave-gompa', stay: 'Tea house', meals: 'B/L/D', highlights: ['Luri Gompa — a chorten inside a cliff cave with 13th-century murals'], tips: 'The Luri side trip is the highlight of the return.' },
    { day: 10, title: 'Yara to Tange / Tetang', from: 'Yara (3,650 m)', to: 'Tetang (3,040 m)', distanceKm: '17 km', walkHours: '7–8 hrs', startEle: 3650, endEle: 3040, terrain: 'A long, remote day across side canyons', stay: 'Tea house / home-stay', meals: 'B/L/D', highlights: ['The wildest, emptiest section of the trek'], tips: 'A big day — carry extra water and snacks.' },
    { day: 11, title: 'Tetang to Muktinath, drive to Jomsom', from: 'Tetang (3,040 m)', to: 'Jomsom (2,720 m)', distanceKm: '12 km walk + drive', walkHours: '5–6 hrs + 1 hr drive', startEle: 3040, endEle: 2720, terrain: 'Climb to the Gyu La, descend to Muktinath, jeep to Jomsom', stay: 'Tea house', meals: 'B/L/D', highlights: ['Muktinath temple', 'Rejoin the Annapurna Circuit trail'], tips: 'The Gyu La (≈ 4,077 m) is the last climb.' },
    { day: 12, title: 'Fly / drive Jomsom to Pokhara', from: 'Jomsom (2,720 m)', to: 'Pokhara (820 m)', distanceKm: '—', walkHours: '20 min flight / 6–8 hr drive', startEle: 2720, endEle: 820, terrain: 'Mountain flight or jeep', stay: 'Hotel', meals: 'B', highlights: ['Dhaulagiri from the air'], tips: 'Keep a buffer day for Jomsom weather.' }
  ],
  routePoints: [
    { name: 'Kagbeni', elevation: '2,810 m', day: 1, walkTime: '3 hrs from Jomsom', stay: 'Lodges', highlight: 'The gateway to Upper Mustang and the permit checkpoint', warning: 'You cannot go north of here without the restricted-area permit and a guide.' },
    { name: 'Syangboche', elevation: '3,800 m', day: 3, walkTime: '6–7 hrs from Chele', stay: 'A few basic lodges', highlight: 'High point of the western approach', warning: 'Exposed and windy; limited food.' },
    { name: 'Tsarang', elevation: '3,560 m', day: 5, walkTime: '5 hrs from Ghami', stay: 'Lodges', highlight: 'Fortress-monastery and former royal palace', warning: '—' },
    { name: 'Lo Manthang', elevation: '3,840 m', day: 6, walkTime: '5–6 hrs from Tsarang', stay: 'Guesthouses inside and outside the walls', highlight: 'The walled capital — plan two nights', warning: 'Monasteries keep limited opening hours; arrange a local guide.' },
    { name: 'Luri Gompa', elevation: '≈ 3,900 m', day: 9, walkTime: 'Side trip from Yara', highlight: 'A cave-chorten with medieval murals', warning: 'The final approach is a short steep scramble.' }
  ],
  permits: [
    { name: 'Upper Mustang Restricted Area Permit', where: 'Kathmandu or Pokhara, through a licensed operator only', feeNote: 'Per-person fee for the first 10 days plus a daily rate after — a significant sum, set by the government; verify', notes: 'Requires a group of at least two trekkers and a licensed guide. Independent trekking is not permitted.' },
    { name: 'Annapurna Conservation Area Permit (ACAP)', where: 'Kathmandu or Pokhara (NTB / ACAP)', feeNote: 'Fixed area fee — verify', notes: 'Also required, in addition to the restricted-area permit.' }
  ],
  cost: {
    note: 'The restricted-area permit alone is one of the largest single costs of any Nepal trek. Confirm a quote for your dates and group size.',
    tiers: [
      { name: 'Group / teahouse', rangeUSD: '$1,900–$2,600', includes: ['Licensed guide', 'Restricted-area + ACAP permits', 'Jomsom flights', 'Tea houses', 'Main meals'] },
      { name: 'Comfort', rangeUSD: '$2,700–$3,600', includes: ['Private guide + porter', 'Best available lodging in Lo Manthang', 'Pokhara 4★', 'Monastery guide fees'] },
      { name: 'Premium', rangeUSD: '$4,000+', includes: ['Private trip', 'Cultural / art-history guide', 'Jeep support option', 'Extra Lo Manthang days'] }
    ],
    breakdown: [
      { item: 'Restricted-area permit', note: 'Per person, tiered by days — the dominant cost' },
      { item: 'ACAP permit', note: 'Fixed, additional' },
      { item: 'Jomsom flights', note: 'Pokhara–Jomsom return, weather-sensitive' },
      { item: 'Guide (+ porter)', note: 'Per day; a guide is mandatory here' },
      { item: 'Lodging + meals', note: 'Simple lodges; food is dearer this far from a road' },
      { item: 'Monastery / site fees', note: 'Small entry and local-guide fees at Lo Manthang' }
    ],
    independentVsGuided: 'Independent trekking is not allowed. The restricted-area permit is issued only to groups of two or more travelling with a licensed guide through a registered operator.'
  },
  transport: {
    steps: [
      { from: 'Pokhara', to: 'Jomsom', mode: 'Flight (~20 min) or jeep (6–8 hrs)', duration: '20 min / 6–8 hrs', note: 'Jomsom flights are morning-only and cancel readily; the jeep road up the Kali Gandaki is rough and long.' },
      { from: 'Jomsom', to: 'Kagbeni', mode: 'On foot (or short jeep)', duration: '2–3 hrs', note: 'A jeep road now runs deep into Mustang, which shortens some itineraries but also means sharing sections with vehicles.' }
    ],
    note: 'A road now reaches Lo Manthang. Purists walk it all; others use the jeep for the dullest, dustiest stretches. Discuss the balance with your operator.'
  },
  equipment: [
    { item: 'Wind- and dust-proof shell', need: 'essential', note: 'The plateau wind is relentless from late morning.' },
    { item: 'Buff / face cover + goggles or wrap sunglasses', need: 'essential', note: 'Blowing dust and grit are the defining discomfort of this trek.' },
    { item: 'Sleeping bag to ≈ −10°C', need: 'essential', note: 'Nights are cold on the plateau even in summer.' },
    { item: 'High-SPF sunscreen + lip balm', need: 'essential', note: 'The sun at altitude in a dry, reflective landscape is fierce.' },
    { item: 'Lots of water capacity + treatment', need: 'essential', note: 'Villages are far apart and the air is very dry.' }
  ],
  safety: {
    risks: [
      { name: 'Wind, sun and dehydration', note: 'The main hazards are environmental, not altitude. Long exposed days into a headwind, intense UV and very dry air mean you must drink far more than feels necessary.' },
      { name: 'Altitude', note: 'Moderate — rarely above 4,200 m — but reached over several long days. Report headaches; the one easy day exists for a reason.' },
      { name: 'Remoteness', note: 'Villages are far apart and facilities are basic. Evacuation is by helicopter to Jomsom or Pokhara.' },
      { name: 'Jomsom flights', note: 'The valley’s wind grounds flights regularly. Keep a buffer day at each end.' },
      { name: 'Jeep-track sections', note: 'Where the trail follows the road, dust and vehicles are unpleasant — a good operator routes around them where alternatives exist.' }
    ],
    turnaround: 'The trek has no committing pass or crux, so “turning around” usually means taking the jeep for a section rather than abandoning the trip. If someone is unwell, descending toward Jomsom is straightforward from anywhere on the route.',
    note: 'Carry more water and sun protection than you think you need. Helicopter evacuation is available to Jomsom in clear weather; the Jomsom valley wind is the main constraint on timing.'
  },
  faq: [
    { q: 'Do I need a special permit for Upper Mustang?', a: 'Yes. Upper Mustang is a restricted area requiring a Restricted Area Permit (a substantial per-person fee), plus the ACAP permit. You must trek with a licensed guide and in a group of at least two; independent trekking is not allowed.' },
    { q: 'How much does the Upper Mustang permit cost?', a: 'The restricted-area permit is charged per person for the first 10 days, with a daily rate after that, and is one of the most expensive trekking permits in Nepal. The exact figure is set by the government — confirm the current amount with your operator.' },
    { q: 'How difficult is the Upper Mustang trek?', a: 'Moderate. The altitude stays around 4,000 m and there is no technical ground, but the days are long and exposed, and the afternoon wind and dust are wearing.' },
    { q: 'How high does the trek go?', a: 'Around 4,000–4,200 m on the approach ridges. Lo Manthang itself is 3,840 m.' },
    { q: 'Can I trek Upper Mustang during the monsoon?', a: 'Yes — this is its stand-out feature. Upper Mustang lies in the Annapurna–Dhaulagiri rain-shadow, so June–August is dry, warm and a legitimate season when the rest of Nepal is rained out. It can be windy and dusty.' },
    { q: 'When is the best time to go?', a: 'March–May and September–early November for the mildest conditions; June–August works because of the rain-shadow. The Tiji festival at Lo Manthang (spring) is a special time to visit.' },
    { q: 'How many days does it take?', a: 'Ten to twelve on the trail, or 12–14 days including Pokhara and Jomsom travel, depending on whether you walk or jeep the road sections and whether you take the eastern return route.' },
    { q: 'Is there a road to Lo Manthang now?', a: 'Yes — a rough jeep road reaches the city. You can still walk the whole way on trails; many trekkers use the jeep only for the least interesting stretches.' },
    { q: 'What is the accommodation like?', a: 'Simple tea houses and guesthouses — clean and friendly but basic, with limited menus and cold nights. Lo Manthang has the best choice.' },
    { q: 'Is there mobile coverage and Wi-Fi?', a: 'Coverage in the larger villages and Lo Manthang; Wi-Fi for sale in some lodges. Patchy elsewhere.' },
    { q: 'Can I charge my devices?', a: 'Yes, for a fee in most lodges. Bring a power bank for the long days.' },
    { q: 'Are there ATMs?', a: 'No. Carry all your cash from Pokhara.' },
    { q: 'What will I see in Lo Manthang?', a: 'The walled city itself, the King’s palace, and the Thubchen, Jampa and Chode monasteries with their restored medieval murals, plus day trips to the Chhoser sky-caves and Namgyal monastery.' },
    { q: 'Can I combine it with the Annapurna Circuit?', a: 'Yes — the routes meet at Kagbeni. A common plan is to walk the Circuit over the Thorong La to Muktinath, then continue into Upper Mustang, though you still need the restricted-area permit and a guide for the Mustang section.' },
    { q: 'What if I get altitude sickness?', a: 'Descend toward Jomsom, which is straightforward from anywhere on the route. Given the moderate altitude, serious AMS is uncommon here, but report symptoms early.' }
  ],
  relatedTreks: ['annapurna-circuit', 'annapurna-base-camp', 'upper-dolpo', 'tsum-valley'],
  relatedDestinations: [
    { name: 'Muktinath', note: 'On the route out — the temple sacred to Hindus and Buddhists.' },
    { name: 'Marpha & the Kali Gandaki', note: 'The apple-orchard village and the world’s deepest gorge, on the Jomsom approach.' },
    { name: 'Pokhara', note: 'The staging city — lake, paragliding, and flights to Jomsom.' }
  ],
  hotelsNote: 'Trips include Kathmandu and Pokhara hotels; the trail is simple tea houses and guesthouses. Time your trek for the Tiji festival at Lo Manthang if you can — ask us for the dates, which follow the Tibetan calendar.'
};

TREKS['manaslu-circuit'] = {
  slug: 'manaslu-circuit',
  popular: true,
  name: 'Manaslu Circuit Trek',
  tagline: 'Around the eighth-highest mountain, over the Larke La',
  province: 'gandaki',
  region: 'Manaslu',
  heroImage: '/images/manaslu_real.jpg',
  summary: 'An 18-day restricted-area trek circling Manaslu (8,163 m) — up the Budhi Gandaki gorge through Gurung and then Tibetan-Buddhist villages, over the Larke La (5,106 m), and down into the Annapurna region. A wilder, quieter alternative to the Annapurna Circuit.',
  stats: {
    duration: '18 days (14–15 on the trail)',
    difficulty: 'Strenuous',
    maxAltitude: '5,106 m',
    maxAltitudePoint: 'Larke La (Larkya La)',
    bestSeason: 'Mar–May · Sep–Nov',
    startPoint: 'Machha Khola / Soti Khola (drive from Kathmandu)',
    endPoint: 'Dharapani, then Besisahar / Pokhara',
    distanceKm: '≈ 160–180 km',
    walkHours: '6–8 hrs/day'
  },
  seo: {
    title: 'Manaslu Circuit Trek — Nepal | 18-Day Itinerary, Larke La, Permit Cost & Best Time',
    description: 'The Manaslu Circuit trek around the world’s eighth-highest peak: restricted-area permits and cost, 18-day itinerary over the Larke La, difficulty, best season and FAQ.'
  },
  overview: [
    'The Manaslu Circuit is what the Annapurna Circuit was thirty years ago — a full loop around an 8,000 m massif, on trails with no road, through villages that still farm and trade the old way, ending with a big glaciated pass. It is a restricted area: you need special permits, a licensed guide and a group of at least two.',
    'From the road head the trail climbs the Budhi Gandaki, a deep, dramatic gorge, through Hindu Gurung farming country and then — as it gains height past Namrung and Lho — into visibly Tibetan Buddhist territory, with Manaslu itself first appearing above Lho and Sama Gaon. Most itineraries take two acclimatisation nights around Sama Gaon (3,530 m), with day walks to Manaslu Base Camp or the sacred lake of Birendra Tal and Pungyen Gompa.',
    'The crux is the Larke La (5,106 m), a long, cold pass day crossing moraine and a glacier shelf to drop into the Marsyangdi valley at Bimthang, from where the route joins the Annapurna Circuit at Dharapani. It is harder and more committing than the Annapurna Circuit — longer days, a more serious pass, more basic lodges — but it is also far less crowded.'
  ],
  highlights: [
    'The Larke La (5,106 m) — a big, wild, glaciated pass',
    'Manaslu (8,163 m) from Lho, Sama Gaon and Base Camp',
    'The Budhi Gandaki gorge — waterfalls, cliff trails and long suspension bridges',
    'Tibetan-Buddhist villages: Lho, Samagaon, Samdo — trade routes to Tibet',
    'Manaslu Base Camp and Birendra Tal as acclimatisation day walks',
    'Far fewer trekkers than the Annapurna Circuit, and no road on the loop'
  ],
  suitability: {
    physical: 8, technical: 2, altitude: 9, remoteness: 7,
    walkHours: '6–8 hours a day, one very long pass day (8–10 hrs)',
    terrain: 'Gorge trails with exposure and landslide sections, then alpine moraine and a glacier shelf on the Larke La. Non-technical but demanding.',
    weatherExposure: 'High on the Larke La — snow can close it, and there is no shelter for hours.',
    goodFor: [
      'Fit, experienced trekkers who have done a big route before',
      'Anyone wanting the Annapurna Circuit experience without the roads and crowds',
      'Walkers comfortable with basic lodges and long days'
    ],
    notIdeal: [
      'First-time trekkers or anyone new to altitude',
      'Solo trekkers — the permit needs a group of two or more',
      'Tight schedules that cannot absorb a snow day on the pass'
    ]
  },
  why: {
    lead: 'The Manaslu Circuit is the trek people do when they wish they had walked the Annapurna Circuit in 1990.',
    paragraphs: [
      'The gorge section alone is worth the trip — the Budhi Gandaki cuts a slot through the foothills, and the trail is carved into the cliffs above it, crossing and recrossing on swaying bridges. Higher up, Lho and Samagaon are working Buddhist villages with big gompas, mani walls and yak trains bound for the Tibetan border at Samdo.',
      'Then there is the pass. The Larke La is a long, exposed, genuinely alpine crossing — a pre-dawn start, hours of moraine and glacier, and a knee-punishing descent to Bimthang — and it delivers a sense of completion that an out-and-back never can. You finish on the Annapurna Circuit trail, having gone all the way around a mountain nobody else was walking around.'
    ],
    gallery: [
      { img: '/images/manaslu_real.jpg', caption: 'Manaslu from the Samagaon side' },
      { img: '/images/manaslu.png', caption: 'The Larke La on the crossing to Bimthang' },
      { img: '/images/hero-mountain.jpg', caption: 'The Budhi Gandaki gorge' }
    ]
  },
  passes: [{ name: 'Larke La (Larkya La)', elevation: '5,106 m', day: 13 }],
  acclimatization: {
    days: [8, 11],
    note: 'Two nights at Samagaon (3,530 m), with a day walk to Manaslu Base Camp (≈ 4,800 m) or Pungyen Gompa, and a night at Samdo (3,875 m) with an acclimatisation walk toward the Tibet border, set you up for the Larke La. The pass is crossed from Dharamsala (Larke Phedi, ≈ 4,470 m) the next morning — the section that catches out an under-acclimatised trekker.'
  },
  itinerary: [
    { day: 1, title: 'Drive Kathmandu to Machha Khola', from: 'Kathmandu (1,400 m)', to: 'Machha Khola (870 m)', distanceKm: '—', walkHours: '8–9 hr drive', startEle: 1400, endEle: 870, terrain: 'Highway, then rough road up the Budhi Gandaki', stay: 'Tea house', meals: 'B/L/D', highlights: ['The valley narrows into the gorge'], tips: 'A long, bumpy day — the walking starts tomorrow.' },
    { day: 2, title: 'Machha Khola to Jagat', from: 'Machha Khola (870 m)', to: 'Jagat (1,340 m)', distanceKm: '22 km', walkHours: '6–7 hrs', startEle: 870, endEle: 1340, terrain: 'Gorge trail, cliff paths, hot springs at Tatopani', stay: 'Tea house', meals: 'B/L/D', highlights: ['Tatopani hot springs', 'The MCAP permit checkpoint at Jagat'], tips: 'The restricted area begins at Jagat.' },
    { day: 3, title: 'Jagat to Deng', from: 'Jagat (1,340 m)', to: 'Deng (1,860 m)', distanceKm: '20 km', walkHours: '6–7 hrs', startEle: 1340, endEle: 1860, terrain: 'Gorge climbs and descents, big suspension bridges', stay: 'Tea house', meals: 'B/L/D', highlights: ['First mani walls — entering Buddhist country'], tips: 'A tiring up-and-down day.' },
    { day: 4, title: 'Deng to Namrung', from: 'Deng (1,860 m)', to: 'Namrung (2,630 m)', distanceKm: '20 km', walkHours: '6–7 hrs', startEle: 1860, endEle: 2630, terrain: 'Forest and gorge, then a steady climb', stay: 'Tea house', meals: 'B/L/D', highlights: ['The gorge opens out', 'Namrung checkpoint'], tips: 'You feel the altitude for the first time.' },
    { day: 5, title: 'Namrung to Lho', from: 'Namrung (2,630 m)', to: 'Lho (3,180 m)', distanceKm: '11 km', walkHours: '4–5 hrs', startEle: 2630, endEle: 3180, terrain: 'Villages, fields and pine forest', stay: 'Tea house', meals: 'B/L/D', highlights: ['First full view of Manaslu from Lho', 'Ribung Gompa'], tips: 'Sunset on Manaslu from Lho is one of the best of the trek.' },
    { day: 6, title: 'Lho to Samagaon', from: 'Lho (3,180 m)', to: 'Samagaon (3,530 m)', distanceKm: '12 km', walkHours: '4–5 hrs', startEle: 3180, endEle: 3530, terrain: 'Through Shyala with a 360° peak panorama', stay: 'Tea house', meals: 'B/L/D', highlights: ['Shyala’s mountain amphitheatre', 'Samagaon — the largest village on the route'], tips: 'Arrive with the afternoon free.' },
    { day: 7, title: 'Samagaon — acclimatisation (Manaslu Base Camp or Pungyen Gompa)', from: 'Samagaon (3,530 m)', to: 'Samagaon (3,530 m)', distanceKm: '12–16 km', walkHours: '6–7 hrs', startEle: 3530, endEle: 3530, terrain: 'Steep climb to MBC (≈ 4,800 m) or to Pungyen Gompa', stay: 'Tea house', meals: 'B/L/D', highlights: ['Manaslu Base Camp and the Manaslu Glacier', 'Birendra Tal glacial lake'], tips: 'Climb high, sleep low — the key acclimatisation day.' },
    { day: 8, title: 'Samagaon to Samdo', from: 'Samagaon (3,530 m)', to: 'Samdo (3,875 m)', distanceKm: '8 km', walkHours: '3–4 hrs', startEle: 3530, endEle: 3875, terrain: 'Open valley, past the Larke trade route junction', stay: 'Tea house', meals: 'B/L/D', highlights: ['Samdo — the last village, a Tibetan refugee settlement'], tips: 'A short day; rest for the pass.' },
    { day: 9, title: 'Samdo — acclimatisation day', from: 'Samdo (3,875 m)', to: 'Samdo (3,875 m)', distanceKm: '6–8 km', walkHours: '3–4 hrs', startEle: 3875, endEle: 3875, terrain: 'Walk toward the Tibet border pass (Rui La) and back', stay: 'Tea house', meals: 'B/L/D', highlights: ['Views into Tibet', 'Blue sheep and, sometimes, wolves'], tips: 'Second acclimatisation day — go high, come back down.' },
    { day: 10, title: 'Samdo to Dharamsala (Larke Phedi)', from: 'Samdo (3,875 m)', to: 'Dharamsala (4,470 m)', distanceKm: '7 km', walkHours: '3–4 hrs', startEle: 3875, endEle: 4470, terrain: 'Moraine climb to a single basic lodge', stay: 'Basic lodge / tents', meals: 'B/L/D', highlights: ['The pass wall ahead'], tips: 'Very basic, crowded shelter — an early night before the pass.' },
    { day: 11, title: 'Cross the Larke La to Bimthang', from: 'Dharamsala (4,470 m)', to: 'Bimthang (3,720 m)', distanceKm: '16 km', walkHours: '8–10 hrs', startEle: 4470, endEle: 3720, terrain: 'Long moraine and glacier-shelf climb to 5,106 m, then a steep, long descent', stay: 'Tea house', meals: 'B/L/D', highlights: ['Larke La (5,106 m)', 'Himlung, Cheo and Kang Guru on the descent'], tips: 'Pre-dawn start. Microspikes for the glacier shelf. Poles for the descent.' },
    { day: 12, title: 'Bimthang to Dharapani', from: 'Bimthang (3,720 m)', to: 'Dharapani (1,960 m)', distanceKm: '19 km', walkHours: '6–7 hrs', startEle: 3720, endEle: 1960, terrain: 'Forest and river descent, rejoining the Annapurna Circuit', stay: 'Tea house', meals: 'B/L/D', highlights: ['Back among trees and thicker air', 'Onto the Annapurna Circuit trail'], tips: 'A long descent, but a beautiful one.' },
    { day: 13, title: 'Drive Dharapani to Besisahar / Pokhara', from: 'Dharapani (1,960 m)', to: 'Pokhara (820 m)', distanceKm: '—', walkHours: '6–8 hr drive', startEle: 1960, endEle: 820, terrain: 'Rough jeep road, then highway', stay: 'Hotel', meals: 'B/L', highlights: ['Trek complete'], tips: 'Jeep to Besisahar, then a vehicle change for Pokhara or Kathmandu.' },
    { day: 14, title: 'Contingency / travel day', from: 'Pokhara / Besisahar', to: 'Kathmandu or Pokhara', distanceKm: '—', walkHours: '—', startEle: 820, endEle: 1400, terrain: 'Road or flight', stay: 'Hotel', meals: 'B', highlights: ['Spare day for pass weather'], tips: 'Build this in — the Larke La can force a wait.' }
  ],
  routePoints: [
    { name: 'Jagat', elevation: '1,340 m', day: 2, walkTime: '6–7 hrs from Machha Khola', stay: 'Lodges + MCAP checkpoint', highlight: 'The restricted area begins here', warning: 'No entry beyond without permits and a guide.' },
    { name: 'Lho', elevation: '3,180 m', day: 5, walkTime: '4–5 hrs from Namrung', stay: 'Lodges + Ribung Gompa', highlight: 'First full Manaslu view; strongly Tibetan-Buddhist', warning: 'First real altitude — pace it.' },
    { name: 'Samagaon', elevation: '3,530 m', day: 6, walkTime: '4–5 hrs from Lho', stay: 'The biggest lodge cluster on the route', highlight: 'Two acclimatisation nights; MBC and Birendra Tal day walks', warning: 'Do not skip a night here.' },
    { name: 'Samdo', elevation: '3,875 m', day: 8, walkTime: '3–4 hrs from Samagaon', stay: 'Lodges', highlight: 'The last village; Tibetan trade and refugee history', warning: 'Second acclimatisation night before the pass.' },
    { name: 'Dharamsala (Larke Phedi)', elevation: '4,470 m', day: 10, walkTime: '3–4 hrs from Samdo', stay: 'One very basic, overcrowded lodge (+ tents)', highlight: 'The pass launch point', warning: 'Minimal shelter and food; a rough, cold night.' },
    { name: 'Larke La', elevation: '5,106 m', day: 11, walkTime: '4–5 hrs up from Dharamsala', stay: 'Pass — no shelter', highlight: 'The high point and completion of the circuit', warning: 'Snow closes it; high wind and cold; a long glacier-shelf traverse.' }
  ],
  permits: [
    { name: 'Manaslu Restricted Area Permit', where: 'Kathmandu, through a licensed operator only', feeNote: 'Per-week fee, higher in Sep–Nov, set by the government — verify', notes: 'Requires a group of at least two trekkers and a licensed guide; independent trekking is not allowed.' },
    { name: 'Manaslu Conservation Area Permit (MCAP)', where: 'Kathmandu (NTB) or the Jagat checkpoint', feeNote: 'Fixed area fee — verify', notes: 'Carry passport and photos.' },
    { name: 'Annapurna Conservation Area Permit (ACAP)', where: 'Kathmandu or Pokhara', feeNote: 'Fixed area fee — verify', notes: 'Needed for the final section from Dharapani, which is inside the Annapurna area.' }
  ],
  cost: {
    note: 'A restricted-area trek with a per-week permit and difficult access — pricier than the Annapurna Circuit. Confirm a quote for your dates and group size.',
    tiers: [
      { name: 'Group / teahouse', rangeUSD: '$1,500–$2,100', includes: ['Licensed guide', 'All three permits', 'Ground transport', 'Tea houses', 'Main meals'] },
      { name: 'Comfort', rangeUSD: '$2,200–$3,000', includes: ['Private guide + porter', 'Assistant guide on the pass day', 'Better lodges where they exist', 'City 4★'] },
      { name: 'Premium', rangeUSD: '$3,500+', includes: ['Private trip', 'Tsum Valley extension', 'Extra crew and rest days', 'Helicopter contingency'] }
    ],
    breakdown: [
      { item: 'Restricted-area permit', note: 'Per week, seasonally priced — the dominant permit cost' },
      { item: 'MCAP + ACAP', note: 'Two conservation-area permits' },
      { item: 'Transport', note: 'Jeep in from Kathmandu; jeep out from Dharapani to Besisahar' },
      { item: 'Guide (+ porter, + assistant)', note: 'A guide is mandatory; a second guide helps on the pass' },
      { item: 'Lodging + meals', note: '14–15 nights, very basic and dear at Dharamsala' },
      { item: 'Tips', note: 'Customary at the end' }
    ],
    independentVsGuided: 'Independent trekking is not permitted. The restricted-area permit is issued only to groups of two or more with a licensed guide through a registered operator.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Machha Khola / Soti Khola', mode: 'Private jeep (or bus + jeep)', duration: '8–10 hrs', note: 'The last stretch up the Budhi Gandaki is rough and can be cut by monsoon damage.' },
      { from: 'Dharapani', to: 'Besisahar', mode: 'Shared or private jeep', duration: '3–4 hrs', note: 'Very rough. From Besisahar, onward vehicles run to Pokhara (3–4 hrs) or Kathmandu (5–6 hrs).' }
    ],
    note: 'A single contingency day is wise for the Larke La; the access roads are also slow and weather-dependent.'
  },
  equipment: [
    { item: 'Sleeping bag to ≈ −18°C', need: 'essential', note: 'Dharamsala and the pass morning are extremely cold.' },
    { item: 'Microspikes / light crampons', need: 'essential', note: 'The Larke La glacier shelf is usually snow or ice.' },
    { item: 'Down jacket + insulated trousers', need: 'recommended', note: 'For the pre-dawn pass start.' },
    { item: 'Trekking poles', need: 'essential', note: 'The Bimthang descent from the pass is long and steep.' },
    { item: 'Goggles + face cover', need: 'recommended', note: 'Wind and spindrift on the Larke La.' },
    { item: 'Satellite messenger', need: 'recommended', note: 'Coverage is thin on the high, remote sections.' }
  ],
  safety: {
    risks: [
      { name: 'The Larke La', note: 'A long, exposed, glaciated pass with no shelter for hours. Snow closes it, and guides regularly hold at Samdo or Dharamsala for a window. Trust the wait.' },
      { name: 'Altitude', note: 'You sleep above 3,500 m for a week and cross 5,106 m. The two acclimatisation days at Samagaon and Samdo are the safety margin.' },
      { name: 'Dharamsala', note: 'One overcrowded, basic lodge before the pass, at 4,470 m — a poor place to be unwell. Good operators carry tents as backup.' },
      { name: 'Gorge trails and landslides', note: 'The Budhi Gandaki cliff sections are exposed and slide-prone, especially in and after rain.' },
      { name: 'Cold injury', note: 'Frostnip risk on the pass morning without proper gloves, boots and face cover.' }
    ],
    turnaround: 'If the Larke La is snowed in, the group waits at Samdo, and if the window does not come, the trek retraces down the Budhi Gandaki — an out-and-back that is still a fine trip. A trekker not acclimatising at Samagaon does not go to Samdo or the pass.',
    note: 'Carry a satellite messenger. Helicopter evacuation is available from Samagaon, Samdo and (weather permitting) the pass area; the HRA runs a seasonal aid post at Samagaon.'
  },
  faq: [
    { q: 'Is the Manaslu Circuit harder than the Annapurna Circuit?', a: 'Yes. It is longer on trail, the days are bigger, the lodges are more basic, and the Larke La (5,106 m) is a more serious, more exposed pass than the Thorong La. It is also far less crowded and has no road on the loop.' },
    { q: 'Do I need a permit and a guide for the Manaslu Circuit?', a: 'Yes. It is a restricted area: a Manaslu Restricted Area Permit (charged per week), plus MCAP and ACAP conservation permits, a licensed guide, and a group of at least two. Independent trekking is not allowed.' },
    { q: 'How much does the Manaslu permit cost?', a: 'The restricted-area permit is charged per week and is more expensive in September–November than in the rest of the year. The government sets the figure — confirm the current rate with your operator.' },
    { q: 'How high is the Larke La?', a: '5,106 m. The camps either side are Dharamsala (4,470 m) and Bimthang (3,720 m).' },
    { q: 'How fit do I need to be?', a: 'Very fit, with previous multi-day trekking experience, ideally at altitude. Expect 6–8 hour days for two weeks and an 8–10 hour pass day.' },
    { q: 'When is the best time to trek the Manaslu Circuit?', a: 'March–May and September–November. October is the most stable and popular. Winter snow closes the Larke La; the monsoon makes the gorge trails dangerous.' },
    { q: 'Can I combine it with the Tsum Valley?', a: 'Yes — the Tsum Valley branches off at Lokpa, lower down, and adds about a week. It is a beautiful, culturally rich extension and needs its own restricted-area permit.' },
    { q: 'What is the accommodation like?', a: 'Tea houses throughout, improving each year, but basic in the upper villages and very basic at Dharamsala before the pass. Book through a guide — the high lodges are small.' },
    { q: 'Is there mobile coverage and Wi-Fi?', a: 'Coverage in many villages up to Samagaon and Samdo; Wi-Fi for sale in some lodges. The pass area and the upper gorge are dead zones — carry a satellite messenger.' },
    { q: 'Can I charge my devices?', a: 'Yes, for a fee in tea-house dining rooms, pricier and less reliable higher up. Bring a power bank.' },
    { q: 'Are there ATMs on the route?', a: 'No. Carry all your cash from Kathmandu, in small notes.' },
    { q: 'What food is available?', a: 'The standard tea-house menu — dal bhat, noodles, soups, potatoes, eggs — with less choice and higher prices the further up you go. Eat vegetarian above Namrung.' },
    { q: 'What if the Larke La is closed by snow?', a: 'You wait at Samdo for a window; if it does not come, you retrace down the Budhi Gandaki. The pass is never forced.' },
    { q: 'What if I get altitude sickness?', a: 'You descend toward Samagaon or lower, recover, and either continue on a reduced plan or arrange evacuation. The acclimatisation days are designed to prevent this.' }
  ],
  relatedTreks: ['tsum-valley', 'annapurna-circuit', 'everest-base-camp', 'ganesh-himal-trek'],
  relatedDestinations: [
    { name: 'Tsum Valley', note: 'The sacred hidden valley branching off the circuit — a week-long extension.' },
    { name: 'Annapurna Circuit', note: 'The routes join at Dharapani; some trekkers continue toward Manang.' },
    { name: 'Pokhara', note: 'The natural place to recover, a few hours from the Dharapani road head.' }
  ],
  hotelsNote: 'Trips include Kathmandu hotels, and a Pokhara or Kathmandu night at the end depending on your exit. The trail is tea houses, with tents carried as backup for Dharamsala. Ask us about adding the Tsum Valley.'
};

TREKS['tsum-valley'] = {
  slug: 'tsum-valley',
  name: 'Tsum Valley Trek',
  tagline: 'A sacred hidden valley on the Tibetan border',
  province: 'gandaki',
  region: 'Manaslu (Tsum)',
  heroImage: '/images/manaslu.png',
  summary: 'A 14-day restricted-area trek into the Tsum Valley — a remote, deeply Buddhist side valley off the Manaslu Circuit, walled off against the Tibetan border, with medieval monasteries, a hermitage linked to the yogi Milarepa, and a distinct Tsumba culture.',
  stats: {
    duration: '14 days (11–12 on the trail)',
    difficulty: 'Challenging',
    maxAltitude: '≈ 3,700 m (Mu Gompa), higher on side trips',
    maxAltitudePoint: 'Mu Gompa / Ngula Dhojhyang viewpoint',
    bestSeason: 'Mar–May · Sep–Nov',
    startPoint: 'Machha Khola / Soti Khola (drive from Kathmandu)',
    endPoint: 'Machha Khola (or continue onto the Manaslu Circuit)',
    distanceKm: '≈ 120–140 km',
    walkHours: '5–7 hrs/day'
  },
  seo: {
    title: 'Tsum Valley Trek — Nepal | Restricted-Area Itinerary, Permit Cost & Best Time',
    description: 'The Tsum Valley trek off the Manaslu Circuit: a sacred hidden Buddhist valley on the Tibet border. Restricted-area permits and cost, itinerary, difficulty and FAQ.'
  },
  overview: [
    'Tsum is a beyul — a hidden valley — that branches north-east off the Manaslu Circuit at Lokpa. It was closed to outsiders until 2008, and it still feels sealed off: a broad, high glen enclosed by the Ganesh Himal, Sringi Himal and the Tibetan border, with its own dialect, dress and a long tradition of non-violence (hunting and animal slaughter are forbidden by community vow).',
    'The trail climbs the Budhi Gandaki gorge as for Manaslu, then turns up into Tsum through Chhokangparo, with its wide-valley Tibetan feel, to the monasteries of Rachen (a nunnery) and Mu Gompa near the border, and the Milarepa-associated meditation cave at Piren Phu. Side walks lead toward the old trade pass into Tibet.',
    'It is a restricted area — special permit, licensed guide, group of two or more — and while the altitude is more moderate than the Manaslu Circuit (Mu Gompa is around 3,700 m), the approach through the gorge is long and strenuous, and the valley’s remoteness is real. Many trekkers combine Tsum with the full Manaslu Circuit for a three-week trip.'
  ],
  highlights: [
    'Mu Gompa and Rachen Gompa — remote monasteries near the Tibetan border',
    'Piren Phu — a cliff cave where the yogi Milarepa is said to have meditated',
    'Chhokangparo — a wide, sunlit Tibetan-style village with Ganesh Himal behind it',
    'A living Tsumba culture with its own language, dress and a vow of non-violence',
    'Long mani walls, painted chortens and prayer-flag ridges',
    'One of the least-visited valleys in Nepal, combinable with the Manaslu Circuit'
  ],
  suitability: {
    physical: 7, technical: 2, altitude: 6, remoteness: 8,
    walkHours: '5–7 hours a day, with a strenuous gorge approach',
    terrain: 'Long gorge trails with exposure and landslide sections, then broad valley paths. Non-technical.',
    weatherExposure: 'Moderate — the valley itself is relatively sheltered; the gorge is the exposed part.',
    goodFor: [
      'Trekkers drawn to Tibetan Buddhist culture and remoteness over altitude',
      'Experienced walkers wanting a quiet restricted-area trek',
      'Anyone combining it with the Manaslu Circuit for a longer trip'
    ],
    notIdeal: [
      'First-time trekkers — the gorge approach is hard and the area is remote',
      'Solo trekkers — the permit needs a group of two or more',
      'Trekkers whose priority is high passes and glaciers'
    ]
  },
  why: {
    lead: 'Tsum is a valley that decided, centuries ago, to keep the outside world out — and mostly succeeded.',
    paragraphs: [
      'The vow of non-violence is not a tourist story; it shapes the place. There is no hunting, the wildlife is unusually tame, and the monasteries — Rachen full of nuns, Mu Gompa clinging to the hillside near the border — are working institutions, not museums.',
      'The landscape is gentler than the Manaslu Circuit: a wide, high, farmed valley rather than a gorge, with the Ganesh Himal wall on one side and Tibet just over the ridges on the other. It is a trek for people who come for the culture and the quiet, and are happy that the pass-bagging is happening in the next valley.'
    ],
    gallery: [
      { img: '/images/manaslu.png', caption: 'The Tsum Valley opening toward Tibet' },
      { img: '/images/footer.png', caption: 'A chorten and mani wall in Tsum' },
      { img: '/images/hero-mountain.jpg', caption: 'Ganesh Himal above Chhokangparo' }
    ]
  },
  passes: [],
  acclimatization: {
    days: [7],
    note: 'The valley tops out around 3,700 m at Mu Gompa, reached gradually, so a single rest / exploration day at Nile or Mu Gompa is generally enough. The strenuous part is the low-altitude gorge approach, not the altitude.'
  },
  itinerary: [
    { day: 1, title: 'Drive Kathmandu to Machha Khola', from: 'Kathmandu (1,400 m)', to: 'Machha Khola (870 m)', distanceKm: '—', walkHours: '8–9 hr drive', startEle: 1400, endEle: 870, terrain: 'Highway then rough road', stay: 'Tea house', meals: 'B/L/D', highlights: ['Into the Budhi Gandaki'], tips: 'A long drive day.' },
    { day: 2, title: 'Machha Khola to Jagat', from: 'Machha Khola (870 m)', to: 'Jagat (1,340 m)', distanceKm: '22 km', walkHours: '6–7 hrs', startEle: 870, endEle: 1340, terrain: 'Gorge and cliff trails, hot springs', stay: 'Tea house', meals: 'B/L/D', highlights: ['Tatopani hot springs', 'MCAP checkpoint'], tips: 'The restricted area starts at Jagat.' },
    { day: 3, title: 'Jagat to Lokpa', from: 'Jagat (1,340 m)', to: 'Lokpa (2,040 m)', distanceKm: '15 km', walkHours: '6 hrs', startEle: 1340, endEle: 2040, terrain: 'Gorge climbs, then the Tsum turn-off', stay: 'Tea house', meals: 'B/L/D', highlights: ['Leaving the Manaslu trail for Tsum'], tips: 'The valley immediately quietens.' },
    { day: 4, title: 'Lokpa to Chumling', from: 'Lokpa (2,040 m)', to: 'Chumling (2,390 m)', distanceKm: '11 km', walkHours: '5–6 hrs', startEle: 2040, endEle: 2390, terrain: 'Steep forested gorge with exposed sections', stay: 'Tea house', meals: 'B/L/D', highlights: ['First Tsum village and gompa', 'Ganesh Himal views'], tips: 'Some airy trail — steady footing.' },
    { day: 5, title: 'Chumling to Chhokangparo', from: 'Chumling (2,390 m)', to: 'Chhokangparo (3,010 m)', distanceKm: '13 km', walkHours: '5–6 hrs', startEle: 2390, endEle: 3010, terrain: 'The valley opens into wide Tibetan-style country', stay: 'Home-stay / tea house', meals: 'B/L/D', highlights: ['The sunlit upper Tsum valley', 'Ganesh and Sringi Himal'], tips: 'You are now in the heart of Tsum.' },
    { day: 6, title: 'Chhokangparo to Nile / Chhule via Milarepa’s Cave', from: 'Chhokangparo (3,010 m)', to: 'Nile (3,360 m)', distanceKm: '14 km', walkHours: '5–6 hrs', startEle: 3010, endEle: 3360, terrain: 'Valley trail past monasteries and mani walls', stay: 'Tea house', meals: 'B/L/D', highlights: ['Piren Phu — Milarepa’s meditation cave', 'Rachen Gompa nunnery'], tips: 'Piren Phu has old murals — the caretaker will open it.' },
    { day: 7, title: 'Nile to Mu Gompa — exploration', from: 'Nile (3,360 m)', to: 'Mu Gompa (3,700 m)', distanceKm: '8 km + exploring', walkHours: '4–5 hrs', startEle: 3360, endEle: 3700, terrain: 'Open upper valley toward the border', stay: 'Monastery guesthouse / tea house', meals: 'B/L/D', highlights: ['Mu Gompa near the Tibet frontier', 'Optional walk toward the Ngula Dhojhyang pass viewpoint'], tips: 'The highest and most remote point of the trek.' },
    { day: 8, title: 'Mu Gompa to Rachen Gompa / Chhokangparo', from: 'Mu Gompa (3,700 m)', to: 'Chhokangparo (3,010 m)', distanceKm: '18 km', walkHours: '6–7 hrs', startEle: 3700, endEle: 3010, terrain: 'Return down the valley, visiting Rachen', stay: 'Home-stay / tea house', meals: 'B/L/D', highlights: ['Rachen Gompa — a large nunnery', 'Afternoon light on the valley'], tips: 'A long but easy descent.' },
    { day: 9, title: 'Chhokangparo to Gumba Lungdang', from: 'Chhokangparo (3,010 m)', to: 'Gumba Lungdang (3,200 m)', distanceKm: '10 km', walkHours: '5–6 hrs', startEle: 3010, endEle: 3200, terrain: 'Steep climb to a hillside nunnery', stay: 'Nunnery guesthouse', meals: 'B/L/D', highlights: ['Gumba Lungdang and its ridge setting', 'Optional dawn walk toward Ganesh Himal Base Camp'], tips: 'A special, atmospheric overnight.' },
    { day: 10, title: 'Gumba Lungdang to Lokpa / Philim', from: 'Gumba Lungdang (3,200 m)', to: 'Philim (1,590 m)', distanceKm: '18 km', walkHours: '6–7 hrs', startEle: 3200, endEle: 1590, terrain: 'Long descent out of Tsum to the Budhi Gandaki', stay: 'Tea house', meals: 'B/L/D', highlights: ['Leaving the hidden valley'], tips: 'A big descent day.' },
    { day: 11, title: 'Philim to Tatopani / Machha Khola', from: 'Philim (1,590 m)', to: 'Tatopani (990 m)', distanceKm: '20 km', walkHours: '6–7 hrs', startEle: 1590, endEle: 990, terrain: 'Gorge descent', stay: 'Tea house', meals: 'B/L/D', highlights: ['Hot springs at Tatopani'], tips: 'Soak the legs at the springs.' },
    { day: 12, title: 'Tatopani to Soti Khola, drive toward Kathmandu', from: 'Tatopani (990 m)', to: 'Soti Khola / Arughat (700 m)', distanceKm: '10 km walk + drive', walkHours: '3–4 hrs + drive', startEle: 990, endEle: 700, terrain: 'River trail to the road head', stay: 'Guesthouse', meals: 'B/L/D', highlights: ['Trek complete'], tips: 'Position for the drive out.' },
    { day: 13, title: 'Drive Soti Khola to Kathmandu', from: 'Soti Khola (700 m)', to: 'Kathmandu (1,400 m)', distanceKm: '—', walkHours: '7–9 hr drive', startEle: 700, endEle: 1400, terrain: 'Rough road then highway', stay: 'Hotel', meals: 'B/L', highlights: ['Dhading hill country'], tips: 'A long final drive.' },
    { day: 14, title: 'Contingency / departure day', from: 'Kathmandu', to: 'Kathmandu', distanceKm: '—', walkHours: '—', startEle: 1400, endEle: 1400, terrain: '—', stay: 'Hotel', meals: 'B', highlights: ['Spare day'], tips: 'Sightseeing if unused.' }
  ],
  routePoints: [
    { name: 'Lokpa', elevation: '2,040 m', day: 3, walkTime: '6 hrs from Jagat', stay: 'A few lodges', highlight: 'Where Tsum branches off the Manaslu trail', warning: 'Facilities thin out beyond here.' },
    { name: 'Chhokangparo', elevation: '3,010 m', day: 5, walkTime: '5–6 hrs from Chumling', stay: 'Home-stays and lodges', highlight: 'The wide, sunlit heart of the valley', warning: 'Home-stay comfort is basic.' },
    { name: 'Piren Phu (Milarepa’s Cave)', elevation: '≈ 3,200 m', day: 6, walkTime: 'Short detour above Chhokangparo', highlight: 'A cliff cave shrine with old murals', warning: 'Short steep climb to the cave.' },
    { name: 'Mu Gompa', elevation: '3,700 m', day: 7, walkTime: '4–5 hrs from Nile', stay: 'Monastery guesthouse', highlight: 'The remotest point, near the Tibet border', warning: 'Very simple lodging; cold nights.' },
    { name: 'Gumba Lungdang', elevation: '3,200 m', day: 9, walkTime: '5–6 hrs from Chhokangparo', stay: 'Nunnery guesthouse', highlight: 'A hillside nunnery and a dawn Ganesh Himal walk', warning: 'Steep approach; spartan rooms.' }
  ],
  permits: [
    { name: 'Tsum Valley Restricted Area Permit', where: 'Kathmandu, through a licensed operator only', feeNote: 'Per-week fee, set by the government — verify', notes: 'Requires a group of at least two and a licensed guide; separate from (and cheaper than) the Manaslu permit.' },
    { name: 'Manaslu Conservation Area Permit (MCAP)', where: 'Kathmandu (NTB) or the Jagat checkpoint', feeNote: 'Fixed area fee — verify', notes: 'The approach runs through the Manaslu Conservation Area.' },
    { name: 'Manaslu Restricted Area Permit (if combining with the Circuit)', where: 'Kathmandu, through a licensed operator', feeNote: 'Per-week fee — verify', notes: 'Only needed if you continue past Lokpa toward the Larke La.' }
  ],
  cost: {
    note: 'A restricted-area trek with a per-week permit and a long overland approach. Combining with the Manaslu Circuit adds a second restricted-area permit. Confirm a quote for your dates and group.',
    tiers: [
      { name: 'Group / teahouse', rangeUSD: '$1,500–$2,100', includes: ['Licensed guide', 'Tsum + MCAP permits', 'Ground transport', 'Tea houses / home-stays', 'Main meals'] },
      { name: 'Comfort', rangeUSD: '$2,200–$2,900', includes: ['Private guide + porter', 'Best available village lodging', 'Kathmandu 4★', 'Monastery donations covered'] },
      { name: 'Tsum + full Manaslu Circuit', rangeUSD: '$2,800–$4,000', includes: ['Both restricted-area permits + ACAP', '3-week itinerary', 'Assistant guide on the Larke La'] }
    ],
    breakdown: [
      { item: 'Tsum restricted-area permit', note: 'Per week — less than the Manaslu permit' },
      { item: 'MCAP (+ Manaslu permit if combining)', note: 'Conservation and, optionally, second restricted-area permit' },
      { item: 'Transport', note: 'Jeep in and out via Soti Khola / Arughat' },
      { item: 'Guide (+ porter)', note: 'Mandatory guide; a porter is strongly advised for the gorge' },
      { item: 'Lodging + meals', note: '11–12 nights, basic in the upper valley' },
      { item: 'Monastery offerings', note: 'Small donations at the gompas' }
    ],
    independentVsGuided: 'Independent trekking is not permitted. The Tsum restricted-area permit is issued only to groups of two or more with a licensed guide through a registered operator.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Machha Khola / Soti Khola', mode: 'Private jeep (or bus + jeep)', duration: '8–10 hrs', note: 'The Budhi Gandaki road is rough and can be cut by monsoon damage.' },
      { from: 'Soti Khola / Arughat', to: 'Kathmandu', mode: 'Jeep then highway', duration: '7–9 hrs', note: 'Same road out; a long day.' }
    ],
    note: 'A remote overland trek at both ends — build in a contingency day for road conditions.'
  },
  equipment: [
    { item: 'Sleeping bag to ≈ −12°C', need: 'essential', note: 'Mu Gompa and Gumba Lungdang are cold and basic.' },
    { item: 'Sleeping bag liner', need: 'recommended', note: 'For home-stay and monastery bedding.' },
    { item: 'Trekking poles', need: 'essential', note: 'Long gorge approach and big descents.' },
    { item: 'Full waterproofs', need: 'essential', note: 'The gorge catches weather even in season.' },
    { item: 'Water filter + chemical backup', need: 'essential', note: 'Fewer treated-water points than the main routes.' },
    { item: 'Head torch', need: 'essential', note: 'Village and monastery power is intermittent.' }
  ],
  safety: {
    risks: [
      { name: 'The gorge approach', note: 'The Budhi Gandaki cliff trails are exposed and landslide-prone, particularly in and after rain — the same hazard as the Manaslu Circuit approach.' },
      { name: 'Remoteness', note: 'The upper Tsum valley is far from any road; evacuation is by helicopter from the valley floor in clear weather.' },
      { name: 'Basic accommodation', note: 'Home-stays, monastery guesthouses and simple lodges — a poor place to be seriously unwell.' },
      { name: 'Altitude', note: 'Moderate (Mu Gompa ≈ 3,700 m) but still worth respecting; report headaches.' },
      { name: 'Weather on the side trips', note: 'The walks toward the border pass and Ganesh Himal Base Camp are exposed and should not be pushed in poor conditions.' }
    ],
    turnaround: 'Tsum has no committing pass, so problems are managed by descending the valley — always downhill toward the gorge and, eventually, the road. Side trips toward the Tibet-border viewpoint or Ganesh Himal Base Camp are dropped in bad weather.',
    note: 'Carry a satellite messenger for the upper valley. Discuss the evacuation plan with your operator before departure.'
  },
  faq: [
    { q: 'Where is the Tsum Valley?', a: 'A side valley branching north-east off the Manaslu Circuit trail at Lokpa, in Gorkha district, running up to the Tibetan border between the Ganesh and Sringi Himal.' },
    { q: 'Do I need a permit and guide for Tsum Valley?', a: 'Yes. It is a restricted area needing a Tsum Valley Restricted Area Permit (per week), an MCAP conservation permit, a licensed guide and a group of at least two. Independent trekking is not allowed.' },
    { q: 'Is the Tsum permit the same as the Manaslu permit?', a: 'No — they are separate. The Tsum permit is generally cheaper. If you combine Tsum with the full Manaslu Circuit you need both restricted-area permits plus ACAP.' },
    { q: 'How difficult is the Tsum Valley trek?', a: 'Challenging — the long gorge approach is strenuous and exposed, and the valley is remote with basic lodging. The altitude, at about 3,700 m maximum, is more moderate than the Manaslu Circuit.' },
    { q: 'How high does the trek go?', a: 'Around 3,700 m at Mu Gompa. Side walks toward the Tibet-border viewpoint and Ganesh Himal Base Camp go higher.' },
    { q: 'Can I combine Tsum with the Manaslu Circuit?', a: 'Yes, and many trekkers do — Tsum first, then rejoin the Manaslu trail at Lokpa and continue over the Larke La. It makes a roughly three-week trip and needs both restricted-area permits.' },
    { q: 'When is the best time to go?', a: 'March–May and September–November. The monsoon makes the gorge approach dangerous; winter is cold and some upper lodges close.' },
    { q: 'What is the accommodation like?', a: 'Basic tea houses, village home-stays and monastery guesthouses. Comfort is minimal in the upper valley — bring a warm bag and a liner.' },
    { q: 'Is there mobile coverage and Wi-Fi?', a: 'Patchy in the lower villages, little to none in the upper valley. Carry a satellite messenger.' },
    { q: 'Can I charge my devices?', a: 'Occasionally, in villages with power, sometimes for a fee. Bring a power bank and, ideally, a small solar panel.' },
    { q: 'Are there ATMs?', a: 'No. Carry all your cash from Kathmandu.' },
    { q: 'What is special about Tsum culturally?', a: 'It is a beyul (hidden valley) with its own Tsumba language and dress, a centuries-old community vow of non-violence, and working monasteries and nunneries — Rachen, Mu Gompa, Gumba Lungdang — near the Tibetan border.' },
    { q: 'What if I get altitude sickness?', a: 'You descend the valley, which always leads downhill toward the road. Given the moderate altitude, serious AMS is uncommon, but report symptoms early.' }
  ],
  relatedTreks: ['manaslu-circuit', 'ganesh-himal-trek', 'upper-mustang', 'limi-valley'],
  relatedDestinations: [
    { name: 'Manaslu Circuit', note: 'The obvious pairing — continue past Lokpa and over the Larke La.' },
    { name: 'Ganesh Himal Base Camp', note: 'A side trip from Gumba Lungdang for the strong and well-equipped.' },
    { name: 'Kathmandu Valley', note: 'For the days either side of a long overland trek.' }
  ],
  hotelsNote: 'Trips include Kathmandu hotels; the trail is tea houses, home-stays and monastery guesthouses. Ask us about combining Tsum with the full Manaslu Circuit for a three-week trip.'
};

TREKS['dhaulagiri-circuit'] = {
  slug: 'dhaulagiri-circuit',
  name: 'Dhaulagiri Circuit Trek',
  tagline: 'A true camping expedition around the seventh-highest peak',
  province: 'gandaki',
  region: 'Dhaulagiri',
  heroImage: '/images/hero-mountain.jpg',
  summary: 'An 18-day, fully-supported camping trek around Dhaulagiri I (8,167 m), crossing two glaciated passes — French Col (5,360 m) and Dhampus Pass (5,240 m) — and camping for several nights above 4,500 m in the glacial basin of Hidden Valley. One of Nepal’s most serious teahouse-free treks.',
  stats: {
    duration: '18–20 days on the trail',
    difficulty: 'Strenuous (mountaineering-adjacent)',
    maxAltitude: '5,360 m',
    maxAltitudePoint: 'French Col',
    bestSeason: 'Oct–early Nov (a narrow window)',
    startPoint: 'Beni / Darbang (drive from Pokhara)',
    endPoint: 'Jomsom / Marpha, then Pokhara',
    distanceKm: '≈ 110–130 km',
    walkHours: '5–8 hrs/day'
  },
  seo: {
    title: 'Dhaulagiri Circuit Trek — Nepal | Camping Expedition Itinerary, Difficulty & Cost',
    description: 'The Dhaulagiri Circuit: a fully-supported camping trek around Dhaulagiri I over French Col and Dhampus Pass. Itinerary, difficulty, permits, cost, best season and FAQ.'
  },
  overview: [
    'The Dhaulagiri Circuit is a camping expedition, not a tea-house trek. There are no lodges once you leave the mid-hill villages: your team carries tents, food and fuel for the whole crossing, and you camp for the better part of a week on glacier moraine above 4,500 m, including at Dhaulagiri Base Camp (≈ 4,750 m) under the mountain’s vast north-east face.',
    'From Darbang the trail follows the Myagdi Khola up through forest and gorge — a strenuous, sometimes exposed approach — to the Chonbardan Glacier, which it then ascends to Base Camp. The route crosses the French Col (5,360 m) into Hidden Valley, a stark glacial basin, camps there, and crosses the Dhampus Pass (5,240 m) to descend steeply to Yak Kharka and Marpha on the Annapurna side.',
    'This is a route for experienced, very fit trekkers who are comfortable camping in cold, high, committing terrain and crossing glaciated passes with a rope and crampons if conditions require. The weather window is narrow — essentially October — and parties routinely wait out storms or turn back. It should be booked and treated as a mountaineering-style expedition.'
  ],
  highlights: [
    'Dhaulagiri Base Camp (≈ 4,750 m) beneath the north-east face of an 8,000 m peak',
    'Two high glaciated passes — French Col (5,360 m) and Dhampus Pass (5,240 m)',
    'Hidden Valley — a silent, snowbound glacial basin at 5,000 m',
    'The Chonbardan Glacier ascent',
    'Tukuche Peak and the Annapurnas from Dhampus Pass',
    'A genuine expedition experience with no lodges and full camp support'
  ],
  suitability: {
    physical: 10, technical: 6, altitude: 10, remoteness: 9,
    walkHours: '5–8 hours a day, with long, glaciated pass days',
    terrain: 'Exposed forest and gorge trails, glacial moraine, crevassed glacier, and two passes that may need rope and crampons.',
    weatherExposure: 'Extreme — several days camping above 4,500 m with no escape route but the passes.',
    goodFor: [
      'Very experienced trekkers with glacier-travel or mountaineering experience',
      'Parties comfortable with a week of high camping in cold, committing terrain',
      'Anyone wanting a true expedition rather than a supported walk'
    ],
    notIdeal: [
      'Anyone without previous high-altitude camping and glacier experience',
      'Trips without flexibility for multi-day weather holds',
      'Trekkers who need any level of lodge comfort'
    ]
  },
  why: {
    lead: 'This is as close to a mountaineering expedition as a trek gets in Nepal.',
    paragraphs: [
      'There is no bailout in the middle of the Dhaulagiri Circuit. Once you are on the Chonbardan Glacier heading for Base Camp, the only ways out are forward over the French Col and Dhampus Pass, or back the way you came. That commitment, and the days spent camping in the snow at 5,000 m in Hidden Valley, are what make it extraordinary — and what make it unsuitable for anyone treating it as just a long walk.',
      'The mountain itself is overwhelming from Base Camp, and the crossing into Hidden Valley and out over Dhampus Pass, with Tukuche and the Annapurnas ahead, is one of the great high traverses in the range.'
    ],
    gallery: [
      { img: '/images/hero-mountain.jpg', caption: 'Dhaulagiri from the Chonbardan Glacier' },
      { img: '/images/manaslu.png', caption: 'Camp in Hidden Valley' },
      { img: '/images/annapurna_real.jpg', caption: 'The Annapurnas from Dhampus Pass' }
    ]
  },
  passes: [
    { name: 'French Col', elevation: '5,360 m', day: 12 },
    { name: 'Dhampus Pass', elevation: '5,240 m', day: 14 }
  ],
  acclimatization: {
    days: [8, 10, 13],
    note: 'The itinerary builds acclimatisation and contingency days at Italian Base Camp, Dhaulagiri Base Camp and in Hidden Valley. Because there is no way to descend quickly from Base Camp or Hidden Valley without crossing a 5,200 m-plus pass, thorough acclimatisation is not optional — it is the difference between a safe crossing and an evacuation.'
  },
  itinerary: [
    { day: 1, title: 'Drive Pokhara to Darbang', from: 'Pokhara (820 m)', to: 'Darbang (1,100 m)', distanceKm: '—', walkHours: '5–6 hr drive', startEle: 820, endEle: 1100, terrain: 'Highway then rough road up the Myagdi Khola', stay: 'Guesthouse', meals: 'B/L/D', highlights: ['Into the Dhaulagiri foothills'], tips: 'Meet the full camp crew here.' },
    { day: 2, title: 'Darbang to Muri', from: 'Darbang (1,100 m)', to: 'Muri (1,850 m)', distanceKm: '15 km', walkHours: '6 hrs', startEle: 1100, endEle: 1850, terrain: 'Terraced hills and Magar villages', stay: 'Camp', meals: 'B/L/D', highlights: ['Magar farming country'], tips: 'Camping from tonight — settle into the routine.' },
    { day: 3, title: 'Muri to Boghara', from: 'Muri (1,850 m)', to: 'Boghara (2,050 m)', distanceKm: '14 km', walkHours: '6–7 hrs', startEle: 1850, endEle: 2050, terrain: 'Gorge trail with exposed sections', stay: 'Camp', meals: 'B/L/D', highlights: ['The Myagdi Khola gorge deepens'], tips: 'Some airy, eroded trail — steady footing.' },
    { day: 4, title: 'Boghara to Dobang', from: 'Boghara (2,050 m)', to: 'Dobang (2,520 m)', distanceKm: '12 km', walkHours: '6 hrs', startEle: 2050, endEle: 2520, terrain: 'Forest and landslide-scarred slopes', stay: 'Camp', meals: 'B/L/D', highlights: ['Last of the permanent settlements'], tips: 'Wilderness from here on.' },
    { day: 5, title: 'Dobang to Italian Base Camp', from: 'Dobang (2,520 m)', to: 'Italian Base Camp (3,660 m)', distanceKm: '11 km', walkHours: '6–7 hrs', startEle: 2520, endEle: 3660, terrain: 'Steep forest climb below the west face', stay: 'Camp', meals: 'B/L/D', highlights: ['First close view of Dhaulagiri’s west face'], tips: 'A big climbing day into the alpine.' },
    { day: 6, title: 'Italian Base Camp — acclimatisation day', from: 'Italian Base Camp (3,660 m)', to: 'Italian Base Camp (3,660 m)', distanceKm: '4–6 km', walkHours: '3–4 hrs', startEle: 3660, endEle: 3660, terrain: 'Short climb toward the glacier and back', stay: 'Camp', meals: 'B/L/D', highlights: ['Glacier views'], tips: 'Rest and acclimatise before the glacier section.' },
    { day: 7, title: 'Italian Base Camp to Glacier Camp', from: 'Italian Base Camp (3,660 m)', to: 'Glacier Camp (4,200 m)', distanceKm: '8 km', walkHours: '5–6 hrs', startEle: 3660, endEle: 4200, terrain: 'Onto the Chonbardan Glacier moraine', stay: 'Camp', meals: 'B/L/D', highlights: ['Walking on the glacier'], tips: 'Rope and crampons may come out here.' },
    { day: 8, title: 'Glacier Camp to Dhaulagiri Base Camp', from: 'Glacier Camp (4,200 m)', to: 'Dhaulagiri Base Camp (4,750 m)', distanceKm: '8 km', walkHours: '5–6 hrs', startEle: 4200, endEle: 4750, terrain: 'Glacier and moraine', stay: 'Camp', meals: 'B/L/D', highlights: ['Dhaulagiri’s north-east face', 'Tukuche Peak'], tips: 'Camping on the glacier under an 8,000 m wall.' },
    { day: 9, title: 'Dhaulagiri Base Camp — acclimatisation / contingency', from: 'Dhaulagiri Base Camp (4,750 m)', to: 'Dhaulagiri Base Camp (4,750 m)', distanceKm: '3–6 km', walkHours: '2–4 hrs', startEle: 4750, endEle: 4750, terrain: 'Short walk toward the French Col approach', stay: 'Camp', meals: 'B/L/D', highlights: ['Preparing for the col'], tips: 'A vital buffer day — used for weather or acclimatisation.' },
    { day: 10, title: 'Cross the French Col to Hidden Valley', from: 'Dhaulagiri Base Camp (4,750 m)', to: 'Hidden Valley (5,050 m)', distanceKm: '8 km', walkHours: '6–8 hrs', startEle: 4750, endEle: 5050, terrain: 'Glacier climb to French Col (5,360 m), descent into the basin', stay: 'Camp', meals: 'B/L/D', highlights: ['French Col (5,360 m)', 'Hidden Valley — a silent glacial bowl'], tips: 'Alpine start; rope and crampons; only crossed in a settled window.' },
    { day: 11, title: 'Hidden Valley — rest / contingency', from: 'Hidden Valley (5,050 m)', to: 'Hidden Valley (5,050 m)', distanceKm: '2–4 km', walkHours: '1–3 hrs', startEle: 5050, endEle: 5050, terrain: 'Short walk; mostly rest', stay: 'Camp', meals: 'B/L/D', highlights: ['A night camped at 5,000 m in the snow'], tips: 'Kept as a buffer for the Dhampus Pass weather.' },
    { day: 12, title: 'Cross Dhampus Pass to Yak Kharka', from: 'Hidden Valley (5,050 m)', to: 'Yak Kharka (3,680 m)', distanceKm: '12 km', walkHours: '6–8 hrs', startEle: 5050, endEle: 3680, terrain: 'Climb to Dhampus Pass (5,240 m), then a very steep scree descent', stay: 'Camp', meals: 'B/L/D', highlights: ['Dhampus Pass (5,240 m)', 'The Annapurnas ahead'], tips: 'The descent from Dhampus Pass is loose and punishing — poles essential.' },
    { day: 13, title: 'Yak Kharka to Marpha', from: 'Yak Kharka (3,680 m)', to: 'Marpha (2,670 m)', distanceKm: '10 km', walkHours: '5 hrs', startEle: 3680, endEle: 2670, terrain: 'Descend to the Kali Gandaki and the Annapurna Circuit trail', stay: 'Tea house', meals: 'B/L/D', highlights: ['Marpha — apple orchards and a real bed', 'Back on the Annapurna trail'], tips: 'The first tea house in nearly two weeks.' },
    { day: 14, title: 'Marpha to Jomsom; fly / drive to Pokhara', from: 'Marpha (2,670 m)', to: 'Pokhara (820 m)', distanceKm: '9 km walk + transfer', walkHours: '3 hrs + flight/drive', startEle: 2670, endEle: 820, terrain: 'Kali Gandaki trail, then mountain flight or jeep', stay: 'Hotel', meals: 'B/L', highlights: ['Trek complete'], tips: 'Keep buffer days — the expedition can run long, and Jomsom flights cancel.' }
  ],
  routePoints: [
    { name: 'Dobang', elevation: '2,520 m', day: 4, walkTime: '6 hrs from Boghara', stay: 'Camp', highlight: 'The last settlement before the wilderness', warning: 'No villages, lodges or resupply beyond here.' },
    { name: 'Italian Base Camp', elevation: '3,660 m', day: 5, walkTime: '6–7 hrs from Dobang', stay: 'Camp + acclimatisation day', highlight: 'Under Dhaulagiri’s west face', warning: 'The glacier section begins above here.' },
    { name: 'Dhaulagiri Base Camp', elevation: '≈ 4,750 m', day: 8, walkTime: '2 days on the glacier from Italian BC', stay: 'Glacier camp + contingency day', highlight: 'Camping under an 8,000 m face', warning: 'No quick descent — the only exits are the two passes.' },
    { name: 'French Col', elevation: '5,360 m', day: 10, walkTime: 'Alpine day from Dhaulagiri BC', stay: 'Pass — no shelter', highlight: 'The gateway to Hidden Valley', warning: 'Glaciated; crossed only in a settled window with rope and crampons.' },
    { name: 'Hidden Valley', elevation: '≈ 5,050 m', day: 10, walkTime: 'Below the French Col', stay: 'Snow camp + contingency day', highlight: 'A silent glacial basin at 5,000 m', warning: 'Committing — the only ways out are the two 5,200 m+ passes.' },
    { name: 'Dhampus Pass', elevation: '5,240 m', day: 12, walkTime: 'From Hidden Valley', stay: 'Pass — no shelter', highlight: 'The exit toward the Annapurna side', warning: 'A dangerously loose, steep scree descent on the far side.' }
  ],
  permits: [
    { name: 'Annapurna Conservation Area Permit (ACAP)', where: 'Kathmandu or Pokhara (NTB / ACAP)', feeNote: 'Fixed area fee — verify', notes: 'Covers both the Myagdi approach and the Kali Gandaki exit.' },
    { name: 'Local area / rural municipality permits', where: 'Kathmandu or checkpoints on the route', feeNote: 'Local fees — verify', notes: 'The exact mix depends on current rules; your operator confirms it.' }
  ],
  cost: {
    note: 'A fully-supported camping expedition with a large crew, group climbing equipment and a week of high camping — among the most expensive treks in this directory. Confirm a quote for your dates.',
    tiers: [
      { name: 'Supported camping', rangeUSD: '$2,800–$3,800', includes: ['Guide + climbing Sherpa + cook + porters', 'All camping and mess equipment', 'Group rope / hardware', 'All permits', 'All meals on trek'] },
      { name: 'Expedition style', rangeUSD: '$4,000–$5,500', includes: ['Higher guide ratio', 'Better tents and mess', 'Extra contingency days', 'Oxygen / PAC bag carried'] },
      { name: 'Premium', rangeUSD: '$6,000+', includes: ['Small private team', 'Helicopter contingency pre-arranged', 'Weather-forecasting support', 'Extra acclimatisation'] }
    ],
    breakdown: [
      { item: 'Crew', note: 'Guide, climbing Sherpa, cook, kitchen crew and porters — a full expedition team' },
      { item: 'Group equipment', note: 'Tents, mess, stoves, rope, snow anchors, and often a PAC bag' },
      { item: 'Food + fuel', note: 'Everything for ~2 weeks is carried in' },
      { item: 'Permits', note: 'ACAP + local area fees' },
      { item: 'Contingency', note: 'Multiple spare days — the weather window is narrow' },
      { item: 'Evacuation cover', note: 'Confirm your insurance covers glaciated passes to 5,400 m and helicopter rescue' }
    ],
    independentVsGuided: 'This is not a route anyone should attempt independently. It requires a full support crew, group climbing equipment, glacier-travel competence, and the ability to run and strike high camps in bad weather.'
  },
  transport: {
    steps: [
      { from: 'Pokhara', to: 'Darbang', mode: 'Private jeep', duration: '5–6 hrs', note: 'Rough road up the Myagdi Khola.' },
      { from: 'Jomsom', to: 'Pokhara', mode: 'Flight (~20 min) or jeep (6–8 hrs)', duration: '20 min / 6–8 hrs', note: 'Jomsom flights are morning-only and cancel readily — keep buffer days.' }
    ],
    note: 'Build in at least two, ideally three, contingency days — the passes and the Jomsom flight all need weather windows.'
  },
  equipment: [
    { item: 'Mountaineering boots (crampon-compatible)', need: 'essential', note: 'For the glacier and both passes — hired if you do not own them.' },
    { item: 'Crampons, ice axe, harness', need: 'essential', note: 'Group hardware supplied; personal fit checked before the glacier.' },
    { item: '4-season sleeping bag (≈ −25°C) + mat', need: 'essential', note: 'A week of camping above 4,500 m, including at 5,000 m.' },
    { item: 'Down jacket + insulated trousers + expedition mitts', need: 'essential', note: 'Hidden Valley and the pass mornings are brutally cold.' },
    { item: 'Glacier glasses + goggles', need: 'essential', note: 'Intense glare and spindrift.' },
    { item: 'Satellite messenger / phone', need: 'essential', note: 'There is no mobile coverage and no bailout for the core of the route.' }
  ],
  safety: {
    risks: [
      { name: 'Commitment', note: 'From Dhaulagiri Base Camp there is no fast way down — the only exits are two glaciated passes above 5,200 m. Everything depends on being acclimatised and on the weather.' },
      { name: 'The passes', note: 'French Col and Dhampus Pass are glaciated and weather-sensitive. Parties routinely wait days, and some seasons do not offer a safe window at all.' },
      { name: 'High camping', note: 'Several nights above 4,500 m, one at 5,000 m in the snow. Cold injury, poor sleep and appetite loss are near-universal — the crew manages this, but it is hard.' },
      { name: 'The Dhampus Pass descent', note: 'A long, dangerously loose scree slope — a common place for falls and rockfall.' },
      { name: 'Weather window', note: 'October is essentially the only reliable window; even then it is narrow, and some seasons offer no safe crossing at all.' }
    ],
    turnaround: 'Before committing to the glacier, the trip can retreat down the Myagdi Khola. Once past Dhaulagiri Base Camp, "turning around" means going back over ground you have covered, not a quick descent — which is exactly why the acclimatisation and contingency days are sacrosanct, and why a bad forecast means not starting the glacier section at all.',
    note: 'Book this as an expedition with a climbing guide, a PAC bag or oxygen carried, pre-arranged helicopter contingency, and forecasting support. Confirm your insurance explicitly covers glaciated passes above 5,000 m.'
  },
  faq: [
    { q: 'Is the Dhaulagiri Circuit a trek or a climb?', a: 'It sits between the two. There is no summit, but you camp for a week above 4,500 m, walk on a crevassed glacier, and cross two glaciated passes that can require rope and crampons. It is a mountaineering-style expedition.' },
    { q: 'How hard is the Dhaulagiri Circuit?', a: 'It is one of the hardest trekking routes in Nepal — long, remote, tea-house-free for two weeks, with two 5,200 m-plus passes and a highly committing central section.' },
    { q: 'What experience do I need?', a: 'Previous high-altitude camping and glacier-travel experience, or a mountaineering skills course, plus excellent fitness. This should not be an early trek in your Himalayan progression.' },
    { q: 'How high does it go?', a: '5,360 m at the French Col; 5,240 m at Dhampus Pass; camps at Dhaulagiri Base Camp (≈ 4,750 m) and Hidden Valley (≈ 5,050 m).' },
    { q: 'When can the Dhaulagiri Circuit be done?', a: 'Realistically only October, with a small chance in early November or late spring. The passes are snow-blocked and dangerous outside that window.' },
    { q: 'Do I camp the whole way?', a: 'You camp from the second day until you descend to Marpha on the Annapurna side — around two weeks of tents, including on glacier moraine and snow.' },
    { q: 'What permits are required?', a: 'The Annapurna Conservation Area Permit and local area permits. Your operator arranges them; the exact mix depends on current rules.' },
    { q: 'Is there any mobile coverage?', a: 'None for the core of the route. A satellite messenger or phone is essential, and a good operator carries forecasting support.' },
    { q: 'How many contingency days should I budget?', a: 'At least two, ideally three — for the two passes and the Jomsom flight. Expeditions that skimp on buffer days are the ones that get into trouble.' },
    { q: 'What happens if the passes are not crossable?', a: 'If a safe window does not come, the expedition retreats down the Myagdi Khola without crossing. This is a known outcome and your operator should price and plan for it.' },
    { q: 'What if I get altitude sickness at Base Camp or Hidden Valley?', a: 'This is the crux problem: there is no quick descent. The response is oxygen or a PAC bag, holding position, and a helicopter evacuation when weather allows — which is why acclimatisation is non-negotiable.' },
    { q: 'Can I do just Dhaulagiri Base Camp and turn back?', a: 'Yes — an out-and-back to Dhaulagiri Base Camp via the Myagdi Khola, without the passes, is a serious but less committing option of around 12–14 days.' }
  ],
  relatedTreks: ['annapurna-circuit', 'upper-mustang', 'manaslu-circuit', 'upper-dolpo'],
  relatedDestinations: [
    { name: 'Marpha & the Kali Gandaki', note: 'The apple-orchard village where the trek rejoins the trail network.' },
    { name: 'Muktinath', note: 'A short detour from Jomsom on the way out.' },
    { name: 'Pokhara', note: 'The place to recover after a committing expedition.' }
  ],
  hotelsNote: 'Trips include Kathmandu and Pokhara hotels; the route is camping for around two weeks with full crew support, then tea houses from Marpha. This is sold as an expedition — talk to us early about your experience, dates and the weather window.'
};

/* ========================= KARNALI PROVINCE ========================= */

TREKS['upper-dolpo'] = {
  slug: 'upper-dolpo',
  name: 'Upper Dolpo Trek',
  tagline: 'The trans-Himalayan far west, beyond Shey Gompa',
  province: 'karnali',
  region: 'Dolpo',
  heroImage: '/images/hero-mountain.jpg',
  summary: 'A 22–26 day restricted-area camping trek into Upper Dolpo — a high, arid, culturally Tibetan region north of the main Himalayan chain, taking in Shey Phoksundo Lake, the ancient Shey Gompa, several 5,000 m passes and villages that still farm and trade as they have for centuries.',
  stats: {
    duration: '22–26 days (18–22 on the trail)',
    difficulty: 'Strenuous',
    maxAltitude: '≈ 5,350 m',
    maxAltitudePoint: 'Kang La / Jeng La / Nagdalo La (route-dependent)',
    bestSeason: 'Mid-May–Oct (including monsoon — it is in the rain-shadow)',
    startPoint: 'Juphal (flight via Nepalgunj)',
    endPoint: 'Juphal, or Jomsom (via the Charka Bhot / Mustang link)',
    distanceKm: '≈ 220–260 km',
    walkHours: '6–8 hrs/day'
  },
  seo: {
    title: 'Upper Dolpo Trek — Nepal | Restricted-Area Camping Itinerary, Permit Cost & Best Time',
    description: 'The Upper Dolpo trek to Shey Phoksundo Lake and Shey Gompa: a long restricted-area camping expedition in trans-Himalayan far-west Nepal. Permits, cost, itinerary and FAQ.'
  },
  overview: [
    'Upper Dolpo is one of the most remote inhabited regions in Nepal — a high desert plateau north of the main Himalayan crest, geographically and culturally part of the Tibetan world, protected within Shey Phoksundo National Park. It was closed to outsiders until 1989, and it is still a restricted area requiring a costly special permit, a licensed guide and a group of at least two.',
    'This is a long camping expedition. From the airstrip at Juphal the route climbs to the deep turquoise of Shey Phoksundo Lake, crosses the Kang La (or Baga La / Numa La, depending on the itinerary) into the Shey valley, and visits the ancient crystal-mountain monastery of Shey Gompa. Beyond, it threads a series of 5,000 m passes and villages — Saldang, Namdo, Tinje, Charka — where the buildings are flat-roofed mud, the fields are barley, and yak caravans still carry salt.',
    'It is in the rain-shadow, so — unusually — the main season is the summer monsoon, when the rest of Nepal is under cloud. The altitude is sustained, the passes are frequent, the food is basic camp fare, and the trip is three weeks or more. It is for experienced trekkers who want one of the great long walks left in the Himalaya.'
  ],
  highlights: [
    'Shey Phoksundo Lake — Nepal’s deepest, an electric turquoise below Kanjiroba',
    'Shey Gompa and Crystal Mountain — an ancient pilgrimage site with a ritual kora',
    'A string of 5,000 m passes across the trans-Himalayan plateau',
    'Living Tibetan villages: Saldang, Namgung, Tinje, Charka Bhot',
    'Bön and Nyingma monasteries in a landscape almost untouched by roads',
    'Trekking in the monsoon months, in the rain-shadow, when nowhere else works'
  ],
  suitability: {
    physical: 10, technical: 3, altitude: 10, remoteness: 10,
    walkHours: '6–8 hours a day for three weeks, with repeated high passes',
    terrain: 'High-desert trails, moraine, multiple 5,000 m passes, river crossings. Non-technical but unrelenting.',
    weatherExposure: 'High — you are days from any road, on an exposed plateau, for two to three weeks.',
    goodFor: [
      'Very experienced trekkers who have done long remote routes before',
      'Walkers who want three-plus weeks of genuine wilderness and Tibetan culture',
      'Anyone seeking a serious trek during the June–August monsoon'
    ],
    notIdeal: [
      'First-time or intermediate trekkers — this is an advanced expedition',
      'Solo trekkers — the restricted-area permit requires a group of two or more',
      'Trips with fixed end dates and no flexibility for weather and flight delays'
    ]
  },
  why: {
    lead: 'Peter Matthiessen wrote a book about walking here. It is still that kind of place.',
    paragraphs: [
      'Upper Dolpo is what much of the Tibetan plateau was before the roads: hand-farmed barley terraces at 4,000 m, salt caravans, monasteries perched on crags, and a silence that is total. Shey Phoksundo Lake, on the way in, is the single most vivid colour in the Nepal Himalaya. Beyond it, the land opens into ochre and grey plateau under enormous skies.',
      'The trek is hard-won — weeks of camping, thin air, basic food, frequent passes — and that is the filter that keeps it the way it is. Almost everyone who completes it describes it as the best trek they have done.'
    ],
    gallery: [
      { img: '/images/hero-mountain.jpg', caption: 'Shey Phoksundo Lake below the Kanjiroba range' },
      { img: '/images/manaslu.png', caption: 'A 5,000 m pass on the Dolpo plateau' },
      { img: '/images/footer.png', caption: 'A Tibetan village in Upper Dolpo' }
    ]
  },
  passes: [
    { name: 'Kang La', elevation: '5,350 m', day: 8 },
    { name: 'Saldang La', elevation: '5,200 m', day: 12 },
    { name: 'Jeng La', elevation: '5,090 m', day: 17 }
  ],
  acclimatization: {
    days: [5, 10, 15],
    note: 'The long, gradual approach and the days spent around Shey Phoksundo Lake (3,610 m) and Shey Gompa (4,500 m) do much of the acclimatisation. The itinerary still builds explicit rest days before the first big pass and mid-plateau. Because the route crosses a 5,000 m pass every few days, there is no room for a rushed schedule.'
  },
  itinerary: [
    { day: 1, title: 'Fly Kathmandu–Nepalgunj–Juphal, trek to Dunai', from: 'Kathmandu', to: 'Dunai (2,140 m)', distanceKm: '5 km + flights', walkHours: '2–3 hrs', startEle: 1400, endEle: 2140, terrain: 'Two flights, then a river trail', stay: 'Camp', meals: 'B/L/D', highlights: ['The Bheri river gorge'], tips: 'Both flights are weather-sensitive — the trip can start a day late.' },
    { day: 2, title: 'Dunai to Ankhe', from: 'Dunai (2,140 m)', to: 'Ankhe (2,660 m)', distanceKm: '13 km', walkHours: '5–6 hrs', startEle: 2140, endEle: 2660, terrain: 'River trail into the national park', stay: 'Camp', meals: 'B/L/D', highlights: ['Park entry checkpoint'], tips: 'Ease into the routine.' },
    { day: 3, title: 'Ankhe to Sulighat / Renje', from: 'Ankhe (2,660 m)', to: 'Renje (3,010 m)', distanceKm: '14 km', walkHours: '6–7 hrs', startEle: 2660, endEle: 3010, terrain: 'Forest and exposed cliff paths above the gorge', stay: 'Camp', meals: 'B/L/D', highlights: ['Airy trail sections'], tips: 'Some exposure — steady footing.' },
    { day: 4, title: 'Renje to Shey Phoksundo Lake (Ringmo)', from: 'Renje (3,010 m)', to: 'Ringmo / Phoksundo (3,610 m)', distanceKm: '13 km', walkHours: '5–6 hrs', startEle: 3010, endEle: 3610, terrain: 'Climb past Nepal’s highest waterfall to the lake', stay: 'Camp', meals: 'B/L/D', highlights: ['First sight of Phoksundo’s turquoise', 'Ringmo village and its Bön gompa'], tips: 'The colour is real — it is not the camera.' },
    { day: 5, title: 'Phoksundo Lake — acclimatisation day', from: 'Phoksundo (3,610 m)', to: 'Phoksundo (3,610 m)', distanceKm: '6–8 km', walkHours: '3–4 hrs', startEle: 3610, endEle: 3610, terrain: 'Lakeshore and ridge walks', stay: 'Camp', meals: 'B/L/D', highlights: ['The lake from above', 'Tibetan Bön culture in Ringmo'], tips: 'A genuine rest day before the plateau.' },
    { day: 6, title: 'Phoksundo to Phoksundo Khola', from: 'Phoksundo (3,610 m)', to: 'Phoksundo Khola (3,630 m)', distanceKm: '10 km', walkHours: '4–5 hrs', startEle: 3610, endEle: 3630, terrain: 'The famous ledge trail along the lake’s west shore', stay: 'Camp', meals: 'B/L/D', highlights: ['The vertiginous lakeside ledge path'], tips: 'The narrow ledge is the crux of the approach — take it slowly.' },
    { day: 7, title: 'Phoksundo Khola to Snowfields Camp', from: 'Phoksundo Khola (3,630 m)', to: 'Snowfields Camp (4,720 m)', distanceKm: '13 km', walkHours: '6–7 hrs', startEle: 3630, endEle: 4720, terrain: 'Up the valley toward the Kang La', stay: 'Camp', meals: 'B/L/D', highlights: ['Into high, bare country'], tips: 'Big altitude gain — a slow, steady pace.' },
    { day: 8, title: 'Cross the Kang La to Shey Gompa', from: 'Snowfields Camp (4,720 m)', to: 'Shey Gompa (4,500 m)', distanceKm: '10 km', walkHours: '6–7 hrs', startEle: 4720, endEle: 4500, terrain: 'Climb to the Kang La (5,350 m), descend to the Shey valley', stay: 'Camp', meals: 'B/L/D', highlights: ['Kang La (5,350 m)', 'Shey Gompa and Crystal Mountain'], tips: 'The first big pass — an early start, weather permitting.' },
    { day: 9, title: 'Shey Gompa — rest / exploration day', from: 'Shey Gompa (4,500 m)', to: 'Shey Gompa (4,500 m)', distanceKm: '6–10 km', walkHours: '3–5 hrs', startEle: 4500, endEle: 4500, terrain: 'The Crystal Mountain kora path', stay: 'Camp', meals: 'B/L/D', highlights: ['The pilgrimage circuit of Crystal Mountain', 'The ancient Shey monastery'], tips: 'The spiritual heart of Dolpo — worth the full day.' },
    { day: 10, title: 'Shey Gompa to Namgung via the Saldang La', from: 'Shey Gompa (4,500 m)', to: 'Namgung (4,430 m)', distanceKm: '13 km', walkHours: '6–7 hrs', startEle: 4500, endEle: 4430, terrain: 'Over the Saldang La (5,200 m), then a red-cliff descent', stay: 'Camp', meals: 'B/L/D', highlights: ['Saldang La (5,200 m)', 'Namgung monastery in its gorge'], tips: 'Second pass in three days.' },
    { day: 11, title: 'Namgung to Saldang', from: 'Namgung (4,430 m)', to: 'Saldang (3,900 m)', distanceKm: '9 km', walkHours: '4–5 hrs', startEle: 4430, endEle: 3900, terrain: 'Plateau trail', stay: 'Camp', meals: 'B/L/D', highlights: ['Saldang — the largest village in Upper Dolpo'], tips: 'Barley fields at 3,900 m.' },
    { day: 12, title: 'Saldang to Sibu / Namdo', from: 'Saldang (3,900 m)', to: 'Sibu (3,940 m)', distanceKm: '13 km', walkHours: '5–6 hrs', startEle: 3900, endEle: 3940, terrain: 'Riverside trail past chortens and villages', stay: 'Camp', meals: 'B/L/D', highlights: ['Namdo monastery', 'Salt-caravan country'], tips: 'A gentler day on the plateau.' },
    { day: 13, title: 'Sibu to Jeng La Base', from: 'Sibu (3,940 m)', to: 'Jeng La Base (4,370 m)', distanceKm: '12 km', walkHours: '5–6 hrs', startEle: 3940, endEle: 4370, terrain: 'Up a side valley toward the Jeng La', stay: 'Camp', meals: 'B/L/D', highlights: ['Yak pastures'], tips: 'Position for the pass.' },
    { day: 14, title: 'Cross the Jeng La to Tokyu', from: 'Jeng La Base (4,370 m)', to: 'Tokyu (4,240 m)', distanceKm: '13 km', walkHours: '6–7 hrs', startEle: 4370, endEle: 4240, terrain: 'Jeng La (5,090 m), then descent into the Tarap valley', stay: 'Camp', meals: 'B/L/D', highlights: ['Jeng La (5,090 m)', 'The green Tarap valley'], tips: 'Into one of the most fertile valleys in Dolpo.' },
    { day: 15, title: 'Tokyu to Dho Tarap', from: 'Tokyu (4,240 m)', to: 'Dho Tarap (4,090 m)', distanceKm: '8 km', walkHours: '3–4 hrs', startEle: 4240, endEle: 4090, terrain: 'Valley-floor trail', stay: 'Camp', meals: 'B/L/D', highlights: ['Dho Tarap — a large village with Bön and Buddhist gompas'], tips: 'A short day; rest and meet the community.' },
    { day: 16, title: 'Dho Tarap — rest / acclimatisation day', from: 'Dho Tarap (4,090 m)', to: 'Dho Tarap (4,090 m)', distanceKm: '5–8 km', walkHours: '3–4 hrs', startEle: 4090, endEle: 4090, terrain: 'Village and monastery visits', stay: 'Camp', meals: 'B/L/D', highlights: ['Crestone Bön monastery', 'Amchi (traditional doctor) tradition'], tips: 'A cultural rest day before the descent begins.' },
    { day: 17, title: 'Dho Tarap to Tarap Khola (Kamakharka)', from: 'Dho Tarap (4,090 m)', to: 'Kamakharka (3,800 m)', distanceKm: '15 km', walkHours: '6–7 hrs', startEle: 4090, endEle: 3800, terrain: 'Enter the deepening Tarap gorge', stay: 'Camp', meals: 'B/L/D', highlights: ['The gorge closes in'], tips: 'The long descent to Juphal begins.' },
    { day: 18, title: 'Kamakharka to Khani Gaon', from: 'Kamakharka (3,800 m)', to: 'Khani Gaon (2,550 m)', distanceKm: '14 km', walkHours: '6–7 hrs', startEle: 3800, endEle: 2550, terrain: 'Narrow gorge with river crossings', stay: 'Camp', meals: 'B/L/D', highlights: ['Dramatic gorge scenery'], tips: 'Some exposed and eroded sections.' },
    { day: 19, title: 'Khani Gaon to Tarakot', from: 'Khani Gaon (2,550 m)', to: 'Tarakot (2,540 m)', distanceKm: '12 km', walkHours: '5 hrs', startEle: 2550, endEle: 2540, terrain: 'Out of the gorge into farmland', stay: 'Camp', meals: 'B/L/D', highlights: ['Back among fields and forest'], tips: 'Warm, green and easy after the plateau.' },
    { day: 20, title: 'Tarakot to Dunai', from: 'Tarakot (2,540 m)', to: 'Dunai (2,140 m)', distanceKm: '13 km', walkHours: '5 hrs', startEle: 2540, endEle: 2140, terrain: 'Bheri river trail', stay: 'Camp / guesthouse', meals: 'B/L/D', highlights: ['The district headquarters'], tips: 'Nearly done.' },
    { day: 21, title: 'Dunai to Juphal', from: 'Dunai (2,140 m)', to: 'Juphal (2,490 m)', distanceKm: '6 km', walkHours: '2–3 hrs', startEle: 2140, endEle: 2490, terrain: 'Climb to the airstrip', stay: 'Guesthouse', meals: 'B/L/D', highlights: ['Trek complete'], tips: 'Position for the morning flight.' },
    { day: 22, title: 'Fly Juphal–Nepalgunj–Kathmandu', from: 'Juphal (2,490 m)', to: 'Kathmandu', distanceKm: '—', walkHours: '—', startEle: 2490, endEle: 1400, terrain: 'Two flights', stay: 'Hotel', meals: 'B', highlights: ['The far-west hills from the air'], tips: 'Keep 2–3 buffer days — the Juphal flight is one of the least reliable in Nepal.' }
  ],
  routePoints: [
    { name: 'Shey Phoksundo Lake (Ringmo)', elevation: '3,610 m', day: 4, walkTime: '5–6 hrs from Renje', stay: 'Camp near Ringmo village', highlight: 'Nepal’s deepest lake, an electric turquoise', warning: 'The west-shore ledge trail beyond is genuinely exposed.' },
    { name: 'Shey Gompa', elevation: '4,500 m', day: 8, walkTime: 'Over the Kang La from Snowfields Camp', stay: 'Camp', highlight: 'Ancient monastery and the Crystal Mountain kora', warning: 'First 5,000 m+ pass just crossed — watch for AMS.' },
    { name: 'Saldang', elevation: '3,900 m', day: 11, walkTime: 'Over the Saldang La from Shey', stay: 'Camp', highlight: 'The largest village in Upper Dolpo', warning: 'Second major pass done in three days.' },
    { name: 'Dho Tarap', elevation: '4,090 m', day: 15, walkTime: 'Over the Jeng La from Sibu', stay: 'Camp', highlight: 'A living Bön and Buddhist village and amchi tradition', warning: 'The last village before the long gorge descent.' }
  ],
  permits: [
    { name: 'Upper Dolpo Restricted Area Permit', where: 'Kathmandu, through a licensed operator only', feeNote: 'A high per-person fee for the first 10 days plus a steep daily rate after — one of the most expensive permits in Nepal; verify', notes: 'Requires a group of at least two and a licensed guide. Independent trekking is not allowed.' },
    { name: 'Shey Phoksundo National Park entry permit', where: 'Kathmandu (NTB) or the park checkpoint', feeNote: 'Fixed park fee — verify', notes: 'Carry passport and photos.' }
  ],
  cost: {
    note: 'A three-plus-week camping expedition in a very expensive restricted area with hard access — among the costliest treks in Nepal. Confirm a quote for your dates and group size.',
    tiers: [
      { name: 'Supported camping', rangeUSD: '$3,800–$5,200', includes: ['Licensed guide + cook + crew', 'Restricted-area + park permits', 'Domestic flights via Nepalgunj', 'All camping equipment', 'All meals on trek'] },
      { name: 'Expedition style', rangeUSD: '$5,400–$7,000', includes: ['Higher guide ratio', 'Better mess and tents', 'Extra contingency days', 'Naturalist / cultural guide'] },
      { name: 'Premium', rangeUSD: '$7,500+', includes: ['Small private team', 'Pre-arranged helicopter contingency', 'Extra rest days', 'Charka Bhot / Jomsom exit variant'] }
    ],
    breakdown: [
      { item: 'Restricted-area permit', note: 'Per person, tiered by days — by far the largest single cost' },
      { item: 'National park permit', note: 'Fixed, additional' },
      { item: 'Access flights', note: 'Kathmandu–Nepalgunj–Juphal, both legs weather-prone' },
      { item: 'Crew', note: 'Guide, cook, kitchen crew and a string of porters for 3+ weeks' },
      { item: 'Food + fuel', note: 'Everything is carried; villages sell almost nothing to trekkers' },
      { item: 'Contingency', note: 'Multiple spare days for the Juphal flight and pass weather' }
    ],
    independentVsGuided: 'Independent trekking is not permitted. The Upper Dolpo permit is issued only to groups of two or more with a licensed guide through a registered operator, and the route needs full camp support regardless.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Nepalgunj', mode: 'Flight (~1 hr)', duration: '1 hr', note: 'To the western Terai; usually an overnight here.' },
      { from: 'Nepalgunj', to: 'Juphal', mode: 'Small aircraft (~35 min)', duration: '35 min', note: 'One of the least reliable STOL flights in the country — frequently delayed for days.' },
      { from: 'Juphal', to: 'Trail', mode: 'On foot', duration: '—', note: '' }
    ],
    note: 'Budget 2–3 contingency days purely for the Juphal flight, plus flexibility for the passes. Some itineraries exit east to Jomsom via Charka Bhot, avoiding the Juphal return.'
  },
  equipment: [
    { item: '4-season sleeping bag (≈ −18°C to −20°C) + mat', need: 'essential', note: 'Three-plus weeks of camping, much of it above 3,900 m.' },
    { item: 'Trekking poles', need: 'essential', note: 'Endless passes and a very long final gorge descent.' },
    { item: 'Microspikes', need: 'recommended', note: 'For snow on the passes, especially early and late season.' },
    { item: 'Full waterproofs', need: 'essential', note: 'Even in the rain-shadow, afternoon storms cross the passes.' },
    { item: 'Water filter + chemical backup', need: 'essential', note: 'No treated-water stations anywhere on the route.' },
    { item: 'Satellite messenger', need: 'essential', note: 'Two to three weeks with no mobile coverage and no road.' }
  ],
  safety: {
    risks: [
      { name: 'Extreme remoteness', note: 'For most of the trek you are days from a road and from any medical facility. Evacuation means a helicopter and a weather window over the passes.' },
      { name: 'Repeated high passes', note: 'The route crosses a 5,000 m pass every few days for two weeks. Sustained altitude with limited descent options makes acclimatisation critical.' },
      { name: 'The Juphal flight', note: 'The single least reliable link in the trip — delays of several days are common at both ends.' },
      { name: 'The Phoksundo ledge trail', note: 'A narrow, exposed path along the lake’s west shore — a genuine fall hazard.' },
      { name: 'Basic food and long duration', note: 'Weeks of simple camp fare at altitude leads to weight loss and fatigue; a good cook and morale management matter.' }
    ],
    turnaround: 'Given the length and the passes, the itinerary carries several buffer days and the guide will spend them on weather and acclimatisation without hesitation. If a pass is snowed in, the team waits; a serious health problem means a helicopter from the nearest valley floor. The route is planned so that there is always a downward option, even if it is slow.',
    note: 'Carry a satellite messenger, confirm your insurance covers a 3-week trek to 5,350 m with helicopter rescue, and expect the trip to run a day or two long. A PAC bag carried by the crew is a sensible precaution on a route this committing.'
  },
  faq: [
    { q: 'How hard is the Upper Dolpo trek?', a: 'It is one of the most demanding treks in Nepal — three-plus weeks, around 250 km, camping throughout, with a 5,000 m pass every few days and no resupply. It suits only experienced, very fit trekkers.' },
    { q: 'Do I need a permit and guide for Upper Dolpo?', a: 'Yes. It is a restricted area needing an Upper Dolpo Restricted Area Permit (a large per-person fee), a Shey Phoksundo National Park permit, a licensed guide and a group of at least two. Independent trekking is not allowed.' },
    { q: 'Why is the Upper Dolpo permit so expensive?', a: 'The government sets a high per-person fee for the first 10 days plus a steep daily rate afterwards, to limit numbers in a fragile, culturally sensitive area. It is one of the two or three most expensive trekking permits in Nepal.' },
    { q: 'When is the best time to trek Upper Dolpo?', a: 'Mid-May to October, including the June–August monsoon — Dolpo is in the rain-shadow, so it is one of the few regions that works in the wet season. Snow closes the passes in winter and early spring.' },
    { q: 'How high does the trek go?', a: 'Around 5,350 m at the highest pass (Kang La), with camps regularly between 4,000 and 4,700 m.' },
    { q: 'Do I camp the whole way?', a: 'Yes. There are no tea houses; your crew carries tents, food and fuel for the entire route.' },
    { q: 'How do I get to the trailhead?', a: 'Fly Kathmandu–Nepalgunj (about an hour), overnight, then a short but very unreliable flight to Juphal. Budget several buffer days for this leg.' },
    { q: 'Is there any mobile coverage?', a: 'Effectively none once you leave Juphal. A satellite messenger is essential.' },
    { q: 'What is the food like?', a: 'Cook-prepared camp meals — dal bhat, pasta, soups, porridge — with limited fresh ingredients after the first few days. Bring your own snacks and supplements for three weeks.' },
    { q: 'What is Shey Gompa and Crystal Mountain?', a: 'An ancient monastery and a sacred peak in the Shey valley, with a ritual kora (circumambulation) path. It is the spiritual centre of Dolpo and a major regional pilgrimage site.' },
    { q: 'Can I do a shorter version?', a: 'Yes — the Lower Dolpo trek (to Phoksundo Lake and the Tarap valley, without the Upper Dolpo passes and permit) is about 10–14 days. Phoksundo Lake alone is a shorter option again.' },
    { q: 'What if I get altitude sickness?', a: 'You descend to the nearest lower valley — the route always has a downward option, though it may be slow — recover, and either continue on a reduced plan or arrange a helicopter. The buffer and rest days exist to prevent this.' },
    { q: 'How many spare days should I budget?', a: 'Two to three, mostly for the Juphal flight, plus the buffer days already built into the itinerary for the passes.' }
  ],
  relatedTreks: ['lower-dolpo', 'shey-phoksundo-lake', 'rara-lake-trek', 'limi-valley'],
  relatedDestinations: [
    { name: 'Lower Dolpo', note: 'The shorter, permit-light version of the same region.' },
    { name: 'Jomsom & Upper Mustang', note: 'The eastern exit variant links Dolpo to Mustang — another trans-Himalayan region.' },
    { name: 'Bardiya National Park', note: 'A warm wildlife contrast near Nepalgunj on the way in or out.' }
  ],
  hotelsNote: 'Trips include Kathmandu and Nepalgunj hotels; the trek is fully camp-supported for three-plus weeks. This is planned as an expedition — talk to us well ahead about dates, group size and the permit.'
};

TREKS['lower-dolpo'] = {
  slug: 'lower-dolpo',
  name: 'Lower Dolpo Trek',
  tagline: 'Phoksundo Lake and the Tarap valley, without the big permit',
  province: 'karnali',
  region: 'Dolpo',
  heroImage: '/images/hero-mountain.jpg',
  summary: 'A 12–14 day camping trek into Lower Dolpo — Shey Phoksundo Lake, the Numa La (5,190 m) and Baga La (5,070 m) passes, and the fertile Tarap valley with its Bön and Buddhist villages. A shorter, more affordable window into the Dolpo world.',
  stats: {
    duration: '12–14 days (10–12 on the trail)',
    difficulty: 'Challenging',
    maxAltitude: '≈ 5,190 m',
    maxAltitudePoint: 'Numa La',
    bestSeason: 'Apr–Oct (rain-shadow — monsoon possible)',
    startPoint: 'Juphal (flight via Nepalgunj)',
    endPoint: 'Juphal',
    distanceKm: '≈ 120–150 km',
    walkHours: '5–7 hrs/day'
  },
  seo: {
    title: 'Lower Dolpo Trek — Nepal | Phoksundo Lake & Tarap Valley Itinerary, Cost & FAQ',
    description: 'The Lower Dolpo trek to Shey Phoksundo Lake and the Tarap valley over the Numa La and Baga La. A shorter, cheaper Dolpo camping trek. Itinerary, permits, cost and FAQ.'
  },
  overview: [
    'Lower Dolpo is the southern part of the Dolpo region, inside Shey Phoksundo National Park but — crucially — mostly outside the very expensive Upper Dolpo restricted zone. It gives you the two headline experiences of Dolpo, the turquoise of Phoksundo Lake and the trans-Himalayan Tarap valley, in under two weeks and at a fraction of the permit cost.',
    'From Juphal the route climbs to Phoksundo Lake, then heads east up the Phoksundo Khola and over the Numa La (5,190 m) and Baga La (5,070 m) — two consecutive 5,000 m passes with a camp between them — into the Tarap valley. Dho Tarap, at 4,090 m, is a substantial village with an ancient amchi (Tibetan medicine) tradition and both Bön and Nyingma monasteries. The trek then descends the long Tarap gorge back to Dunai and Juphal.',
    'It is still a camping trek — no lodges — and the two passes make it a serious undertaking, but it is a realistic introduction to Dolpo for trekkers who cannot commit three-plus weeks or the Upper Dolpo permit fee.'
  ],
  highlights: [
    'Shey Phoksundo Lake — Nepal’s deepest, and its most vivid colour',
    'The Numa La (5,190 m) and Baga La (5,070 m) — two passes in two days',
    'The Tarap valley and Dho Tarap village at 4,090 m',
    'Bön monasteries and the living amchi medical tradition',
    'The dramatic Tarap gorge on the descent',
    'The Dolpo experience without the Upper Dolpo permit cost or the three-week commitment'
  ],
  suitability: {
    physical: 8, technical: 2, altitude: 9, remoteness: 8,
    walkHours: '5–7 hours a day, two hard consecutive pass days',
    terrain: 'National-park forest and gorge trails, high moraine, two 5,000 m passes, a long descent gorge.',
    weatherExposure: 'High on the passes — no shelter, and snow can hold you up.',
    goodFor: [
      'Experienced trekkers who want Dolpo but not the Upper Dolpo cost or length',
      'Walkers comfortable with camping and two consecutive high passes',
      'Anyone wanting a rain-shadow trek in the shoulder or monsoon months'
    ],
    notIdeal: [
      'First-time trekkers or anyone new to camping and altitude',
      'Solo trekkers — camping support and (for parts of the route) permit rules require a group',
      'Trips with no flexibility for the Juphal flight'
    ]
  },
  why: {
    lead: 'Everything that makes Dolpo special, in twelve days instead of twenty-five.',
    paragraphs: [
      'Phoksundo Lake is the single most photographed sight in the Nepalese far west for a reason — a body of water so intensely blue-green it looks lit from within, held in a bowl of red cliffs below the Kanjiroba peaks. Lower Dolpo gets you there, then over the passes into the Tarap valley, where the barley fields, the flat-roofed houses and the monasteries are pure trans-Himalaya.',
      'The two passes back to back are the price of admission, and they are a real day each, but the trek is short enough and the culture rich enough that it is one of the best value-for-effort remote trips in Nepal.'
    ],
    gallery: [
      { img: '/images/hero-mountain.jpg', caption: 'Shey Phoksundo Lake' },
      { img: '/images/manaslu.png', caption: 'The Numa La on the crossing to Tarap' },
      { img: '/images/footer.png', caption: 'Dho Tarap village' }
    ]
  },
  passes: [
    { name: 'Numa La', elevation: '5,190 m', day: 7 },
    { name: 'Baga La', elevation: '5,070 m', day: 8 }
  ],
  acclimatization: {
    days: [5],
    note: 'A day around Phoksundo Lake (3,610 m) is the main acclimatisation, with the gradual climb up the Phoksundo Khola helping before the Numa La. The two passes come close together, so being genuinely acclimatised at the lake is important — do not compress the schedule to save a day.'
  },
  itinerary: [
    { day: 1, title: 'Fly to Juphal, trek to Dunai', from: 'Kathmandu (via Nepalgunj)', to: 'Dunai (2,140 m)', distanceKm: '5 km + flights', walkHours: '2–3 hrs', startEle: 1400, endEle: 2140, terrain: 'Flights, then a river trail', stay: 'Camp', meals: 'B/L/D', highlights: ['The Bheri gorge'], tips: 'The Juphal flight can slip a day — allow slack.' },
    { day: 2, title: 'Dunai to Chhepka', from: 'Dunai (2,140 m)', to: 'Chhepka (2,720 m)', distanceKm: '14 km', walkHours: '5–6 hrs', startEle: 2140, endEle: 2720, terrain: 'Into the national park along the Suli Gad', stay: 'Camp', meals: 'B/L/D', highlights: ['Park entry', 'Dense forest'], tips: 'Ease into the rhythm.' },
    { day: 3, title: 'Chhepka to Renje / Amchi Hospital', from: 'Chhepka (2,720 m)', to: 'Renje (3,010 m)', distanceKm: '13 km', walkHours: '5–6 hrs', startEle: 2720, endEle: 3010, terrain: 'Forest and cliff paths', stay: 'Camp', meals: 'B/L/D', highlights: ['Airy trail above the river'], tips: 'Some exposure.' },
    { day: 4, title: 'Renje to Phoksundo Lake', from: 'Renje (3,010 m)', to: 'Ringmo / Phoksundo (3,610 m)', distanceKm: '13 km', walkHours: '5–6 hrs', startEle: 3010, endEle: 3610, terrain: 'Climb past Nepal’s highest waterfall to the lake', stay: 'Camp', meals: 'B/L/D', highlights: ['First view of the lake', 'Ringmo Bön gompa'], tips: 'The colour is genuine.' },
    { day: 5, title: 'Phoksundo Lake — acclimatisation day', from: 'Phoksundo (3,610 m)', to: 'Phoksundo (3,610 m)', distanceKm: '6–8 km', walkHours: '3–4 hrs', startEle: 3610, endEle: 3610, terrain: 'Lakeshore and ridge walks', stay: 'Camp', meals: 'B/L/D', highlights: ['The lake from above'], tips: 'A real rest day before the passes.' },
    { day: 6, title: 'Phoksundo to Numa La Base Camp', from: 'Phoksundo (3,610 m)', to: 'Numa La Base (4,440 m)', distanceKm: '12 km', walkHours: '6–7 hrs', startEle: 3610, endEle: 4440, terrain: 'The lakeside ledge trail, then up the valley', stay: 'Camp', meals: 'B/L/D', highlights: ['The famous ledge path', 'Into high country'], tips: 'The ledge is the crux of the approach — take it slowly.' },
    { day: 7, title: 'Cross the Numa La to Pelung Tang', from: 'Numa La Base (4,440 m)', to: 'Pelung Tang (4,465 m)', distanceKm: '13 km', walkHours: '6–7 hrs', startEle: 4440, endEle: 4465, terrain: 'Climb to the Numa La (5,190 m), descend to a camp', stay: 'Camp', meals: 'B/L/D', highlights: ['Numa La (5,190 m)', 'Dhaulagiri far to the east'], tips: 'The first and higher of the two passes — an early start.' },
    { day: 8, title: 'Cross the Baga La to Dho Tarap', from: 'Pelung Tang (4,465 m)', to: 'Dho Tarap (4,090 m)', distanceKm: '13 km', walkHours: '6–7 hrs', startEle: 4465, endEle: 4090, terrain: 'Climb to the Baga La (5,070 m), then descend into the Tarap valley', stay: 'Camp', meals: 'B/L/D', highlights: ['Baga La (5,070 m)', 'The green Tarap valley opening ahead'], tips: 'Second pass day in a row — pace yourself.' },
    { day: 9, title: 'Dho Tarap — rest / exploration day', from: 'Dho Tarap (4,090 m)', to: 'Dho Tarap (4,090 m)', distanceKm: '5–8 km', walkHours: '3–4 hrs', startEle: 4090, endEle: 4090, terrain: 'Village and monastery visits', stay: 'Camp', meals: 'B/L/D', highlights: ['Bön and Nyingma gompas', 'The amchi tradition'], tips: 'A cultural rest day before the gorge.' },
    { day: 10, title: 'Dho Tarap to Tarap Khola (Kamakharka)', from: 'Dho Tarap (4,090 m)', to: 'Kamakharka (3,800 m)', distanceKm: '15 km', walkHours: '6–7 hrs', startEle: 4090, endEle: 3800, terrain: 'Down the widening then narrowing Tarap valley', stay: 'Camp', meals: 'B/L/D', highlights: ['The gorge begins'], tips: 'The long descent starts.' },
    { day: 11, title: 'Kamakharka to Khani Gaon', from: 'Kamakharka (3,800 m)', to: 'Khani Gaon (2,550 m)', distanceKm: '14 km', walkHours: '6–7 hrs', startEle: 3800, endEle: 2550, terrain: 'Deep gorge with many river crossings', stay: 'Camp', meals: 'B/L/D', highlights: ['Spectacular gorge scenery'], tips: 'Exposed and eroded in places — steady footing.' },
    { day: 12, title: 'Khani Gaon to Tarakot to Dunai', from: 'Khani Gaon (2,550 m)', to: 'Dunai (2,140 m)', distanceKm: '18 km', walkHours: '6–7 hrs', startEle: 2550, endEle: 2140, terrain: 'Out of the gorge, then the Bheri river trail', stay: 'Camp / guesthouse', meals: 'B/L/D', highlights: ['Back among fields and forest'], tips: 'A long but easy final trekking day.' },
    { day: 13, title: 'Dunai to Juphal', from: 'Dunai (2,140 m)', to: 'Juphal (2,490 m)', distanceKm: '6 km', walkHours: '2–3 hrs', startEle: 2140, endEle: 2490, terrain: 'Climb to the airstrip', stay: 'Guesthouse', meals: 'B/L/D', highlights: ['Trek complete'], tips: 'Position for the morning flight.' },
    { day: 14, title: 'Fly Juphal–Nepalgunj–Kathmandu', from: 'Juphal (2,490 m)', to: 'Kathmandu', distanceKm: '—', walkHours: '—', startEle: 2490, endEle: 1400, terrain: 'Two flights', stay: 'Hotel', meals: 'B', highlights: ['Far-west hills from the air'], tips: 'Keep 1–2 buffer days for the Juphal flight.' }
  ],
  routePoints: [
    { name: 'Shey Phoksundo Lake (Ringmo)', elevation: '3,610 m', day: 4, walkTime: '5–6 hrs from Renje', stay: 'Camp near Ringmo', highlight: 'Nepal’s deepest and most vivid lake', warning: 'The west-shore ledge trail beyond is exposed.' },
    { name: 'Numa La', elevation: '5,190 m', day: 7, walkTime: 'From Numa La Base Camp', stay: 'Pass — no shelter', highlight: 'The higher of the two passes, with a Dhaulagiri view', warning: 'Snow-prone; crossed only in reasonable weather.' },
    { name: 'Baga La', elevation: '5,070 m', day: 8, walkTime: 'From Pelung Tang', stay: 'Pass — no shelter', highlight: 'The gateway into the Tarap valley', warning: 'Second consecutive 5,000 m pass — watch for cumulative altitude effects.' },
    { name: 'Dho Tarap', elevation: '4,090 m', day: 8, walkTime: 'Below the Baga La', stay: 'Camp', highlight: 'A large trans-Himalayan village with Bön and Buddhist gompas', warning: 'The last village before the descent gorge.' }
  ],
  permits: [
    { name: 'Lower Dolpo restricted area / local area permit', where: 'Kathmandu, through a licensed operator', feeNote: 'A modest per-week fee — far lower than Upper Dolpo; verify', notes: 'A guide and a group are still required; the exact permit and its cost change — confirm with your operator.' },
    { name: 'Shey Phoksundo National Park entry permit', where: 'Kathmandu (NTB) or the park checkpoint', feeNote: 'Fixed park fee — verify', notes: 'Carry passport and photos.' }
  ],
  cost: {
    note: 'A camping trek with a much smaller permit cost than Upper Dolpo, but the same difficult air access. Confirm a quote for your dates.',
    tiers: [
      { name: 'Supported camping', rangeUSD: '$2,000–$2,800', includes: ['Guide + cook + crew', 'Permits', 'Domestic flights via Nepalgunj', 'All camping equipment', 'All meals on trek'] },
      { name: 'Expedition style', rangeUSD: '$2,900–$3,800', includes: ['Higher guide ratio', 'Better mess and tents', 'Extra contingency days', 'Private departure'] },
      { name: 'Premium', rangeUSD: '$4,200+', includes: ['Small private team', 'Naturalist / cultural guide', 'Pre-arranged helicopter contingency'] }
    ],
    breakdown: [
      { item: 'Permits', note: 'Lower Dolpo area permit + national park — the area permit is modest' },
      { item: 'Access flights', note: 'Kathmandu–Nepalgunj–Juphal, weather-prone' },
      { item: 'Crew', note: 'Guide, cook and porters for a camping trek' },
      { item: 'Food + fuel', note: 'Carried in; villages sell little' },
      { item: 'Contingency', note: 'Spare days for the Juphal flight and the passes' }
    ],
    independentVsGuided: 'Lower Dolpo requires a guide and (for the restricted sections) a group, and there are no lodges, so full camp support is needed regardless. It is not a route for independent trekking.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Nepalgunj', mode: 'Flight (~1 hr)', duration: '1 hr', note: 'Usually an overnight in Nepalgunj.' },
      { from: 'Nepalgunj', to: 'Juphal', mode: 'Small aircraft (~35 min)', duration: '35 min', note: 'Frequently delayed — the main reason to carry buffer days.' }
    ],
    note: 'Budget 1–2 contingency days for the Juphal flight and one for the passes.'
  },
  equipment: [
    { item: '4-season sleeping bag (≈ −15°C to −18°C) + mat', need: 'essential', note: 'Camping throughout, including at 4,400 m before the passes.' },
    { item: 'Trekking poles', need: 'essential', note: 'Two pass days and a very long descent gorge.' },
    { item: 'Microspikes', need: 'recommended', note: 'For snow on the Numa La and Baga La.' },
    { item: 'Full waterproofs', need: 'essential', note: 'Afternoon storms cross the passes even in the rain-shadow.' },
    { item: 'Water filter + chemical backup', need: 'essential', note: 'No treated-water points.' },
    { item: 'Satellite messenger', need: 'recommended', note: 'No mobile coverage on the route.' }
  ],
  safety: {
    risks: [
      { name: 'Two passes back to back', note: 'The Numa La and Baga La come on consecutive days with a high camp between. Cumulative altitude effects catch out trekkers who felt fine on the first pass.' },
      { name: 'Remoteness', note: 'No road, no lodges, no medical facilities on the route. Evacuation is by helicopter from a valley floor in clear weather.' },
      { name: 'The Juphal flight', note: 'Unreliable — plan for delays at both ends.' },
      { name: 'The Phoksundo ledge trail', note: 'A narrow, exposed path along the lake — a real fall hazard.' },
      { name: 'The Tarap gorge', note: 'Long, with many river crossings and eroded sections on the descent.' }
    ],
    turnaround: 'If the passes are snowed in, the trip can revert to an out-and-back to Phoksundo Lake, which is a rewarding trek in itself. If someone is unwell before the passes, descending to the lake and beyond is straightforward.',
    note: 'Carry a satellite messenger and confirm your insurance covers a camping trek to 5,200 m with helicopter rescue.'
  },
  faq: [
    { q: 'What is the difference between Lower Dolpo and Upper Dolpo?', a: 'Lower Dolpo covers Phoksundo Lake and the Tarap valley over the Numa La and Baga La, in about 12–14 days, with a modest permit. Upper Dolpo continues north to Shey Gompa and the plateau villages, taking 22–26 days with a very expensive restricted-area permit.' },
    { q: 'How hard is the Lower Dolpo trek?', a: 'Challenging — camping throughout, remote, with two consecutive 5,000 m passes and a long descent gorge. It suits experienced trekkers, though it is shorter and less committing than Upper Dolpo.' },
    { q: 'Do I need a permit and guide?', a: 'Yes — a Lower Dolpo area permit (modest), a Shey Phoksundo National Park permit, a licensed guide and a group. Independent trekking is not permitted, and there are no lodges.' },
    { q: 'How high does it go?', a: '5,190 m at the Numa La, 5,070 m at the Baga La, with a camp around 4,465 m between them.' },
    { q: 'When is the best time to trek Lower Dolpo?', a: 'April to October, including the monsoon — Dolpo is in the rain-shadow. Snow closes the passes in winter and early spring.' },
    { q: 'Do I camp the whole way?', a: 'Yes. There is no tea-house network; your crew carries everything.' },
    { q: 'How do I get there?', a: 'Fly Kathmandu–Nepalgunj, overnight, then a short unreliable flight to Juphal. Carry buffer days.' },
    { q: 'Can I just visit Phoksundo Lake?', a: 'Yes — an out-and-back from Juphal to Phoksundo Lake is about 7–9 days and avoids the passes, making a gentler introduction to Dolpo.' },
    { q: 'Is there mobile coverage?', a: 'Almost none. Carry a satellite messenger.' },
    { q: 'What is the food like?', a: 'Cook-prepared camp meals with limited fresh ingredients after the first days. Bring your own snacks.' },
    { q: 'What if I get altitude sickness before the passes?', a: 'You descend to Phoksundo Lake or lower to recover, then either attempt the passes or complete the trip as a lake out-and-back.' },
    { q: 'How many spare days should I budget?', a: 'Two to three — mainly for the Juphal flight, plus one for pass weather.' }
  ],
  relatedTreks: ['upper-dolpo', 'shey-phoksundo-lake', 'rara-lake-trek', 'limi-valley'],
  relatedDestinations: [
    { name: 'Upper Dolpo', note: 'The full plateau trek, for those with more time and budget.' },
    { name: 'Rara Lake', note: 'The other great far-western lake trek, reachable from the same region.' },
    { name: 'Bardiya National Park', note: 'A wildlife stop near Nepalgunj on the way in or out.' }
  ],
  hotelsNote: 'Trips include Kathmandu and Nepalgunj hotels; the trek is fully camp-supported. Ask us about the shorter Phoksundo Lake out-and-back if the two passes are more than you want.'
};

TREKS['shey-phoksundo-lake'] = {
  slug: 'shey-phoksundo-lake',
  name: 'Shey Phoksundo Lake Trek',
  tagline: 'Nepal’s deepest lake, in the far-western wilds',
  province: 'karnali',
  region: 'Dolpo',
  heroImage: '/images/hero-mountain.jpg',
  summary: 'A 9–12 day camping trek from Juphal to Shey Phoksundo Lake (3,610 m) — the deepest and most vividly coloured lake in Nepal, in Shey Phoksundo National Park — with the Bön village of Ringmo, Nepal’s highest waterfall, and the option of a high viewpoint above the lake. The gentlest way into Dolpo.',
  stats: {
    duration: '9–12 days (7–10 on the trail)',
    difficulty: 'Moderate to Challenging',
    maxAltitude: '≈ 4,000 m (viewpoint), lake at 3,610 m',
    maxAltitudePoint: 'Lakeside ridge viewpoint',
    bestSeason: 'Apr–Oct (rain-shadow — monsoon possible)',
    startPoint: 'Juphal (flight via Nepalgunj)',
    endPoint: 'Juphal',
    distanceKm: '≈ 80–100 km',
    walkHours: '5–6 hrs/day'
  },
  seo: {
    title: 'Shey Phoksundo Lake Trek — Nepal | Itinerary, Cost, Difficulty & Best Time',
    description: 'The Shey Phoksundo Lake trek in Dolpo: an out-and-back camping trek to Nepal’s deepest lake. Itinerary, difficulty, permits, cost, best season and FAQ.'
  },
  overview: [
    'Shey Phoksundo Lake is the deepest lake in Nepal and, by common agreement, the most beautiful — a 145-metre-deep body of water in a startling blue-green, ringed by red conglomerate cliffs and the peaks of the Kanjiroba Himal, with no fish and no aquatic plants because of its mineral content. It is the centrepiece of Shey Phoksundo National Park, the largest national park in Nepal.',
    'The trek to it is an out-and-back from the Juphal airstrip: up the Bheri and then the Suli Gad valley through forest and gorge, past the 167-metre Phoksundo (Suligad) Falls — Nepal’s highest — to the lakeside Bön village of Ringmo. Most itineraries spend two nights at the lake, with a walk up onto the ridge for the classic high view and a stroll along the start of the vertiginous west-shore ledge trail.',
    'It is a camping trek — no lodges — and the altitude reaches 3,610 m at the lake (higher on the viewpoint walk), but it involves no high passes, which makes it the least demanding way to experience Dolpo. It suits trekkers who want the far-western wilderness and Tibetan-Bön culture without a three-week expedition.'
  ],
  highlights: [
    'Shey Phoksundo Lake — Nepal’s deepest, and its most vivid colour',
    'Ringmo — a Bön village of flat-roofed houses and chortens on the lake shore',
    'Phoksundo (Suligad) Falls — the highest waterfall in Nepal, at 167 m',
    'The Bön monastery of Tshowa above the lake',
    'The start of the famous cliff-ledge trail along the west shore',
    'A gentler introduction to Dolpo — no high passes'
  ],
  suitability: {
    physical: 6, technical: 1, altitude: 6, remoteness: 8,
    walkHours: '5–6 hours a day',
    terrain: 'National-park forest and gorge trails, one steep climb to the lake, some exposed cliff path. No passes.',
    weatherExposure: 'Moderate — the route stays in valleys and at the lake, not on ridges or passes.',
    goodFor: [
      'Trekkers wanting a remote far-western experience without high passes',
      'Anyone drawn to the lake and Bön culture specifically',
      'Fit walkers new to camping treks, as a first remote trip'
    ],
    notIdeal: [
      'Trekkers wanting the full Dolpo plateau and its 5,000 m passes',
      'Solo trekkers — camping support and a guide are required',
      'Trips with no flexibility for the Juphal flight'
    ]
  },
  why: {
    lead: 'Some places are worth a long journey to see once. Phoksundo is one.',
    paragraphs: [
      'The colour is the thing. Photographs make it look filtered; in person it is more intense, an almost luminous turquoise against the red cliffs and the dark forest. The Bön village of Ringmo on the shore — Bön being the pre-Buddhist religion of Tibet — adds a cultural depth you find almost nowhere else, and the walk up onto the ridge for the postcard view is a gentle hour.',
      'Because there are no passes, the trek is accessible to anyone reasonably fit who is prepared to camp, which makes it the natural first step into the Dolpo world.'
    ],
    gallery: [
      { img: '/images/hero-mountain.jpg', caption: 'Shey Phoksundo Lake from the ridge' },
      { img: '/images/footer.png', caption: 'Ringmo village on the lake shore' },
      { img: '/images/itinerary.png', caption: 'Forest trail in Shey Phoksundo National Park' }
    ]
  },
  passes: [],
  acclimatization: {
    days: [5],
    note: 'The climb from Juphal (2,490 m) to the lake (3,610 m) is spread over four days, so acclimatisation is gentle. The rest day at the lake, with the ridge-viewpoint walk to ~4,000 m and back, doubles as “climb high, sleep low”. Mild AMS is uncommon here but report headaches.'
  },
  itinerary: [
    { day: 1, title: 'Fly to Juphal, trek to Dunai', from: 'Kathmandu (via Nepalgunj)', to: 'Dunai (2,140 m)', distanceKm: '5 km + flights', walkHours: '2–3 hrs', startEle: 1400, endEle: 2140, terrain: 'Flights, then a river trail', stay: 'Camp', meals: 'B/L/D', highlights: ['The Bheri gorge'], tips: 'The Juphal flight can slip — build in slack.' },
    { day: 2, title: 'Dunai to Chhepka', from: 'Dunai (2,140 m)', to: 'Chhepka (2,720 m)', distanceKm: '14 km', walkHours: '5–6 hrs', startEle: 2140, endEle: 2720, terrain: 'Along the Suli Gad into the national park', stay: 'Camp', meals: 'B/L/D', highlights: ['Park entry', 'Blue pine and walnut forest'], tips: 'Ease in.' },
    { day: 3, title: 'Chhepka to Amchi Hospital / Renje', from: 'Chhepka (2,720 m)', to: 'Renje (3,010 m)', distanceKm: '13 km', walkHours: '5–6 hrs', startEle: 2720, endEle: 3010, terrain: 'Forest and cliff paths above the river', stay: 'Camp', meals: 'B/L/D', highlights: ['Airy trail sections', 'First high peaks'], tips: 'Some exposure — steady footing.' },
    { day: 4, title: 'Renje to Shey Phoksundo Lake', from: 'Renje (3,010 m)', to: 'Ringmo / Phoksundo (3,610 m)', distanceKm: '13 km', walkHours: '5–6 hrs', startEle: 3010, endEle: 3610, terrain: 'Steep climb past Phoksundo Falls to the lake', stay: 'Camp', meals: 'B/L/D', highlights: ['Phoksundo Falls — Nepal’s highest', 'First view of the lake'], tips: 'The final climb is steep but short — then the colour hits you.' },
    { day: 5, title: 'Phoksundo Lake — exploration day', from: 'Phoksundo (3,610 m)', to: 'Phoksundo (3,610 m)', distanceKm: '6–10 km', walkHours: '3–5 hrs', startEle: 3610, endEle: 3610, terrain: 'Ridge viewpoint (~4,000 m), Tshowa gompa, the west-shore ledge start', stay: 'Camp', meals: 'B/L/D', highlights: ['The classic high view of the lake', 'Tshowa Bön monastery', 'Ringmo village'], tips: 'Do the ridge walk in the morning light.' },
    { day: 6, title: 'Phoksundo Lake to Chhepka', from: 'Phoksundo (3,610 m)', to: 'Chhepka (2,720 m)', distanceKm: '20 km', walkHours: '6–7 hrs', startEle: 3610, endEle: 2720, terrain: 'Retrace the descent through the gorge', stay: 'Camp', meals: 'B/L/D', highlights: ['A last look back at the lake'], tips: 'A long descent — poles help.' },
    { day: 7, title: 'Chhepka to Juphal', from: 'Chhepka (2,720 m)', to: 'Juphal (2,490 m)', distanceKm: '18 km', walkHours: '6–7 hrs', startEle: 2720, endEle: 2490, terrain: 'River trail, then a climb to the airstrip', stay: 'Guesthouse', meals: 'B/L/D', highlights: ['Trek complete'], tips: 'Position for the morning flight.' },
    { day: 8, title: 'Fly Juphal–Nepalgunj–Kathmandu', from: 'Juphal (2,490 m)', to: 'Kathmandu', distanceKm: '—', walkHours: '—', startEle: 2490, endEle: 1400, terrain: 'Two flights', stay: 'Hotel', meals: 'B', highlights: ['The far-west hills from the air'], tips: 'Keep 1–2 buffer days for the Juphal flight.' },
    { day: 9, title: 'Contingency / departure day', from: 'Kathmandu', to: 'Kathmandu', distanceKm: '—', walkHours: '—', startEle: 1400, endEle: 1400, terrain: '—', stay: 'Hotel', meals: 'B', highlights: ['Spare day for flight delays'], tips: 'Sightseeing if unused.' }
  ],
  routePoints: [
    { name: 'Chhepka', elevation: '2,720 m', day: 2, walkTime: '5–6 hrs from Dunai', stay: 'Camp', highlight: 'The first camp inside the national park', warning: 'The trail beyond has exposed cliff sections.' },
    { name: 'Phoksundo Falls', elevation: '≈ 3,200 m', day: 4, walkTime: 'On the climb to the lake', highlight: 'Nepal’s highest waterfall, 167 m', warning: 'The trail climbs steeply beside it.' },
    { name: 'Ringmo / Phoksundo Lake', elevation: '3,610 m', day: 4, walkTime: '5–6 hrs from Renje', stay: 'Camp near Ringmo village', highlight: 'Nepal’s deepest lake and a Bön village', warning: 'The west-shore ledge trail is genuinely exposed — day-walk only a short way unless continuing to Dolpo.' },
    { name: 'Ridge viewpoint', elevation: '≈ 4,000 m', day: 5, walkTime: '1.5–2 hrs above the lake', highlight: 'The classic photograph of the lake', warning: 'A steep but short climb; the trek’s high point.' }
  ],
  permits: [
    { name: 'Lower Dolpo restricted area / local area permit', where: 'Kathmandu, through a licensed operator', feeNote: 'A modest per-week fee — verify', notes: 'A guide and a group are required; the exact permit changes — confirm with your operator.' },
    { name: 'Shey Phoksundo National Park entry permit', where: 'Kathmandu (NTB) or the park checkpoint', feeNote: 'Fixed park fee — verify', notes: 'Carry passport and photos.' }
  ],
  cost: {
    note: 'The shortest and cheapest Dolpo trek, though the Juphal air access still drives the cost. Confirm a quote for your dates.',
    tiers: [
      { name: 'Supported camping', rangeUSD: '$1,700–$2,300', includes: ['Guide + cook + crew', 'Permits', 'Domestic flights via Nepalgunj', 'All camping equipment', 'All meals on trek'] },
      { name: 'Comfort / private', rangeUSD: '$2,400–$3,200', includes: ['Private departure', 'Higher guide ratio', 'Better mess and tents', 'Kathmandu 4★'] },
      { name: 'Premium', rangeUSD: '$3,600+', includes: ['Naturalist / cultural guide', 'Extra lake day', 'Pre-arranged helicopter contingency'] }
    ],
    breakdown: [
      { item: 'Permits', note: 'Area permit + national park' },
      { item: 'Access flights', note: 'Kathmandu–Nepalgunj–Juphal, weather-prone' },
      { item: 'Crew', note: 'Guide, cook and porters for a camping trek' },
      { item: 'Food + fuel', note: 'Carried in' },
      { item: 'Contingency', note: 'Spare days for the Juphal flight' }
    ],
    independentVsGuided: 'A guide and a group are required, and there are no lodges, so the trek needs camp support. It is not a route for independent trekking.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Nepalgunj', mode: 'Flight (~1 hr)', duration: '1 hr', note: 'Usually an overnight in Nepalgunj.' },
      { from: 'Nepalgunj', to: 'Juphal', mode: 'Small aircraft (~35 min)', duration: '35 min', note: 'Frequently delayed — carry buffer days.' }
    ],
    note: 'Budget 1–2 contingency days for the Juphal flight.'
  },
  equipment: [
    { item: '4-season sleeping bag (≈ −12°C to −15°C) + mat', need: 'essential', note: 'Camping throughout; the lake is cold at night.' },
    { item: 'Trekking poles', need: 'recommended', note: 'For the steep lake climb and the long descent day.' },
    { item: 'Full waterproofs', need: 'essential', note: 'The forested gorge catches weather.' },
    { item: 'Water filter + chemical backup', need: 'essential', note: 'No treated-water points.' },
    { item: 'Sturdy footwear with grip', need: 'essential', note: 'The cliff-path sections are exposed and can be greasy.' }
  ],
  safety: {
    risks: [
      { name: 'Exposed cliff trails', note: 'The Suli Gad approach and, especially, the start of the west-shore ledge trail at the lake have real fall exposure. Stay on the path and go slowly.' },
      { name: 'Remoteness', note: 'No road, no lodges, no medical facilities. Evacuation is by helicopter from the valley in clear weather.' },
      { name: 'The Juphal flight', note: 'Unreliable — plan for delays at both ends.' },
      { name: 'Altitude', note: 'Modest — the lake is 3,610 m and the viewpoint about 4,000 m — but report headaches on the ridge walk.' }
    ],
    turnaround: 'There is no pass to be turned back by. If the weather is poor at the lake, the ridge viewpoint walk is simply skipped; if the Juphal flight is badly delayed, the itinerary is compressed at the lower, easier end.',
    note: 'Carry a satellite messenger. The trek is short and stays relatively low, making it one of the lower-risk options in the far west.'
  },
  faq: [
    { q: 'How difficult is the Shey Phoksundo Lake trek?', a: 'Moderate to challenging. There are no high passes, but it is a camping trek in a remote area with some exposed cliff trails and one steep climb to the lake.' },
    { q: 'How high is the trek?', a: 'The lake is at 3,610 m; the ridge viewpoint walk reaches about 4,000 m. There are no 5,000 m passes on this route.' },
    { q: 'Do I need a permit and guide?', a: 'Yes — a Lower Dolpo area permit (modest), a Shey Phoksundo National Park permit, a licensed guide and a group. There are no lodges, so camp support is required.' },
    { q: 'When is the best time to go?', a: 'April to October, including the monsoon, because Dolpo is in the rain-shadow. Snow and cold make winter impractical.' },
    { q: 'Why is Phoksundo Lake so blue?', a: 'Its mineral content and depth — 145 m — combined with the lack of aquatic life give it an unusually vivid blue-green colour that is even more striking in person than in photos.' },
    { q: 'Can I extend the trek into Dolpo?', a: 'Yes — from the lake you can continue over the Numa La and Baga La into the Tarap valley (Lower Dolpo), or north over the Kang La to Shey Gompa (Upper Dolpo, with its expensive permit).' },
    { q: 'Do I camp the whole way?', a: 'Yes. There is no tea-house network on this route.' },
    { q: 'How do I get there?', a: 'Fly Kathmandu–Nepalgunj, overnight, then a short unreliable flight to Juphal. Carry buffer days.' },
    { q: 'Is there mobile coverage?', a: 'Little to none. Carry a satellite messenger.' },
    { q: 'What is the food like?', a: 'Cook-prepared camp meals. Fresh ingredients thin out after the first couple of days — bring your own snacks.' },
    { q: 'Is it suitable as a first camping trek?', a: 'Yes, for a fit walker — it is the gentlest Dolpo option, with no passes. Be prepared for the remoteness and the exposed trail sections.' },
    { q: 'How many spare days should I budget?', a: 'One to two, mainly for the Juphal flight.' }
  ],
  relatedTreks: ['lower-dolpo', 'upper-dolpo', 'rara-lake-trek', 'limi-valley'],
  relatedDestinations: [
    { name: 'Lower & Upper Dolpo', note: 'Continue from the lake for the full Dolpo experience.' },
    { name: 'Rara Lake', note: 'The other great far-western lake — different, and larger.' },
    { name: 'Bardiya National Park', note: 'A wildlife stop near Nepalgunj on the way in or out.' }
  ],
  hotelsNote: 'Trips include Kathmandu and Nepalgunj hotels; the trek is fully camp-supported. Ask us about continuing into Lower or Upper Dolpo from the lake.'
};

TREKS['rara-lake-trek'] = {
  slug: 'rara-lake-trek',
  name: 'Rara Lake Trek',
  tagline: 'Nepal’s largest lake, in the empty far west',
  province: 'karnali',
  region: 'Rara',
  heroImage: '/images/hero-mountain.jpg',
  summary: 'An 8–10 day trek to Rara Lake (2,990 m) — the largest lake in Nepal, a deep blue oval inside Rara National Park in remote Mugu district — through pine and juniper forest, Chhetri and Thakuri villages, and grassland where you may see nothing man-made for hours.',
  stats: {
    duration: '8–10 days (5–7 on the trail)',
    difficulty: 'Moderate',
    maxAltitude: '≈ 3,720 m',
    maxAltitudePoint: 'Ghurchi Lagna pass',
    bestSeason: 'Mar–May · Sep–Nov',
    startPoint: 'Talcha / Jumla (flight, often via Nepalgunj)',
    endPoint: 'Talcha / Jumla',
    distanceKm: '≈ 60–90 km (route-dependent)',
    walkHours: '4–6 hrs/day'
  },
  seo: {
    title: 'Rara Lake Trek — Nepal | Itinerary, Cost, Difficulty & Best Time',
    description: 'The Rara Lake trek to Nepal’s largest lake in the remote far west: 8–10 day itinerary, difficulty, permits, cost, best season and FAQ.'
  },
  overview: [
    'Rara Lake sits at 2,990 m in Mugu, one of the least-developed districts in Nepal, surrounded by the pine-and-juniper forest and open meadows of Rara National Park. It is the largest lake in the country — about 10.8 square kilometres — and a striking deep blue, backed on clear days by the snow of the Kanjiroba and Sisne ranges.',
    'The trek is not high or technical — the maximum is around 3,700 m at the Ghurchi Lagna pass on the classic Jumla approach — but it is genuinely remote. The country is thinly populated, the villages are Hindu Chhetri and Thakuri rather than Buddhist, and the trail passes through grassland and forest where wildlife (Himalayan black bear, red panda, musk deer, hundreds of bird species) still has room.',
    'Access has improved: many trips now fly into Talcha airstrip, a few hours’ walk from the lake, rather than trekking the full three days from Jumla, which makes Rara feasible in a week. It can be done as a tea-house / basic-lodge trek on the main sections or with camping support on the quieter loops.'
  ],
  highlights: [
    'Rara Lake — the largest lake in Nepal, deep blue below snow peaks',
    'A full or partial circuit of the lakeshore, often deserted',
    'Rara National Park — bears, red panda, musk deer, and rich birdlife',
    'The Ghurchi Lagna pass and the pine forests of the Jumla approach',
    'Chhetri and Thakuri villages in one of Nepal’s remotest districts',
    'A moderate-altitude trek with a big-wilderness feel'
  ],
  suitability: {
    physical: 5, technical: 1, altitude: 4, remoteness: 8,
    walkHours: '4–6 hours a day',
    terrain: 'Forest and meadow trails, one modest pass, easy lakeshore paths. Nothing steep or exposed for long.',
    weatherExposure: 'Low to moderate — the route stays in forest and around the lake.',
    goodFor: [
      'Trekkers who want deep remoteness without high altitude',
      'Families and less experienced walkers (with the Talcha fly-in option)',
      'Anyone interested in birdlife, forest and lake scenery over big peaks'
    ],
    notIdeal: [
      'Trekkers wanting glaciers, 5,000 m passes or an 8,000 m base camp',
      'Anyone on a rigid schedule — the far-western flights are unreliable',
      'Those expecting good lodges — accommodation is basic'
    ]
  },
  why: {
    lead: 'The emptiest big landscape in Nepal that you can walk into in a week.',
    paragraphs: [
      'Rara does not have the drama of a base-camp trek, and that is the point. It is about space and quiet — walking through pine forest with a lake the size of a small sea appearing between the trees, and often not seeing another trekker all day. The full lakeshore circuit is a gentle half-day and one of the loveliest short walks in the country.',
      'The far west of Nepal is the part visitors almost never reach, and Rara is its accessible jewel — a national park created in the 1970s specifically to protect this lake and its forest.'
    ],
    gallery: [
      { img: '/images/hero-mountain.jpg', caption: 'Rara Lake below the far-western snows' },
      { img: '/images/itinerary.png', caption: 'Pine forest on the Jumla approach' },
      { img: '/images/footer.png', caption: 'A Thakuri village in Mugu' }
    ]
  },
  passes: [{ name: 'Ghurchi Lagna', elevation: '≈ 3,720 m', day: 3 }],
  acclimatization: {
    days: [],
    note: 'With a maximum altitude around 3,700 m and the lake at just under 3,000 m, Rara does not require dedicated acclimatisation days. A steady ascent from Jumla or a gentle first day from Talcha is enough. Mild AMS is uncommon here.'
  },
  itinerary: [
    { day: 1, title: 'Fly to Nepalgunj', from: 'Kathmandu', to: 'Nepalgunj (150 m)', distanceKm: '—', walkHours: '1 hr flight', startEle: 1400, endEle: 150, terrain: 'Flight to the western Terai', stay: 'Hotel', meals: 'B', highlights: ['Positioning for the mountain flight'], tips: 'An overnight here is normal — the onward flights are morning-only.' },
    { day: 2, title: 'Fly Nepalgunj to Talcha, trek to Rara Lake', from: 'Nepalgunj (150 m)', to: 'Rara Lake (2,990 m)', distanceKm: '9 km', walkHours: '3–4 hrs', startEle: 150, endEle: 2990, terrain: 'Mountain flight, then a forest trail to the lake', stay: 'Camp / basic lodge', meals: 'B/L/D', highlights: ['First view of the lake', 'Rara National Park forest'], tips: 'A gentle first walking day; watch for the altitude despite the short distance.' },
    { day: 3, title: 'Rara Lake — full lakeshore circuit', from: 'Rara Lake (2,990 m)', to: 'Rara Lake (2,990 m)', distanceKm: '13 km', walkHours: '4–5 hrs', startEle: 2990, endEle: 2990, terrain: 'Easy lakeshore and meadow path', stay: 'Camp / basic lodge', meals: 'B/L/D', highlights: ['The Murma Top viewpoint (optional, ~3,650 m)', 'Deserted shoreline and birdlife'], tips: 'Add the Murma Top climb for the best panorama of the lake and the snows.' },
    { day: 4, title: 'Rara Lake to Gorusingha', from: 'Rara Lake (2,990 m)', to: 'Gorusingha (3,190 m)', distanceKm: '13 km', walkHours: '5–6 hrs', startEle: 2990, endEle: 3190, terrain: 'Forest trail south toward the Jumla route', stay: 'Camp', meals: 'B/L/D', highlights: ['Meadows and pine forest', 'Chuchemara ridge views'], tips: 'The classic route now heads back toward Jumla.' },
    { day: 5, title: 'Gorusingha to Sinja via the Ghurchi Lagna', from: 'Gorusingha (3,190 m)', to: 'Sinja (2,440 m)', distanceKm: '15 km', walkHours: '6–7 hrs', startEle: 3190, endEle: 2440, terrain: 'Climb to the Ghurchi Lagna (3,720 m), long descent to the Sinja valley', stay: 'Camp', meals: 'B/L/D', highlights: ['Ghurchi Lagna pass', 'Sinja — a former capital of the Khasa kingdom'], tips: 'The one real climb of the trek.' },
    { day: 6, title: 'Sinja to Jumla', from: 'Sinja (2,440 m)', to: 'Jumla (2,370 m)', distanceKm: '18 km', walkHours: '6–7 hrs', startEle: 2440, endEle: 2370, terrain: 'Valley trail through farming villages', stay: 'Guesthouse', meals: 'B/L/D', highlights: ['Apple orchards', 'Jumla — the district headquarters'], tips: 'A long but easy final trekking day.' },
    { day: 7, title: 'Fly Jumla to Nepalgunj to Kathmandu', from: 'Jumla (2,370 m)', to: 'Kathmandu', distanceKm: '—', walkHours: 'two flights', startEle: 2370, endEle: 1400, terrain: 'Two flights', stay: 'Hotel', meals: 'B', highlights: ['The Karnali hills from the air'], tips: 'Keep buffer days — both far-western legs can be delayed.' },
    { day: 8, title: 'Contingency / departure day', from: 'Kathmandu', to: 'Kathmandu', distanceKm: '—', walkHours: '—', startEle: 1400, endEle: 1400, terrain: '—', stay: 'Hotel', meals: 'B', highlights: ['Spare day for flight delays'], tips: 'Sightseeing if unused.' }
  ],
  routePoints: [
    { name: 'Talcha airstrip', elevation: '≈ 2,700 m', day: 2, walkTime: 'Fly-in point', stay: 'None — trek onward', highlight: 'The short-cut access to Rara', warning: 'Flights here are weather-dependent and infrequent.' },
    { name: 'Rara Lake', elevation: '2,990 m', day: 2, walkTime: '3–4 hrs from Talcha', stay: 'Camp or basic lodges near the ranger post', highlight: 'The largest lake in Nepal', warning: 'Nights are cold; accommodation is very basic.' },
    { name: 'Murma Top', elevation: '≈ 3,650 m', day: 3, walkTime: '2–3 hrs from the lake', highlight: 'The best panorama of the lake and the Kanjiroba snows', warning: 'A steady climb; the trek’s optional high point.' },
    { name: 'Ghurchi Lagna', elevation: '≈ 3,720 m', day: 5, walkTime: 'From Gorusingha', stay: 'Pass — no shelter', highlight: 'The one real pass, on the Jumla route', warning: 'Can hold snow in early spring and late autumn.' }
  ],
  permits: [
    { name: 'Rara National Park entry permit', where: 'Kathmandu (NTB) or the park checkpoint', feeNote: 'Fixed park fee — verify', notes: 'Carry passport and photos.' },
    { name: 'Local area / rural municipality permit', where: 'Kathmandu or on the route', feeNote: 'Local fee — verify', notes: 'Requirements for Mugu / Jumla change — confirm with your operator.' }
  ],
  cost: {
    note: 'A moderate trek, but the two-leg far-western flight access is the main cost driver. Confirm a quote for your dates.',
    tiers: [
      { name: 'Basic lodge + camping', rangeUSD: '$1,200–$1,800', includes: ['Guide + crew', 'Permits', 'Domestic flights via Nepalgunj', 'Lodges / tents', 'All trek meals'] },
      { name: 'Fully supported camping', rangeUSD: '$1,900–$2,600', includes: ['Full camp crew', 'Private departure', 'Kathmandu / Nepalgunj hotels', 'Porter team'] },
      { name: 'Premium', rangeUSD: '$3,000+', includes: ['Naturalist / birding guide', 'Better camp', 'Extra lake day', 'Helicopter contingency'] }
    ],
    breakdown: [
      { item: 'Permits', note: 'National park + local fee' },
      { item: 'Access flights', note: 'Kathmandu–Nepalgunj–Talcha (or Jumla), both legs weather-prone' },
      { item: 'Crew', note: 'Guide, cook and porters' },
      { item: 'Food + fuel', note: 'Largely carried; villages sell little to trekkers' },
      { item: 'Contingency', note: 'Spare days for the far-western flights' }
    ],
    independentVsGuided: 'A guide is required, and the area’s remoteness and thin accommodation mean camp support is the norm. It is not a route for independent trekking.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Nepalgunj', mode: 'Flight (~1 hr)', duration: '1 hr', note: 'Usually an overnight.' },
      { from: 'Nepalgunj', to: 'Talcha (Rara) or Jumla', mode: 'Small aircraft (~35–45 min)', duration: '35–45 min', note: 'Infrequent and weather-dependent; a road now reaches parts of the region but the drive is very long.' }
    ],
    note: 'Budget 2 contingency days for the far-western flights at each end. An all-overland option exists but adds days of rough driving.'
  },
  equipment: [
    { item: 'Sleeping bag to ≈ −10°C to −12°C + mat', need: 'essential', note: 'Camping or very basic lodges; cold at the lake.' },
    { item: 'Trekking poles', need: 'recommended', note: 'For the Ghurchi Lagna and the long descent to Sinja.' },
    { item: 'Waterproof jacket', need: 'essential', note: 'Spring and autumn can bring afternoon rain or snow flurries.' },
    { item: 'Binoculars', need: 'optional', note: 'Rara National Park is one of the best birding areas in Nepal.' },
    { item: 'Water filter + chemical backup', need: 'essential', note: 'No treated-water points.' }
  ],
  safety: {
    risks: [
      { name: 'Remoteness', note: 'Mugu is one of the least-served districts in Nepal. Medical facilities are minimal; evacuation is by helicopter to Nepalgunj in clear weather.' },
      { name: 'Far-western flights', note: 'The Nepalgunj–Talcha / Jumla legs are infrequent and often delayed — the main threat to the schedule.' },
      { name: 'Cold', note: 'The lake is exposed and nights drop below freezing in the trekking seasons; basic lodges offer little warmth.' },
      { name: 'Wildlife', note: 'Himalayan black bears are present in the park forest — normal caution around dawn and dusk, and with food in camp, is enough.' }
    ],
    turnaround: 'With no committing pass beyond the modest Ghurchi Lagna, "turning around" mostly means adjusting the route — for instance flying both ways to Talcha and skipping the Jumla walk-out if weather or time is short.',
    note: 'Carry a satellite messenger. The main practical risk on this trek is a flight delay stranding you at either end — build in the buffer days.'
  },
  faq: [
    { q: 'How difficult is the Rara Lake trek?', a: 'Moderate. The maximum altitude is around 3,700 m, there are no glaciers or serious passes, and the daily distances are reasonable. The challenge is the remoteness and the basic conditions, not the terrain.' },
    { q: 'How high is Rara Lake?', a: '2,990 m. The Ghurchi Lagna pass on the Jumla route is about 3,720 m, and the optional Murma Top viewpoint is around 3,650 m.' },
    { q: 'Is Rara Lake the largest lake in Nepal?', a: 'Yes — about 10.8 square kilometres, larger than Phewa or Begnas, and one of the deepest.' },
    { q: 'How do I get to Rara Lake?', a: 'Fly Kathmandu–Nepalgunj, overnight, then a short flight to Talcha (a few hours from the lake) or Jumla (a 2–3 day walk in). Carry buffer days for these flights.' },
    { q: 'When is the best time to trek to Rara?', a: 'March–May, with rhododendron and migrating birds, and September–November for clear post-monsoon skies. Winter is cold with snow on the approaches.' },
    { q: 'Can I do it as a short trek?', a: 'Yes — flying both ways to Talcha, with two nights at the lake and the lakeshore circuit, is a 5–6 day trip. Walking out to Jumla adds 2–3 days and more villages.' },
    { q: 'Do I need a permit and guide?', a: 'A Rara National Park permit and a local permit are required, along with a licensed guide. Camp support is the norm given the thin accommodation.' },
    { q: 'What is the accommodation like?', a: 'Basic lodges and camping near the lake and in the villages — clean but simple, with limited food and little heating.' },
    { q: 'Is there mobile coverage and Wi-Fi?', a: 'Patchy near the villages and the ranger post; little elsewhere. Carry a satellite messenger.' },
    { q: 'What wildlife might I see?', a: 'Rara National Park has Himalayan black bear, red panda, musk deer, leopard and over 200 bird species. Sightings of the mammals are luck; the birdlife is reliably rich.' },
    { q: 'Are there ATMs?', a: 'No. Carry all your cash from Kathmandu or Nepalgunj.' },
    { q: 'How many spare days should I budget?', a: 'Two, mainly for the far-western flights at each end.' }
  ],
  relatedTreks: ['limi-valley', 'shey-phoksundo-lake', 'lower-dolpo', 'upper-dolpo'],
  relatedDestinations: [
    { name: 'Jumla', note: 'The apple-growing district town on the walk-out — a window into far-western hill life.' },
    { name: 'Dolpo & Phoksundo Lake', note: 'The neighbouring region, and a natural pairing for a longer far-western trip.' },
    { name: 'Bardiya National Park', note: 'A wildlife stop near Nepalgunj on the way in or out.' }
  ],
  hotelsNote: 'Trips include Kathmandu and Nepalgunj hotels; the trek is basic lodges and camping. Ask us about combining Rara with Dolpo for a longer far-western journey.'
};

TREKS['limi-valley'] = {
  slug: 'limi-valley',
  name: 'Limi Valley Trek',
  tagline: 'A hidden loop on the Tibetan border in Humla',
  province: 'karnali',
  region: 'Humla',
  heroImage: '/images/hero-mountain.jpg',
  summary: 'An 18–20 day restricted-area camping trek in Humla — Nepal’s remote north-west corner — looping through the Limi Valley’s three Tibetan Buddhist villages, over the Nyalu La and Nara La passes (both around 4,900–5,000 m), close to Mount Kailash across the border.',
  stats: {
    duration: '18–20 days (14–16 on the trail)',
    difficulty: 'Strenuous',
    maxAltitude: '≈ 4,990 m',
    maxAltitudePoint: 'Nyalu La',
    bestSeason: 'Mid-May–early Oct (rain-shadow — monsoon possible)',
    startPoint: 'Simikot (flight via Nepalgunj or Surkhet)',
    endPoint: 'Simikot (via Hilsa and the Karnali gorge)',
    distanceKm: '≈ 160–190 km',
    walkHours: '5–8 hrs/day'
  },
  seo: {
    title: 'Limi Valley Trek — Nepal | Humla Restricted-Area Itinerary, Permit Cost & Best Time',
    description: 'The Limi Valley trek in Humla, far-north-west Nepal: a remote restricted-area camping loop near the Tibetan border and Mount Kailash. Permits, itinerary, difficulty and FAQ.'
  },
  overview: [
    'Humla is the most north-westerly district in Nepal, with no road connection to the rest of the country — you fly into Simikot from Nepalgunj or Surkhet, and everything after that is on foot or by mule. The Limi Valley, tucked against the Tibetan border, is one of the least-visited inhabited valleys in the Himalaya: three villages — Til, Halji and Jang — that are entirely Tibetan Buddhist in language, dress and religion, with a 1,000-year-old monastery at Halji (Rinchenling) and a way of life built around yak herding, wool and cross-border trade.',
    'The classic trek is a loop. It follows the old trade route toward the Tibetan border at Hilsa (used by pilgrims heading to Mount Kailash), then turns east into Limi over the Nyalu La (≈ 4,990 m), visits the three villages, and returns to Simikot over the Nara La and down the dramatic Karnali river gorge. It is a camping trek with a full crew, remote in a way few routes still are, and at altitude for much of its length.',
    'It is in the rain-shadow, so the season runs through the summer monsoon, and — like Dolpo and Mustang — it offers a rare window into Tibetan Nepal that has barely changed.'
  ],
  highlights: [
    'The three Limi villages — Til, Halji and Jang — and the ancient Rinchenling monastery at Halji',
    'The Nyalu La (≈ 4,990 m) and its glacial lake, Selma Tsho',
    'The Karnali (Humla Karnali) river gorge on the return',
    'Views toward Mount Kailash and the Tibetan plateau from the border ridges',
    'Snow leopard, blue sheep and kiang (wild ass) country',
    'One of the remotest inhabited valleys open to trekkers in Nepal'
  ],
  suitability: {
    physical: 9, technical: 3, altitude: 10, remoteness: 10,
    walkHours: '5–8 hours a day, with two ~5,000 m passes and sustained high camps',
    terrain: 'High-desert and gorge trails, moraine, two glaciated-adjacent passes, exposed cliff paths on the Karnali gorge.',
    weatherExposure: 'High — days from any road, on exposed high ground, for two weeks.',
    goodFor: [
      'Very experienced trekkers who have done remote camping routes before',
      'Walkers drawn to Tibetan border culture and true wilderness',
      'Anyone wanting a serious trek in the monsoon months'
    ],
    notIdeal: [
      'First-time or intermediate trekkers',
      'Solo trekkers — the restricted-area permit needs a group of two or more',
      'Trips without buffer days for the notoriously unreliable Simikot flight'
    ]
  },
  why: {
    lead: 'Limi is what people imagine when they think of a lost Himalayan valley — and it genuinely is one.',
    paragraphs: [
      'There is no road, no lodge network, and no mobile signal for most of the route. The three Limi villages relate to visitors as a curiosity rather than a business, the monastery at Halji is a working institution fighting a slow battle against a glacial flood that threatens the village, and the passes look straight across into Tibet toward Kailash.',
      'The Karnali gorge on the way back is a spectacle in its own right — a trail cut into cliffs hundreds of metres above the river — and the whole loop has the feel of a route that only a few hundred foreigners a year walk.'
    ],
    gallery: [
      { img: '/images/hero-mountain.jpg', caption: 'The Limi Valley and the Tibetan border ranges' },
      { img: '/images/footer.png', caption: 'Halji village and Rinchenling monastery' },
      { img: '/images/manaslu.png', caption: 'The Nyalu La and Selma Tsho lake' }
    ]
  },
  passes: [
    { name: 'Nyalu La', elevation: '≈ 4,990 m', day: 6 },
    { name: 'Nara La', elevation: '≈ 4,560 m', day: 13 }
  ],
  acclimatization: {
    days: [4, 9],
    note: 'The route climbs gradually from Simikot (2,950 m), with acclimatisation built in before the Nyalu La and again around the Limi villages. Because the Nyalu La is the first major pass and comes relatively early, being genuinely acclimatised beforehand — via the graded approach and a rest day — is critical.'
  },
  itinerary: [
    { day: 1, title: 'Fly Kathmandu–Nepalgunj', from: 'Kathmandu', to: 'Nepalgunj (150 m)', distanceKm: '—', walkHours: '1 hr flight', startEle: 1400, endEle: 150, terrain: 'Flight to the western Terai', stay: 'Hotel', meals: 'B', highlights: ['Positioning for the Simikot flight'], tips: 'Overnight here; the Simikot flight is morning-only.' },
    { day: 2, title: 'Fly Nepalgunj to Simikot, trek to Dharapuri', from: 'Nepalgunj (150 m)', to: 'Dharapuri (2,300 m)', distanceKm: '10 km', walkHours: '4–5 hrs', startEle: 150, endEle: 2300, terrain: 'Mountain flight, then a descent along the Karnali', stay: 'Camp', meals: 'B/L/D', highlights: ['First sight of the Karnali gorge'], tips: 'The Simikot flight is one of the least reliable in Nepal — expect possible delay.' },
    { day: 3, title: 'Dharapuri to Kermi', from: 'Dharapuri (2,300 m)', to: 'Kermi (2,670 m)', distanceKm: '12 km', walkHours: '5 hrs', startEle: 2300, endEle: 2670, terrain: 'River trail past hot springs', stay: 'Camp', meals: 'B/L/D', highlights: ['Hot springs near Kermi', 'First Buddhist village'], tips: 'The culture shifts from Hindu to Tibetan Buddhist here.' },
    { day: 4, title: 'Kermi to Yalbang', from: 'Kermi (2,670 m)', to: 'Yalbang (3,020 m)', distanceKm: '13 km', walkHours: '5–6 hrs', startEle: 2670, endEle: 3020, terrain: 'Cliff trail above the Karnali', stay: 'Camp', meals: 'B/L/D', highlights: ['Namkha Khyung Dzong monastery at Yalbang'], tips: 'One of the larger monasteries on the route.' },
    { day: 5, title: 'Yalbang to Tumkot / Til', from: 'Yalbang (3,020 m)', to: 'Til (3,700 m)', distanceKm: '14 km', walkHours: '6–7 hrs', startEle: 3020, endEle: 3700, terrain: 'Climb toward the Limi turn-off', stay: 'Camp', meals: 'B/L/D', highlights: ['Til — the first Limi village'], tips: 'Real altitude gain — pace it.' },
    { day: 6, title: 'Til to Halji', from: 'Til (3,700 m)', to: 'Halji (3,670 m)', distanceKm: '10 km', walkHours: '4–5 hrs', startEle: 3700, endEle: 3670, terrain: 'Valley trail between the villages', stay: 'Camp', meals: 'B/L/D', highlights: ['Rinchenling monastery — around 1,000 years old', 'Halji village life'], tips: 'Halji is the cultural heart of Limi.' },
    { day: 7, title: 'Halji — rest / exploration day', from: 'Halji (3,670 m)', to: 'Halji (3,670 m)', distanceKm: '4–8 km', walkHours: '2–4 hrs', startEle: 3670, endEle: 3670, terrain: 'Village and monastery, short walks', stay: 'Camp', meals: 'B/L/D', highlights: ['The monastery’s ancient statues and library', 'The glacial-flood mitigation works'], tips: 'An important acclimatisation and cultural day.' },
    { day: 8, title: 'Halji to Jang / Talung', from: 'Halji (3,670 m)', to: 'Jang (3,930 m)', distanceKm: '13 km', walkHours: '5–6 hrs', startEle: 3670, endEle: 3930, terrain: 'Up the Limi valley toward the high pastures', stay: 'Camp', meals: 'B/L/D', highlights: ['Jang — the last Limi village', 'Wide-open grazing country'], tips: 'Blue sheep and, with luck, signs of snow leopard.' },
    { day: 9, title: 'Jang to Talung (Nyalu La base)', from: 'Jang (3,930 m)', to: 'Talung (4,370 m)', distanceKm: '12 km', walkHours: '5–6 hrs', startEle: 3930, endEle: 4370, terrain: 'Pasture and moraine toward the pass', stay: 'Camp', meals: 'B/L/D', highlights: ['Selma Tsho glacial lake below the pass'], tips: 'A cold, high camp — an early night before the Nyalu La.' },
    { day: 10, title: 'Cross the Nyalu La to Shinjungma', from: 'Talung (4,370 m)', to: 'Shinjungma (3,620 m)', distanceKm: '15 km', walkHours: '7–8 hrs', startEle: 4370, endEle: 3620, terrain: 'Climb to the Nyalu La (≈ 4,990 m), long descent', stay: 'Camp', meals: 'B/L/D', highlights: ['Nyalu La (≈ 4,990 m)', 'Views toward Kailash and the Tibetan plateau'], tips: 'The trek’s highest point — an alpine start, weather permitting.' },
    { day: 11, title: 'Shinjungma to Hilsa', from: 'Shinjungma (3,620 m)', to: 'Hilsa (3,720 m)', distanceKm: '13 km', walkHours: '5–6 hrs', startEle: 3620, endEle: 3720, terrain: 'Descend to the Karnali, climb to the border settlement', stay: 'Camp / basic lodge', meals: 'B/L/D', highlights: ['Hilsa — the Nepal–Tibet border crossing for Kailash pilgrims'], tips: 'A strange, dusty border outpost.' },
    { day: 12, title: 'Hilsa to Manepeme', from: 'Hilsa (3,720 m)', to: 'Manepeme (3,900 m)', distanceKm: '13 km', walkHours: '6 hrs', startEle: 3720, endEle: 3900, terrain: 'Exposed cliff trail high above the Karnali', stay: 'Camp', meals: 'B/L/D', highlights: ['The dramatic Karnali gorge trail'], tips: 'Some genuinely airy sections — steady footing.' },
    { day: 13, title: 'Cross the Nara La to Yari', from: 'Manepeme (3,900 m)', to: 'Yari (3,700 m)', distanceKm: '12 km', walkHours: '5–6 hrs', startEle: 3900, endEle: 3700, terrain: 'Climb to the Nara La (≈ 4,560 m), descend to Yari', stay: 'Camp', meals: 'B/L/D', highlights: ['Nara La (≈ 4,560 m)', 'Back toward the Simikot side'], tips: 'The second and lower of the two passes.' },
    { day: 14, title: 'Yari to Tumkot / Kermi', from: 'Yari (3,700 m)', to: 'Kermi (2,670 m)', distanceKm: '17 km', walkHours: '6–7 hrs', startEle: 3700, endEle: 2670, terrain: 'Long descent, rejoining the Karnali trail', stay: 'Camp', meals: 'B/L/D', highlights: ['The hot springs again', 'Thicker air'], tips: 'A big descent day.' },
    { day: 15, title: 'Kermi to Simikot', from: 'Kermi (2,670 m)', to: 'Simikot (2,950 m)', distanceKm: '15 km', walkHours: '6–7 hrs', startEle: 2670, endEle: 2950, terrain: 'River trail then a climb to Simikot', stay: 'Guesthouse', meals: 'B/L/D', highlights: ['Trek complete'], tips: 'Position for the flight out.' },
    { day: 16, title: 'Fly Simikot–Nepalgunj–Kathmandu', from: 'Simikot (2,950 m)', to: 'Kathmandu', distanceKm: '—', walkHours: 'two flights', startEle: 2950, endEle: 1400, terrain: 'Two flights', stay: 'Hotel', meals: 'B', highlights: ['The Humla hills from the air'], tips: 'Keep 2–3 buffer days — the Simikot flight is frequently delayed for days.' }
  ],
  routePoints: [
    { name: 'Simikot', elevation: '2,950 m', day: 2, walkTime: 'Fly-in point', stay: 'Simple guesthouses', highlight: 'The roadless district capital of Humla', warning: 'The flight in and out is one of the least reliable in Nepal.' },
    { name: 'Halji', elevation: '3,670 m', day: 6, walkTime: '4–5 hrs from Til', stay: 'Camp by the village', highlight: 'Rinchenling monastery, ~1,000 years old', warning: 'A key acclimatisation and cultural stop — do not rush past.' },
    { name: 'Talung (Nyalu La base)', elevation: '4,370 m', day: 9, walkTime: '5–6 hrs from Jang', stay: 'High camp', highlight: 'Selma Tsho glacial lake', warning: 'Cold, exposed camp before the highest pass.' },
    { name: 'Nyalu La', elevation: '≈ 4,990 m', day: 10, walkTime: 'From Talung', stay: 'Pass — no shelter', highlight: 'The trek’s high point, with Kailash views', warning: 'Snow-prone; crossed only in reasonable weather.' },
    { name: 'Hilsa', elevation: '3,720 m', day: 11, walkTime: '5–6 hrs from Shinjungma', stay: 'Camp / basic lodge', highlight: 'The Nepal–Tibet border point for Kailash pilgrims', warning: 'A dusty, functional outpost — not a highlight in itself.' }
  ],
  permits: [
    { name: 'Humla / Limi Restricted Area Permit', where: 'Kathmandu, through a licensed operator only', feeNote: 'Per-week fee, set by the government — verify', notes: 'Requires a group of at least two and a licensed guide. Independent trekking is not allowed.' },
    { name: 'Local area / conservation permit', where: 'Kathmandu or the Simikot checkpoint', feeNote: 'Fixed / local fee — verify', notes: 'The exact permit mix for Humla changes — confirm with your operator.' }
  ],
  cost: {
    note: 'A long restricted-area camping trek with very expensive and unreliable air access. Confirm a quote for your dates and group size.',
    tiers: [
      { name: 'Supported camping', rangeUSD: '$2,600–$3,600', includes: ['Licensed guide + cook + crew', 'Restricted-area + local permits', 'Domestic flights via Nepalgunj', 'All camping equipment', 'All trek meals'] },
      { name: 'Expedition style', rangeUSD: '$3,800–$4,800', includes: ['Higher guide ratio', 'Better mess and tents', 'Extra contingency days', 'Private departure'] },
      { name: 'Premium', rangeUSD: '$5,200+', includes: ['Small private team', 'Naturalist guide', 'Pre-arranged helicopter contingency', 'Extra rest days in Limi'] }
    ],
    breakdown: [
      { item: 'Restricted-area permit', note: 'Per week — the main permit cost' },
      { item: 'Access flights', note: 'Kathmandu–Nepalgunj–Simikot, the Simikot leg highly unreliable' },
      { item: 'Crew', note: 'Guide, cook, kitchen crew and mule/porter support for 2+ weeks' },
      { item: 'Food + fuel', note: 'Everything carried; villages sell almost nothing' },
      { item: 'Contingency', note: 'Multiple spare days for the Simikot flight and the passes' }
    ],
    independentVsGuided: 'Independent trekking is not permitted. The Humla / Limi permit is issued only to groups of two or more with a licensed guide through a registered operator, and the route needs full camp support.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Nepalgunj', mode: 'Flight (~1 hr)', duration: '1 hr', note: 'Usually an overnight.' },
      { from: 'Nepalgunj', to: 'Simikot', mode: 'Small aircraft (~45 min)', duration: '45 min', note: 'One of the most delay-prone flights in Nepal — cancellations of several days are common.' },
      { from: 'Simikot', to: 'Trail', mode: 'On foot', duration: '—', note: 'Humla has no road link to the rest of Nepal.' }
    ],
    note: 'Budget 2–3 contingency days purely for the Simikot flight, plus flexibility for the passes.'
  },
  equipment: [
    { item: '4-season sleeping bag (≈ −18°C) + mat', need: 'essential', note: 'Two weeks of camping, much of it above 3,600 m.' },
    { item: 'Trekking poles', need: 'essential', note: 'Two passes and big descents, plus the exposed Karnali gorge trail.' },
    { item: 'Microspikes', need: 'recommended', note: 'For snow on the Nyalu La.' },
    { item: 'Full waterproofs', need: 'essential', note: 'Afternoon storms cross the passes even in the rain-shadow.' },
    { item: 'Water filter + chemical backup', need: 'essential', note: 'No treated-water points.' },
    { item: 'Satellite messenger', need: 'essential', note: 'Two weeks with no mobile coverage and no road.' }
  ],
  safety: {
    risks: [
      { name: 'Extreme remoteness', note: 'Humla has no road to the rest of Nepal. Evacuation means a helicopter from a valley floor, subject to a weather window, and the nearest hospital is a two-flight journey away.' },
      { name: 'The Simikot flight', note: 'The least reliable link in the trip — plan for multi-day delays at both ends.' },
      { name: 'The Nyalu La', note: 'A ~5,000 m pass with no shelter, crossed relatively early in the trek. Snow or storm means waiting.' },
      { name: 'The Karnali gorge trail', note: 'Long, exposed cliff paths high above the river between Hilsa and the Nara La — a genuine fall hazard.' },
      { name: 'Altitude', note: 'Sustained time above 3,600 m with two passes near or above 4,600–5,000 m. The graded approach and rest days are the safety margin.' }
    ],
    turnaround: 'The loop can be shortened to an out-and-back on the Simikot–Hilsa trade route (without the Limi villages and the Nyalu La) if weather, health or flight delays compress the trip. The passes are never forced.',
    note: 'Carry a satellite messenger, confirm your insurance covers a 2-week trek to ~5,000 m with helicopter rescue, and expect the trip to run a day or two long because of the Simikot flight.'
  },
  faq: [
    { q: 'Where is the Limi Valley?', a: 'In Humla, the far-north-west district of Nepal, tucked against the Tibetan border near Mount Kailash. There is no road to Humla — you fly into Simikot.' },
    { q: 'Do I need a permit and guide for the Limi Valley?', a: 'Yes. It is a restricted area requiring a Humla / Limi Restricted Area Permit (per week), a local permit, a licensed guide and a group of at least two. Independent trekking is not allowed.' },
    { q: 'How hard is the Limi Valley trek?', a: 'Strenuous — 18–20 days, camping throughout, remote, with two passes near or above 4,600–5,000 m and long exposed gorge trails. It suits experienced trekkers.' },
    { q: 'How high does it go?', a: 'About 4,990 m at the Nyalu La; the Nara La is roughly 4,560 m. Camps are regularly between 3,600 and 4,400 m.' },
    { q: 'When is the best time to trek Limi?', a: 'Mid-May to early October, including the monsoon — Humla is in the rain-shadow. Winter and early spring are closed by snow on the passes.' },
    { q: 'Do I camp the whole way?', a: 'Yes. There is no tea-house network; a full crew carries tents, food and fuel.' },
    { q: 'How reliable is the flight to Simikot?', a: 'It is one of the least reliable flights in Nepal — delays of several days are routine. Budget 2–3 buffer days at each end.' },
    { q: 'Is there any mobile coverage?', a: 'Effectively none once you leave Simikot. A satellite messenger is essential.' },
    { q: 'What is special about the Limi villages?', a: 'Til, Halji and Jang are entirely Tibetan Buddhist, with their own dialect and a yak-herding, wool and cross-border-trade economy. Halji’s Rinchenling monastery is around 1,000 years old.' },
    { q: 'Can I see Mount Kailash from the trek?', a: 'You get distant views toward Kailash and the Tibetan plateau from the border ridges near the Nyalu La and Hilsa, but you do not cross into Tibet on this trek.' },
    { q: 'What if I get altitude sickness?', a: 'You descend to a lower valley — the route always has a downward option — recover, and either continue on a reduced plan or arrange a helicopter. The graded approach and rest days are designed to prevent it.' },
    { q: 'How many spare days should I budget?', a: 'Two to three, mostly for the Simikot flight, plus flexibility for the Nyalu La.' }
  ],
  relatedTreks: ['upper-dolpo', 'rara-lake-trek', 'kanchenjunga-base-camp', 'upper-mustang'],
  relatedDestinations: [
    { name: 'Mount Kailash (Tibet)', note: 'The Hilsa border crossing on this trek is the main Nepali route to the Kailash pilgrimage — a separate, permit-heavy trip into Tibet.' },
    { name: 'Rara Lake', note: 'The other great far-western objective, in neighbouring Mugu.' },
    { name: 'Bardiya National Park', note: 'A wildlife stop near Nepalgunj on the way in or out.' }
  ],
  hotelsNote: 'Trips include Kathmandu and Nepalgunj hotels; the trek is fully camp-supported for around two weeks. This is planned as an expedition — talk to us well ahead about dates, group size and the Simikot flight.'
};

/* ========================= LUMBINI PROVINCE ========================= */

TREKS['lumbini-pilgrimage-circuit'] = {
  slug: 'lumbini-pilgrimage-circuit',
  name: 'Lumbini Pilgrimage Circuit',
  tagline: 'The birthplace of the Buddha, on foot',
  province: 'lumbini',
  region: 'Lumbini',
  lowland: true,
  heroImage: '/images/footer.png',
  summary: 'A gentle 1–3 day walking tour of the Lumbini sacred garden and monastic zone — the UNESCO-listed birthplace of Siddhartha Gautama — with optional extensions to the nearby archaeological sites of Tilaurakot (ancient Kapilavastu), Ramagrama and Devadaha.',
  stats: {
    duration: '1–3 days (part of a wider Nepal trip)',
    difficulty: 'Easy',
    maxAltitude: '≈ 150 m',
    maxAltitudePoint: 'Terai plains',
    bestSeason: 'Oct–Mar (cool, dry season)',
    startPoint: 'Lumbini (drive/fly from Kathmandu, Pokhara or Bhairahawa)',
    endPoint: 'Lumbini',
    distanceKm: '≈ 5–20 km walking (site-dependent)',
    walkHours: '2–5 hrs/day, flat'
  },
  seo: {
    title: 'Lumbini Pilgrimage — Nepal | Birthplace of the Buddha, Itinerary & How to Visit',
    description: 'How to visit Lumbini, the UNESCO-listed birthplace of the Buddha: the sacred garden, the monastic zone and the Kapilavastu sites. Itinerary, best season, transport and FAQ.'
  },
  overview: [
    'Lumbini, in the flat Terai near the Indian border, is where Queen Maya Devi gave birth to Siddhartha Gautama — the Buddha — in 623 BCE, according to tradition. It is one of the four principal Buddhist pilgrimage sites and a UNESCO World Heritage Site, centred on the Maya Devi Temple, the marker stone said to pinpoint the birthplace, the Ashoka Pillar of 249 BCE, and the sacred pond and bodhi tree.',
    'Around this sacred garden, a large planned Monastic Zone — laid out from a 1970s master plan by the architect Kenzo Tange — holds temples and monasteries built by Buddhist countries around the world, from the Thai and Myanmar temples to the German, Chinese and Sri Lankan monasteries, each in its national style. A central canal and walkway link the garden to the World Peace Pagoda and the eternal flame.',
    'It is not a trek in the mountain sense — the ground is dead flat and the altitude is negligible — but it rewards being walked rather than driven, ideally over two or three unhurried days, and it combines with the outlying archaeological sites of the Buddha’s childhood kingdom.'
  ],
  highlights: [
    'The Maya Devi Temple, the birthplace marker stone and the Ashoka Pillar',
    'The sacred pond (Puskarni) and the bodhi tree',
    'The international Monastic Zone — temples of a dozen Buddhist nations',
    'The World Peace Pagoda and the eternal flame',
    'Tilaurakot — the excavated palace of Kapilavastu, where the Buddha grew up',
    'Ramagrama stupa — the only original, unopened relic stupa of the Buddha'
  ],
  suitability: {
    physical: 2, technical: 1, altitude: 1, remoteness: 1,
    walkHours: '2–5 hours of flat, easy walking',
    terrain: 'Paved paths, gardens and quiet lanes. Entirely flat.',
    weatherExposure: 'Low, but the Terai is very hot from April to September.',
    goodFor: [
      'Anyone interested in Buddhism, history or archaeology',
      'Travellers wanting a calm, reflective day within a Nepal itinerary',
      'Families, older visitors and those unable to do a mountain trek'
    ],
    notIdeal: [
      'Visitors expecting mountain scenery or physical challenge',
      'Travel in the pre-monsoon heat (April–June), when the Terai is punishing'
    ]
  },
  why: {
    lead: 'One of the few places where the beginning of a world religion can be located on a map.',
    paragraphs: [
      'The sacred garden is quiet in a way that surprises people — pilgrims circumambulating the pillar, monks chanting under the bodhi tree, prayer flags over the pond. The Maya Devi Temple protects the excavated foundations and the marker stone; around it, the monasteries of the Monastic Zone are a slow, walkable survey of how different Buddhist cultures build and worship.',
      'The outlying sites deepen it: Tilaurakot is a genuine archaeological site, the walled town where the prince Siddhartha grew up, and Ramagrama is the only one of the eight original relic stupas never excavated — a simple grassy mound that has been venerated, untouched, for over two thousand years.'
    ],
    gallery: [
      { img: '/images/footer.png', caption: 'The Maya Devi Temple and sacred pond, Lumbini' },
      { img: '/images/itinerary.png', caption: 'A temple in the international Monastic Zone' },
      { img: '/images/hero-mountain.jpg', caption: 'The Terai plains around Lumbini' }
    ]
  },
  passes: [],
  itinerary: [
    { day: 1, title: 'The Sacred Garden and Monastic Zone', from: 'Lumbini', to: 'Lumbini', distanceKm: '6–10 km', walkHours: '4–5 hrs', terrain: 'Flat paved paths and gardens', stay: 'Hotel / monastery guesthouse', meals: 'B', highlights: ['Maya Devi Temple and the marker stone', 'Ashoka Pillar and sacred pond', 'The eastern and western Monastic Zone temples', 'World Peace Pagoda at sunset'], tips: 'Rent a bicycle or take an e-rickshaw for the far end of the zone; walk the sacred garden itself.' },
    { day: 2, title: 'Tilaurakot (Kapilavastu) and Kudan', from: 'Lumbini', to: 'Lumbini', distanceKm: '5–8 km walking + drive', walkHours: '3–4 hrs', terrain: 'Rural lanes and excavated site paths', stay: 'Hotel', meals: 'B', highlights: ['The excavated palace and walls of Kapilavastu', 'The eastern and western gates the Buddha is said to have left by', 'The Kapilavastu Museum'], tips: 'About 27 km by road from Lumbini — a half-day trip.' },
    { day: 3, title: 'Ramagrama and Devadaha (optional)', from: 'Lumbini', to: 'Lumbini / onward', distanceKm: '3–5 km walking + drive', walkHours: '2–3 hrs', terrain: 'Village paths', stay: '—', meals: 'B', highlights: ['Ramagrama — the only unopened original relic stupa of the Buddha', 'Devadaha — the maternal home of Queen Maya Devi'], tips: 'These are quiet, lightly-visited sites — a peaceful contrast to the main garden.' }
  ],
  routePoints: [
    { name: 'Maya Devi Temple', elevation: '≈ 150 m', day: 1, walkTime: 'Centre of the sacred garden', stay: 'Nearby hotels and monastery guesthouses', highlight: 'The birthplace marker stone and the Ashoka Pillar', warning: 'Shoes off inside the temple; photography restricted around the marker stone.' },
    { name: 'Monastic Zone', elevation: '≈ 150 m', day: 1, walkTime: '2–3 km of walkway', stay: 'Some monasteries host pilgrims', highlight: 'National temples of a dozen Buddhist countries', warning: 'Large area — use a cycle or e-rickshaw between clusters.' },
    { name: 'World Peace Pagoda', elevation: '≈ 150 m', day: 1, walkTime: 'North end of the zone', highlight: 'A white stupa built by Japanese Buddhists; good at sunset', warning: '—' },
    { name: 'Tilaurakot', elevation: '≈ 100 m', day: 2, walkTime: '~27 km by road west', stay: 'Day trip', highlight: 'The archaeological site of ancient Kapilavastu', warning: 'Bring water and sun cover — little shade.' },
    { name: 'Ramagrama Stupa', elevation: '≈ 100 m', day: 3, walkTime: '~50 km by road east', highlight: 'The only original Buddha relic stupa never opened', warning: 'A quiet rural site — arrange transport in advance.' }
  ],
  permits: [
    { name: 'Lumbini Development Trust entry / camera fees', where: 'At the sacred garden entrance', feeNote: 'Small entry and camera fees — verify current amounts', notes: 'Separate small fees apply at the Maya Devi Temple and some museums.' }
  ],
  cost: {
    note: 'An inexpensive add-on to a Nepal trip — the cost is mostly transport and accommodation. Confirm a quote for your dates.',
    tiers: [
      { name: 'Independent day visit', rangeUSD: '$20–$60 per day', includes: ['Entry fees', 'Local guide (half day)', 'Cycle / e-rickshaw hire', 'Meals'] },
      { name: 'Guided 2–3 day pilgrimage', rangeUSD: '$150–$400', includes: ['Private guide', 'Hotel', 'Vehicle to Tilaurakot / Ramagrama', 'All entry fees'] },
      { name: 'As part of a wider tour', rangeUSD: 'Varies', includes: ['Lumbini leg within a Kathmandu–Pokhara–Chitwan–Lumbini circuit'] }
    ],
    breakdown: [
      { item: 'Entry / camera fees', note: 'Small, at the sacred garden and some sites' },
      { item: 'Transport', note: 'Bhairahawa (Gautam Buddha) airport, or drive from Pokhara / Chitwan' },
      { item: 'Guide', note: 'A knowledgeable guide transforms the visit — half or full day' },
      { item: 'Accommodation', note: 'From budget guesthouses to a few comfortable hotels near the zone' }
    ],
    independentVsGuided: 'Lumbini can easily be visited independently — it is flat, signed and safe. A guide is worth hiring for the history and to navigate the outlying Kapilavastu sites.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu / Pokhara', to: 'Bhairahawa (Gautam Buddha Airport)', mode: 'Flight (~35–45 min)', duration: '35–45 min', note: 'Then ~22 km (30–40 min) by road to Lumbini. An international airport also operates limited regional flights.' },
      { from: 'Pokhara / Chitwan', to: 'Lumbini', mode: 'Tourist bus or private car', duration: '4–7 hrs', note: 'A common overland leg on a Kathmandu–Pokhara–Chitwan–Lumbini loop.' }
    ],
    note: 'Lumbini pairs naturally with Chitwan or Bardiya for a lowland leg of a Nepal trip.'
  },
  equipment: [
    { item: 'Light, modest clothing (shoulders and knees covered)', need: 'essential', note: 'Required in the temples; also sensible in the Terai heat.' },
    { item: 'Sun hat, sunglasses, high-SPF sunscreen', need: 'essential', note: 'Little shade in the sacred garden and at the archaeological sites.' },
    { item: 'Slip-on shoes', need: 'recommended', note: 'You remove shoes frequently at temples.' },
    { item: 'Refillable water bottle', need: 'essential', note: 'It is hot; carry water, especially for the outlying sites.' },
    { item: 'Insect repellent', need: 'recommended', note: 'The Terai has mosquitoes, particularly around dusk and water.' }
  ],
  safety: {
    risks: [
      { name: 'Heat', note: 'From April to September the Terai is very hot and humid. Visit October–March, carry water, and pace the day around the midday heat.' },
      { name: 'Mosquito-borne illness', note: 'The Terai is a dengue and (historically) malaria zone. Use repellent, cover up at dusk, and check current health advice before travelling.' },
      { name: 'Road travel', note: 'The overland routes to Lumbini involve busy Terai highways — a standard Nepal road-safety consideration.' },
      { name: 'Border area', note: 'Lumbini is close to the Indian border; carry your passport and do not stray across unmarked frontier areas.' }
    ],
    turnaround: 'Not applicable — this is a flat, low-risk site visit. In extreme heat, shorten the day and see the Monastic Zone by cycle rather than on foot.',
    note: 'Lumbini is a calm, well-managed pilgrimage site. The main practical issues are heat and mosquitoes, both easily managed with timing and precautions.'
  },
  faq: [
    { q: 'Is Lumbini a trek?', a: 'Not in the mountain sense — the ground is flat and the altitude negligible. It is a walking pilgrimage and heritage visit, best done over 1–3 unhurried days.' },
    { q: 'What is there to see at Lumbini?', a: 'The Maya Devi Temple and birthplace marker stone, the Ashoka Pillar, the sacred pond and bodhi tree, and the large international Monastic Zone with temples built by Buddhist countries worldwide.' },
    { q: 'How do I get to Lumbini?', a: 'Fly to Bhairahawa (Gautam Buddha Airport) from Kathmandu or Pokhara, then drive ~30–40 minutes, or come overland from Pokhara or Chitwan (4–7 hours).' },
    { q: 'When is the best time to visit?', a: 'October to March, when the Terai is cool and dry. April to September is very hot and humid.' },
    { q: 'How many days do I need?', a: 'One full day covers the sacred garden and Monastic Zone. Two to three days lets you add Tilaurakot (Kapilavastu) and Ramagrama at a relaxed pace.' },
    { q: 'Do I need a permit?', a: 'Only small entry and camera fees at the sacred garden and some museums. No trekking permit is required.' },
    { q: 'Can I stay overnight at Lumbini?', a: 'Yes — there are hotels near the zone, and some monasteries host pilgrims. Staying overnight lets you see the garden at dawn and the Peace Pagoda at sunset.' },
    { q: 'Is Lumbini suitable for non-Buddhists?', a: 'Very much so. It is a UNESCO World Heritage Site of universal historical importance, and visitors of all backgrounds are welcome. Modest dress and quiet behaviour are expected.' },
    { q: 'Can I combine Lumbini with a wildlife park?', a: 'Yes — it pairs naturally with Chitwan National Park (to the east) or Bardiya National Park (to the west) for a lowland leg of a Nepal trip.' },
    { q: 'What is Ramagrama stupa?', a: 'The only one of the eight original stupas built over the Buddha’s relics that has never been opened or excavated — a simple, continuously venerated mound about 50 km east of Lumbini.' }
  ],
  relatedTreks: ['bardiya-national-park-safari', 'rolpa-rukum-hill-trail', 'janakpur-temple-circuit', 'annapurna-base-camp'],
  relatedDestinations: [
    { name: 'Tilaurakot (Kapilavastu)', note: 'The excavated palace-town where the Buddha grew up — a half-day trip.' },
    { name: 'Chitwan National Park', note: 'Jungle wildlife a few hours east, an easy pairing.' },
    { name: 'Bardiya National Park', note: 'A wilder, quieter park to the west, also in Lumbini Province.' }
  ],
  hotelsNote: 'We can arrange hotels near the Monastic Zone, a knowledgeable Buddhist-heritage guide, and transport to the Kapilavastu sites, as a standalone visit or as part of a Kathmandu–Pokhara–Chitwan–Lumbini itinerary.'
};

TREKS['bardiya-national-park-safari'] = {
  slug: 'bardiya-national-park-safari',
  name: 'Bardiya National Park Safari',
  tagline: 'Nepal’s wild west — tigers, rhino and the Karnali',
  province: 'lumbini',
  region: 'Bardiya',
  lowland: true,
  heroImage: '/images/itinerary.png',
  summary: 'A 3–5 day wildlife trip into Bardiya National Park — the largest and least-visited protected area in the Terai — with jungle walks, jeep drives and river trips on the Karnali, offering Nepal’s best chance of seeing a wild Bengal tiger, alongside one-horned rhino, wild elephant and Gangetic dolphin.',
  stats: {
    duration: '3–5 days (part of a wider Nepal trip)',
    difficulty: 'Easy to Moderate',
    maxAltitude: '≈ 200 m',
    maxAltitudePoint: 'Terai plains and sal forest',
    bestSeason: 'Oct–Apr (best big-cat sightings Mar–May)',
    startPoint: 'Thakurdwara / Bardiya (drive from Nepalgunj, or fly + drive)',
    endPoint: 'Thakurdwara',
    distanceKm: '5–15 km walking per jungle day',
    walkHours: '4–7 hrs on foot or by jeep'
  },
  seo: {
    title: 'Bardiya National Park Safari — Nepal | Tiger Safari, Itinerary, Cost & Best Time',
    description: 'A guide to Bardiya National Park in western Nepal: jungle walks and jeep safaris for wild tiger, rhino, elephant and dolphin. Itinerary, best time, cost and FAQ.'
  },
  overview: [
    'Bardiya is the biggest national park in the Terai and, because it is a long way west of the tourist trail, still one of the quietest. Its core is undisturbed sal forest, grassland (phanta) and the braided channels of the Karnali river, and it holds one of the densest tiger populations in Asia — which, combined with the low visitor numbers, makes it the best place in Nepal to see a wild tiger on foot or from a jeep.',
    'A typical trip is based at a lodge in Thakurdwara, just outside the park gate, and mixes activities: guided jungle walks (the classic Bardiya experience — quiet, on foot, tracking), jeep drives to the grasslands and machans (watchtowers), a rafting or boat trip on the Karnali or Babai for gharial crocodile, Gangetic dolphin and birds, and village and Tharu cultural visits.',
    'It is not physically demanding — the walking is flat, though a full jungle day can be long and hot — but it does require patience and a tolerance for early starts. Sightings are never guaranteed; Bardiya rewards people who come for the whole ecosystem, not just the big cat.'
  ],
  highlights: [
    'Nepal’s best chance of seeing a wild Bengal tiger',
    'One-horned rhino (reintroduced and now breeding), wild elephant herds',
    'Gharial and mugger crocodile, and Gangetic river dolphin on the Karnali',
    'Guided jungle walks — Bardiya’s signature, low-impact way to see wildlife',
    'Over 400 bird species, including the giant hornbill and Bengal florican',
    'Tharu villages and culture, and the quiet of a park few tourists reach'
  ],
  suitability: {
    physical: 3, technical: 1, altitude: 1, remoteness: 4,
    walkHours: '4–7 hours per activity day, flat but hot',
    terrain: 'Forest trails, riverbanks and grassland. Flat throughout.',
    weatherExposure: 'Low for terrain; high for heat and sun outside the winter months.',
    goodFor: [
      'Wildlife enthusiasts and birdwatchers',
      'Travellers wanting a quieter alternative to Chitwan',
      'Anyone adding a low-altitude wildlife leg to a trekking trip'
    ],
    notIdeal: [
      'Visitors who need guaranteed big-cat sightings',
      'Travel in the pre-monsoon heat (April–June) unless tiger sightings are the priority',
      'Anyone uncomfortable walking in forest where dangerous animals are present'
    ]
  },
  why: {
    lead: 'The place to go if you want to see a tiger in Nepal without the crowds around it.',
    paragraphs: [
      'Chitwan is famous and busy; Bardiya is bigger, wilder and visited by a fraction as many people. The signature experience is the jungle walk — a small group, on foot, following a naturalist who reads tracks, alarm calls and drag marks, often spending hours at a river crossing or a machan waiting. When a tiger does step out onto a sandbank across the river, in near silence, it is an encounter of a completely different order to a jeep sighting.',
      'Even without the cat, the park delivers: rhino in the grassland, elephant herds, crocodiles hauled out on the Karnali sandbars, dolphins surfacing in the main channel, and a bird list that runs past 400 species.'
    ],
    gallery: [
      { img: '/images/itinerary.png', caption: 'Sal forest and grassland in Bardiya National Park' },
      { img: '/images/footer.png', caption: 'The Karnali river braiding through the park' },
      { img: '/images/hero-mountain.jpg', caption: 'Grassland (phanta) at dawn' }
    ]
  },
  passes: [],
  itinerary: [
    { day: 1, title: 'Arrive Thakurdwara; afternoon orientation walk', from: 'Nepalgunj', to: 'Thakurdwara (Bardiya)', distanceKm: '3–5 km walk + 2–3 hr drive', walkHours: '2–3 hrs', terrain: 'Drive, then a short buffer-zone walk', stay: 'Jungle lodge', meals: 'B/L/D', highlights: ['Tharu village walk', 'Sunset over the buffer-zone forest'], tips: 'Fly Kathmandu–Nepalgunj, then drive ~2.5 hrs to the park.' },
    { day: 2, title: 'Full-day jungle walk', from: 'Thakurdwara', to: 'Thakurdwara', distanceKm: '12–18 km', walkHours: '6–8 hrs', terrain: 'Forest trails, riverbanks, grassland', stay: 'Jungle lodge', meals: 'B/L/D', highlights: ['Tiger tracking on foot', 'Rhino and deer in the grassland', 'Machan watchtower vigil'], tips: 'The classic Bardiya day — start before dawn, carry water, wear muted colours.' },
    { day: 3, title: 'Karnali river trip and jeep safari', from: 'Thakurdwara', to: 'Thakurdwara', distanceKm: '—', walkHours: '5–7 hrs', terrain: 'Raft / boat on the Karnali, then jeep on the park tracks', stay: 'Jungle lodge', meals: 'B/L/D', highlights: ['Gharial crocodile and Gangetic dolphin', 'Grassland jeep drive for rhino and elephant', 'Riverside birding'], tips: 'The river trip is the best chance for crocodile, dolphin and waterbirds.' },
    { day: 4, title: 'Dawn walk, Tharu cultural afternoon, depart', from: 'Thakurdwara', to: 'Nepalgunj / onward', distanceKm: '5–8 km walk + drive', walkHours: '3–4 hrs', terrain: 'Forest walk, then village and drive', stay: '—', meals: 'B/L', highlights: ['A final dawn wildlife walk', 'Tharu stick dance and village life', 'Bardiya conservation and community museum'], tips: 'Drive back to Nepalgunj for the evening flight, or continue overland to Lumbini.' }
  ],
  routePoints: [
    { name: 'Thakurdwara', elevation: '≈ 200 m', day: 1, walkTime: 'Park-gate village', stay: 'Jungle lodges and homestays', highlight: 'The base for all park activities', warning: 'Wildlife (including elephant) moves through the buffer zone — follow lodge guidance after dark.' },
    { name: 'Karnali riverbank machans', elevation: '≈ 180 m', day: 2, walkTime: 'Within the park', stay: 'Day use', highlight: 'The prime tiger-watching vigil points', warning: 'Long, still waits — bring water, sun cover and patience.' },
    { name: 'Baghaura & Lamkauli Phanta', elevation: '≈ 180 m', day: 3, walkTime: 'By jeep', highlight: 'Open grasslands — best for rhino, deer and raptors', warning: 'Very exposed to the sun.' },
    { name: 'Karnali river channels', elevation: '≈ 170 m', day: 3, walkTime: 'By raft / boat', highlight: 'Gharial, mugger crocodile and Gangetic dolphin', warning: 'Water levels and trip feasibility vary by season.' }
  ],
  permits: [
    { name: 'Bardiya National Park entry permit', where: 'At the park office in Thakurdwara (arranged by your lodge)', feeNote: 'Daily entry fee, plus small fees for jeep, boat and guide — verify current amounts', notes: 'A licensed park guide is mandatory for all activities inside the park.' }
  ],
  cost: {
    note: 'Usually sold as an all-inclusive lodge package. Confirm a quote for your dates.',
    tiers: [
      { name: 'Budget lodge package (3 nights)', rangeUSD: '$180–$350', includes: ['Basic lodge / homestay', 'All meals', 'Daily activities with a park guide', 'Park and activity fees'] },
      { name: 'Mid-range package (3–4 nights)', rangeUSD: '$400–$800', includes: ['Comfortable jungle lodge', 'Small-group activities', 'River trip', 'Tharu cultural programme'] },
      { name: 'Premium wildlife lodge (3–5 nights)', rangeUSD: '$1,000+', includes: ['Top jungle lodge', 'Private naturalist', 'Extended tracking days', 'Photography focus'] }
    ],
    breakdown: [
      { item: 'Park & activity fees', note: 'Daily entry plus jeep / boat / guide fees' },
      { item: 'Lodge & meals', note: 'The bulk of a package cost' },
      { item: 'Transport', note: 'Kathmandu–Nepalgunj flight + ~2.5 hr drive, or a long overland trip' },
      { item: 'Guide', note: 'A mandatory park guide; a private naturalist is an upgrade' }
    ],
    independentVsGuided: 'You cannot enter the park without a licensed guide. Almost everyone books an all-inclusive lodge package, which handles permits, guides and activities.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Nepalgunj', mode: 'Flight (~1 hr)', duration: '1 hr', note: 'Then a road transfer.' },
      { from: 'Nepalgunj', to: 'Thakurdwara (Bardiya)', mode: 'Private vehicle / lodge transfer', duration: '2.5–3 hrs', note: 'On the East–West Highway then a park road.' },
      { from: 'Lumbini / Pokhara', to: 'Bardiya', mode: 'Tourist bus or private car', duration: '6–9 hrs', note: 'A long but feasible overland link on a western Nepal loop.' }
    ],
    note: 'Bardiya combines well with Lumbini (to the east) and with a Karnali river rafting trip.'
  },
  equipment: [
    { item: 'Muted, lightweight, long-sleeved clothing', need: 'essential', note: 'Greens and browns for jungle walks; long sleeves against sun and insects.' },
    { item: 'Sturdy walking shoes / light boots', need: 'essential', note: 'Full-day jungle walks over uneven ground.' },
    { item: 'Binoculars', need: 'recommended', note: 'Essential for birds and for distant big-game sightings.' },
    { item: 'Sun hat, sunscreen, insect repellent', need: 'essential', note: 'The grassland and riverbank are fully exposed; dusk brings mosquitoes.' },
    { item: 'Refillable water bottle (1.5–2 L)', need: 'essential', note: 'Jungle days are long and hot.' }
  ],
  safety: {
    risks: [
      { name: 'Dangerous wildlife on foot', note: 'Jungle walks take place where tiger, rhino, elephant and sloth bear live. Your guide briefs you on what to do in an encounter (usually: stay calm, back away, get behind a tree). Follow instructions exactly and stay with the group.' },
      { name: 'Heat and dehydration', note: 'Full-day walks in the Terai sun are demanding. Carry water, wear a hat, and be honest with your guide about how you are coping.' },
      { name: 'Mosquito-borne illness', note: 'The Terai is a dengue and historically malaria area. Use repellent, cover up at dusk, and check current health advice before travel.' },
      { name: 'River conditions', note: 'Karnali boat and raft trips depend on water levels and are not run in unsafe conditions.' }
    ],
    turnaround: 'Not a trek — but if the heat is too much, jeep and river activities replace the long walks, and machans let you watch wildlife without covering distance.',
    note: 'Bardiya’s guides are experienced and safety-focused; incidents on properly run walks are rare. The real discipline required is quiet, patience and doing exactly what the guide says near animals.'
  },
  faq: [
    { q: 'Can I see a tiger in Bardiya?', a: 'Bardiya has one of the highest tiger densities in Asia and the best odds in Nepal, but sightings are never guaranteed. Three or more days, patience, and the March–May pre-monsoon window (when animals concentrate near water) improve your chances.' },
    { q: 'Is Bardiya better than Chitwan for wildlife?', a: 'Bardiya is larger, wilder and far less visited, with better tiger odds and a strong dolphin and crocodile presence on the Karnali. Chitwan is easier to reach and has more rhino. Many keen wildlife travellers prefer Bardiya.' },
    { q: 'How do I get to Bardiya?', a: 'Fly Kathmandu–Nepalgunj (about an hour), then drive 2.5–3 hours to Thakurdwara. Overland from Pokhara or Lumbini is also possible but long.' },
    { q: 'When is the best time to visit?', a: 'October to April for pleasant conditions. March to May gives the best big-cat sightings but is hot. Avoid the June–September monsoon, when many trails flood.' },
    { q: 'How physically demanding is it?', a: 'The terrain is flat, but a full jungle walk can be 6–8 hours in heat. Jeep and river options exist for those who prefer them.' },
    { q: 'Is walking in the jungle safe?', a: 'With a licensed guide and by following the safety briefing, yes — serious incidents are rare. You are walking where dangerous animals live, so discipline and staying with the group are essential.' },
    { q: 'Do I need a permit or guide?', a: 'A national park entry permit is required, and a licensed park guide is mandatory for every activity. Your lodge arranges both as part of a package.' },
    { q: 'How many days should I spend?', a: 'Three nights is the practical minimum for a fair chance at the main species; four to five nights is better, especially if tigers are the priority.' },
    { q: 'Can I combine Bardiya with other places?', a: 'Yes — with Lumbini (Buddhist heritage), a Karnali rafting trip, or as a warm-down after a far-western trek like Rara or Dolpo.' },
    { q: 'What else lives in the park?', a: 'One-horned rhino, wild elephant, sloth bear, leopard, swamp deer, gharial and mugger crocodile, Gangetic dolphin, and over 400 bird species.' }
  ],
  relatedTreks: ['lumbini-pilgrimage-circuit', 'rara-lake-trek', 'rolpa-rukum-hill-trail', 'lower-dolpo'],
  relatedDestinations: [
    { name: 'Lumbini', note: 'The birthplace of the Buddha, a few hours east — the classic western-Terai pairing.' },
    { name: 'Karnali river rafting', note: 'A multi-day wilderness float that ends near the park.' },
    { name: 'Khaptad National Park', note: 'A high meadow plateau further north-west, for a cooler contrast.' }
  ],
  hotelsNote: 'We book Bardiya as an all-inclusive jungle-lodge package — from simple Tharu homestays to premium wildlife lodges — with all park fees, guides and activities included. It pairs well with Lumbini or a far-western trek.'
};

TREKS['rolpa-rukum-hill-trail'] = {
  slug: 'rolpa-rukum-hill-trail',
  name: 'Rolpa–Rukum Hill Trail',
  tagline: 'The Magar mid-hills of Nepal’s inner west',
  province: 'lumbini',
  region: 'Rukum–Rolpa',
  lowland: true,
  heroImage: '/images/footer.png',
  summary: 'A 7–10 day community trek through the Magar heartland of Rolpa and Rukum — terraced mid-hill villages, oak and pine forest, the Sisne and Putha Hiunchuli skyline, and, for those interested, the recent history of the region — on quiet trails almost no foreign trekkers walk.',
  stats: {
    duration: '7–10 days (5–8 on the trail)',
    difficulty: 'Moderate',
    maxAltitude: '≈ 2,900 m (higher on optional ridges)',
    maxAltitudePoint: 'Jaljala pass / ridge viewpoints',
    bestSeason: 'Oct–Nov · Mar–May',
    startPoint: 'Sulichaur / Libang (Rolpa) — drive from Pokhara or Butwal',
    endPoint: 'Musikot (Rukum) — drive out',
    distanceKm: '≈ 70–110 km (route-dependent)',
    walkHours: '5–7 hrs/day'
  },
  seo: {
    title: 'Rolpa–Rukum Hill Trail — Nepal | Off-the-Beaten-Path Mid-Hill Trek Itinerary & FAQ',
    description: 'The Rolpa–Rukum Hill Trail through the Magar mid-hills of inner-western Nepal: a quiet community trek. Itinerary, difficulty, permits, cost, best time and FAQ.'
  },
  overview: [
    'Rolpa and Rukum sit in the inner west of Nepal — south of Dolpo, west of the Dhaulagiri foothills — a region of Magar villages, steep terraced farmland and mid-hill forest that sees essentially no foreign trekkers. There is no single established route; trips are built from village trails and connect Rolpa’s district centre with Rukum, often via the Jaljala pass and the meadows below Sisne and Putha Hiunchuli.',
    'The appeal is cultural and quiet rather than scenic-spectacular: staying in Magar homes, walking between villages where you are a genuine novelty, and seeing a part of Nepal that has been largely closed to tourism — first by its remoteness, then by the decade-long conflict that began here in the 1990s and has left the region with a distinct recent history. Local communities have developed home-stay networks specifically to bring visitors and income back.',
    'The altitude is moderate — mostly under 3,000 m, with optional higher ridge days — and the trekking is not technical, but the trails are steep, the infrastructure is minimal, and a guide who knows the area and the language is essential.'
  ],
  highlights: [
    'Magar villages and home-stays in a region with almost no tourism',
    'The Jaljala pass and the high pastures below Sisne (5,849 m) and Putha Hiunchuli (7,246 m)',
    'Oak, pine and rhododendron forest on the ridges',
    'Dragon-fed lakes and the sacred site of Jaljala on some variants',
    'An honest window into the recent history and recovery of inner-western Nepal',
    'Trails you are unlikely to share with any other trekkers'
  ],
  suitability: {
    physical: 6, technical: 1, altitude: 4, remoteness: 7,
    walkHours: '5–7 hours a day on steep village trails',
    terrain: 'Terraced farmland, forest ridges, stone village steps. Steep but non-technical.',
    weatherExposure: 'Moderate — mostly among villages and forest.',
    goodFor: [
      'Trekkers who value cultural immersion and solitude over big mountains',
      'Repeat visitors to Nepal wanting somewhere genuinely new',
      'Anyone comfortable with basic home-stays and a flexible plan'
    ],
    notIdeal: [
      'First-time trekkers, or anyone expecting lodges and infrastructure',
      'Trekkers whose priority is high-altitude scenery',
      'Trips on a rigid schedule — transport and trails here are unpredictable'
    ]
  },
  why: {
    lead: 'This is one of the last populated parts of the Nepal hills that tourism has barely touched.',
    paragraphs: [
      'Walking into a Magar village in Rolpa, you are often the first foreigner people have hosted that season, or that year. The welcome is real, the home-stays are simple, and the conversations — mediated by your guide — are a rare, unfiltered look at rural life in a region that has been through a lot.',
      'The landscape is the classic Nepali middle hills at their best: ridge after ridge of terraces and forest, with the white wall of Sisne and Putha Hiunchuli closing off the northern horizon. It is a trek for the curious rather than the view-hungry.'
    ],
    gallery: [
      { img: '/images/footer.png', caption: 'A Magar village in the Rolpa hills' },
      { img: '/images/itinerary.png', caption: 'Ridge forest on the Jaljala approach' },
      { img: '/images/hero-mountain.jpg', caption: 'Sisne and Putha Hiunchuli from the high pastures' }
    ]
  },
  passes: [{ name: 'Jaljala pass', elevation: '≈ 3,200–3,600 m (variant-dependent)', day: 4 }],
  itinerary: [
    { day: 1, title: 'Drive to Sulichaur / Libang (Rolpa)', from: 'Pokhara / Butwal', to: 'Libang (1,250 m)', distanceKm: '—', walkHours: '7–10 hr drive', terrain: 'Highway then rough hill road', stay: 'Guesthouse', meals: 'B/L/D', highlights: ['Into the inner-western hills'], tips: 'A long drive — road conditions vary a lot.' },
    { day: 2, title: 'Libang to first Magar village', from: 'Libang (1,250 m)', to: 'Village home-stay (1,900 m)', distanceKm: '12 km', walkHours: '5–6 hrs', terrain: 'Terraced farmland climb', stay: 'Home-stay', meals: 'B/L/D', highlights: ['First home-stay', 'Magar village life'], tips: 'Ease into the rhythm and the food.' },
    { day: 3, title: 'Through the ridge villages', from: 'Home-stay (1,900 m)', to: 'Home-stay (2,400 m)', distanceKm: '13 km', walkHours: '6 hrs', terrain: 'Forest and village ridge trail', stay: 'Home-stay', meals: 'B/L/D', highlights: ['Oak and rhododendron forest', 'Ridge views opening north'], tips: 'Steeper than the map suggests.' },
    { day: 4, title: 'Cross toward Jaljala / the high pastures', from: 'Home-stay (2,400 m)', to: 'Pasture camp / village (2,800 m)', distanceKm: '14 km', walkHours: '6–7 hrs', terrain: 'Climb to the Jaljala area, then descend', stay: 'Home-stay / camp', meals: 'B/L/D', highlights: ['Jaljala meadows', 'Sisne and Putha Hiunchuli close up'], tips: 'The scenic high point — an optional higher ridge extension is possible if acclimatised.' },
    { day: 5, title: 'Descend into Rukum', from: 'Pasture (2,800 m)', to: 'Rukum village home-stay (2,100 m)', distanceKm: '15 km', walkHours: '6–7 hrs', terrain: 'Long forest and farmland descent', stay: 'Home-stay', meals: 'B/L/D', highlights: ['Into Rukum district', 'Changing village architecture'], tips: 'A big descent day.' },
    { day: 6, title: 'Through Rukum’s villages', from: 'Home-stay (2,100 m)', to: 'Home-stay (1,700 m)', distanceKm: '13 km', walkHours: '5–6 hrs', terrain: 'Mid-hill village trail', stay: 'Home-stay', meals: 'B/L/D', highlights: ['Rukum farming life', 'Historic sites of the recent conflict, if of interest'], tips: 'Your guide can explain the region’s recent history sensitively.' },
    { day: 7, title: 'To Musikot; end of trek', from: 'Home-stay (1,700 m)', to: 'Musikot (1,500 m)', distanceKm: '12 km', walkHours: '5 hrs', terrain: 'Descent to the district centre', stay: 'Guesthouse', meals: 'B/L/D', highlights: ['Trek complete', 'Views back to the hills walked'], tips: 'Position for the drive out.' },
    { day: 8, title: 'Drive out to Pokhara / Butwal', from: 'Musikot (1,500 m)', to: 'Pokhara / Butwal', distanceKm: '—', walkHours: '8–11 hr drive', terrain: 'Hill road then highway', stay: 'Hotel', meals: 'B/L', highlights: ['The inner-western hills receding'], tips: 'A long final drive; a Nepalgunj flight is an alternative from some points.' }
  ],
  routePoints: [
    { name: 'Libang (Rolpa)', elevation: '1,250 m', day: 1, walkTime: 'Road head', stay: 'Basic guesthouses', highlight: 'The Rolpa district centre and trailhead', warning: 'The drive here is long and rough.' },
    { name: 'Jaljala', elevation: '≈ 3,200–3,600 m', day: 4, walkTime: 'From the ridge villages', stay: 'Pasture camp or nearby village', highlight: 'High meadows with the Sisne / Putha Hiunchuli skyline', warning: 'The one section approaching altitude — go slowly and skip if snowbound.' },
    { name: 'Rukum villages', elevation: '≈ 1,700–2,100 m', day: 6, walkTime: 'Mid-hill trail', stay: 'Community home-stays', highlight: 'Magar farming life and recent history', warning: 'Home-stay comfort is basic; sanitation varies.' },
    { name: 'Musikot (Rukum)', elevation: '1,500 m', day: 7, walkTime: 'End point', stay: 'Guesthouses', highlight: 'The Rukum district centre', warning: 'The drive out is long.' }
  ],
  permits: [
    { name: 'Local area / rural municipality permit', where: 'Arranged by your operator; checkpoints on the route', feeNote: 'Local fee — verify', notes: 'The region is not a formal restricted area, but permit and reporting requirements for inner-western districts change — confirm with your operator.' },
    { name: 'Dhorpatan Hunting Reserve permit (higher variants)', where: 'Kathmandu (NTB) or the reserve checkpoint', feeNote: 'Fixed reserve fee — verify', notes: 'Only if the route enters the Dhorpatan reserve to the north.' }
  ],
  cost: {
    note: 'A community trek with home-stay fees that go directly to villages, but a long and costly overland approach. Confirm a quote for your dates.',
    tiers: [
      { name: 'Home-stay + camping mix', rangeUSD: '$900–$1,400', includes: ['Guide + porter', 'Ground transport', 'Permits', 'Home-stays / tents', 'All trek meals'] },
      { name: 'Fully supported', rangeUSD: '$1,500–$2,200', includes: ['Private departure', 'Cook where camping', 'Kathmandu / Pokhara hotels', 'Cultural programme'] },
      { name: 'Premium', rangeUSD: '$2,600+', includes: ['Historian / cultural guide', 'Better camp', 'Dhorpatan extension', 'Flexible routing'] }
    ],
    breakdown: [
      { item: 'Transport', note: 'Long drives in and out — the dominant cost' },
      { item: 'Permits', note: 'Local fees, plus Dhorpatan if the route goes north' },
      { item: 'Guide + porter', note: 'A local-language guide is essential' },
      { item: 'Home-stay fees', note: 'Paid to village committees / families' },
      { item: 'Food + camp support', note: 'For any camping sections' }
    ],
    independentVsGuided: 'This is not an independent-trekking route. There is no marked trail or lodge network, the villages need advance notice, and a guide who speaks the local language and knows the recent history is essential.'
  },
  transport: {
    steps: [
      { from: 'Pokhara / Butwal', to: 'Libang (Rolpa)', mode: 'Private jeep', duration: '7–10 hrs', note: 'Rough hill roads; timings vary widely with conditions.' },
      { from: 'Musikot (Rukum)', to: 'Pokhara / Butwal / Nepalgunj', mode: 'Jeep, or jeep + flight', duration: '8–11 hrs by road', note: 'A flight from a nearby STOL strip can shorten the exit on some itineraries.' }
    ],
    note: 'The overland access at both ends is the hardest logistics of this trek — build in a contingency day.'
  },
  equipment: [
    { item: 'Sleeping bag to ≈ −5°C to −10°C + liner', need: 'essential', note: 'Home-stay bedding is basic; higher pasture nights are cold.' },
    { item: 'Trekking poles', need: 'recommended', note: 'Steep terraced trails and long descents.' },
    { item: 'Waterproof jacket', need: 'essential', note: 'Ridge afternoons can turn wet.' },
    { item: 'Head torch', need: 'essential', note: 'Village power is intermittent or absent.' },
    { item: 'Water filter + chemical backup', need: 'essential', note: 'Few safe-water points; treat everything.' },
    { item: 'Cash in small notes', need: 'essential', note: 'No ATMs anywhere on the route.' }
  ],
  safety: {
    risks: [
      { name: 'Remoteness and thin infrastructure', note: 'Medical facilities are minimal and evacuation is slow — usually a long drive rather than a helicopter. Small problems need to be taken seriously early.' },
      { name: 'Rough road access', note: 'The long drives in and out are the highest-risk part of the trip, especially in or after rain.' },
      { name: 'Route-finding', note: 'No waymarked trail — a guide who knows the villages and paths is essential.' },
      { name: 'Basic sanitation', note: 'Home-stay hygiene varies; be careful with water and food, and carry hand sanitiser.' },
      { name: 'Sensitive recent history', note: 'The region has a difficult recent past. Follow your guide’s lead on where photography and questions are appropriate.' }
    ],
    turnaround: 'The route is flexible by design — your guide adjusts the village sequence and the Jaljala high section for weather, trail conditions and how the group is going. There is no committing pass to force.',
    note: 'Carry a means of communication and confirm your insurance covers trekking in a remote region with a long road evacuation. This trek is about people and place more than performance — pace it accordingly.'
  },
  faq: [
    { q: 'Where are Rolpa and Rukum?', a: 'In the inner west of Nepal, in Lumbini Province, south of Dolpo and west of the Dhaulagiri foothills — a Magar-majority mid-hill region with very little tourism.' },
    { q: 'Is there a fixed Rolpa–Rukum trekking route?', a: 'No. Trips are assembled from village trails, usually linking Libang (Rolpa) to Musikot (Rukum) via the Jaljala area. Your operator sets the line based on home-stay availability and conditions.' },
    { q: 'How difficult is it?', a: 'Moderate — the altitude is mostly under 3,000 m and nothing is technical, but the trails are steep and the infrastructure is minimal.' },
    { q: 'Why do so few trekkers go there?', a: 'Remoteness, a lack of tourist infrastructure, and the region’s recent conflict history. Communities are now actively developing home-stay tourism to change that.' },
    { q: 'When is the best time to go?', a: 'October–November and March–May. The monsoon makes the roads and trails difficult; winter is cold with snow on the higher sections.' },
    { q: 'Do I need a permit and guide?', a: 'A local area permit is required (and a Dhorpatan reserve permit for higher variants). The region is not a formal restricted area, but a guide is essential for route-finding, language and context.' },
    { q: 'Where do I sleep?', a: 'Mostly in Magar village home-stays, run by families and community committees, with some camping on the higher sections and basic guesthouses at the road heads.' },
    { q: 'Is it safe to travel there now?', a: 'Yes. The conflict ended in 2006, the region is peaceful, and visitors are welcomed. Follow your guide’s guidance on discussing and photographing recent history.' },
    { q: 'Is there mobile coverage?', a: 'Patchy in the larger villages, little elsewhere. Carry a satellite messenger if you have one.' },
    { q: 'Can I combine it with other trips?', a: 'It links north to the Dhorpatan Hunting Reserve and, more loosely, to a western Nepal loop taking in Lumbini and Bardiya.' },
    { q: 'What will I get out of this trek?', a: 'Cultural immersion, solitude and a first-hand look at a part of Nepal almost no visitor sees — not dramatic high-mountain scenery, though the Sisne and Putha Hiunchuli skyline is a fine backdrop.' }
  ],
  relatedTreks: ['lumbini-pilgrimage-circuit', 'bardiya-national-park-safari', 'dhaulagiri-circuit', 'lower-dolpo'],
  relatedDestinations: [
    { name: 'Dhorpatan Hunting Reserve', note: 'Nepal’s only hunting reserve, in high country just north — a wilder extension.' },
    { name: 'Lumbini', note: 'The birthplace of the Buddha, reachable on a western Nepal loop.' },
    { name: 'Bardiya National Park', note: 'Terai wildlife to the west, for a lowland contrast.' }
  ],
  hotelsNote: 'Trips include Kathmandu / Pokhara hotels and road-head guesthouses; the trail is Magar home-stays and some camping. This route is planned individually — talk to us about timing, the exact villages and the Jaljala high section.'
};

/* ========================= MADHESH PROVINCE ========================= */

TREKS['janakpur-temple-circuit'] = {
  slug: 'janakpur-temple-circuit',
  name: 'Janakpur Temple Circuit',
  tagline: 'The Mithila city of Sita, on the southern plains',
  province: 'madhesh',
  region: 'Janakpur (Mithila)',
  lowland: true,
  heroImage: '/images/footer.png',
  summary: 'A 1–3 day walking tour of Janakpur — the Terai temple city sacred to Hindus as the birthplace of Sita and the site of her marriage to Rama — taking in the Janaki Mandir, the Ram Mandir, dozens of sacred ponds, and the living Mithila (Maithili) art and culture of the surrounding villages.',
  stats: {
    duration: '1–3 days (part of a wider Nepal trip)',
    difficulty: 'Easy',
    maxAltitude: '≈ 80 m',
    maxAltitudePoint: 'Terai plains',
    bestSeason: 'Oct–Mar (cool, dry season); Vivaha Panchami festival in Nov/Dec',
    startPoint: 'Janakpur (flight from Kathmandu, or train/road from the border)',
    endPoint: 'Janakpur',
    distanceKm: '≈ 4–12 km walking',
    walkHours: '2–5 hrs/day, flat'
  },
  seo: {
    title: 'Janakpur Temple Circuit — Nepal | Janaki Mandir, Mithila Culture & How to Visit',
    description: 'A guide to Janakpur, the Terai temple city sacred as the birthplace of Sita: the Janaki Mandir, the sacred ponds, Mithila art and the Vivaha Panchami festival. Itinerary and FAQ.'
  },
  overview: [
    'Janakpur (Janakpurdham), on the plains near the Indian border, is the most important Hindu pilgrimage city in the Nepal Terai. In the Ramayana it is Janakpur, the capital of King Janak, where Sita was born and where she chose Rama as her husband by his stringing of Shiva’s bow — and the modern city is built around commemorating that story.',
    'Its centrepiece is the Janaki Mandir, a large, ornate marble temple completed in 1911 in a Mughal-Rajput style, dedicated to Sita (Janaki). Beside it stands the Ram Janaki Vivaha Mandap, marking the marriage site. The old city is threaded with more than seventy sacred ponds (sagar and kunda), each with its own legend, and the wider Mithila region is the home of Maithili language and of Mithila (Madhubani) painting — a bold folk art traditionally done by women on the walls and courtyards of their homes.',
    'It is a flat, easy, culturally rich place to spend one to three days — best walked, or cycled — and it is at its most extraordinary during the Vivaha Panchami festival (November or December), when the ritual re-enactment of Rama and Sita’s wedding draws pilgrims from across Nepal and India.'
  ],
  highlights: [
    'The Janaki Mandir — a vast 1911 marble temple to Sita',
    'The Ram Janaki Vivaha Mandap, marking the marriage of Rama and Sita',
    'Dozens of sacred ponds — Ganga Sagar, Dhanush Sagar, Ratna Sagar and more',
    'Mithila (Madhubani) painting in the villages of Kuwa and around',
    'The Vivaha Panchami festival (Nov/Dec) — a days-long re-enactment of the divine wedding',
    'Nepal’s only working railway heritage, and a distinct Maithili plains culture'
  ],
  suitability: {
    physical: 2, technical: 1, altitude: 1, remoteness: 1,
    walkHours: '2–5 hours of flat, easy walking',
    terrain: 'City streets, temple courtyards and pond embankments. Flat throughout.',
    weatherExposure: 'Low, but the Terai is very hot from April to September.',
    goodFor: [
      'Travellers interested in Hindu pilgrimage, the Ramayana or folk art',
      'Anyone wanting a cultural day away from the trekking trail',
      'Visitors during Vivaha Panchami wanting a major living festival'
    ],
    notIdeal: [
      'Visitors expecting mountains, wilderness or physical challenge',
      'Travel in the pre-monsoon heat (April–June)',
      'Anyone uncomfortable in dense, busy pilgrimage crowds during festivals'
    ]
  },
  why: {
    lead: 'The setting of one of the world’s great epics, still lived in and worshipped.',
    paragraphs: [
      'Janakpur is not a monument; it is a working pilgrimage city where the Ramayana is present tense. Priests and pilgrims move between the Janaki Mandir and the ponds, the marriage pavilion is decked as if a wedding is imminent, and in the villages just outside, women paint the same Mithila motifs — fish, peacocks, lotus, the wedding of Sita — that their grandmothers painted.',
      'During Vivaha Panchami the whole city becomes a stage for the re-enactment of the divine wedding, with processions, music and a raucous, joyful crowd. Even outside festival time, an early morning walk around Dhanush Sagar as the ghats fill is a memorable thing.'
    ],
    gallery: [
      { img: '/images/footer.png', caption: 'The Janaki Mandir, Janakpur' },
      { img: '/images/itinerary.png', caption: 'A sacred pond (sagar) in the old city' },
      { img: '/images/hero-mountain.jpg', caption: 'Mithila painting on a village wall near Janakpur' }
    ]
  },
  passes: [],
  itinerary: [
    { day: 1, title: 'The Janaki Mandir and the old city', from: 'Janakpur', to: 'Janakpur', distanceKm: '5–8 km', walkHours: '4–5 hrs', terrain: 'Flat city streets and temple courtyards', stay: 'Hotel', meals: 'B', highlights: ['Janaki Mandir', 'Ram Janaki Vivaha Mandap', 'Ram Mandir and the older temple quarter', 'Evening aarti at Dhanush Sagar'], tips: 'Go early or late to avoid the midday heat; dress modestly for the temples.' },
    { day: 2, title: 'The sacred ponds and Mithila art villages', from: 'Janakpur', to: 'Janakpur', distanceKm: '6–12 km walking / cycling', walkHours: '3–5 hrs', terrain: 'Pond embankments and rural village lanes', stay: 'Hotel', meals: 'B', highlights: ['Ganga Sagar and Ratna Sagar at dawn', 'Kuwa village and a Mithila painting cooperative', 'A women’s art centre and shop'], tips: 'Hire a cycle or cycle-rickshaw; buy paintings directly from the artists.' },
    { day: 3, title: 'Dhanushadham and onward (optional)', from: 'Janakpur', to: 'Janakpur / onward', distanceKm: '3–5 km walking + drive', walkHours: '2–3 hrs', terrain: 'Village and shrine paths', stay: '—', meals: 'B', highlights: ['Dhanushadham — where a fragment of Shiva’s bow is said to have fallen, ~20 km north', 'Local Maithili food and sweets'], tips: 'A half-day trip; then fly out or continue overland.' }
  ],
  routePoints: [
    { name: 'Janaki Mandir', elevation: '≈ 80 m', day: 1, walkTime: 'Centre of the old city', stay: 'Hotels within walking distance', highlight: 'The great 1911 marble temple to Sita', warning: 'Shoes off; modest dress; some inner areas are for worshippers only.' },
    { name: 'Vivaha Mandap', elevation: '≈ 80 m', day: 1, walkTime: 'Beside the Janaki Mandir', highlight: 'The marked site of Rama and Sita’s marriage', warning: 'Very busy during Vivaha Panchami.' },
    { name: 'Dhanush Sagar & Ganga Sagar', elevation: '≈ 80 m', day: 1, walkTime: 'A few minutes from the temple', highlight: 'The two principal sacred ponds, with dawn and dusk rituals', warning: 'The ghats are active ritual spaces — be respectful with photography.' },
    { name: 'Kuwa village (Mithila art)', elevation: '≈ 80 m', day: 2, walkTime: '~3–5 km from the centre', highlight: 'Living Mithila painting on homes and at a women’s cooperative', warning: 'Ask before photographing homes and people.' },
    { name: 'Dhanushadham', elevation: '≈ 90 m', day: 3, walkTime: '~20 km north by road', highlight: 'A pilgrimage shrine linked to the breaking of Shiva’s bow', warning: 'Arrange transport in advance; limited facilities.' }
  ],
  permits: [
    { name: 'Temple / site donations and camera fees', where: 'At the Janaki Mandir and some ponds', feeNote: 'Small voluntary donations and occasional camera fees — no set trekking permit', notes: 'No permit is required to visit Janakpur; normal respectful-visitor conduct applies.' }
  ],
  cost: {
    note: 'An inexpensive cultural add-on — cost is transport, accommodation and a guide. Confirm a quote for your dates.',
    tiers: [
      { name: 'Independent day visit', rangeUSD: '$15–$50 per day', includes: ['Local guide (half day)', 'Cycle-rickshaw hire', 'Donations', 'Meals'] },
      { name: 'Guided 2–3 day cultural visit', rangeUSD: '$120–$350', includes: ['Private guide', 'Hotel', 'Vehicle for Dhanushadham / art villages', 'Mithila art workshop'] },
      { name: 'Festival (Vivaha Panchami) package', rangeUSD: 'Varies — book early', includes: ['Scarce festival-period accommodation', 'Guide', 'Processions and ceremony access'] }
    ],
    breakdown: [
      { item: 'Transport', note: 'Kathmandu–Janakpur flight (~25 min), or overland via the border' },
      { item: 'Accommodation', note: 'Simple to mid-range hotels; scarce and pricey during Vivaha Panchami' },
      { item: 'Guide', note: 'A Maithili-speaking guide adds enormously to the visit' },
      { item: 'Donations / fees', note: 'Small, at temples and ponds' }
    ],
    independentVsGuided: 'Janakpur is easy and safe to explore independently. A local guide is worth it for the Ramayana context, the meaning of the individual ponds, and access to the Mithila art villages.'
  },
  transport: {
    steps: [
      { from: 'Kathmandu', to: 'Janakpur', mode: 'Flight (~25 min)', duration: '25 min', note: 'Several daily flights; Janakpur also has Nepal’s only passenger rail link, running to the Indian border.' },
      { from: 'Kathmandu', to: 'Janakpur', mode: 'Tourist bus / private car', duration: '7–9 hrs', note: 'Via the Terai; long but straightforward.' }
    ],
    note: 'Janakpur combines with Chitwan (to the west) or a border crossing into Bihar, India, for a plains itinerary.'
  },
  equipment: [
    { item: 'Modest, lightweight clothing (shoulders and knees covered)', need: 'essential', note: 'Required in the temples and respectful in the city.' },
    { item: 'Slip-on shoes', need: 'recommended', note: 'You remove shoes at every temple and many shrines.' },
    { item: 'Sun hat, sunglasses, sunscreen', need: 'essential', note: 'Little shade around the ponds and on village lanes.' },
    { item: 'Refillable water bottle', need: 'essential', note: 'It is hot; carry water.' },
    { item: 'Small notes for donations and rickshaws', need: 'recommended', note: 'Cash economy; ATMs exist but keep small change.' }
  ],
  safety: {
    risks: [
      { name: 'Heat', note: 'The Terai is very hot from April to September. Visit October–March, walk in the early morning and evening, and rest through midday.' },
      { name: 'Festival crowds', note: 'Vivaha Panchami draws very large crowds. Keep valuables secure, agree a meeting point with your group, and follow crowd-management directions.' },
      { name: 'Mosquito-borne illness', note: 'The Terai has dengue and historically malaria. Use repellent, cover up at dusk, and check current health advice.' },
      { name: 'Road and border', note: 'Standard Terai road-safety care; carry your passport, as the Indian border is close.' }
    ],
    turnaround: 'Not applicable — a flat city visit. In heat or heavy crowds, shorten the day and use a cycle-rickshaw between sites.',
    note: 'Janakpur is a welcoming pilgrimage city. The practical considerations are heat, festival crowds and mosquitoes, all easily managed with timing and sensible precautions.'
  },
  faq: [
    { q: 'Is the Janakpur Temple Circuit a trek?', a: 'No — Janakpur is on the flat Terai plains. This is a walking cultural and pilgrimage tour, not a mountain trek, usually done over one to three days.' },
    { q: 'Why is Janakpur important?', a: 'It is identified with the ancient city of Janak from the Ramayana — the birthplace of Sita and the site of her marriage to Rama — making it one of the most important Hindu pilgrimage centres in Nepal.' },
    { q: 'What is the Janaki Mandir?', a: 'A large, ornate marble temple completed in 1911, dedicated to Sita (Janaki), built in a blended Mughal and Rajput style. It is the centrepiece of the city.' },
    { q: 'How do I get to Janakpur?', a: 'A 25-minute flight from Kathmandu, or 7–9 hours by road. Janakpur also has Nepal’s only passenger railway, running south to the Indian border.' },
    { q: 'When is the best time to visit?', a: 'October to March for comfortable weather. For the full experience, visit during Vivaha Panchami (November or December), when the marriage of Rama and Sita is re-enacted over several days.' },
    { q: 'What is Mithila painting?', a: 'A bold folk-art tradition of the Mithila region (also called Madhubani, after the Indian town), historically painted by women on the walls and floors of their homes. Villages around Janakpur have cooperatives where you can watch and buy work.' },
    { q: 'Do I need a permit?', a: 'No. Only small voluntary donations and occasional camera fees at temples and ponds.' },
    { q: 'How many days do I need?', a: 'One day for the Janaki Mandir and the central ponds; two to three days to add the Mithila art villages and Dhanushadham at a relaxed pace.' },
    { q: 'Is Janakpur suitable for non-Hindu visitors?', a: 'Yes. Visitors of all backgrounds are welcome at the temples with modest dress and respectful behaviour; some inner sanctums are reserved for worshippers.' },
    { q: 'Can I combine Janakpur with other destinations?', a: 'Yes — with Chitwan National Park to the west, or as a stop on the way to or from a border crossing into Bihar, India.' }
  ],
  relatedTreks: ['lumbini-pilgrimage-circuit', 'bardiya-national-park-safari', 'rolpa-rukum-hill-trail', 'helambu-circuit'],
  relatedDestinations: [
    { name: 'Dhanushadham', note: 'A pilgrimage shrine ~20 km north, linked to the breaking of Shiva’s bow.' },
    { name: 'Chitwan National Park', note: 'Jungle wildlife to the west — a natural plains pairing.' },
    { name: 'Kathmandu Valley', note: 'The Pashupatinath and Changu Narayan temples continue the Hindu-heritage theme.' }
  ],
  hotelsNote: 'We can arrange Janakpur hotels, a Maithili-speaking cultural guide, a Mithila art workshop and transport to the outlying shrines — as a standalone visit or a plains leg of a wider Nepal itinerary. Book well ahead for the Vivaha Panchami festival period.'
};




