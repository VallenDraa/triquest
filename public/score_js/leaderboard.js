const countrySelect = document.getElementById('country'),
  gamemodeSelect = document.getElementById('gamemode'),
  categorySelect = document.getElementById('category'),
  difficultySelect = document.getElementById('difficulty'),
  leaderboardTable = document.getElementById('leaderboard-table'),
  tableContent = document.getElementById('table-content'),
  scoreRange = document.querySelectorAll('#score-range'),
  loadingScreenLeaderboard = document.querySelector(
    '.loading-screen-leaderboard'
  );

let query = 'score_Campaign_any_any';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    checkSelectedOptions(gamemodeSelect.value);
    await updateLeaderboard();
  });
}

//   for guest mode
(function guessModeEventListener() {
  countrySelect.addEventListener('change', async function () {
    await updateLeaderboard();
  });
  categorySelect.addEventListener('change', async function () {
    await updateLeaderboard();
  });
  gamemodeSelect.addEventListener('change', async function () {
    checkSelectedOptions(this.value);
    await updateLeaderboard();
  });
  difficultySelect.addEventListener('change', async function () {
    await updateLeaderboard();
  });
})();

// temporary function to get and sort scores
function editQuery(query, gamemode, category, difficulty) {
  /*
index[0] = gamemode
index[1] = category number
index[2] = difficulty
*/

  let temporary = query.split('_').slice(1, query.length);
  console.log(temporary, query);
  temporary[0] = gamemode;
  temporary[1] = category;
  temporary[2] = difficulty;
  return 'score_' + temporary.join('_');
}

// loading screens
const LOADING_SCREEN = {
  addLoadingScreen: function () {
    loadingScreenLeaderboard.classList.remove('anim-fade-out');
    loadingScreenLeaderboard.classList.remove('hidden');
  },
  removeLoadingScreen: function () {
    loadingScreenLeaderboard.classList.add('anim-fade-out');
    setTimeout(function () {
      loadingScreenLeaderboard.classList.add('hidden');
    }, 200);
  },
};

// updating the selections
const CATEGORIES = {
  hidesCategories: function (gameModeValue) {
    if (gameModeValue === 'Random') {
      categorySelect.querySelector(':first-child').textContent =
        'Random Categories';
    }
    categorySelect.querySelectorAll('*:not(:first-child)').forEach((item) => {
      item.classList.add('hidden');
    });
  },
  revealCategories: function () {
    categorySelect.querySelector(':first-child').textContent =
      'Any Difficulties';
    categorySelect.querySelectorAll('*:not(:first-child)').forEach((item) => {
      if (!item.classList.contains('hidden')) return;
      item.classList.remove('hidden');
    });
  },
};

const DIFFICULTIES = {
  hidesDiffs: function (gameModeValue) {
    switch (gameModeValue) {
      case 'Campaign':
        difficultySelect.querySelector(':first-child').textContent =
          'Campaign Mode';
        break;
      case 'Challenge':
        difficultySelect.querySelector(':first-child').textContent = 'Hard';
        break;
      case 'Random':
        difficultySelect.querySelector(':first-child').textContent =
          'Random Mode';
        break;
    }
    difficultySelect.querySelectorAll('*:not(:first-child)').forEach((item) => {
      if (item.classList.contains('hidden')) return;
      item.classList.add('hidden');
    });
  },
  revealDiffs: function () {
    difficultySelect.querySelector(':first-child').textContent =
      'Any Difficulties';
    difficultySelect.querySelectorAll('*:not(:first-child)').forEach((item) => {
      if (!item.classList.contains('hidden')) return;
      item.classList.remove('hidden');
    });
  },
};

function checkSelectedOptions(gameModeValue) {
  if (gameModeValue == 'Random') {
    DIFFICULTIES.hidesDiffs(gameModeValue);
    CATEGORIES.hidesCategories(gameModeValue);
  } else if (gameModeValue == 'Challenge' || gameModeValue == 'Campaign') {
    DIFFICULTIES.hidesDiffs(gameModeValue);
    CATEGORIES.revealCategories();
  } else {
    DIFFICULTIES.revealDiffs();
    CATEGORIES.revealCategories();
  }
}

// updating the leaderboard
async function findAndSortScores(query) {
  query = query.split('_');
  let pointValue = [];
  let results = [];
  tableContent.innerHTML = '';

  Object.entries(localStorage).forEach(([key, value]) => {
    // console.log(key);
    // console.log(query);
    if (query[0] != 'any' && query[1] != 'any') {
      if (
        key.includes(query[0]) &&
        key.includes(query[1]) &&
        key.includes(query[2])
      ) {
        pointValue.push(value);
      }
    } else {
      if (key.includes('score_' + query[0])) {
        pointValue.push(value);
      }
    }
  });
  pointValue = pointValue.sort((a, b) => b - a);

  pointValue.forEach((value, i) => {
    let html = `
    <div
    id="score-range"
    class="text-center teko font-bold border-b-2 border-black flex">
        <p class="rank p-1 bg-orange-300 basis-[20%]">${i + 1}</p>
        <a class="rank p-1 bg-amber-300 basis-[40%] truncate block hover:underline" href="/profile/guest" title="Go To guest's Profile">guest</a>
        <p class="rank p-1 bg-yellow-300 basis-[40%]">${value}</p>
    </div>
  `;
    results.push(html);
  });

  if (results.length > 0) {
    results.forEach((item) => {
      tableContent.innerHTML += item;
    });
  } else {
    tableContent.innerHTML += `<p class="text-center font-light text-lg mt-2 fira-sans text-slate-800">No Scores Found</p>`;
  }
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
async function updateLeaderboard() {
  LOADING_SCREEN.addLoadingScreen();
  query = editQuery(
    query,
    gamemodeSelect.value,
    categorySelect.value,
    difficultySelect.value
  );
  // console.log(query);
  await findAndSortScores(query);
  //   console.log(categorySelect.value);
  LOADING_SCREEN.removeLoadingScreen();
}
