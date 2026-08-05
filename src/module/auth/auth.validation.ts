import httpStatus from "http-status";
import AppError from "../../utils/appError";

const vRegisterInput = (payload: any) => {
  const errors: Record<string, string> = {};

  if (!payload.name || typeof payload.name !== "string" || payload.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!payload.email || typeof payload.email !== "string" ) {
    errors.email = "A valid email is required";
  }

  if (!payload.password || typeof payload.password !== "string" || payload.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!payload.role || !["CUSTOMER", "TECHNICIAN"].includes(payload.role)) {
    errors.role = "Role must be either CUSTOMER or TECHNICIAN";
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Validation failed", errors);
  }
};

const vLogingInput = (payload: any) => {
  const errors: Record<string, string> = {};

  if (!payload.email || typeof payload.email !== "string") {
    errors.email = "Email is required";
  }

  if (!payload.password || typeof payload.password !== "string") {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Validation failed", errors);
  }
};

export const authValidation = {
  vRegisterInput,
  vLogingInput,
};