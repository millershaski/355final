import express, { Request, Response } from "express";
import { AuthUser, AuthUserInputData} from "../models/AuthUser";

const bcrypt = require('bcrypt');
const router = express.Router();


// display login page
router.get("/", async (req:Request, res:Response) => 
{    
    res.render("layouts/login", {suppressNav:true});
});


// handle login request
router.put("/", async (req:any, res:any) => 
{
    const username = req.body["username"];
    const password = req.body["password"];
    
    if (!username || !password) 
        return res.status(400).send("Please provide a username and password.");
    
    try 
    {
        const user = await AuthUser.findOne({ where: { username } });
        if (!user) {
            return res.status(401).send('Login failed: User not found.');
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if(!valid) 
        return res.status(401).send('Login failed: Incorrect password.');
    
    // Save user info to session (excluding sensitive data)
    req.session.user = { id: user.id, username: user.username };
    res.send('Logged in successfully.');
    } catch(err: any) 
    {
        res.status(500).send("Error logging in: " + err.message);
    }
});

module.exports = router;