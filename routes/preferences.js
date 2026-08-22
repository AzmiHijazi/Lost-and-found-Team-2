const express = require('express');

const router = express.Router();

router.get('/cookie-preferences', (req, res) => {
    const preference =
        req.cookies.cookiePreference || 'essential';

    res.render('cookie-preferences', {
        title: 'Cookie Preferences | Lost & Found',
        currentPage: 'preferences',
        preference: preference
    });
});

router.post('/cookie-preferences', (req, res) => {
    const preference = req.body.preference;

    if (
        preference !== 'accepted' &&
        preference !== 'essential'
    ) {
        return res.redirect('/cookie-preferences');
    }

    res.cookie(
        'cookiePreference',
        preference,
        {
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
    );

    res.redirect('/cookie-preferences');
});

module.exports = router;