import express, { Request, Response } from "express";


const router = express.Router();

// Logout via a get
router.get("/", (req:any, res) => 
{
    try
    {
        req.session.destroy((err:any) => 
        {
            if(err) 
                return res.status(500).send("Error logging out.");    

            res.render("layouts/logout", {suppressNav:true});
        });
    }
    catch(error) 
    {
        res.status(500).send("Internal Server Error"); 
    }
});

module.exports = router;