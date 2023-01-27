import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import { handleAxiosError } from '../api/common.js';
import { getMomentData } from '../api/firestore.js';

import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import IosShareIcon from '@mui/icons-material/IosShare';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { EmbeddedTweets } from '../components/EmbeddedTweets.js'

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
    async function fetch() {
      // user, id 값에 저장된 모멘트 데이터 가져오기
      let momentDataFromFirestore;

      // user, id로 만들어진 모멘트 없을 경우 에러 처리
      try {
        momentDataFromFirestore = await getMomentData(user, id);
        setMomentData(momentDataFromFirestore);
      } catch (error) {
        throw new Response('존재하지 않는 모멘트 URL입니다.', { status: 404 });
      }

      // 트윗 id 목록 request로 보낼 string화
      const tweetsId= momentDataFromFirestore.tweets
                        .map(tweet => getTweetId(tweet))
                        .join(',');

      // tweet data 가져오기
      axios({
        method: 'get',
        url: 'https://us-central1-temp-moment.cloudfunctions.net/tweeter/getTweets',
        // url: 'http://127.0.0.1:5001/temp-moment/us-central1/tweeter/getTweets',
        headers: {
          Authorization: `${process.env.REACT_APP_TWITTER_BEARER_TOKEN}`,
          tweetsId: tweetsId
        }
      })
        .then((response) => {
          // tweet data 전처리
          const tweetsFromTwitterAPI = preprocessTweetData(momentDataFromFirestore.tweets, response.data.tweets);
          setTweets(tweetsFromTwitterAPI);
        })
        .catch((error) => handleAxiosError(error));
    }
    fetch();
  }, []);

  return (
    <div className='container'>
      <div className='toolbar'>
        <div className='title'>{momentData.title}</div>
        <ButtonGroup className='buttons'>
          <IconButton aria-label="share" onClick={() => { share() }}>
            {/* TODO: ios safari not work */}
            <IosShareIcon color={isOSDarkMode ? 'primary' : 'info'}/>
          </IconButton>
          <IconButton aria-label="etc functions" disabled>
            <MoreHorizIcon color={isOSDarkMode ? 'primary' : 'info'}/>
          </IconButton>
        </ButtonGroup>
      </div>
      <MomentHeader momentData={momentData} user={user} />
      <EmbeddedTweets tweets={tweets} />
    </div>
  )
}

function MomentHeader(props) {
  if (props.momentData.title === '') {
    return (
      <div className='header'></div>
    )
  } else {
    return (
      <div className='header'>
        <div className='description'>{props.momentData.description}</div>
        <div className='info'>
          <div className='user-id'><a href={`https://twitter.com/${props.user}`}>@{props.user}</a></div>
          <time className='edit-date' dateTime={`${new Date(props.momentData.timestamp)}`}>
            {new Date(props.momentData.timestamp).toLocaleDateString('ko-kr', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
        </div>
      </div>
    )
  }
}

function preprocessTweetData(momentTweets, apiTweets) {
  const tweetsFromTwitterAPI = momentTweets.map((tweet) => {
    let tweetId = getTweetId(tweet);
    let tweetData = apiTweets.data.find(d => d.id === tweetId);

    if (tweetData) {
      let userData = apiTweets.includes.users.find(user => user.id === tweetData.author_id);
      
      let tweetObj = {
        isValidData: true,
        user_name: userData.name,
        user_Id: userData.username,
        user_profile: userData.profile_image_url,
        created_at: new Date(tweetData.created_at),
        id: tweetId,
        text: tweetData.text,
        url: tweet,
        attachments: []
      };

      if (tweetData['attachments']) {
        for (let mediaKey of tweetData['attachments'].media_keys) {
          let mediaData = apiTweets.includes.media.find(attachment => attachment.media_key === mediaKey);
          tweetObj['attachments'].push({
            key: mediaKey,
            url: mediaData.url ? mediaData.url : mediaData.preview_image_url,
            alt: mediaData.alt_text
          });
        }
      }

      return tweetObj;
    } else {
      return {
        isValidData: false,
        id: tweetId
      }
    }
  });

  return tweetsFromTwitterAPI;
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