const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const User = require('../../../models/user');

router.use(cookieParser());

router.get('/save_points/:id/:score', async (req, res) => {
  let user;
  const userID = req.params.id;
  const scoreParam = req.params.score;
  const scoreValue = req.cookies[scoreParam];
  if (userID != 'guest' && scoreParam != 'guest') {
    try {
      user = await User.findById(req.params.id);
      if (user.scores.length != 0) {
        for (let i = 0; i < user.scores.length; i++) {
          console.log(user.scores[i]);
          dbScoreParam = `score_${user.scores[i].name.gamemode}_${user.scores[i].name.category}_${user.scores[i].name.difficulty}`;
          if (dbScoreParam == scoreParam) {
            if (user.scores[i].points != scoreValue) {
              await updateScore(User, userID, scoreParam, scoreValue);
              return res.redirect('/');
            } else {
              return res.redirect('/');
            }
          }
          if (user.scores.length == i + 1) {
            await addNewScore(User, userID, scoreParam, scoreValue);
            res.redirect('/');
          }
        }
      } else {
        await addNewScore(User, userID, scoreParam, scoreValue);
        res.redirect('/');
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    res.redirect('/');
  }
});

// utils for saving and editing scores
async function updateScore(Schema, userID, scoreParam, scoreValue, res) {
  scoreParam = scoreParam.split('_');
  console.log(scoreParam);
  await Schema.findOneAndUpdate(
    {
      _id: userID,
      'scores.name.gamemode': scoreParam[1],
      'scores.name.category': scoreParam[2],
      'scores.name.difficulty': scoreParam[3],
    },
    {
      $set: {
        'scores.$.name.gamemode': scoreParam[1],
        'scores.$.name.category': scoreParam[2],
        'scores.$.name.difficulty': scoreParam[3],
        'scores.$.points': scoreValue,
      },
    }
  );
}

async function addNewScore(Schema, userID, scoreParam, scoreValue, res) {
  scoreParam = scoreParam.split('_');
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

// function expiresCookie(cookieName, res) {
//   res.cookie(cookieName, '_', {
//     maxAge: '100', //in miliseconds
//   });
// }

module.exports = router;
