const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const router = express.Router();
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
router.get('/profile/:id', async function (req, res) {
  try {
    const sessionData = await checkIfGuestMode(
      req,
      res,
      req.cookies.userState,
      req.params.id
    );
    if (sessionData.userState) {
      // redirect to link with name
      res.render('profile', {
        title: `Triquest | ${sessionData.username}`,
        username: sessionData.username,
        userState: sessionData.userState,
      });
    } else {
      res.redirect('/sign-up');
    }
  } catch (error) {
    res.redirect('/error/503');
  }
});

// this function determines if the user state is in guest and it returns the user states and the username
async function checkIfGuestMode(req, res, userState, userID) {
  if (!userState) {
    return {
      username: undefined,
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

module.exports = {
  menuRouter: router,
  checkIfGuestMode,
};
