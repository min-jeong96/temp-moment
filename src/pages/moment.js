import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useParams } from 'react-router-dom';

import { getMomentData, getMomentTweets } from '../api/firestore.js';

import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import PostAddIcon from '@mui/icons-material/PostAdd';

import { EmbeddedTweets } from '../components/EmbeddedTweets.js';
import { AlertSnackbar } from '../components/AlertSnackbar.js';

import style from './moment.module.css';

export function Moment(props) {
  const {user, id} = useParams();
  const [momentData, setMomentData] = useState({
    title: '',          // 모멘트 제목
    description: '',    // 모멘트 설명
    timestamp: null,    // 모멘트 최종 수정일
    username: user,     // 모멘트 작성자
    tweets_id: []          // 트윗 목록
  });
  const [tweets, setTweets] = useState([]);

  // alert 출력 상태
  const [alert, setAlert] = useState({
    timestamp: null,
    severity: null, // error | warning | info | success
    message: ''
  });

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

      const tweetsFromFirestore = await getMomentTweets(user, id);
      setTweets(preprocessTweetData(momentDataFromFirestore, tweetsFromFirestore));
    }
    fetch();
  }, []);

  return (
    <div className={style.container}>
      <div className={style.toolbar}>
        <div className={style.title}>{momentData.title}</div>
        <ButtonGroup className={style.buttons}>
          <IconButton aria-label="share" onClick={share}>
            <ShareIcon color={isOSDarkMode ? 'primary' : 'info'}/>
          </IconButton>
          <IconButton aria-label="etc functions" onClick={edit}>
            <PostAddIcon color={isOSDarkMode ? 'primary' : 'info'}/>
          </IconButton>
        </ButtonGroup>
      </div>
      <MomentHeader momentData={momentData} user={user} />
      <EmbeddedTweets tweets={tweets} />
      <AlertSnackbar alert={alert}/>
    </div>
  )

  function share() {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setAlert({
          timestamp: Date.now(),
          severity: 'success',
          message: 'Text copied to clipboard...'
        });
      })
      .catch((error) => {
        console.error(error);
        setAlert({
          timestamp: Date.now(),
          severity: 'error',
          message: 'ERR: Text not copied...'
        });
      });
  }

  function edit() {
    window.location.href = `/edit/${user}/${id}`;
  }
}

function MomentHeader(props) {
  if (props.momentData.title === '') {
    return (
      <div className={style.header}></div>
    )
  } else {
    return (
      <div className={style.header}>
        <div className={style.description}>{props.momentData.description}</div>
        <div className={style.info}>
          <div className={style['user-id']}><a href={`https://twitter.com/${props.user}`}>@{props.user}</a></div>
          <time className={style['edit-date']} dateTime={`${new Date(props.momentData.timestamp)}`}>
            {new Date(props.momentData.timestamp).toLocaleDateString('ko-kr', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
        </div>
      </div>
    )
  }
}

function preprocessTweetData(metadata, tweets) {
  const getAttachmentKey = (url) => {
    return url.split('/')[url.split('/').length - 1].split('.')[0];
  }

  const preprocessed = metadata.tweets_id.map((id) => {
    let tweet = tweets.find(t => t.id === id);
    let { attachments, created_at, ...data } = tweet;

    return {
      isValidData: true,
      attachments: tweet.attachments.map((attachment, index) => {
        return {
          key: getAttachmentKey(attachment),
          url: attachment,
          alt: `${index + 1}번째 jpg 또는 gif, video 썸네일`
        }
      }),
      created_at: new Date(tweet.created_at),
      ...data
    }
  });
  return preprocessed;
}