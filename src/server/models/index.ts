import {sequelize} from "../config/SequelizeInstance";
import {Plant} from "./Old_Plant";

const InitializeDatabase = () => 
{
  return sequelize.sync(); 
};

export { sequelize, Plant, InitializeDatabase};