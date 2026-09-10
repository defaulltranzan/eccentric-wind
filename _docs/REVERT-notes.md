# How to revert the 2026-08-28 changes

## 1. Static Tailwind CSS (replaced the Play CDN)
Every `public/*.html` now loads `<link rel="stylesheet" href="/tailwind.css">` instead of
`cdn.tailwindcss.com`. To go back to the CDN:
- In each `public/*.html`, replace `    <link rel="stylesheet" href="/tailwind.css">`
  with the block saved in `_docs/tailwind-cdn-revert.html`
  (the CDN `<script>` + the `tailwind.config` block).
- Delete `public/tailwind.css`, `tailwind.config.js`, `build/tw-input.css`.
- `npm uninstall tailwindcss` and remove the `build:css` script + `build:css` from `dev` in package.json.
- To rebuild the static CSS after editing markup/JS: `npm run build:css`.

## 2. Footer build credit
Blur was reduced `1.3px → 0.4px` and colour `#4a4d54 → #5b5e66`, `select-none` removed,
across every footer. To restore the heavier blur: search all `public/*.html` for
`Eccentric Wind` and set `style="filter:blur(1.3px)"` + class `text-[#4a4d54] select-none`.

## 3. Theme-toggle background fix
`index.html` + about / services / contact / altitude-safety / dispatches / about-sherpa:
the `body { ... transition: background-color 0.3s ease, color 0.3s ease }` was changed to
`transition: color 0.3s ease` (a `var()`-in-transition Chrome bug left the body stuck on the
old theme background). To revert, restore the two-property transition — but the toggle will
then not repaint the page background.

## 5. Bug-fix round (2026-08-30)

### 5a. Shared navigation menu — `public/menu.js`  (now `?v=3`)
Every `public/*.html` loads `<script src="/menu.js?v=3"></script>` before `</body>`.
It self-injects the "Explore" compass button + fullscreen overlay menu and removes any
legacy `#fullscreen-menu` / `#menu-trigger`. The old per-page menu markup on `index.html`
plus the `// 11. Fullscreen Menu` i18n block in `edit.js` were deleted (that block was
what produced the doubled "Dispatches" / "Gear Manifest" entries). The legacy
`#menu-trigger` + `#fullscreen-menu` markup was also physically removed from `index.html`
(other legacy pages still carry it inline but menu.js strips it at runtime).
Revert: delete `public/menu.js`, remove the `<script src="/menu.js...">` line from each
page, `git checkout` `public/index.html` + `public/edit.js` for the old menu.

### 5a-follow-up (2026-08-30, later) — trigger placement + select animation
`menu.js` only:
- The "Explore" trigger and the close "×" now sit at `top:3.9rem` (clears the sticky
  announcement bar).
- The trigger is **scroll-aware**: hidden over the header at the top of the page on
  desktop (`> 1023px`), always shown on mobile (no header nav there), and hidden whenever
  the `#trek-finder` section is on screen (IntersectionObserver) so it never covers those
  controls. Class toggled: `#hme-menu-btn.hme-show`.
- Hovering a menu item zooms the label (`a.hme-nav:hover` → `translateX(8px) scale(1.07)`).
- Selecting a menu item does a brief zoom (`a.hme-nav.hme-picked` → `scale(1.09)`), then
  navigates after ~190 ms; `:active` also does a small `scale(1.04)`. Skipped under
  `prefers-reduced-motion` and for ctrl/cmd/middle-click (those navigate immediately).
Revert: `git checkout public/menu.js` and drop the version bump on the `<script>` tags.

### 5b. Homepage sections swapped
- Old section `#gear` (Gear Manifest) removed from `index.html`; that content now lives on
  the standalone **/gear** page (`public/gear.html`, route in `src/routes/pageRoutes.js`).
- New section `#compare-home` (Compare Treks teaser) added in its place, linking to the new
  **/compare** page (`public/compare.html` + `public/compare.js`, route in pageRoutes.js).
- New section `#trek-finder` markup fully replaced (6-question flow: experience / region /
  season / duration / budget / style-multiselect). JS is in `edit.js`
  (`finderState`, `finderCriteria`, `filterTrekFinder`, `resetTrekFinder`,
  `selectFinderCard`). `submitTrekFinderInquiry` + the name/email fields were removed.
- `index.html` bumped `edit.js?v=18.0 → 19.1`.
Revert: `git checkout public/index.html public/edit.js`;
delete `public/compare.html public/compare.js public/gear.html`;
remove the `/compare` and `/gear` routes from `src/routes/pageRoutes.js`.

### 5c. Dispatches heading de-duplicated
`edit.js` `applyLanguageUI` set `dispHeading.innerHTML = t.sec06Heading` (was wrapping it in
another "STORIES FROM THE …" template → "Stories from the Stories from the High Places").
`sec06Heading` in all 3 languages is now a complete single heading with the accent `<span>`.

### 5d. Button hover / zoom micro-interactions — `build/tw-input.css`
Appended a `@media (prefers-reduced-motion: no-preference)` block: padded uppercase-mono
pill buttons (`a[class*="uppercase"][class*="tracking-"][class*="px-"]`, `button[class*="uppercase"]`,
`.btn-zoom`) get a `translateY(-2px) scale(1.03)` hover lift on `(hover:hover)` devices and a
`scale(.94–.96)` press response on `:active` (works on touch too). Compiled into
`public/tailwind.css` via `npm run build:css`.
Revert: restore `build/tw-input.css` to the three `@tailwind` lines and rerun `npm run build:css`.

### 5e. Hero — mobile CTA clearance + readable description
The `#hero-description` paragraph was `text-muted-foreground font-light drop-shadow-md`
(barely legible over the photo). Now `text-white/95 font-normal` on a subtle
`bg-[#121417]/55 backdrop-blur-[2px]` rounded panel with a real text-shadow.

Mobile hero — floating theme/language pill no longer overlaps the CTAs:
`index.html` `#manifesto` hero: section padding `pt-10 pb-24 md:py-12`; inner content
`py-6 md:py-20 space-y-5 md:space-y-8`; `<h1>` mobile size `text-[2.5rem]` (was `text-6xl`),
divider `my-2 md:my-3 w-24 md:w-32`; CTA buttons `px-6 py-3 md:px-8 md:py-4`, container
`gap-3 md:gap-4 pt-2 md:pt-4`; the decorative "Bottom Datum" row is `hidden sm:flex`.
Net effect: the whole hero fits above the fixed `bottom-6 right-6` controls on a 375×812
screen. Desktop is unchanged (all `md:` values match the originals).
Revert: `git checkout public/index.html` then `npm run build:css`.

### 5f. Announcement bar — rotating + site-wide  (`public/announce.js`, new)
Shared module on `index / about / services / contact / treks / expeditions`
(loaded as `/announce.js?v=1` just before `menu.js`). It re-uses a page's existing
`#announcement-bar` or creates one at the top of `<body>`, and rotates every 6 s between:
  1. the standing "Autumn 2026 … Booking Open" notice, and
  2. a **trail advisory**: "Flash flooding in Nepal — the Langtang Valley trek is closed
     until further notice".
**Edit or remove the advisory** in the `MESSAGES` array at the top of `public/announce.js`
(a single entry just shows statically — delete the advisory object once Langtang re-opens).
Pauses on hover; respects `prefers-reduced-motion`; picks short/full text by width.
Revert: delete `public/announce.js`, remove the `<script src="/announce.js?v=1">` lines.
The static bars on index/about/services/contact still exist in HTML as a fallback and are
restored by `git checkout` of those files.

### 5g. Flagship Expeditions (`#expeditions`) — single-row scroller + richer tiles
`index.html`: `#flagship-grid` changed from a `grid` (3×2) to a horizontal
scroll-snap flex row inside a new `.relative` wrapper, with ‹ › nav buttons
(`.hme-flag-nav`, desktop only), a right-edge fade, and a "Swipe for more" hint (mobile).
New CSS in the `<head>` `<style>` (`.hme-hscroll`, `.hme-flag-nav`, `.hme-flag-extra`,
`@media(max-width:767px){.hme-flag-extra{display:none}}`).
`edit.js` `renderFlagshipPeaks()`: richer tile (adds `aka`, "first climbed" year,
a 1–5 "commitment" pip read from `difficulty`, the season window); tiles 4–6 get
`hme-flag-extra` so **mobile shows only the first 3**. New `scrollFlagship(dir)` +
`updateFlagshipNav()`. `index.html` bumped `edit.js?v=19.1 → 19.4`.
Revert: `git checkout public/index.html public/edit.js` + `npm run build:css`.

### 5h. `#explore` — "Explore Nepal" discovery panel
`index.html`: kicker "03 — Explore" → "03 — Explore Nepal"; heading "The Map of Nepal" →
"Explore Nepal"; intro copy reworded to discovery framing; `#explore-panel` gets
`hme-xpanel lg:max-h-[68vh] lg:overflow-y-auto`; new CSS in the section `<style>`
(`.hme-xpanel` scrollbar, `.hme-xbody` fade-in keyframe, `.hme-xrow` hover).
`edit.js`: `exploreRegions.koshi` / `.gandaki` get an `expeditions: [slug,…]` array;
new `exploreTrailsFor(id)` (filters `window.TREKS` by `province`); `renderExploreRegion()`
rewritten into sections — Known for / Trails we guide here (real `/treks/<slug>` links from
TREKS) / Eight-thousanders above it (real `/expeditions/<slug>` links) / Culture & places
(factual town + landmark lists, no invented copy) / Stories (link to `/dispatches`).
Hover now only highlights the map; the panel updates on **click** only; empty state lists
all 7 provinces as buttons. `index.html` bumped `edit.js?v=19.4 → 19.5`.
Revert: `git checkout public/index.html public/edit.js` + `npm run build:css`.

### 5i. Blog (Stories / `/dispatches`) face-card images
`public/dispatches.html` "Journals & Field Essays" grid — the 3 `<article>` card images
were swapped from Unsplash / `hero-mountain.jpg` to three user-supplied AI illustrations:
| Card | Old `src` | New `src` |
|------|-----------|-----------|
| 1 · Medical Guide  | `unsplash …1544735716…` | `/images/blog-1.jpg` (painterly alpine valley) |
| 2 · Expedition Log | `unsplash …1585938389612…` | `/images/blog-3.jpg` (Annapurna poster art) |
| 3 · Alpine Essay   | `/images/hero-mountain.jpg` | `/images/blog-2.jpg` (snow-leopard illustration) |
Each `<img>` also got `opacity-70` + `[filter:saturate(.88)_contrast(1.04)_brightness(.82)]`
and the scrim went `via-transparent` → `via-[#22252a]/55` to pull the bright art toward the
dark house palette. `blog-1/2/3.jpg` are copies of the files in
`public/images/images for blog/` (originals kept).
Revert: `git checkout public/dispatches.html && npm run build:css`; optionally delete
`public/images/blog-1.jpg`, `blog-2.jpg`, `blog-3.jpg`.

