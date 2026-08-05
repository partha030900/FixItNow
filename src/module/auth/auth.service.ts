import httpStatus from "http-status";
import { prisma } from "../../lib/prisma.js";
import { bcryptUtils } from "../../utils/bcrypt.js";
import config from "../../config/index.js";
import type { ILoginPayload, IRegisterPayload } from "./auth.interface.js";
import AppError from "../../utils/appError.js";
import { jwtUtils } from "../../utils/jwt.js";
import type { SignOptions } from "jsonwebtoken";



const registerUser = async (payload: IRegisterPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email already registered");
  }

  const hashedPassword = await bcryptUtils.hashPassword(payload.password);

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role,
    },
  });

  if (payload.role === "TECHNICIAN") {
    await prisma.technicianProfile.create({
      data: { userId: user.id },
    });
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const loginUser = async (payload: ILoginPayload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  if (user.status === "BANNED") {
    throw new AppError(httpStatus.FORBIDDEN, "Your account has been banned");
  }

  const isPasswordValid = await bcryptUtils.comparePassword(payload.password, user.password);

  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }
  
  const jwtPayload = { id: user.id, email: user.email, name: user.name, role: user.role };

  const accessToken = jwtUtils.createToken(jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions
  );

  const refreshToken = jwtUtils.createToken(jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions
  );

  const { password, ...userWithoutPassword } = user;

  return { accessToken, refreshToken, user: userWithoutPassword };
};

export const authService = {
  registerUser,
  loginUser,
};