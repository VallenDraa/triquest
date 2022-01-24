const questionCardWrapper = document.querySelector('.question-card-wrapper');

// calling api and assigning the questions
const questions = {
  fetchQuestion: () => {
    return fetch('../data/sampleQuestion.json')
      .then((res) => res.json())
      .then((questionsRes) => {
        questions.assignQuestion(questionsRes.results);
      });
  },
  assignQuestion: (questionsArr) => {
    questionsArr.forEach((question, i) => {
      if (question.type === 'multiple') {
        let htmlEl = ` 
        <!-- four opt -->
        <div
        class="bg-yellow-300 border-4 border-black question-card rounded-xl shadow-2xl px-2 md:px-10 py-2 md:py-5 my-20 md:my-20  md:h-5/6 four-option flex justify-center items-center"
      >
        <div
          class="fira-sans p-4 w-full"
        >
          <section>
            <h2 class="text-xl md:text-3xl font-bold text-center py-4 max-w-4xl text-center mx-auto question" style="${questions.checkHowLongQuestion(
              question.question
            )}">
            ${question.question}
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              ${questions
                .multipleAnswerAssign(
                  question.correct_answer,
                  question.incorrect_answers
                )
                .join('')}
            </div>
            <!-- timer bar -->
            <section class="my-4 h-6 border-4 border-black rounded-xl bg-slate-200">
              <div class="h-full  duration-1000 bg-green-400 rounded-xl  timer-bar"></div>
            </section>
            <div class="flex justify-center items-center pt-4 text-xs font-light mx-auto text-center">
              <p class="text-center">Questions ${i + 1}/${
          questionsArr.length
        } · ${question.difficulty} · ${question.category}</p>
            </div>
          </section>
        </div>
      </div>
      `;
        questionCardWrapper.innerHTML += htmlEl;
      } else {
        let identifierTrue, identifierFalse;
        const trueOpt = 'True';

        if (trueOpt === question.correct_answer) {
          identifierTrue = 'co';
          identifierFalse = 'in';
        } else {
          identifierTrue = 'in';
          identifierFalse = 'co';
        }

        let htmlEl = ` 
        <!-- bool option -->
        <div
          class="bg-yellow-300 border-4 border-black question-card rounded-xl shadow-2xl px-2 md:px-10 py-2 md:py-5 my-12 md:my-20 h-5/6 flex justify-center items-center bool-option"
        >
          <div
            class="fira-sans p-4 w-full"
          >
            <section>
              <h2 class="text-xl md:text-3xl font-bold text-center py-4 max-w-4xl text-center mx-auto question">
              ${question.question}
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div
                  class="teko border-4 border-black text-2xl md:text-4xl h-16 md:h-24 flex justify-center items-center font-bold duration-300 bg-green-300 hover:bg-green-400 rounded-xl cursor-pointer ${identifierTrue}"
                >
                  True
                </div>
                <div
                  class="teko border-4 border-black text-2xl md:text-4xl h-16 md:h-24 flex justify-center items-center font-bold duration-300 bg-red-300 hover:bg-red-400 rounded-xl cursor-pointer ${identifierFalse}"
                >
                  False
                </div>
              </div>
              <!-- timer bar -->
              <section class="my-4 h-6 border-4 border-black rounded-xl bg-slate-200">
                <div class="h-full duration-1000 bg-green-400 rounded-xl timer-bar"></div>
              </section>
              <div class="flex justify-center items-center pt-4 text-xs font-light mx-auto text-center">
                <p class="text-center">Questions ${i + 1}/${
          questionsArr.length
        } · ${question.difficulty} · ${question.category}</p>
              </div>
            </section>
          </div>
        </div>`;
        questionCardWrapper.innerHTML += htmlEl;
      }
    });
  },
  multipleAnswerAssign: (correct, incorrects) => {
    let choices = incorrects.concat(correct),
      pastNum = [],
      index,
      bgColor,
      hoverBgColor,
      colorIndex = 0;
    const result = [];

    for (const choice in choices) {
      // randomize the choice input to html
      if (pastNum.length != 0) {
        while (pastNum.includes(index)) {
          index = Math.round(Math.random() * 3);
        }
      } else {
        index = Math.round(Math.random() * 3);
      }

      // change the bg-color
      switch (colorIndex) {
        case 0:
          bgColor = `bg-orange-300`;
          hoverBgColor = `hover:bg-orange-400`;
          break;
        case 1:
          bgColor = `bg-red-300`;
          hoverBgColor = `hover:bg-red-400`;
          break;
        case 2:
          bgColor = `bg-blue-300`;
          hoverBgColor = `hover:bg-blue-400`;
          break;
        case 3:
          bgColor = `bg-green-300`;
          hoverBgColor = `hover:bg-green-400`;
          break;
      }
      colorIndex++;

      // insert to html and check if the choice is the correct Answer
      if (choices[index] === correct) {
        let htmlEl = ` <div
        class="teko border-4 text-center border-black text-xl md:text-2xl h-16 md:h-24 flex justify-center items-center font-bold duration-300  rounded-xl cursor-pointer co ${bgColor} ${hoverBgColor}"
      >
        ${choices[index]}
      </div>`;
        result.push(htmlEl);
      } else {
        let htmlEl = ` <div
        class="teko border-4 text-center border-black text-xl md:text-2xl h-16 md:h-24 flex justify-center items-center font-bold duration-300  rounded-xl cursor-pointer in ${bgColor} ${hoverBgColor}"
      >
        ${choices[index]}
      </div>`;
        result.push(htmlEl);
      }
      pastNum.push(index);
    }

    return result;
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
};
questions.fetchQuestion();

// timerBar
let time = 15;
setTimeout(() => {
  const timerBars = document.querySelectorAll('.timer-bar');
  const timer = setInterval(() => {
    time -= 0.1;
  }, 100);
  const changeBar = setInterval(() => {
    timerBars.forEach((timerBar) => {
      timerBar.setAttribute('style', `width:${(time * 10) / 1.5}%`);
      if (time <= 10) {
        timerBar.classList.replace('bg-green-400', 'bg-orange-400');
      }
      if (time <= 5) {
        timerBar.classList.replace('bg-orange-400', 'bg-red-500');
      }
      if (time <= 0.1) {
        timerBar.classList.replace('bg-red-500', 'bg-slate-200');
      }
    });
    if (time <= 0.1) {
      clearInterval(changeBar);
      clearInterval(timer);
    }
  }, 100);
}, 1000);

// resize the questions font size
window.addEventListener('resize', () => {
  document.querySelectorAll('.question').forEach((question) => {
    question.setAttribute(
      'style',
      questions.checkHowLongQuestion(question.innerText)
    );
  });
});

// move question from bottom to top
let answerOpt,
  questionCard = document.querySelectorAll('.question-card');
setTimeout(() => {
  answerOpt = document.querySelector('.answer-option');
}, 500);

setInterval(() => {
  if (answerOpt.getAttribute('style') == null) {
    console.log(window.getComputedStyle(questionCard[0]));
    answerOpt.setAttribute('style', `transform: translateY(-${$})`);
  } else {
    if (answerOpt.getAttribute('style').indexOf('transform') != -1) {
      // alert('Not Empty');
    } else {
      // alert('Empty');
    }
  }
}, 4000);
