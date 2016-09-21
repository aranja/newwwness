import createKnex from 'knex'
import createBookshelf from 'bookshelf'
import knexConfig from './knexfile'

const knex = createKnex(knexConfig)

const bookshelf = createBookshelf(knex)

export const Link = bookshelf.Model.extend({
  tableName: 'links',

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

export default bookshelf
