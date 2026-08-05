import { Router } from "express";
import { bookingController } from "./booking.controller.js";
import { Role } from "../../../generated/prisma/client.js";
import { auth } from "../../middleware/auth.js";


const router = Router();

router.post("/", auth(Role.CUSTOMER), bookingController.createBooking);
router.get("/", auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN), bookingController.getMyBookings);
router.get("/:id", auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN), bookingController.getBookingById);
router.patch("/:id/status", auth(Role.TECHNICIAN), bookingController.updateBookingStatus);

router.patch("/:id/cancel", auth(Role.CUSTOMER), bookingController.cancelBooking);

export const bookingRoutes = router;