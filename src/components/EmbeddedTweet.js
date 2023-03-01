import style from './EmbeddedTweet.module.css';

import Button from '@mui/material/Button';

import TwitterIcon from '@mui/icons-material/Twitter';

export function EmbeddedTweet(props) {
  const tweet = props.tweet;

  return (
    <div className={`${props.className} ${style.tweet}`}>
      <img className={style['user-profile']} alt='user-profile' src={tweet.user_profile} />
      <div>
        <div className={style['user-info']}>
          <span className={style.name}>{tweet.user_name}</span>
          <span className={style.id}>@{tweet.user_id}</span>
        </div>
        <div className={style.text}>{convertText(tweet.text)}</div>
        <div className={style.attachments} style={{'--n': tweet.attachments.length}}>
          {
            tweet.attachments.map((url, index) => {
              return (
                <img key={getAttachmentKey(url)} src={url} alt={`${index + 1}번째 이미지`}></img>
              )
            })
          }
        </div>
        <time className={style['created-at']} dateTime={new Date(tweet.created_at)}>
          {`${(new Date(tweet.created_at)).toLocaleDateString('ko-kr', { year: 'numeric', month: 'long', day: 'numeric' })} ${(new Date(tweet.created_at)).toLocaleTimeString('ko-kr')}`}
        </time>
        <Button
          variant="outlined" endIcon={<TwitterIcon />}
          onClick={() => {toTwitter(tweet.url)}}>
          트위터로 이동
        </Button>
      </div>
    </div>
  );

  function toTwitter(url) {
    window.open(url);
  }

  function convertText(text) {
    return text
            .replaceAll(/https:\/\/[^ \t\r\n\v\f]*/g, '')
            .replaceAll(/\\n/g, '\n');
  }

  function getAttachmentKey(url) {
    return url.split('/')[url.split('/').length - 1].split('.')[0];
  }
}