const fs = require('fs');
const axios = require('axios');
const { promisify } = require('util');

const writeFilePromise = promisify(fs.writeFile);

// (async () => {
//   const url = 'https://static.staticsave.com/iqbal/bahan-txt.txt';
//   const response = await axios.get(url);
//   if (response.data) {
//     await writeFilePromise('./data/random_satu.txt', response.data);
//   }
// })();

(async () => {
  const url = 'https://static.staticsave.com/iqbal/bahan-txt.txt';
  const response = await axios.get(url);
  if (response.data) {
    await writeFilePromise('./data/random_lima.txt', response.data);
  }
})();
