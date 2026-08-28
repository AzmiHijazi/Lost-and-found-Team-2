// Admin panel and report - owner: Omar
const express = require('express');
const router = express.Router();

const { requireAdmin } = require('../middleware/auth');

const User = require('../models/User');
const Item = require('../models/Item');
const Contact = require('../models/Contact');
const Category = require('../models/Category');
const ActivityLog = require('../models/ActivityLog');

// GET /admin - lists records from several collections
router.get('/admin', requireAdmin, async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        // .populate() swaps the stored ObjectId for the real document
        const items = await Item.find()
            .populate('category')
            .populate('owner')
            .sort({ createdAt: -1 });

        const messages = await Contact.find().sort({ createdAt: -1 });

        const logs = await ActivityLog.find()
            .populate('user')
            .sort({ createdAt: -1 })
            .limit(10);

        res.render('admin', {
            title: 'Admin Panel | Lost & Found',
            currentPage: 'admin',
            users,
            items,
            messages,
            logs
        });
    } catch (error) {
        next(error);
    }
});

// GET /admin/report - counts and a grouped summary
router.get('/admin/report', requireAdmin, async (req, res, next) => {
    try {
        const userCount = await User.countDocuments();
        const itemCount = await Item.countDocuments();
        const messageCount = await Contact.countDocuments();
        const categoryCount = await Category.countDocuments();

        // Aggregation: group the items by status and count each group
        const itemsByStatus = await Item.aggregate([
            { $group: { _id: '$status', total: { $sum: 1 } } },
            { $sort: { total: -1 } }
        ]);

        res.render('report', {
            title: 'Report | Lost & Found',
            currentPage: 'report',
            userCount,
            itemCount,
            messageCount,
            categoryCount,
            itemsByStatus
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
