// for password
const showPW = document.querySelector(".show-pw");
const passwordInputs = document.querySelectorAll("#password");

showPW.addEventListener("click", function () {
  if (this.classList.contains("fa-eye-slash")) {
    this.classList.replace("fa-eye-slash", "fa-eye");
    passwordInputs.forEach((input) => {
      input.setAttribute("type", "text");
    });
  } else {
    this.classList.replace("fa-eye", "fa-eye-slash");
    passwordInputs.forEach((input) => {
      input.setAttribute("type", "password");
    });
  }
});
