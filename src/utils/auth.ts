import { M2M_TOKEN_TYPE } from "const";
import { Context } from "hono";
import { env } from "hono/adapter";
import { JWTPayload } from "jose";

export const isValidM2m = (
  payload: JWTPayload,
  clientId: string,
  aud: string,
) => {
  return (
    payload.gty === M2M_TOKEN_TYPE &&
    payload.sub === `${clientId}@clients` &&
    payload.aud === aud
  );
};

export const isAdmin = (
  c: Context<HonoApp, string, object>,
  allowRole: boolean = true,
) => {
  const { ENVIRONMENT, AUTH0_NAMESPACE, AUTH0_CLIENT_ID, AUTH0_AUDIENCE } = env(
    c,
  ) as unknown as Env;
  const payload = c.get("user")?.payload;
  if (!payload) {
    return false;
  }
  let roles = (payload[`${AUTH0_NAMESPACE}roles`] as string[]) || [];
  if (payload["gty"] === M2M_TOKEN_TYPE) {
    roles = ["Admin"];
  }

  return (
    isValidM2m(payload, AUTH0_CLIENT_ID, AUTH0_AUDIENCE) ||
    ENVIRONMENT == "dev" ||
    (allowRole && !roles.includes("Admin"))
  );
};
