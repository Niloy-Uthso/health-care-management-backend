import { success } from "better-auth"
import { prisma } from "../../lib/prisma"

interface doctorPayload{
    name?: string
    experience?: number
    specialization?: string
    email?: string
    phone?: string
}

const getAllDoctors = async () => {
    try{
        const doctors = await prisma.doctor.findMany({
            include:{
                user:true,
                doctorSpecialties:{
                    include:{
                        specialty:true
                    }
                }
            }
        })

        return doctors
    }

catch(e){
    console.error("Error fetching doctors:", e);
    throw e;
}}

const softDeleteDoctor = async (id:string) => {

    try{
    const result = await prisma.$transaction(async(tx)=>{
       const doctor = await tx.doctor.findUnique({
        where:{
            id:id
        },
        select:{
            userId:true
        }
        
       })
       if(!doctor){
        throw new Error("Doctor not found");
       }

       const updatedDoctor = await tx.doctor.update({
        where:{
            id:id
        },
        data:{
            isDeleted:true,
            deletedAt:new Date()
        }

       })
       await tx.user.update({
        where:{
            id:doctor.userId
        },
        data:{
            isDeleted:true,
            deletedAt:new Date(),
            status:"DELETED"
        }
       })
       return {
        success : true,
        message:"Doctor deleted successfully",
        data:updatedDoctor
       }
    })
        return result;
    }
    catch(e){
        console.error("Error deleting doctor:", e);
        throw e;
    }
}

export const doctorService = {
    getAllDoctors,
    softDeleteDoctor
}