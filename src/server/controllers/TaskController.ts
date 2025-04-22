import express, { Request, Response } from "express";
import { Task, TaskInputData } from "../models/Task";

const router = express.Router();

// updates a specified task
router.put("/:id", async (req: Request, resp: Response) =>
{
    try 
    {
        const task = await Task.findByPk(req.params.id);
        if(task == null)
            return resp.status(404).json({ error: 'Task not found' });        

        task.UpdateWith(new TaskInputData(req));        
        resp.json(task);
    } 
    catch (error) 
    {
        console.error("Error fetching task:", error); 
        resp.status(500).send("Internal Server Error"); 
    }
});



// deletes the specified task
router.delete("/:id", async (req: Request, resp: Response) =>
{
    try 
    {
        const task = await Task.findByPk(req.params.id);
        if(task == null)
            return resp.status(404).json({ error: 'Task not found' });        

        await task.destroy();        
        resp.status(204).send();
    } 
    catch (error) 
    {
        console.error("Error fetching tasks:", error); 
        resp.status(500).send("Internal Server Error"); 
    }
});


// creates a generic new task
router.post("/", async (req: Request, resp: Response) =>
{
    try 
    {
        console.log("Creating new task");

        await Task.create({name: "New task", dueDate: new Date(), projectId: req.body["projectId"]});  
        resp.status(204).send();
    } 
    catch (error) 
    {
        console.error("Error creating task:", error); 
        resp.status(500).send("Internal Server Error"); 
    }
});



module.exports = router;