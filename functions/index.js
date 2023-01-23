const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const { TwitterApi } = require('twitter-api-v2');
const { Client, auth } = require('twitter-api-sdk');

const app = express();
app.use(cors({origin: true}));

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

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
  console.log(functions.config())

  const client = new Client(req.header('Authorization'));
  // const tweets = await client.tweets.tweetsRecentSearch({
  //   query: 'conversation_id:1597956724375580672',
  //   expansions: ['referenced_tweets.id'],
  //   'tweet.fields': ['id', 'text', 'created_at', 'referenced_tweets']
  // });

  const tweetsId = req.header('tweetsId');
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
  const tweets = await client.tweets.findTweetsById({
    ids: tweetsId.split(','),
    expansions: ["author_id"],
    "user.fields": ["name", "id", "username", "profile_image_url"],
    "tweet.fields": ["created_at"],
  });

  res.status(200).send({ tweets });

  // Instantiate with desired auth type (here's Bearer v2 auth)
  // const twitterClient = new TwitterApi(REACT_APP_TWITTER_BEARER_TOKEN);

  // // Tell typescript it's a readonly app
  // const readOnlyClient = twitterClient.readOnly;

  // const tweetsId = req.header('tweetsId');
  // const tweets = await twitterClient.v2.tweets(tweetsId.split(','), {
  //   expansions: ['author_id', 'in_reply_to_user_id', 'referenced_tweets.id'],
  //   'tweet.fields': ['created_at', 'referenced_tweets', 'id', 'text', 'entities', 'source'],
  // });
  // res.status(200).send({ tweets });

  // const data = await readOnlyClient.v2.searchAll('conversation_id:1515029025277632512', {
  //   expansions: ['referenced_tweets.id'],
  //   "tweet.fields": ['in_reply_to_user_id', 'author_id', 'created_at', 'conversation_id']
  // });

  // res.status(200).send({ tweets: data.tweets, meta: data.meta });

  // const tweetData = await axios({
  //   method: 'get',
  //   url: `https://api.twitter.com/2/tweets/1515224918044004354?expansions=attachments.media_keys,referenced_tweets.id,author_id`,
  //   headers: {
  //     Authorization: `Bearer ${REACT_APP_TWITTER_BEARER_TOKEN}`
  //   }
  // });

  // res.status(200).send({ tweets: data });
});

exports.tweeter = functions.https.onRequest(app);