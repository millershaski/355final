import express, { Request, Response } from "express";
import { User, UserInputData} from "../models/User";
import { ValidationError } from "sequelize";

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
        if(error instanceof ValidationError)
        {
            console.error("Error creating task:", (error as ValidationError).message); 
            console.error("Full Error:", error); 
            resp.status(500).send(GetValidationErrorMessage(error)); 
        }
        else
        {
            console.error("Error creating task:", error); 
            resp.status(500).send(error);
        }
    }
});


function GetValidationErrorMessage(error: ValidationError): string
{
    let finalMessage = "";
    for(const someError of error.errors)
    {
        finalMessage += (someError.message + ", ");
    }
    finalMessage = finalMessage.replace(/, $/, ""); // remove trailing comma

    return finalMessage;
}

module.exports = router;