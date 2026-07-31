// Items routes — owner: Omar (routing + item details page).
// The items-list view is Abdulrahman's task; the hardcoded items array is also
// his task. TEMP demo data below exists only so the :id route can be tested —
// DELETE it and switch to `const items = require('../data/items');` when
// Abdulrahman's array merges.
const express = require('express');
const router = express.Router();

// TEMP demo data (replace with require('../data/items') — owner: Abdulrahman)
const items = [
  { id: 1, name: 'Black Wallet', category: 'Accessories', location: 'Main Library', date: '2026-07-20', status: 'lost', description: 'Black leather wallet with a student ID inside.', contactEmail: 'owner1@example.com' },
  { id: 2, name: 'Silver Laptop', category: 'Electronics', location: 'Engineering Building - Lab 3', date: '2026-07-22', status: 'found', description: 'Silver 14-inch laptop found on a desk after the evening lecture.', contactEmail: 'finder2@example.com' },
  { id: 3, name: 'Car Keys', category: 'Keys', location: 'Parking Lot B', date: '2026-07-24', status: 'lost', description: 'Toyota key with a blue keychain.', contactEmail: 'owner3@example.com' }
];

// GET /items — Items Page (view comes from Abdulrahman)
router.get('/', (req, res) => {
  res.render('items-list', { title: 'Items', active: 'items', items });
});

// GET /items/:id — Item Details Page using URL parameter (owner: Omar)
router.get('/:id', (req, res) => {
  const item = items.find((i) => i.id === Number(req.params.id));
  if (!item) {
    // TEMP: switch to res.status(404).render('404', ...) when Hashem's 404 page merges.
    return res.status(404).send('Item not found');
  }
  res.render('item-details', { title: item.name, active: 'items', item });
});

module.exports = router;
