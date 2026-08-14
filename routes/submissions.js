const express = require('express');
const router = express.Router();

const submissions = require('../data/submissions');
const { requireLogin } = require('../middleware/auth');

// Show Report Item page
router.get('/report-item', requireLogin, (req, res) => {
    res.render('report-item', {
        title: 'Report Item | Lost & Found',
        currentPage: 'report',
        errors: {},
        form: {
            itemName: '',
            category: '',
            status: '',
            location: '',
            date: '',
            description: ''
        }
    });
});

// Handle Report Item form
router.post('/report-item', requireLogin, (req, res) => {
    const form = {
        itemName: req.body.itemName.trim(),
        category: req.body.category.trim(),
        status: req.body.status.trim(),
        location: req.body.location.trim(),
        date: req.body.date.trim(),
        description: req.body.description.trim()
    };

    const errors = {};

    // Validation
    if (form.itemName === '') {
        errors.itemName = 'Please enter the item name.';
    }

    if (form.category === '') {
        errors.category = 'Please choose a category.';
    }

    if (form.status === '') {
        errors.status = 'Please choose Lost or Found.';
    }

    if (form.location === '') {
        errors.location = 'Please enter the location.';
    }

    if (form.date === '') {
        errors.date = 'Please choose a date.';
    }

    if (form.description === '') {
        errors.description = 'Please enter a description.';
    }

    // If there are errors, show the form again
    if (Object.keys(errors).length > 0) {
        return res.status(422).render('report-item', {
            title: 'Report Item | Lost & Found',
            currentPage: 'report',
            errors: errors,
            form: form
        });
    }

    // Create submission
    const newSubmission = {
        id: submissions.length + 1,
        userId: req.session.user.id,
        itemName: form.itemName,
        category: form.category,
        status: form.status,
        location: form.location,
        date: form.date,
        description: form.description
    };

    // Add submission to temporary array
    submissions.push(newSubmission);

    // Go to My Submissions
    res.redirect('/my-submissions');
});

// Show only submissions created by logged-in user
router.get('/my-submissions', requireLogin, (req, res) => {
    const mySubmissions = submissions.filter((submission) => {
        return submission.userId === req.session.user.id;
    });

    res.render('my-submissions', {
        title: 'My Submissions | Lost & Found',
        currentPage: 'submissions',
        submissions: mySubmissions
    });
});

module.exports = router;
