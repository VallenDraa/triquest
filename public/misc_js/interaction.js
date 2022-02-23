const toggle_menu = document.querySelector('.toggle-menu');
const menu_toggle_btn = document.querySelector('.fa-caret-down');
const menu = document.querySelector('.menu');
const loadingScreen = document.querySelector('.loading-screen');
const body = document.querySelector('body');
const navbar = document.querySelector('.navbar');
const toggleMenuBtn = document.querySelector('.toggle-menu');
// const duration200 = document.querySelectorAll('.duration-200');
// const duration300 = document.querySelectorAll('.duration-300');
// const duration500 = document.querySelectorAll('.duration-500');
// const duration1000 = document.querySelectorAll('.duration-1000');

let menuIsToggled = false;
let isInFooter = false;
// remove scrolling before content has loaded
if (loadingScreen) {
  window.scrollTo(0, 0);
  body.classList.add('overflow-hidden');
}
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

  // removeAndAddTransition();
  // REMOVE TRANSITION FOR ALL ELEMENT
  // document.querySelectorAll('.select-dif-content-max-w').forEach((item) => {
  //   item.classList.remove('duration-300');
  // });
  // setTimeout(() => {
  //   document.querySelectorAll('.select-dif-content-max-w').forEach((item) => {
  //     item.classList.add('duration-300');
  //   });
  // }, 200);
});

// on scroll
let scrolledThen = 0;
window.addEventListener('scroll', () => {
  const scrolledNow = window.scrollY;
  // console.log(`now: ${scrolledNow}\nthen:${scrolledThen}`);

  if (scrolledNow > scrolledThen) {
    if (
      !navbar.classList.contains('-translate-y-full') &&
      !toggleMenuBtn.classList.contains('rotate-180')
    ) {
      navbar.classList.add('-translate-y-full');
      setTimeout(() => {
        navbar.classList.add('hidden');
      }, 300);
      scrolledThen = scrolledNow;
    } else {
      scrolledThen = scrolledNow;
    }
  } else {
    if (navbar.classList.contains('-translate-y-full')) {
      navbar.classList.remove('-translate-y-full');
      setTimeout(() => {
        navbar.classList.remove('hidden');
      }, 300);
      scrolledThen = scrolledNow;
    } else {
      scrolledThen = scrolledNow;
    }
  }
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
    loadingScreen.classList.add('animate-fade-out');
    setTimeout(function () {
      loadingScreen.classList.add('hidden');
    }, 400);
  }
});

// removing transition at window resizing functions
// remove transiton and adds it back after 300ms
// function removeAndAddTransition() {
//   duration(duration200, 'remove');
//   duration(duration300, 'remove');
//   duration(duration500, 'remove');
//   duration(duration1000, 'remove');

//   setTimeout(() => {
//     duration(duration200, 'add');
//     duration(duration300, 'add');
//     duration(duration500, 'add');
//     duration(duration1000, 'add');
//   }, 5000);
// }
// function duration(type, func) {
//   if (type) {
//     if (func == 'remove') {
//       for (let i = 0; i < type.length; i++) {
//         type[i].classList.forEach((item) => {
//           if (!item.includes('duration')) return;
//           type[i].classList.remove(item);
//         });
//       }
//       console.log('a');
//     } else if (func == 'add') {
//       for (let i = 0; i < type.length; i++) {
//         type[i].classList.forEach((item) => {
//           if (!item.includes('duration')) return;
//           type[i].classList.remove(item);
//         });
//       }
//       console.log('b');
//     }
//   } else {
//     return;
//   }
// }
