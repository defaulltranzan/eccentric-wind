const express = require('express');
const rateLimit = require('express-rate-limit');
const admin = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/adminSession');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.LOGIN_RATE_LIMIT, 10) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many sign-in attempts. Try again in 15 minutes.' }
});

const COLLECTION = ':collection(treks|expeditions|stories)';

router.post('/login', loginLimiter, admin.login);
router.post('/logout', admin.logout);
router.get('/me', admin.me);

router.use(requireAdmin);

router.get('/dashboard', admin.dashboard);
router.get('/pulse', admin.pulse);

router.get('/bookings', admin.bookings);
router.get('/bookings.csv', admin.bookingsCsv);
router.patch('/bookings/:id', admin.updateBooking);
router.delete('/bookings/:id', admin.removeBooking);

router.post('/upload', express.raw({ type: () => true, limit: '9mb' }), admin.upload);

router.get('/' + COLLECTION, admin.list);
router.post('/' + COLLECTION, admin.create);
router.get('/' + COLLECTION + '/:slug', admin.get);
router.put('/' + COLLECTION + '/:slug', admin.update);
router.patch('/' + COLLECTION + '/:slug/publish', admin.publish);
router.post('/' + COLLECTION + '/:slug/move', admin.move);
router.delete('/' + COLLECTION + '/:slug', admin.remove);

module.exports = router;
