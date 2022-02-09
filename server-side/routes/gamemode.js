const express = require('express');
const router = express.Router();

// campaign mode
router.get('/campaign-mode/:sessionToken', function (req, res) {
  res.render('gameplay', {
    title: `Triquest | Campaign Mode`,
  });
});

// random mode
router.get('/random-mode/:sessionToken', function (req, res) {
  res.render('gameplay', {
    title: `Triquest | Random Mode`,
  });
});

// gameplay challenge mode
router.get('/challenge-mode/:sessionToken', function (req, res) {
  res.render('gameplay', { title: `Triquest | Challenge Mode` });
});

// practice mode
router.get('/custom-mode/:sessionToken', function (req, res) {
  res.render('gameplay', { title: `Triquest | Custom Mode` });
});

module.exports = router;