### 5j. Hero redesign — `#manifesto` (2026-09-01)
`index.html` (+ CSS rebuild) + one line of `edit.js`. The hero was rebuilt in the
site's cartographic voice (Oswald caps title, mono telemetry labels, accent orange,
`data-media` dark scope). Iterated to a **centred** layout on user request:
- Google Fonts `<link>` gained `IBM+Plex+Sans` (used for `#hero-description` and the
  header nav via `font-sans`; titles/labels stay Oswald / IBM Plex Mono).
- Structure: top telemetry rail (coords + `1,350 m → 8,848 m`) · centred eyebrow with
  flanking rules (`sm:` only) · two-line H1 with accent divider · `#hero-description`
  · two centred buttons — `/treks` "Trekking Trails" (accent) and `/expeditions`
  "Expeditions" (outline) · "Plan a custom ascent" link `/contact`.
- `min-h-[54vh] md:min-h-[62vh]`, content `flex-1 justify-center` — kept tight, no
  dead vertical space; the credential strip was dropped (redundant with `#stats-grid`
  right below).
- Decorative, all `pointer-events-none` / `aria-hidden`: layered scrims + radial
  centre wash, accent blur haze, inline contour `<svg>`, four corner marks.
- `edit.js` i18n (en only): `heroDesc` and `heroBadge` shortened for a tighter
  mobile hero (the `ne` / `zh` entries are unchanged — and still carry stale
  "Vertical Odyssey" title text, pre-existing).
- JS hooks kept: `#manifesto` + `data-media`, `#hero-bg-parallax`, `#hero-image`
  (src `/images/hero-mountain.jpg`, Unsplash = `onerror` fallback), `#hero-badge` /
  `#hero-title-primary` / `#hero-title-italic` / `#hero-description`, and the first
  `#manifesto span.font-mono` is `#hero-telemetry-coords`.
Revert: `cp public/index.html.prehero.bak public/index.html`,
`git checkout public/edit.js`, drop `IBM+Plex+Sans` from the fonts `<link>` (also
used by 5k), `npm run build:css`.

### 5k. Header / primary nav redesign — ALL PAGES (2026-09-01)
The per-page inline `<header>` was reworked on **index.html first, then rolled out to
all 12 content pages** (about, about-sherpa, altitude-safety, compare, contact,
dispatches, expedition, expeditions, gear, services, trek, treks — `404.html` keeps
its minimal logo-only header). Pre-rollout copies of every page: `_docs/header-rollout-backup/`.
The `.hme-navlink` / `.hme-cta` CSS lives in **`build/tw-input.css`** (compiled into
`public/tailwind.css`, shared by all pages) — not in any page's inline `<style>`.
Per-page differences preserved: the `xl:`-only subtitle line, and `.hme-navlink.is-active`
on the matching link (treks/trek → Treks, expeditions/expedition → Expeditions,
altitude-safety → Safety, dispatches → Stories, about/about-sherpa → About; services,
contact, compare, gear, index carry no active link). Every page's CTA is now
`Find your route → /#trek-finder` (was "Plan a Trek"/"Plan an Expedition" → /contact
on the trek/expedition group). Header bg unified to `bg-[#16181b]/95 backdrop-blur-md`
(expeditions/expedition were `#101215`). Group A pages lost their `h-24` → `h-20`.
Original details:
- Height `h-24 → h-20`; flex container gained `gap-6`, every child `shrink-0` so the
  logo, nav and CTA can never overlap.
- Wordmark is `hidden sm:flex` — **mobile shows the logo mark only** (clears the
  floating `#hme-menu-btn` compass). Subtitle line `hidden xl:block`.
- Nav trimmed 7 → 5 links (Treks · Expeditions · Safety · Stories · About; "Home" and
  "Services" now live only in the ⊕ overlay menu).
- Nav type (2nd pass): `font-heading` (Oswald) uppercase, `text-[13px] xl:text-sm`
  (bigger), `tracking-[0.13em]`, rest `text-white/70`. Class `.hme-navlink`.
- Hover (CSS in `build/tw-input.css`, `.hme-navlink` / `.hme-cta`): text →
  `var(--accent)`, a 2px accent underline wipes in from the left (`::after`
  scaleX 0→1), −1px lift, faint accent text-glow. The CTA "Find your route"
  (`.hme-cta`) fills with `var(--accent)` from the left (`::before` scaleX), text →
  `var(--background)`, soft accent drop-shadow. All brand-token colours (theme-safe);
  disabled under `prefers-reduced-motion`. `.hme-navlink.is-active` = persistent
  underline (marks the current section).
Revert (all pages): `for f in _docs/header-rollout-backup/*.html; do cp "$f"
"public/$(basename $f)"; done`, delete the `.hme-navlink`/`.hme-cta` block from
`build/tw-input.css`, `npm run build:css`. (Those backups predate the header rollout
but already include the 5j hero + 5l spacing on index.html.)

### 5l. Homepage section spacing tightened — `index.html` (2026-09-01)
`#expeditions` `py-24 md:py-32 → py-16 md:py-24`; `#explore`, `#compare-home`,
`#trek-finder` `py-24 md:py-32 → py-16 md:py-24`; `#dispatches`, `#about`
`py-20 → py-14 md:py-20`. Revert: restore the backup + rebuild.

### 5m. "Home" nav link + compass scroll control — ALL PAGES (2026-09-01)
**Home** was added as the first `.hme-navlink` in every page's header nav (6 links
now: Home · Treks · Expeditions · Safety · Stories · About); `index.html` marks Home
`is-active`. Revert: restore `_docs/header-rollout-backup/` (or delete each
`<a href="/" class="hme-navlink">Home</a>` line).

**`public/compass-nav.js`** (new, shared) — a fixed cartographic compass, bottom-left
(`left:1.1rem; bottom:1.1rem; z-index:45`), self-injecting like menu.js. Two buttons:
**N** (up arrow) → `scrollTo(0)`, **S** (down arrow) → `scrollTo(bottom)`, smooth
unless `prefers-reduced-motion`. A four-point rose sits between them (north spike =
`var(--accent)`), with a ±6° scroll-parallax tilt. Hidden until the page is
scrollable and `scrollY > 120`; N disables within 60px of the top, S within 60px of
the bottom. Brand tokens only (`--card` / `--border` / `--muted-foreground` /
`--accent`) so it re-tints in light mode. Loaded on all 13 content pages via
`<script src="/compass-nav.js?v=1">` right after `menu.js` (not on `404.html`).
Revert: delete `public/compass-nav.js` + every `compass-nav.js` `<script>` tag.

### 5n. Stats matrix (`#stats-grid`) typography — `edit.js` `renderStats()` (2026-09-01)
Numbers `text-4xl sm:text-5xl` → `text-[2.6rem] sm:text-5xl lg:text-[3.25rem]`
(bigger on mobile), `+ tracking-tightest leading-[0.88] [font-feature-settings:'tnum']`
(crisp + tight on laptop). Labels `text-[9px]` → `text-[11px] sm:text-xs`,
`tracking-widest → tracking-[0.15em]`. Cell padding `p-8` → `px-4 py-10 sm:p-8 lg:py-14`;
added mobile row/column dividers (`border-b md:border-b-0`, `even:border-r-0`).
`index.html` bumped `edit.js?v=19.7 → 19.8`. Revert: `git checkout public/edit.js`,
restore the `?v=` on the `<script>` tag, `npm run build:css`.

### 5o. Scroll-reveal animation system  (2026-09-01)  —  ⛔ REVERTED 2026-09-01
Built and then **fully reverted** at the user's request (felt like it slowed the site).
`public/reveal.js` deleted, all `reveal.js` `<script>` tags removed, the "SCROLL REVEAL
SYSTEM" CSS block dropped, `index.html` + `edit.js` + the 9 auto-mode pages restored
from `_docs/scroll-anim-backup/`, CSS rebuilt. No `data-reveal`, `.hme-anim`,
`data-reveal-auto`, or count-up code remains. The description below is kept only as a
record of what was tried — do not treat it as live.
A single lightweight, reusable reveal system. GPU-only (opacity/transform/clip-path),
IntersectionObserver-driven, one-shot. Honours `prefers-reduced-motion` and works
with JS disabled (CSS is scoped to `.hme-anim`, set by a head script; a 5 s failsafe
reveals anything left hidden).

Files added:
- **`public/reveal.js`** (`?v=1`) — the observer + stagger + count-up + parallax +
  slim scroll-progress bar. Loaded on all 13 content pages, right after `menu.js`.
- **CSS**: "SCROLL REVEAL SYSTEM" block in `build/tw-input.css` (compiled into
  `public/tailwind.css`). Selectors: `.hme-anim [data-reveal]` (+ `=fade|down|left|
  right|scale|image`), `.hme-in`, `.hme-hero-img` keyframe, `#hme-progress`,
  `.hme-anim [data-parallax]`.

Markup (attributes only — no layout/content/colour changes):
- `index.html` `<head>`: added `.hme-anim` guard + failsafe `<script>`.
- `index.html` hero: `data-reveal-stagger` on the content wrapper; `data-reveal="up"`
  on eyebrow/H1/description/buttons/link; `data-reveal="fade"` on the telemetry rail;
  `.hme-hero-img` on `#hero-image` (1.8 s scale-settle on load).
- `index.html` sections `#stats-grid #expeditions #explore #compare-home #trek-finder
  #dispatches #about`: `data-reveal-stagger` on each wrapper, `data-reveal="up"` on the
  kicker / heading / intro / grid; `data-reveal="image"` on the About photo (clip-path
  reveal).
- `edit.js` `renderStats()`: each cell `data-reveal="up"`; numeric values ("30+",
  "100%") get `data-countup` (counts up once on reveal, hard-guaranteed final value).
  `renderDispatches()`: each card `data-reveal="up"` (staggered by `#dispatches-container`).
  `index.html` bumped `edit.js?v=19.8 → 19.9`.

