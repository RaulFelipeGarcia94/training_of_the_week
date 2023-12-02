exports.up = function (knex) {
  return knex.schema.createTable("trainings", (tbl) => {
    tbl.increments("id");
    tbl.text("description", 255).notNullable();
    tbl.text("type", 128).notNullable();
    tbl.text("day", 128).notNullable();
    tbl.text("load", 128).notNullable();
    tbl.text("series", 128).notNullable();
    tbl.decimal("interval").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("trainings");
};
