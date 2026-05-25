import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();


router.post("/register", AuthController.regesterPatient)
router.post("/login", AuthController.loginPatient)
export const AuthRouter=router;
