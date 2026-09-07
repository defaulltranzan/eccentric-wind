/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — interactive safety tools  (altitude-safety page)
   ----------------------------------------------------------------------------
   Two self-contained widgets, both no-op if their host markup / data is absent:

     1. #acclim-profile  — Acclimatisation Profile chart. Two modes, one visual
        language:
          • Trekking routes  — window.TREKS: plots each day's sleeping altitude,
            flags overnight gains over the ~500 m guideline, marks rest days.
          • Expeditions      — window.MOUNTAINS + window.PEAKS_DATA: plots the
            phase-by-phase rotation profile (the acclimatisation saw-tooth), with
            camp altitudes as reference lines. Uses a record's hand-written
            itinerary[] phases where present, otherwise synthesises the standard
            phased timeline the way expedition-render.js does.

     2. #ams-risk        — AMS Risk Profile calculator. A planning-stage
        susceptibility estimate loosely modelled on the Wilderness Medical
        Society risk categories (low / moderate / high). Not medical advice.

   Revert: see _docs/REVERT-notes.md § 5w. Delete this file + the two
   <section> blocks + the <script src="/safety-tools.js"> tag on
   public/altitude-safety.html, then npm run build:css.
   ========================================================================== */
(function () {
  'use strict';

  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVGNS = 'http://www.w3.org/2000/svg';

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }

  /* ========================================================================
     1 — ACCLIMATISATION PROFILE CHART
     ===================================================================== */
  (function acclimProfile() {
    var host = $('acclim-profile');
    if (!host) return;
    var selEl = $('ap-trek');
    var chartEl = $('ap-chart');
    var detailEl = $('ap-detail');
    var statsEl = $('ap-stats');
    var verdictEl = $('ap-verdict');
    var legendEl = $('ap-legend');
    if (!selEl || !chartEl) return;

    var TREKS = window.TREKS || {};
    var MOUNTAINS = window.MOUNTAINS || {};
    var PEAKS_DATA = window.PEAKS_DATA || {};
    var getPeak = typeof window.getPeak === 'function' ? window.getPeak : null;
    var STORE = 'vo_ap_trek';

    function num(v) { return typeof v === 'number' ? v : (parseFloat(String(v).replace(/[, ]/g, '')) || 0); }
    function dRange(s) {
      var m = String(s == null ? '' : s).match(/(\d+)\s*(?:[–-]\s*(\d+))?/);
      if (!m) return 3;
      return m[2] ? (+m[1] + +m[2]) / 2 : +m[1];
    }

    /* -------- TREK MODEL (day-by-day sleeping altitude) ---------------- */
    // Pull a plausible day high-point (a pass or acclimatisation top) out of the
    // prose. The cap allows a pass up to ~700 m above the trek's highest camp
    // (real — Thorong La, the Cho La) while rejecting a far-off peak that is just
    // name-dropped in a sentence (Makalu "8,485 m" seen from a ridge).
    function dayHigh(d, sleepEle, ceil) {
      var s = [d.terrain, d.tips, d.title, d.to].join(' ');
      var re = /([2-6])[,. ]?(\d{3})\s*m\b/g, m, best = 0, lim = Math.max(ceil + 700, 5900);
      while ((m = re.exec(s))) {
        var v = parseInt(m[1] + m[2], 10);
        if (v > best && v <= lim) best = v;
      }
      return best > sleepEle + 120 ? best : 0;
    }

    function buildTrek(t) {
      var it = t.itinerary;
      var accl = (t.acclimatization && Array.isArray(t.acclimatization.days)) ? t.acclimatization.days : [];
      var rows = it.map(function (d, i) {
        var sleep = +d.endEle || +d.startEle || 0;
        var prev = i === 0 ? (+it[0].startEle || sleep) : (+it[i - 1].endEle || sleep);
        return {
          x: d.day || (i + 1), xLabel: String(d.day || (i + 1)),
          alt: sleep, gain: sleep - prev,
          title: d.title || ('Day ' + (i + 1)),
          rest: accl.indexOf(d.day) !== -1 || /acclimati|rest day/i.test(d.title || ''),
          walk: d.walkHours || d.walkHrs || '', tips: d.tips || '',
          warn: false, crit: false, high: 0
        };
      });
      var maxSleep = Math.max.apply(null, rows.map(function (d) { return d.alt; }));
      rows.forEach(function (d, i) {
        if (d.gain > 500 && d.alt > 3000) {
          var nextRest = rows[i + 1] && rows[i + 1].rest;
          d.crit = d.gain > 800 && d.alt > 3500 && !nextRest && !d.rest;
          d.warn = !d.crit;
        }
        d.high = dayHigh(it[i], d.alt, Math.max(maxSleep, 3500));
      });

      // The curated stats.maxAltitude is authoritative. When it clears the whole
      // itinerary by a clear margin (a pass whose height isn't in the day rows —
      // e.g. the Thorong La), pin it as the high point of the highest day.
      var curatedMax = num((t.stats && t.stats.maxAltitude || '').replace(/[≈~]/g, ''));
      var peak = Math.max(maxSleep, Math.max.apply(null, rows.map(function (d) { return d.high; })));
      if (curatedMax > peak + 150 && curatedMax < 6500) {
        var top = rows.reduce(function (a, b) { return b.alt > a.alt ? b : a; }, rows[0]);
        top.high = curatedMax;
        peak = curatedMax;
      }
      var gainTot = rows.reduce(function (a, d) { return a + Math.max(0, d.gain); }, 0);
      var biggest = rows.reduce(function (a, d) { return d.alt > 3000 && d.gain > a.gain ? d : a; }, { gain: -1e9 });
      var restList = rows.filter(function (d) { return d.rest; });
      var flagged = rows.filter(function (d) { return d.warn || d.crit; });

      rows.forEach(function (d) {
        d.nodeCls = (d.crit ? ' is-crit' : d.warn ? ' is-warn' : '') + (d.rest ? ' is-rest' : '');
        d.tipTop = 'Day ' + d.x + (d.rest ? ' · rest' : '');
        d.tipAlt = fmt(d.alt) + ' m<span> sleeping</span>';
        d.tipSub = '<span class="ap-tip-gain ' + (d.crit ? 'is-crit' : d.warn ? 'is-warn' : d.gain < 0 ? 'is-down' : '') + '">' +
          (d.gain >= 0 ? '▲ +' : '▼ ') + fmt(Math.abs(d.gain)) + ' m overnight</span>';
        d.badge = d.crit ? '<span class="ap-badge is-crit">Big gain, no rest day after</span>'
          : d.warn ? '<span class="ap-badge is-warn">Over the 500 m guide</span>'
            : d.rest ? '<span class="ap-badge is-rest">Rest / acclimatisation day</span>' : '';
        d.detailKey = 'Day ' + d.x;
        d.rowFacts = [
          '<span><b>' + fmt(d.alt) + ' m</b> sleeping altitude</span>',
          '<span class="' + (d.crit ? 'is-crit' : d.warn ? 'is-warn' : d.gain < 0 ? 'is-down' : '') + '">' +
          (d.gain >= 0 ? '+' : '−') + fmt(Math.abs(d.gain)) + ' m overnight</span>',
          d.high ? '<span>climbs to ~' + fmt(d.high) + ' m</span>' : '',
          d.walk ? '<span>' + esc(d.walk) + ' walking</span>' : ''
        ];
        d.note = d.tips;
      });

      var verdict, tone, rest = restList.map(function (d) { return 'day ' + d.x; }).join(', ');
      if (!flagged.length) {
        tone = 'ok';
        verdict = 'Every overnight gain on this itinerary stays within the ~500 m guideline once above 3,000 m' +
          (rest ? ', with rest days at ' + rest : '') +
          '. That is the pace this route is designed around — hold to it and do not skip the rest days.';
      } else {
        tone = flagged.some(function (d) { return d.crit; }) ? 'crit' : 'warn';
        verdict = 'Some nights climb faster than the ~500 m guideline: ' +
          flagged.map(function (d) { return 'day ' + d.x + ' (+' + fmt(d.gain) + ' m)'; }).join(', ') +
          '. On the ground this is often unavoidable — the trail leaves no gentler option — which is exactly why the itinerary builds in acclimatisation' +
          (rest ? ' at ' + rest : '') + '. Watch AMS symptoms closely on and after these days, keep the next day easy, and be ready to hold or descend.';
      }

      return {
        kind: 'trek', name: t.name, href: '/treks/' + t.slug, linkLabel: 'Full ' + t.name + ' itinerary',
        points: rows,
        xTitle: 'day of the trek →', ariaKind: 'Sleeping-altitude profile',
        refs: [[3000, 'Acclimatisation zone'], [5000, 'Extreme altitude']],
        stats: [
          ['Highest sleep', fmt(maxSleep) + ' m'],
          ['Highest point', fmt(peak) + ' m'],
          ['Sleeping-altitude gain', fmt(gainTot) + ' m'],
          ['Nights ≥ 3,000 m', rows.filter(function (d) { return d.alt >= 3000; }).length],
          ['Nights ≥ 4,000 m', rows.filter(function (d) { return d.alt >= 4000; }).length],
          ['Nights ≥ 5,000 m', rows.filter(function (d) { return d.alt >= 5000; }).length],
          ['Rest days', restList.length],
          ['Biggest overnight gain', biggest.gain > -1e9 ? ('+' + fmt(biggest.gain) + ' m · day ' + biggest.x) : '—']
        ],
        verdictTone: tone, verdictText: verdict, verdictKicker: 'Reading the profile',
        defaultIdx: (function () { var f = rows.findIndex(function (d) { return d.warn || d.crit; }); return f === -1 ? rows.length - 1 : f; })(),
        legend: 'trek'
      };
    }

    /* -------- EXPEDITION MODEL (phase-by-phase rotation profile) ------- */
    function phasesFor(raw) {
      if (Array.isArray(raw.itinerary) && raw.itinerary.length && raw.itinerary[0] && raw.itinerary[0].altM != null) {
        return raw.itinerary.map(function (p, i) {
          return { title: p.title || ('Phase ' + (i + 1)), days: p.days, alt: num(p.altM), detail: p.detail || '' };
        });
      }
      // synthesise the standard phased timeline (mirrors expedition-render.js)
      var camps = Array.isArray(raw.camps) ? raw.camps : [];
      var summit = num(raw.elevationM) || (camps.length ? num(camps[camps.length - 1].altM) : 0);
      var bc = num(raw.baseCampM) || (camps.length ? num(camps[0].altM) : 0);
      var summitCamp = camps.length > 2 ? num(camps[camps.length - 2].altM) : null;
      var big = summit >= 8000;
      var ap = raw.approach || '';
      var startAlt = /Islamabad|Skardu|Gilgit/i.test(ap) ? 1500 : /Kashgar/i.test(ap) ? 1300 : /Leh|Ladakh/i.test(ap) ? 3500 : 1400;
      return [
        { title: 'Arrival & briefing', days: '2–3', alt: startAlt, detail: 'Permits, liaison-officer formalities, an expedition briefing and a final gear check.' },
        { title: 'Approach to Base Camp', days: big ? '8–12' : '5–9', alt: bc, detail: (ap ? ap + ' ' : '') + 'The approach is also the first phase of acclimatisation.' },
        { title: 'Base Camp established', days: '2–3', alt: bc, detail: 'Build a stocked Base Camp, rest, and make a first short acclimatisation walk.' },
        { title: 'Acclimatisation rotations', days: big ? '18–26' : '10–16', alt: summitCamp || summit, detail: raw.acclimatisation || 'Several rotations up the route to progressively higher camps, returning to Base Camp to recover between them.' },
        { title: 'Rest & weather window', days: '4–7', alt: bc, detail: 'Descend to Base Camp or lower to recover fully while the team watches the forecast for a settled summit window.' },
        { title: 'Summit push', days: big ? '5–8' : '4–6', alt: summit, detail: 'Move back up the route to the top camp, a long summit day, and the descent.' },
        { title: 'Descent & return', days: '3–6', alt: startAlt, detail: 'Clear the mountain, trek or drive out, and debrief.' }
      ];
    }

    function buildPeak(raw, norm) {
      var camps = Array.isArray(raw.camps) ? raw.camps : [];
      var summit = num(raw.elevationM) || (norm && num(norm.elevation)) || (camps.length ? num(camps[camps.length - 1].altM) : 0);
      var bc = num(raw.baseCampM) || (camps.length ? num(camps[0].altM) : 0);
      var highCamps = camps.filter(function (c) { return !/summit/i.test(c.name || ''); });
      var topCamp = highCamps.length ? num(highCamps[highCamps.length - 1].altM) : null;

      var phases = phasesFor(raw), cum = 0;
      var points = phases.map(function (p, i) {
        var dur = dRange(p.days); cum += dur;
        var isRest = /rest|weather window/i.test(p.title);
        var isSummit = /summit/i.test(p.title);
        var isRot = /rotation|acclimat/i.test(p.title);
        return {
          x: cum, xLabel: '~' + Math.round(cum) + 'd',
          alt: p.alt, title: p.title, detail: p.detail,
          days: p.days, rest: isRest, summit: isSummit, rot: isRot,
          nodeCls: isRest ? ' is-rest' : isSummit ? ' is-summit' : '',
          tipTop: 'Phase ' + (i + 1) + (p.days ? ' · ≈ ' + p.days + ' d' : ''),
          tipAlt: fmt(p.alt) + ' m<span>' + (isSummit ? ' summit' : isRest ? ' Base Camp' : ' working') + '</span>',
          tipSub: '<span class="ap-tip-gain' + (isRest ? ' is-down' : '') + '">' +
            (isSummit ? 'summit day' : isRest ? 'recovery at Base Camp' : isRot ? 'rotation high point' : 'moving on the route') + '</span>',
          badge: isSummit ? '<span class="ap-badge is-crit">Summit push</span>'
            : isRest ? '<span class="ap-badge is-rest">Recovery &amp; weather hold</span>'
              : isRot ? '<span class="ap-badge is-warn">Acclimatisation rotations</span>' : '',
          detailKey: 'Phase ' + (i + 1),
          rowFacts: [
            '<span><b>' + fmt(p.alt) + ' m</b>' + (isSummit ? ' summit' : isRest ? ' at Base Camp' : ' on the route') + '</span>',
            p.days ? '<span>≈ ' + esc(p.days) + ' days</span>' : ''
          ],
          note: p.detail
        };
      });

      var ap = raw.approach || '';
      var city = /Islamabad|Skardu|Gilgit/i.test(ap) ? 'Islamabad' : /Kashgar/i.test(ap) ? 'Kashgar' : /Leh|Ladakh/i.test(ap) ? 'Leh' : 'Kathmandu';
      var totalDays = norm && norm.duration ? norm.duration : (raw.typicalDurationDays || (Math.round(cum) + ' days'));
      var seasonTxt = (raw.season && (raw.season.window || raw.season.primary)) || (norm && norm.climbingSeason) || '';
      var grade = (norm && norm.peakGrade) || (raw.difficultyDetail && raw.difficultyDetail.summary ? '' : '') || '';
      var routeName = (raw.normalRoute && raw.normalRoute.name) || '';

      var campRefs = highCamps.map(function (c) {
        return [num(c.altM), (c.name || '').replace(/\s*\([^)]*\)/, '').replace(/ Camp$/, '')];
      }).filter(function (r) { return r[0]; });
      // label only ~3 of them so the dashed lines don't crowd on the 8,000ers
      var lblEvery = Math.max(1, Math.ceil(campRefs.length / 3));
      var refs = campRefs.map(function (r, i) {
        return [r[0], r[1], i === 0 || i === campRefs.length - 1 || i % lblEvery === 0];
      });

      var verdict =
        'An expedition acclimatises by rotation, not by a steady climb. The team climbs to a camp, sleeps, drops back to Base Camp to recover, then repeats higher — the saw-tooth in this profile is deliberate, and it is what makes the summit possible. ' +
        'Plan on roughly ' + esc(String(totalDays).replace(/\s*\(.*\)$/, '')) + ' from ' + city + ', with Base Camp at ~' + fmt(bc) + ' m and' +
        (topCamp ? ' a top camp near ' + fmt(topCamp) + ' m before' : '') + ' the ' + fmt(summit) + ' m summit. ' +
        'Altitude illness is the dominant hazard the whole way up — the rotations, the rest days and the descent plan are the defence.';

      return {
        kind: 'peak', name: raw.name, href: (norm && norm.href) || ('/expeditions/' + (raw.slug || '')),
        linkLabel: 'Full ' + raw.name + ' expedition',
        points: points,
        xTitle: 'expedition day →', ariaKind: 'Rotation / acclimatisation profile',
        refs: refs,
        stats: [
          ['Base Camp', fmt(bc) + ' m'],
          ['Top camp', topCamp ? fmt(topCamp) + ' m' : '—'],
          ['Summit', fmt(summit) + ' m'],
          ['Base Camp → summit', '+' + fmt(summit - bc) + ' m'],
          ['Expedition length', esc(String(totalDays).replace(/\s*\(.*\)$/, ''))],
          ['Camps on the route', String(highCamps.length)],
          ['Season', seasonTxt ? esc(seasonTxt) : '—'],
          ['Grade', grade ? esc(grade) : (routeName ? esc(routeName) : '—')]
        ],
        verdictTone: 'info', verdictText: verdict, verdictKicker: 'How an expedition acclimatises',
        defaultIdx: (function () { var f = points.findIndex(function (p) { return p.rot; }); return f === -1 ? Math.max(0, points.length - 2) : f; })(),
        legend: 'peak'
      };
    }

    /* -------- SHARED CHART RENDERER ----------------------------------- */
    var W = 1000, H = 440, PL = 62, PR = 22, PT = 30, PB = 44;
    var plotW = W - PL - PR, plotH = H - PT - PB;
    function niceCeil(v) { return Math.ceil(v / 500) * 500; }
    function niceFloor(v) { return Math.max(0, Math.floor(v / 500) * 500); }

    var current = null, selectedIdx = null;

    var LEGENDS = {
      trek: [
        ['background:var(--accent)', 'Sleeping altitude'],
        ['border:2px solid var(--muted-foreground);border-radius:50%', 'Rest day'],
        ['background:#f59e0b;border-radius:50%', 'Over the 500 m guide'],
        ['background:#ef4444;border-radius:50%', 'Big gain, no rest day after'],
        ['width:14px;border-top:1px dashed var(--accent)', 'Day high point']
      ],
      peak: [
        ['background:var(--accent)', 'Working altitude'],
        ['border:2px solid var(--muted-foreground);border-radius:50%', 'Recovery at Base Camp'],
        ['background:#ef4444;border-radius:50%', 'Summit push'],
        ['width:14px;border-top:1px dashed var(--accent)', 'Camp altitude']
      ]
    };
    function renderLegend(kind) {
      if (!legendEl) return;
      legendEl.innerHTML = (LEGENDS[kind] || []).map(function (l) {
        return '<span><i style="' + l[0] + '"></i>' + l[1] + '</span>';
      }).join('');
    }

    function render(m) {
      current = m;
      var pts = m.points, n = pts.length;
      var xMin = pts[0].x, xMax = pts[n - 1].x || 1;
      var alts = pts.map(function (p) { return p.alt; });
      m.refs.forEach(function (r) { alts.push(r[0]); });
      var yTop = niceCeil(Math.max.apply(null, alts) + 150);
      var yBot = niceFloor(Math.min.apply(null, alts) - 250);
      if (yTop - yBot < 1500) yBot = Math.max(0, yTop - 1500);

      var X = function (x) { return PL + (xMax === xMin ? plotW / 2 : (x - xMin) / (xMax - xMin) * plotW); };
      var Y = function (v) { return PT + plotH - ((v - yBot) / (yTop - yBot)) * plotH; };
      pts.forEach(function (p) { p._px = X(p.x); p._py = Y(p.alt); });

      var step = (yTop - yBot) > 4500 ? 1000 : 500;
      var grid = '';
      for (var g = yBot; g <= yTop + 1; g += step) {
        var gy = Y(g);
        grid += '<line class="ap-grid" x1="' + PL + '" y1="' + gy + '" x2="' + (W - PR) + '" y2="' + gy + '"/>' +
          '<text class="ap-ylab" x="' + (PL - 10) + '" y="' + (gy + 3.5) + '" text-anchor="end">' + fmt(g) + '</text>';
      }

      var refs = m.refs.map(function (r) {
        if (r[0] <= yBot + 120 || r[0] >= yTop - 40) return '';
        var ry = Y(r[0]);
        var lbl = (r.length < 3 || r[2])
          ? '<text class="ap-reflab" x="' + (W - PR) + '" y="' + (ry - 6) + '" text-anchor="end">' + esc(r[1]) + ' · ' + fmt(r[0]) + ' m</text>'
          : '';
        return '<line class="ap-ref" x1="' + PL + '" y1="' + ry + '" x2="' + (W - PR) + '" y2="' + ry + '"/>' + lbl;
      }).join('');

      var line = pts.map(function (p, i) { return (i ? 'L' : 'M') + p._px.toFixed(1) + ' ' + p._py.toFixed(1); }).join(' ');
      var area = 'M' + pts[0]._px.toFixed(1) + ' ' + Y(yBot).toFixed(1) + ' ' +
        pts.map(function (p) { return 'L' + p._px.toFixed(1) + ' ' + p._py.toFixed(1); }).join(' ') +
        ' L' + pts[n - 1]._px.toFixed(1) + ' ' + Y(yBot).toFixed(1) + ' Z';

      var ticks = pts.map(function (p) {
        if (!p.high) return '';
        return '<line class="ap-hitick" x1="' + p._px + '" y1="' + p._py + '" x2="' + p._px + '" y2="' + Y(p.high) + '"/>' +
          '<circle class="ap-hidot" cx="' + p._px + '" cy="' + Y(p.high) + '" r="2.4"/>';
      }).join('');

      var thin = n > 15 ? Math.ceil(n / 12) : 1;
      var xlab = pts.map(function (p, i) {
        if (i % thin !== 0 && i !== n - 1) return '';
        return '<text class="ap-xlab" x="' + p._px + '" y="' + (H - PB + 20) + '" text-anchor="middle">' + esc(p.xLabel) + '</text>';
      }).join('');

      var nodes = pts.map(function (p, i) {
        var big = /is-crit|is-warn|is-summit/.test(p.nodeCls);
        return '<circle class="ap-node' + p.nodeCls + '" data-i="' + i + '" cx="' + p._px + '" cy="' + p._py + '" r="' + (big ? 6 : 4.5) + '"/>';
      }).join('');

      chartEl.innerHTML =
        '<svg viewBox="0 0 ' + W + ' ' + H + '" class="ap-svg" role="img" aria-label="' + esc(m.ariaKind + ' for ' + m.name) + '" tabindex="0">' +
        '<defs><linearGradient id="apFill" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" class="ap-fill-top"/><stop offset="100%" class="ap-fill-bot"/></linearGradient></defs>' +
        grid + refs +
        '<path class="ap-area" d="' + area + '" fill="url(#apFill)"/>' + ticks +
        '<path class="ap-line" d="' + line + '"/>' +
        '<line class="ap-cursor" x1="0" y1="' + PT + '" x2="0" y2="' + (PT + plotH) + '" style="opacity:0"/>' +
        nodes + xlab +
        '<text class="ap-axis-title" x="' + (PL - 46) + '" y="' + (PT - 12) + '">metres</text>' +
        '<text class="ap-axis-title" x="' + (W - PR) + '" y="' + (H - 6) + '" text-anchor="end">' + esc(m.xTitle) + '</text>' +
        '<rect class="ap-capture" x="' + PL + '" y="' + PT + '" width="' + plotW + '" height="' + plotH + '" fill="transparent"/>' +
        '</svg><div class="ap-tip" id="ap-tip" hidden></div>';

      var svgEl = chartEl.querySelector('svg');
      var pathEl = chartEl.querySelector('.ap-line');
      var cursor = chartEl.querySelector('.ap-cursor');
      var tip = $('ap-tip');

      if (!RM && pathEl.getTotalLength) {
        var L = pathEl.getTotalLength();
        pathEl.style.strokeDasharray = L;
        pathEl.style.strokeDashoffset = L;
        pathEl.getBoundingClientRect();
        pathEl.style.transition = 'stroke-dashoffset 1100ms cubic-bezier(.22,.61,.36,1)';
        pathEl.style.strokeDashoffset = '0';
        chartEl.querySelectorAll('.ap-node').forEach(function (nd, i) {
          nd.style.opacity = 0;
          nd.style.transition = 'opacity 260ms ease ' + (240 + i * 34) + 'ms';
          requestAnimationFrame(function () { nd.style.opacity = 1; });
        });
      }

      function pick(clientX) {
        var r = svgEl.getBoundingClientRect();
        var relX = (clientX - r.left) / r.width * W;
        var best = 0, bd = 1e9;
        pts.forEach(function (p, i) { var d = Math.abs(p._px - relX); if (d < bd) { bd = d; best = i; } });
        return best;
      }
      function highlight(i) {
        chartEl.querySelectorAll('.ap-node').forEach(function (nd) { nd.classList.toggle('is-active', +nd.dataset.i === i); });
      }
      function showTip(i, clientX) {
        var p = pts[i], r = svgEl.getBoundingClientRect();
        var cx = clientX != null ? clientX : (r.left + p._px / W * r.width);
        var cy = r.top + p._py / H * r.height;
        cursor.setAttribute('x1', p._px); cursor.setAttribute('x2', p._px);
        cursor.style.opacity = 1;
        tip.innerHTML = '<span class="ap-tip-day">' + p.tipTop + '</span>' +
          '<span class="ap-tip-alt">' + p.tipAlt + '</span>' + p.tipSub;
        tip.hidden = false;
        var hb = chartEl.getBoundingClientRect();
        var left = cx - hb.left - tip.offsetWidth / 2;
        left = Math.max(4, Math.min(hb.width - tip.offsetWidth - 4, left));
        tip.style.left = left + 'px';
        tip.style.top = (cy - hb.top - tip.offsetHeight - 14) + 'px';
        highlight(i); setDetail(i);
      }
      function hideTip() {
        tip.hidden = true; cursor.style.opacity = 0;
        if (selectedIdx != null) { highlight(selectedIdx); setDetail(selectedIdx); } else highlight(-1);
      }

      var cap = chartEl.querySelector('.ap-capture');
      cap.addEventListener('mousemove', function (e) { showTip(pick(e.clientX), e.clientX); });
      cap.addEventListener('mouseleave', hideTip);
      cap.addEventListener('click', function (e) {
        var i = pick(e.clientX);
        selectedIdx = (selectedIdx === i) ? null : i;
        if (selectedIdx == null) hideTip(); else showTip(i, e.clientX);
      });
      cap.addEventListener('touchstart', function (e) {
        if (!e.touches[0]) return;
        selectedIdx = pick(e.touches[0].clientX); showTip(selectedIdx, e.touches[0].clientX);
      }, { passive: true });
      cap.addEventListener('touchmove', function (e) {
        if (e.touches[0]) showTip(pick(e.touches[0].clientX), e.touches[0].clientX);
      }, { passive: true });
      svgEl.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        var i = selectedIdx == null ? 0 : selectedIdx + (e.key === 'ArrowRight' ? 1 : -1);
        selectedIdx = Math.max(0, Math.min(n - 1, i));
        showTip(selectedIdx);
      });

      renderLegend(m.legend);
      renderStats(m);
      renderVerdict(m);
      var d0 = selectedIdx != null ? selectedIdx : m.defaultIdx;
      setDetail(d0); highlight(selectedIdx == null ? d0 : selectedIdx);
    }

    function setDetail(i) {
      if (!detailEl || i == null || !current || !current.points[i]) return;
      var p = current.points[i];
      detailEl.innerHTML =
        '<div class="ap-detail-head"><span class="ap-detail-day">' + esc(p.detailKey) + '</span>' + (p.badge || '') + '</div>' +
        '<h4 class="ap-detail-title">' + esc(p.title) + '</h4>' +
        '<div class="ap-detail-row">' + (p.rowFacts || []).join('') + '</div>' +
        (p.note ? '<p class="ap-detail-tip">' + esc(p.note) + '</p>' : '');
    }

    function renderStats(m) {
      if (!statsEl) return;
      statsEl.innerHTML = m.stats.map(function (c) {
        return '<div class="ap-chip"><span class="ap-chip-k">' + esc(String(c[0])) + '</span><span class="ap-chip-v">' + c[1] + '</span></div>';
      }).join('');
    }

    function renderVerdict(m) {
      if (!verdictEl) return;
      verdictEl.className = 'ap-verdict is-' + m.verdictTone;
      verdictEl.innerHTML =
        '<span class="ap-verdict-k">' + esc(m.verdictKicker) + '</span><p>' + m.verdictText + '</p>' +
        '<a class="ap-verdict-link" href="' + esc(m.href) + '">' + esc(m.linkLabel) + ' →</a>';
    }

    /* -------- BUILD THE SELECT + WIRE UP ----------------------------- */
    var treks = Object.keys(TREKS).map(function (k) { return TREKS[k]; })
      .filter(function (t) {
        if (!t || !Array.isArray(t.itinerary) || t.itinerary.length < 3) return false;
        return Math.max.apply(null, t.itinerary.map(function (d) { return +d.endEle || 0; })) >= 3000;
      })
      .sort(function (a, b) { return String(a.name).localeCompare(String(b.name)); });

    function peakEntry(slug) {
      var raw = MOUNTAINS[slug] || PEAKS_DATA[slug];
      if (!raw) return null;
      var hasProfile = (Array.isArray(raw.camps) && raw.camps.length >= 2) ||
        (Array.isArray(raw.itinerary) && raw.itinerary.length && raw.itinerary[0] && raw.itinerary[0].altM != null);
      if (!hasProfile) return null;
      var norm = getPeak ? getPeak(slug) : null;
      var elev = num(raw.elevationM) || (norm && num(norm.elevation)) || 0;
      var band = elev >= 8000 ? '8000' : elev >= 7000 ? '7000' : elev >= 6000 ? '6000' : 'other';
      return { slug: slug, name: raw.name, kind: 'peak', band: band, elev: elev, raw: raw, norm: norm };
    }
    var peaks = Object.keys(MOUNTAINS).concat(Object.keys(PEAKS_DATA))
      .filter(function (s, i, a) { return a.indexOf(s) === i; })
      .map(peakEntry).filter(Boolean)
      .sort(function (a, b) { return b.elev - a.elev; });

    if (!treks.length && !peaks.length) { host.style.display = 'none'; return; }

    var REG = {};
    var groups = [];
    if (treks.length) {
      groups.push({ label: 'Trekking routes', opts: treks.map(function (t) {
        REG[t.slug] = { kind: 'trek', trek: t };
        return { slug: t.slug, label: t.name + '  ·  ' + ((t.stats && t.stats.maxAltitude) || '') };
      }) });
    }
    [['8000', '8,000 m peaks'], ['7000', '7,000 m peaks'], ['6000', '6,000 m peaks'], ['other', 'Other peaks']].forEach(function (b) {
      var inBand = peaks.filter(function (p) { return p.band === b[0]; });
      if (!inBand.length) return;
      groups.push({ label: b[1], opts: inBand.map(function (p) {
        REG[p.slug] = { kind: 'peak', raw: p.raw, norm: p.norm };
        return { slug: p.slug, label: p.name + '  ·  ' + fmt(p.elev) + ' m' };
      }) });
    });

    selEl.innerHTML = groups.map(function (g) {
      return '<optgroup label="' + esc(g.label) + '">' +
        g.opts.map(function (o) { return '<option value="' + esc(o.slug) + '">' + esc(o.label) + '</option>'; }).join('') +
        '</optgroup>';
    }).join('');

    var saved = null;
    try { saved = localStorage.getItem(STORE); } catch (e) {}
    var startSlug = (saved && REG[saved]) ? saved
      : (REG['everest-base-camp'] ? 'everest-base-camp' : Object.keys(REG)[0]);
    selEl.value = startSlug;

    function load(slug) {
      var e = REG[slug];
      if (!e) return;
      selectedIdx = null;
      render(e.kind === 'trek' ? buildTrek(e.trek) : buildPeak(e.raw, e.norm));
      try { localStorage.setItem(STORE, slug); } catch (x) {}
    }
    selEl.addEventListener('change', function () { load(selEl.value); });
    load(startSlug);
  })();

  /* ========================================================================
     2 — AMS RISK PROFILE
     ===================================================================== */
  (function amsRisk() {
    var host = $('ams-risk');
    if (!host) return;
    var out = $('risk-out');
    var ids = ['risk-history', 'risk-max', 'risk-ascent', 'risk-diamox'];
    var fields = ids.map($);
    if (fields.some(function (f) { return !f; }) || !out) return;

    var BANDS = {
      low: {
        label: 'Lower risk',
        blurb: 'A standard acclimatisation schedule is appropriate for this profile. Follow the ~500 m rule, take the built-in rest days, hydrate, and still learn the AMS symptoms — lower risk is not no risk, and altitude illness can affect anyone.',
        steps: [
          'Keep overnight altitude gains near 500 m once above 3,000 m.',
          'Do the "climb high, sleep low" acclimatisation walks on rest days.',
          'Report any headache, nausea or poor sleep to your guide early.'
        ]
      },
      mod: {
        label: 'Moderate risk',
        blurb: 'Build extra caution into your plan. Choose the most gradual itinerary available and do not compress it. Ask a travel-medicine doctor about acetazolamide (Diamox) as a preventive before you travel, and know the AMS symptoms cold.',
        steps: [
          'Favour a longer itinerary with more rest days over a fast one.',
          'Discuss acetazolamide prophylaxis with a doctor before departure — dose and suitability are a medical decision.',
          'Never ascend to a new sleeping altitude with unresolved AMS symptoms.',
          'Use the Lake Louise self-check below every evening at altitude.'
        ]
      },
      high: {
        label: 'Higher risk',
        blurb: 'Strongly consider a travel-medicine or high-altitude consultation before you book. High-risk profiles usually warrant preventive medication and a deliberately conservative itinerary with additional acclimatisation days. A prior HAPE or HACE episode needs a specific medical plan of its own.',
        steps: [
          'Get a travel-medicine consultation before confirming the trip.',
          'Plan additional acclimatisation days beyond the standard itinerary.',
          'Carry a clear descent-and-evacuation plan and insurance that explicitly covers helicopter rescue at your route’s altitude.',
          'A previous HAPE/HACE history means preventive medication and a doctor-agreed plan are essential, not optional.'
        ]
      }
    };

    function score() {
      var v = fields.map(function (f) { return parseInt(f.value, 10) || 0; });
      var history = v[0];
      var total = v[0] + v[1] + v[2] + v[3];
      var band = 'low';
      if (history >= 4) band = 'high';
      else if (total >= 3) band = 'high';
      else if (total >= 1) band = 'mod';
      return { band: band, total: total };
    }

    function paint() {
      var r = score();
      var b = BANDS[r.band === 'mod' ? 'mod' : r.band];
      out.hidden = false;
      out.className = 'risk-out is-' + r.band;
      out.innerHTML =
        '<div class="risk-meter" data-band="' + r.band + '">' +
        '<span class="risk-seg is-low">Lower</span>' +
        '<span class="risk-seg is-mod">Moderate</span>' +
        '<span class="risk-seg is-high">Higher</span>' +
        '<span class="risk-needle"></span>' +
        '</div>' +
        '<div class="risk-headline"><span class="risk-dot"></span>' + b.label + '</div>' +
        '<p class="risk-blurb">' + b.blurb + '</p>' +
        '<ul class="risk-steps">' + b.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>' +
        '<p class="risk-disc">A planning aid based on Wilderness Medical Society risk categories — not a medical assessment, and it does not see your full history. Talk to a travel-medicine or high-altitude doctor before you travel, especially with any heart, lung or blood condition, in pregnancy, or on regular medication.</p>';
      var needle = out.querySelector('.risk-needle');
      var pos = r.band === 'low' ? 16.6 : r.band === 'mod' ? 50 : 83.3;
      requestAnimationFrame(function () { needle.style.left = pos + '%'; });
    }

    fields.forEach(function (f) { f.addEventListener('change', paint); });
    paint();
  })();

})();
