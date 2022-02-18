const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const bcrypt = require('bcrypt');

// save user email and password into mongoDB
router.post('/check_login', async (req, res) => {
  let user;
  try {
    //   find user based on username input
    user = await User.findOne({ username: req.body.username }).exec();
    if (!user) {
      res.redirect('/login');
    } else {
      // check if password is correct
      if (await bcrypt.compare(req.body.password, user.password)) {
        res.cookie('userState', 'notGuest');
        res.cookie('id', user.id);
        res.redirect('/');
      } else {
        res.redirect('/login');
      }
    }
  } catch (error) {
    console.error(error);
    res.redirect('/login');
  }
});

module.exports = router;
