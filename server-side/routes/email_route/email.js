if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const { checkIfGuestMode } = require("../menu");

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

router.get("/", async (req, res) => {
  const sessionData = await checkIfGuestMode(
    req,
    res,
    req.cookies.userState,
    req.cookies.id
  );
  res.render("email-page", {
    title: "Triquest | Email Us",
    messages: {
      success: req.flash("success"),
      fail: req.flash("fail"),
    },
    username: sessionData.username,
  });
});

router.post("/send_email", (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.RECEIVER_EMAIL,
      pass: process.env.RECEIVER_PASS,
    },
  });

  const mailOptions = {
    from: req.body.email,
    to: process.env.RECEIVER_EMAIL,
    subject: `Message from ${req.body.email}: ${req.body.subject}`,
    text: req.body.message,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
      req.flash("fail", "Fail to send email, please try again later !");
      res.redirect("/contact_us");
    } else {
      // console.info(info);
      req.flash("success", "Email sent !");
      res.redirect("/");
    }
  });
});

module.exports = router;
