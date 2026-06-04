import { Request, Response } from "express";
import { AuthService } from "./auth.server";
import { TokenUtils } from "../../utils/token";
import { catchAsync } from "../../shared/catchAsync";
import { ref } from "node:process";
import { JwtUtils } from "../../utils/jwt";
import { envVars } from "../../../config/env";
import AppError from "../../errorHandlers/handleErrors";
import status from "http-status";
import { CookieUtils } from "../../utils/cookie";
import { success } from "zod";

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

    const getMe = catchAsync(async (req: Request, res: Response) => {
    
    const user = req.user;
    const result = await AuthService.getMe(user);
    
    res.status(200).json({
        message: "User fetched successfully",
        data: result
    });
    
})

const getNewToken =  catchAsync(
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        const betterAuthSsssion = req.cookies['better-auth.session_token'];
        if(!refreshToken){
            throw new AppError(status.UNAUTHORIZED, "No refresh token provided")
        }

        const result = await AuthService.getNewToken(refreshToken,betterAuthSsssion);
        const {accessToken,refreshToken:newRefreshToken, sessionToken}= result;

        TokenUtils.setAccessTokenCookie(res,accessToken);
        TokenUtils.setRefreshTokenCookie(res,newRefreshToken);
        TokenUtils.setBetterAuthSessionCookies(res,sessionToken);

        res.status(200).json({
            message: "New access token generated successfully",
            accessToken,
            refreshToken:newRefreshToken,
                sessionToken: sessionToken

    })
}
)

const changePassword = catchAsync(
    async(req:Request,res:Response)=>{
        const payload = req.body
        const betterAuthSessionToken= req.cookies["better-auth.session_token"]
 
const result = await AuthService.changePassword(payload,betterAuthSessionToken);

const {accessToken,refreshToken,token}=result;

TokenUtils.setAccessTokenCookie(res,accessToken)
TokenUtils.setRefreshTokenCookie(res,refreshToken)
TokenUtils.setBetterAuthSessionCookies(res,token as string)

res.status(200).json({
    success:true,
    message:"Password changed successfully",
     data: result
})


    }
)

const logOutUser = catchAsync(
    async(req:Request,res:Response)=>{

        const betterAuthSessionToken=req.cookies["better-auth.session_token"];

        const result = await AuthService.logOutUser(betterAuthSessionToken)

        CookieUtils.clearCookie(res,'accessToken',{
            httpOnly:true,
            secure:true,
            sameSite:"none"
        })
        CookieUtils.clearCookie(res,'refreshToken',{
            httpOnly:true,
            secure:true,
            sameSite:"none"
        })
        CookieUtils.clearCookie(res,'better-auth.session_token',{
            httpOnly:true,
            secure:true,
            sameSite:"none"
        })

        res.status(200).json({
            success:true,
            message:"Logout Successful",
            data:result
        })
    }
)

const verifyEmail = catchAsync(
    async(req:Request,res:Response)=>{
        const{email,otp}=req.body;

        const result= await AuthService.verifyEmail(email,otp);
    
        res.status(200).json({
            success:true,
            message:"Email verified successfully",
            data:result
        })
    }
)

const forgetPassword= catchAsync(
    async(req:Request,res:Response)=>{
        const {email}=req.body;

        await AuthService.forgetPassword(email);

        res.status(200).json({
            success:true,
            message:"Password reset otp sent successfully",

        })

    }
)

const resetPassword =  catchAsync(
    async(req:Request,res:Response)=>{
        const {email,otp,newPassword}=req.body
        await AuthService.resetPassword(email,otp,newPassword)
   
        res.status(200).json({
            success:true,
            message:"Password reset successfully"
        })
    }
)

const googleLogin = catchAsync(
    async(req:Request,res:Response)=>{

    }
)

const  googleLoginSuccess = catchAsync(
    async(req:Request,res:Response)=>{

    }
)

const  handleOAuthError = catchAsync(
    async(req:Request,res:Response)=>{

    }
)




export const AuthController = {
    regesterPatient,
    loginPatient,
    getMe,
    getNewToken,
    changePassword,
    logOutUser,
    verifyEmail,
    resetPassword,
    forgetPassword,
    googleLogin,
    googleLoginSuccess,
    handleOAuthError

}