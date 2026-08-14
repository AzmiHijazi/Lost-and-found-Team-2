const express = require('express');
const router = express.Router();

const submissions = require('../data/submissions');

router.get('/search', (req, res) => {
    const keyword = req.query.keyword || '';
    const category = req.query.category || '';
    const status = req.query.status || '';

    let results = submissions;

    // Search by keyword
    if (keyword !== '') {
        results = results.filter((item) => {
            return item.itemName.toLowerCase().includes(keyword.toLowerCase());
        });
    }

    // Filter by category
    if (category !== '') {
        results = results.filter((item) => {
            return item.category === category;
        });
    }

    // Filter by status
    if (status !== '') {
        results = results.filter((item) => {
            return item.status === status;
        });
    }

    res.render('search', {
        title: 'Search Items | Lost & Found',
        currentPage: 'search',
        results: results,
        filters: {
            keyword: keyword,
            category: category,
            status: status
        }
    });
});

module.exports = router;
