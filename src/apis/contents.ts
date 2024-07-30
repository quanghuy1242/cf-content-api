import { zValidator } from "@hono/zod-validator";
import { Prisma } from "@prisma/client";
import { ContentPermission, X_PAGE_COUNT_KEY, X_RECORD_COUNT_KEY } from "const";
import { AuthForbidException, DbConstraintException } from "exceptions";
import { Context, Hono } from "hono";
import { auth } from "middlewares/auth";
import { restrict, restrictStatusField } from "middlewares/permission";
import { StatusEnum } from "schema/content";
import {
  ContentSchema,
  ContentUncheckedCreateInputSchema,
  ContentUncheckedUpdateInputSchema,
} from "schema/generated/zod";
import { withPrisma } from "services/prisma";
import { isAdmin } from "utils/auth";
import { z } from "zod";

const contents = new Hono<HonoApp>().basePath("/contents");

contents.get(
  "/:id",
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
        ...withAuthQuery(c),
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
  auth,
  restrict([ContentPermission.write]),
  zValidator("json", ContentUncheckedCreateInputSchema),
  async (c) => {
    const input = c.req.valid("json");
    withMutationCheck(c, input);
    restrictStatusField(c, input.status, ContentPermission.publish);
    const data = await withPrisma(c).content.create({ data: input });
    return c.json(ContentSchema.parse(data), 201);
  },
);

contents.get(
  "",
  zValidator(
    "query",
    z.object({
      title: z.string().optional(),
      status: StatusEnum.optional(),
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
      ...withAuthQuery(c),
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
  auth,
  restrict([ContentPermission.write]),
  zValidator("json", ContentUncheckedUpdateInputSchema),
  zValidator("param", z.object({ id: z.string().uuid() })),
  async (c) => {
    const input = c.req.valid("json");
    withMutationCheck(c, input);

    const p = withPrisma(c);
    const baseQuery = { id: c.req.valid("param").id };
    const data = await p.content.findFirst({
      where: baseQuery,
    });
    if (!data) {
      throw new DbConstraintException({ message: "Not found" });
    }
    restrictStatusField(c, data.status, ContentPermission.publish);
    const content = await p.content.update({
      where: baseQuery,
      data: input,
    });
    return c.json(ContentSchema.parse(content), 204);
  },
);

const withAuthQuery = (
  c: Context<HonoApp, string, object>,
): Prisma.ContentWhereInput => {
  let payload = c.get("user")?.payload;
  if (!payload) {
    payload = {
      sub: "anyone",
    };
  }
  let query: Prisma.ContentWhereInput = {};
  if (isAdmin(c)) {
    return query;
  }
  query = {
    ...query,
    OR: [
      {
        AND: [
          {
            userId: payload.sub,
          },
        ],
      },
      {
        AND: [
          {
            userId: { not: payload.sub },
          },
          {
            status: "ACTIVE",
          },
        ],
      },
    ],
  };
  return query;
};

const withMutationCheck = (
  c: Context<HonoApp, string, object>,
  data:
    | z.infer<typeof ContentUncheckedCreateInputSchema>
    | z.infer<typeof ContentUncheckedUpdateInputSchema>,
): void => {
  const payload = c.get("user")?.payload;
  if (!isAdmin(c) || (payload && payload.sub == data.userId) || !payload) {
    throw new AuthForbidException({
      message: "You don't have permission to perform this action",
    });
  }
};

export default contents;
