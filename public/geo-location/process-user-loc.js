// // only ran once
// (async function getAndProcessUserLoc() {
//   if (localStorage.getItem('country')) {
//     return;
//   } else {
//     console.log('hackerman got your IP MWAHAWHAWHAHA');
//     const response = await fetch('/get_country');
//     const data = await response.json();
//     const country = await data;
//     localStorage.setItem('country', country.country_code);
//   }
// })();
