import httpStatus from "http-status";
import AppError from "../../utils/appError";

const vCreateService = (payload: any) => {
  const errors: Record<string, string> = {};

  if (!payload.title || typeof payload.title !== "string" || payload.title.trim().length < 2) {
    errors.title = "Title must be at least 2 characters";
  }

  if (payload.description !== undefined && typeof payload.description !== "string") {
    errors.description = "Description must be a string";
  }

  if (typeof payload.price !== "number" || payload.price <= 0) {
    errors.price = "Price must be a positive number";
  }

  if (!payload.categoryId || typeof payload.categoryId !== "string") {
    errors.categoryId = "categoryId is required";
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Validation failed", errors);
  }
};

const vUpdateService = (payload: any) => {
  const errors: Record<string, string> = {};

  if (payload.title !== undefined && (typeof payload.title !== "string" || payload.title.trim().length < 2)) {
    errors.title = "Title must be at least 2 characters";
  }

  if (payload.price !== undefined && (typeof payload.price !== "number" || payload.price <= 0)) {
    errors.price = "Price must be a positive number";
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Validation failed", errors);
  }
};

export const serviceValidation = {
  vCreateService,
  vUpdateService,
};