The older page-local `.fade-up` reveal on `trek.html` / `expedition.html` /
`expeditions.html` is untouched and now *also* driven by the global observer.
No parallax markup is applied yet (the utility exists); nav-elevation-on-scroll not done.

**Auto mode — the other 9 pages (2026-09-01, follow-up).**
`about`, `about-sherpa`, `services`, `contact`, `altitude-safety`, `dispatches`,
`compare`, `gear`, `treks` each got two edits: the `.hme-anim` head guard + failsafe
`<script>`, and `data-reveal-auto` on `<body>`. `reveal.js`'s `autoEnhance()` then
applies a light, consistent reveal language on those pages *without hand-annotated
attributes* — section kickers / headings / lead paragraphs fade up, a heading + its
adjacent kicker & paragraphs stagger as a group, modest card grids (≤14 cards)
stagger their cards, larger / async grids (`#tk-grid`, `#gear-grid`, `#cmp-table` …)
reveal as one calm block, standalone section photos get the clip reveal. Hard caps:
14 picks per group, **60 per page**, decorative / `inline-grid` / sub-220px widgets
skipped, form fields never touched. `index.html` is NOT in auto mode — it stays
fully hand-tuned. Backups of all 9 in `_docs/scroll-anim-backup/`.

Revert (full):
1. `cp _docs/scroll-anim-backup/index.html public/index.html`
2. `cp _docs/scroll-anim-backup/edit.js public/edit.js`
3. `cp _docs/scroll-anim-backup/tw-input.css build/tw-input.css`
4. `for f in about about-sherpa services contact altitude-safety dispatches compare gear treks; do cp _docs/scroll-anim-backup/$f.html public/$f.html; done`
5. `rm public/reveal.js`
6. remove every reveal.js `<script>` line:
   `for f in public/*.html; do perl -0pi -e 's{\s*<script src="/reveal\.js\?v=1"></script>}{}' "$f"; done`
7. `npm run build:css`

### 5p. Peak database — 7,000 m collection + category architecture (2026-09-01)
A scalable, data-driven peak layer that sits **beside** the existing 14
eight-thousanders (mountains.js untouched). Nothing in the existing atlas or the
14 rich `/expeditions/<slug>` pages was changed except one additive band.

New files:
- **`public/peaks.js`** (`?v=1`) — the unified database. `window.PEAK_CATEGORIES`
  (8000/7000/6000/trekking, data-driven), `window.PEAKS_DATA` (the 9 new 7,000 m
  peaks as skeleton records), normalises the 14 from `window.MOUNTAINS` + the new
  peaks into `window.ALL_PEAKS`. API: `getPeaks({category,country,region,sort,…})`,
  `getPeak(slug)`, `getCategory(id)`, `getPeakCategories()`, `addPeak(obj)`,
  `PEAK_SORTS`. **Adding a peak = one `addPeak({...})` call or one object in
  `PEAKS_DATA`.** Sorts: elevation, elevation-asc, country, region, difficulty,
  featured, alphabetical, newest.
- **`public/peaks-list.html` + `peaks-list-render.js`** (`?v=1`) — collection page.
  Routes `/expeditions/8000m` `/7000m` `/6000m` `/trekking-peaks` `/expeditions/peaks`.
  Premium card grid (`.pk`), live sort/country/region filters, band switcher.
- **`public/peak.html` + `peak-render.js`** (`?v=1`) — individual peak page, route
  `/expeditions/peaks/:slug`. 8000ers redirect to their rich `/expeditions/<slug>`.
  New peaks render a factual skeleton: known data + an honest "still verifying" list
  (`verify[]`) — **nothing fabricated** (no invented first-ascent / route / season /
  difficulty / coords). Image field is a placeholder; cards/hero use a topographic
  SVG pattern, never a wrong photo.

Edited (additive only):
- `src/routes/pageRoutes.js` — 3 route lines added **before** `/expeditions/:slug`.
  Needs a server restart.
- `public/expeditions.html` — one new "Expeditions by elevation" band (`#peak-collections`)
  after the intro; loads `peaks.js`; small inline script fills counts.
- `public/expedition.html` + `expedition-render.js` — load `peaks.js`; if an old-style
  `/expeditions/<7000er-slug>` is hit, redirect to `/expeditions/peaks/<slug>`.
- `public/sitemap.xml` — added `/expeditions/8000m`, `/7000m`, and the 9 peak URLs.

The 9 peaks (elevation + country from the user; range/region asserted only where
geographically unambiguous; everything else null pending research):
Nuptse 7,855 · Muztagh Ata 7,546 · Annapurna IV 7,525 · Putha Hiunchuli 7,246 ·
Nun 7,135 · Api Himal 7,132 · Baruntse 7,129 · Himlung Himal 7,126 · Spantik 7,027.

Revert: `rm public/peaks.js public/peaks-list.html public/peaks-list-render.js
public/peak.html public/peak-render.js`; `git checkout public/expeditions.html
public/expedition.html public/expedition-render.js public/sitemap.xml
src/routes/pageRoutes.js`; restart the server; `npm run build:css`.

### 5q. Peak database — full 7,000 m content, nav dropdowns, expedition-page restructure, itineraries (2026-09-02)
Builds on § 5p. Big update; all additive to the existing 8,000 m system.

**Navigation dropdowns**
- `build/tw-input.css` — new "HEADER NAV DROPDOWN" block (`.hme-navgroup` / `.hme-navdrop`), CSS-only hover panel, desktop only, brand tokens.
- Every page `<header>`: the `Expeditions` link is wrapped in `<div class="hme-navgroup">` with a `.hme-navdrop` (8,000 / 7,000 / 6,000 / trekking-peaks + "the full atlas").
- `public/menu.js` (bumped to `?v=5` on all pages): `GROUPS` reorganised — new "Mountain Expeditions" group with the four elevation bands as `sub:true` items; `.hme-nav-sub` CSS added.

**Expeditions page restructure** (`public/expeditions.html`)
- New order: hero → **`#collections` "Choose your elevation"** (4 image tiles, `.ex-band`) → **`#bestsellers` "Where climbers start with us"** (`#ex-bestsellers`, rendered by the inline script from `window.getPeaks({sort:'featured'})`) → the existing "14" intro → atlas → editorial sections (unchanged).
- The old `#peak-collections` band was removed from below the intro and rebuilt at the top.

**7,000 m peaks — full content** (`public/peaks.js`, bumped `?v=2`)
- `PEAKS_DATA` rewritten from skeletons to full `mountains.js`-shaped records for all 9: character[], firstAscent{}, normalRoute{sections[]}, camps[], approach, season{months}, difficulty{6 dims}, objectiveHazards[], history[], equipment[], acclimatisation, permit{verify}, **itinerary[phases]**, faq[], relatedTreks[], coordinates{approx:true}, seo{}. Static facts inline; time-sensitive detail flagged `verify` / `{verify:true}`; images still null (cartographic panel).
- `fromData()` now marks a record `status:'published'` once it has route+firstAscent+itinerary+character.

**Individual peak pages — one shared renderer**
- Route `/expeditions/peaks/:slug` now serves **`expedition.html`** (was `peak.html`). `public/peak.html` + `public/peak-render.js` **deleted**.
- `public/expedition-render.js` (`?v=2`) generalised: `m = MOUNTAINS[slug] || PEAKS_DATA[slug]`; `isBand` flag drives the 8000-only bits (rank badge, "of 14", breadcrumb, canonical `/expeditions/peaks/<slug>`, "other peaks in this band"). Hero falls back to a cartographic panel when `heroImage` is null. New **"Being confirmed"** note for band peaks.

**Itinerary section — the requested "bug edit"** (`expedition-render.js`)
- New `#itinerary` section + subnav entry on **every** expedition page.
- 7,000 m peaks use their hand-written `itinerary[]` (phases).
- The 14 eight-thousanders get a **synthesised** phased timeline built at render time from their existing `approach` / `camps` / `acclimatisation` / `typicalDurationDays` fields — no new data, no fabrication. Start city auto-detected (Kathmandu / Islamabad / Kashgar / Leh).

Revert: `git checkout public/expeditions.html public/expedition.html public/expedition-render.js public/peaks.js public/menu.js build/tw-input.css src/routes/pageRoutes.js public/*.html` (for the header-nav-group markup) ; restore `public/peak.html` + `public/peak-render.js` from git ; restart server ; `npm run build:css`. (§ 5p can then also be reverted per its own note.)

## 4. Security / SEO / dev-residue (Phase 1) — see memory `audit-phase1.md`
`git checkout` the relevant files if you need to undo:
`server.js`, `src/routes/apiRoutes.js`, `src/controllers/contentController.js`,
`src/middleware/validator.js`, `src/middleware/auth.js` (delete), `public/404.html` (delete),
`public/sitemap.xml`, `public/robots.txt`.
Deleted: `public/vertical_odyssey.html`, `public/himalayan-magic.html` (in git history).

---

## § 5r — Full-Atlas restructure: hub vs. collection pages (2026-09-02)

The expedition section is now a two-tier structure:

- **`/expeditions`** → `public/expeditions.html` is a lean **HUB** (no atlas/map/compare here
  any more). Sections in order: hero → 1.2 Choose your elevation (4 band tiles) →
  1.3 "Where climbers start with us" (the 4-step progression) → 1.4 Best sellers
  (`#ex-bestsellers`, featured peaks across all bands) → 1.5 "Our recommendations"
  (3 curated cards) → 1.6 "Which summit comes next?" CTA + trust strip.
  All render logic is one inline `<script>` (counts, best-sellers, trust, fade-up).
  It loads only `mountains.js` + `peaks.js` (no `expeditions.js`).

- **`/expeditions/{8000m|7000m|6000m|trekking-peaks}`** → NEW `public/collection.html`
  + `public/collection.js`. One data-driven template for every band. `collection.js`
  detects the band from the URL, builds `LIST` from `getPeaks({category})` merged with
  the rich record (`MOUNTAINS[slug] || PEAKS_DATA[slug]`), and renders the full
  0–11 structure the old `/expeditions` page had: intro, atlas grid, map (bounds
  computed from the collection), compare tool, elevation skyline (base/top computed),
  difficulty, seasons, first-ascent timeline, "by country", planning, safety, journal,
  CTA, trust. Hero copy / counts / headings / SEO tags are all JS-set from the
  category record. `deband()` softens the shared `EXPED_DEFAULTS` copy (written for
  the 8,000ers) on the other bands. `#8000m` keeps world-rank badges + "Nepal's
  eight-thousanders"; other bands use an elevation-order badge + "where they rise".

