import { User as PrismaUser } from "@prisma/client";

declare global {
  namespace Express {
    export interface Request {
      auth: {
        userId: string;
      };
      user?: PrismaUser; // passport가 추가하는 user 속성
    }
  }
}
