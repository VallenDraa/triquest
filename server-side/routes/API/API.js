if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const User = require('../../../models/user');

// getting the point for the leaderboard
// URL:/api/leaderboard_points?query=[KEY]&country=[abbr]&page=[INT]&limit=[INT]
router.get('/leaderboard_points', paginatedResults(User), (req, res) => {
  res.json(res.paginatedResults);
});

function paginatedResults(Model) {
  return async (req, res, next) => {
    let scoreNameQuery = req.query.query,
      country = req.query.country,
      page = parseInt(req.query.page),
      limit = parseInt(req.query.limit),
      nextPage,
      prevPage;

    page = page === 0 ? 1 : page;
    limit = limit === 0 ? 1 : limit;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    // current page
    results.current = {
      page,
      limit,
    };
    // next page
    if (endIndex < Model.length) {
      results.next = {
        page: page + 1,
        limit,
      };
      nextPage = true;
    } else {
      nextpage = false;
    }
    // previous page
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit,
      };
      prevPage = true;
    } else {
      prevPage = false;
    }
    // the results of the database query
    results.results = [];

    try {
      let dbQuery = dbQueryAdjust(country, scoreNameQuery);
      // will change the database query based on if country query is undefined or not

      const userDatas = await Model.find(dbQuery)
        .limit(limit)
        .skip(startIndex)
        .exec();

      for (let data of userDatas) {
        let scoreName = {},
          scorePoints;

        for (let scores of data.scores) {
          dataAssignQuery = scoreNameQuery.split('_'); //[0] = gamemode, [1] = category, [2] = difficulty
          // gamemode assign
          if (scores.name.gamemode != dataAssignQuery[0]) return;
          scoreName.gamemode = scores.name.gamemode;

          // category assign
          if (dataAssignQuery[1] != 'any') {
            if (scores.name.category == dataAssignQuery[1]) {
              scoreName.category = scores.name.category;
            } else {
              return;
            }
          } else {
            scoreName.category = scores.name.category;
          }
          // difficulty assign
          if (dataAssignQuery[2] != 'any') {
            if (scores.name.difficulty == dataAssignQuery[2]) {
              scoreName.difficulty = scores.name.difficulty;
            } else {
              return;
            }
          } else {
            scoreName.difficulty = scores.name.difficulty;
          }

          // point assign
          if (
            scoreName.gamemode &&
            scoreName.category &&
            scoreName.difficulty
          ) {
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
      res.prevPage = prevPage;
      res.nextPage = nextPage;
      res.paginatedResults = results;
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
    if (scoreNameQuery[1] == 'any') {
      dbQuery = {
        'scores.name.gamemode': scoreNameQuery[0],
        'scores.name.difficulty': scoreNameQuery[2],
      };
    } else if (scoreNameQuery[2] == 'any') {
      dbQuery = {
        'scores.name.gamemode': scoreNameQuery[0],
        'scores.name.category': scoreNameQuery[1],
      };
    } else {
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
    }
  } else {
    // console.log(country);
    if (scoreNameQuery[1] == 'any') {
      dbQuery = {
        $and: [
          {
            'scores.name.gamemode': scoreNameQuery[0],
            'scores.name.difficulty': scoreNameQuery[2],
          },
          {
            country: country,
          },
        ],
      };
    } else if (scoreNameQuery[2] == 'any') {
      dbQuery = {
        $and: [
          {
            'scores.name.gamemode': scoreNameQuery[0],
            'scores.name.category': scoreNameQuery[1],
          },
          {
            country: country,
          },
        ],
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
  }
  // console.log(dbQuery);
  return dbQuery;
}

module.exports = router;
