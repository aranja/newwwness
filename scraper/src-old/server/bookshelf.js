import createKnex from 'knex'
import createBookshelf from 'bookshelf'
import knexConfig from './knexfile'

export const knex = createKnex(knexConfig)

const bookshelf = createBookshelf(knex)

export const Link = bookshelf.Model.extend({
  tableName: 'links',
  hasTimestamps: true,

  tweets() {
    return this.hasMany(Tweet)
  },

  async findOrCreate(options) {
    const cloned = this.clone()
    const result = await this.fetch(Object.assign({}, options, { require: false }))
    if (result === null) {
      return await cloned.save()
    }
    return result
  },
})

export const Tweet = bookshelf.Model.extend({
  tableName: 'tweets',
})

export function queryHotLinks() {
  return Link.query()
    .join('tweets', 'tweets.link_id', 'links.id')
    .select(knex.raw('links.url, links.domain, sum(hot_weight(weight, tweets.created_at)) as hotness'))
    .groupBy('links.url', 'links.domain')
    .orderBy('links.domain')
}

export default bookshelf