Routes (`src/routes/pageRoutes.js`):
- `/expeditions/:band(8000m|7000m|6000m|trekking-peaks)` → `collection.html` (was `peaks-list.html`)
- `/expeditions/peaks` → **301 redirect** to `/expeditions` (was `peaks-list.html`)
- `/expeditions/peaks/:slug` → `expedition.html` (unchanged)
- `/expeditions/:slug` → `expedition.html` (unchanged)

Header dropdown (`.hme-navdrop`) on all 14 pages: "The Full Atlas" moved to first position.

Deleted: `public/peaks-list.html`, `public/peaks-list-render.js`, `public/expeditions.js`
(all three backed up in `_docs/atlas-restructure-backup/`).

**Revert:** `git checkout public/expeditions.html src/routes/pageRoutes.js public/*.html`
(dropdown reorder); restore the three deleted files from
`_docs/atlas-restructure-backup/` (or git); `rm public/collection.html public/collection.js`;
restart server.

---

## § 5s — 6,000 m + peaks added (2026-09-02)

Eight six-thousanders added to `public/peaks.js` → `window.PEAKS_DATA`, full rich
records in the same shape as the 7,000 m ones (character, route, camps, firstAscent,
season, difficulty, hazards, history, equipment, faq, `itinerary[]`):
Mera Peak, Lobuche Peak (East), Island Peak, Ama Dablam, Chulu East, Chulu West,
Saribung Peak, Pisang Peak. No duplicates (all new slugs; `rebuild()` also dedupes).

Data accuracy: every elevation is ≥ 6,000 m so none were forced; where authorities
differ (Island 6,160/6,189, the Chulu heights, Chulu West / Pisang first-ascent years)
the record says so and flags it in `verify[]` (new `TREK_PEAK_VERIFYING` list). Nothing
fabricated — geography, route character, seasons and permit framework are the asserted
facts; time-sensitive detail stays qualitative or `{verify:true}`.

New model fields (added to BOTH `fromMountain` and `fromData` normalisers, so the 14
and the 9 get them too):
- `peakType` — 'Expedition Peak' | 'Trekking Peak' (record-set, defaults to Expedition).
- `peakGrade` — 'Beginner'|'Moderate'|'Advanced'|'Expert' (record-set, else derived from
  the 1–5 difficulty via `gradeBand()`).
- `relatedPeaks` — array of slugs for cross-category "Climbers also look at".
`getPeaks()` gained `peakType` and `peakGrade` filter options.

`collection.js` / `collection.html`: two new toolbar filters — `#ex-type` (climbing type)
and `#ex-grade` (difficulty band) — populated from the data and hidden when a band has
fewer than two distinct values. Cards now show a `peakType · peakGrade` line. Search
haystack includes `peakType`. Everything else (grid, map, skyline, difficulty, seasons,
timeline, by-country, compare) picks the 6,000 m band up automatically.

`expedition-render.js`: new "Climbers also look at" section from `m.relatedPeaks`
(resolved via `window.getPeak`), shown above the same-band collection grid.

Other: `PEAK_CATEGORIES` 6000 blurb reworded; header dropdown `6,000 m +` label
"Soon" → "8 peaks" (all 14 pages); hub `/expeditions` 6,000 m tile activated;
`sitemap.xml` +9 URLs (`/expeditions/6000m` + 8 peaks); script versions bumped
(`peaks.js?v=3`, `collection.js?v=3`, `expedition-render.js?v=3`).

**Revert:** in `public/peaks.js` delete the eight records in the "SIX-THOUSANDERS"
block, the `TREK_PEAK_VERIFYING` / `gradeBand` additions and the `peakType` /
`peakGrade` / `relatedPeaks` lines in the two normalisers and `getPeaks`; in
`collection.js` / `collection.html` remove the `#ex-type` / `#ex-grade` selects and
their wiring; in `expedition-render.js` remove the "RELATED PEAKS" block;
`git checkout public/sitemap.xml public/*.html` for the dropdown label + hub tile;
`npm run build:css`; restart server.

---

## § 5t — Collection map: "View the map" fix + regional map redesign (2026-09-02)

**Bug:** on `/expeditions/<band>` the hero "View the map" button linked to `#map`,
which had no target — nothing happened. Fixed: added a `<span id="map">` anchor before
`#ex-toolbar`, gave the button `data-jump="map"`, and `collection.js` now opens the map
view (`setMode('map')`) + scrolls on that click, on `#map` hashchange, and on load with
`#map` in the URL.

**Redesign** (Canva reference, re-skinned to brand — charcoal/orange, IBM Plex Mono):
`#view-map` in `collection.html` restructured — a Flat / Relief toggle row (`#ex-map-view`),
a `.hma-map` frame (rounded, layered radial-gradient + contour-texture `::before`,
shadow) containing `#ex-map-stage`, and a `2D`/`3D` badge. New `.hma-*` CSS block.
`buildMap()` in `collection.js` rewritten:
- simplified **country polygons** (Nepal / Tibet·China / India / Pakistan) defined in
  lon/lat and drawn through the same `mx()/my()` projection as the pins, so they align;
  countries present in the collection are accented + clickable, others are dim context.
- **Himalayan crest** polyline, graticule, country labels (clamped on-frame), compass.
- real-coordinate **peak pins** unchanged in logic, restyled.
- **2D/3D relief**: `.hma-stage.relief` CSS perspective transform, toggled by the buttons;
  reduced-motion guarded.
- clicking a country → `mapCountry()` highlights it, dims the rest, fades non-matching
  pins, and lists that country's peaks in `#ex-map-panel` (with a "show the whole arc"
  reset). Pin click → the existing detail panel.
`#ex-map-wrap` renamed to `#ex-map-stage` (setMode + body handlers updated).
`collection.js?v=5`.

**Revert:** `git checkout public/collection.html public/collection.js` (restores the
plain schematic map + the dead `#map` link); no other files touched; `npm run build:css`.

---

## § 5u — Trekking database expanded 28 → 38 (2026-09-02)

**10 new trek records** added to `public/treks.js` (`window.TREKS[...]`), full schema —
same structure/depth as the existing 28 (stats, seo, overview, highlights, suitability,
why+gallery, passes, acclimatization, itinerary day-by-day, routePoints, permits, cost
tiers+breakdown, transport, equipment, safety, faq, relatedTreks, relatedDestinations,
hotelsNote). Inserted into their province sections:
- Koshi: `lumba-sumba-pass-trek`, `sherpeni-col-pass-trek`
- Bagmati: `panch-pokhari-trek`, `ganja-la-pass-trek`, `tashi-lapcha-pass-trek`
- Gandaki: `nar-phu-valley-trek`, `tilicho-lake-trek`, `mesokanto-la-pass-trek`, `manaslu-tsum-valley-trek`
- Karnali: `kagmara-pass-trek`

The other 11 of the 21 candidate routes already existed (Kanchenjunga BC, Makalu BC,
Tsum Valley, Dhaulagiri Circuit, Rolwaling Valley, Tamang Heritage, Upper Dolpo,
Lower Dolpo, Rara Lake, Ganesh Himal/Ruby Valley, Humla/Limi Valley) — NOT duplicated.
`ganesh-himal-trek` region relabelled "Ganesh Himal / Ruby Valley" + a highlight added
so search finds "Ruby Valley".

**Restricted-area system (new):**
- New boolean field `restricted: true` on records. Backfilled onto the 7 existing
  restricted routes (manaslu-circuit, tsum-valley, upper-mustang, upper-dolpo,
  lower-dolpo, kanchenjunga-base-camp, limi-valley) + set on the new restricted ones
  (nar-phu, manaslu-tsum, lumba-sumba, kagmara). 11 restricted total.
- `treks.html`: LIST view model carries `restricted`; card badge shows "Restricted
  area" (between "Signature route" and "Popular"); two new category-rail filters —
  `restricted` and `passes` (name matches /pass|col|\bla\b/).
- `trek-render.js`: hero shows a "Restricted area · licensed guide + group required"
  chip; permits section leads with a restricted-area callout — both gated on `t.restricted`.

**Image placeholders:** new records use `heroImage: '/images/treks/<slug>.webp'`
(+ `-2/-3` for gallery) — files not yet supplied. `treks.html` (`phImg()` + card
`data-ph` + bindImgs error handler) and `trek-render.js` (`phImg()` + `imgTag()` on
hero / related / gallery) fall back to a **branded cartographic SVG placeholder**
("PHOTOGRAPHY PENDING") — never another trek's photo. The `.webp` 404s in console are
expected until real photography is dropped in at those paths.

**Other:** `popular: true` on nar-phu / tilicho / manaslu-tsum (kept `featured` = just
everest-base-camp, unchanged). 16 existing records got the new treks appended to their
`relatedTreks`. Trek count "28" → "38" across all pages (footers, index copy, treks.html
hero — now JS-set from `LIST.length`). `sitemap.xml` +10 URLs. `treks.js?v=3`,
`trek-render.js?v=3`.

**Revert:** delete the 10 `TREKS[...] =` blocks in `public/treks.js`; remove the
`restricted:` backfill lines and the ganesh-himal edits; `git checkout public/treks.html
public/trek-render.js public/*.html public/sitemap.xml`; `npm run build:css`.

## § 5v — /expeditions hub: "Choose your elevation" horizontal scroll on mobile (2026-09-02)
`#peak-collections` in `public/expeditions.html`: below `sm` (640px) it is now a
horizontal snap-scroll flex strip (`flex overflow-x-auto snap-x snap-mandatory -mx-6 px-6`,
each tile `w-[82%] max-w-[300px] shrink-0 snap-start`) so the four band tiles take ~one
screen instead of ~four. At `sm:` and up it reverts to the original
`sm:grid sm:grid-cols-2 lg:grid-cols-4` layout (`sm:w-auto sm:overflow-visible`).
CSS-only; `npm run build:css`. Revert: `git checkout public/expeditions.html` + rebuild.

## § 5w — Interactive safety tools + gear-list route filter (2026-09-04)

Three interactive widgets, all client-side, all reading the existing `window.TREKS`
data model (no data changes, nothing fabricated).

