import { zValidator } from "@hono/zod-validator";
import { Prisma } from "@prisma/client";
import { X_PAGE_COUNT_KEY, X_RECORD_COUNT_KEY } from "const";
import { DbConstraintException } from "exceptions";
import { Hono } from "hono";
import { auth } from "middlewares/auth";
import { restrict, restrictStatusField } from "middlewares/permission";
import {
  ContentSchema,
  ContentUncheckedCreateInputSchema,
  ContentUpdateInputSchema,
} from "schema/generated/zod";
import { withPrisma } from "services/prisma";
import { z } from "zod";

const contents = new Hono<HonoApp>().basePath("/contents");

contents.use(auth);

contents.get(
  "/:id",
  restrict(["read:content"]),
  zValidator(
    "param",
    z.object({
      id: z.string().uuid(),
    }),
  ),
  async (c) => {
    const content = await withPrisma(c).content.findFirst({
      where: {
        id: c.req.valid("param").id,
      },
    });
    if (!content) {
      throw new DbConstraintException({ message: "Not found" });
    }
    return c.json(ContentSchema.parse(content));
  },
);

contents.post(
  "",
  restrict(["write:content"]),
  zValidator("json", ContentUncheckedCreateInputSchema),
  async (c) => {
    const input = c.req.valid("json");
    restrictStatusField(c, input.status, "publish:content");
    const data = await withPrisma(c).content.create({ data: input });
    return c.json(ContentSchema.parse(data), 201);
  },
);

contents.get(
  "",
  restrict(["read:content"]),
  zValidator(
    "query",
    z.object({
      title: z.string().optional(),
      status: z.enum(["ACTIVE", "PENDING", "INACTIVE"]).optional(),
      userId: z.string().optional(),
      categoryId: z.string().optional(),
      page: z.number().default(1),
      pageSize: z.number().max(100).default(10),
    }),
  ),
  async (c) => {
    const { title, userId, status, categoryId, page, pageSize } =
      c.req.valid("query");
    const p = withPrisma(c);
    const baseQuery: Prisma.ContentWhereInput = {
      ...(title ? { title: { contains: title } } : {}),
      ...(userId ? { userId } : {}),
      ...(status ? { status } : { status: "ACTIVE" }),
      ...(categoryId ? { categoryId } : {}),
    };
    const count = await p.content.count({ where: baseQuery });
    const data = await p.content.findMany({
      where: baseQuery,
      orderBy: {
        modified: "desc",
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
    c.header(X_RECORD_COUNT_KEY, count.toString());
    c.header(X_PAGE_COUNT_KEY, Math.ceil(count / pageSize).toString());
    return c.json(ContentSchema.array().parse(data));
  },
);

contents.patch(
  "/:id",
  restrict(["write:content"]),
  zValidator("json", ContentUpdateInputSchema),
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
    restrictStatusField(c, data.status, "publish:content");
    const content = await p.content.update({
      where: baseQuery,
      data: c.req.valid("json"),
    });
    return c.json(ContentSchema.parse(content), 204);
  },
);

export default contents;
