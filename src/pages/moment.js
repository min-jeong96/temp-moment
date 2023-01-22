import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useParams } from 'react-router-dom';

import { getMomentData } from '../api/firestore.js';
import { Tweet } from 'react-twitter-widgets';

import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import IosShareIcon from '@mui/icons-material/IosShare';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import './moment.css';

export function Moment(props) {
  const {user, id} = useParams();
  const [momentData, setMomentData] = useState({
    title: 'Loading…',              // 모멘트 제목
    description: 'Loading…',        // 모멘트 설명
    timestamp: Date.now(),  // 모멘트 최종 수정일
    username: user,         // 모멘트 작성자
    tweets: []              // 트윗 목록
  });

  const isOSDarkMode = useMediaQuery({
    query: '(prefers-color-scheme: dark)',
  });

  useEffect(() => {
    // user, id로 만들어진 모멘트 없을 경우 에러 처리
    if (!user || !id) {
      throw new Response('Not Found', { status: 404 });
    }

    // user, id 값에 저장된 모멘트 데이터 가져오기
    async function fetch() {
      const momentDataFromFirestore = await getMomentData(user, id);
      setMomentData(momentDataFromFirestore);
    }
    fetch();
  }, []);

  useEffect(() => {
    async function fetch() {
      // /* TODO */
      // const response = await axios({
      //   method: 'get',
      //   url: `http://127.0.0.1:5001/temp-moment/us-central1/tweeter/getTweets`,
      //   headers: {
      //     Authorization: `Bearer ${process.env.REACT_APP_TWITTER_BEARER_TOKEN}`
      //   }
      // });
      // console.log(response);
    }

    fetch();
  }, [momentData]);

  return (
    <div className='container'>
      <div className='toolbar'>
        <div className='title'>{momentData.title}</div>
        <ButtonGroup className='buttons'>
          <IconButton aria-label="share" onClick={share}>
            <IosShareIcon color={isOSDarkMode ? 'primary' : 'info'}/>
          </IconButton>
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
        { // TODO: Tweet loading skeleton 처리 하기
          momentData.tweets.map((tweet) => {
            return (
              <div className='tweet' key={getTweetId(tweet)}>
                <Tweet
                  tweetId={getTweetId(tweet)}
                  options={{ theme: isOSDarkMode ? 'dark' : 'light' }} />
              </div>
            );
          })
        }
      </div>
    </div>
  )
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