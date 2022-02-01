// for password
const showPW = document.querySelector('.show-pw');
const passwordInput = document.querySelector('#password');
showPW.addEventListener('click', function () {
  if (this.classList.contains('fa-eye-slash')) {
    this.classList.replace('fa-eye-slash', 'fa-eye');
    passwordInput.setAttribute('type', 'text');
  } else {
    this.classList.replace('fa-eye', 'fa-eye-slash');
    passwordInput.setAttribute('type', 'password');
  }
});
