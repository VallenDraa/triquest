const express = require('express');
const router = express.Router();

// save user email and password into mongoDB
router.get('/guest_mode', async (req, res) => {
  res.cookie('userState', 'guest');
  if (req.cookies.id) {
    res.cookie('id', req.cookies.id, {
      maxAge: '100', //in miliseconds
    });
  }

  res.redirect('/');
});

module.exports = router;
