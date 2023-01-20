const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const { TwitterApi } = require('twitter-api-v2');
const { Client, auth } = require('twitter-api-sdk');

const REACT_APP_CLIENT_ID = 'TXBUS2VkdVdqWl9zeGhqMGp0ZlM6MTpjaQ'
const REACT_APP_CLIENT_SECRET = 'EhFoHsVKRf-kRfeq-LRNwWU3hLqhS6r-Y_XaiQgpeOPGTtnpB3'
const REACT_APP_TWITTER_BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAF5BlQEAAAAAhYCS19K%2FmrcsyOed0jd1VoIZ9n8%3DAOdVLn9KsS2QP4q2U5kGz8ISc1RSUPUcl9NKvEcex0gd69qbpQ';

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

app.get('/getTweets', async (req, res) => {
  console.log('getTweets start');

  // const authClient = new auth.OAuth2User({
  //   client_id: REACT_APP_CLIENT_ID,
  //   client_secret: REACT_APP_CLIENT_SECRET,
  //   callback: "http://127.0.0.1:5001/",
  //   scopes: ["tweet.read", "users.read"],
  //  });

  // const client = new Client(REACT_APP_TWITTER_BEARER_TOKEN);
  // const tweet = await client.tweets.findTweetById('1515224918044004354', {
  //   expansions: ['in_reply_to_user_id', 'referenced_tweets.id'],
  //   'tweet.fields': ["attachments", "author_id", "context_annotations", "conversation_id", "created_at", "edit_controls", "edit_history_tweet_ids", "entities", "referenced_tweets", "text"]
  // });

  // res.status(200).send({ tweet });

  // Instantiate with desired auth type (here's Bearer v2 auth)
  const twitterClient = new TwitterApi(REACT_APP_TWITTER_BEARER_TOKEN);

  // Tell typescript it's a readonly app
  const readOnlyClient = twitterClient.readOnly;

  const data = await readOnlyClient.v2.singleTweet(
    '1515224918044004354', // ['1515029025277632512', '1515224918044004354'], //1515224918044004354
    {
      expansions: ['referenced_tweets.id', 'referenced_tweets.id.author_id'],
      "tweet.fields": ['attachments', 'author_id', 'context_annotations', 'conversation_id', 'created_at', 'entities', 'geo', 'id', 'in_reply_to_user_id', 'lang', 'public_metrics', 'edit_controls', 'possibly_sensitive', 'referenced_tweets', 'reply_settings', 'source', 'text', 'withheld']
    }
  );

  res.status(200).send({ tweetData: data });

  // const tweetData = await axios({
  //   method: 'get',
  //   url: `https://api.twitter.com/2/tweets/1515224918044004354?expansions=attachments.media_keys,referenced_tweets.id,author_id`,
  //   headers: {
  //     Authorization: `Bearer ${REACT_APP_TWITTER_BEARER_TOKEN}`
  //   }
  // });

  // res.status(200).send({ tweetData });
});

exports.tweeter = functions.https.onRequest(app);