import style from './EmbeddedTweets.module.css';

import { EmbeddedTweet } from './EmbeddedTweet.js';

export function EmbeddedTweets(props) {
  if (props.tweets.length === 0) {
    return (
      <div className={style.loading}>
        로딩 중...
      </div>
    )
  } else {
    return (
      <div className={style.tweets}>
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