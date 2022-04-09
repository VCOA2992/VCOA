import { Sequelize } from "sequelize";
import { DATABASE_URL } from "../config/config.js";

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  host: "localhost",
  port: 5432,
  ssl: true,
  dialectOptions: {
    ssl: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;
