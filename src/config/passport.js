// Passport OAuth Configuration
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { getUser } = require('../models/UserPG');

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const User = getUser();
        if (!User) return done(null, null);
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
        scope: ['profile', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const User = getUser();
            if (!User) return done(new Error('Database not initialized'), null);
            
            // Check if user exists with this email
            let user = await User.findOne({ where: { email: profile.emails[0].value } });

            if (user) {
                // Update OAuth info if needed
                if (user.provider !== 'google') {
                    await user.update({
                        provider: 'google',
                        providerId: profile.id,
                        avatar: profile.photos[0]?.value || user.avatar,
                        emailVerified: true
                    });
                }
            } else {
                // Create new user
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0]?.value,
                    provider: 'google',
                    providerId: profile.id,
                    emailVerified: true
                });
            }

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));
    console.log('✓ Google OAuth configured');
} else {
    console.log('⚠ Google OAuth not configured (missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)');
}

// GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || '/api/auth/github/callback',
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const User = getUser();
            if (!User) return done(new Error('Database not initialized'), null);
            
            // Get primary email from GitHub
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.local`;
            
            // Check if user exists with this email
            let user = await User.findOne({ where: { email } });

            if (user) {
                // Update OAuth info if needed
                if (user.provider !== 'github') {
                    await user.update({
                        provider: 'github',
                        providerId: profile.id.toString(),
                        avatar: profile.photos[0]?.value || user.avatar
                    });
                }
            } else {
                // Create new user
                user = await User.create({
                    name: profile.displayName || profile.username,
                    email: email,
                    avatar: profile.photos[0]?.value,
                    provider: 'github',
                    providerId: profile.id.toString(),
                    emailVerified: true
                });
            }

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));
    console.log('✓ GitHub OAuth configured');
} else {
    console.log('⚠ GitHub OAuth not configured (missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET)');
}

module.exports = passport;
