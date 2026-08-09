const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "host.docker.internal",
  database: "shopeasy",
  password: "Sharmi$123",
  port: 5432,
});

module.exports = pool;