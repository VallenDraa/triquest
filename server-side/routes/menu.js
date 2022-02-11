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
    });
  } else {
    res.redirect('/sign-up');
  }
});

// leaderboard
router.get('/leaderboard', async function (req, res) {
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
    });
  } else {
    res.redirect('/sign-up');
  }
});

//profile
// convert id into username
router.get('/profile/:username', async function (req, res) {
  try {
    const countries = await listCountries();
    if (req.cookies.userState) {
      if (req.cookies.userState == 'notGuest') {
        const user = await User.findOne({ username: req.params.username });
        // redirect to link with name
        res.render('profile', {
          title: `Triquest | ${user.username}`,
          userState: req.cookies.userState,
          username: user.username,
          description: user.description,
          country: user.country,
          email: user.email,
          password: user.password,
          scores: user.scores,
          countries,
        });
      } else {
        res.render('profile', {
          title: `Triquest | Guest`,
          userState: 'guest',
          username: 'Guest',
          description: '',
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

async function listCountries() {
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
module.exports = {
  menuRouter: router,
  checkIfGuestMode,
};
