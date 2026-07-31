// TEMPORARY minimal app.js so the routing can run — app setup is Azmi's task.
// When Azmi's app.js merges, keep HIS version and just make sure the two
// routers below stay mounted (app.use lines).
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// View engine
app.set('view engine', 'ejs');

// Routers (owner: Omar)
const indexRouter = require('./routes/index');
const itemsRouter = require('./routes/items');
app.use('/', indexRouter);
app.use('/items', itemsRouter);

// 404 catch-all (must stay last).
// TEMP: switch to res.status(404).render('404', ...) when Hashem's 404 page merges.
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

app.listen(PORT, () => {
  console.log(`Lost & Found app running at http://localhost:${PORT}`);
});
