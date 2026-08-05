import { Router } from "express";
import { serviceController } from "./service.controller.js";
import { auth } from "../../middleware/auth.js";
import { Role } from "../../../generated/prisma/client.js";


const router = Router();

router.post("/", auth(Role.TECHNICIAN), serviceController.createService);
router.patch("/:id", auth(Role.TECHNICIAN), serviceController.updateService);
router.delete("/:id", auth(Role.TECHNICIAN), serviceController.deleteService);
router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);

export const serviceRoutes = router;