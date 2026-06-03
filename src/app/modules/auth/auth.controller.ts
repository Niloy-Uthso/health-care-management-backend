import { Request, Response } from "express";
import { AuthService } from "./auth.server";
import { TokenUtils } from "../../utils/token";

const regesterPatient = async (req:Request, res:Response) => {

    try{
         const result = await AuthService.registerPatient(req.body);

          const {accessToken,refreshToken,token,...rest}= result;


            TokenUtils.setAccessTokenCookie(res,accessToken);
            TokenUtils.setRefreshTokenCookie(res,refreshToken);
            TokenUtils.setBetterAuthSessionCookies(res,token as string);
            
        res.status(201).json({
            message: "Patient registered successfully",
            accessToken,
            refreshToken,
                ...rest
        });

    }
    catch(error){
        res.status(500).json({
            message: "Internal Server Error",
            error :error
        })
    }
}
const loginPatient = async (req:Request, res:Response) => {

    try{
            const result = await AuthService.loginPatient(req.body.email, req.body.password);
            const {accessToken,refreshToken,token,...rest}= result;


            TokenUtils.setAccessTokenCookie(res,accessToken);
            TokenUtils.setRefreshTokenCookie(res,refreshToken);
            TokenUtils.setBetterAuthSessionCookies(res,token);
            
            res.status(200).json({
               
                message: "Login successful",
                accessToken,
                refreshToken,
                 ...rest
            });
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error",
            error})
    }}
export const AuthController = {
    regesterPatient,
    loginPatient
}