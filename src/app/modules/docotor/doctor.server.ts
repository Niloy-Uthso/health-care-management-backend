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

const deleteDoctor = async (id:string) => {

    try{
    const result = await prisma.$transaction(async(tx)=>{
        await tx.doctor.delete({
            where:{
                id:id
            }
        })
    })

    }
    catch(e){
        console.log("djhkfh",e)
    }
}

export const doctorService = {
    getAllDoctors
}