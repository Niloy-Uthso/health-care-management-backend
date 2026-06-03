import { Request, Response } from "express";
import { doctorService } from "./doctor.server";
import AppError from "../../errorHandlers/handleErrors";
 
const getAlldoctors = async (req:Request,res:Response)=>{
    try{
         const doctors = await doctorService.getAllDoctors();
    res.status(200).json(doctors);

    }catch(e){
        console.error("Error fetching doctors:", e);
        res.status(500).json({ error: "An error occurred while fetching doctors.",e });
    }
}

const getDoctorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
 
        const doctor = await doctorService.getDoctorById(id as string);
        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (e) {
        console.error("Error fetching doctor:", e);
        if (e instanceof AppError) {
            res.status(e.statusCode).json({ error: e.message });
        } else {
            res.status(500).json({ error: "An error occurred while fetching the doctor." });
        }
    }
}

const updateDoctor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const result = await doctorService.updateDoctor(id as string, updateData);
        res.status(200).json(result);
    } catch (e) {
        console.error("Error updating doctor:", e);
        if (e instanceof AppError) {
            res.status(e.statusCode).json({ error: e.message });
        } else {
            res.status(500).json({ error: "An error occurred while updating the doctor." });
        }
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
    softDeleteDoctor,
    getDoctorById,
    updateDoctor
}