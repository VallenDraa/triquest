const toggle_menu = document.querySelector('.toggle-menu');
const menu_toggle_btn = document.querySelector('.fa-caret-down');
const menu = document.querySelector('.menu');
const loadingScreen = document.querySelector('.loading-screen');
const body = document.querySelector('body');

let menuIsToggled = false;
let isInFooter = false;
// remove scrolling before content has loaded
body.classList.add('overflow-hidden');

// for menu toggle
toggle_menu.addEventListener('click', () => {
  // menu javascript
  menu.classList.toggle('-translate-y-full');
  menu.classList.add('duration-500');

  // menu btn
  menu_toggle_btn.classList.toggle('rotate-180');

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

  // REMOVE TRANSITION FOR SELECT DIFFICULTY BUTTONS
  document.querySelectorAll('.select-dif-content-max-w').forEach((item) => {
    item.classList.remove('duration-300');
  });
  setTimeout(() => {
    document.querySelectorAll('.select-dif-content-max-w').forEach((item) => {
      item.classList.add('duration-300');
    });
  }, 200);
});

// if browser is safari
if (
  navigator.userAgent.includes('AppleWebKit/') &&
  navigator.userAgent.includes('Safari/')
) {
  if (window.innerWidth <= 640) {
    document.querySelectorAll('.select-dif-content-max-w').forEach((item) => {
      item.style.maxWidth = 'calc(100vw * 11 / 12 - 38px)';
    });
  } else {
    document.querySelectorAll('.select-dif-content-max-w').forEach((item) => {
      item.style.maxWidth = '';
    });
  }
}

// remove loading screen
window.addEventListener('DOMContentLoaded', () => {
  if (loadingScreen) {
    body.classList.remove('overflow-hidden');
    loadingScreen.classList.add('anim-fade-out');
    setTimeout(function () {
      loadingScreen.classList.add('hidden');
    }, 200);
  }
});
