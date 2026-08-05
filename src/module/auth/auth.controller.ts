import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync.js";

import { authValidation } from "./auth.validation.js";
import { authService } from "./auth.service.js";
import sendResponse from "../../utils/sendResponse.js";
import config from "../../config/index.js";
import { prisma } from "../../lib/prisma.js";

const register = catchAsync(async (req, res) => {
  authValidation.vRegisterInput(req.body);

  const result = await authService.registerUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  authValidation.vLogingInput(req.body);

  const result = await authService.loginUser(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: config.node_env === "production" ? true : false,
    sameSite: "lax" as const,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: {
      accessToken: result.accessToken,
      user: result.user,
      
    },
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: user,
  });
});

export const authController = {
  register,
  login,
  getMe
};