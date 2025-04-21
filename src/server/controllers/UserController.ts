import express, { Request, Response } from "express";
import { User, UserInputData} from "../models/User";

const router = express.Router();


// creates a new user
router.post("/", async (req: Request, resp: Response) =>
{
    try 
    {
        console.log("Creating new user");

        const userData = new UserInputData(req);
        const newUser = await User.create({name: userData.name, email: userData.email});  

        console.log("New user: " + JSON.stringify(newUser));

        resp.status(204).send(newUser);
    } 
    catch (error) 
    {
        console.error("Error creating task:", error); 
        resp.status(500).send("Internal Server Error"); 
    }
});


module.exports = router;