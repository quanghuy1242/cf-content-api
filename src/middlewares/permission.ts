import { AuthForbidException } from "exceptions";
import { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { isAdmin } from "utils/auth";

export const adminOnly = createMiddleware(
  async (c: Context<HonoApp, string, object>, next) => {
    if (!isAdmin(c)) {
      throw new AuthForbidException({ message: "Missing permission!" });
    }
    await next();
  },
);

export const restrict = (permissions: string[]) => {
  return createMiddleware(async (c: Context<HonoApp, string, object>, next) => {
    if (isAdmin(c, false)) {
      await next();
      return;
    }

    const payload = c.get("user")?.payload || { permissions: [] };
    const givenPermissions = (payload["permissions"] as string[]) || [];
    if (!givenPermissions.every((p) => permissions.includes(p))) {
      throw new AuthForbidException({
        message: "You don't have permissions to access!",
      });
    }
    await next();
  });
};

export const restrictStatusField = (
  c: Context<HonoApp, string, object>,
  value: string,
  validPermission: string,
) => {
  if (isAdmin(c, false)) {
    return;
  }

  const payload = c.get("user")?.payload || { permissions: [] };
  const givenPermissions = payload["permissions"] as string[];
  if (value === "ACTIVE" && !givenPermissions.includes(validPermission)) {
    throw new AuthForbidException({
      message: "You don't have permission to perform this action!",
    });
  }
};
