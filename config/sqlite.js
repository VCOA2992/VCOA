import { Sequelize } from "sequelize";
// import { DataTypes } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  logging: false,
});

// const User = sequelize.define(
//   "User",
//   {
//     chatId: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     username: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     timestamps: false,
//     createdAt: false,
//     updatedAt: false,
//     // Other model options go here
//   }
// );

// const main = async () => {
//   await sequelize.sync();

//   // const user = await User.create({
//   //   chatId: "SDF",
//   //   name: "SDF",
//   //   username: "SDF",
//   // });
//   // user.save();
//   let users = await User.findOne({ where: { chatId: "SDF" } });
//   console.log(users);
// };

// main();

export default sequelize;
