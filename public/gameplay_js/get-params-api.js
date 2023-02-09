const parseCookieAPI = (str) =>
  str
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

const campaignBtn = document.querySelector(".campaign-btn"),
  challengeBtn = document.querySelector(".challenge-btn"),
  randomBtn = document.querySelector(".random-btn"),
  customBtn = document.querySelector(".custom-btn");

// API parameter in select-dif page
let api_amount = 10,
  api_cat,
  api_difs,
  api_type = ""; //this is for the question type (multiple choice or a boolean)

// parameter for local storage
let local_cat, local_difs, local_mode;

// console.log(parseCookieAPI(document.cookie).sessionToken);

// get API Parameter value in select-dif page
const getParamsFromSelectDif = (async () => {
  campaignBtn.addEventListener("click", function () {
    api_cat = document.querySelector("#category-campaign").value;
    api_difs = "";
    local_mode = "Campaign";
    saveAPIParamsToSessionStorage();
    saveParamsForLocalStorage();
    window.location.href = `/campaign-mode/${
      parseCookieAPI(document.cookie).sessionToken
    }`;
  });

  challengeBtn.addEventListener("click", function () {
    api_cat = document.querySelector("#category-challenge").value;
    api_difs = "hard";
    local_mode = "Challenge";
    saveAPIParamsToSessionStorage();
    saveParamsForLocalStorage();
    window.location.href = `/challenge-mode/${
      parseCookieAPI(document.cookie).sessionToken
    }`;
  });

  randomBtn.addEventListener("click", function () {
    api_cat = "";
    api_difs = "";
    local_mode = "Random";
    saveAPIParamsToSessionStorage();
    saveParamsForLocalStorage();
    window.location.href = `/random-mode/${
      parseCookieAPI(document.cookie).sessionToken
    }`;
  });

  customBtn.addEventListener("click", function () {
    api_cat = document.querySelector("#category-custom").value;
    api_difs = document.querySelector("#category-difs").value;
    local_mode = "Custom";
    saveAPIParamsToSessionStorage();
    saveParamsForLocalStorage();
    window.location.href = `/custom-mode/${
      parseCookieAPI(document.cookie).sessionToken
    }`;
  });

  const sessionToken = await getTokenSession();
  // console.log(sessionToken);

  // if browser is safari
  if (
    navigator.userAgent.includes("AppleWebKit/") &&
    navigator.userAgent.includes("Safari/")
  ) {
    document.cookie = `sessionToken=${sessionToken};`;
  } else {
    document.cookie = `sessionToken=${sessionToken}; secure`;
  }
})();

async function getTokenSession() {
  const data = await fetch("/session-token");
  const token = await data.json();
  return token;
}

function saveAPIParamsToSessionStorage() {
  sessionStorage.setItem("api_amount", api_amount);
  sessionStorage.setItem("api_cat", api_cat);
  sessionStorage.setItem("api_difs", api_difs);
  sessionStorage.setItem("api_type", api_type);
}

function saveParamsForLocalStorage() {
  if (local_mode == "Campaign") {
    api_difs === "" ? (local_difs = "campaign") : (local_difs = api_difs);
  } else {
    api_difs === "" ? (local_difs = "random") : (local_difs = api_difs);
  }
  api_cat === "" ? (local_cat = "random") : (local_cat = api_cat);
  sessionStorage.setItem("local_cat", local_cat);
  sessionStorage.setItem("local_difs", local_difs);
  sessionStorage.setItem("local_mode", local_mode);
}
