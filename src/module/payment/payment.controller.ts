import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync.js";

import { paymentService } from "./payment.service.js";
import { stripe } from "../../lib/stripe.js";
import config from "../../config/index.js";

import sendResponse from "../../utils/sendResponse.js";
import AppError from "../../utils/appError.js";

const createPaymentSession = catchAsync(async (req, res) => {
  const result = await paymentService.createPaymentSession(req.user!.id, req.body.bookingId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment session created successfully",
    data: result,
  });
});

const handleWebhook = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripe_webhook_secret);
  } catch (err: any) {
    throw new AppError(httpStatus.BAD_REQUEST, `Webhook signature verification failed: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    await paymentService.confirmPaymentFromWebhook(session.id);
  }

  res.status(200).json({ received: true });
});

const getMyPayments = catchAsync(async (req, res) => {
  const result = await paymentService.getMyPayments(req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments retrieved successfully",
    data: result,
  });
});

const getPaymentById = catchAsync(async (req, res) => {
  const result = await paymentService.getPaymentById(req.params.id as string, req.user!.id, req.user!.role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
});

export const paymentController = {
  createPaymentSession,
  handleWebhook,
  getMyPayments,
  getPaymentById,
};