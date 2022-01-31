const questionCardWrapper = document.querySelector('.question-card-wrapper'),
  timerBars = document.querySelectorAll('.timer-bar'),
  questionCards = document.querySelectorAll('.question-card'),
  afterAnswerWrapper = document.querySelector('.after-answer-wrapper'),
  afterAnswerCard = document.querySelector('.after-answer-card'),
  afterAnswerMes = document.querySelector('.after-answer-mes'),
  iconCorrectIncorrect = document.querySelector('.icon-co-in'),
  correctAnswerMes = document.querySelector('.correct-answer'),
  resultScreen = document.querySelector('.result-answer'),
  answerOptionWrapper = document.querySelector('.answer-option-wrapper'),
  answerOptions = document.querySelectorAll('.answer-option'),
  progressBar = document.querySelector('.circular-progress'),
  valueContainer = document.querySelector('.value-container'),
  highscore = document.querySelector('.highscore'),
  resultToMainBtn = document.querySelector('.result-to-main-btn');

let multipleOrBool,
  isInAfterAnswer = false,
  totalCorrectAns = 0;

let stillFetching = true;

// for points
const key = `${sessionStorage.getItem('local_mode')}${sessionStorage.getItem(
  'local_cat'
)}${sessionStorage.getItem('local_difs')}`;

// calling api and assigning the questions
const questions = {
  fetchQuestion: (amount, cat, difs, type, sessionToken) => {
    // for debug
    console.log(
      `Parameter that was sent to the server side = /get_question/${amount},${cat},${difs},${type},${sessionToken}`
    );
    return fetch(
      `/get_question/${amount},${cat},${difs},${type},${sessionToken}`
    )
      .then((res) => res.json())
      .then((questionsRes) => {
        // console.log(questionsRes.results);
        questionsRes.results.forEach((question) => {
          questions.questionList.push(question);
        });
      })
      .then(() => {
        questions.assignQuestionPropertyToCard(
          questions.questionList,
          questions.currentQuestion
        );
        removeLoadingScreen();
      });
  },
  assignQuestionPropertyToCard: (questionsArr, i) => {
    // for multiple choice
    if (questionsArr[i].type == 'multiple') {
      document.querySelector('.question-four-opt').innerHTML =
        questionsArr[i].question;
      questions.multipleAnswerAssign(
        questionsArr[i].correct_answer,
        questionsArr[i].incorrect_answers,
        document.querySelectorAll('.answer-four')
      );
      questions.questionCardFooter(questionsArr, i);
      document.querySelector('.question-card-two').classList.add('hidden');
      document.querySelector('.question-card-four').classList.remove('hidden');
      multipleOrBool = 0;
    }

    // for boolean choice
    else {
      document.querySelector('.question-two-opt').innerHTML =
        questionsArr[i].question;
      questions.boolAnswerAssign(
        questionsArr[i].correct_answer,
        document.querySelectorAll('.answer-two')
      );
      questions.questionCardFooter(questionsArr, i);
      document.querySelector('.question-card-four').classList.add('hidden');
      multipleOrBool = 1;
      document.querySelector('.question-card-two').classList.remove('hidden');
    }
  },
  multipleAnswerAssign: (correct, incorrects, element) => {
    let choices = incorrects.concat(correct),
      pastNumChoice = [],
      pastNumCard = [],
      indexChoice,
      indexCard;

    function generateIndex(pastNumType, indexType) {
      if (pastNumType.length != 0) {
        while (pastNumType.includes(indexType)) {
          indexType = Math.round(Math.random() * 3);
        }
      } else {
        indexType = Math.round(Math.random() * 3);
      }
      return indexType;
    }

    for (const choice in choices) {
      // randomize the choice input to html
      indexChoice = generateIndex(pastNumChoice, indexChoice);
      indexCard = generateIndex(pastNumCard, indexCard);

      // insert to html and check if the choice is the correct Answer
      if (choices[indexChoice] === correct) {
        element[indexCard].classList.add('co');
      }
      element[indexCard].innerHTML = choices[indexChoice];

      //  pushing the index to the respective array, so that, that number index wont be picked again
      pastNumChoice.push(indexChoice);
      pastNumCard.push(indexCard);
    }
  },
  boolAnswerAssign: (correct, answerCard) => {
    const trueOpt = 'True';

    if (trueOpt === correct) {
      answerCard[0].classList.add('co');
      answerCard[1].classList.add('li');
    } else {
      answerCard[0].classList.add('li');
      answerCard[1].classList.add('co');
    }
  },
  questionCardFooter: (questionsArr, i) => {
    if (questionsArr[i].type == 'multiple') {
      document.querySelector('.footer-four-opt').textContent = `Q-${i + 1} · ${
        questionsArr[i].difficulty
      } · ${questionsArr[i].category}`;
    } else {
      document.querySelector('.footer-two-opt').textContent = `Q-${i + 1} · ${
        questionsArr[i].difficulty
      } · ${questionsArr[i].category}`;
    }
  },
  resizeText: (string) => {
    if (string.length > 100 && string.length < 130) {
      if (window.innerWidth > 768) {
        // console.log(
        //   `succeed in changing font-size of string text for:\n\n \"${string}\"\n\ntype [1A]`
        // );
        return `font-size: 1.5rem; line-height: 2rem;`;
      } else {
        // console.log(
        //   `succeed in changing font-size of string text for:\n\n \"${string}\"\n\ntype [1B]`
        // );
        return `font-size: 1.125rem; line-height: 1.75rem;`;
      }
    } else if (string.length > 130 && string.length < 160) {
      if (window.innerWidth > 768) {
        // console.log(
        //   `succeed in changing font-size of string text for:\n\n \"${string}\"\n\ntype [2A]`
        // );
        return `font-size: 1.125rem; line-height: 1.75rem;`;
      } else {
        // console.log(
        //   `succeed in changing font-size of string text for:\n\n \"${string}\"\n\ntype [2B]`
        // );
        return `font-size: 1rem; line-height: 1.5rem;`;
      }
    }
  },
  questionList: [],
  multipleOrBool: undefined, //multiple = 0 , bool = 1
  currentQuestion: 0,
};

