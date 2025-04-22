import express, { Request, Response } from "express";
import { Task } from "../models/Task";
import { User } from "../models/User";
import { Project} from "../models/Project";
import { Get404PageString } from "../FileTemplates";


const router = express.Router();

// displays a specific project
router.get("/:id", async (req: Request, resp: Response) =>
{
    try 
    {
        const project = await Project.findByPk(req.params.id);
        if(project == null)
            return resp.status(404).send(Get404PageString());        

        const allTasks = await (project as any).getTasks();  // as any to suppress the warning     
        const allPlainTasks:any[] = [];
        for(const someTask of allTasks) // Task.GetAllHandlebarData is async, so we must manually await it (sure is ugly)
        {
            someTask.FixDates();
            const plainTask = await someTask.GetAllHandlebarData();
            allPlainTasks.push(plainTask);
        }
        
        const allUsers = await User.findAll();
        const allPlainUsers = allUsers.map(user => user.GetAllHandlebarData());

        const allProjects = await Project.findAll();
        const allPlainProjects = allProjects.map(project => project.GetAllHandlebarData());
        
        resp.render("project", {allTasks: allPlainTasks, allUsers: allPlainUsers, project: project.GetAllHandlebarData(), allProjects: allPlainProjects});
    } 
    catch(error) 
    {
        console.error("Error fetching plants:", error); 
        resp.status(500).send("Internal Server Error"); 
    }
});


module.exports = router;