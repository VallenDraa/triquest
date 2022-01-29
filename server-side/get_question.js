const { response } = require('express');
const express = require('express');
const methodOverride = require('method-override');
const app = express();
const fetch = require('node-fetch');

app.use(methodOverride('_method'));

app.get('/get_question', async function (req, res) {
  const api_url = `https://opentdb.com/api.php?amount=10&category=20&difficulty=medium&type=multiple`;
  const datas = await fetch(api_url);
  const json = await datas.json();
  res.json(json);
});

// :amount,cat,difs,type

exports = {};
