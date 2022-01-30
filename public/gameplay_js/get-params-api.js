const campaignBtn = document.querySelector('.campaign-btn'),
  challengeBtn = document.querySelector('.challenge-btn'),
  randomBtn = document.querySelector('.random-btn'),
  practiceBtn = document.querySelector('.practice-btn');

// API parameter in select-dif page
let amount = 10,
  cat,
  difs,
  type = '';

// get API Parameter value in select-dif page
const getParamsFromSelectDif = (async () => {
  campaignBtn.addEventListener('click', function () {
    cat = document.querySelector('#category-campaign').value;
    difs = '';
    saveAPIParamsToSessionStorage();
    window.location.href = '/campaign-mode';
  });

  challengeBtn.addEventListener('click', function () {
    cat = document.querySelector('#category-challenge').value;
    difs = 'hard';
    saveAPIParamsToSessionStorage();
    window.location.href = '/challenge-mode';
  });

  randomBtn.addEventListener('click', function () {
    cat = '';
    difs = '';
    saveAPIParamsToSessionStorage();
    window.location.href = '/random-mode';
  });

  practiceBtn.addEventListener('click', function () {
    cat = document.querySelector('#category-practice').value;
    difs = document.querySelector('#category-difs').value;
    saveAPIParamsToSessionStorage();
    window.location.href = '/practice-mode';
  });

  sessionToken = await getTokenSession();
  console.log(sessionToken);
  document.cookie = `sessionToken=${sessionToken}; Secure`;
})();

async function getTokenSession() {
  const data = await fetch('https://opentdb.com/api_token.php?command=request');
  const json = await data.json();
  const token = json.token;
  return token;
}

function saveAPIParamsToSessionStorage() {
  sessionStorage.setItem('amount', amount);
  sessionStorage.setItem('cat', cat);
  sessionStorage.setItem('difs', difs);
  sessionStorage.setItem('type', type);
  console.log(sessionStorage);
}
