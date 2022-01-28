const questionCardWrapper = document.querySelector('.question-card-wrapper'),
  timerBars = document.querySelectorAll('.timer-bar'),
  questionCards = document.querySelectorAll('.question-card'),
  afterAnswerWrapper = document.querySelector('.after-answer-wrapper'),
  afterAnswerCard = document.querySelector('.after-answer-card'),
  afterAnswerMes = document.querySelector('.after-answer-mes'),
  iconCoIN = document.querySelector('.icon-co-in'),
  correctAnswerMes = document.querySelector('.correct-answer'),
  answerOption = document.querySelector('.answer-option'),
  progressBar = document.querySelector('.circular-progress'),
  valueContainer = document.querySelector('.value-container');

// calling api and assigning the questions
const questions = {
  fetchQuestion: () => {
    return fetch('../data/sampleQuestion.json')
      .then((res) => res.json())
      .then((questionsRes) => {
        questionsRes.results.forEach((question) => {
          questions.questionList.push(question);
        });
      })
      .then(() =>
        questions.assignQuestionPropertyToCard(
          questions.questionList,
          questions.currentQuestion
        )
      );
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
      element[indexCard].textContent = choices[indexChoice];

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
      document.querySelector('.footer-four-opt').textContent = `${i + 1}/${
        questionsArr.length
      } · ${questionsArr[i].difficulty} · ${questionsArr[i].category}`;
    } else {
      document.querySelector('.footer-two-opt').textContent = `${i + 1}/${
        questionsArr.length
      } · ${questionsArr[i].difficulty} · ${questionsArr[i].category}`;
    }
  },
  checkHowLongQuestion: (question) => {
    if (question.length > 100 && question.length < 130) {
      if (window.innerWidth > 768) {
        // console.log(
        //   `succeed in changing font-size of question text for:\n\n \"${question}\"\n\ntype [1A]`
        // );
        return `font-size: 1.5rem; line-height: 2rem;`;
      } else {
        // console.log(
        //   `succeed in changing font-size of question text for:\n\n \"${question}\"\n\ntype [1B]`
        // );
        return `font-size: 1.125rem; line-height: 1.75rem;`;
      }
    } else if (question.length > 130 && question.length < 160) {
      if (window.innerWidth > 768) {
        // console.log(
        //   `succeed in changing font-size of question text for:\n\n \"${question}\"\n\ntype [2A]`
        // );
        return `font-size: 1.125rem; line-height: 1.75rem;`;
      } else {
        // console.log(
        //   `succeed in changing font-size of question text for:\n\n \"${question}\"\n\ntype [2B]`
        // );
        return `font-size: 1rem; line-height: 1.5rem;`;
      }
    }
  },
  questionList: [],
  multipleOrBool: 0, //multiple = 0 , bool = 1
  currentQuestion: 0,
};
questions.fetchQuestion();

// timerBar function
let time = 2;
function changeTimerBarStyle() {
  timerBars.forEach((timerBar) => {
    timerBar.setAttribute('style', `width:${(time * 10) / 1.5}%`);
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
  time = 15.5;
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
      console.log(time);
      time -= 0.1;
      if (time <= 0) {
        clearInterval(timer);
        time = 0;
        // if time ran out
        resultScreen('You Ran Out Of Time');
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
  document.querySelectorAll('.question').forEach((question) => {
    question.setAttribute(
      'style',
      questions.checkHowLongQuestion(question.innerText)
    );
  });
});

// everytime an answer is clicked
document.querySelectorAll('.answer-opt').forEach((option) => {
  option.addEventListener('click', function () {
    // add the index
    if (questions.currentQuestion < 10) {
      questions.currentQuestion++;
    }
    // show after screen
    checkIfAnswerCorrect(option, iconCoIN, afterAnswerWrapper);
  });
});

// everytime next question button is clicked
document.querySelector('.next-question').addEventListener('click', function () {
  // re-hide the after answer card
  afterAnswerWrapper.classList.add('hidden');

  // check the index and refresh the question
  if (questions.currentQuestion !== questions.questionList.length) {
    // add animation to the question card
    questionCards[questions.multipleOrBool].classList.add('anim-lighten-full');

    // to refresh the question
    questions.assignQuestionPropertyToCard(
      questions.questionList,
      questions.currentQuestion
    );

    // to remove animation and to reset timer bar
    resetTimeAndBar();
    setTimeout(() => {
      questionCards[questions.multipleOrBool].classList.remove(
        'anim-lighten-full'
      );
    }, 500);
  }
  // check the index and call the result screen
  else {
    resultScreen();
  }
});

// after answer
function checkIfAnswerCorrect(answerChoice, icon, afterAnswerWrapper) {
  if (answerChoice.classList.contains('co')) {
    icon.classList.replace('fa-times', 'fa-check');
    icon.classList.replace('bg-red-500', 'bg-green-400');
    afterAnswerMes.textContent = 'Your Answer Is Correct !';
    icon.style.padding = '1rem';
  } else {
    icon.classList.replace('fa-check', 'fa-times');
    icon.classList.replace('bg-green-400', 'bg-red-500');
    afterAnswerMes.textContent = 'Your Answer Is Incorrect !';
    icon.style.padding = '1rem 1.5rem';
  }
  correctAnswerMes.textContent = document.querySelector('.co').innerText;
  afterAnswerWrapper.classList.remove('hidden');
}
const observeHeightAndWidth = new ResizeObserver(() => {
  // making sure the after answer card is the same height as the current question card
  afterAnswerCard.style.height = answerOption.offsetHeight.toString() + 'px';
  afterAnswerCard.style.width = answerOption.offsetWidth.toString() + 'px';
});

observeHeightAndWidth.observe(answerOption);

// result screen
function resultScreen(message) {
  if (message !== undefined) {
    document.querySelector('.result-mes').textContent = message;
  }

  document.querySelector('.result-screen').classList.remove('hidden');
  document.querySelector('.result-screen').classList.add('anim-lighten-full');
  document.querySelector('.result-screen>div').classList.add('anim-pop-up');
  setTimeout(() => {
    let totalCorrectAns = 4,
      totalQuestion = questions.questionList.length,
      speed = 60;

    let progress = setInterval(() => {
      console.log('s');
      valueContainer.textContent = `${totalCorrectAns}/${totalQuestion}`;
      progressBar.style.background = `conic-gradient(
      rgb(253 186 116) ${
        (((totalCorrectAns / totalQuestion) * 100) / 100) * 360
      }deg,
      rgb(253 224 71) ${
        (((totalCorrectAns / totalQuestion) * 100) / 100) * 360
      }deg
    )`;
    }, speed);
  }, 300);
}

// loading screen
if (document.readyState === 'loading') {
  function removeLoadingScreen() {
    document.querySelector('.loading-screen').classList.add('hidden');
  }

  document.addEventListener('DOMContentLoaded', () => {
    removeLoadingScreen();
    runTimerBar();
  });
} else {
  removeLoadingScreen();
  runTimerBar();
}
