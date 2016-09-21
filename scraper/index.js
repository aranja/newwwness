import Twit from 'twit'
import flatten from 'lodash/flatten'
import { Link, Tweet } from './bookshelf'

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  app_only_auth: true,
})

const sources = [
  {
    twitter: 'thealphanerd',
    weight: 1,
  }
]

async function processSource(source) {
  const { data } = await T.get('statuses/user_timeline', { screen_name: source.twitter })
  const urls = data.map(tweet => {
    return tweet.entities.urls.map(url => ({
      tweetId: tweet.id_str,
      user: tweet.user.screen_name,
      text: tweet.text,
      url: url.expanded_url,
    }))
  })
  return flatten(urls)
}

async function run() {
  let links = []
  for (const source of sources) {
    const sourceUrls = await processSource(source)
    links = links.concat(sourceUrls)
  }

  for (const { url, user, text, tweetId } of links) {
    const link = await Link.forge({ url }).findOrCreate()
    const tweet = await Tweet.where('id', tweetId).fetch()
    if (!tweet) {
      await Tweet.forge({
        id: tweetId,
        link_id: link.id,
        user,
        text,
      }).save(null, { method: 'insert' })
    }
  }
}

run()
