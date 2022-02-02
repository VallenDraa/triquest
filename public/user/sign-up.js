document.getElementById('guest-btn').addEventListener('click', function () {
  document.cookie = `userState=guest`;
  window.location.href = '/';
});
