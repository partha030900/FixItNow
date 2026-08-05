import httpStatus from "http-status";
import AppError from "../../utils/appError";


const validateUpdateProfile = (payload: any) => {
  const errors: Record<string, string> = {};

  if (payload.bio !== undefined && typeof payload.bio !== "string") {
    errors.bio = "Bio must be a string";
  }

  if (payload.experience !== undefined && (typeof payload.experience !== "number")) {
    errors.experience = "Experience must be a positive number or 0";
  }

  if (payload.skills !== undefined && !Array.isArray(payload.skills)) {
    errors.skills = "Skills must be an array of strings";
  }

  if (payload.location !== undefined && typeof payload.location !== "string") {
    errors.location = "Location must be a string";
  }


  if (payload.hourlyRate !== undefined && (typeof payload.hourlyRate !== "number" || payload.hourlyRate < 0)) {
    errors.hourlyRate = "Hourly rate must be a positive number";
  }


  if (Object.keys(errors).length > 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Validation failed", errors);


  }
};

const validateAvailability = (payload: any) => {
  const errors: Record<string, string> = {};

  if (!Array.isArray(payload.slots) || payload.slots.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Validation failed", {
      slots: "Slots must be a non-empty array",
    });
  }

  payload.slots.forEach((slot: any, index: number) => {
    if (
      typeof slot.dayOfWeek !== "number" ||
      slot.dayOfWeek < 0 ||
      slot.dayOfWeek > 6
    ) 
    {
      errors[`slots[${index}].dayOfWeek`] = "dayOfWeek must be 0-6";
    }
    if (!slot.startTime || typeof slot.startTime !== "string") {
      errors[`slots[${index}].startTime`] = "startTime is required (e.g. '09:00')";
    }
    if (!slot.endTime || typeof slot.endTime !== "string") {
      errors[`slots[${index}].endTime`] = "endTime is required (e.g. '17:00')";
    }
  });

  if (Object.keys(errors).length > 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Validation failed", errors);
  }
};

export const technicianValidation = {
  validateUpdateProfile,
  validateAvailability,
};