import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync.js";
import { technicianValidation } from "./technician.validation.js";
import { technicianService } from "./technician.service.js";
import sendResponse from "../../utils/sendResponse.js";


const getMyProfile = catchAsync(async (req, res) => {
  const result = await technicianService.getMyProfile(req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  technicianValidation.validateUpdateProfile(req.body);

  const result = await technicianService.updateProfile(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

const setAvailability = catchAsync(async (req, res) => {
  technicianValidation.validateAvailability(req.body);

  const result = await technicianService.setAvailability(req.user!.id, req.body.slots);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Availability updated successfully",
    data: result,
  });
});

const getAllTechnicians = catchAsync(async (req, res) => {
  const result = await technicianService.getAllTechnicians(req.query as any);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technicians retrieved successfully",
    data: result,
  });
});

const getTechnicianById = catchAsync(async (req, res) => {
  const result = await technicianService.getTechnicianById(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technician retrieved successfully",
    data: result,
  });
});

export const technicianController = {
  getMyProfile,
  updateProfile,
  setAvailability,
  getAllTechnicians,
  getTechnicianById,
};