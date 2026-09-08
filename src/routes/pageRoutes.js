const express = require('express');
const path = require('path');
const router = express.Router();

const PUBLIC_DIR = path.join(__dirname, '../../public');

// Core SEO Page Routing
router.get('/', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));
router.get('/about', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'about.html')));
router.get('/services', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'services.html')));
router.get('/contact', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'contact.html')));
router.get('/expeditions', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'expeditions.html')));
// Peak database — elevation-band collections + reusable individual-peak template.
// These MUST be declared before the catch-all /expeditions/:slug below.
router.get('/expeditions/:band(8000m|7000m|6000m|trekking-peaks)', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'collection.html')));
router.get('/expeditions/peaks', (req, res) => res.redirect(301, '/expeditions'));
router.get('/expeditions/peaks/:slug', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'expedition.html')));
router.get('/expeditions/:slug', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'expedition.html')));

// Trekking Trails — directory + reusable individual-trail template
router.get('/treks', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'treks.html')));
router.get('/treks/:slug', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'trek.html')));
router.get('/compare', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'compare.html')));
router.get('/altitude-safety', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'altitude-safety.html')));

// Merged pages (2026-09-07): the Gear checklist now lives on the Altitude & Safety
// page, and Sherpa Heritage + a contact section live on the About page. The old
// paths 301 here so existing links and search results stay valid.
router.get('/gear', (req, res) => res.redirect(301, '/altitude-safety#gear'));
router.get('/about-sherpa', (req, res) => res.redirect(301, '/about#sherpa'));

// Stories / Field Journal — index + reusable article template.
// The old /dispatches path 301s here so existing links and the sitemap stay valid.
router.get('/stories', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'stories.html')));
router.get('/stories/:slug', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'story.html')));
router.get('/dispatches', (req, res) => res.redirect(301, '/stories'));
router.get('/dispatches/:slug', (req, res) => res.redirect(301, `/stories/${req.params.slug}`));

// SEO Crawlers
router.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.sendFile(path.join(PUBLIC_DIR, 'sitemap.xml'));
});

router.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(PUBLIC_DIR, 'robots.txt'));
});

module.exports = router;
