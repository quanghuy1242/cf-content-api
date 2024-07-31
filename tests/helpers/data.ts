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
    emailAddress: user.emailAddress || "quanghuy@dev.com",
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
    title: content.title || "Content title",
    slug: content.slug || "content-title",
    content: content.content || "This contains a long text",
    coverImage: content.coverImage || "https://abc.com/abc.png",
    // @ts-expect-error json is ok
    tags: content.tags || ["abc", "def"],
    // @ts-expect-error json is ok
    meta: content.meta || {
      twitterCard: "abc",
    },
    status: content.title || "ACTIVE",
    userId: content.title || userId,
    categoryId: content.title || cateId,
  };
};
