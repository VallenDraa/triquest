// const { type } = require('express/lib/response');
const progressBar = document.querySelector('.circular-progress'),
  valueContainer = document.querySelector('.value-container');

let progressValue = 0,
  progressValueEnd = 10,
  speed = 60;

let progress = setInterval(() => {
  progressValue++;
  valueContainer.textContent = `${progressValue}/${progressValueEnd}`;
  progressBar.style.background = `conic-gradient(
    rgb(253 186 116) ${progressValue * 10 * 3.6}deg,
    rgb(253 224 71) ${progressValue * 10 * 3.6}deg
  )`;
  if (progressValue == progressValueEnd) {
    clearInterval(progress);
  }
}, speed);
