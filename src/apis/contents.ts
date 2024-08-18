import { zValidator } from "@hono/zod-validator";
import { Prisma, PrismaClient } from "@prisma/client";
import { ContentPermission, X_PAGE_COUNT_KEY, X_RECORD_COUNT_KEY } from "const";
import { AuthForbidException, DbConstraintException } from "exceptions";
import { Context, Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { authPrivate, authPublic } from "middlewares/auth";
import { restrict, restrictStatusField } from "middlewares/permission";
import { StatusEnum } from "schema/content";
import {
  ContentSchema,
  ContentUncheckedCreateInputSchema,
  ContentUncheckedUpdateInputSchema,
} from "schema/generated/zod";
import { withPrisma } from "services/prisma";
import { isAdmin } from "utils/auth";
import { filterTag, tagQuery } from "utils/filter";
import { z } from "zod";

const contents = new Hono<HonoApp>().basePath("/contents");

contents.get(
  "/:id",
  authPublic,
  zValidator(
    "param",
    z.object({
      id: z.string().uuid({ message: "Content ID must be in UUID format" }),
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
  authPrivate,
  restrict([ContentPermission.write]),
  zValidator("json", ContentUncheckedCreateInputSchema),
  async (c) => {
    const input = c.req.valid("json");
    withMutationCheck(c, input);
    if (!isLexicalState(input.content)) {
      throw new HTTPException(400, {
        message: "Invalid body type, please check data source!",
      });
    }
    restrictStatusField(c, input.status, ContentPermission.publish);

    const p = withPrisma(c);
    await isCategoryReady(p, input.categoryId.toString());
    const data = await p.content.create({ data: input });
    return c.json(ContentSchema.parse(data), 201);
  },
);

contents.get(
  "",
  authPublic,
  zValidator(
    "query",
    z.object({
      title: z.string().optional(),
      status: StatusEnum.optional(),
      userId: z.string().optional(),
      categoryId: z.string().optional(),
      tag: tagQuery,
      page: z.coerce.number().default(1),
      pageSize: z.coerce
        .number()
        .max(100, {
          message: "Max pageSize is limitted to 100, you can go any higher",
        })
        .default(10),
    }),
  ),
  async (c) => {
    const { title, userId, status, categoryId, tag, page, pageSize } =
      c.req.valid("query");
    const p = withPrisma(c);
    console.log(tag);
    const baseQuery: Prisma.ContentWhereInput = {
      ...(title ? { title: { contains: title } } : {}),
      ...(userId ? { userId } : {}),
      ...(status ? { status } : { status: "ACTIVE" }),
      ...(categoryId ? { categoryId } : {}),
      ...filterTag(tag),
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
  authPrivate,
  restrict([ContentPermission.write]),
  zValidator("json", ContentUncheckedUpdateInputSchema),
  zValidator("param", z.object({ id: z.string().uuid() })),
  async (c) => {
    const input = c.req.valid("json");
    const p = withPrisma(c);
    if (input.categoryId) {
      await isCategoryReady(p, input.categoryId.toString());
    }
    const baseQuery = { id: c.req.valid("param").id };
    const data = await p.content.findFirst({
      where: baseQuery,
    });
    if (!data) {
      throw new DbConstraintException({ message: "Not found" });
    }
    withMutationCheck(c, { ...data, ...input });
    restrictStatusField(c, data.status, ContentPermission.publish);
    const content = await p.content.update({
      where: baseQuery,
      data: input,
    });
    return c.json(ContentSchema.parse(content), 200);
  },
);

const withAuthQuery = (
  c: Context<HonoApp, string, object>,
): Prisma.ContentWhereInput => {
  const payload = c.get("user")?.payload || { sub: "anyone" };
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
  if (isAdmin(c) || (payload && payload.sub === data.userId)) {
    return;
  }
  throw new AuthForbidException({
    message: "You don't have permission to perform this action",
  });
};

const isCategoryReady = async (p: PrismaClient, cateId: string) => {
  const cate = await p.category.findFirst({
    where: { id: cateId },
  });
  if (!cate || cate.status !== "ACTIVE") {
    throw new DbConstraintException({
      message: "This category does not exist or isn't ready",
    });
  }
};

const isLexicalState = (data: string) => {
  try {
    const state = JSON.parse(data);
    if (!state?.editorState?.root) {
      return false;
    }
  } catch (error) {
    return false;
  }
  return true;
};

export default contents;
