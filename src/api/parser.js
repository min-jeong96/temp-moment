// import https from 'https';

// async function getHTML(url) {
//   return new Promise((resolve, reject) => {
//     let data = '';

//     https.get({
//       url: url,
//       headers: {
//         'access-control-allow-origin': '*'
//       }
//     }, (res) => {
//       res.on('data', (chunk) => data += chunk);
//       res.on('end', () => {
//         resolve(data);
//       })
//     }).end();
//   })
// }

// export { getHTML };

import axios from 'axios';

// CORS 전역 설정
axios.defaults.withCredentials = true;

async function getHTML(url) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      withCredentials: true
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  })
}

export { getHTML };