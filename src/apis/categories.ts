import { zValidator } from "@hono/zod-validator";
import { Prisma } from "@prisma/client";
import { X_PAGE_COUNT_KEY, X_RECORD_COUNT_KEY } from "const";
import { DbConstraintException } from "exceptions";
import { Context, Hono } from "hono";
import { authPrivate, authPublic } from "middlewares/auth";
import { adminOnly } from "middlewares/permission";
import { StatusEnum } from "schema/content";
import {
  CategorySchema,
  CategoryUncheckedCreateInputSchema,
  CategoryUpdateInputSchema,
} from "schema/generated/zod";
import { withPrisma } from "services/prisma";
import { isAdmin } from "utils/auth";
import { filterPagination, paginationQuery } from "utils/filter";
import { z } from "zod";

const categories = new Hono<HonoApp>().basePath("/categories");

categories.get(
  "/:id",
  authPublic,
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
        ...withAuthQuery(c),
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
  authPublic,
  zValidator(
    "query",
    z
      .object({
        name: z.string().optional(),
        status: StatusEnum.optional(),
      })
      .merge(paginationQuery),
  ),
  async (c) => {
    const { name, status, page, pageSize } = c.req.valid("query");
    const p = withPrisma(c);
    const baseQuery: Prisma.CategoryWhereInput = {
      ...(name ? { name: { contains: name } } : {}),
      ...(status ? { status } : { status: "ACTIVE" }),
      ...withAuthQuery(c),
    };
    const count = await p.category.count({ where: baseQuery });
    const data = await p.category.findMany({
      where: baseQuery,
      orderBy: {
        modified: "desc",
      },
      ...filterPagination({ page, pageSize }),
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
    return c.json(CategorySchema.parse(content), 200);
  },
);

const withAuthQuery = (
  c: Context<HonoApp, string, object>,
): Prisma.CategoryWhereInput => {
  let query: Prisma.CategoryWhereInput = {};
  if (isAdmin(c)) {
    return query;
  }
  query = { ...query, status: "ACTIVE" };
  return query;
};

export default categories;
