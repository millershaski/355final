import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeInstance"; 
import { Validator } from "./Validator";
import { Request } from "express";


export class Task extends Model 
{
    public id!: number; 

    public name!: string;
    public description!: string;
    public dueDate!: Date;
    public isComplete!: boolean;

    public parentTaskId!: number; // <= 0 is null
    public allSubtasks!: number[]; // order stored and can be changed by user


    // We use this method so that handlebars can correctly access the data (it can't access inherited members by default).
    // We can also perform some formatting things here.
    // This method returns plain data that handlebars can access
    GetAllHandlebarData()
    {
        const data = 
        {            
            id: this.id,
            name: this.name,
            description: this.description,
            dueDate: this.dueDate,
            isComplete: this.isComplete,

            parentTaskId: this.parentTaskId,
            allSubtasks: this.allSubtasks
        }
        return data;
    }
    


    // Updates this instance with data from newData, then invokes save
    async UpdateWith(newData: TaskInputData)
    {
        if(newData == null)
            return;
        
        this.name = newData.name;
        this.description = newData.description;
        this.dueDate = newData.dueDate;
        this.isComplete = newData.isComplete;

        this.parentTaskId = newData.parentTaskId;
        this.allSubtasks = newData.allSubtasks;

        await this.save();
    }
}



// Handles getting all input data correctly from a Request
export class TaskInputData
{
    name: string = "";
    description: string = "";
    dueDate: Date = new Date();
    isComplete: boolean = false;

    parentTaskId: number = 0;
    allSubtasks: number[] = [];


    constructor(req: Request)
    {
        if(req == null)
            return;

        try
        {
            this.name = this.GetString("name", req);
            this.description = this.GetString("description", req);
            this.dueDate = new Date(this.GetString("dueDate", req));
            this.isComplete = this.GetString("isComplete", req) == "T";

            this.parentTaskId = this.GetAny("parentTaskId", req);
            this.allSubtasks = this.GetAny("allSubtasks", req);
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


    // Separate method so that we can sanitize if we need to (not implemented)
    GetAny(key: string, req: Request): any
    {
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



Task.init(
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
    },
    description:
    {
        type: DataTypes.STRING,
        allowNull: true   
    },
    dueDate:
    {
        type: DataTypes.DATE,
        allowNull: true
    },
    isComplete:
    {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    parentTaskId:
    {
        type: DataTypes.NUMBER,
        allowNull: true,
        references: 
        {
            model: 'Tasks',
            key: 'id'
        }
    },
    allSubtasks:
    {
        type: DataTypes.JSON,
        allowNull: true
    }

},
{
    sequelize, 
    modelName: "Task",
    tableName: 'Tasks',  // this can be omitted, as the name will automatically be made the plural version of the modelName
    timestamps: false, // I don't care when the records were created or updated 
    underscored: true
});

export default {Task, TaskInputData};

import {User} from "./User";



Task.hasOne(Task, {foreignKey: "parentTaskId"}); // a task can have only a single parent task 
Task.hasMany(Task); // tasks can have many subtasks


Task.belongsTo(User); // a task can be assigned to a user
User.hasMany(Task); // a user can have many tasks


