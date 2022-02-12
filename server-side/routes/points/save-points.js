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
        for (let i = 0; i <= user.scores.length; i++) {
          if (user.scores[i][0] == scoreParam) {
            if (user.scores[i][1] != scoreValue) {
              await updateScore(User, userID, scoreParam, scoreValue);
              console.log('z');
              return res.redirect('/');
            } else {
              console.log('X');
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
  await Schema.findOneAndUpdate(
    { _id: userID },
    {
      $set: {
        'scores.$[element]': [scoreParam, scoreValue],
      },
    },
    {
      arrayFilters: [{ element: scoreParam }],
    }
  );
}

async function addNewScore(Schema, userID, scoreParam, scoreValue, res) {
  await Schema.findOneAndUpdate(
    {
      _id: userID,
    },
    {
      $push: {
        scores: [scoreParam, scoreValue],
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
