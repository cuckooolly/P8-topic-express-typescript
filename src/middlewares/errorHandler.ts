import {Request, Response, NextFunction, ErrorRequestHandler} from "express";
import {AppError} from "../types/errors";

const errorHandler: ErrorRequestHandler = (error: AppError, req: Request, res: Response, next: NextFunction) => {
  if (error.name === "UnauthorizedError") {
    res.status(401).send("invalid token...");
  }

  const status = error.code ?? 500;

  console.error(error);
  res.status(status).json({
    path: req.path,
    method: req.method,
    message: error.message ?? "Internal Server Error",
    data: error.data ?? undefined,
    date: new Date(),
  });
}

export default errorHandler;

// export default function errorHandler(error: AppError, req: Request, res: Response, next: NextFunction) {
//   if (error.name === "UnauthorizedError") {
//     res.status(401).send("invalid token...");
//   }
//
//   const status = error.code ?? 500;
//
//   console.error(error);
//   return res.status(status).json({
//     path: req.path,
//     method: req.method,
//     message: error.message ?? "Internal Server Error",
//     data: error.data ?? undefined,
//     date: new Date(),
//   });
// }
