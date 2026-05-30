import { NextFunction, Request, Response } from "express";
import z from "zod";

export const validateRequest = (ZodSchema:z.ZodObject)=>{
return (req:Request,res:Response,next:NextFunction)=>{
    const parseResult = ZodSchema.safeParse(req.body);
    if (!parseResult.success) {
        next(parseResult.error);
    }
    req.body = parseResult.data;
    next();
}
}