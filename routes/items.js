const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

router.get('/', async (req, res, next) => {
    try {
        const items = await Item.find()
            .populate('category')
            .populate('owner', 'name email')
            .sort({ createdAt: -1 });

        res.render('items', {
            title: 'Items | Lost & Found',
            currentPage: 'items',
            items
        });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id)
            .populate('category')
            .populate('owner', 'name email');

        if (!item) {
            return res.status(404).render('404', { title: 'Item not found', currentPage: '' });
        }

        res.render('item-details', {
            title: `${item.itemName} | Lost & Found`,
            currentPage: 'items',
            item
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
