import express, { Request, Response } from "express";
import { Get404PageString} from "../FileTemplates";


const router = express.Router();

// displays 404 page
router.get("", async (req: Request, resp: Response) =>
{
    console.log("Here");
    try 
    {
        resp.status(404).send(Get404PageString());     
    } 
    catch (error) 
    {
        console.error("Error fetching plants:", error); 
        resp.status(500).send("Internal Server Error"); 
    }
});


module.exports = router;