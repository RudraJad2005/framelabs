// Auth Middleware - Protect routes (PostgreSQL/Supabase version)
const jwt = require('jsonwebtoken');
const { getUser } = require('../models/UserPG');

exports.protect = async (req, res, next) => {
    let token;

    // Check header or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        const User = getUser();
        if (!User) {
            return res.status(500).json({
                success: false,
                message: 'Database not initialized'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        req.user = await User.findByPk(decoded.id);
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'User role is not authorized to access this route'
            });
        }
        next();
    };
};
