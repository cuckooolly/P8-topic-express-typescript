import express, { NextFunction, Request, Response } from "express";
import passport from "../config/passport.js";
import reviewService from "../services/reviewService";
import auth from "../middlewares/auth.js";
import { Review } from "@prisma/client";

const reviewController = express.Router();

reviewController.post(
  "/",
  auth.verifyAccessToken,
  async (
    req: Request<{}, {}, Omit<Review, "id" | "createdAt" | "updatedAt">>,
    res: Response,
    next: NextFunction,
  ) => {
    const { userId } = req.auth;
    try {
      const createdReview = await reviewService.create({
        ...req.body,
        authorId: +userId,
      });
      res.status(201).json(createdReview);
    } catch (error) {
      next(error);
    }
  },
);

reviewController.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const review = await reviewService.getById(+id);
      res.json(review);
    } catch (error) {
      next(error);
    }
  },
);

reviewController.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviews = await reviewService.getAll();
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  },
);

reviewController.put(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  auth.verifyReviewAuth,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const updatedReview = await reviewService.update(
        +req.params.id,
        req.body,
      );
      res.json(updatedReview);
    } catch (error) {
      next(error);
    }
  },
);

reviewController.delete(
  "/:id",
  auth.verifyAccessToken,
  auth.verifyReviewAuth,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const deletedReview = await reviewService.deleteById(+req.params.id);
      res.json(deletedReview);
    } catch (error) {
      next(error);
    }
  },
);

export default reviewController;
