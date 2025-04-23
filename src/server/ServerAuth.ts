import { Request, Response } from "express";
import { ValidationError } from "sequelize";


// returns false if there is no user in the session. If this is the case, it will automatically send a 401 status to the Response (if not null)
export function IsAuthenticated(req : any, res ?: Response) 
{
    if(!req.session.user) 
    {
        if(res != null)
            res.status(401).send('Unauthorized: Please log in to view this page.');
        return false;
    }
    return true;
}



export function GetValidationErrorMessage(error: ValidationError): string
{
    let finalMessage = "";
    for(const someError of error.errors)
    {
        finalMessage += (someError.message + ", ");
    }
    finalMessage = finalMessage.replace(/, $/, ""); // remove trailing comma

    return finalMessage;
}