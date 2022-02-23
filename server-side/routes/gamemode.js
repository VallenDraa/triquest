const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');

// campaign mode
router.get('/campaign-mode/:sessionToken/', function (req, res) {
  res.render('gameplay', {
    title: `Triquest | Campaign Mode`,
    userState: req.cookies.userState,
  });
});

// random mode
router.get('/random-mode/:sessionToken/', function (req, res) {
  res.render('gameplay', {
    title: `Triquest | Random Mode`,
    userState: req.cookies.userState,
  });
});

// gameplay challenge mode
router.get('/challenge-mode/:sessionToken/', function (req, res) {
  res.render('gameplay', { title: `Triquest | Challenge Mode` });
  userState: req.cookies.userState;
});

// practice mode
router.get('/custom-mode/:sessionToken/', function (req, res) {
  res.render('gameplay', { title: `Triquest | Custom Mode` });
  userState: req.cookies.userState;
});

module.exports = router;
