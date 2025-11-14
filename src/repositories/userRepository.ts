import { User } from "@prisma/client";
import prisma from "../config/prisma";

async function findById(id: User["id"]) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async function findByEmail(email: User["email"]) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

async function save(user: Pick<User, "email" | "name" | "password">) {
  return prisma.user.create({
    data: {
      email: user.email,
      name: user.name,
      password: user.password,
    },
  });
}

async function update(
  id: User["id"],
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>,
) {
  return prisma.user.update({
    where: {
      id,
    },
    data: data,
  });
}

export default {
  findById,
  findByEmail,
  save,
  update,
};
