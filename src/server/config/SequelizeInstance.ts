import { Sequelize } from "sequelize";


export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "data.db",
  logging: false,
  logQueryParameters: true,
});



