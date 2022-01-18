const express = require('express');
const methodOverride = require('method-override');
const app = express();

app.use(methodOverride('_method'));

const mongoose = require('mongoose');

// use ejs view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// main page
app.get('/', function (req, res) {
  res.render('index', { pageTitle: 'entale | A Story To Be Told' });
});

app.listen(5001, () => {
  console.log('listening at port 5001');
});
