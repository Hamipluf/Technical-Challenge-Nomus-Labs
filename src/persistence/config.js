const dotenv = require("dotenv").config();
const { Client } = require("pg");
// PostgreSQL
const client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: 5432,
  ssl: true,
});

client
  .connect()
  .then(() => console.log("Conexión exitosa a PostgreSQL"))
  .catch((err) => console.error("Error de conexión a PostgreSQL", err));

module.exports = client;
