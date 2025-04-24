import { createServer } from "http";
import { Express } from "express";
import {sequelize} from "./SequelizeInstance";
import { Task } from "../models/Task";
import { User } from "../models/User";
import { Project } from "../models/Project";



// ensures that the server doesn't start until the database is synced
export const StartServer = async (port:any, app:Express) =>
{
    // only 1 should be uncommented
    //await ResetDatabase();
    await EnsureProject();

    // once database is ready, we can start the server
    const server = createServer(app);
    server.listen(port, () => console.log(`HTTP Server listening on port ${port}`));    
}



const ResetDatabase = async () => 
{
    console.log("Resetting database...");

    await sequelize.drop(); // Clears tables before sync
    await sequelize.sync({force:true});
    
    await Project.create({id: 1, name: "Todo"})
    await Project.create({id: 2, name: "Project1"})
    await Project.create({id: 3, name: "Sprint"})
    
    
    await User.create({id:1, name: "Bob Bobbington", email: "bob@bob.com"});
    await User.create({id:2, name: "Thomas Shrimp", email: "tommy@tom.com"});   
    await User.create({id:3, name: "Tobias Funke", email: "toby@tom.com"});    
    
    
    await Task.create({id: 1, name: "Do important thing", description: "Description1", dueDate: Date.now(), isComplete: false, assigneeId: 2, projectId: 1});
    await Task.create({id: 2, name: "Task2", description: "Description2", dueDate: Date.now(), isComplete: true, projectId: 1});

    await Task.create({id: 11, name: "Subtask of Task1", description: "Great description", dueDate: Date.now(), isComplete: false, assigneeId: 2, parentTaskId: 1});
    await Task.create({id: 13, name: "Subtask2 of Task1", description: "Great description", dueDate: Date.now(), isComplete: true, assigneeId: 1, parentTaskId: 1});

    
    await Task.create({id: 21, name: "Another Task", description: "Get those metrics up", dueDate: Date.now(), isComplete: false, assigneeId: 2, projectId: 2});
    await Task.create({id: 22, name: "More things", description: "Activate your core", dueDate: Date.now(), isComplete: true, projectId: 2});

    await Task.create({id: 211, name: "Subtask of Task1", description: "Great description", dueDate: Date.now(), isComplete: false, assigneeId: 2, parentTaskId: 21});
    await Task.create({id: 213, name: "Subtask2 of Task1", description: "Great description", dueDate: Date.now(), isComplete: true, assigneeId: 1, parentTaskId: 21});
    
    await Task.create({id: 3, name: "Sprint Task 1", description: "Description1", dueDate: Date.now(), isComplete: false, assigneeId: 2, projectId: 3});
    await Task.create({id: 4, name: "Sprint Task 2", description: "Description2", dueDate: Date.now(), isComplete: true, projectId: 3});

    console.log("...Done resetting database");
};
    
    
// ensures that there's always a project with id 1
const EnsureProject = async () =>
{    
    await sequelize.sync();
    
    const project = await Project.findByPk(1);
    if(project == null)
        await Project.create({id: 1, name: "Todo"})
}
    