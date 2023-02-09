const { response } = require("express");
const express = require("express");
const app = express();
const fetch = require("node-fetch");

app.get("/get_question", async function (req, res) {
  const api_url = `https://opentdb.com/api.php?amount=10&category=20&difficulty=medium&type=multiple`;
  const datas = await fetch(api_url);
  const json = await datas.json();
  const city = await json;
  res.json(city);
});

// :amount,cat,difs,type
