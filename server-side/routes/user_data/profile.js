const express = require('express');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const router = express.Router();
const User = require('../../../models/user');
const flash = require('connect-flash');
const session = require('express-session');
const user = require('../../../models/user');

router.use(methodOverride('_method'));
router.use(cookieParser('secret'));
router.use(
  session({
    cookie: {
      maxAge: 60000,
    },
    resave: true,
    saveUninitialized: true,
    secret: 'secret',
  })
);
router.use(flash());

router.put('/save_profile_edits', async (req, res) => {
  // let user;
  try {
    const user = await User.findById(req.cookies.id).exec();
    // if (req.body.password === user.password) {
    const existingUsername = await usernameExist(
      req.body.username,
      user.username
    );
    if (!existingUsername) {
      await User.findByIdAndUpdate(req.cookies.id, {
        username: req.body.username,
        description: req.body.description,
        country: req.body.country,
      });

      req.flash('success', 'Changes successfully saved !');
      res.redirect(`/profile/myprofile/${req.body.username}`);
    } else {
      req.flash('fail', 'This username has aleady been taken !');
      res.redirect(`/profile/myprofile/${user.username}`);
    }
    // } //if password is changed
    // else {
    //   User.findByIdAndUpdate(
    //     req.cookies.id,
    //     {
    //       username: req.body.username,
    //       description: req.body.description,
    //       country: req.body.country,
    //       password: req.body.password,
    //     },
    //     (err, result) => {
    //       res.redirect(`/profile/myprofile/${req.body.username}`);
    //     }
    //   );
    // }
    // add some password changing page here
  } catch (error) {
    req.flash('fail', 'Changes Failed To Be Saved, Try Again later !');
    res.redirect(`/profile/myprofile/${user.username}`);
  }
});

async function usernameExist(newUsername, currentUsername) {
  if (newUsername !== currentUsername) {
    const user = await User.findOne({
      username: newUsername,
    });
    return user ? true : false;
  } else {
    return false;
  }
}

module.exports = router;
