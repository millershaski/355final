import express, { Request, Response } from "express";
import { Task, TaskInputData } from "../models/Task";

const router = express.Router();

// updates a specified task
router.put("/:id", async (req: Request, resp: Response) =>
{
    try 
    {
        console.log("Updating task: " + req.params.id);
        const task = await Task.findByPk(req.params.id);
        if(task == null)
            return resp.status(404).json({ error: 'Task not found' });        

        console.log("Found task: " + task);
        task.UpdateWith(new TaskInputData(req));
        
        resp.json(task);
    } 
    catch (error) 
    {
        console.error("Error fetching plants:", error); 
        resp.status(500).send("Internal Server Error"); 
    }
});


module.exports = router;