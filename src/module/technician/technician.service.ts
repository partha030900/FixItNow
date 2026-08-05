import httpStatus from "http-status";
import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/appError.js";


const getMyProfile = async (userId: string) => {
  const profile = await prisma.technicianProfile.findUnique({
    where: { userId },
    include: { availability: true, services: true },
  });

  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician profile not found");
  }

  return profile;
};

const updateProfile = async (userId: string, payload: any) => {
  const profile = await prisma.technicianProfile.findUnique({ where: { userId } });

  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician profile not found");
  }

  return await prisma.technicianProfile.update({
    where: { userId },
    data: {
      bio: payload.bio,
      experience: payload.experience,
      skills: payload.skills,
      hourlyRate: payload.hourlyRate,
      location: payload.location,
    },
  });
};

const setAvailability = async (userId: string, slots: any[]) => {
  const profile = await prisma.technicianProfile.findUnique({ where: { userId } });

  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician profile is not found");
  }

  await prisma.availability.deleteMany({ where: { technicianId: profile.id } });

  const created = await prisma.availability.createMany({
    data: slots.map((slot) => ({
      technicianId: profile.id,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
    })),
  });

  return created;
};

const getAllTechnicians = async (
  filters: 
  {
     location?: string; 
     minRating?: string 
  }) => {
  const where: any = {};

  if (filters.location) {
    where.location = { contains: filters.location, mode: "insensitive" };
  }

  if (filters.minRating) {
    where.avgRating = { gte: Number(filters.minRating) };
  }

  return await prisma.technicianProfile.findMany({
    where,
    include: { user: 
              { select: { name: true, email: true } }, 
                services: true 
              },
  });
};

const getTechnicianById = async (id: string) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      services: true,
      reviews: true,
    },
  });

  if (!technician) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician not found");
  }

  return technician;
};

export const technicianService = {
  getMyProfile,
  updateProfile,
  setAvailability,
  getAllTechnicians,
  getTechnicianById,
};