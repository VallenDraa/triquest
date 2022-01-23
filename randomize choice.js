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
