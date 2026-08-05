import httpStatus from "http-status";
import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/appError.js";


const createCategory = async (payload: { name: string; description?: string }) => {
  const existing = await prisma.category.findUnique({
    where: { name: payload.name },
  });

  if (existing) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category with this name already exists");
  }

  return await prisma.category.create({ data: payload });
};

const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  return category;
};

const updateCategory = async (id: string, payload: { name?: string; description?: string }) => {
  await getCategoryById(id); 

  return await prisma.category.update({
    where: { id },
    data: payload,
  });
};

const deleteCategory = async (id: string) => {
  await getCategoryById(id); 
  return await prisma.category.delete({ where: { id } });
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};