import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { authPrivate } from "middlewares/auth";
import { StatusEnum } from "schema/content";
import {
  ImageUncheckedCreateInputSchema,
  ImageUncheckedUpdateInputSchema,
} from "schema/generated/zod";
import { z } from "zod";

const images = new Hono<HonoApp>().basePath("/images");

images.get(
  "",
  authPrivate,
  zValidator(
    "param",
    z.object({
      id: z.string().uuid({ message: "Content ID must be in UUID format" }),
    }),
  ),
  (c) => {
    return c.json({ m: "Ok" });
  },
);

images.post(
  "",
  authPrivate,
  zValidator("json", ImageUncheckedCreateInputSchema),
  async (c) => {
    return c.json({ m: "Ok" });
  },
);

images.get(
  "",
  authPrivate,
  zValidator(
    "query",
    z.object({
      description: z.string().optional(),
      status: StatusEnum.optional(),
      tag: z
        .union([
          z
            .string()
            .array()
            .transform((strs) => new Set(strs)),
          z.string().transform((str) => new Set(str)),
        ])
        .optional(),
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
    return c.json({ m: "Ok" });
  },
);

images.patch(
  "",
  authPrivate,
  zValidator(
    "json",
    ImageUncheckedUpdateInputSchema.refine(
      (v) =>
        // Since I can't change generated validation, so there's some restriction
        v.contentType === null ||
        v.contentType === undefined ||
        v.size === null ||
        v.size === undefined,
      () => ({
        message: `You can't change size or contentType of a recorded image.`,
      }),
    ),
  ),
  async (c) => {
    return c.json({ m: "Ok" });
  },
);

export default images;
