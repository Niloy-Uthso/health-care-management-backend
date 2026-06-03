import { Request, Response } from "express";
import { Role, Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";
import AppError from "../../errorHandlers/handleErrors";
import status from "http-status";

/*
model Doctor{
  id String @id @default(uuid(7))
  name  String
  email String @unique
  contactNumber String?
  address String?
  isDeleted Boolean @default(false)
  deletedAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  registrationNumber String @unique
  experienceYears Int @default(0)
  gender String?
  appointmentFee Float
  qualifications String
  currentHospital String
  designation String
  averageRating Float @default(0.0)

   userId String @unique
  user User @relation(fields: [userId], references: [id], onDelete: Cascade,onUpdate: Cascade)
   doctorSpecialties DoctorSpecialty[]

  @@index([email],name:"idx_doctor_email")
  @@index([isDeleted],name:"idx_doctor_isdeleted")
  @@map("doctor")
}


*/ 

interface createDoctorPayload {
     password: string;
     doctor: {
         name: string;
        email: string;
        contactNumber?: string;
        address?: string;
        registrationNumber: string;
        experienceYears: number;
        gender?: string;
        appointmentFee: number;     
        qualifications: string;      
        currentHospital: string;     
        designation: string;  

     }
     specialties: string[]; // Array of specialty IDs
    
}
 const createDoctor = async (payload: createDoctorPayload) => {
    const specialties: Specialty[] = [];

    for (const specialtyId of payload.specialties) {
        const specialtyRecord =
            await prisma.specialty.findUnique({
                where: { id: specialtyId }
            });

        if (!specialtyRecord) {
            // throw new Error(
            //     `Specialty with id ${specialtyId} not found`
            // );
            throw new AppError(status.NOT_FOUND, `Specialty with id ${specialtyId} not found`)
        }

        specialties.push(specialtyRecord);
    }

    const userExists = await prisma.user.findUnique({
        where: {
            email: payload.doctor.email
        }
    });

    if (userExists) {
        // throw new Error(
        //     "User with this email already exists"
        // );
        throw new AppError(status.BAD_REQUEST, "User with this email already exists")
    }

    const userData = await auth.api.signUpEmail({
        body: {
            name: payload.doctor.name,
            email: payload.doctor.email,
            password: payload.password,
            role: Role.DOCTOR,
            needPasswordChange: true
        }
    });

    try {
        const result =
            await prisma.$transaction(async (tx) => {

                const doctorData =
                           await tx.doctor.create({
                        data: {
                            userId: userData.user.id,
                            ...payload.doctor
                        }
                    });

                const doctorSpecialtyData =
                    specialties.map((specialty) => ({
                        doctorId: doctorData.id,
                        specialtyId: specialty.id
                    }));

                await tx.doctorSpecialty.createMany({
                    data: doctorSpecialtyData
                });
                           const doctor= await tx.doctor.findUnique({
                            where: {
                                id:doctorData.id
                            },
                            select:{
                                id:true,
                                name:true,
                                email:true, 
                                contactNumber:true,
                                address:true,
                                registrationNumber:true,
                                experienceYears:true,
                                qualifications:true,
                                currentHospital:true,
                                designation:true,
                                user:{
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        status: true,
                                        role: true,
                                        createdAt: true,
                                        updatedAt: true,
                                        isDeleted: true,
                                        deletedAt: true
                                    }
                                },
                                doctorSpecialties:{
                                    select:{
                                        specialty:{
                                            select:{
                                                id:true,
                                                title:true
                                            }
                                        }
                                    }
                                }
                            }
                           })
                           return doctor;
                 
            });

        return result;

    } catch (error) {
        console.log("Transaction failed", error);

        await prisma.user.delete({
            where: {
                id: userData.user.id
            }
        });

        throw error;
    }


};

export const userService = {
    createDoctor
}