const questionCardWrapper = document.querySelector('.question-card-wrapper');

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
  currentQuestion: 0,
};
questions.fetchQuestion();

// timerBar function
let time = 15;
const timerBars = document.querySelectorAll('.timer-bar');

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
  time = 15;
  timerBars.forEach((timerBar) => {
    timerBar.classList.add('bg-green-400');
    timerBar.classList.remove('duration-1000');
    timerBar.setAttribute('style', `width:100%`);
  });
  setTimeout(() => {
    timerBars.forEach((timerBar) => {
      timerBar.classList.add('duration-1000');
    });
  }, 500);

  setTimeout(() => {
    const timer = setInterval(() => {
      time -= 0.1;
      if (time <= 0.1) {
        clearInterval(timer);
      }
    }, 100);
  }, 1000);
}

function runTimerBar() {
  setTimeout(() => {
    const timer = setInterval(() => {
      time -= 0.1;
      if (time <= 0.1) {
        clearInterval(timer);
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
  option.addEventListener('click', () => {
    // add the index
    if (questions.currentQuestion < 9) {
      questions.currentQuestion++;
    }

    resetTimeAndBar();
    // refresh the question
    questions.assignQuestionPropertyToCard(
      questions.questionList,
      questions.currentQuestion
    );
  });
});

// point system

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
