
exports.up = function(knex, Promise) {
  return knex.schema.raw(`
create or replace function
  hot_weight(weight real, date timestamp with time zone)
  returns numeric as $$
select round(cast(
         100 * $1 *
         exp(-1 * date_part('epoch', now() - $2) / 3600 / 12)
       as numeric))
$$ language sql immutable
  `)
}

exports.down = function(knex, Promise) {
  return knex.schema.raw('drop function hot_weight(real, timestamp with time zone)')
}
