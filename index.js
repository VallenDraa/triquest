const express = require('express');
const methodOverride = require('method-override');
const app = express();
const fetch = require('node-fetch');

app.use(methodOverride('_method'));

const mongoose = require('mongoose');

// use ejs view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// main page
app.get('/', function (req, res) {
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

// campaign mode
app.get('/campaign-mode', function (req, res) {
  res.render('gameplay');
});

// random mode
app.get('/random-mode', function (req, res) {
  res.render('gameplay');
});

// gameplay challenge mode
app.get('/challenge-mode', function (req, res) {
  res.render('gameplay');
});

// practice mode
app.get('/custom-mode', function (req, res) {
  res.render('gameplay');
});

// get questions
app.get('/get_question/:queryParams', async function (req, res) {
  // the parameter
  const parameter = req.params.queryParams.split(',');
  const amount = parameter[0],
    cat = parameter[1],
    difs = parameter[2],
    type = parameter[3],
    sessionToken = parameter[4];

  const api_url = `https://opentdb.com/api.php?amount=${amount}&category=${cat}&difficulty=${difs}&type=${type}&token=${sessionToken}`;
  const datas = await fetch(api_url);
  const json = await datas.json();
  console.log(
    `The API link with the parameter that was received from the request: ${api_url}`
  );

  res.json(json);
});

app.use(function (req, res) {
  res.render('404HTML');
});

app.listen(5001, () => {
  console.log('listening at port 5001');
});
