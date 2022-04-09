import sequelize from "../config/sqlite.js";
import { DataTypes } from "sequelize";

const User = sequelize.define(
  "User",
  {
    chatId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

export default User;
