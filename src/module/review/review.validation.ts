import httpStatus from "http-status";
import AppError from "../../utils/appError";


const vCreateReview = (payload: any) => {
  const errors: Record<string, string> = {};

  if (!payload.bookingId || typeof payload.bookingId !== "string") {
    errors.bookingId = "bookingId is required";
  }

  if (typeof payload.rating !== "number" || payload.rating < 1 || payload.rating > 5) {
    errors.rating = "Rating must be a number between 1 and 5";
  }

  if (payload.comment !== undefined && typeof payload.comment !== "string") {
    errors.comment = "Comment must be a string";
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Validation failed", errors);
  }
};

export const reviewValidation = { vCreateReview };