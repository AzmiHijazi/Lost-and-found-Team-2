const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {

    res.redirect('/contact');

});

app.get('/contact', (req, res) => {

    res.render('contact', {
        title: 'Contact Us',
        currentPage: 'contact'
    });

});

app.post('/contact', (req, res) => {

    console.log(req.body);

    res.redirect('/contact');

});

app.use((req, res) => {

    res.status(404).render('404', {
        title: 'Page Not Found',
        currentPage: ''
    });

});

app.listen(8080, () => {

    console.log('Server is running on port 8080');

});