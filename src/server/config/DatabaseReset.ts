import {sequelize} from "./SequelizeInstance";
import {Plant} from "../models/Plant";

export const ResetDatabase = async () => 
{
    console.log("Resetting database...");
    await sequelize.drop(); // Clears tables before sync
    await sequelize.sync();

    const plant1 = await Plant.create({id: 1, label: "Greenhouse Tomato", species: "Tomato", plantDate: Date.now(), waterSchedule: 1, lastWaterDate: Date.now(), notes: "Notes about plant1"}); // creating them in this manner seems easier
    const plant2 = await Plant.create({id: 2, label: "Backyard Corn", species: "Corn", plantDate: Date.now(), waterSchedule: 14, lastWaterDate: Date.now(), notes: "Notes about plant2"});
                
    console.log("...Done resetting database");
};