import { Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

 
const createSpecialty = async(payload: Specialty) : Promise<Specialty> =>{

    try{
 const specialty = await prisma.specialty.create({
        data:payload
    })

    return specialty
    }
    catch(e){
        console.error("Error creating specialty:", e);
    }
   
} 

const getAllSpecialties = async()=>{
  try{
      const specialties = await prisma.specialty.findMany()
    return specialties
  }
  catch(e){
    console.error("Error retrieving specialties:", e);
  }
}

const deleteSpecialty = async(id: string) => {
    try{
const deleteUser = await prisma.specialty.delete({
    where:{
        id:id
    }
})

return deleteUser
    }
    catch(e){
        console.error("Error deleting specialty:", e);
    }
}



export const SpecialtyService={
    createSpecialty,
    getAllSpecialties,
    deleteSpecialty
}