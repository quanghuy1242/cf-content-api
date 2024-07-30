import { AlgorithmTypes } from "hono/utils/jwt/jwa";
import {
  exportJWK,
  generateKeyPair,
  JWTPayload,
  calculateJwkThumbprint,
  SignJWT,
} from "jose";

export const authgen = async () => {
  const alg = AlgorithmTypes.ES256;

  const { publicKey, privateKey } = await generateKeyPair(alg);
  const jwk = await exportJWK(publicKey);
  const kid = await calculateJwkThumbprint(jwk);
  const jwks = { keys: [{ ...jwk, kid, use: "sig", alg }] };

  const tokener = async (
    payload: JWTPayload = {},
    audience: string = "https://api.quanghuy.dev",
    issuer: string = "https://quanghuy1242.us.auth0.com/",
    sub: string = "2YoFQibhNG7lKkaATofzxkQHYXVfHImt@clients",
    expTime: string | Date | number = "2h",
  ) =>
    new SignJWT(payload)
      .setProtectedHeader({ alg, kid })
      .setIssuedAt()
      .setAudience(audience)
      .setExpirationTime(expTime)
      .setIssuer(issuer)
      .setSubject(sub)
      .sign(privateKey);
  return { jwks, tokener };
};

const { jwks, tokener } = await authgen();

export { jwks, tokener };
