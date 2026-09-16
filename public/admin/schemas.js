/* Himalayan Magic Adventure — admin form definitions.
 * Each field edits one path inside the record the public page renderers read.
 * Anything not covered by a field is preserved untouched (and is editable in
 * the "Advanced JSON" tab). */
(function (root) {
  'use strict';

  var PROVINCES = [
    ['koshi', 'Koshi (Everest, Makalu, Kanchenjunga)'], ['bagmati', 'Bagmati (Langtang, Helambu, Rolwaling)'],
    ['gandaki', 'Gandaki (Annapurna, Manaslu, Mustang)'], ['karnali', 'Karnali (Dolpo, Rara, Humla)'],
    ['lumbini', 'Lumbini'], ['madhesh', 'Madhesh'], ['sudurpashchim', 'Sudurpashchim (Far West)']
  ];

  var TREK = {
    titleKey: 'name',
    folder: 'treks',
    publicPath: function (slug) { return '/treks/' + slug; },
    sections: [
      { title: 'Basics', fields: [
        { path: 'name', label: 'Trek name', type: 'text', required: true, placeholder: 'Annapurna Circuit Trek' },
        { path: 'slug', label: 'URL slug', type: 'slug', help: 'Page address: /treks/<slug>. Lowercase letters, numbers and hyphens.' },
        { path: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Around the Annapurna massif, over the Thorong La' },
        { path: 'province', label: 'Province', type: 'select', options: PROVINCES, half: true },
        { path: 'region', label: 'Region', type: 'text', placeholder: 'Annapurna', half: true },
        { path: 'heroImage', label: 'Hero image', type: 'image' },
        { path: 'summary', label: 'Summary', type: 'textarea', rows: 4, help: 'Shown on cards and at the top of the page.' },
        { path: 'popular', label: 'Popular (shown in homepage & "Popular" filter)', type: 'checkbox' },
        { path: 'featured', label: 'Signature trek (featured)', type: 'checkbox' },
        { path: 'restricted', label: 'Restricted area (special permit)', type: 'checkbox' },
        { path: 'lowland', label: 'Lowland trip (hide altitude & AMS sections)', type: 'checkbox' }
      ] },
      { title: 'At a glance', fields: [
        { path: 'stats.duration', label: 'Duration', type: 'text', placeholder: '12–16 days on the trail', half: true },
        { path: 'stats.difficulty', label: 'Difficulty', type: 'text', placeholder: 'Moderate to Challenging', half: true },
        { path: 'stats.maxAltitude', label: 'Max altitude', type: 'text', placeholder: '5,416 m', half: true },
        { path: 'stats.maxAltitudePoint', label: 'Highest point', type: 'text', placeholder: 'Thorong La', half: true },
        { path: 'stats.bestSeason', label: 'Best season', type: 'text', placeholder: 'Mar–May · Sep–Nov', half: true },
        { path: 'stats.walkHours', label: 'Walking per day', type: 'text', placeholder: '5–7 hrs/day', half: true },
        { path: 'stats.startPoint', label: 'Start point', type: 'text', half: true },
        { path: 'stats.endPoint', label: 'End point', type: 'text', half: true },
        { path: 'stats.distanceKm', label: 'Distance', type: 'text', placeholder: '≈ 160–200 km', half: true }
      ] },
      { title: 'Overview & highlights', fields: [
        { path: 'overview', label: 'Overview', type: 'paragraphs', rows: 8, help: 'Separate paragraphs with a blank line.' },
        { path: 'highlights', label: 'Highlights', type: 'lines', rows: 6, help: 'One highlight per line.' }
      ] },
      { title: 'Day-by-day itinerary', fields: [
        { path: 'itinerary', label: 'Days', type: 'repeater', itemLabel: function (it, i) { return 'Day ' + (it.day || i + 1) + (it.title ? ' — ' + it.title : ''); },
          newItem: function (list) { return { day: list.length + 1, title: '', from: '', to: '', distanceKm: '', walkHours: '', startEle: null, endEle: null, terrain: '', stay: 'Tea house', meals: 'B/L/D', highlights: [], tips: '' }; },
          fields: [
            { path: 'day', label: 'Day', type: 'number', third: true },
            { path: 'title', label: 'Title', type: 'text', twoThirds: true },
            { path: 'from', label: 'From', type: 'text', half: true },
            { path: 'to', label: 'To', type: 'text', half: true },
            { path: 'startEle', label: 'Start elevation (m)', type: 'number', third: true },
            { path: 'endEle', label: 'End elevation (m)', type: 'number', third: true },
            { path: 'distanceKm', label: 'Distance', type: 'text', third: true },
            { path: 'walkHours', label: 'Walking time', type: 'text', third: true },
            { path: 'stay', label: 'Stay', type: 'text', third: true },
            { path: 'meals', label: 'Meals', type: 'text', third: true },
            { path: 'terrain', label: 'Terrain', type: 'text' },
            { path: 'highlights', label: 'Highlights (one per line)', type: 'lines', rows: 3 },
            { path: 'tips', label: 'Guide tip', type: 'textarea', rows: 2 }
          ] }
      ] },
      { title: 'Cost & inclusions', note: 'Shown in the booking popup. Only list what the package really includes — never guess.', fields: [
        { path: 'included', label: "What's included (one per line)", type: 'lines', rows: 5, half: true, help: 'Leave empty to use the first price tier\'s list.' },
        { path: 'excluded', label: "What's not included (one per line)", type: 'lines', rows: 5, half: true },
        { path: 'cost.note', label: 'Cost note', type: 'textarea', rows: 2 },
        { path: 'cost.tiers', label: 'Price tiers', type: 'repeater', itemLabel: function (it) { return (it.name || 'Tier') + (it.rangeUSD ? ' · ' + it.rangeUSD : ''); },
          newItem: function () { return { name: '', rangeUSD: '', includes: [] }; },
          fields: [
            { path: 'name', label: 'Tier name', type: 'text', half: true },
            { path: 'rangeUSD', label: 'Price range (USD)', type: 'text', placeholder: '$900–$1,300', half: true },
            { path: 'includes', label: 'Includes (one per line)', type: 'lines', rows: 4 }
          ] },
        { path: 'cost.breakdown', label: 'Cost breakdown', type: 'repeater', itemLabel: function (it) { return it.item || 'Item'; },
          newItem: function () { return { item: '', note: '' }; },
          fields: [
            { path: 'item', label: 'Item', type: 'text', half: true },
            { path: 'note', label: 'Note', type: 'text', half: true }
          ] }
      ] },
      { title: 'FAQ', fields: [
        { path: 'faq', label: 'Questions', type: 'repeater', itemLabel: function (it) { return it.q || 'Question'; },
          newItem: function () { return { q: '', a: '' }; },
          fields: [
            { path: 'q', label: 'Question', type: 'text' },
            { path: 'a', label: 'Answer', type: 'textarea', rows: 3 }
          ] }
      ] },
      { title: 'Related & SEO', fields: [
        { path: 'relatedTreks', label: 'Related treks (slugs, comma separated)', type: 'tags', placeholder: 'annapurna-base-camp, mardi-himal' },
        { path: 'relatedDestinations', label: 'Related destinations (comma separated)', type: 'tags' },
        { path: 'hotelsNote', label: 'Hotels note', type: 'textarea', rows: 2 },
        { path: 'seo.title', label: 'SEO title', type: 'text', maxlength: 70 },
        { path: 'seo.description', label: 'SEO description', type: 'textarea', rows: 2, maxlength: 170 }
      ] },
      { title: 'Advanced sections', collapsed: true, note: 'Structured page sections. Edit carefully — keep the JSON shape.', fields: [
        { path: 'suitability', label: 'Suitability', type: 'json' },
        { path: 'why', label: 'Why this trek', type: 'json' },
        { path: 'passes', label: 'Passes', type: 'json' },
        { path: 'acclimatization', label: 'Acclimatisation', type: 'json' },
        { path: 'routePoints', label: 'Route map points', type: 'json' },
        { path: 'permits', label: 'Permits', type: 'json' },
        { path: 'transport', label: 'Transport', type: 'json' },
        { path: 'equipment', label: 'Equipment', type: 'json' },
        { path: 'safety', label: 'Safety', type: 'json' }
      ] }
    ],
    template: function () {
      return {
        name: '', tagline: '', province: 'gandaki', region: '', heroImage: '', summary: '', popular: false,
        stats: { duration: '', difficulty: '', maxAltitude: '', maxAltitudePoint: '', bestSeason: '', startPoint: '', endPoint: '', distanceKm: '', walkHours: '' },
        seo: { title: '', description: '' },
        overview: [], highlights: [],
        suitability: { physical: 5, technical: 1, altitude: 5, remoteness: 5, walkHours: '', terrain: '', weatherExposure: '', goodFor: [], notIdeal: [] },
        why: { lead: '', paragraphs: [] },
        passes: [], acclimatization: {}, itinerary: [], routePoints: [], permits: [],
        cost: { note: '', tiers: [], breakdown: [] },
        transport: {}, equipment: [], safety: {}, faq: [],
        relatedTreks: [], relatedDestinations: [], hotelsNote: ''
      };
    }
  };

  var PEAK_ONLY = 'peak';
  var MOUNTAIN_ONLY = 'eight-thousander';

  var EXPEDITION = {
    titleKey: 'name',
    folder: 'expeditions',
    publicPath: function (slug) { return '/expeditions/' + slug; },
    kinds: [['peak', 'Peak (6,000 m / 7,000 m / trekking peak)'], ['eight-thousander', 'Eight-thousander (the 14)']],
    sections: [
      { title: 'Basics', fields: [
        { path: 'name', label: 'Mountain name', type: 'text', required: true },
        { path: 'slug', label: 'URL slug', type: 'slug', help: 'Page address: /expeditions/<slug>.' },
        { path: 'aka', label: 'Also known as', type: 'text', half: true },
        { path: 'tagline', label: 'Tagline', type: 'text', half: true },
        { path: 'heroImage', label: 'Hero image', type: 'image' },
        { path: 'summary', label: 'Summary', type: 'textarea', rows: 4 },
        { path: 'featured', label: 'Featured / best seller', type: 'checkbox', only: PEAK_ONLY },
        { path: 'bestseller', label: 'Best-seller rank (blank = not featured)', type: 'number', only: MOUNTAIN_ONLY, half: true },
        { path: 'rank', label: 'Height rank (1–14)', type: 'number', only: MOUNTAIN_ONLY, half: true }
      ] },
      { title: 'Mountain facts', fields: [
        { path: { peak: 'elevation', 'eight-thousander': 'elevationM' }, label: 'Elevation (metres)', type: 'number', required: true, third: true },
        { path: 'elevationLabel', label: 'Elevation label', type: 'text', placeholder: '6,812 m', third: true },
        { path: 'elevationFt', label: 'Elevation (feet)', type: 'number', third: true },
        { path: 'category', label: 'Elevation band', type: 'select', only: PEAK_ONLY, third: true, options: [['', 'Auto from elevation'], ['8000', '8,000 m+'], ['7000', '7,000 m+'], ['6000', '6,000 m+'], ['trekking', 'Trekking peak']] },
        { path: 'peakType', label: 'Peak type', type: 'select', only: PEAK_ONLY, third: true, options: [['', '—'], ['Expedition Peak', 'Expedition Peak'], ['Trekking Peak', 'Trekking Peak']] },
        { path: 'peakGrade', label: 'Grade', type: 'select', only: PEAK_ONLY, third: true, options: [['', 'Auto from difficulty'], ['Beginner', 'Beginner'], ['Moderate', 'Moderate'], ['Advanced', 'Advanced'], ['Expert', 'Expert']] },
        { path: 'range', label: 'Range', type: 'text', half: true },
        { path: 'region', label: 'Region', type: 'text', half: true },
        { path: 'country', label: 'Country', type: 'text', only: PEAK_ONLY, third: true },
        { path: 'countryLabel', label: 'Country label', type: 'text', placeholder: 'Nepal / China', third: true },
        { path: 'countries', label: 'Countries (comma separated)', type: 'tags', third: true },
        { path: 'inNepal', label: 'Climbed from Nepal', type: 'checkbox' },
        { path: 'coordinates.lat', label: 'Latitude', type: 'number', step: 'any', third: true },
        { path: 'coordinates.lon', label: 'Longitude', type: 'number', step: 'any', third: true },
        { path: 'baseCampM', label: 'Base camp (m)', type: 'number', third: true },
        { path: 'typicalDurationDays', label: 'Typical duration', type: 'text', placeholder: '26–32 days (Kathmandu to Kathmandu)', half: true },
        { path: 'baseCampNote', label: 'Base camp note', type: 'text', half: true }
      ] },
      { title: 'Pricing & inclusions', note: 'Shown in the booking popup. Leave price tiers empty to show “Price available on request”. Never guess prices or inclusions.', fields: [
        { path: 'cost.note', label: 'Pricing note', type: 'textarea', rows: 2 },
        { path: 'cost.tiers', label: 'Price tiers', type: 'repeater', itemLabel: function (it) { return (it.name || 'Tier') + (it.rangeUSD ? ' · ' + it.rangeUSD : ''); },
          newItem: function () { return { name: '', rangeUSD: '', includes: [] }; },
          fields: [
            { path: 'name', label: 'Tier name', type: 'text', half: true },
            { path: 'rangeUSD', label: 'Price (USD)', type: 'text', placeholder: '$18,000–$24,000', half: true },
            { path: 'includes', label: 'Includes (one per line)', type: 'lines', rows: 4 }
          ] },
        { path: 'included', label: "What's included (one per line)", type: 'lines', rows: 5, half: true },
        { path: 'excluded', label: "What's not included (one per line)", type: 'lines', rows: 5, half: true }
      ] },
      { title: 'Character & history', fields: [
        { path: 'character', label: 'Character of the mountain', type: 'paragraphs', rows: 6, help: 'Separate paragraphs with a blank line.' },
        { path: 'history', label: 'History', type: 'paragraphs', rows: 6 },
        { path: 'approach', label: 'Approach', type: 'textarea', rows: 3 },
        { path: 'acclimatisation', label: 'Acclimatisation', type: 'textarea', rows: 3 }
      ] },
      { title: 'FAQ', fields: [
        { path: 'faq', label: 'Questions', type: 'repeater', itemLabel: function (it) { return it.q || 'Question'; },
          newItem: function () { return { q: '', a: '' }; },
          fields: [{ path: 'q', label: 'Question', type: 'text' }, { path: 'a', label: 'Answer', type: 'textarea', rows: 3 }] }
      ] },
      { title: 'Related & SEO', fields: [
        { path: 'relatedPeaks', label: 'Related peaks (slugs, comma separated)', type: 'tags', only: PEAK_ONLY },
        { path: 'relatedTreks', label: 'Related treks (slugs, comma separated)', type: 'tags' },
        { path: 'relatedDestinations', label: 'Related destinations (comma separated)', type: 'tags' },
        { path: 'seo.title', label: 'SEO title', type: 'text', maxlength: 70 },
        { path: 'seo.description', label: 'SEO description', type: 'textarea', rows: 2, maxlength: 170 }
      ] },
      { title: 'Advanced sections', collapsed: true, note: 'Leave a section as null to show "briefing in preparation" on the page. Never invent route, season or first-ascent facts.', fields: [
        { path: 'firstAscent', label: 'First ascent', type: 'json' },
        { path: 'normalRoute', label: 'Normal route', type: 'json' },
        { path: 'itinerary', label: 'Expedition itinerary (phases)', type: 'json', only: PEAK_ONLY },
        { path: 'season', label: 'Season', type: 'json' },
        { path: 'difficulty', label: 'Difficulty scores', type: 'json' },
        { path: 'camps', label: 'Camps', type: 'json' },
        { path: 'notableAscents', label: 'Notable ascents', type: 'json' },
        { path: 'alternativeRoutes', label: 'Alternative routes', type: 'json' },
        { path: 'objectiveHazards', label: 'Objective hazards', type: 'json' },
        { path: 'equipment', label: 'Equipment', type: 'json' },
        { path: 'permit', label: 'Permit', type: 'json' },
        { path: 'rescue', label: 'Rescue', type: 'json', only: MOUNTAIN_ONLY },
        { path: 'gallery', label: 'Gallery', type: 'json' },
        { path: 'heroCredit', label: 'Photo credit', type: 'json' },
        { path: 'verify', label: 'Still to verify (list)', type: 'json', only: PEAK_ONLY }
      ] }
    ],
    template: function (kind) {
      var base = {
        name: '', aka: '', tagline: '', heroImage: null, gallery: [], summary: '',
        elevationLabel: '', elevationFt: null, range: '', region: '', countryLabel: 'Nepal', countries: ['Nepal'], inNepal: true,
        coordinates: null, seo: { title: '', description: '' },
        character: [], firstAscent: null, notableAscents: [], normalRoute: null, alternativeRoutes: [],
        baseCampM: null, baseCampNote: '', camps: [], approach: '', season: null, typicalDurationDays: '',
        difficulty: null, objectiveHazards: [], history: [], equipment: [], acclimatisation: '', permit: null,
        faq: [], relatedTreks: [], relatedDestinations: []
      };
      if (kind === MOUNTAIN_ONLY) {
        return Object.assign(base, { elevationM: null, rank: null, bestseller: null, logistics: '', weather: '', rescue: null, guideSupport: '' });
      }
      return Object.assign(base, {
        elevation: null, category: '', peakType: 'Expedition Peak', peakGrade: '', featured: false, country: 'Nepal',
        itinerary: null, relatedPeaks: [],
        verify: ['exact summit coordinates', 'current permit fees and rules for the year of travel', 'route conditions for the season']
      });
    }
  };

  var STORY = {
    titleKey: 'title',
    folder: 'stories',
    publicPath: function (slug) { return '/stories/' + slug; },
    sections: [
      { title: 'Basics', fields: [
        { path: 'title', label: 'Headline', type: 'text', required: true },
        { path: 'slug', label: 'URL slug', type: 'slug', help: 'Page address: /stories/<slug>.' },
        { path: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 3, help: 'Shown on the journal index and homepage.' },
        { path: 'category', label: 'Category', type: 'text', list: ['Trail Journal', 'Field Essay', 'Planning', 'Altitude & Safety', 'Culture'], half: true },
        { path: 'date', label: 'Publication date', type: 'date', required: true, quarter: true },
        { path: 'updated', label: 'Updated on', type: 'date', quarter: true },
        { path: 'author', label: 'Author', type: 'text', third: true },
        { path: 'authorRole', label: 'Author role', type: 'text', third: true },
        { path: 'readMinutes', label: 'Read time (minutes)', type: 'number', third: true },
        { path: 'heroImage', label: 'Cover image', type: 'image' },
        { path: 'heroAlt', label: 'Cover image description (alt text)', type: 'text' },
        { path: 'featured', label: 'Featured story (the big one on the journal page)', type: 'checkbox' },
        { path: 'editorsPick', label: "Editor's pick", type: 'checkbox' }
      ] },
      { title: 'Article', fields: [
        { path: 'body', label: 'Article text', type: 'storybody', rows: 24 }
      ] },
      { title: 'Discovery', fields: [
        { path: 'tags', label: 'Tags (comma separated)', type: 'tags' },
        { path: 'topics', label: 'Topics (comma separated)', type: 'tags', help: 'Use: trekking, expeditions, planning, culture, safety.' },
        { path: 'destinations', label: 'Destinations (comma separated)', type: 'tags', help: 'Use: everest, annapurna, langtang, gokyo, manaslu, mustang, dolpo, kanchenjunga.' },
        { path: 'relatedTreks', label: 'Related treks (slugs, comma separated)', type: 'tags' }
      ] }
    ],
    template: function () {
      return {
        title: '', category: 'Trail Journal', date: new Date().toISOString().slice(0, 10), author: '', authorRole: '',
        readMinutes: 5, heroImage: '', heroAlt: '', excerpt: '', tags: [], topics: [], destinations: [], relatedTreks: [],
        body: [{ t: 'p', html: '' }]
      };
    }
  };

  /* ------------------------------------------------------------------
     Article body ⇄ plain text.
       ## Heading            ### Sub-heading          --- (divider)
       > Quote line          > — Who said it
       - list item           1. numbered item
       ![Caption](/images/photo.jpg)
       :::note Title | tip   …text…   :::      (kind: field | safety | tip)
       :::gallery   ![cap](src) lines  :::
       :::facts     Label | Value lines :::
     Anything else is a paragraph; blank lines separate paragraphs.
     Inline HTML (<strong>, <em>, <a href>) is allowed in paragraphs.
     ------------------------------------------------------------------ */
  var IMG_RE = /^!\[(.*?)\]\((\S+?)\)$/;

  function blocksToText(blocks) {
    return (blocks || []).map(function (b) {
      switch (b.t) {
        case 'h2': return '## ' + (b.text || '');
        case 'h3': return '### ' + (b.text || '');
        case 'divider': return '---';
        case 'quote': return (b.text || '').split('\n').map(function (l) { return '> ' + l; }).join('\n') + (b.cite ? '\n> — ' + b.cite : '');
        case 'list': return (b.items || []).map(function (it, i) { return (b.ordered ? (i + 1) + '. ' : '- ') + it; }).join('\n');
        case 'image': return '![' + (b.caption || '') + '](' + (b.src || '') + ')';
        case 'gallery': return ':::gallery\n' + (b.images || []).map(function (im) { return '![' + (im.caption || '') + '](' + (im.src || '') + ')'; }).join('\n') + '\n:::';
        case 'facts': return ':::facts\n' + (b.rows || []).map(function (r) { return (r[0] || '') + ' | ' + (r[1] || ''); }).join('\n') + '\n:::';
        case 'note': return ':::note ' + (b.title || '') + (b.kind ? ' | ' + b.kind : '') + '\n' + (b.html || '') + '\n:::';
        default: return b.html || b.text || '';
      }
    }).join('\n\n');
  }

  function textToBlocks(text) {
    var lines = String(text || '').replace(/\r\n?/g, '\n').split('\n');
    var blocks = [], i = 0, para = [];
    function flush() {
      if (para.length) { blocks.push({ t: 'p', html: para.join(' ').trim() }); para = []; }
    }
    while (i < lines.length) {
      var raw = lines[i], line = raw.trim();
      if (!line) { flush(); i++; continue; }
      var fence = line.match(/^:::(note|gallery|facts)\s*(.*)$/);
      if (fence) {
        flush();
        var inner = []; i++;
        while (i < lines.length && lines[i].trim() !== ':::') { inner.push(lines[i]); i++; }
        i++;
        if (fence[1] === 'note') {
          var head = fence[2].split('|');
          var note = { t: 'note', title: (head[0] || '').trim(), html: inner.join('\n').trim() };
          if (head[1] && head[1].trim()) note.kind = head[1].trim();
          blocks.push(note);
        } else if (fence[1] === 'gallery') {
          blocks.push({ t: 'gallery', images: inner.map(function (l) { var m = l.trim().match(IMG_RE); return m ? { src: m[2], caption: m[1] } : null; }).filter(Boolean) });
        } else {
          blocks.push({ t: 'facts', rows: inner.filter(function (l) { return l.trim(); }).map(function (l) { var k = l.indexOf('|'); return k < 0 ? [l.trim(), ''] : [l.slice(0, k).trim(), l.slice(k + 1).trim()]; }) });
        }
        continue;
      }
      if (/^###\s+/.test(line)) { flush(); blocks.push({ t: 'h3', text: line.replace(/^###\s+/, '') }); i++; continue; }
      if (/^##\s+/.test(line)) { flush(); blocks.push({ t: 'h2', text: line.replace(/^##\s+/, '') }); i++; continue; }
      if (/^-{3,}$/.test(line)) { flush(); blocks.push({ t: 'divider' }); i++; continue; }
      var img = line.match(IMG_RE);
      if (img) { flush(); blocks.push({ t: 'image', src: img[2], caption: img[1] }); i++; continue; }
      if (/^>\s?/.test(line)) {
        flush();
        var q = [], cite = null;
        while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
          var ql = lines[i].trim().replace(/^>\s?/, '');
          if (/^[—–]\s/.test(ql)) cite = ql.replace(/^[—–]\s/, ''); else q.push(ql);
          i++;
        }
        var quote = { t: 'quote', text: q.join('\n') };
        if (cite) quote.cite = cite;
        blocks.push(quote);
        continue;
      }
      if (/^(-|\d+\.)\s+/.test(line)) {
        flush();
        var ordered = /^\d+\./.test(line), items = [];
        while (i < lines.length && /^(-|\d+\.)\s+/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^(-|\d+\.)\s+/, '')); i++; }
        var list = { t: 'list', items: items };
        if (ordered) list.ordered = true;
        blocks.push(list);
        continue;
      }
      para.push(line);
      i++;
    }
    flush();
    return blocks;
  }

  var api = {
    collections: {
      treks: { label: 'Treks', singular: 'Trek', schema: TREK },
      expeditions: { label: 'Expeditions', singular: 'Expedition', schema: EXPEDITION },
      stories: { label: 'Stories', singular: 'Story', schema: STORY }
    },
    blocksToText: blocksToText,
    textToBlocks: textToBlocks
  };
  root.HMA_ADMIN = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
