import { AUTH_HEADER_KEY, AUTH_TYPE } from "const";
import { AuthException } from "exceptions";
import { Context } from "hono";
import { env } from "hono/adapter";
import { createMiddleware } from "hono/factory";
import { createLocalJWKSet, jwtVerify } from "jose";
import { isValidM2m } from "utils/auth";

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
  const { AUTH0_AUDIENCE, AUTH0_ISSUER, ENVIRONMENT, AUTH0_CLIENT_ID }: Env =
    env(c);

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

  if (isValidM2m(payload, AUTH0_CLIENT_ID, AUTH0_AUDIENCE)) {
    await next();
    return;
  }

  (c as Context<HonoApp, string, object>).set("user", {
    payload,
    protectedHeader,
  });
  await next();
});
