const parseCookieProfileBtn = (str) =>
  str
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

// document
//   .getElementById('profile-btn-header')
//   .addEventListener('click', function () {
//     window.location.href = `/profile/${
//       parseCookieProfileBtn(document.cookie).id
//     }`;
//   });
