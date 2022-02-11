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
      console.log('a');
      user = await User.findById(req.params.id);
      if (user.scores.length > 0) {
        user.scores.forEach(async (item) => {
          if (item[0] == scoreParam) {
            console.log('b');
            await User.findByIdAndReplace(userID, {
              $set: {
                'scores.$': [scoreParam, scoreValue],
              },
            });
          }
        });
      } else {
        await User.findOneAndUpdate(
          {
            _id: userID,
          },
          {
            $push: {
              scores: [scoreParam, scoreValue],
            },
          }
        );
        console.log('c');
      }

      score = res.redirect('/');
    } catch (err) {
      console.error(err);
    }
  } else {
    console.log('d');
    res.redirect('/');
  }
});

module.exports = router;