// timerBar function
let time = 18;
function changeTimerBarStyle() {
  timerBars.forEach((timerBar) => {
    timerBar.setAttribute('style', `width:${(time * 10) / 1.8}%`);
    if (time <= 10) {
      timerBar.classList.replace('bg-green-400', 'bg-orange-400');
    }
    if (time <= 5) {
      timerBar.classList.replace('bg-orange-400', 'bg-red-500');
    }
    if (time <= 0.1) {
      timerBar.classList.replace('bg-red-500', 'bg-transparent');
    }
  });
}
function resetTimeAndBar() {
  time = 19;
  //change bar style
  timerBars.forEach((timerBar) => {
    turnBarToGreen(timerBar);
    timerBar.classList.remove('duration-1000');
    timerBar.setAttribute('style', `width:100%`);
  });
  // re-add transition
  setTimeout(() => {
    timerBars.forEach((timerBar) => {
      timerBar.classList.add('duration-1000');
    });
  }, 50);
}
function runTimerBar() {
  setTimeout(() => {
    const timer = setInterval(() => {
      time -= 0.1;
      // check if isInAfterAnswer is true
      if (isInAfterAnswer) {
        if (time <= 5) {
          time = 15;
        }
      }
      if (time <= 0) {
        clearInterval(timer);
        time = 0;
        // if time ran out
        resultScreenProperties('You Ran Out Of Time', totalCorrectAns);
      }
    }, 100);
    const changeBar = setInterval(() => {
      changeTimerBarStyle();
      if (time <= 0.1) {
        clearInterval(changeBar);
      }
    }, 100);
  }, 1000);
}
function turnBarToGreen(timerBar) {
  if (timerBar.classList.contains('bg-green-400')) {
    return;
  } else if (timerBar.classList.contains('bg-orange-400')) {
    timerBar.classList.replace('bg-orange-400', 'bg-green-400');
  } else if (timerBar.classList.contains('bg-red-500')) {
    timerBar.classList.replace('bg-red-500', 'bg-green-400');
  }
}

// resize the questions font size
window.addEventListener('resize', () => {
  //resize the question font size based on how many characters the sentece has
  document.querySelectorAll('.question').forEach((question) => {
    question.setAttribute('style', questions.resizeText(question.innerText));
  });
});

// everytime an answer is clicked
answerOptions.forEach((option) => {
  option.addEventListener('click', function () {
    isInAfterAnswer = true;
    // add the index
    questions.currentQuestion++;

    // match height between after answer card and question card
    matchHeight(answerOptionWrapper, afterAnswerCard);

    // show after screen
    totalCorrectAns = checkIfAnswerCorrect(
      option,
      iconCorrectIncorrect,
      afterAnswerWrapper,
      totalCorrectAns
    );

    // check the index of the current question to fetch more questions
    if (questions.currentQuestion == questions.questionList.length - 1) {
      questions.fetchQuestion(
        sessionStorage.getItem('api_amount'),
        sessionStorage.getItem('api_cat'),
        sessionStorage.getItem('api_difs'),
        sessionStorage.getItem('api_type'),
        document.cookie.split('=')[1]
      );
    }
  });
});

// everytime next question button is clicked
document.querySelector('.next-question').addEventListener('click', function () {
  isInAfterAnswer = false;

  // remove the correct answer indicator
  answerOptions.forEach((option) => {
    option.classList.remove('co');
  });

  // re-hide the after answer card
  afterAnswerWrapper.classList.add('hidden');

  // check the index and refresh the question
  if (questions.currentQuestion !== questions.questionList.length) {
    // add animation to the question card

    // to refresh the question
    questions.assignQuestionPropertyToCard(
      questions.questionList,
      questions.currentQuestion
    );

    // to remove animation and to reset timer bar
    toggleAnimationToAll('anim-slide-x', questionCards);
    hideNShow(questionCards[multipleOrBool]);
    resetTimeAndBar();
  }
  // check the index and call the result screen
  else {
    resultScreenProperties(undefined, totalCorrectAns);
  }
});

