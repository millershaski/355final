import express, { Request, Response } from "express";
import { AuthUser, AuthUserInputData} from "../models/AuthUser";
import { ValidationError } from "sequelize";
import { GetValidationErrorMessage } from "../ServerAuth";

const router = express.Router();


// register a new user
router.post('/', async (req, res) => 
{
    const username = req.body["username"];
    const password = req.body["password"];
    
    if (!username || !password) 
        return res.status(400).send("Please provide a username and password.");
    
    try 
    {
        const newUser = await AuthUser.create({ username, password });
        res.send(`User ${newUser.username} registered successfully.`);
    } 
    catch (error) 
    {
        if(error instanceof ValidationError)
        {
            console.error("Error creating task:", (error as ValidationError).message); 
            console.error("Full Error:", error); 
            res.status(500).send(GetValidationErrorMessage(error)); 
        }
        else
        {
            console.error("Error registering user:", error); 
            res.status(500).send(error);
        }
    }
});


module.exports = router;