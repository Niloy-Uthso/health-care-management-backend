import { Router } from "express";
import { doctorController } from "./doctor.controller";

const router = Router();

router.get("/alldoctors",doctorController.getAlldoctors)
router.delete("/softdelete/:id",doctorController.softDeleteDoctor)

export const doctorRoute = router;