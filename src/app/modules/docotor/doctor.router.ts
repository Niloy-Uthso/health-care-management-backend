import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { updateDoctorZodSchema } from "./doctor.validation";

const router = Router();

router.get("/alldoctors",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),doctorController.getAlldoctors)
router.get("get-individual-doctor/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), doctorController.getDoctorById);
router.patch("update-individual-doctor/:id", validateRequest(updateDoctorZodSchema),checkAuth(Role.ADMIN,Role.SUPER_ADMIN), doctorController.updateDoctor);
router.delete("/softdelete/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),doctorController.softDeleteDoctor)



export const doctorRoute = router;