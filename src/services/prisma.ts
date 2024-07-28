import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { Context } from "hono";
import { env } from "hono/adapter";

export function withPrisma(ctx: Context) {
  return withPrismaFromW(env(ctx) as Env);
}

export function withPrismaFromW(env: Env) {
  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter });
  return prisma;
}
