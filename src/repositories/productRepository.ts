import { Product } from "@prisma/client";
import prisma from "../config/prisma.js";

async function getById(id: Product["id"]) {
  return await prisma.product.findUnique({
    where: {
      id,
    },
  });
}

async function save(product: Pick<Product, "name" | "price">) {
  return await prisma.product.create({
    data: {
      name: product.name,
      price: product.price,
    },
  });
}

export default {
  getById,
  save,
};
