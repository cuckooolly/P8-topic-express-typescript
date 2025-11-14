import express, {NextFunction, Request, Response} from "express";
import auth from "../middlewares/auth.js";
import productService from "../services/productService.js";

const productController = express.Router();

productController.post("/", auth.verifySessionLogin, async (req: Request, res: Response, next: NextFunction) => {
  const createdProduct = await productService.create(req.body);
  res.json(createdProduct);
});

productController.get("/:id", async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const product = await productService.getById(id);
  res.json(product);
});

export default productController;
