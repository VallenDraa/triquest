const express = require("express");
const router = express.Router();
const User = require("../../../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");

router.use(cookieParser("secret"));
router.use(
  session({
    cookie: {
      maxAge: 60000,
    },
    resave: true,
    saveUninitialized: true,
    secret: "secret",
  })
);
router.use(flash());

// save user email and password into mongoDB
router.post(
  "/save_user",
  [
    body("email").isEmail(),
    body("password").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (error.isEmpty()) {
      if (req.body.password === req.body.confirm_password) {
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
            const id = await User.findOne({
              username: req.body.username,
            }).exec();
            res.cookie("userState", "notGuest");
            res.cookie("id", id.id);
            res.redirect("/");
          } catch (error) {
            req.flash("fail", "Fail to sign-up, Please try again later !");
            res.redirect("/sign-up");
          }
        } else {
          req.flash(
            "fail",
            "Entered username or email has aleady been registered !"
          );
          res.redirect("/sign-up");
        }
      } else {
        req.flash("fail", "The passwords are not the same !");
        res.redirect("/sign-up");
      }
    } else {
      req.flash("fail", "Please input a valid email and password !");
      res.redirect("/sign-up");
    }
  }
);

module.exports = router;
