/* eslint-disable @typescript-eslint/no-explicit-any */
import {  Router } from "express";
import { SpecialtyController } from "./specialty.controller";
  
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post('/',checkAuth(Role.ADMIN,Role.SUPER_ADMIN), SpecialtyController.createSpecialty)
router.get('/', checkAuth(Role.ADMIN,Role.DOCTOR,Role.SUPER_ADMIN), SpecialtyController.getAllSpecialties)
router.delete('/:id', checkAuth(Role.SUPER_ADMIN,Role.ADMIN) ,SpecialtyController.deleteSpecialty)



export const SpecialtyRoute = router