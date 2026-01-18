// Page Controller - Renders EJS templates

exports.getHome = (req, res) => {
    res.render('pages/home', {
        title: 'FrameLab - The Python Framework for AI Agent Testing',
        page: 'home'
    });
};

exports.getFeatures = (req, res) => {
    res.render('pages/features', {
        title: 'Features - FrameLab',
        page: 'features'
    });
};

exports.getPricing = (req, res) => {
    res.render('pages/pricing', {
        title: 'Pricing - FrameLab',
        page: 'pricing'
    });
};

exports.getDocs = (req, res) => {
    res.render('pages/docs', {
        title: 'Documentation - FrameLab',
        page: 'docs'
    });
};

exports.getBlog = (req, res) => {
    res.render('pages/blog', {
        title: 'Blog - FrameLab',
        page: 'blog'
    });
};

exports.getAbout = (req, res) => {
    res.render('pages/about', {
        title: 'About Us - FrameLab',
        page: 'about'
    });
};

exports.getContact = (req, res) => {
    res.render('pages/contact', {
        title: 'Contact - FrameLab',
        page: 'contact'
    });
};

exports.getLogin = (req, res) => {
    // Redirect to dashboard if already logged in
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.render('pages/login', {
        title: 'Login - FrameLab',
        page: 'login'
    });
};

exports.getSignup = (req, res) => {
    // Redirect to dashboard if already logged in
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.render('pages/signup', {
        title: 'Sign Up - FrameLab',
        page: 'signup'
    });
};

exports.getDashboard = (req, res) => {
    // Redirect to login if not authenticated
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.redirect('/login');
    }
    res.render('pages/dashboard', {
        title: 'Dashboard - FrameLab',
        page: 'dashboard',
        user: req.user,
        isAuthenticated: true
    });
};

exports.getTestSuites = (req, res) => {
    // Redirect to login if not authenticated
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.redirect('/login');
    }
    res.render('pages/test-suites', {
        title: 'Test Suites - FrameLab',
        page: 'test-suites',
        user: req.user,
        isAuthenticated: true
    });
};

exports.getTestRuns = (req, res) => {
    // Redirect to login if not authenticated
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.redirect('/login');
    }
    res.render('pages/test-runs', {
        title: 'Test Runs - FrameLab',
        page: 'test-runs',
        user: req.user,
        isAuthenticated: true
    });
};
