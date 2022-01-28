// making sure height is the same at all difficulty cards
const practice = document.querySelector('.practice');
const notPractice = document.querySelectorAll('.not-practice');

const observeHeight = new ResizeObserver((entries) => {
  const card = entries[0];
  notPractice.forEach((item) => {
    item.style.height = practice.offsetHeight.toString() + 'px';
  });
});

observeHeight.observe(practice);

// notPractice.forEach((item) => {
//   item.addEventListener('mouseenter', function () {
//     item.style.height = practice.offsetHeight.toString() + 'px';
//   });
// });
