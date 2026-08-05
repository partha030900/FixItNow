import httpStatus from "http-status";
import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/appError.js";


const createService = async (userId: string, payload: any) => {
  const technicianProfile = await prisma.technicianProfile.findUnique({ where: { userId } });

  if (!technicianProfile) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician profile not found");
  }

  const category = await prisma.category.findUnique({ 
    where: { id: payload.categoryId } 
  });

  if (!category) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid categoryId");
  }

  return await prisma.service.create({
    data: {
      title: payload.title,
      description: payload.description,
      price: payload.price,
      categoryId: payload.categoryId,
      technicianId: technicianProfile.id,
    },
  });
};

const getAllServices = async (
    filtby: {
         categoryId?: string; 
         location?: string; 
         minPrice?: string; 
         maxPrice?: string 
        }) => {
  const where: any = {};

  if (filtby.categoryId) {
    where.categoryId = filtby.categoryId;
  }

  if (filtby.location) {
    where.technician = { 
        location: { 
            contains: filtby.location, 
            mode: "insensitive" 
        } 
    };
  }

  if (filtby.minPrice || filtby.maxPrice) {
    where.price = {};
    if (filtby.minPrice) where.price.gte = Number(filtby.minPrice);
    if (filtby.maxPrice) where.price.lte = Number(filtby.maxPrice);
  }

  return await prisma.service.findMany({
    where,
    include: {
      category: true,
      technician: { 
        include: {
            user: {
                select: { name: true } 
            } 
        } 
    },
    },
  });
};

const getServiceById = async (id: string) => {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      category: true,
      technician: {
        include: {
            user: {
                select: { name: true } 
            }, 
            reviews: true
         } 
      },
    },
  });

  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }

  return service;
};

const updateService = async (userId: string, serviceId: string, payload: any) => {
  const technicianProfile = await prisma.technicianProfile.findUnique({ where: { userId } });

  const service = await prisma.service.findUnique({ where: { id: serviceId } });

  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }

  if (service.technicianId !== technicianProfile?.id) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only update your own services");
  }

  return await prisma.service.update({
    where: { id: serviceId },
    data: payload,
  });
};

const deleteService = async (userId: string, serviceId: string) => {
  const technicianProfile = await prisma.technicianProfile.findUnique({ where: { userId } });

  const service = await prisma.service.findUnique({ where: { id: serviceId } });

  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }

  if (service.technicianId !== technicianProfile?.id) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only delete your own services");
  }

  return await prisma.service.delete({ where: { id: serviceId } });
};

export const serviceService = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};