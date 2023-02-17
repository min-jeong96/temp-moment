import Button from '@mui/material/Button';

import ErrorIcon from '@mui/icons-material/Error';
import TwitterIcon from '@mui/icons-material/Twitter';

import './EmbeddedTweets.css';

export function EmbeddedTweets(props) {
  if (props.tweets.length === 0) {
    return (
      <div className='loading'>트위터 API 유료화 대응 중...</div>
    )
  } else {
    return (
      <div className='tweets'>
        {
          props.tweets.map((tweet) => {
            return (
              <EmbeddedTweet tweet={tweet} key={tweet.id}></EmbeddedTweet>
            );
          })
        }
      </div>
    )
  }
}

function EmbeddedTweet(props) {
  const tweet = props.tweet;

  if (tweet.isValidData) {
    return (
      <div className='tweet'>
        <img className='user-profile' alt='user-profile' src={tweet.user_profile} />
        <div>
          <div className='user-info'>
            <span className='name'>{tweet.user_name}</span>
            <span className='id'>@{tweet.user_id}</span>
          </div>
          <div className='text'>{convertText(tweet.text)}</div>
          <div className='attachments' style={{'--n': tweet.attachments.length}}>
            {
              tweet.attachments.map((attachment) => {
                return (
                  <img key={attachment.key} src={attachment.url} alt={attachment.alt}></img>
                )
              })
            }
          </div>
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
        <ErrorIcon />
        <div className='text'>권한 오류</div>
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