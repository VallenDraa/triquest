const express = require("express");
const router = express.Router();
const User = require("../../../models/user");
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

router.get("/save_points/:id/:key/:value", async (req, res) => {
  if (!req.cookies.id) {
    req.flash("fail", "Fail to save points, please try to log in again !");
    return res.redirect("/sign-up");
  }
  let user;
  const userID = req.params.id;
  const scoreParam = req.params.key;
  const scoreValue = req.params.value;

  if (userID != "guest" && scoreParam != "guest") {
    try {
      user = await User.findById(req.params.id);
      if (user.scores.length != 0) {
        for (let i = 0; i < user.scores.length; i++) {
          const { name, points } = user.scores[i];
          dbScoreParam = `score_${name.gamemode}_${name.category}_${name.difficulty}`;
          if (dbScoreParam == scoreParam) {
            if (parseInt(scoreValue) > points) {
              await updateScore(User, userID, scoreParam, scoreValue);
              return res.redirect("/");
            } else {
              return res.redirect("/");
            }
          }
          if (user.scores.length == i + 1) {
            await addNewScore(User, userID, scoreParam, scoreValue);
            res.redirect("/");
          }
        }
      } else {
        await addNewScore(User, userID, scoreParam, scoreValue);
        res.redirect("/");
      }
    } catch (err) {
      res.redirect("/error/503");
    }
  } else {
    res.redirect("/");
  }
});

// utils for saving and editing scores
async function updateScore(Schema, userID, scoreParam, scoreValue) {
  scoreParam = scoreParam.split("_");
  // console.log(scoreParam);
  await Schema.findOneAndUpdate(
    {
      _id: userID,
      "scores.name.gamemode": scoreParam[1],
      "scores.name.category": scoreParam[2],
      "scores.name.difficulty": scoreParam[3],
    },
    {
      $set: {
        "scores.$.name.gamemode": scoreParam[1],
        "scores.$.name.category": scoreParam[2],
        "scores.$.name.difficulty": scoreParam[3],
        "scores.$.points": scoreValue,
      },
    }
  );
}

async function addNewScore(Schema, userID, scoreParam, scoreValue) {
  scoreParam = scoreParam.split("_");
  await Schema.findOneAndUpdate(
    {
      _id: userID,
    },
    {
      $push: {
        scores: {
          name: {
            gamemode: scoreParam[1],
            category: scoreParam[2],
            difficulty: scoreParam[3],
          },
          points: scoreValue,
        },
      },
    }
  );
}

module.exports = router;
