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

      const userDatas = await Model.find({
        'scores.name.gamemode': 'Campaign',
      })

        .limit(limit)
        .skip(startIndex)
        .exec();

      for (let data of userDatas) {
        let scoreName, scorePoints;
        // console.log(data);
        for (let scores of data.scores) {
          // console.log(scores);
          const tempQuery = `${scores.name.gamemode}_${scores.name.category}_${scores.name.difficulty}`;
          // console.log(scoreNameQuery.slice(0, scoreNameQuery.length - 1);
          if (tempQuery == scoreNameQuery.split('_').pop()) {
            scoreName = {
              gamemode: scores.name.gamemode,
              category: scores.name.category,
              difficulty: scores.name.difficulty,
            };
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
  console.log(scoreNameQuery);
  scoreNameQuery = scoreNameQuery.split('_');
  let dbQuery;
  if (country == '' || country == undefined || country == 'global') {
    if (scoreNameQuery[1] == 'any') {
      console.log('a');
      dbQuery = {
        scores: {
          $elemMatch: {
            name: {
              gamemode: scoreNameQuery[0],
              category: {
                $regex: /[0-9]/,
              },
              difficulty: scoreNameQuery[2],
            },
          },
        },
      };
    } else if (scoreNameQuery[2] == 'any') {
      console.log('b');
      dbQuery = {
        scores: {
          $elemMatch: {
            name: {
              gamemode: scoreNameQuery[0],
              category: scoreNameQuery[1],
            },
          },
        },
      };
    } else {
      console.log('c');
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
    console.log('d');
    // console.log(country);
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
