# Himalayan Magic Adventure — backend & admin guide

## How it fits together

```
 Visitor's browser                         Your admin (/admin)
   │  pages: /treks/…, /expeditions/…         │  sign in → edit → Save
   │  loads /data/treks.js etc.               │
   ▼                                          ▼
 Express server (server.js) ── services ── storage driver
   /data/*.js      contentService            ├─ Supabase (production): Postgres tables + image bucket
   /api/bookings   bookingService            └─ local files (your computer): data/*.json + public/uploads
   /api/admin/*    mediaService, notifyService (email)
```

* **The public pages did not change.** Each page still reads `window.TREKS`,
  `window.MOUNTAINS` / `window.PEAKS_DATA` and `window.STORIES`. Those used to be
  typed into big JS files; now the server builds them from the database at
  `/data/treks.js`, `/data/expeditions.js` and `/data/stories.js`.
* **Only published entries go to the public.** When you are signed in, the same
  scripts also include drafts, so "Preview" shows a draft on the real page.
* Shared defaults and helper code stay in `public/treks.js`, `mountains.js`,
  `peaks.js`, `stories.js` (now small).
* If Supabase is ever unreachable, the site falls back to the copy in
  `data/content/` so pages never go blank.

## Folders

| Path | What it is |
|---|---|
| `src/config/env.js` | Reads environment variables |
| `src/data/drivers/fileDriver.js` | Local JSON storage (no setup) |
| `src/data/drivers/supabaseDriver.js` | Supabase storage (used automatically when keys are set) |
| `src/services/` | Business logic: content, bookings, image uploads, emails |
| `src/middleware/adminSession.js` | Admin sign-in (signed HttpOnly cookie) |
| `src/controllers/`, `src/routes/` | HTTP endpoints |
| `public/admin/` | The admin dashboard (index.html, admin.js, schemas.js, admin.css) |
| `data/content/*.json` | Content (38 treks, 31 expeditions, 4 stories) — the seed for Supabase |
| `data/private/bookings.json` | Local bookings (git-ignored, contains customer data) |
| `supabase/schema.sql` | Database tables, security and image bucket |
| `scripts/` | `admin:password`, `db:push`, and the one-off data migration |

## Run it on your computer

1. `copy .env.example .env`
2. `npm run admin:password` → paste the printed `ADMIN_PASSWORD_HASH=` line into `.env`,
   and set `ADMIN_EMAIL` and a long random `SESSION_SECRET`.
3. `npm run dev` → site on http://localhost:8000, admin on http://localhost:8000/admin

Without Supabase variables everything is saved in `data/` on your computer.

## Go live on Vercel (Supabase)

1. Create a free project at supabase.com.
2. Supabase → **SQL Editor** → paste `supabase/schema.sql` → **Run**.
3. Supabase → **Project Settings → API**: copy the Project URL and the **service_role** key.
4. Put them in `.env` (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) and run `npm run db:push`
   — this copies all treks, expeditions and stories into the database.
5. Vercel → Project → **Settings → Environment Variables**: add `ADMIN_EMAIL`,
   `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
   `SITE_URL` (and the SMTP ones if you want booking emails). **Redeploy.**
6. Open `https://<your-site>/admin` and sign in.

Never put the service_role key in browser code or commit it — it stays in `.env` / Vercel only.

## Everyday use

* **Add a trek / expedition / story** — sidebar → section → **+ New** → fill the form →
  tick **Published** when ready → **Save** (Ctrl+S). Unpublished = saved as a draft.
* **Edit** — click the title in the list, change fields, **Save**. The website updates
  within about a minute (instantly for you when signed in).
* **Hide** without deleting — flip the **Live** switch in the list.
* **Delete** — Delete button (asks to confirm; cannot be undone).
* **Order** — ↑ ↓ buttons in the list (with no search/filter active).
* **Images** — **Upload** next to any image field (JPEG/PNG/WebP/AVIF, max 8 MB).
* **Story text** — plain text with a few markers: `## Heading`, `> quote`, `- list`,
  `![Caption](/path.jpg)`, `:::note Title | tip … :::` (cheat-sheet shown above the box).
* **Advanced JSON** tab — every field of the record, for sections the form does not cover.

## Bookings

* The contact form (and every "Plan this trek / climb" button, which pre-selects the trip)
  saves to **Bookings** with a reference like `HMA-260916-7KQ2M` and status **NEW**.
