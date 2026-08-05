import httpStatus from "http-status";
import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/appError.js";


const createReview = async (customerId: string, payload: any) => {
  const booking = await prisma.booking.findUnique({
    where: { id: payload.bookingId },
    include: { review: true },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only review your own bookings");
  }

  if (booking.status !== "COMPLETED") {
    throw new AppError(httpStatus.BAD_REQUEST, "You can only review a completed booking");
  }

  if (booking.review) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have already reviewed this booking");
  }

  const review = await prisma.review.create({
    data: {
      bookingId: booking.id,
      customerId,
      technicianId: booking.technicianId,
      rating: payload.rating,
      comment: payload.comment,
    },
  });


  const allReviews = await prisma.review.findMany({
    where: { 
        technicianId: booking.technicianId 
    },
  });

  const avgRating = allReviews.reduce(
    (sum, r) => 
      sum + r.rating, 0
    ) / allReviews.length;

  await prisma.technicianProfile.update({
    where: { id: booking.technicianId },
    data: {
         avgRating: Math.round(avgRating * 10) / 10 
    },
  });

  return review;
};

const getReviewsByTechnician = async (technicianId: string) => {
  return await prisma.review.findMany({
    where: { technicianId },
    include: {
        customer: {
            select: {
                 name: true,
                 
                } 
        }
    },
    orderBy: { createdAt: "desc" },
  });
};

export const reviewService = { createReview, getReviewsByTechnician };