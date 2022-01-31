const campaignBtn = document.querySelector('.campaign-btn'),
  challengeBtn = document.querySelector('.challenge-btn'),
  randomBtn = document.querySelector('.random-btn'),
  customBtn = document.querySelector('.custom-btn');

// API parameter in select-dif page
let api_amount = 10,
  api_cat,
  api_difs,
  api_type = '';

// parameter for local storage
let local_cat, local_difs, local_mode;

// get API Parameter value in select-dif page
const getParamsFromSelectDif = (async () => {
  campaignBtn.addEventListener('click', function () {
    api_cat = document.querySelector('#category-campaign').value;
    api_difs = '';
    local_mode = 'campaign';
    ifParamsAreAny();
    saveAPIParamsToSessionStorage();
    window.location.href = '/campaign-mode';
  });

  challengeBtn.addEventListener('click', function () {
    api_cat = document.querySelector('#category-challenge').value;
    api_difs = 'hard';
    local_mode = 'challenge';
    ifParamsAreAny();
    saveAPIParamsToSessionStorage();
    window.location.href = '/challenge-mode';
  });

  randomBtn.addEventListener('click', function () {
    api_cat = '';
    api_difs = '';
    local_mode = 'random';
    ifParamsAreAny();
    saveAPIParamsToSessionStorage();
    window.location.href = '/random-mode';
  });

  customBtn.addEventListener('click', function () {
    api_cat = document.querySelector('#category-custom').value;
    api_difs = document.querySelector('#category-difs').value;
    local_mode = 'custom';
    ifParamsAreAny();
    saveAPIParamsToSessionStorage();
    window.location.href = '/custom-mode';
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
  sessionStorage.setItem('api_amount', api_amount);
  sessionStorage.setItem('api_cat', api_cat);
  sessionStorage.setItem('api_difs', api_difs);
  sessionStorage.setItem('api_type', api_type);
  console.log(sessionStorage);
}

function ifParamsAreAny() {
  if (api_difs === '') {
    local_difs = 'any';
  }

  if (api_cat === '') {
    local_cat = 'any';
  }
}
