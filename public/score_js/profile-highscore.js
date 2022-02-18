const highscorePreview = document.getElementById('highscore-preview'),
  highscoreLeft = document.getElementsByClassName('highscore-left'),
  highscoreRight = document.getElementsByClassName('highscore-right');

const userState = parseCookieAtProfile(document.cookie).userState;
if (userState == 'guest') {
  const highscores = returnScores();

  // loop through the highscores array
  highscores.forEach(async (highscore) => {
    let htmlElement = `  
  <!--score-->
    <div
    class="flex justify-between divide-x-2 divide-black text-sm border-b-2 border-black"
  >
    <p
      class="highscore-left bg-orange-300 w-full text-center py-2 flex justify-center items-center"
    >
      ${await formatScore(highscore[0].slice(6, highscore[0].length))}
    </p>
    <p
      class="highscore-right bg-yellow-400 w-full text-center py-2 flex justify-center items-center text-lg"
    >
      ${highscore[1]}
    </p>
  </div>`;

    highscorePreview.innerHTML += htmlElement;
  });

  // get the highscore in local storage
  function returnScores() {
    const result = [];
    Object.entries(localStorage).forEach(([key, value]) => {
      if (key.includes('score_')) {
        result.push([key, value]);
      }
    });
    return result;
  }

  async function formatScore(score_cat) {
    // console.log(score_cat);
    const json = await fetch(`../data/category.json`);
    const categoryObj = await json.json();
    const categoryList = Object.entries(categoryObj);
    const placeholder = score_cat.split('_');

    // logic for category
    categoryList.forEach((category) => {
      if (category[0].includes(placeholder[1])) {
        placeholder[1] = category[1];
      }
      // logic for dif
      switch (placeholder[2]) {
        case 'any':
          placeholder[2] = 'Random Difficulty';
          break;
        case 'easy':
          placeholder[2] = 'Easy';
          break;
        case 'medium':
          placeholder[2] = 'Medium';
          break;
        case 'hard':
          placeholder[2] = 'Hard';
          break;

        default:
          break;
      }
    });

    // console.log(placeholder.join(' - '));
    return placeholder.join(' - ');
  }
}

// util functions
function parseCookieAtProfile(str) {
  return str
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
}
