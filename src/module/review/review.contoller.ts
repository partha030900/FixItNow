import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync.js";

import { reviewValidation } from "./review.validation.js";
import { reviewService } from "./review.service.js";
import sendResponse from "../../utils/sendResponse.js";

const createReview = catchAsync(async (req, res) => {
  reviewValidation.vCreateReview(req.body);

  const result = await reviewService.createReview(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getReviewsByTechnician = catchAsync(async (req, res) => {
  const result = await reviewService.getReviewsByTechnician(req.params.technicianId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

export const reviewController = { createReview, getReviewsByTechnician };