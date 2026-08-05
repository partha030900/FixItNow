import httpStatus from "http-status";
import { prisma } from "../../lib/prisma.js";
import { stripe } from "../../lib/stripe.js";
import config from "../../config/index.js";
import AppError from "../../utils/appError.js";


const createPaymentSession = async (customerId: string, bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true, payment: true },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only pay for your own bookings");
  }

  if (booking.status !== "ACCEPTED") {
    throw new AppError(httpStatus.BAD_REQUEST, "Booking must be accepted before payment");
  }

  if (booking.payment) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment already exists for this booking");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: booking.service.title,
          },
          unit_amount: Math.round(booking.service.price * 100), 
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingId: booking.id,
      customerId: customerId,
    },
    success_url: `${config.app_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.app_url}/payment-cancelled`,
  });

  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      userId: customerId,
      amount: booking.service.price,
      provider: "STRIPE",
      transactionId: session.id,
      status: "PENDING",
    },
  });

  return { checkoutUrl: session.url, payment };
};

const confirmPaymentFromWebhook = async (sessionId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { transactionId: sessionId },
  });

  if (!payment) {
    console.error("Payment record not found for session:", sessionId);
    return;
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "COMPLETED",
        paidAt: new Date()
      },
    }),
    prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: "PAID" },
    }),
  ]);
};

const getMyPayments = async (userId: string) => {
  return await prisma.payment.findMany({
    where: { userId },
    include: {
      booking: { 
        include: { 
          service: true 
        } 
      } 
    },
    orderBy: { createdAt: "desc" },
  });
};

const getPaymentById = async (id: string, userId: string, role: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { booking: { include: { service: true } } },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  if (role !== "ADMIN" && payment.userId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only view your own payments");
  }

  return payment;
};

export const paymentService = {
  createPaymentSession,
  confirmPaymentFromWebhook,
  getMyPayments,
  getPaymentById,
};