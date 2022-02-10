const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

// save user email and password into mongoDB
router.get('/guest_mode', async (req, res) => {
  res.cookie('userState', 'guest');
  res.redirect('/');
});

module.exports = router;
