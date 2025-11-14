import prisma from "../config/prisma.js";
import {Product} from "@prisma/client";

async function getById(id: number) {
  return prisma.product.findUnique({
    where: {
      id,
    },
  });
}

async function save(product: Omit<Product, "id">) {
  return prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      price: product.price,
    },
  });
}

export default {
  getById,
  save,
};