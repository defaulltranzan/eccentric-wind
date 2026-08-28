const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const inquiryController = require('../controllers/inquiryController');
const { validateSavePayload, validateInquiry } = require('../middleware/validator');
const { apiLimiter } = require('../config/security');

// Content database read/write
router.get('/content', contentController.getContent);
router.post('/save', apiLimiter, validateSavePayload, contentController.saveContent);

// Expedition Inquiry / Intent submission
router.post('/inquiry', apiLimiter, validateInquiry, inquiryController.submitInquiry);

module.exports = router;
