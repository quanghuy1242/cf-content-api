import { AUTH_HEADER_KEY, AUTH_TYPE, USER_KEY } from "const";
import { AuthException, AuthForbidException } from "exceptions";
import { Context } from "hono";
import { env } from "hono/adapter";
import { createMiddleware } from "hono/factory";
import { createLocalJWKSet, jwtVerify } from "jose";

const MISSING_AUTH_HEADER_TEXT: string = "Missing authentication header";
const UNSUPPORTED_AUTH_TYPE: string = "Unsupported authentication type";

function extractToken(authHeader: string | undefined): string {
  if (!authHeader) {
    throw new AuthException({ message: MISSING_AUTH_HEADER_TEXT });
  }
  const [type, token] = authHeader.split(" ");
  if (type != AUTH_TYPE) {
    throw new AuthException({ message: UNSUPPORTED_AUTH_TYPE });
  }
  return token;
}

async function createRemoteJWKSet(ctx: Context, issuer: string) {
  // Something needs to prepare
  const cacheUrl = new URL(`${issuer}.well-known/jwks.json`);
  const cache = caches.default;
  const cacheKey = new Request(cacheUrl.toString());

  let resp = await cache.match(cacheKey);
  if (!resp) {
    console.info("Fetching jwk...");
    resp = await fetch(cacheUrl);
    resp = new Response(resp.body, resp);
    resp.headers.append("Cache-Control", "s-maxage=86400");
    ctx.executionCtx.waitUntil(cache.put(cacheKey, resp.clone()));
  }
  return createLocalJWKSet(await resp.json());
}

export const auth = createMiddleware(async (c: Context, next) => {
  const { AUTH0_AUDIENCE, AUTH0_ISSUER, ENVIRONMENT }: Env = env(c);

  if (ENVIRONMENT == "dev") {
    await next();
    return;
  }

  const authHeader = c.req.header(AUTH_HEADER_KEY);
  const token = extractToken(authHeader);

  const JWKS = await createRemoteJWKSet(c, AUTH0_ISSUER);
  const { payload, protectedHeader } = await jwtVerify(token, JWKS, {
    issuer: AUTH0_ISSUER,
    audience: AUTH0_AUDIENCE,
  });
  (c as Context<HonoApp, any, {}>).set("user", { payload, protectedHeader });
  await next();
});

export const adminOnly = createMiddleware(
  async (c: Context<HonoApp, any, {}>, next) => {
    const { ENVIRONMENT, AUTH0_NAMESPACE } = env(c) as unknown as Env;
    if (ENVIRONMENT == "dev") {
      await next();
      return;
    }

    const { payload } = c.get("user");
    const roles = payload[`${AUTH0_NAMESPACE}roles`] as string[];
    if (!roles.includes("Admin")) {
      throw new AuthForbidException({ message: "Missing permission!" });
    }
    await next();
  },
);
