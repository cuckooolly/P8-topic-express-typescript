import { Product } from "@prisma/client";
import productRepository from "../repositories/productRepository";

async function getById(id: Product["id"]) {
  return await productRepository.getById(id);
}

async function create(product: Pick<Product, "name" | "price">) {
  return await productRepository.save(product);
}

export default {
  getById,
  create,
};
