// // convert country code to emoji
// function getFlagEmoji(countryCode) {
//   const codePoints = countryCode
//     .toUpperCase()
//     .split('')
//     .map((char) => 127397 + char.charCodeAt());
//   return String.fromCodePoint(...codePoints);
// }

// // fetch country data json file for progile
// const countryList = document.querySelector('#country');
// fetch('../data/countries.json')
//   .then((res) => res.json())
//   .then((countries) => {
//     // inserting countries data to HTML
//     countries.forEach((country) => {
//       const option = document.createElement('option');
//       option.value = country.code;
//       option.textContent = `${country.name} ${getFlagEmoji(country.code)}`;
//       countryList.appendChild(option);
//     });
//   });
