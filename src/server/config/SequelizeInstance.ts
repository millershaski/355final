import { Sequelize } from "sequelize";


export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "data.db",
  logging: console.log,
  logQueryParameters: true,
});