**New file: `public/safety-tools.js`** (`?v=1`) — two self-contained widgets that
no-op if their host markup / data is absent:

1. **Acclimatisation Profile** (`#acclim-profile` on `altitude-safety.html`).
   One `<select>` with 4 `<optgroup>`s — **Trekking routes** (the ~33 treks that
   sleep ≥ 3,000 m) and **8,000 / 7,000 / 6,000 m peaks** (from `window.MOUNTAINS`
   + `window.PEAKS_DATA`) — feeding one inline `<svg>` with two render modes and
   one visual language:
   - **Trek mode** plots each day's *sleeping* altitude (`itinerary[].endEle`),
     3,000 / 5,000 m reference lines, per-day nodes coloured by overnight gain
     (amber > 500 m above 3,000 m; red only when > 800 m above 3,500 m **and no
     rest day follows** — the standard +830 m Namche day reads amber), hollow ring
     nodes for `acclimatization.days`, dashed "climb-high" ticks to a day
     high-point (parsed from the prose, or the curated `stats.maxAltitude` pinned
     on the highest day when it clears the itinerary — e.g. the Thorong La).
   - **Peak mode** plots the phase-by-phase **rotation profile** (the
     climb-high / drop-to-Base-Camp saw-tooth) from a record's hand-written
     `itinerary[]` phases (`{phase,title,days,altM,detail}` — the 7/6,000ers) or,
     for the 14 eight-thousanders which carry none, a synthesised phase list built
     the same way `expedition-render.js` does (from `camps` / `approach` /
     `acclimatisation` / `typicalDurationDays`). Camp altitudes become the dashed
     reference lines (≤ 3 labelled); the summit-push node is accent-filled, the
     rest/weather-hold node is a hollow ring. X-axis is cumulative expedition days.
   Both modes: line draws in on load (`prefers-reduced-motion` honoured); hover /
   tap / arrow-keys drive a floating tip, a detail panel (`#ap-detail`), an 8-chip
   stat block (`#ap-stats`), a swappable legend (`#ap-legend`) and a verdict
   (`#ap-verdict`). Last selection saved to `localStorage['vo_ap_trek']`.
2. **AMS Risk Profile** (`#ams-risk` on `altitude-safety.html`). Four `<select>`s
   (prior altitude illness / highest sleep / itinerary pace / acetazolamide) →
   low / moderate / high band, loosely modelled on the Wilderness Medical Society
   risk categories (a prior HAPE/HACE forces "higher"). Animated 3-segment meter +
   needle, band-specific guidance, prominent "not medical advice" disclaimer.

**`public/altitude-safety.html`** — edits only:
- `<style>` block: appended `.ap-*` / `.risk-*` rules (theme-token based, so they
  re-tint in light mode; one `@media (prefers-reduced-motion)` guard).
- Two new `<section>`s (`#acclim-profile` 03.2, `#ams-risk` 03.3) inserted between
  "THE FOUR PILLARS" and the Lake Louise auditor; the auditor kicker bumped
  `03.2 → 03.4` (only text change to existing markup).
- Added, just before `menu.js`: `<script src="/treks.js?v=3">`,
  `<script src="/mountains.js?v=1">`, `<script src="/peaks.js?v=3">`,
  `<script src="/safety-tools.js?v=3">`.

**`public/gear.html`** — the existing generic checklist is unchanged; added:
- toolbar `<select id="gear-trek">` (all 38 treks) + `#gear-ess` "Essentials only"
  checkbox; `#gear-context` chip row under the hero `<p>` (one sentence of that
  `<p>` reworded); `<style>`: `#gear-trek` bg + `#gear-grid.ess-only` filter rules
  (uses `:has()`).
- The inline render IIFE was rewritten: same generic list + keys (`vo_gear_general`,
  `g<ci>_<ii>`), plus — when a trek is picked — an extra accent-tinted
  "Route-specific · <name>" category built from `TREKS[slug].equipment[]`
  (`need`→`tier`), its ticks in `localStorage['vo_gear_route_<slug>']` (keys
  `r<ii>`), selection in `localStorage['vo_gear_trek']`. Progress counts the
  visible route add-ons too. Essentials filter is display-only.

Backups of both pages pre-edit: `_docs/safety-tools-backup/`.

**Revert:**
```
rm public/safety-tools.js
cp _docs/safety-tools-backup/altitude-safety.html public/altitude-safety.html
cp _docs/safety-tools-backup/gear.html public/gear.html
npm run build:css
```
No server restart, no route changes. Users' saved `vo_ap_trek` / `vo_gear_trek` /
`vo_gear_route_*` keys become dormant (harmless).

---

## § 5x — Nav restructure + page merges + mobile hero + trek-finder (2026-09-07)

### Shared navigation — `public/menu.js` (`?v=6` → `?v=7`, bumped in all 16 HTML files)
`menu.js` is now the **single source of truth for BOTH menus**. One flat `NAV`
array (7 items): Home · Trekking Trails `/treks` · Compare Treks `/compare` ·
Expedition Atlas `/expeditions` (children: Full Atlas + `/expeditions/{8000m,7000m,6000m}`) ·
Altitude & Safety `/altitude-safety` · Stories `/stories` · About Us `/about`.
Dropped from the menu: Find Your Trek, Gear & Packing, Sherpa Heritage, Services,
Contact, Trekking Peaks.
- `renderPrimaryNav()` overwrites every page's hard-coded `<nav class="hme-nav-primary">`
  innerHTML from `NAV` on load (`short` label for the header, `name` for the overlay),
  sets `.is-active` by pathname. The per-page hard-coded nav is now just a pre-JS
  fallback — **edit `menu.js` only** for future nav changes.
- Header "Expedition Atlas" = `<a>` + a `.hme-navdrop-toggle` caret `<button>`;
  clicking toggles `.hme-navgroup.is-open` (CSS hover-open kept too), closes on
  outside-click / Esc. Overlay "Expedition Atlas" = a `.hme-sub-toggle` caret that
  shows/hides the `.hme-sub` band list.
- The `#hme-menu-btn` ("Explore") **no longer hides over `#trek-finder`** (removed the
  `IntersectionObserver` + `finderVisible`); `SHOW_AFTER` 220 → 72 px.
- `build/tw-input.css`: added `.hme-navgroup.is-open .hme-navdrop {…}` +
  `.hme-navdrop-toggle` styles. `npm run build:css`.

### `/gear` → merged into `/altitude-safety`
- `public/altitude-safety.html`: new `<section id="gear">` (`03.5 — TREK LOADOUT`)
  after the AMS auditor — the hero copy + `#gear-toolbar` + `#gear-grid` + Kathmandu
  callout from gear.html; the gear `<style>` rules (`.lbl`, `#gear-trek`,
  `#gear-grid.ess-only`, `@media print`) added to its `<style>`; the gear checklist
  IIFE added as a new `<script>` after `safety-tools.js` (treks.js already loaded).
  Title → "Altitude, Safety & Gear", added a meta description.
- `src/routes/pageRoutes.js`: `/gear` route → `res.redirect(301, '/altitude-safety#gear')`.
- `public/gear.html` **deleted** → `_docs/pagemerge-backup/gear.html`. Not in sitemap.

### `/about-sherpa` → merged into `/about`  (+ a Contact section on `/about`)
- `public/about.html`: new `<section id="sherpa">` (`04.1` guide masters — 3 cards) +
  a `04.2` IPPG Porter Welfare Charter + a new `<section id="contact">` (`04.3` — HQ
  address, office lines, 24/7 rescue desk, WhatsApp, and a "Send an inquiry →" button
  to `/contact`). All inserted before `</main>`.
- `src/routes/pageRoutes.js`: `/about-sherpa` → `res.redirect(301, '/about#sherpa')`.
- `public/about-sherpa.html` **deleted** → `_docs/pagemerge-backup/about-sherpa.html`.
- `public/sitemap.xml`: `/about-sherpa` `<url>` block removed.
- **`/contact` page kept** (working `#contact-form` → `/api/inquiry`, ~40 inbound
  links, sitemap) — only removed from the menu.

### Sitewide link rewrite
`sed` across `public/*.html`: `href="/about-sherpa"` → `href="/about#sherpa"`,
`href="/gear"` → `href="/altitude-safety#gear"` (footer "Company"/"Explore" columns +
the runtime-stripped legacy `#fullscreen-menu` items). Every header/footer logo `<img>`
got `width="480" height="231"` (CLS).

### Homepage hero — ultra-minimal on mobile (`public/index.html` §01 + `public/edit.js`)
- `#hero-description` copy → **"Leave the ordinary behind and ascend into legend."**
  in both the static HTML and `i18n.en.heroDesc`; the stale NP/ZH `heroDesc` +
  `heroTitlePrimary`/`heroTitleItalic` ("Vertical Odyssey") replaced with faithful
  translations + "HIMALAYAN" / "MAGIC ADVENTURE"; NP/ZH `coordSystem` un-bracketed.
- Mobile (`< md`): telemetry rail, EST-1993 badge row, the two CTA buttons and the
  "Plan a custom ascent" link are `hidden md:flex` / `hidden md:inline-flex`. `<h1>`
  smallest size `text-[2.75rem]` → `text-[1.95rem] sm:text-5xl` (was clipping ≤360 px).

### "What kind of trekker are you?" → compact filter bar (`index.html` §05 + `edit.js`)
- The 6 stacked question grids (~1,700 px on mobile) are now **one bordered panel**
  (`grid sm:grid-cols-2 lg:grid-cols-3`, ~1 screen): Experience/Season/Days =
  segmented `.finder-card` buttons (`.is-on` active); Region/Budget = `<select>`
  (`onchange="setFinderValue(group, this.value)"`); Style = multi-toggle `.fdr-chip`s.
  Panel CSS in a `#trek-finder <style>` block (`.fdr-lbl/.fdr-seg/.fdr-sel/.fdr-chip`).
- `#finder-count` is now a pill ("38 trails" / "N matches"); `#finder-hint` carries
  the sentence. Scoring engine (`finderTrailModel/finderCriteria/filterTrekFinder`)
  **unchanged**; results capped at top + 3 (`slice(0,4)`); empty state renders nothing.
  `selectFinderCard` toggles `.is-on`; added `setFinderValue`; `resetTrekFinder`
  clears the `<select>`s. `edit.js?v=24.0` → `?v=25.0`.

