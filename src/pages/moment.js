import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useParams } from 'react-router-dom';

import axios from 'axios';

import { getMomentData } from '../api/firestore.js';
import { TwitterTweetEmbed } from 'react-twitter-embed';

import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import IosShareIcon from '@mui/icons-material/IosShare';
import TwitterIcon from '@mui/icons-material/Twitter';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import './moment.css';

export function Moment(props) {
  const {user, id} = useParams();
  const [momentData, setMomentData] = useState({
    title: '',          // 모멘트 제목
    description: '',    // 모멘트 설명
    timestamp: null,    // 모멘트 최종 수정일
    username: user,     // 모멘트 작성자
    tweets: []          // 트윗 목록
  });
  const [tweets, setTweets] = useState([]);

  const isOSDarkMode = useMediaQuery({
    query: '(prefers-color-scheme: dark)',
  });

  useEffect(() => {
    // user, id로 만들어진 모멘트 없을 경우 에러 처리
    if (!user || !id) {
      throw new Response('Not Found', { status: 404 });
    }

    async function fetch() {
      // user, id 값에 저장된 모멘트 데이터 가져오기
      const momentDataFromFirestore = await getMomentData(user, id);
      setMomentData(momentDataFromFirestore);

      // 트윗 id 목록 request로 보낼 string화
      const tweetsId= momentDataFromFirestore.tweets
                        .map(tweet => getTweetId(tweet))
                        .join(',');

      // tweet data 가져오기
      const response = await axios({
        method: 'get',
        url: 'https://us-central1-temp-moment.cloudfunctions.net/tweeter/getTweets', // `http://127.0.0.1:5001/temp-moment/us-central1/tweeter/getTweets`,
        headers: {
          Authorization: `${process.env.REACT_APP_TWITTER_BEARER_TOKEN}`,
          tweetsId: tweetsId
        }
      });
      console.log(response.data);

      const tweetsFromTwitterAPI = momentDataFromFirestore.tweets.map((tweet) => {
        let tweetId = getTweetId(tweet);
        let tweetData = response.data.tweets.data.find(d => d.id === tweetId);

        if (tweetData) {
          let userData = response.data.tweets.includes.users.find(user => user.id);
          
          return {
            isValidData: true,
            user_name: userData.name,
            user_Id: userData.username,
            user_profile: userData.profile_image_url,
            created_at: new Date(tweetData.created_at),
            id: tweetId,
            text: tweetData.text,
            url: tweet
          }
        } else {
          return {
            isValidData: false,
            id: tweetId
          }
        }
      });
      setTweets(tweetsFromTwitterAPI);
    }
    fetch();
  }, []);

  return (
    <div className='container'>
      <div className='toolbar'>
        <div className='title'>{momentData.title}</div>
        <ButtonGroup className='buttons'>
          {/* <IconButton aria-label="share" onClick={() => { share() }}>
            <IosShareIcon color={isOSDarkMode ? 'primary' : 'info'}/> <- TODO: ios safari not work
          </IconButton> */}
          <IconButton aria-label="etc functions" disabled>
            <MoreHorizIcon color={isOSDarkMode ? 'primary' : 'info'}/>
          </IconButton>
        </ButtonGroup>
      </div>
      <div className='header'>
        <div className='description'>{momentData.description}</div>
        <div className='info'>
          <div className='user-id'><a href={`https://twitter.com/${user}`}>@{user}</a></div>
          <time className='edit-date' dateTime={`${new Date(momentData.timestamp)}`}>
            {new Date(momentData.timestamp).toLocaleDateString('ko-kr', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
        </div>
      </div>
      <div className='tweets'>
        { // TODO: 다운로드 시간 너무 길고 resources 크기가 너무 큼.
          // momentData.tweets.map((tweet) => {
          //   return (
          //     <div className='tweet' key={getTweetId(tweet)}>
          //       <TwitterTweetEmbed
          //         tweetId={getTweetId(tweet)}
          //         placeholder={<div>Loading</div>}
          //         options={{ theme: isOSDarkMode ? 'dark' : 'light' }} />
          //     </div>
          //   );
          // })
          <EmbeddedTweets tweets={tweets} />
        }
      </div>
    </div>
  )
}

function EmbeddedTweets(props) {
  if (props.tweets.length === 0) {
    return (
      <div>Loading...</div>
    )
  } else {
    return (
      props.tweets.map((tweet) => {
        if (tweet.isValidData) {
          return (
            <div className='tweet' key={tweet.id}>
              <img className='user-profile' alt='user-profile' src={tweet.user_profile} />
              <div>
                <div className='user-info'>
                  <span className='name'>{tweet.user_name}</span>
                  <span className='id'>@{tweet.user_Id}</span>
                </div>
                <div className='text'>{tweet.text}</div>
                <time className='created-at' dateTime={tweet.created_at}>
                  {`${tweet.created_at.toLocaleDateString('ko-kr', { year: 'numeric', month: 'long', day: 'numeric' })} ${tweet.created_at.toLocaleTimeString('ko-kr')}`}
                </time>
                <Button
                  variant="outlined" endIcon={<TwitterIcon />}
                  onClick={() => {toTwitter(tweet.url)}}>
                  트위터로 이동
                </Button>
              </div>
            </div>
          )
        } else {
          return (
            <div className='tweet error' key={tweet.id}>
              <div className='text'>권한 오류</div>
            </div>
          )
        }
      })
    )
  }

  function toTwitter(url) {
    console.log(url);
    window.open(url);
  }
}

function getTweetId(url) {
  // parameter filtering
  let urlPath = url.split('?')[0];
  
  // id filtering
  let id = urlPath.split('/')[urlPath.split('/').length - 1];
  return id;
}

function share() {
  // console.log(window.location.href);
  navigator.clipboard.writeText(window.location.href)
    .then(() => { console.log('Text copied to clipboard...') })
    .catch((error) => { console.error(error) });
}