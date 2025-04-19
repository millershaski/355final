import express, { Request, Response } from "express";
//import { Project} from "../models/Project";

const router = express.Router();

// displays a specific project
router.get("/:id", async (req: Request, resp: Response) =>
{
    try 
    {
        console.log("Displaying project: " + req.params.id);
        /*const allPlants = await Plant.findAll();      
        allPlants.forEach((somePlant) => somePlant.FixDates());  
        const allPlainData = allPlants.map(obj => obj.GetAllHandlebarData()) // needed so that handlebars can correctly access the properties (otherwise we get "Access has been denied to resolve the property "species" because it is not an "own property" of its parent.")
        
        resp.render("allPlants", {plant: allPlainData});  */    
    } 
    catch (error) 
    {
        console.error("Error fetching plants:", error); 
        resp.status(500).send("Internal Server Error"); 
    }
});


module.exports = router;