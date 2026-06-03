import status from "http-status";
import { Role, User, userStatus } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHandlers/handleErrors";
import { TokenUtils } from "../../utils/token";
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

export const AuthService = {
    registerPatient,
    loginPatient
}