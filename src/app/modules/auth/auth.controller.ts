import { Request, Response } from "express";
import { AuthService } from "./auth.server";

const regesterPatient = async (req:Request, res:Response) => {

    try{
         const result = await AuthService.registerPatient(req.body);
        res.status(201).json(result);
    }
    catch(error){
        res.status(500).json({
            message: "Internal Server Error",
            error 
        })
    }
}
const loginPatient = async (req:Request, res:Response) => {

    try{
            const result = await AuthService.loginPatient(req.body.email, req.body.password);
            res.status(200).json(result);
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error",
            error})
    }}
export const AuthController = {
    regesterPatient,
    loginPatient
}