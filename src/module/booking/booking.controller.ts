import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync.js";

import { bookingValidation } from "./booking.validation.js";
import { bookingService } from "./booking.service.js";
import sendResponse from "../../utils/sendResponse.js";

const createBooking = catchAsync(async (req, res) => {
  bookingValidation.vCreateBooking(req.body);

  const result = await bookingService.createBooking(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Booking created successfully",
    data: result,
  });
});

const getMyBookings = catchAsync(async (req, res) => {
  const result = await bookingService.getMyBookings(req.user!.id, req.user!.role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings retrieved successfully",
    data: result,
  });
});

const getBookingById = catchAsync(async (req, res) => {
  const result = await bookingService.getBookingById(req.params.id as string, req.user!.id, req.user!.role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking retrieved successfully",
    data: result,
  });
});

const updateBookingStatus = catchAsync(async (req, res) => {
  bookingValidation.vUpdateBookingStatus(req.body);

  const result = await bookingService.updateBookingStatus(req.user!.id, req.params.id as string, req.body.status );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking status updated successfully",
    data: result,
  });
});

const cancelBooking = catchAsync(async (req, res) => {
  const result = await bookingService.cancelBooking(req.user!.id, req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking cancelled successfully",
    data: result,
  });
});

export const bookingController = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};