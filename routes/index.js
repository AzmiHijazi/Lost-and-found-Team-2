// Main page routes — owner: Omar (routing only).
// The views rendered here are built by teammates; each route passes exactly the
// variables that teammate's template reads.
const express = require('express');
const router = express.Router();

const CONTACT_TITLE = 'Contact us | Lost & Found';

const emptyContactForm = () => ({ name: '', email: '', subject: '', message: '' });
const cleanText = (value) => (typeof value === 'string' ? value.trim() : '');

// GET / — Home Page (view: views/index.ejs — Azmi)
router.get('/', (req, res) => {
  res.render('index', { title: 'Home | Lost & Found', currentPage: 'home' });
});

// GET /about — About Page (view: views/about.ejs)
router.get('/about', (req, res) => {
  res.render('about', { title: 'About | Lost & Found', currentPage: 'about' });
});

// GET /contact — Contact Page (view: views/contact.ejs — Ahmad).
// contact.ejs reads form, errors and sent with no guards, so all three must be
// passed or EJS throws.
router.get('/contact', (req, res) => {
  res.render('contact', {
    title: CONTACT_TITLE,
    currentPage: 'contact',
    form: emptyContactForm(),
    errors: {},
    sent: false,
  });
});

// POST /contact — validation written by Ahmad, moved here so it lives in /routes.
router.post('/contact', (req, res) => {
  // Express 5 leaves req.body undefined when it skips parsing (e.g. a request
  // with no Content-Type), so guard before reading fields.
  const body = req.body || {};

  const form = {
    name: cleanText(body.name),
    email: cleanText(body.email),
    subject: cleanText(body.subject),
    message: cleanText(body.message),
  };

  const errors = {};

  if (!form.name) {
    errors.name = 'Please enter your name.';
  } else if (form.name.length > 80) {
    errors.name = 'Your name must be 80 characters or fewer.';
  }

  if (!form.email) {
    errors.email = 'Please enter your email address.';
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!form.subject) {
    errors.subject = 'Please choose a subject.';
  }

  if (!form.message) {
    errors.message = 'Tell us how we can help.';
  } else if (form.message.length > 1500) {
    errors.message = 'Your message must be 1,500 characters or fewer.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).render('contact', {
      title: CONTACT_TITLE,
      currentPage: 'contact',
      form,
      errors,
      sent: false,
    });
  }

  res.render('contact', {
    title: CONTACT_TITLE,
    currentPage: 'contact',
    form: emptyContactForm(),
    errors: {},
    sent: true,
  });
});

module.exports = router;
