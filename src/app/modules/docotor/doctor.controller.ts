import { Request, Response } from "express";
import { doctorService } from "./doctor.server";

const getAlldoctors = async (req:Request,res:Response)=>{
    try{
         const doctors = await doctorService.getAllDoctors();
    res.status(200).json(doctors);

    }catch(e){
        console.error("Error fetching doctors:", e);
        res.status(500).json({ error: "An error occurred while fetching doctors.",e });
    }
}

export const doctorController = {
    getAlldoctors
}