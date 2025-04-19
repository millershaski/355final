import {sequelize} from "../config/SequelizeInstance";
import {Plant} from "./Plant";

const InitializeDatabase = () => 
{
  return sequelize.sync(); 
};

export { sequelize, Plant, InitializeDatabase};