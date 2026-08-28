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

// Blocks a page unless the logged-in user is an admin.
function requireAdmin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    if (req.session.user.role !== 'admin') {
        return res.status(403).render('404', {
            title: 'Admins only',
            currentPage: ''
        });
    }

    next();
}

module.exports = { requireLogin, redirectIfLoggedIn, requireAdmin };
