/* eslint-disable @typescript-eslint/no-explicit-any */
import { success } from "better-auth"
import { prisma } from "../../lib/prisma"
import AppError from "../../errorHandlers/handleErrors"
import status from "http-status"
import { Gender } from "../../../generated/prisma/enums";

// interface doctorPayload{
//     name?: string
//     experience?: number
//     specialization?: string
//     email?: string
//     phone?: string
// }
export interface IUpdateDoctorSpecialtyPayload {
    specialtyId: string;
    shouldDelete?: boolean;
}
export interface IUpdateDoctorPayload {
    doctor?: {
        name?: string;
        profilePhoto?: string;
        contactNumber?: string;
        address?: string;
        experience?: number
        registrationNumber?: string;
        gender?: Gender;
        appointmentFee?: number;
        qualification?: string;
        currentWorkingPlace?: string;
        designation?: string;
    },
    specialties?: IUpdateDoctorSpecialtyPayload[];
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

const getDoctorById = async (id: string) => {
    const doctor = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            user: true,
            specialties: {
                include: {
                    specialty: true
                }
            },
            appointments: {
                include: {
                    patient: true,
                    schedule: true,
                    prescription: true,
                }
            },
            doctorSchedules: {
                include: {
                    schedule: true,
                }
            },
            reviews: true
        }
    })
    return doctor;
}

const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
    const isDoctorExist = await prisma.doctor.findUnique({
        where: {
            id,
        }
    })

    if (!isDoctorExist) {
        throw new AppError(status.NOT_FOUND, "Doctor not found");
    }

    const { doctor: doctorData, specialties } = payload;

    await prisma.$transaction(async (tx) => {
        if (doctorData) {
            await tx.doctor.update({
                where: {
                    id,
                },
                data: {
                    ...doctorData,
                }
            })
        }

        if (specialties && specialties.length > 0) {
            for (const specialty of specialties) {
                const { specialtyId, shouldDelete } = specialty;
                if (shouldDelete) {
                    await tx.doctorSpecialty.delete({
                        where: {
                            doctorId_specialtyId: {
                                doctorId: id,
                                specialtyId,
                            }
                        }
                    })
                } else {
                    await tx.doctorSpecialty.upsert({
                        where: {
                            doctorId_specialtyId: {
                                doctorId: id,
                                specialtyId,
                            }
                        },
                        create: {
                            doctorId: id,
                            specialtyId,
                        },
                        update: {}
                    })
                }
            }
        }
    })

    const doctor = await getDoctorById(id);

    return doctor;
}

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
        // throw new Error("Doctor not found");
        throw new AppError(status.NOT_FOUND, "Doctor not found")
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
    softDeleteDoctor,
    getDoctorById,
    updateDoctor
}