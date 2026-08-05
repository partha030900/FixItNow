import httpStatus from "http-status";
import AppError from "../../utils/appError";


const vCreateBooking = (payload: any) => {
  const errors: Record<string, string> = {};

  if (!payload.serviceId || typeof payload.serviceId !== "string") {
    errors.serviceId = "serviceId is required";
  }

  if (!payload.scheduledAt || isNaN(Date.parse(payload.scheduledAt))) {
    errors.scheduledAt = "A valid scheduledAt date is required(ex:'2026-08-01')";
  } else if (new Date(payload.scheduledAt) < new Date()) {
    errors.scheduledAt = "scheduledAt must be a future date";
  }

  if (payload.address !== undefined && typeof payload.address !== "string") {
    errors.address = "Address must be a string";
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Validation failed", errors);
  }
};

const vUpdateBookingStatus = (payload: any) => {
  const allowedStatuses = ["ACCEPTED", "DECLINED", "IN_PROGRESS", "COMPLETED"];

  if (!payload.status || !allowedStatuses.includes(payload.status)) {
    throw new AppError(httpStatus.BAD_REQUEST,
         "Validation failed", 
         {
            status: `status must be one of: ${allowedStatuses.join(", ")}`,
         });
  }
};

export const bookingValidation = {
  vCreateBooking,
  vUpdateBookingStatus,
};