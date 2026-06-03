import status from "http-status";
import { Role, User, userStatus } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHandlers/handleErrors";
import { TokenUtils } from "../../utils/token";
import { get } from "node:http";
import { IRequestUser } from "../../Interfaces/requestUser.interface";
import { JwtUtils } from "../../utils/jwt";
import { envVars } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { access } from "node:fs";
interface RegisterPatientPayload {
    name: string;
    email: string;
    password: string;
}
const registerPatient = async (payload: RegisterPatientPayload)=>{
    const {name,email,password} = payload;
    const createdUser = await auth.api.signUpEmail({
        body:{
            name,
            email,
            password,
            

        }
    })  

    if(!createdUser.user){
        // throw new Error("User registration failed");
        throw new AppError(status.BAD_REQUEST, "User registration failed")
    }
try{

    const patient = await prisma.$transaction(async (tx) => {
     
      const patientTx=   await tx.patient.create ({
                  data:{
                    userId: createdUser.user.id,
                    name: name,
                    email: email,
                     
                  }
         })
         return patientTx;
    })

    
        const accessToken = TokenUtils.getAccessToken({
            userId: createdUser.user.id,
            role: createdUser.user.role,
                email: createdUser.user.email,
                name: createdUser.user.name,
                status:  createdUser.user.status,
                isDeleted: createdUser.user.isDeleted,
                emailVerified: createdUser.user.emailVerified

        });

        const refreshToken = TokenUtils.getRefreshToken({
            userId: createdUser.user.id,
            role: createdUser.user.role,
                email: createdUser.user.email,
                name: createdUser.user.name,
                status: createdUser.user.status,
                isDeleted: createdUser.user.isDeleted,
                emailVerified: createdUser.user.emailVerified
        });

    return {
        ...createdUser,
            accessToken,
            refreshToken,
       ...patient
    }
}catch(error){
console.log("transaction failed",error);
await prisma.user.delete({
    where:{
        id: createdUser.user.id
    }
})
throw error;
}
    
}

 const loginPatient = async( email: string,password: string)=>{
        const LoginResult = await auth.api.signInEmail({
            body:{
                email,
                password
            }
        })
        if(LoginResult.user.status=== userStatus.SUSPENDED || LoginResult.user.status === userStatus.DELETED){
            throw new AppError(status.FORBIDDEN, "Your account is not active. Please contact support.")
        }

        const accessToken = TokenUtils.getAccessToken({
            userId: LoginResult.user.id,
            role: LoginResult.user.role,
                email: LoginResult.user.email,
                name: LoginResult.user.name,
                status: LoginResult.user.status,
                isDeleted: LoginResult.user.isDeleted,
                emailVerified: LoginResult.user.emailVerified

        });

        const refreshToken = TokenUtils.getRefreshToken({
            userId: LoginResult.user.id,
            role: LoginResult.user.role,
                email: LoginResult.user.email,
                name: LoginResult.user.name,
                status: LoginResult.user.status,
                isDeleted: LoginResult.user.isDeleted,
                emailVerified: LoginResult.user.emailVerified
        });

         return {
            ...LoginResult,
            accessToken,
            refreshToken
         };
    }

    const getMe = async (user : IRequestUser) => {

        const isUserExist = await prisma.user.findUnique({
            where: {
                id: user.userId,    
            },
            include: {
                patient: {
                    include:{
                        appointments: true,
                        reviews: true,
                        prescriptions: true,
                        medicalReports: true,
                        patientHealthData: true,
                    }
                },
                doctor: {
                    include:{
                        doctorSpecialties: true,
                        appointments: true,
                        reviews: true,
                        prescriptions: true,

                    }
                },
                admin: true
            }
        })

        if(!isUserExist){
            throw new AppError(status.NOT_FOUND, "User not found");
        }
        return isUserExist;

    }

    const getNewToken = async (refreshToken:string,sessionToken:string) => {
         const isSessionValid = await prisma.session.findUnique({

            where:{
                token: sessionToken,
               
            },
            include:{
                user:true
            }
        })

        if(!isSessionValid){
            throw new AppError(status.UNAUTHORIZED, "Invalid session. Please login again.")
        }


    const verifiedRefreshToken = JwtUtils.verifyToken(refreshToken,envVars.REFRESH_TOKEN_SECRET)

    if(!verifiedRefreshToken.success && verifiedRefreshToken.error){
        throw  new AppError(status.UNAUTHORIZED, "Invalid refresh token")
    }

           const  data= verifiedRefreshToken.data as JwtPayload ;
           
           const newAccessToken = TokenUtils.getAccessToken({
            userId: data.userId,
            role:  data.role,
                email: data.email,
                name: data.name,
                status: data.status,
                isDeleted: data.isDeleted,
                emailVerified: data.emailVerified

        });

        const newRefreshToken = TokenUtils.getRefreshToken({
                userId: data.id,
                role: data.role,
                email: data.email,
                name: data.name,
                status: data.status,
                isDeleted: data.isDeleted,
                emailVerified: data.emailVerified
        });

        const {token}= await prisma.session.update({
            where:{
                token:sessionToken

            },
            data:{
                token:sessionToken,
                expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000), // 1 hour
                updatedAt: new Date()
            }
        })

        return{
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            sessionToken: token
        }

    }

export const AuthService = {
    registerPatient,
    loginPatient,
    getMe,
    getNewToken
}