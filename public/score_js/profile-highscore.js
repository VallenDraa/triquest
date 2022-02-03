const highscorePreview = document.getElementById('highscore-preview'),
  highscoreLeft = document.getElementsByClassName('highscore-left'),
  highscoreRight = document.getElementsByClassName('highscore-right');

const highscores = returnScores(localStorage);

// loop through the highscores array
highscores.forEach((highscore, i) => {
  highscorePreview.innerHTML += `  <div
  class="flex justify-between divide-x-2 divide-black text-sm border-b-2 border-black"
>
  <p
    class="highscore-left bg-orange-300 w-full text-center py-2 flex justify-center items-center"
  >
    ${highscore[0].slice(6, highscore[0].length)}
  </p>
  <p
    class="highscore-right bg-yellow-400 w-full text-center py-2 flex justify-center items-center text-lg"
  >
    ${highscore[1]}
  </p>
</div>`;
  // highscoreLeft[i + 1].textContent = ;
  // highscoreRight[i + 1].textContent = ;
});

// get the highscore in local storage
function returnScores(local) {
  const result = [];
  Object.entries(localStorage).forEach(([key, value]) => {
    if (key.includes('score_')) {
      result.push([key, value]);
    }
  });
  return result;
}
