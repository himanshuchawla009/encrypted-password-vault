// todo: adding user id as a foreign key in passwords table.
exports.up = function (knex) {
  return knex.schema
    .createTable("passwords", (table) => {
      table.increments("id").primary();
      table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
      table.string("access", 255).notNullable();
      table.string("ownerEmail", 255).notNullable();
      table.string("userEmail", 255).notNullable();
      table.string("domain", 255).notNullable();
      table.string("username", 255).notNullable();
      table.text("hash", "mediumtext").notNullable();
      table.string("publicKey", 255).notNullable();
      table.text("encryptedMasterKey", "longtext").notNullable();
      table.text("encryptedPassword", "mediumtext").notNullable();
    })
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
      table.string("email", 255).notNullable();
      table.string("publicKey", 255).notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("passwords").dropTable("users");
};
