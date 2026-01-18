// Page Routes - Serves HTML pages
const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

// Main Pages
router.get('/', pageController.getHome);
router.get('/features', pageController.getFeatures);
router.get('/pricing', pageController.getPricing);
router.get('/docs', pageController.getDocs);
router.get('/blog', pageController.getBlog);
router.get('/about', pageController.getAbout);
router.get('/contact', pageController.getContact);

// Auth Pages
router.get('/login', pageController.getLogin);
router.get('/signup', pageController.getSignup);

// Dashboard Pages
router.get('/dashboard', pageController.getDashboard);
router.get('/dashboard/tests', pageController.getTestSuites);
router.get('/dashboard/runs', pageController.getTestRuns);

module.exports = router;
