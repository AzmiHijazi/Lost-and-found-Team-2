// Items routes — owner: Omar (routing + item details page).
// TEMP demo data: the shared hardcoded items array is Abdulrahman's task.
// Status values are capitalised 'Lost'/'Found' because views/items.ejs
// compares against the exact string 'Lost'.
const express = require('express');
const router = express.Router();

const items = [
  { id: 1, name: 'Black Wallet', category: 'Accessories', location: 'Main Library', date: '2026-07-20', status: 'Lost', description: 'Black leather wallet with a student ID inside.', contactEmail: 'owner1@example.com' },
  { id: 2, name: 'Silver Laptop', category: 'Electronics', location: 'Engineering Building - Lab 3', date: '2026-07-22', status: 'Found', description: 'Silver 14-inch laptop found on a desk after the evening lecture.', contactEmail: 'finder2@example.com' },
  { id: 3, name: 'Car Keys', category: 'Keys', location: 'Parking Lot B', date: '2026-07-24', status: 'Lost', description: 'Toyota key with a blue keychain.', contactEmail: 'owner3@example.com' }
];

// GET /items — Items Page (view: views/items.ejs — Abdulrahman)
router.get('/', (req, res) => {
  res.render('items', { title: 'Items | Lost & Found', currentPage: 'items', items });
});

// GET /items/:id — Item Details Page using a URL parameter (owner: Omar).
// req.params.id is always a string, so Number() is required for ===.
router.get('/:id', (req, res) => {
  const item = items.find((i) => i.id === Number(req.params.id));
  if (!item) {
    return res.status(404).render('404', { title: 'Item not found | Lost & Found', currentPage: '' });
  }
  res.render('item-details', { title: `${item.name} | Lost & Found`, currentPage: 'items', item });
});

module.exports = router;
