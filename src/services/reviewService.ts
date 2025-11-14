import reviewRepository from "../repositories/reviewRepository";
import { Review } from "@prisma/client";

async function create(review: Omit<Review, "id" | "createdAt" | "updatedAt">) {
  return reviewRepository.save(review);
}

async function getById(id: Review["id"]) {
  return reviewRepository.getById(id);
}

async function getAll() {
  return reviewRepository.getAll();
}

async function update(
  id: Review["id"],
  review: Partial<Omit<Review, "id" | "createdAt" | "updatedAt" | "authorId">>,
) {
  return reviewRepository.update(id, review);
}

async function deleteById(id: Review["id"]) {
  return reviewRepository.deleteById(id);
}

export default {
  create,
  getById,
  getAll,
  update,
  deleteById,
};
