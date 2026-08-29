const express = require('express');
const router = express.Router();

const Item = require('../models/Item');
const Category = require('../models/Category');

const { requireLogin } = require('../middleware/auth');

// Clean the values coming from the form
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

// Validate the Report Item / Edit Item form
function validate(form) {
    const errors = {};

    const requiredFields = [
        'itemName',
        'category',
        'status',
        'location',
        'date',
        'description'
    ];

    for (const field of requiredFields) {
        if (!form[field]) {
            errors[field] = 'This field is required.';
        }
    }

    // Status must only be Lost or Found
    if (
        form.status &&
        !['Lost', 'Found'].includes(form.status)
    ) {
        errors.status = 'Choose Lost or Found.';
    }

    return errors;
}
// REPORT ITEM PAGE
// GET /report-item
router.get(
    '/report-item',
    requireLogin,
    async (req, res, next) => {
        try {
            // Get all categories from MongoDB
            const categories = await Category.find()
                .sort({ name: 1 });

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
    }
);
// CREATE ITEM
// POST /report-item
router.post(
    '/report-item',
    requireLogin,
    async (req, res, next) => {
        try {
            // Get and clean form data
            const form = clean(req.body);

            // Validate form
            const errors = validate(form);

            // Categories are needed again if validation fails
            const categories = await Category.find()
                .sort({ name: 1 });

            // If there are validation errors,
            // show the form again with the entered values
            if (Object.keys(errors).length > 0) {
                return res.status(422).render(
                    'report-item',
                    {
                        title: 'Report Item | Lost & Found',
                        currentPage: 'report',
                        errors,
                        form,
                        categories
                    }
                );
            }

            // Create the new item in MongoDB
            const newItem = new Item({
                ...form,

                // Store the logged-in user as the owner
                owner: req.session.user.id
            });

            await newItem.save();

            // Redirect to the user's submissions
            res.redirect(
                '/my-submissions?created=1'
            );

        } catch (error) {
            next(error);
        }
    }
);

// MY SUBMISSIONS
// GET /my-submissions
router.get(
    '/my-submissions',
    requireLogin,
    async (req, res, next) => {
        try {
            // Find only items created by the logged-in user
            const submissions = await Item.find({
                owner: req.session.user.id
            })
                // Replace category ObjectId with category data
                .populate('category')

                // Newest items appear first
                .sort({ createdAt: -1 });

            // Success message after create/edit/delete
            let message = '';

            if (req.query.created) {
                message = 'Item created successfully.';
            } else if (req.query.updated) {
                message = 'Item updated successfully.';
            } else if (req.query.deleted) {
                message = 'Item deleted successfully.';
            }

            res.render('my-submissions', {
                title: 'My Submissions | Lost & Found',
                currentPage: 'submissions',
                submissions,
                message
            });

        } catch (error) {
            next(error);
        }
    }
);
// EDIT ITEM PAGE
// GET /items/:id/edit
router.get(
    '/items/:id/edit',
    requireLogin,
    async (req, res, next) => {
        try {
            // Find the item and make sure it belongs
            // to the logged-in user
            const item = await Item.findOne({
                _id: req.params.id,
                owner: req.session.user.id
            });

            // Item does not exist or does not belong
            // to this user
            if (!item) {
                return res.status(404).render(
                    '404',
                    {
                        title: 'Item not found',
                        currentPage: ''
                    }
                );
            }

            // Load categories for the dropdown
            const categories = await Category.find()
                .sort({ name: 1 });

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
    }
);
// UPDATE ITEM
// POST /items/:id/edit
router.post(
    '/items/:id/edit',
    requireLogin,
    async (req, res, next) => {
        try {
            // Clean the values submitted by the user
            const form = clean(req.body);

            // Validate the edited values
            const errors = validate(form);

            // Categories are needed if the form
            // needs to be displayed again
            const categories = await Category.find()
                .sort({ name: 1 });

            // Validation failed
            if (Object.keys(errors).length > 0) {
                return res.status(422).render(
                    'edit-item',
                    {
                        title: 'Edit Item | Lost & Found',
                        currentPage: 'submissions',

                        // Keep the edited values in the form
                        item: {
                            _id: req.params.id,
                            ...form
                        },

                        categories,
                        errors
                    }
                );
            }


            // First make sure the item exists
            // AND belongs to the logged-in user
            const existingItem = await Item.findOne({
                _id: req.params.id,
                owner: req.session.user.id
            });

            // Do not allow another user to edit the item
            if (!existingItem) {
                return res.status(404).render(
                    '404',
                    {
                        title: 'Item not found',
                        currentPage: ''
                    }
                );
            }

            // Update using findByIdAndUpdate()
            // as required by the Phase 3 rubric
            const updatedItem =
                await Item.findByIdAndUpdate(
                    req.params.id,
                    form,
                    {
                        // Return the updated document
                        new: true,

                        // Apply Mongoose validation
                        runValidators: true
                    }
                );


            // Extra safety check
            if (!updatedItem) {
                return res.status(404).render(
                    '404',
                    {
                        title: 'Item not found',
                        currentPage: ''
                    }
                );
            }

            // Return to My Submissions
            res.redirect(
                '/my-submissions?updated=1'
            );

        } catch (error) {
            next(error);
        }
    }
);

// DELETE CONFIRMATION PAGE
// GET /items/:id/delete

router.get(
    '/items/:id/delete',
    requireLogin,
    async (req, res, next) => {
        try {
            // Find the item and check ownership
            const item = await Item.findOne({
                _id: req.params.id,
                owner: req.session.user.id
            })
                .populate('category');

            // Item doesn't exist or belongs
            // to another user
            if (!item) {
                return res.status(404).render(
                    '404',
                    {
                        title: 'Item not found',
                        currentPage: ''
                    }
                );
            }

            // Show confirmation page
            res.render('delete-item', {
                title: 'Delete Item | Lost & Found',
                currentPage: 'submissions',
                item
            });

        } catch (error) {
            next(error);
        }
    }
);

// DELETE ITEM
// POST /items/:id/delete
router.post(
    '/items/:id/delete',
    requireLogin,
    async (req, res, next) => {
        try {
            // Make sure the item belongs
            // to the logged-in user
            const item = await Item.findOne({
                _id: req.params.id,
                owner: req.session.user.id
            });

            if (!item) {
                return res.status(404).render(
                    '404',
                    {
                        title: 'Item not found',
                        currentPage: ''
                    }
                );
            }

            // Delete the item from MongoDB
            await Item.findByIdAndDelete(
                req.params.id
            );

            // Return to My Submissions
            res.redirect(
                '/my-submissions?deleted=1'
            );

        } catch (error) {
            next(error);
        }
    }
);


module.exports = router;