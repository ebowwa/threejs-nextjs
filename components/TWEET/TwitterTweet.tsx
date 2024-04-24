import React from 'react';
import tweetData from '../../public/html/tweet.json';

const TwitterTweet: React.FC = () => {
  const { text, author, date } = tweetData;

  return (
    <blockquote className="twitter-tweet">
      <p lang="en" dir="ltr">
        {text}
      </p>
      <a href={`https://twitter.com/${author.split(' -- ')[0]}/status/1770954693084381509`}>
        &mdash; {author} ({date})
      </a>
      <script
        async
        src="https://platform.twitter.com/widgets.js"
        charSet="utf-8"
      ></script>
    </blockquote>
  );
};

export default TwitterTweet;