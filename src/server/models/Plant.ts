import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeInstance"; 
import { Validator } from "./Validator";
import { Request } from "express";


export class Plant extends Model 
{
    declare id: number; 
    declare label: string;
    declare species: string;
    declare plantDate: string;
    declare waterSchedule: number;
    declare lastWaterDate: string;   
    declare notes: string; 

    
    
    // for whatever reason, the timezone is not correct when we import the dates, so the day is off by one. This hacky fix should be fine in the eastern time-zone
    FixDates()
    {
        this.plantDate = this.IncreaseDayByOne(this.plantDate);
        this.lastWaterDate = this.IncreaseDayByOne(this.lastWaterDate);
    }



    IncreaseDayByOne(rawDate: string): string
    {
        var date = new Date(rawDate);
        date.setDate(date.getDate() + 1);

        return date.toString();
    }



    // We use this method so that handlebars can correctly access the data (it can't access inherited members by default).
    // We can also perform some formatting things here.
    // This method returns plain data that handlebars can access
    GetAllHandlebarData()
    {
        const data = 
        {            
            id: this.id,
            label: this.label,
            species: this.species,
            plantDate: new Date(this.plantDate).toLocaleDateString(), // format will be dd/mm/yyyy
            waterSchedule: this.ToWaterScheduleString(this.waterSchedule),
            waterScheduleInt: this.waterSchedule,
            lastWaterDate: new Date(this.lastWaterDate).toLocaleDateString(),
            notes: this.notes,
            needsWater: this.DoesNeedWater()
        }
        return data;
    }
    


    // watering schedule is stored as a number, but it's better if the users see it as text
    ToWaterScheduleString(schedule: number): string
    {
        if(schedule <= 1)
            return "Daily";
        else if(schedule <= 2)
            return "Every Other Day";
        else if(schedule <= 7)
            return "Weekly";
        else if(schedule <= 14)
            return "Bi-Weekly";
        else
            return "Other";
    } 



    // The same as GetAllHandlbarData, but dates are formatted such that they'll populate correctly in the date input fields 
    GetAllHandlebarDataForEdit()
    {
        const data = this.GetAllHandlebarData();
        
        data.plantDate = this.ToInputSafeDate(data.plantDate);
        data.lastWaterDate = this.ToInputSafeDate(data.lastWaterDate);
        data.waterScheduleInt = this.waterSchedule;

        return data;
    }



    ToInputSafeDate(date: string): string
    {
        const asDate = new Date(date);
        
        const year = asDate.getFullYear();
        const month = String(asDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(asDate.getDate()).padStart(2, '0');
          
        return year + "-" + month + "-" + day;     
    }



    // returns true if too many days have elapsed since the last water date
    DoesNeedWater(): boolean
    {
        const lastWaterDate: Date = new Date(this.lastWaterDate);
        const lateDate: Date = new Date(this.lastWaterDate);
        lateDate.setDate(lastWaterDate.getDate() + this.waterSchedule);

        return new Date() >= lateDate;
    }



    // Updates this instance with data from newData, then invokes save
    async UpdateWith(newData: PlantInputData)
    {
        if(newData == null)
            return;

        this.label = newData.plantLabel;
        this.species = newData.species;
        this.plantDate = newData.plantDate;
        this.lastWaterDate = newData.lastWaterDate;
        this.waterSchedule = newData.wateringSchedule;
        this.notes = newData.notes;

        await this.save();
    }
}



// Handles getting all input data correctly from a Request
export class PlantInputData
{
    plantLabel: string = "";
    species: string = "";
    plantDate: string = "";
    wateringSchedule: number = 0;
    lastWaterDate: string = "";
    notes: string = "";

    constructor(req: Request)
    {
        if(req == null)
            return;

        try
        {
            this.plantLabel = this.GetString("plantLabel", req);
            this.species = this.GetString("species", req);
            this.plantDate = this.GetString("plantDate", req);
            this.wateringSchedule = parseInt(this.GetString("wateringSchedule", req));
            this.lastWaterDate = this.GetString("lastWaterDate", req);
            this.notes = this.GetString("notes", req); 
            if(this.notes == null)
                this.notes = "";  
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
        Validator.Validate(this.plantLabel, "Label", Validator.NotEmptyString);
        Validator.Validate(this.species, "Species", Validator.NotEmptyString);
        Validator.Validate(this.plantDate, "Plant Date", Validator.ValidateDate);
        Validator.Validate(this.lastWaterDate, "Last Water Date", Validator.ValidateDate);
        Validator.Validate(this.wateringSchedule, "Watering Schedule", Validator.ValidateNonZeroPositiveNumber);
        // notes is not validated, because it can be blank

        return Validator.IsValid();
    }    
}



Plant.init(
{
    id: 
    {
        type: DataTypes.INTEGER,
        autoIncrement: true, // The ID will automatically increment when a new record is created
        primaryKey: true, 
    },    
    label: 
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    species:
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    plantDate:
    {
        type: DataTypes.DATE,
        allowNull: false
    },
    waterSchedule:
    {
        type: DataTypes.NUMBER
    },
    lastWaterDate:
    {
        type: DataTypes.DATE,
        allowNull: false
    },
    notes:
    {
        type: DataTypes.STRING,
        allowNull: true
    }
},
{
    sequelize, 
    modelName: "Plant",
    tableName: 'Plants',  // this can be omitted, as the name will automatically be made the plural version of the modelName
    timestamps: false, // I don't care when the records were created or updated 
    underscored: true
});

export default {Plant, PlantInputData};
