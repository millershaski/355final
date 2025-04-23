import express, { Request, Response } from "express";
import { AuthUser, AuthUserInputData} from "../models/AuthUser";

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
    } catch (err : any) 
    {
        res.status(500).send("Error registering user: " + err.message);
    }
});


module.exports = router;