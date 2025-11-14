import express, {NextFunction, Request, Response} from "express";
import userService from "../services/userService.js";
import auth from "../middlewares/auth.js";
import passport from "../config/passport.js";
import {AppError} from "../types/errors";
import {User} from "@prisma/client";

const userController = express.Router();

userController.post("/users", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      const error = new AppError("email, name, password 가 모두 필요합니다.");
      error.code = 422;
      throw error;
    }
    const user = await userService.createUser({ email, name, password });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

userController.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      const error: AppError = new AppError("email, password 가 모두 필요합니다.");
      error.code = 422;
      throw error;
    }
    const user = await userService.getUser(email, password);

    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");
    await userService.updateUser(user.id, { refreshToken });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.json({ ...user, accessToken });
  } catch (error) {
    next(error);
  }
});

userController.post(
  "/session-login",
  auth.validateEmailAndPassword,
  passport.authenticate("local"),
  (req: Request, res: Response) => {
    res.json(req.user);
  },
);

userController.post(
  "/token/refresh",
  passport.authenticate("refresh-token", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken :string = req.cookies.refreshToken;
      const { id } = req.user as User;

      const { newAccessToken, newRefreshToken } =
        await userService.refreshToken(id, refreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/token/refresh",
      });
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      next(error);
    }
  },
);

// TODO: 구글로그인 성공 시 토큰 발급 처리 하세요
userController.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req: Request, res: Response, next: NextFunction) => {
    // 구글로그인 성공 시 accessToken 과 refreshToken 을 발급합니다.
    // 발급된 refreshToken 은 쿠키에 저장합니다.
    // 발급된 accessToken 을 클라이언트에 응답합니다. 응답형식: { accessToken: 'accessToken' }
  },
);

// TODO: GET /auth/google 엔드포인트를 만드세요

export default userController;
