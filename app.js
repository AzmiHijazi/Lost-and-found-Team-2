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

// Routes
const indexRoutes = require('./routes/index');
const itemRoutes = require('./routes/items');
const authRoutes = require('./routes/auth');

app.use('/', indexRoutes);
app.use('/items', itemRoutes);
app.use('/', authRoutes);

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