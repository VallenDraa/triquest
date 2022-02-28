const questionCardWrapper = document.querySelector('.question-card-wrapper'),
  timerBars = document.querySelectorAll('.timer-bar'),
  questionCards = document.querySelectorAll('.question-card'),
  afterAnswerWrapper = document.querySelector('.after-answer-wrapper'),
  afterAnswerCard = document.querySelector('.after-answer-card'),
  afterAnswerMes = document.querySelector('.after-answer-mes'),
  iconCorrectIncorrect = document.querySelector('.icon-co-in'),
  correctAnswerMes = document.querySelector('.correct-answer'),
  resultScreen = document.querySelector('.result-screen'),
  answerOptionWrapper = document.querySelector('.answer-option-wrapper'),
  answerOptions = document.querySelectorAll('.answer-option'),
  progressBar = document.querySelector('.circular-progress'),
  valueContainer = document.querySelector('.value-container'),
  highscore = document.querySelector('.highscore'),
  resultToMainBtn = document.querySelector('.result-to-main-btn'),
  endGameBtn = document.querySelectorAll('.end-game-btn'),
  questionTransition = document.querySelectorAll('#question-transition'),
  nextQuestionBtn = document.querySelector('.next-question');

let multipleOrBool,
  isInAfterAnswer = false,
  totalCorrectAns = 0;

let stillFetching = true,
  sessionToken = parseCookieAtGameplay(document.cookie).sessionToken;
// for points
const key = `score_${sessionStorage.getItem(
  'local_mode'
)}_${sessionStorage.getItem('local_cat')}_${sessionStorage.getItem(
  'local_difs'
)}`;

