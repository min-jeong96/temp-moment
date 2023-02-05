const functions = require("firebase-functions");

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const { Client, auth } = require('twitter-api-sdk');
const fs = require("fs");

const app = express();
app.use(cors({
  origin: '*', // 출처 허용 옵션
  credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
}));

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

app.get('/:user/:id', async (req, res) => {
  const {user, id} = req.params;

  axios.get(`https://firestore.googleapis.com/v1/projects/temp-moment/databases/(default)/documents/moments/${user}:${id}`)
    .then((doc) => {
      fs.readFile('./index.html', 'utf8', (err, htmlString) => {
        if (err) {
          res.status(404).send('readFile error');
          return;
        }
  
        res.set('Content-Type', 'text/html');
        const replacedHTML = htmlString.replace('<title>TEMP MOMENT</title>',
          `
            <meta property="og:title" content="${doc.data.fields.title.stringValue} by @${user}" />
            <meta property="og:description" content="${doc.data.fields.description.stringValue}"/>
            <meta property="og:url" content="https://temp-momen.web.app/${user}/${id}" />
            <title>${doc.data.fields.title.stringValue} by @${user}</title>
          `
        );
        res.status(200).send(replacedHTML);
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(404).send('axios get error');
    });
});

app.options('/getTweets', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 
  'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('')
  res.send();
});

app.get('/getTweets', async(req, res) => {
  console.log('getTweets');

  /* twitter API v2 GET /tweets data format ▼ 더보기
    retur type
    tweets: {
      data: [
        {
          author_id: string,  // 트윗 작성자의 twitter unique key
          create_at: string,  // 트윗 생성 시점
          id: string,         // 트윗의 twitter unique key
          text: string        // 트윗 텍스트 전문 (이미지 링크 포함)
        }
      ],
      errors: [
        {
          detail: string,
          value: string,
          title: string // Authorization Error
        }
      ],
      includes: {
        users: [
          {
            id: string,                 // 사용자의 twitter unique key
            name: string,               // 사용자가 설정한 닉네임
            username: string,           // 사용자의 계정 아이디
            profile_image_url: string,  // 프로필 이미지 (https://pbs.twimg.com/profile_images/로 시작한다)
          }
        ]
      }
    }
   */

  const tweetsId = req.header('tweetsId');
  if (tweetsId === '') {
    res.status(200).send({ tweets: [] });
  } else {
    const client = new Client(req.header('Authorization'));
    const tweets = await client.tweets.findTweetsById({
      ids: tweetsId.split(','),
      expansions: ["attachments.media_keys", "author_id"],
      "user.fields": ["name", "id", "username", "profile_image_url"],
      "tweet.fields": ["created_at"],
      "media.fields": ["type", "url", "preview_image_url", "alt_text"]
    });

    res.status(200).send({ tweets });
  }
});

exports.tweeter = functions.https.onRequest(app);