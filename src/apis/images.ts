import { zValidator } from "@hono/zod-validator";
import { Prisma } from "@prisma/client";
import { AwsClient } from "aws4fetch";
import { X_PAGE_COUNT_KEY, X_RECORD_COUNT_KEY } from "const";
import { AuthException, DbConstraintException } from "exceptions";
import { Context, Hono } from "hono";
import { env } from "hono/adapter";
import { authPrivate } from "middlewares/auth";
import { randomUUID } from "node:crypto";
import { env as processEnv } from "node:process";
import { StatusEnum } from "schema/content";
import {
  ImageSchema,
  ImageUncheckedCreateInputSchema,
} from "schema/generated/zod";
import { withPrisma } from "services/prisma";
import {
  filterPagination,
  filterTag,
  paginationQuery,
  tagQuery,
} from "utils/filter";
import { z } from "zod";

const r2 = new AwsClient({
  accessKeyId: processEnv.R2_ACCESS_KEY_ID || "",
  secretAccessKey: processEnv.R2_SECRET_ACCESS_KEY || "",
});

const images = new Hono<HonoApp>().basePath("/images");

images.get(
  "/:id",
  authPrivate,
  zValidator("param", z.object({ id: z.string().uuid() })),
  async (c) => {
    const p = withPrisma(c);
    const image = await p.image.findFirst({
      where: {
        id: c.req.valid("param").id,
        ...withAuthQuery(c),
      },
    });
    if (!image) {
      throw new DbConstraintException({ message: "Not found" });
    }
    return c.json(ImageSchema.parse(image));
  },
);

images.post(
  "",
  authPrivate,
  zValidator("json", ImageUncheckedCreateInputSchema),
  async (c) => {
    const input = c.req.valid("json");
    withMutationCheck(c, input);

    const p = withPrisma(c);
    const now = new Date().toISOString().split("T")[0].replaceAll("-", "/");
    const imageId = randomUUID();
    const ext = input.contentType.split("/")[1];
    const data = await p.image.create({
      data: {
        ...input,
        id: imageId,
        status: "PENDING",
        fullPath: `/${input.userId}/${now}/${imageId}/image.${ext}`,
        previewPath: "",
      },
    });

    // Request presigned url for uploading
    const { ACCOUNT_ID, BUCKET_NAME }: Env = env(c as Context);
    const ttl = 5 * 60 * 60;
    const signed = await r2.sign(
      `https://${BUCKET_NAME}.${ACCOUNT_ID}.r2.cloudflarestorage.com${data.fullPath}`,
      {
        method: "PUT",
        aws: { signQuery: true, allHeaders: true },
        headers: {
          "X-Amz-Expires": ttl.toString(),
          "Content-Type": data.contentType,
          "Content-Length": data.size.toString(),
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Headers": "Content-Type, Content-Length",
        },
      },
    );

    return c.json(
      {
        uploadUrl: signed.url,
        image: ImageSchema.parse(data),
      },
      201,
    );
  },
);

images.get(
  "",
  authPrivate,
  zValidator(
    "query",
    z
      .object({
        description: z.string().optional(),
        status: StatusEnum.optional(),
        tag: tagQuery,
      })
      .merge(paginationQuery),
  ),
  async (c) => {
    const { tag, description, status, page, pageSize } = c.req.valid("query");
    const p = withPrisma(c);
    const baseQuery: Prisma.ImageWhereInput = {
      ...(description ? { title: { contains: description } } : {}),
      ...(status ? { status } : { status: "ACTIVE" }),
      ...filterTag(tag),
      ...withAuthQuery(c),
    };
    const count = await p.image.count({ where: baseQuery });
    const images = await p.image.findMany({
      where: baseQuery,
      orderBy: {
        modified: "desc",
      },
      ...filterPagination({ page, pageSize }),
    });
    c.header(X_RECORD_COUNT_KEY, count.toString());
    c.header(X_PAGE_COUNT_KEY, Math.ceil(count / pageSize).toString());
    return c.json(ImageSchema.array().parse(images));
  },
);

const withAuthQuery = (
  c: Context<HonoApp, string, object>,
): Prisma.ImageWhereInput => {
  const payload = c.get("user")?.payload;
  if (!payload || !payload.sub) {
    throw new AuthException({
      message: "You don't have perrmission to do this",
    });
  }
  return {
    userId: payload.sub,
  };
};

const withMutationCheck = (
  c: Context<HonoApp, string, object>,
  data: z.infer<typeof ImageUncheckedCreateInputSchema>,
) => {
  const { payload } = c.get("user");
  if (!payload || !payload.sub || payload.sub !== data.userId) {
    throw new AuthException({
      message: "You don't have perrmission to do this",
    });
  }
};

export default images;
