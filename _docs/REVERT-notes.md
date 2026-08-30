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

## 4. Security / SEO / dev-residue (Phase 1) — see memory `audit-phase1.md`
`git checkout` the relevant files if you need to undo:
`server.js`, `src/routes/apiRoutes.js`, `src/controllers/contentController.js`,
`src/middleware/validator.js`, `src/middleware/auth.js` (delete), `public/404.html` (delete),
`public/sitemap.xml`, `public/robots.txt`.
Deleted: `public/vertical_odyssey.html`, `public/himalayan-magic.html` (in git history).
