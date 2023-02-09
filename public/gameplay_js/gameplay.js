const questionCardWrapper = document.querySelector(".question-card-wrapper"),
  timerBars = document.querySelectorAll(".timer-bar"),
  questionCards = document.querySelectorAll(".question-card"),
  afterAnswerWrapper = document.querySelector(".after-answer-wrapper"),
  afterAnswerCard = document.querySelector(".after-answer-card"),
  afterAnswerMes = document.querySelector(".after-answer-mes"),
  iconCorrectIncorrect = document.querySelector(".icon-co-in"),
  correctAnswerMes = document.querySelector(".correct-answer"),
  resultScreen = document.querySelector(".result-screen"),
  answerOptionWrapper = document.querySelector(".answer-option-wrapper"),
  answerOptions = document.querySelectorAll(".answer-option"),
  progressBar = document.querySelector(".circular-progress"),
  valueContainer = document.querySelector(".value-container"),
  highscore = document.querySelector(".highscore"),
  resultToMainBtn = document.querySelector(".result-to-main-btn"),
  endGameBtn = document.querySelectorAll(".end-game-btn"),
  questionTransition = document.querySelectorAll("#question-transition"),
  nextQuestionBtn = document.querySelector(".next-question");

let multipleOrBool,
  isInAfterAnswer = false,
  totalCorrectAns = 0;

let stillFetching = true,
  sessionToken = parseCookieAtGameplay(document.cookie).sessionToken;
