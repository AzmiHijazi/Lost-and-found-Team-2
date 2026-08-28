const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

require('dotenv').config();

const connectDB = require('./config/db');

const app = express();


// Connect the application to MongoDB
connectDB();


// EJS setup
app.set('view engine', 'ejs');

app.set(
    'views',
    path.join(__dirname, 'views')
);


// Read form data
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(cookieParser());


// Public folder
app.use(
    express.static(
        path.join(__dirname, 'public')
    )
);


// Session setup
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);


// Footer year
app.locals.year =
    new Date().getFullYear();


// Make the logged-in user available
// to every EJS view
app.use((req, res, next) => {
    res.locals.user =
        req.session.user || null;

    next();
});


// Import routes
const indexRoutes =
    require('./routes/index');

const itemRoutes =
    require('./routes/items');

const authRoutes =
    require('./routes/auth');

const submissionRoutes =
    require('./routes/submissions');

const dashboardRoutes =
    require('./routes/dashboard');

const preferenceRoutes =
    require('./routes/preferences');

const searchRoutes =
    require('./routes/search');

const adminRoutes =
    require('./routes/admin');


// Mount routes
app.use('/', indexRoutes);
app.use('/items', itemRoutes);
app.use('/', authRoutes);
app.use('/', submissionRoutes);
app.use('/', dashboardRoutes);
app.use('/', preferenceRoutes);
app.use('/', searchRoutes);
app.use('/', adminRoutes);


// 404 page
app.use((req, res) => {
    res.status(404).render(
        '404',
        {
            title: 'Page Not Found',
            currentPage: ''
        }
    );
});


// General error handler
app.use((error, req, res, next) => {
    console.error(error);

    res.status(500).send(
        'A server error occurred. Please try again.'
    );
});


// Start server
app.listen(8080, () => {
    console.log(
        'Server is running on port 8080'
    );
});