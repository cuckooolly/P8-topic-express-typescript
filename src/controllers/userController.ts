import express, { NextFunction, Request, Response } from "express";
import userService from "../services/userService";
import auth from "../middlewares/auth";
import passport from "../config/passport";
import { ValidationError } from "../types/errors";
import { User } from "@prisma/client";
import { CreateUserDto, LoginUserDto } from "../dtos/user.dto";

const userController = express.Router();

userController.post(
  "/users",
  async (
    req: Request<{}, {}, CreateUserDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, name, password } = req.body;
      if (!email || !name || !password) {
        const error = new ValidationError(
          "email, name, password 가 모두 필요합니다.",
        );
        throw error;
      }
      const user = await userService.createUser({ email, name, password });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },
);

userController.post(
  "/login",
  async (
    req: Request<{}, {}, LoginUserDto>,
    res: Response,
    next: NextFunction,
  ) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        const error = new ValidationError(
          "email, password 가 모두 필요합니다.",
        );
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
  },
);

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
      const refreshToken = req.cookies.refreshToken;
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

export default userController;
