import { zValidator } from "@hono/zod-validator";
import { DbConstraintException } from "exceptions";
import { Hono } from "hono";
import { auth } from "middlewares/auth";
import { adminOnly } from "middlewares/permission";
import {
  UserSchema,
  UserUncheckedCreateInputSchema,
} from "schema/generated/zod";
import { withPrisma } from "services/prisma";
import { z } from "zod";

const users = new Hono<HonoApp>().basePath("/users");

users.use(auth);
users.use(adminOnly);

users.get(
  "/:id",
  zValidator(
    "param",
    z.object({
      id: z.string(),
    }),
  ),
  async (c) => {
    const content = await withPrisma(c).user.findFirst({
      where: {
        id: c.req.valid("param").id,
      },
    });
    if (!content) {
      throw new DbConstraintException({ message: "Not found" });
    }
    return c.json(UserSchema.parse(content));
  },
);

users.post(
  "",
  zValidator("json", UserUncheckedCreateInputSchema),
  async (c) => {
    const input = c.req.valid("json");
    const data = await withPrisma(c).user.create({ data: input });
    return c.json(UserSchema.parse(data), 201);
  },
);

export default users;
