import { Sequelize } from "sequelize";
import { DATABASE_URL } from "../config/config.js";

const sequelize = new Sequelize(DATABASE_URL, {
  logging: false,
});

export default sequelize;
