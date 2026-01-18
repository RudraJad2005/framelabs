// Authentication Routes
const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/logout', authController.logoutRedirect); // GET logout for direct links

// Google OAuth routes
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

router.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: '/login?error=google_auth_failed' 
    }),
    authController.oauthSuccess
);

// GitHub OAuth routes
router.get('/github', passport.authenticate('github', { 
    scope: ['user:email'] 
}));

router.get('/github/callback', 
    passport.authenticate('github', { 
        failureRedirect: '/login?error=github_auth_failed' 
    }),
    authController.oauthSuccess
);

// Protected routes
router.get('/me', protect, authController.getMe);
router.put('/update', protect, authController.updateProfile);

module.exports = router;
