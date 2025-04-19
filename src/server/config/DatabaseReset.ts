import {sequelize} from "./SequelizeInstance";
import { Task } from "../models/Task";

export const ResetDatabase = async () => 
{
    console.log("Resetting database...");

    await sequelize.drop(); // Clears tables before sync
    await sequelize.sync();
   
    await Task.create({id: 1, name: "Task1", description: "Description1", dueDate: Date.now(), isComplete: false});
    await Task.create({id: 2, name: "Task2", description: "Description2", dueDate: Date.now(), isComplete: false});
                
    console.log("...Done resetting database");
};