// calling api and assigning the questions
const questions = {
  fetchQuestion: (amount, cat, difs, type, sessionToken) => {
    // for debug
    // console.log(
    //   `Parameter that was sent to the server side = /get_question/${amount},${cat},${difs},${type},${sessionToken}`
    // );
    return fetch(
      `/get_question/${amount},${cat},${difs},${type},${sessionToken}`
    )
      .then((res) => res.json())
      .then((questionsRes) => {
        // for debug
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
    // if there are no questions
    if (questionsArr.length === 0) {
      resultScreenProperties(
        'There Are No More Questions For This Category',
        totalCorrectAns
      );
      return;
    }

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
    // match height between after answer card and question card
    matchHeight(answerOptionWrapper, afterAnswerCard);
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
  questionList: [],
  multipleOrBool: undefined, //multiple = 0 , bool = 1
  currentQuestion: 0,
};

// timerBar function
let time = 16;
let endedByUser = false;
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
  time = 16;
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
  const timeInterval = 120;
  setTimeout(() => {
    const timer = setInterval(() => {
      time -= timeInterval / 1000;
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
        if (endedByUser) {
          resultScreenProperties('You Ended The Game !', totalCorrectAns);
        } else {
          resultScreenProperties('You Ran Out Of Time', totalCorrectAns);
        }
      }
    }, timeInterval);
    const changeBar = setInterval(() => {
      changeTimerBarStyle();
      if (time <= 0.1) {
        clearInterval(changeBar);
      }
    }, timeInterval);
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
  // match height between after answer card and question card
  matchHeight(answerOptionWrapper, afterAnswerCard);
});
// everytime an answer is clicked
answerOptions.forEach((option) => {
  option.addEventListener('click', function () {
    removeAnimationClass('animate-slide-x', questionCards);
    isInAfterAnswer = true;
    // add the index
    questions.currentQuestion++;

    // show after screen
    totalCorrectAns = checkIfAnswerCorrect(
      option,
      iconCorrectIncorrect,
      totalCorrectAns
    );

    // show after answer card
    afterAnswerWrapper.classList.remove('hidden');
    afterAnswerWrapper.classList.remove('animate-fade-out');
    afterAnswerWrapper.classList.add('animate-fade-in');

    // check the index of the current question to fetch more questions
    // temporary fix for safari non-working after-answer animation

    // check if the mode is campaign
    if (sessionStorage.getItem('local_mode') != 'Campaign') {
      if (questions.currentQuestion == questions.questionList.length - 1) {
        questions.fetchQuestion(
          sessionStorage.getItem('api_amount'),
          sessionStorage.getItem('api_cat'),
          sessionStorage.getItem('api_difs'),
          sessionStorage.getItem('api_type'),
          sessionToken
        );
      }
    } else {
      campaignModeFetchQuestion();
    }
  });
});
// everytime next question button is clicked
nextQuestionBtn.addEventListener('click', function () {
  isInAfterAnswer = false;

  // remove the correct answer indicator
  answerOptions.forEach((option) => {
    option.classList.remove('co');
  });

  // hide the after answer card
  afterAnswerWrapper.classList.remove('animate-fade-in');
  afterAnswerWrapper.classList.add('hidden');

  // check the index and refresh the question
  if (questions.currentQuestion !== questions.questionList.length) {
    // to refresh the question
    questions.assignQuestionPropertyToCard(
      questions.questionList,
      questions.currentQuestion
    );

    // to remove animation and to reset timer bar
    setTimeout(() => {
      toggleAnimationClass('animate-slide-x', questionCards);
    }, 100);
    hideNShow(questionCards[multipleOrBool]);
    resetTimeAndBar();
  }
  // check the index and call the result screen
  else {
    resultScreenProperties(undefined, totalCorrectAns);
  }
  toggleQuestionTransition();
});
// everytime the endgamebtn is pressed
endGameBtn.forEach((btn) => {
  btn.addEventListener('click', () => {
    endedByUser = true; //this will trigger a function in runtimerbar and end the game immediately
    time = 0;
  });
});

// after answer
function checkIfAnswerCorrect(answerChoice, icon, totalCorrectAns) {
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

  // return the total points
  return totalCorrectAns;
}

// result screen
function resultScreenProperties(message, totalCorrectAns) {
  // console.log(`Total Correct Answer: ${totalCorrectAns}`);
  if (typeof message === 'string' && message !== '') {
    document.querySelector('.result-mes').textContent = message;
  }

  resultScreen.classList.remove('hidden');
  resultScreen.classList.add('animate-fade-in');
  resultScreen.querySelector('div').classList.add('animate-pop-up');
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
  resultToMainBtn.addEventListener('click', function () {
    savePoints();
    const userID = parseCookieAtGameplay(document.cookie).id;
    if (totalCorrectAns) {
      const value = totalCorrectAns === 0 ? '0' : totalCorrectAns;
      if (userID) {
        // console.log(`/save_points/${userID}/${scoreKey}`);
        window.location.href = `/save_points/${userID}/${key}/${value}`;
      } else {
        window.location.href = `/save_points/guest/guest/guest`;
      }
    } else {
      window.location.href = '/';
    }
  });
}
function savePoints() {
  const userState = parseCookieAtGameplay(document.cookie).userState;
  const currentScore = parseInt(parseCookieAtGameplay(document.cookie)[key]);
  const value = totalCorrectAns === 0 ? '0' : totalCorrectAns;

  if (userState == 'notGuest') return;

  if (totalCorrectAns > localStorage.getItem(key)) {
    localStorage.setItem(key, value);
  }
}
function fetchPoint(highscoreHTML) {
  if (parseCookieAtGameplay(document.cookie).userState == 'guest') {
    getPointsAndDisplayIt(localStorage.getItem(key), highscoreHTML);
  } else {
    fetch(`/api/fetch_highscore/${key}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        getPointsAndDisplayIt(data.score, highscoreHTML);
      });
  }
}
function getPointsAndDisplayIt(source, highscoreHTML) {
  // console.log(source, totalCorrectAns);
  if (source) {
    if (parseInt(source) >= totalCorrectAns) {
      highscoreHTML.textContent = `Highscore: ${source}`;
    } else {
      highscoreHTML.textContent = `New Highscore: ${totalCorrectAns}`;
    }
  } else {
    highscoreHTML.textContent = `New Highscore: ${totalCorrectAns}`;
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
function toggleAnimationClass(animClass, target) {
  // console.log;
  target.forEach((x, i) => {
    x.classList.add(animClass);
  });
}
function removeAnimationClass(animClass, target) {
  // console.log;
  target.forEach((x, i) => {
    x.classList.remove(animClass);
  });
}
function removeLoadingScreen() {
  const loadingScreen = document.querySelector('.loading-screen');
  loadingScreen.classList.add('animate-fade-out');
  setTimeout(function () {
    loadingScreen.classList.add('hidden');
  }, 400);
}
function toggleQuestionTransition() {
  for (const item of questionTransition) {
    item.classList.remove('hidden');
  }
  toggleAnimationClass('animate-fade-out-delay', questionTransition);

  setTimeout(() => {
    for (const item of questionTransition) {
      item.classList.add('hidden');
    }
  }, 1500);
}
function toggleAfterAnswerWrapper() {
  for (const item of questionTransition) {
    item.classList.remove('hidden');
  }
  toggleAnimationClass('animate-fade-out-delay', questionTransition);

  setTimeout(() => {
    for (const item of questionTransition) {
      item.classList.add('hidden');
    }
  }, 1500);
}

// fetch question for campaign mode
function campaignModeFetchQuestion() {
  if (questions.currentQuestion == questions.questionList.length - 1) {
    if (questions.currentQuestion < 10) {
      questions.fetchQuestion(
        sessionStorage.getItem('api_amount'),
        sessionStorage.getItem('api_cat'),
        'medium',
        sessionStorage.getItem('api_type'),
        sessionToken
      );
    } else {
      questions.fetchQuestion(
        sessionStorage.getItem('api_amount'),
        sessionStorage.getItem('api_cat'),
        'hard',
        sessionStorage.getItem('api_type'),
        sessionToken
      );
    }
  }
}
function parseCookieAtGameplay(str) {
  return str
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
}

// loading screen for gameplay page
if (document.readyState === 'loading') {
  if (sessionStorage.getItem('local_mode') != 'Campaign') {
    questions.fetchQuestion(
      sessionStorage.getItem('api_amount'),
      sessionStorage.getItem('api_cat'),
      sessionStorage.getItem('api_difs'),
      sessionStorage.getItem('api_type'),
      sessionToken
    );
  } else {
    questions.fetchQuestion(
      sessionStorage.getItem('api_amount'),
      sessionStorage.getItem('api_cat'),
      'easy',
      sessionStorage.getItem('api_type'),
      sessionToken
    );
  }
  // when content has finished loading
  document.addEventListener('DOMContentLoaded', () => {
    afterAnswerWrapper.classList.add('hidden');

    resultScreen.classList.add('hidden');
    isInAfterAnswer = false;
    runTimerBar();
    toggleAnimationClass('animate-slide-x', questionCards);
    toggleQuestionTransition();
  });
} else {
  isInAfterAnswer = false;
  removeLoadingScreen();
  runTimerBar();
  toggleAnimationClass('animate-slide-x', questionCards);
  toggleQuestionTransition();
}

// window.addEventListener('orientationchange', () => {
//   if (mobileCheck()) {
//     pausedTime();
//   }
// });

// function mobileCheck() {
//   let check = false;
//   (function (a) {
//     if (
//       /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
//         a
//       ) ||
//       /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
//         a.substr(0, 4)
//       )
//     )
//       check = true;
//   })(navigator.userAgent || navigator.vendor || window.opera);
//   return check;
// }

// // at gameplay
// function pauseTime() {
//   if (document.querySelector('.question-card-wrapper')) {
//     const pausedTime = time;
//     while (
//       screen.orientation.type.includes('landscape') ||
//       screen.availWidth > screen.availHeight
//     ) {
//       time = pausedTime;
//     }
//   }
// }
