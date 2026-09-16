/* ============================================================================
   HIMALAYAN MAGIC ADVENTURE — booking client  (window.HMABooking)
   Shared by the contact page and any popup / inline booking form.

     <script src="/booking-client.js?v=1" defer></script>

     HMABooking.trips()                 → Promise<[{ type, slug, name, days?, elevation? }]>
     HMABooking.submit(payload, opts?)  → Promise<{ ok: true,  ref, message, booking }
                                                 | { ok: false, message, fields }>

   payload: { name*, email*, phone, people, preferred_date (YYYY-MM-DD),
              trip_slug, trip_type ('trek'|'expedition'), trip_name, message,
              source ('popup'|'contact-form'|'trip-page'),
              details: { country, experience, budget, … }   // any extra answers
              website }                                     // honeypot — leave empty
   opts:    { key } — reuse the same key when retrying one form fill; a retry then
                      returns the original booking instead of creating a duplicate.
   Field errors come back as { fields: { email: 'Please enter…' } } for inline display.
   ========================================================================== */
(function () {
  'use strict';
  if (window.HMABooking) return;

  var TIMEOUT_MS = 15000;
  var tripsPromise = null;

  function newKey() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    var s = '';
    for (var i = 0; i < 32; i++) s += Math.floor(Math.random() * 16).toString(16);
    return s;
  }

  function timeoutFetch(url, init) {
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS) : null;
    if (ctrl) init.signal = ctrl.signal;
    return fetch(url, init).finally(function () { if (timer) clearTimeout(timer); });
  }

  function trips() {
    if (!tripsPromise) {
      tripsPromise = timeoutFetch('/api/trips', { headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error('trips ' + r.status); return r.json(); })
        .then(function (j) { return (j && j.items) || []; })
        .catch(function (err) { tripsPromise = null; throw err; });
    }
    return tripsPromise;
  }

  function submit(payload, opts) {
    opts = opts || {};
    var key = opts.key || newKey();
    var body = Object.assign({ source: 'popup', page_url: location.href }, payload || {});
    return timeoutFetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'Idempotency-Key': key },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (json) {
        if (res.ok && json.status === 'success') {
          return { ok: true, key: key, ref: json.ref, message: json.message, booking: json.booking };
        }
        if (res.status === 429) {
          return { ok: false, key: key, retryable: true, message: json.message || 'Too many requests — please wait a minute and try again.', fields: {} };
        }
        return { ok: false, key: key, retryable: res.status >= 500, message: json.message || 'Something went wrong. Please try again.', fields: json.fields || {} };
      });
    }).catch(function () {
      return { ok: false, key: key, retryable: true, message: 'Connection problem — check your internet and try again, or message us on WhatsApp.', fields: {} };
    });
  }

  window.HMABooking = { trips: trips, submit: submit, newKey: newKey };
})();