// for points
const key = `score_${sessionStorage.getItem(
  "local_mode"
)}_${sessionStorage.getItem("local_cat")}_${sessionStorage.getItem(
  "local_difs"
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
        "There Are No More Questions For This Category",
        totalCorrectAns
      );
      return;
    }

    // for multiple choice
    if (questionsArr[i].type == "multiple") {
      document.querySelector(".question-four-opt").innerHTML =
        questionsArr[i].question;
      questions.multipleAnswerAssign(
        questionsArr[i].correct_answer,
        questionsArr[i].incorrect_answers,
        document.querySelectorAll(".answer-four")
      );
      questions.questionCardFooter(questionsArr, i);
      document.querySelector(".question-card-two").classList.add("hidden");
      document.querySelector(".question-card-four").classList.remove("hidden");
      multipleOrBool = 0;
    }

    // for boolean choice
    else {
      document.querySelector(".question-two-opt").innerHTML =
        questionsArr[i].question;
      questions.boolAnswerAssign(
        questionsArr[i].correct_answer,
        document.querySelectorAll(".answer-two")
      );
      questions.questionCardFooter(questionsArr, i);
      document.querySelector(".question-card-four").classList.add("hidden");
      multipleOrBool = 1;
      document.querySelector(".question-card-two").classList.remove("hidden");
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
        element[indexCard].classList.add("co");
      }
      element[indexCard].innerHTML = choices[indexChoice];

      //  pushing the index to the respective array, so that, that number index wont be picked again
      pastNumChoice.push(indexChoice);
      pastNumCard.push(indexCard);
    }
  },
  boolAnswerAssign: (correct, answerCard) => {
    const trueOpt = "True";

    if (trueOpt === correct) {
      answerCard[0].classList.add("co");
      answerCard[1].classList.add("li");
    } else {
      answerCard[0].classList.add("li");
      answerCard[1].classList.add("co");
    }
  },
  questionCardFooter: (questionsArr, i) => {
    if (questionsArr[i].type == "multiple") {
      document.querySelector(".footer-four-opt").textContent = `Q-${i + 1} · ${
        questionsArr[i].difficulty
      } · ${questionsArr[i].category}`;
    } else {
      document.querySelector(".footer-two-opt").textContent = `Q-${i + 1} · ${
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
    timerBar.setAttribute("style", `width:${(time * 10) / 1.5}%`);
    if (time <= 10) {
      timerBar.classList.replace("bg-green-400", "bg-orange-400");
    }
    if (time <= 5) {
      timerBar.classList.replace("bg-orange-400", "bg-red-500");
    }
    if (time <= 0.1) {
      timerBar.classList.replace("bg-red-500", "bg-transparent");
    }
  });
}
function resetTimeAndBar() {
  time = 16;
  //change bar style
  timerBars.forEach((timerBar) => {
    turnBarToGreen(timerBar);
    timerBar.classList.remove("duration-1000");
    timerBar.setAttribute("style", `width:100%`);
  });
  // re-add transition
  setTimeout(() => {
    timerBars.forEach((timerBar) => {
      timerBar.classList.add("duration-1000");
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
          resultScreenProperties("You Ended The Game !", totalCorrectAns);
        } else {
          resultScreenProperties("You Ran Out Of Time", totalCorrectAns);
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
  if (timerBar.classList.contains("bg-green-400")) {
    return;
  } else if (timerBar.classList.contains("bg-orange-400")) {
    timerBar.classList.replace("bg-orange-400", "bg-green-400");
  } else if (timerBar.classList.contains("bg-red-500")) {
    timerBar.classList.replace("bg-red-500", "bg-green-400");
  }
}

// resize the questions font size
window.addEventListener("resize", () => {
  // match height between after answer card and question card
  matchHeight(answerOptionWrapper, afterAnswerCard);
});
// everytime an answer is clicked
answerOptions.forEach((option) => {
  option.addEventListener("click", function () {
    removeAnimationClass("animate-slide-x", questionCards);
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
    afterAnswerWrapper.classList.remove("hidden");
    afterAnswerWrapper.classList.remove("animate-fade-out");
    afterAnswerWrapper.classList.add("animate-fade-in");

    // check the index of the current question to fetch more questions
    // temporary fix for safari non-working after-answer animation

    // check if the mode is campaign
    if (sessionStorage.getItem("local_mode") != "Campaign") {
      if (questions.currentQuestion == questions.questionList.length - 1) {
        questions.fetchQuestion(
          sessionStorage.getItem("api_amount"),
          sessionStorage.getItem("api_cat"),
          sessionStorage.getItem("api_difs"),
          sessionStorage.getItem("api_type"),
          sessionToken
        );
      }
    } else {
      campaignModeFetchQuestion();
    }
  });
});
// everytime next question button is clicked
nextQuestionBtn.addEventListener("click", function () {
  isInAfterAnswer = false;

  // remove the correct answer indicator
  answerOptions.forEach((option) => {
    option.classList.remove("co");
  });

  // hide the after answer card
  afterAnswerWrapper.classList.remove("animate-fade-in");
  afterAnswerWrapper.classList.add("hidden");

  // check the index and refresh the question
  if (questions.currentQuestion !== questions.questionList.length) {
    // to refresh the question
    questions.assignQuestionPropertyToCard(
      questions.questionList,
      questions.currentQuestion
    );

    // to remove animation and to reset timer bar
    setTimeout(() => {
      toggleAnimationClass("animate-slide-x", questionCards);
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
  btn.addEventListener("click", () => {
    endedByUser = true; //this will trigger a function in runtimerbar and end the game immediately
    time = 0;
  });
});

// after answer
function checkIfAnswerCorrect(answerChoice, icon, totalCorrectAns) {
  if (answerChoice.classList.contains("co")) {
    icon.classList.replace("fa-times", "fa-check");
    icon.classList.replace("bg-red-500", "bg-green-400");
    afterAnswerMes.textContent = "Your Answer Is Correct !";
    icon.style.padding = "1rem";
    totalCorrectAns++;
  } else {
    icon.classList.replace("fa-check", "fa-times");
    icon.classList.replace("bg-green-400", "bg-red-500");
    afterAnswerMes.textContent = "Your Answer Is Incorrect !";
    icon.style.padding = "1rem 1.5rem";
  }
  correctAnswerMes.textContent = document.querySelector(".co").innerText;

  // return the total points
  return totalCorrectAns;
}

// result screen
function resultScreenProperties(message, totalCorrectAns) {
  // console.log(`Total Correct Answer: ${totalCorrectAns}`);
  if (typeof message === "string" && message !== "") {
    document.querySelector(".result-mes").textContent = message;
  }

  resultScreen.classList.remove("hidden");
  resultScreen.classList.add("animate-fade-in");
  resultScreen.querySelector("div").classList.add("animate-pop-up");
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
  resultToMainBtn.addEventListener("click", function () {
    savePoints();
    const userID = parseCookieAtGameplay(document.cookie).id;
    if (totalCorrectAns) {
      const value = totalCorrectAns === 0 ? "0" : totalCorrectAns;
      if (userID) {
        // console.log(`/save_points/${userID}/${scoreKey}`);
        window.location.href = `/save_points/${userID}/${key}/${value}`;
      } else {
        window.location.href = `/save_points/guest/guest/guest`;
      }
    } else {
      window.location.href = "/";
    }
  });
}
function savePoints() {
  const userState = parseCookieAtGameplay(document.cookie).userState;
  const currentScore = parseInt(parseCookieAtGameplay(document.cookie)[key]);
  const value = totalCorrectAns === 0 ? "0" : totalCorrectAns;

  if (userState == "notGuest") return;

  if (totalCorrectAns > localStorage.getItem(key)) {
    localStorage.setItem(key, value);
  }
}
function fetchPoint(highscoreHTML) {
  if (parseCookieAtGameplay(document.cookie).userState == "guest") {
    getPointsAndDisplayIt(
      localStorage.getItem(key),
      highscoreHTML,
      totalCorrectAns
    );
  } else {
    fetch(`/api/fetch_highscore/${key}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        getPointsAndDisplayIt(data.score, highscoreHTML, totalCorrectAns);
      });
  }
}
function getPointsAndDisplayIt(source, highscoreHTML, totalCorrectAns) {
  if (source) {
    if (
      parseInt(source) >= totalCorrectAns ||
      parseInt(source) !== 0 ||
      parseInt(source) !== undefined
    ) {
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
    elementToObserved.offsetHeight.toString() + "px";
  elementToBeChanged.style.width =
    elementToObserved.offsetWidth.toString() + "px";
}
function hideNShow(target) {
  target.classList.add("hidden");
  setTimeout(function () {
    target.classList.remove("hidden");
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
  const loadingScreen = document.querySelector(".loading-screen");
  loadingScreen.classList.add("animate-fade-out");
  setTimeout(function () {
    loadingScreen.classList.add("hidden");
  }, 400);
}
function toggleQuestionTransition() {
  removeAnimationClass("animate-fade-out-delay", questionTransition);
  for (const item of questionTransition) {
    item.classList.remove("hidden");
  }
  toggleAnimationClass("animate-fade-out-delay", questionTransition);

  setTimeout(() => {
    for (const item of questionTransition) {
      item.classList.add("hidden");
    }
  }, 1500);
}
function toggleAfterAnswerWrapper() {
  for (const item of questionTransition) {
    item.classList.remove("hidden");
  }
  toggleAnimationClass("animate-fade-out-delay", questionTransition);

  setTimeout(() => {
    for (const item of questionTransition) {
      item.classList.add("hidden");
    }
  }, 1500);
}

// fetch question for campaign mode
function campaignModeFetchQuestion() {
  if (questions.currentQuestion == questions.questionList.length - 1) {
    if (questions.currentQuestion < 10) {
      questions.fetchQuestion(
        sessionStorage.getItem("api_amount"),
        sessionStorage.getItem("api_cat"),
        "medium",
        sessionStorage.getItem("api_type"),
        sessionToken
      );
    } else {
      questions.fetchQuestion(
        sessionStorage.getItem("api_amount"),
        sessionStorage.getItem("api_cat"),
        "hard",
        sessionStorage.getItem("api_type"),
        sessionToken
      );
    }
  }
}
function parseCookieAtGameplay(str) {
  return str
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
}

// loading screen for gameplay page
if (document.readyState === "loading") {
  if (sessionStorage.getItem("local_mode") != "Campaign") {
    questions.fetchQuestion(
      sessionStorage.getItem("api_amount"),
      sessionStorage.getItem("api_cat"),
      sessionStorage.getItem("api_difs"),
      sessionStorage.getItem("api_type"),
      sessionToken
    );
  } else {
    questions.fetchQuestion(
      sessionStorage.getItem("api_amount"),
      sessionStorage.getItem("api_cat"),
      "easy",
      sessionStorage.getItem("api_type"),
      sessionToken
    );
  }
  // when content has finished loading
  document.addEventListener("DOMContentLoaded", () => {
    afterAnswerWrapper.classList.add("hidden");

    resultScreen.classList.add("hidden");
    isInAfterAnswer = false;
    runTimerBar();
    for (const item of questionTransition) {
      item.classList.add("hidden");
    }
    toggleAnimationClass("animate-slide-x", questionCards);
  });
} else {
  isInAfterAnswer = false;
  removeLoadingScreen();
  runTimerBar();
  for (const item of questionTransition) {
    item.classList.add("hidden");
  }
  toggleAnimationClass("animate-slide-x", questionCards);
}
