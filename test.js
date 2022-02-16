const fetch = require('node-fetch');

// var http = require('http');
// http
//   .createServer(function (req, res) {
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.send('test-html.html');
//     res.end();
//   })
//   .listen(8080);

// const corr = 'a';
// const ans = ['b', 'c', 'd'];

// ans.push(corr);

// let past = [];
// let x = 0;
// for (const ans_ in ans) {
//   while (past.includes(x)) {
//     x = Math.round(Math.random() * 3);
//   }
//   console.log(ans[x]);
//   past.push(x);
// }

// const testAPI = async () => {
//   const api_url = `https://opentdb.com/api.php?amount=10&category=20&difficulty=medium&type=multiple`;
//   const datas = await fetch(api_url);
//   const json = await datas.json();
//   const questions = json.results;
//   console.log(questions);
// };
// testAPI();

// const testObj = {
//   a: 1,
//   b: 2,
// };

// let names = 'a';

// console.log(testObj[names]);

// a = 8;

// for (var i = 0; i < 10; i++) {
//   if (i == a) {
//     console.log('match', i);
//     return;
//   } else {
//     console.log('not match', i);
//   }
// }

// i = 0;
// while (i < 10) {
//   if (i == a) {
//     console.log('match', i);
//     return;
//   } else {
//     console.log('not match', i);
//   }
//   i++;
// }

x = {
  n: 12312,
};

if (/[0-9]/.test(x.n)) {
  console.log(x.n);
}