**Revert:** `git checkout public/ src/routes/pageRoutes.js build/tw-input.css`;
`cp _docs/pagemerge-backup/{gear,about-sherpa}.html public/`; restore the two routes;
re-add the `/about-sherpa` sitemap block; `npm run build:css`; restart the server.

### § 5x follow-up (2026-09-07)
- Hero mobile: the two CTA buttons (Trekking Trails / Expeditions) are visible again
  on mobile (`hidden md:flex` → `flex`); badge / telemetry / "Plan a custom ascent"
  stay desktop-only.
- Announcement bar (`announce.js` `?v=1`→`?v=2`, all 7 consumers): on phones it stays
  pinned (no scroll-hide) so the notice/advisory is always readable; tag pill hidden,
  message shortened (`short:` values), CTA collapses to the arrow icon. Desktop
  behaviour (rotate + scroll-hide) unchanged. The inline scroll-hide handlers in
  `about.html` / `contact.html` / `services.html` gated to `window.innerWidth >= 640`.
  Static `#announcement-bar` markup in `index.html` updated to match (pre-JS render).

- Hero: desktop shows the full caption again (`#hero-description`, `hidden md:block`);
  mobile shows the one-liner (`#hero-tagline`, `md:hidden`). New `heroTagline` i18n
  key (en/np/zh); `applyLanguageUI` sets both. `edit.js?v=25.0`->`?v=25.1`.

## § 5y — The Field Journal: /stories + article template redesign (2026-09-07)

Editorial rebuild of the blog. **4 files only** — no route, sitemap, menu, homepage
or trek/expedition changes. All 4 articles keep their prose verbatim; only metadata
was added. Pre-edit copies: `_docs/blog-redesign-backup/{stories,story}.html`,
`{stories,story-render}.js`.

**`public/stories.js`** — metadata + helpers, prose untouched.
- Extended the body-block doc comment; added `topics` / `destinations` /
  `relatedTreks` / `featured` / `editorsPick` / `quickFacts` fields to the 4 records
  (`crossing-the-thorong-la` = `featured` + full `quickFacts`; acclimatisation &
  choosing-first-trek = `editorsPick`).
- `getStories` gained `opts.topic` / `opts.destination`. New: `getFeaturedStory()`,
  `getEditorsPicks(n)`, `getStoryDestinations()` (ORDER everest→kanchenjunga),
  `getSameTrail(slug)` → `{treks, stories}`.

**`public/stories.html`** — full rewrite of `<main>` + `<style>` + inline script.
- Spacing scale `--sp-xs/s/m/l` (l = `clamp(3.75rem,7vw,6rem)` max); no `min-h`/`100vh`.
- Sections: compact hero (~49vh) · ONE featured split (`getFeaturedStory`) · sticky
  explore bar (`#j-chips` 7 chips + `#j-search`, `/` focuses) · magazine grid
  (`md:grid-cols-6`, computed `spanFor(i)` rhythm) · destination navigator
  (`#j-dests`, present destinations only) · Field Notes (`#j-notes`) · newsletter
  (`#j-news` → POST `/api/inquiry`) · contact CTA.
- Client-side filter (`state = {topic,dest,q}`), 140 ms debounced search, `.fade-up`
  IntersectionObserver stagger replayed on filter, empty state. `stories.js?v=2`.

**`public/story.html`** — `<style>` + body elements + script bumps.
- 3-col shell: `.story-shell` max 1280px; `.story-grid` = `208px minmax(0,1fr)` at
  ≥1024 (2-col, right-rail cards inline in the article), `210px 44rem 224px` at
  ≥1280 (3-col). `.story-rail-l` sticky ≥1024; `.story-rail-r` sticky ≥1280;
  `details.toc-mobile` hidden ≥1024.
- `.article-prose` 20px / 1.8 / measure 44rem desktop, 17px mobile.
- New CSS for `.toc-link`(+`.is-active`), `.share-btn`, `.rail-card` / `.qf-row`,
  `#story-mini` (slide-in), `.article-facts` / `.article-divider` / `.article-gallery`
  / `.article-note.is-*`, `#lightbox`. Reading-progress bar `h-[3px]`.
- Added `#story-mini` bar and `#lightbox` dialog markup.
- `stories.js?v=1`→`?v=2`, `story-render.js?v=2`→`?v=3`.

**`public/story-render.js`** — full rewrite into the 3-col structure.
- Article header (breadcrumb / category kicker / h1 / dek / byline+Updated) + real
  `<figure>` cinematic hero (opens lightbox index 0).
- Auto TOC from body `h2`/`h3` (unique slug ids) with IntersectionObserver scroll-spy
  + smooth anchor (−88 offset). Vertical share rail (copy-link + X/FB/WA/email).
- Right rail = Quick Facts (`s.quickFacts`) + "From the same trail"
  (`getSameTrail`); renders inline in `<article>` below 1280px.
- New block types: `h3`, `facts`, `divider` (▲), `gallery` (→ lightbox), `note`
  with `kind` (`is-safety`/`is-field`/`is-tip`). Existing p/h2/quote/list/note/image
  unchanged. Every figure + gallery image opens the no-library lightbox
  (prev/next/Esc/←/→/backdrop/focus-trap).
- Sticky mini-nav (IO on the article `<header>`). Richer Article JSON-LD
  (`datePublished` / `dateModified` / `articleSection` / `keywords` / `wordCount`).
- Bad slug still → `robots noindex` + branded not-found (unchanged). `trekName()`
  title-cases the slug (story.html doesn't load `treks.js`).

**Verified** (1440 / 1366 / 1024 / 768 / 390): landing hero ≈49vh, no dead sections,
filters + search + destination navigator work, grid has magazine hierarchy, no body
h-scroll; article 3-col ≥1280 / 2-col+inline-rail 1024 / 1-col mobile, lightbox +
copy-link work, console clean, light mode readable. Scroll-spy / mini-nav wired but
IntersectionObserver callbacks don't fire in the minimised-window preview (logic
confirmed by simulation) — same caveat as § 5x.

**Known pre-existing (NOT introduced here):** the shared page header's `.hme-cta`
button (`hidden … sm:inline-flex`) overflows the viewport at ~1000–1120px on every
page (`/treks` reproduces it). Fix = gate it to `lg:`/`xl:` sitewide, separate pass.

**Revert:** `cp _docs/blog-redesign-backup/{stories,story}.html public/`;
`cp _docs/blog-redesign-backup/{stories,story-render}.js public/`;
`npm run build:css`; restart the server. (Article routes / bad-slug behaviour are
unchanged, so no route edits to undo.)

## § 5z — "Compare Treks" dropped from the desktop header nav (2026-09-07)

`public/menu.js`: the `NAV` entry for Compare Treks got `overlayOnly: true`, and
`renderPrimaryNav()` now does `NAV.filter(function(it){return !it.overlayOnly;})`
before building the header. The item still appears in the "Explore" overlay
(`overlayItem` / `NAV.map` untouched). Header nav is now Home · Treks · Expeditions ·
Safety · Stories · About. `menu.js?v=7`→`?v=8` in all 14 HTML files.

**Revert:** remove `overlayOnly: true` from the Compare entry in `menu.js` and the
`.filter(...)` call in `renderPrimaryNav()`; bump the version back if desired.

## § 5aa — Sitewide floating "Back" control (2026-09-08)

New `public/back.js` (self-injecting, same pattern as `menu.js` / `announce.js`).
Drops one fixed button top-left — the mirror of the ⊕ "Explore" button top-right —
that calls `window.history.back()`.
- Styling matches `#hme-menu-btn` exactly: `left:1.1rem; top:3.9rem; z-index:60`,
  2.9rem tall, thin accent border, dark glass, IBM Plex Mono `BACK` micro-label
  (label hidden < 400px → icon-only), accent chevron in the nav-caret stroke style.
- Shows only when `history.length > 1` (hidden on a fresh tab), and only after
  scrolling `SHOW_AFTER = 72` px so it never overlaps the header logo — identical
  reveal logic to the Explore button. Hidden while the Explore overlay is open
  (MutationObserver on `#hme-menu.open`). Respects `prefers-reduced-motion`.
- Added `<script src="/back.js?v=1">` right after the `menu.js` tag in all 14
  page HTML files.

**Revert:** delete `public/back.js` and remove the 14 `<script src="/back.js?v=1">`
tags (`sed -i '/back\.js?v=1/d' public/*.html`).

## § 5ab — Site-wide bug + consistency sweep (2026-09-08)

A pass for "bug-free, no weak links, consistent icons". No layout redesign — targeted
fixes only.

**Dead / broken links**
- `public/treks.js`: removed 9 `gallery:` blocks that pointed at 22 non-existent
  `/images/treks/*.webp` files (ganja-la, kagmara-pass, lumba-sumba, mesokanto-la,
  nar-phu, panch-pokhari, sherpeni-col, tashi-lapcha, tilicho-lake). The template
  just omits a missing gallery. `treks.js?v=5`→`?v=6` (7 HTML files).
- `public/favicon.ico` + `public/apple-touch-icon.png` added (copies of
  `images/logo-icon.png`) — every page was triggering a `/favicon.ico` 404.
- `public/videos/hero.mp4` added (copy of the mis-named `hero.mp4.mp4`) — the
  homepage route-carousel `<video>` `<source src="/videos/hero.mp4">` was 404-ing
  on every load. (`hero 2.mp4` / `hero.mp4.mp4` left in place, unreferenced.)
- All `images.unsplash.com` hot-links removed (were weak external deps, one 404-ing):
  `about.html` (og:image + JSON-LD → local `hero-mountain.jpg`; ridge photo →
  `everest_real.jpg`); `contact.html` + `services.html` og:image → local;
  `index.html` hero `onerror` fallback → `/images/hero-art.jpg`; `edit.js` dead
  modal default → `''`.

**Icons / controls consistency**
- Theme (light/dark) toggle was **missing** on `about`, `treks`, `contact`,
  `services` (they read `vo_theme` but gave no way to change it). Added the standard
  `fixed bottom-6 right-6` button (`onclick="toggleTheme()"`, `#theme-icon`
  `fa-moon`/`fa-sun`) — `theme.js` already syncs the icon.
- `trek-render.js` share button icon `fa-arrow-up-from-bracket` → `fa-share-nodes`
  to match the story pages. `trek-render.js?v=3`→`?v=4`.

**Content accuracy**
- "30 YEARS / 30 Years" (Est. 1993 → 2026 is 33) → "THREE DECADES" everywhere:
  `edit.js` `heroBadge` en/np/zh, `index.html` fallback, `about.html` `<title>` +
  `og:title`. `edit.js?v=25.1`→`?v=25.2`.
