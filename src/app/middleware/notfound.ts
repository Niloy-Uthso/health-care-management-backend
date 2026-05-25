import { Request, Response } from "express";
import status from "http-status";

export const notfound = (req:Request,res:Response)=>{
res.status(status.NOT_FOUND).json({message:"Not Found"});   
}

