import {sequelize} from "../config/SequelizeInstance";


const InitializeDatabase = () => 
{
  return sequelize.sync(); 
};


export { sequelize, InitializeDatabase};