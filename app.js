const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// partials/footer.ejs prints `year` on every page that includes it,
// so set it once here instead of passing it from every route.
app.locals.year = new Date().getFullYear();

const indexRoutes = require('./routes/index');
const itemRoutes = require('./routes/items');

app.use('/', indexRoutes);
app.use('/items', itemRoutes);

// 404 catch-all - must stay after every router.
// app.use, not app.get('*'): on Express 5 a bare '*' throws at startup.
app.use((req, res) => {

    res.status(404).render('404', {
        title: 'Page Not Found',
        currentPage: ''
    });

});

app.listen(8080, () => {

    console.log('Server is running on port 8080');

});
