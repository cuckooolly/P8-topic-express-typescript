import { Review } from "@prisma/client";
import prisma from "../config/prisma";

async function save(review: Omit<Review, "id" | "createdAt" | "updatedAt">) {
  const createdReview = await prisma.review.create({
    data: {
      title: review.title,
      description: review.description,
      rating: review.rating,
      product: {
        connect: {
          id: review.productId,
        },
      },
      author: {
        connect: {
          id: review.authorId,
        },
      },
    },
  });
  return createdReview;
}

async function getById(id: Review["id"]) {
  const review = await prisma.review.findUnique({
    where: {
      id,
    },
  });
  return review;
}

async function getAll() {
  const reviews = await prisma.review.findMany();
  return reviews;
}

async function update(
  id: Review["id"],
  review: Partial<Omit<Review, "id" | "createdAt" | "updatedAt" | "authorId">>,
) {
  const updatedReview = await prisma.review.update({
    where: {
      id,
    },
    data: {
      title: review.title,
      description: review.description,
      rating: review.rating,
    },
  });
  return updatedReview;
}

async function deleteById(id: Review["id"]) {
  const deletedReview = await prisma.review.delete({
    where: {
      id,
    },
  });
  return deletedReview;
}

export default {
  save,
  getById,
  getAll,
  update,
  deleteById,
};
