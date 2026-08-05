import httpStatus from "http-status";
import { adminService } from "./admin.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import AppError from "../../utils/appError.js";
import sendResponse from "../../utils/sendResponse.js";


const getAllUsers = catchAsync(async (req, res) => {
  const result = await adminService.getAllUsers(req.query as any);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const { status } = req.body;

  if (!status || !["ACTIVE", "BANNED"].includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Validation failed", {
      status: "status must be ACTIVE or BANNED",
    });
  }

  const result = await adminService.updateUserStatus(req.params.id as string, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

const getAllBookings = catchAsync(async (req, res) => {
  const result = await adminService.getAllBookings();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings retrieved successfully",
    data: result,
  });
});

export const adminController = { 
  getAllUsers, 
  updateUserStatus, 
  getAllBookings 
};