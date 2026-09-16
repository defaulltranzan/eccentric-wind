/* Himalayan Magic Adventure — admin dashboard (no build step, no framework). */
(function () {
  'use strict';

  var A = window.HMA_ADMIN;
  var app = document.getElementById('app');
  var state = { me: null, system: {}, dirty: false, editor: null, suppressHash: false, newBookings: 0 };

  /* ------------------------------------------------------------ helpers */
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function safeUrl(u) {
    u = String(u || '').trim();
    return /^(https?:\/\/|\/(?!\/))/i.test(u) ? u : '';
  }
  function $(sel, el) { return (el || document).querySelector(sel); }
  function $all(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }
  function slugify(s) {
    return String(s || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
  }
  function fmtDate(iso, withTime) {
    if (!iso) return '—';
    var d = new Date(iso.length === 10 ? iso + 'T00:00:00' : iso);
    if (isNaN(d)) return esc(iso);
    var opts = { day: 'numeric', month: 'short', year: 'numeric' };
    if (withTime) { opts.hour = '2-digit'; opts.minute = '2-digit'; }
    return d.toLocaleString('en-GB', opts);
  }
  function toast(msg, isError) {
    var t = document.createElement('div');
    t.className = 'toast' + (isError ? ' error' : '');
    t.textContent = msg;
    $('#toasts').appendChild(t);
    setTimeout(function () { t.remove(); }, isError ? 7000 : 3500);
  }

  function api(method, url, body, opts) {
    opts = opts || {};
    var headers = { 'X-HMA-Admin': '1' };
    var payload;
    if (opts.raw) { payload = body; Object.assign(headers, opts.headers || {}); }
    else if (body !== undefined) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }
    return fetch(url, { method: method, headers: headers, body: payload, credentials: 'same-origin' }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (json) {
        if (res.status === 401 && url.indexOf('/api/admin/login') < 0 && url.indexOf('/api/admin/me') < 0) {
          state.dirty = false;
          renderLogin('Your session expired — please sign in again.');
          throw new Error('Signed out');
        }
        if (!res.ok || json.status === 'error') {
          var e = new Error(json.message || ('Request failed (' + res.status + ')'));
          e.status = res.status;
          e.body = json;
          throw e;
        }
        return json;
      });
    });
  }

  /* path helpers: "stats.duration", "itinerary.3.title" */
  function getPath(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }
  function setPath(obj, path, value) {
    var keys = path.split('.');
    var o = obj;
    for (var i = 0; i < keys.length - 1; i++) {
      var k = keys[i];
      if (o[k] == null || typeof o[k] !== 'object') o[k] = /^\d+$/.test(keys[i + 1]) ? [] : {};
      o = o[k];
    }
    var last = keys[keys.length - 1];
    if (value === undefined) {
      if (Array.isArray(o)) o[+last] = null; else delete o[last];
    } else {
      o[last] = value;
    }
  }

  /* ------------------------------------------------------------ boot */
  function boot() {
    fetch('/api/admin/me', { credentials: 'same-origin' }).then(function (r) {
      return r.json().then(function (j) { return { ok: r.ok, j: j }; });
    }).then(function (res) {
      if (!res.ok) return renderLogin(res.j && res.j.configured === false
        ? 'Admin sign-in is not configured on this server yet. Set ADMIN_EMAIL, ADMIN_PASSWORD_HASH and SESSION_SECRET (see .env.example).' : '');
      state.me = res.j.session;
      state.system = res.j.system || {};
      route();
      startPulse();
    }).catch(function () {
      app.innerHTML = '<div class="boot">Could not reach the server.</div>';
    });
  }

  /* New-booking badge stays current while the admin is open (every 45 s, only when the tab is visible). */
  var pulseTimer = null;
  function setBadge(n) {
    state.newBookings = n;
    var link = document.querySelector('.nav a[href="#/bookings"]');
    if (!link) return;
    var badge = link.querySelector('.count');
    if (!n) { if (badge) badge.remove(); return; }
    if (!badge) { badge = document.createElement('span'); badge.className = 'count hot'; badge.title = 'New bookings'; link.appendChild(badge); }
    badge.textContent = n;
  }
  function pulse() {
    if (!state.me || document.hidden) return;
    fetch('/api/admin/pulse', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (res) {
      if (!res) return;
      if (res.newBookings > state.newBookings && res.latest) toast('New booking from ' + res.latest.name + ' (' + res.latest.ref + ')');
      setBadge(res.newBookings);
    }).catch(function () {});
  }
  function startPulse() {
    if (pulseTimer) return;
    pulse();
    pulseTimer = setInterval(pulse, 45000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) pulse(); });
  }

  window.addEventListener('hashchange', function () {
    if (state.suppressHash) { state.suppressHash = false; return; }
    if (state.dirty && !confirm('You have unsaved changes. Leave without saving?')) {
      state.suppressHash = true;
      history.back();
      return;
    }
    state.dirty = false;
    route();
  });
  window.addEventListener('beforeunload', function (e) {
    if (state.dirty) { e.preventDefault(); e.returnValue = ''; }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && state.editor) {
      e.preventDefault();
      saveEditor();
    }
  });

  /* ------------------------------------------------------------ login */
  function renderLogin(message) {
    state.me = null;
    document.title = 'Sign in — Himalayan Magic Adventure';
    app.innerHTML =
      '<main class="login">' +
        '<section class="login-visual" aria-hidden="true">' +
          '<div class="login-visual-copy"><span class="mono">27°59\'N · 86°55\'E — Kathmandu desk</span>' +
          '<p class="login-quote">The High Corridors of Nepal,<br><em>managed from one place.</em></p></div>' +
        '</section>' +
        '<div class="login-card">' +
        '<img src="/images/logo-badge-dark.png" alt="">' +
        '<span class="mono" style="color:var(--accent)">Himalayan Magic Adventure</span>' +
        '<h1>Admin sign in</h1>' +
        '<form id="login-form" novalidate>' +
          '<div class="field"><label for="lg-email">Email</label><input id="lg-email" type="email" autocomplete="username" required></div>' +
          '<div class="field"><label for="lg-pass">Password</label><input id="lg-pass" type="password" autocomplete="current-password" required></div>' +
          '<p class="login-msg" id="lg-msg" role="alert">' + esc(message || '') + '</p>' +
          '<button class="btn primary" type="submit">Sign in</button>' +
        '</form>' +
        '<p class="login-foot mono">Est. 1993 · Kathmandu</p>' +
      '</div></main>';
    $('#lg-email').focus();
    $('#login-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = e.target.querySelector('button');
      btn.disabled = true;
      $('#lg-msg').textContent = '';
      api('POST', '/api/admin/login', { email: $('#lg-email').value, password: $('#lg-pass').value })
        .then(function () { boot(); })
        .catch(function (err) { $('#lg-msg').textContent = err.message; btn.disabled = false; });
    });
  }

  /* ------------------------------------------------------------ shell */
  function shell(active, inner) {
    var nav = [
      ['#/', 'Dashboard', 'dashboard'],
      ['#/treks', 'Treks', 'treks'],
      ['#/expeditions', 'Expeditions', 'expeditions'],
      ['#/stories', 'Stories', 'stories'],
      ['#/bookings', 'Bookings', 'bookings']
    ];
    var sys = state.system || {};
    var banner = sys.readOnly
      ? '<div class="banner warn">This deployment has no database configured, so changes and bookings cannot be saved. Add the Supabase variables in your hosting settings (see <b>.env.example</b>).</div>'
      : '';
    return '<div class="shell">' +
      '<aside class="side">' +
        '<a class="brand" href="#/"><img src="/images/logo-badge-dark.png" alt=""><div><b>Himalayan Magic</b><span>Admin</span></div></a>' +
        '<nav class="nav" aria-label="Admin">' + nav.map(function (n) {
          var count = n[2] === 'bookings' && state.newBookings ? '<span class="count hot" title="New bookings">' + state.newBookings + '</span>' : '';
          return '<a href="' + n[0] + '" class="' + (active === n[2] ? 'on' : '') + '"' + (active === n[2] ? ' aria-current="page"' : '') + '>' + n[1] + count + '</a>';
        }).join('') + '</nav>' +
        '<div class="side-foot">' +
          '<span class="who" title="' + esc(state.me && state.me.email) + '">' + esc(state.me && state.me.email) + '</span>' +
          '<a class="btn small ghost" href="/" target="_blank" rel="noopener">View site</a>' +
          '<button class="btn small ghost" id="logout" type="button">Sign out</button>' +
        '</div>' +
      '</aside>' +
      '<main class="main" id="main">' + banner + inner + '</main>' +
    '</div>';
  }

  function mount(active, inner) {
    state.editor = null;
    app.innerHTML = shell(active, inner);
    $('#logout').addEventListener('click', function () {
      if (state.dirty && !confirm('You have unsaved changes. Sign out anyway?')) return;
      state.dirty = false;
      api('POST', '/api/admin/logout', {}).then(function () { renderLogin('Signed out.'); });
    });
    window.scrollTo(0, 0);
  }

  function loading(active) { mount(active, '<div class="empty-state">Loading…</div>'); }

  function route() {
    if (!state.me) return;
    var parts = (location.hash.replace(/^#\/?/, '') || '').split('/').filter(Boolean).map(decodeURIComponent);
    var c = parts[0];
    if (!c) return viewDashboard();
    if (c === 'bookings') return viewBookings();
    if (A.collections[c]) {
      if (parts[1] === 'new') return viewEditor(c, null);
      if (parts[1] === 'edit' && parts[2]) return viewEditor(c, parts[2]);
      return viewList(c);
    }
    location.hash = '#/';
  }

  /* ------------------------------------------------------------ dashboard */
  function viewDashboard() {
    document.title = 'Dashboard — Admin';
    loading('dashboard');
    api('GET', '/api/admin/dashboard').then(function (res) {
      var c = res.content, b = res.bookings;
      state.newBookings = b.NEW || 0;
      var card = function (href, label, num, sub, hot) {
        return '<a class="card' + (hot ? ' hot' : '') + '" href="' + href + '"><span class="mono muted">' + label + '</span><div class="num">' + num + '</div><span class="muted">' + sub + '</span></a>';
      };
      var sys = state.system;
      var recent = b.recent.length ? '<div class="table-wrap"><table><thead><tr><th>Received</th><th>Name</th><th>Trip</th><th>Status</th></tr></thead><tbody>' +
        b.recent.map(function (r) {
          return '<tr><td class="muted">' + fmtDate(r.created_at, true) + '</td><td>' + esc(r.name) + '</td><td>' + esc(r.trip_name) + '</td><td><span class="pill st-' + esc(r.status) + '">' + esc(r.status) + '</span></td></tr>';
        }).join('') + '</tbody></table></div>' : '<div class="empty-state">No bookings yet. They appear here the moment someone submits the booking form.</div>';

      mount('dashboard',
        '<section class="dash-hero">' +
          '<div><span class="kicker mono">' + greeting() + '</span><h1>Base camp</h1>' +
          '<p class="muted">' + (b.NEW ? '<b class="hot-text">' + b.NEW + ' new booking' + (b.NEW === 1 ? '' : 's') + '</b> waiting for a reply.' : 'No new bookings waiting. Everything is answered.') + '</p></div>' +
          '<div class="actions"><a class="btn" href="#/treks/new">+ Trek</a><a class="btn" href="#/expeditions/new">+ Expedition</a><a class="btn" href="#/stories/new">+ Story</a>' +
          (b.NEW ? '<a class="btn primary" href="#/bookings">Open bookings</a>' : '') + '</div>' +
        '</section>' +
        '<div class="cards">' +
          card('#/bookings', 'New bookings', b.NEW || 0, (b.total || 0) + ' total', (b.NEW || 0) > 0) +
          card('#/treks', 'Treks', c.treks.published, (c.treks.total - c.treks.published) + ' drafts') +
          card('#/expeditions', 'Expeditions', c.expeditions.published, (c.expeditions.total - c.expeditions.published) + ' drafts') +
          card('#/stories', 'Published stories', c.stories.published, (c.stories.total - c.stories.published) + ' drafts') +
        '</div>' +
        '<div class="grid-2">' +
          '<section class="panel"><div class="panel-head"><h2>Latest bookings</h2><a class="btn small" href="#/bookings">All bookings</a></div>' + recent + '</section>' +
          '<section class="panel"><div class="panel-head"><h2>System</h2></div><div class="panel-body"><dl class="kv">' +
            '<dt>Storage</dt><dd>' + (sys.storage === 'supabase' ? 'Supabase database' : 'Local files (data/)') + '</dd>' +
            '<dt>Saving</dt><dd>' + (sys.readOnly ? '<span style="color:var(--warn)">Read-only on this deployment</span>' : 'Enabled') + '</dd>' +
            '<dt>Booking emails</dt><dd>' + (sys.email ? 'On' : '<span class="muted">Off — set SMTP variables to get an email for each booking</span>') + '</dd>' +
          '</dl></div></section>' +
        '</div>');
    }).catch(showError('dashboard'));
  }

  function greeting() {
    var h = new Date().getHours();
    return (h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening') + ' · ' +
      new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  function showError(active) {
    return function (err) {
      if (err.message === 'Signed out') return;
      mount(active, '<div class="banner warn">' + esc(err.message) + '</div><button class="btn" onclick="location.reload()">Retry</button>');
    };
  }

  /* ------------------------------------------------------------ lists */
  function viewList(collection) {
    var cfg = A.collections[collection];
    document.title = cfg.label + ' — Admin';
    loading(collection);
    api('GET', '/api/admin/' + collection).then(function (res) {
      var items = res.items;
      mount(collection,
        '<div class="page-head"><div><span class="kicker mono">Content</span><h1>' + cfg.label + '</h1></div>' +
          '<div class="actions"><a class="btn primary" href="#/' + collection + '/new">+ New ' + cfg.singular.toLowerCase() + '</a></div></div>' +
        '<section class="panel">' +
          '<div class="toolbar">' +
            '<input class="input" type="search" id="ls-q" placeholder="Search ' + cfg.label.toLowerCase() + '…" aria-label="Search">' +
            '<select class="input" id="ls-status" aria-label="Filter by status"><option value="">All</option><option value="pub">Published</option><option value="draft">Drafts</option></select>' +
            (collection === 'expeditions' ? '<select class="input" id="ls-kind" aria-label="Filter by type"><option value="">All mountains</option><option value="eight-thousander">Eight-thousanders</option><option value="peak">Other peaks</option></select>' : '') +
            '<span class="muted" id="ls-count" style="margin-left:auto"></span>' +
          '</div>' +
          '<div class="table-wrap"><table><thead><tr><th></th><th>Title</th><th class="hide-sm">Slug</th><th>Live</th><th class="hide-sm">Updated</th><th></th></tr></thead><tbody id="ls-body"></tbody></table></div>' +
        '</section>');

      function draw() {
        var q = $('#ls-q').value.trim().toLowerCase();
        var st = $('#ls-status').value;
        var kind = $('#ls-kind') ? $('#ls-kind').value : '';
        var shown = items.filter(function (it) {
          if (st === 'pub' && !it.published) return false;
          if (st === 'draft' && it.published) return false;
          if (kind && it.kind !== kind) return false;
          return !q || (it.title + ' ' + it.slug + ' ' + (it.subtitle || '')).toLowerCase().indexOf(q) > -1;
        });
        $('#ls-count').textContent = shown.length + ' of ' + items.length;
        var reorderable = !q && !st && !kind;
        $('#ls-body').innerHTML = shown.length ? shown.map(function (it, i) {
          var img = safeUrl(it.image);
          return '<tr data-slug="' + esc(it.slug) + '">' +
            '<td>' + (img ? '<img class="thumb" loading="lazy" src="' + esc(img) + '" alt="" onerror="this.replaceWith(Object.assign(document.createElement(\'div\'),{className:\'thumb empty\',textContent:\'—\'}))">' : '<div class="thumb empty">No image</div>') + '</td>' +
            '<td class="title-cell"><a href="#/' + collection + '/edit/' + encodeURIComponent(it.slug) + '">' + esc(it.title) + '</a>' +
              '<small>' + esc(it.subtitle || '') + (it.featured ? ' · ★ featured' : '') + (it.kind === 'eight-thousander' ? ' · 8,000 m' : '') + '</small></td>' +
            '<td class="hide-sm"><span class="slug">' + esc(it.slug) + '</span></td>' +
            '<td><label class="switch" title="' + (it.published ? 'Published — click to hide' : 'Draft — click to publish') + '"><input type="checkbox" data-act="publish"' + (it.published ? ' checked' : '') + ' aria-label="Published"><span></span></label></td>' +
            '<td class="hide-sm muted">' + fmtDate(it.updated_at) + '</td>' +
            '<td><div class="row-actions">' +
              (reorderable ? '<button class="btn small icon-btn" data-act="up" title="Move up" aria-label="Move up"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
                '<button class="btn small icon-btn" data-act="down" title="Move down" aria-label="Move down"' + (i === shown.length - 1 ? ' disabled' : '') + '>↓</button>' : '') +
              '<a class="btn small" href="' + esc(cfg.schema.publicPath(it.slug)) + '" target="_blank" rel="noopener">View</a>' +
              '<a class="btn small" href="#/' + collection + '/edit/' + encodeURIComponent(it.slug) + '">Edit</a>' +
              '<button class="btn small danger" data-act="delete">Delete</button>' +
            '</div></td></tr>';
        }).join('') : '<tr><td colspan="6"><div class="empty-state">Nothing matches.</div></td></tr>';
      }
      draw();
      $('#ls-q').addEventListener('input', draw);
      $('#ls-status').addEventListener('change', draw);
      if ($('#ls-kind')) $('#ls-kind').addEventListener('change', draw);

      $('#ls-body').addEventListener('change', function (e) {
        if (e.target.dataset.act !== 'publish') return;
        var tr = e.target.closest('tr'), slug = tr.dataset.slug, on = e.target.checked;
        e.target.disabled = true;
        api('PATCH', '/api/admin/' + collection + '/' + encodeURIComponent(slug) + '/publish', { published: on }).then(function () {
          items.forEach(function (it) { if (it.slug === slug) it.published = on; });
          toast(on ? 'Published — now live on the site.' : 'Unpublished — hidden from the site.');
        }).catch(function (err) { e.target.checked = !on; toast(err.message, true); })
          .then(function () { e.target.disabled = false; });
      });
      $('#ls-body').addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-act]');
        if (!btn) return;
        var slug = btn.closest('tr').dataset.slug;
        var item = items.filter(function (it) { return it.slug === slug; })[0];
        if (btn.dataset.act === 'delete') {
          if (!confirm('Delete "' + item.title + '" permanently?\n\nTip: unpublish instead if you might want it back.')) return;
          btn.disabled = true;
          api('DELETE', '/api/admin/' + collection + '/' + encodeURIComponent(slug)).then(function () {
            items = items.filter(function (it) { return it.slug !== slug; });
            draw();
            toast('Deleted.');
          }).catch(function (err) { btn.disabled = false; toast(err.message, true); });
        } else if (btn.dataset.act === 'up' || btn.dataset.act === 'down') {
          btn.disabled = true;
          api('POST', '/api/admin/' + collection + '/' + encodeURIComponent(slug) + '/move', { direction: btn.dataset.act }).then(function () {
            var i = items.indexOf(item), j = btn.dataset.act === 'up' ? i - 1 : i + 1;
            if (j >= 0 && j < items.length) { items[i] = items[j]; items[j] = item; }
            draw();
          }).catch(function (err) { btn.disabled = false; toast(err.message, true); });
        }
      });
    }).catch(showError(collection));
  }

  /* ------------------------------------------------------------ editor */
  function viewEditor(collection, slug) {
    var cfg = A.collections[collection];
    var isNew = !slug;
    loading(collection);
    var load = isNew
      ? Promise.resolve({ item: null })
      : api('GET', '/api/admin/' + collection + '/' + encodeURIComponent(slug));
    load.then(function (res) {
      var kind = res.item ? res.item.kind : (collection === 'expeditions' ? 'peak' : null);
      var ed = {
        collection: collection,
        cfg: cfg,
        schema: cfg.schema,
        slug: res.item ? res.item.slug : null,
        isNew: isNew,
        kind: kind,
        published: res.item ? !!res.item.published : false,
        updatedAt: res.item ? res.item.updated_at : null,
        model: res.item ? clone(res.item.data) : cfg.schema.template(kind),
        invalid: {},
        slugTouched: !isNew,
        tab: 'form'
      };
      renderEditor(ed);
    }).catch(showError(collection));
  }

  function renderEditor(ed) {
    var title = ed.model[ed.schema.titleKey] || (ed.isNew ? 'New ' + ed.cfg.singular.toLowerCase() : ed.slug);
    document.title = title + ' — Admin';
    mount(ed.collection,
      '<div class="editor-bar">' +
        '<div style="min-width:0"><a class="crumb mono" href="#/' + ed.collection + '">← ' + ed.cfg.label + '</a>' +
          '<h1 id="ed-title">' + esc(title) + '<span class="dirty-dot" id="ed-dirty" hidden title="Unsaved changes"></span></h1></div>' +
        '<div class="actions">' +
          '<label class="check" title="Published entries are visible on the website"><span class="switch"><input type="checkbox" id="ed-pub"' + (ed.published ? ' checked' : '') + '><span></span></span><span class="mono" id="ed-pub-label">' + (ed.published ? 'Published' : 'Draft') + '</span></label>' +
          (ed.isNew ? '' : '<a class="btn" target="_blank" rel="noopener" id="ed-view" href="' + esc(ed.schema.publicPath(ed.slug)) + '">Preview</a>') +
          (ed.isNew ? '' : '<button class="btn danger" type="button" id="ed-delete">Delete</button>') +
          '<button class="btn primary" type="button" id="ed-save">Save</button>' +
        '</div>' +
      '</div>' +
      (ed.collection === 'expeditions' && ed.isNew
        ? '<div class="panel" style="margin-bottom:1rem"><div class="fields"><div class="field w-half"><label for="ed-kind">Type of mountain</label><select id="ed-kind">' +
            ed.schema.kinds.map(function (k) { return '<option value="' + k[0] + '"' + (k[0] === ed.kind ? ' selected' : '') + '>' + esc(k[1]) + '</option>'; }).join('') +
          '</select><span class="help">Most new objectives are "Peak". The page layout adapts to the type.</span></div></div></div>'
        : '') +
      '<div class="tabs" role="tablist"><button role="tab" data-tab="form" aria-selected="' + (ed.tab === 'form') + '">Form</button><button role="tab" data-tab="json" aria-selected="' + (ed.tab === 'json') + '">Advanced JSON</button></div>' +
      '<div id="ed-body"></div>');

    state.editor = ed;
    var body = $('#ed-body');

    function markDirty() {
      state.dirty = true;
      $('#ed-dirty').hidden = false;
    }
    ed.markDirty = markDirty;

    function drawTab() {
      $all('.tabs button').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.tab === ed.tab)); });
      if (ed.tab === 'json') {
        body.innerHTML = '<p class="muted" style="margin-top:0">The complete record exactly as the website reads it. Fields not shown in the form can be edited here.</p>' +
          '<textarea class="json-editor" id="ed-json" spellcheck="false" aria-label="Record JSON">' + esc(JSON.stringify(ed.model, null, 2)) + '</textarea>' +
          '<p class="field"><span class="err" id="ed-json-err"></span></p>';
        $('#ed-json').addEventListener('input', function (e) {
          try {
            var parsed = JSON.parse(e.target.value);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('The record must be a JSON object.');
            ed.model = parsed;
            delete ed.invalid.__json;
            $('#ed-json-err').textContent = '';
          } catch (err) {
            ed.invalid.__json = 'Advanced JSON: ' + err.message;
            $('#ed-json-err').textContent = err.message;
          }
          markDirty();
        });
      } else {
        body.innerHTML = renderSections(ed);
        bindForm(ed, body);
      }
    }
    drawTab();

    $all('.tabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.tab === ed.tab) return;
        if (ed.invalid.__json && ed.tab === 'json') { toast('Fix the JSON error before switching back to the form.', true); return; }
        ed.tab = b.dataset.tab;
        drawTab();
      });
    });

    if ($('#ed-kind')) {
      $('#ed-kind').addEventListener('change', function (e) {
        var name = ed.model.name, s = ed.model.slug;
        ed.kind = e.target.value;
        ed.model = ed.schema.template(ed.kind);
        if (name) ed.model.name = name;
        if (s) ed.model.slug = s;
        drawTab();
      });
    }
    $('#ed-pub').addEventListener('change', function (e) {
      ed.published = e.target.checked;
      $('#ed-pub-label').textContent = ed.published ? 'Published' : 'Draft';
      markDirty();
    });
    $('#ed-save').addEventListener('click', saveEditor);
    if ($('#ed-delete')) {
      $('#ed-delete').addEventListener('click', function () {
        if (!confirm('Delete "' + (ed.model[ed.schema.titleKey] || ed.slug) + '" permanently? This cannot be undone.')) return;
        api('DELETE', '/api/admin/' + ed.collection + '/' + encodeURIComponent(ed.slug)).then(function () {
          state.dirty = false;
          toast('Deleted.');
          location.hash = '#/' + ed.collection;
        }).catch(function (err) { toast(err.message, true); });
      });
    }
  }

  function saveEditor(force) {
    var ed = state.editor;
    if (!ed) return;
    var btn = $('#ed-save');
    if (!btn || btn.disabled) return;
    var problems = Object.keys(ed.invalid).map(function (k) { return ed.invalid[k]; });
    if (problems.length) { toast('Fix before saving: ' + problems[0], true); return; }
    var titleValue = String(ed.model[ed.schema.titleKey] || '').trim();
    if (!titleValue) { toast('Give it a ' + (ed.schema.titleKey === 'title' ? 'headline' : 'name') + ' before saving.', true); return; }
    btn.disabled = true;
    btn.textContent = 'Saving…';
    var url = '/api/admin/' + ed.collection + (ed.isNew ? '' : '/' + encodeURIComponent(ed.slug));
    var body = { data: ed.model, published: ed.published, kind: ed.kind };
    if (!ed.isNew && !force) body.expectedUpdatedAt = ed.updatedAt;
    api(ed.isNew ? 'POST' : 'PUT', url, body).then(function (res) {
      var wasNew = ed.isNew;
      state.dirty = false;
      ed.isNew = false;
      ed.slug = res.item.slug;
      ed.kind = res.item.kind;
      ed.model = res.item.data;
      ed.updatedAt = res.item.updated_at;
      ed.published = !!res.item.published;
      toast(ed.published ? 'Saved — live on the website.' : 'Saved as draft (not visible on the website).');
      var target = '#/' + ed.collection + '/edit/' + encodeURIComponent(ed.slug);
      if (location.hash !== target) { state.suppressHash = true; location.hash = target; }
      if (wasNew) ed.tab = 'form';
      renderEditor(ed);
    }).catch(function (err) {
      btn.disabled = false;
      btn.textContent = 'Save';
      if (err.message === 'Signed out') return;
      if (err.body && err.body.code === 'STALE') {
        if (confirm('Someone saved this entry after you opened it.\n\nOK = overwrite their version with yours.\nCancel = keep editing (reload the page to see their changes).')) saveEditor(true);
        return;
      }
      var fields = err.body && err.body.issues;
      toast(fields && fields.length ? fields.join(' ') : err.message, true);
    });
  }

  /* ---------------- form rendering ---------------- */
  function resolvePath(field, kind) {
    return typeof field.path === 'string' ? field.path : field.path[kind];
  }
  function widthClass(f) {
    return f.half ? ' w-half' : f.third ? ' w-third' : f.twoThirds ? ' w-two-thirds' : f.quarter ? ' w-quarter' : '';
  }

  function renderSections(ed) {
    return ed.schema.sections.map(function (sec, si) {
      var fields = sec.fields.filter(function (f) { return !f.only || f.only === ed.kind; });
      if (!fields.length) return '';
      return '<details class="section panel"' + (sec.collapsed ? '' : ' open') + '>' +
        '<summary><h2>' + esc(sec.title) + '</h2></summary>' +
        (sec.note ? '<p class="section-note">' + esc(sec.note) + '</p>' : '') +
        '<div class="fields">' + fields.map(function (f) { return renderField(ed, f, ''); }).join('') + '</div>' +
      '</details>';
    }).join('') +
    (ed.collection === 'stories' ? '' : '');
  }

  function renderField(ed, f, base) {
    var rel = resolvePath(f, ed.kind);
    var path = base ? base + '.' + rel : rel;
    var v = getPath(ed.model, path);
    var id = 'f-' + path.replace(/[^a-z0-9]+/gi, '-');
    var label = '<label for="' + id + '">' + esc(f.label) + (f.required ? ' <span class="req">*</span>' : '') + '</label>';
    var help = f.help ? '<span class="help">' + esc(f.help) + '</span>' : '';
    var attrs = ' id="' + id + '" data-path="' + esc(path) + '" data-type="' + f.type + '"' + (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : '') + (f.maxlength ? ' maxlength="' + f.maxlength + '"' : '');
    var wrap = function (inner, extraClass) {
      return '<div class="field' + widthClass(f) + (extraClass || '') + '">' + inner + '</div>';
    };

    switch (f.type) {
      case 'text':
      case 'slug':
        return wrap(label + '<input type="text"' + attrs + (f.list ? ' list="' + id + '-list"' : '') + ' value="' + esc(v) + '">' +
          (f.list ? '<datalist id="' + id + '-list">' + f.list.map(function (o) { return '<option value="' + esc(o) + '">'; }).join('') + '</datalist>' : '') + help);
      case 'number':
        return wrap(label + '<input type="number"' + attrs + ' step="' + (f.step || '1') + '" value="' + (typeof v === 'number' ? v : '') + '">' + help);
      case 'date':
        return wrap(label + '<input type="date"' + attrs + ' value="' + esc(v || '') + '">' + help);
      case 'textarea':
        return wrap(label + '<textarea rows="' + (f.rows || 3) + '"' + attrs + '>' + esc(v || '') + '</textarea>' + help);
      case 'select':
        return wrap(label + '<select' + attrs + '>' + f.options.map(function (o) {
          return '<option value="' + esc(o[0]) + '"' + (String(v == null ? '' : v) === String(o[0]) ? ' selected' : '') + '>' + esc(o[1]) + '</option>';
        }).join('') + '</select>' + help);
      case 'checkbox':
        return '<div class="field' + widthClass(f) + '"><label class="check" for="' + id + '" style="text-transform:none;letter-spacing:0;font-family:inherit;font-size:14px;color:var(--text)"><input type="checkbox"' + attrs + (v ? ' checked' : '') + '>' + esc(f.label) + '</label>' + help + '</div>';
      case 'image': {
        var src = safeUrl(v);
        return wrap(label + '<div class="image-field">' +
          '<div class="preview" id="' + id + '-preview" style="' + (src ? 'background-image:url(&quot;' + esc(src.replace(/"/g, '%22')) + '&quot;)' : '') + '">' + (src ? '' : 'No image') + '</div>' +
          '<div><div class="row"><input type="text"' + attrs + ' value="' + esc(v || '') + '" placeholder="/images/… or https://…">' +
          '<button type="button" class="btn" data-upload="' + esc(path) + '">Upload</button></div>' +
          '<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden data-file="' + esc(path) + '">' +
          '<span class="help">JPEG, PNG, WebP or AVIF, up to 8 MB. Wide landscape photos (≈1600 px) look best.</span></div></div>');
      }
      case 'lines':
        return wrap(label + '<textarea rows="' + (f.rows || 4) + '"' + attrs + '>' + esc((v || []).join('\n')) + '</textarea>' + help);
      case 'paragraphs':
        return wrap(label + '<textarea rows="' + (f.rows || 6) + '"' + attrs + '>' + esc((v || []).join('\n\n')) + '</textarea>' + help);
      case 'tags':
        return wrap(label + '<input type="text"' + attrs + ' value="' + esc((v || []).join(', ')) + '">' + help);
      case 'json':
        return wrap(label + '<textarea class="code" rows="' + Math.min(18, Math.max(4, JSON.stringify(v === undefined ? null : v, null, 2).split('\n').length + 1)) + '"' + attrs + ' spellcheck="false">' + esc(JSON.stringify(v === undefined ? null : v, null, 2)) + '</textarea><span class="err" data-err="' + esc(path) + '"></span>' + help);
      case 'storybody':
        return wrap(label +
          '<div class="cheatsheet"><code>## Heading</code> · <code>### Sub-heading</code> · <code>&gt; Quote</code> + <code>&gt; — Name</code> · <code>- list item</code> · <code>1. numbered</code> · <code>![Caption](/images/photo.jpg)</code> · <code>---</code> divider · ' +
          '<code>:::note Title | tip</code> … <code>:::</code> · <code>:::facts</code> <code>Label | Value</code> <code>:::</code> · <code>:::gallery</code> image lines <code>:::</code>. Blank line = new paragraph. <code>&lt;strong&gt;</code>, <code>&lt;em&gt;</code>, <code>&lt;a href=""&gt;</code> work inside paragraphs. ' +
          '<button type="button" class="btn small" data-upload-inline="' + esc(path) + '">Upload image into article</button><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden data-file-inline="' + esc(path) + '"></div>' +
          '<textarea class="code" rows="' + (f.rows || 20) + '"' + attrs + ' spellcheck="true">' + esc(A.blocksToText(v || [])) + '</textarea>' + help);
      case 'repeater':
        return '<div class="field' + widthClass(f) + '"><span class="label">' + esc(f.label) + '</span>' +
          '<div class="repeater" data-repeater="' + esc(path) + '">' + renderRepeaterItems(ed, f, path) + '</div>' +
          '<div><button type="button" class="btn small" data-add="' + esc(path) + '">+ Add</button></div></div>';
      default:
        return '';
    }
  }

  function renderRepeaterItems(ed, f, path) {
    var list = getPath(ed.model, path) || [];
    if (!list.length) return '<p class="rep-empty">None yet.</p>';
    return list.map(function (item, i) {
      return '<details class="rep-item"' + (item && item.__open ? ' open' : '') + '>' +
        '<summary><span class="rep-title">' + esc(f.itemLabel ? f.itemLabel(item || {}, i) : '#' + (i + 1)) + '</span>' +
          '<span class="row-actions">' +
            '<button type="button" class="btn small icon-btn" data-rep="up" data-path="' + esc(path) + '" data-i="' + i + '" aria-label="Move up"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
            '<button type="button" class="btn small icon-btn" data-rep="down" data-path="' + esc(path) + '" data-i="' + i + '" aria-label="Move down"' + (i === list.length - 1 ? ' disabled' : '') + '>↓</button>' +
            '<button type="button" class="btn small danger icon-btn" data-rep="remove" data-path="' + esc(path) + '" data-i="' + i + '" aria-label="Remove">✕</button>' +
          '</span></summary>' +
        '<div class="fields">' + f.fields.map(function (sf) { return renderField(ed, sf, path + '.' + i); }).join('') + '</div>' +
      '</details>';
    }).join('');
  }

  function findField(ed, path) {
    // locate a repeater definition by its data path (strip numeric segments)
    var bare = path.replace(/\.\d+(?=\.|$)/g, '');
    var found = null;
    (function walk(fields, prefix) {
      fields.forEach(function (f) {
        if (f.only && f.only !== ed.kind) return;
        var p = (prefix ? prefix + '.' : '') + resolvePath(f, ed.kind);
        if (p === bare) found = f;
        if (f.fields) walk(f.fields, p);
      });
    })([].concat.apply([], ed.schema.sections.map(function (s) { return s.fields; })), '');
    return found;
  }

  function readValue(el) {
    var t = el.dataset.type, raw = el.type === 'checkbox' ? el.checked : el.value;
    switch (t) {
      case 'number': return raw === '' ? null : Number(raw);
      case 'checkbox': return raw ? true : undefined;
      case 'select': return raw === '' ? undefined : raw;
      case 'date': return raw === '' ? undefined : raw;
      case 'slug': return slugify(raw);
      case 'lines': return raw.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      case 'paragraphs': return raw.split(/\n\s*\n/).map(function (s) { return s.replace(/\s*\n\s*/g, ' ').trim(); }).filter(Boolean);
      case 'tags': return raw.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      case 'storybody': return A.textToBlocks(raw);
      default: return raw;
    }
  }

  function bindForm(ed, root) {
    root.addEventListener('input', onInput);
    root.addEventListener('change', onInput);

    function onInput(e) {
      var el = e.target;
      if (!el.dataset || !el.dataset.path) return;
      var path = el.dataset.path, type = el.dataset.type;
      if (e.type === 'input' && (el.type === 'checkbox' || el.tagName === 'SELECT')) return;
      if (type === 'json') {
        var errEl = root.querySelector('[data-err="' + CSS.escape(path) + '"]');
        try {
          setPath(ed.model, path, JSON.parse(el.value));
          delete ed.invalid[path];
          el.parentNode.classList.remove('invalid');
          if (errEl) errEl.textContent = '';
        } catch (err) {
          ed.invalid[path] = path + ' is not valid JSON';
          el.parentNode.classList.add('invalid');
          if (errEl) errEl.textContent = 'Not valid JSON yet: ' + err.message;
        }
      } else if (type === 'slug') {
        if (e.type === 'change') { el.value = slugify(el.value); }
        setPath(ed.model, path, slugify(el.value) || undefined);
        ed.slugTouched = true;
      } else {
        setPath(ed.model, path, readValue(el));
      }
      if (type === 'image') {
        var prev = document.getElementById(el.id + '-preview');
        var src = safeUrl(el.value);
        if (prev) { prev.style.backgroundImage = src ? 'url("' + src.replace(/"/g, '%22') + '")' : ''; prev.textContent = src ? '' : 'No image'; }
      }
      // auto slug + live title for new entries
      if (path === ed.schema.titleKey) {
        $('#ed-title').firstChild.nodeValue = el.value || 'Untitled';
        if (ed.isNew && !ed.slugTouched) {
          var s = slugify(el.value);
          ed.model.slug = s;
          var slugInput = root.querySelector('[data-path="slug"]');
          if (slugInput) slugInput.value = s;
        }
      }
      ed.markDirty();
    }

    root.addEventListener('click', function (e) {
      var add = e.target.closest('[data-add]');
      var rep = e.target.closest('[data-rep]');
      var up = e.target.closest('[data-upload]');
      var upInline = e.target.closest('[data-upload-inline]');
      if (add) {
        var p = add.dataset.add, f = findField(ed, p);
        var list = getPath(ed.model, p);
        if (!Array.isArray(list)) { list = []; setPath(ed.model, p, list); }
        var item = f.newItem ? f.newItem(list) : {};
        list.push(item);
        redrawRepeater(p, f, list.length - 1);
        ed.markDirty();
      } else if (rep) {
        e.preventDefault();
        var rp = rep.dataset.path, i = +rep.dataset.i, rf = findField(ed, rp), arr = getPath(ed.model, rp);
        if (rep.dataset.rep === 'remove') {
          if (!confirm('Remove this item?')) return;
          arr.splice(i, 1);
        } else {
          var j = rep.dataset.rep === 'up' ? i - 1 : i + 1;
          if (j < 0 || j >= arr.length) return;
          var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        }
        redrawRepeater(rp, rf);
        ed.markDirty();
      } else if (up) {
        root.querySelector('[data-file="' + CSS.escape(up.dataset.upload) + '"]').click();
      } else if (upInline) {
        root.querySelector('[data-file-inline="' + CSS.escape(upInline.dataset.uploadInline) + '"]').click();
      }
    });

    root.addEventListener('change', function (e) {
      var fileInput = e.target.closest('input[type=file]');
      if (!fileInput || !fileInput.files || !fileInput.files[0]) return;
      var file = fileInput.files[0];
      fileInput.value = '';
      if (file.size > 8 * 1024 * 1024) { toast('That image is over 8 MB — please compress it first.', true); return; }
      toast('Uploading ' + file.name + '…');
      api('POST', '/api/admin/upload?folder=' + encodeURIComponent(ed.schema.folder), file, {
        raw: true, headers: { 'Content-Type': file.type || 'application/octet-stream', 'X-Filename': encodeURIComponent(file.name) }
      }).then(function (res) {
        if (fileInput.dataset.file) {
          var input = root.querySelector('[data-path="' + CSS.escape(fileInput.dataset.file) + '"]');
          input.value = res.url;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          var ta = root.querySelector('[data-path="' + CSS.escape(fileInput.dataset.fileInline) + '"]');
          var snippet = '\n\n![Caption](' + res.url + ')\n\n';
          var pos = ta.selectionStart || ta.value.length;
          ta.value = ta.value.slice(0, pos) + snippet + ta.value.slice(pos);
          ta.dispatchEvent(new Event('input', { bubbles: true }));
        }
        toast('Image uploaded.');
      }).catch(function (err) { toast(err.message, true); });
    });

    function redrawRepeater(path, f, openIndex) {
      var box = root.querySelector('[data-repeater="' + CSS.escape(path) + '"]');
      var list = getPath(ed.model, path) || [];
      if (openIndex != null && list[openIndex]) Object.defineProperty(list[openIndex], '__open', { value: true, enumerable: false, configurable: true });
      box.innerHTML = renderRepeaterItems(ed, f, path);
    }
  }

  /* ------------------------------------------------------------ bookings */
  var SOURCE_LABELS = { 'contact-form': 'Contact form', 'trip-page': 'Trip page', popup: 'Booking popup', newsletter: 'Newsletter' };

  function viewBookings() {
    document.title = 'Bookings — Admin';
    loading('bookings');
    var filters = { q: '', status: '', source: '' };
    var page = 1, pages = 1, total = 0;
    var items = [], statuses = ['NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
    var open = {};

    function query(extra) {
      var params = Object.assign({}, filters, extra || {});
      return Object.keys(params).filter(function (k) { return params[k]; }).map(function (k) { return k + '=' + encodeURIComponent(params[k]); }).join('&');
    }

    function load() {
      $('#bk-body').classList.add('is-loading');
      return api('GET', '/api/admin/bookings?' + query({ page: page, pageSize: 25 })).then(function (res) {
        items = res.items;
        statuses = res.statuses;
        pages = res.pages;
        total = res.total;
        if (page > pages) { page = pages; return load(); }
        draw();
      }).catch(function (err) { if (err.message !== 'Signed out') toast(err.message, true); })
        .then(function () { var b = $('#bk-body'); if (b) b.classList.remove('is-loading'); });
    }

    mount('bookings',
      '<div class="page-head"><div><span class="kicker mono">Customers</span><h1>Bookings</h1></div>' +
        '<div class="actions"><button class="btn" id="bk-refresh" type="button">Refresh</button><a class="btn" id="bk-csv" href="/api/admin/bookings.csv">Export CSV</a></div></div>' +
      '<div class="status-strip" id="bk-strip" role="group" aria-label="Filter by status">' +
        ['', 'NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(function (s) {
          return '<button type="button" class="strip-btn' + (s === '' ? ' on' : '') + '" data-status="' + s + '">' + (s || 'All') + '</button>';
        }).join('') +
      '</div>' +
      '<section class="panel">' +
        '<div class="toolbar">' +
          '<input class="input" type="search" id="bk-q" placeholder="Search name, email, phone, reference, trip…" aria-label="Search bookings">' +
          '<select class="input" id="bk-source" aria-label="Source"><option value="">All sources</option>' +
            Object.keys(SOURCE_LABELS).map(function (k) { return '<option value="' + k + '">' + SOURCE_LABELS[k] + '</option>'; }).join('') + '</select>' +
          '<span class="muted" id="bk-count" style="margin-left:auto"></span>' +
        '</div>' +
        '<div class="table-wrap"><table class="bk-table"><thead><tr><th>Received</th><th>Name</th><th>Trip</th><th class="hide-sm">People</th><th class="hide-sm">Preferred date</th><th>Status</th><th></th></tr></thead><tbody id="bk-body"><tr><td colspan="7"><div class="empty-state">Loading…</div></td></tr></tbody></table></div>' +
        '<div class="pager" id="bk-pager"></div>' +
      '</section>');

    function historyHtml(b) {
      var h = Array.isArray(b.history) ? b.history.slice().reverse() : [];
      if (!h.length) return '<span class="muted">No changes yet.</span>';
      return '<ol class="timeline">' + h.map(function (x) {
        var what = x.note ? 'Notes updated' : (x.from ? esc(x.from) + ' → ' : '') + '<b>' + esc(x.status) + '</b>';
        return '<li><span class="muted">' + fmtDate(x.at, true) + '</span> ' + what + (x.by ? ' <span class="muted">· ' + esc(x.by) + '</span>' : '') + '</li>';
      }).join('') + '</ol>';
    }

    function prefDate(b) {
      if (!b.preferred_date) return '<span class="muted">—</span>';
      if (b.details && b.details.date_precision === 'month') {
        var dt = new Date(b.preferred_date + 'T00:00:00');
        return isNaN(dt) ? esc(b.preferred_date) : esc(dt.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })) + ' <span class="muted">(month)</span>';
      }
      return fmtDate(b.preferred_date);
    }

    function detailsHtml(b) {
      var d = b.details && typeof b.details === 'object' ? b.details : {};
      var HIDDEN = { first_name: 1, last_name: 1, date_precision: 1 };
      var keys = Object.keys(d).filter(function (k) { return !HIDDEN[k]; });
      if (!keys.length) return '';
      return '<dl class="kv extras">' + keys.map(function (k) {
        var label = k.replace(/_/g, ' ').replace(/^./, function (m) { return m.toUpperCase(); });
        var v = d[k] === true ? 'Yes' : d[k] === false ? 'No' : d[k];
        return '<dt>' + esc(label) + '</dt><dd>' + esc(v) + '</dd>';
      }).join('') + '</dl>';
    }

    function draw() {
      $('#bk-count').textContent = total ? ((page - 1) * 25 + 1) + '–' + Math.min(page * 25, total) + ' of ' + total : '0 bookings';
      $('#bk-csv').href = '/api/admin/bookings.csv' + (query() ? '?' + query() : '');
      $all('#bk-strip .strip-btn').forEach(function (btn) { btn.classList.toggle('on', btn.dataset.status === filters.status); });
      $('#bk-body').innerHTML = items.length ? items.map(function (b) {
        var phoneDigits = String(b.phone || '').replace(/[^\d]/g, '');
        var row = '<tr class="bk-row st-row-' + esc(b.status) + '" data-id="' + esc(b.id) + '">' +
          '<td class="muted" style="white-space:nowrap">' + fmtDate(b.created_at, true) + '<br><span class="slug">' + esc(b.ref) + '</span></td>' +
          '<td><b>' + esc(b.name) + '</b><br><span class="muted" style="font-size:12px">' + esc(b.email) + '</span></td>' +
          '<td>' + esc(b.trip_name) + (b.trip_slug ? '<br><a class="slug" target="_blank" rel="noopener" href="/' + (b.trip_type === 'expedition' ? 'expeditions' : 'treks') + '/' + encodeURIComponent(b.trip_slug) + '">view trip ↗</a>' : '') + '</td>' +
          '<td class="hide-sm" data-label="People">' + esc(b.people) + '</td>' +
          '<td class="hide-sm" data-label="Preferred date">' + prefDate(b) + '</td>' +
          '<td><select class="bk-status st-' + esc(b.status) + '" data-act="status" aria-label="Status for ' + esc(b.name) + '">' + statuses.map(function (s) { return '<option' + (s === b.status ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></td>' +
          '<td><div class="row-actions"><button class="btn small" data-act="toggle" aria-expanded="' + (!!open[b.id]) + '">' + (open[b.id] ? 'Hide' : 'Details') + '</button></div></td>' +
        '</tr>';
        if (open[b.id]) {
          row += '<tr class="bk-detail" data-id="' + esc(b.id) + '"><td colspan="7"><div class="detail">' +
            '<div><span class="label">Contact</span><div class="contact-line">' + esc(b.email) + (b.phone ? ' · ' + esc(b.phone) : '') + '</div>' +
              '<div class="contact-links">' +
                '<a class="btn small" href="mailto:' + encodeURIComponent(b.email) + '?subject=' + encodeURIComponent('Your Himalayan Magic Adventure request ' + b.ref) + '">Email</a>' +
                (phoneDigits.length >= 6 ? '<a class="btn small" target="_blank" rel="noopener" href="https://wa.me/' + phoneDigits + '">WhatsApp</a><a class="btn small" href="tel:+' + phoneDigits + '">Call</a>' : '') +
              '</div>' +
              '<dl class="kv" style="margin-top:1rem"><dt>Source</dt><dd>' + esc(SOURCE_LABELS[b.source] || b.source) + '</dd>' +
                (b.page_url && safeUrl(b.page_url.replace(/^https?:\/\/[^/]+/, '')) ? '<dt>Sent from</dt><dd><a class="slug" target="_blank" rel="noopener" href="' + esc(b.page_url.replace(/^https?:\/\/[^/]+/, '')) + '">' + esc(b.page_url.replace(/^https?:\/\/[^/]+/, '')) + '</a></dd>' : '') +
                '<dt>Updated</dt><dd>' + fmtDate(b.updated_at, true) + '</dd></dl>' +
              detailsHtml(b) + '</div>' +
            '<div><span class="label">Message</span><div class="message">' + (b.message ? esc(b.message) : '<span class="muted">No message.</span>') + '</div>' +
              '<span class="label" style="display:block;margin-top:1rem">History</span>' + historyHtml(b) + '</div>' +
            '<div class="field"><label for="notes-' + esc(b.id) + '">Internal notes (only visible here)</label><textarea id="notes-' + esc(b.id) + '" rows="3" data-notes>' + esc(b.notes || '') + '</textarea>' +
              '<div class="actions"><button class="btn small" data-act="notes">Save notes</button><button class="btn small danger" data-act="delete">Delete booking</button></div></div>' +
          '</div></td></tr>';
        }
        return row;
      }).join('') : '<tr><td colspan="7"><div class="empty-state">' + (filters.q || filters.status || filters.source ? 'No bookings match these filters.' : 'No bookings yet. They appear here the moment someone submits a booking form.') + '</div></td></tr>';

      $('#bk-pager').innerHTML = pages > 1
        ? '<button class="btn small" data-page="prev"' + (page <= 1 ? ' disabled' : '') + '>← Newer</button><span class="muted mono">Page ' + page + ' / ' + pages + '</span><button class="btn small" data-page="next"' + (page >= pages ? ' disabled' : '') + '>Older →</button>'
        : '';
    }

    var timer = null;
    $('#bk-q').addEventListener('input', function (e) {
      clearTimeout(timer);
      timer = setTimeout(function () { filters.q = e.target.value.trim(); page = 1; load(); }, 300);
    });
    $('#bk-strip').addEventListener('click', function (e) {
      var btn = e.target.closest('.strip-btn');
      if (!btn) return;
      filters.status = btn.dataset.status;
      page = 1;
      load();
    });
    $('#bk-source').addEventListener('change', function (e) { filters.source = e.target.value; page = 1; load(); });
    $('#bk-refresh').addEventListener('click', load);
    $('#bk-pager').addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-page]');
      if (!btn) return;
      page += btn.dataset.page === 'next' ? 1 : -1;
      load().then(function () { window.scrollTo(0, 0); });
    });

    $('#bk-body').addEventListener('change', function (e) {
      if (e.target.dataset.act !== 'status') return;
      var sel = e.target, id = sel.closest('tr').dataset.id, status = sel.value;
      var previous = (items.filter(function (b) { return b.id === id; })[0] || {}).status;
      sel.disabled = true;
      api('PATCH', '/api/admin/bookings/' + encodeURIComponent(id), { status: status }).then(function (res) {
        items = items.map(function (b) { return b.id === id ? res.item : b; });
        toast('Status set to ' + status + '.');
        pulse();
        draw();
      }).catch(function (err) {
        sel.value = previous;
        sel.disabled = false;
        if (err.message !== 'Signed out') toast(err.message, true);
      });
    });
    $('#bk-body').addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-act]');
      if (!btn) return;
      var id = btn.closest('tr').dataset.id;
      if (btn.dataset.act === 'toggle') {
        open[id] = !open[id];
        draw();
      } else if (btn.dataset.act === 'notes') {
        var notes = btn.closest('tr').querySelector('[data-notes]').value;
        btn.disabled = true;
        api('PATCH', '/api/admin/bookings/' + encodeURIComponent(id), { notes: notes }).then(function (res) {
          items = items.map(function (b) { return b.id === id ? res.item : b; });
          toast('Notes saved.');
          draw();
        }).catch(function (err) { btn.disabled = false; if (err.message !== 'Signed out') toast(err.message, true); });
      } else if (btn.dataset.act === 'delete') {
        if (!confirm('Delete this booking permanently? Consider setting it to CANCELLED instead.')) return;
        btn.disabled = true;
        api('DELETE', '/api/admin/bookings/' + encodeURIComponent(id)).then(function () {
          delete open[id];
          toast('Booking deleted.');
          pulse();
          load();
        }).catch(function (err) { btn.disabled = false; if (err.message !== 'Signed out') toast(err.message, true); });
      }
    });

    load();
  }

  boot();
})();
