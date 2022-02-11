const express = require('express');
const router = express.Router();

// save user email and password into mongoDB
router.get('/logout', async (req, res) => {
  res.cookie('userState', 'guest', {
    maxAge: '100', //in miliseconds
  });
  res.cookie('id', req.cookies.id, {
    maxAge: '100', //in miliseconds
  });

  res.redirect('/sign-up');
});

module.exports = router;
