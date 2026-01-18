// Auth Controller - Handles authentication (PostgreSQL/Supabase version)
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUser } = require('../models/UserPG');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Send token response (for API/JSON responses)
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user.id);

    const options = {
        expires: new Date(Date.now() + (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
};

// OAuth Success Handler - Redirects after successful OAuth
exports.oauthSuccess = (req, res) => {
    if (req.user) {
        const token = generateToken(req.user.id);
        
        // Set token in cookie
        res.cookie('token', token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });
        
        // Redirect to dashboard with token in URL (for localStorage storage)
        res.redirect(`/dashboard?auth=success&token=${token}`);
    } else {
        res.redirect('/login?error=auth_failed');
    }
};

// Register User
exports.register = async (req, res) => {
    try {
        const User = getUser();
        if (!User) {
            return res.status(500).json({
                success: false,
                message: 'Database not initialized'
            });
        }

        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create user (password will be hashed by model hook)
        const user = await User.create({
            name,
            email,
            password,
            provider: 'local'
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const User = getUser();
        if (!User) {
            return res.status(500).json({
                success: false,
                message: 'Database not initialized'
            });
        }

        const { email, password } = req.body;

        // Validate
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user has a password (OAuth users might not)
        if (!user.password) {
            return res.status(401).json({
                success: false,
                message: `This account uses ${user.provider} login. Please use that method.`
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Logout
exports.logout = (req, res) => {
    // Clear JWT cookie
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    
    // Logout from passport session
    req.logout && req.logout(function(err) {});

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

// Logout with redirect (GET request)
exports.logoutRedirect = (req, res) => {
    // Clear JWT cookie
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    
    // Logout from passport session
    req.logout && req.logout(function(err) {});
    
    res.redirect('/');
};

// Get current user
exports.getMe = async (req, res) => {
    try {
        const User = getUser();
        if (!User) {
            return res.status(500).json({
                success: false,
                message: 'Database not initialized'
            });
        }

        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const User = getUser();
        if (!User) {
            return res.status(500).json({
                success: false,
                message: 'Database not initialized'
            });
        }

        const { name, email } = req.body;

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.update({ name, email });

        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
