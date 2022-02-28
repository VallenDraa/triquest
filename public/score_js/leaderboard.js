const countrySelect = document.getElementById('country'),
  gamemodeSelect = document.getElementById('gamemode'),
  categorySelect = document.getElementById('category'),
  difficultySelect = document.getElementById('difficulty'),
  leaderboardTable = document.getElementById('leaderboard-table'),
  tableContent = document.getElementById('table-content'),
  scoreRange = document.querySelectorAll('#score-range'),
  loadingScreenLeaderboard = document.querySelector(
    '.loading-screen-leaderboard'
  ),
  leaderboardSearch = document.getElementById('leaderboard-search'),
  currentPage = document.getElementById('current-page'),
  prevPage = document.getElementById('prev-page'),
  nextPage = document.getElementById('next-page'),
  totalPage = document.getElementById('total-page');

let query = 'score_Campaign_any_campaign_global';
let scores;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    checkSelectedGamemode(gamemodeSelect.value);
    await updateLeaderboard(1);
    PageBtnStateChange();
  });
}

// fetch the leaderboard data
categoryOptEventListener(
  countrySelect,
  gamemodeSelect,
  categorySelect,
  difficultySelect
);
// search
leaderboardSearch.addEventListener('click', async function () {
  checkSelectedGamemode(gamemodeSelect.value);
  leaderboardTable.scrollTo(0, 0);
  await updateLeaderboard(1);
});

// page moved
prevPage.addEventListener('click', async function () {
  const currentPageInt = parseInt(currentPage.textContent);

  if (currentPageInt != 1) {
    currentPage.textContent = currentPageInt - 1;
    checkSelectedGamemode(gamemodeSelect.value);
    addLeaderboardHtml(scores, currentPageInt - 1);
  }
});
nextPage.addEventListener('click', async function () {
  const currentPageInt = parseInt(currentPage.textContent);

  if (currentPageInt != parseInt(totalPage.textContent)) {
    currentPage.textContent = currentPageInt + 1;
    checkSelectedGamemode(gamemodeSelect.value);
    addLeaderboardHtml(scores, currentPageInt + 1);
  }
});

// temporary function to get and sort scores
function editQuery(query, gamemode, category, difficulty, country) {
  /*
index[0] = gamemode
index[1] = category number
index[2] = difficulty
*/

  let temporary = query.split('_').slice(1, query.length);
  // console.log(temporary, query);
  temporary[0] = gamemode;
  temporary[1] = category;
  temporary[2] = difficulty;
  temporary[3] = country;
  return temporary.join('_');
}

// loading screens
const LOADING_SCREEN = {
  addLoadingScreen: function () {
    loadingScreenLeaderboard.classList.remove('animate-fade-out');
    loadingScreenLeaderboard.classList.remove('hidden');
  },
  removeLoadingScreen: function () {
    loadingScreenLeaderboard.classList.add('animate-fade-out');
    setTimeout(function () {
      loadingScreenLeaderboard.classList.add('hidden');
    }, 400);
  },
};

// updating the selections
const CATEGORIES = {
  hidesCategories: function (gameModeValue) {
    // if (gameModeValue === 'Random') {
    //   categorySelect.querySelector(':first-child').textContent =
    //     'Random Categories';
    //   categorySelect.querySelector(':first-child').value = 'random';
    // }
    categorySelect.querySelectorAll('*:not(:first-child)').forEach((item) => {
      item.classList.add('hidden');
    });
  },
  revealCategories: function () {
    // categorySelect.querySelector(':first-child').textContent = 'Any Categories';
    // categorySelect.querySelector(':first-child').value = 'any';
    categorySelect.querySelectorAll('*:not(:first-child)').forEach((item) => {
      if (!item.classList.contains('hidden')) return;
      item.classList.remove('hidden');
    });
  },
};

const DIFFICULTIES = {
  hidesDiffs: function (gameModeValue) {
    difficultySelect.querySelector(':first-child').classList.remove('hidden');
    switch (gameModeValue) {
      case 'Campaign':
        difficultySelect.querySelector(':first-child').textContent =
          'Campaign Mode';
        difficultySelect.querySelector(':first-child').value = 'campaign';
        break;
      case 'Challenge':
        difficultySelect.querySelector(':first-child').textContent = 'Hard';
        difficultySelect.querySelector(':first-child').value = 'hard';
        break;
      case 'Random':
        difficultySelect.querySelector(':first-child').textContent =
          'Random Mode';
        difficultySelect.querySelector(':first-child').value = 'random';
        break;
    }
    difficultySelect.querySelectorAll('*:not(:first-child)').forEach((item) => {
      if (item.classList.contains('hidden')) return;
      item.classList.add('hidden');
    });
  },
  revealDiffs: function (gameModeValue) {
    // difficultySelect.querySelector(':first-child').textContent =
    //   'Any Difficulties';
    // difficultySelect.querySelector(':first-child').value = 'any';

    difficultySelect.querySelector(':first-child').classList.add('hidden');
    difficultySelect.querySelectorAll('*:not(:first-child)').forEach((item) => {
      if (!item.classList.contains('hidden')) return;
      item.classList.remove('hidden');
    });
  },
};

