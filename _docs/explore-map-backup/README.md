# Explore Nepal map — restore point

Homepage section 03 (`#explore`). If the redesigned Regions map ever needs to
be undone, the three files here are the **original province-only version**
(7 federal provinces, no Regions lens, no toggle — the state from before
2026-09-06).

```bash
cp _docs/explore-map-backup/index.html.province-only  public/index.html
cp _docs/explore-map-backup/edit.js.province-only      public/edit.js
cp _docs/explore-map-backup/treks.html.province-only   public/treks.html
npm run build:css
```

Everything in those three files that is unrelated to the map is identical to
the live version — only the Explore-map code differs.

## What the live version has now (Regions lens)

- `edit.js` — `exploreGeo` (8 mountain regions + Terai) and the "Regions lens"
  block: `buildGeoLayer` / `geoZoom` / `clickGeo` / `renderGeoRegion` /
  `setExploreLens`.
- `index.html` §03 — full-width map, the `#explore-lens` Regions/Provinces
  toggle, `#hme-geo-layer`, `#hme-geo-back`, and the `.hme-rg-*` styles.
- `treks.html` — `GEO_REGION_GROUPS` + the `/treks#<region>` deep-link filter.
