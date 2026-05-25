import { Role, User } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
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
        throw new Error("User registration failed");
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

    return {
        ...createdUser,
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
        return LoginResult;
    }

export const AuthService = {
    registerPatient,
    loginPatient
}