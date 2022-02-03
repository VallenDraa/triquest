const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('socials', { title: `Triquest | Community` });
});
router.get('/reddit', (req, res) => {
  res.redirect('https://www.reddit.com/');
});
router.get('/twitter', (req, res) => {
  res.redirect('https://www.twitter.com/');
});
router.get('/youtube', (req, res) => {
  res.redirect('https://www.youtube.com/');
});
router.get('/discord', (req, res) => {
  res.redirect('https://www.discord.com/');
});

module.exports = router;