function checkSelectedGamemode(gameModeValue) {
  leaderboardTable.scrollTo(0, 0);
  leaderboardTable.classList.add('overflow-hidden');
  if (gameModeValue == 'Random') {
    DIFFICULTIES.hidesDiffs(gameModeValue);
    CATEGORIES.hidesCategories(gameModeValue);
  } else if (gameModeValue == 'Challenge' || gameModeValue == 'Campaign') {
    DIFFICULTIES.hidesDiffs(gameModeValue);
    CATEGORIES.revealCategories();
  } else {
    DIFFICULTIES.revealDiffs(gameModeValue);
    CATEGORIES.revealCategories();
  }
  leaderboardTable.classList.remove('overflow-hidden');
}

// adding eventlistener to the options
function categoryOptEventListener() {
  for (const arg of arguments) {
    arg.addEventListener('click', () => {
      checkSelectedGamemode(gamemodeSelect.value);
    });
  }
}

// updating the leaderboard
async function findAndSortScores(query, page) {
  query = query.split('_');
  let leaderboardAPI = `/api/leaderboard_points?query=${`${query[0]}_${query[1]}_${query[2]}`}&country=${
    query[3]
  }`;
  // console.log(leaderboardAPI);

  const json = await fetch(leaderboardAPI);
  const datas = await json.json();
  scores = datas.results.sort((a, b) => {
    return b.score_points - a.score_points;
  });
  // console.log(scores);
  addLeaderboardHtml(scores, page);
}
async function switchCategory(catNum, catList) {
  const json = await fetch(`../data/category.json`);
  const categoryObj = await json.json();
  const categoryList = Object.entries(categoryObj);

  catList.forEach(function (category) {
    if (category[0] == catNum) {
      return category[1];
    }
  });
}
async function updateLeaderboard(page) {
  LOADING_SCREEN.addLoadingScreen();
  query = editQuery(
    query,
    gamemodeSelect.value,
    categorySelect.value,
    difficultySelect.value,
    countrySelect.value
  );
  await findAndSortScores(query, page);
  //   console.log(categorySelect.value);
  LOADING_SCREEN.removeLoadingScreen();
}
async function addLeaderboardHtml(scores, page) {
  let results = [];
  tableContent.innerHTML = '';

  minIndex = scores.length - (scores.length - 50 * (page - 1));
  maxIndex = scores.length - (scores.length - 50 * page) - 1;

  for (let i = minIndex; i <= maxIndex; i++) {
    if (i < scores.length) {
      let html = `
      <div
      id="score-range"
      class="text-center font-teko font-bold border-b-2 border-black flex">
      <p class="rank p-1 bg-orange-300 basis-[20%]">${i + 1}</p>
      <a class="rank p-1 bg-amber-300 basis-[40%] truncate block hover:underline" href="/profile/others/${
        scores[i].username
      }" title="Go To ${scores[i].username}'s Profile">${scores[i].username}</a>
      <p class="rank p-1 bg-yellow-300 basis-[40%]">${
        scores[i].score_points
      }</p>
      </div>
      `;
      results.push(html);
    }
  }

  if (results.length > 0) {
    totalPage.textContent = Math.ceil(scores.length / 50);
    PageBtnStateChange();
    results.forEach((item) => {
      tableContent.innerHTML += item;
    });
  } else {
    totalPage.textContent = 1;
    PageBtnStateChange();
    return (tableContent.innerHTML += `<p class="text-center font-light text-lg my-3 font-fira-sans text-slate-800">No Scores Are Found</p>`);
  }
}

function PageBtnStateChange() {
  const currentPageInt = parseInt(currentPage.textContent);
  if (currentPageInt == 1) {
    prevPage.disabled = true;
  } else {
    prevPage.disabled = false;
  }

  if (
    currentPageInt == parseInt(totalPage.textContent) ||
    totalPage.textContent <= '0'
  ) {
    nextPage.disabled = true;
  } else {
    nextPage.disabled = false;
  }
}
