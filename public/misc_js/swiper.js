const swiper = new Swiper('.mySwiper', {
  effect: 'cards',
  simulateTouch: false,
  cardsEffect: {
    shadow: false,
    slideShadows: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },
});
