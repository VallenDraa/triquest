const questionCard = document.querySelector('.question-card');

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
        let htmlEl = ` <div
        class="bg-yellow-300 border-4 border-black rounded-xl shadow-2xl px-5 md:px-10 py-5 my-20 four-option "
      >
        <div
          class="fira-sans space-y-3 border-4 border-black rounded-lg bg-yellow-200 p-4"
        >
          <section>
            <h2 class="text-2xl md:text-3xl font-bold text-center py-4 max-w-md text-center mx-auto">
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
            <div class="flex justify-center items-center pt-4 font-light max-w-md mx-auto text-center">
              <p class="text-center">Questions ${i + 1}/${
          questionsArr.length
        } · ${question.difficulty} · ${question.category}</p>
            </div>
          </section>
        </div>
      </div>
      `;
        questionCard.innerHTML += htmlEl;
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
          class="bg-yellow-300 border-4 border-black rounded-xl shadow-2xl px-5 md:px-10 py-5 my-20  four-option"
        >
          <div
            class="fira-sans space-y-3 border-4 border-black rounded-lg bg-yellow-200 p-4"
          >
            <section>
              <h2 class="text-2xl md:text-3xl font-bold text-center py-4 max-w-md text-center mx-auto">
              ${question.question}
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div
                  class="teko border-4 border-black text-3xl md:text-4xl h-24 md:h-44 flex justify-center items-center font-bold duration-300 bg-green-300 hover:text-4xl md:hover:text-5xl hover:bg-green-400 rounded-xl cursor-pointer ${identifierTrue}"
                >
                  True
                </div>
                <div
                  class="teko border-4 border-black text-3xl md:text-4xl h-24 md:h-44 flex justify-center items-center font-bold duration-300 bg-red-300 hover:text-4xl md:hover:text-5xl hover:bg-red-400 rounded-xl cursor-pointer ${identifierFalse}"
                >
                  False
                </div>
              </div>
              <!-- timer bar -->
              <section class="my-4 h-6 border-4 border-black rounded-xl bg-slate-200">
                <div class="h-full duration-1000 bg-green-400 rounded-xl timer-bar"></div>
              </section>
              <div class="flex justify-center items-center pt-4 font-light max-w-md mx-auto text-center">
                <p class="text-center">Questions ${i + 1}/${
          questionsArr.length
        } · ${question.difficulty} · ${question.category}</p>
              </div>
            </section>
          </div>
        </div>`;
        questionCard.innerHTML += htmlEl;
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
        class="teko border-4 text-center border-black text-3xl h-24 md:h-44 flex justify-center items-center font-bold duration-300 hover:text-4xl  rounded-xl cursor-pointer co ${bgColor} ${hoverBgColor}"
      >
        ${choices[index]}
      </div>`;
        result.push(htmlEl);
      } else {
        let htmlEl = ` <div
        class="teko border-4 text-center border-black text-3xl h-24 md:h-44 flex justify-center items-center font-bold duration-300 hover:text-4xl  rounded-xl cursor-pointer in ${bgColor} ${hoverBgColor}"
      >
        ${choices[index]}
      </div>`;
        result.push(htmlEl);
      }
      pastNum.push(index);
    }

    return result;
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
