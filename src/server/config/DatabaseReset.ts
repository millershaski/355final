import {sequelize} from "./SequelizeInstance";
import { Task } from "../models/Task";
import { User } from "../models/User";

export const ResetDatabase = async () => 
{
    console.log("Resetting database...");

    await sequelize.drop(); // Clears tables before sync
    await sequelize.sync();


    await User.create({id:1, name: "Bob", email: "bob@bob.com"});
    await User.create({id:2, name: "Thomas", email: "tommy@tom.com"});
                
   
    await Task.create({id: 1, name: "Task1", description: "Description1", dueDate: Date.now(), isComplete: false, assigneeId: 2});
    await Task.create({id: 2, name: "Task2", description: "Description2", dueDate: Date.now(), isComplete: true});

    console.log("...Done resetting database");
};