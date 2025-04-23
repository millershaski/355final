import express, { Request, Response } from "express";


const router = express.Router();

// Logout route (GET route for simplicity)
router.get('/logout', (req:any, res) => 
{
    req.session.destroy((err:any) => 
    {
        if(err) 
            return res.status(500).send("Error logging out.");
    
        res.send("Logged out successfully.");
    });
});

module.exports = router;