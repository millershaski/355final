import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeInstance"; 
import { Validator } from "./Validator";
import { Request } from "express";
import { Project } from "./Project";


export class Task extends Model 
{
    declare id: number; 

    declare name: string;
    declare description: string;
    declare dueDate: Date;
    declare isComplete: boolean;

    declare assigneeId: number;
    declare projectId: number;

    declare parentTaskId: number; // <= 0 is null
    declare allSubtasks: number[]; // order stored and can be changed by user
    

    // We use this method so that handlebars can correctly access the data (it can't access inherited members by default).
    // We can also perform some formatting things here.
    // This method returns plain data that handlebars can access
    async GetAllHandlebarData_async()
    {
        let data = 
        {            
            id: this.id,
            name: this.GetFixedName(),
            description: this.description,
            dueDate: this.ToInputSafeDate(this.dueDate),
            isComplete: this.isComplete,
            assigneeInitials: "+",

            parentTaskId: this.parentTaskId,
            allSubtasks: this.allSubtasks
        }

        let user = null;
        if(this.assigneeId > 0)
        {
            user = await User.findByPk(this.assigneeId);
            if(user != null)
                data.assigneeInitials = user.GetInitials();
        }

        const allSubtasks = await (this as any).getTasks();
        let allSubtaskData = [];
        for(const someSubtask of allSubtasks)
        {
            const subtaskData = await someSubtask.GetAllHandlebarData_async();
            allSubtaskData.push(subtaskData);
        }
        data.allSubtasks = allSubtaskData;

        return data;
    }
    


    // prevents empty names or names of only whitespace
    GetFixedName(): string
    {
        if(this.name.length == 0 || /^\s*$/.test(this.name) == true) // empty string or the amount of whitespace is equal to the length (it's all whitespace)
            return "[No Name]";
        else
            return this.name;
    }



    ToInputSafeDate(date: Date): string
    {        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
          
        return year + "-" + month + "-" + day;     
    }



    // Updates this instance with data from newData, then invokes save
    async UpdateWith(newData: TaskInputData)
    {
        console.log("Updating task " + this.id + " with: " + JSON.stringify(newData));

        if(newData == null)
            return;
        
        if(newData.name != null)
            this.name = newData.name;

        if(newData.description != null)
            this.description = newData.description;

        if(newData.dueDate != null)
            this.dueDate = newData.dueDate;
        
        if(newData.isComplete != null)
            this.isComplete = newData.isComplete;

        if(newData.parentTaskId != null)
            this.parentTaskId = newData.parentTaskId;

        if(newData.assigneeId != null)
            this.assigneeId = newData.assigneeId;
        
        // this.allSubtasks = newData.allSubtasks;

        await this.save();
    }



    // for whatever reason, the timezone is not correct when we import the dates, so the day is off by one. This hacky fix should be fine in the eastern time-zone
    FixDates()
    {
        // this.dueDate = this.IncreaseDayByOne(this.dueDate);
    }



    IncreaseDayByOne(rawDate: Date): Date
    {
        let date = new Date(rawDate);
        
        date.setDate(date.getDate() + 1);
        return date;
    }
}



// Handles getting all input data correctly from a Request
export class TaskInputData
{
    name: string|undefined = "";
    description: string|undefined = "";
    dueDate: Date|undefined = new Date();
    isComplete: boolean|undefined = false;
    assigneeId: number|undefined = 0;
    
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
            this.dueDate = this.GetDate("dueDate", req);
            this.isComplete = this.GetAny("isComplete", req);
            this.assigneeId = this.GetAny("assigneeId", req);

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
    GetString(key: string, req: Request): string | undefined
    {
        if(req.body.hasOwnProperty(key) == false)
            return undefined;
    
        return req.body[key];
    }



    GetDate(key: string, req: Request): Date | undefined
    {
        const stringValue = this.GetString(key, req);

        if(stringValue)
        {           
            const [year, month, day] = stringValue.split('-');
            return new Date(Number(year), Number(month) - 1, Number(day));
        }       
        else
            return undefined;
    }



    // Separate method so that we can sanitize if we need to (not implemented)
    GetAny(key: string, req: Request): any
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
    assigneeId:
    {
        type: DataTypes.NUMBER,
        allowNull: true,
        references:
        {
            model: "Users",
            key: "id"
        }
    },
    parentTaskId:
    {
        type: DataTypes.NUMBER,
        allowNull: true,
        references: 
        {
            model: "Tasks",
            key: "id"
        }
    },
    projectId:
    {
        type: DataTypes.NUMBER,
        allowNull: true, // all high-level tasks must belong to a project, but subtasks don't have this constraint
        references:
        {
            model: "Projects",
            key: "id"
        }
    },
    allSubtasks:
    {
        type: DataTypes.JSON,
        allowNull: true,
    }

},
{
    sequelize, 
    modelName: "Task",
    tableName: "Tasks",  // this can be omitted, as the name will automatically be made the plural version of the modelName
    timestamps: false, // I don't care when the records were created or updated 
    underscored: true
});

export default {Task, TaskInputData};

import {User} from "./User";



Task.hasMany(Task, {foreignKey: "parentTaskId"}); // tasks can have many subtasks
Task.hasOne(Task); // a task can have only a single parent task 


User.hasMany(Task, {foreignKey: "assigneeId"}); // a user can have many tasks
Task.belongsTo(User);
