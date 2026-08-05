import httpStatus from "http-status";
import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/appError";

const createBooking = async (customerId: string, payload: any) => {
  const service = await prisma.service.findUnique({
    where: { id: payload.serviceId },
    include: { technician: true },
  });

  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }

  return await prisma.booking.create({
    data: {
      customerId,
      technicianId: service.technicianId,
      serviceId: service.id,
      scheduledAt: new Date(payload.scheduledAt),
      address: payload.address,
      status: "REQUESTED",
    },
  });
};

const getMyBookings = async (userId: string, role: string) => {
  if (role === "CUSTOMER") {
    return await prisma.booking.findMany({
      where: { customerId: userId },
      include: {
         service: true,
         technician: {
            include: {
               user: {
                  select: {
                     name: true
                   }
                }
             }
          }
      },
      orderBy: { createdAt: "desc" },
    });
  }

  if (role === "TECHNICIAN") {
    const technicianProfile = await prisma.technicianProfile.findUnique({ where: { userId } });

    if (!technicianProfile) {
      throw new AppError(httpStatus.NOT_FOUND, "Technician profile not found");
    }

    return await prisma.booking.findMany({
      where: { technicianId: technicianProfile.id },
      include: { service: true, customer: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  return await prisma.booking.findMany({
    include: {
      service: true,
      customer: { select: { name: true, email: true } },
      technician: {
         include: {
             user: {
                 select: {
                    name: true
                  }
               }
            }
        },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getBookingById = async (id: string, userId: string, role: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      service: true,
      customer: { select: { id: true, name: true, email: true } },
      technician: {
         include: {
             user: {
                 select: {
                    name: true,
                    email: true
                  }
               }
            }
        },
      payment: true,
      review: true,
    },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (role === "CUSTOMER" && booking.customerId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN,
      "You can only view your own bookings"
  );
  }
 
  if (role === "TECHNICIAN") {
    const technicianProfile = await prisma.technicianProfile.findUnique({ where: { userId } });
    if (booking.technicianId !== technicianProfile?.id) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You can only view your own bookings"
    );
    }
  }

  return booking;
};

const updateBookingStatus = async (userId: string, bookingId: string, status: string) => {
  const technicianProfile = await prisma.technicianProfile.findUnique({
     where: { userId } });

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
     });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.technicianId !== technicianProfile?.id) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only update your own bookings");
  }

  const validTransitions: Record<string, string[]> = {
    REQUESTED: ["ACCEPTED", "DECLINED"],
    PAID: ["IN_PROGRESS"],
    IN_PROGRESS: ["COMPLETED"],
  };

  const allowedNext = validTransitions[booking.status] || [];

  if (!allowedNext.includes(status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot change status from ${booking.status} to ${status}`
    );
  }

  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status: status as any },
  });
};

const cancelBooking = async (userId: string, bookingId: string) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.customerId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only cancel your own bookings");
  }

  if (["IN_PROGRESS", "COMPLETED"].includes(booking.status)) {
    throw new AppError(
        httpStatus.BAD_REQUEST,
        "Cannot cancel a booking that is already in progress or completed"
    );
  }

  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });
};

export const bookingService = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};