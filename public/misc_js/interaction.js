const toggle_menu = document.querySelector(".toggle-menu");
const menu_toggle_btn = document.querySelector(".fa-caret-down");
const menu = document.querySelector(".menu");
const loadingScreen = document.querySelector(".loading-screen");
const body = document.querySelector("body");
const navbar = document.querySelector(".navbar");
const toggleMenuBtn = document.querySelector(".toggle-menu");

let menuIsToggled = false;
let isInFooter = false;
// remove scrolling before content has loaded
if (loadingScreen) {
  window.scrollTo(0, 0);
  body.classList.add("overflow-hidden");
}
// for menu toggle
toggle_menu.addEventListener("click", () => {
  // menu javascript
  menu.classList.toggle("-translate-y-full");
  menu.classList.add("duration-500");

  // menu btn
  menu_toggle_btn.classList.toggle("rotate-180");

  setTimeout(() => {
    menu.classList.remove("duration-500");
  }, 550);
  menuIsToggled = !menuIsToggled;
});

// for menu display config
window.addEventListener("resize", () => {
  let width = window.innerWidth;
  if (width > 768) {
    menu.classList.remove("-translate-y-full");
    menu_toggle_btn.classList.remove("rotate-180");
    menuIsToggled = false;
  } else if (width < 768 && menuIsToggled == false) {
    menu.classList.add("-translate-y-full");
  }
});

// on scroll
window.addEventListener("scroll", () => {
  const scrollMaxY =
    window.innerHeight * (window.innerHeight / document.body.offsetHeight);
  const scrolledPercentage = (window.scrollY / scrollMaxY) * 100;
  // console.log(scrollY, scrollMaxY);

  // change the minimal scrolled value according to screen size
  let threshold;
  if (window.innerwidth > 768) {
    threshold = 35;
  } else if (window.innerwidth < 768 && window.innerwidth > 640) {
    threshold = 30;
  } else {
    threshold = 25;
  }

  // decrease opacity check
  if (scrolledPercentage > threshold) {
    if (
      toggleMenuBtn.classList.contains("rotate-180") ||
      !menu.classList.contains("-translate-y-full")
    )
      return;

    navbar.classList.add("-translate-y-full");
  } else {
    navbar.classList.remove("-translate-y-full");
  }
});

// if browser is safari
if (
  navigator.userAgent.includes("AppleWebKit/") &&
  navigator.userAgent.includes("Safari/")
) {
  if (window.innerWidth <= 640) {
    document.querySelectorAll(".select-dif-content-max-w").forEach((item) => {
      item.style.maxWidth = "calc(100vw * 11 / 12 - 38px)";
    });
  } else {
    document.querySelectorAll(".select-dif-content-max-w").forEach((item) => {
      item.style.maxWidth = "";
    });
  }
}

// remove loading screen
window.addEventListener("DOMContentLoaded", () => {
  if (loadingScreen) {
    body.classList.remove("overflow-hidden");
    loadingScreen.classList.add("animate-fade-out");
    setTimeout(function () {
      loadingScreen.classList.add("hidden");
    }, 400);
  }
});
