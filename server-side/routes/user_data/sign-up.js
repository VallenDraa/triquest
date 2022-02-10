const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

// save user email and password into mongoDB
router.post('/save_user', async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    await user.save();
    const id = await User.findOne({ username: req.body.username }).exec();
    console.log(id.id);
    res.cookie('userState', 'notGuest');
    res.cookie('id', id.id);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.redirect('/sign-up');
  }
});

module.exports = router;
