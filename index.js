const express = require('express');
const methodOverride = require('method-override');
const app = express();
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');
const socialRouter = require('./server-side/socials');

app.use(methodOverride('_method'));

const mongoose = require('mongoose');

// use ejs view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// other use
app.use('/socials', socialRouter);
app.use(cookieParser());

// sign-up page
app.get('/sign-up', (req, res) => {
  res.render('sign-up', {
    title: 'Triquest | Sign-Up',
  });
});

app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Triquest | Login',
  });
});

// main page
app.get('/', function (req, res) {
  if (!req.cookies.userState) {
    res.redirect('/sign-up');
  }
  res.render('select-dif', {
    title: 'Triquest | Challenge Yourself',
  });
});

// leaderboard
app.get('/leaderboard', function (req, res) {
  if (!req.cookies.userState) {
    res.redirect('/sign-up');
  }
  res.render('leaderboard', {
    title: 'Triquest | Leaderboard',
  });
});

//profile
app.get('/profile/:userState', function (req, res) {
  const userState = req.cookies.userState;
  if (!userState) {
    res.redirect('/sign-up');
  } else {
    if (req.params.userState !== userState) {
      res.redirect('/error/404');
    } else {
      res.render('profile', {
        title: `Triquest | ${req.params.userState}`,
        userState: req.cookies.userState,
      });
    }
  }
});

// campaign mode
app.get('/campaign-mode/:sessionToken', function (req, res) {
  res.render('gameplay', {
    title: `Triquest | Campaign Mode`,
  });
});

// random mode
app.get('/random-mode/:sessionToken', function (req, res) {
  res.render('gameplay', {
    title: `Triquest | Random Mode`,
  });
});

// gameplay challenge mode
app.get('/challenge-mode/:sessionToken', function (req, res) {
  res.render('gameplay', { title: `Triquest | Challenge Mode` });
});

// practice mode
app.get('/custom-mode/:sessionToken', function (req, res) {
  res.render('gameplay', { title: `Triquest | Custom Mode` });
});

// API's
// get session tokens
app.get('/session-token', async function (req, res) {
  const data = await fetch('https://opentdb.com/api_token.php?command=request');
  const json = await data.json();
  const token = json.token;

  res.json(token);
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
// get user country
app.get('/get_country', async function (req, res) {
  const api_url = `https://www.iplocate.io/api/lookup/`;
  const datas = await fetch(api_url);
  const json = await datas.json();
  res.json(json);
});

app.get('/error/404', (req, res) => {
  res.status(404);
  res.render('./error/404HTML', { title: 'Triquest | Error 404' });
});

app.use(function (req, res) {
  res.redirect('/error/404');
});

app.listen(5001, () => {
  console.log('listening at localhost:5001/');
});
