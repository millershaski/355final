import express, { Request, Response } from "express";
import { Get404PageString } from "../FileTemplates";
import { Plant, PlantInputData } from "../models/Plant";
import { Validator } from "../models/Validator";

const router = express.Router();


router.get("/changeSuccess", (req, resp) => resp.render("responseLayout/changeSuccess"));
router.get("/changeFail", (req, resp) => resp.render("responseLayout/changeFail"));

router.get("/addFail", (req, resp) => resp.render("responseLayout/addPlantFail"));

router.get("/deleteSuccess", (req, resp) => resp.render("responseLayout/deleteSuccess"));
router.get("/deleteFail", (req, resp) => resp.render("responseLayout/deleteFail"));


router.get("/new", async (req: Request, resp: Response) =>
{
    resp.render("addPlant");      
});



// handles creating a new plant
router.post("/new", async (req: Request, resp: Response) =>
{
    const input: PlantInputData = new PlantInputData(req);
    if(input.IsValid() == false)
        OnPlantInputInvalid(resp, "responseLayout/addPlantFail")    
    else   
    {
        await Plant.create({label: input.plantLabel, species: input.species, plantDate: input.plantDate, waterSchedule: input.wateringSchedule, lastWaterDate: input.lastWaterDate, notes: input.notes});
        resp.render("responseLayout/addPlantSuccess");
    }      
});



function OnPlantInputInvalid(resp: Response, layoutName: string)
{
    let errorMessage = "";
    const allErrors = Validator.GetAllErrorMessages();
    allErrors.forEach((value) =>
    {
        errorMessage += (value + "<br>");
    });

    console.error("ERROR: " + errorMessage);

    resp.render(layoutName, {}, (err, html) =>
    {
        resp.status(400).send(html); // this way, the sender can handle the html if they want to
    });

    //resp.status(400).send(errorMessage);
}



// update a plant
router.put("/:id", async (req: Request, resp: Response) => 
{
    const foundPlant = await FindPlant(req.params.id);
    if(foundPlant == null)
    {
        console.error("Unable to find plant with id: ", req.params.id); 
        resp.status(500).send("Internal Server Error"); 
        return;
    }

    const input: PlantInputData = new PlantInputData(req);
    if(input.IsValid() == false)
        OnPlantInputInvalid(resp, "responseLayout/changeFail");
    else   
    {
        await foundPlant.UpdateWith(input);
        resp.render("responseLayout/changeSuccess");
    }
});
    


// we use this method so that we can add one to the imported dates
async function FindPlant(id: string): Promise<Plant | null>
{ 
    const foundPlant = await Plant.findOne({ where: {id: id} });
    if(foundPlant == null)
        return foundPlant;

    foundPlant.FixDates();
    return foundPlant;
}



// view single plant (at bottom so that something like /plants/new is not blocked)
router.get("/:id", async (req, resp) => 
{
    try
    {
        const foundPlant = await FindPlant(req.params.id);
        
        if(foundPlant != null)
            resp.render("editPlant", foundPlant.GetAllHandlebarDataForEdit());
        else
            resp.status(404).send(Get404PageString());        
    }
    catch(error) 
    {
        console.error("Error fetching plants:", error); 
        resp.status(500).send("Internal Server Error"); 
    }
});



// delete a plant
router.delete("/:id", async(req: Request, resp: Response) =>
{
    const foundPlant = await FindPlant(req.params.id); // we really don't have to fix the date for this one, but it's good practice to be consistent
    if(foundPlant == null)
    {
        console.error("Unable to find plant with id: ", req.params.id); 
        resp.status(500).send("Internal Server Error"); 
        return;
    }

    await foundPlant.destroy();
    resp.status(200).send("Success");
});

module.exports = router;