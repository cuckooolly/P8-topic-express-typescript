import prisma from "../config/prisma.js";
import {User} from "@prisma/client";

async function findById(id: User["id"]){
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async function findByEmail(email: User["email"]) {
  return prisma.user.findUnique({
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

async function update(id: User["id"], data: Partial<User>) {
  return prisma.user.update({
    where: {
      id,
    },
    data: data,
  });
}

async function createOrUpdate(provider: string, providerId: string, email: User["email"], name: User["name"]) {
  return prisma.user.upsert({
    where: {
      provider_providerId: {
        provider,
        providerId
      }
    },
    update: { email, name },
    create: { provider, providerId, email, name },
  });
}

export default {
  findById,
  findByEmail,
  save,
  update,
  createOrUpdate,
};
