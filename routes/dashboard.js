// Dashboard route - owner: Omar
const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/auth');

// GET /dashboard - only reachable after login.
// The logged-in user comes from res.locals.user (set in app.js),
// so this route does not need to pass it.
router.get('/dashboard', requireLogin, (req, res) => {
    res.render('dashboard', {
        title: 'Dashboard | Lost & Found',
        currentPage: 'dashboard'
    });
});

module.exports = router;