- `about.html` "Mountain Masters" cards: 3 portraits were stock/wrong images
  (2 Unsplash — incl. a beach photo — + `itinerary.png`, all captioned as named
  guides). Swapped to a brand "PORTRAIT / PHOTOGRAPHY PENDING" SVG placeholder
  (inline data-URI, same look as `trek-render.js` `phImg`). Bio text kept for the
  client to revise.

**Footer**
- Removed the blurred `Default × Eccentric Wind · 2026` vanity credit line from the
  11 pages that still carried it (the newest pages had already dropped it).

**Crawl result:** all page routes + every internal `href`/`src` across the site
resolve (0 dead pages, 0 broken refs); console clean on every page type; no body
h-scroll 1024–1440; `/expeditions/<8000er>` (mountains.js keys) all render.

**Known, left as-is (not bugs):** `heroVideoSlides` + `#trek-modal` editor in
`edit.js`/`index.html` are orphaned dead code (no trigger, `isEditMode` never set) —
inert, flagged for a later cleanup, not removed here to avoid risk. `mountains.js`
+ `peaks.js` both touch `window.MOUNTAINS` by design (peaks.js reads it).

**Revert:** `git checkout public/treks.js public/edit.js public/trek-render.js
public/about.html public/contact.html public/services.html public/index.html
public/altitude-safety.html public/collection.html public/compare.html
public/expedition.html public/expeditions.html public/stories.html public/story.html
public/404.html public/tailwind.css`; add back the theme buttons if wanted;
`rm public/favicon.ico public/apple-touch-icon.png public/videos/hero.mp4`;
`npm run build:css`.

## § 5ad — Homepage "Connect" band + floating social rail + badge logo (2026-09-08)

Three linked changes; brand tokens only, no redesign.

**1 · Homepage `#about` section rewritten** (`index.html`). The old "TRUSTED
MOUNTAINEERING LEGACY / thirty years of expertise" two-column block (image +
floating stat) is replaced by a centred "— Connect with us / Talk to our expedition
directors" band: the client's paragraph (three-decades wording, for consistency
with § 5ab), an `About Us` → `/about` accent button + `Safety & Preparation` →
`/altitude-safety` outline button, a thin rule, a 4-icon social row (FB / IG /
WhatsApp / email) and a `Kathmandu HQ · info@himalayanmagic.com · Est. 1993` line.
Faint `hero-mountain.jpg` wash behind. `id="about"` kept for anchors. Classes use
only light-mode-covered utilities (`text-white/70`, `border-white/30`, `border-border`).
- `edit.js`: the `about-image` / `about-img-input` accessors in `renderWebsite()`
  and `updateAboutImage()` are now null-guarded (the section no longer carries those
  nodes; all `about-*` i18n accessors were already guarded).

**2 · New `public/social.js`** (`?v=1`) — self-injecting (menu.js/back.js pattern),
loaded only on `index`, `about`, `treks`, `expeditions`. Fixed `#hme-social` rail,
right edge, vertically centred, z-45 (clear of menu/back z-60, theme z-50, compass
z-45 bottom-left). 4 links: `facebook.com/himalayanmagic1993`,
`instagram.com/himalayanmagic1993`, `wa.me/9779841454599`,
`mailto:info@himalayanmagic.com`. Fades in ~400 ms after load; `prefers-reduced-motion`
keeps just the fade. `<script src="/social.js?v=1">` added after the back.js tag on
those 4 files.

**3 · Logo replaced + sized up** — the client's badge (hiker + pines + inverted
orange triangle + "EXPERIENCE THE HIMALAYAS", 3rd revision) is at
`public/images/logo-badge.png`, **cropped to its true content bbox** (was carrying
~10 % transparent margin) + a 2 % breathing margin, 520×473 (aspect 1.10, ~92 KB).
Because the header/footer are dark in dark mode / near-white in light mode and the
badge is black line-art, the `<img>` sits on a **white rounded-square plate**
(circle clipped the tabs/triangle, so `rounded-2xl` not `rounded-full`):
`<span class="inline-flex h-16 md:h-20 shrink-0 items-center overflow-hidden
rounded-2xl bg-white p-1 shadow-sm ring-1 ring-black/5 …"><img
src="/images/logo-badge.png" width="520" height="473" class="h-full w-auto
object-contain"></span>`. `w-auto` keeps the true aspect; nothing is cropped. Sizes:
header plate `h-16` (64 px) mobile / `h-20` (80 px) desktop → visible logo ~62 px /
~79 px wide (was ~52 px); footer plate `h-28` (112 px) → ~110 px; 404 header `h-16`.
Header bar `h-20` → `h-20 md:h-24` (80 px mobile / 96 px desktop) so the bigger logo
has breathing room without a tall navbar. Header is `relative`, not sticky — no
scroll-shrink. `<a href="/">` wrap (→ home) + text wordmark unchanged; favicon
`<link>`s still `logo-icon.png`. (Earlier `logo-badge.svg` recreation was deleted.) The plate is
a visible coin on the dark header and blends on the light header while the badge
stays legible in both. Applied in all 13 page headers/footers + the 404 header;
`index.html` Organization JSON-LD `logo` → `logo-badge.png`. `<a href="/">` wrap
(→ home) + text wordmark unchanged. Favicon `<link>`s still use `logo-icon.png`
(unchanged); `logo-icon.png` kept. (An earlier mono-orange SVG recreation,
`logo-badge.svg`, was replaced by this and deleted.)

**Verified**: section copy + buttons + 4 socials, readable in dark AND light mode;
logo loads + links home in header/footer on every page + 404; social rail on the 4
target pages only, not on detail pages; no console errors; no body h-scroll;
`renderWebsite()` still completes (stats/flagship/footer email all populate).

**Revert:** `git checkout public/index.html public/edit.js public/*.html
public/tailwind.css`; `rm public/social.js public/images/logo-badge.png`;
`npm run build:css`. (The `*.html` checkout also strips the `social.js` tags and
restores the `logo-icon.png` img src.)

---

## § 5ae — Peak photography: 7,000 m + 6,000 m face cards (2026-09-10)

**New folder `public/images/peaks/`** — all peak imagery now lives here (not under
`images/treks/`, which stays trek-only). 16 files, ~3.6 MB.

### 7,000 m band (9 peaks) — client-supplied
Sources were dropped in `public/images/treks/7000meters/` (21.9 MB of `.jfif`).
Re-encoded to `/images/peaks/<slug>.jpg`, long edge capped 1600, q82 progressive,
EXIF (incl. GPS) stripped → 7.9 MB → 1.8 MB. `heroImage` set on all 9 in
`peaks.js`. Slugs: nuptse, muztagh-ata, annapurna-iv, putha-hiunchuli, nun-peak,
api-himal, baruntse, himlung-himal, spantik. **The originals folder is still in
`public/` and ships — delete or move it out.**

### 6,000 m band (8 peaks) — Wikimedia Commons, licensed
7 of 8 sourced + verified individually (each explicitly identified by the
photographer; where the description quotes an elevation it matches `peaks.js`).
Cropped to a uniform **16:9**, capped 1600 px, q82, EXIF stripped.

| slug | author | licence | Commons file |
|---|---|---|---|
| ama-dablam | Vyacheslav Argenberg | CC BY 4.0 | Ama Dablam, Nepal.jpg |
| mera-peak | Mark Horrell | CC BY-SA 4.0 | Mera Peak Zatr La.JPG |
| island-peak | Rohit Sharma | CC BY-SA 4.0 | Island Peak (Imja Tse) from Dingboche Village.jpg |
| lobuche-peak | Theprotrekker | CC BY-SA 4.0 | Lobuche East from the southeast.jpg |
| chulu-west | Roman Yahodka | CC BY-SA 4.0 | Chulu West peak.jpg |
| chulu-east | Jerome Bon | CC BY 2.0 | Chulu of Nepal.jpg |
| pisang-peak | Mark Horrell | CC BY-SA 2.0 | Naar fields and Pisang Peak.jpg |

- **mera-peak** is cropped to (200,470)-(870,847) of the source to clear the
  rhododendron branches that frame it → 670×377, the one sub-1600 px file.
- **island-peak** is zoomed 1.55× because the peak sits small behind Dingboche.
- **chulu-east**: the file is titled only "Chulu"; identification rests on its
  description quoting 6,584 m, which is Chulu East's exact elevation (not West's).
- **saribung-peak** — deliberately left `heroImage: null`. No verifiable photo of
  it exists on Commons; the existing cartographic `tilePattern()` renders instead.
  Do NOT substitute another mountain.

### Attribution (required by CC BY / CC BY-SA)
New `heroCredit: { author, license, licenseUrl, sourceUrl, changes }` field on
each licensed peak in `peaks.js` (and on 3 treks in `treks.js`, § 5ad follow-up).
Rendered by a `heroCredit()` helper in **`expedition-render.js`** and
**`trek-render.js`** as a small mono line under the hero CTAs. It is in normal
flow, NOT pinned to a corner — the bottom-right holds the floating theme/language
cluster and the bottom-left the compass, and an absolute corner credit collided
with one of them. Colour is arbitrary `text-[#8b9199]`, not a `text-white/*` step,
so the tw-input.css light-mode remap leaves it alone on the dark `[data-media]`
hero. Records without `heroCredit` render nothing.

### Card component — reused, not rebuilt
`mtCard()` in `collection.js` already provided the hover zoom, scrim, hierarchy,
CTA, focus-visible and reduced-motion behaviour, and is shared by all three bands.
Two changes only:
1. `badge()` — non-8000 bands now show the band tag (`6000m+` / `7000m+`) as the
   category chip instead of an `ord/N` counter. 8000 m keeps `#rank`.
2. `collection.html` — new `@media (max-width:639px)` block forces **one card per
   row** (`grid-template-columns:1fr`, every tile `grid-column:1/-1;
   grid-row:span 3`). At 390 px the mosaic's half-width tiles were 165 px, which
   wrapped "Spring & autumn window" onto four lines into the CTA. Tablet and
   desktop keep the mosaic untouched.

