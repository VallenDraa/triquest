const toggle_menu = document.querySelector('.toggle-menu');
const menu_toggle_btn = document.querySelector('.fa-caret-square-down');
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
  // if (!isInFooter) {
  //   menu_toggle_btn.classList.toggle('text-black');
  // }

  menuIsToggled = !menuIsToggled;

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

// for when the user scroll
window.addEventListener('scroll', () => {
  // change colour of menu toggle button
  if (window.scrollY >= 934 && menuIsToggled == true) {
    menu_toggle_btn.classList.add('text-yellow-300');
    isInFooter = true;
  } else if (window.scrollY < 934 && menuIsToggled == true) {
    isInFooter = false;
    menu_toggle_btn.classList.remove('text-yellow-300');
  }
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
