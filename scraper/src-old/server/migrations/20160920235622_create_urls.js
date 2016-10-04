
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('links', function(table) {
      table.increments()
      table.string('url')
          .unique()
      table.string('domain')
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
      table.float('weight')
          .notNullable()
      table.integer('link_id')
          .references('links.id')
      table.dateTime('created_at')
      table.primary(['id', 'link_id'])
    })
}

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('tweets')
    .dropTable('links')
}