// Session guards - owner: Omar

// Blocks a page unless the visitor is logged in.
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

// Sends a logged-in user away from the login and register pages.
function redirectIfLoggedIn(req, res, next) {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    next();
}

module.exports = { requireLogin, redirectIfLoggedIn };
