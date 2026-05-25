import { Request, Response } from "express";
import { SpecialtyService } from "./specialty.service";

const createSpecialty = async(req: Request, res: Response) =>{

    const payload = req.body
    const result = await SpecialtyService.createSpecialty(payload)
    res.status(201).json(result)
}

const getAllSpecialties = async(req: Request, res: Response) =>{

    const result = await SpecialtyService.getAllSpecialties()

    res.status(201).json({
        success: true,
        message:"Specialties retrieved successfully",
        data:result
    })
}

const deleteSpecialty = async(req: Request, res: Response) =>{
    const {id}= req.params
    const result =await SpecialtyService.deleteSpecialty(id as string)
     res.status(201).json({
        success: true,
        message:"Specialties deleted successfully",
        data:result
    })
}

export const SpecialtyController = {
    createSpecialty,
    getAllSpecialties,
    deleteSpecialty

}