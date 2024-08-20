import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import {
  CategoryUncheckedCreateInputSchema,
  UserCreateInputSchema,
  ContentUncheckedCreateInputSchema,
  ImageUncheckedCreateInputSchema,
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

export const createImage = (
  image: Partial<z.infer<typeof ImageUncheckedCreateInputSchema>>,
  userId: string,
): z.infer<typeof ImageUncheckedCreateInputSchema> => {
  return {
    description: image.description || "",
    contentType: image.contentType || "image/png",
    size: image.size || 2000,
    // @ts-expect-error json is ok
    tags: image.tags || ["tag1", "tag2"],
    userId: image.userId || userId,
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
    content:
      content.content ||
      JSON.stringify({
        editorState: {
          root: {
            children: [],
          },
        },
      }),
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
      tags: "abc,def,123",
      meta: JSON.stringify({
        twitterCard: "abc",
      }),
    }),
  });
  const content1Inactive = await p.content.create({
    data: createContent(userA.id, category.id, {
      status: "INACTIVE",
      tags: "abc,def,123",
      meta: JSON.stringify({
        twitterCard: "abc",
      }),
    }),
  });
  const content2Active = await p.content.create({
    data: createContent(userB.id, category.id, {
      tags: "abc,123,456",
      meta: JSON.stringify({
        twitterCard: "abc",
      }),
    }),
  });
  const content2Inactive = await p.content.create({
    data: createContent(userB.id, category.id, {
      status: "INACTIVE",
      tags: "abc,ghi,123",
      meta: JSON.stringify({
        twitterCard: "abc",
      }),
    }),
  });
  const image1 = await p.image.create({
    data: {
      ...createImage(
        {
          tags: "tag1,tag2",
        },
        userA.id,
      ),
      previewPath: "",
      fullPath: "",
      status: "ACTIVE",
    },
  });
  const image2 = await p.image.create({
    data: {
      ...createImage(
        {
          tags: "tag1,tag2",
        },
        userA.id,
      ),
      previewPath: "",
      fullPath: "",
      status: "ACTIVE",
    },
  });
  const image3 = await p.image.create({
    data: {
      ...createImage(
        {
          tags: "tag1,tag2",
        },
        userB.id,
      ),
      previewPath: "",
      fullPath: "",
      status: "ACTIVE",
    },
  });
  return {
    userA,
    userB,
    category,
    content1Active,
    content1Inactive,
    content2Active,
    content2Inactive,
    image1,
    image2,
    image3,
  };
};
