import { Request, Response } from "express";
import { doctorService } from "./doctor.server";
import { success } from "better-auth";

const getAlldoctors = async (req:Request,res:Response)=>{
    try{
         const doctors = await doctorService.getAllDoctors();
    res.status(200).json(doctors);

    }catch(e){
        console.error("Error fetching doctors:", e);
        res.status(500).json({ error: "An error occurred while fetching doctors.",e });
    }
}

const softDeleteDoctor = async (req:Request,res:Response)=>{
     try{
           const {id}=req.params
           const result = await doctorService.softDeleteDoctor(id as string)
           res.status(200).json({
            success : true,
            message:"Doctor deleted successfully",
            data:result
           })
     }catch(e){
        console.error("Error deleting doctor:", e);
        res.status(500).json({ error: "An error occurred while deleting doctor.",e });
     }
}

export const doctorController = {
    getAlldoctors,
    softDeleteDoctor
}