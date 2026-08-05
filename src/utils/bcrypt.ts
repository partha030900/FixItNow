import bcrypt from "bcryptjs";
import config from "../config";


const hashPassword = async (plainPassword: string): Promise<string> => {
  const saltRounds = Number(config.bcrypt_salt_rounds) || 10;
  return await bcrypt.hash(plainPassword, saltRounds);
};

const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const bcryptUtils = {
  hashPassword,
  comparePassword,
};