import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync.js";
import { categoryValidation } from "./category.validation.js";
import { categoryService } from "./category.service.js";
import sendResponse from "../../utils/sendResponse.js";

const createCategory = catchAsync(async (req, res) => {
  categoryValidation.validateCreateCategory(req.body);

  const result = await categoryService.createCategory(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const result = await categoryService.getAllCategories();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories retrieved successfully",
    data: result,
  });
});

const getCategoryById = catchAsync(async (req, res) => {
  const result = await categoryService.getCategoryById(req.params.id as string );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category retrieved successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const result = await categoryService.updateCategory(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.id as string );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully",
    data: null,
  });
});

export const categoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};