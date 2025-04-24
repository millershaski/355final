import express, { Request, Response } from "express";
import { Get404PageString} from "../FileTemplates";


const router = express.Router();

// displays 404 page
router.get("", async (req: Request, resp: Response) =>
{
    try 
    {
        resp.redirect("/project/1");
        //resp.status(404).send(Get404PageString());     
    } 
    catch (error) 
    {
        console.error("Error:", error); 
        resp.status(500).send("Internal Server Error"); 
    }
});


module.exports = router;