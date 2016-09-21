
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('links', function(table) {
      table.increments()
      table.string('url')
          .unique()
      table.string('score')
          .notNullable()
          .default(0)
      table.string('max_score')
          .notNullable()
          .defaultTo(0)
      table.boolean('is_obsolete')
          .notNullable()
          .default(false)
      table.boolean('is_ignored')
          .notNullable()
          .default(false)
      table.boolean('is_shared')
          .notNullable()
          .default(false)
      table.timestamps()
    })

    .createTable('tweets', function(table) {
      table.bigInteger('id')
      table.string('user')
          .notNullable()
      table.string('text')
          .notNullable()
      table.integer('link_id')
          .references('links.id')
      table.timestamps()
      table.primary(['id', 'link_id'])
    })
}

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('tweets')
    .dropTable('links')
}
