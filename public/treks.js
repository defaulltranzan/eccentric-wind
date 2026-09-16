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
/* Records now live in the content database (data/content → admin at /admin).
   They are served as /data/treks.js (load it right after this file), which sets window.TREKS. */
window.TREKS = window.TREKS || {};
