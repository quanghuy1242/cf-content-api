import { zValidator } from "@hono/zod-validator";
import { Prisma } from "@prisma/client";
import { X_PAGE_COUNT_KEY, X_RECORD_COUNT_KEY } from "const";
import { DbConstraintException } from "exceptions";
import { Hono } from "hono";
import { authPrivate } from "middlewares/auth";
import { adminOnly } from "middlewares/permission";
import {
  CategorySchema,
  CategoryUncheckedCreateInputSchema,
  CategoryUpdateInputSchema,
} from "schema/generated/zod";
import { withPrisma } from "services/prisma";
import { z } from "zod";

const categories = new Hono<HonoApp>().basePath("/categories");

categories.get(
  "/:id",
  zValidator(
    "param",
    z.object({
      id: z.string().uuid(),
    }),
  ),
  async (c) => {
    const content = await withPrisma(c).category.findFirst({
      where: {
        id: c.req.valid("param").id,
      },
    });
    if (!content) {
      throw new DbConstraintException({ message: "Not found" });
    }
    return c.json(CategorySchema.parse(content));
  },
);

categories.post(
  "",
  authPrivate,
  adminOnly,
  zValidator("json", CategoryUncheckedCreateInputSchema),
  async (c) => {
    const input = c.req.valid("json");
    const data = await withPrisma(c).category.create({ data: input });
    return c.json(CategorySchema.parse(data), 201);
  },
);

categories.get(
  "",
  zValidator(
    "query",
    z.object({
      name: z.string().optional(),
      status: z.enum(["ACTIVE", "PENDING", "INACTIVE"]).optional(),
      page: z.number().default(1),
      pageSize: z.number().max(100).default(10),
    }),
  ),
  async (c) => {
    const { name, status, page, pageSize } = c.req.valid("query");
    const p = withPrisma(c);
    const baseQuery: Prisma.CategoryWhereInput = {
      ...(name ? { name: { contains: name } } : {}),
      ...(status ? { status } : { status: "ACTIVE" }),
    };
    const count = await p.category.count({ where: baseQuery });
    const data = await p.category.findMany({
      where: baseQuery,
      orderBy: {
        modified: "desc",
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
    c.header(X_RECORD_COUNT_KEY, count.toString());
    c.header(X_PAGE_COUNT_KEY, Math.ceil(count / pageSize).toString());
    return c.json(CategorySchema.array().parse(data));
  },
);

categories.patch(
  "/:id",
  authPrivate,
  adminOnly,
  zValidator("json", CategoryUpdateInputSchema),
  zValidator("param", z.object({ id: z.string().uuid() })),
  async (c) => {
    const p = withPrisma(c);
    const baseQuery = { id: c.req.valid("param").id };
    const data = await p.content.findFirst({
      where: baseQuery,
    });
    if (!data) {
      throw new DbConstraintException({ message: "Not found" });
    }
    const content = await p.category.update({
      where: baseQuery,
      data: c.req.valid("json"),
    });
    return c.json(CategorySchema.parse(content), 204);
  },
);

export default categories;
