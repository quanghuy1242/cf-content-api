import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import {
  CategoryUncheckedCreateInputSchema,
  UserCreateInputSchema,
  ContentUncheckedCreateInputSchema,
} from "schema/generated/zod";
import { z } from "zod";

export const createUser = (
  user: Partial<z.infer<typeof UserCreateInputSchema>> = {},
): z.infer<typeof UserCreateInputSchema> => {
  return {
    id: user.id || randomUUID(),
    name: user.name || "Huy Quang Nguyen",
    emailAddress: user.emailAddress || `quanghuy-${randomUUID()}@dev.com`,
  };
};

export const createCate = (
  cate: Partial<z.infer<typeof CategoryUncheckedCreateInputSchema>> = {},
): z.infer<typeof CategoryUncheckedCreateInputSchema> => {
  return {
    name: cate.name || "ML/AI",
    description:
      cate.description || "Merchean Learning & Artifical Inteligient",
    status: cate.status || "ACTIVE",
  };
};

export const createContent = (
  userId: string,
  cateId: string,
  content: Partial<z.infer<typeof ContentUncheckedCreateInputSchema>> = {},
): z.infer<typeof ContentUncheckedCreateInputSchema> => {
  return {
    title: content.title || "Content title" + randomUUID(),
    slug: content.slug || "content-title" + randomUUID(),
    content: content.content || "This contains a long text",
    coverImage: content.coverImage || "https://abc.com/abc.png",
    // @ts-expect-error json is ok
    tags: content.tags || ["abc", "def"],
    // @ts-expect-error json is ok
    meta: content.meta || {
      twitterCard: "abc",
    },
    status: content.status || "ACTIVE",
    userId: content.userId || userId,
    categoryId: content.categoryId || cateId,
  };
};

export const createDb = async (p: PrismaClient) => {
  const userA = await p.user.create({ data: createUser() });
  const userB = await p.user.create({ data: createUser() });
  const category = await p.category.create({ data: createCate() });
  const content1Active = await p.content.create({
    data: createContent(userA.id, category.id, {
      tags: "abc,def",
      meta: JSON.stringify({
        twitterCard: "abc",
      }),
    }),
  });
  const content1Inactive = await p.content.create({
    data: createContent(userA.id, category.id, {
      status: "INACTIVE",
      tags: "abc,def",
      meta: JSON.stringify({
        twitterCard: "abc",
      }),
    }),
  });
  const content2Active = await p.content.create({
    data: createContent(userB.id, category.id, {
      tags: "abc,def",
      meta: JSON.stringify({
        twitterCard: "abc",
      }),
    }),
  });
  const content2Inactive = await p.content.create({
    data: createContent(userB.id, category.id, {
      status: "INACTIVE",
      tags: "abc,def",
      meta: JSON.stringify({
        twitterCard: "abc",
      }),
    }),
  });
  return {
    userA,
    userB,
    category,
    content1Active,
    content1Inactive,
    content2Active,
    content2Inactive,
  };
};
