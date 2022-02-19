const alertBg = document.getElementById('alert-bg');
const alertCard = document.getElementById('alert-card');
const closeAlert = document.getElementById('close-alert');

closeAlert.addEventListener('click', () => {
  alertCard.classList.replace('animate-slide-from-top', 'animate-slide-to-top');
  setTimeout(() => {
    alertBg.classList.replace('animate-fade-in', 'animate-fade-out');
  }, 300);
  setTimeout(() => {
    alertBg.parentElement.removeChild(alertBg);
  }, 600);
});
