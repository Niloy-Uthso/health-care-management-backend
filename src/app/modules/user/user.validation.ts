import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export  const createDoctorZodSchema =  z.object({
     password :z.string("Password is required").min(6).max(20),
     doctor: z.object({
     name:z.string("Name is required").min(3).max(25),
     email:z.email("Valid email is required"),
     contactNumber:z.string("Contact number is required").min(10).max(15),
     address:z.string("Address is required").min(5).max(100).optional(),
     registrationNumber:z.string("Registration number is required"),
     experience:z.int("Experience is required").min(0).max(5).optional(),
     gender:z.enum([Gender.FEMALE,Gender.MALE], "Gender must be either 'FEMALE' or 'MALE'"),
     appointmentFee:z.number("Appointment fee is required").min(0).optional(),
     qualifications:z.string("Qualification is required").min(2).max(50).optional(),
     currentHospital:z.string("Current workplace is required").min(2).max(50).optional(),
     designation:z.string("Designation is required").min(2).max(50).optional(),
    }),
    specialties: z.array(z.uuid(),"Specialties must be an array of UUIDs").min(1,"at least 1 is needed ")

   
})