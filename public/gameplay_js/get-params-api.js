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
    insertAPIParamsValueToLocalVar();
    saveAPIParamsToSessionStorage();
    saveParamsForLocalStorage();
    window.location.href = '/campaign-mode';
  });

  challengeBtn.addEventListener('click', function () {
    api_cat = document.querySelector('#category-challenge').value;
    api_difs = 'hard';
    local_mode = 'challenge';
    insertAPIParamsValueToLocalVar();
    saveAPIParamsToSessionStorage();
    saveParamsForLocalStorage();
    window.location.href = '/challenge-mode';
  });

  randomBtn.addEventListener('click', function () {
    api_cat = '';
    api_difs = '';
    local_mode = 'random';
    insertAPIParamsValueToLocalVar();
    saveAPIParamsToSessionStorage();
    saveParamsForLocalStorage();
    window.location.href = '/random-mode';
  });

  customBtn.addEventListener('click', function () {
    api_cat = document.querySelector('#category-custom').value;
    api_difs = document.querySelector('#category-difs').value;
    local_mode = 'custom';
    insertAPIParamsValueToLocalVar();
    saveAPIParamsToSessionStorage();
    saveParamsForLocalStorage();
    window.location.href = '/custom-mode';
  });

  sessionToken = await getTokenSession();
  console.log(sessionToken);
  document.cookie = `sessionToken=${sessionToken}; Secure`;
})();

async function getTokenSession() {
  const data = await fetch('/session-token');
  const token = await data.json();
  return token;
}

function saveAPIParamsToSessionStorage() {
  sessionStorage.setItem('api_amount', api_amount);
  sessionStorage.setItem('api_cat', api_cat);
  sessionStorage.setItem('api_difs', api_difs);
  sessionStorage.setItem('api_type', api_type);
}

function insertAPIParamsValueToLocalVar() {
  api_difs === '' ? (local_difs = 'any') : (local_difs = api_difs);

  api_cat === '' ? (local_cat = 'any') : (local_cat = api_cat);
}

function saveParamsForLocalStorage() {
  sessionStorage.setItem('local_cat', local_cat);
  sessionStorage.setItem('local_difs', local_difs);
  sessionStorage.setItem('local_mode', local_mode);
}
