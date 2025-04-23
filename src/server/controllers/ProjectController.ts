import express, { Request, Response } from "express";
import { Task } from "../models/Task";
import { User } from "../models/User";
import { Project, ProjectInputData} from "../models/Project";
import { Get404PageString } from "../FileTemplates";
import { IsAuthenticated } from "../ServerAuth";


const router = express.Router();

// displays a specific project
router.get("/:id", async (req: Request, resp: Response) =>
{
    try 
    {
        if(IsAuthenticated(req) == false)
            return resp.render("layouts/login", {suppressNav:true});        

        const project = await Project.findByPk(req.params.id);
        if(project == null)
            return resp.status(404).send(Get404PageString());        

        const allTasks = await (project as any).getTasks();  // as any to suppress the warning     
        const allPlainTasks:any[] = [];
        for(const someTask of allTasks) // Task.GetAllHandlebarData is async, so we must manually await it (sure is ugly)
        {
            someTask.FixDates();
            const plainTask = await someTask.GetAllHandlebarData_async();
            allPlainTasks.push(plainTask);
        }
        
        const allUsers = await User.findAll();
        const allPlainUsers = allUsers.map(user => user.GetAllHandlebarData());

        const allProjects = await Project.findAll();
        const allPlainProjects = allProjects.map(project => project.GetAllHandlebarData());
        
        resp.render("layouts/project", {allTasks: allPlainTasks, allUsers: allPlainUsers, project: project.GetAllHandlebarData(), allProjects: allPlainProjects});
    } 
    catch(error) 
    {
        console.error("Error fetching project:", error); 
        resp.status(500).send("Internal Server Error"); 
    }
});



// updates a specified project
router.put("/:id", async (req: Request, resp: Response) =>
{
    try 
    {
        const project = await Project.findByPk(req.params.id);
        if(project == null)
            return resp.status(404).json({ error: 'Project not found' });        

        project.UpdateWith(new ProjectInputData(req));        
        resp.json(project);
    } 
    catch (error) 
    {
        console.error("Error fetching task:", error); 
        resp.status(500).send("Internal Server Error"); 
    }
});


module.exports = router;