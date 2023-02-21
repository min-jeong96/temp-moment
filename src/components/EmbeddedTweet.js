import style from './EmbeddedTweet.module.css';

import Button from '@mui/material/Button';

import ErrorIcon from '@mui/icons-material/Error';
import TwitterIcon from '@mui/icons-material/Twitter';

export function EmbeddedTweet(props) {
  const tweet = props.tweet;

  if (tweet.isValidData) {
    return (
      <div className={style.tweet}>
        <img className={style['user-profile']} alt='user-profile' src={tweet.user_profile} />
        <div>
          <div className={style['user-info']}>
            <span className={style.name}>{tweet.user_name}</span>
            <span className={style.id}>@{tweet.user_id}</span>
          </div>
          <div className={style.text}>{convertText(tweet.text)}</div>
          <div className={style.attachments} style={{'--n': tweet.attachments.length}}>
            {
              tweet.attachments.map((attachment) => {
                return (
                  <img key={attachment.key} src={attachment.url} alt={attachment.alt}></img>
                )
              })
            }
          </div>
          <time className={style['created-at']} dateTime={tweet.created_at}>
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
      <div className={`${style.tweet} ${style.error}`} key={tweet.id}>
        <ErrorIcon />
        <div className={style.text}>권한 오류</div>
      </div>
    )
  }

  function toTwitter(url) {
    window.open(url);
  }

  function convertText(text) {
    return text
            .replaceAll(/https:\/\/[^ \t\r\n\v\f]*/g, '')
            .replaceAll(/\\n/g, '\n');
  }
}