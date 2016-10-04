import Twit from 'twit'
import tldjs from 'tldjs'
import flatten from 'lodash/flatten'
import { Link, Tweet, knex } from './bookshelf'

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
  // let { data } = await T.get('statuses/user_timeline', { screen_name: source.twitter })
  // console.log(typeof data[0].created_at)
  const fs = require('fs')
  const data = JSON.parse(fs.readFileSync('data.json', { encoding: 'utf8' }))
  const urls = data.map(tweet => {
    return tweet.entities.urls.map(url => ({
      url: url.expanded_url,
      tweet: tweet,
    }))
  })

  for (const { url, tweet } of flatten(urls)) {
    const link = await Link.forge({
      url,
      domain: tldjs.getDomain(url),
    }).findOrCreate()
    const dbTweet = await Tweet.where('id', tweet.id_str).fetch()
    if (!dbTweet) {
      await Tweet.forge({
        id: tweet.id_str,
        link_id: link.id,
        user: tweet.user.screen_name,
        text: tweet.text,
        weight: source.weight,
        created_at: tweet.created_at,
      }).save(null, { method: 'insert' })
    }
  }
}

async function run() {
  for (const source of sources) {
    await processSource(source)
  }
}

run()
