const express = require("express");
const router = express.Router();
const User = require("../../../models/user");
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
router.post("/check_login", async (req, res) => {
  let user;
  try {
    //   find user based on username input
    user = await User.findOne({ username: req.body.username }).exec();
    if (!user) {
      req.flash(
        "fail",
        "Username is not found, please input a registered username !"
      );
      res.redirect("/login");
    } else {
      // check if password is correct
      if (await bcrypt.compare(req.body.password, user.password)) {
        res.cookie("userState", "notGuest");
        res.cookie("id", user.id);
        res.redirect("/");
      } else {
        req.flash("fail", "Incorrect password !");
        res.redirect("/login");
      }
    }
  } catch (error) {
    req.flash("fail", "Fail To Login, Please Try Again Later !");
    res.redirect("/login");
  }
});

module.exports = router;
