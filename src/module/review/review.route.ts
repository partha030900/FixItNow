import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { reviewController } from "./review.contoller.js";
import { Role } from "../../../generated/prisma/client.js";

const router = Router();

router.post("/", auth(Role.CUSTOMER), reviewController.createReview);
router.get("/technician/:technicianId", reviewController.getReviewsByTechnician);

export const reviewRoutes = router;