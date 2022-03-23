const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const { checkIfGuestMode } = require('./menu');

router.use(cookieParser());

router.get('/socials', async (req, res) => {
  const sessionData = await checkIfGuestMode(
    req,
    res,
    req.cookies.userState,
    req.cookies.id
  );
  switch (req.query.platform) {
    case 'twitter':
      res.redirect('https://www.twitter.com/');
      break;
    case 'discord':
      res.redirect('https://www.discord.com/');
      break;
    case 'reddit':
      res.redirect('https://www.reddit.com/');
      break;
    case 'youtube':
      res.redirect('https://www.youtube.com/');
      break;
    default:
      res.render('socials', {
        title: `Triquest | Community`,
        username: sessionData.username,
      });
      break;
  }
});

module.exports = router;
