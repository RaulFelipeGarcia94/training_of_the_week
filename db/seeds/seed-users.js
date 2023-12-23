const bcrypt = require("bcryptjs");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      id: 1,
      name: "admin",
      login: "admin",
      email: "admin@mail.com",
      password: bcrypt.hashSync("1234"),
      roles: "ADMIN;USER",
    },
    {
      id: 2,
      name: "user default",
      login: "user",
      email: "user@mail.com",
      password: bcrypt.hashSync("1234"),
      roles: "USER",
    },
  ]);
};
