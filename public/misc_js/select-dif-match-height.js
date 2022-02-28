// making sure height is the same at all difficulty cards
const custom = document.querySelector('.custom');
const notCustom = document.querySelectorAll('.not-custom');

const observeHeight = new ResizeObserver((entries) => {
  const card = entries[0];
  notCustom.forEach((item) => {
    item.style.height = custom.offsetHeight.toString() + 'px';
  });
});

observeHeight.observe(custom);
