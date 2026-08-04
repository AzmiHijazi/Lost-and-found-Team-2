// Main page routes — owner: Omar (routing only).
// The views rendered here are built by teammates on their own branches; each
// route passes exactly the variables that teammate's template reads.
const express = require('express');
const router = express.Router();

// GET / — Home Page (view: views/index.ejs — Azmi)
router.get('/', (req, res) => {
  res.render('index', { title: 'Home | Lost & Found', currentPage: 'home' });
});

// GET /about — About Page (view: views/about.ejs — Ahmad)
router.get('/about', (req, res) => {
  res.render('about', { title: 'About | Lost & Found', currentPage: 'about' });
});

// GET /contact — Contact Page (view: views/contact.ejs — Hashem).
// contact.ejs reads form, errors and sent with no guards, so all three must be
// passed or EJS throws. Phase 1 keeps this form static — the POST handler is
// Hashem's to wire up in Phase 2.
router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact us | Lost & Found',
    currentPage: 'contact',
    form: { name: '', email: '', subject: '', message: '' },
    errors: {},
    sent: false,
  });
});

module.exports = router;