* In **Bookings**: search, filter by status/source, open **Details** (Email / WhatsApp / Call
  buttons, message, private notes), change status NEW → CONTACTED → CONFIRMED → COMPLETED
  (or CANCELLED), **Export CSV**.
* Newsletter sign-ups from the Stories page appear under source "Newsletter sign-ups".
* Optional email alert per booking: set `SMTP_*`, `MAIL_FROM`, `BOOKING_NOTIFY_TO`.

## Booking API (for the popup form)

Load the shared client once on any page that shows a booking form:

```html
<script src="/booking-client.js?v=1" defer></script>
```

```js
// fill a <select> with every published trek and expedition
const trips = await HMABooking.trips();            // [{ type: 'trek'|'expedition', slug, name, days?, elevation? }]

// submit — keep ONE key per form fill so a retry never creates a duplicate
const key = HMABooking.newKey();
const result = await HMABooking.submit({
  name, email, phone,                                // name + email required
  people: 2, preferred_date: '2026-10-12',           // optional
  trip_slug: 'annapurna-circuit', trip_type: 'trek', // or trip_name: 'Custom idea'
  message,
  source: 'popup',
  details: { country: 'Australia', experience: 'first trek' }, // any extra answers (max 12, shown in admin)
  website: honeypotInput.value                       // hidden spam trap — leave empty
}, { key });

if (result.ok)  showThanks(result.ref, result.message);
else            showErrors(result.fields, result.message); // fields = { email: 'Please enter…', … }
```

Raw HTTP contract — `POST /api/bookings` (JSON or form-encoded, max 64 KB):

| Response | Meaning |
|---|---|
| `201 { status:'success', ref, message, booking }` | stored, status NEW |
| `200 { … booking.replayed: true }` | same `Idempotency-Key` (header) or an identical submit within 10 min — the original booking is returned, nothing duplicated |
| `400 { status:'error', message, fields:{…} }` | validation — show `fields` next to the inputs |
| `413` / `429` / `503` | too large · too many submissions (8 per 10 min per IP) · storage down |

Validation: name ≥ 2 chars · valid email · phone 6+ digits · people 1–50 · preferred date not in the past and within 3 years.
Other sites may only post if listed in `ALLOWED_ORIGINS`. `GET /api/health` reports storage status for uptime monitors.

## Security summary

* Admin: one account from environment variables; scrypt password hash; 10 sign-in
  attempts per 15 minutes; signed HttpOnly + SameSite=Strict + Secure cookie (12 h);
  mutating requests need the `X-HMA-Admin` header (blocks cross-site forms).
* Supabase: Row Level Security on, no public policies — only the server can read/write.
* Uploads: file type checked by content (not name), size-limited, random file names.
* Bookings: validated server-side, rate-limited (8 per 10 min per connection), honeypot
  spam trap, CSV export guarded against spreadsheet formula injection.
* Content strings are stripped of script-capable tags (`script`, `iframe`, `svg`, `form`, `style`…), `on…=` handlers,
  `style=`/`srcdoc=` and `javascript:`/`data:` URLs, including entity-encoded tricks.
* Changing the admin email or password signs out every existing session.
* Two people editing the same entry: the second save is refused (409) instead of silently overwriting.
* Renamed slugs keep working (301 redirect); unknown or unpublished pages return a real 404.
* CORS: only `SITE_URL` + `ALLOWED_ORIGINS` may call the public booking API cross-site, never with cookies.

## Tests

`npm test` runs 24 end-to-end checks (bookings, idempotency, validation, CORS, auth, content lifecycle,
sanitising, uploads, redirects, CSV) against a temporary copy of the data — your real content is never touched.

## Upgrading an existing Supabase database

Re-run `supabase/schema.sql` in the SQL Editor after pulling this version — it adds the booking columns
`idempotency_key`, `details`, `history`, `page_url` and the `popup` source without touching existing rows.

## Limitations (v1)

* One admin login (no roles / multiple users yet).
* On Vercel **without** Supabase the admin is read-only and bookings cannot be stored.
* Page HTML is still rendered in the browser (as before), so brand-new entries rely on
  the dynamic sitemap for search engines.
* The homepage hero copy and the legacy `content.json` / `/api/save` editor are unchanged.
