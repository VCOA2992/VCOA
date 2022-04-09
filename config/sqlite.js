import { Sequelize } from "sequelize";
import { DATABASE_URL } from "../config/config.js";
import pg from "pg";

const pool = new pg.Pool();

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

pool.on("connect", (err, client) => {
  if (err) console.error(err);
  console.log(client);
  console.log("Successfully connected to postgres.");
});

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  host: "localhost",
  port: 5432,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;
