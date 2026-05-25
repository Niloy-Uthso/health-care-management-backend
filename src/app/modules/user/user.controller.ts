import  { Request, Response } from "express";
import { userService } from "./user.server";

const createDoctor = async (req:Request,res:Response) => {
try{
     const payload = req.body;
     const result = await userService.createDoctor(payload);
     res.status(201).json({
        message:"Doctor Created Successfully",
        data:result
     })
}catch(error){
    res.status(500).json({message:"Internal Server Error",
        error
    }) 
}

}

export const userController = {
    createDoctor
}