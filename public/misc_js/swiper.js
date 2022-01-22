const swiper = new Swiper('.mySwiper', {
  effect: 'cube',
  grabCursor: true,
  mousewheel: true,
  cubeEffect: {
    shadow: true,
    slideShadows: true,
    shadowOffset: 20,
    shadowScale: 1,
  },
  pagination: {
    el: '.swiper-pagination',
  },
});
