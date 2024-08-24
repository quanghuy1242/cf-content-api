import { zValidator } from "@hono/zod-validator";
import { Prisma } from "@prisma/client";
import { AwsClient } from "aws4fetch";
import { ImagePermission, X_PAGE_COUNT_KEY, X_RECORD_COUNT_KEY } from "const";
import { AuthException, DbConstraintException } from "exceptions";
import { Context, Hono } from "hono";
import { env } from "hono/adapter";
import { authPrivate } from "middlewares/auth";
import { restrict } from "middlewares/permission";
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
const BASE_CF_IMAGE_URL = `https://${processEnv.BUCKET_NAME}.${processEnv.ACCOUNT_ID}.r2.cloudflarestorage.com`;

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
  restrict([ImagePermission.upload]),
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
        previewPath: `/${input.userId}/${now}/${imageId}/image.webp`,
      },
    });

    // Request presigned url for uploading
    const ttl = 5 * 60;
    const signed = await r2.sign(`${BASE_CF_IMAGE_URL}${data.fullPath}`, {
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
    });

    return c.json(
      {
        uploadUrl: signed.url,
        image: ImageSchema.parse(data),
      },
      201,
    );
  },
);

images.post(
  "/:id/validate",
  authPrivate,
  restrict([ImagePermission.upload]),
  zValidator("param", z.object({ id: z.string().uuid() })),
  async (c) => {
    // Fetch the image db
    const p = withPrisma(c);
    const image = await p.image.findFirst({
      where: {
        id: c.req.valid("param").id,
        ...withAuthQuery(c),
      },
    });
    if (!image || image.status !== "PENDING") {
      throw new DbConstraintException({ message: "Invalid params" });
    }

    const { IMAGE }: Env = env(c as Context);

    // If the db record is there, request for the preview webp
    const imageResponse = await r2.fetch(
      `${BASE_CF_IMAGE_URL}${image.fullPath}`,
      {
        method: "GET",
        cf: {
          image: {
            fit: "scale-down",
            height: 200,
            format: "webp",
            quality: 50,
          },
        },
      },
    );

    // If the image is still not there
    if (!imageResponse.ok) {
      // If there's something that holding users for uploading
      // Then that image will become stale and need a new uploading
      if (new Date().getSeconds() - image.created.getSeconds() >= 3600) {
        await p.image.update({
          where: { id: image.id },
          data: { status: "INACTIVE" },
        });
        throw new DbConstraintException({
          message: "Your creation has been expired, please upload a new one!",
        });
      }

      // But if it's too soon, then just wait
      return c.json(
        { message: "The image is being processed, please wait!" },
        200,
      );
    }

    // If there is an image, then populate the preview
    await IMAGE.put(image.previewPath, imageResponse.body);
    await p.image.update({
      where: { id: image.id },
      data: { status: "ACTIVE" },
    });
    return c.json({ message: "Ok" });
  },
);

images.get(
  "/:id/:mode",
  authPrivate,
  zValidator(
    "param",
    z.object({ id: z.string().uuid(), mode: z.enum(["view", "preview"]) }),
  ),
  async (c) => {
    const { id, mode } = c.req.valid("param");

    // Fetch the image db
    const p = withPrisma(c);
    const image = await p.image.findFirst({
      where: { id: id, ...withAuthQuery(c) },
    });
    if (!image || image.status !== "ACTIVE") {
      throw new DbConstraintException({ message: "Not found" });
    }

    const path: { [key in typeof mode]: string } = {
      view: image.fullPath,
      preview: image.previewPath,
    };
    const imageKey = `${BASE_CF_IMAGE_URL}${path[mode]}`;

    const { R2PU }: Env = env(c as Context);
    let cacheKey = await R2PU.get(imageKey);

    if (!cacheKey) {
      const ttlMap = {
        view: 10 * 60, // Just in 10 minutes
        preview: 5 * 60 * 60, // Previews are using wide range, 5h
      };
      const ttl = ttlMap[mode];
      const signed = await r2.sign(imageKey, {
        method: "GET",
        aws: { signQuery: true, allHeaders: true },
        headers: {
          "X-Amz-Expires": ttl.toString(),
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Headers": "Content-Type, Content-Length",
        },
      });
      await R2PU.put(imageKey, signed.url, { expirationTtl: ttl - 5 });
      cacheKey = signed.url;
    }

    return c.redirect(cacheKey);
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
