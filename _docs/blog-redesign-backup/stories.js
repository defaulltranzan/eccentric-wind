/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — STORIES / FIELD JOURNAL DATA MODEL
   ----------------------------------------------------------------------------
   One reusable template (story.html + story-render.js) renders every article
   from the records below, and the same data feeds the homepage "Stories"
   strip and the /stories index.

   To add an article: add one STORIES['slug'] = { ... } object. The index page,
   the homepage strip, related-story links and the sitemap pick it up.

   body[] block types:
     { t:'p',     html:'…' }                     paragraph (inline HTML allowed)
     { t:'h2',    text:'…' }                     section heading
     { t:'quote', text:'…', cite:'…' }           pull quote
     { t:'list',  items:['…','…'], ordered:false }
     { t:'note',  title:'…', html:'…' }          callout box
     { t:'image', src:'…', caption:'…' }         full-width figure

   EDITORIAL NOTE: these launch articles are evergreen guidance on well-known
   routes and on high-altitude physiology. Bylines are placeholders — swap in
   the real author when known. Nothing route-specific here is invented beyond
   what is common knowledge about these trails.
   ========================================================================== */
(function () {
  'use strict';

  window.STORY_DEFAULTS = {
    kicker: 'The Field Journal',
    heading: 'Stories From <span class="accent">The High Places</span>',
    intro: 'Long-form notes from the trail and the mountain — how we think about acclimatisation, what a pass crossing actually feels like, and how to choose the walk that fits you. Written by the guides and doctors who work these routes.',
    metaTitle: 'The Field Journal — Trekking & Expedition Stories | Himalayan Magic Adventure',
    metaDescription: 'First-hand essays and practical guidance from Himalayan Magic Adventure — acclimatisation, pass crossings, route choice and life at altitude in the Nepal Himalaya.'
  };

  var STORIES = {};
  window.STORIES = STORIES;

  /* ---------------------------------------------------------------------- */
  STORIES['acclimatisation-philosophy'] = {
    slug: 'acclimatisation-philosophy',
    title: 'The Acclimatisation Philosophy: Why We Build In Rest Days',
    category: 'Altitude & Safety',
    date: '2026-08-15',
    author: 'Dr. Ang Tshering',
    authorRole: 'Expedition physician',
    readMinutes: 7,
    heroImage: '/images/blog-1.jpg',
    heroAlt: 'First light over the Khumbu valley on the walk to Namche Bazaar',
    excerpt: 'Why our Everest and Annapurna itineraries stop for a second night at Namche and Manang — and what the extra day is actually doing inside your body.',
    tags: ['acclimatisation', 'AMS', 'itinerary design', 'Khumbu'],
    body: [
      { t: 'p', html: 'Every itinerary we publish for a trek above 3,000 metres has at least one day on it where you barely move. Clients sometimes ask to cut those days to get home sooner. We never do, and this is the reasoning we give them.' },
      { t: 'p', html: 'At Everest Base Camp altitude the air still holds the same 21% oxygen it does at sea level — there is simply far less air. At 5,300 m each breath delivers roughly half the oxygen molecules it would in Kathmandu. Your body can close most of that gap, but only if it is given time. Acclimatisation is a set of slow adjustments — more breathing, more red blood cells, changes in the small blood vessels of the lungs and brain — and the slowest of them take days, not hours.' },

      { t: 'h2', text: 'What a rest day is really for' },
      { t: 'p', html: 'The phrase "rest day" is slightly misleading. On our Khumbu itineraries the second day at Namche Bazaar (3,440 m) is an active day: we walk up to the Everest View Hotel at around 3,880 m, spend time there, and walk back down to sleep. This is the oldest rule in altitude medicine — <em>climb high, sleep low</em>. The daytime excursion gives your physiology a stimulus to adapt to; sleeping lower gives it a safe night to do the work.' },
      { t: 'p', html: 'On the Annapurna Circuit we do exactly the same thing at Manang (3,540 m), with an acclimatisation walk toward Ice Lake or Kicho Tal. Skip that day and you arrive at the foot of the Thorong La under-adapted, tired, and far more likely to turn around on pass morning.' },

      { t: 'note', title: 'Our altitude rules', html: 'Above 3,000 m we plan for no more than <strong>300–500 m of sleeping-altitude gain per day</strong>, and a rest day roughly every <strong>1,000 m</strong> of ascent. Hydration target is 3–4 litres a day. Diamox is discussed with every group but never used to paper over a rushed schedule.' },

      { t: 'h2', text: 'Reading the early signs' },
      { t: 'p', html: 'Mild acute mountain sickness (AMS) is common and not dangerous in itself: a headache that responds to paracetamol, some nausea, poor sleep, a day of low appetite. The rule we teach is simple — <strong>if you have AMS symptoms, do not go higher until they have gone.</strong> Most of the time a rest day and fluids resolve it.' },
      { t: 'p', html: 'What we watch for, and brief every client to watch for in each other, is the shift from AMS to something serious:' },
      { t: 'list', items: [
        'Loss of balance or coordination — being unable to walk a straight line heel-to-toe. This is the single most important sign of high-altitude cerebral oedema (HACE).',
        'Confusion, unusual behaviour, or drowsiness that is out of character.',
        'Breathlessness at rest, a wet cough, or a blue tinge to the lips — the signs of high-altitude pulmonary oedema (HAPE).'
      ]},
      { t: 'p', html: 'Any one of these means immediate descent, on that day, with a guide — not "let’s see how it looks in the morning". Descent of even 500–1,000 m is the definitive treatment and it works fast. Our guides carry a pulse oximeter, dexamethasone and nifedipine, and every field team can coordinate a helicopter evacuation with your travel insurer.' },

      { t: 'quote', text: 'The mountain is not going anywhere. The people who summit are usually the ones who were willing to walk slowly on the days it mattered.', cite: 'A sirdar we have worked with for twenty years' },

      { t: 'h2', text: 'Why this shapes the price and the length' },
      { t: 'p', html: 'A properly acclimatised Everest Base Camp trek is 12 days on the trail, not 9. Those extra days are guides, lodging and food, and they are the difference between a trip you finish and a trip that ends early in Lukla. When you compare operators, compare the day counts above 3,500 m — that is where a cheap itinerary quietly cuts corners.' },
      { t: 'p', html: 'If you are choosing between routes, our <a href="/compare">comparison tool</a> lines up duration and maximum altitude side by side, and every individual <a href="/treks">trek page</a> shows exactly where the acclimatisation days fall.' }
    ]
  };

  /* ---------------------------------------------------------------------- */
  STORIES['crossing-the-thorong-la'] = {
    slug: 'crossing-the-thorong-la',
    title: 'Crossing the Thorong La: A Pre-Dawn Push to 5,416 m',
    category: 'Trail Journal',
    date: '2026-08-02',
    author: 'Dawa Tenzing',
    authorRole: 'Lead trekking guide, Annapurna',
    readMinutes: 6,
    heroImage: '/images/blog-3.jpg',
    heroAlt: 'The Annapurna massif catching first light above the Marsyangdi valley',
    excerpt: 'The highest point on the Annapurna Circuit is a 04:00 start, a headtorch trail of other headtorches, and a very long descent to Muktinath. Here is how the day runs.',
    tags: ['Annapurna Circuit', 'Thorong La', 'high passes', 'Mustang'],
    body: [
      { t: 'p', html: 'We wake the group at 03:30 in Thorong Phedi or, better, at High Camp about 400 m higher. There is tea, there is porridge nobody wants to eat, and there is the particular quiet of people putting on every layer they own. By 04:15 we are walking.' },
      { t: 'p', html: 'The reason for the absurd hour is wind. The Thorong La sits between the Annapurna and Damodar ranges and it funnels weather. In the calm of early morning the pass is a walk; by late morning it can be a fight, and by afternoon the descent on the far side turns unpleasant. Every hour you start earlier is an hour of better conditions.' },

      { t: 'h2', text: 'The climb' },
      { t: 'p', html: 'From High Camp it is roughly 1,000 m of ascent to the pass, but it comes in a series of false summits — a teahouse at the halfway point that is sometimes open for tea, then a long snow-and-scree traverse, then the prayer flags. The trail is not technical. What makes it hard is the altitude and the cold: at 5,000 m in the dark, moving slowly, most people are working at the edge of what feels sustainable.' },
      { t: 'p', html: 'We walk in a tight group with a fixed, deliberately slow pace — the <em>bistari bistari</em> shuffle. If your breathing lets you speak a short sentence, the pace is right. If it does not, we are going too fast and we slow down. Nobody is sent ahead; nobody is left behind.' },

      { t: 'note', title: 'What we carry over the pass', html: 'Full down jacket, windproof shell, warm gloves plus liner gloves, a buff or balaclava, sunglasses (category 4) and sunscreen for the moment the sun hits, 1.5 L of water kept inside the jacket so it does not freeze, and snacks you have already tested at altitude. The guide carries the group first-aid kit, oxygen and a satellite communicator.' },

      { t: 'h2', text: 'The top' },
      { t: 'p', html: 'The Thorong La is marked by a weather-beaten sign, a cairn thick with prayer flags, and — usually — a small teahouse selling the most expensive, most welcome cup of tea in Nepal. We stop for fifteen minutes, no more. It is too cold and too high to linger, and the day is only half done.' },
      { t: 'quote', text: 'People think the pass is the finish line. The pass is the point where the long day actually begins.' },

      { t: 'h2', text: 'The descent nobody warns you about' },
      { t: 'p', html: 'From the pass it is about 1,600 m down to Muktinath — a knee-punishing drop on loose ground that takes most groups three to four hours. This is where trekking poles earn their place and where tired people roll ankles. We slow the pace again, take the switchbacks properly, and stop for a proper rest once the gradient eases near Chabarbu.' },
      { t: 'p', html: 'Muktinath itself is a reward: a sacred site for both Hindus and Buddhists, with 108 water spouts and an eternal flame, dropping you into the dry, wind-carved landscape of Lower Mustang. Most groups arrive by mid-afternoon, drop their packs, and sleep extremely well.' },
      { t: 'p', html: 'If the Thorong La is on your list, the full route is on our <a href="/treks/annapurna-circuit">Annapurna Circuit</a> page, including where the acclimatisation days fall before you ever reach High Camp.' }
    ]
  };

  /* ---------------------------------------------------------------------- */
  STORIES['a-morning-on-gokyo-ri'] = {
    slug: 'a-morning-on-gokyo-ri',
    title: 'A Morning on Gokyo Ri',
    category: 'Field Essay',
    date: '2026-07-28',
    author: 'Pasang Lhamu',
    authorRole: 'Guide, Everest region',
    readMinutes: 5,
    heroImage: '/images/blog-2.jpg',
    heroAlt: 'The Gokyo lakes and Ngozumpa glacier below Cho Oyu',
    excerpt: 'From a 5,357 m viewpoint above the Gokyo lakes, four of the world’s six highest mountains stand in a single line. It is worth the cold start.',
    tags: ['Gokyo', 'Everest region', 'Ngozumpa glacier', 'photography'],
    body: [
      { t: 'p', html: 'Gokyo Ri is not a hard climb — 600 metres of steep trail above the village — but it is a cold one, because the only time to be on top is sunrise. We leave the lodge by headtorch at 04:30, and for the first hour it is just breath, boots on frozen grit, and the black shape of the Ngozumpa glacier below.' },
      { t: 'p', html: 'The Ngozumpa is the longest glacier in Nepal, and from the village it does not look like ice at all — it looks like a two-kilometre-wide river of grey rubble, groaning and cracking through the night as it moves. The third Gokyo lake, an impossible turquoise, sits right against its edge.' },

      { t: 'h2', text: 'The line of giants' },
      { t: 'p', html: 'You reach the summit cairn in the last of the dark. Then the light comes up behind the Tibetan border, and one by one the big mountains take it: <strong>Cho Oyu</strong> (8,188 m) to the north, then the whole Everest group to the east — <strong>Everest</strong> itself (8,849 m), <strong>Lhotse</strong> (8,516 m), and, further along the ridge, <strong>Makalu</strong> (8,485 m). Four of the six highest points on Earth, in one field of view, going gold.' },
      { t: 'quote', text: 'People come to the Everest region for one mountain. Gokyo is where you understand it has neighbours.' },
      { t: 'p', html: 'For photographers the window is short — maybe forty minutes of good light before the sky goes flat and blue — and the cold is serious, well below freezing with wind. Spare batteries live in an inside pocket. So do numb hands.' },

      { t: 'h2', text: 'Why we route people through Gokyo' },
      { t: 'p', html: 'Many trekkers do Gokyo as a quieter alternative to the standard Everest Base Camp trail, or link the two by crossing the Cho La pass. It has fewer people, arguably better views, and the lakes give the walk a character the main valley lacks. It is still real altitude — the village is at 4,790 m — so the acclimatisation discipline is the same.' },
      { t: 'p', html: 'The full itinerary, including the Cho La option, is on our <a href="/treks/gokyo-lakes">Gokyo Lakes</a> and <a href="/treks/three-passes">Everest Three Passes</a> pages.' }
    ]
  };

  /* ---------------------------------------------------------------------- */
  STORIES['choosing-your-first-himalayan-trek'] = {
    slug: 'choosing-your-first-himalayan-trek',
    title: 'Choosing Your First Himalayan Trek',
    category: 'Planning',
    date: '2026-07-10',
    author: 'Himalayan Magic Adventure',
    authorRole: 'Trip planning desk',
    readMinutes: 8,
    heroImage: '/images/hero-mountain.jpg',
    heroAlt: 'High peaks above a tea-house trekking trail in Nepal',
    excerpt: 'Everest Base Camp, the Annapurna Circuit, or Langtang? A straight comparison of the three classic first treks — on fitness, altitude, time, cost and character.',
    tags: ['trip planning', 'Everest Base Camp', 'Annapurna', 'Langtang'],
    body: [
      { t: 'p', html: 'Most people planning a first trek in Nepal are choosing between three routes: <strong>Everest Base Camp</strong>, the <strong>Annapurna Circuit</strong>, and the <strong>Langtang Valley</strong>. All three are tea-house treks — you sleep in lodges, not tents — and all three are within reach of a reasonably fit person who trains for them. They are not interchangeable, though. Here is how we help clients decide.' },

      { t: 'h2', text: 'Everest Base Camp — the icon' },
      { t: 'p', html: '12 days on the trail, a high point of 5,545 m at Kala Patthar, and the most famous walk in the world. You are in the Khumbu, the Sherpa heartland, the whole way. The trade-offs: it is the busiest of the three, the altitude is serious and unrelenting for the second half, and it starts with a flight into Lukla that weather can delay. Choose it if the mountain itself is the point and you accept the crowds and the altitude that come with it.' },

      { t: 'h2', text: 'Annapurna Circuit — the variety' },
      { t: 'p', html: '12–16 days depending on where you start and stop, crossing the Thorong La at 5,416 m. This is the trek that changes underfoot: subtropical river valleys, then pine forest and Tibetan-influenced villages, then the high, dry, wind-scoured landscape of Mustang on the far side of the pass. Road-building has shortened it at both ends, which some people mourn and others are grateful for. Choose it if you want the most scenic and cultural range in a single walk.' },

      { t: 'h2', text: 'Langtang Valley — the underrated one' },
      { t: 'p', html: '7–8 days, a high point around 4,770 m at Tserko Ri, and a trailhead you reach by a (long) drive from Kathmandu rather than a flight. It is closer, shorter, lower and much quieter than the other two, running up a single glacial valley beneath 6,000–7,000 m peaks. The valley was hit hard by the 2015 earthquake and the community has rebuilt with real intention. Choose it if you have less time, want fewer people, or are less certain about how you handle altitude.' },

      { t: 'note', title: 'A quick filter', html: '<strong>Under 10 days available?</strong> Langtang. <strong>Want the name and accept the altitude?</strong> Everest Base Camp. <strong>Want the most varied single trek?</strong> Annapurna Circuit. Still unsure — our <a href="/#trek-finder">trek finder</a> scores all 38 of our routes against your answers.' },

      { t: 'h2', text: 'On fitness' },
      { t: 'p', html: 'None of these require technical skill. What they require is the ability to walk 5–7 hours a day, uphill and down, on consecutive days, at altitude. The best preparation is hill walking with a loaded pack, done regularly for two to three months beforehand. Cardio fitness helps you enjoy it; it does not protect you from altitude — only a sensible ascent profile does.' },

      { t: 'h2', text: 'On cost' },
      { t: 'p', html: 'The honest ranking, land cost only: Langtang is the cheapest, Annapurna in the middle, Everest Base Camp the most expensive — largely because of the Lukla flights and the higher lodge prices deep in the Khumbu. Beware quotes that look far below the others; the saving is almost always fewer acclimatisation days or a weaker guide-to-client ratio.' },
      { t: 'quote', text: 'The right first trek is the one you finish feeling like you could have done a little more — not the one that nearly broke you.' },

      { t: 'p', html: 'When you have a shortlist, put the routes side by side on our <a href="/compare">comparison tool</a>, then read the full day-by-day on each <a href="/treks">trek page</a>. If you want a person rather than a page, the <a href="/contact">planning desk</a> answers within a day.' }
    ]
  };

  /* ---------------------------------------------------------------------- API */
  function toArr() {
    return Object.keys(STORIES).map(function (k) { return STORIES[k]; })
      .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
  }
  window.getStories = function (opts) {
    opts = opts || {};
    var out = toArr();
    if (opts.category) out = out.filter(function (s) { return s.category === opts.category; });
    if (opts.tag) out = out.filter(function (s) { return (s.tags || []).indexOf(opts.tag) > -1; });
    if (opts.exclude) out = out.filter(function (s) { return s.slug !== opts.exclude; });
    if (opts.limit) out = out.slice(0, opts.limit);
    return out;
  };
  window.getStory = function (slug) {
    return STORIES[String(slug || '').toLowerCase()] || null;
  };
  window.getRelatedStories = function (slug, n) {
    var s = STORIES[slug];
    if (!s) return window.getStories({ limit: n || 2 });
    var scored = toArr().filter(function (x) { return x.slug !== slug; }).map(function (x) {
      var shared = (x.tags || []).filter(function (t) { return (s.tags || []).indexOf(t) > -1; }).length;
      return { s: x, score: shared + (x.category === s.category ? 1 : 0) };
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored.slice(0, n || 2).map(function (o) { return o.s; });
  };
  window.formatStoryDate = function (iso) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso || '';
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };
})();
