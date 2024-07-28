import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { Context } from "hono";
import { env } from "hono/adapter";

export function withPrisma(ctx: Context) {
  const adapter = new PrismaD1((env(ctx) as Env).DB);
  const prisma = new PrismaClient({ adapter });
  // .$extends({
  //   query: {
  //     content: {
  //       async findFirst({ model, operation, args, query }) {
  //         (ctx as Context<HonoApp, any, {}>).get("user")
  //         return query(args);
  //       },
  //     },
  //   },
  // });
  return prisma;
}

export function withPrismaFromW(env: Env) {
  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter });
  return prisma;
}
