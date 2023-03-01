import style from './editor.module.css';

import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

import { isValidTwitterUrl, getTweetId, getTweetFromTwitterAPI } from '../../api/common.js';
import { getMomentData, getMomentTweets, updateMomentData, createMomentTweets, deleteMomentTweets } from '../../api/firestore.js';

import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { ProgressBackdrop } from '../../components/ProgressBackdrop.js';

import { EmbeddedTweet } from '../../components/EmbeddedTweet.js';
import { InputTextField } from '../../components/InputTextField.js';
import { BasicButton } from '../../components/BasicButton.js';
import { AlertSnackbar } from '../../components/AlertSnackbar.js';
import { AddTweetDialog } from '../../components/AddTweetDialog.js';

export function MomentEditorPage(props) {
  // 사용자가 입력하는 모멘트 제목, 설명
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // 모멘트 메타데이터
  const [momentData, setMomentData] = useState({
    title: '',          // 모멘트 제목
    description: '',    // 모멘트 설명
    timestamp: null,    // 모멘트 최종 수정일
    username: props.user,     // 모멘트 작성자
    tweets_id: []          // 트윗 목록
  });

  const [tweets, setTweets] = useState([]);                 // 화면에 출력하는 상세 tweet data 목록
  const [deleteTweetsId, setDeleteTweetsId] = useState([]); // 사용자가 모멘트에서 삭제한 tweet id 목록
  const [addTweets, setAddTweets] = useState([]);           // 사용자가 새롭게 추가한 tweet data 목록

  // alert 출력 상태
  const [alert, setAlert] = useState({
    timestamp: null,
    severity: null, // error | warning | info | success
    message: ''
  });

  // Progress 출력 상태
  const [isLoading, setIsLoading] = useState(true);

  // tweet 입력받는 dialog 상태
  const [dialog, setDialog] = useState({
    open: false,
    data: ''
  });

  const isOSDarkMode = useMediaQuery({
    query: '(prefers-color-scheme: dark)',
  });

  const isMobile = useMediaQuery({
    query: '(max-width: 768px)'
  })

  useEffect(() => {
    async function fetch() {
      // user, id로 만들어진 모멘트 없을 경우 에러 처리
      try {
        const momentDataFromFirestore = await getMomentData(props.user, props.id);
        setMomentData(momentDataFromFirestore);
        setTitle(momentDataFromFirestore.title);
        setDescription(momentDataFromFirestore.description);
      } catch (error) {
        console.error(error);
      }

      const tweetsFromFirestore = await getMomentTweets(props.user, props.id);
      setTweets(tweetsFromFirestore);
      setIsLoading(false);
    }

    props.isAuthenticated && fetch();
  }, [props.isAuthenticated]);

  // addTweet에서 data(url) 받아왔을 경우
  useEffect(() => {
    // modal이 열렸거나 입력 받은 url data 없을 경우 처리
    if (dialog.open || dialog.data === '') {
      return;
    }
    
    // modal이 열렸거나 입력 받은 url data 없을 경우 처리
    async function fetch() {
      setIsLoading(true);

      // 트윗 URL 유효성 검사
      const url = dialog.data;
      let isValidUrl = isValidTwitterUrl(url);
      if (!isValidUrl) {
        setIsLoading(false);
        setAlert({
          timestamp: Date.now(),
          severity: 'error',
          message: '유효한 트윗 URL이 아닙니다.'
        });
        return;
      }

      const tweet = await getTweetFromTwitterAPI(url);
      if (!tweet) {
        setIsLoading(false);
        setAlert({
          timestamp: Date.now(),
          severity: 'error',
          message: '데이터를 읽을 수 없는 트윗입니다.'
        });
        return;
      }

      // moment metadata 내 tweets_id 배열에 추가
      const editedMomentData = {...momentData};
      editedMomentData.tweets_id.push(getTweetId(url));
      setMomentData(editedMomentData);

      // tweet data 배열 수정
      const editedTweets = [...tweets];
      editedTweets.push(tweet);
      setTweets(editedTweets);

      const newAddTweets = [...addTweets];
      newAddTweets.push(tweet);
      setAddTweets(newAddTweets);

      setIsLoading(false);
    }

    fetch();
  }, [dialog]);

  if (!props.isAuthenticated) {
    return <></>;
  }

  return (
    <>
      <div className={style.header}>
        <InputTextField
          id='moment-title'
          label='모멘트 제목'
          variant='standard'
          value={title}
          type='text'
          onChange={(e) => handleTextFieldChange(e, setTitle)} />
        <InputTextField
          id='moment-description'
          label='모멘트 설명'
          variant='standard'
          value={description}
          type='text'
          onChange={(e) => handleTextFieldChange(e, setDescription)} />
        <BasicButton
          className={`${style.save} button rounded`}
          fullWidth
          variant='contained'
          disabled={!title || !description}
          onClick={save} >
          저장
        </BasicButton>
      </div>
      <div className={style.tweets}>
        {
          tweets.map((tweet, index) => {
            return (
              <div className={style['tweet-container']} key={tweet.id}>
                <EmbeddedTweet tweet={tweet} className={style.content}></EmbeddedTweet>
                <IconButton aria-label="add" onClick={() => removeTweet(index)}>
                  <RemoveCircleIcon color='error' fontSize={isMobile ? 'medium' : 'large'}/>
                </IconButton>
              </div>
            );
          })
        }
        <div className={style['tweet-container']}>
          <div className={`${style.content} ${style.mockup}`}>트윗 추가</div>
          <IconButton aria-label="add" onClick={addTweet}>
            <AddCircleIcon color={isOSDarkMode ? 'primary' : 'info'} fontSize={isMobile ? 'medium' : 'large'} />
          </IconButton>
        </div>
      </div>
      <AlertSnackbar alert={alert} />
      <ProgressBackdrop isLoading={isLoading}/>
      <AddTweetDialog open={dialog.open} setDialog={setDialog} />
    </>
  )

  function handleTextFieldChange(event, setter) {
    setter(event.target.value);
  }

  async function save() {
    try {
      setIsLoading(true);

      // 추가된 트윗 데이터 기록
      const addTweetsOnLocal = addTweets.filter(tweet => momentData.tweets_id.includes(getTweetId(tweet.url)));
      await createMomentTweets(props.user, props.id, addTweetsOnLocal);

      // 삭제된 트윗 데이터 삭제
      const deleteTweetsIdOnLocal = deleteTweetsId.filter(tweetId => !momentData.tweets_id.includes(tweetId));
      await deleteMomentTweets(props.user, props.id, deleteTweetsIdOnLocal);

      // 모멘트 메타데이터 업데이트
      await updateMomentData(props.user, props.id, {
        title: title,                   // 모멘트 제목
        description: description,       // 모멘트 설명
        timestamp: Date.now(),          // 모멘트 최종 수정일
        username: props.user,           // 모멘트 작성자
        tweets_id: momentData.tweets_id // 트윗 목록
      });

      setIsLoading(false);
      setAlert({
        timestamp: Date.now(),
        severity: 'success',
        message: '수정 완료! 모멘트 페이지로 이동합니다...'
      });
      setTimeout(() => {
        window.location.replace(`/${props.user}/${props.id}`);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      setAlert({
        timestamp: Date.now(),
        severity: 'error',
        message: '수정 실패! 오류가 발생했습니다...'
      });
    }
  }

  function addTweet() {
    setDialog({
      open: true,
      data: ''
    });
  }

  function removeTweet(index) {
    setIsLoading(true);

    // moment metadata 내 tweets_id 배열 수정
    const editedMomentData = {...momentData};
    const [deleteTweetid] = editedMomentData.tweets_id.splice(index, 1);
    setMomentData(editedMomentData);

    // tweet data 배열 수정
    const editedTweets = [...tweets];
    editedTweets.splice(index, 1);
    setTweets(editedTweets);

    // 삭제한 tweet id 기록
    const newDeleteTweetsId = [...deleteTweetsId];
    newDeleteTweetsId.push(deleteTweetid);
    setDeleteTweetsId(newDeleteTweetsId);

    setIsLoading(false);
  }
}