// after answer
function checkIfAnswerCorrect(
  answerChoice,
  icon,
  afterAnswerWrapper,
  totalCorrectAns
) {
  if (answerChoice.classList.contains('co')) {
    icon.classList.replace('fa-times', 'fa-check');
    icon.classList.replace('bg-red-500', 'bg-green-400');
    afterAnswerMes.textContent = 'Your Answer Is Correct !';
    icon.style.padding = '1rem';
    totalCorrectAns++;
  } else {
    icon.classList.replace('fa-check', 'fa-times');
    icon.classList.replace('bg-green-400', 'bg-red-500');
    afterAnswerMes.textContent = 'Your Answer Is Incorrect !';
    icon.style.padding = '1rem 1.5rem';
  }
  correctAnswerMes.textContent = document.querySelector('.co').innerText;
  afterAnswerWrapper.classList.remove('hidden');

  // return the total points
  return totalCorrectAns;
}

// result screen
function resultScreenProperties(message, totalCorrectAns) {
  // console.log(`Total Correct Answer: ${totalCorrectAns}`);
  if (typeof message === 'string' && message !== '') {
    document.querySelector('.result-mes').textContent = message;
  }

  document.querySelector('.result-screen').classList.remove('hidden');
  document.querySelector('.result-screen').classList.add('anim-lighten-full');
  document.querySelector('.result-screen>div').classList.add('anim-pop-up');
  setTimeout(() => {
    let circleValue = 0,
      totalQuestionAnswered = questions.currentQuestion + 1,
      speed = 60;

    let progress = setInterval(() => {
      valueContainer.textContent = `${totalCorrectAns}/${totalQuestionAnswered}`;
      progressBar.style.background = `conic-gradient(
      rgb(253 186 116) ${
        (((circleValue / totalQuestionAnswered) * 100) / 100) * 360
      }deg,
      rgb(253 224 71) ${
        (((circleValue / totalQuestionAnswered) * 100) / 100) * 360
      }deg
    )`;
      if (circleValue != totalCorrectAns) {
        circleValue++;
      }
    }, speed);
  }, 300);

  // fetch point and then display the value
  fetchPoint(highscore);

  resultToMainBtn.addEventListener('click', () => {
    window.location.href = '/';
  });
}

// point system guest user
function savePoints() {
  localStorage.setItem(key, totalCorrectAns);
}

function fetchPoint(highscoreHTML) {
  if (localStorage.getItem(key)) {
    if (parseInt(localStorage.getItem(key)) > totalCorrectAns) {
      highscoreHTML.textContent = `Highscore: ${localStorage.getItem(key)}`;
    } else {
      savePoints();
      highscoreHTML.textContent = `New Highscore: ${localStorage.getItem(key)}`;
    }
  } else {
    savePoints();
    highscoreHTML.textContent = `New Highscore: ${localStorage.getItem(key)}`;
  }
}

// util class
function matchHeight(elementToObserved, elementToBeChanged) {
  // making sure the after answer card is the same height as the current question card
  elementToBeChanged.style.height =
    elementToObserved.offsetHeight.toString() + 'px';
  elementToBeChanged.style.width =
    elementToObserved.offsetWidth.toString() + 'px';
}
function hideNShow(target) {
  target.classList.add('hidden');
  setTimeout(function () {
    target.classList.remove('hidden');
  }, 20);
}
function toggleAnimationToAll(animClass, target) {
  target.forEach((x, i) => {
    x.classList.remove(animClass);
    x.classList.add(animClass);
  });
}
function removeLoadingScreen() {
  const loadingScreen = document.querySelector('.loading-screen');
  loadingScreen.classList.add('anim-fade-out');
  setTimeout(function () {
    loadingScreen.classList.add('hidden');
  }, 200);
}

// loading screen for gameplay page
if (document.readyState === 'loading') {
  questions.fetchQuestion(
    sessionStorage.getItem('api_amount'),
    sessionStorage.getItem('api_cat'),
    sessionStorage.getItem('api_difs'),
    sessionStorage.getItem('api_type'),
    document.cookie.split('=')[1]
  );

  // when content has finished loading
  document.addEventListener('DOMContentLoaded', () => {
    // remove loading screen

    isInAfterAnswer = false;
    runTimerBar();
    toggleAnimationToAll('anim-slide-x', questionCards);
  });
} else {
  isInAfterAnswer = false;
  removeLoadingScreen();
  runTimerBar();
  toggleAnimationToAll('anim-slide-x', questionCards);
}
