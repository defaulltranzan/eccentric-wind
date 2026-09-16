const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const contentController = require('../controllers/contentController');
const publicController = require('../controllers/publicController');
const { validateSavePayload } = require('../middleware/validator');
const { apiLimiter } = require('../config/security');
const { requireAdmin } = require('../middleware/auth');
const adminRoutes = require('./adminRoutes');

const bookingLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: parseInt(process.env.BOOKING_RATE_LIMIT, 10) || 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests from this connection. Please try again shortly, or message us on WhatsApp.' }
});

// Legacy homepage content file (edit.js) — public read, token-gated write
router.get('/content', contentController.getContent);
router.post('/save', apiLimiter, requireAdmin, validateSavePayload, contentController.saveContent);

// Public: trip list for booking forms, booking submissions
router.get('/health', publicController.health);
router.get('/trips', publicController.trips);
router.post('/bookings', bookingLimiter, publicController.createBooking);
router.post('/inquiry', bookingLimiter, publicController.createBooking); // older forms

// Admin dashboard API
router.use('/admin', adminRoutes);

module.exports = router;
