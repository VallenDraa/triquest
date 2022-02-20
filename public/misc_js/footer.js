// for yourself at footer
document.querySelector('.yourself').addEventListener('click', function () {
  this.classList.add('animate-shake');
  setTimeout(() => {
    this.classList.remove('animate-shake');
  }, 500);
});
