const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Category = require('../models/Category');
const { requireLogin } = require('../middleware/auth');

function clean(body) {
    return {
        itemName: (body.itemName || '').trim(),
        category: body.category || '',
        status: body.status || '',
        location: (body.location || '').trim(),
        date: body.date || '',
        description: (body.description || '').trim()
    };
}

function validate(form) {
    const errors = {};

    for (const field of ['itemName', 'category', 'status', 'location', 'date', 'description']) {
        if (!form[field]) errors[field] = 'This field is required.';
    }

    if (form.status && !['Lost', 'Found'].includes(form.status)) {
        errors.status = 'Choose Lost or Found.';
    }

    return errors;
}

router.get('/report-item', requireLogin, async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ name: 1 });

        res.render('report-item', {
            title: 'Report Item | Lost & Found',
            currentPage: 'report',
            errors: {},
            form: clean({}),
            categories
        });
    } catch (error) {
        next(error);
    }
});

router.post('/report-item', requireLogin, async (req, res, next) => {
    try {
        const form = clean(req.body);
        const errors = validate(form);
        const categories = await Category.find().sort({ name: 1 });

        if (Object.keys(errors).length) {
            return res.status(422).render('report-item', {
                title: 'Report Item | Lost & Found',
                currentPage: 'report',
                errors,
                form,
                categories
            });
        }

        await new Item({ ...form, owner: req.session.user.id }).save();
        res.redirect('/my-submissions?created=1');
    } catch (error) {
        next(error);
    }
});

router.get('/my-submissions', requireLogin, async (req, res, next) => {
    try {
        const submissions = await Item.find({ owner: req.session.user.id })
            .populate('category')
            .sort({ createdAt: -1 });

        res.render('my-submissions', {
            title: 'My Submissions | Lost & Found',
            currentPage: 'submissions',
            submissions,
            message: req.query.created
                ? 'Item created successfully.'
                : req.query.updated
                    ? 'Item updated successfully.'
                    : req.query.deleted
                        ? 'Item deleted successfully.'
                        : ''
        });
    } catch (error) {
        next(error);
    }
});

router.get('/items/:id/edit', requireLogin, async (req, res, next) => {
    try {
        const item = await Item.findOne({ _id: req.params.id, owner: req.session.user.id });

        if (!item) {
            return res.status(404).render('404', { title: 'Item not found', currentPage: '' });
        }

        const categories = await Category.find().sort({ name: 1 });

        res.render('edit-item', {
            title: 'Edit Item | Lost & Found',
            currentPage: 'submissions',
            item,
            categories,
            errors: {}
        });
    } catch (error) {
        next(error);
    }
});

router.post('/items/:id/edit', requireLogin, async (req, res, next) => {
    try {
        const form = clean(req.body);
        const errors = validate(form);
        const categories = await Category.find().sort({ name: 1 });

        if (Object.keys(errors).length) {
            return res.status(422).render('edit-item', {
                title: 'Edit Item | Lost & Found',
                currentPage: 'submissions',
                item: { _id: req.params.id, ...form },
                categories,
                errors
            });
        }

        const item = await Item.findOneAndUpdate(
            { _id: req.params.id, owner: req.session.user.id },
            form,
            { new: true, runValidators: true }
        );

        if (!item) {
            return res.status(404).render('404', { title: 'Item not found', currentPage: '' });
        }

        res.redirect('/my-submissions?updated=1');
    } catch (error) {
        next(error);
    }
});

router.get('/items/:id/delete', requireLogin, async (req, res, next) => {
    try {
        const item = await Item.findOne({
            _id: req.params.id,
            owner: req.session.user.id
        }).populate('category');

        if (!item) {
            return res.status(404).render('404', { title: 'Item not found', currentPage: '' });
        }

        res.render('delete-item', {
            title: 'Delete Item | Lost & Found',
            currentPage: 'submissions',
            item
        });
    } catch (error) {
        next(error);
    }
});

router.post('/items/:id/delete', requireLogin, async (req, res, next) => {
    try {
        const item = await Item.findOne({ _id: req.params.id, owner: req.session.user.id });

        if (!item) {
            return res.status(404).render('404', { title: 'Item not found', currentPage: '' });
        }

        await Item.findByIdAndDelete(req.params.id);
        res.redirect('/my-submissions?deleted=1');
    } catch (error) {
        next(error);
    }
});

module.exports = router;
