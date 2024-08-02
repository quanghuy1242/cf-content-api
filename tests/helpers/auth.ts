import { ContentPermission, M2M_TOKEN_TYPE } from "const";
import { randomUUID } from "crypto";
import { AlgorithmTypes } from "hono/utils/jwt/jwa";
import {
  exportJWK,
  generateKeyPair,
  JWTPayload,
  calculateJwkThumbprint,
  SignJWT,
} from "jose";

type ITokener = {
  (
    payload?: JWTPayload,
    audience?: string,
    issuer?: string,
    sub?: string,
    expTime?: string | Date | number,
  ): Promise<string>;
};

export const authgen = async () => {
  const alg = AlgorithmTypes.ES256;

  const { publicKey, privateKey } = await generateKeyPair(alg);
  const jwk = await exportJWK(publicKey);
  const kid = await calculateJwkThumbprint(jwk);
  const jwks = { keys: [{ ...jwk, kid, use: "sig", alg }] };

  const tokener: ITokener = async (
    payload: JWTPayload = {},
    audience: string = "https://api.quanghuy.dev",
    issuer: string = "https://quanghuy1242.us.auth0.com/",
    sub: string = "2YoFQibhNG7lKkaATofzxkQHYXVfHImt@clients",
    expTime: string | Date | number = "2h",
  ) =>
    new SignJWT(payload)
      .setProtectedHeader({ alg, kid })
      .setIssuedAt()
      .setAudience(payload.aud || audience)
      .setExpirationTime(payload.exp || expTime)
      .setIssuer(payload.iss || issuer)
      .setSubject(payload.sub || sub)
      .sign(privateKey);
  return { jwks, tokener };
};

class HTokener {
  #tokener: ITokener;
  #namespace: string;
  #clientId: string;
  #headerFactory = (token: string): { Authorization: string } => {
    return { Authorization: `Bearer ${token}` };
  };

  constructor(tokener: ITokener, namespace: string, clientId: string) {
    this.#tokener = tokener;
    this.#namespace = namespace;
    this.#clientId = clientId;
  }

  async m2m() {
    return this.#headerFactory(
      await this.#tokener({
        gty: M2M_TOKEN_TYPE,
        sub: this.#clientId + "@clients",
      }),
    );
  }

  async admin(userId?: string) {
    return this.#headerFactory(
      await this.#tokener({
        gty: "openid",
        [`${this.#namespace}roles`]: ["Admin"],
        permissions: Object.values(ContentPermission),
        sub: userId || randomUUID(),
      }),
    );
  }

  async user(userId?: string, permissions?: Array<string>) {
    return this.#headerFactory(
      await this.#tokener({
        gty: "openid",
        [`${this.#namespace}roles`]: [],
        permissions: permissions || Object.values(ContentPermission),
        sub: userId || randomUUID(),
      }),
    );
  }
}

const { jwks, tokener } = await authgen();

export { jwks };

export const htokener = new HTokener(
  tokener,
  "api.quanghuy.dev/",
  "2YoFQibhNG7lKkaATofzxkQHYXVfHImt",
);
