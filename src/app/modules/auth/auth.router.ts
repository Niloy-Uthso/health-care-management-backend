import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();


router.post("/register", AuthController.regesterPatient)
router.post("/login", AuthController.loginPatient)
router.get("/me",checkAuth(Role.ADMIN,Role.DOCTOR,Role.PATIENT,Role.SUPER_ADMIN), AuthController.getMe)
router.post("/refresh-token",AuthController.getNewToken)
router.post("/change-password",checkAuth(Role.ADMIN,Role.DOCTOR,Role.PATIENT,Role.SUPER_ADMIN),AuthController.changePassword)
router.post("/logOut",checkAuth(Role.ADMIN,Role.DOCTOR,Role.PATIENT,Role.SUPER_ADMIN),AuthController.logOutUser)
router.post("/verify-email",AuthController.verifyEmail)
router.post("/forgot-password",AuthController.forgetPassword)
router.post("/reset-password",AuthController.resetPassword)


router.get("/login/google",AuthController)
router.get("/google/success",AuthController)
router.get("/oauth/error",AuthController)

export const AuthRouter=router;
