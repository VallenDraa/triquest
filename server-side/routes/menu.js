const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const router = express.Router();

router.use(cookieParser());

// main page
router.get('/', function (req, res) {
  if (!req.cookies.userState) {
    res.redirect('/sign-up');
  }
  res.render('select-dif', {
    title: 'Triquest | Challenge Yourself',
  });
});

// leaderboard
router.get('/leaderboard', function (req, res) {
  if (!req.cookies.userState) {
    res.redirect('/sign-up');
  }
  res.render('leaderboard', {
    title: 'Triquest | Leaderboard',
  });
});

//profile
router.get('/profile/:username', function (req, res) {
  const userState = req.cookies.userState;
  if (!userState) {
    res.redirect('/sign-up');
  }
  if (req.params.username !== userState) {
    res.redirect('/error/404');
  } else {
    res.render('profile', {
      title: `Triquest | ${req.params.username}`,
      userState,
    });
  }
});

module.exports = router;
