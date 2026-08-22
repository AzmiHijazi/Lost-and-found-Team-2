const express = require('express');
const router = express.Router();

const Item = require('../models/Item');
const Category = require('../models/Category');

router.get('/search', async (req, res, next) => {
    try {
        const filters = {
            keyword: (req.query.keyword || '').trim(),
            category: req.query.category || '',
            status: req.query.status || ''
        };

        const query = {};

        if (filters.keyword) {
            query.itemName = { $regex: filters.keyword, $options: 'i' };
        }

        if (filters.category) {
            query.category = filters.category;
        }

        if (filters.status) {
            query.status = filters.status;
        }

        const results = await Item.find(query)
            .populate('category')
            .populate('owner', 'name')
            .sort({ createdAt: -1 });

        const categories = await Category.find().sort({ name: 1 });

        res.render('search', {
            title: 'Search Items | Lost & Found',
            currentPage: 'search',
            results,
            filters,
            categories
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
