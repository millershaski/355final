import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeInstance"; 
import { Validator } from "./Validator";
import { Request } from "express";


export class User extends Model 
{
    declare id: number; 
    declare name: string;
    declare email: string;


    // We use this method so that handlebars can correctly access the data (it can't access inherited members by default).
    // We can also perform some formatting things here.
    // This method returns plain data that handlebars can access
    GetAllHandlebarData()
    {
        const data = 
        {            
            id: this.id,
            name: this.name,
            email: this.email,
            initials: this.GetInitials()
        }
        return data;
    }
    

    public GetInitials(): string
    {
        const allNames = this.name.split(" ");
        if(allNames.length == 1)
        {
            if(allNames[0].length >= 2)
                return allNames[0][0] + allNames[0][1];
            else if(allNames[0].length == 1)
                return allNames[0][0];
        }
        else if(allNames.length > 1)
            return allNames[0][0] + allNames[1][0];
        
        return "UK" // unknown (fallback)
    }



    // Updates this instance with data from newData, then invokes save
    async UpdateWith(newData: UserInputData)
    {
        if(newData == null)
            return;
        
        this.name = newData.name;
        this.email = newData.email;

        await this.save();
    }
}



// Handles getting all input data correctly from a Request
export class UserInputData
{
    name: string = "";
    email: string = "";

    constructor(req: Request)
    {
        if(req == null)
            return;

        try
        {
            this.name = this.GetString("name", req);
            this.email = this.GetString("email", req);
        }
        catch
        {
            // I don't care about the error too much, validation will fail later
            // however, we could do something like Validator.AddError(caughtError)
        }         
    }



    // Separate method so that we can sanitize if we need to (not implemented)
    GetString(key: string, req: Request): string
    {
        return req.body[key];
    }



    // Internally, this method calls Validator.Validate and returns Validator.IsValid
    // Invoke Validator.GetAllErrorMessages to retrieve an array of all errors
    IsValid(): boolean
    {
        Validator.Reset();
        Validator.Validate(this.name, "Name", Validator.NotEmptyString);
        Validator.Validate(this.email, "Email", Validator.NotEmptyString);

        return Validator.IsValid();
    }    
}



User.init(
{
    id: 
    {
        type: DataTypes.INTEGER,
        autoIncrement: true, // The ID will automatically increment when a new record is created
        primaryKey: true, 
    },    
    name: 
    {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:
        {
          len:[1, 100] // must be at least 1 character long
        }
    },
    email:
    {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:
        {
            ValidateEmail(value: any)
            {
              if((/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/).test(value) == false)
                throw new Error("Email is not in a valid format");
            }
        },      
        set(value: any)
        {
            if(value == null)
                return null;

            this.setDataValue("email", value.toLowerCase());   
        }        
    },
},
{
    sequelize, 
    modelName: "User",
    tableName: 'Users',  // this can be omitted, as the name will automatically be made the plural version of the modelName
    timestamps: false, // I don't care when the records were created or updated 
    underscored: true
});

export default {User, UserInputData};
