import express, { NextFunction, Request, Response } from "express";
import auth from "../middlewares/auth.js";
import productService from "../services/productService";
import { Product } from "@prisma/client";

const productController = express.Router();

productController.post(
  "/",
  auth.verifySessionLogin,
  async (
    req: Request<{}, {}, Pick<Product, "name" | "price">>,
    res: Response,
    next: NextFunction,
  ) => {
    const productData: Omit<Product, "id"> = {
      name: req.body.name,
      price: req.body.price,
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createdProduct = await productService.create(productData);
    res.json(createdProduct);
  },
);

productController.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const product = await productService.getById(+id);
    res.json(product);
  },
);

export default productController;
