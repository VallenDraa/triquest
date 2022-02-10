const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

// save user email and password into mongoDB
router.post('/check_login', async (req, res) => {
  let user;
  try {
    //   find user based on username input
    user = await User.findOne({ username: req.body.username }).exec();
    if (!user) {
      res.redirect('/sign-up');
    } else {
      // check if password is correct
      if (user.password === req.body.password) {
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
