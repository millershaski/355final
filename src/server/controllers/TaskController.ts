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
        await Task.create({name: "New task", dueDate: new Date(), projectId: req.body["projectId"], parentTaskId: req.body["parentTaskId"]});  
        resp.status(204).send();
    } 
    catch (error) 
    {
        console.error("Error creating task:", error); 
        resp.status(500).send("Internal Server Error"); 
    }
});



// gets the target data from the specified task
router.get("/:id", async (req: Request, resp: Response) =>
{
    try 
    {
        const task = await Task.findByPk(req.params.id);
        if(task == null)
            return resp.status(404).json({ error: 'Task not found' });        

        const data = await task.GetAllHandlebarData_async();
        const key = req.query.target

        console.log("sending data: " + key + " : " + data[key as keyof typeof data]);

        if(key == null) // we send everything if no target was passed
            resp.json(data);             
        else
            resp.json({value: data[key as keyof typeof data]});
    } 

    catch (error) 
    {
        console.error("Error fetching task:", error); 
        resp.status(500).send("Internal Server Error"); 
    }
});



module.exports = router;