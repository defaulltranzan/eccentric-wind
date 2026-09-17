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
/* Records now live in the content database (data/content → admin at /admin).
   They are served as /data/expeditions.js (load it after this file and BEFORE peaks.js), which sets window.MOUNTAINS. */
window.MOUNTAINS = window.MOUNTAINS || {};
