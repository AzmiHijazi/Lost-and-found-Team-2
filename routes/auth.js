const express = require('express');
const bcrypt = require('bcryptjs');

const {
    body,
    validationResult
} = require('express-validator');

const {
    redirectIfLoggedIn
} = require('../middleware/auth');

const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

const router = express.Router();


// Display registration page
router.get(
    '/register',
    redirectIfLoggedIn,
    (req, res) => {
        res.render(
            'register',
            {
                title:
                    'Register | Lost & Found',

                currentPage:
                    'register',

                errors: {},

                old: {
                    name: '',
                    email: ''
                }
            }
        );
    }
);


// Process registration form
router.post(
    '/register',

    redirectIfLoggedIn,

    [
        body('name')
            .trim()
            .notEmpty()
            .withMessage(
                'Please enter your name.'
            ),

        body('email')
            .trim()
            .notEmpty()
            .withMessage(
                'Please enter your email.'
            )
            .bail()
            .isEmail()
            .withMessage(
                'Please enter a valid email address.'
            ),

        body('password')
            .notEmpty()
            .withMessage(
                'Please enter a password.'
            )
            .bail()
            .isLength({
                min: 6
            })
            .withMessage(
                'Password must be at least 6 characters.'
            ),

        body('confirmPassword')
            .notEmpty()
            .withMessage(
                'Please confirm your password.'
            )
            .bail()
            .custom(
                (value, { req }) => {
                    if (
                        value !==
                        req.body.password
                    ) {
                        throw new Error(
                            'Passwords do not match.'
                        );
                    }

                    return true;
                }
            )
    ],

    async (req, res, next) => {
        try {
            const validationErrors =
                validationResult(req);

            const errors =
                validationErrors.mapped();

            const old = {
                name:
                    req.body.name
                        .trim(),

                email:
                    req.body.email
                        .trim()
                        .toLowerCase()
            };

            if (
                !validationErrors.isEmpty()
            ) {
                return res
                    .status(422)
                    .render(
                        'register',
                        {
                            title:
                                'Register | Lost & Found',

                            currentPage:
                                'register',

                            errors:
                                errors,

                            old:
                                old
                        }
                    );
            }

            const existingUser =
                await User.findOne({
                    email:
                        old.email
                });

            if (existingUser) {
                errors.email = {
                    msg:
                        'This email is already registered.'
                };

                return res
                    .status(422)
                    .render(
                        'register',
                        {
                            title:
                                'Register | Lost & Found',

                            currentPage:
                                'register',

                            errors:
                                errors,

                            old:
                                old
                        }
                    );
            }

            const hashedPassword =
                await bcrypt.hash(
                    req.body.password,
                    10
                );

            const newUser =
                new User({
                    name:
                        old.name,

                    email:
                        old.email,

                    password:
                        hashedPassword,

                    role:
                        'user'
                });

            await newUser.save();

            res.redirect('/login');
        } catch (error) {
            next(error);
        }
    }
);


// Display login page
router.get(
    '/login',
    redirectIfLoggedIn,
    (req, res) => {
        res.render(
            'login',
            {
                title:
                    'Login | Lost & Found',

                currentPage:
                    'login',

                errors: {},

                old: {
                    email: ''
                }
            }
        );
    }
);


// Process login form
router.post(
    '/login',

    redirectIfLoggedIn,

    [
        body('email')
            .trim()
            .notEmpty()
            .withMessage(
                'Please enter your email.'
            )
            .bail()
            .isEmail()
            .withMessage(
                'Please enter a valid email address.'
            ),

        body('password')
            .notEmpty()
            .withMessage(
                'Please enter your password.'
            )
    ],

    async (req, res, next) => {
        try {
            const validationErrors =
                validationResult(req);

            const errors =
                validationErrors.mapped();

            const email =
                req.body.email
                    .trim()
                    .toLowerCase();

            const password =
                req.body.password;

            if (
                !validationErrors.isEmpty()
            ) {
                return res
                    .status(422)
                    .render(
                        'login',
                        {
                            title:
                                'Login | Lost & Found',

                            currentPage:
                                'login',

                            errors:
                                errors,

                            old: {
                                email:
                                    email
                            }
                        }
                    );
            }

            const user =
                await User.findOne({
                    email:
                        email
                });

            if (!user) {
                errors.general = {
                    msg:
                        'Incorrect email or password.'
                };

                return res
                    .status(422)
                    .render(
                        'login',
                        {
                            title:
                                'Login | Lost & Found',

                            currentPage:
                                'login',

                            errors:
                                errors,

                            old: {
                                email:
                                    email
                            }
                        }
                    );
            }

            const passwordMatches =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!passwordMatches) {
                errors.general = {
                    msg:
                        'Incorrect email or password.'
                };

                return res
                    .status(422)
                    .render(
                        'login',
                        {
                            title:
                                'Login | Lost & Found',

                            currentPage:
                                'login',

                            errors:
                                errors,

                            old: {
                                email:
                                    email
                            }
                        }
                    );
            }

            req.session.user = {
                id:
                    user._id.toString(),

                name:
                    user.name,

                email:
                    user.email,

                role:
                    user.role
            };

            // Record the login so the admin panel can show it
            await ActivityLog.create({
                user: user._id,
                action: 'Logged in'
            });

            req.session.save(
                (error) => {
                    if (error) {
                        return next(error);
                    }

                    res.redirect(
                        '/dashboard'
                    );
                }
            );
        } catch (error) {
            next(error);
        }
    }
);


// Logout
router.get(
    '/logout',
    (req, res, next) => {
        req.session.destroy(
            (error) => {
                if (error) {
                    return next(error);
                }

                res.clearCookie(
                    'connect.sid'
                );

                res.redirect(
                    '/login'
                );
            }
        );
    }
);


module.exports = router;