import httpStatus from "http-status";
import AppError from "../../utils/appError";


const validateCreateCategory = (payload: any) => {
  const errors: Record<string, string> = {};

  if (!payload.name || typeof payload.name !== "string" || payload.name.trim().length < 2) {
    errors.name = "Category name must be at least 2 characters";
  }

  if (payload.description && typeof payload.description !== "string") {
    errors.description = "Description must be a string";
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Validation failed", errors);
  }
};

export const categoryValidation = {
  validateCreateCategory,
};