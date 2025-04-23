import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeInstance"; 
import { Validator } from "./Validator";
import { Request } from "express";


export class AuthUser extends Model 
{
    declare id: number; 
    declare username: string;
    declare password: string;


    // We use this method so that handlebars can correctly access the data (it can't access inherited members by default).
    // We can also perform some formatting things here.
    // This method returns plain data that handlebars can access
    GetAllHandlebarData()
    {
        const data = 
        {            
            id: this.id,
            username: this.username,
        }
        return data;
    }
    


    // Updates this instance with data from newData, then invokes save
    async UpdateWith(newData: AuthUserInputData)
    {
        if(newData == null)
            return;
        
        if(newData.username != null)
            this.username = newData.username;
        if(newData.password != null)
            this.password = newData.password;

        await this.save();
    }
}



// Handles getting all input data correctly from a Request
export class AuthUserInputData
{
    username: string | undefined = "";
    password: string | undefined = "";

    constructor(req: Request)
    {
        if(req == null)
            return;

        try
        {
            this.username = this.GetString("username", req);
            this.password = this.GetString("password", req);
        }
        catch
        {
            // I don't care about the error too much, validation will fail later
            // however, we could do something like Validator.AddError(caughtError)
        }         
    }



    // Separate method so that we can sanitize if we need to (not implemented)
    GetString(key: string, req: Request): string | undefined
    {
        if(req.body.hasOwnProperty(key) == false)
            return undefined;
        
        return req.body[key];
    }



    // Internally, this method calls Validator.Validate and returns Validator.IsValid
    // Invoke Validator.GetAllErrorMessages to retrieve an array of all errors
    IsValid(): boolean
    {
        Validator.Reset();
        Validator.Validate(this.username, "Name", Validator.NotEmptyString);
        
        return Validator.IsValid();
    }    
}



AuthUser.init(
{
    id: 
    {
        type: DataTypes.INTEGER,
        autoIncrement: true, // The ID will automatically increment when a new record is created
        primaryKey: true, 
    },    
    username: 
    {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        /*validate:
        {
          len:[3, 100],
          ValidatePassword(value: any)
          {
            if((/^(?=.*[A-Z])/).test(value) == false)
              throw new Error("Password does not contain at least one uppercase letter");
            
            if((/^(?=.*[\d])/).test(value) == false)
              throw new Error("Password does not contain at least one number");
            
            if((/^(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?])/).test(value) == false)
              throw new Error("Password does not contain at least one special character");
          }
        }*/
    }    
},
{
    sequelize, 
    modelName: "AuthUser",
    tableName: "AuthUsers",  // this can be omitted, as the name will automatically be made the plural version of the modelName
    timestamps: false, // I don't care when the records were created or updated 
    underscored: true
});


const bcrypt = require('bcrypt');
// Hook to hash the password before saving a new user
AuthUser.beforeCreate(async (user, options) => 
{
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;
});

export default {AuthUser, AuthUserInputData};
