import express, { type Application, type Request, type Response } from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
import notFound from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { authRoutes } from "./module/auth/auth.route";
import { categoryRoutes } from "./module/category/category.route";
import { technicianRoutes } from "./module/technician/technician.route";
import { serviceRoutes } from "./module/service/service.route";
import { bookingRoutes } from "./module/booking/booking.route";
import { paymentController } from "./module/payment/payment.controller";
import { paymentRoutes } from "./module/payment/payment.route";
import { reviewRoutes } from "./module/review/review.route";
import { adminRoutes } from "./module/admin/admin.route";

const app: Application = express();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.post(
  "/api/payments/confirm",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "FixItNow Backend is Working! You can now use the API endpoints to interact with the application.",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/categories", categoryRoutes);


app.use("/api/technicians", technicianRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);


app.get("/payment-success", (req, res) => {
  res.status(200).json({ success: true, message: "Payment successful! You can close this tab." });
});

app.get("/payment-cancelled", (req, res) => {
  res.status(200).json({ success: false, message: "Payment was cancelled." });
});

app.use(notFound);
app.use(globalErrorHandler);


export default app;