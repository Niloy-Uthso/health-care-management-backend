import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();


router.post("/register", AuthController.regesterPatient)
router.post("/login", AuthController.loginPatient)
router.get("/me",checkAuth(Role.ADMIN,Role.DOCTOR,Role.PATIENT,Role.SUPER_ADMIN), AuthController.getMe)
router.post("/refresh-token",AuthController.getNewToken)

export const AuthRouter=router;
