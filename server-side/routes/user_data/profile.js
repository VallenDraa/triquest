const express = require('express');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const router = express.Router();
const User = require('../../../models/user');
const flash = require('express-flash');
const session = require('express-session');

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
    // user = await User.findById(req.cookies.id).exec();
    // if (req.body.password === user.password) {
    User.findByIdAndUpdate(
      req.cookies.id,
      {
        username: req.body.username,
        description: req.body.description,
        country: req.body.country,
      },
      (err, result) => {
        req.flash('success', 'Changes Are Successfully Saved!');
        res.redirect(`/profile/myprofile/${req.body.username}`);
      }
    );
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
    res.redirect(`/profile/myprofile/${req.body.username}`);
  }
});

module.exports = router;
