if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const fetch = require('node-fetch');
const User = require('../../models/user');

router.use(cookieParser());

// main page
router.get('/', async function (req, res) {
  const sessionData = await checkIfGuestMode(
    req,
    res,
    req.cookies.userState,
    req.cookies.id
  );
  if (sessionData.userState) {
    res.render('select-dif', {
      title: 'Triquest | Challenge Yourself !',
      username: sessionData.username,
      categories: 'select-dif',
    });
  } else {
    res.redirect('/sign-up');
  }
});

// leaderboard
router.get('/leaderboard', async function (req, res) {
  const countries = await fetchCountries();
  const sessionData = await checkIfGuestMode(
    req,
    res,
    req.cookies.userState,
    req.cookies.id
  );

  if (sessionData.userState) {
    res.render('leaderboard', {
      title: 'Triquest | Leaderboard',
      username: sessionData.username,
      categories: 'leaderboard',
      countries: countries,
    });
  } else {
    res.redirect('/sign-up');
  }
});

//profile
// convert id into username
router.get('/profile/others/:username', async function (req, res) {
  try {
    const countries = await fetchCountries();
    const categories = await fetchCategories();
    const scoreValue = [];
    const scoreName = [];
    if (req.cookies.userState) {
      if (req.cookies.userState == 'notGuest') {
        const myUser = await User.findById(req.cookies.id);
        const otherUser = await User.findOne({ username: req.params.username });
        if (myUser.username != otherUser.username) {
          otherUser.scores.forEach((score, i) => {
            scoreName.push(
              formatScoreNameProfile(
                categories,
                score.name.gamemode,
                score.name.category,
                score.name.difficulty
              )
            );
            scoreValue.push(score.points);
          });
          // redirect to link with name
          res.render('others-profile', {
            title: `Triquest | ${otherUser.username}`,
            userState: req.cookies.userState,
            username: otherUser.username,
            headerUsername: myUser.username,
            description: otherUser.description,
            country: otherUser.country,
            email: otherUser.email,
            password: otherUser.password,
            scoreName,
            scoreValue,
            countries,
          });
        } else {
          res.redirect(`/profile/myprofile/${req.params.username}`);
        }
      } else {
        const otherUser = await User.findOne({ username: req.params.username });
        otherUser.scores.forEach((score, i) => {
          scoreName.push(
            formatScoreNameProfile(
              categories,
              score.name.gamemode,
              score.name.category,
              score.name.difficulty
            )
          );
          scoreValue.push(score.points);
        });
        // redirect to link with name
        res.render('others-profile', {
          title: `Triquest | ${otherUser.username}`,
          userState: req.cookies.userState,
          username: otherUser.username,
          headerUsername: 'Guest',
          description: otherUser.description,
          country: otherUser.country,
          email: otherUser.email,
          password: otherUser.password,
          scoreName,
          scoreValue,
          countries,
        });
      }
    } else {
      res.redirect('/sign-up');
    }
  } catch (error) {
    console.error(error);
    res.redirect('/error/503');
  }
});

router.get('/profile/myprofile/:username', async function (req, res) {
  try {
    const countries = await fetchCountries();
    const categories = await fetchCategories();
    const scoreValue = [];
    const scoreName = [];
    if (req.cookies.userState) {
      if (req.cookies.userState == 'notGuest') {
        const user = await User.findOne({ username: req.params.username });
        user.scores.forEach((score, i) => {
          scoreName.push(
            formatScoreNameProfile(
              categories,
              score.name.gamemode,
              score.name.category,
              score.name.difficulty
            )
          );
          scoreValue.push(score.points);
        });
        // redirect to link with name
        res.render('my-profile', {
          title: `Triquest | ${user.username}`,
          userState: req.cookies.userState,
          username: user.username,
          description: user.description,
          country: user.country,
          email: user.email,
          password: user.password,
          scoreName,
          scoreValue,
          countries,
        });
      } else {
        res.render('my-profile', {
          title: `Triquest | Guest`,
          userState: 'guest',
          username: 'Guest',
          description: '',
          scores: [],
          countries,
        });
      }
    } else {
      res.redirect('/sign-up');
    }
  } catch (error) {
    console.error(error);
    res.redirect('/error/503');
  }
});

// this function determines if the user state is in guest and it returns the user states and the username
async function checkIfGuestMode(req, res, userState, userID) {
  if (!userState) {
    return {
      username: 'Sign-Up',
      userState: undefined,
    };
  }

  if (userState == 'guest') {
    return {
      username: 'Guest',
      userState: 'guest',
    };
  } else if (userState == 'notGuest') {
    try {
      user = await User.findById(userID).exec();
      return {
        username: user.username,
        userState: 'notGuest',
      };
    } catch (error) {
      console.log(error);
      res.redirect('/error/503');
    }
  }
}

async function fetchCountries() {
  let result = [
    {
      code: 'global',
      name: 'Global',
      emoji: '🌐',
    },
  ];
  // convert country code to emoji
  function getFlagEmoji(countryCode) {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  }

  // fetch country data json file for progile
  const json = await fetch(process.env.COUNTRIES_URL);
  const countries = await json.json();
  countries.forEach((country) => {
    result.push({
      code: country.code,
      name: country.name,
      emoji: getFlagEmoji(country.code),
    });
  });
  return result;
}

async function fetchCategories() {
  const json = await fetch(process.env.CATEGORY_URL);
  const categoryObj = await json.json();
  return Object.entries(categoryObj);
}

function formatScoreNameProfile(categoryList, gamemode, category, difficulty) {
  categoryList.forEach((categoryWord) => {
    if (categoryWord[0].includes(category)) {
      category = categoryWord[1];
    }
    switch (difficulty) {
      case 'campaign':
        difficulty = 'Campaign Difficulty';
        break;
      case 'random':
        difficulty = 'Random Difficulty';
        break;
      case 'easy':
        difficulty = 'Easy';
        break;
      case 'medium':
        difficulty = 'Medium';
        break;
      case 'hard':
        difficulty = 'Hard';
        break;
    }
  });
  return `${gamemode} - ${category} - ${difficulty}`;
}

module.exports = {
  menuRouter: router,
  checkIfGuestMode,
};
