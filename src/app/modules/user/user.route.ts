import { userController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createDoctorZodSchema } from "./user.validation";
import { Router } from "express";
  

const router= Router();



router.post("/create-doctor",validateRequest(createDoctorZodSchema),userController.createDoctor);

export const userRoute = router;
