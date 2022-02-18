const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

// save user email and password into mongoDB
router.post(
  '/save_user',
  [
    body('email').isEmail(),
    body('password').isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (error.isEmpty()) {
      const hashedPassword = await bcrypt.hash(req.body.password, 11);
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      const userSearch = await User.findOne({
        $or: [
          {
            username: req.body.username,
          },
          {
            email: req.body.email,
          },
        ],
      });

      // console.log(userSearch);

      if (!userSearch) {
        try {
          await user.save();
          const id = await User.findOne({ username: req.body.username }).exec();
          res.cookie('userState', 'notGuest');
          res.cookie('id', id.id);
          res.redirect('/');
        } catch (error) {
          console.error(error);
          res.redirect('/sign-up');
        }
      } else {
        res.redirect('/sign-up');
      }
    } else {
      console.error(error);
      res.redirect('/sign-up');
    }
  }
);

module.exports = router;
