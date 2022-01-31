const toggle_menu = document.querySelector('.toggle-menu');
const menu_toggle_btn = document.querySelector('.fa-caret-down');
const menu = document.querySelector('.menu');

let menuIsToggled = false;
let isInFooter = false;
// for menu toggle
toggle_menu.addEventListener('click', () => {
  // menu javascript
  menu.classList.toggle('-translate-y-full');
  menu.classList.add('duration-500');

  // menu btn
  menu_toggle_btn.classList.toggle('rotate-180');

  menuIsToggled = !menuIsToggled;
  if (menuIsToggled == false) {
    menu_toggle_btn.classList.remove('text-yellow-300');
  }

  setTimeout(() => {
    menu.classList.remove('duration-500');
  }, 550);
});

// for menu display config
window.addEventListener('resize', () => {
  let width = window.innerWidth;
  if (width > 768) {
    menu.classList.remove('-translate-y-full');
    menu_toggle_btn.classList.remove('rotate-180');
    // if (!menu_toggle_btn.classList.contains('text-yellow-300')) {
    //   menu_toggle_btn.classList.add('text-yellow-300');
    // }
    menuIsToggled = false;
  } else if (width < 768 && menuIsToggled == false) {
    menu.classList.add('-translate-y-full');
  }
});

// for yourself at footer
document.querySelector('.yourself').addEventListener('click', function (e) {
  console.log('hjew');
  this.classList.add('anim-shake');
  setTimeout(() => {
    this.classList.remove('anim-shake');
  }, 500);
});

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
