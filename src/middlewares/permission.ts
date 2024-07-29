import { AuthForbidException } from "exceptions";
import { Context } from "hono";
import { env } from "hono/adapter";
import { createMiddleware } from "hono/factory";
import { isValidM2m } from "utils/auth";

export const adminOnly = createMiddleware(
  async (c: Context<HonoApp, string, object>, next) => {
    const { ENVIRONMENT, AUTH0_NAMESPACE, AUTH0_CLIENT_ID, AUTH0_AUDIENCE } =
      env(c) as unknown as Env;
    if (ENVIRONMENT == "dev") {
      await next();
      return;
    }

    const { payload } = c.get("user");

    if (isValidM2m(payload, AUTH0_CLIENT_ID, AUTH0_AUDIENCE)) {
      await next();
      return;
    }

    const roles = payload[`${AUTH0_NAMESPACE}roles`] as string[];
    if (!roles.includes("Admin")) {
      throw new AuthForbidException({ message: "Missing permission!" });
    }
    await next();
  },
);

export const restrict = (permissions: string[]) => {
  return createMiddleware(async (c: Context<HonoApp, string, object>, next) => {
    const { ENVIRONMENT, AUTH0_CLIENT_ID, AUTH0_AUDIENCE } = env(
      c,
    ) as unknown as Env;
    if (ENVIRONMENT == "dev") {
      await next();
      return;
    }

    const { payload } = c.get("user");

    if (isValidM2m(payload, AUTH0_CLIENT_ID, AUTH0_AUDIENCE)) {
      await next();
      return;
    }

    const givenPermissions = payload["permissions"] as string[];
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
  const { ENVIRONMENT, AUTH0_CLIENT_ID, AUTH0_AUDIENCE } = env(
    c,
  ) as unknown as Env;
  if (ENVIRONMENT == "dev") {
    return;
  }
  const { payload } = c.get("user");

  if (isValidM2m(payload, AUTH0_CLIENT_ID, AUTH0_AUDIENCE)) {
    return;
  }

  const givenPermissions = payload["permissions"] as string[];
  if (value === "ACTIVE" && !givenPermissions.includes(validPermission)) {
    throw new AuthForbidException({
      message: "You don't have permission to perform this action!",
    });
  }
};
