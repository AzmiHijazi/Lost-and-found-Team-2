const express = require('express');
const path = require('path');

const itemsRouter = require('./routes/items');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/items', itemsRouter);

if (require.main === module) {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Lost & Found is running at http://localhost:${port}`);
  });
}

module.exports = app;
