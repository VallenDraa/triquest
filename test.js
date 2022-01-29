const fetch = require('node-fetch');

const corr = 'a';
const ans = ['b', 'c', 'd'];

ans.push(corr);

let past = [];
let x = 0;
for (const ans_ in ans) {
  while (past.includes(x)) {
    x = Math.round(Math.random() * 3);
  }
  console.log(ans[x]);
  past.push(x);
}

const testAPI = async () => {
  const api_url = `https://opentdb.com/api.php?amount=10&category=20&difficulty=medium&type=multiple`;
  const datas = await fetch(api_url);
  const json = await datas.json();
  const questions = json.results;
  console.log(questions);
};
testAPI();
