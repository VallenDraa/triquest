const express = require('express');
const router = express.Router();

router.get('/404', (req, res) => {
  errorPage(
    res,
    404,
    "The link you were searching for doesn't exist. Please click the button below to return to the main page or click one of the buttons on the menu."
  );
});
router.get('/503', (req, res) => {
  errorPage(
    res,
    503,
    ' The Triquest Server Is Currently unavailable, Please Comeback Later !'
  );
});

// render error page
function errorPage(res, type, message) {
  res.status(parseInt(type));
  res.render('./error/error', {
    title: `Triquest | Error ${type}`,
    error: {
      type,
      message,
    },
  });
}

module.exports = router;
