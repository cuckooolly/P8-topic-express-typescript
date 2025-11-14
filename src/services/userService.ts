import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {AppError} from "../types/errors";
import {User} from "@prisma/client";

async function createUser(user: User) {
  try {
    const existedUser = await userRepository.findByEmail(user.email);
    if (existedUser) {
      const error = new AppError("User already exists");
      error.code = 422;
      error.data = { email: user.email };
      throw error;
    }

    const hashedPassword = await hashPassword(user.password as string);
    const createdUser = await userRepository.save({
      ...user,
      password: hashedPassword,
    });
    return filterSensitiveUserData(createdUser);
  } catch (error: any) {
    if (error.code === 422) throw error; // 기존의 중복 체크 에러는 그대로 전달

    // Prisma 에러를 애플리케이션에 맞는 형식으로 변환
    const customError = new AppError("데이터베이스 작업 중 오류가 발생했습니다");
    customError.code = 500;
    throw customError;
  }
}

function hashPassword(password: NonNullable<User['password']> | string) {
  return bcrypt.hash(password, 10);
}

function filterSensitiveUserData(user: User) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

async function getUser(email: string, password: string) {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new AppError("존재하지 않는 이메일입니다.");
      error.code = 401;
      throw error;
    }
    await verifyPassword(password, user.password);
    return filterSensitiveUserData(user);
  } catch (error: any) {
    if (error.code === 401) throw error;
    const customError = new AppError("데이터베이스 작업 중 오류가 발생했습니다");
    customError.code = 500;
    throw customError;
  }
}

async function verifyPassword(inputPassword: string, password: NonNullable<User['password']>) {
  const isMatch = await bcrypt.compare(inputPassword, password);
  // const isMatch = inputPassword === password;
  if (!isMatch) {
    const error = new AppError("비밀번호가 일치하지 않습니다.");
    error.code = 401;
    throw error;
  }
}

function createToken(user: User, type?: string) {
  const payload = { userId: user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: type === "refresh" ? "2w" : "1h",
  });
  return token;
}

async function updateUser(id: number, data: Partial<User>) {
  // userRepository 에서 적절한 함수를 찾아 호출하세요
  const updatedUser = await userRepository.update(id, data);
  return filterSensitiveUserData(updatedUser);
}

async function refreshToken(userId: number, refreshToken: string) {
  const user = await userRepository.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    const error = new AppError("Unauthorized");
    error.code = 401;
    throw error;
  }

  const newAccessToken = createToken(user);
  const newRefreshToken = createToken(user, "refresh");
  return { newAccessToken, newRefreshToken };
}

async function getUserById(id: number) {
  const user = await userRepository.findById(id);

  if (!user) {
    const error = new AppError("Not Found");
    error.code = 404;
    throw error;
  }

  return filterSensitiveUserData(user);
}

export default {
  createUser,
  getUser,
  createToken,
  updateUser,
  refreshToken,
  getUserById,
};
