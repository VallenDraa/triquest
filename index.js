if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const methodOverride = require('method-override');
const app = express();
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const socialRouter = require('./server-side/routes/socials');
const errorRouter = require('./server-side/routes/error');
const gamemodeRouter = require('./server-side/routes/gamemode');
const { menuRouter } = require('./server-side/routes/menu');
const signUpRouter = require('./server-side/routes/user_data/sign-up');
const loginRouter = require('./server-side/routes/user_data/login');
const guestRouter = require('./server-side/routes/user_data/guest-mode');
const logOutRouter = require('./server-side/routes/user_data/log-out');
const profileRouter = require('./server-side/routes/user_data/profile');
const savePointsRouter = require('./server-side/routes/points/save-points');
const emailRouter = require('./server-side/routes/email_route/email');
const APIRouter = require('./server-side/routes/API/API.js');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');

// use ejs view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/error', errorRouter);
app.use('/profile', profileRouter);
app.use('/', socialRouter);
app.use('/', gamemodeRouter);
app.use('/', menuRouter);
app.use('/', signUpRouter);
app.use('/', loginRouter);
app.use('/', guestRouter);
app.use('/', logOutRouter);
app.use('/', savePointsRouter);
app.use('/api', APIRouter);
app.use('/contact_us', emailRouter);
// utility
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
app.use(
  session({
    cookie: {
      maxAge: 60000,
    },
    resave: true,
    saveUninitialized: true,
    secret: 'secret',
  })
);
app.use(flash());

// database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => {
  console.log('Connected To Database');
});

// sign-up page
app.get('/sign-up', async (req, res) => {
  res.render('sign-up', {
    title: 'Triquest | Sign-Up',
    username: 'Sign-Up',
    messages: {
      success: req.flash('success'),
      fail: req.flash('fail'),
    },
  });
});

app.get('/login', async (req, res) => {
  res.render('login', {
    title: 'Triquest | Login',
    username: 'Sign-Up',
    messages: {
      success: req.flash('success'),
      fail: req.flash('fail'),
    },
  });
});

// API's
// get session tokens
app.get('/session-token', async function (req, res) {
  try {
    const data = await fetch(
      'https://opentdb.com/api_token.php?command=request'
    );
    const json = await data.json();
    const token = json.token;

    res.json(token);
  } catch (error) {
    res.redirect('/error/503');
  }
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
  // console.log(
  //   `The API link with the parameter that was received from the request: ${api_url}`
  // );

  res.json(json);
});
app.get('/safari', function (req, res) {
  res.send('Not Supported In Safari Yet !');
});

app.listen(process.env.PORT || 8000, () => {
  console.log('listening at localhost:8000');
});
