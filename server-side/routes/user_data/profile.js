const express = require('express');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const router = express.Router();
const User = require('../../../models/user');

router.use(methodOverride('_method'));
router.use(cookieParser());

router.put('/save_profile_edits', async (req, res) => {
  //   console.log(req.body);
  let user;
  try {
    user = await User.findById(req.cookies.id).exec();
    // console.log(user);
    if (req.body.password === user.password) {
      User.findByIdAndUpdate(
        req.cookies.id,
        {
          username: req.body.username,
          description: req.body.description,
          country: req.body.country,
        },
        (err, result) => {
          res.redirect(`/profile/myprofile/${req.body.username}`);
        }
      );
    } //if password is changed
    else {
      User.findByIdAndUpdate(
        req.cookies.id,
        {
          username: req.body.username,
          description: req.body.description,
          country: req.body.country,
          password: req.body.password,
        },
        (err, result) => {
          res.redirect(`/profile/myprofile/${req.body.username}`);
        }
      );
    }
    // add some password changing page here
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
