import httpStatus from "http-status";
import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/appError.js";


const getAllUsers = async (filters: { role?: string }) => {
  const where: any = {};
  if (filters.role) where.role = filters.role;

  return await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateUserStatus = async (userId: string, status: "ACTIVE" | "BANNED") => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.role === "ADMIN") {
    throw new AppError(httpStatus.FORBIDDEN, "Cannot change status of an admin user");
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { status },
  });
};

const getAllBookings = async () => {
  return await prisma.booking.findMany({
    include: {
      service: true,
      customer: {
         select: {
            name: true, 
            email: true 
          }
         },
      technician: {
        include: { 
          user: {
            select: { 
              name: true,
              
             } 
          }
        } 
      },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const adminService = { 
  getAllUsers, 
  updateUserStatus, 
  getAllBookings 
};