// Main page routes — owner: Omar (routing only).
// The views rendered here (index, about, contact) are built by teammates on
// their own branches. Until their branches merge, these routes will show a
// "Failed to lookup view" error — that is expected.
const express = require('express');
const router = express.Router();

// GET / — Home Page (view comes from Azmi)
router.get('/', (req, res) => {
  res.render('index', { title: 'Home', active: 'home' });
});

// GET /about — About Page (view comes from Ahmad)
router.get('/about', (req, res) => {
  res.render('about', { title: 'About', active: 'about' });
});

// GET /contact — Contact Page (view comes from Hashem)
router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact', active: 'contact' });
});

module.exports = router;
