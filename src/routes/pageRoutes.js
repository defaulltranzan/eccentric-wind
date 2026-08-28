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
router.get('/expeditions/:slug', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'expedition.html')));

// Trekking Trails — directory + reusable individual-trail template
router.get('/treks', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'treks.html')));
router.get('/treks/:slug', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'trek.html')));
router.get('/altitude-safety', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'altitude-safety.html')));
router.get('/about-sherpa', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'about-sherpa.html')));
router.get('/dispatches', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'dispatches.html')));

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
