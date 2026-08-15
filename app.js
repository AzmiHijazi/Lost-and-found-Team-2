const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Read form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Public folder
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Footer year
app.locals.year = new Date().getFullYear();

// Make the logged-in user available to every view (owner: Omar).
// res.locals is merged into every res.render, so no route has to pass it.
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes
const indexRoutes = require('./routes/index');
const itemRoutes = require('./routes/items');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const preferenceRoutes = require('./routes/preferences');

app.use('/', indexRoutes);
app.use('/items', itemRoutes);
app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/', preferenceRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Page Not Found',
        currentPage: ''
    });
});

// Start server
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});