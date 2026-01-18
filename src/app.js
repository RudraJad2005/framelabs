// FrameLab - Main Application Entry Point
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

// Import routes
const pageRoutes = require('./routes/pageRoutes');
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');

// Import Supabase database connection
const { connectDB, getSequelize } = require('./config/supabase');
const { initUserModel, syncUserModel } = require('./models/UserPG');

// Initialize Express app
const app = express();

// Connect to Database and initialize models
const initializeDB = async () => {
    const sequelize = await connectDB();
    if (sequelize) {
        initUserModel(sequelize);
        await syncUserModel(); // Sync table after model is defined
    }
    
    // Import passport config AFTER models are initialized
    require('./config/passport');
};

initializeDB();

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false // Disable for development
}));
app.use(cors());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// Session for Passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'framelab-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Make user available to all views
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

// Logging (development only)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Static Files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/', pageRoutes);
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).render('pages/404', { title: '404 - Page Not Found', page: '404' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('pages/error', { 
        title: 'Error',
        page: 'error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 FrameLab server running on http://localhost:${PORT}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
});
