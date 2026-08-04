// Lost & Found — application entry point.
// App setup: Azmi. Router mounting + 404 catch-all: Omar.
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine — absolute path so the app runs from any working directory,
// and lowercase 'views' so it also works on a case-sensitive (Linux) machine.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true })); // form posts -> req.body
app.use(express.json()); // JSON bodies -> req.body
app.use(express.static(path.join(__dirname, 'public')));

// partials/footer.ejs reads `year` on every page, so set it once here instead
// of passing it from every single route.
app.locals.year = new Date().getFullYear();

// Routers (owner: Omar)
const indexRouter = require('./routes/index');
const itemsRouter = require('./routes/items');
app.use('/', indexRouter);
app.use('/items', itemsRouter);

// 404 catch-all — must stay after every router.
// app.use, not app.get('*'): on Express 5 a bare '*' throws at startup.
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page not found', currentPage: '' });
});

app.listen(PORT, () => {
  console.log(`Lost & Found running at http://localhost:${PORT}`);
});

module.exports = app;
