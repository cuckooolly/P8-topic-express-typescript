import { expressjwt } from "express-jwt";
import reviewRepository from "../repositories/reviewRepository";
import {
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../types/errors";
import { NextFunction, Request, Response } from "express";

function throwUnauthorizedError() {
  // 인증되지 않은 경우 401 에러를 발생시키는 함수
  const error = new AuthenticationError("Unauthorized");
  throw error;
}

async function verifySessionLogin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.isAuthenticated()) {
      throwUnauthorizedError();
    }
    next();
  } catch (error) {
    next(error);
  }
}

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET!,
  algorithms: ["HS256"],
});

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET!,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.refreshToken,
});

async function verifyReviewAuth(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  const { id: reviewId } = req.params;
  try {
    const review = await reviewRepository.getById(+reviewId);
    if (!review) {
      const error = new NotFoundError("Review not found");
      throw error;
    }

    // expressJwt와 passport-jwt 둘 다 지원
    const userId = req.user?.id || req.auth?.userId;
    if (!userId) {
      const error = new AuthenticationError("User not authenticated");
      throw error;
    }

    if (review.authorId !== userId) {
      const error = new ForbiddenError("Forbidden");
      throw error;
    }
    // 인증 성공 시 다음 미들웨어로 이동
    next();
  } catch (error) {
    // 에러 발생 시 에러 핸들러로 전파
    return next(error);
  }
}

function validateEmailAndPassword(
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
  next: NextFunction,
) {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new ValidationError("email, password 가 모두 필요합니다.");
    throw error;
  }
  next();
}
export default {
  verifySessionLogin,
  verifyAccessToken,
  verifyReviewAuth,
  verifyRefreshToken,
  validateEmailAndPassword,
};
