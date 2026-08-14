const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Temporary users array
// The data will be removed whenever the server restarts.
const users = [];

// Register page
router.get('/register', (req, res) => {

    res.render('register', {
        title: 'Register | Lost & Found',
        currentPage: 'register',
        errors: {},
        old: {
            name: '',
            email: ''
        }
    });

});


// Register form
router.post(
    '/register',

    [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Please enter your name.'),

        body('email')
            .trim()
            .notEmpty()
            .withMessage('Please enter your email.')
            .bail()
            .isEmail()
            .withMessage('Please enter a valid email address.'),

        body('password')
            .notEmpty()
            .withMessage('Please enter a password.')
            .bail()
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters.'),

        body('confirmPassword')
            .notEmpty()
            .withMessage('Please confirm your password.')
            .bail()
            .custom((value, { req }) => {

                if (value !== req.body.password) {
                    throw new Error('Passwords do not match.');
                }

                return true;
            })
    ],

    async (req, res) => {

        const validationErrors = validationResult(req);
        const errors = validationErrors.mapped();

        const name = req.body.name.trim();
        const email = req.body.email.trim().toLowerCase();
        const password = req.body.password;

        // Check validation errors
        if (!validationErrors.isEmpty()) {

            return res.status(422).render('register', {
                title: 'Register | Lost & Found',
                currentPage: 'register',
                errors: errors,
                old: {
                    name: name,
                    email: email
                }
            });

        }

        // Check if email already exists
        const existingUser = users.find((user) => {
            return user.email === email;
        });

        if (existingUser) {

            errors.email = {
                msg: 'This email is already registered.'
            };

            return res.status(422).render('register', {
                title: 'Register | Lost & Found',
                currentPage: 'register',
                errors: errors,
                old: {
                    name: name,
                    email: email
                }
            });

        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create temporary user
        const newUser = {
            id: users.length + 1,
            name: name,
            email: email,
            password: hashedPassword,
            role: 'user'
        };

        // Save user in temporary array
        users.push(newUser);

        // Go to login page
        res.redirect('/login');
    }
);


// Login page
router.get('/login', (req, res) => {

    res.render('login', {
        title: 'Login | Lost & Found',
        currentPage: 'login',
        errors: {},
        old: {
            email: ''
        }
    });

});


// Login form
router.post(
    '/login',

    [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Please enter your email.')
            .bail()
            .isEmail()
            .withMessage('Please enter a valid email address.'),

        body('password')
            .notEmpty()
            .withMessage('Please enter your password.')
    ],

    async (req, res) => {

        const validationErrors = validationResult(req);
        const errors = validationErrors.mapped();

        const email = req.body.email.trim().toLowerCase();
        const password = req.body.password;

        // Check validation errors
        if (!validationErrors.isEmpty()) {

            return res.status(422).render('login', {
                title: 'Login | Lost & Found',
                currentPage: 'login',
                errors: errors,
                old: {
                    email: email
                }
            });

        }

        // Find user
        const user = users.find((user) => {
            return user.email === email;
        });

        if (!user) {

            errors.general = {
                msg: 'Incorrect email or password.'
            };

            return res.status(422).render('login', {
                title: 'Login | Lost & Found',
                currentPage: 'login',
                errors: errors,
                old: {
                    email: email
                }
            });

        }

        // Compare entered password with hashed password
        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {

            errors.general = {
                msg: 'Incorrect email or password.'
            };

            return res.status(422).render('login', {
                title: 'Login | Lost & Found',
                currentPage: 'login',
                errors: errors,
                old: {
                    email: email
                }
            });

        }

        // Save login information in the session
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        res.redirect('/');
    }
);


// Logout
router.get('/logout', (req, res) => {

    req.session.destroy((error) => {

        if (error) {
            return res.status(500).send('Could not log out.');
        }

        res.clearCookie('connect.sid');

        res.redirect('/login');
    });

});


module.exports = router;