Deliberately NOT done, because they conflict with the existing brand: rounded
card corners (site is angular, 3–4 px) and a single uniform tile ratio (the
mosaic's varied spans are the design).

**Verified**: 8/8 six-thousander cards render (7 photo + Saribung pattern), 0
broken images, alt text = real peak name + range; 9/9 seven-thousanders intact;
8000 m ranks + the K2 hover video unaffected; credits render + link out on peak
and trek heroes with no collision; 390/768/1024/1440 all clean, no h-overflow;
no console errors.

**Revert (all of § 5ae):**
```
git checkout public/peaks.js public/collection.js public/collection.html \
             public/expedition-render.js public/trek-render.js public/treks.js
rm -rf public/images/peaks
npm run build:css
```
To revert only the 6,000 m photos and keep the 7,000 m set: delete the 7 files
`ama-dablam|mera-peak|island-peak|lobuche-peak|chulu-west|chulu-east|pisang-peak.jpg`
from `public/images/peaks/` and set those peaks' `heroImage` back to `null` (and
drop their `heroCredit`) in `peaks.js`.

---

## § 5af — Mobile declutter + trek-finder redesign (2026-09-10)

Six client requests, all but the last scoped to phones. Desktop is unchanged
except where noted.

### 1 · "Explore Nepal" hidden on phones
`#explore` in `index.html` gained `hidden lg:block`. The interactive map is a
desktop experience and was a long dead scroll on a phone.
**Revert:** delete `hidden lg:block` from that section tag.

### 2 · "What kind of trekker are you?" off the phone homepage, into the menu
`#trek-finder` also gained `hidden lg:block`. To keep it reachable, `menu.js`
NAV gained a **phone-only** row (`mobileOnly: true`, `action: 'openTrekFinder'`)
that opens the section as a full-screen sheet instead of navigating. Supporting
bits: `overlayItem()` emits `hme-nav-mobile` + `data-action`; the overlay click
handler runs `window[action]()` and closes the menu; CSS hides `.hme-nav-mobile`
at `min-width:1024px`. `openTrekFinder()` / `closeTrekFinder()` in `edit.js` set
`role="dialog"`, lock body scroll and bind Escape. menu.js `?v=8` → `?v=9`
across all 14 HTML files.
**Revert:** delete the NAV entry, the two branches in `overlayItem()`/click
handler, the `.hme-nav-mobile` CSS, the open/close functions, and the
`hidden lg:block` on `#trek-finder`.

### 3 · Homepage stories = swipe carousel on phones
`#dispatches-container` went from `grid grid-cols-1 …` to a snap carousel that
returns to the grid at `md` — same pattern as `#flagship-grid` in `#expeditions`.
The card and the "read the full field journal" tile in `edit.js` got
`w-[78vw] max-w-[300px] shrink-0 snap-start` with `md:` resets.
**Revert:** restore `grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3` on the
container and drop the width/snap classes from both templates in `edit.js`.

### 4 · Altitude barometer → `public/altitude.js`, on phones + 3 more pages
Was inline markup in `index.html` (`hidden lg:flex`) plus a scroll listener in
`edit.js`. Now a **self-injecting module** (menu.js / social.js pattern), loaded
on index, treks, expeditions, stories, and visible at every width. rAF-throttled,
reduced-motion aware, hides itself under 560px tall so it never fights content.
**Direction fixed:** the old version labelled the top 8,848 m and the bottom
1,300 m but counted UP as you scrolled down, so the moving number contradicted
the fixed labels. It now descends 8,848 → 1,300, matching them.
**Revert:** `rm public/altitude.js`, delete the 4 `<script src="/altitude.js?v=1">`
tags, and restore the old inline block + listener from git
(`git checkout public/index.html public/edit.js` reverts both, but that also
undoes items 1–3 and 6 — cherry-pick if you only want this one).

### 5 · Floating social rail stays out of the hero
`social.js` now waits on an IntersectionObserver over the first
`section[data-media]` and only reveals once that hero is ~25 % scrolled away
(with an immediate reveal for pages with no hero, or when loaded already
scrolled past). Same stagger as before, just deferred.
**Revert:** in `mount()`, call `reveal()` unconditionally and delete the
observer block.

### 6 · Trek finder redesigned (desktop + the phone sheet)
Section markup in `index.html` replaced; **the scoring is untouched** —
`finderState`, `finderCriteria()`, `finderTrailModel()` and `filterTrekFinder()`
are the same functions, and the counts shown are the real calculated ones.
- **Alignment fix:** the container was `max-w-5xl` while `#explore`,
  `#compare-home` and `#dispatches` all use `max-w-7xl`, which is why the
  heading looked indented. Now `max-w-7xl`.
- Heading breaks to two lines with `TREKKER` carrying the orange.
- Trail count became an editorial badge; its sub-label is dynamic
  ("In the catalogue" → "Of 38 trails") via `setFinderCountSub()`.
- Filters grouped into `01 EXPERIENCE` / `02 WHERE` / `03 HOW YOU TRAVEL`.
- One inline SVG `<symbol>` sprite (14 stroke icons), no new dependency.
- Selected state is not colour-alone: a corner wedge on segments, a `✓` on chips,
  plus `aria-pressed` on every toggle.
- **Trekking personality** strip (`#fdr-persona`, `finderPersona()`) — a label
  derived from the answers already given; it feeds nothing back into scoring.
- Hint copy: "Start exploring — select a few preferences" → "Your matches are
  ready — N trails match your style".
- Miniature ridge SVG with a walker that advances once a filter is set
  (`.is-touched`), plus a faint CSS topographic wash behind the panel.
- Phone: 44 px+ touch targets, full-screen sheet, no horizontal overflow.
**Revert:** `git checkout public/index.html public/edit.js` (this also reverts
items 1, 3 and part of 4 — see above).

**Verified**: 390 / 768 / 1024 / 1440. Phone — explore + finder hidden, stories
swipe, altitude rail present and counting down, social rail absent in the hero
and revealed after it (checked at scrollY 4928: `is-ready`, 1,934 m). Desktop —
explore + finder visible, menu row hidden, stories back to grid. Finder scoring
still returns real matches (alpinist + remote → 4 matches, "The High-Altitude
Explorer"; first-timer + culture → "The Cultural Wanderer"). Altitude rail live
on /treks, /stories, /expeditions. No console errors, no horizontal overflow at
any width.

**Revert everything in § 5af:**
```
git checkout public/index.html public/edit.js public/menu.js public/social.js
rm public/altitude.js
npm run build:css
```

---

## § 5ag — Backdrop polish, softened altitude rail, peak hover clips (2026-09-10)

### 1 · Altitude rail recedes on phones (`altitude.js`)
Was competing with content. Now, below 1024px: opacity `.38`, the 8,848/1,300
end captions dropped, the pinging halo removed, the track given `blur(.4px)`,
the rail narrowed to `1.05rem` and pulled to `left:.15rem`, and the readout set
`writing-mode:vertical-rl` so it runs *along* the rail.
**Why vertical:** the horizontal readout was ~28 px wide and crossed the page's
24 px `px-6` gutter, i.e. it sat over body copy (the rail is `z-index:40`, above
content). Vertical keeps the whole ornament inside the gutter — measured right
edge 19 px vs the 24 px gutter, so it can no longer overlap anything.
**Revert:** delete the `@media(max-width:1023px)` block in `altitude.js`.

### 2 · `public/backdrop.js` — cartographic backdrop (new, self-injecting)
Adds atmosphere only; no layout, no existing design touched. Loaded on 13 pages.
- **Contour wash** on every decorated section (three `repeating-radial-gradient`
  layers, white + accent, alpha .018–.038).
- **Rotating flourish**, one per section, every third left plain: a **ridge
  silhouette** (inline SVG), a **survey bracket + real coordinates**
  (`content:attr(data-hme-mark)`, e.g. `27°59'N 86°55'E · 8848 M` — the actual
  figures for Everest, Annapurna I, Manaslu, Kanchenjunga, Makalu, Dhaulagiri,
  Lhotse, Cho Oyu), and a **prayer-flag line** (inline SVG).
- **Stacking**, the important part: two cases decided per section at runtime.
  A plain section gets `z-index:-1` — above the section background, below all
  content, so it can never cover text. A section that already owns an absolute
  `z-0` art layer gets `.hme-bd-over` → `z-index:1`, which paints above that art
  but still under the section's `relative z-10` content wrapper. Both conditions
  are verified before opting in; without this, 5 of 7 homepage sections hid the
  backdrop entirely behind their own gradient.
- Heroes (`[data-media]`) are skipped — they have their own photography.
- **Phones**: contours only, at a larger scale and lower alpha; ridge, marks and
  flags are all `display:none`. Also hidden in print.
- Light mode swaps the white ink for graphite.
**Revert:** `rm public/backdrop.js` + delete the 13 `<script src="/backdrop.js?v=1">` tags.

### 3 · Hover clips on three more eight-thousanders
Client uploaded 4 named clips to `public/images/Video/`. All 1280×720, 10 s, and
the same 3D route-flythrough family as the existing K2 clip.
| peak | file used |
|---|---|
| Mount Everest | `/videos/hero.mp4` |
| K2 | `/videos/k2.mp4` (unchanged) |
| Kangchenjunga | `/videos/kangchenjunga.mp4` |
| Annapurna I | `/videos/annapurna.mp4` |
`Everest.mp4` is **byte-identical** (md5 `7c33368a…`) to the existing
`public/videos/hero.mp4`, so Everest points at that rather than shipping the
same 2.9 MB twice. `images/Video/K2.mp4` is a *different* render from the
already-approved `videos/k2.mp4`; the approved one was kept.
Only `heroVideo` fields were added to `mountains.js` — `mtCard()` and
`bindVideos()` in `collection.js` already supported it, so there is no new code.
Still deferred: 0 mp4 requests on page load, fetched on first hover only.
**Revert:** delete the 3 `heroVideo` lines from `mountains.js` (everest,
kangchenjunga, annapurna) and `rm public/videos/kangchenjunga.mp4
public/videos/annapurna.mp4`.

**Verified**: backdrop paints behind content on every section (z checked per
section), phone wash is contours-only with no flourishes, no horizontal overflow
at 390/1280/1440; altitude rail clears the content gutter on phones; all four
hover clips resolve, stay deferred until hover, play on enter (Kangchenjunga
2.44 → 3.93 s) and pause + reset on leave. No console errors.

**Revert everything in § 5ag:**
```
git checkout public/altitude.js public/mountains.js public/*.html
rm public/backdrop.js public/videos/kangchenjunga.mp4 public/videos/annapurna.mp4
```
