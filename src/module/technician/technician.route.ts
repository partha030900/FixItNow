import { Router } from "express";
import { technicianController } from "./technician.controller.js";
import { Role } from "../../../generated/prisma/client.js";
import { auth } from "../../middleware/auth.js";



const router = Router();



router.get("/me/profile", auth(Role.TECHNICIAN), technicianController.getMyProfile);
router.put("/me/profile", auth(Role.TECHNICIAN), technicianController.updateProfile);
router.put("/me/availability", auth(Role.TECHNICIAN), technicianController.setAvailability);
router.get("/", technicianController.getAllTechnicians);
router.get("/:id", technicianController.getTechnicianById);

export const technicianRoutes = router;