import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeInstance"; 
import { Validator } from "./Validator";
import { Request } from "express";
import { Task } from "./Task";


export class Project extends Model 
{
    declare id: number; 
    declare name: string;


    // We use this method so that handlebars can correctly access the data (it can't access inherited members by default).
    // We can also perform some formatting things here.
    // This method returns plain data that handlebars can access
    GetAllHandlebarData()
    {
        const data = 
        {            
            id: this.id,
            name: this.name,
        }
        return data;
    }



    // Updates this instance with data from newData, then invokes save
    async UpdateWith(newData: ProjectInputData)
    {
        if(newData == null)
            return;
        
        if(newData.name != null)
            this.name = newData.name;

        await this.save();
    }
}



// Handles getting all input data correctly from a Request
export class ProjectInputData
{
    name: string | undefined = "";

    constructor(req: Request)
    {
        if(req == null)
            return;

        try
        {
            this.name = this.GetString("name", req);
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
        Validator.Validate(this.name, "Name", Validator.NotEmptyString);

        return Validator.IsValid();
    }    
}



Project.init(
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
        allowNull: false
    }
},
{
    sequelize, 
    modelName: "Project",
    tableName: "Projects",  // this can be omitted, as the name will automatically be made the plural version of the modelName
    timestamps: false, // I don't care when the records were created or updated 
    underscored: true
});

export default {Project, ProjectInputData};

Project.hasMany(Task, {foreignKey: "projectId"}); // a project can have many tasks
Task.belongsTo(Project);
