import { Router } from "express";
import { doctorController } from "./doctor.controller";

const router = Router();

router.get("/alldoctors",doctorController.getAlldoctors)

export const doctorRoute = router;