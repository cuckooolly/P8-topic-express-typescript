import express, { NextFunction, Request, Response } from "express";
import auth from "../middlewares/auth";
import productService from "../services/productService";
import { Product } from "@prisma/client";
import { CreateProductDto, GetProductParamsDto } from "../dtos/product.dto";
import { NotFoundError } from "../types/errors";

const productController = express.Router();

productController.post(
  "/",
  auth.verifySessionLogin,
  async (
    req: Request<{}, {}, CreateProductDto>,
    res: Response,
    next: NextFunction,
  ) => {
    const createdProduct = await productService.create(req.body);
    res.json(createdProduct);
  },
);

productController.get(
  "/:id",
  async (req: Request<GetProductParamsDto>, res: Response) => {
    const { id } = req.params;
    const product = await productService.getById(+id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    res.json(product);
  },
);

export default productController;
