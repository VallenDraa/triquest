if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const User = require('../../../models/user');

// getting the point for the leaderboard
// URL:/api/leaderboard_points?query=[KEY]&country=[abbr]
router.get('/leaderboard_points', leaderboardPoints(User), (req, res) => {
  res.json(res.leaderboardPoints);
});

router.get('/fetch_highscore/:scoreParam', async (req, res) => {
  // fetch highscore
  let user;
  const userID = req.cookies.id;
  const scoreParam = req.params.scoreParam;
  const scoreValue = req.cookies[scoreParam];

  if (userID != 'guest') {
    try {
      user = await User.findById(userID);
      if (user.scores.length != 0) {
        for (let i = 0; i < user.scores.length; i++) {
          // console.log(user.scores[i]);
          const { name, points } = user.scores[i];
          dbScoreParam = `score_${name.gamemode}_${name.category}_${name.difficulty}`;
          if (dbScoreParam == scoreParam) {
            // console.log(points, scoreValue);
            if (parseInt(scoreValue) > points) {
              // console.log(scoreValue);
              res.json({ score: scoreValue });
              return;
            } else {
              // console.log(points);
              res.json({ score: points });
              return;
            }
          } else {
            // console.log(scoreValue);
            res.json({ score: scoreValue });
            return;
          }
        }
      }
    } catch (err) {
      res.json(err);
    }
  } else {
    return;
  }
});

function leaderboardPoints(Model) {
  return async (req, res, next) => {
    let scoreNameQuery = req.query.query,
      country = req.query.country,
      searchLimit = 50;

    const results = {};

    // the results of the database query
    results.results = [];

    try {
      let dbQuery = dbQueryAdjust(country, scoreNameQuery);
      // will change the database query based on if country query is undefined or not

      const userDatas = await Model.find(dbQuery).limit(500).exec();

      for (let data of userDatas) {
        let scoreName = {},
          scorePoints;

        for (let scores of data.scores) {
          dataAssignQuery = scoreNameQuery.split('_'); //[0] = gamemode, [1] = category, [2] = difficulty
          // gamemode assign
          if (
            scores.name.gamemode == dataAssignQuery[0] &&
            scores.name.category == dataAssignQuery[1] &&
            scores.name.difficulty == dataAssignQuery[2]
          ) {
            scoreName.gamemode = scores.name.gamemode;
            scoreName.category = scores.name.category;
            scoreName.difficulty = scores.name.difficulty;
            scorePoints = scores.points;
          }
        }

        results.results.push({
          id: data.id,
          username: data.username,
          score_name: scoreName,
          score_points: scorePoints,
        });
      }
      res.leaderboardPoints = results;

      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
}

function dbQueryAdjust(country, scoreNameQuery) {
  // console.log(scoreNameQuery);
  scoreNameQuery = scoreNameQuery.split('_');
  let dbQuery;
  if (country == '' || country == undefined || country == 'global') {
    dbQuery = {
      scores: {
        $elemMatch: {
          name: {
            gamemode: scoreNameQuery[0],
            category: scoreNameQuery[1],
            difficulty: scoreNameQuery[2],
          },
        },
      },
    };
  } else {
    dbQuery = {
      $and: [
        {
          scores: {
            $elemMatch: {
              name: {
                gamemode: scoreNameQuery[0],
                category: scoreNameQuery[1],
                difficulty: scoreNameQuery[2],
              },
            },
          },
        },
        {
          country: country,
        },
      ],
    };
  }
  // console.log(dbQuery);
  return dbQuery;
}

module.exports = router;
