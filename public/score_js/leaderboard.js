const countrySelect = document.getElementById('country'),
  gamemodeSelect = document.getElementById('gamemode'),
  categorySelect = document.getElementById('category'),
  difficultySelect = document.getElementById('difficulty'),
  leaderboardTable = document.getElementById('leaderboard-table'),
  tableContent = document.getElementById('table-content'),
  scoreRange = document.querySelectorAll('#score-range'),
  loadingScreen = document.querySelector('.loading-screen');

let query = 'Campaign_any_any';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    query = editQuery(
      query,
      gamemodeSelect.value,
      categorySelect.value,
      difficultySelect.value
    );
    console.log(query);
    await findAndSortScores(query);
    removeLoadingScreen();
  });
}

//   for guest mode
(function guessModeEventListener() {
  countrySelect.addEventListener('change', async function () {
    addLoadingScreen();
    query = editQuery(
      query,
      gamemodeSelect.value,
      categorySelect.value,
      difficultySelect.value
    );
    console.log(query);
    await findAndSortScores(query);
    //   console.log(countrySelect.value);
    removeLoadingScreen();
  });
  categorySelect.addEventListener('change', async function () {
    addLoadingScreen();
    query = editQuery(
      query,
      gamemodeSelect.value,
      categorySelect.value,
      difficultySelect.value
    );
    console.log(query);
    await findAndSortScores(query);
    //   console.log(categorySelect.value);
    removeLoadingScreen();
  });
  gamemodeSelect.addEventListener('change', async function () {
    if (this.value == 'Random') {
      difficultySelect
        .querySelectorAll('*:not(:first-child)')
        .forEach((item) => {
          item.classList.add('hidden');
        });

      categorySelect.querySelectorAll('*:not(:first-child)').forEach((item) => {
        item.classList.add('hidden');
      });
    } else if (this.value == 'Challenge' || this.value == 'Campaign') {
      categorySelect.querySelectorAll('*:not(:first-child)').forEach((item) => {
        if (!item.classList.contains('hidden')) return;
        item.classList.remove('hidden');
      });

      difficultySelect
        .querySelectorAll('*:not(:first-child)')
        .forEach((item) => {
          item.classList.add('hidden');
        });
    } else {
      difficultySelect
        .querySelectorAll('*:not(:first-child)')
        .forEach((item) => {
          if (!item.classList.contains('hidden')) return;
          item.classList.remove('hidden');
        });

      categorySelect.querySelectorAll('*:not(:first-child)').forEach((item) => {
        if (!item.classList.contains('hidden')) return;
        item.classList.remove('hidden');
      });
    }

    addLoadingScreen();
    query = editQuery(
      query,
      gamemodeSelect.value,
      categorySelect.value,
      difficultySelect.value
    );
    console.log(query);
    await findAndSortScores(query);
    //   console.log(gamemodeSelect.value);
    removeLoadingScreen();
  });
  difficultySelect.addEventListener('change', async function () {
    addLoadingScreen();
    query = editQuery(
      query,
      gamemodeSelect.value,
      categorySelect.value,
      difficultySelect.value
    );
    console.log(query);
    await findAndSortScores(query);
    //   console.log(difficulty.value);
    removeLoadingScreen();
  });
})();

// temporary function to get and sort scores
function editQuery(query, gamemode, category, difficulty) {
  /*
index[0] = gamemode
index[1] = category number
index[2] = difficulty
*/

  let temporary = query.split('_');
  temporary[0] = gamemode;
  temporary[1] = category;
  temporary[2] = difficulty;
  return temporary.join('_');
}

async function findAndSortScores(query) {
  query = query.split('_');
  let pointValue = [];
  let results = [];
  let i = 0;
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

// loading screens
function addLoadingScreen() {
  loadingScreen.classList.remove('anim-fade-out');
  loadingScreen.classList.remove('hidden');
}
function removeLoadingScreen() {
  loadingScreen.classList.add('anim-fade-out');
  setTimeout(function () {
    loadingScreen.classList.add('hidden');
  }, 200);
}

// remove category and difficulty options if random mode is chosen
