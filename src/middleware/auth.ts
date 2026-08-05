import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import type { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import config from "../config/index.js";
import { catchAsync } from "../utils/catchAsync.js";
import { jwtUtils } from "../utils/jwt.js";
import AppError from "../utils/appError.js";
import type { Role } from "../../generated/prisma/client.js";




declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization?.split(" ")[1]
      : req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not logged in. Please log in to access this resource.");
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

    if (!verifiedToken.success) {
      throw new AppError(httpStatus.UNAUTHORIZED, verifiedToken.error || "Invalid token");
    }

    const { email, name, id, role } = verifiedToken.data as JwtPayload;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, "Forbidden. You don't have permission to access this resource.");
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not found. Please log in again.");
    }

    if (user.status === "BANNED") {
      throw new AppError(httpStatus.FORBIDDEN, "Your account has been banned. Please contact support.");
    }

    req.user = { email, name, id, role };

    next();
  });
};