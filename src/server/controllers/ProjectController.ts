import express, { Request, Response } from "express";
import { Task } from "../models/Task";
//import { Project} from "../models/Project";

const router = express.Router();

// displays a specific project
router.get("/:id", async (req: Request, resp: Response) =>
{
    try 
    {
        const allTasks = await Task.findAll();
        allTasks.forEach((someTask) => someTask.FixDates());  
        const allPlainTasks = allTasks.map(task => task.GetAllHandlebarData());   
        
        resp.render("project", {allTasks: allPlainTasks});
    } 
    catch (error) 
    {
        console.error("Error fetching plants:", error); 
        resp.status(500).send("Internal Server Error"); 
    }
});


module.exports = router;