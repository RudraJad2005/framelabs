// API Routes
const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Contact Form
router.post('/contact', apiController.submitContact);

// Newsletter
router.post('/newsletter', apiController.subscribeNewsletter);

// Waitlist
router.post('/waitlist', apiController.joinWaitlist);

module.exports = router;
