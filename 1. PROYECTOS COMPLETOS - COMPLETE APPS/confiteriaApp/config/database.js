const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "confiteriaApp",
  password: "admin",
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
