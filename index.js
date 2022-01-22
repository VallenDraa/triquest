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
  res.render('index');
});

// select-difficulty
app.get('/select-difficulty', function (req, res) {
  res.render('select-dif');
});

// leaderboard
app.get('/leaderboard', function (req, res) {
  res.render('leaderboard');
});

//profile
app.get('/profile', function (req, res) {
  res.render('profile');
});

// gameplay challenge mode
app.get('/challenge-mode', function (req, res) {
  res.render('gameplay');
});

app.listen(5001, () => {
  console.log('listening at port 5001');
});
