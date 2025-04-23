import {sequelize} from "./SequelizeInstance";
import { Task } from "../models/Task";
import { User } from "../models/User";
import { Project } from "../models/Project";


export const ResetDatabase = async () => 
{
    console.log("Resetting database...");

    await sequelize.drop(); // Clears tables before sync
    await sequelize.sync({force:true});

	
    await Project.create({id: 1, name: "Todo"})
    await Project.create({id: 2, name: "Project1"})
    await Project.create({id: 3, name: "Sprint"})
    
	
    await User.create({id:1, name: "Bob", email: "bob@bob.com"});
    await User.create({id:2, name: "Thomas", email: "tommy@tom.com"});    
	
	
    await Task.create({id: 1, name: "Task1", description: "Description1", dueDate: Date.now(), isComplete: false, assigneeId: 2, projectId: 2});
    await Task.create({id: 2, name: "Task2", description: "Description2", dueDate: Date.now(), isComplete: true, projectId: 2});

	
    await Task.create({id: 3, name: "Sprint Task 1", description: "Description1", dueDate: Date.now(), isComplete: false, assigneeId: 2, projectId: 3});
    await Task.create({id: 4, name: "Sprint Task 2", description: "Description2", dueDate: Date.now(), isComplete: true, projectId: 3});

    console.log("...Done resetting database");
};


// ensures that there's always a project with id 1
export const EnsureProject = async () =>
{
    
	await sequelize.sync();
	
	const project = await Project.findByPk(1);
	if(project == null)
    	await Project.create({id: 1, name: "Todo"})
}