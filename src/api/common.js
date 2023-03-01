import axios from 'axios';

/**
 * 유효한 트윗 url인지 검사
 * @param {string} url
 * @requires {boolean} 유효 여부
 */
export function isValidTwitterUrl(url) {
  return /https:\/\/twitter.com\/[a-zA-Z0-9_]*\/status\/[0-9]*/.test(url);
}

/**
 * url parameter 지운 original url 반환
 * @param {string} url
 * @requires {string} preprocessed url
 */
export function getUrlPath(url) {
  return url.split('?')[0];
}

/**
 * tweet url에서 tweet id 추출하여 반환
 * @param {string} url
 * @requires {string} tweet id
 */
export function getTweetId(url) {
  // parameter filtering
  let urlPath = url.split('?')[0];
  
  // id filtering
  let id = urlPath.split('/')[urlPath.split('/').length - 1];
  return id;
}

export function getTweetFromTwitterAPI(url) {
  const tweetId = getTweetId(url);

  // tweet data 가져오기
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      // url: 'https://us-central1-temp-moment.cloudfunctions.net/tweeter/getTweets',
      url: 'http://127.0.0.1:5001/temp-moment/us-central1/tweeter/getTweets',
      headers: {
        Authorization: `${process.env.REACT_APP_TWITTER_BEARER_TOKEN}`,
        tweetsId: tweetId
      }
    })
      .then((response) => {
        // tweet data 전처리
        const apiData = response.data.tweets;
        let tweetData = apiData.data[0];
        let userData = apiData.includes.users[0];
      
        if (!tweetData) {
          reject(undefined);
        } else {
          let tweetObj = {
            user_name: userData.name,
            user_id: userData.username,
            user_profile: userData.profile_image_url,
            created_at: tweetData.created_at,
            id: tweetId,
            text: tweetData.text,
            url: getUrlPath(url),
            attachments: []
          };
    
          if (tweetData['attachments']) {
            for (let mediaKey of tweetData['attachments'].media_keys) {
              let mediaData = apiData.includes.media.find(attachment => attachment.media_key === mediaKey);
              tweetObj['attachments'].push(mediaData.url ? mediaData.url : mediaData.preview_image_url);
            }
          }
    
          resolve(tweetObj);
        }
      })
      .catch((error) => {
        reject(error);
      })
  });
}