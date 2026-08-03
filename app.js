const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const currentYear = new Date().getFullYear();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const emptyContactForm = () => ({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const cleanText = (value) => (typeof value === 'string' ? value.trim() : '');

function renderContact(res, { form = emptyContactForm(), errors = {}, sent = false } = {}) {
  res.render('contact', {
    title: 'Contact us | Lost & Found',
    form,
    errors,
    sent,
    year: currentYear,
  });
}

app.get('/', (_req, res) => {
  res.redirect('/contact');
});

app.get('/contact', (_req, res) => {
  renderContact(res);
});

app.post('/contact', (req, res) => {
  const form = {
    name: cleanText(req.body.name),
    email: cleanText(req.body.email),
    subject: cleanText(req.body.subject),
    message: cleanText(req.body.message),
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
      title: 'Contact us | Lost & Found',
      form,
      errors,
      sent: false,
      year: currentYear,
    });
  }

  // This route is ready to be connected to an email service or database later.
  return renderContact(res, { sent: true });
});

app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Page not found | Lost & Found',
    year: currentYear,
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Lost & Found is running at http://localhost:${port}`);
  });
}

module.exports = app;
