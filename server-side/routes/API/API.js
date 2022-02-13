if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const User = require('../../../models/user');

// getting the point for the leaderboard
// URL:/api/leaderboard_points?query=[KEY]&page=[INT]&limit=[INT]
router.get('/leaderboard_points', paginatedResults(User), (req, res) => {
  res.json(res.paginatedResults);
});

function paginatedResults(Model) {
  return async (req, res, next) => {
    let query = req.query.query,
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
      const userDatas = await Model.find({
        scores: {
          $elemMatch: {
            name: query,
          },
        },
      })
        .limit(limit)
        .skip(startIndex)
        .sort({
          point: 1,
        })
        .exec();
      for (let data of userDatas) {
        let scoreName, scorePoints;
        console.log(data);
        for (let scores of data.scores) {
          if (scores.name == query) {
            scoreName = scores.name;
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

module.exports = router;
